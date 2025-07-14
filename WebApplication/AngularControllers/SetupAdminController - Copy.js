app.controller('AdminController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "";
    $scope.$parent.chkRedirctToHR = 1;

    $scope.REDIRECTION_PAGE = function (paath) {
        $location.path(paath).search('');
        $scope.$parent.urlpath = ($location.url(paath).$$path.replace('/', ''));
    };
    $scope.EditObject = null;
    if ($filter('lowercase')($location.absUrl().indexOf("Sindx")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Cust")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Rest")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Ent_Setting")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Location")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("rle_lst")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_UserList")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Branch")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("BranchCategories")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("BranchCategoriesMapping")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("IntegrationSearch")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("MM_Categories")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("IntegrationCategoryMapping")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Currency_Setup")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Currency_Conversion")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("EposSales_Categoty_Mapping")) != -1
        || $filter('lowercase')(decodeURIComponent($location.absUrl()).indexOf("Adrl?STAG=2")) != -1 && $scope.$parent.chkRedirctToHR == 0
    ) {
        if ($filter('lowercase')($location.absUrl().indexOf("Sindx"))) {
            $scope.$parent.urlpath = ''; $scope.$parent.chkRedirctToHR = 0;
        }
        $scope.$parent.PAGE_HEADER = "SETUP";
        $scope.$parent.SelectedTab = 1;
        $scope.$parent.ADMIN_SEUP_PATH_URL = [];
        $scope.$parent.ADMIN_SEUP_PATH_URL = [
            {
                Id: 1,
                Name: 'Customer',
                templateUrl: 'Setup_Cust',
                class: "far fa-users"
            }, {
                Id: 2,
                Name: 'Entity',
                templateUrl: 'Setup_Rest',
                class: "far fa-utensils-alt"
            }, {
                Id: 7,
                Name: 'Entity Setting',
                templateUrl: 'Ent_Setting',
                class: "far fa-cogs"
            }, {
                Id: 3,
                Name: 'Location',
                templateUrl: 'Setup_Location',
                class: "far fa-map-marker-alt"
            }, {
                Id: 4,
                Name: 'Branch',
                templateUrl: 'Setup_Branch',
                class: "far fa-hotel"
            }, {
                Id: 5,
                Name: 'Role',
                templateUrl: 'rle_lst',
                class: "far fa-user-tag"
            }, {
                Id: 6,
                Name: 'User',
                templateUrl: 'Setup_UserList',
                class: "far fa-user"
            }, {
                Id: 7,
                Name: 'Report Mapping',
                templateUrl: 'Report_Mapping',
                class: "far fa-thin fa-dice-d8"
            }, {
                Id: 8,
                Name: 'Branch Categories',
                templateUrl: 'BranchCategories',
                class: "fad fa-ramp-loading"
            }, {
                Id: 9,
                Name: 'Branch Categories Mapping',
                templateUrl: 'BranchCategoriesMapping',
                class: "fad fa-object-ungroup"
            }, {
                Id: 10,
                Name: 'XERO Integration',
                templateUrl: 'IntegrationSearch',
                class: "fad fa-stream"
            }, {
                Id: 11,
                Name: 'Marketman',
                templateUrl: 'MM_Categories',
                class: "fad fa-store"
            }, {
                Id: 12,
                Name: 'XERO Category Payment Mapping',
                templateUrl: 'IntegrationCategoryMapping',
                class: "fad fa-map-signs"
            }, {
                Id: 13,
                Name: 'Currency Conversion Upload',
                templateUrl: 'Currency_Conversion',
                class: "fad fa-upload"
            }
            , {
                Id: 14,
                Name: 'Currency Conversion View',
                templateUrl: 'Currency_Conversion_View',
                class: "fad fa-repeat-1"
            }, {
                Id: 15,
                Name: 'EposSales Categoty Mapping',
                templateUrl: 'EposSales_Categoty_Mapping',
                class: "fad fa-share-alt-square"
            }];

    }
    if ($filter('lowercase')($location.absUrl().indexOf("Setup_Cash")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("PDQ")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Area")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Cashup_session_mapping")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Area_Mapping")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Cashup_Tabs")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Branchstaff_Tabs")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Reasonfor_Complimentary")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("PettyCash")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("PettyCashMapping")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("SessionMappingCovers")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("ReasonforVOID")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("PKCE")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("MicrosDataUpload")) != -1
    ) {
        if ($filter('lowercase')($location.absUrl().indexOf("Setup_Cash")))
            $scope.$parent.urlpath = '';
        $scope.$parent.PAGE_HEADER = "CASHUP";
        $scope.$parent.SelectedTab = 2;
        $scope.$parent.ADMIN_SEUP_PATH_URL = [];
        $scope.$parent.ADMIN_SEUP_PATH_URL = [
            {
                Id: 1,
                Name: 'PDQ',
                templateUrl: 'PDQ',
                class: "fal fa-cash-register"
            },
            {
                Id: 2,
                Name: 'Area',
                templateUrl: 'Setup_Area',
                class: "far fa-map-marked-alt"
            },
            {
                Id: 3,
                Name: 'Session Mapping',
                templateUrl: 'Cashup_session_mapping',
                class: "far fa-map-marker-alt"
            }, {
                Id: 4,
                Name: 'Branch Area Mapping',
                templateUrl: 'Setup_Area_Mapping',
                class: "far fa-map"
            }, {
                Id: 5,
                Name: 'Cashup Tab',
                templateUrl: 'Cashup_Tabs',
                class: "far fa-indent"
            }, {
                Id: 6,
                Name: 'Branch Staff',
                templateUrl: 'Branchstaff_Tabs',
                class: "far fa-clipboard-user"
            }
            , {
                Id: 7,
                Name: 'Complimentary',
                templateUrl: 'Reasonfor_Complimentary',
                class: "far fa-cube"
            }, {
                Id: 8,
                Name: 'PettyCash',
                templateUrl: 'PettyCash',
                class: "far fa-wallet"
            }, {
                Id: 9,
                Name: 'Petty Cash Mapping',
                templateUrl: 'PettyCashMapping',
                class: "far fa-folder-tree"
            }, {
                Id: 10,
                Name: 'Session Mapping Covers',
                templateUrl: 'SessionMappingCovers',
                class: "fad fa-blanket"
            }, {
                Id: 11,
                Name: 'VOID',
                templateUrl: 'ReasonforVOID',
                class: "fad fa-tint-slash"
            }, {
                Id: 12,
                Name: 'OAuth2 Authentication',
                templateUrl: 'PKCE',
                class: "fal fa-address-card"
            }, {
                Id: 13,
                Name: 'Micros Data Upload',
                templateUrl: 'MicrosDataUpload',
                class: "fad fa-chevron-double-up"
            }];

    }
    if ($filter('lowercase')($location.absUrl().indexOf("Setup_HR")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("HR_Cost_Center")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Employee_Category")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Employee_Sub_Category")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("National_ID_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("TerminationReason")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("EmergencyContactRelationship")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Shift")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("WorkPatternList")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("PensionSch")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Contract_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("AssetType")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Payment_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Units")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Work_Permit_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Document_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Cource")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Absence_Type")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("HolidayEntitlement")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("NoticePeriod")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Probation")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Division")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Paid_By")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Paid_By_EN")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Pay_Code")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Pay_F_EN")) != -1
        || $filter('lowercase')(decodeURIComponent($location.absUrl()).indexOf("Adrl?STAG=2")) != -1 && $scope.$parent.chkRedirctToHR == 1
        || $filter('lowercase')($location.absUrl().indexOf("Grp")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Ass_Grp_lst")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Page_Header")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_Fields")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Hrdeclaration")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_NICategory")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("Setup_NoShowReason")) != -1
    ) {
        if ($filter('lowercase')($location.absUrl().indexOf("Setup_HR"))) {
            $scope.$parent.urlpath = '';
            $scope.$parent.chkRedirctToHR = 1;
        }
        $scope.$parent.PAGE_HEADER = "SETUP HR";
        $scope.$parent.SelectedTab = 3;
        $scope.$parent.ADMIN_SEUP_PATH_URL = [];
        $scope.$parent.ADMIN_SEUP_PATH_URL = [
            {
                Id: 1,
                Name: 'Cost Center',
                templateUrl: 'HR_Cost_Center',
                class: "far fa-sack-dollar"
            },
            {
                Id: 2,
                Name: 'Employee Category',
                templateUrl: 'Employee_Category',
                class: "fal fa-users-class"
            },
            {
                Id: 3,
                Name: 'Employee Sub Category',
                templateUrl: 'Employee_Sub_Category',
                class: "fal fa-poll-people"
            }, {
                Id: 4,
                Name: 'Nationality Id Type',
                templateUrl: 'National_ID_Type',
                class: "fal fa-id-card-alt"
            }, {
                Id: 5,
                Name: 'Termination Reason',
                templateUrl: 'TerminationReason',
                class: "far fa-user-slash"
            },
            {
                Id: 6,
                Name: 'Emergency Contact',
                templateUrl: 'EmergencyContactRelationship',
                class: "far fa-phone-plus"
            },
            {
                Id: 7,
                Name: 'Shift Type',
                templateUrl: 'ShiftType',
                class: "far fa-user-clock"
            },
            {
                Id: 8,
                Name: 'Shift',
                templateUrl: 'Shift',
                class: "far fa-user-headset"
            },
            {
                Id: 9,
                Name: 'Work Pattern',
                templateUrl: 'WorkPatternList',
                class: "far fa-digging"
            },
            {
                Id: 10,
                Name: 'Pension Scheme',
                templateUrl: 'PensionSch',
                class: "far fa-money-check-edit-alt"
            },
            {
                Id: 11,
                Name: 'Contract Type',
                templateUrl: 'Contract_Type',
                class: "fal fa-file-contract"
            }, {
                Id: 12,
                Name: 'Asset Type',
                templateUrl: 'AssetType',
                class: "far fa-box-usd"
            }, {
                Id: 13,
                Name: 'Payment Type',
                templateUrl: 'Payment_Type',
                class: "fal fa-credit-card"
            },
            {
                Id: 14,
                Name: 'Unit',
                templateUrl: 'Units',
                class: "fal fa-boxes-alt"
            },
            {
                Id: 15,
                Name: 'Work Permit Type',
                templateUrl: 'Work_Permit_Type',
                class: "fal fa-file-invoice"
            }, {
                Id: 16,
                Name: 'Document Type',
                templateUrl: 'Document_Type',
                class: "fal fa-file-alt"
            }, {
                Id: 17,
                Name: 'Course Name',
                templateUrl: 'Cource',
                class: "far fa-graduation-cap"
            }, {
                Id: 18,
                Name: 'Absence Type',
                templateUrl: 'Absence_Type',
                class: "fal fa-users-slash"
            },
            {
                Id: 19,
                Name: 'Leave Entitlement',
                templateUrl: 'HolidayEntitlement',
                class: "far fa-snowman"
            },
            {
                Id: 20,
                Name: 'Notice Period',
                templateUrl: 'NoticePeriod',
                class: "far fa-calendar-alt"
            }, {
                Id: 21,
                Name: 'Probation Period',
                templateUrl: 'Probation',
                class: "far fa-clipboard-list-check"
            },
            {
                Id: 22,
                Name: 'HR Declaration',
                templateUrl: 'Hrdeclaration',
                class: "far fa-clipboard-list-check"
            },
            {
                Id: 23,
                Name: 'Division',
                templateUrl: 'Division',
                class: "far fa-boxes"
            },
            {
                Id: 24,
                Name: 'Paid By',
                templateUrl: 'Paid_By',
                class: "fal fa-envelope-open-dollar"
            },
            {
                Id: 25,
                Name: 'Paid By Entity Mapping',
                templateUrl: 'Paid_By_EN',
                class: "fal fa-hand-holding-usd"
            }, {
                Id: 26,
                Name: 'Pay Code',
                templateUrl: 'Pay_Code',
                class: "fal fa-brackets"
            }, {
                Id: 27,
                Name: 'Pay Frequency Entity Mapping',
                templateUrl: 'Pay_F_EN',
                class: "fal fa-hands-usd"
            },
            {
                Id: 28,
                Name: 'Add Role',
                templateUrl: 'Adrl?STAG=2',
                class: "far fa-user-tag"
            },
            {
                Id: 29,
                Name: 'Add Group',
                templateUrl: 'Grp',
                class: "far fa-users-class"
            }, {
                Id: 30,
                Name: 'Group Role Mapping',
                templateUrl: 'Ass_Grp_lst',
                class: "far fa-users"
            },
            {
                Id: 31,
                Name: 'Setup Page Header',
                templateUrl: 'Page_Header',
                class: "far fa-h-square"
            }, {
                Id: 32,
                Name: 'Custom Field Mapping',
                templateUrl: 'Setup_Fields',
                class: "far fa-bring-front"
            }, {
                Id: 33,
                Name: 'NI Category',
                templateUrl: 'Setup_NICategory',
                class: "fas fa-shekel-sign"
            }, {
                Id: 34,
                Name: 'Show/No Show',
                templateUrl: 'Setup_NoShowReason',
                class: "fas fa-toggle-on"
            }
        ];
    }
    if ($filter('lowercase')($location.absUrl().indexOf("ReportIndex")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("EmailFallout")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("FalloutReport")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("MarkermanFalloutReport")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("CashupIntegrationFallouts")) != -1
        || $filter('lowercase')($location.absUrl().indexOf("ApicbaseFalloutReport")) != -1
    ) {

        $scope.$parent.PAGE_HEADER = "FALLOUT REPORTS";
        $scope.$parent.SelectedTab = 4;
        $scope.$parent.ADMIN_SEUP_PATH_URL = [];
        $scope.$parent.ADMIN_SEUP_PATH_URL = [
            {
                Id: 1,
                Name: 'Fallout Report',
                templateUrl: 'FalloutReport',
                class: "fad fa-ballot-check"
            },
            {
                Id: 2,
                Name: 'Markerman Fallout Reports',
                templateUrl: 'MarkermanFalloutReport',
                class: "fad fa-mail-bulk"
            },
            {
                Id: 3,
                Name: 'Email Fallouts',
                templateUrl: 'EmailFallout',
                class: "fad fa-envelope-open-text"
            },
            {
                Id: 4,
                Name: 'Cashup Integration Fallouts',
                templateUrl: 'CashupIntegrationFallouts',
                class: "fad fa-envelope-open-text"
            },
            {
                Id: 5,
                Name: 'Apicbase Fallout Reports',
                templateUrl: 'ApicbaseFalloutReport',
                class: "fad fa-mail-bulk"
            }

        ];
    };
    //if ($filter('lowercase')($location.absUrl().indexOf("Admin?")) != -1 ) {
    //    $scope.xeroCode = document.getElementById('xeroCode').value;
    //    $location.path("IntegrationMapping");
    //}

});
app.controller('CustomerController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.urlpath = 'Setup_Cust';
    $scope.$parent.PAGE_HEADER = "Customer";
    $scope.CUSTOMER_LIST = [];
    $scope.CustomerSearch = {
        CUSTOMER_NAME: '',
        CUSTOMER_CODE: '',
        LOGO_PATH: '',
        CUSTOMER_ID: '',
        UploadedFiles: [],
        URL: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: 0,
        UPL_FILE_FLAG: 1,
        BCC_USER_EMAILS: null,
        PACKAGE_SUBSCRIPTION_MAPPING_ID: null,
        NO_OF_SITES: null,
        NO_OF_USERS: null,
    };
    $scope.RESET_CUST = function () {
        //var FLAG = $scope.CustomerSearch.CLICK_SEARCH;
        $scope.CustomerSearch = {
            CUSTOMER_NAME: '',
            LOGO_PATH: '',
            CUSTOMER_ID: '',
            UploadedFiles: [],
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: -1,
            IS_LIVE: 0,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            BCC_USER_EMAILS: null,
            PACKAGE_SUBSCRIPTION_MAPPING_ID: null,
            NO_OF_SITES: null,
            NO_OF_USERS: null,
        };
        document.getElementById('logo1').value = '';
        $scope.ADMIN_GET_CUSTOMER(2);
        //if (FLAG == 1) {
        //    $scope.CUSTOMER_LIST = [];
        //    $scope.ADMIN_GET_CUSTOMER('-1');

        //}
        $scope.CCForm.submitted = false;
    };
    $scope.LAZY_ADMIN_GET_CUSTOMER = function () {
        $scope.ADMIN_GET_CUSTOMER();
    };
    $scope.ADMIN_GET_CUSTOMER = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();
        if (FLAG == 1) {
            $scope.CustomerSearch.CLICK_SEARCH = 1;
            $scope.CUSTOMER_LIST = [];
            $scope.CustomerSearch.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.CustomerSearch.ACTIVE == -1 ? -1 : $scope.CustomerSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CUSTOMER_LIST = [];
            CusModelObj.ACTIVE = $scope.CustomerSearch.ACTIVE == -1 ? -1 : $scope.CustomerSearch.ACTIVE ? 1 : 0;
            $scope.CustomerSearch.PAGE_NO = 1;

        }
        else if (FLAG == undefined) {
            if ($scope.CustomerSearch.CLICK_SEARCH == 1) {
                //CusModelObj.ACTIVE = $scope.CustomerSearch.ACTIVE ? 1 : 0;
                CusModelObj.ACTIVE = $scope.CustomerSearch.ACTIVE == -1 ? -1 : $scope.CustomerSearch.ACTIVE ? 1 : 0;
            }
            else {
                CusModelObj.ACTIVE = -1;
                //CusModelObj.IS_LIVE = -1;
            }
        }
        CusModelObj.CUSTOMER_NAME = $scope.CustomerSearch.CLICK_SEARCH == 1 ? $scope.CustomerSearch.CUSTOMER_NAME : null;
        CusModelObj.CUSTOMER_CODE = $scope.CustomerSearch.CLICK_SEARCH == 1 ? $scope.CustomerSearch.CUSTOMER_CODE : null;
        CusModelObj.IS_LIVE = -1;
        CusModelObj.PAGE_NO = $scope.CustomerSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.CustomerSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            //$scope.CUSTOMER_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.CUSTOMER_LIST = $scope.CUSTOMER_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CustomerSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CustomerSearch.PAGE_NO = parseInt($scope.CustomerSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.CUSTOMER_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_INS_UPD_CUSTOMER = function (ACTIVE) {
        $scope.CCForm.submitted = true;
        var LogCount = 0;
        if ($scope.CustomerSearch.UploadedFiles == undefined || $scope.CustomerSearch.UploadedFiles == "" || $scope.CustomerSearch.UploadedFiles.length == 0) {
            LogCount++;
        }
        else {
            $scope.CustomerSearch.LOGO_PATH = $scope.CustomerSearch.UploadedFiles[0].FILE_PATH + $scope.CustomerSearch.UploadedFiles[0].SERVER_FILE_NAME;
        }
        if ($scope.CCForm.$valid && LogCount == 0) {
            if ($scope.CustomerSearch.ACTIVE != -1) {
                if ($scope.CustomerSearch.ACTIVE == false && $scope.CustomerSearch.IS_LIVE == true) {
                    $scope.$parent.ShowAlert('Error', 'Inactive Customer Can\'t Be Live. ', 3000);
                }
                else {
                    var CusModelObj = new Object();
                    CusModelObj.CUSTOMER_ID = $scope.CustomerSearch.CUSTOMER_ID;
                    CusModelObj.CUSTOMER_NAME = $scope.CustomerSearch.CUSTOMER_NAME;
                    CusModelObj.LOGO_PATH = $scope.CustomerSearch.LOGO_PATH;
                    CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    CusModelObj.ACTIVE = $scope.CustomerSearch.ACTIVE ? 1 : 0;
                    //   CusModelObj.IS_LIVE = $scope.CustomerSearch.IS_LIVE ? 1 : 0;
                    CusModelObj.COMMENTS = '';
                    CusModelObj.BCC_USER_EMAILS = $scope.CustomerSearch.BCC_USER_EMAILS;
                    CusModelObj.PACKAGE_SUBSCRIPTION_MAPPING_ID = $scope.CustomerSearch.PACKAGE_SUBSCRIPTION_MAPPING_ID;
                    CusModelObj.NO_OF_SITES = $scope.CustomerSearch.NO_OF_SITES;
                    CusModelObj.NO_OF_USERS = $scope.CustomerSearch.NO_OF_USERS;
                    PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_INS_UPD_CUSTOMER').then(function (data) {
                        //if (data.data > 0) {
                        if ($scope.CustomerSearch.CUSTOMER_ID > 0) {
                            $scope.$parent.ShowAlert('Success', 'Customer Updated Successfully', 3000);
                        }
                        else {
                            $scope.$parent.ShowAlert('Success', 'Customer Added Successfully', 3000);
                        }
                        $scope.RESET_CUST();
                        //$scope.ADMIN_GET_CUSTOMER();
                        //}
                    });
                }
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); }
        }
    };
    $scope.EDIT_CUSTOMER_BY_ID = function (CUS) {
        $scope.CustomerSearch.UploadedFiles = [];
        $scope.CustomerSearch = angular.copy(CUS);
        $scope.CustomerSearch.UPL_FILE_FLAG = 1;
        $scope.CustomerSearch.ACTIVE = CUS.ACTIVE ? 1 : 0;
        $scope.CustomerSearch.BCC_USER_EMAILS = CUS.BCC_USERS;
        $scope.CustomerSearch.NO_OF_SITES = CUS.NO_OF_SITES;
        $scope.CustomerSearch.NO_OF_USERS = CUS.NO_OF_USERS;
        $scope.CustomerSearch.PACKAGE_SUBSCRIPTION_MAPPING_ID = CUS.PACKAGE_SUBSCRIPTION_MAPPING_ID;


        if (CUS.LOGO_PATH != '') {
            var PATH = CUS.LOGO_PATH.split("/");
            var last = PATH[PATH.length - 1];
            //angular.forEach(PATH, function () {
            //})
            var URL = CUS.LOGO_PATH;
            for (var i = 0; i < PATH.length; i++) {
                var NA = last;
                URL = URL.replace(NA, '');
            }
            // $scope.REDIRECTION_PATH = URL;
            var GETL = new Object();
            GETL.FILE_PATH = URL;
            GETL.SERVER_FILE_NAME = last;
            GETL.ORIGINAL_FILE_NAME = last;
            if ($scope.CustomerSearch.UploadedFiles == undefined) {
                $scope.CustomerSearch.UploadedFiles = [];
            }
            $scope.CustomerSearch.UploadedFiles.push(GETL);
        }

    };
    $scope.DELETE_CUSTOMER_BY_ID = function (CUS) {
        if (confirm('This will de-activate the customer and the users will not be able to login. Are you sure you want to proceed?')) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = CUS.CUSTOMER_ID;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.COMMENTS = "Comment";
            CusModelObj.ACTIVE = 2;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_INS_UPD_CUSTOMER').then(function (data) {
                $scope.$parent.ShowAlert('Success', 'Customer Inactive Successfully', 3000);
                $scope.RESET_CUST();
                $scope.ADMIN_GET_CUSTOMER();
            });
        }
    };

});
app.controller('EntityController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.COMMON_CODE_CHANGE();
    if (getUrlParameter('STAG', $location.absUrl()) == undefined) {
        $scope.$parent.PAGE_HEADER = "Entity List";
    }
    if (getUrlParameter('STAG', $location.absUrl()) == 2) {
        $scope.$parent.PAGE_HEADER = "Create Entity";
    }
    $scope.$parent.urlpath = 'Setup_Rest';
    var EDIT_MODE = getUrlParameter('e', $location.absUrl());
    EDIT_MODE == undefined ? EDIT_MODE = 0 : '';
    $scope.ENTITIES_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.TIME_ZONE_NAME = [];
    $scope.FINANCIAL_YEAR_START_MONTH_LIST = [
        { ID: 1, Text: 'January' },
        { ID: 2, Text: 'February' },
        { ID: 3, Text: 'March' },
        { ID: 4, Text: 'April' },
        { ID: 5, Text: 'May' },
        { ID: 6, Text: 'June' },
        { ID: 7, Text: 'July' },
        { ID: 8, Text: 'August' },
        { ID: 9, Text: 'September' },
        { ID: 10, Text: 'October' },
        { ID: 11, Text: 'November' },
        { ID: 12, Text: 'December' }
    ];
    $scope.EntitySearch = {
        ENTITY_NAME: '',
        ENTITY_CODE: '',
        ADDRESS_1: '',
        ADDRESS_1: '',
        ADDRESS_1: '',
        ADDRESS_2: '',
        CITY_NAME: '',
        STATE_ID: null,
        COUNTRY_ID: null,
        ZIPCODE: '',
        CURRENCY_ID: null,
        CONTACT_NAME: '',
        CONTACT_NUMBER: '',
        CONTACT_EMAIL: '',
        LIMITED_COMPANY_NAME: '',
        COMPANY_REGISTRATION_NO: '',
        LOGO_PATH: '',
        CUSTOMER_ID: 0,
        URL: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        CLICK_SEARCH: 0,
        UPL_FILE_FLAG: 1,
        UploadedFiles: [],
        IS_LIVE: 0, TIME_ZONE_NAME: null,
        COPY_CUSTOMER_ID: null,
        NEW_ENTITY_NAME: null,
        COPY_COMMENTS: null,
        CONTROL_ENABLE_DISABLE_FLAG: false,
        PR_NO_PREFIX: null,
        PR_NO_SUFFIX: null,
        REQ_NO_PREFIX: null,
        REQ_NO_SUFFIX: null,
        PO_NO_PREFIX: null,
        PO_NO_SUFFIX: null,
    };
    $scope.RESET_ENT = function () {
        var FLAG = $scope.EntitySearch.CLICK_SEARCH;
        $scope.EntitySearch = {
            ENTITY_NAME: '',
            ENTITY_CODE: '',
            ADDRESS_1: '',
            ADDRESS_1: '',
            ADDRESS_1: '',
            ADDRESS_2: '',
            CITY_NAME: '',
            STATE_ID: null,
            COUNTRY_ID: null,
            ZIPCODE: '',
            CURRENCY_ID: null,
            CONTACT_NAME: '',
            CONTACT_NUMBER: '',
            CONTACT_EMAIL: '',
            LIMITED_COMPANY_NAME: '',
            COMPANY_REGISTRATION_NO: '',
            LOGO_PATH: '',
            CUSTOMER_ID: 0,
            URL: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            UploadedFiles: [], CONTROL_ENABLE_DISABLE_FLAG: false
        };
        $scope.ENTITIES_LIST = [];
        document.getElementById('logo1').value = '';
        //if (FLAG == 1) {
        //    $scope.ADMIN_GET_ENTITIES('-1');
        //}
        $scope.ADMIN_GET_ENTITIES(2);
        $scope.EntForm.submitted = false;
        $scope.STATES = [];
        angular.forEach($scope.AdminModuleList, function (item) {
            item.FLAG = false;
            item.IN_APP = false;
            item.MODULE_URL = '';
        });
    };
    $scope.CHECK_CHANGE = function (MOD) {

        if (MOD.FLAG == true) {
            MOD.MODULE_URL = MOD.REDIRECT_PATH;
        }
        if (MOD.FLAG == true && MOD.IN_APP == true) {
            MOD.MODULE_URL = MOD.INTERNAL_REDIRECTION_PATH;
        }
        else {
            MOD.MODULE_URL = MOD.SUBSCRIBE_PATH;
            MOD.IN_APP = false;
            MOD.EMAIL_LIVE = false;
        }
        // !MOD.FLAG ? MOD.IN_APP = false : '';
        //MOD.MODULE_URL = !MOD.FLAG ? MOD.SUBSCRIBE_PATH : (!MOD.IN_APP ? MOD.REDIRECT_PATH : MOD.INTERNAL_REDIRECTION_PATH);
    };
    $scope.Initialize_Entity_ModuleList = function (MOD) {
        MOD.MODULE_URL = MOD.FLAG == 0 ? MOD.SUBSCRIBE_PATH : (MOD.IN_APP == 0 ? MOD.REDIRECT_PATH : MOD.INTERNAL_REDIRECTION_PATH);
        MOD.IN_APP = MOD.IN_APP == 1;
    };
    $scope.ADMIN_GET_ENTITY_MODULES = function (ENTITY_ID) {
        var UserModelObj = new Object();
        UserModelObj.ENTITY_ID = ENTITY_ID;
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/GET_ENTITY_MODULES',
            data: UserModelObj
        }).then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                $scope.AdminModuleList = data.data.Table;
            }
        });
    }

    $scope.LAZY_ADMIN_GET_ENTITIES = function () {
        $scope.ADMIN_GET_ENTITIES();
    };
    $scope.ADMIN_GET_ENTITIES = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();

        if (FLAG == 1) {
            $scope.EntitySearch.CLICK_SEARCH = 1;
            $scope.ENTITIES_LIST = [];
            $scope.EntitySearch.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.EntitySearch.ACTIVE == -1 ? -1 : $scope.EntitySearch.ACTIVE ? 1 : 0;

        }
        else if (FLAG == 2) {
            $scope.ENTITIES_LIST = [];
            CusModelObj.ACTIVE = $scope.EntitySearch.ACTIVE == -1 ? -1 : $scope.EntitySearch.ACTIVE ? 1 : 0;
            $scope.EntitySearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.EntitySearch.CLICK_SEARCH == 1) {
                CusModelObj.ACTIVE = $scope.EntitySearch.ACTIVE == -1 ? -1 : $scope.EntitySearch.ACTIVE ? 1 : 0;
            }
            else {
                CusModelObj.ACTIVE = -1;
            }
        }


        CusModelObj.CUSTOMER_ID = $scope.EntitySearch.CLICK_SEARCH == 1 ? $scope.EntitySearch.CUSTOMER_ID : null;
        CusModelObj.ENTITY_NAME = $scope.EntitySearch.CLICK_SEARCH == 1 ? $scope.EntitySearch.ENTITY_NAME : null;
        CusModelObj.ENTITY_CODE = $scope.EntitySearch.CLICK_SEARCH == 1 ? $scope.EntitySearch.ENTITY_CODE : null;
        //CusModelObj.ACTIVE = -1;
        CusModelObj.PAGE_NO = $scope.EntitySearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.EntitySearch.PAGE_SIZE;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITIES_LIST = $scope.ENTITIES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.EntitySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.EntitySearch.PAGE_NO = parseInt($scope.EntitySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.ENTITIES_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = "";
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_ENTITIES();
    $scope.GET_COUNTRY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            $scope.COUNTRY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY();
    $scope.GET_COUNTRY();
    $scope.GET_STATES = function () {
        var CusModelObj = new Object();
        CusModelObj.COUNTRY_ID = $scope.EntitySearch.COUNTRY_ID;
        PrcCommMethods.HR_API(CusModelObj, 'GET_STATES').then(function (data) {
            $scope.STATES = data.data.Table;
        });
    };

    $scope.ADMIN_INS_UPD_ENTITIES = function (ACTIVE) {
        $scope.EntForm.submitted = true;
        var Selected_Module = [];
        angular.forEach($scope.AdminModuleList, function (item) {
            var obj = new Object();
            obj.TABLE_ID = item.TABLE_ID;
            obj.MODULE_ID = item.MODULE_ID;
            obj.FLAG = item.FLAG ? 1 : 0;
            obj.ACTIVE = 1;
            obj.REDIRECT_PATH = item.MODULE_URL;
            obj.SORT_ORDER = item.SORT_ORDER;
            obj.IN_APP = item.IN_APP ? 1 : 0;
            obj.EMAIL_LIVE = item.EMAIL_LIVE ? 1 : 0;
            Selected_Module.push(obj);
        });

        var LogCount = 0;
        if ($scope.EntitySearch.UploadedFiles == undefined || $scope.EntitySearch.UploadedFiles == "" || $scope.EntitySearch.UploadedFiles.length == 0) {
            LogCount++;
        }
        else {
            $scope.EntitySearch.LOGO_PATH = $scope.EntitySearch.UploadedFiles[0].FILE_PATH + $scope.EntitySearch.UploadedFiles[0].SERVER_FILE_NAME;
        }
        if ($scope.EntForm.$valid) {
            if ($scope.EntitySearch.ACTIVE == false && $scope.EntitySearch.IS_LIVE == true) {
                $scope.$parent.ShowAlert('Error', 'Inactive Entity Can\'t Be Live. ', 3000);
            }
            else if ($scope.EntitySearch.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX == 0 || $scope.EntitySearch.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX == 0 || $scope.EntitySearch.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX == 0) {
                LogCount + 1;
                $scope.$parent.ShowAlert('Attention', 'Only a zero or blank not allowed in PR/REQ/PO Number Min Length.', 3000)
            }
            else if ($scope.EntitySearch.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX > 10 || $scope.EntitySearch.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX > 10 || $scope.EntitySearch.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX > 10) {
                LogCount + 1;
                $scope.$parent.ShowAlert('Attention', 'Only numeric 10 or less than 10 is allowed in PR/REQ/PO Number Min Length.', 3000)
            }
            else if (LogCount > 0) { $scope.$parent.ShowAlert('Attention', 'Please upload logo.', 3000); }
            else {

                var ENTITY_MODULES = new Object();
                var EntModelObj = new Object();
                EntModelObj.CUSTOMER_ID = $scope.EntitySearch.CUSTOMER_ID;
                EntModelObj.ENTITY_ID = $scope.EntitySearch.ENTITY_ID;
                EntModelObj.ENTITY_NAME = $scope.EntitySearch.ENTITY_NAME;
                EntModelObj.ADDRESS_1 = $scope.EntitySearch.ADDRESS_1;
                EntModelObj.ADDRESS_2 = $scope.EntitySearch.ADDRESS_2;
                EntModelObj.CITY_NAME = $scope.EntitySearch.CITY_NAME;
                EntModelObj.STATE_ID = $scope.EntitySearch.STATE_ID;
                EntModelObj.COUNTRY_ID = $scope.EntitySearch.COUNTRY_ID;
                EntModelObj.ZIPCODE = $scope.EntitySearch.ZIPCODE;
                EntModelObj.CURRENCY_ID = $scope.EntitySearch.CURRENCY_ID;
                EntModelObj.CONTACT_NAME = $scope.EntitySearch.CONTACT_NAME;
                EntModelObj.CONTACT_NUMBER = $scope.EntitySearch.CONTACT_NUMBER;
                EntModelObj.CONTACT_EMAIL = $scope.EntitySearch.CONTACT_EMAIL;
                EntModelObj.LIMITED_COMPANY_NAME = $scope.EntitySearch.LIMITED_COMPANY_NAME;
                EntModelObj.COMPANY_REGISTRATION_NO = $scope.EntitySearch.COMPANY_REGISTRATION_NO;
                EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
                EntModelObj.ACTIVE = $scope.EntitySearch.ACTIVE == -1 ? 0 : $scope.EntitySearch.ACTIVE == true ? 1 : 0;
                EntModelObj.ENTITY_MODULES = Selected_Module;
                EntModelObj.COMMENTS = $scope.EntitySearch.COMMENTS;
                EntModelObj.LOGO_PATH = $scope.EntitySearch.LOGO_PATH;
                EntModelObj.FINANCIAL_YEAR_START_MONTH = $scope.EntitySearch.FINANCIAL_YEAR_START_MONTH;
                EntModelObj.IS_LIVE = $scope.EntitySearch.IS_LIVE ? 1 : 0;
                EntModelObj.TIME_ZONE_NAME = $scope.EntitySearch.TIME_ZONE_NAME;

                EntModelObj.PR_NO_PREFIX = $scope.EntitySearch.PR_NO_PREFIX == "" ? null : $scope.EntitySearch.PR_NO_PREFIX;
                EntModelObj.PR_NO_SUFFIX = $scope.EntitySearch.PR_NO_SUFFIX == "" ? null : $scope.EntitySearch.PR_NO_SUFFIX;
                EntModelObj.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = $scope.EntitySearch.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;
                EntModelObj.REQ_NO_PREFIX = $scope.EntitySearch.REQ_NO_PREFIX == "" ? null : $scope.EntitySearch.REQ_NO_PREFIX;
                EntModelObj.REQ_NO_SUFFIX = $scope.EntitySearch.REQ_NO_SUFFIX == "" ? null : $scope.EntitySearch.REQ_NO_SUFFIX;
                EntModelObj.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = $scope.EntitySearch.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;
                EntModelObj.PO_NO_PREFIX = $scope.EntitySearch.PO_NO_PREFIX == "" ? null : $scope.EntitySearch.PO_NO_PREFIX;
                EntModelObj.PO_NO_SUFFIX = $scope.EntitySearch.PO_NO_SUFFIX == "" ? null : $scope.EntitySearch.PO_NO_SUFFIX;
                EntModelObj.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = $scope.EntitySearch.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;

                PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_ENTITIES').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Entity Added Successfully', 3000);
                    //$scope.RESET_ENT();
                    //$scope.ADMIN_GET_ENTITIES();
                    $location.path('Setup_Rest');
                });
            }
        }
        angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
    };
    $scope.EditEntity = function (EL) {
        $scope.$parent.EditObject = EL;
        $location.path('Setup_CreateEntity').search({ e: 1 });
    };
    $scope.EDIT_INS_UPD_ENTITIES = function () {

        if (EDIT_MODE == 1 && $scope.$parent.EditObject != null) {
            $scope.$parent.PAGE_HEADER = "Create Entity";
            $scope.EntitySearch.CONTROL_ENABLE_DISABLE_FLAG = true;
            var ENT = $scope.$parent.EditObject;
            $scope.EntitySearch.ENTITY_ID = ENT.ENTITY_ID;
            $scope.EntitySearch.ENTITY_NAME = ENT.ENTITY_NAME;
            $scope.EntitySearch.ADDRESS_1 = ENT.ADDRESS;
            $scope.EntitySearch.CITY_NAME = ENT.CITY_NAME;
            $scope.EntitySearch.COUNTRY_ID = ENT.COUNTRY_ID;
            $scope.GET_STATES();
            $scope.EntitySearch.STATE_ID = ENT.STATE_ID;
            $scope.EntitySearch.ZIPCODE = ENT.ZIPCODE;
            $scope.EntitySearch.CURRENCY_ID = ENT.CURRENCY_ID;
            $scope.EntitySearch.CONTACT_NAME = ENT.CONTACT_NAME;
            $scope.EntitySearch.CONTACT_NUMBER = ENT.CONTACT_NUMBER;
            $scope.EntitySearch.CONTACT_EMAIL = ENT.CONTACT_EMAIL;
            $scope.EntitySearch.LIMITED_COMPANY_NAME = ENT.LIMITED_COMPANY_NAME;
            $scope.EntitySearch.COMPANY_REGISTRATION_NO = ENT.COMPANY_REGISTRATION_NO;
            $scope.EntitySearch.CUSTOMER_ID = ENT.CUSTOMER_ID;
            $scope.EntitySearch.ACTIVE = ENT.ACTIVE ? true : false;
            $scope.EntitySearch.FINANCIAL_YEAR_START_MONTH = ENT.FINANCIAL_YEAR_START_MONTH;
            $scope.EntitySearch.IS_LIVE = ENT.IS_LIVE ? true : false;
            $scope.EntitySearch.TIME_ZONE_NAME = ENT.TIME_ZONE_NAME;

            $scope.EntitySearch.PR_NO_PREFIX = ENT.PR_NO_PREFIX;
            $scope.EntitySearch.PR_NO_SUFFIX = ENT.PR_NO_SUFFIX;
            $scope.EntitySearch.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = ENT.PR_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;
            $scope.EntitySearch.REQ_NO_PREFIX = ENT.REQ_NO_PREFIX;
            $scope.EntitySearch.REQ_NO_SUFFIX = ENT.REQ_NO_SUFFIX;
            $scope.EntitySearch.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = ENT.REQ_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;
            $scope.EntitySearch.PO_NO_PREFIX = ENT.PO_NO_PREFIX;
            $scope.EntitySearch.PO_NO_SUFFIX = ENT.PO_NO_SUFFIX;
            $scope.EntitySearch.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX = ENT.PO_NO_MIN_LENGTH_EXCLUDING_PREFIX_AND_SUFFIX;




            if (ENT.LOGO_PATH != '') {
                var PATH = ENT.LOGO_PATH.split("/");
                var last = PATH[PATH.length - 1];
                //angular.forEach(PATH, function () {
                //})
                var URL = ENT.LOGO_PATH;
                for (var i = 0; i < PATH.length; i++) {
                    var NA = last;
                    URL = URL.replace(NA, '');
                }
                // $scope.REDIRECTION_PATH = URL;
                var GETL = new Object();
                GETL.FILE_PATH = URL;
                GETL.SERVER_FILE_NAME = last;
                GETL.ORIGINAL_FILE_NAME = last;
                if ($scope.EntitySearch.UploadedFiles == undefined) {
                    $scope.EntitySearch.UploadedFiles = [];
                }
                $scope.EntitySearch.UploadedFiles.push(GETL);
            }
            //$scope.EntitySearch.LOGO_PATH = ENT.LOGO_PATH;
            $scope.ADMIN_GET_ENTITY_MODULES(ENT.ENTITY_ID);
        }
        else if (EDIT_MODE == 0) {
            $scope.ADMIN_GET_ENTITY_MODULES(0);
        }
        else {
            $location.path('Setup_Rest');
        }
    };
    $scope.DELETE_INS_UPD_ENTITIES = function (ENT) {
        if (confirm('Are you Sure?')) {
            var EntModelObj = new Object();
            EntModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EntModelObj.ENTITY_ID = ENT.ENTITY_ID;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.ACTIVE = 2;
            EntModelObj.ENTITY_MODULES = Selected_Module;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_ENTITIES').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Entity Deleted Successfully', 3000);
                    $scope.RESET_ENT();
                    $scope.ADMIN_GET_ENTITIES();
                }
            });
        }
    };
    $scope.ADMIN_EDIT_ENTITY_MODULE = function (index) {
        if ($scope.FLAG == true)
            $scope.IN_APP = true;
    };
    $scope.CREATE_ENTITY_CLICK = function () {
        $location.path('Setup_CreateEntity').search('STAG', 2);
    };
    $scope.GET_TIME_ZONE_DROPDOWN = function () {
        var EntModelObj = new Object();
        EntModelObj = null;
        PrcCommMethods.ADMIN_API(EntModelObj, 'GET_TIME_ZONE_DROPDOWN').then(function (data) {
            $scope.TIME_ZONE_NAME = data.data.Table;
        });

    };
    $scope.GET_TIME_ZONE_DROPDOWN();
    $scope.COPY_ENTITY_POPUP = function (ENTITYLIST) {
        $('#POP_MODAL').modal('show');
        $scope.ENTITYLIST = ENTITYLIST;
        $scope.EntitySearch.LOGO_PATH = '';
        $scope.EntitySearch.UploadedFiles = [];
    };
    $scope.ADMIN_COPY_ENTITY = function () {

        var LogCount = 0;
        if ($scope.EntitySearch.UploadedFiles == undefined || $scope.EntitySearch.UploadedFiles == "" || $scope.EntitySearch.UploadedFiles.length == 0) {
            LogCount++;
        }
        else {
            $scope.EntitySearch.LOGO_PATH = $scope.EntitySearch.UploadedFiles[0].FILE_PATH + $scope.EntitySearch.UploadedFiles[0].SERVER_FILE_NAME;
        }

        if (($scope.EntitySearch.COPY_CUSTOMER_ID != undefined && $scope.EntitySearch.COPY_CUSTOMER_ID != null) &&
            $scope.EntitySearch.NEW_ENTITY_NAME != undefined && LogCount == 0) {
            var ENTITY_MODULES = new Object();
            ENTITY_MODULES.CUSTOMER_ID = $scope.EntitySearch.COPY_CUSTOMER_ID;
            ENTITY_MODULES.COPY_FROM_ENTITY_ID = $scope.ENTITYLIST.ENTITY_ID;
            ENTITY_MODULES.NEW_ENTITY_NAME = $scope.EntitySearch.NEW_ENTITY_NAME;
            ENTITY_MODULES.COMMENTS = $scope.EntitySearch.COPY_COMMENTS;
            ENTITY_MODULES.LOGO_PATH = $scope.EntitySearch.LOGO_PATH;
            ENTITY_MODULES.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(ENTITY_MODULES, 'ADMIN_COPY_ENTITY').then(function (data) {
                $scope.$parent.ShowAlert('Success', 'Entity Added Successfully', 3000);
                $('#POP_MODAL').modal('hide');
                $scope.RESET_ENT();
                $scope.ADMIN_GET_ENTITIES();
            });
        }

        else {
            $scope.$parent.ShowAlert('Error', 'Please Fill All Mandatory Fields', 3000);
        }
    };
    $scope.CLOSE_COPY_ENTITY_POPUP = function () {
        $scope.EntitySearch.COPY_CUSTOMER_ID = null;
        $scope.EntitySearch.NEW_ENTITY_NAME = '';
        $scope.EntitySearch.COPY_COMMENTS = '';
        document.getElementById('logo1').value = '';
        $('#POP_MODAL').modal('hide');

    };
});
app.controller('LocationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Location";
    $scope.$parent.urlpath = 'Setup_Location';
    $scope.LOCATION_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION_ALREADY_EXISTS = 0;

    $scope.LocSearch = {
        LOCATION_NAME: '',
        LOCATION_CODE: '',
        ADDRESS: '',
        CITY_NAME: '',
        STATE_ID: null,
        COUNTRY_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        CLICK_SEARCH: 0,
        PREVIOUS_LOCATION_NAME: null,
        CONTROL_ENABLE_DISABLE_FLAG: false
    };
    $scope.RESET_LOC = function () {
        $scope.LocSearch = {
            LOCATION_NAME: '',
            LOCATION_CODE: '',
            ADDRESS: '',
            CITY_NAME: '',
            STATE_ID: null,
            COUNTRY_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0, RESET_FLAG: 3,
            FLAG: 3,
            CONTROL_ENABLE_DISABLE_FLAG: false
        };
        $scope.LocForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.STATES = [];
        $scope.ADMIN_GET_LOCATION(2);
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.LocSearch.CUSTOMER_ID != undefined && $scope.LocSearch.CUSTOMER_ID != '' && $scope.LocSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.LocSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.GET_ENTITY_LIST_BYID = function (LOC) {
        if (LOC.CUSTOMER_ID != undefined || '' || null) {
            var GET_ALL_LOC = new Object();
            GET_ALL_LOC.CUSTOMER_ID = LOC.CUSTOMER_ID;
            GET_ALL_LOC.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.PAYROLL_API(GET_ALL_LOC, 'GET_ENTITY_LIST').then(function (data) {
                $scope.ENTITY_LIST = data.data.Table;
                var ENTITY_LIST_BYID = $scope.ENTITY_LIST.filter(function (p) { return p.CUSTOMER_ID = LOC.CUSTOMER_ID });
                $scope.LocSearch.ENTITY_ID = ENTITY_LIST_BYID[0].ENTITY_ID;
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    //$scope.GET_ENTITY_LIST();

    $scope.LAZY_ADMIN_GET_LOCATION = function () {
        $scope.ADMIN_GET_LOCATION();
    };

    $scope.ADMIN_GET_LOCATION = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();
        if (FLAG == 1) {
            $scope.LocSearch.CLICK_SEARCH = 1;
            $scope.LOCATION_LIST = [];
            $scope.LocSearch.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.LocSearch.ACTIVE == -1 ? -1 : $scope.LocSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.LOCATION_LIST = [];
            CusModelObj.ACTIVE = $scope.LocSearch.ACTIVE == -1 ? -1 : $scope.LocSearch.ACTIVE ? 1 : 0;
            $scope.LocSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.LocSearch.CLICK_SEARCH == 1)
                CusModelObj.ACTIVE = $scope.LocSearch.ACTIVE == -1 ? -1 : $scope.LocSearch.ACTIVE ? 1 : 0;
            else {
                CusModelObj.ACTIVE = -1;
            }
        }

        CusModelObj.CUSTOMER_ID = $scope.LocSearch.CLICK_SEARCH == 1 ? $scope.LocSearch.CUSTOMER_ID : null;//parseInt($cookies.get("CUSTOMER_ID"));
        CusModelObj.ENTITY_ID = $scope.LocSearch.CLICK_SEARCH == 1 ? $scope.LocSearch.ENTITY_ID : null;
        CusModelObj.LOCATION_NAME = $scope.LocSearch.CLICK_SEARCH == 1 ? $scope.LocSearch.LOCATION_ID : null;
        CusModelObj.LOCATION_CODE = $scope.LocSearch.CLICK_SEARCH == 1 ? $scope.LocSearch.LOCATION_CODE : null;
        //CusModelObj.ACTIVE = -1;
        CusModelObj.PAGE_NO = $scope.LocSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.LocSearch.PAGE_SIZE;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.LOCATION_LIST = $scope.LOCATION_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.LocSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.LocSearch.PAGE_NO = parseInt($scope.LocSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else
                $scope.GetData = false;

            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_LOCATION();
    $scope.GET_COUNTRY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            $scope.COUNTRY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY();
    $scope.GET_COUNTRY();
    $scope.GET_STATES = function () {
        var CusModelObj = new Object();
        CusModelObj.COUNTRY_ID = $scope.LocSearch.COUNTRY_ID;
        PrcCommMethods.HR_API(CusModelObj, 'GET_STATES').then(function (data) {
            $scope.STATES = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.LocSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = $scope.LocSearch.CUSTOMER_CODE;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_INS_UPD_LOCATION = function (ACTIVE) {
        $scope.LocForm.submitted = true;
        if ($scope.LocForm.$valid) {
            if ($scope.LocSearch.ACTIVE != -1) {
                if ($scope.LOCATION_ALREADY_EXISTS == 0) {
                    var EntModelObj = new Object();
                    EntModelObj.CUSTOMER_ID = $scope.LocSearch.CUSTOMER_ID;//parseInt($cookies.get("CUSTOMER_ID"));
                    EntModelObj.ENTITY_ID = $scope.LocSearch.ENTITY_ID;
                    EntModelObj.LOCATION_ID = $scope.LocSearch.LOCATION_ID;
                    EntModelObj.LOCATION_NAME = $scope.LocSearch.LOCATION_NAME;
                    EntModelObj.LOCATION_CODE = $scope.LocSearch.LOCATION_CODE;
                    EntModelObj.LOCATION_ADDRESS = $scope.LocSearch.ADDRESS;
                    EntModelObj.COUNTRY_ID = $scope.LocSearch.COUNTRY_ID;
                    EntModelObj.STATE_ID = $scope.LocSearch.STATE_ID;
                    EntModelObj.CITY = $scope.LocSearch.CITY_NAME;
                    EntModelObj.ZIPCODE = $scope.LocSearch.ZIPCODE;
                    EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    EntModelObj.ACTIVE = $scope.LocSearch.ACTIVE ? 1 : 0;
                    EntModelObj.COPY_FROM_TABLE_ID = null;
                    PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_LOCATION').then(function (data) {
                        $scope.RESET_LOC();
                        //$scope.ADMIN_GET_LOCATION(2);
                        $scope.$parent.ShowAlert('Success', 'Location Added Successfully', 3000);
                        $scope.LOCATION_ALREADY_EXISTS = 0;
                    });
                }
                else { $scope.$parent.ShowAlert('Attention', 'Entered Location Name Already Exists.', 3000); $scope.LocForm.submitted = false; }
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.LocForm.submitted = false; }
        }

    };
    $scope.EDIT_INS_UPD_LOCATION = function (LOC) {

        //$scope.LocSearch.ENTITY_ID = LOC.ENTITY_ID;
        $scope.LocSearch.CONTROL_ENABLE_DISABLE_FLAG = true;
        $scope.LocSearch.LOCATION_ID = LOC.LOCATION_ID;
        $scope.LocSearch.LOCATION_NAME = LOC.LOCATION_NAME;
        $scope.LocSearch.PREVIOUS_LOCATION_NAME = LOC.LOCATION_NAME;
        $scope.LocSearch.LOCATION_CODE = LOC.LOCATION_CODE;
        $scope.LocSearch.ADDRESS = LOC.ADDRESS;
        $scope.LocSearch.COUNTRY_ID = LOC.COUNTRY_ID;
        $scope.LocSearch.STATE_ID = LOC.STATE_ID;
        $scope.LOCATION_ALREADY_EXISTS = 0;
        $scope.GET_STATES();
        $scope.LocSearch.CITY_NAME = LOC.CITY;
        $scope.LocSearch.ZIPCODE = LOC.ZIPCODE;
        $scope.LocSearch.ACTIVE = LOC.ACTIVE ? 1 : 0;
        $scope.LocSearch.CUSTOMER_ID = LOC.CUSTOMER_ID;
        $scope.LocSearch.CLICK_SEARCH = 0;
        $scope.LocSearch.ENTITY_ID = LOC.ENTITY_ID;
        $scope.GET_ENTITY_LIST();
    };
    $scope.DELETE_INS_UPD_LOCATION = function (LOC) {
        if (confirm('This will de-activate the location.Are you sure you want to proceed?')) {
            var EntModelObj = new Object();
            EntModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EntModelObj.ENTITY_ID = LOC.ENTITY_ID;
            EntModelObj.LOCATION_ID = LOC.LOCATION_ID;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.ACTIVE = 2;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_LOCATION').then(function (data) {
                $scope.RESET_LOC();
                $scope.ADMIN_GET_LOCATION();
                $scope.$parent.ShowAlert('Success', 'Location Deleted Successfully', 3000);
            });
        }
    };
    $scope.ADMIN_CHK_LOC_NAME_EXIST = function () {
        if ($scope.LocSearch.LOCATION_NAME != $scope.LocSearch.PREVIOUS_LOCATION_NAME) {
            if ($scope.LocSearch.ENTITY_ID != null && $scope.LocSearch.ENTITY_ID != undefined && $scope.LocSearch.LOCATION_NAME != null && $scope.LocSearch.LOCATION_NAME != undefined) {
                var LocModelObj = new Object();
                LocModelObj.ENTITY_ID = $scope.LocSearch.ENTITY_ID;
                LocModelObj.LOCATION_NAME = $scope.LocSearch.LOCATION_NAME;
                PrcCommMethods.ADMIN_API(LocModelObj, 'ADMIN_CHK_LOC_NAME_EXIST').then(function (data) {
                    if (data.data == -1) {
                        $scope.LOCATION_ALREADY_EXISTS = 1;
                        $scope.$parent.ShowAlert('Attention', 'Entered Location Name Already Exists.', 3000);
                    }
                    else {
                        $scope.LOCATION_ALREADY_EXISTS = 0;
                        return false;
                    }
                });
            }
        }
        else {
            $scope.LOCATION_ALREADY_EXISTS = 0;
            return false;
        }
    };
});
app.controller('BranchController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Branch";
    $scope.$parent.urlpath = 'Setup_Branch';
    $scope.BRANCH_LIST = [];
    $scope.BRANCH_CUSTOMER_LIST = [];
    $scope.LOCATION = [];
    $scope.STATES = [];
    $scope.ENTITIES_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.TIME_ZONE_NAME_LIST = [];
    $scope.BrachSearch = {
        CUSTOMER_ID: null,
        UPL_FILE_FLAG: 1,
        ENTITY_ID: null,
        BRANCH_NAME: '',
        ADDRESS: '',
        CONTACT_NAME: '',
        CONTACT_NUMBER: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: null,
        CONTACT_EMAIL: '',
        CONTROL_ENABLE_DISABLE_FLAG: false,
        TIME_ZONE_NAME: null,
        UploadedFiles: [],
        ORIGINAL_LATITUDE: null,
        ORIGINAL_LONGITUDE: null,
        VARIANCE: null,
        IS_REVENUE_BRANCH: 0,
        USE_EPOS_COVERS_IN_DASHBOARDS: 0,
        SHOW_IN_DASHBOARD: 0
    };
    $scope.ResetBRN = function () {
        $scope.BrachSearch = {
            BRANCH_NAME: '',
            BRANCH_CODE: '',
            ADDRESS: '',
            CONTACT_NAME: '',
            CONTACT_NUMBER: '',
            CURRENCY_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            RESET_FLAG: 3,
            FLAG: 3, CLICK_SEARCH: null,
            CONTACT_EMAIL: '',
            CONTROL_ENABLE_DISABLE_FLAG: false,
            TIME_ZONE_NAME: null,
            UploadedFiles: [], UPL_FILE_FLAG: 1,
        };
        $scope.BrnForm.submitted = false;
        $scope.STATES = [];
        $scope.ENTITIES_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.ADMIN_GET_BRANCH(2);
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.BrachSearch.CUSTOMER_ID != undefined || $scope.BrachSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.BrachSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                    $scope.GET_LOCATION();
                }
                else { $scope.ENTITY_LIST = []; $scope.TIME_ZONE_NAME_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; $scope.TIME_ZONE_NAME_LIST = []; };
    };

    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY();
    $scope.GET_STATES = function () {
        var CusModelObj = new Object();
        CusModelObj.COUNTRY_ID = $scope.BrachSearch.COUNTRY_ID;
        PrcCommMethods.HR_API(CusModelObj, 'GET_STATES').then(function (data) {
            $scope.STATES = data.data.Table;
        });
    };

    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_CUSTOMER = function () {
        var BranchLocationModelObj = new Object();
        BranchLocationModelObj.CUSTOMER_NAME = $scope.BrachSearch.CUSTOMER_ID;
        BranchLocationModelObj.CUSTOMER_CODE = "";
        BranchLocationModelObj.ACTIVE = 1;
        BranchLocationModelObj.PAGE_NO = 1;
        BranchLocationModelObj.PAGE_SIZE = 1000;
        BranchLocationModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(BranchLocationModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.BRANCH_CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_LOCATION = function () {
        if ($scope.BrachSearch.ENTITY_ID != undefined && $scope.BrachSearch.ENTITY_ID != '' && $scope.BrachSearch.ENTITY_ID != null) {
            var BranchModelObj = new Object();
            BranchModelObj.CUSTOMER_ID = $scope.BrachSearch.CUSTOMER_ID;
            BranchModelObj.ENTITY_ID = $scope.BrachSearch.ENTITY_ID;
            BranchModelObj.LOCATION_NAME = "";
            BranchModelObj.LOCATION_CODE = "";
            BranchModelObj.ACTIVE = 1;
            BranchModelObj.PAGE_NO = 1;
            BranchModelObj.PAGE_SIZE = 1000;
            BranchModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BranchModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.LOCATION = data.data.Table;
                    var LIST_CUNTRY_CURR = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == $scope.BrachSearch.ENTITY_ID; })
                    $scope.TIME_ZONE_NAME_LIST = $scope.ENTITY_LIST.filter(x => x.TIME_ZONE_NAME != null && x.ENTITY_ID == $scope.BrachSearch.ENTITY_ID);
                    $scope.BrachSearch.COUNTRY_ID = LIST_CUNTRY_CURR[0].COUNTRY_ID;
                    $scope.BrachSearch.CURRENCY_ID = LIST_CUNTRY_CURR[0].CURRENCY_ID;
                    $scope.GET_STATES();
                }
                else {
                    $scope.LOCATION = [];
                    $scope.TIME_ZONE_NAME_LIST = [];;
                }
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.TIME_ZONE_NAME_LIST = [];;
        }
    };
    //$scope.GET_LOCATION();
    $scope.GET_COUNTRY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            $scope.COUNTRY = data.data.Table;
        });
    };
    $scope.GET_COUNTRY();

    $scope.LAZY_ADMIN_GET_BRANCH = function () {
        $scope.ADMIN_GET_BRANCH();
    };

    $scope.ADMIN_GET_BRANCH = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var BrnModelObj = new Object();
        if (FLAG == 1) {
            $scope.BrachSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_LIST = [];
            $scope.BrachSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_LIST = [];
            $scope.BrachSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.BrachSearch.CLICK_SEARCH == 1)
                BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
            else
                BrnModelObj.ACTIVE = -1;
        }

        BrnModelObj.CUSTOMER_ID = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.CUSTOMER_ID : null;
        BrnModelObj.ENTITY_ID = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.ENTITY_ID : null;
        BrnModelObj.BRANCH_CODE = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.BRANCH_CODE : '';
        BrnModelObj.BRANCH_NAME = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.BRANCH_NAME : '';
        BrnModelObj.CONTACT_NAME = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.CONTACT_NAME : '';
        BrnModelObj.LOCATION_IDS = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.LOCATION_IDS : '';
        //BrnModelObj.ACTIVE = -1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        BrnModelObj.PAGE_NO = $scope.BrachSearch.PAGE_NO;
        BrnModelObj.PAGE_SIZE = $scope.BrachSearch.PAGE_SIZE;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_LIST = $scope.BRANCH_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.BrachSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BrachSearch.PAGE_NO = parseInt($scope.BrachSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_BRANCH();
    $scope.ADMIN_INS_UPD_BRANCH = function (ACTIVE) {
        $scope.BrnForm.submitted = true;
        $scope.INS_UPD_MESSAGE = '';
        var LogCount = 0;
        if ($scope.BrachSearch.UploadedFiles == undefined || $scope.BrachSearch.UploadedFiles == "" || $scope.BrachSearch.UploadedFiles.length == 0) {
            LogCount++;
        }
        else {
            $scope.BrachSearch.LOGO_PATH = $scope.BrachSearch.UploadedFiles[0].FILE_PATH + $scope.BrachSearch.UploadedFiles[0].SERVER_FILE_NAME;
        }
        if ($scope.BrnForm.$valid && LogCount == 0) {
            if ($scope.BrachSearch.ACTIVE != -1) {
                var EntModelObj = new Object();
                if ($scope.BrachSearch.BRANCH_ID != undefined) {
                    $scope.INS_UPD_MESSAGE = 'Branch Updated Successfully';
                }
                else {
                    $scope.INS_UPD_MESSAGE = 'Branch Added Successfully';
                }

                EntModelObj.CUSTOMER_ID = $scope.BrachSearch.CUSTOMER_ID;
                EntModelObj.BRANCH_ID = $scope.BrachSearch.BRANCH_ID;
                EntModelObj.ENTITY_ID = $scope.BrachSearch.ENTITY_ID;
                EntModelObj.LOCATION_ID = $scope.BrachSearch.LOCATION_ID;
                EntModelObj.CURRENCY_ID = $scope.BrachSearch.CURRENCY_ID;
                EntModelObj.STATE_ID = $scope.BrachSearch.STATE_ID;
                EntModelObj.COUNTRY_ID = $scope.BrachSearch.COUNTRY_ID;
                EntModelObj.CITY = $scope.BrachSearch.CITY_NAME;
                EntModelObj.BRANCH_NAME = $scope.BrachSearch.BRANCH_NAME;
                EntModelObj.BRANCH_ADDRESS = $scope.BrachSearch.ADDRESS;
                EntModelObj.CONTACT_NAME = $scope.BrachSearch.CONTACT_NAME;
                EntModelObj.CONTACT_NUMBER = $scope.BrachSearch.CONTACT_NUMBER;
                EntModelObj.CONTACT_EMAIL = $scope.BrachSearch.CONTACT_EMAIL;
                EntModelObj.ZIPCODE = $scope.BrachSearch.ZIPCODE;
                EntModelObj.FAX = $scope.BrachSearch.FAX;
                //EntModelObj.LIMITED_COMPANY_NAME = $scope.BrachSearch.LIMITED_COMPANY_NAME;
                //EntModelObj.COMPANY_REGISTRATION_NO = $scope.BrachSearch.COMPANY_REGISTRATION_NO;
                EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
                EntModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == true ? 1 : 0;
                EntModelObj.COPY_FROM_TABLE_ID = null;

                EntModelObj.LATITUDE = $scope.BrachSearch.LATITUDE;
                EntModelObj.LONGITUDE = $scope.BrachSearch.LONGITUDE;
                EntModelObj.GEOFENCE_RADIUS = $scope.BrachSearch.GEOFENCE_RADIUS;
                EntModelObj.TIME_ZONE_NAME = $scope.BrachSearch.TIME_ZONE_NAME;
                EntModelObj.ORIGINAL_LATITUDE = $scope.BrachSearch.ORIGINAL_LATITUDE;
                EntModelObj.ORIGINAL_LONGITUDE = $scope.BrachSearch.ORIGINAL_LONGITUDE;
                EntModelObj.VARIANCE = $scope.BrachSearch.VARIANCE;
                EntModelObj.LOGO_PATH = $scope.BrachSearch.LOGO_PATH;
                EntModelObj.IS_REVENUE_BRANCH = $scope.BrachSearch.IS_REVENUE_BRANCH ? 1 : 0;
                EntModelObj.USE_EPOS_COVERS_IN_DASHBOARDS = $scope.BrachSearch.USE_EPOS_COVERS_IN_DASHBOARDS ? 1 : 0;
                EntModelObj.SHOW_IN_DASHBOARD = $scope.BrachSearch.SHOW_IN_DASHBOARD ? 1 : 0;

                PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_BRANCH').then(function (data) {
                    $scope.ResetBRN();
                    $scope.ADMIN_GET_BRANCH(2);
                    $scope.$parent.ShowAlert('Success', $scope.INS_UPD_MESSAGE.toString(), 3000);
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.BrnForm.submitted = false; }
        }
    };

    $scope.EDIT_INS_UPD_BRANCH = function (BRN) {
        $scope.BrachSearch.BRANCH_ID = BRN.BRANCH_ID;
        $scope.BrachSearch.UploadedFiles = [];


        $scope.BrachSearch.ACTIVE = BRN.ACTIVE ? 1 : 0;
        $scope.BrachSearch.IS_REVENUE_BRANCH = BRN.IS_REVENUE_BRANCH ? true : false;
        $scope.BrachSearch.USE_EPOS_COVERS_IN_DASHBOARDS = BRN.USE_EPOS_COVERS_IN_DASHBOARDS ? true : false;
        $scope.BrachSearch.CONTROL_ENABLE_DISABLE_FLAG = true;

        $scope.BrachSearch.ENTITY_ID = BRN.ENTITY_ID;
        $scope.BrachSearch.CUSTOMER_ID = BRN.CUSTOMER_ID;
        $scope.BrachSearch.LOCATION_ID = BRN.LOCATION_ID;
        $scope.BrachSearch.CURRENCY_ID = BRN.CURRENCY_ID;
        $scope.BrachSearch.STATE_ID = BRN.STATE_ID;
        $scope.BrachSearch.COUNTRY_ID = BRN.COUNTRY_ID;
        $scope.BrachSearch.CITY_NAME = BRN.CITY_NAME;
        $scope.BrachSearch.BRANCH_NAME = BRN.BRANCH_NAME;
        $scope.BrachSearch.BRANCH_CODE = BRN.BRANCH_CODE;
        $scope.BrachSearch.ADDRESS = BRN.ADDRESS;
        $scope.BrachSearch.CONTACT_NAME = BRN.CONTACT_NAME;
        $scope.BrachSearch.CONTACT_NUMBER = BRN.CONTACT_NUMBER;
        $scope.BrachSearch.CONTACT_EMAIL = BRN.CONTACT_EMAIL;
        $scope.BrachSearch.TAX_CODE = BRN.TAX_CODE;
        $scope.BrachSearch.FAX = BRN.FAX;
        $scope.BrachSearch.LIMITED_COMPANY_NAME = BRN.LIMITED_COMPANY_NAME;
        $scope.BrachSearch.COMPANY_REGISTRATION_NO = BRN.COMPANY_REGISTRATION_NUMBER;
        $scope.BrachSearch.ZIPCODE = BRN.ZIPCODE;

        $scope.BrachSearch.LATITUDE = BRN.LATITUDE_WEB;
        $scope.BrachSearch.LONGITUDE = BRN.LONGITUDE_WEB;
        $scope.BrachSearch.GEOFENCE_RADIUS = BRN.GEOFENCE_RADIUS;
        $scope.BrachSearch.TIME_ZONE_NAME = BRN.TIME_ZONE_NAME;

        $scope.BrachSearch.ORIGINAL_LATITUDE = BRN.ORIGINAL_LATITUDE;
        $scope.BrachSearch.ORIGINAL_LONGITUDE = BRN.ORIGINAL_LONGITUDE;
        $scope.BrachSearch.VARIANCE = BRN.VARIANCE;
        $scope.BrachSearch.IS_REVENUE_BRANCH = BRN.IS_REVENUE_BRANCH == null ? false : (BRN.IS_REVENUE_BRANCH == true ? true : false);
        $scope.BrachSearch.USE_EPOS_COVERS_IN_DASHBOARDS = BRN.USE_EPOS_COVERS_IN_DASHBOARDS;
        $scope.BrachSearch.SHOW_IN_DASHBOARD = BRN.SHOW_IN_DASHBOARD;
        if (BRN.LOGO_PATH != null && BRN.LOGO_PATH != '') {
            var PATH = BRN.LOGO_PATH.split("/");
            var last = PATH[PATH.length - 1];
            //angular.forEach(PATH, function () {
            //})
            var URL = BRN.LOGO_PATH;
            for (var i = 0; i < PATH.length; i++) {
                var NA = last;
                URL = URL.replace(NA, '');
            }
            // $scope.REDIRECTION_PATH = URL;
            var GETL = new Object();
            GETL.FILE_PATH = URL;
            GETL.SERVER_FILE_NAME = last;
            GETL.ORIGINAL_FILE_NAME = last;
            if ($scope.BrachSearch.UploadedFiles == undefined) {
                $scope.BrachSearch.UploadedFiles = [];
            }
            $scope.BrachSearch.UploadedFiles.push(GETL);
        }

        $scope.GET_ENTITY_LIST();

        $scope.GET_STATES();
    };
    $scope.DELETE_INS_UPD_BRANCH = function (BRN) {
        if (confirm('Are you Sure?')) {
            var EntModelObj = new Object();
            EntModelObj.CUSTOMER_ID = BRN.CUSTOMER_ID;//parseInt($cookies.get("CUSTOMER_ID"));
            EntModelObj.BRANCH_ID = BRN.BRANCH_ID;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntModelObj.ACTIVE = 2;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_UPD_BRANCH').then(function (data) {
                $scope.ResetBRN();
                $scope.ADMIN_GET_BRANCH();
                $scope.$parent.ShowAlert('Success', 'Branch Inactive Successfully', 3000);
            });
        }
    };
});
app.controller('AreaController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Area";
    $scope.$parent.urlpath = "Setup_Area";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.AREA_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];

    $scope.GET_ENTITY_LIST = function () {
        if ($scope.AreaSearch.CUSTOMER_ID != undefined || '' || null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.AreaSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else
            $scope.ENTITY_LIST = [];
    };
    $scope.GET_LOCATION = function () {
        if ($scope.AreaSearch.ENTITY_ID != null && $scope.AreaSearch.ENTITY_ID != undefined) {
            var GET_ALL = new Object();
            GET_ALL.ENTITY_ID = $scope.AreaSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.AreaSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            PrcCommMethods.HR_API(GET_ALL, 'GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else
            $scope.LOCATION = [];
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.AreaSearch.LOCATION_ID != null && $scope.AreaSearch.LOCATION_ID != undefined) {
            var AreaModelObj = new Object();
            AreaModelObj.CUSTOMER_ID = $scope.AreaSearch.CUSTOMER_ID;
            AreaModelObj.BRANCH_CODE = $scope.AreaSearch.BRANCH_CODE;
            AreaModelObj.BRANCH_NAME = $scope.AreaSearch.BRANCH_NAME;
            AreaModelObj.CONTACT_NAME = $scope.AreaSearch.CONTACT_NAME;
            AreaModelObj.LOCATION_IDS = $scope.AreaSearch.LOCATION_ID;
            AreaModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            AreaModelObj.PAGE_NO = $scope.AreaSearch.PAGE_NO;
            AreaModelObj.PAGE_SIZE = $scope.AreaSearch.PAGE_SIZE;
            AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = "";
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;;
        CusModelObj.PAGE_SIZE = 999;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.AreaSearch = {
        AREA_CODE: "",
        AREA_NAME: "",
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CLICK_SEARCH: null
    };
    $scope.RESET_AREA = function () {
        $scope.AreaSearch = {
            AREA_CODE: "",
            AREA_NAME: "",
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CLICK_SEARCH: null
        };
        $scope.AreaForm.submitted = false;
        $scope.ADMIN_GET_AREA(2);
    };
    $scope.ADMIN_GET_AREA = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var AreaModelObj = new Object();
        if (FLAG == 1) {
            $scope.AreaSearch.CLICK_SEARCH = 1;
            $scope.AREA_LIST = [];
            $scope.AreaSearch.PAGE_NO = 1;
            AreaModelObj.ACTIVE = $scope.AreaSearch.ACTIVE == -1 ? -1 : $scope.AreaSearch.ACTIVE == 1 ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.AREA_LIST = [];
            AreaModelObj.ACTIVE = $scope.AreaSearch.ACTIVE == -1 ? -1 : $scope.AreaSearch.ACTIVE == 1 ? 1 : 0;
            $scope.AreaSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.AreaSearch.CLICK_SEARCH == 1)
                AreaModelObj.ACTIVE = $scope.AreaSearch.ACTIVE == -1 ? -1 : $scope.AreaSearch.ACTIVE == 1 ? 1 : 0;
            else {
                AreaModelObj.ACTIVE = -1;
            }
        }

        AreaModelObj.CUSTOMER_ID = 3;
        AreaModelObj.AREA_CODE = $scope.AreaSearch.CLICK_SEARCH == 1 ? $scope.AreaSearch.AREA_CODE : null;
        AreaModelObj.AREA_NAME = $scope.AreaSearch.CLICK_SEARCH == 1 ? $scope.AreaSearch.AREA_NAME : '';
        //AreaModelObj.ACTIVE = -1;
        AreaModelObj.PAGE_NO = $scope.AreaSearch.PAGE_NO;
        AreaModelObj.PAGE_SIZE = $scope.AreaSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.AREA_LIST = $scope.AREA_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AreaSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AreaSearch.PAGE_NO = parseInt($scope.AreaSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_AREA();
    $scope.ADMIN_INS_UPD_AREA = function () {
        $scope.AreaForm.submitted = true;
        if ($scope.AreaForm.$valid) {
            if ($scope.AreaSearch.ACTIVE != -1) {
                var AreaModelObj = new Object();
                AreaModelObj.CUSTOMER_ID = $scope.AreaSearch.CUSTOMER_ID;
                AreaModelObj.AREA_ID = $scope.AreaSearch.AREA_ID;
                AreaModelObj.AREA_CODE = $scope.AreaSearch.AREA_CODE;
                AreaModelObj.AREA_NAME = $scope.AreaSearch.AREA_NAME;
                AreaModelObj.ACTIVE = $scope.AreaSearch.ACTIVE ? 1 : 0;
                AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_INS_UPD_AREA').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_AREA();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.AreaForm.submitted = false; }
        }
    };
    $scope.EDITE_AREA = function (AREA) {
        //$scope.AreaSearch = AREA;
        $scope.AreaSearch.ENTITY_ID = AREA.ENTITY_ID;
        $scope.AreaSearch.AREA_ID = AREA.AREA_ID;
        $scope.AreaSearch.AREA_CODE = AREA.AREA_CODE;
        $scope.AreaSearch.AREA_NAME = AREA.AREA_NAME;
        $scope.AreaSearch.ACTIVE = AREA.ACTIVE == true ? 1 : 0;
        //$scope.AreaSearch.USER_ID = parseInt($cookies.get("USERID"));
    };
    $scope.DELETE_AREA = function (AREA) {
        if (confirm('Are you sure?')) {
            var AreaModelObj = new Object();
            AreaModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            AreaModelObj.AREA_ID = AREA.AREA_ID;
            AreaModelObj.AREA_CODE = AREA.AREA_CODE;
            AreaModelObj.AREA_NAME = AREA.AREA_NAME;
            AreaModelObj.ACTIVE = 2;
            AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_INS_UPD_AREA').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);
                $scope.RESET_AREA();
                $scope.ADMIN_GET_AREA();
            });
        }
    };
    $scope.LAZY_ADMIN_GET_AREA = function () {
        $scope.ADMIN_GET_AREA();
    };
});
app.controller('AreaBranchMapController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Branch Area Mapping";
    $scope.$parent.urlpath = "Setup_Area_Mapping";
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_AREA_LISTS = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.AREA_LIST = [];

    $scope.BranchAreaSearch = {
        BRANCH_AREA_ID: null,
        BRANCH_ID: null,
        AREA_ID: null,
        LOCATION_ID: null,
        BRANCH_AREA_CODE: '',
        BRANCH_AREA_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        CLICK_SEARCH: null
    };
    $scope.RESET_AREA = function () {
        $scope.BranchAreaSearch = {
            BRANCH_AREA_ID: null,
            BRANCH_ID: null,
            AREA_ID: null,
            LOCATION_ID: null,
            BRANCH_AREA_CODE: '',
            BRANCH_AREA_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            CLICK_SEARCH: null
        };
        $scope.AreaForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.ADMIN_GET_BRANCH_AREA(2);
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = "";
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1
        CusModelObj.PAGE_SIZE = 999;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.BranchAreaSearch.CUSTOMER_ID != undefined && $scope.BranchAreaSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.BranchAreaSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; }
    };
    $scope.GET_LOCATION = function () {
        //var ENT = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == $scope.GroupSearch.ENTITY_ID })
        if ($scope.BranchAreaSearch.ENTITY_ID != null && $scope.BranchAreaSearch.ENTITY_ID != undefined) {
            var GET_ALL = new Object();
            GET_ALL.ENTITY_ID = $scope.BranchAreaSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.BranchAreaSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            GET_ALL.LOCATION_NAME = null;
            GET_ALL.LOCATION_CODE = null;
            GET_ALL.ACTIVE = 1;
            GET_ALL.PAGE_NO = 1;
            GET_ALL.PAGE_SIZE = 999;
            GET_ALL.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(GET_ALL, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
            //$scope.GET_BRANCH_LIST();
        }
        else { $scope.LOCATION = []; }

    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.BranchAreaSearch.LOCATION_ID != null && $scope.BranchAreaSearch.LOCATION_ID != undefined) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.BranchAreaSearch.CUSTOMER_ID;
            BrnModelObj.BRANCH_CODE = '';
            BrnModelObj.BRANCH_NAME = '';
            BrnModelObj.CONTACT_NAME = '';
            BrnModelObj.LOCATION_IDS = $scope.BranchAreaSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 1;
            BrnModelObj.PAGE_SIZE = 999;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_AREA = function () {
        var AreaModelObj = new Object();
        AreaModelObj.CUSTOMER_NAME = "";
        AreaModelObj.CUSTOMER_CODE = "";
        AreaModelObj.ACTIVE = 1;
        AreaModelObj.PAGE_NO = 1;
        AreaModelObj.PAGE_SIZE = 999;
        PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_GET_AREA').then(function (data) {
            $scope.AREA_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_AREA();
    $scope.ADMIN_GET_BRANCH_AREA = function (FLAG) {
        var BranchAreaMappingModelObj = new Object();
        if (FLAG == 1) {
            $scope.BranchAreaSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_AREA_LISTS = [];
            $scope.BranchAreaSearch.PAGE_NO = 1;
            BranchAreaMappingModelObj.ACTIVE = $scope.BranchAreaSearch.ACTIVE == -1 ? -1 : $scope.BranchAreaSearch.ACTIVE == 1 ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_AREA_LISTS = [];
            BranchAreaMappingModelObj.ACTIVE = $scope.BranchAreaSearch.ACTIVE == -1 ? -1 : $scope.BranchAreaSearch.ACTIVE == 1 ? 1 : 0;
            $scope.BranchAreaSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.BranchAreaSearch.CLICK_SEARCH == 1)
                BranchAreaMappingModelObj.ACTIVE = $scope.BranchAreaSearch.ACTIVE == -1 ? -1 : $scope.BranchAreaSearch.ACTIVE == 1 ? 1 : 0;
            else
                BranchAreaMappingModelObj.ACTIVE = -1;
        }
        BranchAreaMappingModelObj.CUSTOMER_ID = $scope.BranchAreaSearch.CLICK_SEARCH == 1 ? $scope.BranchAreaSearch.CUSTOMER_ID : null;
        BranchAreaMappingModelObj.BRANCH_ID = $scope.BranchAreaSearch.CLICK_SEARCH == 1 ? $scope.BranchAreaSearch.BRANCH_ID : null;
        BranchAreaMappingModelObj.AREA_ID = $scope.BranchAreaSearch.CLICK_SEARCH == 1 ? $scope.BranchAreaSearch.AREA_ID : null;
        //BranchAreaMappingModelObj.ACTIVE = -1;
        BranchAreaMappingModelObj.PAGE_NO = $scope.BranchAreaSearch.PAGE_NO;
        BranchAreaMappingModelObj.PAGE_SIZE = $scope.BranchAreaSearch.PAGE_SIZE;
        BranchAreaMappingModelObj.ENTITY_ID = $scope.BranchAreaSearch.CLICK_SEARCH == 1 ? $scope.BranchAreaSearch.ENTITY_ID : null;
        BranchAreaMappingModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(BranchAreaMappingModelObj, 'ADMIN_GET_BRANCH_AREA').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_AREA_LISTS = $scope.BRANCH_AREA_LISTS.concat(data.data.Table);
                if (data.data.Table.length < $scope.BranchAreaSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BranchAreaSearch.PAGE_NO = parseInt($scope.BranchAreaSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_BRANCH_AREA();
    $scope.ADMIN_INS_UPD_BRANCH_AREA = function () {
        //var ENT = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == $scope.BranchAreaSearch.ENTITY_ID })
        $scope.AreaForm.submitted = true;
        if ($scope.AreaForm.$valid) {
            if ($scope.BranchAreaSearch.ACTIVE != -1) {
                var BranchAreaMappingModelObj = new Object();
                BranchAreaMappingModelObj.CUSTOMER_ID = $scope.BranchAreaSearch.CUSTOMER_ID;
                BranchAreaMappingModelObj.ENTITY_ID = $scope.BranchAreaSearch.ENTITY_ID;
                BranchAreaMappingModelObj.BRANCH_ID = $scope.BranchAreaSearch.BRANCH_ID;
                BranchAreaMappingModelObj.BRANCH_AREA_ID = $scope.BranchAreaSearch.BRANCH_AREA_ID;
                BranchAreaMappingModelObj.AREA_ID = $scope.BranchAreaSearch.AREA_ID;
                BranchAreaMappingModelObj.USER_ID = parseInt($cookies.get("USERID"));
                BranchAreaMappingModelObj.ACTIVE = $scope.BranchAreaSearch.ACTIVE ? 1 : 0;
                BranchAreaMappingModelObj.COMMENTS = '';
                BranchAreaMappingModelObj.LOCATION_ID = $scope.BranchAreaSearch.LOCATION_ID;
                PrcCommMethods.ADMIN_API(BranchAreaMappingModelObj, 'ADMIN_INS_UPD_BRANCH_AREA').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.RESET_AREA();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.AreaForm.submitted = false; }
        }
    };
    $scope.ADMIN_EDIT_UPD_BRANCH_AREA = function (BRN_AR) {
        //$scope.BranchAreaSearch = BRN_AR;

        $scope.BranchAreaSearch.BRANCH_AREA_ID = BRN_AR.BRANCH_AREA_ID;
        $scope.BranchAreaSearch.CUSTOMER_ID = BRN_AR.CUSTOMER_ID;
        $scope.BranchAreaSearch.ENTITY_ID = BRN_AR.ENTITY_ID;
        $scope.BranchAreaSearch.BRANCH_ID = BRN_AR.BRANCH_ID;
        $scope.BranchAreaSearch.AREA_ID = BRN_AR.AREA_ID;
        $scope.BranchAreaSearch.AREA_CODE = BRN_AR.AREA_CODE;
        $scope.BranchAreaSearch.AREA_NAME = BRN_AR.AREA_NAME;
        $scope.BranchAreaSearch.ACTIVE = BRN_AR.ACTIVE == true ? 1 : 0;
        $scope.BranchAreaSearch.LOCATION_ID = BRN_AR.LOCATION_ID;
        $scope.GET_ENTITY_LIST();
        $scope.GET_LOCATION();
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.DELETE_BRANCH_AREA = function (BRN_AR) {
        if (confirm('Are you sure?')) {
            var AreaModelObj = new Object();
            AreaModelObj.BRANCH_AREA_ID = BRN_AR.BRANCH_AREA_ID;
            AreaModelObj.CUSTOMER_ID = BRN_AR.CUSTOMER_ID;
            AreaModelObj.ENTITY_ID = BRN_AR.ENTITY_ID;
            AreaModelObj.BRANCH_ID = BRN_AR.BRANCH_ID;

            AreaModelObj.AREA_ID = BRN_AR.AREA_ID;
            AreaModelObj.AREA_CODE = BRN_AR.AREA_CODE;
            AreaModelObj.AREA_NAME = BRN_AR.AREA_NAME;
            AreaModelObj.ACTIVE = 2;
            AreaModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(AreaModelObj, 'ADMIN_INS_UPD_BRANCH_AREA').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.RESET_AREA();
                $scope.ADMIN_GET_BRANCH_AREA();

            });
        }
    };
    $scope.LAZY_ADMIN_GET_BRANCH_AREA = function () {
        $scope.ADMIN_GET_BRANCH_AREA();
    };

});
app.controller('RoleController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if (getUrlParameter('STAG', decodeURIComponent($location.absUrl())) == undefined)
        $scope.$parent.PAGE_HEADER = "Role List";
    if (getUrlParameter('STAG', decodeURIComponent($location.absUrl())) == 2)
        $scope.$parent.PAGE_HEADER = "Create Role";

    if ($scope.$parent.chkRedirctToHR == 1)
        $scope.$parent.urlpath = 'Adrl?STAG=2';
    else
        $scope.$parent.urlpath = 'rle_lst';

    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.$parent.ROL_ID = "";
    $scope.ROL_ID = getUrlParameter('ID', $location.absUrl());
    //$scope.ROL_ID = getUrlParameter('STAG', $location.absUrl());
    var EDIT_MODE = getUrlParameter('e', $location.absUrl());
    EDIT_MODE == undefined ? EDIT_MODE = 0 : '';
    $scope.ROLE_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.SELECTED_ROLE_ID = [];
    $scope.ENTITY_LIST_FOR_ROLEID = [];
    $scope.CHECK_ALL_COUNT = 0;

    $scope.RoleSearch = {
        CUSTOMER_ID: null,
        ROLE_NAME: '',
        ROLE_DESCRIPTION: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH: 0,
        CHECK_ALL: false,
        ENTITY_ID: null
    };
    $scope.CHECK_CHANGE = function (RL) {
        if (RL.PRIVILEGE_ID == true)
            RL.PRIVILEGE_ID = RL.PRIVILEGE_ID;
    };
    $scope.ResetBRN = function () {
        $scope.RoleSearch = {
            CUSTOMER_ID: null, ENTITY_ID: null,
            ROLE_NAME: '',
            ROLE_DESCRIPTION: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0,
        };
        $scope.SELECTED_ROLE_ID = [];
        $scope.ROLE_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.RoleForm.submitted = false;
        $scope.GET_ROLE_LIST();

    };
    $scope.Reset_ROLE_MASTER = function () {
        $scope.ResetBRN();
        $scope.PRIVILEGE_LIST = [];
        $scope.ENTITY_LIST = [];
    };
    $scope.RESET_ROLE_MST = function () {
        EDIT_MODE = 0;
        $scope.EDIT_MODE = EDIT_MODE == 1 ? true : false;
        $scope.$parent.EditObject = null;
        if ($scope.$parent.chkRedirctToHR == 1) {
            $scope.$parent.urlpath = '';
            window.location.href = '../Main/Admin#!/Setup_HR';
        }
        else
            window.location.href = '../Main/Admin#!/rle_lst';
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_COUNTRY = function () {
        var PosiModelObj = new Object();
        PrcCommMethods.HR_API(PosiModelObj, 'GET_COUNTRY').then(function (data) {
            $scope.COUNTRY = data.data.Table;
        });
    };
    $scope.GET_CURRENCY = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.LAZY_GET_ROLE_LIST = function () {
        $scope.GET_ROLE_LIST();
    };
    $scope.GET_ROLE_LIST = function (FLAG) {
        //if (EDIT_MODE == 0 && $scope.$parent.EditObject == null) {
        //if (FLAG == '1' || FLAG == '-1') {
        //    $scope.RoleSearch.CLICK_SEARCH = FLAG;
        //    $scope.ROLE_LIST = [];
        //    $scope.RoleSearch.PAGE_NO = 1;
        //}
        document.getElementById("overlay_loading").style.display = "block";
        var BrnModelObj = new Object();
        if (FLAG == 1) {
            $scope.RoleSearch.CLICK_SEARCH = 1;
            $scope.ROLE_LIST = [];
            $scope.RoleSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.RoleSearch.ACTIVE == -1 ? -1 : $scope.RoleSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.ROLE_LIST = [];
            $scope.RoleSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.RoleSearch.ACTIVE == -1 ? -1 : $scope.RoleSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.RoleSearch.CLICK_SEARCH == 1)
                BrnModelObj.ACTIVE = $scope.RoleSearch.ACTIVE == -1 ? -1 : $scope.RoleSearch.ACTIVE ? 1 : 0;
            else
                BrnModelObj.ACTIVE = -1;
        }
        BrnModelObj.CUSTOMER_ID = $scope.RoleSearch.CLICK_SEARCH == 1 ? $scope.RoleSearch.CUSTOMER_ID : null;
        BrnModelObj.ENTITY_ID = $scope.RoleSearch.CLICK_SEARCH == 1 ? $scope.RoleSearch.ENTITY_ID : null;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        BrnModelObj.ROLE_DESCRIPTION = $scope.RoleSearch.CLICK_SEARCH == 1 ? $scope.RoleSearch.ROLE_DESCRIPTION : null;
        BrnModelObj.ROLE_NAME = $scope.RoleSearch.CLICK_SEARCH == 1 ? $scope.RoleSearch.ROLE_NAME : null;
        BrnModelObj.MODULE_IDS = 2;//$scope.RoleSearch.MODULE_IDS;
        //BrnModelObj.ACTIVE = $scope.RoleSearch.ACTIVE;
        BrnModelObj.PAGE_NO = $scope.RoleSearch.PAGE_NO;
        BrnModelObj.PAGE_SIZE = $scope.RoleSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(BrnModelObj, 'GET_ROLE_LIST').then(function (data) {
            //  $scope.ROLE_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.ROLE_LIST = $scope.ROLE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.RoleSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.RoleSearch.PAGE_NO = parseInt($scope.RoleSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.ROLE_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
        //}
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.RoleSearch.CUSTOMER_ID != undefined || '' || null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.RoleSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.RoleSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = "";//$scope.RoleSearch.CUSTOMER_CODE;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.GET_ROLE_LIST();
    $scope.ADMIN_GET_CUSTOMER();
    $scope.InitializePrivilege = function (RL) {

        RL.ALLOWED = RL.ALLOWED == 1;
        RL.ACCESS_TYPE = RL.ACCESS_TYPE_ID;
        //if (RL.HAS_ACCESSES == true && RL.ALLOWED_RIGHTS_IDS_ARR.length > 0) {
        //    RL.ALLOWED = true;
        //    RL.ACCESS_TYPE = 2;
        //} else {
        //    RL.ALLOWED = false;
        //  RL.ACCESS_TYPE = false;
        //}
    };
    $scope.GET_ROLE_DETAILS_BY_ID = function (RL) {

        var RoleModelObj = new Object();
        RoleModelObj.ROLE_ID = RL.ROLE_ID;//$scope.ROL_ID;
        $scope.$parent.ROL_ID = RL.ROLE_ID;// add this var to access role_id var in all functions
        RoleModelObj.MODULE_ID = 0;
        PrcCommMethods.ADMIN_API(RoleModelObj, 'GET_ROLE_DETAILS_BY_ID').then(function (data) {

            $scope.GROUP_LIST = data.data.Table;
            $scope.PRIVILEGE_LIST = data.data.Table1;
            angular.forEach($scope.PRIVILEGE_LIST, function (PL) {
                //if (PL.HAS_ACCESSES && PL.RIGHTS_MASTER_IDS != null && PL.RIGHTS_MASTER_IDS != "") {
                if (PL.RIGHTS_MASTER_IDS != null && PL.RIGHTS_MASTER_IDS != "") {
                    if (PL.HAS_ACCESSES) {
                        // if (PL.RIGHTS_MASTER_IDS != null && PL.RIGHTS_MASTER_IDS != "") {
                        PL.ALLOWED_RIGHTS_IDS_ARR = [];
                        angular.forEach(PL.RIGHTS_MASTER_IDS.split(','), function (val) {
                            var name = "";
                            if (val == 1) {
                                name = "View";
                            } else if (val == 2) {
                                name = "Add";
                            }
                            else if (val == 3) {
                                name = "Edit";
                            }
                            else if (val == 4) {
                                name = "Delete";
                            }
                            else if (val == 5) {
                                name = "Upload";
                            }
                            PL.ALLOWED_RIGHTS_IDS_ARR.push({ RID: val, NAME: name, IS_CHECKED: true });
                        })
                        //}
                        //else {
                        //    PL.ALLOWED_RIGHTS_IDS_ARR = [];
                        //}
                        //PL.ALLOWED = true;
                    }
                } else {
                    PL.ALLOWED_RIGHTS_IDS_ARR = [];
                }

                //else {
                //    PL.ALLOWED = 1;
                //}
            })
            $scope.RoleSearch.MODULE_ID = data.data.Table[0].MODULE_ID;
            $scope.RoleSearch.MODULE_NAME = data.data.Table[0].MODULE_NAME;
            $scope.RoleSearch.CUSTOMER_ID = data.data.Table[0].CUSTOMER_ID;

            $scope.RoleSearch.ENTITY_ID = data.data.Table[0].ENTITY_ID;
            $scope.RoleSearch.ROLE_DESCRIPTION = data.data.Table[0].ROLE_DESCRIPTION;
            $scope.RoleSearch.ROLE_NAME = data.data.Table[0].ROLE_NAME;
            $scope.RoleSearch.ROLE_ID = data.data.Table[0].ROLE_ID;
            $scope.RoleSearch.ACTIVE = data.data.Table[0].ACTIVE ? true : false;
            $scope.GET_ENTITY_LIST();
            if (getUrlParameter('e', decodeURIComponent($location.absUrl())) == 1) {
                $scope.GET_PRIVILEGE_EDIT();
            }
            //angular.forEach($scope.PRIVILEGE_LIST, function (val) {
            //    angular.forEach(data.data.Table1, function (Pev) {
            //        if (val.PRIVILEGE_ID == Pev.PRIVILEGE_ID && Pev.ASSIGNED == 1) {
            //            val.IS_SELECTED = true;
            //        }
            //    })
            //})
        });
    };
    //add if condition to stop calling in entity change event while edit user role
    //Problem -in the time of editing - onentity change called privillege function and page got refreshed.All selected roll are unchecked. 
    if (getUrlParameter('STAG', decodeURIComponent($location.absUrl())) == 2) {
        $scope.GET_PRIVILEGE = function () {
            var PosiModelObj = new Object();
            $scope.RoleSearch.CHECK_ALL = false;
            PosiModelObj.MODULE_ID = 0;
            PosiModelObj.ENTITY_ID = $scope.RoleSearch.ENTITY_ID;
            PrcCommMethods.ADMIN_API(PosiModelObj, 'GET_PRIVILEGE').then(function (data) {

                $scope.PRIVILEGE_LIST = data.data.Table;
                if ($scope.PRIVILEGE_LIST.length > 0) {
                    angular.forEach($scope.PRIVILEGE_LIST, function (PL) {
                        if (PL.HAS_ACCESSES && PL.ALLOWED_RIGHTS_IDS != null) {
                            PL.ALLOWED_RIGHTS_IDS_ARR = [];
                            angular.forEach(PL.ALLOWED_RIGHTS_IDS.split(','), function (val) {
                                var name = "";
                                if (val == 1) {
                                    name = "View";
                                } else if (val == 2) {
                                    name = "Add";
                                }
                                else if (val == 3) {
                                    name = "Edit";
                                }
                                else if (val == 4) {
                                    name = "Delete";
                                }
                                else if (val == 5) {
                                    name = "Upload";
                                }
                                PL.ALLOWED_RIGHTS_IDS_ARR.push({ RID: val, NAME: name, IS_CHECKED: false });
                            })
                        } else {
                            PL.ALLOWED_RIGHTS_IDS_ARR = [];
                        }
                    })

                }
                if ($scope.ROL_ID > 0) {
                    $scope.GET_ROLE_DETAILS_BY_ID();
                }
            });
        };
        //$scope.GET_PRIVILEGE();
    }
    //======================================
    $scope.CHANGE_CHECKBOX = function (PRIV) {

        if (PRIV.ALLOWED == false) {
            if (PRIV.ACCESS_TYPE == undefined || PRIV.ACCESS_TYPE == true || PRIV.ACCESS_TYPE == 2) {
                PRIV.ACCESS_TYPE = false;
                PRIV.ALLOWED_RIGHTS_IDS_ARR.filter(function (x) {
                    x.IS_CHECKED = false;
                });
                $scope.CHECK_ALL_COUNT -= 1;
            }
        }
        if (PRIV.ALLOWED == true) {
            if (PRIV.ACCESS_TYPE == undefined || PRIV.ACCESS_TYPE == false || PRIV.ACCESS_TYPE == 2) {
                PRIV.ACCESS_TYPE = 2;
                $scope.CHECK_ALL_COUNT += 1;
            }
        }
        $scope.PRIVILEGE_LIST.length == $scope.CHECK_ALL_COUNT ? $scope.RoleSearch.CHECK_ALL = true : $scope.RoleSearch.CHECK_ALL = false;

    };
    $scope.SET_PRIVILEGE = function (AL, ID) {

        if (AL.ALLOWED) {
            if (ID == "2" || ID == "3" || ID == "4" || ID == "5") {
                AL.ALLOWED_RIGHTS_IDS_ARR[0].IS_CHECKED = true;
            } else if (ID == "1") {
                for (var i = 0; i < AL.ALLOWED_RIGHTS_IDS_ARR.length; i++) {
                    if ((AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "2" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true) || (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "3" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true)
                        || (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "4" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true) || (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "5" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true)) {
                        AL.ALLOWED_RIGHTS_IDS_ARR[0].IS_CHECKED = true;
                    }
                }
            }
            //if (ID == "2" || ID == "3" || ID == "4") {
            //    // angular.forEach(AL.ALLOWED_RIGHTS_IDS_ARR, function (val) {
            //    for (var i = 0; i < AL.ALLOWED_RIGHTS_IDS_ARR.length; i++) {
            //        if (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "1") {
            //            AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED = true;
            //            break;
            //        }
            //    }
            //    //})
            //}

            //for (var i = 0; i < AL.ALLOWED_RIGHTS_IDS_ARR.length; i++) {
            //    if ((AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "2" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true) || (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "3" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true)
            //        || (AL.ALLOWED_RIGHTS_IDS_ARR[i].RID == "4" && AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED == true)) {
            //        AL.ALLOWED_RIGHTS_IDS_ARR[0].IS_CHECKED = true;
            //    }               
            //}
            //if (ID == "5") {
            //    for (var i = 0; i < AL.ALLOWED_RIGHTS_IDS_ARR.length; i++) {                   
            //            AL.ALLOWED_RIGHTS_IDS_ARR[i].IS_CHECKED = true;
            //            break;                    
            //    }
            //}
        }

    }
    $scope.INS_UPD_ROLE_MASTER = function (ACTIVE) {
        $scope.RoleForm.submitted = true;
        if ($scope.RoleForm.$valid) {

            var EntModelObj = new Object();
            EntModelObj.ROLE_ID = $scope.$parent.ROL_ID;
            EntModelObj.ROLE_NAME = $scope.RoleSearch.ROLE_NAME;
            EntModelObj.ROLE_DESCRIPTION = $scope.RoleSearch.ROLE_DESCRIPTION;
            EntModelObj.ENTITY_ID = $scope.RoleSearch.ENTITY_ID;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            //EntModelObj.MODULE_ID = 2//$scope.RoleSearch.MODULE_ID;
            var Selected_Modules = [];
            angular.forEach($scope.PRIVILEGE_LIST, function (RL) {
                if (RL.ALLOWED != undefined && RL.ALLOWED != null && RL.ALLOWED != false) {
                    //var Selected_Modules = [];                  
                    var obj = new Object();
                    obj.PRIVILEGE_ID = RL.PRIVILEGE_ID;
                    //if (RL.RIGHTS_MASTER_IDS != null && RL.RIGHTS_MASTER_IDS!="") { 
                    if (RL.ALLOWED_RIGHTS_IDS_ARR.length > 0 && RL.HAS_ACCESSES == true) {
                        //var obj = new Object();
                        //obj.PRIVILEGE_ID = RL.PRIVILEGE_ID;
                        angular.forEach(RL.ALLOWED_RIGHTS_IDS_ARR, function (AL) {
                            if (AL.IS_CHECKED) {
                                //obj.ACCESS_TYPE_ID = RL.ACCESS_TYPE;
                                if (obj.RIGHTS_MASTER_IDS == undefined && obj.RIGHTS_MASTER_IDS == null) {
                                    obj.RIGHTS_MASTER_IDS = AL.RID;
                                } else {
                                    obj.RIGHTS_MASTER_IDS = obj.RIGHTS_MASTER_IDS + "," + AL.RID;
                                }

                            }
                        })
                    } else {
                        obj.RIGHTS_MASTER_IDS = "";
                    }
                    //} else {
                    //        //obj.PRIVILEGE_ID = RL.PRIVILEGE_ID;
                    //        obj.RIGHTS_MASTER_IDS = "";
                    //    }
                    Selected_Modules.push(obj);
                }
            })

            EntModelObj.ACTIVE = $scope.RoleSearch.ACTIVE == -1 ? 0 : $scope.RoleSearch.ACTIVE == false ? 0 : 1;
            EntModelObj.COMMENTS = $scope.RoleSearch.COMMENTS;

            //if (Selected_Modules.length > 0 && Selected_Modules.filter(x => x.ACCESS_TYPE_ID != undefined).length > 0) {
            //    if (Selected_Modules.filter(x => x.PRIVILEGE_ID != null).length == Selected_Modules.filter(x => x.ACCESS_TYPE_ID != null).length
            //        && Selected_Modules.filter(x => x.PRIVILEGE_ID != null).length == Selected_Modules.filter(x => x.ACCESS_TYPE_ID != false).length) {
            if (Selected_Modules.length > 0 && Selected_Modules.filter(x => x.RIGHTS_MASTER_IDS != undefined).length > 0) {
                //if (Selected_Modules.filter(x => x.PRIVILEGE_ID != null).length == Selected_Modules.filter(x => x.RIGHTS_MASTER_IDS != null).length
                //    && Selected_Modules.filter(x => x.PRIVILEGE_ID != null).length == Selected_Modules.filter(x => x.RIGHTS_MASTER_IDS != false).length) {
                EntModelObj.ROLE_PRIVS = Selected_Modules.filter(x => x.RIGHTS_MASTER_IDS != null && x.PRIVILEGE_ID != null);
                PrcCommMethods.ADMIN_API(EntModelObj, 'INS_UPD_ROLE_MASTER').then(function (data) {

                    if ($scope.ROL_ID > 0) {
                        $scope.$parent.ShowAlert('Success', 'Record Updated Successfully', 3000);
                    }
                    else {
                        $scope.$parent.ShowAlert('Success', 'Role Added Successfully', 3000);
                    }
                    EDIT_MODE = 0;
                    $scope.EDIT_MODE = EDIT_MODE == 1 ? true : false;
                    $scope.$parent.EditObject = null;
                    window.location.href = '../Main/Admin#!/rle_lst';
                });
                //}
                //else
                //    $scope.$parent.ShowAlert('Error', 'Module and privilege selection are not same,please check.', 3000);
            }
            else {
                $scope.$parent.ShowAlert('Error', 'Please select atleast one privilege name and privilege access form the list', 3000);
            }
        }
        angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
    };
    //$scope.UPD_ROLE_MASTER = function () {
    //}$scope.GET_ENTITY_LIST
    $scope.ADMIN_EDIT_ROLE_MASTER = function () {

        if (EDIT_MODE == 1 && $scope.$parent.EditObject != null) {
            $scope.EDIT_MODE = EDIT_MODE == 1 ? true : false;
            $scope.RoleSearch = $scope.$parent.EditObject;
            //$scope.$parent.ROL_ID = $scope.RoleSearch.ROLE_ID;            
            $scope.GET_ROLE_DETAILS_BY_ID($scope.RoleSearch);
            //$scope.GET_PRIVILEGE1();
        }
    };
    $scope.ADMIN_EDIT_ROLE = function (RL) {

        $scope.$parent.EditObject = RL;
        $location.path('Adrl').search({ e: 1 });

    }
    $scope.GET_PRIVILEGE_EDIT = function () {
        var PosiModelObj = new Object();
        $scope.RoleSearch.CHECK_ALL = false;
        PosiModelObj.MODULE_ID = 0;
        PosiModelObj.ENTITY_ID = $scope.RoleSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(PosiModelObj, 'GET_PRIVILEGE').then(function (data) {

            $scope.PRIVILEGE_LIST_NOTALLWD = data.data.Table;
            if ($scope.PRIVILEGE_LIST_NOTALLWD.length > 0) {
                angular.forEach($scope.PRIVILEGE_LIST_NOTALLWD, function (PL) {
                    PL.ALLOWED_RIGHTS_IDS_ARR = [];
                    if (PL.HAS_ACCESSES && PL.ALLOWED_RIGHTS_IDS != null && PL.ALLOWED_RIGHTS_IDS != "") {

                        angular.forEach(PL.ALLOWED_RIGHTS_IDS.split(','), function (val) {
                            var name = "";
                            if (val == 1) {
                                name = "View";
                            } else if (val == 2) {
                                name = "Add";
                            }
                            else if (val == 3) {
                                name = "Edit";
                            }
                            else if (val == 4) {
                                name = "Delete";
                            }
                            else if (val == 5) {
                                name = "Upload";
                            }
                            PL.ALLOWED_RIGHTS_IDS_ARR.push({ RID: val, NAME: name, IS_CHECKED: false });
                        })
                        PL.ALLOWED = true;
                    } else {
                        PL.ALLOWED = false;
                    }
                })

            }


            if ($scope.PRIVILEGE_LIST_NOTALLWD.length > 0) {

                angular.forEach($scope.PRIVILEGE_LIST, function (PL) {
                    // if (PL.ALLOWED) {
                    angular.forEach($scope.PRIVILEGE_LIST_NOTALLWD, function (TB) {
                        if (TB.ALLOWED) {
                            if (PL.PRIVILEGE_ID == TB.PRIVILEGE_ID) {

                                //if (PL.HAS_ACCESSES && PL.ALLOWED_RIGHTS_IDS_ARR.length > 0) {
                                if (PL.HAS_ACCESSES && TB.ALLOWED_RIGHTS_IDS_ARR.length > 0) {
                                    //  PL.RIGHTS_MASTER_IDS = [];
                                    angular.forEach(TB.ALLOWED_RIGHTS_IDS_ARR, function (val) {
                                        var flag = true;
                                        if (PL.ALLOWED_RIGHTS_IDS_ARR != null && PL.ALLOWED_RIGHTS_IDS_ARR.length > 0) {
                                            for (var i = 0; i < PL.ALLOWED_RIGHTS_IDS_ARR.length; i++) {
                                                if (PL.ALLOWED_RIGHTS_IDS_ARR[i].RID == val.RID) {
                                                    //if (val.IS_CHECKED == false) {
                                                    flag = false;
                                                    break;
                                                }
                                                //else {
                                                //    PL.ALLOWED_RIGHTS_IDS_ARR.push({ RID: val.RID, NAME: val.NAME, IS_CHECKED: false });
                                                //}
                                            }
                                        }
                                        if (flag) {
                                            PL.ALLOWED_RIGHTS_IDS_ARR.push({ RID: val.RID, NAME: val.NAME, IS_CHECKED: false });
                                            // PL.RIGHTS_MASTER_IDS.push({ RID: val.RID, NAME: val.NAME, IS_CHECKED: false });
                                        }
                                    })
                                }
                            }
                        }
                    })
                    // }
                })
            }
        });
    };

    $scope.DELETE_INS_UPD_ROLE_MASTER = function (ROLEMASTER) {
        if (confirm('Are you sure?')) {
            var EntModelObj = new Object();
            EntModelObj.ROLE_ID = ROLEMASTER.ROLE_ID;
            EntModelObj.COMMENTS = ROLEMASTER.COMMENTS;
            EntModelObj.ACTIVE = 2;
            EntModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            EntModelObj.MODULE_ID = 2//$scope.RoleSearch.MODULE_ID;
            EntModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(EntModelObj, 'INS_UPD_ROLE_MASTER').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Inactive Successfully", 3000);

                $scope.GET_ROLE_LIST();
            });
        }
    };
    $scope.CHECKALL = function () {

        if ($scope.RoleSearch.CHECK_ALL == true) {
            angular.forEach($scope.PRIVILEGE_LIST, function (RL) {
                RL.ALLOWED = true;
                RL.ACCESS_TYPE = 2;
                $scope.CHECK_ALL_COUNT += 1;
            });
        }
        else {
            angular.forEach($scope.PRIVILEGE_LIST, function (RL) {
                RL.ALLOWED = false;
                RL.ACCESS_TYPE = false;
                $scope.CHECK_ALL_COUNT -= 1;
            });
        }
    };

    $scope.CREATE_ROLE_CLICK = function () {
        $location.path('Adrl').search('STAG', 2);
    };
    $scope.GET_ENTITY_LIST_FOR_ROLEID = function () {

        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = 0;
        CusModelObj.ENTITY_CODE = '';
        CusModelObj.ENTITY_NAME = '';
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.PAGE_SIZE = 999;
        CusModelObj.IS_LIVE = -1;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST_FOR_ROLEID = data.data.Table;
            }
            else
                $scope.ENTITY_LIST_FOR_ROLEID = [];
        });
    };

    $scope.CHECK_UNCHECK_CHECKBOX = function (ROLE_ID, CHECKBOX_CHECKED, index) {
        if (CHECKBOX_CHECKED) {
            $scope.CHECKED = { TABLE_ID: ROLE_ID, posi: index };
            $scope.SELECTED_ROLE_ID = [];
            $scope.SELECTED_ROLE_ID.push($scope.CHECKED);
            $scope.ROLE_LIST.filter(p => p.ROLE_ID != ROLE_ID).filter(p => p.ALLOWED = false)
        }
        else
            $scope.SELECTED_ROLE_ID.splice($scope.SELECTED_ROLE_ID.map(function (x) { return x.posi; }).indexOf(index), 1);
    };
    $scope.COPY_ROLE_ID_POPUP = function () {
        if ($scope.SELECTED_ROLE_ID.length > 0) {
            $scope.RoleSearch.ENTITY_ID_COPY = null;
            $scope.GET_ENTITY_LIST_FOR_ROLEID();
            $('#POP_MODAL').modal('show');
            //alert(Array.prototype.map.call($scope.ROLE_ID_CHECKED, function (item) { return item.id; }).join(","));
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please Select Role's, To Copy.", 4000);
        }
    };
    $scope.ADMIN_INS_COPY_ROLE_BY_ENTITY = function () {
        if ($scope.RoleSearch.ENTITY_ID_COPY != null) {
            var EntModelObj = new Object();
            EntModelObj.ROLE_IDS = $scope.SELECTED_ROLE_ID;
            EntModelObj.TO_ENTITY_ID = $scope.RoleSearch.ENTITY_ID_COPY;
            PrcCommMethods.ADMIN_API(EntModelObj, 'ADMIN_INS_COPY_ROLE_BY_ENTITY').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Updated Successfully", 3000);
                $('#POP_MODAL').modal('hide');
                $scope.ROLE_LIST.filter(x => x.ALLOWED = false);
                $scope.SELECTED_ROLE_ID = [];
                $scope.GET_ROLE_LIST(1);
            });
        }
        else {
            $scope.$parent.ShowAlert("Attention", "Please Select Entity From The List", 3000); return false;
        }
    };


});
app.controller('GroupController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    if (getUrlParameter('add', $location.absUrl()) != undefined)
        $scope.$parent.PAGE_HEADER = "Add Group";
    else
        $scope.$parent.PAGE_HEADER = "Group List";

    $scope.COMMON_CODE_CHANGE();
    $scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.Add_GRP = getUrlParameter('add', $location.absUrl());
    $scope.$parent.urlpath = "Grp";
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.EMPLOYEE_CATEGORY = [];
    $scope.SUB_EMPLOYEE_CATEGORY = [];
    $scope.AREA_BY_LIST = [];
    $scope.GROUP_LIST = [];
    $scope.LOCATION = [];
    $scope.POSITION_LIST = [];

    //if ($scope.GRP_ID == undefined) { window.location.href = '../Main/Admin#!/Grp'}
    //$scope.IS_MANAGER_GROUP = [
    //    { IS_MANAGER_GROUP_ID: '', DISPLAY: "- Please Select -" },
    //    { IS_MANAGER_GROUP_ID: -1, DISPLAY: "Everyone" },
    //    { IS_MANAGER_GROUP_ID: 0, DISPLAY: "Employee" },
    //    { IS_MANAGER_GROUP_ID: 1, DISPLAY: "Manager" }];

    $scope.GroupSearch = {
        GROUP_NAME: '',
        GROUP_DESCRIPTION: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        IS_MANAGER_GROUP: -1,
        IS_ADMIN_GROUP: -1, CLICK_SEARCH: null
    };
    $scope.ResetBRN = function () {
        $scope.GroupSearch = {
            GROUP_NAME: '',
            GROUP_DESCRIPTION: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null, CLICK_SEARCH: null
        };
        $scope.GRPForm.submitted = false; ENTITY_ID: null;
        $scope.ENTITY_LIST = [];
        $scope.EMPLOYEE_CATEGORY = [];
        $scope.SUB_EMPLOYEE_CATEGORY = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.COST_CENTER_LIST = [];
        $scope.SUB_CATEGORY_LIST = [];
        $scope.GROUP_LIST = [];
        //$scope.CUSTOMER_LIST = null;
        $scope.EMPLOYEE_CATEGORY = [];
        $scope.POSITION_LIST = [];
    };
    $scope.RESET_GROUP_LIST = function () {
        $scope.GroupSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CLICK_SEARCH: null
        };
        $scope.GroupSearch.IS_MANAGER_GROUP = -1;
        $scope.GrpForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.EMPLOYEE_CATEGORY = [];
        $scope.SUB_EMPLOYEE_CATEGORY = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.COST_CENTER_LIST = [];
        $scope.SUB_CATEGORY_LIST = [];
        $scope.GROUP_LIST = [];
        $scope.EMPLOYEE_CATEGORY = [];
        $scope.POSITION_LIST = [];
        $scope.GET_GROUP_MAPPING(2);
    };
    $scope.GET_CURRENCY = function () {
        var GrpModelObj = new Object();
        PrcCommMethods.HR_API(GrpModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY = data.data.Table;
        });
    };
    $scope.GET_COUNTRY = function () {
        var GrpModelObj = new Object();
        PrcCommMethods.HR_API(GrpModelObj, 'GET_COUNTRY').then(function (data) {
            $scope.COUNTRY = data.data.Table;
        });
    };
    //$scope.GET_CURRENCY = function () {
    //    var GrpModelObj = new Object();
    //    GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
    //    PrcCommMethods.HR_API(GrpModelObj, 'GET_CURRENCY').then(function (data) {
    //        $scope.CURRENCY = data.data.Table;
    //    });
    //};

    $scope.GET_ENTITY_LIST = function () {
        if ($scope.RoleSearch.CUSTOMER_ID != undefined || '' || null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.LAZY_GET_GROUP_MAPPING = function () { $scope.GET_GROUP_MAPPING(); };
    $scope.GET_GROUP_MAPPING = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var GrpModelObj = new Object();
        if (FLAG == 1) {
            $scope.GroupSearch.CLICK_SEARCH = 1;
            $scope.GROUP_LIST = [];
            $scope.GroupSearch.PAGE_NO = 1;
            GrpModelObj.ACTIVE = $scope.GroupSearch.ACTIVE == -1 ? -1 : $scope.GroupSearch.ACTIVE ? 1 : 0;
            GrpModelObj.IS_MANAGER_GROUP = $scope.GroupSearch.IS_MANAGER_GROUP == -1 ? -1 : $scope.GroupSearch.IS_MANAGER_GROUP == 1 ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.GROUP_LIST = [];
            $scope.GroupSearch.PAGE_NO = 1;
            GrpModelObj.ACTIVE = $scope.GroupSearch.ACTIVE == -1 ? -1 : $scope.GroupSearch.ACTIVE ? 1 : 0;
            GrpModelObj.IS_MANAGER_GROUP = $scope.GroupSearch.IS_MANAGER_GROUP == -1 ? -1 : $scope.GroupSearch.IS_MANAGER_GROUP == 1 ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.GroupSearch.CLICK_SEARCH == 1) {
                GrpModelObj.ACTIVE = $scope.GroupSearch.ACTIVE == -1 ? -1 : $scope.GroupSearch.ACTIVE ? 1 : 0;
                GrpModelObj.IS_MANAGER_GROUP = $scope.GroupSearch.IS_MANAGER_GROUP == -1 ? -1 : $scope.GroupSearch.IS_MANAGER_GROUP == 1 ? 1 : 0;
            }
            else {
                GrpModelObj.ACTIVE = -1;
                GrpModelObj.IS_MANAGER_GROUP = 1;
            }
        }

        GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.CUSTOMER_ID : null;
        GrpModelObj.GROUP_NAME = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.GROUP_NAME : '';
        GrpModelObj.GROUP_DESCRIPTION = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.GROUP_DESCRIPTION : '';
        GrpModelObj.GROUP_CODE = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.GROUP_CODE : null;
        GrpModelObj.ENTITY_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.ENTITY_ID : null;
        GrpModelObj.COST_CENTER_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.COST_CENTER_IDS : '';
        GrpModelObj.LOCATION_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.LOCATION_IDS : '';
        GrpModelObj.BRANCH_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.BRANCH_IDS : '';
        GrpModelObj.AREA_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.AREA_IDS : '';
        GrpModelObj.CATEGORY_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.CATEGORY_IDS : '';
        GrpModelObj.SUB_CATEGORY_IDS = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.SUB_CATEGORY_IDS : '';
        GrpModelObj.POSITION_ID = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.POSITION_ID : null;
        //GrpModelObj.ACTIVE = $scope.GroupSearch.ACTIVE;
        GrpModelObj.PAGE_NO = $scope.GroupSearch.PAGE_NO;
        GrpModelObj.PAGE_SIZE = $scope.GroupSearch.PAGE_SIZE;
        GrpModelObj.GROUP_ID = $scope.GRP_ID;
        GrpModelObj.MODULE_ID = 0;//parseInt($cookies.get("MODULE_ID"));
        //GrpModelObj.IS_MANAGER_GROUP = $scope.GroupSearch.CLICK_SEARCH == 1 ? $scope.GroupSearch.IS_MANAGER_GROUP;
        PrcCommMethods.ADMIN_API(GrpModelObj, 'GET_GROUP_MAPPING').then(function (data) {
            //$scope.GROUP_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.GROUP_LIST = $scope.GROUP_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.GroupSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.GroupSearch.PAGE_NO = parseInt($scope.GroupSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else
                $scope.GetData = false;

            //if ($scope.GRP_ID > 0) {
            //    if (data.data.Table.length > 0) {
            //        $scope.UPD_GROUP_MAPPING(data.data.Table[0]);
            //    }
            //}

            document.getElementById("overlay_loading").style.display = "none";
        });
        //}
        //}
    };
    $scope.GET_GROUP_MAPPING();
    $scope.GET_HR_COST_CENTER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_HR_COST_CENTER').then(function (data) {
            $scope.COST_CENTER_LIST = data.data.Table;
        });
    };

    $scope.GET_LOCATION = function () {
        //var ENT = $scope.ENTITY_LIST.filter(function (x) { return x.ENTITY_ID == $scope.GroupSearch.ENTITY_ID })
        if ($scope.GroupSearch.ENTITY_ID != null && $scope.GroupSearch.ENTITY_ID != undefined) {
            var GET_ALL = new Object()
            GET_ALL.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            GET_ALL.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            GET_ALL.LOCATION_CODE = $scope.GroupSearch.LOCATION_CODE;//ENT[0].ENTITY_ID;
            GET_ALL.LOCATION_NAME = $scope.GroupSearch.LOCATION_NAME;//ENT[0].CUSTOMER_ID;
            GET_ALL.ACTIVE = 1;
            GET_ALL.PAGE_NO = 0 //$scope.GroupSearch.PAGE_NO;
            GET_ALL.PAGE_SIZE = 0//1000;
            PrcCommMethods.ADMIN_API(GET_ALL, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
            //$scope.GET_BRANCH_LIST();
            $scope.ADMIN_GET_COST_CENTER();
            $scope.GroupSearch.CATEGORY_ID = null;
            $scope.HR_GET_EMPLOYEE_CATEGORY();
            $scope.ADMIN_GET_BRANCH();
            $scope.ADMIN_GET_POSITION();
        }
        else {
            $scope.EMPLOYEE_CATEGORY = [];
            $scope.SUB_CATEGORY_LIST = [];
            $scope.LOCATION = [];
            $scope.COST_CENTER_LIST = [];
            $scope.POSITION_LIST = [];
            $scope.BRANCH_LIST = [];

        }

    };
    $scope.GET_BRANCH_LIST = function () {
        var GET_ALL = new Object();
        GET_ALL.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
        PrcCommMethods.DASHBOARD_API(GET_ALL, 'GET_BRANCH_LIST').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    };

    $scope.GET_EMPLOYEE_CATEGORY = function (FLAG) {
        GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
        GrpModelObj.CATEGORY_NAME = '';
        GrpModelObj.ACTIVE = 1;
        GrpModelObj.PAGE_NO = 0;
        GrpModelObj.PAGE_SIZE = 0;
        GrpModelObj.CAT_LEVEL = 1;
        GrpModelObj.MODULE_ID = 2;
        GrpModelObj.PARENT_ID = 0;
        GrpModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
        PrcCommMethods.HR_API(GrpModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            $scope.EMPLOYEE_CATEGORY = data.data.Table;
        });
    };
    //$scope.GET_EMPLOYEE_CATEGORY();
    $scope.GET_ENTITY_LIST = function () {

        if ($scope.GroupSearch.CUSTOMER_ID != undefined || '' || null) {
            var GET_ALL = new Object();
            GET_ALL.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            GET_ALL.ACTIVE = 1;
            GET_ALL.PAGE_NO = 0;
            GET_ALL.USER_ID = parseInt($cookies.get("USERID"));
            GET_ALL.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(GET_ALL, 'ADMIN_GET_ENTITIES').then(function (data) {
                $scope.ENTITY_LIST = data.data.Table;
            });

        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var GrpModelObj = new Object();
        GrpModelObj.CUSTOMER_NAME = '';
        GrpModelObj.CUSTOMER_CODE = '';
        GrpModelObj.ACTIVE = 1;
        GrpModelObj.PAGE_NO = 1;
        GrpModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        GrpModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(GrpModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.GroupSearch.ENTITY_ID != null) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            BrnModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
            BrnModelObj.BRANCH_CODE = $scope.GroupSearch.BRANCH_CODE;
            BrnModelObj.BRANCH_NAME = $scope.GroupSearch.BRANCH_NAME;
            BrnModelObj.CONTACT_NAME = $scope.GroupSearch.CONTACT_NAME;
            BrnModelObj.LOCATION_IDS = null;//$scope.GroupSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 0//$scope.GroupSearch.PAGE_NO;
            BrnModelObj.PAGE_SIZE = 0//$scope.GroupSearch.PAGE_SIZE;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data == null && (data.data == undefined || data.data == null))
                    $scope.BRANCH_LIST = [];
                else { $scope.BRANCH_LIST = data.data.Table; }
            });
        }
        else { $scope.BRANCH_LIST = []; }
    };
    $scope.ADMIN_GET_COST_CENTER = function () {

        var GrpModelObj = new Object();
        GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
        GrpModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
        GrpModelObj.USER_ID = parseInt($cookies.get("USERID"));
        GrpModelObj.COST_CENTER_CODE = '';//$scope.CostCenterSearch.COST_CENTER_CODE;
        GrpModelObj.COST_CENTER_DESCRIPTION = '';//$scope.CostCenterSearch.COST_CENTER_DESCRIPTION;
        GrpModelObj.ACTIVE = 1;//$scope.CostCenterSearch.ACTIVE;
        GrpModelObj.PAGE_NO = 1;//$scope.CostCenterSearch.PAGE_NO;
        GrpModelObj.PAGE_SIZE = 1000;//$scope.CostCenterSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(GrpModelObj, 'ADMIN_GET_COST_CENTER').then(function (data) {
            $scope.COST_CENTER_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_EMPLOYEE_CATEGORY = function () {
        if ($scope.GroupSearch.ENTITY_ID != undefined) {
            var EMPModelObj = new Object();
            EMPModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            //EMPModelObj.CATEGORY_NAME = $scope.EmpCatSearch.SUB_CATEGORY_NAME;
            EMPModelObj.ACTIVE = 1;
            EMPModelObj.PAGE_NO = 0 //$scope.GroupSearch.PAGE_NO;
            EMPModelObj.PAGE_SIZE = 0// $scope.GroupSearch.PAGE_SIZE;
            EMPModelObj.CAT_LEVEL = 1;
            EMPModelObj.MODULE_ID = 2;
            EMPModelObj.PARENT_ID = 0;
            EMPModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
            EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_EMPLOYEE_CATEGORY').then(function (data) {
                $scope.EMPLOYEE_CATEGORY = data.data.Table;
                $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY();
            });
        }
        else
            $scope.CATEGORY_LIST = [];
    };
    $scope.ADMIN_GET_EMPLOYEE_SUB_CATEGORY = function () {

        var EMPModelObj = new Object();
        EMPModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
        EMPModelObj.CATEGORY_NAME = '';
        EMPModelObj.ACTIVE = 1;
        EMPModelObj.PAGE_NO = 0;
        EMPModelObj.PAGE_SIZE = 0;
        EMPModelObj.CAT_LEVEL = 2;
        EMPModelObj.MODULE_ID = 2;
        EMPModelObj.PARENT_ID = 0;
        EMPModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
        EMPModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(EMPModelObj, 'ADMIN_GET_EMPLOYEE_SUB_CATEGORY').then(function (data) {
            $scope.SUB_CATEGORY_LIST = data.data.Table;
        });
    };

    $scope.SUB_GET_EMPLOYEE_CATEGORY = function () {
        if ($scope.GroupSearch.CATEGORY_ID != null && $scope.GroupSearch.CATEGORY_ID != undefined) {
            var PosiModelObj = new Object();
            PosiModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            PosiModelObj.CAT_LEVEL = 2;
            PosiModelObj.MODULE_ID = 2;
            PosiModelObj.PARENT_ID = $scope.GroupSearch.CATEGORY_ID;
            PosiModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
            PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
                $scope.SUB_EMPLOYEE_CATEGORY = data.data.Table;
            });
        }
        else
            $scope.SUB_EMPLOYEE_CATEGORY = [];
    };
    $scope.EDIT_GROUP_MAPPING = function (GRP) {
        $scope.$parent.EditObject = GRP;
        //$location.path('Setup_CreateEntity').search({ e: 1 });
        $location.path('Grp');
    };
    $scope.EDIT_GROUP_ROLE_ASSIGNMENT = function (GROUP_LIST) {
        $scope.$parent.EditObject = [];
        $scope.$parent.EditObject = GROUP_LIST;
        //$location.path('Ass_Grp_lst');

    };
    $scope.UPD_GROUP_MAPPING = function () {
        var STRING_INT_ARRAY;
        if ($scope.GRP_ID != null && $scope.$parent.EditObject != null) {
            var GRP = $scope.$parent.EditObject;
            $scope.GroupSearch.GROUP_NAME = GRP.GROUP_NAME;
            $scope.GroupSearch.GROUP_DESCRIPTION = GRP.GROUP_DESCRIPTION;
            $scope.GroupSearch.GROUP_CODE = GRP.GROUP_CODE;
            $scope.GroupSearch.AREA_ID = GRP.AREA_ID;
            $scope.GroupSearch.ACTIVE = GRP.ACTIVE;
            $scope.GroupSearch.CUSTOMER_ID = GRP.CUSTOMER_ID;
            $scope.GET_ENTITY_LIST();
            $scope.GroupSearch.ENTITY_ID = GRP.ENTITY_ID;
            $scope.GET_LOCATION();
            $scope.ADMIN_GET_COST_CENTER();
            $scope.ADMIN_GET_BRANCH();
            $scope.HR_GET_EMPLOYEE_CATEGORY();
            $scope.SUB_GET_EMPLOYEE_CATEGORY();
            $scope.GroupSearch.LOCATION_ID = $scope.GET_UNIQUE_ID(GRP.LOCATION_ID);
            $scope.GroupSearch.BRANCH_ID = $scope.GET_UNIQUE_ID(GRP.BRANCH_ID);
            $scope.GroupSearch.COST_CENTER_ID = $scope.GET_UNIQUE_ID(GRP.COST_CENTER_ID);
            $scope.GroupSearch.CATEGORY_ID = $scope.GET_UNIQUE_ID(GRP.CATEGORY_ID);
            $scope.GroupSearch.SUB_CATEGORY_ID = $scope.GET_UNIQUE_ID(GRP.SUB_CATEGORY_ID);
            $scope.GroupSearch.POSITION_ID = $scope.GET_UNIQUE_ID(GRP.POSITION_ID);
            $scope.GroupSearch.IS_MANAGER_GROUP = GRP.IS_MANAGER_GROUP;
            $scope.GroupSearch.IS_ADMIN_GROUP = GRP.IS_ADMIN_GROUP;
        }
        else {
            if ($scope.Add_GRP != 'nGrp') {
                $scope.ENTITY_LIST = [];
                $scope.EMPLOYEE_CATEGORY = [];
                $scope.SUB_EMPLOYEE_CATEGORY = [];
                $scope.AREA_BY_LIST = [];
                $scope.COST_CENTER_LIST = [];
                $scope.SUB_CATEGORY_LIST = [];
                $scope.GROUP_LIST = [];
                $scope.CUSTOMER_LIST = [];
                $scope.EMPLOYEE_CATEGORY = [];
                window.location.href = '../Main/Admin#!/Grp';
            }
        }
    };
    $scope.ADMIN_INS_UPD_GROUP_MASTER = function (ACTIVE) {
        $scope.GRPForm.submitted = true;
        if ($scope.GRPForm.$valid) {

            var GrpModelObj = new Object();
            GrpModelObj.GROUP_ID = $scope.GRP_ID;
            GrpModelObj.GROUP_NAME = $scope.GroupSearch.GROUP_NAME;
            GrpModelObj.GROUP_DESCRIPTION = $scope.GroupSearch.GROUP_DESCRIPTION;
            GrpModelObj.GROUP_CODE = $scope.GroupSearch.GROUP_CODE;
            GrpModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
            GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            GrpModelObj.ACTIVE = $scope.GroupSearch.ACTIVE == -1 ? 0 : ($scope.GroupSearch.ACTIVE == true ? 1 : 0);
            GrpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            GrpModelObj.MODULE_ID = 2;
            GrpModelObj.COMMENTS = $scope.GroupSearch.COMMENTS;
            GrpModelObj.IS_MANAGER_GROUP = $scope.GroupSearch.IS_MANAGER_GROUP == true ? 1 : 0;
            GrpModelObj.IS_ADMIN_GROUP = $scope.GroupSearch.IS_ADMIN_GROUP == true ? 1 : 0;
            GrpModelObj.GRP_MAPPING = [];
            var ArrayObject = {};
            var obj_count = 0;
            if ($scope.GroupSearch.LOCATION_ID != undefined && $scope.GroupSearch.LOCATION_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.LOCATION_ID;
                ArrayObject["Array" + obj_count].ID = 1;
                obj_count++;

            }
            if ($scope.GroupSearch.BRANCH_ID != undefined && $scope.GroupSearch.BRANCH_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.BRANCH_ID;
                ArrayObject["Array" + obj_count].ID = 2;
                obj_count++;

            }
            if ($scope.GroupSearch.COST_CENTER_ID != undefined && $scope.GroupSearch.COST_CENTER_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.COST_CENTER_ID;
                ArrayObject["Array" + obj_count].ID = 3;
                obj_count++;

            }
            if ($scope.GroupSearch.CATEGORY_ID != undefined && $scope.GroupSearch.CATEGORY_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.CATEGORY_ID;
                ArrayObject["Array" + obj_count].ID = 4;
                obj_count++;

            }
            if ($scope.GroupSearch.SUB_CATEGORY_ID != undefined && $scope.GroupSearch.SUB_CATEGORY_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.SUB_CATEGORY_ID;
                ArrayObject["Array" + obj_count].ID = 5;
                obj_count++;
            }
            if ($scope.GroupSearch.POSITION_ID != undefined && $scope.GroupSearch.POSITION_ID.length > 0) {
                ArrayObject["Array" + obj_count] = {};
                ArrayObject["Array" + obj_count].Array = $scope.GroupSearch.POSITION_ID;
                ArrayObject["Array" + obj_count].ID = 6;
                obj_count++;
            }
            if (obj_count > 0) {
                angular.forEach(ArrayObject.Array0.Array, function (vala) {
                    if (obj_count > 1) {
                        angular.forEach(ArrayObject.Array1.Array, function (valb) {
                            if (obj_count > 2) {
                                angular.forEach(ArrayObject.Array2.Array, function (valc) {
                                    if (obj_count > 3) {
                                        angular.forEach(ArrayObject.Array3.Array, function (vald) {
                                            if (obj_count > 4) {
                                                angular.forEach(ArrayObject.Array4.Array, function (vale) {
                                                    if (obj_count > 5) {
                                                        angular.forEach(ArrayObject.Array5.Array, function (valf) {
                                                            var RoleObj = new Object();
                                                            RoleObj.LOCATION_ID = vala;
                                                            RoleObj.BRANCH_ID = valb;
                                                            RoleObj.AREA_ID = null;
                                                            RoleObj.COST_CENTER_ID = valc;
                                                            RoleObj.CATEGORY_ID = vald;
                                                            RoleObj.SUB_CATEGORY_ID = vale;
                                                            RoleObj.POSITION_ID = valf;
                                                            GrpModelObj.GRP_MAPPING.push(RoleObj);
                                                        });
                                                    }
                                                    else {
                                                        var RoleObj = new Object();

                                                        RoleObj.LOCATION_ID = ArrayObject.Array0.ID == 1 ? vala : null;
                                                        RoleObj.BRANCH_ID = ArrayObject.Array0.ID == 2 ? vala : ArrayObject.Array1.ID == 2 ? valb : null;
                                                        RoleObj.AREA_ID = null;
                                                        RoleObj.COST_CENTER_ID = ArrayObject.Array1.ID == 3 ? valb : ArrayObject.Array2.ID == 3 ? valc : null;
                                                        RoleObj.CATEGORY_ID = ArrayObject.Array2.ID == 4 ? valc : ArrayObject.Array3.ID == 4 ? vald : null;
                                                        RoleObj.SUB_CATEGORY_ID = ArrayObject.Array3.ID == 5 ? vald : ArrayObject.Array4.ID == 5 ? vale : null;
                                                        RoleObj.POSITION_ID = ArrayObject.Array4.ID == 6 ? vale : null;
                                                        GrpModelObj.GRP_MAPPING.push(RoleObj);
                                                    }

                                                });
                                            }
                                            else {
                                                var RoleObj = new Object();
                                                RoleObj.LOCATION_ID = ArrayObject.Array0.ID == 1 ? vala : null;
                                                RoleObj.BRANCH_ID = ArrayObject.Array0.ID == 2 ? vala : ArrayObject.Array1.ID == 2 ? valb : null;
                                                RoleObj.AREA_ID = null;
                                                RoleObj.COST_CENTER_ID = ArrayObject.Array0.ID == 3 ? vala : ArrayObject.Array1.ID == 3 ? valb : ArrayObject.Array2.ID == 3 ? valc : null;
                                                RoleObj.CATEGORY_ID = ArrayObject.Array1.ID == 4 ? valc : ArrayObject.Array2.ID == 4 ? valc : ArrayObject.Array3.ID == 4 ? vald : null;
                                                RoleObj.SUB_CATEGORY_ID = ArrayObject.Array2.ID == 5 ? valc : ArrayObject.Array3.ID == 5 ? vald : null;
                                                RoleObj.POSITION_ID = ArrayObject.Array3.ID == 6 ? vald : null;
                                                GrpModelObj.GRP_MAPPING.push(RoleObj);
                                            }
                                        });
                                    }
                                    else {
                                        var RoleObj = new Object();
                                        RoleObj.LOCATION_ID = ArrayObject.Array0.ID == 1 ? vala : null;
                                        RoleObj.BRANCH_ID = ArrayObject.Array0.ID == 2 ? vala : ArrayObject.Array1.ID == 2 ? valb : null;
                                        RoleObj.AREA_ID = null;
                                        RoleObj.COST_CENTER_ID = ArrayObject.Array0.ID == 3 ? vala : ArrayObject.Array1.ID == 3 ? valb : ArrayObject.Array2.ID == 3 ? valc : null;
                                        RoleObj.CATEGORY_ID = ArrayObject.Array0.ID == 4 ? vala : ArrayObject.Array1.ID == 4 ? valb : ArrayObject.Array2.ID == 4 ? valc : null;
                                        RoleObj.SUB_CATEGORY_ID = ArrayObject.Array1.ID == 5 ? valb : ArrayObject.Array2.ID == 5 ? valc : null;
                                        RoleObj.POSITION_ID = ArrayObject.Array2.ID == 6 ? valc : null;
                                        GrpModelObj.GRP_MAPPING.push(RoleObj);
                                    }
                                });

                            }
                            else {
                                var RoleObj = new Object();
                                RoleObj.LOCATION_ID = ArrayObject.Array0.ID == 1 ? vala : null;
                                RoleObj.BRANCH_ID = ArrayObject.Array0.ID == 2 ? vala : ArrayObject.Array1.ID == 2 ? valb : null;
                                RoleObj.AREA_ID = null;
                                RoleObj.COST_CENTER_ID = ArrayObject.Array0.ID == 3 ? vala : ArrayObject.Array1.ID == 3 ? valb : null;
                                RoleObj.CATEGORY_ID = ArrayObject.Array0.ID == 4 ? vala : ArrayObject.Array1.ID == 4 ? valb : null;
                                RoleObj.SUB_CATEGORY_ID = ArrayObject.Array0.ID == 5 ? vala : ArrayObject.Array1.ID == 5 ? valb : null;
                                RoleObj.POSITION_ID = ArrayObject.Array1.ID == 6 ? valb : null;
                                GrpModelObj.GRP_MAPPING.push(RoleObj);
                            }

                        });
                    }
                    else {
                        var RoleObj = new Object();

                        RoleObj.LOCATION_ID = ArrayObject.Array0.ID == 1 ? vala : null;
                        RoleObj.BRANCH_ID = ArrayObject.Array0.ID == 2 ? vala : null;
                        RoleObj.AREA_ID = null;
                        RoleObj.COST_CENTER_ID = ArrayObject.Array0.ID == 3 ? vala : null;
                        RoleObj.CATEGORY_ID = ArrayObject.Array0.ID == 4 ? vala : null;
                        RoleObj.SUB_CATEGORY_ID = ArrayObject.Array0.ID == 5 ? vala : null;
                        RoleObj.POSITION_ID = ArrayObject.Array0.ID == 6 ? vala : null;
                        GrpModelObj.GRP_MAPPING.push(RoleObj);
                    }
                });
            }
            else {
                var RoleObj = new Object();
                RoleObj.COST_CENTER_ID = null;
                RoleObj.LOCATION_ID = null;
                RoleObj.BRANCH_ID = null;
                RoleObj.AREA_ID = null;
                RoleObj.CATEGORY_ID = null;
                RoleObj.SUB_CATEGORY_ID = null;
                RoleObj.POSITION_ID = null;
                GrpModelObj.GRP_MAPPING.push(RoleObj);
            }
            PrcCommMethods.ADMIN_API(GrpModelObj, 'INS_UPD_GROUP_MAPPING').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlert('Success', 'Group Added Successfully', 3000);
                    //$scope.ResetBRN();
                    window.location.href = '../Main/Admin#!/Grp';
                }
            });

        }
    };

    $scope.GET_UNIQUE_ID = function (COMMA_ADDED_STRING) {
        if (COMMA_ADDED_STRING != null) {
            //var LOC = COMMA_ADDED_STRING.split(' ,')
            //var uniqueLOC = LOC.filter((x, i, a) => a.indexOf(x) == i);
            //STRING_INT_ARRAY = uniqueLOC.map(function (v) {
            //    return parseInt(v, 10);
            //});
            //COMMA_ADDED_STRING.split(',').forEach(function (item) {
            //    STRING_INT_ARRAY.push(parseInt(item))
            //});
            var STRING_INT_ARRAY = COMMA_ADDED_STRING.split(',').map(function (strVale) { return Number(strVale); });
        }
        else
            STRING_INT_ARRAY = null;

        return STRING_INT_ARRAY;
    };
    $scope.ADMIN_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;;
        PosiModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;;
        PosiModelObj.ACTIVE = 1;
        PosiModelObj.FLAG = 2;
        PosiModelObj.PAGE_NO = 0;
        PosiModelObj.EMP_PRS_ID = '';
        PosiModelObj.ADMIN_FLAG = 1;
        PosiModelObj.SORT_COLUMN_NO = 1;
        PosiModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            //$scope.POSITION_LIST = data.data.Table;
            if (data.data.Table.length > 0) {
                $scope.POSITION_LIST = data.data.Table;
            }
            else {
                $scope.POSITION_LIST = [];
            }
        });
    };
});
app.controller('AssignController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Group Role Mapping";
    $scope.$parent.urlpath = "Ass_Grp_lst";
    //$scope.GRP_ID = getUrlParameter('ID', $location.absUrl());
    $scope.EDIT_MODE = null;
    $scope.GROUP_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.GROUP_ROLE_ASSIGNMENTS_LIST = [];
    $scope.GROUP_ROLE_IDS_EDIT = null;
    $scope.GroupSearch = {
        GROUP_NAME: '',
        GROUP_DESCRIPTION: '',
        ACTIVE: 1,
        PAGE_NO: 1,
        PAGE_SIZE: 10, CUSTOMER_ID: null,
        ENTITY_ID: null, GROUP_ID: null,
        CLICK_SEARCH: null,
    };
    $scope.ResetGROUPMAPPING = function () {
        $scope.GroupSearch = {
            GROUP_NAME: '',
            GROUP_DESCRIPTION: '',
            ACTIVE: 1,
            PAGE_NO: 1,
            PAGE_SIZE: 10, CUSTOMER_ID: null,
            ENTITY_LIST: null, GROUP_ID: null,
            CLICK_SEARCH: null, ENTITY_ID: null
        };
        $scope.ENTITY_LIST = []; $scope.GROUP_LIST = [];
        $scope.EDIT_MODE = null;
        if ($scope.ROLE_LIST != null || $scope.ROLE_LIST != undefined) {
            for (var i = 0; i < $scope.ROLE_LIST.length; i++) {
                $scope.ROLE_LIST[i].SELECTED = false;
            }
        }
        $scope.ROLE_LIST = [];
        $scope.GROUP_LIST = [];
        $scope.GROUP_ROLE_ASSIGNMENTS_LIST = [];
        $scope.GRPForm.submitted = false;
        $scope.GET_GROUP_ROLE_ASSIGNMENTS();
    };
    $scope.GET_ROLE_LIST = function () {
        if ($scope.GroupSearch.ENTITY_ID != null) {
            var AssinGrpModelObj = new Object();
            AssinGrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID != null ? $scope.GroupSearch.CUSTOMER_ID : null;
            AssinGrpModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID != null ? $scope.GroupSearch.ENTITY_ID : null;
            AssinGrpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            AssinGrpModelObj.ACTIVE = 1;
            AssinGrpModelObj.PAGE_NO = 1;
            AssinGrpModelObj.PAGE_SIZE = 100;
            PrcCommMethods.ADMIN_API(AssinGrpModelObj, 'GET_ROLE_LIST').then(function (data) {
                $scope.ROLE_LIST = data.data.Table;
            });
        }
        else
            $scope.ROLE_LIST = [];
    };
    $scope.GET_ROLE_DETAILS_BY_ID = function () {

        //if ($scope.GRP_ID != null) {
        var BrnModelObj = new Object();
        BrnModelObj.ROLE_ID = $scope.GRP_ID;
        BrnModelObj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));;
        PrcCommMethods.ADMIN_API(BrnModelObj, 'GET_ROLE_DETAILS_BY_ID').then(function (data) {
            $scope.GROUP_LIST = data.data.Table;
        });
        //}
    };
    $scope.GET_GROUP_ROLE_ASSIGNMENT_BY_ID = function () {
        $scope.GROUP_ROLE_ASSIGNMENTS_LIST = [];
        //$scope.GET_ROLE_LIST();
        if ($scope.GRP_ID != null && $scope.GRP_ID != undefined) {
            $scope.GroupSearch = $scope.$parent.EditObject;
            $scope.GET_GROUP_ROLE_ASSIGNMENTS();
            $scope.GET_ENTITY_LIST();
            $scope.GET_GROUP_MAPPING_LIST();
            //$scope.GroupSearch.GROUP_ID = $scope.$parent.EditObject.GROUP_MAPPING_ID;

        }
        else
            $scope.GET_GROUP_ROLE_ASSIGNMENTS();
        //$scope.InitializeRole($scope.ROLE_LIST);
    };
    $scope.GET_GROUP_MAPPING_LIST = function () {
        if ($scope.GroupSearch.ENTITY_ID != undefined) {
            var GrpModelObj = new Object();
            GrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            GrpModelObj.GROUP_NAME = '';
            GrpModelObj.GROUP_DESCRIPTION = '';
            GrpModelObj.GROUP_CODE = '';
            GrpModelObj.ENTITY_IDS = $scope.GroupSearch.ENTITY_ID;
            GrpModelObj.COST_CENTER_IDS = '';
            GrpModelObj.LOCATION_IDS = '';
            GrpModelObj.BRANCH_IDS = '';
            GrpModelObj.AREA_IDS = '';
            GrpModelObj.CATEGORY_IDS = '';
            GrpModelObj.ACTIVE = 1;
            GrpModelObj.PAGE_NO = 0;
            GrpModelObj.PAGE_SIZE = 0;
            GrpModelObj.GROUP_ID = '';//$scope.GroupSearch.GROUP_ID;
            GrpModelObj.MODULE_ID = 0;//parseInt($cookies.get("MODULE_ID"));
            GrpModelObj.IS_MANAGER_GROUP = -1;//parseInt($cookies.get("MODULE_ID"));
            PrcCommMethods.ADMIN_API(GrpModelObj, 'GET_GROUP_MAPPING').then(function (data) {
                if (data.data.Table != undefined && data.data.Table.length > 0) {
                    $scope.GROUP_LIST = data.data.Table;
                }
                else {
                    $scope.$parent.ShowAlert('Attention', 'No Record Found', 3000);
                    $scope.ROLE_LIST = [];
                    $scope.GROUP_LIST = [];
                }
                //if ($scope.GRP_ID > 0) {
                //    if (data.data.Table.length > 0) {
                //        $scope.UPD_GROUP_MAPPING(data.data.Table[0]);
                //    }
                //}
            });
        }
        else {
            //$scope.GroupSearch.ENTITY_ID = undefined;
            $scope.ROLE_LIST = [];
            $scope.GROUP_LIST = [];
        }

    };
    $scope.GET_BRANCH_LIST = function () {
        var GET_ALL = new Object();
        GET_ALL.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
        PrcCommMethods.DASHBOARD_API(GET_ALL, 'GET_BRANCH_LIST').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    };
    $scope.GET_EMPLOYEE_CATEGORY = function (FLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
        PosiModelObj.CAT_LEVEL = 1;
        PosiModelObj.MODULE_ID = 2;
        PosiModelObj.PARENT_ID = 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_CATEGORY').then(function (data) {
            $scope.EMPLOYEE_CATEGORY = data.data.Table;
        });
    };
    $scope.LAZY_GET_GROUP_ROLE_ASSIGNMENTS = function () {
        $scope.GET_GROUP_ROLE_ASSIGNMENTS();
    };
    $scope.GET_GROUP_ROLE_ASSIGNMENTS = function () {
        if ($scope.GroupSearch.CUSTOMER_ID != null && $scope.GroupSearch.ENTITY_ID != null) {
            var AssinGrpModelObj = new Object();
            AssinGrpModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID == null ? 0 : $scope.GroupSearch.CUSTOMER_ID;
            AssinGrpModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID == null ? 0 : $scope.GroupSearch.ENTITY_ID;
            AssinGrpModelObj.USER_ID = parseInt($cookies.get("USERID"));
            AssinGrpModelObj.GROUP_ID = $scope.GroupSearch.GROUP_ID == null ? 0 : $scope.GroupSearch.GROUP_ID;//$scope.GRP_ID == null ? 0 : $scope.GRP_ID;
            PrcCommMethods.ADMIN_API(AssinGrpModelObj, 'GET_GROUP_ROLE_ASSIGNMENTS').then(function (data) {
                //$scope.GROUP_ROLE_ASSIGNMENTS_LIST = data.data.Table;
                if (data.data.Table.length > 0) {
                    $scope.GROUP_ROLE_ASSIGNMENTS_LIST = data.data.Table;
                    //if (data.data.Table.length < $scope.GroupSearch.PAGE_SIZE) {
                    //    $scope.GetData = false;
                    //}
                    //else {
                    //    $scope.GroupSearch.PAGE_NO = parseInt($scope.GroupSearch.PAGE_NO) + 1;
                    //    $scope.GetData = true;
                    //}
                }
                else {
                    $scope.GetData = false;
                }

                if ($scope.GRP_ID != null && $scope.GRP_ID != 0) {
                    if ($scope.GROUP_ROLE_ASSIGNMENTS_LIST[0] != undefined) {
                        $scope.EDIT_MODE = 1;
                        $scope.GROUP_ROLE_IDS_EDIT = $scope.GROUP_ROLE_ASSIGNMENTS_LIST[0].ROLE_IDS.split(",");
                    }
                    //$scope.GET_ROLE_LIST();

                }


            });
        }
    };
    $scope.AR_ALL_SELECT = function (Role_List, Flag) {
        angular.forEach(Role_List, function (item) { $scope.GroupSearch.HEADER == true ? item.SELECTED = true : item.SELECTED = false; });
    };
    $scope.GET_ENTITY_LIST = function () {

        if ($scope.GroupSearch.CUSTOMER_ID != undefined && $scope.GroupSearch.CUSTOMER_ID != '' && $scope.GroupSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };

    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var GrpModelObj = new Object();
        GrpModelObj.CUSTOMER_NAME = '';
        GrpModelObj.CUSTOMER_CODE = '';
        GrpModelObj.ACTIVE = 1;
        GrpModelObj.PAGE_NO = 1;
        GrpModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        GrpModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(GrpModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    //$scope.InitializeRole = function (Role) {
    //    Role.SELECTED = false;
    //    if ($scope.EDIT_MODE == 1) {
    //        if (Role != null) {
    //            for (var i = 0; i < $scope.GROUP_ROLE_IDS_EDIT.length; i++) {
    //                if ($scope.GROUP_ROLE_IDS_EDIT[i] == Role.ROLE_ID) {
    //                    Role.SELECTED = true;
    //                }
    //            }
    //        }
    //    }
    //    else {
    //        for (var i = 0; i < $scope.GROUP_ROLE_IDS_EDIT.length; i++) {
    //            Role.SELECTED = false;

    //        }
    //    }
    //};
    $scope.INS_UPD_GROUP_ROLE_ASSIGNMENT = function (ACTIVE) {
        $scope.GRPForm.submitted = true;
        if ($scope.GRPForm.$valid) {
            var BrnModelObj = new Object();
            BrnModelObj.GROUP_ID = $scope.GroupSearch.GROUP_ID;
            BrnModelObj.CUSTOMER_ID = $scope.GroupSearch.CUSTOMER_ID;
            BrnModelObj.ENTITY_ID = $scope.GroupSearch.ENTITY_ID;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            var ROLE_IDS_LIST = "";
            $scope.GroupSearch.ROLE_ID != undefined ? ROLE_IDS_LIST = $scope.GroupSearch.ROLE_ID.toString() : ROLE_IDS_LIST = null;
            //ROLE_IDS_LIST = $scope.GroupSearch.ROLE_ID.toString();

            BrnModelObj.ROLES_IDS = ROLE_IDS_LIST;
            if (BrnModelObj.ROLES_IDS != undefined && BrnModelObj.ROLES_IDS != '' && BrnModelObj.ROLES_IDS.length > 0) {
                PrcCommMethods.ADMIN_API(BrnModelObj, 'INS_UPD_GROUP_ROLE_ASSIGNMENT').then(function (data) {
                    $scope.$parent.ShowAlert('Success', 'Save Successfully', 3000);
                    $scope.ResetGROUPMAPPING();
                });
                $scope.EDIT_MODE = null;
            }
            else { $scope.$parent.ShowAlert('Error', 'Please select role from the list.', 3000); }
        }

    };
    $scope.EDIT_INS_UPD_GRP_ROLE_MAPPING = function (GRP_ROLE) {
        $scope.GroupSearch = GRP_ROLE;
        $scope.GroupSearch.CUSTOMER_ID = GRP_ROLE.CUSTOMER_ID;
        $scope.GroupSearch.ENTITY_ID = GRP_ROLE.ENTITY_ID;
        $scope.GROUP_ROLE_IDS_EDIT = GRP_ROLE.ROLE_IDS.split(",");
        $scope.GroupSearch.ROLE_ID = JSON.parse("[" + GRP_ROLE.ROLE_IDS + "]");
        $scope.GET_ENTITY_LIST();
        $scope.GET_ROLE_LIST();
        $scope.GET_GROUP_MAPPING_LIST();
        $scope.GroupSearch.GROUP_ID = GRP_ROLE.GROUP_ID;
        $scope.EDIT_MODE = 1;
    };


});
app.controller('UserCreationController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {

    if (getUrlParameter('STAG', $location.absUrl()) == undefined)
        $scope.$parent.PAGE_HEADER = "User List";
    if (getUrlParameter('STAG', $location.absUrl()) == 2)
        $scope.$parent.PAGE_HEADER = "Create User";
    $scope.CRTUSER_ID = getUrlParameter('ID', $location.absUrl());
    var EDIT_USER_INFO = getUrlParameter("e", $location.absUrl());
    //if ($filter('lowercase')($location.absUrl()).indexOf("setup_user") != -1) {
    //    if (EDIT_USER_INFO == 1 && $scope.$parent.EditObject != null) {
    //        $scope.$parent.PAGE_HEADER = "Update User ";
    //    }
    //    else if (EDIT_USER_INFO == 1 && $scope.$parent.EditObject == null) {
    //        window.location.href = '../Main/Admin#!/Setup_UserList'
    //    }
    //    else {
    //        $scope.$parent.PAGE_HEADER = "Create New User";
    //    }
    //}

    $scope.$parent.urlpath = "Setup_UserList";
    $scope.UserSearch = {
        USER_ID: 0,
        CUSTOMER_ID: null,
        USER_NAME: '',
        USER_EMAIL: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ENTITY_LIST: [], ENTITY_ID: null,
        ROLE_NAME: '', CLICK_SEARCH: null,
        DEFAULT_ENTITY_ID: null,
        DEFAULT_CUSTOMER_ID: null,
        USER_DESIGNATION: null,
        LOGIN_USER_NAME: null,
        USER_MOBILE_NUMBER: null,
        PRIMARY_USER_EMAIL: null,
        SECONDARY_USER_EMAIL: null,
        NOTIFICATION_USER_EMAIL: null,
        VALIDATION_1: false,
        VALIDATION_2: false,
        VALIDATION_3: false,
        VALIDATION_4: false,
        VALIDATION_5: false,
        DEFAULT_EMPLOYEE_ID: null,

    };
    $scope.loadFLAG = 0;

    $scope.USER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.ENTITY_LIST_1 = [];
    $scope.ROLE_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.EMPLOYEE_LIST = [];
    $scope.LOCATION = []; $scope.PREVIOUS_ROLE_LIST = []; $scope.TEMP = []; $scope.DEFAULT_CUSTOMER_LIST = []; $scope.DEFAULT_ENTITY_LIST = [];
    $scope.GET_ENTITY_LIST = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.loadFLAG = 1;
        if ($scope.UserSearch.CUSTOMER_ID != null) {
            var GET_ALL = new Object();
            GET_ALL.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;// parseInt($cookies.get("CUSTOMER_ID"));
            GET_ALL.USER_ID = $scope.UserSearch.USER_ID;//parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(GET_ALL, 'GET_ENTITY_ROLE_BRANCH').then(function (data) {
                $scope.DATA = angular.copy(data.data.Table);
                //$scope.ENTITY_LIST = data.data.Table;
                //$scope.ROLE_LIST = data.data.Table1;
                //$scope.BRANCH_LIST = data.data.Table2;
                if ($scope.UserSearch.USER_ID != 0) {
                    $scope.ACTIVE_LIST = $filter('filter')(data.data.Table, { 'ACTIVE': true }, true);
                    $scope.UNIQUE_LIST = $filter('unique')(data.data.Table, 'BRANCH_ID');
                    angular.forEach($scope.ACTIVE_LIST, function (activeItem) {
                        angular.forEach($scope.UNIQUE_LIST, function (uniqueItem) {
                            if (uniqueItem.BRANCH_ID == activeItem.BRANCH_ID && activeItem.ACTIVE == true && uniqueItem.BRANCH_ID != 0) {
                                uniqueItem.ACTIVE = true;
                                uniqueItem.TABLE_ID = activeItem.TABLE_ID;
                            }
                        });
                    });
                    $scope.ENTITY_LIST_1 = $scope.UNIQUE_LIST;
                    if ($scope.ENTITY_LIST_1.length > 0) {
                        //$scope.ENTITY_LIST_1 = $filter('unique')($scope.ENTITY_LIST_1, 'ENTITY_ID');
                        $scope.ENTITY_LIST = $scope.ENTITY_LIST_1;
                        $scope.ROLE_LIST = $filter('unique')(data.data.Table, 'ROLE_ID');
                    }
                    else {
                        $scope.ENTITY_LIST_1 = $filter('unique')(data.data.Table, 'BRANCH_ID');//$filter('unique')(data.data.Table, 'ENTITY_ID');
                        $scope.ENTITY_LIST = $scope.ENTITY_LIST_1;
                        $scope.ROLE_LIST = $filter('unique')(data.data.Table, 'ROLE_ID');
                    }
                }
                else {
                    $scope.ENTITY_LIST_1 = $filter('unique')(data.data.Table, 'BRANCH_ID');//$filter('unique')(data.data.Table, 'ENTITY_ID');
                    $scope.ENTITY_LIST = $scope.ENTITY_LIST_1;
                    $scope.ROLE_LIST = $filter('unique')(data.data.Table, 'ROLE_ID');

                }

                //$scope.BRANCH_LIST = data.data.Table2;
            });
            document.getElementById("overlay_loading").style.display = "none";
        }
        else {
            {
                $scope.ENTITY_LIST = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
        };
    };
    $scope.DEFAULT_GET_ENTITY_LIST = function () {
        document.getElementById("overlay_loading").style.display = "block";
        if ($scope.UserSearch.DEFAULT_CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.UserSearch.DEFAULT_CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.DEFAULT_ENTITY_LIST = data.data.Table;
                }
                else { $scope.DEFAULT_ENTITY_LIST = []; }
                document.getElementById("overlay_loading").style.display = "none";
            });
        }
        else {
            $scope.DEFAULT_ENTITY_LIST = [];
            document.getElementById("overlay_loading").style.display = "none";
        }
    };

    $scope.ADMIN_GET_EMP_LIST = function () {
        document.getElementById("overlay_loading").style.display = "block";
        if ($scope.UserSearch.DEFAULT_ENTITY_ID != undefined || $scope.UserSearch.DEFAULT_ENTITY_ID != '' || $scope.UserSearch.DEFAULT_ENTITY_ID != null) {
            var OBJ_EMP = new Object();
            OBJ_EMP.ENTITY_ID = $scope.UserSearch.DEFAULT_ENTITY_ID;
            OBJ_EMP.USER_ID = parseInt($scope.UserSearch.USER_ID);
            PrcCommMethods.ADMIN_API(OBJ_EMP, 'ADMIN_GET_EMP_LIST').then(function (data) {
                $scope.EMPLOYEE_LIST = data.data.Table;
                $scope.UserSearch.EMPLOYEE_ID = null;
                if ($scope.EMPLOYEE_LIST.length > 0) {
                    var EMP = $scope.EMPLOYEE_LIST.filter(function (x) { return x.DEFAULT_SELECTION == 1 });
                    if (EMP.length > 0) {
                        $scope.UserSearch.EMPLOYEE_ID = EMP[0].EMPLOYEE_PERSONAL_ID;
                        $scope.UserSearch.DEFAULT_EMPLOYEE_ID = EMP[0].EMPLOYEE_PERSONAL_ID;
                    }
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else { document.getElementById("overlay_loading").style.display = "none"; }

            });
        }
        else { $scope.EMPLOYEE_LIST = []; document.getElementById("overlay_loading").style.display = "none"; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_NAME = '';
        UserModelObj.CUSTOMER_CODE = '';
        UserModelObj.ACTIVE = 1;
        UserModelObj.PAGE_NO = 1;
        UserModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        UserModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            $scope.DEFAULT_CUSTOMER_LIST = data.data.Table;
        });
    };

    $scope.InitializeEntity = function (Entity, index) {
        Entity.SHOW = true;

        Entity.ROLE_LIST = angular.copy($filter('filter')($scope.DATA, { ENTITY_ID: Entity.ENTITY_ID, BRANCH_ID: Entity.BRANCH_ID }, true));
        if (Entity.ROLE_LIST.length <= 0) {
            Entity.SHOW = false;
        }
    };
    $scope.InitializeRole = function (Entity, Role) {
        if ($scope.USER_ROLE_LIST.length > 0) {

            var USER_ROLE_LIST = $scope.USER_ROLE_LIST.filter(function (userR) {
                return userR.ROLE_ID == Role.ROLE_ID && Entity.BRANCH_ID == userR.BRANCH_ID && Entity.ENTITY_ID == userR.ENTITY_ID
            });
            Role.SELECTED = false;
            if (USER_ROLE_LIST.length > 0) {
                Role.SELECTED = Role.ACTIVE == true ? true : false;
            }
            $scope.TEMP.push(Role);
            $scope.PREVIOUS_ROLE_LIST = [];
            $scope.PREVIOUS_ROLE_LIST = angular.copy($scope.TEMP);
        }
    };
    $scope.InitializeBranch = function (Entity, Branch) {
        if ($scope.USER_ROLE_LIST.length > 0) {
            //Entity.SELECTED = $filter('filter')($scope.USER_ROLE_LIST, { ENTITY_ID: Entity.ENTITY_ID, BRANCH_ID: Entity.BRANCH_ID }, true) != undefined ? $filter('filter')($scope.USER_ROLE_LIST, { ENTITY_ID: Entity.ENTITY_ID, BRANCH_ID: Entity.BRANCH_ID }, true)[0].ACTIVE : false;
            Entity.SELECTED = Entity.ACTIVE == true ? true : false;
        }
    };

    $scope.RESET_USER_LIST = function () {
        $scope.UserSearch = {
            USER_ID: 0,
            CUSTOMER_ID: null,
            USER_NAME: '',
            USER_EMAIL: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ENTITY_ID: null,
            ROLE_NAME: '',
            CLICK_SEARCH: null,
        };

        $scope.UserCreationForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.ROLE_LIST = [];
        $scope.ADMIN_GET_USERS('', 2);
    };
    $scope.GET_LOCATION = function () {
        if ($scope.UserSearch.ENTITY_ID != undefined || $scope.UserSearch.ENTITY_ID != '' || $scope.UserSearch.ENTITY_ID != null) {
            var UserModelObj = new Object();
            UserModelObj.CUSTOMER_ID = $scope.UserSearch.CUSTOMER_ID;
            UserModelObj.ENTITY_ID = $scope.UserSearch.ENTITY_ID;
            UserModelObj.LOCATION_NAME = "";
            UserModelObj.LOCATION_CODE = "";
            UserModelObj.ACTIVE = 1;
            UserModelObj.PAGE_NO = 1;
            UserModelObj.PAGE_SIZE = 1000;
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else
            $scope.LOCATION = [];
    };
    $scope.ADMIN_GET_CUSTOMER();

    $scope.ADMIN_GET_USERS = function (OBJUSER, FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        var CrtUserModelObj = new Object();
        if (FLAG == 1) {
            $scope.UserSearch.CLICK_SEARCH = 1;
            $scope.USER_LIST = [];
            $scope.UserSearch.PAGE_NO = 1;
            //CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE ? 1 : 0;
            CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE == -1 ? -1 : $scope.UserSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.USER_LIST = [];
            CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE == -1 ? -1 : $scope.UserSearch.ACTIVE ? 1 : 0;
            $scope.UserSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.UserSearch.CLICK_SEARCH == 1)
                CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE == -1 ? -1 : $scope.UserSearch.ACTIVE ? 1 : 0;
            else {
                CrtUserModelObj.ACTIVE = -1;
            }
            //$scope.USER_LIST = [];
            //CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE == -1 ? -1 : $scope.UserSearch.ACTIVE ? 1 : 0;
            //$scope.UserSearch.PAGE_NO = 1;
        }

        if (EDIT_USER_INFO == undefined && EDIT_USER_INFO == null) {
            CrtUserModelObj.CUSTOMER_ID = $scope.UserSearch.CLICK_SEARCH == 1 ? $scope.UserSearch.CUSTOMER_ID : null;
            CrtUserModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CrtUserModelObj.USER_NAME = $scope.UserSearch.CLICK_SEARCH == 1 ? $scope.UserSearch.USER_NAME : '';
            CrtUserModelObj.CONTACT_EMAIL = $scope.UserSearch.CLICK_SEARCH == 1 ? $scope.UserSearch.USER_EMAIL : null;
            //CrtUserModelObj.ACTIVE = $scope.UserSearch.ACTIVE;
            CrtUserModelObj.PAGE_NO = $scope.UserSearch.PAGE_NO;
            CrtUserModelObj.PAGE_SIZE = $scope.UserSearch.PAGE_SIZE;
            CrtUserModelObj.ROLE_NAME = $scope.UserSearch.CLICK_SEARCH == 1 ? $scope.UserSearch.ROLE_NAME : '';
            PrcCommMethods.ADMIN_API(CrtUserModelObj, 'ADMIN_GET_USERS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.USER_LIST = $scope.USER_LIST.concat(data.data.Table);
                    if (data.data.Table.length < $scope.UserSearch.PAGE_SIZE) {
                        $scope.GetData = false;
                    }
                    else {
                        $scope.UserSearch.PAGE_NO = parseInt($scope.UserSearch.PAGE_NO) + 1;
                        $scope.GetData = true;
                    }
                }
                else
                    $scope.GetData = false;

                document.getElementById("overlay_loading").style.display = "none";
            });
        }
    };
    $scope.ADMIN_GET_USERS();
    $scope.EDIT_USER_DETAIL = function (OBJUSER) {
        $scope.$parent.EDIT_USER_FLAG = 1;
        $scope.$parent.PAGE_HEADER = "Create User";
        $scope.$parent.EditObject = OBJUSER;
        $location.path('Setup_User').search({ e: 1 });

    };
    $scope.ADMIN_INS_UPD_USERS = function () {
        var UserModelObj = new Object();
        $scope.UserCreationForm.submitted = true;
        $scope.AT_LEAST_ONE_ENTITY_ROLE_SELECTED = 0;
        $scope.CHK_BRANCH_ROLE_SELECTED = 0;
        $scope.USER_CREATION_VALIDATION = true;
        if ($scope.UserCreationForm.$valid && $scope.UserSearch.VALIDATION_1 == false && $scope.UserSearch.VALIDATION_2 == false && $scope.UserSearch.VALIDATION_3 == false && $scope.UserSearch.VALIDATION_4 == false && $scope.UserSearch.VALIDATION_5 == false) {

            UserModelObj.CUSTOMER_ID = $scope.UserSearch.DEFAULT_CUSTOMER_ID;
            UserModelObj.USER_ID = EDIT_USER_INFO == 1 ? $scope.$parent.EditObject.USER_ID : $scope.UserSearch.USER_ID;
            UserModelObj.CREATED_BY = parseInt($cookies.get("USERID"));
            UserModelObj.ACTIVE = $scope.UserSearch.ACTIVE == -1 ? 0 : $scope.UserSearch.ACTIVE == false ? 0 : 1;
            UserModelObj.NAME = $scope.UserSearch.USER_NAME;
            UserModelObj.PRIMARY_EMAIL = $scope.UserSearch.PRIMARY_USER_EMAIL;
            UserModelObj.SECONDARY_EMAIL = $scope.UserSearch.SECONDARY_USER_EMAIL;
            UserModelObj.NOTIFICATION_EMAIL = $scope.UserSearch.NOTIFICATION_USER_EMAIL;
            UserModelObj.MOBILE_CODE = null;
            UserModelObj.MOBILE_NO = $scope.UserSearch.USER_MOBILE_NUMBER;
            UserModelObj.USER_NAME = $scope.UserSearch.LOGIN_USER_NAME;
            UserModelObj.EMPLOYEE_ID = $scope.UserSearch.EMPLOYEE_ID;//$scope.UserSearch.EMPLOYEE_ID == null ? $scope.UserSearch.DEFAULT_EMPLOYEE_ID : $scope.UserSearch.EMPLOYEE_ID;
            UserModelObj.ENTITY_ID = $scope.UserSearch.DEFAULT_ENTITY_ID;
            UserModelObj.USER_DESIGNATION = $scope.UserSearch.USER_DESIGNATION;

            //UserModelObj.CONTACT_EMAIL = $scope.UserSearch.USER_EMAIL;



            UserModelObj.USER_ROLE_MAPPING = [];


            $scope.CHK_BRANCH_ROLE_SELECTED = 0;
            if (getUrlParameter('e', $location.absUrl()) == '1') {
                //$scope.TEMP_PREVIOUS_ROLE_VALUE =angular.copy($filter('unique')($scope.PREVIOUS_ROLE_LIST, 'ROLE_ID'));
                angular.forEach($scope.ENTITY_LIST, function (Ent) {
                    $scope.CHK_BRANCH_ROLE_SELECTED = 0;
                    angular.forEach(Ent.ROLE_LIST, function (Role) {
                        $scope.TEMP_PREVIOUS_ROLE_VALUE == [];
                        $scope.TEMP_PREVIOUS_ROLE_VALUE = angular.copy($filter('filter')($scope.PREVIOUS_ROLE_LIST, { 'BRANCH_ID': Role.BRANCH_ID }));
                        angular.forEach($scope.TEMP_PREVIOUS_ROLE_VALUE, function (PREVIOUS_ROLE_LIST) {
                            if (Role.SELECTED != PREVIOUS_ROLE_LIST.SELECTED && Role.ROLE_ID == PREVIOUS_ROLE_LIST.ROLE_ID && Role.BRANCH_ID == PREVIOUS_ROLE_LIST.BRANCH_ID) {
                                var RoleObj = new Object();
                                RoleObj.ENTITY_ID = Ent.ENTITY_ID;
                                RoleObj.LOCATION_ID = Ent.LOCATION_ID;
                                RoleObj.BRANCH_ID = Ent.BRANCH_ID;
                                RoleObj.ROLE_ID = Role.ROLE_ID;
                                RoleObj.ACTIVE = Role.SELECTED == true ? 1 : 0;
                                RoleObj.COMMENTS = "";
                                RoleObj.TABLE_ID = Role.TABLE_ID;
                                UserModelObj.USER_ROLE_MAPPING.push(RoleObj);
                            }
                        });
                        if (Ent.SELECTED == true) {
                            $scope.AT_LEAST_ONE_ENTITY_ROLE_SELECTED += 1;
                            if (Role.SELECTED == false) { $scope.CHK_BRANCH_ROLE_SELECTED += 1; }
                        }
                        if (Ent.ROLE_LIST.length == $scope.CHK_BRANCH_ROLE_SELECTED && Ent.SELECTED == true) { $scope.USER_CREATION_VALIDATION = false; }
                    });
                });
                if (UserModelObj.USER_ROLE_MAPPING.length == 0) {
                    var RoleObj = new Object();
                    RoleObj.ENTITY_ID = null;
                    RoleObj.LOCATION_ID = null;
                    RoleObj.BRANCH_ID = null;
                    RoleObj.ROLE_ID = null;
                    RoleObj.ACTIVE = null;
                    RoleObj.COMMENTS = null;
                    RoleObj.TABLE_ID = null;
                    UserModelObj.USER_ROLE_MAPPING.push(RoleObj);
                }
            }

            $scope.UNIQUE_ROLE = [];
            //$scope.UNIQUE_ROLE = $filter('unique')(UserModelObj.USER_ROLE_MAPPING, 'ROLE_ID');
            $scope.UNIQUE_ROLE = UserModelObj.USER_ROLE_MAPPING;

            UserModelObj.USER_ROLE_MAPPING = $scope.UNIQUE_ROLE;
            if (getUrlParameter('STAG', $location.absUrl()) == '2') {
                angular.forEach($scope.ENTITY_LIST, function (Ent) {
                    $scope.CHK_BRANCH_ROLE_SELECTED = 0;
                    angular.forEach(Ent.ROLE_LIST, function (Role) {
                        if (Ent.SELECTED == true) {
                            $scope.AT_LEAST_ONE_ENTITY_ROLE_SELECTED += 1;
                            //angular.forEach(Ent.BRANCH_LIST, function (Branch) {
                            if (Role.SELECTED == true) {
                                var RoleObj = new Object();
                                RoleObj.ENTITY_ID = Ent.ENTITY_ID;
                                RoleObj.LOCATION_ID = Ent.LOCATION_ID;
                                RoleObj.BRANCH_ID = Ent.BRANCH_ID;
                                RoleObj.ROLE_ID = Role.ROLE_ID;
                                RoleObj.ACTIVE = 1;
                                RoleObj.COMMENTS = "";
                                RoleObj.TABLE_ID = 0;
                                UserModelObj.USER_ROLE_MAPPING.push(RoleObj);
                            }
                            else { $scope.CHK_BRANCH_ROLE_SELECTED += 1; }
                            ////});
                            if (Ent.ROLE_LIST.length == $scope.CHK_BRANCH_ROLE_SELECTED) { $scope.USER_CREATION_VALIDATION = false; }
                        }
                    });
                });
            }

            if (getUrlParameter('STAG', $location.absUrl()) == '2') {
                PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_INS_UPD_USERS').then(function (data) {
                    if (data.data != null) {
                        if (data.data.Table[0].USER_ID == -1) {
                            $scope.$parent.ShowAlert('Attention', 'Entered emails or mobile no. or username already exist.To check, place the mouse pointer over textbox and then remove it.', 3000);
                        }
                        else {
                            $scope.$parent.ShowAlert('Success', 'User Added Successfully', 3000);
                            window.location.href = '../Main/Admin#!/Setup_UserList';
                        }
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Unable to update user record, please refresh the page and try again.', 3000);
                        window.location.href = '../Main/Admin#!/Setup_UserList';
                    }

                });
            }
            else {
                if ($scope.$parent.EditObject.EMAIL == UserModelObj.CONTACT_EMAIL) {
                    PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_INS_UPD_USERS').then(function (data) {
                        if (data.data != null) {
                            if (data.data.Table[0].USER_ID == -1) {
                                $scope.$parent.ShowAlert('Attention', 'Entered email alreay exist.', 3000);
                            }
                            else {
                                $scope.$parent.ShowAlert('Success', 'User Added Successfully', 3000);
                                window.location.href = '../Main/Admin#!/Setup_UserList';
                            }
                        }
                        else {
                            $scope.$parent.ShowAlert('Attention', 'Unable to update user record, please refresh the page and try again.', 3000);
                            window.location.href = '../Main/Admin#!/Setup_UserList';
                        }
                    });
                }
                else {
                    if (confirm("You Can't  Edit User Email.Will You Continue?")) {
                        PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_INS_UPD_USERS').then(function (data) {
                            if (data.data != null) {
                                $scope.$parent.ShowAlert('Success', 'User Added Successfully', 3000);
                                window.location.href = '../Main/Admin#!/Setup_UserList';
                            }
                            else {
                                $scope.$parent.ShowAlert('Attention', 'Unable to update user record, please refresh the page and try again.', 3000);
                                window.location.href = '../Main/Admin#!/Setup_UserList';
                            }
                        });
                    }
                }
            }

        }
        else {
            $scope.ATTENTION_MESSAGE = null;
            if ($scope.UserSearch.VALIDATION_1 == true)
                $scope.ATTENTION_MESSAGE = 'Primary Email Already Exist.';
            else if ($scope.UserSearch.VALIDATION_2 == true)
                $scope.ATTENTION_MESSAGE = 'Secondary Email Already Exist.';
            else if ($scope.UserSearch.VALIDATION_3 == true)
                $scope.ATTENTION_MESSAGE = 'Provided User Name Already Exist.';
            else if ($scope.UserSearch.VALIDATION_4 == true)
                $scope.ATTENTION_MESSAGE = 'Provided Mobile Number Already Exist.';

            if ($scope.ATTENTION_MESSAGE != null)
                $scope.$parent.ShowAlert('Attention', $scope.ATTENTION_MESSAGE, 5000);
        }
        angular.element('input.ng-invalid').first().focus(); angular.element('select.ng-invalid').first().focus();
    };
    $scope.ADMIN_EDIT_USER = function () {
        if (EDIT_USER_INFO == 1) {
            $scope.ADMIN_GET_USERS($scope.$parent.EditObject);
            //$scope.ADMIN_GET_USER_DETAILS_BY_ID($scope.$parent.EditObject.USER_ID);
        };

    };
    $scope.ADMIN_GET_USER_DETAILS_BY_ID = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.DISABLE_CUSTOMER_ENTITY_DD = getUrlParameter('e', $location.absUrl()) == '1' == 1 ? true : false;
        if (EDIT_USER_INFO == 1 && $scope.$parent.EditObject != null) {
            var CrtUserModelObj = new Object();
            CrtUserModelObj.USER_ID = $scope.$parent.EditObject.USER_ID;
            PrcCommMethods.ADMIN_API(CrtUserModelObj, 'GET_USER_DETAILS_BY_ID').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.USER_LIST = data.data.Table;
                    $scope.USER_ROLE_LIST = data.data.Table1;
                    $scope.UserSearch.CUSTOMER_ID = $scope.USER_LIST[0].CUSTOMER_ID;
                    $scope.UserSearch.DEFAULT_CUSTOMER_ID = $scope.USER_LIST[0].CUSTOMER_ID;
                    $scope.UserSearch.USER_NAME = $scope.USER_LIST[0].NAME;
                    $scope.UserSearch.ACTIVE = $scope.USER_LIST[0].ACTIVE ? true : false;
                    $scope.UserSearch.ENTITY_ID = $scope.USER_LIST[0].DEFAULT_ENTITY_ID;
                    $scope.UserSearch.DEFAULT_ENTITY_ID = $scope.USER_LIST[0].DEFAULT_ENTITY_ID;
                    $scope.UserSearch.USER_ID = $scope.USER_LIST[0].USER_ID;
                    $scope.UserSearch.USER_DESIGNATION = $scope.USER_LIST[0].DESIGNATION;
                    $scope.UserSearch.PRIMARY_USER_EMAIL = $scope.USER_LIST[0].PRIMARY_EMAIL;
                    $scope.UserSearch.LOGIN_USER_NAME = $scope.USER_LIST[0].USER_NAME;
                    $scope.UserSearch.USER_MOBILE_NUMBER = $scope.USER_LIST[0].MOBILE_NO == 0 ? $scope.UserSearch.USER_MOBILE_NUMBER = null : $scope.UserSearch.USER_MOBILE_NUMBER = $scope.USER_LIST[0].MOBILE_NO;
                    $scope.UserSearch.NOTIFICATION_USER_EMAIL = $scope.USER_LIST[0].NOTIFICATION_EMAIL;
                    $scope.UserSearch.SECONDARY_USER_EMAIL = $scope.USER_LIST[0].SECONDARY_EMAIL;

                    $scope.DISABLE_PRIMARY_EMAIL = true;

                    $scope.GET_ENTITY_LIST();
                    $scope.ADMIN_GET_EMP_LIST();
                    $scope.DEFAULT_GET_ENTITY_LIST();
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    document.getElementById("overlay_loading").style.display = "none";
                    $scope.USER_LIST = [];
                    $scope.USER_ROLE_LIST = [];
                }
            });
        }
    };
    $scope.RESET_USER = function () {
        $scope.UserSearch = {
            CUSTOMER_ID: null,
            USER_NAME: '',
            USER_EMAIL: '',
            ACTIVE: 0,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        if (EDIT_USER_INFO != undefined) {
            if ($scope.ENTITY_LIST[0].ROLE_LIST.length > 0) {
                angular.forEach($scope.ENTITY_LIST[0].ROLE_LIST, function (item) {
                    item.SELECTED = false;
                });
            }
            window.location.href = '../Main/Admin#!/Setup_UserList';
        }
        else {
            if ($scope.ENTITY_LIST[0].ROLE_LIST.length > 0) {
                angular.forEach($scope.ENTITY_LIST[0].ROLE_LIST, function (item) {
                    item.SELECTED = false;
                });
                $scope.ENTITY_LIST = [];
            }
        }



        $scope.UserCreationForm.submitted = false;

    };
    $scope.CREATE_USER_CLICK = function () {

        $scope.$parent.EDIT_USER_FLAG = 2;
        $location.path('Setup_User').search('STAG', 2);

    };
    $scope.LAZY_ADMIN_GET_USERS = function () {
        $scope.ADMIN_GET_USERS();
    };
    $scope.UNCHECK_ROLES_ON_BRANCH_CHK_UNCHK = function (Entity) {
        if (Entity.SELECTED == false) {
            angular.forEach(Entity.ROLE_LIST, function (ROLE_LIST) {
                ROLE_LIST.SELECTED = false;
            });

        }
    };

    $scope.ADMIN_VALIDATE_USER_DATA = function (PI_TYPE, VALUE) {
        var UserModelObj = new Object();
        UserModelObj.USER_ID = UserModelObj.USER_ID = EDIT_USER_INFO == 1 ? $scope.$parent.EditObject.USER_ID : $scope.UserSearch.USER_ID;
        UserModelObj.TYPE = PI_TYPE;
        UserModelObj.VALUE = VALUE;

        if (VALUE != null && VALUE != undefined && VALUE != "") {
            document.getElementById("overlay_loading").style.display = "block";
            PrcCommMethods.ADMIN_API(UserModelObj, 'ADMIN_VALIDATE_USER_DATA').then(function (data) {
                if (data.data == -1) {
                    $scope.$parent.ShowAlert('Attention', PI_TYPE == 1 ? 'Primary Email Already Exist.' : PI_TYPE == 2 ? 'Secondary Email Already Exist.' : PI_TYPE == 3 ? 'Provided User Name Already Exist.' : 'Provided Mobile Number Already Exist.', 5000);
                    PI_TYPE == 1 ? $scope.UserSearch.VALIDATION_1 = true : false;
                    PI_TYPE == 2 ? $scope.UserSearch.VALIDATION_2 = true : false;
                    PI_TYPE == 3 ? $scope.UserSearch.VALIDATION_3 = true : false;
                    PI_TYPE == 4 ? $scope.UserSearch.VALIDATION_4 = true : false;
                    PI_TYPE == 5 ? $scope.UserSearch.VALIDATION_5 = true : false;
                    $scope.ENABLE_DISABLE_SAVE_BUTTON = true;

                }
                else if (data.data == 1) {
                    PI_TYPE == 1 ? $scope.UserSearch.VALIDATION_1 = false : true;
                    PI_TYPE == 2 ? $scope.UserSearch.VALIDATION_2 = false : true;
                    PI_TYPE == 3 ? $scope.UserSearch.VALIDATION_3 = false : true;
                    PI_TYPE == 4 ? $scope.UserSearch.VALIDATION_4 = false : true;
                    PI_TYPE == 5 ? $scope.UserSearch.VALIDATION_5 = false : true;
                    if ($scope.UserSearch.VALIDATION_1 == true || $scope.UserSearch.VALIDATION_2 == true ||
                        $scope.UserSearch.VALIDATION_3 == true || $scope.UserSearch.VALIDATION_4 == true ||
                        $scope.UserSearch.VALIDATION_5 == true) {
                        $scope.ENABLE_DISABLE_SAVE_BUTTON = true;
                    }
                    else {
                        $scope.ENABLE_DISABLE_SAVE_BUTTON = false;

                    }
                }
                else { $scope.ENABLE_DISABLE_SAVE_BUTTON = false; }
                document.getElementById("overlay_loading").style.display = "none";
            });
        }
        else if (VALUE == null || VALUE.trim() == "") {
            PI_TYPE == 1 ? $scope.UserSearch.VALIDATION_1 = false : true;
            PI_TYPE == 2 ? $scope.UserSearch.VALIDATION_2 = false : true;
            PI_TYPE == 3 ? $scope.UserSearch.VALIDATION_3 = false : true;
            PI_TYPE == 4 ? $scope.UserSearch.VALIDATION_4 = false : true;
            PI_TYPE == 5 ? $scope.UserSearch.VALIDATION_5 = false : true;

            if ($scope.UserSearch.VALIDATION_1 == true || $scope.UserSearch.VALIDATION_2 == true ||
                $scope.UserSearch.VALIDATION_3 == true || $scope.UserSearch.VALIDATION_4 == true ||
                $scope.UserSearch.VALIDATION_5 == true)
                $scope.ENABLE_DISABLE_SAVE_BUTTON = true;

            else {
                $scope.ENABLE_DISABLE_SAVE_BUTTON = false;
            }
        }
        else { $scope.ENABLE_DISABLE_SAVE_BUTTON = false; }
        document.getElementById("overlay_loading").style.display = "none";
    };

});
app.controller('SettingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Entity Settings";
    $scope.$parent.urlpath = "Ent_Setting";
    $scope.LOAD_SELECT = function () {
        $('.select2').select2();
    };
    $scope.WEEKDAY_LIST = [
        { "DAY_ID": "0", "DAY_NAME": "SUNDAY " },
        { "DAY_ID": "1", "DAY_NAME": "MONDAY" },
        { "DAY_ID": "2", "DAY_NAME": "TUESDAY" },
        { "DAY_ID": "3", "DAY_NAME": "WEDNESDAY " },
        { "DAY_ID": "4", "DAY_NAME": "THURSDAY " },
        { "DAY_ID": "5", "DAY_NAME": "FRIDAY " },
        { "DAY_ID": "6", "DAY_NAME": "SATURDAY" }
    ];
    $scope.WEEKDAY_LIST_2 = [
        { "DAY_ID": "0", "DAY_NAME": "SUNDAY ", "DAY_VALUE": 0 },
        { "DAY_ID": "1", "DAY_NAME": "MONDAY", "DAY_VALUE": 0 },
        { "DAY_ID": "2", "DAY_NAME": "TUESDAY", "DAY_VALUE": 0 },
        { "DAY_ID": "3", "DAY_NAME": "WEDNESDAY ", "DAY_VALUE": 0 },
        { "DAY_ID": "4", "DAY_NAME": "THURSDAY ", "DAY_VALUE": 0 },
        { "DAY_ID": "5", "DAY_NAME": "FRIDAY ", "DAY_VALUE": 0 },
        { "DAY_ID": "6", "DAY_NAME": "SATURDAY", "DAY_VALUE": 0 }
    ];
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_SETTING = [];
    $scope.ALL_DAY_WORK = "0,1,2,3,4,5,6";
    var EntSettingModelObj;
    $scope.SettingSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 1000,
        CUSTOMER_ID: null,
        ENTITY_ID: null
    };
    $scope.ResetENTITYSETTING = function () {
        $scope.SettingSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            CUSTOMER_ID: null,
            ENTITY_LIST: null
        }
        $scope.ENTITY_LIST = [];
        $scope.SettingForm.submitted = false;
        $scope.ENTITY_SETTING = [];
        $scope.WEEKLY_WEGES_VALUES = "";
        $scope.WEEKDAY_LIST_2 = [
            { "DAY_ID": "0", "DAY_NAME": "SUNDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "1", "DAY_NAME": "MONDAY", "DAY_VALUE": 0 },
            { "DAY_ID": "2", "DAY_NAME": "TUESDAY", "DAY_VALUE": 0 },
            { "DAY_ID": "3", "DAY_NAME": "WEDNESDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "4", "DAY_NAME": "THURSDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "5", "DAY_NAME": "FRIDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "6", "DAY_NAME": "SATURDAY", "DAY_VALUE": 0 }
        ];
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SettingSearch.CUSTOMER_ID != undefined) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.CUSTOMER_ID = $scope.SettingSearch.CUSTOMER_ID;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 0;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntSettingModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.CUSTOMER_NAME = '';
        EntSettingModelObj.CUSTOMER_CODE = '';
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EntSettingModelObj.IS_LIVE = -1;//$scope.CustomerSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_ENTITY_SETTINGS = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.WEEKDAY_LIST_2 = [
            { "DAY_ID": "0", "DAY_NAME": "SUNDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "1", "DAY_NAME": "MONDAY", "DAY_VALUE": 0 },
            { "DAY_ID": "2", "DAY_NAME": "TUESDAY", "DAY_VALUE": 0 },
            { "DAY_ID": "3", "DAY_NAME": "WEDNESDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "4", "DAY_NAME": "THURSDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "5", "DAY_NAME": "FRIDAY ", "DAY_VALUE": 0 },
            { "DAY_ID": "6", "DAY_NAME": "SATURDAY", "DAY_VALUE": 0 }
        ];
        $scope.WEEKLY_WEGES_VALUES = "";
        $scope.ENTITY_PAGE_SUBMIT_FLAG = true;
        if ($scope.SettingSearch.ENTITY_ID != undefined) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.ENTITY_ID = $scope.SettingSearch.ENTITY_ID;
            EntSettingModelObj.SETTING_ID = $scope.SettingSearch.SETTING_ID == undefined ? 0 : $scope.SettingSearch.SETTING_ID;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 1;
            EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITY_SETTINGS').then(function (data) {
                $scope.ENTITY_SETTING = data.data.Table;
                angular.forEach($scope.ENTITY_SETTING, function (item) {
                    if (item.FIELD_TYPE_ID == 13)
                        $scope.ENTITY_PAGE_SUBMIT_FLAG == false;
                });
                if ($scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20).length > 0) {
                    if ($scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]["SETTING_VALUE_ADMIN"] == 0 || $scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]["SETTING_VALUE_ADMIN"] == null)
                        $scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]["SETTING_VALUE_ADMIN"] = false
                    else {
                        $scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]["SETTING_VALUE_ADMIN"] = true;
                        $scope.WEEKLY_WEGES_VALUES = $scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]["SETTING_VALUE"];
                    }
                }

                document.getElementById("overlay_loading").style.display = "none";
            });
        }
        else { $scope.ENTITY_SETTING = []; document.getElementById("overlay_loading").style.display = "none"; }
    };

    $scope.NG_INIT_SETTING = function (setting) {
        if (setting.FIELD_TYPE_ID == 13 && setting.SETTING_VALUE_ADMIN != null) {

            var temp = [];
            temp = setting.SETTING_VALUE_ADMIN.split(',');
            setting.SETTING_VALUE = temp;
            setting.SETTING_VALUE_ADMIN = temp;

        }
        if (setting.SETTING_ID == 14) {
            if (setting.SETTING_VALUE_ADMIN != null) {
                var temp = [];
                temp = setting.SETTING_VALUE_ADMIN.split(':;:');
                setting.YEAR_START_DAY = temp[0];
                setting.YEAR_START_MONTH = temp[1];
            }
            else {
                setting.YEAR_START_DAY = null;
                setting.YEAR_START_MONTH = null;
            }
        }
        //else {
        //setting.SETTING_VALUE = setting.SETTING_VALUE == null ? setting.SETTING_VALUE = setting.DEFAULT_VALUE : setting.SETTING_VALUE = setting.SETTING_VALUE;
        //}

        if (setting.FIELD_TYPE_ID == 6) {
            setting.SETTING_VALUE_ADMIN == 1 ? setting.SETTING_VALUE_ADMIN = true : setting.SETTING_VALUE_ADMIN = false;
        }
    };

    $scope.ADMIN_INS_UPD_ENTITY_SETTINGS = function () {
        EntSettingModelObj = new Object();
        $scope.WEEKLY_WORKING_DAYS_FLAG = null;//add variable for check if filed id =5 and 'Weekly Working Days' is 1 to 7 (weekday select not 8 or 9 or 0)
        $scope.SettingForm.submitted = true;

        if ($scope.SettingForm.$valid && $scope.ENTITY_PAGE_SUBMIT_FLAG == true) {
            var SELECTED_FIELDS = [];
            angular.forEach($scope.ENTITY_SETTING, function (setting) {
                var EntSettingCollectionObj = new Object();
                EntSettingCollectionObj.TABLE_ID = setting.TABLE_ID;
                EntSettingCollectionObj.SETTING_ID = setting.SETTING_ID;

                if (setting.FIELD_TYPE_ID == 10) {
                    setting.SETTING_VALUE_ADMIN != undefined ? EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE_ADMIN : EntSettingCollectionObj.SETTING_VALUE = null;
                }
                else if (setting.FIELD_TYPE_ID == 3) {
                    if (setting.SETTING_ID == 14) {
                        setting.YEAR_START_DAY != undefined && setting.YEAR_START_MONTH != undefined ? EntSettingCollectionObj.SETTING_VALUE = setting.YEAR_START_DAY + ':;:' + setting.YEAR_START_MONTH : EntSettingCollectionObj.SETTING_VALUE = null;
                    }
                    else {
                        setting.SETTING_VALUE_ADMIN != undefined ? EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE_ADMIN : EntSettingCollectionObj.SETTING_VALUE = null;
                    }
                }
                else if (setting.FIELD_TYPE_ID == 13) {
                    setting.SETTING_VALUE_ADMIN == null || setting.SETTING_VALUE_ADMIN == '' ? EntSettingCollectionObj.SETTING_VALUE = '' : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE_ADMIN.toString();
                    //setting.SETTING_ID == 5 ? (setting.SETTING_VALUE == undefined ? EntSettingCollectionObj.SETTING_VALUE = null : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE.toString())
                    //  : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE;
                }
                else if (setting.FIELD_TYPE_ID == 6) {
                    if (setting.SETTING_ID == 20) {
                        if (setting.SETTING_VALUE_ADMIN == true)
                            EntSettingCollectionObj.SETTING_VALUE = $scope.WEEKLY_WEGES_VALUES;
                        else
                            EntSettingCollectionObj.SETTING_VALUE = 0;
                    }
                    else
                        setting.SETTING_VALUE_ADMIN == true ? EntSettingCollectionObj.SETTING_VALUE = 1 : EntSettingCollectionObj.SETTING_VALUE = 0;
                }

                else {
                    EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE_ADMIN;
                }


                if (setting.FIELD_TYPE_ID == 5 && setting.MODULE_ID == 2) {
                    if (setting.SETTING_VALUE_ADMIN != null) {
                        if (setting.SETTING_VALUE_ADMIN > 7 || setting.SETTING_VALUE_ADMIN < 1) {
                            $scope.WEEKLY_WORKING_DAYS_FLAG = 1;
                            setting.SETTING_VALUE = null;
                        }
                        else {
                            setting.SETTING_VALUE_ADMIN != undefined ? EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE_ADMIN : EntSettingCollectionObj.SETTING_VALUE = null;
                            $scope.WEEKLY_WORKING_DAYS_FLAG = null;
                        }
                    }
                    else { $scope.WEEKLY_WORKING_DAYS_FLAG = null; }
                }
                //if (setting.FIELD_TYPE_ID != 5) {
                //    if (setting.FIELD_TYPE_ID == 6) {
                //        setting.SETTING_VALUE == true ? EntSettingCollectionObj.SETTING_VALUE = 1 : EntSettingCollectionObj.SETTING_VALUE = 0;
                //    }
                //    else {
                //        setting.SETTING_VALUE != null ? EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE : EntSettingCollectionObj.SETTING_VALUE = setting.DEFAULT_VALUE;
                //    }
                //}
                //if (setting.SETTING_ID == 9 || setting.SETTING_ID == 10) {
                //    setting.SETTING_VALUE ? EntSettingCollectionObj.SETTING_VALUE = 1 : EntSettingCollectionObj.SETTING_VALUE = 0;
                //}
                //if (setting.SETTING_ID == 5) {
                //    //setting.SETTING_ID == 5 ? EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE.toString() : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE;
                //    setting.SETTING_ID == 5 ? (setting.SETTING_VALUE == undefined ? EntSettingCollectionObj.SETTING_VALUE = null : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE.toString())
                //        : EntSettingCollectionObj.SETTING_VALUE = setting.SETTING_VALUE;

                //}

                SELECTED_FIELDS.push(EntSettingCollectionObj);
            });
            EntSettingModelObj.ENTITY_SETTINGS_LIST = SELECTED_FIELDS;
            EntSettingModelObj.ENTITY_ID = $scope.SettingSearch.ENTITY_ID;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            if (SELECTED_FIELDS.filter(x => x.SETTING_VALUE == null).length == 0 && $scope.WEEKLY_WORKING_DAYS_FLAG == null) {
                PrcCommMethods.ADMIN_API(EntSettingModelObj, "ADMIN_INS_UPD_ENTITY_SETTINGS").then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.ResetENTITYSETTING();
                });
            }
            else {
                if ($scope.WEEKLY_WORKING_DAYS_FLAG != null) { $scope.$parent.ShowAlert("Error", "Weekly working days could not less than 0 and greater than 7.", 3000); }
                else { $scope.$parent.ShowAlert("Error", "Fields marked as (⋆) Asterisk are mandatory.", 3000); }
            }
        }
        else {

            if ($(".select2").val().length == 0) {
                $(".select2").select2({
                    containerCssClass: 'border-red'
                });
            }
        }
    };

    $scope.WAGES_TARGET_PERCENTAGE = function (SETTING_ID, CHECK_VALUE) {
        if (SETTING_ID == 20 && CHECK_VALUE == true) {
            $('#WAGSTARGET').modal('show');
        }
        else if (SETTING_ID == 20 && CHECK_VALUE == false) {
            $scope.WEEKLY_WEGES_VALUES = "";
            angular.forEach($scope.WEEKDAY_LIST_2, function (item) {
                item.DAY_VALUE = 0;
            });
        }
        else { return false; }
    };
    $scope.SAVE_WAGES = function () {
        $scope.WEEKLY_WEGES_VALUES = "";
        angular.forEach($scope.WEEKDAY_LIST_2, function (item) {
            if ($scope.WEEKLY_WEGES_VALUES == "") {
                $scope.WEEKLY_WEGES_VALUES = item.DAY_ID + ":" + item.DAY_VALUE;
            }
            else {
                $scope.WEEKLY_WEGES_VALUES = $scope.WEEKLY_WEGES_VALUES + "," + item.DAY_ID + ":" + item.DAY_VALUE;
            }
        });
        $scope.CLOSE_WAGES();
        //$scope.$parent.ShowAlert('Attention', 'Records are added', 3000);
        $('#WAGSTARGET').modal('hide');
    };
    $scope.CLOSE_WAGES = function () {
        if ($scope.WEEKLY_WEGES_VALUES == null || $scope.WEEKLY_WEGES_VALUES == "") {
            $scope.ENTITY_SETTING.filter(p => p.SETTING_ID == 20)[0]['SETTING_VALUE_ADMIN'] = false;
            angular.forEach($scope.WEEKDAY_LIST_2, function (item) {
                item.DAY_VALUE = 0;
            });
        }
    };
    $scope.VIEW_WAGES = function () {
        if ($scope.WEEKLY_WEGES_VALUES != null || $scope.WEEKLY_WEGES_VALUES != "") {
            {
                $scope.SPLIT_WAGES_STRING = [];
                $scope.SPLIT_WAGES_STRING = $scope.WEEKLY_WEGES_VALUES.split(',');
                angular.forEach($scope.WEEKDAY_LIST_2, function (item) {
                    angular.forEach($scope.SPLIT_WAGES_STRING, function (splitItem) {
                        let split_Collon = splitItem.split(':');
                        if (split_Collon[0] == item.DAY_ID) {
                            item.DAY_VALUE = split_Collon[1];
                        }
                    });

                });
                $('#WAGSTARGET').modal('show');
            }
        }
    };

    $scope.ADMIN_SELECT2_CHANGE = function () {
        if ($(".select2").find(':selected').length > 0) {
            $(".select2").select2({
                containerCssClass: ''
            });
            $scope.ENTITY_PAGE_SUBMIT_FLAG == true;
        }
        else {
            $(".select2").select2({
                containerCssClass: 'border-red'
            });
            $scope.ENTITY_PAGE_SUBMIT_FLAG == false;
        }
    };
});
app.controller('FalloutReportsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $interval) {
    $scope.$parent.PAGE_HEADER = "FALLOUT REPORTS";
    $scope.$parent.urlpath = 'FalloutReports';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.FALLOUT_REPORTS = [];
    $scope.SALES_OUTBOUNT_INTEGRATION_TO_MARKETMAN = [];
    var CusModelObj;

    $scope.FalloutReportSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null
    };
    $scope.FalloutReportSearch_Xero = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        JOURNAL_PICKUP_DATE: null,
        LAST_PICKUP_DATE: null,
        JOURNAL_PICKUP_FLAG: false,
    };
    $scope.FalloutReportSearch_Currency = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
    };
    $scope.FalloutReportSearch_XeroDuplicateAccountCode = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        JOURNAL_PICKUP_DATE: null,
        LAST_PICKUP_DATE: null,
        JOURNAL_PICKUP_FLAG: false,
    };
    $scope.FalloutReportSearch_Sales_Outbount_Integration_To_Marketman = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        CASHUP_DATE: null,
    };

    $scope.XERO_DATE_INPUT = function (Position) {
        Position = Position == undefined ? "" : Position;
        var current_Date = new Date();
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputOpenDate") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayBtn: false,
                        forceParse: false,
                        validateOnBlur: false,
                        format: 'M dd, yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        ///startDate: new Date(date.getFullYear() + 1, 0, -0)
                        endDate: new Date(current_Date.getFullYear(), current_Date.getMonth(), current_Date.getDate())
                    };
                    date_input.datepicker(options);
                }
            }
        });
    }

    $scope.RESET_FALLOUT_REPORTS = function () {
        $scope.FalloutReportSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null
        };
        $scope.FALLOUT_REPORTS = [];
        $scope.ENTITY_LIST = [];
        $scope.ADMIN_GET_FALLOUTS();
        $scope.FalloutReportForm.submitted = false;
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.FalloutReportSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = $scope.FalloutReportSearch.CUSTOMER_CODE;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };

    $scope.GET_ENTITY_LIST = function () {
        if ($scope.FalloutReportSearch.CUSTOMER_ID != undefined && $scope.FalloutReportSearch.CUSTOMER_ID != '' && $scope.FalloutReportSearch.CUSTOMER_ID != null) {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.FalloutReportSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_FALLOUTS = function () {
        document.getElementById("overlay_loading").style.display = "block";
        CusModelObj.CUSTOMER_ID = $scope.FalloutReportSearch.CUSTOMER_ID == null ? 0 : $scope.FalloutReportSearch.CUSTOMER_ID;
        CusModelObj.ENTITY_ID = $scope.FalloutReportSearch.ENTITY_ID == null ? 0 : $scope.FalloutReportSearch.ENTITY_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_FALLOUTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.FALLOUT_REPORTS = data.data.Table;
                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.FALLOUT_REPORTS = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };

    $scope.SEARCH_FALLOUT_REPORTS = function () {
        $scope.ADMIN_GET_FALLOUTS();
    };
    $scope.JSON_COLUMN_NAME = [];
    $scope.GET_FALLOUTS = function () {
        var CusModelObj;
        $scope.JSON_COLUMN_NAME_CASH_UP = ["NAME", "INTEGRATION TYPE", "SYSTEM NAME", "ENTITY NAME", "BRANCH NAME", "LAST SYNC", "CASHUP DATE", "INTEGRATION STATUS", "SERVICE ERROR"];
        $scope.JSON_COLUMN_NAME_XERO = ["NAME", "ENTITY NAME", "BRANCH NAME", "INTEGRATION STATUS", "JOURNAL STATUS", "LAST PICKUP DATE", "JOURNAL LAST PICKUP DATE", "SERVICE ERROR"];
        $scope.JSON_COLUMN_NAME_CURRENCY = ["CODE", "CURRENCY NAME", "SYMBOL"];
        $scope.JSON_COLUMN_NAME_XERO_DUPLICATE_ACCOUNT_CODE = ["NAME", "ENTITY NAME", "BRANCH NAME", "CODE", "COUNT"];
        $scope.JSON_COLUMN_NAME_SALES_OUTBOUNT_INTEGRATION_TO_MARKETMAN = ["NAME", "ENTITY NAME", "BRANCH NAME", "CASHUP DATE"];

        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_FALLOUTS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                if (data.data.Table || data.data.Table2) {
                    $scope.FALLOUT_REPORTS_CASH_UP = data.data.Table;
                    $scope.FALLOUT_REPORTS_XERO = data.data.Table2;
                    $scope.FALLOUT_REPORTS_XERO = $scope.FALLOUT_REPORTS_XERO.filter
                        (p => p.XERO_DATA_INTEGRATION_STATUS == 2 ? p.XERO_DATA_INTEGRATION_STATUS = "Processed" : (p.XERO_DATA_INTEGRATION_STATUS == 1 ? p.XERO_DATA_INTEGRATION_STATUS = "In-Process" : p.XERO_DATA_INTEGRATION_STATUS = "Pending")).filter(
                            p => p.XERO_JOURNAL_INTEGRATION_STATUS == 2 ? p.XERO_JOURNAL_INTEGRATION_STATUS = "Processed" : (p.XERO_JOURNAL_INTEGRATION_STATUS == 1 ? p.XERO_JOURNAL_INTEGRATION_STATUS = "In-Process" : p.XERO_JOURNAL_INTEGRATION_STATUS = "Pending"));
                    $scope.FALLOUT_REPORTS_CURRENCY = data.data.Table1;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                if (data.data.Table3) {
                    $scope.XERO_DUPLICATE_ACCOUNT_CODE = data.data.Table3;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                if (data.data.Table6) {
                    $scope.SALES_OUTBOUNT_INTEGRATION_TO_MARKETMAN = data.data.Table6;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                $scope.FALLOUT_REPORTS = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };

    $scope.GET_FALLOUTS();
    $scope.POPUP_VIEW_EPOS_ERROR = function (FR) {
        $('#FIELD_VALUE').modal('show');
        $scope.FalloutReportSearch.EPOS_ERROR = FR.SERVICE_ERROR;
    };
    $scope.RE_SYNC_EPOS_DATA = function (FR) {
        $scope.EPOS_REFRESH(7, FR);
    };

    $scope.EPOS_REFRESH = function (INTEGRATION_STATUS, REFRESH_OBJ) {
        if (confirm('Are you sure you want to Refresh EPOS Data?')) {
            $scope.buttonClicked = true;
            $interval(function () {
                $scope.buttonClicked = false;
            }, 60000);
            $scope.$parent.$parent.overlay_loading_coffee = 'block';
            var CashupModelObj = new Object();
            CashupModelObj.CASHUP_MAIN_ID = REFRESH_OBJ.CASHUP_MAIN_ID;
            CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
            CashupModelObj.USERID = parseInt($cookies.get("USERID"));
            CashupModelObj.SYNC_SOURCE = 2; //1 Auto Sync, 2 Web App, 3 Monitoring, 4 DB
            REFRESH_OBJ.CURRENT_STATUS = 1;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'UPD_CASHUP_MAIN_FOR_INTEGRATION').then(function (data) {
                if (data.data == 1) {
                    $scope.ShowWait = true;
                }
                $scope.start();
            });
        }
    };

    $scope.XERO_REFRESH = function (XERO_OBJ) {
        $scope.FalloutReportSearch_Xero.XERO_OBJ = XERO_OBJ;
        $('#XERO_RESYNC').modal('show');
    };
    $scope.INS_UPD_CSTMR_INTGRTNS_LST_PICUP_DT = function () {
        var counter = 0;
        if ($scope.FalloutReportSearch_Xero.LAST_PICKUP_DATE == null) {
            $scope.$parent.ShowAlert('Attention', 'Please Select Xero refresh date', 3000);
            counter += 1;
        }
        if (counter == 0) {
            debugger;
            var Model = new Object();
            Model.CUSTOMER_INTEGRATION_ID = $scope.FalloutReportSearch_Xero.XERO_OBJ.CUSTOMER_INTEGRATION_ID;
            Model.LAST_PICKUP_DATE = $scope.FalloutReportSearch_Xero.LAST_PICKUP_DATE;
            Model.ERROR_MESSAGE = "";
            Model.INTEGRATION_STATUS = 0;
            //Model.JOURNAL_LAST_PICKUP_DATE = $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE == "" || $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE == null ? null : $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE;
            //Model.JOURNAL_PICKUP_FLAG = $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_FLAG == true ? 0 : null;
            if ($scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_FLAG == true && $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE != "" && $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE != null) {
                Model.JOURNAL_LAST_PICKUP_DATE = 0;
                Model.JOURNAL_LAST_PICKUP_DATE = $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE;
            }
            else {
                Model.JOURNAL_LAST_PICKUP_DATE = null;
                Model.JOURNAL_LAST_PICKUP_DATE = null;
            }

            PrcCommMethods.ADMIN_API(Model, 'INS_UPD_CSTMR_INTGRTNS_LST_PICUP_DT').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Record updated successfully.', 3000);
                    $('#XERO_RESYNC').modal('hide');
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Fail to update record.', 3000);
                    $('#XERO_RESYNC').modal('hide');
                }
            });
        }
    };


    $scope.SELECT_JOURNAL_PICKUP_DATE_CHANGE = function (selectedDate) {
        if (selectedDate == null || selectedDate == "")
            $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_FLAG = false;
        else
            $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_FLAG = true;
    };
    $scope.XERO_RESET = function () {
        $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_FLAG = false;
        $scope.FalloutReportSearch_Xero.JOURNAL_PICKUP_DATE = null;
        $scope.FalloutReportSearch_Xero.LAST_PICKUP_DATE = null;
    };
});
app.controller('RequestFormController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.ENTITY_SUB_MODULES = [];
    $scope.MODULE_ID = parseInt($cookies.get("MODULE_ID"));

    $scope.GET_ENTITY_SUB_MODULES = function () {
        var Model = new Object();
        Model.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        Model.MODULE_ID = $scope.MODULE_ID
        PrcCommMethods.ADMIN_API(Model, 'GET_ENTITY_SUB_MODULES').then(function (data) {
            $scope.ENTITY_SUB_MODULES = data.data.Table;
        });
    };
    $scope.GET_ENTITY_SUB_MODULES();

    $scope.ENTITY_SUB_MODULES_CLICK = function (OPEN_URL) {
        window.open(OPEN_URL);
    };
});
app.controller('ReportMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Report Mapping";
    $scope.$parent.urlpath = "Report_Mapping";

    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.ROLE_LIST = [];
    $scope.REPORTMAPPING_SETTING = [];
    var EntSettingModelObj;
    $scope.SettingSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 1000,
        CUSTOMER_ID: null,
        ENTITY_ID: null
    };
    $scope.ResetRPTSETTING = function () {
        $scope.SettingSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            CUSTOMER_ID: null,
            ENTITY_LIST: null
        };
        $scope.ENTITY_LIST = [];
        $scope.ReportMappingSettingForm.submitted = false;
        $scope.REPORTMAPPING_SETTING = [];
        $scope.ROLE_LIST = [];
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.SettingSearch.CUSTOMER_ID != undefined) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.CUSTOMER_ID = $scope.SettingSearch.CUSTOMER_ID;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 0;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntSettingModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else {
            $scope.ENTITY_LIST = [];
            $scope.ROLE_LIST = [];
            $scope.REPORTMAPPING_SETTING = [];
        };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        EntSettingModelObj = new Object();
        EntSettingModelObj.CUSTOMER_NAME = '';
        EntSettingModelObj.CUSTOMER_CODE = '';
        EntSettingModelObj.ACTIVE = 1;
        EntSettingModelObj.PAGE_NO = 1;
        EntSettingModelObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        EntSettingModelObj.IS_LIVE = -1;//$scope.CustomerSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(EntSettingModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ROLE_REPORT_MAPPING = function () {
        if ($scope.SettingSearch.ENTITY_ID != undefined && $scope.SettingSearch.ROLE_ID != undefined) {
            document.getElementById("overlay_loading").style.display = "block";
            EntSettingModelObj = new Object();
            EntSettingModelObj.ENTITY_ID = $scope.SettingSearch.ENTITY_ID;
            EntSettingModelObj.ROLE_ID = $scope.SettingSearch.ROLE_ID;
            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'GET_ROLE_REPORT_MAPPING').then(function (data) {
                if (data.data.Table.length > 0)
                    $scope.REPORTMAPPING_SETTING = data.data.Table;

                document.getElementById("overlay_loading").style.display = "none";
            });
        }
        else { $scope.REPORTMAPPING_SETTING = []; document.getElementById("overlay_loading").style.display = "none"; }
    };
    $scope.GET_ROLE_LIST = function (FLAG) {
        if ($scope.SettingSearch.ENTITY_ID != null && $scope.SettingSearch.ENTITY_ID != undefined) {
            EntSettingModelObj = new Object();
            EntSettingModelObj.CUSTOMER_ID = $scope.SettingSearch.CUSTOMER_ID;
            EntSettingModelObj.ENTITY_ID = $scope.SettingSearch.ENTITY_ID;
            EntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
            EntSettingModelObj.ROLE_DESCRIPTION = '';
            EntSettingModelObj.ROLE_NAME = ''
            EntSettingModelObj.MODULE_IDS = 2;//$scope.RoleSearch.MODULE_IDS;
            EntSettingModelObj.ACTIVE = 1;
            EntSettingModelObj.PAGE_NO = 1;
            EntSettingModelObj.PAGE_SIZE = 999;

            PrcCommMethods.ADMIN_API(EntSettingModelObj, 'GET_ROLE_LIST').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ROLE_LIST = data.data.Table;
                }
            });
        }
        else {
            $scope.ROLE_LIST = [];
        }
    };
    $scope.ADMIN_INS_UPD_ROLE_REPORT_MAPPING = function () {
        RPTEntSettingModelObj = new Object();
        $scope.ReportMappingSettingForm.submitted = true;
        if ($scope.ReportMappingSettingForm.$valid) {
            try {
                var SELECTED_FIELDS = [];
                angular.forEach($scope.REPORTMAPPING_SETTING, function (setting) {
                    var RPTSettingCollectionObj = new Object();
                    if (setting.ASSIGNED == true) {
                        RPTSettingCollectionObj.TABLE_ID = setting.REPORT_ID;
                        SELECTED_FIELDS.push(RPTSettingCollectionObj);
                    }
                });
                if (SELECTED_FIELDS.length == 0) {
                    var RPTSettingCollectionObj = new Object();
                    RPTSettingCollectionObj.TABLE_ID = 0;
                    SELECTED_FIELDS.push(RPTSettingCollectionObj);
                }
                RPTEntSettingModelObj.REPORT_IDS = SELECTED_FIELDS;
                RPTEntSettingModelObj.ENTITY_ID = $scope.SettingSearch.ENTITY_ID;
                RPTEntSettingModelObj.ROLE_ID = $scope.SettingSearch.ROLE_ID;
                RPTEntSettingModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.ADMIN_API(RPTEntSettingModelObj, 'ADMIN_INS_UPD_ROLE_REPORT_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                        $scope.ResetRPTSETTING();
                    }
                });
            }
            catch (e) {
                $scope.$parent.ShowAlert("Error", "Error", 3000);

            }
        }
    };
});
app.controller('MarkermanFalloutReportsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "MARKETMAN FALLOUT REPORT";
    $scope.$parent.urlpath = 'MarkermanFalloutReport';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.MM_FALLOUT_REPORTS = [];
    $scope.MM_FALLOUT_REPORTS_DETAILS = [];
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.MM_TYPE = [
        {
            MM_TYPE_ID: 1, MM_TYPE_VALUE: 'TAX LEVELS'
        }, {
            MM_TYPE_ID: 2, MM_TYPE_VALUE: 'VENDORS'
        }, {
            MM_TYPE_ID: 3, MM_TYPE_VALUE: 'CATEGORIES'
        }, {
            MM_TYPE_ID: 4, MM_TYPE_VALUE: 'CATALOG ITEMS'
        }, {
            MM_TYPE_ID: 5, MM_TYPE_VALUE: 'INVENTORY ITEMS'
        }, {
            MM_TYPE_ID: 6, MM_TYPE_VALUE: 'PURCHASE ITEMS'
        }, {
            MM_TYPE_ID: 7, MM_TYPE_VALUE: 'PREP ITEMS'
        }, {
            MM_TYPE_ID: 8, MM_TYPE_VALUE: 'PREP SUB ITEMS'
        }, {
            MM_TYPE_ID: 9, MM_TYPE_VALUE: 'MENU ITEM'
        }, {
            MM_TYPE_ID: 10, MM_TYPE_VALUE: 'MENU SUB ITEMS'
        }, {
            MM_TYPE_ID: 11, MM_TYPE_VALUE: 'STORAGE'
        }, {
            MM_TYPE_ID: 12, MM_TYPE_VALUE: 'SKU'
        }, {
            MM_TYPE_ID: 13, MM_TYPE_VALUE: 'LOCATION SYNC INFO'
        }, {
            MM_TYPE_ID: 14, MM_TYPE_VALUE: 'ORDERS'
        }, {
            MM_TYPE_ID: 15, MM_TYPE_VALUE: 'ORDER ITEMS'
        }, {
            MM_TYPE_ID: 16, MM_TYPE_VALUE: 'ORDER HISTORY'
        }, {
            MM_TYPE_ID: 17, MM_TYPE_VALUE: 'VALID DATES'
        }, {
            MM_TYPE_ID: 18, MM_TYPE_VALUE: 'INVENTORY COUNTS'
        }, {
            MM_TYPE_ID: 19, MM_TYPE_VALUE: 'INVENTORY COUNT LINES'
        }, {
            MM_TYPE_ID: 20, MM_TYPE_VALUE: 'TRANSFER'
        }, {
            MM_TYPE_ID: 21, MM_TYPE_VALUE: 'TRANSFER LINES'
        }, {
            MM_TYPE_ID: 22, MM_TYPE_VALUE: 'WASTE EVENT'
        }, {
            MM_TYPE_ID: 23, MM_TYPE_VALUE: 'WASTE EVENT LINES'
        }, {
            MM_TYPE_ID: 24, MM_TYPE_VALUE: 'DOCS'
        }, {
            MM_TYPE_ID: 25, MM_TYPE_VALUE: 'DOC HISTORY'
        }, {
            MM_TYPE_ID: 26, MM_TYPE_VALUE: 'DOC LINES'
        }, {
            MM_TYPE_ID: 27, MM_TYPE_VALUE: 'SALES SUMMARY'
        }, {
            MM_TYPE_ID: 28, MM_TYPE_VALUE: 'CATEGORY SALES SUMMARY'
        }, {
            MM_TYPE_ID: 29, MM_TYPE_VALUE: 'TRANSACTIONS'
        }
    ];

    var MM_ModelObj;
    $scope.MMFalloutReportSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        MM_LOG_ID: null, MM_TYPE_ID: null,
        FIRST_VISIT: 0, CLICK_SEARCH: 0, MM_LOG_TYPE_ID: null, MM_TYPE_NAME: null
    };
    $scope.GET_ENTITY_LIST = function () {
        MM_ModelObj = new Object();
        MM_ModelObj.ACTIVE = 1;
        MM_ModelObj.PAGE_NO = 0;
        MM_ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        MM_ModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(MM_ModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; };
        });
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        var BrnModelObj = new Object();
        BrnModelObj.ENTITY_ID = $scope.MMFalloutReportSearch.ENTITY_ID;
        BrnModelObj.CUSTOMER_ID = '';
        BrnModelObj.BRANCH_CODE = '';
        BrnModelObj.BRANCH_NAME = '';
        BrnModelObj.CONTACT_NAME = '';
        BrnModelObj.LOCATION_IDS = '';
        BrnModelObj.ACTIVE = 1;
        BrnModelObj.PAGE_NO = 0;
        BrnModelObj.PAGE_SIZE = 0;
        BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    };
    $scope.MM_RESET_FALLOUT_REPORTS = function () {
        $scope.MMFalloutReportSearch.ENTITY_ID = null;
        $scope.MMFalloutReportSearch.BRANCH_ID = null;
        $scope.MMFalloutReportSearch.PAGE_NO = 1;
        $scope.MMFalloutReportSearch.PAGE_SIZE = 10;
        $scope.MMFalloutReportSearch.MM_LOG_ID = null;
        $scope.MMFalloutReportSearch.MM_TYPE_ID = null;
        $scope.MMFalloutReportSearch.FIRST_VISIT = 0;
        $scope.BRANCH_LIST = [];
        $scope.MM_FALLOUT_REPORTS = [];
        $scope.MMFalloutReportSearch.MM_LOG_ID = '';
        $scope.GET_MRKTMN_LOGS();
    };
    $scope.GET_MRKTMN_LOGS = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        MM_ModelObj = new Object();
        if (FLAG == 1) {
            $scope.MMFalloutReportSearch.PAGE_NO = 1;
            $scope.MMFalloutReportSearch.CLICK_SEARCH = 1;
            $scope.MM_FALLOUT_REPORTS = [];
        }
        MM_ModelObj.ENTITY_ID = $scope.MMFalloutReportSearch.ENTITY_ID;
        MM_ModelObj.BRANCH_ID = $scope.MMFalloutReportSearch.BRANCH_ID;
        MM_ModelObj.START_DATE = $scope.MMFalloutReportSearch.START_DATE;
        MM_ModelObj.END_DATE = $scope.MMFalloutReportSearch.END_DATE;
        MM_ModelObj.MM_TYPE = $scope.MMFalloutReportSearch.MM_TYPE_ID == null ? 0 : $scope.MMFalloutReportSearch.MM_TYPE_ID;
        MM_ModelObj.MM_LOGS_ID = $scope.MMFalloutReportSearch.MM_LOG_ID == null ? 0 : $scope.MMFalloutReportSearch.MM_LOG_ID;
        MM_ModelObj.PAGE_NO = $scope.MMFalloutReportSearch.PAGE_NO;
        MM_ModelObj.PAGE_SIZE = $scope.MMFalloutReportSearch.PAGE_SIZE;

        PrcCommMethods.ADMIN_API(MM_ModelObj, 'GET_MRKTMN_LOGS').then(function (data) {
            $scope.MMFalloutReportSearch.FIRST_VISIT += 1;
            if (data.data.Table.length > 0) {
                $scope.MM_FALLOUT_REPORTS = $scope.MM_FALLOUT_REPORTS.concat(data.data.Table);
                if (data.data.Table.length < $scope.MMFalloutReportSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.MMFalloutReportSearch.PAGE_NO = parseInt($scope.MMFalloutReportSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.MM_FALLOUT_REPORTS.length == 0) {
                }
                $scope.GetData = false;
            }

            document.getElementById("overlay_loading").style.display = "none";
        });

    };
    $scope.LAZY_GET_MRKTMN_LOGS = function () {
        $scope.GET_MRKTMN_LOGS();
    };
    $scope.GET_MRKTMN_LOG_DETAILS = function (MM_DETAILS) {
        $scope.MMFalloutReportSearch.MM_TYPE_NAME = null;
        $scope.EXCEL_REPORT_DATA_LIST = [];
        MM_ModelObj = new Object();
        MM_ModelObj.MM_LOGS_ID = MM_DETAILS.MM_LOGS_ID;
        MM_ModelObj.MM_TYPE = MM_DETAILS.TYPE;
        PrcCommMethods.ADMIN_API(MM_ModelObj, 'GET_MRKTMN_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MMFalloutReportSearch.MM_TYPE_NAME = MM_DETAILS.TYPE_NAME;
                $scope.MMFalloutReportSearch.REPORT_TYPE = MM_DETAILS.TYPE;
                $scope.MMFalloutReportSearch.REPORT_MM_LOGS_ID = MM_DETAILS.MM_LOGS_ID;
                $scope.MM_FALLOUT_REPORTS_DETAILS = data.data.Table;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                $('#MM_FALLOUT_REPORT_DETAILS_TAXLEVEL_1').modal('show');
            }
        });
    };
    $scope.DOWNLOAD_EXCEL = function () {
        $scope.EXCEL_REPORT_DATA_LIST = [];
        angular.forEach($scope.MM_FALLOUT_REPORTS_DETAILS, function (item) {
            $scope.SELECTED_DATA = [];
            for (var i = 0; i < $scope.JSON_COLUMN_NAME.length; i++) {
                item[$scope.JSON_COLUMN_NAME[i]] == null ? item[$scope.JSON_COLUMN_NAME[i]] = "" : item[$scope.JSON_COLUMN_NAME[i]] = item[$scope.JSON_COLUMN_NAME[i]];
            }
            $scope.EXCEL_REPORT_DATA_LIST.push(item);
        });
        if ($scope.EXCEL_REPORT_DATA_LIST.length > 0) {
            alasql('SELECT * INTO XLSX("' + $scope.MMFalloutReportSearch.MM_TYPE_NAME + '_' + $scope.MMFalloutReportSearch.REPORT_MM_LOGS_ID + '_' + $scope.MMFalloutReportSearch.REPORT_TYPE + '",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'No Records Found', 3000);
        }
    };

    function MM_reportrange(startDate, endDate) {
        $scope.MMFalloutReportSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.MMFalloutReportSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#MM_reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
        if ($scope.MMFalloutReportSearch.FIRST_VISIT == 0) { $scope.GET_MRKTMN_LOGS(); }
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        $scope.$parent.SetUpDateRangeMultiDatePicker('MM_reportrange', startDate, endDate, MM_reportrange);
        $('#MM_reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    });



});
app.controller('EmailFalloutController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "EMAIL FALLOUT";
    $scope.$parent.urlpath = 'EmailFallout';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.EMAIL_NOTIFICATION_LOG_LIST = [];
    $scope.NOTIFICATION_LIST = [];
    $scope.STATUS_ID_LIST = [
        { STATUS_ID: 0, STATUS_NAME: 'Pending' }, { STATUS_ID: 1, STATUS_NAME: 'Pickedup By Service' }, { STATUS_ID: 2, STATUS_NAME: 'Sent' }
        , { STATUS_ID: 3, STATUS_NAME: 'Error' }, { STATUS_ID: -1, STATUS_NAME: 'Email Not Assigned' }];


    var EmailL_ModelObj = null;
    $scope.EmailFalloutSearch = {
        CUSTOMER_ID: null, STATUS_IDS: null, NOTIFICATION_MASTER_IDS: null, USER_NAME_EMAIL: '',
        ENTITY_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.EmailFalloutSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = $scope.EmailFalloutSearch.CUSTOMER_CODE;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.EmailFalloutSearch.CUSTOMER_ID != undefined && $scope.EmailFalloutSearch.CUSTOMER_ID != '' && $scope.EmailFalloutSearch.CUSTOMER_ID != null) {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.EmailFalloutSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.GET_NOTIFICATIONS_MASTER = function () {
        CusModelObj = new Object();
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_NOTIFICATIONS_MASTER').then(function (data) {
            $scope.NOTIFICATION_LIST = data.data.Table;
        });
    };
    $scope.GET_NOTIFICATIONS_MASTER();
    $scope.GET_NOTIFICATIONS_LOG = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        EmailL_ModelObj = new Object();
        if (FLAG == 1) {
            $scope.EmailFalloutSearch.CLICK_SEARCH = 1;
            $scope.EMAIL_NOTIFICATION_LOG_LIST = [];
            $scope.EmailFalloutSearch.PAGE_NO = 1;
        }

        EmailL_ModelObj.CUSTOMER_ID = $scope.EmailFalloutSearch.CUSTOMER_ID;
        EmailL_ModelObj.ENTITY_ID = $scope.EmailFalloutSearch.ENTITY_ID;
        EmailL_ModelObj.NOTIFICATION_MASTER_IDS = $scope.EmailFalloutSearch.NOTIFICATION_MASTER_IDS == null ? null : $scope.EmailFalloutSearch.NOTIFICATION_MASTER_IDS.toString();
        EmailL_ModelObj.USER_NAME_EMAIL = $scope.EmailFalloutSearch.USER_NAME_EMAIL;
        EmailL_ModelObj.STATUS_IDS = $scope.EmailFalloutSearch.STATUS_IDS == null ? null : $scope.EmailFalloutSearch.STATUS_IDS.toString();
        EmailL_ModelObj.PAGE_NO = $scope.EmailFalloutSearch.PAGE_NO;
        EmailL_ModelObj.PAGE_SIZE = $scope.EmailFalloutSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(EmailL_ModelObj, 'GET_NOTIFICATIONS_LOG').then(function (data) {
            CusModelObj = new Object();
            //$scope.EMAIL_NOTIFICATION_LOG_LIST = data.data.Table;

            if (data.data.Table.length > 0) {
                $scope.EMAIL_NOTIFICATION_LOG_LIST = $scope.EMAIL_NOTIFICATION_LOG_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.EmailFalloutSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.EmailFalloutSearch.PAGE_NO = parseInt($scope.EmailFalloutSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.EMAIL_NOTIFICATION_LOG_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.GET_NOTIFICATIONS_LOG();
    $scope.LAZY_GET_NOTIFICATIONS_LOG = function () {
        $scope.GET_NOTIFICATIONS_LOG();
    };
    $scope.RESEND_NOTIFICATION = function (Obj, SEND_ID) {
        EmailL_ModelObj = new Object();
        EmailL_ModelObj.TABLE_ID = Obj.TABLE_ID;
        PrcCommMethods.ADMIN_API(EmailL_ModelObj, 'RESEND_NOTIFICATION').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Record updated successfully', 3000);
                document.getElementById(SEND_ID).className = "btn btn-w-default btn-sm";
            }
            else {
                $scope.$parent.ShowAlert('Success', 'Record updated successfully', 3000);
            }

        });
    };

    $scope.EMAIL_RESET_FALLOUT = function () {

        $scope.EmailFalloutSearch = {
            CUSTOMER_ID: null,
            STATUS_IDS: null,
            NOTIFICATION_MASTER_IDS: null,
            USER_NAME_EMAIL: '',
            ENTITY_ID: null,
            BRANCH_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10
        };
        $scope.STATUS_ID_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.EMAIL_NOTIFICATION_LOG_LIST = [];
        $scope.NOTIFICATION_LIST = [];
        $scope.GET_NOTIFICATIONS_LOG();
        $scope.GET_NOTIFICATIONS_MASTER();
        $scope.STATUS_ID_LIST = [
            { STATUS_ID: 0, STATUS_NAME: 'Pending' }, { STATUS_ID: 1, STATUS_NAME: 'Pickedup By Service' }, { STATUS_ID: 2, STATUS_NAME: 'Sent' }
            , { STATUS_ID: 3, STATUS_NAME: 'Error' }, { STATUS_ID: -1, STATUS_NAME: 'Email Not Assigned' }];
        //$("#mySelect2").val("");
        //$("#mySelect2").trigger("change");
        ////$('#mySelect2').val(-100).trigger('change');
    };

    $scope.GET_MRKTMN_LOGS = function (FLAG) {
        MM_ModelObj = new Object();
        if (FLAG == 1) {
            $scope.MMFalloutReportSearch.PAGE_NO = 1;
            $scope.MMFalloutReportSearch.CLICK_SEARCH = 1;
            $scope.MM_FALLOUT_REPORTS = [];
        }
        MM_ModelObj.ENTITY_ID = $scope.MMFalloutReportSearch.ENTITY_ID;
        MM_ModelObj.BRANCH_ID = $scope.MMFalloutReportSearch.BRANCH_ID;
        MM_ModelObj.START_DATE = $scope.MMFalloutReportSearch.START_DATE;
        MM_ModelObj.END_DATE = $scope.MMFalloutReportSearch.END_DATE;
        MM_ModelObj.MM_TYPE = $scope.MMFalloutReportSearch.MM_TYPE_ID == null ? 0 : $scope.MMFalloutReportSearch.MM_TYPE_ID;
        MM_ModelObj.MM_LOGS_ID = $scope.MMFalloutReportSearch.MM_LOG_ID == null ? 0 : $scope.MMFalloutReportSearch.MM_LOG_ID;
        MM_ModelObj.PAGE_NO = $scope.MMFalloutReportSearch.PAGE_NO;
        MM_ModelObj.PAGE_SIZE = $scope.MMFalloutReportSearch.PAGE_SIZE;

        PrcCommMethods.ADMIN_API(MM_ModelObj, 'GET_MRKTMN_LOGS').then(function (data) {
            $scope.MMFalloutReportSearch.FIRST_VISIT += 1;
            if (data.data.Table.length > 0) {
                $scope.MM_FALLOUT_REPORTS = $scope.MM_FALLOUT_REPORTS.concat(data.data.Table);
                if (data.data.Table.length < $scope.MMFalloutReportSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.MMFalloutReportSearch.PAGE_NO = parseInt($scope.MMFalloutReportSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.MM_FALLOUT_REPORTS.length == 0) {
                }
                $scope.GetData = false;
            }


        });

    };

    $scope.GET_MRKTMN_LOG_DETAILS = function (MM_DETAILS) {
        $scope.MMFalloutReportSearch.MM_TYPE_NAME = null;
        $scope.EXCEL_REPORT_DATA_LIST = [];
        MM_ModelObj = new Object();
        MM_ModelObj.MM_LOGS_ID = MM_DETAILS.MM_LOGS_ID;
        MM_ModelObj.MM_TYPE = MM_DETAILS.TYPE;
        PrcCommMethods.ADMIN_API(MM_ModelObj, 'GET_MRKTMN_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.MMFalloutReportSearch.MM_TYPE_NAME = MM_DETAILS.TYPE_NAME;
                $scope.MMFalloutReportSearch.REPORT_TYPE = MM_DETAILS.TYPE;
                $scope.MMFalloutReportSearch.REPORT_MM_LOGS_ID = MM_DETAILS.MM_LOGS_ID;
                $scope.MM_FALLOUT_REPORTS_DETAILS = data.data.Table;
                $scope.JSON_COLUMN_NAME = Object.keys(data.data.Table[0]);
                $('#MM_FALLOUT_REPORT_DETAILS_TAXLEVEL_1').modal('show');
            }
        });
    };


});
app.controller('CashupIntegrationFalloutsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "CASHUP INTEGRATION FALLOUTS";
    $scope.$parent.urlpath = 'CashupIntegrationFallouts';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.CASHUP_INTEGRATION_FALLOUTS_LIST = [];
    $scope.RE_PROCESS_BRANCH_LIST = [];
    $scope.RE_PROCESS_ENTITY_LIST = [];
    var CahupInt_ModelObj = null;

    $scope.CashupIntegrationFalloutsSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        BRANCH_ID: null,
    };
    $scope.CashupIntegrationFalloutsReprocessSearch = {
        RE_PROCESS_CUSTOMER_ID: null, RE_PROCESS_ENTITY_ID: null, RE_PROCESS_BRANCH_ID: null,
        RE_PROCESS_START_DATE: null
    };
    $scope.ADMIN_GET_CUSTOMER = function () {
        CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = $scope.CashupIntegrationFalloutsSearch.CUSTOMER_CODE;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            $scope.RE_PROCESS_CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID != undefined && $scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID != '' && $scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID != null) {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_BRANCH = function () {

        if ($scope.CashupIntegrationFalloutsSearch.ENTITY_ID != null) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.CashupIntegrationFalloutsSearch.CUSTOMER_ID;
            BrnModelObj.ENTITY_ID = $scope.CashupIntegrationFalloutsSearch.ENTITY_ID;
            BrnModelObj.BRANCH_CODE = $scope.CashupIntegrationFalloutsSearch.BRANCH_CODE;
            BrnModelObj.BRANCH_NAME = $scope.CashupIntegrationFalloutsSearch.BRANCH_NAME;
            BrnModelObj.CONTACT_NAME = $scope.CashupIntegrationFalloutsSearch.CONTACT_NAME;
            BrnModelObj.LOCATION_IDS = null;//$scope.GroupSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 0//$scope.GroupSearch.PAGE_NO;
            BrnModelObj.PAGE_SIZE = 0//$scope.GroupSearch.PAGE_SIZE;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data == null && (data.data == undefined || data.data == null))
                    $scope.BRANCH_LIST = [];
                else { $scope.BRANCH_LIST = data.data.Table; }
            });
        }
        else { $scope.BRANCH_LIST = []; }
    };
    $scope.RE_PROCESS_GET_ENTITY_LIST = function () {

        if ($scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_CUSTOMER_ID != undefined && $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_CUSTOMER_ID != '' && $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_CUSTOMER_ID != null) {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.PAGE_SIZE = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.RE_PROCESS_ENTITY_LIST = data.data.Table;
                }
                else { $scope.RE_PROCESS_ENTITY_LIST = []; };
            });
        }
        else { $scope.PROCESSED_ENTITY_LIST = []; };
    };
    $scope.RE_PROCESS_ADMIN_GET_BRANCH = function () {

        if ($scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_ENTITY_ID != null) {
            var BrnModelObj = new Object();
            BrnModelObj.CUSTOMER_ID = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_CUSTOMER_ID;
            BrnModelObj.ENTITY_ID = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_ENTITY_ID;
            BrnModelObj.BRANCH_CODE = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_BRANCH_CODE;
            BrnModelObj.BRANCH_NAME = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_BRANCH_NAME;
            BrnModelObj.CONTACT_NAME = null;
            BrnModelObj.LOCATION_IDS = null;//$scope.GroupSearch.LOCATION_ID;
            BrnModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            BrnModelObj.PAGE_NO = 0//$scope.GroupSearch.PAGE_NO;
            BrnModelObj.PAGE_SIZE = 0//$scope.GroupSearch.PAGE_SIZE;
            BrnModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data == null && (data.data == undefined || data.data == null))
                    $scope.RE_PROCESS_BRANCH_LIST = [];
                else { $scope.RE_PROCESS_BRANCH_LIST = data.data.Table; }
            });
        }
        else { $scope.RE_PROCESS_BRANCH_LIST = []; }
    };
    $scope.OPEN_RE_PROCESS_POPUP = function () {
        $scope.CashupIntegrationFalloutsReprocessForm.submitted = false;
        $("#CASHUP_INTEGRATION_FALLOUTS").modal("show");
    };
    $scope.ADMIN_GET_CASHUP_FALLOUT_REPORT = function (FLAG) {
        document.getElementById("overlay_loading").style.display = "block";
        CahupInt_ModelObj = new Object();
        if (FLAG == 1) {
            $scope.CashupIntegrationFalloutsSearch.CLICK_SEARCH = 1;
            $scope.CASHUP_INTEGRATION_FALLOUTS_LIST = [];
            $scope.CashupIntegrationFalloutsSearch.PAGE_NO = 1;
        }
        CahupInt_ModelObj.ENTITY_ID = $scope.CashupIntegrationFalloutsSearch.ENTITY_ID;
        CahupInt_ModelObj.BRANCH_ID = $scope.CashupIntegrationFalloutsSearch.BRANCH_ID == null ? null : $scope.CashupIntegrationFalloutsSearch.BRANCH_ID;
        CahupInt_ModelObj.PAGE_NO = $scope.CashupIntegrationFalloutsSearch.PAGE_NO;
        CahupInt_ModelObj.PAGE_SIZE = $scope.CashupIntegrationFalloutsSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CahupInt_ModelObj, 'ADMIN_GET_CASHUP_FALLOUT_REPORT').then(function (data) {
            CusModelObj = new Object();
            //$scope.EMAIL_NOTIFICATION_LOG_LIST = data.data.Table;

            if (data.data.Table.length > 0) {
                $scope.CASHUP_INTEGRATION_FALLOUTS_LIST = $scope.CASHUP_INTEGRATION_FALLOUTS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.CashupIntegrationFalloutsSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CashupIntegrationFalloutsSearch.PAGE_NO = parseInt($scope.CashupIntegrationFalloutsSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.CASHUP_INTEGRATION_FALLOUTS_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };
    $scope.ADMIN_GET_CASHUP_FALLOUT_REPORT();
    $scope.LAZY_ADMIN_GET_CASHUP_FALLOUT_REPORT = function () {
        $scope.ADMIN_GET_CASHUP_FALLOUT_REPORT();
    };
    $scope.ADMIN_REPROCESS_CASHUP_MAIN = function (Obj, SEND_ID) {
        CahupInt_ModelObj = new Object();
        CahupInt_ModelObj.CASHUP_MAIN_ID = Obj.CASHUP_MAIN_ID;
        CahupInt_ModelObj.BRANCH_ID = null;
        CahupInt_ModelObj.CASHUP_DATE = null;
        PrcCommMethods.ADMIN_API(CahupInt_ModelObj, 'ADMIN_REPROCESS_CASHUP_MAIN').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Record updated successfully', 3000);
                document.getElementById(SEND_ID).className = "btn btn-w-default btn-sm";
            }
            else {
                $scope.$parent.ShowAlert('Success', 'Record updated successfully', 3000);
            }

        });
    };

    $scope.INTEGRATION_FALLOUT_RESET = function () {
        $scope.CashupIntegrationFalloutsSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            BRANCH_ID: null,
        };
        $scope.BRANCH_LIST = [];
        $scope.ENTITY_LIST = [];
        $scope.CASHUP_INTEGRATION_FALLOUTS_LIST = [];
        $scope.ADMIN_GET_CASHUP_FALLOUT_REPORT();
    };
    $scope.INTEGRATION_PROCESSED_RESET = function () {
        $scope.CashupIntegrationFalloutsReprocessForm.submitted = false;
        $scope.CashupIntegrationFalloutsReprocessSearch = {
            RE_PROCESS_CUSTOMER_ID: null, RE_PROCESS_ENTITY_ID: null, RE_PROCESS_BRANCH_ID: null,
            RE_PROCESS_START_DATE: null
        };
        $scope.RE_PROCESS_BRANCH_LIST = [];
        $scope.RE_PROCESS_ENTITY_LIST = [];
    };
    $scope.PROCESS_DATE_WISE_DATA = function () {
        $scope.CashupIntegrationFalloutsReprocessForm.submitted = true;
        if ($scope.CashupIntegrationFalloutsReprocessForm.$valid) {
            CahupInt_ModelObj = new Object();
            CahupInt_ModelObj.CASHUP_MAIN_ID = 0;
            CahupInt_ModelObj.CASHUP_DATE = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_START_DATE;
            CahupInt_ModelObj.BRANCH_ID = $scope.CashupIntegrationFalloutsReprocessSearch.RE_PROCESS_BRANCH_ID;
            PrcCommMethods.ADMIN_API(CahupInt_ModelObj, 'ADMIN_REPROCESS_CASHUP_MAIN').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Success', 'Record updated successfully', 3000);
                    $scope.INTEGRATION_PROCESSED_RESET();
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Fail to update record', 3000);
                }

            });
        }
    };
});
app.controller('BranchCategoriesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Branch Category";
    $scope.$parent.urlpath = "BranchCategories";
    $scope.BRANCH_CATEGORIES = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.BranchCategoriesSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CATEGORY_NAME: null,
        CLICK_SEARCH: null,
        COMMENTS: "",
        BRANCH_CATEGORIE_ID: null
    };
    $scope.ADMIN_GET_BRANCH_CATEGORIES = function (FLAG) {

        var BrnModelObj = new Object();
        if (FLAG == 1) {
            $scope.BranchCategoriesSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_CATEGORIES = [];
            $scope.BranchCategoriesSearch.PAGE_NO = 1;
            BrnModelObj.ACTIVE = $scope.BranchCategoriesSearch.ACTIVE == -1 ? -1 : $scope.BranchCategoriesSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_CATEGORIES = [];
            BrnModelObj.ACTIVE = -1;
            $scope.BranchCategoriesSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.BranchCategoriesSearch.CLICK_SEARCH == 1)
                BrnModelObj.ACTIVE = $scope.BranchCategoriesSearch.ACTIVE == -1 ? -1 : $scope.BranchCategoriesSearch.ACTIVE ? 1 : 0;
            else {
                BrnModelObj.ACTIVE = -1;
            }
        }
        BrnModelObj.BRANCH_ID = $scope.BranchCategoriesSearch.CLICK_SEARCH == 1 ? $scope.BranchCategoriesSearch.BRANCH_ID : null;
        BrnModelObj.CATEGORY_NAME = $scope.BranchCategoriesSearch.CLICK_SEARCH == 1 ? $scope.BranchCategoriesSearch.CATEGORY_NAME : null;
        BrnModelObj.PAGE_NO = $scope.BranchCategoriesSearch.PAGE_NO;
        BrnModelObj.PAGE_SIZE = $scope.BranchCategoriesSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(BrnModelObj, 'ADMIN_GET_BRANCH_CATEGORIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_CATEGORIES = $scope.BRANCH_CATEGORIES.concat(data.data.Table);
                if (data.data.Table.length < $scope.BranchCategoriesSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BranchCategoriesSearch.PAGE_NO = parseInt($scope.BranchCategoriesSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.BRANCH_CATEGORIES.length == 0) {
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.ADMIN_GET_BRANCH_CATEGORIES();
    $scope.ADMIN_INS_UPD_BRANCH_CATEGORIES = function () {
        $scope.BranchCategoriesForm.submitted = true;
        if ($scope.BranchCategoriesForm.$valid) {
            if ($scope.BranchCategoriesSearch.ACTIVE != -1) {
                CommonObj = new Object();
                CommonObj.BRANCH_ID = $scope.BranchCategoriesSearch.BRANCH_CATEGORIE_ID == null ? null : $scope.BranchCategoriesSearch.BRANCH_CATEGORIE_ID;
                CommonObj.USER_ID = parseInt($cookies.get("USERID"));
                CommonObj.CATEGORY_NAME = $scope.BranchCategoriesSearch.CATEGORY_NAME;
                CommonObj.ACTIVE = $scope.BranchCategoriesSearch.ACTIVE;
                CommonObj.COMMENTS = $scope.BranchCategoriesSearch.COMMENTS;
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_BRANCH_CATEGORIES').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                    $scope.RESET_BRANCH_CATEGORIES();
                });
            }
            else { $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.BranchCategoriesForm.submitted = false; }

        }

    };
    $scope.EDIT_ADMIN_INS_UPD_BRANCH_CATEGORIES = function (BR) {

        $scope.BranchCategoriesSearch.BRANCH_CATEGORIE_ID = BR.BRANCH_CATEGORIE_ID;
        $scope.BranchCategoriesSearch.ACTIVE = BR.ACTIVE ? 1 : 0;
        $scope.BranchCategoriesSearch.CATEGORY_NAME = BR.CATEGORIE_NAME;
        $scope.BranchCategoriesSearch.COMMENTS = BR.COMMENTS;
        //$scope.ADMIN_GET_BRANCH_CATEGORIES();
    }
    $scope.RESET_BRANCH_CATEGORIES = function () {
        $scope.BranchCategoriesSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CATEGORY_NAME: null,
            CLICK_SEARCH: null,
            COMMENTS: ""
        };
        $scope.BranchCategoriesForm.submitted = false;
        $scope.BRANCH_CATEGORIES = [];
        $scope.ADMIN_GET_BRANCH_CATEGORIES();
    };
    $scope.LAZY_ADMIN_GET_BRANCH_CATEGORIES = function () { $scope.ADMIN_GET_BRANCH_CATEGORIES(); };

});
app.controller('BranchCategoriesMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.PAGE_HEADER = "Branch Categories Mapping";
    $scope.$parent.urlpath = "BranchCategoriesMapping";
    $scope.ENTITY_LIST = [];
    $scope.CUSTOMER_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.BRANCH_CATEGORIES = [];
    $scope.BRANCH_CATEGORIES_MAPPING = [];
    $scope.TABLE_ID = null;
    var CommonObj;
    $scope.BranchCategoriesMappingSearch = {
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null,
        CHECK_ALL_COUNTER: 0
    };
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.BranchCategoriesMappingSearch.CUSTOMER_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.BranchCategoriesMappingSearch.CUSTOMER_ID;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 0;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_CUSTOMER = function () {

        CommonObj = new Object();
        CommonObj.CUSTOMER_NAME = '';
        CommonObj.CUSTOMER_CODE = '';
        CommonObj.ACTIVE = 1;
        CommonObj.PAGE_NO = 1;
        CommonObj.PAGE_SIZE = 1000;//$scope.CustomerSearch.PAGE_SIZE;
        CommonObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
        CashupTabsObj = null;
    };
    $scope.GET_LOCATION = function () {
        if ($scope.BranchCategoriesMappingSearch.ENTITY_ID != undefined && $scope.BranchCategoriesMappingSearch.ENTITY_ID != null) {
            CommonObj = new Object()
            CommonObj.ENTITY_ID = $scope.BranchCategoriesMappingSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.BranchCategoriesMappingSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.BranchCategoriesMappingSearch.LOCATION_ID != null && $scope.BranchCategoriesMappingSearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.BranchCategoriesMappingSearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.BranchCategoriesMappingSearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.BranchCategoriesMappingSearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.BranchCategoriesMappingSearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.BranchCategoriesMappingSearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.BranchCategoriesMappingSearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.ADMIN_GET_BRANCH_CATEGORIES_MAPPING = function () {
        if ($scope.BranchCategoriesMappingSearch.CUSTOMER_ID != null && $scope.BranchCategoriesMappingSearch.BRANCH_ID != null && $scope.BranchCategoriesMappingSearch.BRANCH_ID != undefined) {
            CommonObj = new Object();
            CommonObj.BRANCH_ID = $scope.BranchCategoriesMappingSearch.BRANCH_ID;
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH_CATEGORIES_MAPPING').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER = 0;
                    $scope.BRANCH_CATEGORIES_MAPPING = data.data.Table;
                    angular.forEach($scope.BRANCH_CATEGORIES_MAPPING, function (item) {
                        if (item.TABLE_ID != 0)
                            $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER += 1;
                    });
                    $scope.BRANCH_CATEGORIES_MAPPING.length == $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER ? $scope.SELECTED_ALL = true : $scope.SELECTED_ALL = false;
                }
                else {
                    $scope.BRANCH_CATEGORIES_MAPPING = [];
                }
            });
        }
        else {
            $scope.BRANCH_CATEGORIES_MAPPING = [];
        }
    };

    $scope.ADMIN_INS_UPD_BRANCH_CATEGORIES_MAPPING = function () {
        $scope.BranchCategoriesMappingForm.submitted = true;
        if ($scope.BranchCategoriesMappingForm.$valid) {

            CommonObj = new Object();
            $scope.BRANCH_CATEGORIE_IDS = [];
            angular.forEach($scope.BRANCH_CATEGORIES_MAPPING, function (item) {
                if (item.SELECTED == true) {
                    if ($scope.BRANCH_CATEGORIE_IDS == '') {
                        $scope.BRANCH_CATEGORIE_IDS.push(item.BRANCH_CATEGORY_ID);
                    }
                    else {
                        $scope.BRANCH_CATEGORIE_IDS.push(item.BRANCH_CATEGORY_ID);
                    }
                }
            });

            CommonObj.BRANCH_ID = $scope.BranchCategoriesMappingSearch.BRANCH_ID;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            CommonObj.BRANCH_CATEGORIE_IDS = $scope.BRANCH_CATEGORIE_IDS.toString();;
            CommonObj.COMMENT = $scope.BranchCategoriesMappingSearch.COMMENTS;
            if ($scope.BRANCH_CATEGORIE_IDS.length > 0) {
                PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_INS_UPD_BRANCH_CATEGORIES_MAPPING').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.BRANCH_CATEGORIE_IDS = [];
                        $scope.RESET_BRANCH_CATEGORIES_MAPPING();
                    }
                    else {
                        $scope.$parent.ShowAlert("Error", "Data not saved", 3000);
                    }
                });
            }
            else {
                $scope.$parent.ShowAlert("Attention", "Please select at least one branch from the list.", 3000);
            }
        }
    };
    $scope.RESET_BRANCH_CATEGORIES_MAPPING = function () {
        $scope.BranchCategoriesMappingSearch = {
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 1000,
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            STAFF_NAME: ''
        }
        $scope.BranchCategoriesMappingForm.submitted = false;
        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.BRANCH_CATEGORIES_MAPPING = [];
    };
    $scope.SELECT_ALL = function () {
        $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER = 0;
        if ($scope.SELECTED_ALL == true) {
            angular.forEach($scope.BRANCH_CATEGORIES_MAPPING, function (item) {
                item.SELECTED = true;
                $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER += 1;
            });
        }
        else {
            angular.forEach($scope.BRANCH_CATEGORIES_MAPPING, function (item) {
                item.SELECTED = false;
                $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER -= 1;
            });
        }

    };
    $scope.SELECT_SINGLE_CHECKBOX = function (item) {
        if (item == true)
            $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER += 1;
        else
            $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER -= 1;

        $scope.BRANCH_CATEGORIES_MAPPING.length == $scope.BranchCategoriesMappingSearch.CHECK_ALL_COUNTER ? $scope.SELECTED_ALL = true : $scope.SELECTED_ALL = false;
    };
});
app.controller('IntegrationMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = "XERO INTEGRATION";
    $scope.$parent.urlpath = 'INTEGRATION';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.XERO_TOKEN = [];
    $scope.XERO_TENANTS = [];
    $scope.FILTERED_INTEGRATION_DETAIL = [];
    $scope.SELECTED_LIST = [];
    $scope.XERO_SUPPLIERS = [];
    $scope.IS_OUTBOUND_LIST = [{ 'ID': 0, 'OB_FLAG': 'No' }, { 'ID': 1, 'OB_FLAG': "Yes" }];
    $(".tooltip").remove();
    $scope.IntegrationMappingSearch = {
        URL: null,
        XEROCODE: null,
        grant_type: null,
        code: null,
        redirect_uri: null,
        Authorization: null,
        client_id: null,
        client_secret: null,
        COPY_XERO_TOKEN: null,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null, ID: null,
        GROUP_ID: null,
        IS_CONNECT_TO_XERO_BUTTON_CLICKED: false,
        IS_OUTBOUND: null,
        XERO_SUPPLIER: null,
        PAGE_NO: 0,
        PAGE_SIZE: 0,
        SUPPLIER_NAME: null,
        TAG_NAME: null,
    };
    $scope.REFRESH_FLAG = getUrlParameter('REFRESH_FLAG', $location.absUrl());
    $scope.SELECTED_XERO_CLIENT = $cookies.get('SELECTED_XERO_CLIENT') != undefined ? JSON.parse($cookies.get('SELECTED_XERO_CLIENT')) : undefined;
    $scope.XERO_SUPPLIER_UUID = $cookies.get('XERO_SUPPLIER_UUID') != undefined ? JSON.parse($cookies.get('XERO_SUPPLIER_UUID')) : undefined;
    //if ($scope.SELECTED_XERO_CLIENT!=undefined)
    //    $scope.SELECTED_XERO_CLIENT[0].XERO_SUPPLIER = $scope.XERO_SUPPLIER_UUID[0]['XERO_SUPPLIER_UUID'];

    $scope.newwindow;
    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.IntegrationMappingSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            if ($scope.SELECTED_XERO_CLIENT != undefined) {
                $scope.IntegrationMappingSearch.CUSTOMER_ID = $scope.SELECTED_XERO_CLIENT[0].CUSTOMER_ID;
                $scope.IntegrationMappingSearch.IS_OUTBOUND = $scope.SELECTED_XERO_CLIENT[0].IS_OUTBOUND == false ? 0 : 1;
                $scope.GET_ENTITY_LIST();
            }
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.IntegrationMappingSearch.CUSTOMER_ID != undefined || $scope.IntegrationMappingSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                    if ($scope.SELECTED_XERO_CLIENT != undefined) {
                        $scope.IntegrationMappingSearch.ENTITY_ID = $scope.SELECTED_XERO_CLIENT[0].ENTITY_ID;
                        $scope.ADMIN_GET_BRANCH();
                        $scope.EXCHANGE_CODE();
                    }
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_LOCATION = function () {
        if ($scope.IntegrationMappingSearch.ENTITY_ID != undefined && $scope.IntegrationMappingSearch.ENTITY_ID != null) {
            CusModelObj = new Object()
            CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CusModelObj.LOCATION_NAME = null;
            CusModelObj.LOCATION_CODE = null;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 1;
            CusModelObj.PAGE_SIZE = 1000;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {

        if ($scope.IntegrationMappingSearch.ENTITY_ID != null && $scope.IntegrationMappingSearch.ENTITY_ID != "") {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
            CusModelObj.BRANCH_CODE = null;
            CusModelObj.BRANCH_NAME = null;
            CusModelObj.CONTACT_NAME = null;
            CusModelObj.LOCATION_IDS = null;
            CusModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CusModelObj.PAGE_NO = 1;
            CusModelObj.PAGE_SIZE = 1000;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;

            });
        }
        else
            $scope.BRANCH_LIST = [];
    };
    $scope.INTEGRATION_MAPPING = function (URL) {
        $scope.IntegrationMappingForm.submitted = true;
        if ($scope.IntegrationMappingForm.$valid) {

            $scope.SELECTED_XERO_CLIENT = null;
            if ($scope.IntegrationMappingSearch.GROUP_ID != null) {
                $scope.XERO_REDIRECT_URI = document.getElementById("XERO_REDIRECT_URI").value;
                $scope.IntegrationMappingSearch.IS_CONNECT_TO_XERO_BUTTON_CLICKED = true;
                $scope.SELECTED_GROUP = $filter('filter')($scope.INTEGRATION_GROUP_MASTER, { ID: $scope.IntegrationMappingSearch.GROUP_ID }, true)[0];
                if ($scope.IntegrationMappingSearch.BRANCH_ID == null)
                    $scope.SELECTED_XERO_CLIENT = $filter('filter')($scope.ALL_INTEGRATION_DETAILS, {
                        IS_OUTBOUND: $scope.IntegrationMappingSearch.IS_OUTBOUND == 0 ? false : true,
                        GROUP_ID: $scope.IntegrationMappingSearch.GROUP_ID,
                        ENTITY_ID: $scope.IntegrationMappingSearch.ENTITY_ID
                    }, true);
                else
                    $scope.SELECTED_XERO_CLIENT = $filter('filter')($scope.ALL_INTEGRATION_DETAILS, {
                        IS_OUTBOUND: $scope.IntegrationMappingSearch.IS_OUTBOUND == 0 ? false : true,
                        GROUP_ID: $scope.IntegrationMappingSearch.GROUP_ID,
                        ENTITY_ID: $scope.IntegrationMappingSearch.ENTITY_ID,
                        BRANCH_ID: $scope.IntegrationMappingSearch.BRANCH_ID,
                    }, true);

                if ($scope.SELECTED_XERO_CLIENT.length == 0) {
                    var x = {
                        ENTITY_ID: $scope.IntegrationMappingSearch.ENTITY_ID,
                        CUSTOMER_ID: $scope.IntegrationMappingSearch.CUSTOMER_ID,
                        GROUP_ID: $scope.IntegrationMappingSearch.GROUP_ID,
                        CLIENT_ID: $scope.SELECTED_GROUP.CLIENT_ID,
                        CLIENT_SECRET: $scope.SELECTED_GROUP.CLIENT_SECRET,
                        URL_PATH: "https://api.xero.com/api.xro/2.0/",
                        BRANCH_ID: $scope.IntegrationMappingSearch.BRANCH_ID,
                        IS_OUTBOUND: $scope.IntegrationMappingSearch.IS_OUTBOUND,
                        XERO_SUPPLIER: $scope.IntegrationMappingSearch.XERO_SUPPLIER
                    };
                    $scope.SELECTED_XERO_CLIENT.push(x);
                }
                $cookies.put('SELECTED_XERO_CLIENT', JSON.stringify($scope.SELECTED_XERO_CLIENT), { 'path': '/' });
                window.location.href = "https://login.xero.com/identity/connect/authorize?response_type=code&client_id=" + $scope.SELECTED_GROUP.CLIENT_ID + "&redirect_uri=" + $scope.XERO_REDIRECT_URI + "&scope=openid offline_access accounting.transactions accounting.settings accounting.contacts accounting.journals.read accounting.attachments accounting.budgets.read&state=123";

            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please select integration detail and group to generate xero code.', 3000); $scope.IntegrationMappingForm.submitted = false;
            }
        }

    };
    function receivemessage(event) {
        if (window.opener != null && !window.opener.closed) {
            $cookies.get("COOKIES_XERO_CODE")
        }
        window.close();
        console.log(evt.data);
    }
    $scope.IS_XERO_CODE_GENERATED = function () {

        if (document.getElementById("xeroCode").value != "" && document.getElementById("xeroCode").value != 'undefined') {
            $scope.$parent.ShowAlert('Attention', 'XERO code generated successfully. Please select Tanent name from the list to update token and then click save button.', 3000);
            $scope.SELECTED_XERO_CLIENT[0].XERO_CODE = document.getElementById("xeroCode").value;
            $cookies.put('SELECTED_XERO_CLIENT', JSON.stringify($scope.SELECTED_XERO_CLIENT), { 'path': '/' });
        }

    };
    $scope.IS_XERO_CODE_GENERATED();
    $scope.EXCHANGE_CODE = function () {
        var CusModelObj = new Object();
        if ($scope.SELECTED_XERO_CLIENT != undefined) {
            document.getElementById("xeroCode").value = $scope.SELECTED_XERO_CLIENT[0].XERO_CODE;
        }
        if (document.getElementById("xeroCode").value != '' && document.getElementById("xeroCode").value != 'undefined') {
            CusModelObj.XERO_GRANT_TYPE = 'authorization_code';
            CusModelObj.XERO_CODE = document.getElementById("xeroCode").value;
            $scope.IntegrationMappingSearch.XEROCODE = document.getElementById("xeroCode").value;
            $scope.IntegrationMappingSearch.XERO_CODE = document.getElementById("xeroCode").value;
            CusModelObj.XERO_CLIENT_ID = $scope.SELECTED_XERO_CLIENT[0]["CLIENT_ID"];
            CusModelObj.XERO_CLIENT_SECRET = $scope.SELECTED_XERO_CLIENT[0]["CLIENT_SECRET"];
            CusModelObj.XERO_URL = $scope.SELECTED_XERO_CLIENT[0]["URL_PATH"];

            PrcCommMethods.ADMIN_API(CusModelObj, 'XEROCONNECT').then(function (data) {
                $scope.XERO_TOKEN = data.data.XERO_ACCESS_TOKEN;
                if ($scope.XERO_TOKEN.length > 0 && $scope.XERO_TOKEN[0]["access_token"] != null && $scope.XERO_TOKEN[0]["refresh_token"] != null && $scope.XERO_TOKEN[0]["error"].toString().toLowerCase() == "ok") {
                    CusModelObj = new Object();
                    CusModelObj.XERO_ACCESS_TOKEN = data.data.XERO_ACCESS_TOKEN[0]['access_token'];
                    PrcCommMethods.ADMIN_API(CusModelObj, 'XERO_TENANTS').then(function (data) {
                        $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
                        $scope.XERO_TENANTS = data.data.XERO_TENANT_IDS;

                    });
                }
                else {
                    $scope.$parent.ShowAlert('Error', $scope.XERO_TOKEN[0]["error"].toString(), 3000);
                    $scope.SELECTED_XERO_CLIENT[0].XERO_CODE = "";
                    $scope.IntegrationMappingSearch.XEROCODE = null;
                    $scope.XERO_TOKEN = [];
                    $scope.XERO_TENANTS = [];
                }
            });
        }
    };
    $scope.POPUP_XERO_TOKEN_COPY = function (XERO) {

        $('#FIELD_VALUE').modal('show');
        $scope.IntegrationMappingSearch.COPY_XERO_TOKEN = XERO.access_token;
    };
    $scope.GET_INTEGRATION_DETAILS = function () {

        $scope.INTEGRATION_DETAILS = [];
        $scope.ALL_INTEGRATION_DETAILS = [];
        var CusModelObj = new Object();
        CusModelObj.INTEGRATION_SYSTEM_ID = 16;//$scope.IntegrationMappingSearch.ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ALL_INTEGRATION_DETAILS = data.data.Table;

            }
            else {

                $scope.ALL_INTEGRATION_DETAILS = [];
            }
        });
    };
    $scope.GET_INTEGRATION_DETAILS();

    $scope.GET_INTEGRATION_GROUP_MASTER = function () {
        $scope.INTEGRATION_GROUP_MASTER = [];
        var CusModelObj = new Object();
        CusModelObj.INTEGRATION_SYSTEM_ID = 16;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_GROUP_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INTEGRATION_GROUP_MASTER = data.data.Table;
                if ($scope.SELECTED_XERO_CLIENT != undefined) {
                    $scope.IntegrationMappingSearch.GROUP_ID = $scope.SELECTED_XERO_CLIENT[0].GROUP_ID;

                }
            }
            else {
                $scope.INTEGRATION_GROUP_MASTER = [];
            }
        });

    };
    $scope.GET_INTEGRATION_GROUP_MASTER();
    $scope.SELECTED_TENANT = null;
    $scope.UPD_INTEGRATION_TOKENS = function () {
        $scope.IntegrationMappingForm.submitted = true;
        if ($scope.IntegrationMappingForm.$valid) {

            if ($scope.IntegrationMappingSearch.BRANCH_ID == null)
                $scope.SELECTED_LIST = $filter('filter')($scope.ALL_INTEGRATION_DETAILS, {
                    IS_OUTBOUND: $scope.IntegrationMappingSearch.IS_OUTBOUND == 0 ? false : true,
                    GROUP_ID: $scope.IntegrationMappingSearch.GROUP_ID,
                    ENTITY_ID: $scope.IntegrationMappingSearch.ENTITY_ID
                }, true);
            else
                $scope.SELECTED_LIST = $filter('filter')($scope.ALL_INTEGRATION_DETAILS, {
                    IS_OUTBOUND: $scope.IntegrationMappingSearch.IS_OUTBOUND == 0 ? false : true,
                    GROUP_ID: $scope.IntegrationMappingSearch.GROUP_ID,
                    ENTITY_ID: $scope.IntegrationMappingSearch.ENTITY_ID,
                    BRANCH_ID: $scope.IntegrationMappingSearch.BRANCH_ID
                }, true);

            if ($scope.SELECTED_TENANT != null) {
                var CusModelObj = new Object();
                CusModelObj.TABLE_ID = $scope.SELECTED_LIST.length > 0 ? $scope.SELECTED_LIST[0]["TABLE_ID"] : 0;
                CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
                CusModelObj.X_BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID == null ? null : $scope.IntegrationMappingSearch.BRANCH_ID;
                CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;

                if ($scope.IntegrationMappingSearch.XERO_SUPPLIER == "" || $scope.IntegrationMappingSearch.XERO_SUPPLIER == null)
                    CusModelObj.URL_PARAMETERS = $scope.SELECTED_TENANT + ":;:" + $scope.XERO_TOKEN[0]["refresh_token"] + ":;:" + "NoSup";
                else
                    CusModelObj.URL_PARAMETERS = $scope.SELECTED_TENANT + ":;:" + $scope.XERO_TOKEN[0]["refresh_token"] + ":;:" + $scope.XERO_SUPPLIERS.filter(p => p.ID == $scope.IntegrationMappingSearch.XERO_SUPPLIER)[0]['CONTACTID'];

                //if ($scope.IntegrationMappingSearch.IS_OUTBOUND == 1) {
                //    CusModelObj.URL_PARAMETERS = $scope.SELECTED_TENANT + ":;:" + $scope.XERO_TOKEN[0]["refresh_token"] + ":;:" + $scope.XERO_SUPPLIERS.filter(p => p.ID == $scope.IntegrationMappingSearch.XERO_SUPPLIER)[0]['CONTACTID'];
                //}
                //else {
                //    CusModelObj.URL_PARAMETERS = $scope.SELECTED_TENANT + ":;:" + $scope.XERO_TOKEN[0]["refresh_token"] + ":;:" + "NoSup";
                //}
                CusModelObj.API_KEY = $scope.XERO_TOKEN[0]["access_token"];
                CusModelObj.INTEGRATION_SYSTEM_ID = 16;//$scope.IntegrationMappingSearch.ID;
                CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CusModelObj.URL_PATH = "https://api.xero.com/api.xro/2.0/";
                CusModelObj.INTEGRATION_TYPE_ID = $scope.SELECTED_LIST.length > 0 ? $scope.SELECTED_LIST[0]["INTEGRATION_TYPE_ID"] : 9;
                CusModelObj.MODULE_ID = $scope.SELECTED_LIST.length > 0 ? $scope.SELECTED_LIST[0]["MODULE_ID"] : 7;
                CusModelObj.USERID = null;
                CusModelObj.PASSWORD = null;
                CusModelObj.IS_OUTBOUND = $scope.IntegrationMappingSearch.IS_OUTBOUND;
                CusModelObj.INTEGRATION_PICKUP_FLAG = false;
                CusModelObj.GROUP_ID = $scope.IntegrationMappingSearch.GROUP_ID;
                PrcCommMethods.ADMIN_API(CusModelObj, 'UPD_INTEGRATION_TOKENS').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Record saved successfully.', 3000);
                        $location.path('IntegrationSearch').search({ "REFRESH_FLAG": 1 });
                        $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
                        $scope.IntegrationMappingSearch.XEROCODE = "";
                        document.getElementById("xeroCode").value = "";
                    }
                });
            }
            else {
                $scope.$parent.ShowAlert('Error', 'Please select Tanent from the list to update.', 5000);
                $scope.IntegrationMappingSearch.XEROCODE = "";
                document.getElementById("xeroCode").value = "";
            }

        }
    };
    $scope.BACK = function () {
        $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
        var SET_XERO_COOKIES_VALUE = {
            ENTITY_ID: null,
            CUSTOMER_ID: null,
            GROUP_ID: null,
            CLIENT_ID: null,
            CLIENT_SECRET: null,
            URL_PATH: "https://api.xero.com/api.xro/2.0/",
            XERO_CODE: "",
            BRANCH_ID: null,
            IS_OUTBOUND: null,
            XERO_SUPPLIER: null
        };
        $location.path('IntegrationSearch').search({ "": "" });
    };

    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.IntegrationMappingSearch.ENTITY_ID != null) {
            ModelObj = new Object();
            ModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            ModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
            ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
            ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
            ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
            ModelObj.LOCATION_IDS = null;
            ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            ModelObj.PAGE_NO = 0;
            ModelObj.PAGE_SIZE = 0;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.BRANCH_LIST = data.data.Table;
                    if ($scope.SELECTED_XERO_CLIENT != undefined) {
                        $scope.IntegrationMappingSearch.BRANCH_ID = $scope.SELECTED_XERO_CLIENT[0].BRANCH_ID;
                    }
                }
                else { $scope.BRANCH_LIST = []; };
            });
        }
        else {
            $scope.BRANCH_LIST = [];
        }
        $scope.GET_PYMNT_SUPPLIERS();
    };
    $scope.GET_PYMNT_SUPPLIERS = function () {
        var CusModelObj = new Object();

        $scope.IntegrationMappingSearch.BRANCH_ID = $scope.SELECTED_XERO_CLIENT[0].BRANCH_ID;
        $scope.IntegrationMappingSearch.ENTITY_ID = $scope.SELECTED_XERO_CLIENT[0].ENTITY_ID;
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_IDS = $scope.IntegrationMappingSearch.BRANCH_ID;
        CusModelObj.PAGE_NO = $scope.IntegrationMappingSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.IntegrationMappingSearch.PAGE_SIZE;
        CusModelObj.SUPPLIER_NAME = $scope.IntegrationMappingSearch.SUPPLIER_NAME;
        CusModelObj.TAG_NAME = $scope.IntegrationMappingSearch.TAG_NAME;
        CusModelObj.FLAG = 0;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_PYMNT_SUPPLIERS').then(function (data) {
            if (data.data.Table != undefined) {

                $scope.XERO_SUPPLIERS = data.data.Table;
                if ($scope.SELECTED_XERO_CLIENT != undefined) {
                    if ($scope.SELECTED_XERO_CLIENT[0].XERO_SUPPLIER != null) {
                        $scope.IntegrationMappingSearch.XERO_SUPPLIER = $scope.XERO_SUPPLIERS.filter(p => p.CONTACTID == $scope.XERO_SUPPLIER_UUID[0].XERO_SUPPLIER_UUID)[0]['ID'];
                    }
                    else {
                        $scope.IntegrationMappingSearch.XERO_SUPPLIER == null;
                    }
                }
                else { $scope.IntegrationMappingSearch.XERO_SUPPLIER == null; }
            }

            else {
                $scope.XERO_SUPPLIERS = [];
                $scope.IntegrationMappingSearch.XERO_SUPPLIER == null;
            }
        });
    };
});
app.controller('IntegrationSearchController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = "XERO CLIENTS";
    $scope.$parent.urlpath = 'XERO CLIENTS';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.XERO_TOKEN = [];
    $scope.XERO_TENANTS = [];
    $scope.FILTERED_INTEGRATION_DETAIL = [];
    $scope.SELECTED_LIST = [];
    $scope.INTEGRTION_MASTER_DATA = [];
    $scope.XERO_SUPPLIERS = [];
    $scope.IS_OUTBOUND_LIST = [{ 'ID': 0, 'OB_FLAG': 'No' }, { 'ID': 1, 'OB_FLAG': "Yes" }];

    $scope.IntegrationMappingSearch = {
        URL: null,
        XEROCODE: null,
        grant_type: null,
        code: null,
        redirect_uri: null,
        Authorization: null,
        client_id: null,
        client_secret: null,
        COPY_XERO_TOKEN: null,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null, ID: null,
        GROUP_ID: null,
        IS_CONNECT_TO_XERO_BUTTON_CLICKED: false, XERO_SUPPLIER: null,
        PAGE_NO: 0,
        PAGE_SIZE: 0,
        SUPPLIER_NAME: null,
        TAG_NAME: null,
        XERO_SUPPLIER: null
    };

    //$scope.SELECTED_XERO_CLIENT = $cookies.get('SELECTED_XERO_CLIENT') != undefined ? JSON.parse($cookies.get('SELECTED_XERO_CLIENT')) : undefined;


    $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
    $scope.GET_INTEGRATION_DETAILS = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
        $scope.INTEGRATION_DETAILS = [];
        $scope.ALL_INTEGRATION_DETAILS = [];
        var CusModelObj = new Object();
        CusModelObj.INTEGRATION_SYSTEM_ID = 16;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ALL_INTEGRATION_DETAILS = data.data.Table;
                $scope.INTEGRTION_MASTER_DATA = data.data.Table;
                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.ALL_INTEGRATION_DETAILS = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
            document.getElementById("overlay_loading").style.display = "none";
        });
    };

    $scope.GET_INTEGRATION_GROUP_MASTER = function () {
        $scope.INTEGRATION_GROUP_MASTER = [];
        var CusModelObj = new Object();
        CusModelObj.INTEGRATION_SYSTEM_ID = 16;// $scope.IntegrationMappingSearch.GROUP_ID == null ? 0 : $scope.IntegrationMappingSearch.GROUP_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_INTEGRATION_GROUP_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.INTEGRATION_GROUP_MASTER = data.data.Table;
                if ($scope.SELECTED_XERO_CLIENT != undefined) {
                    $scope.IntegrationMappingSearch.GROUP_ID = $scope.SELECTED_XERO_CLIENT[0].GROUP_ID;
                }
            }
            else {
                $scope.INTEGRATION_GROUP_MASTER = [];
            }
        });

    };
    $scope.GET_INTEGRATION_GROUP_MASTER();
    $scope.INTEGRATION_FILTER_DATA = function (GROUP_ID) {
        if (GROUP_ID > 0) {
            $scope.TEMP_DATA = [];
            $scope.TEMP_DATA = $scope.INTEGRTION_MASTER_DATA.filter(p => p.GROUP_ID == GROUP_ID);
            $scope.ALL_INTEGRATION_DETAILS = $scope.TEMP_DATA;
        }
        else {
            $scope.ALL_INTEGRATION_DETAILS = $scope.INTEGRTION_MASTER_DATA;
        }
    };
    $scope.REFRESH = function (CL) {

        $scope.SELECTED_XERO_CLIENT = [];
        $scope.SPLIT_VALUE = [];
        $scope.SPLIT_VALUE = CL['URL_PARAMETERS'].split(':;:');
        var SET_XERO_COOKIES_VALUE = {
            ENTITY_ID: CL.ENTITY_ID,
            CUSTOMER_ID: CL.CUSTOMER_ID,
            GROUP_ID: CL.GROUP_ID,
            CLIENT_ID: CL.CLIENT_ID,
            CLIENT_SECRET: CL.CLIENT_SECRET,
            URL_PATH: "https://api.xero.com/api.xro/2.0/",
            XERO_CODE: "",
            BRANCH_ID: CL.BRANCH_ID,
            IS_OUTBOUND: CL.IS_OUTBOUND,
            XERO_SUPPLIER: $scope.SPLIT_VALUE.length == 3 ? $scope.SPLIT_VALUE[2] : null
        };
        $scope.SELECTED_XERO_CLIENT.push(SET_XERO_COOKIES_VALUE);
        $cookies.put('SELECTED_XERO_CLIENT', JSON.stringify($scope.SELECTED_XERO_CLIENT), { 'path': '/' });

        var SUPPLIER_UUID = {
            XERO_SUPPLIER_UUID: $scope.SPLIT_VALUE.length == 3 ? $scope.SPLIT_VALUE[2] : null
        };
        $scope.XERO_SUPPLIER_UUID = [];
        $scope.XERO_SUPPLIER_UUID.push(SUPPLIER_UUID);
        $cookies.put("XERO_SUPPLIER_UUID", JSON.stringify($scope.XERO_SUPPLIER_UUID), { 'path': '/' });

        $scope.$parent.EditObject = CL;
        $location.path('IntegrationMapping').search({ "REFRESH_FLAG": 1 });
    };
    $scope.CREATE_XERO_INT = function () {
        $cookies.remove("SELECTED_XERO_CLIENT", { 'path': '/' });
        var SET_XERO_COOKIES_VALUE = {
            ENTITY_ID: null,
            CUSTOMER_ID: null,
            GROUP_ID: null,
            CLIENT_ID: null,
            CLIENT_SECRET: null,
            URL_PATH: "https://api.xero.com/api.xro/2.0/",
            XERO_CODE: "",
            BRANCH_ID: null,
            IS_OUTBOUND: null
        };
        $location.path('IntegrationMapping').search({ "REFRESH_FLAG": 2 });

    };
    $scope.POPUP_XERO_SUPPLIER_UPDATE = function (XERO) {

        $('#FIELD_VALUE').modal('show');
        $scope.IntegrationMappingSearch.IS_OUTBOUND = XERO.IS_OUTBOUND;
        $scope.IntegrationMappingSearch.COPY_XERO_TOKEN = XERO.access_token;
        $scope.ADMIN_GET_CUSTOMER(XERO);
    };
    $scope.ADMIN_GET_CUSTOMER = function (XERO) {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.IntegrationMappingSearch.CUSTOMER_ID = XERO.CUSTOMER_ID
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = null;
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CUSTOMER_LIST = data.data.Table;
                $scope.IntegrationMappingSearch.IS_OUTBOUND = XERO.IS_OUTBOUND == false ? 0 : 1;
                $scope.IntegrationMappingSearch.GROUP_ID = XERO.GROUP_ID;
                $scope.GET_ENTITY_LIST(XERO);
                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.CUSTOMER_LIST = [];
                document.getElementById("overlay_loading").style.display = "none";
            }

        });
    };
    $scope.GET_ENTITY_LIST = function (XERO) {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.IntegrationMappingSearch.ENTITY_ID = XERO.ENTITY_ID;
        $scope.IntegrationMappingSearch.IS_OUTBOUND = 1;
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = XERO.CUSTOMER_ID;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                $scope.ADMIN_GET_BRANCH(XERO);
                $scope.GET_PYMNT_SUPPLIERS(XERO);
                document.getElementById("overlay_loading").style.display = "none";
            }
            else { $scope.ENTITY_LIST = []; document.getElementById("overlay_loading").style.display = "none"; };
        });

    };
    $scope.ADMIN_GET_BRANCH = function (XERO) {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.IntegrationMappingSearch.BRANCH_ID = XERO.BRANCH_ID;
        if ($scope.IntegrationMappingSearch.ENTITY_ID != null) {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
            CusModelObj.BRANCH_CODE = null;
            CusModelObj.BRANCH_NAME = null;
            CusModelObj.CONTACT_NAME = null;
            CusModelObj.LOCATION_IDS = null;
            CusModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.PAGE_SIZE = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.BRANCH_LIST = data.data.Table;
                }
                else {
                    $scope.BRANCH_LIST = [];
                }
                document.getElementById("overlay_loading").style.display = "none";
            });
        }
        else {
            $scope.BRANCH_LIST = [];
            document.getElementById("overlay_loading").style.display = "none";
        }
    };
    $scope.GET_PYMNT_SUPPLIERS = function (XERO) {
        $scope.PARAMETER = []; $scope.PARAMETER = XERO;
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID;
        CusModelObj.PAGE_NO = $scope.IntegrationMappingSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.IntegrationMappingSearch.PAGE_SIZE;
        CusModelObj.SUPPLIER_NAME = $scope.IntegrationMappingSearch.SUPPLIER_NAME;
        CusModelObj.TAG_NAME = $scope.IntegrationMappingSearch.TAG_NAME;
        CusModelObj.FLAG = 0; //-- 1 SUPPLIER 2 CUSTOMER 0 ALL

        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_PYMNT_SUPPLIERS').then(function (data) {
            document.getElementById("overlay_loading").style.display = "block";
            if (data.data.Table != undefined && data.data.Table.length > 0) {
                $scope.XERO_SUPPLIERS = data.data.Table;
                if ($scope.PARAMETER['URL_PARAMETERS'].split(':;:').length == 3)
                    if ($scope.XERO_SUPPLIERS.filter(p => p.CONTACTID == $scope.PARAMETER['URL_PARAMETERS'].split(':;:')[2]).length > 0)
                        $scope.IntegrationMappingSearch.XERO_SUPPLIER = $scope.XERO_SUPPLIERS.filter(p => p.CONTACTID == $scope.PARAMETER['URL_PARAMETERS'].split(':;:')[2])[0]['ID'];
                    else
                        $scope.IntegrationMappingSearch.XERO_SUPPLIER = null;
                else
                    $scope.IntegrationMappingSearch.XERO_SUPPLIER = null;


                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.XERO_SUPPLIERS = [];
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
    };

    $scope.UPD_INTEGRATION_TOKENS = function () {
        $scope.UpdatesupplierForm.submitted = true;
        if ($scope.UpdatesupplierForm.$valid) {
            document.getElementById("overlay_loading").style.display = "block";
            var CusModelObj = new Object();
            CusModelObj.TABLE_ID = 0;
            CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
            CusModelObj.X_BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID == null ? null : $scope.IntegrationMappingSearch.BRANCH_ID;
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;

            $scope.SPLIT_URL_PARAMETERS_VALUES = $scope.PARAMETER["URL_PARAMETERS"].split(':;:');

            CusModelObj.URL_PARAMETERS = $scope.SPLIT_URL_PARAMETERS_VALUES[0] + ":;:" + $scope.SPLIT_URL_PARAMETERS_VALUES[1] + ":;:" + $scope.XERO_SUPPLIERS.filter(p => p.ID == $scope.IntegrationMappingSearch.XERO_SUPPLIER)[0]['CONTACTID'];
            CusModelObj.API_KEY = $scope.PARAMETER["API_KEY"];
            CusModelObj.INTEGRATION_SYSTEM_ID = 16;//$scope.IntegrationMappingSearch.ID;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.URL_PATH = "https://api.xero.com/api.xro/2.0/";
            CusModelObj.INTEGRATION_TYPE_ID = $scope.PARAMETER["INTEGRATION_TYPE_ID"];
            CusModelObj.MODULE_ID = $scope.PARAMETER["MODULE_ID"];
            CusModelObj.USERID = null;
            CusModelObj.PASSWORD = null;
            CusModelObj.IS_OUTBOUND = $scope.IntegrationMappingSearch.IS_OUTBOUND;
            CusModelObj.INTEGRATION_PICKUP_FLAG = false;
            CusModelObj.GROUP_ID = $scope.PARAMETER["GROUP_ID"];
            PrcCommMethods.ADMIN_API(CusModelObj, 'UPD_INTEGRATION_TOKENS').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Record saved successfully.', 3000);
                    $scope.GET_INTEGRATION_DETAILS();
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Fail to save data, please connect to support team.', 3000);
                    document.getElementById("overlay_loading").style.display = "none";
                }
            });
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please select supplier from the list.', 5000);
            $scope.IntegrationMappingSearch.XEROCODE = "";
            document.getElementById("xeroCode").value = "";
            document.getElementById("overlay_loading").style.display = "none";
        }

    };

});
app.controller('MM_CategoriesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = "MARKETMAN COGS";
    $scope.$parent.urlpath = 'MARKETMAN COGS';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.MMCAT_LIST = [];
    $scope.COGS_CATEGORY_NAME_LIST = [];
    $scope.COGS_CATEGORY_NAME_IS_EXCLUDED_LIST = [];
    $scope.MMCAT_NOT_MAPPED_LIST = [];
    $scope.MMSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOCATION_ID: null,
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CATEGORY_NAME: null, COGS_CATEGORY_NAME: null, ID: null,
        MM_CATEGORY_ID: null,
        ALL_SOURCE_SELECTED_FLAG: 0, SYSTEM_ALL: false, MM_CATEGORIES_SELECTED_ON_CHECKBOX_CLICKED: 0
    };
    $scope.COUTERCHECK = true;
    $scope.MM_CAT_ID = null;
    $scope.UNIQUE_COGS_CATEGORY_NAME = [];
    $scope.MM_COGS_CATEGORY_MAPPING = [];
    $scope.SELECTED_IDS_WHICH_ARE_ADDED = [];

    $scope.ADMIN_GET_CUSTOMER = function () {

        var MM_ModelObj = new Object();
        MM_ModelObj.CUSTOMER_NAME = $scope.MMSearch.CUSTOMER_ID;
        MM_ModelObj.CUSTOMER_CODE = "";
        MM_ModelObj.ACTIVE = 1;
        MM_ModelObj.PAGE_NO = 1;
        MM_ModelObj.PAGE_SIZE = 1000;
        MM_ModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(MM_ModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.MMSearch.CUSTOMER_ID != undefined || $scope.MMSearch.CUSTOMER_ID != null) {
            var MM_ModelObj = new Object();
            MM_ModelObj.CUSTOMER_ID = $scope.MMSearch.CUSTOMER_ID;
            MM_ModelObj.ACTIVE = 1;
            MM_ModelObj.PAGE_NO = 0;
            MM_ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            MM_ModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(MM_ModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_LOCATION = function () {
        if ($scope.MMSearch.ENTITY_ID != undefined && $scope.MMSearch.ENTITY_ID != null) {
            CommonObj = new Object()
            CommonObj.ENTITY_ID = $scope.MMSearch.ENTITY_ID;//ENT[0].ENTITY_ID;
            CommonObj.CUSTOMER_ID = $scope.MMSearch.CUSTOMER_ID;//ENT[0].CUSTOMER_ID;
            CommonObj.LOCATION_NAME = null;
            CommonObj.LOCATION_CODE = null;
            CommonObj.ACTIVE = 1;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_LOCATION').then(function (data) {
                $scope.LOCATION = data.data.Table;
            });
        }
        else {
            $scope.LOCATION = [];
            $scope.BRANCH_LIST = [];
        }
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.MMSearch.LOCATION_ID != null && $scope.MMSearch.LOCATION_ID != undefined) {
            CommonObj = new Object();
            CommonObj.CUSTOMER_ID = $scope.MMSearch.CUSTOMER_ID;
            CommonObj.ENTITY_ID = $scope.MMSearch.ENTITY_ID;
            CommonObj.BRANCH_CODE = $scope.MMSearch.BRANCH_CODE;
            CommonObj.BRANCH_NAME = $scope.MMSearch.BRANCH_NAME;
            CommonObj.CONTACT_NAME = $scope.MMSearch.CONTACT_NAME;
            CommonObj.LOCATION_IDS = $scope.MMSearch.LOCATION_ID;
            CommonObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CommonObj.PAGE_NO = 1;
            CommonObj.PAGE_SIZE = 1000;
            CommonObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CommonObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else {
            $scope.BRANCH_LIST = [];

        }
    };
    $scope.GET_MM_CATEGORIES = function () {
        $("#MM_Loader").show();
        if ($scope.BRANCH_LIST.length > 0 && $scope.MMSearch.BRANCH_ID != null) {
            MM_CATObj = new Object();
            MM_CATObj.BRANCH_ID = $scope.MMSearch.BRANCH_ID;
            PrcCommMethods.ADMIN_API(MM_CATObj, 'GET_MM_CATEGORIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $("#MM_Loader").hide();
                    $scope.MMCAT_LIST = data.data.Table;
                    PrcCommMethods.ADMIN_API(MM_CATObj, 'GET_MM_COGS_CATEGORY_MAPPING').then(function (data) {
                        $scope.COGS_CATEGORY_NAME_LIST = data.data.Table;
                        data.data.Table.length > 0 ? $scope.UNIQUE_COGS_CATEGORY_NAME = $filter('unique')($scope.COGS_CATEGORY_NAME_LIST, 'COGS_CATEGORY_NAME') : $scope.UNIQUE_COGS_CATEGORY_NAME == [];

                        $scope.COGS_CATEGORY_FILTERED_LIST($scope.MMCAT_LIST, $scope.COGS_CATEGORY_NAME_LIST);
                        $scope.FILTER_COGS_DATA($scope.MMCAT_LIST, $scope.COGS_CATEGORY_NAME_LIST);
                    });
                }
                else {
                    $("#MM_Loader").hide();
                    $scope.$parent.ShowAlert('Attention', 'No recors found.', 3000); $scope.MM_Category.submitted = false;
                    $scope.MMCAT_LIST = [];
                    $scope.MMCAT_NOT_MAPPED_LIST = [];
                    $scope.UNIQUE_COGS_CATEGORY_NAME = [];
                    $scope.MM_COGS_CATEGORY_MAPPING = [];
                }
            });
        }
        else {
            $("#MM_Loader").hide();
            $scope.MMCAT_LIST = [];
            $scope.MMCAT_NOT_MAPPED_LIST = [];
            $scope.UNIQUE_COGS_CATEGORY_NAME = [];
            $scope.MM_COGS_CATEGORY_MAPPING = [];
        }
    };
    $scope.COGS_CATEGORY_FILTERED_LIST = function (MMCAT_LIST, COGS_CATEGORY_NAME_LIST) {
        $scope.MM_COGS_CATEGORY_MAPPING = [];
        angular.forEach($scope.UNIQUE_COGS_CATEGORY_NAME, function (UNIQUE) {
            angular.forEach($scope.COGS_CATEGORY_NAME_LIST, function (COGS_CATEGORY_NAME) {
                angular.forEach($scope.MMCAT_LIST, function (MMCAT_LIST) {
                    if (COGS_CATEGORY_NAME.MM_CATEGORY_ID == MMCAT_LIST.ID && UNIQUE.COGS_CATEGORY_NAME == COGS_CATEGORY_NAME.COGS_CATEGORY_NAME) {
                        $scope.SELECTED_DATA = [];
                        $scope.SELECTED_DATA = {
                            "MM_CATEGORY_ID": MMCAT_LIST.ID,
                            "NAME": MMCAT_LIST.NAME,
                            "COGS_CATEGORY_NAME": COGS_CATEGORY_NAME.COGS_CATEGORY_NAME,
                            "BRANCH_ID": COGS_CATEGORY_NAME.BRANCH_ID,
                            "IS_EXCLUDED": COGS_CATEGORY_NAME.IS_EXCLUDED
                        };
                        $scope.MM_COGS_CATEGORY_MAPPING.push($scope.SELECTED_DATA);

                    }
                });
            });
        });
        //$scope.TEST = $scope.TEMP.filter(x => x.IS_EXCLUDED==true);
    };
    $scope.FILTER_COGS_DATA = function (p1, p2) {
        $scope.MMCAT_NOT_MAPPED_LIST = [];
        angular.forEach(p1, function (p1item) {
            $scope.FLAG = false;
            angular.forEach(p2, function (p2item) {
                if (p1item.ID == p2item.MM_CATEGORY_ID) {
                    $scope.FLAG = true;
                    p1item.MM_CATEGORY_ID = p2item.MM_CATEGORY_ID;
                }
                else { p1item.MM_CATEGORY_ID = p2item.MM_CATEGORY_ID; }
            });
            if ($scope.FLAG == false) {
                p1item.SELECTED = false;
                $scope.MMCAT_NOT_MAPPED_LIST.push(p1item);
            }
        });

    };
    $scope.REMOVE_COGS_FROM_LIST = function (key, value) {
        $scope.MM_COGS_CATEGORY_MAPPING.splice(key, 1);
        $scope.SELECTED_DATA = [];
        $scope.SELECTED_DATA = {
            "ID": value.MM_CATEGORY_ID,
            "MM_CATEGORY_ID": value.MM_CATEGORY_ID,
            "NAME": value.NAME,
            "SELECTED": false
        };
        //$scope.SELECTED_DATA.NAME = value.NAME;
        $scope.MMCAT_NOT_MAPPED_LIST.push($scope.SELECTED_DATA);
        $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED = false);
        $scope.MMSearch.SYSTEM_ALL = false;
        $scope.MMSearch.MM_CATEGORIES_SELECTED_ON_CHECKBOX_CLICKED = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
        $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
        $scope.MM_Category_Add.submitted = false;
    };
    $scope.ADD_COGS_LIST = function () {
        $scope.MM_Category_Add.submitted = true;
        $scope.SELECTED_IDS_WHICH_ARE_ADDED = [];
        if ($scope.MM_Category_Add.$valid) {
            $scope.SELECTED_MMCAT_ID = $scope.MMSearch.MM_CATEGORY_ID;
            $scope.MMCAT_NOT_MAPPED_LIST.forEach((item, index) => {
                if (item.SELECTED == true) {
                    $scope.SELECTED_DATA = [];
                    $scope.SELECTED_DATA = {
                        "MM_CATEGORY_ID": item.ID,
                        "NAME": item.NAME,
                        "COGS_CATEGORY_NAME": $scope.UNIQUE_COGS_CATEGORY_NAME.filter(x => x.MM_CATEGORY_ID == $scope.MMSearch.MM_CATEGORY_ID)[0]['COGS_CATEGORY_NAME'],
                        "BRANCH_ID": $scope.MMSearch.BRANCH_ID,
                        "IS_EXCLUDED": false
                    };
                    $scope.MM_COGS_CATEGORY_MAPPING.push($scope.SELECTED_DATA);
                    $scope.SELECTED_IDS_WHICH_ARE_ADDED.push({ "ID": item.ID });
                    item.SELECTED = false;
                }
            });
            angular.forEach($scope.SELECTED_IDS_WHICH_ARE_ADDED, function (item, index) {
                $scope.MMCAT_NOT_MAPPED_LIST.splice($scope.MMCAT_NOT_MAPPED_LIST.findIndex((x) => x.ID == item.ID), 1);
            });
            $scope.MMSearch.SYSTEM_ALL = false;
            $scope.MM_Category_Add.submitted = false;
            $scope.MMSearch.MM_CATEGORY_ID = null;
            $scope.MMSearch.ID = null;
        };
        $scope.MMSearch.MM_CATEGORIES_SELECTED_ON_CHECKBOX_CLICKED = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
        $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;

    };
    $scope.INS_UPD_MM_COGS_CATEGORY_MAPPING = function () {
        $scope.MM_Category.submitted = true;
        if ($scope.MM_Category.$valid) {
            var CusModelObj = new Object();
            $scope.TEMP = [];
            CusModelObj.BRANCH_ID = $scope.MMSearch.BRANCH_ID;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            angular.forEach($scope.MM_COGS_CATEGORY_MAPPING, function (item) {
                $scope.SELECTED_DATA = [];
                $scope.SELECTED_DATA = {
                    "COGS_CATEGORY_NAME": item.COGS_CATEGORY_NAME,
                    "IS_EXCLUDED": item.IS_EXCLUDED,
                    "MM_CATEGORY_ID": item.MM_CATEGORY_ID
                };
                $scope.TEMP.push($scope.SELECTED_DATA);
            });
            CusModelObj.MM_COGS_CATEGORY_MAPPING_TYPE = $scope.TEMP;
            PrcCommMethods.ADMIN_API(CusModelObj, 'INS_UPD_MM_COGS_CATEGORY_MAPPING').then(function (data) {
                if (data['data'] > 0) {
                    $scope.$parent.ShowAlert('Success', 'Records are updated successfully.', 3000); $scope.MM_Category.submitted = false;
                }
                else { $scope.$parent.ShowAlert('Error', 'Fail to update data changes.', 3000); $scope.MM_Category.submitted = false; }
            });
            $scope.RESET();

        }


        //var CusModelObj = new Object();
        //PrcCommMethods.ADMIN_API(CusModelObj, 'QB_ACCESS_TOKEN').then(function (data) {
        //     
        //    window.location.href = data.data;
        //});

    };
    $scope.RESET = function () {
        // 
        //var CusModelObj = new Object();
        //CusModelObj.CUSTOMER_ID = $scope.code;
        //PrcCommMethods.ADMIN_API(CusModelObj, 'QB_REVOKEREFRESHTOKEN').then(function (data) {
        //     
        //    window.location.href = data.data;
        //});

        $scope.ENTITY_LIST = [];
        $scope.LOCATION = [];
        $scope.BRANCH_LIST = [];
        $scope.MMCAT_LIST = [];
        $scope.COGS_CATEGORY_NAME_LIST = [];
        $scope.COGS_CATEGORY_NAME_IS_EXCLUDED_LIST = [];
        $scope.MMCAT_NOT_MAPPED_LIST = [];
        $scope.MMSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOCATION_ID: null,
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CATEGORY_NAME: null, COGS_CATEGORY_NAME: null, ID: null,
            MM_CATEGORY_ID: null
        };
        $scope.COUTERCHECK = true;
        $scope.MM_CAT_ID = null;
        $scope.UNIQUE_COGS_CATEGORY_NAME = [];
        $scope.MM_COGS_CATEGORY_MAPPING = [];
        $scope.MM_Category_Add.submitted = false;

    };
    $scope.ONCHANGE_SELECT_ALL = function (MMCAT_NOT_MAPPED_LIST, SELECT_ALL) {

        if (SELECT_ALL == true) {
            angular.forEach(MMCAT_NOT_MAPPED_LIST, function (item) {
                item.SELECTED = true;
            });
        }
        else {
            angular.forEach(MMCAT_NOT_MAPPED_LIST, function (item) {
                item.SELECTED = false;
            });
        }
        $scope.MMSearch.MM_CATEGORIES_SELECTED_ON_CHECKBOX_CLICKED = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
    };
    $scope.ONCHANGE_SINGLE_SELECT = function (MMCAT_NOT_MAPPED_LIST) {
        $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG = 0;
        angular.forEach(MMCAT_NOT_MAPPED_LIST, function (item) {
            if (item.SELECTED == true)
                $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG += 1;
            else
                $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG -= 1;
        });
        $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG == $scope.MMCAT_NOT_MAPPED_LIST.length ? $scope.MMSearch.SYSTEM_ALL = true : $scope.MMSearch.SYSTEM_ALL = false;
        $scope.MMSearch.MM_CATEGORIES_SELECTED_ON_CHECKBOX_CLICKED = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
        $scope.MMSearch.ALL_SOURCE_SELECTED_FLAG = $scope.MMCAT_NOT_MAPPED_LIST.filter(x => x.SELECTED == true).length;
        $scope.MM_Category_Add.submitted = false;
    };
});
app.controller('IntegrationCategoryMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = "Category Mapping";
    $scope.$parent.urlpath = 'Category Mapping';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING = [];
    $scope.XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING = [];
    $scope.XERO_ACCOUNT_CODES = [];
    $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = [];


    $scope.IntegrationMappingSearch = {
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        BRANCH_ID: null,
        XERO_TYPE_SELECTED: null,

    };

    $scope.ADMIN_GET_CUSTOMER = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_NAME = $scope.IntegrationMappingSearch.CUSTOMER_ID;
        CusModelObj.CUSTOMER_CODE = "";
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 1;
        CusModelObj.PAGE_SIZE = 1000;
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_CUSTOMER').then(function (data) {
            $scope.CUSTOMER_LIST = data.data.Table;
            if ($scope.SELECTED_XERO_CLIENT != undefined) {
                $scope.IntegrationMappingSearch.CUSTOMER_ID = $scope.SELECTED_XERO_CLIENT[0].CUSTOMER_ID;
                $scope.GET_ENTITY_LIST();
            }
        });
    };
    $scope.ADMIN_GET_CUSTOMER();
    $scope.GET_ENTITY_LIST = function () {
        if ($scope.IntegrationMappingSearch.CUSTOMER_ID != undefined && $scope.IntegrationMappingSearch.CUSTOMER_ID != null) {
            var CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            CusModelObj.ACTIVE = 1;
            CusModelObj.PAGE_NO = 0;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.IS_LIVE = -1;
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.ENTITY_LIST = data.data.Table;
                }
                else { $scope.ENTITY_LIST = []; };
            });
        }
        else { $scope.ENTITY_LIST = []; };
    };
    $scope.ADMIN_GET_BRANCH = function () {
        if ($scope.IntegrationMappingSearch.ENTITY_ID != null && $scope.IntegrationMappingSearch.ENTITY_ID != "") {
            CusModelObj = new Object();
            CusModelObj.CUSTOMER_ID = $scope.IntegrationMappingSearch.CUSTOMER_ID;
            CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
            CusModelObj.BRANCH_CODE = null;
            CusModelObj.BRANCH_NAME = null;
            CusModelObj.CONTACT_NAME = null;
            CusModelObj.LOCATION_IDS = null;
            CusModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
            CusModelObj.PAGE_NO = 1;
            CusModelObj.PAGE_SIZE = 1000;
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else
            $scope.BRANCH_LIST = [];
    };

    $scope.SEARCH_BY_CAT_OR_PAYMENT = function () {
        $scope.IntegrationMappingForm.submitted = true;
        if ($scope.IntegrationMappingForm.$valid) {
            $scope.GET_XERO_ACCOUNT_CODES();
            $scope.GET_XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING();
            $scope.GET_XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING();
        }
    };
    $scope.GET_XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING = function () {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING').then(function (data) {
            if (data.data.Table != undefined)
                $scope.XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING = data.data.Table;
            else
                $scope.XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING = [];
        });
    };
    $scope.GET_XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING = function () {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING').then(function (data) {
            if (data.data.Table != undefined)
                $scope.XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING = data.data.Table;
            else
                $scope.XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING = [];
        });
    };
    $scope.GET_XERO_ACCOUNT_CODES = function () {
        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_XERO_ACCOUNT_CODES').then(function (data) {
            if (data.data.Table != undefined) {
                $scope.XERO_ACCOUNT_CODES = data.data.Table;
            }
            else {
                $scope.XERO_ACCOUNT_CODES = [];
            }
        });
    };
    $scope.INS_UPD_XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = function () {
        $scope.IntegrationMappingForm.submitted = true;
        $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = [];
        $scope.SELECTED = [];

        angular.forEach($scope.XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING, function (item) {
            if (item.XERO_ACCOUNT_ID != null && item.XERO_ACCOUNT_ID != "") {
                $scope.SELECTED_DATA = {
                    "EPOS_CATEGORY_OR_PAYMENT_NAME": item.EPOS_CATEGORY_OR_PAYMENT_NAME,
                    "XERO_ACCOUNT_ID": item.XERO_ACCOUNT_ID,
                    "TABLE_ID": item.TABLE_ID,
                    "DELETE_FLAG": false,
                    "FLAG": 0
                };
                $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING.push($scope.SELECTED_DATA);
            }
        });
        angular.forEach($scope.XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING, function (item) {
            if (item.XERO_ACCOUNT_ID != null && item.XERO_ACCOUNT_ID != "") {
                $scope.SELECTED_DATA = {
                    "EPOS_CATEGORY_OR_PAYMENT_NAME": item.EPOS_CATEGORY_OR_PAYMENT_NAME,
                    "XERO_ACCOUNT_ID": item.XERO_ACCOUNT_ID,
                    "TABLE_ID": item.TABLE_ID,
                    "DELETE_FLAG": false,
                    "FLAG": 1
                };
                $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING.push($scope.SELECTED_DATA);
            }
        });

        var CusModelObj = new Object();
        CusModelObj.ENTITY_ID = $scope.IntegrationMappingSearch.ENTITY_ID;
        CusModelObj.BRANCH_ID = $scope.IntegrationMappingSearch.BRANCH_ID;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING;
        if ($scope.IntegrationMappingForm.$valid) {
            PrcCommMethods.ADMIN_API(CusModelObj, 'INS_UPD_XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING').then(function (data) {
                if (data['data'] > 0) {
                    $scope.$parent.ShowAlert('Success', 'Records are updated successfully.', 3000); $scope.IntegrationMappingForm.submitted = false;
                    $scope.RESET();
                }
                else { $scope.$parent.ShowAlert('Error', 'Fail to update data changes.', 3000); $scope.IntegrationMappingForm.submitted = false; }
            });
        }
    };

    $scope.RESET = function () {
        $scope.IntegrationMappingForm.submitted = false;
        $scope.IntegrationMappingSearch = {
            CUSTOMER_ID: null,
            ENTITY_ID: null,
            BRANCH_ID: null,
            XERO_TYPE_SELECTED: null
        };
        $scope.ENTITY_LIST = [];
        $scope.BRANCH_LIST = [];
        $scope.XERO_ACCOUNT_EPOS_CATEGORIES_MAPPING = [];
        $scope.XERO_ACCOUNT_EPOS_PAYMENTS_MAPPING = [];
        $scope.XERO_ACCOUNT_CODES = [];
        $scope.XERO_ACCOUNT_CATEGORY_PAYMENT_MAPPING = [];
    }

});
app.controller('CurrencyConversionController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    if ($location.absUrl().match("Currency_Setup") != null && $location.absUrl().match("Currency_Setup")[0] == 'Currency_Setup') {
        $scope.$parent.PAGE_HEADER = "Currency Conversion ";
        $scope.$parent.urlpath = 'Currency_Setup';
    }
    if ($location.absUrl().match("Currency_Conversion") != null && $location.absUrl().match("Currency_Conversion")[0] == 'Currency_Conversion') {
        $scope.$parent.PAGE_HEADER = "Upload Currency Conversion ";
        $scope.$parent.urlpath = 'Currency_Conversion';
    }

    //$scope.CUSTOMER_LIST = [];
    // $scope.ENTITY_LIST = [];
    $scope.UPLOAD_FILE_NAME = null;
    $scope.INVALID_EXCLE_CELL_COUNT = null;
    $scope.INVALID_EXCLE_CELL_FLAG = true;
    $scope.CURRENCY_CONVERSION = [];

    $scope.Files = null;
    $scope.CCSearch = {
        // ENTITY_ID: null,
        LOGO_PATH: '',
        UploadedFiles: [],
        USER_ID: '',
        FILE_NAME: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        LOG_PAGE_NO: 1,
        LOG_PAGE_SIZE: 10,
        CLICK_SEARCH: 0,
        UPL_FILE_FLAG: 1,
        ORIGINAL_FILE_NAME: '',
        SERVER_FILE_NAME: '',
        SAMPLE_EXCEL_FILE: null,
        ENTITY_ID_UPLOAD: null,
        CC_OBJ: null,
        BASE_CURRENCY_CODE: 'GBP'

    };
    $scope.CC_INVALID_EXCLE_CELL_FLAG = true;
    $scope.CURRENCY_CONVERSION_TYPE = [{ ID: 1, COLUMN_NAME: 'BASE_CURRENCY_CODE', MATCH_COLUMN_NAME: 'BASE_CURRENCY_CODE', IS_MANDATORY: true, HEADER_NAME: 'BASE_CURRENCY_CODE', FIELD_TYPE_ID: 19, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'CONVERT_TO_CURRENCY_CODE', MATCH_COLUMN_NAME: 'CONVERT_TO_CURRENCY_CODE', IS_MANDATORY: true, HEADER_NAME: 'CONVERT_TO_CURRENCY_CODE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 3, COLUMN_NAME: 'RATE', MATCH_COLUMN_NAME: 'RATE', IS_MANDATORY: true, HEADER_NAME: 'RATE', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 4, COLUMN_NAME: 'EFFECTIVE_DATE', MATCH_COLUMN_NAME: 'EFFECTIVE_DATE', IS_MANDATORY: true, HEADER_NAME: 'EFFECTIVE_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];
    $scope.DOWNLOAD_OPENXML_UPLOAD = function (UPLOADED_BY) {
        ModelObj = new Object();
        ModelObj.FILE_NAME = "CURRENCY_CONVERSION";
        ModelObj.FILE_PATH = "CURRENCY_CONVERSION";
        ModelObj.EXCEL_DATATABLE = $scope.CURRENCY_CONVERSION_TYPE;
        ModelObj.UPLOADE_TYPE_ID = 3;
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {

            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            var file_path = window.location.origin;
            var a = document.createElement('A');
            a.href = $scope.SERVER_FILE_PATH;
            a.download = "CURRENCY_CONVERSION";//data.data.FILE_NAME;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }
    $scope.GET_ENTITY_LIST = function () {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; };
        });
    };
    $scope.GET_ENTITY_LIST();

    $scope.EXCEL_CURRENCY_ADD = function () {
        $scope.CurrencyConversionFormUpload.submitted = true;
        var LogCount = 0;
        if ($scope.CCSearch.UploadedFiles == undefined || $scope.CCSearch.UploadedFiles == "" || $scope.CCSearch.UploadedFiles.length == 0) {
            LogCount++;
        }
        else {
            $scope.CCSearch.LOGO_PATH = $scope.CCSearch.UploadedFiles[0].FILE_PATH + $scope.CCSearch.UploadedFiles[0].SERVER_FILE_NAME;
        }
        if ($scope.CurrencyConversionFormUpload.$valid && LogCount == 0) {

            //if (document.getElementById('uploadExcel1').value != null && document.getElementById('uploadExcel1').value != '') {
            //document.getElementById("overlay_loadingNew").style.display = "block";
            CusModelObj = new Object();
            //CusModelObj.CUSTOMER_ID = $scope.CCSearch.CUSTOMER_ID;
            //CusModelObj.CUSTOMER_NAME = $scope.CCSearch.CUSTOMER_NAME;
            //ModelObj.BRANCH_ID = 15;
            CusModelObj.ENTITY_ID = $scope.CCSearch.ENTITY_ID_UPLOAD;//parseInt($cookies.get("ENTITY_ID"));
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.SERVER_FILE_NAME = $scope.CCSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CusModelObj.ORIGINAL_FILE_NAME = $scope.CCSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            CusModelObj.LOGO_PATH = $scope.CCSearch.UploadedFiles[0].FILE_PATH + $scope.CCSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CusModelObj.LOGO_PATH = CusModelObj.LOGO_PATH.replace(/^.+?[/]/, '');
            CusModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            CusModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            CusModelObj.CURRENCY_CONVERSION_TYPE = $scope.CURRENCY_CONVERSION_TYPE;
            PrcCommMethods.ADMIN_API(CusModelObj, 'EXCEL_CURRENCY_ADD').then(function (data) {

                if (data.data == null) {
                    // $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                }
                else {

                    $scope.CURRENCY_CONVERSION = data.data.HEADER_CLOUMN_NAMES
                    $scope.CC_CODE_ARRY = data.data.EXCEL_TO_BUG_TABLE;

                    $scope.IS_CC_VALID_UPLOAD_FILE = true;
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.CC_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.IS_CC_VALID_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.CC_INVALID_EXCLE_CELL_FLAG = true;
                        // $('#View_Report').modal('show');
                    }
                    else if (data.data.error == "CODE0001") {
                        $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_CC_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_CC_VALID_UPLOAD_FILE = false;
                        if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                            $scope.Message = "";
                            var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                            $scope.CC_CODE_ARRY.push(List);
                            $scope.CC_COPY_CODE_ARRY.push(List);
                        };
                    }
                    else if (data.data.error == "CODE0002") {
                        $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_CC_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                        $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                        $scope.submitted = false;
                        $scope.IS_CC_VALID_UPLOAD_FILE = false;
                    }
                    else {
                        $scope.CC_INVALID_EXCLE_CELL_FLAG = false;
                        $scope.CC_UPLOAD_TAB = true;
                        $scope.CC_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.$parent.ShowAlert('Success', 'File validated successfully, please click on Upload', 5000);
                    }
                }
            });
        }

    };
    $scope.NGINIT_CURRENCY_CONVERSION = function (LINE) {
        if (LINE.EFFECTIVE_DATE != null) {
            if (LINE.EFFECTIVE_DATE.split(' ').length > 0) {
                LINE.EFFECTIVE_DATE = LINE.EFFECTIVE_DATE.split(' ')[0];
            }
        }
    }
    $scope.INS_UPD_CURRENCY_CONVERSION_RATES = function () {

        $scope.CurrencyConversionFormUpload.submitted = true;
        if ($scope.CurrencyConversionFormUpload.$valid) {
            CusModelObj = new Object();
            CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CusModelObj.ENTITY_ID = $scope.CCSearch.ENTITY_ID_UPLOAD;
            CusModelObj.FILE_NAME = $scope.CCSearch.UploadedFiles[0].ORIGINAL_FILE_NAME + ":;:" + $scope.CCSearch.UploadedFiles[0].FILE_PATH + $scope.CCSearch.UploadedFiles[0].SERVER_FILE_NAME;//CusModelObj.LOGO_PATH.replace(/^.+?[/]/, '');
            //$scope.CCSearch.UploadedFiles[0].FILE_PATH + $scope.CCSearch.UploadedFiles[0].SERVER_FILE_NAME;
            CusModelObj.CURRENCY_CONVERSION_RATES = [];
            angular.forEach($scope.CURRENCY_CONVERSION, function (VAL) {
                ReadOnlyObj = new Object();
                ReadOnlyObj.BASE_CURRENCY_CODE = VAL.BASE_CURRENCY_CODE;
                ReadOnlyObj.CONVERT_TO_CURRENCY_CODE = VAL.CONVERT_TO_CURRENCY_CODE;
                //ReadOnlyObj.RATE = parseFloat(VAL.RATE).toFixed(5);
                ReadOnlyObj.RATE = parseFloat(VAL.RATE);
                ReadOnlyObj.EFFECTIVE_DATE = VAL.EFFECTIVE_DATE;
                //ReadOnlyObj.BUDGET = parseFloat(VAL.BUDGET).toFixed(5);
                // ReadOnlyObj.COVERS = parseInt(VAL.COVERS);
                CusModelObj.CURRENCY_CONVERSION_RATES.push(ReadOnlyObj)
            });

            PrcCommMethods.ADMIN_API(CusModelObj, 'INS_UPD_CURRENCY_CONVERSION_RATES').then(function (data) {

                if (data.data.Table.length > 0) {
                    $scope.$parent.ShowAlert('Success', 'Successfully Uploaded', 3000);
                    $scope.INVALID_EXCLE_CELL_COUNT = null;
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //$scope.CURRENCY_CONVERSION = [];

                    document.getElementById('uploadExcel1').value = '';
                    $scope.CCSearch.ENTITY_ID_UPLOAD = null;
                    $scope.CC_INVALID_EXCLE_CELL_FLAG = true;
                    $scope.CurrencyConversionFormUpload.submitted = false;
                }
            });
        }

    };

    $scope.RESET_BUTTON_SETUP = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INVALID_EXCLE_CELL_FLAG = true;
        $scope.INVALID_EXCLE_CELL_COUNT = null;
    };
    $scope.RESET = function () {

        $scope.CCSearch = {
            ENTITY_ID: null,
            // BRANCH_ID: null,
            LOGO_PATH: '',
            // CUSTOMER_ID: '',
            UploadedFiles: [],
            USER_ID: '',
            FILE_NAME: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            ORIGINAL_FILE_NAME: '',
            SERVER_FILE_NAME: '',
            //BRANCH_BUDGET_LOG: null,
            UPLOAD_START_DATE: null,
            UPLOAD_END_DATE: null,
            // SAMPLE_EXCEL_FILE: null,
            //  VIEW_BRANCH_BUDGETS: [],
            LOG_PAGE_NO: 1,
            LOG_PAGE_SIZE: 10,
            ENTITY_ID_UPLOAD: null,
            BASE_CURRENCY_CODE: 'GBP'
        };
        document.getElementById('uploadExcel1').value = '';
        $scope.CC_INVALID_EXCLE_CELL_COUNT = null;
        $scope.CC_INVALID_EXCLE_CELL_FLAG = true;
        $scope.CURRENCY_CONVERSION = [];
        $scope.CurrencyConversionFormUpload.submitted = false;

    };
});

app.controller('CurrencyConversionViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = 'Currency Conversion View';
    $scope.$parent.urlpath = 'Currency_Conversion_View';
    //$scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.CC_LOG_DETAILS = [];
    $scope.CC_LOGS = [];
    $scope.CCSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        LOG_PAGE_NO: 1,
        LOG_PAGE_SIZE: 10,
        //PAGE_NO_RATES: 1,
        // PAGE_SIZE_RATES: 10,
        CLICK_SEARCH: null,
        // CLICK_SEARCH_RATES: 0,         
        // EFFECTIVE_DATE_START: null,
        //  EFFECTIVE_DATE_START: null,
        UPLOAD_START_DATE: null,
        UPLOAD_END_DATE: null,
        // VIEW_CC_RATES: [],
        //ENTITY_ID_VIEW: null,
        CC_OBJ: null,
        // FROM_CURRENCY_ID: null,
        // TO_CURRENCY_ID:null,
        ACTIVE: -1

    };
    $scope.FLAG = 1;
    $scope.COMMON_CODE_CHANGE();
    $scope.TAB_FLAG = $scope.FLAG;
    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {

        $scope.TAB_FLAG = TAB_FLAG;
        if (TAB_FLAG == 1) {
            $scope.GET_CURRENCY_CONVERSION_RATES_LOGS(2);
        }
        if (TAB_FLAG == 2) {
            $scope.GET_CURRENCY_CONVERSION_RATES(2);
        }
    }
    $scope.GET_ENTITY_LIST = function () {
        // if ($scope.BranchAreaSearch.CUSTOMER_ID != undefined && $scope.BranchAreaSearch.CUSTOMER_ID != null) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; };
        });
        //}
        //else { $scope.ENTITY_LIST = []; }
    };
    $scope.GET_ENTITY_LIST();
    $scope.SETENDCOMPDATE_UPLOAD = function () {

        if (($scope.CCSearch.UPLOAD_START_DATE != undefined && $scope.CCSearch.UPLOAD_START_DATE != '' && $scope.CCSearch.UPLOAD_START_DATE != null) && ($scope.CCSearch.UPLOAD_START_DATE != undefined && $scope.CCSearch.UPLOAD_START_DATE != '' && $scope.CCSearch.UPLOAD_START_DATE != null)) {
            if (new Date($scope.CCSearch.UPLOAD_END_DATE) < new Date($scope.CCSearch.UPLOAD_START_DATE)) {
                $scope.ShowAlert('Error', '"To Date" cannot be less than "Upload Start Date"', 3000);
                $scope.CCSearch.UPLOAD_END_DATE = '';

            }
        };
    };
    //================================Currency Conversion Files ======================
    $scope.CURRENCY_CONVERSION_RATES_LOG_DETAILS = function (CC_OBJ, FLAG) {
        CusModelObj = new Object();
        $scope.CCSearch.CC_OBJ = CC_OBJ;
        if (FLAG == 1) {
            $scope.CCSearch.CLICK_SEARCH = 1;
            $scope.CC_LOG_DETAILS = [];
            $scope.CCSearch.LOG_PAGE_NO = 1;
            // BrnModelObj.ACTIVE = $scope.CCSearch.ACTIVE == -1 ? -1 : $scope.CCSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CC_LOG_DETAILS = [];
            CusModelObj.ACTIVE = -1;
            $scope.CCSearch.LOG_PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.CCSearch.CLICK_SEARCH == 1)
                CusModelObj.ACTIVE = $scope.CCSearch.ACTIVE == -1 ? -1 : $scope.CCSearch.ACTIVE ? 1 : 0;
            else {
                CusModelObj.ACTIVE = -1;
            }
        }

        // document.getElementById("overlay_loadingNew").style.display = "block";

        //ModelObj.CUSTOMER_NAME = $scope.CCSearch.CUSTOMER_NAME;
        // ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        //ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.CURRENCY_CONVERSION_RATES_LOG_HEADER_ID = CC_OBJ.CURRENCY_CONVERSION_RATES_LOG_HEADER_ID;
        CusModelObj.PAGE_NO = $scope.CCSearch.LOG_PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.CCSearch.LOG_PAGE_SIZE;
        // $scope.UPLOAD_FILE_NAME = null;
        // $scope.UPLOAD_FILE_NAME = CC_OBJ.FILE_NAME;

        PrcCommMethods.ADMIN_API(CusModelObj, 'CURRENCY_CONVERSION_RATES_LOG_DETAILS').then(function (data) {

            if (data.data.Table.length > 0) {
                //$scope.CC_LOG_DETAILS = [];
                //document.getElementById("overlay_loadingNew").style.display = "none";
                //document.getElementById("View_Budget_Log_Detail").style.display = "block";
                //$scope.$parent.overlay_loading_div_zindex = '999';
                //document.getElementById("LOADER_ID").style.zIndex = "999"; 
                // $scope.CC_LOG_DETAILS = data.data.Table;

                $scope.CC_LOG_DETAILS = $scope.CC_LOG_DETAILS.concat(data.data.Table);
                if (data.data.Table.length < $scope.CCSearch.LOG_PAGE_SIZE) {
                    $scope.LOG_GetData = false;
                }
                else {
                    $scope.CCSearch.LOG_PAGE_NO = parseInt($scope.CCSearch.LOG_PAGE_NO) + 1;
                    $scope.LOG_GetData = true;
                }
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                //document.getElementById("overlay_loadingNew").style.display = "none";
                document.getElementById("View_CC_Log_Detail").style.display = "block";
                $scope.LOG_GetData = false;
            }
        });
    };
    //if (FLAG == 1) {
    //    $scope.BrachSearch.CLICK_SEARCH = 1;
    //    $scope.BRANCH_LIST = [];
    //    $scope.BrachSearch.PAGE_NO = 1;
    //    BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
    //}
    //else if (FLAG == 2) {
    //    $scope.BRANCH_LIST = [];
    //    $scope.BrachSearch.PAGE_NO = 1;
    //    BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
    //}
    //else if (FLAG == undefined) {
    //    if ($scope.BrachSearch.CLICK_SEARCH == 1)
    //        BrnModelObj.ACTIVE = $scope.BrachSearch.ACTIVE == -1 ? -1 : $scope.BrachSearch.ACTIVE ? 1 : 0;
    //    else
    //        BrnModelObj.ACTIVE = -1;
    //}

    //BrnModelObj.CUSTOMER_ID = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.CUSTOMER_ID : null;
    //BrnModelObj.ENTITY_ID = $scope.BrachSearch.CLICK_SEARCH == 1 ? $scope.BrachSearch.ENTITY_ID : null;
    $scope.GET_CURRENCY_CONVERSION_RATES_LOGS = function (FLAG) {

        var CusModelObj = new Object();
        if (FLAG == 1) {
            $scope.CCSearch.CLICK_SEARCH = 1;
            $scope.CC_LOGS = [];
            $scope.CCSearch.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.CCSearch.ACTIVE == -1 ? -1 : $scope.CCSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CC_LOGS = [];
            $scope.CCSearch.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.CCSearch.ACTIVE == -1 ? -1 : $scope.CCSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.CCSearch.CLICK_SEARCH == 1)
                CusModelObj.ACTIVE = $scope.CCSearch.ACTIVE == -1 ? -1 : $scope.CCSearch.ACTIVE ? 1 : 0;
            else {
                CusModelObj.ACTIVE = -1;
            }
        }

        CusModelObj.FILE_NAME = ($scope.CCSearch.FILE_NAME == null || $scope.CCSearch.FILE_NAME == undefined) ? '' : $scope.CCSearch.FILE_NAME;
        CusModelObj.ENTITY_ID = $scope.CCSearch.CLICK_SEARCH == 1 ? $scope.CCSearch.ENTITY_ID : null;//$scope.CCSearch.ENTITY_ID == null ? null : $scope.CCSearch.ENTITY_ID;
        //CusModelObj.BRANCH_ID = $scope.CCSearch.BRANCH_ID;
        CusModelObj.UPLOAD_START_DATE = $scope.CCSearch.UPLOAD_START_DATE;
        CusModelObj.UPLOAD_END_DATE = $scope.CCSearch.UPLOAD_END_DATE;
        CusModelObj.PAGE_NO = $scope.CCSearch.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.CCSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_CURRENCY_CONVERSION_RATES_LOGS').then(function (data) {
            //
            //$scope.GET_BRANCH_BUDGET_LOGS = data.data.Table;

            if (data.data.Table.length > 0) {
                $scope.CC_LOGS = $scope.CC_LOGS.concat(data.data.Table);
                if (data.data.Table.length < $scope.CCSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CCSearch.PAGE_NO = parseInt($scope.CCSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.LAZY_GET_CURRENCY_CONVERSION_RATES_LOGS = function () { $scope.GET_CURRENCY_CONVERSION_RATES_LOGS(); };
    $scope.LAZY_CURRENCY_CONVERSION_RATES_LOG_DETAILS = function () { $scope.CURRENCY_CONVERSION_RATES_LOG_DETAILS($scope.CCSearch.CC_OBJ); };

    //$scope.GET_CURRENCY_CONVERSION_RATES_LOGS();

    $scope.RESET = function () {

        $scope.CCSearch = {
            ENTITY_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: null,
            UPLOAD_START_DATE: null,
            UPLOAD_END_DATE: null,
            LOG_PAGE_NO: 1,
            LOG_PAGE_SIZE: 10,
            ACTIVE: -1
        };
        $scope.GET_CURRENCY_CONVERSION_RATES_LOGS(2);

    };
    //=================================Currency Conversion==============
    $scope.CCSearch1 = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        CLICK_SEARCH_RATES: null,
        EFFECTIVE_DATE_START: null,
        EFFECTIVE_DATE_END: null,
        VIEW_CC_RATES: [],
        ENTITY_ID_VIEW: null,
        FROM_CURRENCY_ID: 'GBP',
        TO_CURRENCY_ID: null,
        ACTIVE: -1

    };
    $scope.GET_CURRENCY = function () {
        ModelObj = new Object();
        PrcCommMethods.HR_API(ModelObj, 'GET_CURRENCY').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.CURRENCY_LIST = data.data.Table;
            }
            else { $scope.CURRENCY_LIST = []; };
        });

    };
    $scope.GET_CURRENCY();
    $scope.SETENDCOMPDATE_EFFECTIVE = function () {

        if (($scope.CCSearch1.EFFECTIVE_DATE_START != undefined && $scope.CCSearch1.EFFECTIVE_DATE_START != '' && $scope.CCSearch1.EFFECTIVE_DATE_START != null) && ($scope.CCSearch1.EFFECTIVE_DATE_START != undefined && $scope.CCSearch1.EFFECTIVE_DATE_START != '' && $scope.CCSearch1.EFFECTIVE_DATE_START != null)) {
            if (new Date($scope.CCSearch1.EFFECTIVE_DATE_END) < new Date($scope.CCSearch1.EFFECTIVE_DATE_START)) {
                $scope.ShowAlert('Error', '"To Date" cannot be less than "Effective Start Date"', 3000);
                $scope.CCSearch1.EFFECTIVE_DATE_END = '';

            }
        };
    };
    $scope.GET_CURRENCY_CONVERSION_RATES = function (FLAG) {
        // if ($scope.CCSearch1.ENTITY_ID_VIEW != null && $scope.CCSearch1.ENTITY_ID_VIEW != undefined) {
        document.getElementById("overlay_loading").style.display = "block";
        CusModelObj = new Object();
        if (FLAG == 1) {
            $scope.CCSearch1.CLICK_SEARCH_RATES = 1;
            $scope.CCSearch1.VIEW_CC_RATES = [];
            $scope.CCSearch1.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.CCSearch1.ACTIVE == -1 ? -1 : $scope.CCSearch1.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.CCSearch1.VIEW_CC_RATES = [];
            $scope.CCSearch1.PAGE_NO = 1;
            CusModelObj.ACTIVE = $scope.CCSearch1.ACTIVE == -1 ? -1 : $scope.CCSearch1.ACTIVE ? 1 : 0;
        }
        else if (FLAG == undefined) {
            if ($scope.CCSearch1.CLICK_SEARCH_RATES == 1)
                CusModelObj.ACTIVE = $scope.CCSearch1.ACTIVE == -1 ? -1 : $scope.CCSearch1.ACTIVE ? 1 : 0;
            else {
                CusModelObj.ACTIVE = -1;
            }
        }

        CusModelObj.ENTITY_ID = $scope.CCSearch1.CLICK_SEARCH_RATES == 1 ? $scope.CCSearch1.ENTITY_ID_VIEW : null;//$scope.CCSearch1.ENTITY_ID_VIEW == null ? null : $scope.CCSearch1.ENTITY_ID_VIEW;
        CusModelObj.EFFECTIVE_DATE_START = $scope.CCSearch1.EFFECTIVE_DATE_START;
        CusModelObj.EFFECTIVE_DATE_END = $scope.CCSearch1.EFFECTIVE_DATE_END;
        CusModelObj.FROM_CURRENCY_ID = $scope.CCSearch1.FROM_CURRENCY_ID;
        CusModelObj.TO_CURRENCY_ID = $scope.CCSearch1.TO_CURRENCY_ID;
        CusModelObj.PAGE_NO = $scope.CCSearch1.PAGE_NO;
        CusModelObj.PAGE_SIZE = $scope.CCSearch1.PAGE_SIZE;

        PrcCommMethods.ADMIN_API(CusModelObj, 'GET_CURRENCY_CONVERSION_RATES').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.CCSearch1.VIEW_CC_RATES = $scope.CCSearch1.VIEW_CC_RATES.concat(data.data.Table);
                if (data.data.Table.length < $scope.CCSearch.PAGE_SIZE) {
                    $scope.GetData_Rates = false;
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.CCSearch1.PAGE_NO = parseInt($scope.CCSearch1.PAGE_NO) + 1;
                    $scope.GetData_Rates = true;
                    document.getElementById("overlay_loading").style.display = "none";
                }
            }
            else {
                if ($scope.CCSearch1.VIEW_CC_RATES.length == 0) {
                }
                $scope.GetData_Rates = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        });
        //} else {
        //    $scope.CCSearch1.VIEW_CC_RATES = [];
        //}
    };

    $scope.LAZY_GET_CURRENCY_CONVERSION_RATES = function () { $scope.GET_CURRENCY_CONVERSION_RATES(); };
    $scope.GET_CURRENCY_CONVERSION_RATES();
    $scope.GET_CURRENCY_CONVERSION_RATES_LOGS();
    $scope.RESET_VIEW = function () {

        $scope.CCSearch1 = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH_RATES: null,
            EFFECTIVE_DATE_START: null,
            EFFECTIVE_DATE_END: null,
            VIEW_CC_RATES: [],
            ENTITY_ID_VIEW: null,
            FROM_CURRENCY_ID: 'GBP',
            TO_CURRENCY_ID: null,
            ACTIVE: -1
            //  CUSTOMER_ID: null,
        };
        $scope.GET_CURRENCY_CONVERSION_RATES(2);

    };
});
app.controller('CommonIntegrationMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = 'Integration Mapping';
    $scope.$parent.urlpath = 'Integration Mapping';
    $scope.CUSTOMER_LIST = [];
    $scope.ENTITY_LIST = [];
    $scope.CC_LOG_DETAILS = [];
    $scope.CC_LOGS = [];
    $scope.CC_IntegrationSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        LOG_PAGE_NO: 1,
        LOG_PAGE_SIZE: 10,
        //PAGE_NO_RATES: 1,
        // PAGE_SIZE_RATES: 10,
        CLICK_SEARCH: null,
        // CLICK_SEARCH_RATES: 0,         
        // EFFECTIVE_DATE_START: null,
        //  EFFECTIVE_DATE_START: null,
        UPLOAD_START_DATE: null,
        UPLOAD_END_DATE: null,
        // VIEW_CC_RATES: [],
        //ENTITY_ID_VIEW: null,
        CC_OBJ: null,
        // FROM_CURRENCY_ID: null,
        // TO_CURRENCY_ID:null,
        ACTIVE: -1

    };
    $scope.FLAG = 1;
    $scope.COMMON_CODE_CHANGE();
    $scope.TAB_FLAG = $scope.FLAG;
    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {

        $scope.TAB_FLAG = TAB_FLAG;
        if (TAB_FLAG == 1) {
            $scope.GET_CURRENCY_CONVERSION_RATES_LOGS(2);
        }
        if (TAB_FLAG == 2) {
            $scope.GET_CURRENCY_CONVERSION_RATES(2);
        }
    }
    $scope.GET_ENTITY_LIST = function () {
        // if ($scope.BranchAreaSearch.CUSTOMER_ID != undefined && $scope.BranchAreaSearch.CUSTOMER_ID != null) {
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
            }
            else { $scope.ENTITY_LIST = []; };
        });
        //}
        //else { $scope.ENTITY_LIST = []; }
    };
    $scope.GET_ENTITY_LIST();

    //================================Currency Conversion Files ======================




});
app.controller('EposSalesCategotyMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = 'Epos Sales Category  Mapping';
    $scope.$parent.urlpath = 'Epos Sales Category  Mapping';
    $scope.ENTITY_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
    $scope.EposSalesCategotyMappingSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.ENTITY_LIST = [];
                document.getElementById("overlay_loading").style.display = "none";
            };
        });
        //$scope.EposSalesCategotyMappingForm.submitted = false;
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
        ModelObj.BRANCH_CODE = null;
        ModelObj.BRANCH_NAME = null;
        ModelObj.CONTACT_NAME = null;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_LIST = data.data.Table; document.getElementById("overlay_loading").style.display = "none";
            }
            else
                $scope.BRANCH_LIST = []; document.getElementById("overlay_loading").style.display = "none";
        });
        $scope.EposSalesCategotyMappingForm.submitted = false;
    };
    $scope.GET_INTEGRATION_SYSTEMS = function () {
        CommonObj = new Object();
        CommonObj.INTEGRATION_TYPE_ID = 1;
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {
            $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
        });

    };
    $scope.GET_INTEGRATION_SYSTEMS();
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
            }
        });
    };
    //$scope.GET_CATEGORY_MASTER();
    $scope.GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingForm.submitted = true;
        $scope.EposSalesCategotyMappingListForm.submitted = false;
        if ($scope.EposSalesCategotyMappingForm.$valid) {
            document.getElementById("overlay_loading").style.display = "block";
            var CommModelObj = new Object();
            CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
            CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
            CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
            $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
            PrcCommMethods.ADMIN_API(CommModelObj, 'GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = data.data.Table;
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_ID != "");
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
                    $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                    document.getElementById("overlay_loading").style.display = "none";
                };
            });
            $scope.EposSalesCategotyMappingForm.submitted = false;
        }
    };
    $scope.INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingListForm.submitted = true;
        $scope.RESULT_SET = [];
        angular.forEach($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_MASTER_ID != null && p.CATEGORY_MASTER_ID != ""), function (item) {
            $scope.ITEM = [];
            $scope.ITEM = {
                "TABLE_ID": item.TABLE_ID,
                "CATEGORY_ID": item.CATEGORY_ID.toString(),
                "CATEGORY_CODE": item.CATEGORY_CODE.toString(),
                "CATEGORY_NAME": item.CATEGORY_NAME.toString(),
                "CATEGORY_MASTER_ID": item.CATEGORY_MASTER_ID
            };
            $scope.RESULT_SET.push($scope.ITEM);
        });
        if ($scope.EposSalesCategotyMappingListForm.$valid) {
            if ($scope.RESULT_SET.length > 0) {
                document.getElementById("overlay_loading").style.display = "block";
                var CommModelObj = new Object();
                CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
                CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
                CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
                CommModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CommModelObj.CATEGORY_MASTER_MAPPING = $scope.RESULT_SET;
                PrcCommMethods.ADMIN_API(CommModelObj, 'INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.RESET();
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please select category mapping.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        }
    };
    $scope.RESET = function () {
        $scope.EposSalesCategotyMappingForm.submitted = false;
        $scope.BRANCH_LIST = [];
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        $scope.EposSalesCategotyMappingSearch = {
            ENTITY_ID: null,
            USER_ID: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: -1,
            INTEGRATION_SYSTEM_ID: null
        };
    };
});

app.controller('EPOSIntegrationMappingController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.PAGE_HEADER = 'Epos Integration Mapping';
    $scope.$parent.urlpath = 'Epos Integration Mapping';
    $scope.ENTITY_LIST = [];
    $scope.INTEGRATIONSYSTEM_LIST = [];
    $scope.BRANCH_LIST = [];
    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
    $scope.EposSalesCategotyMappingSearch = {
        ENTITY_ID: null,
        USER_ID: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: -1,
        INTEGRATION_SYSTEM_ID: null
    };
    $scope.GET_ENTITY_LIST = function () {
        document.getElementById("overlay_loading").style.display = "block";
        var CusModelObj = new Object();
        CusModelObj.CUSTOMER_ID = null;
        CusModelObj.ACTIVE = 1;
        CusModelObj.PAGE_NO = 0;
        CusModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CusModelObj.IS_LIVE = -1;
        PrcCommMethods.ADMIN_API(CusModelObj, 'ADMIN_GET_ENTITIES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ENTITY_LIST = data.data.Table;
                document.getElementById("overlay_loading").style.display = "none";
            }
            else {
                $scope.ENTITY_LIST = [];
                document.getElementById("overlay_loading").style.display = "none";
            };
        });
        //$scope.EposSalesCategotyMappingForm.submitted = false;
    };
    $scope.GET_ENTITY_LIST();
    $scope.ADMIN_GET_BRANCH = function () {
        document.getElementById("overlay_loading").style.display = "block";
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
        ModelObj.BRANCH_CODE = null;
        ModelObj.BRANCH_NAME = null;
        ModelObj.CONTACT_NAME = null;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_LIST = data.data.Table; document.getElementById("overlay_loading").style.display = "none";
            }
            else
                $scope.BRANCH_LIST = []; document.getElementById("overlay_loading").style.display = "none";
        });
        $scope.EposSalesCategotyMappingForm.submitted = false;
    };
    $scope.GET_INTEGRATION_SYSTEMS = function () {
        CommonObj = new Object();
        CommonObj.INTEGRATION_TYPE_ID = 1;
        CommonObj.MODULE_ID = 1;
        PrcCommMethods.ADMIN_API(CommonObj, 'GET_INTEGRATION_SYSTEMS_EPOS').then(function (data) {
            $scope.INTEGRATIONSYSTEM_LIST = data.data.Table;
        });

    };
    $scope.GET_INTEGRATION_SYSTEMS();
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
            }
        });
    };
    //$scope.GET_CATEGORY_MASTER();
    $scope.GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingForm.submitted = true;
        $scope.EposSalesCategotyMappingListForm.submitted = false;
        if ($scope.EposSalesCategotyMappingForm.$valid) {
            document.getElementById("overlay_loading").style.display = "block";
            var CommModelObj = new Object();
            CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
            CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
            CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
            $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
            PrcCommMethods.ADMIN_API(CommModelObj, 'GET_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                if (data.data != null && data.data.Table.length > 0) {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = data.data.Table;
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_ID != "");
                    document.getElementById("overlay_loading").style.display = "none";
                }
                else {
                    $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
                    $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                    document.getElementById("overlay_loading").style.display = "none";
                };
            });
            $scope.EposSalesCategotyMappingForm.submitted = false;
        }
    };
    $scope.INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING = function () {
        $scope.EposSalesCategotyMappingListForm.submitted = true;
        $scope.RESULT_SET = [];
        angular.forEach($scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST.filter(p => p.CATEGORY_MASTER_ID != null && p.CATEGORY_MASTER_ID != ""), function (item) {
            $scope.ITEM = [];
            $scope.ITEM = {
                "TABLE_ID": item.TABLE_ID,
                "CATEGORY_ID": item.CATEGORY_ID.toString(),
                "CATEGORY_CODE": item.CATEGORY_CODE.toString(),
                "CATEGORY_NAME": item.CATEGORY_NAME.toString(),
                "CATEGORY_MASTER_ID": item.CATEGORY_MASTER_ID
            };
            $scope.RESULT_SET.push($scope.ITEM);
        });
        if ($scope.EposSalesCategotyMappingListForm.$valid) {
            if ($scope.RESULT_SET.length > 0) {
                document.getElementById("overlay_loading").style.display = "block";
                var CommModelObj = new Object();
                CommModelObj.ENTITY_ID = $scope.EposSalesCategotyMappingSearch.ENTITY_ID;
                CommModelObj.BRANCH_ID = $scope.EposSalesCategotyMappingSearch.BRANCH_ID;
                CommModelObj.INTEGRATION_SYSTEM_ID = $scope.EposSalesCategotyMappingSearch.INTEGRATION_SYSTEM_ID;
                CommModelObj.USER_ID = parseInt($cookies.get("USERID"));
                CommModelObj.CATEGORY_MASTER_MAPPING = $scope.RESULT_SET;
                PrcCommMethods.ADMIN_API(CommModelObj, 'INS_UPD_EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Saved Successfully", 3000);
                        $scope.RESET();
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                    else {
                        $scope.$parent.ShowAlert('Attention', 'Please Select Active/In-Active Option.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                        document.getElementById("overlay_loading").style.display = "none";
                    }
                });
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'Please select category mapping.', 3000); $scope.EposSalesCategotyMappingForm.submitted = false;
                document.getElementById("overlay_loading").style.display = "none";
            }
        }
    };
    $scope.RESET = function () {
        $scope.EposSalesCategotyMappingForm.submitted = false;
        $scope.BRANCH_LIST = [];
        $scope.EPOS_SALES_CATEGORY_CATEGORY_MASTER_MAPPING_LIST = [];
        $scope.EposSalesCategotyMappingSearch = {
            ENTITY_ID: null,
            USER_ID: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            ACTIVE: -1,
            INTEGRATION_SYSTEM_ID: null
        };
    };
});
