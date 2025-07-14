app.controller('CogsDshBtController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.CogsSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,

    };
    $scope.RESET_GET_COGS_ANALYTICS = function () {
        $scope.CogsSearch = {
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

    $scope.CHART_1_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";
    $scope.CHART_2_COLOR = "#079381,#11b09b,#17cdb5,#0888c3,#5fb5ed,#86c8f3,#5e7a8e,#7699b2,#90b8d4";

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

        $scope.CogsSearch.START_DATE = $scope.start_date;
        $scope.CogsSearch.END_DATE = $scope.end_date;


        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })

        $scope.GET_COGS_ANALYTICS();
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

    $scope.FILL_GRPAH = function (data) {
        $scope.WASTE_VALUE_BY_ITEM_CHART(data.data.WasteVaueByItemObj.Labels, data.data.WasteVaueByItemObj.data);//
        $scope.LIST_OF_STAFF_FOOD_ITEMS_CHART(data.data.WasteVaueByStaffObj.Labels, data.data.WasteVaueByStaffObj.data);

        data.data.WastageSummaryObj.DataSet.filter(function (x) {
            //x.barPercentage = 0.5;
            //x.barThickness = 35;
            //x.maxBarThickness = 28;
            //x.minBarLength = 2;
            x.barThickness = 30;
            x.maxBarThickness = 25;
            x.minBarLength = 2;
        })

        $scope.WASTAGE_SUMMARY_CHART(data.data.WastageSummaryObj.Labels, data.data.WastageSummaryObj.DataSet);

    }

    $scope.GET_COGS_ANALYTICS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.CogsSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.CogsSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.CogsSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.CogsSearch.END_DATE)).toDateString();
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_COGS_ANALYTICS').then(function (data) {
            if (data.data == null || data.data.GrossRevenue_Chart1_Data != undefined && data.data.GrossRevenue_Chart1_Data.length == 0) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            }
            if (data.data != null) {
                $scope.FILL_GRPAH(data);

                $scope.CogsSearch.GP_DRINKS = data.data.GP_DRINKS;//done
                $scope.CogsSearch.GP_FOOD = data.data.GP_FOOD;//done
                $scope.CogsSearch.GP_HOTBEV = data.data.GP_HOTBEV;//done
                $scope.CogsSearch.GP_OTHERS = data.data.GP_OTHERS;//
                $scope.CogsSearch.GP_TOBACCO = data.data.GP_TOBACCO;//done
                $scope.CogsSearch.GP_WINE = data.data.GP_WINE;//done
                $scope.GPVarianceReport = data.data.GPVarianceReport;//done
                $scope.BridgeReportFood = data.data.BridgeReportFood;//done
                $scope.BridgeReportDrinks = data.data.BridgeReportDrinks;//done



                $scope.CogsSearch.PURCHASE_DRINKS = data.data.PURCHASE_DRINKS;//done
                $scope.CogsSearch.PURCHASE_FOOD = data.data.PURCHASE_FOOD;//done
                $scope.CogsSearch.PURCHASE_HOTBEV = data.data.PURCHASE_HOTBEV;//done
                $scope.CogsSearch.PURCHASE_OTHERS = data.data.PURCHASE_OTHERS;
                $scope.CogsSearch.PURCHASE_TOBACCO = data.data.PURCHASE_TOBACCO;
                $scope.CogsSearch.PURCHASE_WIN = data.data.PURCHASE_WINE;//done
                $scope.CogsSearch.StaffFood = data.data.StaffFood;//done
                $scope.CogsSearch.TotalPurchase = data.data.TotalPurchase;//done
                $scope.CogsSearch.TotalWastage = data.data.TotalWastage;//done
                $scope.WeeklyWasteSummaryList = data.data.WeeklyWasteSummaryList;//done

                $scope.$parent.overlay_loadingNew = "none"
                $scope.$parent.COMMON_CODE_CHANGE();
            };
        });
    }

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.CogsSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.CogsSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.CogsSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_COGS_ANALYTICS();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);
    $scope.COGS_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.CogsSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.CogsSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_COGS_ANALYTICS();
    }
    $scope.CURRENCY_CULTURE_FY = function (Number) {
        text = new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number);
        return text;
    };
    var numberWithCommas = function (x) {
        return $scope.CURRENCY_CULTURE_FY(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    };
    $scope.totaldata_Session = 0;
    newLegendClickHandlerSession = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.SESSION_LIST, function (value) {
                        if (value.SESSION_NAME == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.SESSION_LIST, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.TOTAL_SALES);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C);
        }
        ci.update();
    };
    
    //Chart.pluginService.register({
    //    beforeDraw: function (chart) {
    //        if (chart.config.options.elements.center) {
    //            chart.ctx.clearRect(0, 0, chart.width, chart.height);
    //            delete Chart.instances[this.id];
    //            var ctx = chart.chart.ctx;
    //            var centerConfig = chart.config.options.elements.center;
    //            var widthRatio = ((chart.innerRadius * 2) - (((centerConfig.sidePadding || 20) / 100) * (chart.innerRadius * 2))) / (ctx.measureText(centerConfig.text).width);
    //            ctx.fillStyle = centerConfig.color || '#2f6482';
    //            ctx.textAlign = 'center';
    //            ctx.textBaseline = 'middle';
    //            //  ctx.font = Math.min(Math.floor(9 * widthRatio), (chart.innerRadius * 2)) + "px " + (centerConfig.fontStyle || 'Arial');
    //            ctx.font = Math.min(Math.floor(13), (chart.innerRadius * 2)) + "px " + (centerConfig.fontStyle || 'Arial');
    //            ctx.fillText(centerConfig.text, ((chart.chartArea.left + chart.chartArea.right) / 2), ((chart.chartArea.top + chart.chartArea.bottom) / 2));
    //        }
    //    }
    //});
    var GROSS_REVENUE_DATASOURCE_COVERS_ID_VAR = "";
    $scope.WASTE_VALUE_BY_ITEM_CHART = function (Labels, data) {
       // $scope.colours_Waste = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"]
        var sum = data.reduce((accumulator, currentValue) => {
            return accumulator + currentValue
        }, 0);
        $scope.totaldata_Session = sum;
        $scope.labels_Waste = Labels;
        $scope.data_Waste = data;
        $scope.options_Waste = {
            elements: {
                center: {
                    text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Session),
                }
            },
            layout: {
                padding: 120,
            },
            responsive: true,
            maintainAspectRatio: true,
            cutoutPercentage: 60,
            tooltips: {
                mode: 'label',
                callbacks: {
                    label: function (tooltipItem, data) {
                        return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                    }
                }
            },
            plugins: {
                legend: false,
                outlabels: {
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
                            let sum = 0;
                            //datasets.map(dataset => {
                            //    sum += dataset.data[ctx.dataIndex];
                            //});
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
    }
    $scope.data_Staff = [];
    $scope.data_Waste = [];
    $scope.LIST_OF_STAFF_FOOD_ITEMS_CHART = function (Labels, data) {
        $scope.colours_staff = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"];
        $scope.data_Staff = data;
        $scope.labels_Staff = Labels;
    }
    var WASTAGE_SUMMARY
    $scope.WASTAGE_SUMMARY_CHART = function (labels, dataset) {
        if (WASTAGE_SUMMARY) {
            WASTAGE_SUMMARY.destroy();
        }
        WASTAGE_SUMMARY = new Chart(document.getElementById("WASTAGE_SUMMARY_BAR"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 10,
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: false,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: false,
                        //                        barThickness: 6,
                        barPercentage: 0.8,

                    }],
                },
                legend: {
                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                                return i <= 3;
                            });
                        }
                    },
                },
                plugins: {
                    datalabels: {
                        color: '#273746',
                        align: 'end',
                        anchor: 'end',
                        formatter: function (value, context) {
                            //console.log(context)
                            if (value > 0)
                                return parseInt(value);
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
        });
    }
    $scope.GROUPED_SALES_FY = function (dataset) {
        $scope.GROUPED_SALES = {
            chart: {
                "caption": "Sales",
                "captionFontSize": "14",
                //subcaption: "2012-2016",
                xaxisname: "Years",
                "legendItemFontSize": "12",
                //yaxisname: "Total number of apps in store",
                "yAxisName": "Sales (" + $cookies.get("CURRENCY_SYMBOL") + ")",
                "plotHighlightEffect": "fadeout|anchorBgColor=ff0000, anchorBgAlpha=50",
                formatnumberscale: "1",
                plotPaddingPercent: 10,
                "plotBorderThickness": "5",
                "lineThickness": "2",
                plottooltext:
                    "<b>$dataValue</b>  <b>$seriesName</b> in $label",
                "theme": "fusion",
                drawcrossline: "1",
                "paletteColors": "#11b09b,#5fb5ed,#7699b2",
            },
            categories: [
                {
                    category: $scope.WEEK_LIST
                }
            ],
            dataset: dataset,
        };
    }
    $scope.COGS_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("PDF_DOWNLOAD");
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
                doc.save('Cogs Dashboard.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        }
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#PDF_DOWNLOAD"))
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
app.controller('PurchasesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);
    $scope.START_DAY_OF_WEEK = 1;
    $scope.PurchasesAnalyticsSearch = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        START_DATE: $scope.$parent.DSBD_FILTER_START_DATE,
        END_DATE: $scope.$parent.DSBD_FILTER_END_DATE,
        BRANCH_ID: $scope.$parent.DSBD_FILTER_BRANCH_ID,
        ENTITY_ID: parseInt($cookies.get("ENTITY_ID")),
    };
    $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
    $scope.STACKED_BAR_GRAPH_FOR_GROUPED_SUMMARY = {};
    $scope.WEEKLY_GROUPED_SUMMARY_STACKED_BAR = {};
    var WEEKLY_SUPPLIER; var WEEKLY_PURCHASE; var WEEKLY_CATEGORY; var WEEKLY_ORDER_VALUE_COMPARISON;
    $scope.GET_PURCHASE_ANALYTICS = function () {
        $scope.$parent.overlay_loadingNew = "block"
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.COMP_WEEKLY_BREAKDOWN_BY_REASON_OR_STAFF = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.PurchasesAnalyticsSearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.PurchasesAnalyticsSearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.PurchasesAnalyticsSearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.PurchasesAnalyticsSearch.END_DATE)).toDateString();
        RevModelObj.CATEGORY_ID = $scope.PurchasesAnalyticsSearch.CATEGORY_ID;

        RevModelObj.barPercentage = 0.9;
        RevModelObj.barThickness = 12;
        RevModelObj.maxBarThickness = 9;
        RevModelObj.minBarLength = 2;


        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_PURCHASE_ANALYTICS').then(function (data) {
            if (data.data == null || data.data.GrossRevenue_Chart1_Data != undefined && data.data.GrossRevenue_Chart1_Data.length == 0) {
                $scope.FETCHING_RECORD = "No data to display.";
                $scope.$parent.overlay_loadingNew = "none"
            }
            if (data.data != null) {
                $scope.ALL_PURCHASE_ANALYTICS = [];
                $scope.ALL_PURCHASE_ANALYTICS = data.data;
                $scope.CATEGORY_MASTER_LIST = [];
                if (data.data.CategoryWisePurchaseData.length > 0) {
                    $scope.CATEGORY_MASTER_LIST = data.data.CategoryWisePurchaseData;

                    data.data.CategoryWisePurchaseData[0].CategoryPurchase_DataSet.filter(function (x) {
                        //x.barPercentage = 0.5;
                        //x.barThickness = 35;
                        //x.maxBarThickness = 28;
                        //x.minBarLength = 2;
                        x.barThickness = 15;
                        x.maxBarThickness = 10;
                        x.minBarLength = 2;
                    })

                    $scope.PURCHASE_BY_CATEGORY_FY(data.data.CategoryWisePurchaseData[0].CategoryPurchase_DataSet, data.data.CategoryWisePurchaseData[0].CategoryPurchase_Labels);
                    $scope.PurchasesAnalyticsSearch.CATEGORY_ID = data.data.CategoryWisePurchaseData[0].CATEGORY_MASTER_ID;
                }

                data.data.SupplierPurchase_DataSet.filter(function (x) {
                    x.barThickness = 15;
                    x.maxBarThickness = 10;
                    x.minBarLength = 2;
                })
                $scope.WEEKLY_PURCHASE_BY_SUPPLIER_FY(data.data.SupplierPurchase_DataSet, data.data.SupplierPurchase_Labels);
                data.data.OrderValue_DataSet.filter(function (x) {
                    x.barPercentage = 0.5;
                    x.barThickness = 35;
                    x.maxBarThickness = 28;
                    x.minBarLength = 2;
                   
                })
                $scope.ORDER_VALUE_COMPARISON_FY(data.data.OrderValue_DataSet, data.data.OrderValue_Labels);

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

        $scope.PurchasesAnalyticsSearch.START_DATE = $scope.start_date;
        $scope.PurchasesAnalyticsSearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' })
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' })
        $scope.GET_PURCHASE_ANALYTICS();
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

    $scope.WEEKLY_PURCHASE_BY_SUPPLIER_FY = function (dataset, labels) {
        if (WEEKLY_SUPPLIER) {
            WEEKLY_SUPPLIER.destroy();
        }
        WEEKLY_SUPPLIER = new Chart(document.getElementById("PURCHASE_BY_SUPPLIER_BAR"), {
            type: 'horizontalBar',
           // barDatasetSpacing: 10,
            data: {
                labels: labels,
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 100,
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                    }
                },

                scales: {
                    scaleStepWidth: 20,
                    xAxes: [{
                        stacked: false,
                        gridLines: { display: false },

                    }],
                    yAxes: [{
                        stacked: false,
                        //                        barThickness: 6,
                      
                    }],
                },
                legend: {
                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                                return i <= 3;
                            });
                        }
                    },
                },
                plugins: {
                    datalabels: {
                        color: '#273746',
                        align: 'end',
                        anchor: 'end',
                        formatter: function (value, context) {
                            //console.log(context)
                            if (value > 0)
                                return parseInt(value);
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
        });
    }
    $scope.PURCHASE_BY_CATEGORY_FY = function (dataset, labels) {
        if (WEEKLY_CATEGORY) {
            WEEKLY_CATEGORY.destroy();
        }
        WEEKLY_CATEGORY = new Chart(document.getElementById("PURCHASE_BY_CATEGORY_BAR"), {
            type: 'horizontalBar',
            data: {
                labels: labels,
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 10,
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: false,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: false,
                        //                        barThickness: 6,
                        barPercentage: 0.8,

                    }],
                },
                legend: {
                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                                return i <= 3;
                            });
                        }
                    },
                },
                plugins: {
                    datalabels: {
                        color: '#273746 ',
                        align: 'end',
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
        });
    }
    $scope.ORDER_VALUE_COMPARISON_FY = function (dataset, labels) {
        if (WEEKLY_ORDER_VALUE_COMPARISON) {
            WEEKLY_ORDER_VALUE_COMPARISON.destroy();
        }
        WEEKLY_ORDER_VALUE_COMPARISON = new Chart(document.getElementById("ORDER_VALUE_COMPARISON_BAR"), {
            type: 'bar',
            data: {
                labels: labels,
                datasets: dataset
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 10,
                },
                elements: {
                    bar: {
                        borderWidth: 0,
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: false,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: false,
                        barPercentage: 0.5,
                        barThickness: 6,
                        maxBarThickness: 8,
                        minBarLength: 2,
                    }],
                },
                legend: {

                    display: true,
                    labels: {
                        generateLabels: function (chart) {
                            return Chart.defaults.global.legend.labels.generateLabels.apply(this, [chart]).filter(function (item, i) {
                                return i <= 3;
                            });
                        }
                    },
                },
                plugins: {
                    datalabels: {
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
        });
    }
    $scope.CATEGORY_MASTER_LIST = [];

    $scope.CHANGE_CATEGORY_FY = function () {

        $scope.PURCHASE_BY_CATEGORY_FY($scope.ALL_PURCHASE_ANALYTICS.CategoryWisePurchaseData.filter(function (x) { return x.CATEGORY_MASTER_ID == $scope.PurchasesAnalyticsSearch.CATEGORY_ID })[0].CategoryPurchase_DataSet, $scope.ALL_PURCHASE_ANALYTICS.CategoryWisePurchaseData.filter(function (x) { return x.CATEGORY_MASTER_ID == $scope.PurchasesAnalyticsSearch.CATEGORY_ID })[0].CategoryPurchase_Labels);
    }

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.PurchasesAnalyticsSearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.PurchasesAnalyticsSearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.PurchasesAnalyticsSearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_PURCHASE_ANALYTICS();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);
    $scope.PURCHASE_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.PurchasesAnalyticsSearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.PurchasesAnalyticsSearch.BRANCH_ID), { 'path': '/' });
        $scope.GET_PURCHASE_ANALYTICS();
    }
    $scope.PURCHASE_PDF = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("PDF_DOWNLOAD");
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
                doc.save('Purchase.pdf');
                document.getElementById("BI_Loader").style.display = "none";
            });
            node.getElementsByClassName('my-3')[0].setAttribute("style", "display:none")
        };
        if (FLAG == 2) {
            kendo.drawing.drawDOM($("#PDF_DOWNLOAD"))
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
                        fileName: "Purchase.pdf",
                        proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
                    });
                });

        }
    }
})
app.controller('ProfitabilityDshBtController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.$parent.COMMON_CODE_CHANGE();
    $scope.START_DAY_OF_WEEK = 1;
    $scope.DECIMAL_UPTO = 0;
    $scope.DECIMAL_UPTO_ONE = 1;
    $scope.DECIMAL_UPTO_TWO = 2;

    $scope.REVE_ENTITY_LIST = [];
    $scope.REVE_BRANCH_LIST = [];
    $scope.REVE_ENTITY_LIST = JSON.parse($localStorage.ENTITY_LIST);

    $scope.ProfitabilitySearch = {
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
        $scope.ProfitabilitySearch.START_DATE = $scope.start_date;
        $scope.ProfitabilitySearch.END_DATE = $scope.end_date;

        $scope.$parent.DSBD_FILTER_START_DATE = $scope.start_date;
        $scope.$parent.DSBD_FILTER_END_DATE = $scope.end_date;

        $cookies.put('DSH_START_DATE', $scope.start_date, { 'path': '/' });
        $cookies.put('DSH_END_DATE', $scope.end_date, { 'path': '/' });

        //$scope.PAGE_PAYROLL_LOAD();

        $scope.GET_CATEGORY_MASTER();
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
        $scope.ProfitabilitySearch = {
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
    $scope.GET_CATEGORY_MASTER = function () {
        var CustmObj = new Object();
        CustmObj.ENTITY_ID = $scope.ProfitabilitySearch.ENTITY_ID;
        CustmObj.BRANCH_ID = $scope.ProfitabilitySearch.BRANCH_ID;
        PrcCommMethods.ADMIN_API(CustmObj, 'GET_CATEGORY_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.CATEGORY_MASTER_LIST = data.data.Table;
                $scope.AFTER_CATEGORY_MASTER(1);
                $scope.AFTER_CATEGORY_MASTER(-1);
            }
        });
    };
    $scope.AFTER_CATEGORY_MASTER = function (SORT_ORDER) {
        angular.forEach($scope.CATEGORY_MASTER_LIST, function (val) {
            val.SORT_ORDER = SORT_ORDER;
            val.PAGE_NO = $scope.ProfitabilitySearch.PAGE_NO;
            val.PAGE_SIZE = $scope.ProfitabilitySearch.PAGE_SIZE;
            $scope.GET_MENU_PROFITABILITY_ANALYTICS(val, SORT_ORDER)
        });
    };
    $scope.$parent.overlay_loadingNew = "block";

    $scope.CATEGORY_MASTER_LIST_LAZY_LOAD = function (val, SORT_ORDER) {
        $scope.GET_MENU_PROFITABILITY_ANALYTICS(val, SORT_ORDER)
    }

    $scope.GET_MENU_PROFITABILITY_ANALYTICS = function (val, SORT_ORDER) {
        $scope.$parent.overlay_loadingNew = "block";
        $scope.MENU_PROFITABILITY_ANALYTICS_LIST = [];
        $scope.GRID_DISPLAY = false;
        $scope.GROSSREVENUE_CHART1_DATA = [];
        $scope.FETCHING_RECORD = "Retrieving data. Please wait.";
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.ProfitabilitySearch.ENTITY_ID;
        RevModelObj.BRANCH_ID = $scope.ProfitabilitySearch.BRANCH_ID;
        RevModelObj.START_DATE = (new Date($scope.ProfitabilitySearch.START_DATE)).toDateString();
        RevModelObj.END_DATE = (new Date($scope.ProfitabilitySearch.END_DATE)).toDateString();
        RevModelObj.SORT_ORDER = SORT_ORDER;//--   1 FOR ASC AND -1 FOR DESC
        RevModelObj.CATEGORY_MASTER_ID = val.ID;
        RevModelObj.PAGE_NO = val.PAGE_NO == undefined ? val.PAGE_NO = $scope.ProfitabilitySearch.PAGE_NO : val.PAGE_NO;
        RevModelObj.PAGE_SIZE = val.PAGE_SIZE == undefined ? val.PAGE_SIZE = $scope.ProfitabilitySearch.PAGE_SIZE : val.PAGE_SIZE;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_MENU_PROFITABILITY_ANALYTICS').then(function (data) {
            if (data.data == null) {
                $scope.FETCHING_RECORD = "No data to display.";
            }
            if (data.data != null) {
                if (SORT_ORDER == -1) {
                    if (val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP == undefined) {
                        val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP = [];
                    }
                    if (data.data.length > 0) {
                        val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP = val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP.concat(data.data);
                        if (data.data.length < val.PAGE_SIZE) {
                            val.GetData = false;
                        }
                        else {
                            val.PAGE_NO = parseInt(val.PAGE_NO) + 1;
                            val.GetData = true;
                        }
                    }
                    else {
                        if (val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP.length == 0) {
                        }
                        val.GetData = false;
                    }
                }
                if (SORT_ORDER == 1) {
                    if (val.MENU_PROFITABILITY_ANALYTICS_LIST_BOTTOM == undefined) {
                        val.MENU_PROFITABILITY_ANALYTICS_LIST_BOTTOM = [];
                    }
                    if (data.data.length > 0) {
                        val.MENU_PROFITABILITY_ANALYTICS_LIST_BOTTOM = val.MENU_PROFITABILITY_ANALYTICS_LIST_BOTTOM.concat(data.data);
                        if (data.data.length < val.PAGE_SIZE) {
                            val.GetBTMData = false;
                        }
                        else {
                            val.PAGE_NO = parseInt(val.PAGE_NO) + 1;
                            val.GetBTMData = true;
                        }
                    }
                    else {
                        if (val.MENU_PROFITABILITY_ANALYTICS_LIST_TOP.length == 0) {
                        }
                        val.GetBTMData = false;
                    }
                }
                $scope.$parent.COMMON_CODE_CHANGE();
            };
            $scope.$parent.overlay_loadingNew = "none";
        });
    }

    $scope.ENTITY_CHANGE_FY = function (FLAG) {
        var RevModelObj = new Object();
        RevModelObj.ENTITY_ID = $scope.ProfitabilitySearch.ENTITY_ID;
        RevModelObj.USER_ID = parseInt($cookies.get("USERID"));
        RevModelObj.MODULE_ID = 0;
        PrcCommMethods.DASHBOARD_MODULES_API(RevModelObj, 'GET_BRANCH_LIST_FOR_DASHBOARD').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
            if ($scope.BRANCH_LIST.length > 0 && FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') == undefined || $cookies.get('DSH_BRANCH_ID') == null || $cookies.get('DSH_BRANCH_ID') == "" || isNaN(parseInt($cookies.get('DSH_BRANCH_ID'))))) {
                $scope.ProfitabilitySearch.BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.BRANCH_LIST[0].BRANCH_ID);
                $cookies.put('DSH_BRANCH_ID', parseInt($scope.BRANCH_LIST[0].BRANCH_ID), { 'path': '/' });
            }
            if (FLAG == 1 && ($cookies.get('DSH_BRANCH_ID') != undefined && $cookies.get('DSH_BRANCH_ID') != null && $cookies.get('DSH_BRANCH_ID') != "")) {
                $scope.ProfitabilitySearch.BRANCH_ID = parseInt($cookies.get('DSH_BRANCH_ID'));
            }
            if (FLAG == 1) {
                $scope.GET_UTC_TIME();
            }
            else {
                $scope.GET_CATEGORY_MASTER();
            }
        });
    }
    $scope.ENTITY_CHANGE_FY(1);

    $scope.PROFITABILITY_BRANCH_CHANGE = function () {
        $scope.$parent.DSBD_FILTER_BRANCH_ID = parseInt($scope.ProfitabilitySearch.BRANCH_ID);
        $cookies.put('DSH_BRANCH_ID', parseInt($scope.ProfitabilitySearch.BRANCH_ID), { 'path': '/' });
        $scope.AFTER_CATEGORY_MASTER(1);
        $scope.AFTER_CATEGORY_MASTER(-1);
    }
    $scope.PROFITABILITY_PDFF_FY = function (FLAG) {
        if (FLAG == 1) {
            const node = document.getElementById("PROFITABILITY_PDF_ID");
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
            kendo.drawing.drawDOM($("#PROFITABILITY_PDF_ID"))
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
