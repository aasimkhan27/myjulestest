app.controller('FlaotEntryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    //document.getElementById("loader").style.display = "block";
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.FloatEntrySearch = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        START_DATE: null,
        END_DATE: null,
        BRANCH_IDS: "",
        SELECTED_SITE: null,
        DATA_ENTRY_ENABLED: false,
        PAGE_NO: 1,
        PAGE_SIZE: 10

    }
    $scope.GetData = true;
    $scope.FLOAT_ENTRY_Obj = {
        CASHUP_FLOAT_ENTRY_ID: 0,
        EFFECTIVE_DATE: null,
        AMOUNT: null,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        SELECTED_SITE: null,
        CURRENCY_ID: parseInt($cookies.get("CURRENCY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        ACTIVE: 1
    };
    
    $scope.FILTERED_SITES_LIST = [];
    $scope.USER_ROLES_BY_USER_ID = [];
    $scope.sortColumn = 'EFFECTIVE_DATE';       // default sort column
    $scope.reverseSort = false;          // false = ascending, true = descending
    $scope.DD_DEFAULT_STATUS = 'Status';
    $scope.CAHSUP_PRIVILEGE_ID = "1170";
    $scope.setSort = function (column) {
        if ($scope.sortColumn === column) {
            $scope.reverseSort = !$scope.reverseSort;
        } else {
            $scope.sortColumn = column;
            $scope.reverseSort = false;
        }
    };
    $scope.SiteSearch = {};
    $scope.getSortClass = function (column) {
        if ($scope.sortColumn === column) {
            return $scope.reverseSort ? 'fa-arrow-down txt-primary' : 'fa-arrow-up txt-primary';
        }
        //return '';
        return 'fa-arrow-up-arrow-down text-grey '; // default icon
    };
    $scope.CASHUP_PRIVILEGE = true;
    $scope.DATA_ENTRY_ENABLED = false;
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
                        format: 'yyyy-mm-dd',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options).on("hide", function (e) {

                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////DATE RANGE PICKER FUN///////////////////////////////////
    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.FloatEntrySearch.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.FloatEntrySearch.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        //$scope.FloatEntrySearch.START_DATE = startDate.format('YYYY-MM-DD');
        //$scope.FloatEntrySearch.END_DATE = endDate.format('YYYY-MM-DD');

        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        //$('#reportrange span').html(startDate.format('DD-MM-YYYY') + ' - ' + endDate.format('DD-MM-YYYY'));
        if ($scope.FloatEntrySearch.SELECTED_SITE != null && $scope.FloatEntrySearch.SELECTED_SITE != undefined) {
            $scope.GET_CASHUP_FLOAT_ENTRY();
        }
    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        //$('#reportrange span').html(startDate.format($scope.$parent.Datelocaleformat.format) + ' - ' + endDate.format($scope.$parent.Datelocaleformat.format));
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


    //////////////////////////////DATE RANGE PICKER FUN///////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////Get Currency//////////////////////////////////////////
    $scope.CURRENCY_LIST = [];
    $scope.BASE_CURRENCY_NAME = null;
    $scope.GET_CURRENCY = function () {
        var CashupAppModelObj = new Object();
        PrcCommMethods.HR_API(CashupAppModelObj, 'GET_CURRENCY').then(function (data) {
            $scope.CURRENCY_LIST = data.data.Table;
            $scope.BASE_CURRENCY_NAME = $scope.CURRENCY_LIST.filter(cur => cur.CURRENCY_ID == parseInt($cookies.get("CURRENCY_ID")))[0].CURRENCY_NAME
        });
    }
    $scope.GET_CURRENCY();
    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////Get Currency//////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////Get Grid//////////////////////////////////////////
    $scope.FLOAT_ENTRY_LIST = [];
    $scope.GET_CASHUP_FLOAT_ENTRY = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.FloatEntrySearch.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID_LIST = [];
        var readonly = new Object();
        readonly.TABLE_ID = $scope.FloatEntrySearch.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);        
        CashupAppModelObj.START_DATE = $scope.FloatEntrySearch.START_DATE;
        CashupAppModelObj.END_DATE = $scope.FloatEntrySearch.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.FloatEntrySearch.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.FloatEntrySearch.PAGE_SIZE;
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_CASHUP_FLOAT_ENTRY').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.FLOAT_ENTRY_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.FLOAT_ENTRY_LIST = $scope.FLOAT_ENTRY_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.FloatEntrySearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.FloatEntrySearch.PAGE_NO = parseInt($scope.FloatEntrySearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.FloatEntrySearch.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.FloatEntrySearch.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.FLOAT_ENTRY_LIST = [];
                
            }

            //if (data.data && data.data.Table.length > 0) {
            //    $scope.FLOAT_ENTRY_LIST = data.data.Table;
            //}
            //else {
            //    $scope.FLOAT_ENTRY_LIST = [];
            //    $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            //}
            //document.getElementById("loader").style.display = "none";
        });
    };

    ////////////////////////////Get Grid//////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////

    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////Site List & Selection///////////////////////////////////
    $scope.selectSite = function (site,flag) {
        $scope.FloatEntrySearch.SELECTED_SITE = site;
        $scope.FLOAT_ENTRY_Obj.SELECTED_SITE = site;
        if (site.STANDARD_ROLE_ID == 16 || site.STANDARD_ROLE_ID == 17 || site.STANDARD_ROLE_ID == 18) {
            $scope.FloatEntrySearch.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.FloatEntrySearch.DATA_ENTRY_ENABLED = false;
        }
        if (flag == null || flag == undefined) {
            $scope.GET_CASHUP_FLOAT_ENTRY();
        }
    }
    
    $scope.RESET_FLOAT_ENTRY = function () {
        $scope.FloatEntryForm.submitted = false;
        $scope.FLOAT_ENTRY_Obj.CASHUP_FLOAT_ENTRY_ID = 0;
        $scope.FLOAT_ENTRY_Obj.EFFECTIVE_DATE = null;
        $scope.FLOAT_ENTRY_Obj.AMOUNT = null;
        $scope.FLOAT_ENTRY_Obj.BRANCH_ID = null;
        $scope.FLOAT_ENTRY_Obj.ACTIVE = 1;
        $scope.FLOAT_ENTRY_SELECTED_SITE = null;

    };
    $scope.RESET_FLOAT_SEARCH = function () {
        $scope.FloatEntrySearch.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.FloatEntrySearch.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.selectSite($scope.FILTERED_SITES_LIST[0], 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));        
    }

    $scope.FILTER_Fn = function (site,flag) {
        $scope.selectSite(site);
        if (flag == null || flag == undefined) {
            $scope.GET_CASHUP_FLOAT_ENTRY();
        }
        
    };
    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.FloatEntrySearch.CUSTOMER_ID,
            ENTITY_ID: $scope.FloatEntrySearch.ENTITY_ID
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
                    $scope.FILTERED_SITES_LIST[0].IS_SELECTED = true;
                    $scope.selectSite($scope.FILTERED_SITES_LIST[0]);
                    $scope.CASHUP_PRIVILEGE = true;
                }
                else {
                    $scope.CASHUP_PRIVILEGE = false;
                }
                $scope.selectSite(Sites[0]);
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
            $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);
                        
        }
        else {
            $scope.CASHUP_PRIVILEGE = false;            
        }
    };

    $scope.GET_PRIVILEGE();

    

    //////////////////////////////Site List///////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////


    


    //////////////////////////////////////INS//////////////////////////////////////////   
    
    $scope.DELETE_ENTRY = function (_row) {
        if (confirm('Are you sure you want to delete?')) {
            $scope.FLOAT_ENTRY_Obj.CASHUP_FLOAT_ENTRY_ID = _row.CASHUP_FLOAT_ENTRY_ID;
            $scope.FLOAT_ENTRY_Obj.EFFECTIVE_DATE = _row.EFFECTIVE_DATE;
            $scope.FLOAT_ENTRY_Obj.AMOUNT = _row.AMOUNT;
            $scope.FLOAT_ENTRY_Obj.BRANCH_ID = _row.BRANCH_ID;
            $scope.FLOAT_ENTRY_Obj.CURRENCY_ID = _row.CURRENCY_ID;
            $scope.FLOAT_ENTRY_Obj.ACTIVE = 0;
            $scope.FloatEntryForm.$valid = true;
            $scope.INS_UPD_CASHUP_FLOAT_ENTRY();
        }
    };
    $scope.INS_UPD_CASHUP_FLOAT_ENTRY = function () {
        $scope.FloatEntryForm.submitted = true;
        if ($scope.FloatEntryForm.$valid) {
            var CashupAppModelObj = new Object();
            CashupAppModelObj.CASHUP_FLOAT_ENTRY_ID = $scope.FLOAT_ENTRY_Obj.CASHUP_FLOAT_ENTRY_ID;
            CashupAppModelObj.EFFECTIVE_DATE = $scope.FLOAT_ENTRY_Obj.EFFECTIVE_DATE;
            CashupAppModelObj.AMOUNT = $scope.FLOAT_ENTRY_Obj.AMOUNT;
            CashupAppModelObj.ENTITY_ID = $scope.FLOAT_ENTRY_Obj.ENTITY_ID;
            CashupAppModelObj.BRANCH_ID = $scope.FLOAT_ENTRY_Obj.SELECTED_SITE.BRANCH_ID;
            CashupAppModelObj.CURRENCY_ID = $scope.FLOAT_ENTRY_Obj.CURRENCY_ID;
            CashupAppModelObj.USER_ID = $scope.FLOAT_ENTRY_Obj.USER_ID;
            CashupAppModelObj.ACTIVE = $scope.FLOAT_ENTRY_Obj.ACTIVE;
            PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'INS_UPD_CASHUP_FLOAT_ENTRY').then(function (data) {
                $scope.GET_CASHUP_FLOAT_ENTRY();
                $scope.RESET_FLOAT_ENTRY();
                $scope.FloatEntryForm.$valid = false;

                var modalElement = document.getElementById('add_new_float');
                var existingModal = bootstrap.Modal.getInstance(modalElement);
                if (existingModal) {
                    existingModal.hide();
                }

            });
        }
    }

    $scope.EXPORT_FLOAT_ENTRIES = function (export_flag) {
        //var CashupAppModelObj = new Object();
        //CashupAppModelObj.TABLE_ID_LIST = [];
        //angular.forEach($scope.FILTERED_SITES_LIST, function (site) {
        //    if (site.IS_SELECTED) {
        //        var readonly = new Object();
        //        readonly.TABLE_ID = parseInt(site.BRANCH_ID);
        //        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        //    }
        //});
        //CashupAppModelObj.START_DATE = $scope.FloatEntrySearch.START_DATE;
        //CashupAppModelObj.END_DATE = $scope.FloatEntrySearch.END_DATE;
        //CashupAppModelObj.EXPORT_FLAG = export_flag;
        //CashupAppModelObj.FILE_PATH = "/FLOAT_ENTRY_" + "/CUSTOMER_" + $scope.FLOAT_ENTRY_Obj.ENTITY_ID + "/" + "USER_ID_" + $scope.FLOAT_ENTRY_Obj.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        //CashupAppModelObj.FILE_NAME = "Float_Entry_Records";
        //PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_FLOAT_ENTRY_RECORD_LIST').then(function (data) {
        //    if (data.data != null) {
        //        $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
        //        $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
        //        window.location.href = $scope.SERVER_FILE_PATH;
        //    } else {
        //        alert("Export failed. Please try again.");
        //    }
        //});



        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID_LIST = [];
        var readonly = new Object();
        readonly.TABLE_ID = $scope.FloatEntrySearch.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        CashupAppModelObj.START_DATE = $scope.FloatEntrySearch.START_DATE;
        CashupAppModelObj.END_DATE = $scope.FloatEntrySearch.END_DATE;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 17;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/FLOAT_ENTRY_REPORT_" + "/CUSTOMER_" + $scope.FloatEntrySearch.CUSTOMER_ID + "/" + "USER_ID_" + $scope.FloatEntrySearch.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Float Entry Report";
        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_CASHUP_REPORTS').then(function (data) {
            if (data.data != null) {
                $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
                $scope.FILE_NAME = CashupAppModelObj.FILE_NAME;
                window.location.href = $scope.SERVER_FILE_PATH;
            } else {
                alert("Export failed. Please try again.");
            }
        });
    }
    $scope.EXPORT_PAGE_TO_PDF = function () {
        window.scrollTo(0, 0);
        document.getElementById("loader").style.display = "block";
        const node = document.getElementById("PRINT_REPORT");
        const clone = node.cloneNode(true);
        const liveSiteFilterValue = document.querySelector('#select_label') ?.textContent.trim();
        const liveDateRangeValue = document.querySelector('#reportrange span') ?.textContent.trim();


        var elementsToRemove = clone.querySelectorAll('.col-xxl-2.col-xl-2.col-md-2, .col-xxl-auto.col-xl-auto.col-md-auto');
        elementsToRemove.forEach(el => el.remove());

        elementsToRemove = clone.querySelectorAll('#cashup-report-hide');
        elementsToRemove.forEach(el => el.remove());
        const reportTitleElement = clone.querySelector('#cashup-report-header h6');

        if (reportTitleElement) {    
            reportTitleElement.textContent = 'Float Entries';
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

        // Remove overflow so all rows render fully in the iframe
        const tableWrapper = clone.querySelector('.table-responsive');
        if (tableWrapper) {
            tableWrapper.style.overflow = 'visible';
            tableWrapper.style.maxHeight = 'none';
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