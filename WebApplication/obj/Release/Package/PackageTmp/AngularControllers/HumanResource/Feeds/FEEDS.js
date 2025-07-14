app.controller('FEEDSController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    ///$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    $scope.HR_COMMON_CODE_Fn();
    $scope.FeedsSearch = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        USER_LOGIN_ID: $cookies.get("USERID"),
        DD_DEFAULT_TEXT: 'Choose',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        IS_MULTI_FILE_UPLOAD_ALLOW: true,
        FEEDS_ID: 0,
    };
    $scope.BlankFeedObject = {
        CUSTOMER_ID: $cookies.get("CUSTOMER_ID"),
        EMPLY_PRSNL_ID: $cookies.get("EMPLY_PRSNL_ID"),
        DD_DEFAULT_TEXT: 'Choose',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        FEEDS_ID: '',
        TITLE: '',
        FEED_TYPE_ID: '',
        COMMENTS: '',
        UPLOAD_TYPE_IDS: '',
    }
    $scope.FEED_TYPES_LIST = [
        { FEED_TYPE: 'General', FEED_TYPE_ID: 1 },
        { FEED_TYPE: 'Announcement', FEED_TYPE_ID: 2 },
        { FEED_TYPE: 'Memo', FEED_TYPE_ID: 3 }];

    if ($cookies.get("EMPLY_PRSNL_ID") == 0) {
        $scope.IS_ADD_FEED = true;
    }
    else {
        $scope.IS_ADD_FEED = $scope.CheckEmployeeAllBranchAccess('FEED_ACCESS');
    }
    $scope.FEEDS_LIST = [];

    $scope.HRM_GET_FEEDS = function (FEED_TYPE_ID) {
        $scope.FeedsSearch.FEED_TYPE_ID = FEED_TYPE_ID;
        var FeedModelObj = new Object();
        //FeedModelObj.EMPLY_PRSNL_ID = $scope.FeedsSearch.EMPLY_PRSNL_ID == 0 ? null :
        FeedModelObj.EMPLY_PRSNL_ID = $scope.FeedsSearch.EMPLY_PRSNL_ID;
        FeedModelObj.CUSTOMER_ID = $scope.FeedsSearch.CUSTOMER_ID;
        FeedModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        FeedModelObj.USER_ID = $cookies.get("USERID");
        FeedModelObj.FEED_TYPE_ID = FEED_TYPE_ID;
        FeedModelObj.PAGE_NO = $scope.FeedsSearch.PAGE_NO;
        FeedModelObj.PAGE_SIZE = $scope.FeedsSearch.PAGE_SIZE;
        PrcCommMethods.HUMANRESOURCE_API(FeedModelObj, 'HRM_GET_FEEDS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.FEEDS_LIST = data.data.Table;
                $scope.$parent.EQUALIZER();
            }
            else {
                $scope.FEEDS_LIST = [];
            }
        });
    }
    $scope.HRM_GET_FEED_BY_ID = function (_feed) {
        var FeedModelObj = new Object();
        FeedModelObj.FEEDS_ID = _feed.FEEDS_ID;
        PrcCommMethods.HUMANRESOURCE_API(FeedModelObj, 'HRM_GET_FEED_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                $('#AddNewEntires').modal('show');
                var _feed_result = data.data.Table[0];
                $scope.FeedsSearch.COMMENT = _feed_result.COMMENTS;
                $scope.FeedsSearch.TITLE = _feed_result.TITLE;
                $scope.FeedsSearch.FEED_TYPE_ID = _feed_result.FEED_TYPE_ID;
                $scope.FeedsSearch.DDL_FEED_TYPE_ID = _feed_result.FEED_TYPE_ID;
                $scope.FeedsSearch.CUSTOM_FEED_NAME = _feed_result.FEED_TYPE;
                $scope.FeedsSearch.FEEDS_ID = _feed_result.FEEDS_ID;
                $scope.FeedsSearch.UploadedFiles = _feed.UploadedFiles;

                //$scope.ADD_ROTA_BRANCH_LIST = data.data.Table1;
                //$scope.ADD_ROTA_DEPARTMENTS_LIST = data.data.Table2;
                //$scope.ADD_ROTA_POSITIONS_LIST = data.data.Table3;
                //$scope.ADD_ROTA_EMPLOYEES_LIST = data.data.Table4;
                if (data.data.Table1.length == 0) {
                    $scope.HRM_BRANCH_LIST = $scope.COPY_HRM_BRANCH_LIST;
                }
                angular.forEach(data.data.Table1, function (_loop_value) {
                    $scope.HRM_BRANCH_LIST = $scope.COPY_HRM_BRANCH_LIST.filter(function (branch) {
                        if (branch.BRANCH_ID == _loop_value.BRANCH_ID) {
                            $scope.ADD_ROTA_BRANCH_LIST.push(branch);
                        }
                        return branch.BRANCH_ID !== _loop_value.BRANCH_ID;
                    });
                });

                $scope.HRM_DEPARTMENTS_LIST = [];
                if (data.data.Table2.length == 0) {
                    $scope.HRM_DEPARTMENTS_LIST = $scope.COPY_HRM_DEPARTMENTS_LIST;
                }

                angular.forEach(data.data.Table2, function (_loop_value) {
                    $scope.HRM_DEPARTMENTS_LIST = $scope.COPY_HRM_DEPARTMENTS_LIST.filter(function (department) {
                        if (department.DEPARTMENT_ID == _loop_value.DEPARTMENT_ID) {
                            $scope.ADD_ROTA_DEPARTMENTS_LIST.push(department);
                        }
                        return department.DEPARTMENT_ID !== _loop_value.DEPARTMENT_ID;
                    });
                });
                $scope.HRM_POSITIONS_LIST = []
                if (data.data.Table3.length == 0) {
                    $scope.HRM_POSITIONS_LIST = $scope.COPY_HRM_POSITIONS_LIST;
                }
                angular.forEach(data.data.Table3, function (_loop_value) {
                    $scope.HRM_POSITIONS_LIST = $scope.COPY_HRM_POSITIONS_LIST.filter(function (position) {
                        if (position.POSITION_ID == _loop_value.POSITION_ID) {
                            $scope.ADD_ROTA_POSITIONS_LIST.push(position);
                        }
                        return position.POSITION_ID !== _loop_value.POSITION_ID;
                    });
                });
                $scope.HRM_EMPLOYTEE_LIST = [];
                if (data.data.Table4.length == 0) {
                    $scope.HRM_EMPLOYTEE_LIST = $scope.COPY_HRM_EMPLOYTEE_LIST;
                }
                angular.forEach(data.data.Table4, function (_loop_value) {
                    $scope.HRM_EMPLOYTEE_LIST = $scope.COPY_HRM_EMPLOYTEE_LIST.filter(function (employee) {
                        if (employee.EMPLY_PRSNL_ID == _loop_value.EMPLY_PRSNL_ID) {
                            $scope.ADD_ROTA_EMPLOYEES_LIST.push(employee);
                        }
                        return employee.EMPLY_PRSNL_ID !== _loop_value.EMPLY_PRSNL_ID;
                    });
                });
            }
            else {
                $scope.FEEDS_LIST = [];
            }
        });
    }

    $scope.HRM_GET_EMPLOYEE_LIST = function (FLAG, _pageload_flag) {
        $scope.EMPLOYEE_LIST = [];
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        UserModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        UserModelObj.SEARCH = "";
        UserModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        UserModelObj.USER_ID = $cookies.get("USERID");
        UserModelObj.STANDARD_ROLE_ID = $cookies.get("STANDARD_ROLE_ID");
        UserModelObj.MODULE_ID = $cookies.get("MODULE_ID");
        UserModelObj.BRANCH_IDS = "";
        UserModelObj.DEPARTMENT_IDS = "";
        UserModelObj.POSITION_IDS = "";
        UserModelObj.STATUS_ID_LIST = [];


        var readonly = new Object();
        readonly.TABLE_ID = 3; //Hired
        UserModelObj.STATUS_ID_LIST.push(readonly);

        var readonly = new Object();
        readonly.TABLE_ID = 4;// Probation
        UserModelObj.STATUS_ID_LIST.push(readonly);

        var readonly = new Object();
        readonly.TABLE_ID = 7; //Joining Soon
        UserModelObj.STATUS_ID_LIST.push(readonly);


        UserModelObj.PAGE_NO = 0;
        UserModelObj.PAGE_SIZE = 0;
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'HRM_GET_EMPLOYEE_LIST').then(function (data) {
            if (data.data.length > 0) {
                $scope.HRM_EMPLOYTEE_LIST = data.data;
                $scope.COPY_HRM_EMPLOYTEE_LIST = angular.copy(data.data);
            };
        });
    }
    $scope.HRM_GET_EMPLOYEE_LIST();
    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn = function (FLAG, _feed) {
        var UserModelObj = new Object();
        UserModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        PrcCommMethods.HUMANRESOURCE_API(UserModelObj, 'ADMIN_GET_DEPARTMENT_POSITION').then(function (data) {
            if (data.data.DEPARTMENT.length > 0) {
                $scope.HRM_DEPARTMENTS_LIST = data.data.DEPARTMENT;
                $scope.COPY_HRM_DEPARTMENTS_LIST = angular.copy(data.data.DEPARTMENT);
            }
            if (data.data.POSITION.length > 0) {
                $scope.HRM_POSITIONS_LIST = data.data.POSITION;
                $scope.COPY_HRM_POSITIONS_LIST = angular.copy(data.data.POSITION);
            }
        });
    }


    $scope.HRM_GET_USER_MANAGEMENT_ACCESS = function (FLAG, _feed) {
        var EmploymentInfoObject = new Object();
        EmploymentInfoObject.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        EmploymentInfoObject.ENTITY_ID = $cookies.get("ENTITY_ID");
        EmploymentInfoObject.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        PrcCommMethods.HUMANRESOURCE_API(EmploymentInfoObject, 'HRM_GET_USER_MANAGEMENT_ACCESS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.HRM_BRANCH_LIST = data.data.Table.filter(x => x.FEED_ACCESS == true);
                $scope.COPY_HRM_BRANCH_LIST = angular.copy($scope.HRM_BRANCH_LIST);
            }
            else if (data.data == 0) {
                $scope.HRM_BRANCH_LIST = [];
            }
        });
    };
    $scope.HRM_GET_FEEDS_STATS = function (_feed) {
        var FeedModelObj = new Object();
        FeedModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
        FeedModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
        FeedModelObj.FEEDS_ID = _feed.FEEDS_ID;
        PrcCommMethods.HUMANRESOURCE_API(FeedModelObj, 'HRM_GET_FEEDS_STATS').then(function (data) {
            if (data.data != null && data.data.Table.length > 0) {
                if (_feed.FEED_TYPE_ID == 2) {
                    $('#staticBackdrop').modal('show');
                }
                if (_feed.FEED_TYPE_ID == 3) {
                    $('#MemoBackdrop').modal('show');
                }
                $scope.FEEDS_STATS_LIST = data.data.Table;
            } else {
                $scope.FEEDS_STATS_LIST = [];
                //$scope.$parent.ShowAlertBox('error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
    $scope.ng_initemployee = function (_employee, LAST_FLAG) {
        _employee.EMPLOYEE_NAME = _employee.FIRST_NAME + " " + _employee.LAST_NAME;
        _employee.SHORT_NAME = $scope.TextReturn(_employee.EMPLOYEE_NAME);
    }


    $scope.HRM_GET_FEEDS($scope.FEED_TYPES_LIST[0].FEED_TYPE_ID);

    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
    $scope.ACCEPTED_SHOW = true;
    $scope.ACCEPTED_Fn = function () {
        $scope.ACCEPTED_SHOW = !$scope.ACCEPTED_SHOW;
    }
    $scope.REJECTED_Fn = function () {
        $scope.REJECTED_SHOW = !$scope.REJECTED_SHOW;
    }
    $scope.YET_TO_VIEW_Fn = function () {
        $scope.YET_TO_VIEW_SHOW = !$scope.YET_TO_VIEW_SHOW;
    }
    $scope.ACKNOWLEDGED_Fn = function () {
        $scope.ACKNOWLEDGED_SHOW = !$scope.ACKNOWLEDGED_SHOW;
    }

    $scope.YET_TO_ACKNOWLEDGED_Fn = function () {
        $scope.YET_TO_ACKNOWLEDGED = !$scope.YET_TO_ACKNOWLEDGED;
    }
    $scope.nginitfeeds = function (_feed) {
        _feed.NAME = $scope.$parent.TextReturn(_feed.FIRST_NAME);

        $scope.$parent.GET_UPLOADS(_feed, 51, _feed.FEEDS_ID);
    }

    $scope.IS_IMAGE_Fn = function (fileName) {
        return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
    };

    $scope.ADD_ROTA_BRANCH_LIST = [];
    $scope.ADD_ROTA_DEPARTMENTS_LIST = [];
    $scope.ADD_ROTA_POSITIONS_LIST = [];
    $scope.ADD_ROTA_EMPLOYEES_LIST = [];
    // Accept ROTA as Clock-in/out time
    $scope.ADD_ROTA_BRANCH_Fn = function (_branch) {
        $scope.rotaBranchSearch = '';
        $scope.ADD_ROTA_BRANCH_LIST.push(angular.copy(_branch));
        $scope.HRM_BRANCH_LIST = $scope.HRM_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
    };
    $scope.REMOVE_ROTA_BRANCH_Fn = function (_branch) {
        $scope.HRM_BRANCH_LIST.push(angular.copy(_branch));
        $scope.ADD_ROTA_BRANCH_LIST = $scope.ADD_ROTA_BRANCH_LIST.filter(function (item) {
            return item !== _branch;
        });
    };
    $scope.ADD_ROTA_DEPARTMENTS_Fn = function (_department) {
        $scope.rotaDepartmentSearch = '';
        $scope.ADD_ROTA_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.HRM_DEPARTMENTS_LIST = $scope.HRM_DEPARTMENTS_LIST.filter(function (item) {
            return item !== _department;
        });
    };
    $scope.REMOVE_ROTA_DEPARTMENTS_Fn = function (_department) {
        $scope.HRM_DEPARTMENTS_LIST.push(angular.copy(_department));
        $scope.ADD_ROTA_DEPARTMENTS_LIST = $scope.ADD_ROTA_DEPARTMENTS_LIST.filter(function (item) {
            return item !== _department;
        });
    };
    $scope.ADD_ROTA_POSITIONS_Fn = function (_position) {
        $scope.rotaPositionSearch = '';
        $scope.ADD_ROTA_POSITIONS_LIST.push(angular.copy(_position));
        $scope.HRM_POSITIONS_LIST = $scope.HRM_POSITIONS_LIST.filter(function (position) {
            return position !== _position;
        });
    };
    $scope.REMOVE_ROTA_POSITIONS_Fn = function (_postition) {
        $scope.HRM_POSITIONS_LIST.push(angular.copy(_postition));
        $scope.ADD_ROTA_POSITIONS_LIST = $scope.ADD_ROTA_POSITIONS_LIST.filter(function (position) {
            return position !== _postition;
        });
    };
    $scope.ADD_ROTA_EMPLOYEE_Fn = function (_employee) {
        $scope.rotaEmployeeSearch = '';
        $scope.ADD_ROTA_EMPLOYEES_LIST.push(angular.copy(_employee));
        $scope.HRM_EMPLOYTEE_LIST = $scope.HRM_EMPLOYTEE_LIST.filter(function (item) {
            return item !== _employee;
        });
    };
    $scope.REMOVE_ROTA_EMPLOYEE_Fn = function (_employee) {
        $scope.HRM_EMPLOYTEE_LIST.push(angular.copy(_employee));
        $scope.ADD_ROTA_EMPLOYEES_LIST = $scope.ADD_ROTA_EMPLOYEES_LIST.filter(function (item) {
            return item !== _employee;
        });
        $scope.INS_UPD_CUSTOMER_SETTINGS(anyDataExistsInDDList(3), 63, '', 4, 1, _employee.EMPLY_PRSNL_ID, _employee.TABLE_ID);
    };

    $scope.SELECTED_FEEDS_Fn = function (_feed) {
        if (_feed == '') {
            $scope.FeedsSearch.CUSTOM_FEED_NAME = $scope.FeedsSearch.DD_DEFAULT_TEXT;
            $scope.FeedsSearch.DDL_FEED_TYPE_ID = '';
        }
        else {
            $scope.FeedsSearch.CUSTOM_FEED_NAME = _feed.FEED_TYPE;
            $scope.FeedsSearch.DDL_FEED_TYPE_ID = _feed.FEED_TYPE_ID;
        }
    }

    $scope.SELECTED_FEEDS_Fn('');
    $scope.SET_DROPSCROLL = function () {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper w-100');
        $('.AddCustomScroll_Contact').find('.dropdown-menu li').addClass('p-2');
    }
    $scope.POP_FEED_STATS_Fn = function (_feed) {
        $scope.HRM_GET_FEEDS_STATS(_feed);

    }
    $scope.POP_EDIT_FEED_STATS_Fn = function (_feed) {
        $scope.FeedsSearch.FEEDS_ID = "";
        $scope.FeedsSearch.TITLE = "";
        $scope.FeedsSearch.COMMENT = "";
        $scope.ADD_ROTA_BRANCH_LIST = [];
        $scope.ADD_ROTA_DEPARTMENTS_LIST = [];
        $scope.ADD_ROTA_POSITIONS_LIST = [];
        $scope.ADD_ROTA_EMPLOYEES_LIST = [];
        $scope.FeedsSearch.UploadedFiles = [];
        $scope.HRM_GET_FEED_BY_ID(_feed);
        $scope.rotaEmployeeSearch = "";
        $scope.FEEDS_FORM.submitted = false;
    }

    $scope.ADD_NEW_ENTIRES_Fn = function (_feed) {
        $scope.FeedsSearch.FEEDS_ID = "";
        $scope.FeedsSearch.TITLE = "";
        $scope.FeedsSearch.COMMENT = "";
        $scope.SELECTED_FEEDS_Fn('');
        $scope.ADD_ROTA_BRANCH_LIST = [];
        $scope.ADD_ROTA_DEPARTMENTS_LIST = [];
        $scope.ADD_ROTA_POSITIONS_LIST = [];
        $scope.ADD_ROTA_EMPLOYEES_LIST = [];
        $scope.FeedsSearch.UploadedFiles = [];
        $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
        $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
        $scope.rotaEmployeeSearch = "";
        $scope.FEEDS_FORM.submitted = false;
        $('#AddNewEntires').modal('show');
    }
    $scope.RESET_FEEDS = function () {
        //if ($scope.FeedsSearch.UploadedFiles.length > 0) {
        //    angular.forEach($scope.FeedsSearch.UploadedFiles, function (item, index) {
        //        $scope.$parent.HRM_DELETE_UPLOAD_FILE($scope.FeedsSearch.UploadedFiles, item, index, 1, false);
        //    });
        //}
        $scope.FeedsSearch.FEEDS_ID = "";
        $scope.FeedsSearch.TITLE = "";
        $scope.FeedsSearch.COMMENT = "";
        $scope.SELECTED_FEEDS_Fn('');
        $scope.ADD_ROTA_BRANCH_LIST = [];
        $scope.ADD_ROTA_DEPARTMENTS_LIST = [];
        $scope.ADD_ROTA_POSITIONS_LIST = [];
        $scope.ADD_ROTA_EMPLOYEES_LIST = [];
        $scope.FeedsSearch.UploadedFiles = [];
        $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
        $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
        $scope.rotaEmployeeSearch = "";
        $scope.FEEDS_FORM.submitted = false;
    }
    $scope.HRM_INS_UPD_FEEDS = function () {
        $scope.FEEDS_FORM.submitted = true;
        if ($scope.FEEDS_FORM.$valid) {
            var FeedModelObj = new Object();
            FeedModelObj.FEEDS_ID = $scope.FeedsSearch.FEEDS_ID;
            FeedModelObj.TITLE = $scope.FeedsSearch.TITLE;
            FeedModelObj.FEED_TYPE_ID = $scope.FeedsSearch.DDL_FEED_TYPE_ID;
            FeedModelObj.COMMENTS = $scope.FeedsSearch.COMMENT;
            FeedModelObj.CUSTOMER_ID = $cookies.get("CUSTOMER_ID");
            FeedModelObj.ENTITY_ID = $cookies.get("ENTITY_ID");
            FeedModelObj.ACTIVE = 1;
            FeedModelObj.USER_ID = $cookies.get("USERID");
            FeedModelObj.UPLOAD_TYPE_IDS = "";
            FeedModelObj.BRANCH_TYPE = [];
            FeedModelObj.DEPARTMENTS_TYPE = [];
            FeedModelObj.POSITIONS_TYPE = [];
            FeedModelObj.EMPLOYEES_TYPE = [];

            angular.forEach($scope.FeedsSearch.UploadedFiles, function (_loop_value) {
                if (FeedModelObj.UPLOAD_TYPE_IDS == "") {
                    FeedModelObj.UPLOAD_TYPE_IDS = _loop_value.ID;
                }
                else {
                    FeedModelObj.UPLOAD_TYPE_IDS = FeedModelObj.UPLOAD_TYPE_IDS + "," + _loop_value.ID;
                };
            });

            var BlankObj = new Object();
            BlankObj.TABLE_ID = 0;

            angular.forEach($scope.ADD_ROTA_BRANCH_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.BRANCH_ID;
                FeedModelObj.BRANCH_TYPE.push(readonly);
            });
            angular.forEach($scope.ADD_ROTA_DEPARTMENTS_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.DEPARTMENT_ID;
                FeedModelObj.DEPARTMENTS_TYPE.push(readonly);
            });
            angular.forEach($scope.ADD_ROTA_POSITIONS_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.POSITION_ID;
                FeedModelObj.POSITIONS_TYPE.push(readonly);
            });
            angular.forEach($scope.ADD_ROTA_EMPLOYEES_LIST, function (_loop_value) {
                var readonly = new Object();
                readonly.TABLE_ID = _loop_value.EMPLY_PRSNL_ID;
                FeedModelObj.EMPLOYEES_TYPE.push(readonly);
            });

            if (FeedModelObj.BRANCH_TYPE.length == 0) {
                FeedModelObj.BRANCH_TYPE.push(BlankObj);
            }
            if (FeedModelObj.DEPARTMENTS_TYPE.length == 0) {
                FeedModelObj.DEPARTMENTS_TYPE.push(BlankObj);
            }
            if (FeedModelObj.POSITIONS_TYPE.length == 0) {
                FeedModelObj.POSITIONS_TYPE.push(BlankObj);
            }
            if (FeedModelObj.EMPLOYEES_TYPE.length == 0) {
                FeedModelObj.EMPLOYEES_TYPE.push(BlankObj);
            }
            PrcCommMethods.HUMANRESOURCE_API(FeedModelObj, 'HRM_INS_UPD_FEEDS').then(function (data) {
                if (data.data > 0) {
                    $scope.$parent.ShowAlertBox("Success", 'Save successfully', 3000);
                    $scope.HRM_GET_FEEDS($scope.FeedsSearch.DDL_FEED_TYPE_ID);
                    $('#AddNewEntires').modal('hide');
                    $scope.HRM_GET_USER_MANAGEMENT_ACCESS();
                    $scope.ADMIN_GET_DEPARTMENT_POSITION_Fn();
                    $scope.RESET_FEEDS();



                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }

    $scope.HRM_INS_UPD_FEEDS_STATUS = function (_status_change, _feed) {
        var FeedModelObj = new Object();
        FeedModelObj.FEEDS_ID = _feed.FEEDS_ID;
        FeedModelObj.EMPLY_PRSNL_ID = $cookies.get("EMPLY_PRSNL_ID");
        FeedModelObj.STATUS_ID = _status_change;
        FeedModelObj.USER_ID = $cookies.get("USERID");
        PrcCommMethods.HUMANRESOURCE_API(FeedModelObj, 'HRM_INS_UPD_FEEDS_STATUS').then(function (data) {
            if (data.data > 0) {
                $scope.$parent.ShowAlertBox("Success", 'save successfully', 3000);
                $scope.HRM_GET_FEEDS(_feed.FEED_TYPE_ID);

            }
            if (data.data == 0) {
                $scope.$parent.ShowAlertBox("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.DELETE_FILE_UPLOAD_Fn = function (array, line, index) {
        const input = document.getElementById('FEED_ID');
        if (array.UploadedFiles.length > 1) {
            input.title = '';
        } else {
            input.title = 'No file choosen';
        }
        $scope.$parent.HRM_DELETE_UPLOAD_FILE(array, line, index);
    };

});