app.controller('PI_Index_Controller', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.PI_INDEX_JS_LOAD = 1;
    $scope.START_DAY_OF_WEEK = 1;
    $scope.BTN_HIDE_WEEK_PICKER = 0;
    $scope.K_M_T_VALUE_INIT = 1000;
    $scope.APPLY_BTN_SHOW = true;
    $scope.APPLY_ZOOM = true;
    $scope.APPLY_TOOL_BAR = true;
    $scope.APPLY_TOOL_BAR_DOWNLOAD = false;
    $scope.APPLY_TOOL_BAR_SELECTION = false;
    $scope.APPLY_TOOL_BAR_ZOOM = true;
    $scope.APPLY_TOOL_BAR_ZOOMIN = false;
    $scope.APPLY_TOOL_BAR_ZOOMOUT = false;
    $scope.APPLY_TOOL_BAR_PAN = false;
    $scope.APPLY_TOOL_BAR_RESET = true;
    $scope.DDL_DISPLAY_TEXT = "Choose";

    $scope.$parent.HR_MODULE = false;
    $scope.$parent.CASHUP_MODULE = false;
    $scope.$parent.DASHBOARD_MODULE = true;
    //$scope.Quarters = [{ name: 'Q1', months: "January-February-March" },
    //{ name: 'Q2', months: "April-May-June" },
    //{ name: 'Q3', months: "July-August-September" },
    //{ name: 'Q4', months: "October-November-December" }];

    $scope.YEAR_LIST = [{ name: '2024', Year: "2024" },
    { name: '2025', months: "2025" }];
    // Example usage
    $scope.fiscalStartMonth = 4; // April
    $scope.year = 2025;

    $scope.getFiscalQuarterDates = function (year, checkDate) {
        let quartersList = [];
        let fiscalStartDate = new Date(year - 1, $scope.fiscalStartMonth - 1, 1);
        var startDate = "", endDate = "", QName = "", ActiveName = ""
        for (let i = 0; i < 8; i++) {
            let quarterStart = new Date(fiscalStartDate);
            quarterStart.setMonth(fiscalStartDate.getMonth() + i * 3);
            let quarterEnd = new Date(quarterStart);
            quarterEnd.setMonth(quarterEnd.getMonth() + 3);
            quarterEnd.setDate(quarterEnd.getDate() - 1);
            var IS_ACTIVE = 0;
            if (i > 3) {
                QName = `Q${i -3}`;
            }
            else {
                QName = `Q${i + 1}`;
            }
            if (new Date(checkDate) <= new Date(quarterEnd) && new Date(checkDate) >= new Date(quarterStart)) {
                IS_ACTIVE = 1;
                startDate = quarterStart;
                endDate = quarterEnd;
                ActiveName = QName;
            }
            quartersList.push({
                QName: QName,
                start: quarterStart,
                end: quarterEnd,
                IS_ACTIVE: IS_ACTIVE
            });
        }
        //var quarters = quartersList.filter(function (x) { return x.IS_ACTIVE == 1 });
        return startDate + ',' + endDate + "," + ActiveName;
    };

    $scope.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
    $scope.PI_MESSAGE = "Atleast one site should be selected";
    $scope.LOAD_FETCH_TEXT = 'No record found..';
    $scope.GET_BASE_DATA_FOR_POWER_INSIGHTS = function () {
        $scope.SUB_MODULE_PAGE_LIST = [];
        $scope.CURRENCY_LIST = [];
        $scope.SITE_LIST = [];
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
        _pi_input_model_obj.MODULE_ID = parseInt($cookies.get("MODULE_ID"));
        _pi_input_model_obj.GET_PAGE_DATA = true;
        _pi_input_model_obj.GET_FILTER_DATA = true;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GET_BASE_DATA_FOR_POWER_INSIGHTS', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.SubModulePage_List.length > 0) {
                $scope.GET_APP_PAGE_COMPONENTS();
                $scope.$parent.$parent.SUB_MODULE_PAGE_LIST = data.data.SubModulePage_List;
                $scope.CURRENCY_LIST = data.data.CurrencyList;
                $scope.SITE_LIST = data.data.SiteList.filter(function (x) { x.IS_CHECK = true; return x });
                if ($scope.SITE_LIST.length == 1) { }
                if ($scope.CURRENCY_LIST.length > 0) { };
            }
        });
    };


    $scope.COMMON_ADMIN_CODE_CHANGE_Fn = function (IS_ADMIN_FLAG) {
        if (IS_ADMIN_FLAG == 1) {
            $scope.$parent.DISPLAY_FLAG = true;
        } else {
            $scope.$parent.DISPLAY_FLAG = false;
        };
    }
    $scope.GET_APP_PAGE_COMPONENTS = function () {
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.USER_ID = parseInt($cookies.get("USERID"));
        _pi_input_model_obj.APP_PAGE_ID = -1;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GET_APP_PAGE_COMPONENTS', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.length > 0) {
                $localStorage.APP_PAGE_COMPONENTS_LIST = JSON.stringify(data.data);
                $scope.PI_child_scope.CONTROLLER_LOAD();
            }
        });
    };
    $scope.GET_COMPONENTS_ALLOW = function (COMPONENTS_TYPE_ID) {
        var _app_page_components_list = JSON.parse($localStorage.APP_PAGE_COMPONENTS_LIST);
        var IS_COMPONENTS = _app_page_components_list.filter(function (x) { return x.COMPONENT_ID == COMPONENTS_TYPE_ID && x.ACTIVE });
        if (IS_COMPONENTS.length > 0) {
            return true;
        }
        return false;
    };
    $scope.GET_BASE_DATA_FOR_POWER_INSIGHTS();
    $scope.GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS = function (START_DATE, END_DATE, CURRENCY_ID, ENTITY_BRANCH_LIST, DISPLAY_TEXT_CURRENCY) {
        var _pi_input_model_obj = new Object();
        _pi_input_model_obj.START_DATE = new Date(START_DATE).toDateString();
        _pi_input_model_obj.END_DATE = new Date(END_DATE).toDateString();;
        _pi_input_model_obj.CURRENCY_ID = CURRENCY_ID;
        _pi_input_model_obj.ENTITY_BRANCH_LIST = [];
        _pi_input_model_obj.ENTITY_BRANCH_LIST = ENTITY_BRANCH_LIST;
        PrcCommMethods.DASHBOARD_MODULES_API(_pi_input_model_obj, 'GET_CONVERSION_RATES_BY_BRANCH_FOR_POWER_INSIGHTS', 'POWERINSIGHTAPI').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (val) {
                    angular.forEach($scope.SITE_LIST, function (x) {
                        if (val.BRANCH_ID == x.Key.split(',')[1]) {
                            //if (DISPLAY_TEXT_CURRENCY.split('-')[0].trim() == x.Key.split(',')[3].trim()) {
                            // same currency code
                            //}
                            //else {
                            x.CONVERSION_RATE = parseFloat(val.CONVERSION_RATE).toFixed(2);
                            x.TO_CURRENCY = DISPLAY_TEXT_CURRENCY.split('-')[0];
                            x.BASE_CURRENCY = ' 1 ' + x.Key.split(',')[3];
                            x.DISPLAY_TEXT_CURRENCY = x.BASE_CURRENCY + '=' + parseFloat(x.CONVERSION_RATE).toFixed(2) + ' ' + x.TO_CURRENCY;
                            //}
                        }
                    });
                });
            }
        });
    }

    $scope.HEADER_MENU_CLICK = function (_header_dtls) {
        $(this).addClass("active");
        $(".sidebar-link").removeClass("active");
        $(".sidebar-submenu, .menu-content").hide();
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
    $scope.getStartOfMonth = function (year, month) {
        return new Date(year, month, 1);
    }
    $scope.getEndOfMonth = function (year, month) {
        return new Date(year, month + 1, 0);
    }
    //$scope.$parent.MASTER_GET_CUSTOMER_SETTINGS('47', true, 'NO_REDIRECTION');

    $scope.$on('ngRepeatFinishedMenuRender', function (ngRepeatFinishedEvent) {
        $(".sidebar-links").click(function () {
            $(this).addClass("active");
        });
        //$(".sidebar-title").append(
        //    '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
        //);
        $(".sidebar-title").click(function () {
            $(".sidebar-link").removeClass("active");
            $(".sidebar-title")
                .removeClass("active")
                .find("div")
                .replaceWith(
                    '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
                );
            $(".sidebar-submenu, .menu-content").slideUp("normal");
            $(".menu-content").slideUp("normal");
            if ($(this).next().is(":hidden") == true) {
                $(this).addClass("active");
                $(this)
                    .find("div")
                    .replaceWith(
                        '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
                    );
                $(this).next().slideDown("normal");
            } else {
                $(this)
                    .find("div")
                    .replaceWith(
                        '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
                    );
            }
        });

        $(".sidebar-submenu, .menu-content").hide();
        $(".submenu-title").append(
            '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
        );
        $(".submenu-title").click(function () {
            $(".sidebar-link").removeClass("active");
            $(".submenu-title")
                .removeClass("active")
                .find("div")
                .replaceWith(
                    '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
                );
            $(".submenu-content").slideUp("normal");
            if ($(this).next().is(":hidden") == true) {
                $(this).addClass("active");
                $(this)
                    .find("div")
                    .replaceWith(
                        '<div class="according-menu"><i class="fa fa-angle-down"></i></div>'
                    );
                $(this).next().slideDown("normal");
            } else {
                $(this)
                    .find("div")
                    .replaceWith(
                        '<div class="according-menu"><i class="fa fa-angle-right"></i></div>'
                    );
            }
        });
        $(".submenu-content").hide();

    });
    $scope.PRINT_PDF_DSA = function (FLAG, ID, FILE_NAME) {
        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";
        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');
        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }
        if (clone.getElementsByClassName('media-body switch-md').length > 0)
            for (let i = 0; i < clone.getElementsByClassName('media-body switch-md').length; i++) {
                clone.getElementsByClassName('media-body switch-md')[i].classList.add('switch-md-print');
            }
        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }

        if (document.getElementById('CV') != null || document.getElementById('CV') != undefined) {

            if (document.getElementsByClassName('col-xxl-4 col-ed-4 col-xl-4 box-col-4').length > 0) {
                for (let i = 0; i < document.getElementsByClassName('col-xxl-4 col-ed-4 col-xl-4 box-col-4').length; i++) {
                    if (document.getElementsByClassName('col-xxl-4 col-ed-4 col-xl-4 box-col-4')[i].getElementsByClassName('card height-equal').length > 0) {
                        document.getElementsByClassName('col-xxl-4 col-ed-4 col-xl-4 box-col-4')[i].getElementsByClassName('card height-equal')[0].getElementsByClassName('card-header')[0].removeAttribute("class");
                        document.getElementsByClassName('col-xxl-4 col-ed-4 col-xl-4 box-col-4')[i].getElementsByClassName('card height-equal')[0].getElementsByClassName('header-top')[0].setAttribute('style', 'display:none');
                    }
                }
            }
        }
        if (clone.getElementsByClassName('apexcharts-tooltip-marker').length > 0) {
            for (let i = 0; i < clone.getElementsByClassName('apexcharts-tooltip-marker').length; i++) {
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].classList.remove();
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].setAttribute("style", "");
            }
        }
        if (clone.getElementsByClassName('apexcharts-tooltip apexcharts-theme-light').length > 0) {
            for (let i = 0; i < clone.getElementsByClassName('apexcharts-tooltip apexcharts-theme-light').length; i++) {
                clone.getElementsByClassName('apexcharts-tooltip apexcharts-theme-light')[i].setAttribute("style", "display:none");

            }
        }
        var HTML = '<html><head><link href="https://app.wenodo.com/E_Content/plugins/fontawesome-free/css/all.min.css" rel="stylesheet"/><link href = "https://app.wenodo.com/E_Content/assets/css/plugins/animate.css" rel = "stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Content/Scripts/PI_Main"></script><script src="https://app.wenodo.com/E_Content/plugins/jquery/jquery.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script><script src="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet"><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.min.css" rel="stylesheet" /><link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" /><link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css" /><link href="https://app.wenodo.com/E_Content/CustomCss/wenodo-responsive.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/duotone.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/vendors/bootstrap.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/style.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/responsive.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/cropper.min.css" rel="stylesheet" /><script type="text/javascript" src="https://widget.gyde.ai/webintv2/owl.carousel.min.js" id="owlcarouselJs"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/bootstrap/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/simplebar.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/custom.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/chart/apex-chart/apex-chart.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/bootstrap-notify.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/index.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/animation/wow/wow.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/tooltip-init.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/script.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/height-equal.js"></script><script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script><script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script><script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/sweetalert2/sweetalert2.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script></head><body>' + clone.innerHTML + '</body></html>';
        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1350px";
        iframe.width = "1850px";

        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;
        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("p", "pt", [canvas.width, canvas.height]);//
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 10, 15, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)

            doc.save(FILE_NAME + '.pdf');
            node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
            document.getElementById("PI_Loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.PRINT_PDF_COVER = function (FLAG, ID, FILE_NAME) {
        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";
        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');

        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }
        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }


        var HTML = '<html><head><link href="https://app.wenodo.com/E_Content/plugins/fontawesome-free/css/all.min.css" rel="stylesheet"/><link href = "https://app.wenodo.com/E_Content/assets/css/plugins/animate.css" rel = "stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Content/Scripts/PI_Main"></script><script src="https://app.wenodo.com/E_Content/plugins/jquery/jquery.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script><script src="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet"><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.min.css" rel="stylesheet" /><link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" /><link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css" /><link href="https://app.wenodo.com/E_Content/CustomCss/wenodo-responsive.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/duotone.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/vendors/bootstrap.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/style.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/responsive.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/cropper.min.css" rel="stylesheet" /><script type="text/javascript" src="https://widget.gyde.ai/webintv2/owl.carousel.min.js" id="owlcarouselJs"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/bootstrap/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/simplebar.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/custom.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/chart/apex-chart/apex-chart.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/bootstrap-notify.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/index.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/animation/wow/wow.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/tooltip-init.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/script.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/height-equal.js"></script><script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script><script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script><script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/sweetalert2/sweetalert2.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script></head><body>' + clone.innerHTML + '</body></html>';

        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1450px";
        iframe.width = "1800px";


        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;


        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("p", "pt", [canvas.width, canvas.height]);//
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 10, 15, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)

            doc.save(FILE_NAME + '.pdf');
            node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
            document.getElementById("PI_Loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.PRINT_PDF_CV = function (FLAG, ID, FILE_NAME) {

        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";

        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');

        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }

        if (clone.getElementsByClassName('media-body switch-md').length > 0)
            for (let i = 0; i < clone.getElementsByClassName('media-body switch-md').length; i++) {
                clone.getElementsByClassName('media-body switch-md')[i].classList.add('switch-md-print');
            }
        if (clone.getElementsByClassName('apexcharts-legend apexcharts-align-center apx-legend-position-bottom').length > 0) {
            clone.getElementsByClassName('apexcharts-legend apexcharts-align-center apx-legend-position-bottom')[0].setAttribute("style","inset: auto 0px 1px; position: absolute; max-height: 100%")
        }
        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }

        if (clone.getElementsByClassName('apexcharts-tooltip-marker').length > 0) {
            for (let i = 0; i < clone.getElementsByClassName('apexcharts-tooltip-marker').length; i++) {
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].classList.remove();
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].setAttribute("style", "");
            }
        }


        var HTML = '<html><head><link href="https://app.wenodo.com/E_Content/plugins/fontawesome-free/css/all.min.css" rel="stylesheet"/><link href = "https://app.wenodo.com/E_Content/assets/css/plugins/animate.css" rel = "stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Content/Scripts/PI_Main"></script><script src="https://app.wenodo.com/E_Content/plugins/jquery/jquery.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script><script src="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet"><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.min.css" rel="stylesheet" /><link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" /><link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css" /><link href="https://app.wenodo.com/E_Content/CustomCss/wenodo-responsive.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/duotone.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/vendors/bootstrap.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/style.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/responsive.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/cropper.min.css" rel="stylesheet" /><script type="text/javascript" src="https://widget.gyde.ai/webintv2/owl.carousel.min.js" id="owlcarouselJs"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/bootstrap/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/simplebar.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/custom.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/chart/apex-chart/apex-chart.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/bootstrap-notify.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/index.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/animation/wow/wow.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/tooltip-init.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/script.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/height-equal.js"></script><script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script><script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script><script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/sweetalert2/sweetalert2.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script></head><body>' + clone.innerHTML + '</body></html>';

        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";

        if ($scope.HIDE_SHOW_FLAG_1 == undefined || $scope.HIDE_SHOW_FLAG_1 == false) {
            iframe.height = "1350px";
            iframe.width = "1850px";
        }
        else {
            iframe.height = "1350px";
            iframe.width = parseInt(document.getElementById("CV").offsetWidth) + 100 + "px";
        }

        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;


        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("p", "pt", [canvas.width, canvas.height]);//
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 10, 15, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)

            doc.save(FILE_NAME + '.pdf');
            node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
            document.getElementById("PI_Loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.PRINT_PDF_PF = function (FLAG, ID, FILE_NAME) {

        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";

        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');
        

        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }
        if (clone.getElementsByClassName('container-fluid').length > 0) {
            clone.getElementsByClassName('container-fluid')[1].classList.add("print-20");
            clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('table-responsive scrollbar-wrapper full-screen-height')[0].removeAttribute("class");
            clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('col-xxl-12 col-xl-12 col-md-12')[0].setAttribute('style', 'display:none'); 
        }
        if (clone.getElementsByClassName('table-header-fixed').length != 0 && clone.getElementsByClassName('table-header-fixed') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th').length; i++) {
                if (clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[i].innerText.trim() != "") {
                    clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[i].colSpan = 8;
                    clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[i].getElementsByTagName('i')[0].removeAttribute("class");
                    clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[i].getElementsByTagName('i')[1].removeAttribute("class");
                    //clone.getElementsByClassName('table-header-fixed')[0].getElementsByTagName('tr')[0].getElementsByTagName('th')[2].getElementsByTagName('i')[0].classList.add('fa-regular c-pointer txt-primary float-end mt-1');
                }
            }
        }
        if (clone.getElementsByClassName('media-body switch-md').length > 0)
            for (let i = 0; i < clone.getElementsByClassName('media-body switch-md').length; i++) {
                clone.getElementsByClassName('media-body switch-md')[i].classList.add('switch-md-print');
            }

        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }

        if (clone.getElementsByClassName('apexcharts-tooltip-marker').length > 0) {
            for (let i = 0; i < clone.getElementsByClassName('apexcharts-tooltip-marker').length; i++) {
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].classList.remove();
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].setAttribute("style", "");
            }
        }


        var HTML = '<html><head><link href="https://app.wenodo.com/E_Content/plugins/fontawesome-free/css/all.min.css" rel="stylesheet"/><link href = "https://app.wenodo.com/E_Content/assets/css/plugins/animate.css" rel = "stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Content/Scripts/PI_Main"></script><script src="https://app.wenodo.com/E_Content/plugins/jquery/jquery.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script><script src="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet"><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.min.css" rel="stylesheet" /><link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" /><link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css" /><link href="https://app.wenodo.com/E_Content/CustomCss/wenodo-responsive.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/duotone.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/vendors/bootstrap.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/style.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/responsive.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/cropper.min.css" rel="stylesheet" /><script type="text/javascript" src="https://widget.gyde.ai/webintv2/owl.carousel.min.js" id="owlcarouselJs"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/bootstrap/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/simplebar.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/custom.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/chart/apex-chart/apex-chart.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/bootstrap-notify.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/index.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/animation/wow/wow.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/tooltip-init.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/script.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/height-equal.js"></script><script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script><script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script><script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/sweetalert2/sweetalert2.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script></head><body>' + clone.innerHTML + '</body></html>';

        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1550px";
        iframe.width = "2850px";

        const width = $("#PF_TEMP").width();
        const height = $("#PF_TEMP").height();
        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;

        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("l", "pt", [canvas.width, canvas.height]);//
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio_1;
            doc.addImage(imgBase64, 'PNG', 0, 0, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)

            doc.save(FILE_NAME + '.pdf');
            node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
            document.getElementById("PI_Loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.PRINT_PDF_WA = function (FLAG, ID, FILE_NAME) {
        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";
        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');

        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }

        if (clone.getElementsByClassName('media-body switch-md').length > 0)
            for (let i = 0; i < clone.getElementsByClassName('media-body switch-md').length; i++) {
                clone.getElementsByClassName('media-body switch-md')[i].classList.add('switch-md-print');
            }

        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }

        if (clone.getElementsByClassName('apexcharts-tooltip-marker').length > 0) {
            for (let i = 0; i < clone.getElementsByClassName('apexcharts-tooltip-marker').length; i++) {
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].classList.remove();
                clone.getElementsByClassName('apexcharts-tooltip-marker')[i].setAttribute("style", "");
            }
        }



        //clone.getElementsByClassName('container-fluid')[0].getElementsByClassName('col-2 ms-auto mobile-none')[0].setAttribute("style", "display:none");
        //clone.getElementsByClassName('container-fluid')[0].getElementsByClassName('col-2 mobile-none')[1].setAttribute("style", "display:none");
        //clone.getElementsByClassName('container-fluid')[0].getElementsByClassName('col-3 mobile-none')[0].setAttribute("style", "display:none");
        //clone.getElementsByClassName('container-fluid')[0].getElementsByClassName('col-auto')[0].setAttribute("style", "display:none");

        var HTML = '<html><head><link href="https://app.wenodo.com/E_Content/plugins/fontawesome-free/css/all.min.css" rel="stylesheet"/><link href = "https://app.wenodo.com/E_Content/assets/css/plugins/animate.css" rel = "stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/css/OverlayScrollbars.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Content/Scripts/PI_Main"></script><script src="https://app.wenodo.com/E_Content/plugins/jquery/jquery.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/bootstrap/js/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/overlayScrollbars/js/jquery.overlayScrollbars.min.js"></script><script src="https://app.wenodo.com/AngularControllers/CommonMethod.js"></script><link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&amp;display=swap" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/fontawesome.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/Select2angularjs/select2.css" rel="stylesheet"><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/light.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/regular.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/solid.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/fontawesome-pro-6.5.1-web/css/brands.min.css" rel="stylesheet" /><link rel="stylesheet" href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/bootstrap/bootstrap.css" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.css" rel="stylesheet" /><link href=" https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/wenodo-style.css" /><link href="https://app.wenodo.com/E_Content/CustomCss/wenodo-responsive.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/HR/Vendors/Countries/intltelinput.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/MomentTimePicker/angular-moment-picker.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/croppie.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/light.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/regular.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/solid.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/fonts/fontawesome-pro-6.5.1-web/css/duotone.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Content/plugins/sweetalert2-theme-bootstrap-4/bootstrap-4.min.css" rel="stylesheet" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/vendors/bootstrap.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/style.css" /><link rel="stylesheet" type="text/css" href="https://app.wenodo.com/E_Content/CustomCss/PowerInsight/css/responsive.css" /><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" /><link href="https://app.wenodo.com/E_Content/plugins/croppie/cropper.min.css" rel="stylesheet" /><script type="text/javascript" src="https://widget.gyde.ai/webintv2/owl.carousel.min.js" id="owlcarouselJs"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/bootstrap/bootstrap.bundle.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/simplebar.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/scrollbar/custom.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/chart/apex-chart/apex-chart.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/bootstrap-notify.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/notify/index.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/animation/wow/wow.min.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/tooltip-init.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/script.js"></script><script src="https://app.wenodo.com/E_Scripts/PowerInsight/assets/js/height-equal.js"></script><script src="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/js/bootstrap-datepicker.js"></script><link href="https://app.wenodo.com/E_Scripts/bootstrap-datepicker-1.6.4-dist/css/bootstrap-datepicker3.min.css" rel="stylesheet" /><link href="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.css" rel="stylesheet" /><script src="https://app.wenodo.com/E_Scripts/daterangepicker-master/daterangepicker.js"></script><script type="text/javascript" src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/html2canvas.min.js"></script><script src="https://app.wenodo.com/E_Scripts/ExcelPdfJS/jspdf.min.js"></script><script src="https://app.wenodo.com/E_Content/plugins/sweetalert2/sweetalert2.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script></head><body>' + clone.innerHTML + '</body></html>';

        let iframe = document.createElement("iframe");
        iframe.style.visibility = "hidden";
        iframe.height = "1350px";
        iframe.width = "1850px";


        document.body.appendChild(iframe);
        let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
        iframedoc.body.innerHTML = HTML;


        html2canvas(iframedoc.body, { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            doc = new jsPDF("p", "pt", [canvas.width, canvas.height]);//
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio;
            doc.addImage(imgBase64, 'PNG', 10, 15, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)

            doc.save(FILE_NAME + '.pdf');
            node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
            document.getElementById("PI_Loader").style.display = "none";
            document.querySelectorAll('iframe').forEach(
                function (elem) {
                    elem.parentNode.removeChild(elem);
                });
        });
    };
    $scope.PRINT_PDF_PAGE = function (FLAG, ID, FILE_NAME) {

        window.scrollTo(0, 0);
        document.getElementById("PI_Loader").style.display = "block";
        const node = document.getElementById(ID);
        const clone = node.cloneNode(true);
        clone.getElementsByClassName('my-3')[0].removeAttribute('hidden');

        if (clone.getElementsByClassName('row sticky_pi_header').length > 0) {
            if (clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length > 0) {
                for (let i = 0; i < clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc').length; i++) {
                    clone.getElementsByClassName('row sticky_pi_header')[0].getElementsByClassName('print_pdf_doc')[i].setAttribute('style', 'display:none');
                }
            }
        }
        if (clone.getElementsByClassName('container-fluid').length > 0) {
            if (clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('card-body pt-0').length > 0 && clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('card-body pt-0')[0].getElementsByClassName('table-responsive').length > 0) {
                clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('card-body pt-0')[0].getElementsByClassName('table-responsive')[0].classList.remove("scrollbar-wrapper");
                clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('card-body pt-0')[0].getElementsByClassName('table-responsive')[0].classList.remove("daily_weekly_flash");
                // clone.getElementsByClassName('container-fluid')[1].getElementsByClassName('card-body pt-0')[0].getElementsByClassName('t-footer')[0].classList.add('table-header-fixed');
            }
        }
        if (clone.getElementsByClassName('media-body switch-md').length > 0)
            for (let i = 0; i < clone.getElementsByClassName('media-body switch-md').length; i++) {
                clone.getElementsByClassName('media-body switch-md')[i].classList.add('switch-md-print');
            }

        if (clone.getElementsByClassName('table-responsive').length != 0 && clone.getElementsByClassName('table-responsive') != undefined) {
            for (let i = 0; i < clone.getElementsByClassName('table-responsive').length; i++) {
                clone.getElementsByClassName('table-responsive')[i].classList.remove('full-screen-height');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('scrollbar-wrapper');
                clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl_height');
                clone.getElementsByClassName('table-responsive')[i].setAttribute("style", "");
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('full-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('full-height');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('mx-height-400')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('mx-height-400');
                }
                if (clone.getElementsByClassName('table-responsive')[i].classList.contains('weekly_pandl-height')) {
                    clone.getElementsByClassName('table-responsive')[i].classList.remove('weekly_pandl-height');
                }
            }
        }
        if (FILE_NAME == "Staff Cost" && $scope.HIDE_SHOW_FLAG_1 == true) {
            clone.getElementsByClassName("cardFront")[0].remove();
        } 

        var htmlWidth = $("#" + ID).width();
        var htmlHeight = $("#" + ID).height();
        var pdfWidth = htmlWidth + (15 * 2);
        var pdfHeight = (pdfWidth * 1.5) + (15 * 2);
        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            var doc = "";
            if (FILE_NAME == "Staff_Food_Cost" || FILE_NAME == "Sales_Summary" || FILE_NAME == "Staff Summary") {
                doc = new jsPDF("p", "pt", [647.333, 647.031]);
            }
            else if (FILE_NAME == "Menu_Profitability") {
                if ($scope.HIDE_SHOW_FLAG_1 == undefined || $scope.HIDE_SHOW_FLAG_1 == false) { doc = new jsPDF("p", "pt", [647.333, 647.031]); }
                else { doc = new jsPDF("p", "pt", [canvas.width, canvas.height]); }
            }
            else
                doc = new jsPDF("p", "pt", [canvas.width, canvas.height]);//doc = new jsPDF("p", "pt",[pdfWidth,htmlHeight]);

            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            const ratio_1 = heightRatio > widthRatio ? widthRatio : heightRatio;
            const canvasWidth = canvas.width * ratio_1;
            doc.addImage(imgBase64, 'PNG', 8, 15, canvasWidth - 10, canvasHeight); //(img,Left,Top,Width,Height)
            doc.save(FILE_NAME + '.pdf');
            document.getElementById("PI_Loader").style.display = "none";
        });
        node.getElementsByClassName('my-3')[0].setAttribute("style", "hidden");
        document.body.removeChild(clone);
    };

    $scope.addDays = function (date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.Fn_CURRENCY_CULTURE = function (Number) {
        //text = new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number);
        return Number;
    };
    $scope.NUMBER_WITH_COMMAS = function (x) {
        if (x == undefined) {
            return '';
        }
        else {
            return $scope.Fn_CURRENCY_CULTURE(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        }
    };
    $scope.Fn_FLIP = function (flipA, flipB, index, HIDE_SHOW_FLAG, FLAG, CATEGORY) {

        if (FLAG == 1) {
            $scope.HIDE_SHOW_FLAG_1 = !HIDE_SHOW_FLAG;
        }
        else if (FLAG == 2) {
            $scope.HIDE_SHOW_FLAG_2 = !HIDE_SHOW_FLAG;
        }
        else if (FLAG == 3) {
            $scope.HIDE_SHOW_FLAG_3 = !HIDE_SHOW_FLAG;
        } else if (FLAG == 4) {
            $scope.HIDE_SHOW_FLAG_4 = !HIDE_SHOW_FLAG;
        } else if (FLAG == 5) {
            $scope.HIDE_SHOW_FLAG_5 = !HIDE_SHOW_FLAG;
        }
        else if (FLAG == 6) {
            CATEGORY.HIDE_SHOW_FLAG = !CATEGORY.HIDE_SHOW_FLAG;
        }
        //   $(".tooltip").remove();
        if (index != undefined && index != 0) {
            flipA = flipA + index;
            flipB = flipB + index;
        };
        const compsfront = document.getElementById(flipA);
        const compsback = document.getElementById(flipB);
        compsfront.classList.toggle('flipped');
        compsback.classList.toggle('flipped');

        $('[data-bs-toggle="tooltip"]').tooltip();
        $('[data-bs-toggle="popover"]').popover();

    };
    $scope.TOOLTIP_ENABLE_Fn = function () {
        $('[data-bs-toggle="tooltip"]').tooltip();
        $('[data-bs-toggle="popover"]').popover();
    }
    $scope.TOOLTIPLEAVE_Fn = function () {
        // $(".tooltip").dispose();
    }
    $scope.TOOLTIPENTER_Fn = function () {
        // $(".tooltip").toggle();
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

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $('[data-bs-toggle="tooltip"]').tooltip();
        $('[data-bs-toggle="popover"]').popover();
    });

    $scope.$on('ngRepeatFinishedequalizerRender', function (ngRepeatFinishedEvent) {
        setTimeout(() => {
            $scope.EQUALIZER();
        }, 1000); // 1000 milliseconds = 1 second
       

        $('[data-bs-toggle="tooltip"]').tooltip();
        $('[data-bs-toggle="popover"]').popover();
        //$page_title = $(".page-title");
        if ($nav.hasClass("close_icon")) {
        } else {
            $page_title = $(".page-title");
            $page_title.removeClass("close_icon");
        };
    });
});
$(document).on("click", ".DontHideOnClick", function (event) {
    event.stopPropagation();
});


