app.controller('Pay_RequestController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //====================== Request List =====================================
    $scope.MANUALIST = [];
    // $scope.REQUESTList = { ID: 0, TYPE_NAME:''};
    var startDate;
    var endDate;
    $scope.COMMON_CODE_CHANGE();
    $scope.RequestSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ACTIVE: 1,
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    };
    $scope.$parent.overlay_loadingNew = 'block';
    function reportrange(startDate, endDate) {
        $scope.RequestSearch.START_DATE = startDate.format($scope.$parent.Datelocaleformat.format);
        $scope.RequestSearch.END_DATE = endDate.format($scope.$parent.Datelocaleformat.format);
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
    $scope.LAZY_GET_REQUEST_LIST = function () {
        $scope.GET_PYMNT_MANUAL_REQUEST();
    };
    //  $scope.Msg = '';
    $scope.GET_PYMNT_MANUAL_REQUEST = function (FLAG) {
         
        var PaymentModelObj = new Object();
        if (FLAG == 1) {
            $scope.MANUALIST = [];
            $scope.RequestSearch.PAGE_NO = 1;
        }

        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.RequestSearch.BRANCH_LOGIN_ID;
        PaymentModelObj.SUPPLIER_NAME = $scope.RequestSearch.SUPPLIER_NAME == undefined ? null : $scope.RequestSearch.SUPPLIER_NAME;
        PaymentModelObj.START_DATE = $scope.RequestSearch.START_DATE == undefined ? moment().startOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.RequestSearch.START_DATE;//$scope.START_DATE == undefined ?null : $scope.START_DATE; 
        PaymentModelObj.END_DATE = $scope.RequestSearch.END_DATE == undefined ? moment().endOf('month').format($scope.$parent.Datelocaleformat.format) : $scope.RequestSearch.END_DATE;//$scope.END_DATE == undefined ? null : $scope.END_DATE; ; 
        PaymentModelObj.REQUEST_TYPE_ID = $scope.RequestSearch.REQUEST_TYPE_ID == undefined ? null : $scope.RequestSearch.REQUEST_TYPE_ID;;
        PaymentModelObj.PAGE_NO = $scope.RequestSearch.PAGE_NO;
        PaymentModelObj.PAGE_SIZE = $scope.RequestSearch.PAGE_SIZE;
        PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PaymentModelObj.STATUS_IDS = $scope.RequestSearch.STATUS_IDS == undefined ? null : $scope.RequestSearch.STATUS_IDS;//35,36
         
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_MANUAL_REQUEST').then(function (data) {

            if (data.data.Table.length > 0) {
                $scope.MANUALIST = $scope.MANUALIST.concat(data.data.Table);

                if (data.data.Table.length < $scope.RequestSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.RequestSearch.PAGE_NO = parseInt($scope.RequestSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                //  $scope.Msg = "Record Not Found.";
                $scope.GetData = false;
            }
            $scope.SUPPLIER_ID_VALID = true;
            $scope.REQUEST_TYPE_ID_VALID = true;
            $scope.EMAIL_VALID = true;
            $scope.SUBJECT_VALID = true;
            $scope.BODY_VALID = true;
            $scope.$parent.overlay_loadingNew = 'none';
        })
    }
    $scope.GET_PYMNT_MANUAL_REQUEST(1);
    //====================== Manual Request ==================================
    $scope.MANUAL = {
        BRANCH_LOGIN_ID: parseInt($cookies.get("BRANCH_ID")),
    };

    $scope.SetValues = function (Supplier, IndexVal) {
         
        angular.forEach($scope.SUPPLIERList, function (value) {
            if (value.SUPPLIER_NAME == Supplier) {
                //Supplier.ID = value.ID;
                $scope.SUPPLIER_NAME = value.SUPPLIER_NAME;
            }

        });
    };
    $scope.GET_PYMNT_SUPPLIER = function () {

        var PaymentModelObj = new Object();
        PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PaymentModelObj.BRANCH_LOGIN_ID = $scope.MANUAL.BRANCH_LOGIN_ID;
        PaymentModelObj.PAGE_NO = 0;
        PaymentModelObj.PAGE_SIZE = 0;
        PaymentModelObj.SUPPLIER_NAME = null;
        PaymentModelObj.FLAG = 1;
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_SUPPLIER').then(function (data) {
            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.SUPPLIERList = data.data.Table;
                $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            } else {
                $scope.SUPPLIERList = [];
            }
        })
    }
    $scope.GET_PYMNT_REQUESTS_TYPE = function () {

        var PaymentModelObj = new Object();
        //PaymentModelObj.ENTITY_ID =parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.PAYMENT_API(PaymentModelObj, 'GET_PYMNT_REQUESTS_TYPE').then(function (data) {

            if (data.data != undefined && data.data.Table.length > 0) {
                $scope.REQUESTList = data.data.Table;
            } else {
                $scope.REQUESTList = [];
            }
        })
    }
    $scope.GET_PYMNT_SUPPLIER();
    $scope.GET_PYMNT_REQUESTS_TYPE();
    $scope.VALIDATEREQUEST = function () {
        $scope.REQUESTVALID = true;
        $scope.SUPPLIER_ID_VALID = true;
        $scope.REQUEST_TYPE_ID_VALID = true;
        $scope.EMAIL_VALID = true;
        $scope.SUBJECT_VALID = true;
        $scope.BODY_VALID = true;
        if ($scope.SUPPLIER_ID == null || $scope.SUPPLIER_ID == 0 || $scope.SUPPLIER_ID == "") {
            $scope.SUPPLIER_ID_VALID = false;
        }
        if ($scope.REQUEST_TYPE_ID == null || $scope.REQUEST_TYPE_ID == 0 || $scope.REQUEST_TYPE_ID == "") {
            $scope.REQUEST_TYPE_ID_VALID = false;
        }
        if ($scope.EMAIL == null || $scope.EMAIL == undefined || $scope.EMAIL == "") {
            $scope.EMAIL_VALID = false;
        }
        if ($scope.SUBJECT == null || $scope.SUBJECT == undefined || $scope.SUBJECT == "") {
            $scope.SUBJECT_VALID = false;
        }
        if ($scope.BODY == null || $scope.BODY == undefined || $scope.BODY == "") {
            $scope.BODY_VALID = false;
        }

        if (!$scope.SUPPLIER_ID_VALID || !$scope.REQUEST_TYPE_ID_VALID || !$scope.EMAIL_VALID || !$scope.SUBJECT_VALID || !$scope.BODY_VALID) {
            $scope.REQUESTVALID = false;
        }

    }
    $scope.INS_UPD_PYMNT_REQUESTS = function () {
        $scope.VALIDATEREQUEST();
        if ($scope.REQUESTVALID) {
            var PaymentModelObj = new Object();
            PaymentModelObj.ID = 0;
            PaymentModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            PaymentModelObj.BRANCH_LOGIN_ID = $scope.MANUAL.BRANCH_LOGIN_ID;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.SUPPLIER_ID = $scope.SUPPLIER_ID;
            PaymentModelObj.STATEMENT_DATE = $scope.STATEMENT_DATE;
            PaymentModelObj.REQUEST_TYPE_ID = $scope.REQUEST_TYPE_ID;
            PaymentModelObj.EMAIL = $scope.EMAIL;
            PaymentModelObj.SUBJECT = $scope.SUBJECT;
            PaymentModelObj.BODY = $scope.BODY;
            PaymentModelObj.ACTIVE = true;
            PaymentModelObj.IS_MANUAL = true;
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'INS_UPD_PYMNT_REQUESTS').then(function (data) {

                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Request Send Successfully', 3000);
                    $scope.RESETMANUAL();
                    $scope.GET_PYMNT_MANUAL_REQUEST(1);
                    $("#Manual_Statement").modal('hide');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
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
    $scope.RESETMANUAL = function () {
         
        $scope.ID = 0;
        $scope.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        //$scope.USER_ID = 0;
        $scope.SUPPLIER_ID = null;
        $scope.STATEMENT_DATE = null;
        $scope.REQUEST_TYPE_ID = null;
        $scope.EMAIL = null;
        $scope.SUBJECT = null;
        $scope.BODY = null;
        $scope.ACTIVE = true;
        $scope.IS_MANUAL = true;
        $scope.MANUAL.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));

    }
   
    $scope.RESETPAGESEARCH = function () {
        $scope.RequestSearch.SUPPLIER_NAME = null;
        $scope.RequestSearch.REQUEST_TYPE_ID = null;
        $scope.RequestSearch.STATUS_IDS = null;
        $scope.RequestSearch.BRANCH_LOGIN_ID = parseInt($cookies.get("BRANCH_ID"));
        $scope.GET_PYMNT_MANUAL_REQUEST(1);
    }
    //============================Close Request ==============================
    $scope.VIEW_CLOSE_REQUEST = function (Req) {
        $scope.REQUEST_ID = Req.ID;
        $scope.COMMENTS_VALID = true;
        $("#Close_Request").modal('show');
    }
    $scope.VALIDATECLOSEREQUEST = function () {
        $scope.CLOSEVALID = true;
        $scope.COMMENTS_VALID = true;
        if ($scope.COMMENTS == null || $scope.COMMENTS == 0 || $scope.COMMENTS == "" || $scope.COMMENTS == undefined) {
            $scope.COMMENTS_VALID = false;
        }
        if (!$scope.COMMENTS_VALID) {
            $scope.CLOSEVALID = false;
        }
    }
    $scope.CLOSE_PYMNT_REQUESTS = function () {
        $scope.VALIDATECLOSEREQUEST()
        if ($scope.CLOSEVALID) {

            var PaymentModelObj = new Object();
            PaymentModelObj.REQUEST_TYPE_ID = $scope.REQUEST_ID;
            PaymentModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PaymentModelObj.COMMENTS = $scope.COMMENTS;
            PrcCommMethods.PAYMENT_API(PaymentModelObj, 'CLOSE_PYMNT_REQUESTS').then(function (data) {

                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", 'Close Payment Successfully', 3000);
                    $scope.GET_PYMNT_MANUAL_REQUEST(1);
                    $("#Close_Request").modal('hide');
                    $scope.COMMENTS = null;
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }

    }

});