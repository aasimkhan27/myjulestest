app.controller('BudgetController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.REDIRECTION_PAGE = function (Path, ACCESS) {
        if (ACCESS) {
            $location.path(Path);
        }
        else {
            $scope.$parent.ShowAlert("Warning", $scope.$parent.ACCESS_TEXT, 2000);
        }
    };

    $scope.DOWNLOAD_FILE_PATH = "/Uploads/BudgetTemplate.xlsx";
    //$scope.owin = function () {
    //   
    //    //var data = null;//"grant_type=password&username=superadmin@wenodo.com&password=demo123";
    //    //$http.get("http://localhost:54891/api/values/getvalues?grant_type=password", data, {
    //    //    headers:
    //    //        { 'Content-Type': 'application/x-www-form-urlencoded' }
    //    //}).success(function (response) {
    //    //    var o = response;
    //    //    userInfo = {
    //    //        accessToken: response.access_token,
    //    //        userName: response.userName,
    //    //        refreshToken: response.refresh_token
    //    //    };
    //    //    authenticationService.setTokenInfo(userInfo);
    //    //    authData.authenticationData.IsAuthenticated = true;
    //    //    authData.authenticationData.userName = response.userName;
    //    //    deferred.resolve(null);
    //    //})
    //    //    .error(function (err, status) {
    //    //        authData.authenticationData.IsAuthenticated = false;
    //    //        authData.authenticationData.userName = "";
    //    //        deferred.resolve(err);
    //    //    });
    //    //return deferred.promise;
    //    $http({
    //        method: "GET",
    //        url: "http://localhost:54891/api/values/getvalues",
    //        mode: 'no-cors',
    //        headers: {
    //            'Accept': 'application/json',
    //            'Content-Type': 'application/x-www-form-urlencoded'
    //        }

    //    }).then(function mySuccess(response) {
    //        $scope.myWelcome = response.data;
    //    }, function myError(response) {
    //        $scope.myWelcome = response.statusText;
    //    });

    //};
    $scope.UPLOAD_FILE_NAME = null;
    $scope.INVALID_EXCLE_CELL_COUNT = null;
    $scope.INVALID_EXCLE_CELL_FLAG = true;
    $scope.BRANCH_BUDGET_LOGS = [];
    $scope.BRANCH_BUDGETS = [];
    $scope.BRANCH_BUDGET_LOG_DETAILS = [];
    $scope.Files = null;
    $scope.BudgetSearch = {
        ENTITY_ID: null,
        BRANCH_ID: null,
        LOGO_PATH: '',
        CUSTOMER_ID: '',
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
        BRANCH_BUDGET_LOG: null,
        START_DATE: null,
        END_DATE: null,
        SAMPLE_EXCEL_FILE: null,
        VIEW_BRANCH_BUDGETS: [],
        ENTITY_ID_UPLOAD: null,
        BRANCH_ID_UPLOAD: null,
        BUDGET_OBJ: null
    };

    $scope.BRANCH_BUDGETS_TYPE = [{ ID: 1, COLUMN_NAME: 'BUDGET_DATE', MATCH_COLUMN_NAME: 'Date', IS_MANDATORY: true, HEADER_NAME: 'Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'BUDGET_CATEGORY', MATCH_COLUMN_NAME: 'Category', IS_MANDATORY: false, HEADER_NAME: 'Category', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 3, COLUMN_NAME: 'BUDGET', MATCH_COLUMN_NAME: 'Budget', IS_MANDATORY: true, HEADER_NAME: 'Budget', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
        { ID: 4, COLUMN_NAME: 'COVERS', MATCH_COLUMN_NAME: 'Covers', IS_MANDATORY: false, HEADER_NAME: 'Covers', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
        { ID: 3, COLUMN_NAME: 'FORECASTED_SALES', MATCH_COLUMN_NAME: 'Forecasted sales', IS_MANDATORY: true, HEADER_NAME: 'Forecasted sales', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
        { ID: 4, COLUMN_NAME: 'FORECASTED_COVERS', MATCH_COLUMN_NAME: 'Forecasted Covers', IS_MANDATORY: false, HEADER_NAME: 'Forecasted Covers', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];


    $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = true;
    $scope.EXCEL_BUDGET_ADD = function () {
        if (document.getElementById('uploadExcel1').value != null && document.getElementById('uploadExcel1').value != '') {
            document.getElementById("overlay_loadingNew").style.display = "block";
            ModelObj = new Object();
            ModelObj.CUSTOMER_ID = $scope.BudgetSearch.CUSTOMER_ID;
            ModelObj.CUSTOMER_NAME = $scope.BudgetSearch.CUSTOMER_NAME;
            ModelObj.BRANCH_ID = $scope.BudgetSearch.BRANCH_ID_UPLOAD
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.SERVER_FILE_NAME = $scope.BudgetSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.BudgetSearch.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.LOGO_PATH = $scope.BudgetSearch.UploadedFiles[0].FILE_PATH + $scope.BudgetSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.LOGO_PATH = ModelObj.LOGO_PATH.replace(/^.+?[/]/, '');
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy"];
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
            ModelObj.BRANCH_BUDGETS = $scope.BRANCH_BUDGETS_TYPE
            PrcCommMethods.REPORT_API(ModelObj, 'BUDGET_UPLOAD_EXCEL').then(function (data) {
                if (data.data == null) {
                    // $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
                }
                else {
                    document.getElementById("overlay_loadingNew").style.display = "none";
                    //$scope.BRANCH_BUDGETS = [];
                    //$scope.BRANCH_BUDGETS = data.data.BRANCH_BUDGETS;
                    //if (($scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length) > 0) {
                    //    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //    $scope.INVALID_EXCLE_CELL_COUNT = $scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length;
                    //    $scope.$parent.ShowAlert('Error', 'File validation fail.', 3000);
                    //}
                    //else {
                    //    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    //    $scope.INVALID_EXCLE_CELL_COUNT = $scope.BRANCH_BUDGETS.filter(x => x.ERROR != "").length;
                    //    $scope.$parent.ShowAlert('Success', 'File validated successfully.', 3000);
                    //}
                    $scope.BRANCH_BUDGETS = data.data.HEADER_CLOUMN_NAMES
                    $scope.BUDGET_CODE_ARRY = data.data.EXCEL_TO_BUG_TABLE;

                    $scope.IS_BUDGET_VALID_UPLOAD_FILE = true;
                    if (data.data.IS_VALID_COUNT > 0) {
                        $scope.BUDGET_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.IS_BUDGET_VALID_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = true;
                        //$('#View_Report').modal('show');
                    }
                    else if (data.data.error == "CODE0001") {
                        $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
                        if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                            $scope.Message = "";
                            var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                            $scope.BUDGET_CODE_ARRY.push(List);
                            $scope.BUDGET_COPY_CODE_ARRY.push(List);
                        };
                    }
                    else if (data.data.error == "CODE0002") {
                        $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                        $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                        $scope.submitted = false;
                        $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
                    }
                    else {
                        $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = false;
                        $scope.BUDGET_UPLOAD_TAB = true;
                        $scope.BUDGET_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                        $scope.$parent.ShowAlert('Success', 'File validated successfully, please click on Upload', 5000);
                    }
                }
            });
        }

    };
    $scope.NGINIT_BRANCH_BUDGETS = function (LINE) {
        if (LINE.BUDGET_DATE != null) {
            if (LINE.BUDGET_DATE.split(' ').length > 0) {
                LINE.BUDGET_DATE = LINE.BUDGET_DATE.split(' ')[0];
            }
        }
    }

    $scope.GET_BRANCH_BUDGET_LOG_DETAILS = function (BUDGET_OBJ, FLAG) {
        ModelObj = new Object();
        $scope.BudgetSearch.BUDGET_OBJ = BUDGET_OBJ;
        if (FLAG == 1) {
            $scope.BudgetSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_BUDGET_LOG_DETAILS = [];
            $scope.BudgetSearch.LOG_PAGE_NO = 1;
            //BrnModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_BUDGET_LOG_DETAILS = [];
            ModelObj.ACTIVE = -1;
            $scope.BudgetSearch.LOG_PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.BudgetSearch.CLICK_SEARCH == 1)
                ModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
            else {
                ModelObj.ACTIVE = -1;
            }
        }

        document.getElementById("overlay_loadingNew").style.display = "block";
        //document.getElementById("View_Budget_Log_Detail").style.display = "none";
        //$scope.$parent.overlay_loading_div_zindex = '-1';
        //document.getElementById("LOADER_ID").style.zIndex = "-1";  
        //$scope.BRANCH_BUDGET_LOG_DETAILS = [];
        ModelObj.CUSTOMER_NAME = $scope.BudgetSearch.CUSTOMER_NAME;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.BRANCH_BUDGET_LOG_ID = BUDGET_OBJ.BRANCH_BUDGET_LOG_ID;
        ModelObj.PAGE_NO = $scope.BudgetSearch.LOG_PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.BudgetSearch.LOG_PAGE_SIZE;
        $scope.UPLOAD_FILE_NAME = null;
        $scope.UPLOAD_FILE_NAME = BUDGET_OBJ.FILE_NAME;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGET_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                //$scope.BRANCH_BUDGET_LOG_DETAILS = [];
                document.getElementById("overlay_loadingNew").style.display = "none";
                //document.getElementById("View_Budget_Log_Detail").style.display = "block";
                //$scope.$parent.overlay_loading_div_zindex = '999';
                //document.getElementById("LOADER_ID").style.zIndex = "999"; 
                //$scope.BRANCH_BUDGET_LOG_DETAILS = data.data.Table;

                $scope.BRANCH_BUDGET_LOG_DETAILS = $scope.BRANCH_BUDGET_LOG_DETAILS.concat(data.data.Table);
                if (data.data.Table.length < $scope.BudgetSearch.LOG_PAGE_SIZE) {
                    $scope.LOG_GetData = false;
                }
                else {
                    $scope.BudgetSearch.LOG_PAGE_NO = parseInt($scope.BudgetSearch.LOG_PAGE_NO) + 1;
                    $scope.LOG_GetData = true;
                }
            }
            else {
                $scope.$parent.ShowAlert('Attention', 'No record found.', 3000);
                document.getElementById("overlay_loadingNew").style.display = "none";
                document.getElementById("View_Budget_Log_Detail").style.display = "block";
                $scope.LOG_GetData = false;
            }
        });
    };
    $scope.GET_BRANCH_BUDGET_LOGS = function (FLAG) {

        ModelObj = new Object();
        if (FLAG == 1) {
            $scope.BudgetSearch.CLICK_SEARCH = 1;
            $scope.BRANCH_BUDGET_LOGS = [];
            $scope.BudgetSearch.PAGE_NO = 1;
            //BrnModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BRANCH_BUDGET_LOGS = [];
            ModelObj.ACTIVE = -1;
            $scope.BudgetSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.BudgetSearch.CLICK_SEARCH == 1)
                ModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
            else {
                ModelObj.ACTIVE = -1;
            }
        }

        ModelObj.FILE_NAME = $scope.BudgetSearch.FILE_NAME;
        ModelObj.ENTITY_ID = $scope.BudgetSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.BudgetSearch.BRANCH_ID;
        ModelObj.START_DATE = $scope.BudgetSearch.START_DATE;
        ModelObj.END_DATE = $scope.BudgetSearch.END_DATE;
        ModelObj.PAGE_NO = $scope.BudgetSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.BudgetSearch.PAGE_SIZE;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGET_LOGS').then(function (data) {
            //
            //$scope.GET_BRANCH_BUDGET_LOGS = data.data.Table;

            if (data.data.Table.length > 0) {
                $scope.BRANCH_BUDGET_LOGS = $scope.BRANCH_BUDGET_LOGS.concat(data.data.Table);
                if (data.data.Table.length < $scope.BudgetSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BudgetSearch.PAGE_NO = parseInt($scope.BudgetSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
            }
        });
    };
    $scope.BUDGET_UPLOAD = function () {
        $scope.BudgetFormUpload.submitted = true;
        if ($scope.BudgetFormUpload.$valid) {
            ModelObj = new Object();
            ModelObj.ENTITY_ID = $scope.BudgetSearch.ENTITY_ID_UPLOAD;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.BRANCH_ID = $scope.BudgetSearch.BRANCH_ID_UPLOAD;
            ModelObj.LOGO_PATH = $scope.BudgetSearch.UploadedFiles[0].FILE_PATH + $scope.BudgetSearch.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.FILE_NAME = $scope.BudgetSearch.UploadedFiles[0].ORIGINAL_FILE_NAME + ":;:" + ModelObj.LOGO_PATH.replace(/^.+?[/]/, '');
            ModelObj.BRANCH_BUDGETS = [];
            angular.forEach($scope.BRANCH_BUDGETS, function (VAL) {
                ReadOnlyObj = new Object();
                ReadOnlyObj.BUDGET_DATE = VAL.BUDGET_DATE;
                ReadOnlyObj.BUDGET_CATEGORY = VAL.BUDGET_CATEGORY;
                ReadOnlyObj.BUDGET = parseFloat(VAL.BUDGET).toFixed(5);
                ReadOnlyObj.COVERS = parseInt(VAL.COVERS);
                ReadOnlyObj.FORCASTED_SALES = parseFloat(VAL.FORECASTED_SALES).toFixed(5);
                ReadOnlyObj.FORCASTED_COVERS = parseInt(VAL.FORECASTED_COVERS);
                ModelObj.BRANCH_BUDGETS.push(ReadOnlyObj)
            });
            PrcCommMethods.REPORT_API(ModelObj, 'INS_UPD_BRANCH_BUDGETS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.$parent.ShowAlert('Success', 'Successfully Uploaded', 3000);
                    $scope.INVALID_EXCLE_CELL_COUNT = null;
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    $scope.BRANCH_BUDGETS = [];

                    document.getElementById('uploadExcel1').value = '';
                    $scope.BRANCH_LIST_VIEW = null;
                    $scope.BudgetSearch.ENTITY_ID = null;
                    $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = true;
                    $scope.BudgetSearch.ENTITY_ID_UPLOAD = null;
                    $scope.BudgetSearch.BRANCH_ID_UPLOAD = null;
                    $scope.GET_BRANCH_BUDGET_LOGS(1);
                    $scope.BudgetFormUpload.submitted = false;
                }
            });
        }

    };
    $scope.ADMIN_GET_BRANCH = function (param) {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = param == undefined ? $scope.BudgetSearch.ENTITY_ID : $scope.BudgetSearch.ENTITY_ID_UPLOAD;
        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        if (ModelObj.ENTITY_ID != null && ModelObj.ENTITY_ID != undefined) {
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
                // $scope.BRANCH_LIST_VIEW = [];
                if ($scope.BRANCH_LIST == undefined) { $scope.BRANCH_LIST = []; }
                if ($scope.BRANCH_LIST_VIEW == undefined) { $scope.BRANCH_LIST_VIEW = []; }
                if (param == 1)
                    $scope.BRANCH_LIST_VIEW = data.data.Table;
                else
                    $scope.BRANCH_LIST = data.data.Table;
            });
        }
        else { $scope.BRANCH_LIST_VIEW = null; }
    };
    $scope.ON_ENTITY_CHANGE = function () {
        $scope.ADMIN_GET_BRANCH(1);
    };
    $scope.ADMIN_GET_BRANCH();

    $scope.LAZY_GET_BRANCH_BUDGETS = function () { $scope.GET_BRANCH_BUDGETS(); };
    $scope.LAZY_GET_BRANCH_BUDGET_LOGS = function () { $scope.GET_BRANCH_BUDGET_LOGS(); };
    $scope.LAZY_GET_BRANCH_BUDGET_LOG_DETAILS = function () { $scope.GET_BRANCH_BUDGET_LOG_DETAILS($scope.BudgetSearch.BUDGET_OBJ); };

    $scope.GET_BRANCH_BUDGETS = function (FLAG) {
        ModelObj = new Object();
        if (FLAG == 1) {
            $scope.BudgetSearch.CLICK_SEARCH = 1;
            $scope.BudgetSearch.VIEW_BRANCH_BUDGETS = [];
            $scope.BudgetSearch.PAGE_NO = 1;
            //BrnModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
        }
        else if (FLAG == 2) {
            $scope.BudgetSearch.VIEW_BRANCH_BUDGETS = [];
            ModelObj.ACTIVE = -1;
            $scope.BudgetSearch.PAGE_NO = 1;
        }
        else if (FLAG == undefined) {
            if ($scope.BudgetSearch.CLICK_SEARCH == 1)
                ModelObj.ACTIVE = $scope.BudgetSearch.ACTIVE == -1 ? -1 : $scope.BudgetSearch.ACTIVE ? 1 : 0;
            else {
                ModelObj.ACTIVE = -1;
            }
        }

        ModelObj.ENTITY_ID = $scope.BudgetSearch.ENTITY_ID;
        ModelObj.START_DATE = $scope.BudgetSearch.START_DATE;
        ModelObj.END_DATE = $scope.BudgetSearch.END_DATE;
        ModelObj.BRANCH_ID = $scope.BudgetSearch.BRANCH_ID;
        ModelObj.CATEGORY_NAME = $scope.BudgetSearch.CATEGORY_NAME;
        ModelObj.PAGE_NO = $scope.BudgetSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.BudgetSearch.PAGE_SIZE;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGETS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BudgetSearch.VIEW_BRANCH_BUDGETS = $scope.BudgetSearch.VIEW_BRANCH_BUDGETS.concat(data.data.Table);
                if (data.data.Table.length < $scope.BudgetSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.BudgetSearch.PAGE_NO = parseInt($scope.BudgetSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.BudgetSearch.VIEW_BRANCH_BUDGETS.length == 0) {
                }
                $scope.GetData = false;
            }
        });
    };
    $scope.RESET = function () {
        $scope.BudgetSearch = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOGO_PATH: '',
            CUSTOMER_ID: '',
            UploadedFiles: [],
            USER_ID: '',
            FILE_NAME: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            ORIGINAL_FILE_NAME: '',
            SERVER_FILE_NAME: '',
            BRANCH_BUDGET_LOG: null,
            START_DATE: null,
            END_DATE: null,
            SAMPLE_EXCEL_FILE: null,
            VIEW_BRANCH_BUDGETS: [],
            LOG_PAGE_NO: 1,
            LOG_PAGE_SIZE: 10
        };
        $scope.GET_BRANCH_BUDGETS(2);
        $scope.GET_BRANCH_BUDGET_LOGS(2);
        $scope.BRANCH_LIST_VIEW = [];
        $scope.BRANCH_LIST = [];
        document.getElementById('uploadExcel1').value = '';
        $scope.BUDGET_INVALID_EXCLE_CELL_COUNT = null;
        $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = true;
        $scope.BRANCH_BUDGETS = [];
    };
    $scope.RESET_VIEW = function () {
        $scope.BudgetSearch = {
            ENTITY_ID: null,
            BRANCH_ID: null,
            LOGO_PATH: '',
            CUSTOMER_ID: '',
            UploadedFiles: [],
            USER_ID: '',
            FILE_NAME: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CLICK_SEARCH: 0,
            UPL_FILE_FLAG: 1,
            ORIGINAL_FILE_NAME: '',
            SERVER_FILE_NAME: '',
            BRANCH_BUDGET_LOG: null,
            START_DATE: null,
            END_DATE: null,
            SAMPLE_EXCEL_FILE: null,
            VIEW_BRANCH_BUDGETS: [],
            LOG_PAGE_NO: 1,
            LOG_PAGE_SIZE: 10
        };
        $scope.GET_BRANCH_BUDGETS(2);
        //$scope.GET_BRANCH_BUDGET_LOGS(2);
        $scope.BRANCH_LIST_VIEW = [];
        $scope.BRANCH_LIST = [];
        //document.getElementById('uploadExcel1').value = '';
        //$scope.INVALID_EXCLE_CELL_COUNT = null;
        //$scope.INVALID_EXCLE_CELL_FLAG = true;
    };
    $scope.ADMIN_GET_BRANCH_VIEW = function (param) {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = $scope.BudgetSearch.ENTITY_ID;
        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 0;
        ModelObj.PAGE_SIZE = 0;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        if (ModelObj.ENTITY_ID != null && ModelObj.ENTITY_ID != undefined) {
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {

                if (data.data.Table.length > 0) {
                    $scope.BRANCH_LIST_VIEW = [];
                    $scope.BRANCH_LIST_VIEW = data.data.Table;
                }
                else
                    $scope.BRANCH_LIST_VIEW = [];
            });
        }
        else { $scope.BRANCH_LIST_VIEW = null; }
    };
    $scope.RESET_BUTTON_SETUP = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = null;
        $scope.INVALID_EXCLE_CELL_FLAG = true;
        $scope.INVALID_EXCLE_CELL_COUNT = null;
    };
});
// CCModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));;