app.controller('AdminIndexController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.ASSIGNED_REPORT_LIST = [];
    $scope.rd_absence = 1;
    $scope.Fn_TAB_CLICK = function (TAB_ID) {
        $scope.TAB_ID = TAB_ID;
    }
    $scope.UPLOAD_FOLDER_NAME = "Uploads";
    $scope.DATE_FORMATE_LABEL = "(DD/MM/YYYY)";
    $scope.CONVERSION_DATE_FORMAT = "DD/MM/YYYY";
    $scope.DISPLAY_DATE_FORMAT = "dd/MM/yyyy";
    $scope.CALENDAR_DATE_FORMAT = 'dd/mm/yyyy';
    $scope.$parent.HR_MODULE = false;
    $scope.$parent.CASHUP_MODULE = false;
    if (parseInt($cookies.get("MODULE_ID")) == 1) {
        $scope.$parent.CASHUP_MODULE = true;
    }
    else if (parseInt($cookies.get("MODULE_ID")) == 24) {

    }
    else if (parseInt($cookies.get("MODULE_ID")) == 26) {

    }

    //$scope.JAVASCIPT_DATE_FORMAT = "DD/MM/YYYY";
    $scope.DateInputformat = { format: $scope.CONVERSION_DATE_FORMAT };
    $scope.PLACE_HOLDER = "Type here..";
    $scope.DD_DEFAULT_TEXT = 'Choose';
    $scope.TWO_DIGIT_COUNTRY_CODE = $cookies.get("TWO_DIGIT_COUNTRY_CODE");
    $scope.PAGE_SIZE = 50;
    $scope.Fn_TAB_CLICK(1);
    $scope.UK_PINCODE_REG_X = /([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([AZa-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;
    $scope.GCC_PINCODE_REG_X = /^\d{4,5}(?:[-\s]\d{4})?$/ ///\b\d{4,5}\b/;
    $scope.US_PINCODE_REG_X = /^\d{5}(?:[-\s]\d{4})?$/;
    $scope.Fn_RD_ABSENCE_CHANGES = function (FLAG) {
        console.log($scope.rd_absence);
        $scope.ACCRUE_FLAG = FLAG;
    }
    $scope.Fn_INTERNAL_TAB_CLICK = function (TAB_INTERNAL_ID) {
        $scope.TAB_INTERNAL_ID = TAB_INTERNAL_ID;
    }
    $scope.Fn_INTERNAL_TAB_CLICK(1);
    $scope.Fn_change = function () {
        alert(GET_VALUE);
    }
    $scope.HeaderPrimaryDetails = {};
    $scope.HRMIndexscope = {};
    $scope.DISPLAY_FLAG = false;
    $scope.scrollToSection = function (sectionId) {
        var element = document.getElementById(sectionId);
        element.scrollIntoView({ behavior: 'smooth' });
    };
    $scope.LOAD_FETCH_TEXT = 'Fetching records..';
    $scope.LOAD_NO_FEED_TEXT = 'No records Yet..';
    $scope.MANDATORY_MSG = 'Please provide the mandatory details marked as red.';
    $scope.DatelocaleAccountformat = { format: 'DD MMM YYYY' };
    //GCC //187, 224, 117, 174, 162, 19



    $scope.BLANK_SETTING_OBJECT = function (OBJECT) {
        var readonly = new Object()
        readonly.TABLE_ID = null;
        readonly.RELATIVE_ID = null;
        readonly.INCLUDE_FLAG = null;
        readonly.DELETE_FLAG = null;
        readonly.SETTING_MASTER_ID = null;
        return readonly;
    }
    $scope.VALUE_SETTING_OBJECT = function (ARRAY, TABLE_ID, RELATIVE_ID, INCLUDE_FLAG, DELETE_FLAG, SETTING_MASTER_ID) {
        var readonly = new Object()
        readonly.TABLE_ID = TABLE_ID;
        readonly.RELATIVE_ID = RELATIVE_ID;
        readonly.INCLUDE_FLAG = INCLUDE_FLAG;
        readonly.DELETE_FLAG = DELETE_FLAG;
        readonly.SETTING_MASTER_ID = SETTING_MASTER_ID;
        ARRAY.push(readonly)
        return ARRAY;
    }
    $scope.TextReturn = function (NAME) {
        let F = ""; let M = ""; let L = "";
        if (NAME != undefined) {
            let NM = NAME.split(' ');
            if (NM.length == 1) {
                F = NM[0].charAt(0);
            }

            if (NM.length > 1) {
                F = NM[0].charAt(0);
                M = NM[1].charAt(0);
            }
            if (NM.length > 2) {
                L = NM[2].charAt(0);
            }
        }
        return F + '' + (L != "" ? L : M);
    }
    $scope.GET_LOCAL_TIME_ZONE = function () {
        const date = new Date();
        const offsetInMinutes = date.getTimezoneOffset();
        const totalMinutes = Math.abs(offsetInMinutes);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        const sign = offsetInMinutes <= 0 ? "+" : "-";
        const gmtOffset = `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
        return gmtOffset
    }
    $scope.CROPPIE_INIT_FN = function () {
        //$('.item-img').on('change', function () {
        //    readFile(this);
        //});

        //$(document).ready(function (e) {
        //    $('.timepicker').timepicker({
        //        interval: 30,
        //    });
        //});
    }
    $scope.UPLOAD_CODE_Fn = function () {
        //  $("#single-select-tagging").select2({minimumResultsForSearch: -1,});
        //  $(".single-select-tagging").select2({minimumResultsForSearch: -1,})
        // $(".single-select-tagging_search").select2({});
    }
    $scope.TAB_CLICK_HR_HEADER_Fn = function (FLAG) {
        if (FLAG == 0) {
            $location.path('Employee_List');
        }
        else if (FLAG == 1) {
            $location.path('PrimaryDetails');
        }
        else if (FLAG == 2) {
            $location.path('EmploymentInfo');
        }
        else if (FLAG == 3) {
            $location.path('Wages');
        }
        else if (FLAG == 4) {
            $location.path('EmpAbsences');
        }
        else if (FLAG == 5) {
            $location.path('EmpAccess');
        }
        else if (FLAG == 6) {
            $location.path('Document');
        } else if (FLAG == 7) {
            $location.path('Assets');
        } else if (FLAG == 8) {
            $location.path('Qualificaiton');
        } else if (FLAG == 9) {
            $location.path('Notes');
        }
    }
    $scope.TAB_MESSAGE_Fn = function (_param_step_no) {
        //Your profile is incomplete!
        //Please proceed from[last completed step name]for completing your profile.
        $scope.$parent.ShowAlertBox('Attention', 'Your profile is incomplete!', 3000);
    }
    $scope.COMMON_ADMIN_CODE_CHANGE_Fn = function (IS_ADMIN_FLAG) {
        if (IS_ADMIN_FLAG == 1) {
            $scope.DISPLAY_FLAG = true;
            $scope.$parent.DISPLAY_FLAG = true;
        } else {
            $scope.DISPLAY_FLAG = false;
            $scope.$parent.DISPLAY_FLAG = false;
        };
    }

    $scope.HR_COMMON_CODE_Fn = function () {
        $scope.ASSIGNED_REPORT_LIST = [];
        if (window.location.hash.split('?').length > 0) {
            $scope.CURRENT_PATH = window.location.hash.split('?')[0];
        }
        else {
            $scope.CURRENT_PATH = window.location.hash;
        }
        window.scrollTo(0, 0);
        if ($cookies.get("USERID") == undefined || $cookies.get("USERID") == null || $cookies.get("USERID") == '' || $cookies.get("USERID") == "null" || parseInt($cookies.get("USERID")) == 0) {
            $window.location.href = '/Login';
            return;
        }
        $(".modal-backdrop").remove();
        $(".tooltip").remove();
    }

    $scope.PAGE_MENU_CLICK_Fn = function (LINE_MENU, _header_dtls) {
        if (_header_dtls.FLAG == 1) {
            $location.path(LINE_MENU.PATH);
        }
        else {
            $scope.$parent.ShowAlert("Attention", "You have not subscribe this module.", 3000);

            // You do not have access to this page.
        }
    }

    $scope.RETURN_UNITS_DAYS = function (UNIT_ID) {
        switch (UNIT_ID) {
            case 1:
                return 'Days'
                break;
            case 2:
                return "Shifts"
                break;
            case 3:
                return "Hours";
                break;
            default:
                break;
        }
    }
    $scope.HRM_CHANGE_TIME_ZONE_Fn = function (date, FLAG) {
        var offset = "+00:00" //$cookies.get("TIMEZONE_OFFSET");
        var dateno = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        var monthno = date.getMonth() + 1;
        monthno = monthno < 10 ? "0" + monthno : monthno;
        var hrsno = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minno = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '' + offset);
        if (FLAG == undefined) {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '' + offset);
        }
        else {
            var a = (date.getFullYear() + "-" + monthno + "-" + dateno + "T" + hrsno + ":" + minno + '');
        }
        return moment(a);
    }
    $scope.HRM_CHANGE_UTC_TIME_ZONE_Fn = function (date, FLAG) {
        return moment(date).utcOffset(0, true);
    }
    $scope.HRM_DELETE_UPLOAD_FILE = function (Array, item, index, FLAG, CONFIRM_FLAG) {
        if (!CONFIRM_FLAG) {
            var CashupModelObj = new Object();
            CashupModelObj.ID = item.UPLOAD_ID;
            PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                if (FLAG == 1) {
                    Array.splice(index, 1);
                }
                else {
                    Array.UploadedFiles.splice(index, 1);
                }

            });
        } else {
            if (confirm('Are you sure you want to delete the file?')) {
                var CashupModelObj = new Object();
                CashupModelObj.ID = item.UPLOAD_ID;
                PrcCommMethods.CASHUP_API(CashupModelObj, 'DELETE_UPLOAD').then(function (data) {
                    $scope.$parent.ShowAlertBox('Success', 'Deleted Successfully', 5000);
                    if (FLAG == 1) {
                        Array.splice(index, 1);
                    }
                    else {
                        Array.UploadedFiles.splice(index, 1);
                    }

                });
            }
        }

    };
    $scope.dateinputddmmyyy = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("dateinputddmmyyy") //our date input has the name "date"
            if (date_inputs.length > 0) {
                for (var i = 0; i < date_inputs.length; i++) {
                    var date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                    var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                    // var date = new Date();
                    var options = {
                        todayBtn: "linked",
                        daysOfWeekHighlighted: "0,6",
                        autoclose: true,
                        todayHighlight: true,
                        format: 'dd/mm/yyyy',
                        closeText: 'Clear',
                        forceParse: false,
                        validateOnBlur: false,
                        clearBtn: true,
                        closeBtn: true,// close button visible
                        //  startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate())
                    };
                    date_input.datepicker(options)
                }
            }
        });
    }
    $scope.EQUALIZER = function () {
        var max = -1;
        $(".height-equal").css('min-height', 'auto');
        $('.height-equal').each(function () {
            var minHeight = $(this).outerHeight();
            max = minHeight > max ? minHeight : max;

        });
        $(".height-equal").css('min-height', max)
        if ($(window).width() <= 991) {
            $(".height-equal").css('min-height', 'auto');
        }

        $(".height-equal-2").css('min-height', 'auto');
        $('.height-equal-2').each(function () {
            var minHeight = $(this).outerHeight();
            max = minHeight > max ? minHeight : max;

        });
        $(".height-equal-2").css('min-height', max)
        if ($(window).width() <= 991) {
            $(".height-equal-2").css('min-height', 'auto');
        }
    }
    $scope.$on('ngRepeatFinishedequalizerRender', function (ngRepeatFinishedEvent) {
        $scope.EQUALIZER();
        $('[data-bs-toggle="tooltip"]').tooltip();
        $('[data-bs-toggle="popover"]').popover();
        //$page_title = $(".page-title");
        if ($nav.hasClass("close_icon")) {
        } else {
            $page_title = $(".page-title");
            $page_title.removeClass("close_icon");
        };
    });
    $scope.SET_DROPSCROLL = function () {
        $('.AddCustomScroll_Contact').find('.dropdown-menu').addClass('scrollbar-wrapper w-100');
        $('.AddCustomScroll_Contact').find('.dropdown-menu li').addClass('p-2');
    }
    $scope.inputStyle = {};
    $scope.onFocus = function () {
        //$scope.inputStyle = { outline: '2px solid blue' ,boxshadow: '0 0 5px rgba(0, 123, 255, 0.5)'};
    };
    $scope.onBlur = function () {
        // $scope.inputStyle = { backgroundColor: 'white' };
    };
    $scope.scrollToBottom = function () {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        //window.scrollTo({top: document.body.scrollHeight,behavior: "smooth"});
    };
});
