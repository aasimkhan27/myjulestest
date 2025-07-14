app.controller('RevenueController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.RIGHT_ASIDE_OPEN = function (ASIDE_NAME) {
        document.getElementById(ASIDE_NAME).style.width = "60%";
        document.getElementById(ASIDE_NAME).style.zIndex = "1050";
        $('.side-backdrop').addClass('side-backdrop show').removeClass('hide');

    };
    $scope.RIGHT_ASIDE_CLOSE = function (ASIDE_NAME) {
        document.getElementById(ASIDE_NAME).style.width = "0";
        document.getElementById(ASIDE_NAME).style.zIndex = "-1";
        $('.side-backdrop').removeClass('show').addClass('hide');
    };

    $scope.PAGE_LOAD = function () {
        $scope.TAB_FLAG = 2;
        $scope.TAB_FLAG_GROSS_REVENUE = 2;
        $scope.TAB_FLAG_GROUPED_SALES = 2;
    }
    $scope.PAGE_LOAD();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.InventorySearch = {
        TOTAL_GUEST_AVERAGE_SPEND: true,
    };
    $scope.TAB_CLICK_SHDL_FY = function (FLAG) {
        $scope.TAB_FLAG = FLAG
    }
    $scope.TAB_CLICK_SHDL_GROSS_REVENUE_FY = function (FLAG) {
        $scope.TAB_FLAG_GROSS_REVENUE = FLAG
    }
    $scope.TAB_CLICK_SHDL_TAB_FLAG_GROUPED_SALES_FY = function (FLAG) {
        $scope.TAB_FLAG_GROUPED_SALES = FLAG
        $scope.FILL_GRPAH($scope.ALL_REVENUE_OBJ);
    }
    $scope.CHANGE_TAB = function (T) {
        if ($scope.InventorySearch[T] == true) {
            $scope.InventorySearch[T] = false;
        }
        else if ($scope.InventorySearch[T] == false) {
            $scope.InventorySearch[T] = true;
        }
    };
    $scope.RevenueSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        chart_1_baseChartMessageFont: "Arial",
        chart_1_baseChartMessageFontSize: "50",
        chart_1_baseChartMessageColor: "#FC0000",

        chart_1_dataLoadStartMessage: "Retrieving data. Please wait.",
        chart_1_dataLoadErrorMessage: "Error in loading data.",
        chart_1_dataInvalidMessage: "Invalid data.",
        chart_1_dataEmptyMessage: "No data to found.",
        chart_1_typeNotSupportedMessage: "Chart type not supported.",
        chart_1_loadMessage: "Loading chart. Please wait.",
        chart_1_renderErrorMessage: "Unable to render chart.",

    };
    $scope.RESET_GET_REVENUE_ANALYTICS = function () {
        $scope.RevenueSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            START_DATE: "",
            END_DATE: "",
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),

            chart_1_baseChartMessageFont: "Arial",
            chart_1_baseChartMessageFontSize: "50",
            chart_1_baseChartMessageColor: "#FC0000",

            chart_1_dataLoadStartMessage: "Retrieving data. Please wait.",
            chart_1_dataLoadErrorMessage: "Error in loading data.",
            chart_1_dataInvalidMessage: "Invalid data.",
            chart_1_dataEmptyMessage: "No data to found.",
            chart_1_typeNotSupportedMessage: "Chart type not supported.",
            chart_1_loadMessage: "Loading chart. Please wait.",
            chart_1_renderErrorMessage: "Unable to render chart.",
        };
        $scope.BRANCH_LIST = [];
        $scope.PAGE_LOAG();
        $scope.ENTITY_CHANGE_FY(1);
    }
    $scope.GROSS_REVENUE_DATASOURCE_SALES = {
    };
    $scope.GROSS_REVENUE_DATASOURCE_COVERS = {};
    $scope.REVENUE_BY_CATEGORY = {}
    $scope.TOTAL_GUEST_AVERAGE_SPEND = {};
    $scope.GROUPED_SALES = {};
    $scope.REVENUE_AREACHART = {};
    $scope.CHART_1_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";
    //$scope.CHART_2_COLOR_OLD = "#0888c3,#5fb5ed,#86c8f3,#45b5c3,#7fccaa,#9de1ac,#6592b2,#7faccc,#a6bbcb";
    $scope.CHART_2_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";
    $scope.REVENUE_BY_CATEGORY_COLOR = "#264478,#70ad47,#ffc000,#5b9bd5,#a5a5a5,#ed7d31";

    $scope.CHART_2_LINE_COLOR = "#eb4f01,#12ff00,#003a76";

    $scope.AVERAGE_SPEND = "#11b09b,#5fb5ed,#7699b2";
    $scope.AVERAGE_LINE_SPEND = "#eb4f01,#12ff00,#003a76,#65b290,#7fccaa,#b2ffdd,#6592b2,#7faccc,#b2dfff";
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));
        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        };
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        };
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.RevenueSearch.START_DATE = $scope.start_date;
        $scope.RevenueSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })
        $scope.PAGE_LOAD();

        $scope.GET_REVENUE_ANALYTICS();
    };
    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            var day = addDays(new Date(data.data), -6);
            $scope.DATE_WEEK_PICKER_DRDA(new Date(day));
        });
    };

    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next, 2);
        });
        set_week_picker(date, 1);
    };

    $scope.FILL_GRPAH = function (data) {

        $scope.GROSS_REVENUE_DATASOURCE_SALES = {};
        $scope.GROSS_REVENUE_DATASOURCE_COVERS = {};
        $scope.REVENUE_BY_CATEGORY = {}
        $scope.TOTAL_GUEST_AVERAGE_SPEND = {};
        $scope.GROUPED_SALES = {};
        $scope.REVENUE_AREACHART = {};
        $scope.WeekDayList = data.data.WeekDayList
        $scope.LABEL_WEEK = Array.prototype.map.call((data.data.WeekDayList.filter(function (x) { return x.SHORT_NAME != null })), function (x) { return x.SHORT_NAME });
        $scope.GROSS_REVENUE_CHART_1(data.data.GrossRevenue_Chart1_Data);//
        $scope.GROSS_REVENUE_CHART_2(data.data.GrossRevenue_Chart2_DataSet, data.data.GrossRevenue_Chart2_LineSet);


        data.data.GroupedSales_DataSet.filter(function (x) {
            //x.borderColor = "#11b09b";
            //x.backgroundColor = "#11b09b";
            //x.barThickness = 30;
            //x.maxBarThickness = 40;
            x.minBarLength = 2;
            x.accentFadedColor = "#cccccc"
            x.accentColor = "#11b09b"
        })

        $scope.GROUPED_SALES_FY(data.data.GroupedSales_DataSet, data.data.GroupedSales_DataSet, $scope.LABEL_WEEK);
        $scope.REVENUE_BY_CATEGORY_FY(data.data.RevenueByCategory_DataSet, data.data.CW_Total_Net_Revenue);
        $scope.TOTAL_GUEST_AVERAGE_SPEND_FY(data.data.AverageSpendChartDataSet, data.data.Covers_LineSet);
        $scope.REVENUE_AREACHART_FY(data.data.RevenueAreaChartObject.Amount, data.data.RevenueAreaChartObject.Labels);
    }
    $scope.GROSSREVENUE_CHART1_DATA = [];
    $scope.GET_REVENUE_ANALYTICS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.RevenueSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.RevenueSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.RevenueSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.RevenueSearch.END_DATE)).toDateString();
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_REVENUE_ANALYTICS').then(function (data) {
            if (data.data == null || data.data.GrossRevenue_Chart1_Data != undefined && data.data.GrossRevenue_Chart1_Data.length == 0) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
                $scope.GROSSREVENUE_CHART1_DATA = data.data.GrossRevenue_Chart1_Data;
            }
            if (data.data != null) {
                $scope.ALL_REVENUE_OBJ = data;
                $scope.GROSSREVENUE_CHART1_DATA = data.data.GrossRevenue_Chart1_Data;
                $scope.VOID_REVENUE_OBJ = data.data.Void;
                $scope.GP_REVENUE_SPLIT = data.data.GPRevenueSplit;
                $scope.COMPLEMENTRY_REVENUE_OBJ = data.data.Complementry;
                $scope.SPH_OBJ = data.data.SPH;
                $scope.TRANSACTIONCOUNT_REVENUE_OBJ = data.data.TransactionCount;
                $scope.GROSS_REVENUE_OBJ = data.data.GrossRevenueObj;
                $scope.GROSS_PROFIT_OBJ = data.data.GrossProfitObj;
                $scope.LABOUR_COST_OBJ = data.data.LabourCostObj;
                $scope.GUEST_DETAILS_OBJ = data.data.GuestDetailsObj;
                $scope.WEEKLY_NET_REVENUE_OBJ = data.data.WeeklyNetRevenueObj;
                $scope.REVENUE_COMPARISION_OBJ = data.data.RevenueComparisionObj;

                $scope.FILL_GRPAH(data);
                $scope.$parent.overlay_loadingNew = "none"
                $scope.$parent.COMMON_CODE_CHANGE();
            };
        });
    }

    $scope.WEEK_LIST = [{ label: "Mon" }, { label: "Tue" }, { label: "Wed" }, { label: "Thu" }, { label: "Fri" }, { label: "Sat" }, { label: "Sun" }];

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.RevenueSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.RevenueSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.RevenueSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_REVENUE_ANALYTICS();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);
    $scope.LAND_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.RevenueSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.RevenueSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_REVENUE_ANALYTICS();
    }

    $scope.GROSS_REVENUE_CHART_1 = function (dataset) {
        //var GROSS_REVENUE_DATASOURCE_SALES_ID_VAR = FusionCharts("GROSS_REVENUE_DATASOURCE_SALES_CHARTID");
        //if (GROSS_REVENUE_DATASOURCE_SALES_ID_VAR) {
        //    FusionCharts("GROSS_REVENUE_DATASOURCE_SALES_CHARTID").dispose();
        //};

        $scope.chart1Dataset = dataset;
        $scope.GROSS_REVENUE_DATASOURCE_SALES = {
            chart: {
                caption: "Sales",
                "baseFontSize": "11",
                "captionFontSize": "14",
                dataLoadStartMessage: 'Retrieving data. Please wait.',
                "width": "100%",
                "height": "100%",
                //  dataEmptyMessage: "ji",
                //subcaption: "In Million $",
                //pyaxisname: "Covers",
                //"baseFont": "Verdana",
                //"baseFontSize": "11",
                //"baseFontColor": "#0066cc"
                paletteColors: $scope.CHART_1_COLOR,
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                "decimals": "0",
                //xaxisname: "Year",
                yaxisname: "Revenue (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                plotPaddingPercent: 10,
                //numbersuffix: "M",
                //showsum: "1",
                showBorder: "1",
                //"showPlotBorder": "1",
                labelDisplay: "none",
                "legendItemFontSize": "12",
                "borderColor": "#CCCCCC",
                // "borderThickness": "4",
                //"borderAlpha": "80",
                palette: "3",
                //plottooltext:
                //    "Revenue from <b>$seriesName</b> in $label was <b>$dataValue</b>",
                "theme": "fusion"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: dataset//[{ "dataset": [{ "seriesname": "BREAKFAST(CW)", "data": [{ "value": "368" }, { "value": "1923" }, { "value": "845" }, { "value": "2992" }, { "value": "242" }, { "value": "2729" }, { "value": "638" }] }, { "seriesname": "LUNCH(CW)", "data": [{ "value": "1784" }, { "value": "2109" }, { "value": "3075" }, { "value": "2373" }, { "value": "2460" }, { "value": "3980" }, { "value": "1367" }] }, { "seriesname": "DINNER(CW)", "data": [{ "value": "1801" }, { "value": "3296" }, { "value": "5157" }, { "value": "4523" }, { "value": "2558" }, { "value": "1264" }, { "value": "228" }] }] }, { "dataset": [{ "seriesname": "BREAKFAST(LW)", "data": [{ "value": "631" }, { "value": "599" }, { "value": "438" }, { "value": "5132" }, { "value": "1009" }, { "value": "2367" }, { "value": "697" }] }, { "seriesname": "LUNCH(LW)", "data": [{ "value": "1418" }, { "value": "2855" }, { "value": "3190" }, { "value": "2743" }, { "value": "2643" }, { "value": "8584" }, { "value": "2094" }] }, { "seriesname": "DINNER(LW)", "data": [{ "value": "1442" }, { "value": "2722" }, { "value": "5135" }, { "value": "5119" }, { "value": "3429" }, { "value": "3435" }, { "value": "30" }] }] }, { "dataset": [{ "seriesname": "BREAKFAST(LY)", "data": [{ "value": "143" }, { "value": "393" }, { "value": "197" }, { "value": "485" }, { "value": "905" }, { "value": "1628" }, { "value": "845" }] }, { "seriesname": "LUNCH(LY)", "data": [{ "value": "1946" }, { "value": "3046" }, { "value": "11132" }, { "value": "4244" }, { "value": "2836" }, { "value": "6088" }, { "value": "6898" }] }, { "seriesname": "DINNER(LY)", "data": [{ "value": "1891" }, { "value": "3052" }, { "value": "2009" }, { "value": "4338" }, { "value": "3756" }, { "value": "2760" }, { "value": "656" }] }] }],

        };
    }
    var GROSS_REVENUE_DATASOURCE_COVERS_ID_VAR = "";
    $scope.GROSS_REVENUE_CHART_2 = function (dataset, lineset) {
        GROSS_REVENUE_DATASOURCE_COVERS_ID_VAR = FusionCharts("GROSS_REVENUE_DATASOURCE_COVERS_ID");
        if (GROSS_REVENUE_DATASOURCE_COVERS_ID_VAR) {
            FusionCharts("GROSS_REVENUE_DATASOURCE_COVERS_ID").dispose();
        };

        $scope.GROSS_REVENUE_DATASOURCE_COVERS = {
            chart: {
                caption: "Covers Vs SPH",
                "baseFontSize": "11",
                "captionFontSize": "14",
                "placevaluesinside": "1",
                "width": "100%",
                "height": "500%",
                //"showvalues": "1",
                //subcaption: "In Million $",
                //pyaxisname: "Covers",
                //"baseFont": "Verdana",
                //"baseFontSize": "11",
                //"baseFontColor": "#0066cc"
                paletteColors: $scope.CHART_2_COLOR,

                "legendItemFontSize": "12",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50 ,valueBgColor=#ff0000, valueBorderColor=#3a4660, valueFontColor=#000000",
                "decimals": "2",
                //xaxisname: "Year",
                //yaxisname: "Covers",
                "pYAxisName": "Covers",
                "sYAxisName": "SPH (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                snumberprefix: $cookies.get("CURRENCY_SYMBOL"),
                // numberprefix: "$",
                //numbersuffix: "M",
                showsum: "1",
                showBorder: "1",
                "borderColor": "#CCCCCC",
                "legendNumRows": "2",
                plotPaddingPercent: 10,
                //"showPlotBorder": "1",
                labelDisplay: "none",
                // drawcrossline: "1",
                divlinealpha: "20",
                //"borderColor": "#ffcd41",
                //  "borderThickness": "4", 
                //"borderAlpha": "80",
                //palette: "3",
                //plottooltext:
                //    "Revenue from <b>$seriesName</b> in $label was <b>$dataValue</b>",
                // "drawAnchors": "1",
                // "anchorRadius": "2",
                //"anchorBorderThickness": "1",
                //drawcrossline: "1",//show all tooltip 
                "lineThickness": "2",
                // "anchorBorderColor": "#127fcb",
                //    "anchorSides": "1",
                //  "anchorBgColor": "#d3f7ff",

                //"divlineColor": "#999999",
                //"divLineIsDashed": "1",
                //"divLineDashLen": "1",
                //"divLineGapLen": "1",
                columnHoverAlpha: 100,
                "theme": "fusion"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: dataset,
            lineset: lineset,
        };

    }

    $scope.CURRENCY_CULTURE_FY = function (Number) {
        text = new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number);
        return text;
    };
    var numberWithCommas = function (x) {
        return $scope.CURRENCY_CULTURE_FY(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    };
    Chart.pluginService.register({
        beforeDraw: function (chart) {
            if (chart.config.options.elements.center) {
                chart.ctx.clearRect(0, 0, chart.width, chart.height);
                delete Chart.instances[this.id];
                var ctx = chart.chart.ctx;
                var centerConfig = chart.config.options.elements.center;
                var widthRatio = ((chart.innerRadius * 2) - (((centerConfig.sidePadding || 20) / 100) * (chart.innerRadius * 2))) / (ctx.measureText(centerConfig.text).width);
                ctx.fillStyle = centerConfig.color || '#2f6482';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                //  ctx.font = Math.min(Math.floor(9 * widthRatio), (chart.innerRadius * 2)) + "px " + (centerConfig.fontStyle || 'Arial');
                ctx.font = Math.min(Math.floor(13), (chart.innerRadius * 2)) + "px " + (centerConfig.fontStyle || 'Arial');
                ctx.fillText(centerConfig.text, ((chart.chartArea.left + chart.chartArea.right) / 2), ((chart.chartArea.top + chart.chartArea.bottom) / 2));
            }
        }
    });
    $scope.totaldata_Session = 0;
    $scope.data_Revenue = [];
    $scope.labels_Revenue = [];
    $scope.REVENUE_BY_CATEGORY_FY = function (Dbdata, TOTAL) {
        $scope.colours_Revenue = ["#4fb5b8", "#f8966b", "#4491fb", "#AE275F", "#e7d81f", "#ed7d31"];
        $scope.totaldata_Session = TOTAL;
        $scope.labels_Revenue = Array.prototype.map.call(((Dbdata)), function (x) { return x.label });
        $scope.data_Revenue = Array.prototype.map.call(((Dbdata)), function (x) { return parseFloat(x.value) });
        // $scope.colours_Revenue = Array.prototype.map.call(((Dbdata)), function (x) { return $scope.colours_Revenue(index) });
        $scope.options_Revenue = {
            elements: {
                center: {
                    text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Session),
                }
            },
            layout: {
                autoPadding: true,
            },
            //title: {
            //    position: 'bottom',
            //    display: true,
            //    text: 'Revenue by Category',
            //    fontSize: 20
            //},
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            tooltips: {
                mode: 'label',
                callbacks: {
                    label: function (tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                    }
                }
            },
            legend: {
                display: true,
                position: 'right',
                fullWidth: true,
                labels: {
                    fontColor: '#000',
                    fontSize: 12,
                    boxWidth: 20
                }
            },
            plugins: {
                legend: true,
                title: {
                    display: true,
                    text: ''
                },
                outlabels: {
                    display: false,
                    text: '%l %v',
                    color: '#000',
                    backgroundColor: '#fff',
                    stretch: 35,
                    font: {
                        resizable: true,
                        minSize: 12,
                        maxSize: 18,
                    },
                },
                datalabels: {
                    formatter: (value, ctx) => {
                        let datasets = ctx.chart.data.datasets;
                        if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
                            let percentage = Math.round((value / $scope.totaldata_Session) * 100) + '%';
                            return percentage;
                        } else {
                            return percentage;
                        }
                    },
                    color: '#fff',
                },
            }
        }
        //$scope.REVENUE_BY_CATEGORY = {
        //    "chart": {
        //        "caption": "Revenue by Category",
        //        "captionFontSize": "14",
        //        //"subCaption": "Last year",
        //        "numberPrefix": $cookies.get("CURRENCY_SYMBOL"),
        //        "bgColor": "#ffffff",
        //        "startingAngle": "310",
        //        "legendItemFontSize": "12",
        //        "showLegend": "1",
        //        "defaultCenterLabel": "Total revenue: " + $cookies.get("CURRENCY_SYMBOL") + " " + TOTAL,
        //        "labelDisplay ": "none",
        //        "centerLabel": "Revenue from $label: $value",
        //        "centerLabelBold": "1",
        //        "showTooltip": "1",
        //        "decimals": "0",
        //        "doughnutRadius": "80%",
        //        "theme": "fusion",
        //        "divlinealpha": "0",
        //        paletteColors: $scope.REVENUE_BY_CATEGORY_COLOR,

        //    },
        //    "data": data
        //};
    }

    $scope.TOTAL_GUEST_AVERAGE_SPEND_FY = function (Dataset, lineset) {
        $scope.TOTAL_GUEST_AVERAGE_SPEND = {
            chart: {
                //caption: "Total Guest & Average Spend",
                "baseFontSize": "11",
                //subcaption: "2011 - 2016",
                "captionFontSize": "14",
                pyaxisname: "Average Spend (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "sYAxisName": "Guest",
                "legendItemFontSize": "12",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50 ,valueBgColor=#ff0000, valueBorderColor=#3a4660, valueFontColor=#000000",
                //syaxisname: "% of total market share",
                //syaxismaxvalue: "25",
                theme: "fusion",
                //ynumberprefix: $cookies.get("CURRENCY_SYMBOL"),
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                // snumbersuffix: $cookies.get("CURRENCY_SYMBOL"),
                "paletteColors": $scope.AVERAGE_SPEND,
                showvalues: "0",
                showsum: "1",
                showBorder: "0",
                "lineThickness": "1",
                "borderColor": "#CCCCCC",
                // drawcrossline: "1",
                divlinealpha: "20",
                plotPaddingPercent: 10,
                "decimals": "0"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: Dataset,
            lineset: lineset,

        };
    }
    function commarize(value) {
        if (value >= 1000000000 || value <= -1000000000) {
            var B = value / 1e9
            if (parseFloat(B) < 0) {
                B = '(' + parseFloat(B) * -1 + ')';
            }
            return B + 'B';
        } else if (value >= 1000000 || value <= -1000000) {
            var M = value / 1e6
            if (parseFloat(M) < 0) {
                M = '(' + parseFloat(M) * -1 + ')';
            }
            return M + 'M';
        } else if (value >= 1000 || value <= -1000) {
            var K = value / 1e3;
            if (parseFloat(K) < 0) {
                K = '(' + parseFloat(K) * -1 + ')';
            }
            return K + 'K';
        }
        return value;
    }
    var myChart;

    $scope.REVENUE_AREACHART_FY = function (data, Labels) {
        //document.getElementById("chartContainer").innerHTML = '&nbsp;';
        //document.getElementById("chartContainer").innerHTML = '';
        var datasets = [];
        var dataset = new Object();
        dataset.data = data;
        dataset.borderColor = "#dce6ec";
        dataset.backgroundColor = '#77c3f4';
        dataset.fill = true;
        dataset.label = "Net Sales: ";
        dataset.stack = 1;
        dataset.pointRadius = 0;
        datasets.push(dataset);

        const canvasBackgroundColor = {
            id: 'canvasBackgroundColor',
            beforeDraw(chart, args, pluginOptions) {
                const { ctx,
                    chartArea: { top, bottom, left, right, width },
                    scales: { x, y }
                } = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                var chartArea = chart.chartArea;
                ctx.fillStyle = '#45aef1';
                ctx.fillRect(0, chartArea.top, chart.width, chartArea.bottom);
                ctx.restore();
            }
        }
        var min_value = Math.min.apply(Math, data.map(function (item) { return item; }));
        min_value = min_value > 2000 ? min_value - 1000 : 0;
        var config = {
            type: 'line',
            data: {
                labels: Labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                y: {
                    beginAtZero: true
                },
                maintainAspectRatio: false,
                //title: {
                //    display: true,
                //    labelString: 'Week #',
                //    text: $scope.LABEL_TITLE
                //},
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    displayColors: true,
                    boxWidth: "",
                    mode: 'label',
                    callbacks: {
                        title: function (context) {
                            return $filter('date')(new Date(context[0].label));
                        },
                        label: function (context) {
                            let label = '  ' + datasets[context.datasetIndex].label;
                            if (label) {
                                label += ': ';
                            }
                            if (context.value !== null) {
                                label += $cookies.get("CURRENCY_SYMBOL") + ' ' + $filter('numberformatter')(parseFloat(context.value), false, 0).toLocaleString('en-US', { minimumFractionDigits: 2 });
                            }
                            return label;
                        }
                    },
                },
                scales: {

                    xAxes: [{
                        display: false,
                        //scaleLabel: {
                        //    display: true,
                        //    labelString: 'Week #'
                        //},
                        //ticks: {
                        //    callback: function (value, index, array) {
                        //        return (value);
                        //    }
                        //}
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            min: min_value
                        }
                        // scaleLabel: {
                        //    display: true,
                        //    labelString: $cookies.get("CURRENCY_SYMBOL") + ' Amount'
                        //},
                        //ticks: {
                        //    callback: function (value, index, array) {
                        //        return commarize(value);
                        //    }
                        //}
                    }]
                },
                plugins: {
                    datalabels: {
                        display: false
                    }, scale: {
                        ticks: {
                            display: false,
                        },
                    }
                }
            },
            plugins: [canvasBackgroundColor]
        };
        if (myChart instanceof Chart) {
            myChart.destroy();
        }
        var ctx = document.getElementById("kt_chartjs_2").getContext("2d");
        myChart = new Chart(ctx, config);
    }

    var GROUPED_SALES_BAR_VAR;
    $scope.GROUPED_SALES_FY = function (dataset, Newdatasets, labels) {
        
        if (GROUPED_SALES_BAR_VAR) {
            GROUPED_SALES_BAR_VAR.destroy();
        }
        let HoverOver = undefined;
        const hoverSegment = {
            id: 'hoverSegment',
            beforeDatasetsDraw(chart, args, plugins) {
                const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
                ctx.save();
                ctx.fillStyle = 'rgba(0,0,0,0.05)';
                console.log(args);
                //if (HoverOver != undefined) {
                ctx.fillRect(top, left, 20, 100);
                //}
            },
            afterEvent(chart, args, pluging) {
                const { ctx, chartArea: { top, bottom, left, right, width, height }, scales: { x, y } } = chart;
                //console.log(args);
                HoverOver = 10;
                args.changed = true;
            }
        }
        GROUPED_SALES_BAR_VAR = new Chart(document.getElementById("GROUPED_SALES_BAR"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: Newdatasets
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                categoryPercentage: 0.8,
                barPercentage: 0.1,
                layout: {
                    padding: 50,
                },
                animation: {
                    duration: 10,
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                    }
                },
                tooltips: {
                    mode: 'label',
                    onHover: function (e, legendItem) {
                       // alert()
                    },
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return $cookies.get("CURRENCY_SYMBOL") + ' ' + $scope.CURRENCY_CULTURE_FY(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) + ' ' + data.datasets[tooltipItem.datasetIndex].label;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: false,
                        scaleLabel: {
                            display: true,
                            labelString: 'Weeks'
                        }, ticks: {
                            callback: function (value, index, array) {
                                return commarize(value);
                            }
                        },
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Sales (' + $cookies.get("CURRENCY_SYMBOL") + ')'
                        },
                        ticks: {
                            callback: function (value, index, array) {
                                return commarize(value);
                            }
                        },
                        stacked: false,
                        barPercentage: 0.5,
                        barThickness: 6,
                        maxBarThickness: 8,
                        minBarLength: 2,
                    }],
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    //onHover: function (e, legendItem) {
                    //    if (GROUPED_SALES_BAR_VAR.hoveringLegendIndex != legendItem.datasetIndex) {
                    //        GROUPED_SALES_BAR_VAR.hoveringLegendIndex = legendItem.datasetIndex
                    //        for (var i = 0; i < GROUPED_SALES_BAR_VAR.data.datasets.length; i++) {
                    //            var dataset = GROUPED_SALES_BAR_VAR.data.datasets[i]
                    //            if (i == legendItem.datasetIndex) {
                    //                dataset.backgroundColor = dataset.accentFadedColor
                    //            } else {
                    //                dataset.backgroundColor = dataset.accentColor
                    //            }
                    //        }
                    //        GROUPED_SALES_BAR_VAR.update()
                    //    }
                    //},
                    labels: {
                        fontSize: 10,
                        generateLabels: function (chart) {
                            return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                                return i <= 3;
                            });
                        }
                    },
                },
                plugins: {
                    datalabels: {
                        display: false,
                        color: '#273746 ',
                        align: 'top',
                        anchor: 'end',
                        formatter: function (value, context) {
                            console.log(context)
                            if (value > 0)
                                return $cookies.get("CURRENCY_SYMBOL") + parseInt(value);
                            else
                                return "";
                        },
                        font: {
                            weight: 'bold',
                            size: 10,
                        }
                    }
                }
            },
            //plugins: [hoverSegment]
        });


        //$scope.GROUPED_SALES = {
        //    chart: {
        //        "caption": "Sales",
        //        "captionFontSize": "14",
        //        //subcaption: "2012-2016",
        //        xaxisname: "Years",
        //        "legendItemFontSize": "12",
        //        //yaxisname: "Total number of apps in store",
        //        "yAxisName": "Sales (" + $cookies.get("CURRENCY_SYMBOL") + ")",
        //        "plotHighlightEffect": "fadeout|anchorBgColor=ff0000, anchorBgAlpha=50",
        //        formatnumberscale: "1",
        //        plotPaddingPercent: 10,
        //        "plotBorderThickness": "5",
        //        "lineThickness": "2",
        //        plottooltext:
        //            "<b>$dataValue</b>  <b>$seriesName</b> in $label",
        //        "theme": "fusion",
        //        drawcrossline: "1",
        //        "paletteColors": "#11b09b,#5fb5ed,#7699b2",
        //    },
        //    categories: [
        //        {
        //            category: $scope.WEEK_LIST
        //        }
        //    ],
        //    dataset: dataset,
        //};
    }

    $scope.REVENUE_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("REVENUE_PDF");
            node.getElementsByClassName('my-3')[0].removeAttribute('hidden');
            html2canvas(node, { useCORS: true, scale: 2 }).then(function (canvas) {
                var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
                var doc = new jsPDF("p", "mm", "a4");

                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

                const canvasHeight = canvas.height * ratio;
                doc.addImage(imgBase64, 'JPEG', 5, 2, pageWidth - 8, canvasHeight);
                doc.save('Revenue Dashboard.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        }
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#REVENUE_PDF"))
                .then(function (group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "HR-Dashboard.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });

        }
    };
});
app.controller('RevenueAnalyticsController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.BY_REASON_STAFF_LIST = [{ ID: 1, NAME: 'By Reason' }, { ID: 2, NAME: 'By Staff Name' }];

    $scope.RevenueAnalyticsSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        chart_1_baseChartMessageFont: "Arial",
        chart_1_baseChartMessageFontSize: "50",
        chart_1_baseChartMessageColor: "#FC0000",

        chart_1_dataLoadStartMessage: "Retrieving data. Please wait.",
        chart_1_dataLoadErrorMessage: "Error in loading data.",
        chart_1_dataInvalidMessage: "Invalid data.",
        chart_1_dataEmptyMessage: "No data  found.",
        chart_1_typeNotSupportedMessage: "Chart type not supported.",
        chart_1_loadMessage: "Loading chart. Please wait.",
        chart_1_renderErrorMessage: "Unable to render chart.",
        WEEKLY_COMPS_REASON_STAFF_ID: 1,
        WEEKLY_VOIDS_REASON_STAFF_ID: 1,
    };

    $scope.RESET_GET_DETAILED_REVENUE_ANALYTICS = function () {
        $scope.RevenueAnalyticsSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
            END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
            BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
            chart_1_baseChartMessageFont: "Arial",
            chart_1_baseChartMessageFontSize: "50",
            chart_1_baseChartMessageColor: "#FC0000",

            chart_1_dataLoadStartMessage: "Retrieving data. Please wait.",
            chart_1_dataLoadErrorMessage: "Error in loading data.",
            chart_1_dataInvalidMessage: "Invalid data.",
            chart_1_dataEmptyMessage: "No data  found.",
            chart_1_typeNotSupportedMessage: "Chart type not supported.",
            chart_1_loadMessage: "Loading chart. Please wait.",
            chart_1_renderErrorMessage: "Unable to render chart.",
        };
    }
    $scope.GROSSREVENUE_CHART1_DATA = [];
    $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
    $scope.TAB_FLAG_WEEKLY_FLASH_P_L = 1;
    $scope.WEEK_LIST = [{ label: "Mon" }, { label: "Tue" }, { label: "Wed" }, { label: "Thu" }, { label: "Fri" }, { label: "Sat" }, { label: "Sun" }];
    $scope.TAB_CLICK_SHDL_GROSS_REVENUE_FY = function (FLAG) {
        $scope.TAB_FLAG_WEEKLY_FLASH_P_L = FLAG
    }
    $scope.START_DAY_OF_WEEK = 1;


    $scope.CHART_1_COLOR = "#0888c3,#5fb5ed,#86c8f3,#079381,#11b09b,#17cdb5,#5e7a8e,#7699b2,#90b8d4";
    $scope.CHART_2_COLOR = "#0888c3,#5fb5ed,#86c8f3,#079381,#11b09b,#17cdb5,#5e7a8e,#7699b2,#90b8d4";
    $scope.OPERATION_COST_COLOR = "#264478,#70ad47,#ffc000,#5b9bd5,#a5a5a5,#ed7d31";
    $scope.CHART_1_LINE_COLOR = "#eb4f01,#12ff00,#003a76,#65b290,#7fccaa,#b2ffdd,#6592b2,#7faccc,#b2dfff";
    $scope.CHART_2_LINE_COLOR = "#eb4f01,#12ff00,#003a76,#65b290,#7fccaa,#b2ffdd,#6592b2,#7faccc,#b2dfff";
    $scope.AVERAGE_SPEND = "#5fb5ed,#11b09b,#7699b2";
    $scope.AVERAGE_LINE_SPEND = "#eb4f01,#12ff00,#003a76,#65b290,#7fccaa,#b2ffdd,#6592b2,#7faccc,#b2dfff";

    $scope.PAYROLL = {};
    $scope.OPERATION_COST = {};
    $scope.GROSS_PROFIT_NET_REVENUE = {};
    $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_BAR = {};
    $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_BAR = {};

    $scope.STACKED_BAR_GRAPH_FOR_GROUPED_SUMMARY = {};
    $scope.WEEKLY_GROUPED_SUMMARY_STACKED_BAR = {};

    $scope.GET_DETAILED_REVENUE_ANALYTICS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = [];
        $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = [];
        $scope.CUMULATIVE_SALES_BREAKDOWN_LIST = [];
        $scope.ACCOUNTS_BRAKDOWN_LIST = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.RevenueAnalyticsSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.RevenueAnalyticsSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.RevenueAnalyticsSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.RevenueAnalyticsSearch.END_DATE)).toDateString();
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_DETAILED_REVENUE_ANALYTICS').then(function (data) {
            if (data.data == null || data.data.GrossRevenue_Chart1_Data != undefined && data.data.GrossRevenue_Chart1_Data.length == 0) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            }
            if (data.data != null) {
                console.log(data.data);
                $scope.ALL_DETAILED_REVENUE_ANALYTICS = data.data;
                $scope.GROSSREVENUE_CHART1_DATA = data.data.WeekDayList;
                $scope.DETAILED_SALES_BREAKDOWN_BY_REVENUECENTER_LIST = data.data.DetailedSalesBreakdownByRevenueCenterList;
                $scope.CUMULATIVE_SALES_BREAKDOWN_LIST = data.data.CumulativeSalesBreakDownList;
                $scope.ACCOUNTS_BRAKDOWN_LIST = data.data.AccountsBrakdownList;

                $scope.BY_WEEKLY_COMPS_REASON_STAFF_FY();
                $scope.BY_WEEKLY_VOIDS_REASON_STAFF_FY();

                $scope.GROSS_PROFIT_OBJ = data.data.DetailedSalesBreakdownByRevenueCenterList;
                $scope.PAYROLL_FY();
                $scope.WEEKLY_GROUPED_SUMMARY_STACKED_BAR_FY(data.data.Category_Week_WiseSalesDataSet);
                $scope.GROSS_PROFIT_NET_REVENUE_FY();
                $scope.OPERATION_COST_DONUT();
                $scope.$parent.overlay_loadingNew = "none"
                $scope.$parent.COMMON_CODE_CHANGE();
            };
        });
    }
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));
        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        };
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.RevenueAnalyticsSearch.START_DATE = $scope.start_date;
        $scope.RevenueAnalyticsSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })


        $scope.GET_DETAILED_REVENUE_ANALYTICS();
    };
    $scope.GET_UTC_TIME = function (FLAG) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.DATE_WEEK_PICKER_DRDA(new Date(data.data));
        });
    };

    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next, 2);
        });
        set_week_picker(date, 1);
    };
    $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY = function (dataset) {
        $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_BAR = {
            "chart": {
                "theme": "fusion",
                "caption": "Void",
                "yaxisname": "Amounts  (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "baseFontSize": "11",
                "captionFontSize": "14",
                "legendItemFontSize": "12",
                "paletteColors": "#0387dd,#2ea1ec,#43aaed,#5fb5ed,#86c8f3,#45b5c3,#81ccbb,#c7e9b6,#e7fddb,#e5efc1,#6f6f6f,#919191,#a8a8a8,#bababa,#d1d1d1",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                //"numbersuffix": "K",
                "bgColor": "#ffffff",
                "borderAlpha": "20",
                "showCanvasBorder": "0",
                "usePlotGradientColor": "0",
                "plotBorderAlpha": "10",
                "legendBorderAlpha": "0",
                "legendShadow": "10",
                "valueFontColor": "#ffffff",
                "showXAxisLine": "1",
                "xAxisLineColor": "#999999",
                "divlineColor": "#999999",
                "divLineIsDashed": "1",
                "showAlternateHGridColor": "0",
                "subcaptionFontBold": "0",
                "subcaptionFontSize": "14"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: dataset,

        };
    }
    $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY = function (dataset) {
        $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_BAR = {
            "chart": {
                "theme": "fusion",
                "caption": "Comps",
                "captionFontSize": "14",
                "legendItemFontSize": "12",
                "yaxisname": "Amounts (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                "paletteColors": "#0387dd,#2ea1ec,#43aaed,#5fb5ed,#86c8f3,#45b5c3,#81ccbb,#c7e9b6,#e7fddb,#e5efc1,#6f6f6f,#919191,#a8a8a8,#bababa,#d1d1d1",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                //"numbersuffix": "K",
                "bgColor": "#ffffff",
                "borderAlpha": "20",
                "showCanvasBorder": "0",
                "usePlotGradientColor": "0",
                "plotBorderAlpha": "10",
                "legendBorderAlpha": "0",
                "legendShadow": "10",
                "valueFontColor": "#ffffff",
                "showXAxisLine": "1",
                "xAxisLineColor": "#999999",
                "divlineColor": "#999999",
                "divLineIsDashed": "1",
                "showAlternateHGridColor": "0",
                "subcaptionFontBold": "0",
                "subcaptionFontSize": "14"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: dataset,

        };
    }

    $scope.WEEKLY_GROUPED_SUMMARY_STACKED_BAR_FY = function (dataset) {
        $scope.WEEKLY_GROUPED_SUMMARY_STACKED_BAR = {
            "chart": {
                "theme": "fusion",
                "caption": "Weekly Grouped Summary",
                "yaxisname": "Net Sales (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                "captionFontSize": "14",
                "legendItemFontSize": "12",
                // "baseFontSize": "11",
                // "captionFontSize": "14",
                //  "legendItemFontSize": "12",
                //  "paletteColors": "#0387dd,#2ea1ec,#43aaed,#5fb5ed,#86c8f3,#45b5c3,#81ccbb,#c7e9b6,#e7fddb,#e5efc1,#6f6f6f,#919191,#a8a8a8,#bababa,#d1d1d1",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                //"numbersuffix": "K",
                //"bgColor": "#ffffff",
                //  "borderAlpha": "20",
                // "showCanvasBorder": "0",
                // "usePlotGradientColor": "0",
                //    "plotBorderAlpha": "10",
                //  "legendBorderAlpha": "0",
                "legendShadow": "10",
                // "valueFontColor": "#ffffff",
                // "showXAxisLine": "1",
                //"xAxisLineColor": "#999999",
                // "divlineColor": "#999999",
                //"divLineIsDashed": "1",
                // "showAlternateHGridColor": "0",
                //"subcaptionFontBold": "0",
                //"subcaptionFontSize": "14"
            },
            categories: [
                {
                    category: $scope.WEEK_LIST,
                }
            ],
            dataset: dataset,

        };
    }

    $scope.OPERATION_COST_DONUT = function () {
        var TOTAL = 500;
        $scope.OPERATION_COST = {
            chart: {
                //caption: "Operation Cost",
                //showpercentvalues: "1",
                //aligncaptionwithcanvas: "0",
                "paletteColors": $scope.OPERATION_COST_COLOR,
                //captionpadding: "0",
                //decimals: "1",
                //plottooltext:
                //    "<b>Value</b> of our Android users are on <b>$label</b>",
                //centerlabel: "# Users: $value",

                //"captionFontSize": "14",
                "numberPrefix": $cookies.get("CURRENCY_SYMBOL"),
                "bgColor": "#ffffff",
                "startingAngle": "310",
                "legendItemFontSize": "12",
                "showLegend": "1",
                "defaultCenterLabel": "Total Operation Cost: " + $cookies.get("CURRENCY_SYMBOL") + " " + TOTAL,
                "labelDisplay ": "none",
                "centerLabel": "Revenue from $label: $value",
                "centerLabelBold": "1",
                "showTooltip": "1",
                "decimals": "0",
                "doughnutRadius": "90%",
                "theme": "fusion",
                "divlinealpha": "0",


                theme: "fusion"
            },
            data: [
                {
                    label: "Total Marketing & Ad Cost",
                    value: "1000"
                },
                {
                    label: "Total Operation Cost",
                    value: "5300"
                },
                {
                    label: "Total Wage & HR Cost",
                    value: "10500"
                },
                {
                    label: "Total Premise Cost",
                    value: "18900"
                },

            ]
        };
    }

    $scope.PAYROLL_FY = function () {
        $scope.PAYROLL = {
            "chart": {
                "caption": "Sales",
                "paletteColors": "#45b5c3,#81ccbb,#c7e9b6",
                //"subCaption": "Harry's SuperMart",
                //"xAxisname": "Quarter",
                "yAxisName": "Sales (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                "baseFontSize": "11",
                "captionFontSize": "14",
                "legendItemFontSize": "12",
                "numberPrefix": "$",
                "theme": "fusion"
            },
            "categories": [{
                "category": [{
                    "label": "FOH"
                }, {
                    "label": "BOH"
                }, {
                    "label": "Reservations"
                }, {
                    "label": "Bar"
                }, {
                    "label": "Management"
                }]
            }],
            "dataset": [{
                "seriesname": "Current Week (CW)",
                "data": [{
                    "value": "10000"
                }, {
                    "value": "16300"
                }, {
                    "value": "11500"
                }, {
                    "value": "12500"
                }, {
                    "value": "10256"
                }, {
                    "value": "15800"
                }, {
                    "value": "15000"
                }]
            }, {
                "seriesname": "Last Week (CY)",
                "data": [{
                    "value": "25400"
                }, {
                    "value": "12800"
                }, {
                    "value": "25300"
                }, {
                    "value": "10256"
                }, {
                    "value": "21800"
                }, {
                    "value": "12300"
                }, {
                    "value": "26800"
                }]
            }, {
                "seriesname": "Last Year (YTD)",
                "data": [{
                    "value": "10000"
                }, {
                    "value": "21800"
                }, {
                    "value": "11500"
                }, {
                    "value": "12500"
                }, {
                    "value": "10256"
                }, {
                    "value": "21800"
                }, {
                    "value": "15000"
                }]
            }]
        }
    }
    $scope.GROSS_PROFIT_NET_REVENUE_FY = function () {
        $scope.categories = [
            {
                category: [
                    {
                        label: "Current Week"
                    },
                    {
                        label: "Last Week"
                    },
                    {
                        label: "Last Year"
                    }
                ]
            }
        ]
        $scope.dataset = [
            {
                seriesname: "Net Revenue",
                data: [
                    {
                        value: "250000"
                    },
                    {
                        value: "200000"
                    },
                    {
                        value: "300000"
                    }
                ]
            },
            {
                seriesname: "Gross Profit",
                data: [
                    {
                        value: "260000"
                    },
                    {
                        value: "180000"
                    },
                    {
                        value: "290000"
                    }
                ]
            }
        ]
        // $scope.dataset = null;

        $scope.GROSS_PROFIT_NET_REVENUE = {
            chart: {
                caption: "Gross Profit & Net Revenue",
                "paletteColors": "#45b5c3,#dddddd",
                //subcaption: "Bilbus",
                yaxisname: "Amount",
                baseFontSize: "11",
                captionFontSize: "14",
                legendItemFontSize: "12",
                numberprefix: "£",
                drawcrossline: "1",
                theme: "fusion",
                showvalues: "0"
            },
            categories: $scope.categories,
            dataset: $scope.dataset
        }
    }

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.RevenueAnalyticsSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.RevenueAnalyticsSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.RevenueAnalyticsSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }

            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_DETAILED_REVENUE_ANALYTICS();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);
    $scope.ANA_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.RevenueAnalyticsSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.RevenueAnalyticsSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_DETAILED_REVENUE_ANALYTICS();
    }

    $scope.BY_WEEKLY_COMPS_REASON_STAFF_FY = function () {
        if ($scope.RevenueAnalyticsSearch.WEEKLY_COMPS_REASON_STAFF_ID == 1) {
            $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = $scope.ALL_DETAILED_REVENUE_ANALYTICS.CompWeeklyBreakdownByReason;
            $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY($scope.ALL_DETAILED_REVENUE_ANALYTICS.CompWeeklyBreakdownByReasonDataSet);
        }
        else {
            $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = $scope.ALL_DETAILED_REVENUE_ANALYTICS.CompWeeklyBreakdownByStaffName;
            $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY($scope.ALL_DETAILED_REVENUE_ANALYTICS.CompWeeklyBreakdownByStaffNameDataSet);
        }
    }
    $scope.BY_WEEKLY_VOIDS_REASON_STAFF_FY = function () {
        if ($scope.RevenueAnalyticsSearch.WEEKLY_VOIDS_REASON_STAFF_ID == 1) {
            $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = $scope.ALL_DETAILED_REVENUE_ANALYTICS.VoidWeeklyBreakdownByReason;
            $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY($scope.ALL_DETAILED_REVENUE_ANALYTICS.VoidWeeklyBreakdownByReasonDataSet);
        } else {
            $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = $scope.ALL_DETAILED_REVENUE_ANALYTICS.VoidWeeklyBreakdownByStaffName;
            $scope.VOID_WEEKLY_BREAKDOWN_BY_REASON_BAR_FY($scope.ALL_DETAILED_REVENUE_ANALYTICS.VoidWeeklyBreakdownByStaffNameDataSet);
        }
    }
    $scope.REVENUE_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("ANA_REVENUE_PDF");
            node.getElementsByClassName('my-3')[0].removeAttribute('hidden');
            html2canvas(node, { useCORS: true, scale: 2 }).then(function (canvas) {
                var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
                var doc = new jsPDF("p", "mm", "a4");
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
                const canvasHeight = canvas.height * ratio;
                doc.addImage(imgBase64, 'JPEG', 2, 10, pageWidth - 10, canvasHeight);
                doc.save('Analytics Details.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        };
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#REVENUE_PDF"))
                .then(function (group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                }).kendo.pdf.defineFont({
                    //Halant
                    "Halant": "fonts/Halant/Halant-Regular.ttf",
                    "Halant|SemiBold": "fonts/Halant/Halant-SemiBold.ttf",
                    "Halant|Bold": "fonts/Halant/Halant-Bold.ttf",
                    "Halant|Medium": "fonts/Halant/Halant-Medium.ttf",

                    //Roboto
                    "Roboto": "fonts/Roboto/Roboto-Regular.ttf",
                    "Roboto|Bold": "fonts/Roboto/Roboto-Bold.ttf",
                    "Roboto|Medium": "fonts/Roboto/Roboto-Medium.ttf",

                    //IBM
                    "IBM Plex Serif": "fonts/IBM_Plex_Serif/IBMPlexSerif-Regular.ttf",
                    "IBM Plex Serif|Bold": "fonts/IBM_Plex_Serif/IBMPlexSerif-Bold.ttf",
                    "IBM Plex Serif|Medium": "fonts/IBM_Plex_Serif/IBMPlexSerif-Medium.ttf",
                    "IBM Plex Serif|SemiBold": "fonts/IBM_Plex_Serif/IBMPlexSerif-SemiBold.ttf",

                    //Lato
                    "Lato": "fonts/Lato/Lato-Regular.ttf",
                    "Lato|Bold": "fonts/Lato/Lato-Bold.ttf",

                    //Source Sans Pro
                    "Source Sans Pro": "fonts/Source_Sans_Pro/SourceSansPro-Regular.ttf",
                    "Source Sans Pro|Bold": "fonts/Source_Sans_Pro/SourceSansPro-Bold.ttf",
                    "Source Sans Pro|SemiBold": "fonts/Source_Sans_Pro/SourceSansPro-SemiBold.ttf",

                    //Work Sans
                    "Work Sans": "fonts/Work_Sans/WorkSans-Regular.ttf",
                    "Work Sans|Bold": "fonts/Work_Sans/WorkSans-Bold.ttf",
                    "Work Sans|Medium": "fonts/Work_Sans/WorkSans-Medium.ttf",
                    "Work Sans|SemiBold": "fonts/Work_Sans/WorkSans-SemiBold.ttf"
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "HR-Dashboard.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });

        }
    }


})
app.controller('PayrollDshBtController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();


    $scope.PAGE_PAYROLL_LOAD = function () {
        $scope.TAB_FLAG = 2;
        $scope.TAB_FLAG_GROSS_REVENUE = 2;
        $scope.TAB_FLAG_GROUPED_SALES = 2;
    }
    $scope.START_DAY_OF_WEEK = 1;

    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.PayrollSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        START_DATE: "",
        END_DATE: "",
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        AVERAGE_WAGE_COST_ID: 1,
    };
    $scope.STAFF_BY_HOURS = {};
    $scope.GROSS_REVENUE_DATASOURCE_COVERS = {};
    $scope.WEEKLY_STAFF_COST_COMPARISON = {}
    $scope.AVERAGE_WAGE_COST = {};
    $scope.HOURLY_DEPARTMENT_WAGE_COST = {};
    $scope.WAGE_COST_VS_REVENUE = {};
    $scope.WAGE_COST_VS_REVENUE_PERCENT = {};
    $scope.REVENUE_VS_HEADCOUNT = {};
    $scope.WEEK_DATASET_LIST = [{ ID: 1, label: "Sunday" }, { ID: 2, label: "Monday" }, { ID: 3, label: "Tuesday" }, { ID: 4, label: "Wednesday" }, { ID: 5, label: "Thursday" }, { ID: 6, label: "Friday" }, { ID: 7, label: "Saturday" }];
    $scope.WEEK_LIST = [{ label: "Mon" }, { label: "Tue" }, { label: "Wed" }, { label: "Thu" }, { label: "Fri" }, { label: "Sat" }, { label: "Sun" }];

    $scope.AVERAGE_WAGE_COST_LIST = [{ ID: 1, label: "13 Rolling Week" }, { ID: 2, label: "Current Week" }, { ID: 3, label: "6 Rolling Months" }];

    $scope.CHART_1_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";
    $scope.CHART_2_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";
    $scope.REVENUE_BY_CATEGORY_COLOR = "#264478,#70ad47,#ffc000,#5b9bd5,#a5a5a5,#ed7d31";
    $scope.CHART_2_LINE_COLOR = "#eb4f01,#12ff00,#003a76";
    $scope.AVERAGE_SPEND = "#11b09b,#5fb5ed,#7699b2";
    $scope.AVERAGE_LINE_SPEND = "#eb4f01,#12ff00,#003a76,#65b290,#7fccaa,#b2ffdd,#6592b2,#7faccc,#b2dfff";
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));
        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        };
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        }
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        $scope.PayrollSearch.START_DATE = $scope.start_date;
        $scope.PayrollSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' });
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' });

        $scope.PAGE_PAYROLL_LOAD();

        $scope.GET_PAYROLL_ANALYTICS();
    };
    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.DATE_WEEK_PICKER_DRDA(new Date(data.data));
        });
    };
    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next, 2);
        });
        set_week_picker(date, 1);
    };

    $scope.RESET_GET_PAYROLL_ANALYTICS = function () {
        $scope.PayrollSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            START_DATE: "",
            END_DATE: "",
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),

            chart_1_baseChartMessageFont: "Arial",
            chart_1_baseChartMessageFontSize: "50",
            chart_1_baseChartMessageColor: "#FC0000",

            chart_1_dataLoadStartMessage: "Retrieving data. Please wait.",
            chart_1_dataLoadErrorMessage: "Error in loading data.",
            chart_1_dataInvalidMessage: "Invalid data.",
            chart_1_dataEmptyMessage: "No data to found.",
            chart_1_typeNotSupportedMessage: "Chart type not supported.",
            chart_1_loadMessage: "Loading chart. Please wait.",
            chart_1_renderErrorMessage: "Unable to render chart.",
        };
        $scope.BRANCH_LIST = [];
        $scope.PAGE_LOAG();
        $scope.ENTITY_CHANGE_FY(1);
    }
    $scope.WEEKLY_WAGE_COST = [];
    $scope.WEEKLY_WAGE_COST_PER = [];
    $scope.WEEKLY_DEPT_WISE_WAGECOST = [];
    $scope.$parent.overlay_loadingNew = "block";
    $scope.GET_PAYROLL_ANALYTICS = function () {
        $scope.$parent.overlay_loadingNew = "block";
        $scope.PAYROLL_ANALYTICS_ALL_DATASET = [];
        $scope.GRID_DISPLAY = false;
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.PayrollSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.PayrollSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.PayrollSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.PayrollSearch.END_DATE)).toDateString();
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_PAYROLL_ANALYTICS').then(function (data) {
            if (data.data == null) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
                $scope.GROSSREVENUE_CHART1_DATA = data.data.GrossRevenue_Chart1_Data;
                $scope.GRID_DISPLAY = false;
            }
            if (data.data != null) {
                console.log(data.data);
                $scope.PAYROLL_ANALYTICS_ALL_DATASET = data.data;
                $scope.GRID_DISPLAY = true;
                $scope.STAFF_BY_HOURS_FY(data.data.StaffByHour, data.data);
                $scope.WEEKLY_STAFF_COST_COMPARISON_FY(data.data.WeeklyStaffCostComparison);
                $scope.HOURLY_DEPARTMENT_WAGE_COST_FY(data.data.HourlyDepartmentWageCost);
                $scope.WAGE_COST_VS_REVENUE_FY(data.data.HourlyWageCostRevenueComparision);
                $scope.WAGE_COST_VS_REVENUE_PERCENT_FY(data.data.HourlyWageCostRevenuePercent);
                $scope.REVENUE_VS_HEADCOUNT_FY(data.data.HourlyNetSalesByHeadCount);
                $scope.AVERAGE_WAGE_COST_FY(data.data.Average_WageCost_Revenue_DataBarLineSet);
                $scope.WEEKLY_WAGE_COST = data.data.WeeklyWageCost;
                $scope.WEEKLY_WAGE_COST_PER = data.data.WeeklyWageCostPercent;
                $scope.WEEKLY_DEPT_WISE_WAGECOST = data.data.WeeklyDeptWiseWageCost;
                $scope.PAYROLL_CARD = data.data.PayrollCard;

                $scope.$parent.overlay_loadingNew = "none";
                $scope.$parent.COMMON_CODE_CHANGE();
            };
        });
    }
    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.PayrollSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.PayrollSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.PayrollSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }

            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_PAYROLL_ANALYTICS();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);
    $scope.DEPARTMENT_WAGE_COST_DLL = function () {

    }
    var CALL_COUNT = 0;
    $scope.GET_PAYROLL_ANALYTICS_DEPARTMENT_DAY_WISE = function (SELECTED_GRAPH) {
        if (CALL_COUNT == 0) {
            var RevModelObj = new Object();
            RevModelObj.DAY_NO = $scope.PayrollSearch.HOURLY_DEPARTMENT_DAY_ID;
            RevModelObj.ENTITY_ID = $scope.PayrollSearch.ENTITY_ID;
            RevModelObj.BRANCH_ID = $scope.PayrollSearch.BRANCH_ID;
            RevModelObj.START_DATE = (new Date($scope.PayrollSearch.START_DATE)).toDateString();
            RevModelObj.END_DATE = (new Date($scope.PayrollSearch.END_DATE)).toDateString();
            RevModelObj.ALL_DATASET = $scope.PAYROLL_ANALYTICS_ALL_DATASET.AllDataset;
            PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_PAYROLL_ANALYTICS_DEPARTMENT_DAY_WISE').then(function (data) {
                if (data.data == null) {
                    $scope.FETCHING_RECORD = "No data to display.";
                    $scope.$parent.overlay_loadingNew = "none"
                    $scope.GROSSREVENUE_CHART1_DATA = data.data.GrossRevenue_Chart1_Data;
                }
                if (data.data != null) {
                    CALL_COUNT = 1;
                    $scope_ALL_GRAPH_DATA = data.data;
                    if (SELECTED_GRAPH == "HourlyDepartmentWageCost") {
                        $scope.HOURLY_DEPARTMENT_WAGE_COST_FY($scope_ALL_GRAPH_DATA.WeekDayList.filter(function (x) { return x.ID == $scope.PayrollSearch.HOURLY_DEPARTMENT_DAY_ID })[0].HourlyDepartmentWageCost);
                    }
                    if (SELECTED_GRAPH == "HourlyWageCostRevenueComparision") {
                        $scope.WAGE_COST_VS_REVENUE_FY($scope_ALL_GRAPH_DATA.WeekDayList.filter(function (x) { return x.ID == $scope.PayrollSearch.WAGE_COST_REVENUE_DAY_ID })[0].HourlyWageCostRevenueComparision);
                    }
                    $scope.$parent.COMMON_CODE_CHANGE();
                };
            });
        }
        if (CALL_COUNT == 1) {
            if (SELECTED_GRAPH == "HourlyDepartmentWageCost") {
                $scope.HOURLY_DEPARTMENT_WAGE_COST_FY($scope_ALL_GRAPH_DATA.WeekDayList.filter(function (x) { return x.ID == ($scope.PayrollSearch.HOURLY_DEPARTMENT_DAY_ID == null ? 0 : $scope.PayrollSearch.HOURLY_DEPARTMENT_DAY_ID) })[0].HourlyDepartmentWageCost);
            }
            if (SELECTED_GRAPH == "HourlyWageCostRevenueComparision") {
                $scope.WAGE_COST_VS_REVENUE_FY($scope_ALL_GRAPH_DATA.WeekDayList.filter(function (x) { return x.ID == ($scope.PayrollSearch.WAGE_COST_REVENUE_DAY_ID == null ? 0 : $scope.PayrollSearch.WAGE_COST_REVENUE_DAY_ID) })[0].HourlyWageCostRevenueComparision);
            }
            $scope.$parent.COMMON_CODE_CHANGE();
        }
    }


    $scope.PYROLL_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.PayrollSearch.BRANCH_ID);

        $cookies.put('DSH_BRANCH_ID', parseInt($scope.PayrollSearch.BRANCH_ID), { 'path': '/' });

        $scope.GET_PAYROLL_ANALYTICS();
    }

    $scope.STAFF_BY_HOURS_FY = function (Data, All_Dataset) {
        var max = All_Dataset.Max;
        var min = All_Dataset.Min;
        var Avg_max = All_Dataset.Max / 2;

        $scope.staff_color = [{
            "maxvalue": Avg_max.toFixed(0),
            "code": "#edef74",
            "displayValue": "Median"
        }, {
            "maxvalue": max,
            "code": "#ff0200"
        }]

        $scope.Staffcolumn = Data.column;
        $scope.Staffdataset = Data.data;
        $scope.Staffrow = Data.row;
        angular.forEach(Data.column, function (x) {
            x.id = x.id + '';
        });
        angular.forEach(Data.data, function (x) {
            x.columnid = x.columnid + '';
            x.rowid = x.rowid + '';
        });
        angular.forEach(Data.row, function (x) {
            x.id = x.id + '';
        });
        $scope.STAFF_BY_HOURS = {
            colorrange: {
                gradient: "1",
                minvalue: "0",
                startlabel: "Poor",
                endlabel: "Outstanding"
            },
            "colorrange": {
                "minvalue": "1",
                "startlabel": "Low",
                "endlabel": "High",
                "code": "#b7e5a2",
                "gradient": "1",
                "color": $scope.staff_color
            },
            dataset: [
                {
                    data: Data.data,
                }
            ],
            columns: {
                column: Data.column,
            },
            rows: {
                row: Data.row,
            },
            chart: {
                theme: "fusion",
                caption: " Head Count by Hour",
                height: "700",
                xaxisname: "Trading Hours",
                yaxisname: "Weekdays",
                showvalues: "1",
                valuefontcolor: "#ffffff",
                captionFontSize: "14",
                legendItemFontSize: "12",
                plottooltext: "$rowlabel's $columnlabel Hrs.: <b>$value</b> "
            }
        };
    }

    $scope.WEEKLY_STAFF_COST_COMPARISON_FY = function (data) {
        $scope.WEEKLY_STAFF_COST_COMPARISON = {
            chart: {
                caption: "Weekly Staff Cost Comparison",
                yaxisname: "Staff Cost per day",
                captionFontSize: "14",
                legendItemFontSize: "12",
                subcaption: "Week (" + $filter('date')($scope.PayrollSearch.START_DATE, "MMM/dd/yyyy") + " to " + $filter('date')($scope.PayrollSearch.END_DATE, "MMM/dd/yyyy") + ")",
                showhovereffect: "1",
                // numbersuffix: "k",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                drawcrossline: "1",
                plottooltext: "<b>$dataValue</b> $seriesName",
                theme: "fusion"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset.dataset,
        };

        //FusionCharts.ready(function () {
        //    var myChart = new FusionCharts({
        //        type: "msline",
        //        renderAt: "chart-container",
        //        width: "100%",
        //        height: "100%",
        //        dataFormat: "json",
        //        dataSource
        //    }).render();
        //});

    }


    $scope.HOURLY_DEPARTMENT_WAGE_COST_FY = function (data) {
        $scope.HOURLY_DEPARTMENT_WAGE_COST = {
            chart: {
                caption: "Hourly Department Wage Cost",
                //subcaption: "2012-2016",
                captionFontSize: "14",
                legendItemFontSize: "12",
                xaxisname: "Years",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                yaxisname: "Wage Cost",
                formatnumberscale: "1",
                //"paletteColors": "#43aaed,#7fccaa,#7faccc,#b2dfff",
                plottooltext:
                    "<b>$dataValue</b>  <b>$seriesName</b> in $label",
                theme: "fusion",
                drawcrossline: "1"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset.dataset,
        };
    }
    $scope.WAGE_COST_VS_REVENUE_FY = function (data) {
        $scope.WAGE_COST_VS_REVENUE = {
            chart: {
                caption: "Wage Cost vs Revenue per hour",
                "paletteColors": "#43aaed,#7fccaa",
                yaxisname: "Costing",
                captionFontSize: "14",
                legendItemFontSize: "12",
                // numbersuffix: "K",
                //subcaption: "04/09/2023 - 10/09/2023",
                captionFontSize: "14",
                legendItemFontSize: "12",
                numdivlines: "3",
                showvalues: "0",
                drawcrossline: "1",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                legenditemfontbold: "1",
                plottooltext: "<b>$dataValue</b> $seriesName at $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset.dataset,
        };
    }
    $scope.WAGE_COST_VS_REVENUE_PERCENT_FY = function (data) {
        $scope.WAGE_COST_VS_REVENUE_PERCENT = {
            chart: {                               
                yaxisname: "Wage Cost %",
                captionFontSize: "14",
                legendItemFontSize: "12",              
                captionFontSize: "14",
                legendItemFontSize: "12",
                numdivlines: "10",
                showvalues: "0",
                drawcrossline: "1",
                numbersuffix: " %",          
                "yAxisMinValue": 0,              
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                legenditemfontbold: "1",
                plottooltext: "<b>$dataValue</b> $seriesName at $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset.dataset,
        };
    }
    $scope.REVENUE_VS_HEADCOUNT_FY = function (data) {
        $scope.REVENUE_VS_HEADCOUNT = {
            chart: {
              
                "paletteColors": "#43aaed,#7fccaa",
                yaxisname: "Net Sales",
                captionFontSize: "14",
                legendItemFontSize: "12",
                // numbersuffix: "K",
                //subcaption: "04/09/2023 - 10/09/2023",
                captionFontSize: "14",
                legendItemFontSize: "12",
                numdivlines: "3",
                showvalues: "0",
                drawcrossline: "1",
             
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                legenditemfontbold: "1",
                plottooltext: "<b>$dataValue</b> $seriesName at $label",
                theme: "fusion"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset.dataset,
        };
    }
    $scope.AVERAGE_WAGE_COST_FY = function (data, Line) {
        var category = [];
        $scope.AVERAGE_WAGE_COST = {
            chart: {
                caption: "Average Wage Cost & Average Revenue (Per Cover)",
                //subcaption: "2011 - 2016",
                "paletteColors": "#43aaed,#b2dfff",
                pyaxisname: "Revenue",
                syaxisname: "Wages",
                numberprefix: $cookies.get("CURRENCY_SYMBOL"),
                "plotHighlightEffect": "fadeout|anchorBgColor=CCCCCC, anchorBgAlpha=50,",
                // snumbersuffix: "k",
                syaxismaxvalue: "25",
                captionFontSize: "14",
                legendItemFontSize: "12",
                theme: "fusion",
                // showvalues: "0",
                drawcrossline: "1",
                divlinealpha: "20"
            },
            categories: [
                {
                    category: data.category,
                }
            ],
            dataset: data.dataset,
            lineset: data.LineSet,
        };
    }

    $scope.AVERAGE_WAGE_COST_DDL_FY = function () {

        if ($scope.PayrollSearch.AVERAGE_WAGE_COST_ID == 1) {
            $scope.AVERAGE_WAGE_COST_FY($scope.PAYROLL_ANALYTICS_ALL_DATASET.Average_WageCost_Revenue_DataBarLineSet);
        }
        if ($scope.PayrollSearch.AVERAGE_WAGE_COST_ID == 2) {
            $scope.AVERAGE_WAGE_COST_FY($scope.PAYROLL_ANALYTICS_ALL_DATASET.Average_WageCost_Revenue_DataBarLineSet_Week);
        }
        if ($scope.PayrollSearch.AVERAGE_WAGE_COST_ID == 3) {
            $scope.AVERAGE_WAGE_COST_FY($scope.PAYROLL_ANALYTICS_ALL_DATASET.Average_WageCost_Revenue_DataBarLineSet_6Month);
        }
    }


    $scope.PAYROLL_PDF_FY = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("PAYROLL_PDF");
            node.getElementsByClassName('my-3')[0].removeAttribute('hidden');
            html2canvas(node, { useCORS: true, scale: 2 }).then(function (canvas) {
                var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
                var doc = new jsPDF("p", "mm", "a4");
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
                const canvasHeight = canvas.height * ratio;
                doc.addImage(imgBase64, 'JPEG', 5, 5, pageWidth - 10, canvasHeight);
                doc.save('Payroll Reports.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        }
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#REVENUE_PDF"))
                .then(function (group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "HR-Dashboard.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });

        }
    };
});
app.controller('NSSController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;
    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
    $scope.SESSION_LIST = [{ ID: 0, NAME: 'All' }, { ID: 1, NAME: 'Breakfast' }, { ID: 2, NAME: 'Lunch' }, { ID: 3, NAME: 'Dinner' },]
    $scope.NSSSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        SESSION_ID: 0,
    };
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));
        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        };
        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        };
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.NSSSearch.START_DATE = $scope.start_date;
        $scope.NSSSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_END_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })

        $scope.GET_NET_SALES_SUMMARY();

    };
    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.DATE_WEEK_PICKER_DRDA(new Date(data.data));
        });
    };
    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next, 2);
        });
        set_week_picker(date, 1);
    };

    $scope.RESET_GET_PAYROLL_ANALYTICS = function () {
        $scope.NSSSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            START_DATE: "",
            END_DATE: "",
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        };
        $scope.BRANCH_LIST = [];
        $scope.PAGE_LOAG();
        $scope.ENTITY_CHANGE_FY(1);
    }
    $scope.WEEKLY_WAGE_COST = [];
    $scope.WEEKLY_WAGE_COST_PER = [];
    $scope.WEEKLY_DEPT_WISE_WAGECOST = [];
    $scope.SESSION_LIST = [];

    $scope.GET_NET_SALES_SUMMARY = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.NET_SALES_SUMMARY = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.NSSSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.NSSSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.NSSSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.NSSSearch.END_DATE)).toDateString();
        RevModelObj.SESSION_ID = $scope.NSSSearch.SESSION_ID;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_NET_SALES_SUMMARY').then(function (data) {
            if (data.data == null) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            }
            if (data.data != null && data.data.Session.length > 0) {
                console.log(data.data);
                $scope.SESSION_LIST = data.data.Session;
                $scope.NET_SALES_SUMMARY_ALL = data.data;
                $scope.NET_SALES_SUMMARY = data.data.Session.filter(function (x) { return x.SESSION_ID == 0 })[0].NetReveueofLast13WeekData;
                $scope.$parent.overlay_loadingNew = "none"
                $scope.$parent.COMMON_CODE_CHANGE();
            }
            else {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            };
        });
    }
    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.NSSSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.NSSSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.NSSSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }

            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_NET_SALES_SUMMARY();
            };

        });
    };
    $scope.ENTITY_CHANGE_FY(1);


    $scope.SESSION_CHANGE_FY = function () {
        $scope.NET_SALES_SUMMARY = $scope.NET_SALES_SUMMARY_ALL.Session.filter(function (x) { return x.SESSION_ID == ($scope.NSSSearch.SESSION_ID == null ? 0 : $scope.NSSSearch.SESSION_ID) })[0].NetReveueofLast13WeekData;
    }

    $scope.NSS_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.NSSSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.NSSSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_NET_SALES_SUMMARY();
    };
    $scope.NSS_REVENUE_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("NSS_REVENUE_PDF");
            node.getElementsByClassName('my-3')[0].removeAttribute('hidden');
            html2canvas(node, { useCORS: true, scale: 2 }).then(function (canvas) {
                var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
                var doc = new jsPDF("l", "mm", "a4");
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
                const canvasHeight = canvas.height * ratio;
                doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
                doc.save('Net Sales Summary.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        }
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#REVENUE_PDF"))
                .then(function (group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "HR-Dashboard.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });

        }
    };
});
app.controller('TakingReviewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.TakingReviewSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        REPORTING_DATE: new Date(),
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
    };
    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    function set_week_picker(date, FLAG) {
        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.TakingReviewSearch.REPORTING_DATE = new Date($cookies.get('DSH_START_DATE'));
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));

        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        };
        if ($scope.start_date > date) {
            if (FLAG == 1 || FLAG == 2) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        };
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.TakingReviewSearch.START_DATE = $scope.start_date;
        $scope.TakingReviewSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_END_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })

        $scope.GET_TAKINGS_REVIEW();

    };
    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            $scope.DATE_WEEK_PICKER_DRDA(new Date(data.data));
        });
    };
    $scope.DATE_WEEK_PICKER_DRDA = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next, 2);
        });
        set_week_picker(date, 1);
    };


    $scope.REPORTING_DATE_CHANGE_FY = function () {
        set_week_picker(new Date($scope.TakingReviewSearch.REPORTING_DATE), 2);
    }

    $scope.RESET_GET_PAYROLL_ANALYTICS = function () {
        $scope.TakingReviewSearch = {
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            START_DATE: "",
            END_DATE: "",
            ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        };
        $scope.BRANCH_LIST = [];
        $scope.PAGE_LOAG();
        $scope.ENTITY_CHANGE_FY(1);
    }
    $scope.WEEKLY_WAGE_COST = [];
    $scope.WEEKLY_WAGE_COST_PER = [];
    $scope.WEEKLY_DEPT_WISE_WAGECOST = [];


    $scope.GET_TAKINGS_REVIEW = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.TAKINGS_REVIEW_LIST = [];
        $scope.TAKING_REVIEW_GRID_DISPLAY = false;
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        RevModelObj.BRANCH_IDS = null;
        RevModelObj.START_DATE = (new Date($scope.TakingReviewSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.TakingReviewSearch.END_DATE)).toDateString();
        RevModelObj.SELECTED_DATE = (new Date($scope.TakingReviewSearch.REPORTING_DATE)).toDateString();
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_TAKINGS_REVIEW').then(function (data) {
            if (data.data == null) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
                $scope.GROSSREVENUE_CHART1_DATA = data.data.GrossRevenue_Chart1_Data;
                $scope.TAKING_REVIEW_GRID_DISPLAY = false;
            }
            if (data.data != null) {
                $scope.TAKING_REVIEW_GRID_DISPLAY = true;
                console.log(data.data);
                $scope.TAKINGS_REVIEW_OBJ = data.data.TakingReview;
                $scope.ENTITY_LIST_OBJ = data.data.TakingReview.EntityList;
                $scope.BRANCH_LIST_OBJ = data.data.TakingReview.BranchList;
                $scope.$parent.overlay_loadingNew = "none"
                $scope.$parent.COMMON_CODE_CHANGE();
            }
            else {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            };
        });
    }
    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.TakingReviewSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.TakingReviewSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.TakingReviewSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_TAKINGS_REVIEW();
            };
        });
    };
    $scope.ENTITY_CHANGE_FY(1);


    $scope.TAKING_RIW_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.TakingReviewSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.TakingReviewSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_TAKINGS_REVIEW();
    };
    $scope.TAKINGREVIEW_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("TAKINGREVIEW_PDF_ID");
            node.getElementsByClassName('my-3')[0].removeAttribute('hidden');
            html2canvas(node, { useCORS: true, scale: 2 }).then(function (canvas) {
                var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
                var doc = new jsPDF("l", "mm", "a4");
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const widthRatio = pageWidth / canvas.width;
                const heightRatio = pageHeight / canvas.height;
                const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
                const canvasHeight = canvas.height * ratio;
                doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
                doc.save('Taking Review.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        }
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#TAKINGREVIEW_PDF_ID"))
                .then(function (group) {
                    // Render the result as a PDF file
                    return kendo.drawing.exportPDF(group, {
                        paperSize: "auto",
                        margin: { left: "1cm", top: "1cm", right: "1cm", bottom: "1cm" }
                    });
                })
                .done(function (data) {
                    // Save the PDF file
                    kendo.saveAs({
                        dataURI: data,
                        fileName: "HR-Dashboard.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });
        }
    };
    $scope.$parent.dateinputOpenDate();
});
app.controller('ConsolidatedRevenueController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
    $scope.SHOW_REVENUE_CONSOLIDATED_DASHBOARD = $scope.CheckSubModuleAccess(61);
    $scope.ConsolidatedSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        REPORTING_DATE: new Date(),
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        CUSTOMER_ID: parseInt($cookies.get("CUSTOMER_ID")),
        START_DATE: null, END_DATE: null, WEEK_DATE: null, MONTH_TO_DATE: null, YEAR_TO_DATE: null, CURRENT_DATE: null,
        WEEK_LIST: [], CUSTOMER_ID: null,
        WEEK_TD_LIST: [], SYSTEM_NAME: null, ENTITY_ID: null, YEARLY: new Date(),
        ALL_SOURCE_SELECTED_FLAG: 0, FIRST_DAY_OF_WEEK: 1, CALENDAR_SELECTED_DATE: null, IS_CLICKED: false, CLICKED_COUNT: 0,
        SELECTED_SITE_COUNT: 0, PDF_FDW: null, CUSTOMER_LOGO: null,
        SESSION_START_DATE: null,
        SESSION_END_DATE: null
    };

    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    $scope.COUNTRIES = [];
    $scope.COUNTRIES_DAILY = [];
    $scope.SALES_DAILY = [];
    $scope.COVERS_DAILY = [];
    $scope.SPEND_DAILY = [];
    $scope.UNIQUE_CUSTOMER = [];

    $scope.SALES_WEEKLY = [];
    $scope.COVERS_WEEKLY = [];
    $scope.SPEND_WEEKLY = [];

    $scope.SALES_MONTHLY = [];
    $scope.COVERS_MONTHLY = [];
    $scope.SPEND_MONTHLY = [];

    $scope.SALES_YEARLY = [];
    $scope.COVERS_YEARLY = [];
    $scope.SPEND_YEARLY = [];
    $scope.USER_ENTITIES_WITH_EPOS = [];
    $scope.overlay_loadingNew = 'none';
    var date_input;
    $scope.FIRST_DAY_OF_WEEK = [
        { 'WEEKDAY': 'SUNDAY', ID: 0 },
        { 'WEEKDAY': 'MONDAY', ID: 1 },
        { 'WEEKDAY': 'TUESDAY', ID: 2 },
        { 'WEEKDAY': 'WEDNESDAY', ID: 3 },
        { 'WEEKDAY': 'THURSDAY', ID: 4 },
        { 'WEEKDAY': 'FRIDAY', ID: 5 },
        { 'WEEKDAY': 'SATURDAY', ID: 6 },
    ];
    $scope.WEEKLY_WAGE_COST = [];
    $scope.WEEKLY_WAGE_COST_PER = [];
    $scope.WEEKLY_DEPT_WISE_WAGECOST = [];

    $scope.REVENUE_CONSOLIDATED_DASHBOARD = function () {
        //$scope.BIReportForm.submitted = true;
        //if ($scope.BIReportForm.$valid) {
        document.getElementById("BI_Loader").style.display = "block";
        $scope.ConsolidatedSearch.PDF_FDW = $scope.FIRST_DAY_OF_WEEK.filter(p => p.ID == $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK)[0]['WEEKDAY'];
        $scope.ConsolidatedSearch.CUSTOMER_LOGO = $cookies.get("LOGO_PATH");// "https://app.wenodo.com/Uploads//Customer/Entity/20230707125647569_download_(24).png";
        $scope.TEMP = [];
        angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
            if (item.SELECTED == true) {
                $scope.TEMP.push(item.ENTITY_ID);
            }
        });
        $scope.ConsolidatedSearch.ENTITY_ID = null;

        CashupModel = new Object();
        CashupModel.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        CashupModel.USER_ID = $cookies.get('USERID');
        CashupModel.START_DATE = (new Date($scope.ConsolidatedSearch.SESSION_START_DATE)).toDateString();
        CashupModel.END_DATE = (new Date($scope.ConsolidatedSearch.SESSION_START_DATE)).toDateString();

        PrcCommMethods.DASHBOARD_MODULES_API(CashupModel, 'REVENUE_CONSOLIDATED_DASHBOARD').then(function (data) {

            if (data.data != null && data.data.Table1 != undefined) {
                $scope.SALES_DAILY = [];
                $scope.COVERS_DAILY = [];
                $scope.SPEND_DAILY = [];

                $scope.COUNTRIES = data.data.Table;
                $scope.SALES_DAILY = data.data.Table1;
                $scope.COVERS_DAILY = data.data.Table2;
                $scope.SPEND_DAILY = data.data.Table3;
                $scope.counter = 0;
                $scope.TEMP_COUNTRIES = [];
                angular.forEach($scope.COUNTRIES, function (item) {
                    $scope.temp = [];
                    $scope.temp = {
                        'ID': $scope.counter, 'COUNTRY_CODE': item.COUNTRY_CODE, 'COUNTRY_NAME': item.COUNTRY_NAME, 'CURRENCY_CODE': item.CURRENCY_CODE, 'CURRENCY_SYMBOL': item.CURRENCY_SYMBOL
                    };
                    $scope.TEMP_COUNTRIES.push($scope.temp);
                    $scope.counter++;
                });
                $scope.COUNTRIES = []; $scope.COUNTRIES_DAILY = $scope.TEMP_COUNTRIES;
            }
            else {
                $scope.COUNTRIES = [];
                $scope.SALES_DAILY = [];
                $scope.COVERS_DAILY = [];
                $scope.SPEND_DAILY = [];
            }
            //WEEKLY DATA FETCH
            CashupModel = new Object();
            CashupModel.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            CashupModel.USER_ID = $cookies.get('USERID');
            CashupModel.START_DATE = (new Date($scope.ConsolidatedSearch.START_DATE)).toDateString();
            CashupModel.END_DATE = (new Date($scope.ConsolidatedSearch.SESSION_START_DATE)).toDateString();
            PrcCommMethods.DASHBOARD_MODULES_API(CashupModel, 'REVENUE_CONSOLIDATED_DASHBOARD').then(function (data) {
                if (data.data != null && data.data.Table1 != undefined) {
                    $scope.SALES_WEEKLY = [];
                    $scope.COVERS_WEEKLY = [];
                    $scope.SPEND_WEEKLY = [];

                    $scope.COUNTRIES = data.data.Table;
                    $scope.SALES_WEEKLY = data.data.Table1;
                    $scope.COVERS_WEEKLY = data.data.Table2;
                    $scope.SPEND_WEEKLY = data.data.Table3;
                }
                else {
                    $scope.COUNTRIES = [];
                    $scope.SALES_WEEKLY = [];
                    $scope.COVERS_WEEKLY = [];
                    $scope.SPEND_WEEKLY = [];
                }
                //MONTHLY DATA FETCH
                CashupModel = new Object();
                CashupModel.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                CashupModel.USER_ID = $cookies.get('USERID');
                CashupModel.START_DATE = (new Date($scope.ConsolidatedSearch.MONTH_TO_DATE)).toDateString();
                CashupModel.END_DATE = (new Date($scope.ConsolidatedSearch.SESSION_START_DATE)).toDateString();
                PrcCommMethods.DASHBOARD_MODULES_API(CashupModel, 'REVENUE_CONSOLIDATED_DASHBOARD').then(function (data) {
                    if (data.data != null && data.data.Table1 != undefined) {
                        $scope.SALES_MONTHLY = [];
                        $scope.COVERS_MONTHLY = [];
                        $scope.SPEND_MONTHLY = [];

                        $scope.COUNTRIES = data.data.Table;
                        $scope.SALES_MONTHLY = data.data.Table1;
                        $scope.COVERS_MONTHLY = data.data.Table2;
                        $scope.SPEND_MONTHLY = data.data.Table3;
                    }
                    else {
                        $scope.COUNTRIES = [];
                        $scope.SALES_MONTHLY = [];
                        $scope.COVERS_MONTHLY = [];
                        $scope.SPEND_MONTHLY = [];
                    }
                    //YEARLY DATA FETCH
                    CashupModel = new Object();
                    CashupModel.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                    CashupModel.USER_ID = $cookies.get('USERID');
                    CashupModel.START_DATE = (new Date($scope.ConsolidatedSearch.YEAR_TO_DATE)).toDateString();
                    CashupModel.END_DATE = (new Date($scope.ConsolidatedSearch.SESSION_START_DATE)).toDateString();
                    PrcCommMethods.DASHBOARD_MODULES_API(CashupModel, 'REVENUE_CONSOLIDATED_DASHBOARD').then(function (data) {
                        if (data.data != null && data.data.Table1 != undefined) {
                            $scope.SALES_YEARLY = [];
                            $scope.COVERS_YEARLY = [];
                            $scope.SPEND_YEARLY = [];

                            $scope.COUNTRIES = data.data.Table;
                            $scope.SALES_YEARLY = data.data.Table1;
                            $scope.COVERS_YEARLY = data.data.Table2;
                            $scope.SPEND_YEARLY = data.data.Table3;
                        }
                        else {
                            $scope.COUNTRIES = [];
                            $scope.SALES_YEARLY = [];
                            $scope.COVERS_YEARLY = [];
                            $scope.SPEND_YEARLY = [];
                        }
                        document.getElementById("BI_Loader").style.display = "none";
                    });
                });
            });
        });
        //}
    };


    $scope.dateinputOpenDate_BI = function () {
        var date_inputs = document.getElementsByClassName("dateinputOpenDate_BI") //our date input has the name "date"
        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {
                date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK == null || $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK == 0 ? "0,6" : parseInt($scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK) + "," + (parseInt($scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK) - 1),
                    autoclose: true,
                    forceParse: false,
                    todayHighlight: true,
                    format: 'M dd, yyyy',
                    clearBtn: true,
                    closeBtn: true,// close button visible
                    weekStart: $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK == null ? 0 : parseInt($scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK)
                };
                date_input.datepicker(options);
            }
        }

    };
    $scope.dateinputOpenDate_BI();
    $scope.ONCHANGE_SELECT_SYSTEM_NAME = function (SYSTEM_NAME, SELECT_ALL) {
        if (SELECT_ALL == true) {
            angular.forEach(SYSTEM_NAME, function (item) {
                item.SELECTED = true;
            });
        }
        else {
            angular.forEach(SYSTEM_NAME, function (item) {
                item.SELECTED = false;
            });
            $scope.COUNTRIES = [];
            $scope.SALES_DAILY = [];
            $scope.COVERS_DAILY = [];
            $scope.SPEND_DAILY = [];
            $scope.COUNTRIES = [];
            $scope.SALES_WEEKLY = [];
            $scope.COVERS_WEEKLY = [];
            $scope.SPEND_WEEKLY = [];
            $scope.COUNTRIES = [];
            $scope.SALES_MONTHLY = [];
            $scope.COVERS_MONTHLY = [];
            $scope.SPEND_MONTHLY = [];
            $scope.COUNTRIES = [];
            $scope.SALES_YEARLY = [];
            $scope.COVERS_YEARLY = [];
            $scope.SPEND_YEARLY = [];
        }
        $scope.ConsolidatedSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;

    };
    $scope.ONCHANGE_SINGLE_SELECT_SYSTEM_NAME = function (SYSTEM) {
        $scope.ConsolidatedSearch.ALL_SOURCE_SELECTED_FLAG = 0;
        angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
            if (item.SELECTED == true)
                $scope.ConsolidatedSearch.ALL_SOURCE_SELECTED_FLAG += 1;
            else
                $scope.ConsolidatedSearch.ALL_SOURCE_SELECTED_FLAG -= 1;
        });
        $scope.ConsolidatedSearch.ALL_SOURCE_SELECTED_FLAG == $scope.UNIQUE_SYSTEM_NAME.length ? $scope.ConsolidatedSearch.SYSTEM_NAME = true : $scope.ConsolidatedSearch.SYSTEM_NAME = false;
        $scope.ConsolidatedSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;

    };

    $scope.GET_USER_ENTITIES_WITH_EPOS = function () {
        CashupModel = new Object();
        CashupModel.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.REPORT_API(CashupModel, 'GET_USER_ENTITIES_WITH_EPOS').then(function (data) {
            if (data.data.Table.length != null) {
                $scope.USER_ENTITIES_WITH_EPOS = data.data.Table;
                $scope.UNIQUE_CUSTOMER = $filter('unique')(data.data.Table, 'CUSTOMER_ID');
            }
            else {
                $scope.USER_ENTITIES_WITH_EPOS = [];
            }
            // $scope.GET_CONSOLIDATED_DATES(new Date($scope.ConsolidatedSearch.YEARLY));
        });
    };
    $scope.GET_USER_ENTITIES_WITH_EPOS();

    $scope.$parent.dateinputOpenDate();

    $scope.FILTER_ENTITY_BY_CUSTOMER = function () {
        $scope.CIReportForm.submitted = false;
        $scope.COUNTRIES = [];
        $scope.SALES_DAILY = [];
        $scope.COVERS_DAILY = [];
        $scope.SPEND_DAILY = [];

        $scope.SALES_WEEKLY = [];
        $scope.COVERS_WEEKLY = [];
        $scope.SPEND_WEEKLY = [];

        $scope.SALES_MONTHLY = [];
        $scope.COVERS_MONTHLY = [];
        $scope.SPEND_MONTHLY = [];

        $scope.SALES_YEARLY = [];
        $scope.COVERS_YEARLY = [];
        $scope.SPEND_YEARLY = [];
        $scope.ConsolidatedSearch.SYSTEM_NAME = false;
        $scope.ConsolidatedSearch.SELECTED_SITE_COUNT = 0;
        $scope.UNIQUE_SYSTEM_NAME = $scope.USER_ENTITIES_WITH_EPOS.filter(p => p.CUSTOMER_ID == $scope.ConsolidatedSearch.CUSTOMER_ID);
        if ($scope.UNIQUE_SYSTEM_NAME.length > 0) {
            angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
                item.SELECTED = true;
            });
            $scope.ConsolidatedSearch.SYSTEM_NAME = true;
            $scope.ConsolidatedSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;
            $scope.ConsolidatedSearch.CUSTOMER_LOGO = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.CUSTOMER_ID == $scope.ConsolidatedSearch.CUSTOMER_ID)[0]["LOGO_PATH"];
        }
        else {
            $scope.ConsolidatedSearch.SYSTEM_NAME = false;
            $scope.ConsolidatedSearch.SELECTED_SITE_COUNT = 0;//$scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;
            $scope.ConsolidatedSearch.CUSTOMER_LOGO = "";//$scope.UNIQUE_SYSTEM_NAME[0]['LOGO_PATH'];
        }
        //$scope.GET_CONSOLIDATED_DATES($scope.ConsolidatedSearch.YEARLY);
    };
    $scope.CASHUP_CONSOLIDATED_DASHBOARD_HIGHLIGHT = function (CLICKED_DATA) {

        if ($scope.ConsolidatedSearch.CLICKED_COUNT == 0) {
            $scope.ConsolidatedSearch.CLICKED_COUNT += 1;
            $scope.ConsolidatedSearch.IS_CLICKED = true;
            $scope.ENTITY_HIGHLIGHT = CLICKED_DATA.BRANCH_ID;
        }
        else if ($scope.ConsolidatedSearch.CLICKED_COUNT == 1) {
            $scope.ConsolidatedSearch.CLICKED_COUNT = 0;
            $scope.ConsolidatedSearch.IS_CLICKED = false;
            $scope.ENTITY_HIGHLIGHT = null;
        }
    };
    $scope.PRINT_PDF = function () {

        document.getElementById("BI_Loader").style.display = "block";
        const node = document.getElementById("content");
        const clone = node.cloneNode(true);

        clone.getElementsByClassName('border-bottom')[0].removeAttribute('hidden');
        //clone.getElementsByClassName('border-bottom')[1].removeAttribute('hidden');
        //clone.getElementsByClassName('border-bottom')[2].removeAttribute('hidden');

        for (var i = 0; i < clone.getElementsByTagName("td").length; i++) {
            if (clone.getElementsByTagName('td')[i].className == 'ng-binding text-grey') {
                clone.getElementsByTagName("td")[i].className = 'ng-binding';
            }
            if (clone.getElementsByTagName('td')[i].className == 'text-right ng-binding text-grey') {
                clone.getElementsByTagName("td")[i].className = 'text-right ng-binding ';
            }
        }

        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {

            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            document.body.removeChild(clone);


            var doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            const canvasHeight = canvas.height * ratio;
            doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
            doc.save('Revenue_Consolidate_Report.pdf');

            document.getElementById("BI_Loader").style.display = "none";
        });
    };

    function addDays(date, days) {
        date.setDate(date.getDate() + days);
        return date;
    }
    $scope.CHANGE_WEEK = function () {
        $scope.CREATE_DATES(new Date($scope.ConsolidatedSearch.YEARLY), 2)
    }

    $scope.CREATE_DATES = function (date, FLAG) {
        //$scope.ConsolidatedSearch.CURRENT_DATE = new Date(SELECTED_DATE)
        //if ($scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK != null) {
        //    if (new Date(SELECTED_DATE).getDay() == $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK) {
        //        //$scope.ConsolidatedSearch.START_DATE = new Date(new Date(SELECTED_DATE).setDate(new Date(SELECTED_DATE).getDate() + (-7)));;
        //        $scope.ConsolidatedSearch.START_DATE = new Date(SELECTED_DATE);
        //        $scope.ConsolidatedSearch.END_DATE = new Date(new Date($scope.ConsolidatedSearch.START_DATE).setDate(new Date($scope.ConsolidatedSearch.START_DATE).getDate() + (6)));
        //    }
        //    else {
        //        var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
        //        var lastWeek_Date;
        //        var incriment_Day = new Date(lastWeek);
        //        for (var i = 0; i <= 7; i++) {
        //            if (new Date(incriment_Day).getDay() == $scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK) {
        //                lastWeek_Date = new Date(incriment_Day);
        //                break;
        //            }
        //            else {
        //                incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
        //                incriment_Day = new Date(incriment_Day);
        //            }
        //        }
        //        $scope.ConsolidatedSearch.START_DATE = new Date(lastWeek_Date);
        //        //$scope.ConsolidatedSearch.END_DATE = new Date(SELECTED_DATE);
        //        $scope.ConsolidatedSearch.END_DATE = new Date(new Date(lastWeek_Date).setDate(new Date(lastWeek_Date).getDate() + (6)));
        //    }
        //}
        //if ($scope.ConsolidatedSearch.FIRST_DAY_OF_WEEK == null) {
        //    if (new Date(SELECTED_DATE).getDay() == 0) {
        //        $scope.ConsolidatedSearch.START_DATE = new Date(SELECTED_DATE);
        //        $scope.ConsolidatedSearch.END_DATE = new Date(new Date(SELECTED_DATE).setDate(new Date(SELECTED_DATE).getDate() + (6)));
        //    }
        //    else {
        //        var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
        //        var lastWeek_Date;
        //        var incriment_Day = new Date(lastWeek);
        //        for (var i = 0; i < 7; i++) {
        //            if (new Date(incriment_Day).getDay() == 0) {
        //                lastWeek_Date = new Date(incriment_Day);
        //                break;
        //            }
        //            else {
        //                incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
        //                incriment_Day = new Date(incriment_Day);
        //            }
        //        }
        //        $scope.ConsolidatedSearch.START_DATE = new Date(incriment_Day);
        //        //$scope.ConsolidatedSearch.END_DATE = new Date(SELECTED_DATE);
        //        $scope.ConsolidatedSearch.END_DATE = new Date(new Date(incriment_Day).setDate(new Date(incriment_Day).getDate() + (6)));
        //    }
        //}

        if (FLAG == 1 && $cookies.get('DSH_START_DATE') != undefined && $cookies.get('DSH_START_DATE') != null && $cookies.get('DSH_START_DATE') != "") {
            $scope.start_date = $scope.$parent.DSBD_FILTER_START_DATE;
            $scope.end_date = $scope.$parent.DSBD_FILTER_END_DATE;
            $scope.ConsolidatedSearch.YEARLY = new Date($cookies.get('DSH_START_DATE'));
            $scope.start_date = new Date($cookies.get('DSH_START_DATE'));
            $scope.end_date = new Date($cookies.get('DSH_END_DATE'));
            $scope.ConsolidatedSearch.SESSION_START_DATE = new Date($cookies.get('DSH_START_DATE'));
        }
        else {
            $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
            $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
            //  $scope.ConsolidatedSearch.SESSION_START_DATE = new Date();
        };
        if ($scope.start_date > date) {
            if (FLAG == 1 || FLAG == 2) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                $scope.end_date = addDays(new Date($scope.start_date), 6);
            }
        };
        var StartDD = $scope.start_date.getDate();
        var Startmm = $scope.start_date.getMonth() + 1;
        var start_dateyyyy = $scope.start_date.getFullYear();

        var EndDD = $scope.end_date.getDate();
        var Endmm = $scope.end_date.getMonth() + 1;
        var Endyyyy = $scope.end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;

        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        $scope.weekpicker.datepicker('update', $scope.start_date);
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);

        $scope.ConsolidatedSearch.START_DATE = $scope.start_date;
        $scope.ConsolidatedSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_END_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })


        $scope.ConsolidatedSearch.WEEK_DATE = new Date($scope.ConsolidatedSearch.START_DATE).getDate() + "/" + month[new Date($scope.ConsolidatedSearch.START_DATE).getMonth()] + "/" + new Date($scope.ConsolidatedSearch.START_DATE).getFullYear()
            + "-" + new Date($scope.ConsolidatedSearch.END_DATE).getDate() + "/" + month[new Date($scope.ConsolidatedSearch.END_DATE).getMonth()] + "/" + new Date($scope.ConsolidatedSearch.END_DATE).getFullYear();
        $scope.ConsolidatedSearch.MONTH_TO_DATE = new Date($scope.ConsolidatedSearch.START_DATE.getFullYear(), $scope.ConsolidatedSearch.START_DATE.getMonth(), 1);
        $scope.ConsolidatedSearch.YEAR_TO_DATE = new Date($scope.ConsolidatedSearch.START_DATE.getFullYear(), 0, 1);

        //$scope.CASHUP_CONSOLIDATED_DASHBOARD();
        //   date_input.datepicker('destroy');
        $scope.dateinputOpenDate_BI();
        $scope.REVENUE_CONSOLIDATED_DASHBOARD();
    };


    $scope.DATE_WEEK_PICKER_CON = function (date) {
        $scope.weekpicker = $('.week-picker');
        $scope.weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            todayHighlight: true,
            container: '#week-picker-wrapper',
            maxDate: 'today'
        }).on("changeDate", function (e) {
            $scope.CREATE_DATES(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date($scope.start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            $scope.CREATE_DATES(prev, 2);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            $scope.CREATE_DATES(next, 2);
        });
        $scope.CREATE_DATES(date, 1);
    }
    $scope.DATE_WEEK_PICKER_CON();
    $scope.GET_CONSOLIDATED_DATES = function (SELECTED_DATE) {
        $scope.dateinputOpenDate_BI();
        $scope.ConsolidatedSearch.SESSION_START_DATE = new Date(SELECTED_DATE);
        $scope.ConsolidatedSearch.CURRENT_DATE = new Date(SELECTED_DATE);
        if ($scope.USER_ENTITIES_WITH_EPOS.length > 0) {
            $scope.ConsolidatedSearch.WEEK_LIST = [];
            if (SELECTED_DATE != null) {
                $scope.CREATE_DATES(new Date(SELECTED_DATE), 2);
            }
            else {
                $scope.COUNTRIES = [];
                $scope.SALES_DAILY = [];
                $scope.COVERS_DAILY = [];
                $scope.SPEND_DAILY = [];
                $scope.COUNTRIES = [];
                $scope.SALES_WEEKLY = [];
                $scope.COVERS_WEEKLY = [];
                $scope.SPEND_WEEKLY = [];
                $scope.COUNTRIES = [];
                $scope.SALES_MONTHLY = [];
                $scope.COVERS_MONTHLY = [];
                $scope.SPEND_MONTHLY = [];
                $scope.COUNTRIES = [];
                $scope.SALES_YEARLY = [];
                $scope.COVERS_YEARLY = [];
                $scope.SPEND_YEARLY = [];
            }
        }
        $scope.REVENUE_CONSOLIDATED_DASHBOARD();
    };
});