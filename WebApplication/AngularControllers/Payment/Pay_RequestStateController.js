app.controller('Pay_RequestStateController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== Vender/Supplier List =====================================
    $scope.COMMON_CODE_CHANGE();
    $scope.VENDOR_LIST = [];
    $scope.SearchSupplier = [];
    $scope.PaymentSearch = {
        IS_CHECKED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        IS_VALID: false,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    }
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.LAZY_GET_REQUESTSTATEMENT_LIST = function () {
        $scope.GET_PYMNT_SUPPLIER();
    };
    $scope.INIT_SUPPLIER_TAG_DETAILS = function (Tag_Line) {

        if (Tag_Line.ID != 0) {
            if (Tag_Line.TagNameList == undefined) {
                Tag_Line.TagNameList = [];
            }
            if (Tag_Line.TAGS != "" && Tag_Line.TAGS != null) {

                var Array = (Tag_Line.TAGS != "") ? Tag_Line.TAGS.split(':;:') : [];
                if (Array.length > 0) {
                    // Tag_Line.TagNameList.push(Array);
                    Tag_Line.TagNameList = Array;
                }
            }
        }
    };
    $scope.GET_PYMNT_SUPPLIER = function (FLAG) {

        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.VENDOR_LIST = [];
            $scope.PaymentSearch.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.PaymentSearch.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = $scope.PaymentSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.PaymentSearch.PAGE_SIZE;
        PaymentModelObj.SUPPLIER_NAME = $scope.PaymentSearch.SUPPLIER_NAME;
        PaymentModelObj.TAG_NAME = $scope.PaymentSearch.TAG_NAME;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {

                $scope.VENDOR_LIST = $scope.VENDOR_LIST.concat(data.data.Table);
                if ($scope.SearchSupplier.length > 0) {
                    angular.forEach($scope.SearchSupplier, function (val) {
                        $scope.VENDOR_LIST.push(val);
                    })

                }
                if (data.data.Table.length < $scope.PaymentSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.PaymentSearch.PAGE_NO = parseInt($scope.PaymentSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                $scope.GetData = false;
                $scope.VENDOR_LIST = [];
            }
            $scope.$parent.overlay_loadingNew = 'none';
        })
    }
    $scope.GET_PYMNT_SUPPLIER(1);

    $scope.SetValues = function (Supplier) {
        $scope.SearchSupplier = [];
        angular.forEach($scope.VENDOR_LIST, function (item) {
            if (item.IS_CHECKED == true) {
                $scope.SearchSupplier.push(item);
            }
        });
        angular.forEach($scope.SUPPLIER_LIST, function (value) {
            if (value.SUPPLIER_NAME == Supplier) {
                //Supplier.ID = value.ID;
                $scope.SUPPLIER_NAME = value.SUPPLIER_NAME;
            }
        });

    };
    $scope.SupID = null;
    $scope.SET_DATA = function () {
        //Vendor.IS_CHECKED = 1;
        angular.forEach($scope.VENDOR_LIST, function (val) {
            val.IS_CHECKED = $scope.PaymentSearch.IS_CHECKED;
        })

    }
    $scope.SET_LINEDATA = function () {

        $scope.PaymentSearch.IS_CHECKED = true;
        for (var i = 0; i < $scope.VENDOR_LIST.length; i++) {
            if (!$scope.VENDOR_LIST[i].IS_CHECKED) {
                $scope.PaymentSearch.IS_CHECKED = false;
                break;
            }
        }

    }
    //====================== Schedular Request ==================================
    $scope.SCHEDULE = {
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID"))
    };
    $scope.GET_PYMNT_SUPPLIER_SEARCH = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.SCHEDULE.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIER_LIST = data.data.Table;
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.SUPPLIER_LIST = [];
            }
        })
    }
    $scope.SCHEDULE_FREQUENCYLIST = [{ SCHEDULE_FREQUENCY: 1, Name: 'Daily' }, { SCHEDULE_FREQUENCY: 2, Name: 'Weekly' }
        , { SCHEDULE_FREQUENCY: 3, Name: 'Fortnightly' }, { SCHEDULE_FREQUENCY: 4, Name: 'Monthly' }];
    $scope.GET_PYMNT_CATEGORIES = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_CATEGORIES').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.CATEGORY_LIST = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_REQUESTS_TYPE = function () {

        var PaymentModelObj = new Object();
        //PaymentModelObj.ENTITY_ID =parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_REQUESTS_TYPE').then(function (data) {

            if (data.data != undefined) {
                $scope.REQUEST_LIST = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_SUPPLIER_SEARCH();
    $scope.GET_PYMNT_CATEGORIES();
    $scope.GET_PYMNT_REQUESTS_TYPE();
    $scope.ValidSchedule = true;
    $scope.VALID_SCHEDULECLICK = function () {
        // angular.forEach($scope.VENDOR_LIST, function (VItem) {
        for (var i = 0; i < $scope.VENDOR_LIST.length; i++) {
            if ($scope.VENDOR_LIST[i].IS_CHECKED) {
                $scope.ValidSchedule = false;
                break;
            }
        }
        // })
        if ($scope.ValidSchedule) {
            alert("Please check atleast one supplier.");
        } else {
            $scope.ACTIVE_DATE_VALID = true;
            $scope.SCHEDULE_FREQUENCY_VALID = true;
            $scope.CATEGORY_ID_VALID = true;
            $scope.REQUEST_TYPE_ID_VALID = true;
            $scope.SUBJECT_VALID = true;
            $scope.BODY_VALID = true;
            angular.forEach($scope.VENDOR_LIST, function (Y) {
                if (Y.IS_CHECKED) {
                    Y.EMAIL_VALID = true;
                }
            });
            //$scope.EMAIL_VALID = true;
            $("#Schedule_Statement").modal('show');
        }

    }
    $scope.VALIDATEREQUEST_STATE = function () {
        $scope.REQUESTSCHEDULEVALID = true;
        $scope.ACTIVE_DATE_VALID = true;
        $scope.SCHEDULE_FREQUENCY_VALID = true;
        $scope.CATEGORY_ID_VALID = true;
        $scope.REQUEST_TYPE_ID_VALID = true;
        $scope.SUBJECT_VALID = true;
        $scope.BODY_VALID = true;
        //$scope.EMAIL_VALID = true;
        if ($scope.ACTIVE_DATE == null || $scope.ACTIVE_DATE == 0 || $scope.ACTIVE_DATE == "" || $scope.ACTIVE_DATE == undefined) {
            $scope.ACTIVE_DATE_VALID = false;
        }
        if ($scope.SCHEDULE_FREQUENCY == null || $scope.SCHEDULE_FREQUENCY == 0 || $scope.SCHEDULE_FREQUENCY == "" || $scope.SCHEDULE_FREQUENCY == undefined) {
            $scope.SCHEDULE_FREQUENCY_VALID = false;
        }
        if ($scope.CATEGORY_ID == null || $scope.CATEGORY_ID == undefined || $scope.CATEGORY_ID == "" || $scope.CATEGORY_ID == undefined) {
            $scope.CATEGORY_ID_VALID = false;
        }
        if ($scope.REQUEST_TYPE_ID == null || $scope.REQUEST_TYPE_ID == undefined || $scope.REQUEST_TYPE_ID == "" || $scope.REQUEST_TYPE_ID == undefined) {
            $scope.REQUEST_TYPE_ID_VALID = false;
        }
        //if ($scope.EMAIL == null || $scope.EMAIL == 0 || $scope.EMAIL == "" || $scope.EMAIL == undefined) {
        //    $scope.EMAIL_VALID = false;
        //}
        if ($scope.SUBJECT == null || $scope.SUBJECT == undefined || $scope.SUBJECT == "" || $scope.SUBJECT == undefined) {
            $scope.SUBJECT_VALID = false;
        }
        if ($scope.BODY == null || $scope.BODY == undefined || $scope.BODY == "" || $scope.BODY == undefined) {
            $scope.BODY_VALID = false;
        }
        angular.forEach($scope.VENDOR_LIST, function (Y) {
           
            Y.EMAIL_VALID = true;
            if (Y.IS_CHECKED) {
                //if ((Y.EMAILADDRESS != null && Y.EMAILADDRESS != "")) {
                if ((Y.EMAILADDRESS == "" || Y.EMAILADDRESS==null)) {
                    Y.EMAIL_VALID = false;
                }
            }
            if (!Y.EMAIL_VALID) {
                $scope.REQUESTSCHEDULEVALID  = false;
            }

        });
        if (!$scope.ACTIVE_DATE_VALID || !$scope.SCHEDULE_FREQUENCY_VALID || !$scope.CATEGORY_ID_VALID || !$scope.REQUEST_TYPE_ID_VALID|| !$scope.SUBJECT_VALID || !$scope.BODY_VALID) {
            $scope.REQUESTSCHEDULEVALID = false;
        }

    }

    $scope.INS_PYMNT_REQUEST_SCHEDULE = function () {
        $scope.VALIDATEREQUEST_STATE();
        if ($scope.REQUESTSCHEDULEVALID) {
            $scope.CheckedSupID = "";
            $scope.CheckVendorList = [];
            angular.forEach($scope.VENDOR_LIST, function (VItem) {
                if (VItem.IS_CHECKED) {
                   // $scope.CheckedSupID = $scope.CheckedSupID == "" ? VItem.ID : $scope.CheckedSupID + "," + VItem.ID;
                    // $scope.CheckedSupID += VItem.ID + ",";
                    $scope.CheckVendorList.push({ SUPPLIER_ID: VItem.ID, EMAIL: VItem.EMAILADDRESS  });
                }
            })
           
            var PaymentModelObj = new Object();
            PaymentModelObj.ACTIVE_DATE = $scope.ACTIVE_DATE;
            PaymentModelObj.SCHEDULE_FREQUENCY = $scope.SCHEDULE_FREQUENCY;
            PaymentModelObj.CATEGORY_ID = $scope.CATEGORY_ID;
            //PaymentModelObj.SUPPLIER_ID_Schedular = $scope.CheckedSupID;
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_LOGIN_ID = $scope.SCHEDULE.BRANCH_LOGIN_ID;
            PaymentModelObj.REQUEST_TYPE_ID = $scope.REQUEST_TYPE_ID;
            PaymentModelObj.SUBJECT = $scope.SUBJECT;
            PaymentModelObj.BODY = $scope.BODY;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.ACTIVE = true;
            PaymentModelObj.PYMNT_REQUEST_SCHEDULE_SUPPLIER_LIST = $scope.CheckVendorList;
             

            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_PYMNT_REQUEST_SCHEDULE').then(function (data) {

                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Request Schedule Send Successfully', 3000);
                    $scope.RESETSCHEDULE();
                    $("#Schedule_Statement").modal('hide');
                    $scope.GET_PYMNT_SUPPLIER(1);
                    angular.forEach($scope.VENDOR_LIST, function (val) {
                        val.IS_CHECKED = false;
                    })
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.RESETSCHEDULE = function () {
        $scope.ID = 0;
        $scope.ACTIVE_DATE = null;
        $scope.SCHEDULE_FREQUENCY = null;
        $scope.ENTITY_ID = 0;
        //$scope.USER_ID = 0;
        $scope.SUPPLIER_ID = null;
        $scope.CATEGORY_ID = null;
        $scope.REQUEST_TYPE_ID = null;
        $scope.SUBJECT = null;
        $scope.BODY = null;
        $scope.ACTIVE = true;
        //$scope.EMAIL = NULL;
        $scope.SCHEDULE.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));

    }
    $scope.RESETPAGESEARCH = function () {

        $scope.PaymentSearch.SUPPLIER_NAME = null;
        $scope.PaymentSearch.TAG_NAME = null;
        $scope.PaymentSearch.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $scope.SearchSupplier = [];
        $scope.GET_PYMNT_SUPPLIER(1);

    }

    ///////////////////ADD TAGS////////////////////////////////
    $scope.TAGS = {
        BRANCH_LOGIN_ID : parseInt($cookies.get("BRANCH_ID"))
    };
    $scope.SUPPLIER_TAG_IDS = "";
    $scope.GET_PYMNT_SUPPLIER_TAGS_MASTER = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.TAGS.BRANCH_LOGIN_ID;

        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER_TAGS_MASTER').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.TAGS_LIST = data.data.Table;

            } else {
                $scope.TAGS_LIST = [];
                $scope.SUPPLIER_TAG_IDS = "";
            }
            $scope.Tags_VALID = true;
        })
    }
    $scope.SET_TAGALL = function () {
        angular.forEach($scope.TAGS_LIST, function (val) {
            val.IS_VALID = $scope.PaymentSearch.IS_VALID;;
        })
    }
    $scope.SET_TAG_CHECKLINE = function () {

        $scope.PaymentSearch.IS_VALID = false;
        for (var i = 0; i < $scope.TAGS_LIST.length; i++) {
            if ($scope.TAGS_LIST[i].IS_VALID) {
                $scope.PaymentSearch.IS_VALID = true;
                break;
            }
        }
    }
    $scope.GET_PYMNT_SUPPLIER_TAGS_MASTER();
    $scope.SET_TAGDATA = function (Vendor) {
        $scope.SupplierId = Vendor.ID;
        angular.forEach($scope.TAGS_LIST, function (TItem) {
            TItem.IS_VALID = false;
            // $scope.SUPPLIER_TAG_IDS = $scope.SUPPLIER_TAG_IDS == "" ? TItem.TAG_ID : $scope.SUPPLIER_TAG_IDS + "," + TItem.TAG_ID;
        })

        if (Vendor.TAG_IDS != null) {
            var VTagId = [];
            VTagId = Vendor.TAG_IDS.split(',');
            angular.forEach(VTagId, function (val) {
                for (var i = 0; i < $scope.TAGS_LIST.length; i++) {
                    if (parseInt(val) == $scope.TAGS_LIST[i].TAG_ID) {
                        $scope.TAGS_LIST[i].IS_VALID = true;
                        break;
                    }
                }

            })
        }
        $("#Add_tags").modal('show');
    }
    $scope.NEW_SUPPLIERTAGS = [];
    $scope.VALIDATETAGS = function () {
        $scope.TAGVALID = true;
        $scope.Tags_VALID = true;
        if ($scope.Tags == null || $scope.Tags == 0 || $scope.Tags == "" || $scope.Tags == undefined) {
            $scope.Tags_VALID = false;
        }
        if (!$scope.Tags_VALID) {
            $scope.TAGVALID = false;
        }
    }
    $scope.ADD_NEW_SUPPLIERTAGS = function () {
        $scope.VALIDATETAGS();
        if ($scope.TAGVALID) {
            var Flag = true;
            angular.forEach($scope.TAGS_LIST, function (val) {
                if (val.TAG == $scope.Tags) {
                    $scope.$parent.ShowAlert("Warning", 'Same tag name present in taglist.Please change the name.', 3000);
                    // alert("Same tag name present in taglist.Please change the name.");
                    Flag = false;
                }
            })
            if (Flag) {
                $scope.NEW_SUPPLIERTAGS.push({ TAG: $scope.Tags, IS_VALID: true });
                $scope.TAGS_LIST.push({ TAG_ID: 0, TAG: $scope.Tags, IS_VALID: true });
            }
            $scope.Tags = null;
        }
    }
    $scope.UPD_SUPPLIER_TAGS = function () {

        $scope.SUPPLIER_TAG_IDS = "";
        angular.forEach($scope.TAGS_LIST, function (TItem) {
            if (TItem.IS_VALID && TItem.TAG_ID != 0) {
                $scope.SUPPLIER_TAG_IDS = $scope.SUPPLIER_TAG_IDS == "" ? TItem.TAG_ID : $scope.SUPPLIER_TAG_IDS + "," + TItem.TAG_ID;
            }

        })

        $scope.NEW_SUPPLIER_TAGS = "";
        angular.forEach($scope.NEW_SUPPLIERTAGS, function (NItem) {
            if (NItem.IS_VALID) {
                $scope.NEW_SUPPLIER_TAGS = $scope.NEW_SUPPLIER_TAGS == "" ? NItem.TAG : $scope.NEW_SUPPLIER_TAGS + ":;:" + NItem.TAG;
            }
        })
        var PaymentModelObj = new Object();
        PaymentModelObj.SUPPLIER_ID = $scope.SupplierId;
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.TAGS.BRANCH_LOGIN_ID;
        PaymentModelObj.SUPPLIER_TAG_IDS = $scope.SUPPLIER_TAG_IDS == "" ? null : $scope.SUPPLIER_TAG_IDS;
        PaymentModelObj.NEW_SUPPLIER_TAGS = $scope.NEW_SUPPLIER_TAGS == "" ? null : $scope.NEW_SUPPLIER_TAGS;
        //  PaymentModelObj.NEW_SUPPLIER_TAGS = $scope.NEW_SUPPLIER_TAGS;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
         
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'UPD_SUPPLIER_TAGS').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", 'Add Tags Successfully', 3000);
                $("#Add_tags").modal('hide');
                $scope.GET_PYMNT_SUPPLIER(1);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }




    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = "00:00";
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.TODAY_DATE = new Date(data.data).toISOString();
            var Arr = { TODAY_DATE: $scope.TODAY_DATE }
            $scope.$parent.DateInputLoadStartForm(Arr);
        });
    };
    $scope.GET_UTC_TIME();


});
