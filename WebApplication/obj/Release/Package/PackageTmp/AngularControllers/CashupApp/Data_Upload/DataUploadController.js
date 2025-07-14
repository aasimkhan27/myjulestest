app.controller('DataUploadController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = true;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(1);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.UPLOAD_MASTER_LIST = [];
    $scope.DataUpload_Search = {
        BRANCH_ID: null,
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        USER_ID: $cookies.get("USERID"),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        CUSTOM_DDL_UPLOAD_TYPE: $scope.$parent.DD_DEFAULT_TEXT,
        DD_DEFAULT_TEXT: $scope.$parent.DD_DEFAULT_TEXT,
       
    }
  
    $scope.UPLOAD_MASTER_DDL_LIST = [];
    $scope.CASHUP_DATA_UPLOAD_LIST = [];
    $scope.SELECTED_DDL_UPLOAD_MASTER_Fn = function (_upload, _main_upload) {
        if (_upload == '') {
            _main_upload.CUSTOM_DDL_UPLOAD_TYPE = $scope.DataUpload_Search.DD_DEFAULT_TEXT;
            _main_upload.CASHUP_DATA_UPLOAD_MASTER_ID = "";
        }
        else {
            _main_upload.CUSTOM_DDL_UPLOAD_TYPE = _upload.DATA_UPLOAD_TYPE;
            _main_upload.CASHUP_DATA_UPLOAD_MASTER_ID = _upload.CASHUP_DATA_UPLOAD_MASTER_ID;
            _main_upload.DATA_UPLOAD_TYPE = _upload.DATA_UPLOAD_TYPE;

        }
    }
    $scope.nginit_upload_data = function (_upload) {
        if (_upload.CASHUP_DATA_UPLOAD_MASTER_ID != null) {
            _upload.IS_ENABLED = true;
        }
        
        if ((_upload.CUSTOM_DDL_UPLOAD_TYPE == undefined || _upload.CUSTOM_DDL_UPLOAD_TYPE == "" || _upload.CUSTOM_DDL_UPLOAD_TYPE == null) && (_upload.DATA_UPLOAD_TYPE == '' || _upload.DATA_UPLOAD_TYPE == undefined || _upload.DATA_UPLOAD_TYPE == null)) {
            _upload.CUSTOM_DDL_UPLOAD_TYPE = $scope.DataUpload_Search.DD_DEFAULT_TEXT;
        }
        else if (_upload.DATA_UPLOAD_TYPE != '' && _upload.DATA_UPLOAD_TYPE != undefined && _upload.DATA_UPLOAD_TYPE != null) {
            _upload.CUSTOM_DDL_UPLOAD_TYPE = _upload.DATA_UPLOAD_TYPE;
        };
    }
   
    $scope.GET_CASHUP_SETTING_DATA_UPLOAD = function () {
        $scope.CASHUP_DATA_UPLOAD_LIST = [];
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.DataUpload_Search.ENTITY_ID;
        CommonObj.CUSTOMER_ID = $scope.DataUpload_Search.CUSTOMER_ID;        
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_SETTING_DATA_UPLOAD').then(function (data) {
            if (data.data.Table.length > 0) {
                var FLAG = false;
                if ($scope.BRANCH_LIST.length != data.data.Table.length) {
                    FLAG = true;
                }
                if (FLAG) {
                    $scope.BRANCH_LIST.forEach(branch => {
                        let found = data.data.Table.find(item => item.BRANCH_ID === branch.BRANCH_ID);

                        if (found) {
                            $scope.CASHUP_DATA_UPLOAD_LIST.push(found);
                        } else {
                            let temp = {
                                CASHUP_DATA_UPLOAD_ID: 0,
                                BRANCH_ID: branch.BRANCH_ID,
                                BRANCH_NAME: branch.BRANCH_NAME,
                                DATA_UPLOAD_TYPE: '',
                                CASHUP_DATA_UPLOAD_MASTER_ID: null
                            };
                            $scope.CASHUP_DATA_UPLOAD_LIST.push(temp);
                        }
                    });

                } else {
                    $scope.CASHUP_DATA_UPLOAD_LIST = data.data.Table;
                }              
               
            }
            else {
                
                angular.forEach($scope.BRANCH_LIST, function (_branch) {
                    var temp = { ID: 0, BRANCH_ID: _branch.BRANCH_ID, BRANCH_NAME: _branch.BRANCH_NAME, DATA_UPLOAD_TYPE: '', CASHUP_DATA_UPLOAD_MASTER_ID: null};
                    $scope.CASHUP_DATA_UPLOAD_LIST.push(temp);
                });
            }
        });

    };
    $scope.GET_CASHUP_SETTING_DATA_UPLOAD_MASTER = function () {
        CommonObj = new Object();        
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_SETTING_DATA_UPLOAD_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.UPLOAD_MASTER_DDL_LIST = data.data.Table;
            }
            else {
                $scope.UPLOAD_MASTER_DDL_LIST =  [];
            }
            
            $scope.GET_CASHUP_SETTING_DATA_UPLOAD();
        });

    };
    var commObj = new Object();
    commObj.CUSTOMER_ID = $scope.DataUpload_Search.CUSTOMER_ID;
    commObj.ENTITY_ID = $scope.DataUpload_Search.ENTITY_ID;

    PrcCommMethods.HUMANRESOURCE_API(commObj, 'ADMIN_GET_BRANCH_LIST').then(function (data) {
        $scope.BRANCH_LIST = data.data.Table;
        $scope.GET_CASHUP_SETTING_DATA_UPLOAD_MASTER();
    });

    $scope.SET_UPLOAD_DDL = function (_upload) {
        if (_upload.IS_ENABLED == true) {
            _upload.IS_ENABLED = false;
            
        }
    }
  
    $scope.INS_UPD_CASHUP_SETTING_DATA_UPLOAD = function () {
        $scope.Data_upload_form.submitted = true;
        if ($scope.Data_upload_form.$valid) {
            CashupAppObj = new Object();
            CashupAppObj.CASHUP_SETTING_DATA_UPLOAD = [];
            angular.forEach($scope.CASHUP_DATA_UPLOAD_LIST, function (_upload) {
                var uploadSettingObj = new Object();
                uploadSettingObj.CASHUP_DATA_UPLOAD_ID = _upload.CASHUP_DATA_UPLOAD_ID == undefined  ? 0 : _upload.CASHUP_DATA_UPLOAD_ID;
                uploadSettingObj.CASHUP_DATA_UPLOAD_MASTER_ID =( _upload.CASHUP_DATA_UPLOAD_MASTER_ID == '' || _upload.CASHUP_DATA_UPLOAD_MASTER_ID == null || _upload.CASHUP_DATA_UPLOAD_MASTER_ID == undefined )? null : _upload.CASHUP_DATA_UPLOAD_MASTER_ID;
                uploadSettingObj.BRANCH_ID = _upload.BRANCH_ID;
                CashupAppObj.CASHUP_SETTING_DATA_UPLOAD.push(uploadSettingObj);
            });
            CashupAppObj.ENTITY_ID = $scope.DataUpload_Search.ENTITY_ID;
            CashupAppObj.CUSTOMER_ID = $scope.DataUpload_Search.CUSTOMER_ID;
            CashupAppObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.CASHUP_APP_API(CashupAppObj, 'INS_UPD_CASHUP_SETTING_DATA_UPLOAD').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Saved successfully', 3000);
                    $scope.GET_CASHUP_SETTING_DATA_UPLOAD();

                }
                if (data.data == 0) {
                      $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });


        }
    }
    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
});