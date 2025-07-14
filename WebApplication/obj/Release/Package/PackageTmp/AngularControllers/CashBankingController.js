app.controller('CashBankinglistController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, readFileDataNew) {
    debugger;
    $scope.$parent.overlay_loadingNew = 'block';
    $scope.CashBankingSearch = {
        STATUS_IDS: '',
        BRANCH_ID: null,     
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        FROM_DATE: null,
        TO_DATE: null,
        EPOS_CASH: 0,
        OVERLAPPING:null,
        BANKABLE_CASH: 0,
        VARIANCE: null,
        BRANCH_ID_VALID:true,
        FROM_DATE_VALID :true,
        TO_DATE_VALID: true,       
        COMMENTS_VALID: true,
        COMMENTS: null,
        EPOS_VARIANCE:0
       
    };
   
    $scope.BANKING_CASHUP_RESET = function () {
        //$scope.$parent.overlay_loadingNew = 'block';
        $scope.CashBankingSearch = {
            ID: 0,
          //  STATUS_IDS: '',
            BRANCH_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            FROM_DATE: null,
            TO_DATE:null,
            EPOS_CASH: 0,
            OVERLAPPING: null,
            BANKABLE_CASH: 0,
            VARIANCE: null,
            BRANCH_ID_VALID: true,
            FROM_DATE_VALID: true,
            TO_DATE_VALID: true,           
            COMMENTS_VALID: true,
            COMMENTS: null,
            EPOS_VARIANCE:0
        };
        $scope.BANKINGLIST = [];
        $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
        $scope.DELETE_CASH_BANKING_DETAILS = [];
        $scope.ACTUALVALID = true;
        $scope.GET_CASH_BANKING_LIST(1, 4, false);

    };
    $scope.BANKING_CASHUP_RESET_ALL = function () {
        
        if ($scope.BANKINGLIST.length > 0) {
            angular.forEach($scope.BANKINGLIST, function (val) {
                if (val.BANKED_AMOUNT != 0 && val.BANKED_AMOUNT != null && val.BANKED_AMOUNT != '') {
                    $scope.DELETE_CASH_BANKING_DETAILS.push(val);
                }
            });
            $scope.BANKINGLIST = [];
            $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
        }
        $scope.CashBankingSearch.VARIANCE = $scope.CashBankingSearch.BANKABLE_CASH; 
        $scope.CashBankingSearch.COMMENTS = null;
    };
    $scope.CASH_BANKING_LIST_LAZY_LOAD = function () {
        $scope.GET_CASH_BANKING_LIST(2, $scope.SORT_COLUMN_NO, $scope.SORT_ORDER_NO_ASCDESC);
    }
     
    var USER_ID = parseInt($cookies.get("USERID"));
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), USER_ID,1).then(function (data) {
        $scope.BRANCH_LIST = data;
       // $scope.BRANCH_ID = parseInt(data[0].BRANCH_ID);
      //  $scope.GET_ENTITY_STAFF();
     //   $scope.GET_CASH_BANKING_LIST(1, 4, false);
    });
   

    //$scope.GET_BRANCH_LIST = function () {         
    //    var CashupModelObj = new Object();
    //    CashupModelObj.ENTITY_ID = parseFloat($cookies.get("ENTITY_ID"));   
    //    CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
    //    PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_BRANCH_LIST').then(function (data) {             
    //        if (data != undefined && data.data != undefined && data.data.length > 0) {
    //            $scope.BRANCH_ID = parseInt(data.data[0].BRANCH_ID);
    //        }
    //        $scope.GET_ENTITY_STAFF();
    //        $scope.GET_CASH_BANKING_LIST(1, 4, false);
    //    });
    //};
    //$scope.GET_BRANCH_LIST();
    $scope.GET_CASH_BANKING_LIST = function (FLAG, SORT_COLUMN_NO, SORT_ORDER_NO_ASCDESC) {
         
        $scope.SORT_COLUMN_NO = SORT_COLUMN_NO;
        $scope.SORT_ORDER_NO_ASCDESC = SORT_ORDER_NO_ASCDESC;
        $scope.$parent.overlay_loadingNew = 'block';
        var CashupModelObj = new Object();
        if (FLAG == 1) {
            $scope.CASH_BANKING_LIST = [];
            $scope.CashBankingSearch.PAGE_NO = 1;
        }
      // $scope.$parent.overlay_loading_coffee = 'block';
        CashupModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
        CashupModelObj.FROM_DATE = $scope.CashBankingSearch.FROM_DATE;
        CashupModelObj.TO_DATE = $scope.CashBankingSearch.TO_DATE;
        CashupModelObj.STATUS_IDS = $scope.CashBankingSearch.STATUS_IDS;
        CashupModelObj.BRANCH_IDS = $scope.CashBankingSearch.BRANCH_ID; //parseInt($scope.BRANCH_ID);
        CashupModelObj.PAGE_NO = $scope.CashBankingSearch.PAGE_NO;
        CashupModelObj.PAGE_SIZE = $scope.CashBankingSearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASH_BANKING_LIST').then(function (data) {
             
            if (data.data != undefined &&  data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.CASH_BANKING_LIST = $scope.CASH_BANKING_LIST.concat(data.data.Table);
              //  $scope.BRANCH_ID = parseInt($scope.CASH_BANKING_LIST[0].BRANCH_ID);
                if (data.data.Table.length < $scope.CashBankingSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.CashBankingSearch.PAGE_NO = parseInt($scope.CashBankingSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                $scope.GetData = false;
               //$scope.$parent.ShowAlert("Attention", "Data not found.", 3000);               
                //$scope.BANKING_CASHUP_RESET();               
                //$scope.CashBankingSearch.FROM_DATE = null;
                //$scope.CashBankingSearch.TO_DATE = null;
                //$scope.CashBankingSearch.STATUS_IDS = null;

            }
          
            $scope.$parent.overlay_loading_coffee = 'none';
        });
    };
  
    $scope.GET_CASH_BANKING_LIST(1, 4, false);
    //==================================Upper section code =====================
    $scope.SetEndCompleteDate = function () {
         
        if (($scope.CashBankingSearch.FROM_DATE != undefined && $scope.CashBankingSearch.FROM_DATE != '' && $scope.CashBankingSearch.FROM_DATE != null) && ($scope.CashBankingSearch.TO_DATE != undefined && $scope.CashBankingSearch.TO_DATE != '' && $scope.CashBankingSearch.TO_DATE != null)) {
            if (new Date($scope.CashBankingSearch.TO_DATE) < new Date($scope.CashBankingSearch.FROM_DATE)) {
                $scope.ShowAlert('Error', '"To Date" cannot be less than "From Date"', 3000);
                $scope.CashBankingSearch.TO_DATE = '';
                $scope.CashBankingSearch.EPOS_CASH = 0;
                $scope.CashBankingSearch.EPOS_VARIANCE = 0;
            } else {
                $scope.GET_OVERLAPPING_CASH_BANKING_ENTRIES();
            }
        };       
    };
    $scope.SetEndCompleteDate_Deposite = function (BNK) {
        if (($scope.CashBankingSearch.TO_DATE != undefined && $scope.CashBankingSearch.TO_DATE != '' && $scope.CashBankingSearch.TO_DATE != null) && (BNK.DEPOSIT_DATE != undefined && BNK.DEPOSIT_DATE != '' && BNK.DEPOSIT_DATE != null)) {
            if (new Date(BNK.DEPOSIT_DATE) < new Date($scope.CashBankingSearch.TO_DATE)) {
                $scope.ShowAlert('Error', '"Deposit Date" cannot be less than "To Date"', 3000);
                BNK.DEPOSIT_DATE = '';

            }
        };
         
        //if (($scope.CashBankingSearch.FROM_DATE != undefined && $scope.CashBankingSearch.FROM_DATE != '' && $scope.CashBankingSearch.FROM_DATE != null) && (BNK.DEPOSIT_DATE != undefined && BNK.DEPOSIT_DATE != '' && BNK.DEPOSIT_DATE != null)) {
        //    if (new Date(BNK.DEPOSIT_DATE) < new Date($scope.CashBankingSearch.FROM_DATE)) {
        //        $scope.ShowAlert('Error', '"Deposit Date" cannot be less than "From Date"', 3000);
        //        BNK.DEPOSIT_DATE = '';                
        //    } 
        //};
    };
    $scope.GET_ENTITY_STAFF = function () {
         
        var CashupModelObj = new Object();
        CashupModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        CashupModelObj.BRANCH_ID = $scope.CashBankingSearch.BRANCH_ID;//parseInt($scope.BRANCH_ID);//$scope.BRANCH_ID == undefined ? 0 : $scope.BRANCH_ID ;//$scope.CashBankingSearch.BRANCH_ID;
        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {
             
            if (data != undefined && data.data != undefined && data.data.length > 0) {
                $scope.StaffList = data.data;
            }

        });
    };
   
    $scope.SET_DATEVALUE = function () {
         
        if ($scope.CashBankingSearch.FROM_DATE != null && $scope.CashBankingSearch.FROM_DATE != "") {
            $scope.CashBankingSearch.TO_DATE = $scope.CashBankingSearch.FROM_DATE;
        }
        if ($scope.CashBankingSearch.FROM_DATE != null && $scope.CashBankingSearch.FROM_DATE != "" && $scope.CashBankingSearch.TO_DATE != null && $scope.CashBankingSearch.TO_DATE != "") {
            $scope.GET_OVERLAPPING_CASH_BANKING_ENTRIES();
        }
    }
    $scope.GET_OVERLAPPING_CASH_BANKING_ENTRIES = function () {
         
        if ($scope.CashBankingSearch.FROM_DATE != null && $scope.CashBankingSearch.FROM_DATE != "" && $scope.CashBankingSearch.TO_DATE != null && $scope.CashBankingSearch.TO_DATE != "") {
            // $scope.$parent.overlay_loading_coffee = 'block';
             
            var CashupModelObj = new Object();
            CashupModelObj.BRANCH_ID = $scope.CashBankingSearch.BRANCH_ID;// $scope.BRANCH_ID == undefined ? 0 : $scope.BRANCH_ID;//$scope.BRANCH_ID;//$scope.CashBankingSearch.BRANCH_ID;            
            CashupModelObj.FROM_DATE = $scope.CashBankingSearch.FROM_DATE;
            CashupModelObj.TO_DATE = $scope.CashBankingSearch.TO_DATE;          
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_OVERLAPPING_CASH_BANKING_ENTRIES').then(function (data) {
                 
                if (data.data != undefined && data.data.Table.length > 0) {
                    $scope.CashBankingSearch.OVERLAPPING = data.data.Table;                  
                    $scope.CashBankingSearch.EPOS_CASH = 0;
                    $scope.CashBankingSearch.EPOS_VARIANCE = 0;
                    $scope.$parent.ShowAlert("Attention", "Entry already exist for these date's.", 3000);                   
                    $scope.BANKING_CASHUP_RESET();
                    
                } else {
                    $scope.CashBankingSearch.OVERLAPPING = null;
                    $scope.GET_CASH_BANKING_DETAILS_BY_ID();
                }
              
            });
         
        }
    }
    $scope.GET_CASH_BANKING_DETAILS_BY_ID = function () {
        if ($scope.CashBankingSearch.FROM_DATE != null && $scope.CashBankingSearch.FROM_DATE != "" && $scope.CashBankingSearch.TO_DATE != null && $scope.CashBankingSearch.TO_DATE != "") {
            //$scope.$parent.overlay_loading_coffee = 'block';
             
            var CashupModelObj = new Object();
            CashupModelObj.BANKING_HEADER_ID = 0;
            CashupModelObj.FROM_DATE = $scope.CashBankingSearch.FROM_DATE;
            CashupModelObj.TO_DATE = $scope.CashBankingSearch.TO_DATE;
            CashupModelObj.BRANCH_ID = $scope.CashBankingSearch.BRANCH_ID;// $scope.BRANCH_ID == undefined ? 0 : $scope.BRANCH_ID;//$scope.BRANCH_ID;//$scope.CashBankingSearch.BRANCH_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASH_BANKING_DETAILS_BY_ID1').then(function (data) {
                 
                $scope.CashBankingSearch.EPOS_CASH = data.data.Table[0].EPOS_CASH == null ? 0 : data.data.Table[0].EPOS_CASH;               
                $scope.CashBankingSearch.BANKABLE_CASH = data.data.Table[0].BANKABLE_CASH;
                $scope.CashBankingSearch.BANKABLE_CASH_ACTUAL = data.data.Table[0].BANKABLE_CASH;
                $scope.CashBankingSearch.VARIANCE = $scope.CashBankingSearch.BANKABLE_CASH;
                $scope.CashBankingSearch.EPOS_VARIANCE = parseFloat($scope.CashBankingSearch.BANKABLE_CASH) - parseFloat($scope.CashBankingSearch.EPOS_CASH);
               
            });

        }
    }
    $scope.SET_VARINCE = function () {
         
        $scope.CashBankingSearch.VARIANCE = parseFloat($scope.CashBankingSearch.BANKABLE_CASH == "" ? 0 : $scope.CashBankingSearch.BANKABLE_CASH);
        $scope.CashBankingSearch.EPOS_VARIANCE = parseFloat($scope.CashBankingSearch.BANKABLE_CASH == "" ? 0 : $scope.CashBankingSearch.BANKABLE_CASH) - parseFloat($scope.CashBankingSearch.EPOS_CASH);
       
     
    }
    
    $scope.SET_VARIENCELIST = function (val) {
        $scope.Flag = true;
        var VarianceHold = 0;
        VarianceHold = $scope.CashBankingSearch.VARIANCE;
        $scope.CashBankingSearch.VARIANCE = (parseFloat($scope.CashBankingSearch.VARIANCE).toFixed(2)) - parseFloat((val.BANKED_AMOUNT == null || val.BANKED_AMOUNT == "") ? 0 : val.BANKED_AMOUNT);

      
    }
    
    $scope.CREATE_ENTRY = function () {
                 
        $scope.BANKING_CASHUP_RESET();        
        $scope.EDITFLAG = false;
        $scope.SHOWBUTTON = true;
        if ($scope.BRANCH_LIST.length > 0 && $scope.BRANCH_LIST.length == 1) {
            $scope.CashBankingSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
            $scope.GET_ENTITY_STAFF();
        } else {
            $scope.StaffList = [];
        }
        $("#Create_Entry").modal('show');
    }


    $scope.BlankCashBankingLine = { ID: 0, BANKED_AMOUNT: null, DEPOSITED_BY: null, DEPOSIT_DATE: '', BANK_SLIP: null, IS_DELETED: 0, NOTES: null, ISVALID: true, UPLOAD_IDS: "", UploadedFiles:[] };
    $scope.BANKINGLIST = [];
    $scope.DELETE_CASH_BANKING_DETAILS = [];
    $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
    $scope.DateSetUp = function () {
        var date_inputs = document.getElementsByName("datecontrol_m") //our date input has the name "date"

        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {

                var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var date = new Date();
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: "0,6",
                    autoclose: true,
                    todayHighlight: true,
                    format: 'M dd, yyyy'
                    //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                };
                date_input.datepicker(options);
            }
        };
    };
    $scope.DateSetUp();
    $scope.AddBankLine = function (val) {
         
        angular.forEach($scope.BANKINGLIST, function (val) {
            if (val.BANKED_AMOUNT != null && val.BANKED_AMOUNT != 0 && val.BANKED_AMOUNT != '' && val.DEPOSITED_BY != null && val.DEPOSIT_DATE != '' && val.BANK_SLIP != null && val.BANK_SLIP != '' && val.BANK_SLIP != 0) {
                val.ISVALID = false;
            }
        })
        $scope.Validate_Row();
        if ($scope.CASHBANKING_VALID) {
            
                var count = 0;
                angular.forEach($scope.BANKINGLIST, function (val) {
                    if ((val.BANKED_AMOUNT == null || val.BANKED_AMOUNT == '' || val.BANKED_AMOUNT == 0) && (val.DEPOSITED_BY == null || val.DEPOSITED_BY == '') && (val.DEPOSIT_DATE == '' || val.DEPOSIT_DATE == null) && (val.BANK_SLIP == null || val.BANK_SLIP == '')) {
                        count = count + 1;
                    }
                })
                if (count == 0) {
                    $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
                }
            
           
        }
    };
    $scope.DeleteLine = function (line, index) {
         
        if (line.TABLE_ID == undefined) {
            $scope.BANKINGLIST.splice(index, 1);
        }
        else {
            $scope.DELETE_CASH_BANKING_DETAILS.push(angular.copy(line));
            line.TABLE_ID = undefined;
            $scope.BANKINGLIST.splice(index, 1);
        }
        if (line.ISVALID == false) {
            $scope.CashBankingSearch.VARIANCE = (parseFloat($scope.CashBankingSearch.VARIANCE) + parseFloat((line.BANKED_AMOUNT == null || line.BANKED_AMOUNT == "") ? 0 : line.BANKED_AMOUNT));
        }
         
        angular.forEach($scope.BANKINGLIST, function (BNK) {
            if (BNK.BANKED_AMOUNT != 0 && BNK.BANKED_AMOUNT != null && BNK.BANKED_AMOUNT != '' && BNK.ISVALID == true) {               
                BNK.ISVALID = false;
            }
        });
      
        if ($scope.BANKINGLIST.length == 0 ) {
            $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
        }
        var count = 0;
        angular.forEach($scope.BANKINGLIST, function (val) {
            if ((val.BANKED_AMOUNT == null || val.BANKED_AMOUNT == '' || val.BANKED_AMOUNT == 0) && val.ISVALID==true) {
                count = count + 1;
            }
        })
        if ($scope.CashBankingSearch.VARIANCE != 0 && count == 0) {
            $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
        }

    };
    $scope.ACTUALVALID = true;
    $scope.ValidControls = function (x) {
        x.BANKED_AMOUNT_VALID = true;
        x.DEPOSITED_BY_VALID = true;
        x.DEPOSIT_DATE_VALID = true;
        x.BANK_SLIP_VALID = true;
    }
    $scope.Validate_Row = function () {
        $scope.ACTUALVALID = true;      
        $scope.CASHBANKING_VALID = true;
        angular.forEach($scope.BANKINGLIST, function (x) {
            x.BANKED_AMOUNT_VALID = true;
            x.DEPOSITED_BY_VALID = true;
            x.DEPOSIT_DATE_VALID = true;
            x.BANK_SLIP_VALID = true;
            if (((x.BANKED_AMOUNT != null || x.BANKED_AMOUNT != "" || x.BANKED_AMOUNT != 0) && (x.DEPOSITED_BY != null || x.DEPOSITED_BY != "") && (x.DEPOSIT_DATE != null || x.DEPOSIT_DATE != "") || (x.BANK_SLIP != null && x.BANK_SLIP != "")) && (x.IS_DELETED == 0)) {
                if (x.BANKED_AMOUNT == null || x.BANKED_AMOUNT == undefined || x.BANKED_AMOUNT == "" || x.BANKED_AMOUNT==0) {
                    x.BANKED_AMOUNT_VALID = false;
                }
                if (x.DEPOSITED_BY == null || x.DEPOSITED_BY == 0 || x.DEPOSITED_BY == "") {
                    x.DEPOSITED_BY_VALID = false;
                }
                if (x.DEPOSIT_DATE == null || x.DEPOSIT_DATE == 0 || x.DEPOSIT_DATE == "") {
                    x.DEPOSIT_DATE_VALID = false;
                }
                if (x.BANK_SLIP == null || x.BANK_SLIP == 0 || x.BANK_SLIP == "") {
                    x.BANK_SLIP_VALID = false;
                }
            }

            if (!x.BANKED_AMOUNT_VALID || !x.DEPOSITED_BY_VALID || !x.DEPOSIT_DATE_VALID || !x.BANK_SLIP_VALID) {
                $scope.CASHBANKING_VALID = false;
            }
        });

        if (!$scope.CASHBANKING_VALID) {
            $scope.ACTUALVALID = false;
        }
    }
    $scope.Validate = function () {
        $scope.ACTUALVALID = true;
         
        $scope.CASHBANKING_SINGLEVALID = true;
        $scope.CashBankingSearch.BRANCH_ID_VALID = true;
        $scope.CashBankingSearch.FROM_DATE_VALID = true;
        $scope.CashBankingSearch.TO_DATE_VALID = true;
       // $scope.CashBankingSearch.BANKABLE_CASH_VALID = true;
        $scope.CashBankingSearch.COMMENTS_VALID = true;
        //$scope.CashBankingSearch.FROM_DATE = true;
        if ($scope.CashBankingSearch.BRANCH_ID == null || $scope.CashBankingSearch.BRANCH_ID == 0 || $scope.CashBankingSearch.BRANCH_ID == "") {
            $scope.CashBankingSearch.BRANCH_ID_VALID = false;
        }
        if ($scope.CashBankingSearch.FROM_DATE == null || $scope.CashBankingSearch.FROM_DATE == 0 || $scope.CashBankingSearch.FROM_DATE == "") {
            $scope.CashBankingSearch.FROM_DATE_VALID= false;
        }
        if ($scope.CashBankingSearch.TO_DATE == null || $scope.CashBankingSearch.TO_DATE == 0 || $scope.CashBankingSearch.TO_DATE == "") {
            $scope.CashBankingSearch.TO_DATE_VALID = false;
        }
        //if ($scope.CashBankingSearch.BANKABLE_CASH == null ||  $scope.CashBankingSearch.BANKABLE_CASH == "") {
        //    $scope.CashBankingSearch.BANKABLE_CASH_VALID = false;
        //}
        if ($scope.CashBankingSearch.COMMENTS == null || $scope.CashBankingSearch.COMMENTS == 0 || $scope.CashBankingSearch.COMMENTS == "") {
            $scope.CashBankingSearch.COMMENTS_VALID = false;
        }
        if (!$scope.CashBankingSearch.BRANCH_ID_VALID|| !$scope.CashBankingSearch.FROM_DATE_VALID || !$scope.CashBankingSearch.TO_DATE_VALID  || !$scope.CashBankingSearch.COMMENTS_VALID) {
            $scope.CASHBANKING_SINGLEVALID = false;
        }
         $scope.CASHBANKING_VALID= true;
        angular.forEach($scope.BANKINGLIST, function (x) {
            x.BANKED_AMOUNT_VALID = true;
            x.DEPOSITED_BY_VALID = true;
            x.DEPOSIT_DATE_VALID = true;
            x.BANK_SLIP_VALID = true;    
            if (((x.BANKED_AMOUNT != null && x.BANKED_AMOUNT != "" && x.BANKED_AMOUNT != 0) || (x.DEPOSITED_BY != null && x.DEPOSITED_BY != "") || (x.DEPOSIT_DATE != null && x.DEPOSIT_DATE != "") || (x.BANK_SLIP != null && x.BANK_SLIP != "")) && (x.IS_DELETED == 0)) {

                if (x.BANKED_AMOUNT == null || x.BANKED_AMOUNT == undefined || x.BANKED_AMOUNT == "" || x.BANKED_AMOUNT == 0) {
                    x.BANKED_AMOUNT_VALID = false;
                    }
                if (x.DEPOSITED_BY == null || x.DEPOSITED_BY == 0 || x.DEPOSITED_BY == "") {
                    x.DEPOSITED_BY_VALID = false;
                    }
                if (x.DEPOSIT_DATE == null || x.DEPOSIT_DATE == 0 || x.DEPOSIT_DATE == "") {
                    x.DEPOSIT_DATE_VALID = false;
                    }
                if (x.BANK_SLIP == null || x.BANK_SLIP == 0 || x.BANK_SLIP == "") {
                    x.BANK_SLIP_VALID = false;
                    }
                }
            
            if (!x.BANKED_AMOUNT_VALID || !x.DEPOSITED_BY_VALID || !x.DEPOSIT_DATE_VALID || !x.BANK_SLIP_VALID) {
                $scope.CASHBANKING_VALID = false;
            }
        });

        if (!$scope.CASHBANKING_SINGLEVALID || !$scope.CASHBANKING_VALID) {
            $scope.ACTUALVALID = false;
        }
    }
   
    $scope.INS_UPD_CASH_BANKING_ENTRY = function (SUBMIT_FLAG) {
        $scope.BANKINGLIST.filter(function (x) {
            if (x.BANKED_AMOUNT > 0 || x.BANKED_AMOUNT == 0) {
                x.BANKED_AMOUNT = '' + x.BANKED_AMOUNT;
            }
        });
        $scope.DELETE_CASH_BANKING_DETAILS.filter(function (y) {
            if (y.BANKED_AMOUNT > 0 || y.BANKED_AMOUNT == 0) {
                y.BANKED_AMOUNT = '' + y.BANKED_AMOUNT;
            }
        });
        if (confirm('There is a Variance of ' + $scope.CashBankingSearch.VARIANCE.toFixed(2) + ', do you still want to proceed?')) { 
        $scope.Validate();
        if ($scope.ACTUALVALID) {           
             
           // $scope.$parent.overlay_loading_coffee = 'block';
            var CashupModelObj = new Object();
            CashupModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            CashupModelObj.BRANCH_ID = $scope.CashBankingSearch.BRANCH_ID;//$scope.CashBankingSearch.BRANCH_ID;
           
            CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
            CashupModelObj.BANKABLE_CASH = $scope.CashBankingSearch.BANKABLE_CASH == "" || $scope.CashBankingSearch.BANKABLE_CASH == null ? 0 : $scope.CashBankingSearch.BANKABLE_CASH;
            CashupModelObj.VARIANCE = $scope.CashBankingSearch.VARIANCE;
            CashupModelObj.BANKING_HEADER_ID = $scope.CashBankingSearch.BANKING_HEADER_ID == undefined ? 0 : $scope.CashBankingSearch.BANKING_HEADER_ID; //$scope.CashBankingSearch.BANKING_HEADER_ID;
            CashupModelObj.FROM_DATE = $scope.CashBankingSearch.FROM_DATE;
            CashupModelObj.TO_DATE = $scope.CashBankingSearch.TO_DATE;
            CashupModelObj.SUBMIT_FLAG = SUBMIT_FLAG;
            CashupModelObj.COMMENTS = $scope.CashBankingSearch.COMMENTS;
            //Save :-Go to save only SUBMIT_FLAG=0
            //Submit:-Go to InApproval SUBMIT_FLAG=1
             
            angular.forEach($scope.BANKINGLIST, function (x) {
                if (x.UploadedFiles != undefined && x.UploadedFiles.length > 0) {
                    x.UPLOAD_IDS = x.UploadedFiles[0].ID.toString() + ","; 
                    //angular.forEach(x.UploadedFiles, function (Y) {
                    //    x.UPLOAD_IDS += Y.ID.toString() + ",";   
                    //})
                             
                }
                else {
                    x.UPLOAD_IDS = "";                  
                    x.UploadedFiles = [];
                }
               
            });
            CashupModelObj.CASH_BANKING_ENTRY_TYPE = [];
            angular.forEach($scope.BANKINGLIST, function (val) {
                if (val.IS_DELETED == 0 && val.BANKED_AMOUNT != '' && val.BANKED_AMOUNT != null) {
                    var ReadonlyObj = new Object();
                    ReadonlyObj.TABLE_ID = val.TABLE_ID == undefined ? null : val.TABLE_ID;
                    ReadonlyObj.BANKED_AMOUNT = val.BANKED_AMOUNT;
                    ReadonlyObj.DEPOSIT_DATE = val.DEPOSIT_DATE;
                    ReadonlyObj.DEPOSITED_BY = val.DEPOSITED_BY;
                    ReadonlyObj.BANK_SLIP = val.BANK_SLIP;
                    ReadonlyObj.IS_DELETED = val.IS_DELETED;
                    ReadonlyObj.NOTES = val.NOTES == undefined ? null : val.NOTES;
                    ReadonlyObj.UPLOAD_IDS = (val.UPLOAD_IDS == undefined || val.UPLOAD_IDS=="") ? null : val.UPLOAD_IDS;
                    CashupModelObj.CASH_BANKING_ENTRY_TYPE.push(ReadonlyObj);
                }
            });
            angular.forEach($scope.DELETE_CASH_BANKING_DETAILS, function (val) {
                var ReadonlyObj = new Object();
                ReadonlyObj.TABLE_ID = val.TABLE_ID == undefined ? null : val.TABLE_ID;
                ReadonlyObj.BANKED_AMOUNT = val.BANKED_AMOUNT;
                ReadonlyObj.DEPOSIT_DATE = val.DEPOSIT_DATE;
                ReadonlyObj.DEPOSITED_BY = val.DEPOSITED_BY;
                ReadonlyObj.BANK_SLIP = val.BANK_SLIP;
                ReadonlyObj.IS_DELETED = 1;
                ReadonlyObj.NOTES = val.NOTES == undefined ? null : val.NOTES;
                ReadonlyObj.UPLOAD_IDS = val.UPLOAD_IDS;
                CashupModelObj.CASH_BANKING_ENTRY_TYPE.push(ReadonlyObj);
            });

            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASH_BANKING_ENTRY').then(function (data) {

                if (data.data == undefined || data.data == null || data.data == 0) {                   
                    $scope.$parent.ShowAlert("Error", "Data should be filled.", 3000);
                }
                else if (data.data == 1) {
                    if (SUBMIT_FLAG == 0) {
                        $scope.$parent.ShowAlert("Success", "save successfully", 3000);


                    }
                    if (SUBMIT_FLAG == 1) {
                        $scope.$parent.ShowAlert("Success", "submit successfully", 3000);

                    }
                    //$scope.CashBankingForm.submitted = false;
                    $location.path('Cash_Banking');
                    $scope.BANKING_CASHUP_RESET();
                    $("#Create_Entry").modal('hide');
                    // $scope.GET_CASH_BANKING_LIST(1, 4, false);
                }
                $scope.$parent.overlay_loading_coffee = 'none';
            });
           
        }
    }
      
    }
    //=============================Cash Banking Edit====================
    $scope.CASHBANKING_EDIT = function (CBL, TEMP) {
        if (TEMP == 'EDIT') {
            $scope.EDITFLAG = true;
            $scope.SHOWBUTTON = false;
            $scope.CashBankingSearch = CBL;
            $scope.CashBankingSearch.FROM_DATE = $filter('date')(new Date($scope.CashBankingSearch.FROM_DATE));  //, 'yyyy-MM-dd'
            $scope.CashBankingSearch.TO_DATE = $filter('date')(new Date($scope.CashBankingSearch.TO_DATE)); //, 'yyyy-MM-dd'
            $scope.CashBankingSearch.COMMENTS = $scope.CashBankingSearch.CASH_BANKING_COMMENTS;
            $scope.GET_ENTITY_STAFF();
            $scope.GET_CASH_BANKING_DETAILS_BY_ID1('EDIT');
        } else if(TEMP=='VIEW') {
            $scope.EDITFLAG = false;
            $scope.SHOWBUTTON = false;
            $scope.CashBankingSearch = CBL;
            $scope.CashBankingSearch.FROM_DATE = $filter('date')(new Date($scope.CashBankingSearch.FROM_DATE));  //, 'yyyy-MM-dd'
            $scope.CashBankingSearch.TO_DATE = $filter('date')(new Date($scope.CashBankingSearch.TO_DATE)); //, 'yyyy-MM-dd'
            $scope.CashBankingSearch.COMMENTS = $scope.CashBankingSearch.CASH_BANKING_COMMENTS;
            $scope.GET_ENTITY_STAFF();
            $scope.GET_CASH_BANKING_DETAILS_BY_ID1('VIEW');
        }
      
    }
    $scope.GET_CASH_BANKING_DETAILS_BY_ID1 = function (TEMP) {

       // $scope.$parent.overlay_loading_coffee = 'block';
        if ($scope.CashBankingSearch.CASH_BANKING_HEADER_ID != null && $scope.CashBankingSearch.CASH_BANKING_HEADER_ID != undefined && $scope.CashBankingSearch.CASH_BANKING_HEADER_ID!="") { 
        var CashupModelObj = new Object();
        CashupModelObj.BANKING_HEADER_ID = $scope.CashBankingSearch.CASH_BANKING_HEADER_ID;
        CashupModelObj.FROM_DATE = $scope.CashBankingSearch.FROM_DATE;
        CashupModelObj.TO_DATE = $scope.CashBankingSearch.TO_DATE;
            CashupModelObj.BRANCH_ID = $scope.CashBankingSearch.BRANCH_ID;//$scope.BRANCH_ID;//$scope.CashBankingSearch.BRANCH_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASH_BANKING_DETAILS_BY_ID1').then(function (data) {

                if (data.data != undefined || data.data != null) {
                    if (data.data.Table1.length > 0) {
                        $scope.CashBankingSearch.BANKABLE_CASH = data.data.Table1[0].BANKABLE_CASH;
                        $scope.CashBankingSearch.BANKING_HEADER_ID = data.data.Table1[0].BANKING_HEADER_ID;
                        $scope.CashBankingSearch.CASH_BANKING_STATUS = data.data.Table1[0].CASH_BANKING_STATUS;
                        $scope.CashBankingSearch.EPOS_CASH = data.data.Table1[0].EPOS_CASH;
                        $scope.CashBankingSearch.VARIANCE = data.data.Table1[0].VARIANCE;
                        $scope.CashBankingSearch.APPROVER_EMAIL = data.data.Table1[0].APPROVER_EMAIL;
                        $scope.CashBankingSearch.FROM_DATE_VALID = true;
                        $scope.CashBankingSearch.TO_DATE_VALID = true;
                        $scope.CashBankingSearch.COMMENTS_VALID = true;
                        $scope.CashBankingSearch.EPOS_VARIANCE = parseFloat($scope.CashBankingSearch.BANKABLE_CASH) - parseFloat($scope.CashBankingSearch.EPOS_CASH);
                    }
                    //if (data.data.Table2.length == 0) {
                    //}
                    if (data.data.Table2.length > 0) {
                        $scope.BANKINGLIST = data.data.Table2;
                        angular.forEach($scope.BANKINGLIST, function (val) {
                            val.DEPOSITED_BY = parseInt(val.DEPOSITED_BY);
                            val.ISVALID = false;
                        })
                    }

                    //if (data.data.Table3.length > 0) {
                    //    angular.forEach($scope.BANKINGLIST, function (Bank) {
                    //        Bank.UploadedFiles = [];
                    //        angular.forEach(data.data.Table3, function (item) {
                    //            if (item.TABLE_ID == Bank.TABLE_ID) {
                    //                //Bank.UploadedFiles.push({ FILE_NAME: item.FILE_NAME, UPLOAD_IDS: item.UPLOAD_IDS });
                    //                if (item.UPLOAD_IDS != null) {
                    //                    Bank.UploadedFiles.push(item);
                    //                }
                    //            }
                    //        })
                    //    })
                    //}

                    var count = 0;
                    angular.forEach($scope.BANKINGLIST, function (val) {
                        if ((val.BANKED_AMOUNT == null || val.BANKED_AMOUNT == '' || val.BANKED_AMOUNT == 0) && (val.BANK_SLIP == null || val.BANK_SLIP == '')) {
                            val.DEPOSIT_DATE = ''; val.TABLE_ID = undefined; val.DEPOSITED_BY = null; val.ISVALID = true;
                            count = count + 1;
                        }
                    })
                    if ($scope.CashBankingSearch.VARIANCE != 0 && count == 0 && $scope.CASH_BANKING_LIST[0].UPLOADER_FLAG == 1) {
                        $scope.BANKINGLIST.push(angular.copy($scope.BlankCashBankingLine));
                    }
                    if (TEMP == 'EDIT') {
                        $("#Create_Entry").modal('show');
                    } else if (TEMP == 'VIEW') {
                        $("#VIEW_ENTRY").modal('show');
                    }

                    $scope.$parent.overlay_loading_coffee = 'none';
                } else {
                    $scope.$parent.ShowAlert("Attention", "Data not found.", 3000);
                }
        });
        } else {
        
            $scope.CashBankingSearch.BANKABLE_CASH = $scope.CashBankingSearch.BANKABLE_CASH_ACTUAL;
    }
    };
    $scope.APP_REJ_CASH_BANKING = function (STATUS_ID) {      
        if (STATUS_ID == 10 && ($scope.CashBankingSearch.COMMENTS == '' || $scope.CashBankingSearch.COMMENTS == undefined || $scope.CashBankingSearch.COMMENTS == null)) {

        }
        else {
               // $scope.$parent.overlay_loading_coffee = 'block';
                var CashupModelObj = new Object();
                CashupModelObj.CASH_BANKING_HEADER_ID = $scope.CashBankingSearch.CASH_BANKING_HEADER_ID;
                CashupModelObj.STATUS_ID = STATUS_ID;//-- 9 APPROVED , 10 REJECTED
                CashupModelObj.COMMENTS = $scope.CashBankingSearch.COMMENTS;
                CashupModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASH_BANKING').then(function (data) {
                    if (data.data == undefined || data.data == null || data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    else if (data.data == 1) {
                        if (STATUS_ID == 9) {
                            $scope.$parent.ShowAlert("Success", "Approved successfully", 3000);
                        }
                        if (STATUS_ID == 10) {
                            $scope.$parent.ShowAlert("Success", "Rejected successfully", 3000);
                        }
                        $scope.BANKING_CASHUP_RESET();
                        $("#Create_Entry").modal('hide');
                        $location.path('Cash_Banking');
                    }
                    $scope.$parent.overlay_loading_coffee = 'none';
                });          
        }
    }
    //------------------- Upload ---------------------------------
    $scope.initcashList = function (CASH_LINE) {
        if (CASH_LINE != undefined && CASH_LINE.TABLE_ID > 0) {
            if (CASH_LINE.UploadedFiles == undefined) {
                CASH_LINE.UploadedFiles = [];
            }
            $scope.$parent.GET_UPLOADS(CASH_LINE, 27, CASH_LINE.TABLE_ID);
        }
        //if (CASH_LINE.ID != 0) {
        //    if (CASH_LINE.UploadedFiles == undefined) {
        //        CASH_LINE.UploadedFiles = [];
        //    }
        //    if (CASH_LINE.UploadedFiles.length > 0) {
        //        angular.forEach(CASH_LINE.UploadedFiles, function (val) {
        //            var FileArray = val.FILE_NAME != "" ? val.FILE_NAME.split(':;:') : [];
        //            if (FileArray.length > 0) {
        //                val.ID = val.UPLOAD_IDS;
        //                val.FILE_PATH = FileArray[0];
        //                val.SERVER_FILE_NAME = FileArray[1];
        //                val.ORIGINAL_FILE_NAME = FileArray[2];                       
        //            }
        //        })               
        //    }
        //}
    }
    $scope.getTheFilesToUploadCashBanking = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {
         
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
        var fileUpload = document.getElementById("CashBankingFile" + index);
        // var fileUpload = document.getElementById(ControlName);
       // extension = fileUpload.files[0].name;
        extension = $scope.Files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'CashBanking');
       // $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', ControlName, List, index, 'CashBanking');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {
         
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", (List.TABLE_ID == undefined || List.ID==0) ? $scope.$parent.generaterandom(12) + "" + index : List.TABLE_ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            //data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.$parent.CASHUP.CASHUP_MAIN_ID)) + '/';
            data.append("VIRTUALPATH", '/' + FolderName + '/' + $scope.CashBankingSearch.BRANCH_ID) + '/';  //Branch_Id based pe hum nekal lega 

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
                data.append("uploadedFile", $scope.Files[i]);
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

                

            });
        }
    };

    $scope.DELETE_UPLOAD_CASH_ALL = function (Array, item, index, FLAG) {
         
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                $scope.ShowAlert('Success', 'Delete success.', 5000);
            });
        }
    };
});
//app.controller('CashBankingInsUpdController', function ($scope, $http, $interval, CommService, $cookies, $filter, PrcCommMethods, $location, readFileData, $localStorage) {
//    $scope.CashEditBankingSearch = {
//        CASHUP_MAIN_ID: getUrlParameter('v', $location.absUrl()),
//        APPROVER_FLAG: getUrlParameter('A', $location.absUrl()),
//        STATUS_IDS: '',
//        BRANCH_IDS: '',
//        BRANCH_ID: getUrlParameter('B', $location.absUrl()),
//        CASHUP_DATE_START: null,
//        CASHUP_DATE_END: null,
//        PAGE_NO: 1,
//        PAGE_SIZE: 10,
//        CASH_BANKING_HEADER: {
//        }
//    };
//    $scope.CASH_BANKING_DETAILS_ARRY = {
//        TABLE_ID: undefined, BANKED_AMOUNT: null,
//        DEPOSIT_DATE: '',
//        DEPOSITED_BY: null,
//        BANK_SLIP: '',
//        IS_DELETED: 0
//    };
//    $scope.CASH_BANKING_DETAILS = [];
//    $scope.DELETE_CASH_BANKING_DETAILS = [];
//    $scope.ADD_MORE_RECORD_CASH_BANK = function () {
//        $scope.CASH_BANKING_DETAILS.push(angular.copy($scope.CASH_BANKING_DETAILS_ARRY));
//    }
//    $scope.CHECK_BANKING_ALERT = function (LINE) {
//        if ($scope.CashEditBankingSearch.CASH_BANKING_HEADER.CUSTOM_VARIANCE < 0) {
//            LINE.BANKED_AMOUNT = null;
//            $scope.$parent.ShowAlert("Error", "variance cannot be negative", 3000);
//        }
//    }
//    $scope.REMOVE_RECORD_CASH_BANK = function (line, index) {
//        if (line.TABLE_ID == undefined) {
//            $scope.CASH_BANKING_DETAILS.splice(index, 1);
//        }
//        else {
//            $scope.DELETE_CASH_BANKING_DETAILS.push(angular.copy(line));
//            $scope.CASH_BANKING_DETAILS.splice(index, 1);
//        }
//    }
//    $scope.GET_ENTITY_STAFF = function () {
//        var CashupModelObj = new Object();
//        CashupModelObj.ENTITY_ID = parseFloat($cookies.get("ENTITY_ID"));
//        CashupModelObj.BRANCH_ID = $scope.CashEditBankingSearch.BRANCH_ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_ENTITY_STAFF').then(function (data) {
//            if (data != undefined && data.data != undefined && data.data.length > 0) {
//                $scope.STAFF_LIST = data.data;
//            }

//        });
//    };
//    $scope.GET_ENTITY_STAFF();
//    $scope.GET_CASH_BANKING_DETAILS_BY_ID = function () {
//        $scope.$parent.overlay_loading_coffee = 'block';
//        var CashupModelObj = new Object();
//        CashupModelObj.CASHUP_MAIN_ID = $scope.CashEditBankingSearch.CASHUP_MAIN_ID;
//        PrcCommMethods.CASHUP_API(CashupModelObj, 'GET_CASH_BANKING_DETAILS_BY_ID').then(function (data) {
//            if (data.data == undefined || data.data == null) {
//            }
//            else if (data.data.Table.length > 0) {
//                $scope.CashEditBankingSearch.CASH_BANKING_HEADER = data.data.Table[0];
//            }
//            if (data.data.Table1.length == 0) {
//                $scope.ADD_MORE_RECORD_CASH_BANK();
//            }
//            else {
//                $scope.CASH_BANKING_DETAILS = data.data.Table1;
//            }
//            $scope.$parent.overlay_loading_coffee = 'none';
//        });
//    };
//    $scope.GET_CASH_BANKING_DETAILS_BY_ID();

//    $scope.INS_UPD_CASH_BANKING_ENTRY = function (SUBMIT_FLAG) {
//        $scope.CashBankingForm.submitted = true;
//        if ($scope.CashBankingForm.$valid) {
//            $scope.$parent.overlay_loading_coffee = 'block';
//            var CashupModelObj = new Object();
//            CashupModelObj.ENTITY_ID = parseFloat($cookies.get('ENTITY_ID'));
//            CashupModelObj.BRANCH_ID = parseFloat($scope.CashEditBankingSearch.BRANCH_ID);
//            CashupModelObj.CASHUP_MAIN_ID = $scope.CashEditBankingSearch.CASHUP_MAIN_ID;
//            CashupModelObj.USER_ID = parseFloat($cookies.get("USERID"));
//            CashupModelObj.BANKABLE_CASH = $scope.CashEditBankingSearch.CASH_BANKING_HEADER.BANKABLE_CASH;
//            CashupModelObj.VARIANCE = $scope.CashEditBankingSearch.CASH_BANKING_HEADER.CUSTOM_VARIANCE;
//            CashupModelObj.BANKING_HEADER_ID = $scope.CashEditBankingSearch.CASH_BANKING_HEADER.BANKING_HEADER_ID;
//            CashupModelObj.SUBMIT_FLAG = SUBMIT_FLAG;
//            //Save :-Go to save only SUBMIT_FLAG=0
//            //Submit:-Go to InApproval SUBMIT_FLAG=1
//            CashupModelObj.CASH_BANKING_ENTRY_TYPE = [];
//            angular.forEach($scope.CASH_BANKING_DETAILS, function (val) {
//                if (val.IS_DELETED == 0) {
//                    var ReadonlyObj = new Object();
//                    ReadonlyObj.TABLE_ID = val.TABLE_ID == undefined ? null : val.TABLE_ID;
//                    ReadonlyObj.BANKED_AMOUNT = val.BANKED_AMOUNT;
//                    ReadonlyObj.DEPOSIT_DATE = val.DEPOSIT_DATE;
//                    ReadonlyObj.DEPOSITED_BY = val.DEPOSITED_BY;
//                    ReadonlyObj.BANK_SLIP = val.BANK_SLIP;
//                    ReadonlyObj.IS_DELETED = val.IS_DELETED;
//                    CashupModelObj.CASH_BANKING_ENTRY_TYPE.push(ReadonlyObj);
//                }
//            });
//            angular.forEach($scope.DELETE_CASH_BANKING_DETAILS, function (val) {
//                var ReadonlyObj = new Object();
//                ReadonlyObj.TABLE_ID = val.TABLE_ID == undefined ? null : val.TABLE_ID;
//                ReadonlyObj.BANKED_AMOUNT = val.BANKED_AMOUNT;
//                ReadonlyObj.DEPOSIT_DATE = val.DEPOSIT_DATE;
//                ReadonlyObj.DEPOSITED_BY = val.DEPOSITED_BY;
//                ReadonlyObj.BANK_SLIP = val.BANK_SLIP;
//                ReadonlyObj.IS_DELETED = 1;
//                CashupModelObj.CASH_BANKING_ENTRY_TYPE.push(ReadonlyObj);
//            });
//            PrcCommMethods.CASHUP_API(CashupModelObj, 'INS_UPD_CASH_BANKING_ENTRY').then(function (data) {
//                if (data.data == undefined || data.data == null || data.data == 0) {
//                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
//                }
//                else if (data.data == 1) {
//                    if (SUBMIT_FLAG == 0) {
//                        $scope.$parent.ShowAlert("Success", "save successfully", 3000);
//                    }
//                    if (SUBMIT_FLAG == 1) {
//                        $scope.$parent.ShowAlert("Success", "submit successfully", 3000);
//                    }
//                    $scope.CashBankingForm.submitted = false;
//                    $location.path('Cash_Banking');
//                }
//                $scope.$parent.overlay_loading_coffee = 'none';
//            });
//        }
//    }
//    $scope.APP_REJ_CASH_BANKING = function (STATUS_ID) {
//        $scope.CashBankingForm.submitted = true;
//        if (STATUS_ID==10 && ($scope.CashEditBankingSearch.COMMENTS == '' || $scope.CashEditBankingSearch.COMMENTS == undefined || $scope.CashEditBankingSearch.COMMENTS == null)) {

//        }
//        else {
         
//            if ($scope.CashBankingForm.$valid) {
//                $scope.$parent.overlay_loading_coffee = 'block';
//                var CashupModelObj = new Object();
//                CashupModelObj.CASHUP_MAIN_ID = $scope.CashEditBankingSearch.CASHUP_MAIN_ID;
//                CashupModelObj.STATUS_ID = STATUS_ID;//-- 9 APPROVED , 10 REJECTED
//                CashupModelObj.COMMENTS = $scope.CashEditBankingSearch.COMMENTS;
//                CashupModelObj.USER_ID = parseFloat($cookies.get("USERID"));
//                PrcCommMethods.CASHUP_API(CashupModelObj, 'APP_REJ_CASH_BANKING').then(function (data) {
//                    if (data.data == undefined || data.data == null || data.data == 0) {
//                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
//                    }
//                    else if (data.data == 1) {
//                        if (STATUS_ID == 9) {
//                            $scope.$parent.ShowAlert("Success", "Approved successfully", 3000);
//                        }
//                        if (STATUS_ID == 10) {
//                            $scope.$parent.ShowAlert("Success", "Rejected successfully", 3000);
//                        }
//                        $location.path('Cash_Banking');
//                    }
//                    $scope.$parent.overlay_loading_coffee = 'none';
//                });
//            }
//        }
//    }
//    $scope.HIDE_SHOW_BANKABLE_FY = function () {
//        $scope.CashEditBankingSearch.HIDE_SHOW_BANKABLE = $scope.CashEditBankingSearch.HIDE_SHOW_BANKABLE == undefined || $scope.CashEditBankingSearch.HIDE_SHOW_BANKABLE == false ? true : false;
//    }
//});
