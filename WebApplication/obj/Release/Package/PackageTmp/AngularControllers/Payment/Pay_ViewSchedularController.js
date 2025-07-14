app.controller('Pay_ViewSchedularController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== Vender/Supplier List =====================================
    $scope.COMMON_CODE_CHANGE();
    $scope.SCHEDULES_LIST = [];
    //$scope.BRANCH_LIST = [];
    var startDate;
    var endDate;
    $scope.PaymentSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    }
    $scope.$parent.overlay_loadingNew = 'block';
    function reportrange(startDate, endDate) {
        $scope.PaymentSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.PaymentSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        startDate = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
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
    $scope.loader = 1;
    //$scope.LAZY_GET_REQUEST_SCHEDULES_LIST = function () {
    //    $scope.GET_PYMNT_REQUEST_SCHEDULES();
    //};

    $scope.GET_PYMNT_REQUEST_SCHEDULES = function (FLAG) {

        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.MANUALIST = [];
            $scope.PaymentSearch.PAGE_NO = 1;
        }
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.PaymentSearch.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = $scope.PaymentSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.PaymentSearch.PAGE_SIZE;
        PaymentModelObj.SCHEDULE_FREQUENCY = $scope.PaymentSearch.SCHEDULE_FREQUENCY;
        PaymentModelObj.CATEGORY_ID = $scope.PaymentSearch.CATEGORY_ID;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.START_DATE = $scope.PaymentSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.PaymentSearch.START_DATE;//$scope.START_DATE == undefined ?null : $scope.START_DATE; 
        PaymentModelObj.END_DATE = $scope.PaymentSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.PaymentSearch.END_DATE;//$scope.END_DATE == undefined ? null : $scope.END_DATE; ; 
        PaymentModelObj.REQUEST_TYPE_ID = $scope.PaymentSearch.REQUEST_TYPE_ID;
        PaymentModelObj.SUPPLIER_NAME = $scope.PaymentSearch.SUPPLIER_NAME;
        //  PaymentModelObj.EMAIL = $scope.PaymentSearch.EMAIL;
         
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_REQUEST_SCHEDULES').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                //$scope.SCHEDULES_LIST = $scope.SCHEDULES_LIST.concat(data.data.Table);
                $scope.SCHEDULES_LIST = data.data.Table;
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
                $scope.SCHEDULES_LIST = [];
            }
            $scope.$parent.overlay_loadingNew = 'none';


        })
    }
    $scope.GET_PYMNT_REQUEST_SCHEDULES(1);
    //$scope.SupID = null;
   
    //====================== Schedular Request ==================================
    $scope.SetValues = function (Supplier, IndexVal) {

        angular.forEach($scope.SUPPLIERLIST, function (value) {
            if (value.SUPPLIER_NAME == Supplier) {
                //Supplier.ID = value.ID;
                $scope.SUPPLIER_NAME = value.SUPPLIER_NAME;
            }
        });
    };
    $scope.GET_PYMNT_SUPPLIER = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.PaymentSearch.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIERLIST = data.data.Table;
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.SUPPLIERLIST = [];
            }
        })
    }
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
        //PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_REQUESTS_TYPE').then(function (data) {

            if (data.data != undefined) {
                $scope.REQUEST_LIST = data.data.Table;
            }
        })
    }
    $scope.GET_PYMNT_SUPPLIER();
    $scope.GET_PYMNT_CATEGORIES();
    $scope.GET_PYMNT_REQUESTS_TYPE();
    $scope.SCHEDULE_FREQUENCYLIST = [{ SCHEDULE_FREQUENCY: 1, Name: 'Daily' }, { SCHEDULE_FREQUENCY: 2, Name: 'Weekly' }
        , { SCHEDULE_FREQUENCY: 3, Name: 'Fortnightly' }, { SCHEDULE_FREQUENCY: 4, Name: 'Monthly' }];
    $scope.EDIT_SCHEDULE = function (SCHEDULE) {
        $scope.EDITSCHEDULE = SCHEDULE;
        $scope.EDITSCHEDULE.ACTIVE_DATE = $filter('date')($scope.EDITSCHEDULE.ACTIVE_DATE, "MM/dd/yyyy")
        $scope.EDITSCHEDULE.ACTIVE_DATE_VALID = true;
        $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY_VALID = true;
        $scope.EDITSCHEDULE.CATEGORY_ID_VALID = true;
        $scope.EDITSCHEDULE.REQUEST_TYPE_ID_VALID = true;
        $scope.EDITSCHEDULE.SUBJECT_VALID = true;
        $scope.EDITSCHEDULE.BODY_VALID = true;
        $scope.EDITSCHEDULE.EMAIL_VALID = true;
    }
    $scope.ValidateRequest_Schedule = function () {
        $scope.REQUESTSCHEDULEVALID = true;
        $scope.EDITSCHEDULE.ACTIVE_DATE_VALID = true;
        $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY_VALID = true;
        $scope.EDITSCHEDULE.CATEGORY_ID_VALID = true;
        $scope.EDITSCHEDULE.REQUEST_TYPE_ID_VALID = true;
        $scope.EDITSCHEDULE.SUBJECT_VALID = true;
        $scope.EDITSCHEDULE.BODY_VALID = true;
        $scope.EDITSCHEDULE.EMAIL_VALID = true;
        
        if ($scope.EDITSCHEDULE.ACTIVE_DATE == null || $scope.EDITSCHEDULE.ACTIVE_DATE == 0 || $scope.EDITSCHEDULE.ACTIVE_DATE == "" || $scope.EDITSCHEDULE.ACTIVE_DATE == undefined) {
            $scope.EDITSCHEDULE.ACTIVE_DATE_VALID = false;
        }
        if ($scope.EDITSCHEDULE.SCHEDULE_FREQUENCY == null || $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY == 0 || $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY == "" || $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY == undefined) {
            $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY_VALID = false;
        }
        if ($scope.EDITSCHEDULE.CATEGORY_ID == null || $scope.EDITSCHEDULE.CATEGORY_ID == undefined || $scope.EDITSCHEDULE.CATEGORY_ID == "" || $scope.EDITSCHEDULE.CATEGORY_ID == undefined) {
            $scope.EDITSCHEDULE.CATEGORY_ID_VALID = false;
        }
        if ($scope.EDITSCHEDULE.REQUEST_TYPE_ID == null || $scope.EDITSCHEDULE.REQUEST_TYPE_ID == undefined || $scope.EDITSCHEDULE.REQUEST_TYPE_ID == "" || $scope.EDITSCHEDULE.REQUEST_TYPE_ID == undefined) {
            $scope.EDITSCHEDULE.REQUEST_TYPE_ID_VALID = false;
        }
        if ($scope.EDITSCHEDULE.EMAIL == null || $scope.EDITSCHEDULE.EMAIL == 0 || $scope.EDITSCHEDULE.EMAIL == "" || $scope.EDITSCHEDULE.EMAIL == undefined) {
            $scope.EDITSCHEDULE.EMAIL_VALID = false;
        }
        if ($scope.EDITSCHEDULE.SUBJECT == null || $scope.EDITSCHEDULE.SUBJECT == undefined || $scope.EDITSCHEDULE.SUBJECT == "" || $scope.EDITSCHEDULE.SUBJECT == undefined) {
            $scope.EDITSCHEDULE.SUBJECT_VALID = false;
        }
        if ($scope.EDITSCHEDULE.BODY == null || $scope.EDITSCHEDULE.BODY == undefined || $scope.EDITSCHEDULE.BODY == "" || $scope.EDITSCHEDULE.BODY == undefined) {
            $scope.EDITSCHEDULE.BODY_VALID = false;
        }

        if (!$scope.EDITSCHEDULE.ACTIVE_DATE_VALID || !$scope.EDITSCHEDULE.SCHEDULE_FREQUENCY_VALID || !$scope.EDITSCHEDULE.CATEGORY_ID_VALID || !$scope.EDITSCHEDULE.REQUEST_TYPE_ID_VALID || !$scope.EDITSCHEDULE.SUBJECT_VALID || !$scope.EDITSCHEDULE.EMAIL_VALID  || !$scope.EDITSCHEDULE.BODY_VALID) {
            $scope.REQUESTSCHEDULEVALID = false;
        }

    }

    $scope.UPD_PYMNT_REQUEST_SCHEDULE = function () {
        
        $scope.ValidateRequest_Schedule();
        if ($scope.REQUESTSCHEDULEVALID) {
            var PaymentModelObj = new Object();
            PaymentModelObj.ID = $scope.EDITSCHEDULE.ID;
            PaymentModelObj.ACTIVE_DATE = $scope.EDITSCHEDULE.ACTIVE_DATE;
            PaymentModelObj.SCHEDULE_FREQUENCY = $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY;
            PaymentModelObj.CATEGORY_ID = $scope.EDITSCHEDULE.CATEGORY_ID;
            //PaymentModelObj.SUPPLIER_ID = $scope.EDITSCHEDULE.SUPPLIER_ID;
            // PaymentModelObj.ENTITY_ID =parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.REQUEST_TYPE_ID = $scope.EDITSCHEDULE.REQUEST_TYPE_ID;
            PaymentModelObj.SUBJECT = $scope.EDITSCHEDULE.SUBJECT;
            PaymentModelObj.BODY = $scope.EDITSCHEDULE.BODY;
            PaymentModelObj.ACTIVE = true;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.EMAIL = $scope.EDITSCHEDULE.EMAIL;

            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'UPD_PYMNT_REQUEST_SCHEDULE').then(function (data) {

                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Payment Request Schedule Updated Successfully', 3000);
                    $scope.RESETSCHEDULE();
                    $("#Edit_Schedule").modal('hide');
                    $scope.GET_PYMNT_REQUEST_SCHEDULES(1);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.RESETSCHEDULE = function () {
        $scope.EDITSCHEDULE.ID = 0;
        $scope.EDITSCHEDULE.ACTIVE_DATE = null;
        $scope.EDITSCHEDULE.SCHEDULE_FREQUENCY = null;
        $scope.EDITSCHEDULE.ENTITY_ID = 0;
      //  $scope.EDITSCHEDULE.USER_ID = 0;
        $scope.EDITSCHEDULE.SUPPLIER_ID = null;
        $scope.EDITSCHEDULE.CATEGORY_ID = null;
        $scope.EDITSCHEDULE.REQUEST_TYPE_ID = null;
        $scope.EDITSCHEDULE.SUBJECT = null;
        $scope.EDITSCHEDULE.BODY = null;
        $scope.EDITSCHEDULE.ACTIVE = true;
        $scope.EDITSCHEDULE.EMAIL = null;
    }
    $scope.RESETPAGESEARCH = function () {
        $scope.PaymentSearch.SUPPLIER_NAME = null;
        $scope.PaymentSearch.CATEGORY_ID = null;
        $scope.PaymentSearch.REQUEST_TYPE_ID = null;
        // $scope.ACTIVE_DATE = null;
        $scope.PaymentSearch.SCHEDULE_FREQUENCY = null;
        $scope.GET_PYMNT_REQUEST_SCHEDULES(1);
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
