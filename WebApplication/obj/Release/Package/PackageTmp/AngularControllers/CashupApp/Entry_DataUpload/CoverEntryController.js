app.controller('CoverEntryController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    //$scope.$parent.DISPLAY_FLAG = false;
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn(2);
    //$scope.CASHUP_COMMON_CODE_Fn();
    $scope.$parent.CASHUP_COMMON_RESET_Fn();
    $scope.UPLOAD_REPORT_PATH = "";
    $scope.INVALID_EXCLE_CELL_FLAG = true;
    $scope.INVALID_EXCLE_CELL_COUNT = 0;
    $scope.PREVIEW_COVERS_ENTRY = [];
    $scope.COVERS_UPLOAD_REPORT = [];
    $scope.COVER_TABLE = [{ ID: 1, COLUMN_NAME: 'SHIFT_NAME', IS_MANDATORY: true, HEADER_NAME: 'Shift Name', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 2, COLUMN_NAME: 'RESERVATION_DATE', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 3, COLUMN_NAME: 'RESERVATION_TIME', IS_MANDATORY: true, HEADER_NAME: 'RESERVATION_TIME', FIELD_TYPE_ID: 14, VALUES_ENTITY: '', ACTIVE: true },//TIME DATATYPE
    { ID: 4, COLUMN_NAME: 'STATUS', IS_MANDATORY: true, HEADER_NAME: 'STATUS', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 5, COLUMN_NAME: 'BOOKING_SOURCE', IS_MANDATORY: true, HEADER_NAME: 'BOOKING_SOURCE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 6, COLUMN_NAME: 'COVER_COUNT', IS_MANDATORY: true, HEADER_NAME: 'COVER_COUNT', FIELD_TYPE_ID: 5, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 7, COLUMN_NAME: 'CREATED_DATE', IS_MANDATORY: true, HEADER_NAME: 'CREATED_DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 14, COLUMN_NAME: 'REVENUE_CENTRE', IS_MANDATORY: false, HEADER_NAME: 'REVENUE_CENTRE', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true },
    { ID: 8, COLUMN_NAME: 'REVENUE', IS_MANDATORY: true, HEADER_NAME: 'REVENUE', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, FIELD_MASTER_ID: -1 }];

    $scope.DOWNLOAD_FILE_PATH = "/Uploads/Covers_template.xlsx";
    $scope.COVERS_ENTRY_SEARCH = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        SELECTED_SITE: null,
        BRANCH_IDS : "",
        START_DATE: null,
        END_DATE: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        DATA_ENTRY_ENABLED: false
    }
    $scope.FILTERED_SITES_LIST = [];
    $scope.COVERS_ENTRY_LIST = [];
    $scope.GetData = true;
    $scope.SiteSearch = {};
    $scope.CAHSUP_PRIVILEGE_ID = "1168";
    $scope.CASHUP_PRIVILEGE = true;

    //////////////////////////////DATE RANGE PICKER FUN STARTS///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    $scope.dateinputddmmyy = function (index) {

        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    var today = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: false,
                        format: 'yyyy-mm-dd',//,$scope.$parent.CALENDAR_DATE_FORMAT
                        format: $scope.$parent.CALENDAR_DATE_FORMAT,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                        endDate: today
                    };
                    date_input.off("hide").datepicker(options).on("hide", function (e) {
                        
                    })
                }
            }
        });
    }
    $scope.dateinputddmmyy(1);


    //$scope.$parent.Datelocaleformat = { format: 'DD/MM/YYYY' };
    function reportrange(startDate, endDate) {
        $scope.COVERS_ENTRY_SEARCH.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
        $scope.COVERS_ENTRY_SEARCH.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
        $scope.GET_DATA_UPLOAD_COVERS_ENTRY()

    }
    $(function () {

        startDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        endDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
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




    

    //////////////////////////////  DATE RANGE PICKER FUN ENDS ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////     GET GRID FUN STARTS     ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    $scope.GET_DATA_UPLOAD_COVERS_ENTRY = function (flag) {
        if (flag == null || flag == undefined) {
            $scope.COVERS_ENTRY_SEARCH.PAGE_NO = 1;
            $scope.GetData = true;
        }

        var CashupAppModelObj = new Object();
        CashupAppModelObj.TABLE_ID_LIST = [];
        var readonly = new Object();
        readonly.TABLE_ID = $scope.COVERS_ENTRY_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        
        CashupAppModelObj.START_DATE = $scope.COVERS_ENTRY_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.COVERS_ENTRY_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = $scope.COVERS_ENTRY_SEARCH.PAGE_NO;
        CashupAppModelObj.PAGE_SIZE = $scope.COVERS_ENTRY_SEARCH.PAGE_SIZE;

        PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'GET_DATA_UPLOAD_COVERS_ENTRY').then(function (data) {
            if (data.data.Table.length > 0) {

                if (flag == null || flag == undefined) {
                    $scope.COVERS_ENTRY_LIST = data.data.Table;
                }
                else if (flag == 1) {
                    $scope.COVERS_ENTRY_LIST = $scope.COVERS_ENTRY_LIST.concat(data.data.Table);
                }
                if (data.data.Table.length < $scope.COVERS_ENTRY_SEARCH.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {E
                    $scope.COVERS_ENTRY_SEARCH.PAGE_NO = parseInt($scope.COVERS_ENTRY_SEARCH.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else if ($scope.COVERS_ENTRY_SEARCH.PAGE_NO > 1 && data.data.Table.length == 0) {
                $scope.GetData = false;
            }
            else if ($scope.COVERS_ENTRY_SEARCH.PAGE_NO == 1 && data.data.Table.length == 0) {
                $scope.COVERS_ENTRY_LIST = [];
                $scope.LOAD_FETCH_TEXT = 'No Records Found !';
            }
        });
    }


    //////////////////////////////      GET GRID FUN ENDS      ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////  BRANCH DROPDOWN FUN STARTS ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    $scope.RESET_COVERS_ENTRY_SEARCH = function () {
        $scope.COVERS_ENTRY_SEARCH.START_DATE = moment().startOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.COVERS_ENTRY_SEARCH.END_DATE = moment().endOf('month').format($scope.$parent.DB_DATE_FORMAT);
        $scope.selectSite($scope.FILTERED_SITES_LIST[0], 1);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', startDate, endDate, reportrange);
        $('#reportrange span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));        
    }

    $scope.selectSite = function (site, flag) {
        $scope.COVERS_ENTRY_SEARCH.SELECTED_SITE = site;
        $scope.SELECT_SITE_FOR_UPLOAD(site);
        if (site.STANDARD_ROLE_ID == 16 || site.STANDARD_ROLE_ID == 17 || site.STANDARD_ROLE_ID == 18) {
            $scope.COVERS_ENTRY_SEARCH.DATA_ENTRY_ENABLED = true;
        }
        else {
            $scope.COVERS_ENTRY_SEARCH.DATA_ENTRY_ENABLED = false;
        }
        if (flag == null || flag == undefined) {
            $scope.GET_DATA_UPLOAD_COVERS_ENTRY();
        }
    }

    $scope.GET_CASHUP_TYPE = function (Sites) {
        var CashupModelObj = {
            CUSTOMER_ID: $scope.COVERS_ENTRY_SEARCH.CUSTOMER_ID,
            ENTITY_ID: $scope.COVERS_ENTRY_SEARCH.ENTITY_ID
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
            }
            else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }).catch(function (error) {
            $scope.CASHUP_PRIVILEGE = false;
        });
    }

    $scope.GET_PRIVILEGE = function () {
        if ($scope.$parent.$parent.CHECK_CASHUP_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID)) {
            
            $scope.FILTERED_SITES_LIST = $scope.$parent.$parent.CHECK_CASHUP_USER_PRIVILEGE($scope.CAHSUP_PRIVILEGE_ID, parseInt($cookies.get("ENTITY_ID")));
            if ($scope.FILTERED_SITES_LIST && $scope.FILTERED_SITES_LIST.length > 0) {
                $scope.GET_CASHUP_TYPE($scope.FILTERED_SITES_LIST);
            }
            else {
                $scope.CASHUP_PRIVILEGE = false;
            }
        }
        else {
            $scope.CASHUP_PRIVILEGE = false;
        }
    };

    $scope.GET_PRIVILEGE();
    
    //////////////////////////////   BRANCH DROPDOWN FUN ENDS  ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////



    

    //////////////////////////////    HELPER GET FUN STARTS   ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////
    $scope.CASHUP_SETTING_DATA_UPLOAD = [];
    $scope.GET_CASHUP_SETTING_DATA_UPLOAD = function (_branchId) {
        CommonObj = new Object();
        CommonObj.ENTITY_ID = $scope.COVERS_ENTRY_SEARCH.ENTITY_ID;
        CommonObj.CUSTOMER_ID = $scope.COVERS_ENTRY_SEARCH.CUSTOMER_ID;
        PrcCommMethods.CASHUP_APP_API(CommonObj, 'GET_CASHUP_SETTING_DATA_UPLOAD').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CASHUP_SETTING_DATA_UPLOAD = data.data.Table;
            }
            else {
                $scope.CASHUP_SETTING_DATA_UPLOAD = [];
            }
            var filtered_data_upload_type_list = $scope.CASHUP_SETTING_DATA_UPLOAD.filter(_row => _row.BRANCH_ID == _branchId);
            if (filtered_data_upload_type_list.length > 0) {
                $scope.COVERS_UPLOAD_OBJ.CASHUP_DATA_UPLOAD_MASTER_ID = filtered_data_upload_type_list[0].CASHUP_DATA_UPLOAD_MASTER_ID;
                $scope.COVERS_UPLOAD_OBJ.DATA_UPLOAD_TYPE = filtered_data_upload_type_list[0].DATA_UPLOAD_TYPE;
            }
            else {
                $scope.COVERS_UPLOAD_OBJ.CASHUP_DATA_UPLOAD_MASTER_ID = 0;
                $scope.COVERS_UPLOAD_OBJ.DATA_UPLOAD_TYPE = null;
            }
        });
    };
    
    //////////////////////////////    HELPER GET FUN ENDS   ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    
    $scope.EXPORT_COVERS = function (export_flag) {
        //var CashupAppModelObj = new Object();
        //CashupAppModelObj.EXPORT_COVERS_LIST = $scope.COVERS_ENTRY_LIST;
        //CashupAppModelObj.EXPORT_FLAG = export_flag;
        //CashupAppModelObj.FILE_PATH = "/EXPORT_COVERS_UPLOAD_" + "/CUSTOMER_" + $scope.COVERS_ENTRY_SEARCH.CUSTOMER_ID + "/" + "USER_ID_" + $scope.COVERS_ENTRY_SEARCH.USER_ID + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        //CashupAppModelObj.FILE_NAME = "ExportCoversUpload";
        //PrcCommMethods.CASHUP_APP_API(CashupAppModelObj, 'EXPORT_COVERS_LIST').then(function (data) {
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
        readonly.TABLE_ID = $scope.COVERS_ENTRY_SEARCH.SELECTED_SITE.BRANCH_ID;
        CashupAppModelObj.TABLE_ID_LIST.push(readonly);
        CashupAppModelObj.START_DATE = $scope.COVERS_ENTRY_SEARCH.START_DATE;
        CashupAppModelObj.END_DATE = $scope.COVERS_ENTRY_SEARCH.END_DATE;
        CashupAppModelObj.PAGE_NO = 0;
        CashupAppModelObj.PAGE_SIZE = 0;
        CashupAppModelObj.CASHUP_REPORT_TYPE = 14;
        CashupAppModelObj.EXPORT_FLAG = export_flag;
        CashupAppModelObj.FILE_PATH = "/COVERS_ENTRY_REPORT_" + "/CUSTOMER_" + $cookies.get('ENTITY_ID') + "/" + "USER_ID_" + $cookies.get('USERID') + "/" + (export_flag == 1 ? "CSV" : "XLSX") + "/";
        CashupAppModelObj.FILE_NAME = "Covers Entry Report";
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

    //////////////////////////////    UPLOAD COVERS FUN STARTS   ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    $scope.COVERS_UPLOAD_MESSAGE = {
        0: "Covers uplaod type is not set. Please setup from Settings.",
        1: "Looks like you use Covers. Please download the template to fill in and & upload covers data.",
        2: "Looks like you use Manual entry. Please use Cashup Entry Page.",
        3: "Looks like you use ePOS. Please use Cashup Entry Page."
    }

    $scope.COVERS_UPLOAD_OBJ = {
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        USER_ID: parseInt($cookies.get("USERID")),
        SELECTED_SITE: null,
        START_DATE: null,
        END_DATE:null,
        CASHUP_DATA_UPLOAD_MASTER_ID: 0,
        DATA_UPLOAD_TYPE: null,
        UploadedFiles: null
    }

    $scope.SELECT_SITE_FOR_UPLOAD = function (_site) {
        $scope.COVERS_UPLOAD_OBJ.SELECTED_SITE = _site;
        $scope.GET_CASHUP_SETTING_DATA_UPLOAD(_site.BRANCH_ID);
        //var filtered_data_upload_type_list = $scope.CASHUP_SETTING_DATA_UPLOAD.filter(_row => _row.BRANCH_ID == _site.BRANCH_ID);
        //if (filtered_data_upload_type_list.length > 0) {
        //    $scope.COVERS_UPLOAD_OBJ.CASHUP_DATA_UPLOAD_MASTER_ID = filtered_data_upload_type_list[0].CASHUP_DATA_UPLOAD_MASTER_ID;
        //    $scope.COVERS_UPLOAD_OBJ.DATA_UPLOAD_TYPE = filtered_data_upload_type_list[0].DATA_UPLOAD_TYPE;
        //}
        //else {
        //    $scope.COVERS_UPLOAD_OBJ.CASHUP_DATA_UPLOAD_MASTER_ID = 0;
        //    $scope.COVERS_UPLOAD_OBJ.DATA_UPLOAD_TYPE = null;
        //}
    }

    $scope.FILEUPLOADCLICK = function () {
        $scope.Refreshdata();
    };

    $scope.Refreshdata = function () {
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.submitted = false;
        $scope.TOGGLE_UPLOAD_VIEW = false;
        $scope.PREVIEW_COVERS_ENTRY = [];
    };

    $scope.getTheFilesToUploadCovers = function ($files, ControlName, FileSize, List, Attachment_UPLOAD_TYPE_ID, index) {

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
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 10 MB
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
        var fileUpload = document.getElementById("uploadExcel");
        if (fileUpload.files[0] == null || fileUpload.files[0] == undefined) {
            var extension = $files[0].name;
        }
        else {
            extension = fileUpload.files[0].name;
        }
        //$scope.Files = $files;
        //var fileUpload = document.getElementById("uploadExcel");
        //extension = fileUpload.files[0].name;
        $scope.uploadFiles(Attachment_UPLOAD_TYPE_ID, '', extension, List, index, 'CoversUpload');
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, FolderName) {

        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", $scope.$parent.$parent.generaterandom(12));
            //data.append("RelativeID", List.ID == 0 ? $scope.generaterandom(12) + "" + index : List.ID);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/CashUp/' + FolderName + '/' + parseInt($scope.COVERS_UPLOAD_OBJ.SELECTED_SITE.BRANCH_ID) + '/');
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
                //var fileInput = document.getElementById("uploadExcel"); // Reset the file input
                //if (fileInput) {
                //    fileInput.value = ""; // Clear the input field
                //}
                $scope.EXCEL_COVERS_VALIDATE();
            });
        }
    };

    $scope.DELETE_UPLOAD_CARD_ALL = function (Array, item, index) {
        if (confirm('Are you sure you want to delete?')) {
            Array.UploadedFiles.splice(index, 1);
            var CashupModelObj = new Object();
            CashupModelObj.ID = parseInt(item.ID);
            PrcCommMethods.CASHUP_APP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                var fileInput = document.getElementById("uploadExcel"); // Reset the file input
                if (fileInput) {
                    fileInput.value = ""; // Clear the input field
                }
                $scope.$parent.ShowAlertBox('Success', 'Deletion Success.', 3000);
                //$scope.PREVIEW_VOUCHERS_ENTRY = [];
                $scope.CODE_ARRY = [];
                $scope.COVERS_UPLOAD_OBJ.UploadedFiles = null;
                $scope.INVALID_EXCLE_CELL_COUNT = 0;
                $scope.COPY_CODE_ARRY = [];
                $scope.CODE_ARRY = [];
                $scope.submitted = false;
            });
        }
    };


    $scope.RESET_UPLOAD = function () {
        $scope.PREVIEW_COVERS_ENTRY = [];
        //$scope.COVERS_UPLOAD_OBJ.SELECTED_SITE = null;
        $scope.COVERS_UPLOAD_OBJ.DATE = null;
        //$scope.COVERS_UPLOAD_OBJ.CASHUP_DATA_UPLOAD_MASTER_ID = 0;
        //$scope.COVERS_UPLOAD_OBJ.DATA_UPLOAD_TYPE = null;
        $scope.COVERS_UPLOAD_OBJ.UploadedFiles = null;
        $scope.TOGGLE_UPLOAD_VIEW = false;
        var fileInput = document.getElementById("uploadExcel"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    }


    $scope.EXCEL_COVERS_VALIDATE = function () {
        $scope.COPY_CODE_ARRY = [];
        $scope.CODE_ARRY = [];
        $scope.INVALID_EXCLE_CELL_COUNT = 0;
        if ((document.getElementById('uploadExcel').value != null && document.getElementById('uploadExcel').value != '') || ($scope.Files != null && $scope.Files != undefined && $scope.Files.length > 0)) {
            ModelObj = new Object();
            ModelObj.UPLOAD_TYPE_ID = 1;
            ModelObj.SERVER_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.FILE_PATH = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].FILE_PATH + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.DATETIME_FORMAT_CULTURE = ["MM/dd/yyyy hh:mm:ss tt", "M/d/yyyy hh:mm:ss tt", "MM/dd/yyyy", "M/d/yyyy", "dd-MM-yyyy", "yyyy-MM-dd","dd/MM/yyyy"]; //, "yyyy-MM-dd" 'dd/MM/yyyy'
            ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;

            ModelObj.EXCEL_DATATABLE = $scope.COVER_TABLE;
            PrcCommMethods.CASHUP_APP_API(ModelObj, 'EXCEL_COVERS_VALIDATE').then(function (data) {
                $scope.COVERS_VALIDATE_LIST = [];
                $scope.submitted = true;
                $scope.PREVIEW_COVERS_ENTRY = data.data.HEADER_CLOUMN_NAMES;
                //angular.forEach($scope.PREVIEW_COVERS_ENTRY, function (_row) {
                //    _row.RESERVATION_DATE = moment(_row.RESERVATION_DATE, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY");
                //    _row.CREATED_DATE = moment(_row.CREATED_DATE, "DD-MM-YYYY").format("DD-MM-YYYY");

                //})
                if (data.data.IS_VALID_COUNT > 0) {
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.INVALID_EXCLE_CELL_FLAG = true;
                    //$('#View_Report').modal('show');
                }

                else if (data.data.error == "CODE0001") {
                    $scope.$parent.ShowAlertBox('Warning', 'No changes found in uploaded Excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.error == "CODE0003") {
                    $scope.$parent.ShowAlertBox('Warning', 'Some thing wrong in excel or Enable editing mode in excel', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                    if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                        $scope.Message = "";
                        var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                        $scope.CODE_ARRY.push(List);
                        $scope.COPY_CODE_ARRY.push(List);
                    };
                }
                else if (data.data.error == "CODE0002") {
                    $scope.$parent.ShowAlertBox('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                    $scope.$parent.ShowAlertBox('Warning', 'No record found', 3000);
                    $scope.submitted = false;
                    $scope.IS_VALID_UPLOAD_FILE = false;
                }
                else {
                    $scope.INVALID_EXCLE_CELL_FLAG = false;
                    $scope.INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                    $scope.$parent.ShowAlertBox('Success', 'File validated successfully,please click on submit', 5000);
                }
            });
            $scope.submitted = false;
        }
        else {
            $scope.$parent.ShowAlertBox('Attention', 'Please Upload File', 3000);
            $scope.submitted = false;
        }
        var fileInput = document.getElementById("uploadExcel"); // Reset the file input
        if (fileInput) {
            fileInput.value = ""; // Clear the input field
        }
    };
    
    function reportrangeCoversUpload(startDate, endDate) {
        if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply(function () {
                $scope.COVERS_UPLOAD_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
                $scope.COVERS_UPLOAD_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
            });
        } else {
            $scope.COVERS_UPLOAD_OBJ.START_DATE = startDate.format($scope.$parent.DB_DATE_FORMAT);
            $scope.COVERS_UPLOAD_OBJ.END_DATE = endDate.format($scope.$parent.DB_DATE_FORMAT);
        }
        //$scope.COVERS_UPLOAD_OBJ.START_DATE = startDate.format('YYYY-MM-DD');
        //$scope.COVERS_UPLOAD_OBJ.END_DATE = endDate.format('YYYY-MM-DD');
        $('#reportrangeCoversUpload span').html(startDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + endDate.format($scope.$parent.DATE_RANGE_FORMAT));
    }
    $(function () {

        coversUploadStartDate = new moment().add(0, 'months').date(1);//new moment().subtract(1, 'months').date(1); //moment().add('months', 1).date(0);//moment().startOf('month');   //moment().startOf('isoWeek');//moment().subtract(6, 'days');
        //console.log("SD", startDate);
        coversUploadEndDate = moment().endOf('month'); //moment().subtract(0, 'days');
        //console.log("ED", endDate);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoversUpload', coversUploadStartDate, coversUploadEndDate, reportrangeCoversUpload);
        $('#reportrangeCoversUpload span').html(coversUploadStartDate.format($scope.$parent.DATE_RANGE_FORMAT) + ' - ' + coversUploadEndDate.format($scope.$parent.DATE_RANGE_FORMAT));
    });

    $(document).on("click", ".ranges ul li", function (event) {

        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && ($scope.loader == 1)) {
            $scope.loader = 2;
            var startCovers = moment().startOf('month');
            var endCovers = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeCoversUpload', startCovers, endCovers, reportrangeCoversUpload, 1, "right", 'Open');
            $('#reportrangeCoversUpload').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.ngintvalidationvalue = function (key, value) {
        var List;
        if (value == "<i class='fa fa-exclamation-triangle text-danger'></i>") {
            List = { DISPLAY_TEXT: "", IS_VALID: true };
        }
        else {
            if (key == "COMMENTS") {

            }
            var val = value.split(':;:');
            if (val.length > 1) {
                if (val[1] == "DDL0004") {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val, D_COLUMN_NAME: val[2] };
                    $scope.COPY_CODE_ARRY.push(List);
                }
                else {
                    List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true, CODE: val[1], Suggestion: val };
                    $scope.COPY_CODE_ARRY.push(List);
                }
            }
            else {
                if (key == "NI Number" && value != '' || key == "NI Number*" && value != '') {
                    const repeatRegex = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/i;
                    var found = value.match(repeatRegex);
                    if (found == null) {
                        List = { DISPLAY_TEXT: value, IS_VALID: false, IS_DATA_VALID: true, CODE: "INVALID0011" };
                        $scope.COPY_CODE_ARRY.push(List);
                    }
                    else {
                        List = { DISPLAY_TEXT: value, IS_VALID: false };
                    }
                }
                else {
                    if (key == "DATE" || key == "CREATED_DATE") {
                        value = value.split(' ')[0];
                    }
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };



    $scope.INS_UPD_CU_COVERS = function () {
        var IS_VALID = true;
        if ($scope.COVERS_UPLOAD_OBJ.SELECTED_SITE == null || $scope.COVERS_UPLOAD_OBJ.SELECTED_SITE == undefined) {
            $scope.$parent.ShowAlertBox("Error", "Please select a branch", 2000);
            IS_VALID = false;
        }
        if (new Date($scope.COVERS_UPLOAD_OBJ.START_DATE) > new Date($scope.COVERS_UPLOAD_OBJ.END_DATE)) {
            $scope.$parent.ShowAlertBox("Error", "end date should be less then start date", 2000);
            IS_VALID = false;
        }
        if (IS_VALID) {

            //angular.forEach($scope.PREVIEW_COVERS_ENTRY, function (_row) {
            //    _row.RESERVATION_DATE = moment(_row.RESERVATION_DATE, "DD-MM-YYYY HH:mm:ss").format($scope.$parent.DB_DATE_FORMAT);
            //    _row.CREATED_DATE = moment(_row.CREATED_DATE, "DD-MM-YYYY HH:mm:ss").format($scope.$parent.DB_DATE_FORMAT);

            //})


            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.COVERS_UPLOAD_OBJ.SELECTED_SITE.BRANCH_ID;
            ModelObj.ENTITY_ID = $scope.COVERS_UPLOAD_OBJ.ENTITY_ID;
            ModelObj.USER_ID = $scope.COVERS_UPLOAD_OBJ.USER_ID;
            ModelObj.SERVER_FILE_NAME = '../Uploads/' + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].FILE_PATH + $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.COVERS_UPLOAD_OBJ.UploadedFiles[0].ORIGINAL_FILE_NAME;
            ModelObj.START_DATE = $scope.COVERS_UPLOAD_OBJ.START_DATE; 
            ModelObj.END_DATE = $scope.COVERS_UPLOAD_OBJ.END_DATE;
            ModelObj.CU_COVERS_TYPE_DETAIL = $scope.PREVIEW_COVERS_ENTRY;
            PrcCommMethods.CASHUP_APP_API(ModelObj, 'INS_UPD_CU_COVERS').then(function (data) {
                //if (parseInt(data.data) > 0) {
                //    $scope.$parent.ShowAlertBox('Success', 'Successfully Uploaded', 3000);
                //    $scope.INVALID_EXCLE_CELL_COUNT = null;
                //    $scope.INVALID_EXCLE_CELL_FLAG = false;
                //    document.getElementById('uploadExcel1').value = '';
                //    //$scope.BRANCH_LIST_VIEW = null;
                //    $scope.GET_CU_COVER_LOG_HDR();
                //    $scope.RESET_UPLOAD();
                //    $scope.submitted = false;
                //}
                $scope.RESET_UPLOAD();
                $scope.GET_DATA_UPLOAD_COVERS_ENTRY();
            });
        }
    };
    //////////////////////////////    UPLOAD COVERS FUN ENDS    ///////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////

    $scope.$on('$destroy', function () {
        $('.modal.show').modal('hide');
    });
   
});