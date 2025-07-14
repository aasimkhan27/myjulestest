app.controller('DashBoardController', function ($scope, $http, $cookies, $filter, $localStorage, PrcCommMethods) {

    $scope.DashboardSearch = {
        START_DATE: null,
        END_DATE: null,
        BRANCH_ID: null,
    };
    //$scope.GET_BRANCH_LIST = function () {
    //    var DshBoardModelObj = new Object();
    //    DshBoardModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
    //    PrcCommMethods.DASHBOARD_API(DshBoardModelObj, 'GET_BRANCH_LIST').then(function (data) {
    //        $scope.BRANCH_LIST = data.data.Table;
    //    });
    //};
    //$scope.GET_BRANCH_LIST();

    $scope.CURRENCY_CULTURE_DIGITS_FY = function (Number) {
        text = new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number);
        return text;
    };

    $scope.CURRENCY_CULTURE_FY = function (Number) {
        text = new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Number);
        return text;
    };
    var numberWithCommas = function (x) {
        return $scope.CURRENCY_CULTURE_FY(x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    };
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
    newLegendClickHandlerCategory = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.CARTEGORY_LIST, function (value) {
                        if (value.CATEGORY_NAME == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.CARTEGORY_LIST, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.CAT_TOTAL);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C);
        }
        ci.update();
    };
    newLegendClickHandlerMedia = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.MEDIA_LIST, function (value) {
                        if (value.MEDIA == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.MEDIA_LIST, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.TOTAL_SALES);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C)
        }
        ci.update();
    };
    newLegendClickHandlerSales = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.SALES_BY_TYPE, function (value) {
                        if (value.PRODUCT_TYPE == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.SALES_BY_TYPE, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.TOTAL_SALES);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C);;
        }
        ci.update();
    };
    newLegendClickHandlerPittyCash = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;

        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.PETTY_CASH_LIST, function (value) {
                        if (value.PETTY_CASH_CATEGORY == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.PETTY_CASH_LIST, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.TOTAL_PETTY_CASH);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C);
        }
        ci.update();
    };
    newLegendClickHandlerComVoid = function (e, legendItem) {
        var index = legendItem.index;
        var ci = this.chart;
        var alreadyHidden = (ci.getDatasetMeta(0).hidden === false) ? false : ci.getDatasetMeta(0).hidden;
        ci.data.datasets.forEach(function (e, i) {
            var meta = ci.getDatasetMeta(i);
            meta.data.forEach(function (j) {
                if (j._index == index) {
                    j.hidden = j.hidden === false ? true : false;
                    angular.forEach($scope.COMPLI_VOID, function (value) {
                        if (value.NAME == legendItem.text) {
                            value.hidden = j.hidden;
                        }
                    })
                }
            })
        });
        $scope.TOTAL_GRAPH_C = 0;
        angular.forEach($scope.COMPLI_VOID, function (value) {
            if (!value.hidden) {
                $scope.TOTAL_GRAPH_C += parseInt(value.TOTAL);
            }
        })
        if (ci.config.options.elements.center) {
            ci.config.options.elements.center.text = $scope.CURRENCY_CULTURE_FY($scope.TOTAL_GRAPH_C);;
        }
        ci.update();
    };

    $scope.textlabelstacked = [{ 'ID': 1, 'NAME': 'Breakfast' },
    { 'ID': 2, 'NAME': 'Lunch' },
    { 'ID': 3, 'NAME': 'Dinner' },
    { 'ID': 4, 'NAME': 'All' }];
    //$scope.colours_Session = ['#fdb45c', '#285ec5', '#46bfbd', '#f7464a', '#dcdcdc', '#18ea0c'];
    $scope.colours_Session = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Sales = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_ComVoid = ["#0277bd", "#29b6f6", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Area = ["#0277bd", "#0288d1", "#039be5", "#03a9f4", "#29b6f6"],
        $scope.colours_Category = ["#057091", "#039be5", "#03a9f4", "#29b6f6", "#0C7185"],
        $scope.colours_Media = ["#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.colours_PettyCash = ["#0288d1", "#0288d1", "#039be5", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.colours_RestaurantCash = ["#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.colours_Weekly_RestaurantCash = ["#B1E3FA", "#8ADAFF", "#43BEF7", "#11AEF7", "#29b6f6", "#03a9f4", "#039be5", "#29b6f6", "#03a9f4", "#039be5", "#0288d1"],
        $scope.INTIGRATION_DETAIL = {
            TAB: false
        }
    $scope.COMPLI_VOID = [{ NAME: "Complimentary", ID: 1, TOTAL: 0, PRV_TOTAL: 0 }, { NAME: "VOID", ID: 2, TOTAL: 0, PRV_TOTAL: 0 }]
    $scope.GET_SESN_CTGRY_ARA_MED_GRPH = function () {
        var DshBoardModelObj = new Object();
        DshBoardModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DshBoardModelObj.BRANCH_ID = $scope.DashboardSearch.BRANCH_ID;
        DshBoardModelObj.START_DATE = $scope.DashboardSearch.START_DATE;
        DshBoardModelObj.END_DATE = $scope.DashboardSearch.END_DATE;
        PrcCommMethods.DASHBOARD_API(DshBoardModelObj, 'GET_SESN_CTGRY_ARA_MED_GRPH').then(function (data) {
            if (data.data.Table8.length > 0) {
                $scope.INTIGRATION_DETAIL = data.data.Table8[0]
                $scope.INTIGRATION_DETAIL.INTIGRATION_SYSTEM_ID == 10 || $scope.INTIGRATION_DETAIL.INTIGRATION_SYSTEM_ID == 6 ? $scope.INTIGRATION_DETAIL.TAB = true : $scope.INTIGRATION_DETAIL.TAB = false;

                $scope.data_ComVoid = [];
                $scope.labels_ComVoid = [];
                $scope.totaldata_ComVoid = 0;
                angular.forEach($scope.COMPLI_VOID, function (value) {
                    if (data.data.Table5.length > 0) {
                        if (value.ID == 1) {
                            $scope.data_ComVoid.push(data.data.Table5[0].DISCOUNT);
                            $scope.labels_ComVoid.push('Complimentary');
                            value.TOTAL = data.data.Table5[0].DISCOUNT;
                            $scope.totaldata_ComVoid += value.TOTAL;
                        }
                        if (value.ID == 2) {
                            $scope.data_ComVoid.push(data.data.Table5[0].VOID);
                            $scope.labels_ComVoid.push('Void');
                            value.TOTAL = data.data.Table5[0].VOID;
                            $scope.totaldata_ComVoid += value.TOTAL;
                        }
                    }
                });
            };
            $scope.data_Session = [];
            $scope.labels_Session = [];
            $scope.SESSION_LIST = data.data.Table;
            $scope.totaldata_Session = 0;
            angular.forEach($scope.SESSION_LIST, function (value) {
                $scope.data_Session.push(value.TOTAL_SALES);
                $scope.labels_Session.push(value.SESSION_NAME);
                $scope.totaldata_Session += value.TOTAL_SALES;
            })
            //ENd SESSION 
            //MEDIA_LIST 
            $scope.MEDIA_LIST = data.data.Table1;
            $scope.data_Media = [];
            $scope.labels_Media = [];
            $scope.totaldata_Media = 0;
            angular.forEach($scope.MEDIA_LIST, function (value) {
                $scope.data_Media.push(value.TOTAL_SALES);
                $scope.labels_Media.push(value.MEDIA);
                $scope.totaldata_Media += value.TOTAL_SALES
            })
            //End of MEDIA_LIST 
            //HEADER_DATA 
            //$scope.HEADER_DATA = data.data.Table2;
            //((CURRENT - PREVIOUS) / PREVIOUS) * 100
            //End HEADER_DATA 
            $scope.data_Sales = [];
            $scope.labels_Sales = [];
            $scope.totaldata_Sales = 0;
            angular.forEach(data.data.Table2, function (value) {
                $scope.data_Sales.push(value.TOTAL_SALES);
                $scope.labels_Sales.push(value.PRODUCT_TYPE);
                $scope.totaldata_Sales += value.TOTAL_SALES
            })
            $scope.SALES_BY_TYPE = data.data.Table2;
            //CAT_DATA 
            //End CAT_DATA 
            //AREA_LIST 
            $scope.AREA_LIST = data.data.Table3;
            $scope.totaldata_Area = 0;
            $scope.data_Area = [];
            $scope.labels_Area = [];
            angular.forEach($scope.AREA_LIST, function (value) {
                $scope.data_Area.push(value.TOTAL_SALES);
                $scope.labels_Area.push(value.AREA_NAME);
                $scope.totaldata_Area += value.TOTAL_SALES
            })
            //End AREA_LIST 
            //CARTEGORY_LIST 
            $scope.CARTEGORY_LIST = data.data.Table4
            $scope.totaldata_Category = 0;
            $scope.data_Category = [];
            $scope.labels_Category = [];
            angular.forEach($scope.CARTEGORY_LIST, function (value) {
                $scope.data_Category.push(value.CAT_TOTAL);
                $scope.labels_Category.push(value.CATEGORY_NAME);
                $scope.totaldata_Category += value.CAT_TOTAL
            })
            //End CARTEGORY_LIST 
            $scope.UpArrow = false;
            $scope.DownArrow = false;
            $scope.UpArrow_Revenue = false;
            $scope.UpArrow_Transactions = false;
            $scope.UpArrow_Com = false;
            $scope.UpArrow_Void = false;
            //Header Two
            //((CURRENT - PREVIOUS) / PREVIOUS) * 100
            $scope.HEADER_DATA_REV_TOTAL_COV = data.data.Table5[0];
            $scope.HEADER_DATA_PREV = data.data.Table6[0];
            var Cal = (($scope.HEADER_DATA_REV_TOTAL_COV.TOTAL_COVERS - $scope.HEADER_DATA_PREV.TOTAL_COVERS_PREVIOUS) / $scope.HEADER_DATA_PREV.TOTAL_COVERS_PREVIOUS) * 100
            if (Cal >= 0) {
                $scope.UpArrow = true;
            }

            Cal = (($scope.HEADER_DATA_REV_TOTAL_COV.TOTAL_REVENUE - $scope.HEADER_DATA_PREV.TOTAL_REVENUE_PREVIOUS) / $scope.HEADER_DATA_PREV.TOTAL_REVENUE_PREVIOUS) * 100
            if (Cal >= 0) {
                $scope.UpArrow_Revenue = true;
            }

            Cal = (($scope.HEADER_DATA_REV_TOTAL_COV.TRANSACTION_COUNT - $scope.HEADER_DATA_PREV.TRANSACTION_COUNT_PREVIOUS) / $scope.HEADER_DATA_PREV.TRANSACTION_COUNT_PREVIOUS) * 100
            if (Cal >= 0) {
                $scope.UpArrow_Transactions = true;
            }

            Cal = ((($scope.HEADER_DATA_REV_TOTAL_COV.DISCOUNT) - ($scope.HEADER_DATA_PREV.DISCOUNT)) / $scope.HEADER_DATA_PREV.DISCOUNT) * 100
            if (Cal >= 0) {
                $scope.UpArrow_Com = true;
            }
            Cal = ((($scope.HEADER_DATA_REV_TOTAL_COV.VOID) - ($scope.HEADER_DATA_PREV.VOID)) / $scope.HEADER_DATA_PREV.VOID) * 100
            if (Cal >= 0) {
                $scope.UpArrow_Void = true;
            }


            //End header
            //Petty Cash
            $scope.PETTY_CASH_LIST = data.data.Table7;
            $scope.totaldata_PettyCash = 0;
            $scope.data_PettyCash = [];
            $scope.labels_PettyCash = [];


            angular.forEach($scope.PETTY_CASH_LIST, function (value) {
                $scope.data_PettyCash.push(value.TOTAL_PETTY_CASH);
                $scope.labels_PettyCash.push(value.PETTY_CASH_CATEGORY);
                $scope.totaldata_PettyCash += value.TOTAL_PETTY_CASH
            })
            if ($scope.totaldata_PettyCash == 0) {
                $scope.data_PettyCash = [];
                $scope.labels_PettyCash = [];
            }
            //End PETTY_CASH_LIST 
            Chart.defaults.global.colors = [
                '#46BFBD', // green    
                '#FDB45C', // yellow
                '#97BBCD', // blue
                '#F7464A', // red
                '#DCDCDC', // light grey    
                '#949FB1', // grey  
                '#4D5360',  // dark grey
            ];
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
            $scope.options_Session = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Session),
                    }
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]);
                        }
                    }
                },

                pieceLabel: {
                    render: 'label',
                    fontColor: '#000',
                    position: 'outside',
                    segment: true
                },
                legend: {
                    onClick: newLegendClickHandlerSession,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                        fontColor: '#fff',
                        fontSize: 50,
                        boxWidth: 20
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        }
                    }
                }
            }
            $scope.options_Sales = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Sales)
                    }
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    onClick: newLegendClickHandlerSales,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage1 = (value * 100 / sum).toFixed(0) + "%";
                            return percentage1;
                        },
                        color: '#fff',
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 16,
                            maxSize: 20
                        }
                    }
                }
            }

            $scope.options_Category = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY(Math.round($scope.totaldata_Category, 2)),
                    }
                },

                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    onClick: newLegendClickHandlerCategory,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        }
                    }
                }
            }
            $scope.options_Media = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Media),
                    }
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    onClick: newLegendClickHandlerMedia,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        }
                    }
                }
            }
            $scope.options_Area = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_Area),
                    },
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    //onClick: newLegendClickHandlerNON,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    }
                },
                outlabels: {
                    text: '%l %p',
                    color: 'white',
                    stretch: 5,
                    font: {
                        resizable: true,
                        minSize: 12,
                        maxSize: 18
                    }
                }
            }
            $scope.options_PettyCash = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_PettyCash),
                    },
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    onClick: newLegendClickHandlerPittyCash,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage = (value * 100 / sum).toFixed(0) + "%";
                            return percentage;
                        },
                        color: '#fff',
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        }
                    }
                }
            }
            $scope.options_ComVoid = {
                elements: {
                    center: {
                        text: $scope.CURRENCY_CULTURE_FY($scope.totaldata_ComVoid)
                    }
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.labels[tooltipItem.index] + ":" + $scope.CURRENCY_CULTURE_FY(data.datasets[0].data[tooltipItem.index]);
                        }
                    }
                },
                legend: {
                    onClick: newLegendClickHandlerComVoid,
                    display: true,
                    position: 'bottom',
                    fullWidth: true,
                    labels: {
                        fontColor: '#000',
                        fontSize: 12,
                        boxWidth: 20
                    }
                },
                plugins: {
                    datalabels: {
                        formatter: (value, ctx) => {
                            let sum = 0;
                            let dataArr = ctx.chart.data.datasets[0].data;
                            dataArr.map(data => {
                                sum += data;
                            });
                            let percentage1 = (value * 100 / sum).toFixed(0) + "%";
                            return percentage1;
                        },
                        color: '#fff',
                    },
                    outlabels: {
                        text: '%l %p',
                        color: 'white',
                        stretch: 5,
                        font: {
                            resizable: true,
                            minSize: 16,
                            maxSize: 20
                        }
                    }
                }
            }


        });
    };
    // $scope.GET_SESN_CTGRY_ARA_MED_GRPH();
    $scope.SELECT_BRANCH = function () {
        $scope.data_Cat = [];
        $scope.labels_Cat = [];
        $scope.data_Category = [];
        $scope.labels_Category = [];
        $scope.data_Area = [];
        $scope.labels_Area = [];
        $scope.data_Session = [];
        $scope.labels_Session = [];
        $scope.DatasetArray = [];

        $scope.GET_FIXED_DATE_GRPH();
        $scope.GET_SESN_CTGRY_ARA_MED_GRPH();
    };
    $scope.textlabelsSocial = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    var WEEKLY_SALES;
    var MONTH_BAR_CHART;
    var WEEK_BAR_CHART;
    function WEEKLY_SALES_COMPARISON() {
        if (WEEKLY_SALES) {
            WEEKLY_SALES.destroy();
        }
        WEEKLY_SALES = new Chart(document.getElementById("bar-chart-grouped"), {
            type: 'bar',
            data: {
                labels: $scope.textlabelsSocial,
                datasets: $scope.DatasetArray
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'x',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            angular.forEach(data.datasets, function (val) {
                                if (val.stack == 1) {
                                    val.labelEdit = "Previous week " + val.label;
                                }
                                else {
                                    val.labelEdit = "Current week " + val.label;
                                }
                            });
                            //   console.log(data.datasets[tooltipItem.datasetIndex].labelEdit + ": " + numberWithCommas(tooltipItem.yLabel));
                            //console.log(new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(tooltipItem.yLabel)));
                            return data.datasets[tooltipItem.datasetIndex].labelEdit + ": " + new Intl.NumberFormat($cookies.get("CURRENCY_CULTURE"), { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(parseFloat(tooltipItem.yLabel));
                        },
                    },
                    scales: {
                        xAxes: [{
                            stacked: true,
                            gridLines: { display: false },
                        }],
                        yAxes: [{
                            stacked: true,
                        }],
                    },
                    legend: { display: true }, plugins: {
                        datalabels: {
                            display: false
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: true,
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
                        display: false,
                    }
                }
            },

        });

    };
    $scope.GET_FIXED_DATE_GRPH = function () {
        var DshBoardModelObj = new Object();
        DshBoardModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DshBoardModelObj.BRANCH_ID = $scope.DashboardSearch.BRANCH_ID;
        PrcCommMethods.DASHBOARD_API(DshBoardModelObj, 'GET_FIXED_DATE_GRPH').then(function (data) {
            ///current 
            //
            $scope.CURRENT_WEEK_GRPH = data.data.Table;

            $scope.ARRAY_FAST = [];
            $scope.DatasetArray = [];
            $scope.Amtdata = [];
            var count = 0;
            angular.forEach($scope.textlabelstacked, function (stc, index) {
                var arry2 = new Object();
                $scope.ARRAY_FAST2 = [];
                for (var i = 0; i < $scope.textlabelsSocial.length; i++) {
                    var vl = $scope.textlabelsSocial[i];
                    var CurrentWeek = data.data.Table3.filter(function (x) { return x.SESSION_ID == stc.ID && x.WEEK_DAY == vl });
                    if (CurrentWeek.length > 0) { $scope.ARRAY_FAST2.push(CurrentWeek[0].SESSION_TOTAL_SALES); } else { $scope.ARRAY_FAST2.push(0) }
                };
                arry2.label = stc.NAME,
                    arry2.data = $scope.ARRAY_FAST2,
                    arry2.backgroundColor = $scope.colours_Weekly_RestaurantCash[count],
                    arry2.stack = 1
                $scope.DatasetArray.push(arry2)
                count++;
            })
            var count = 0;
            angular.forEach($scope.textlabelstacked, function (stc, index) {
                var arry = new Object();
                $scope.ARRAY_FAST = [];
                for (var i = 0; i < $scope.textlabelsSocial.length; i++) {
                    var vl = $scope.textlabelsSocial[i];
                    var CurrentWeek = data.data.Table.filter(function (x) { return x.SESSION_ID == stc.ID && x.WEEK_DAY == vl });
                    if (CurrentWeek.length > 0) { $scope.ARRAY_FAST.push(CurrentWeek[0].SESSION_TOTAL_SALES); } else { $scope.ARRAY_FAST.push(0) }
                };
                arry.label = stc.NAME,
                    arry.data = $scope.ARRAY_FAST,
                    arry.backgroundColor = $scope.colours_Weekly_RestaurantCash[count],
                    arry.stack = 2
                $scope.DatasetArray.push(arry);
                count++;
            })
            //  Restaurantchart($scope.textlabelsSocial, $scope.DatasetArray)
            // demo()
            WEEKLY_SALES_COMPARISON(data);
            //month
            //mont 52
            //previce
            $scope.ROLLING_MONTH_SALES_LINE_GRAPH(data.data.Table1);//data.data.Table1 Month wise current
            $scope.ROLLING_26_WEEKS_SALES_LINE_GRAPH(data.data.Table2);//data.data.Table2  26 rolling week
        });

    };

    function reportrange(start, end) {
        $scope.DashboardSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.DashboardSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_SESN_CTGRY_ARA_MED_GRPH();
    };
    $(function () {
        var start = moment().startOf('month');//moment().startOf('isoWeek');//moment().subtract(6, 'days');
        var end = moment().endOf('month');;//moment().subtract(0, 'days');
        //"startDate": moment().startOf('isoWeek'),
        //"endDate": moment(),
        $scope.DashboardSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.DashboardSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        //$('#reportrange span').html('Select Start Date and End Date');

    });
    $scope.ROLLING_26_WEEKS_SALES_LINE_GRAPH = function (DATA_WEEK) {
        $scope.textlabelsWeek = [];
        $scope.DatasetArray3 = [];
        var len = 52;
        for (var j = len; j > -1; j--) {
            if (j == 0) {
                $scope.textlabelsWeek.push("Week " + j);
            }
            else {
                $scope.textlabelsWeek.push("-" + j);
            }
        }
        $scope.Amtdata_Week = [];
        $scope.WEEK_FAST = [];
        angular.forEach($scope.textlabelstacked, function (stc, index) {
            var arry = new Object();
            $scope.WEEK_FAST = [];
            for (var i = $scope.textlabelsWeek.length - 1; i > -1; i--) {
                var X = DATA_WEEK.filter(function (x) { return x.SESSION_ID == stc.ID && x.WEEK_NO == i });
                //var Y = DATA_WEEK.filter(function (y) { return y.SESSION_ID == 2 && y.WEEK_NO == i });
                //var Z = DATA_WEEK.filter(function (z) { return z.SESSION_ID == 3 && z.WEEK_NO == i });
                if (X.length > 0) { $scope.WEEK_FAST.push(X[0].SESSION_TOTAL_SALES); } else { $scope.WEEK_FAST.push(0) }
                //if (Y.length > 0) { $scope.WEEK_FAST.push(Y[0].SESSION_TOTAL_SALES); } else { $scope.WEEK_FAST.push(0); }
                //if (Z.length > 0) { $scope.WEEK_FAST.push(Z[0].SESSION_TOTAL_SALES); } else { $scope.WEEK_FAST.push(0); }
            }
            //  $scope.Amtdata_Week.push($scope.WEEK_FAST);
            arry.label = stc.NAME,
                arry.data = $scope.WEEK_FAST,
                arry.backgroundColor = $scope.colours_RestaurantCash[index],
                //arry.hoverBackgroundColor = "#7E57C2",
                //arry.hoverBorderWidth = 0,
                $scope.DatasetArray3.push(arry)
        });
        //console.log($scope.DatasetArray3);
        WeekChart($scope.textlabelsWeek, $scope.DatasetArray3)
    };
    $scope.ROLLING_MONTH_SALES_LINE_GRAPH = function (MONTH) {
        $scope.textlabelsMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        //var weeklist = $filter('unique')(Month, 'WEEK_NO');
        $scope.Amtdata_Month = [];
        $scope.MONTH_FAST = [];
        $scope.DatasetArray1 = [];
        angular.forEach($scope.textlabelstacked, function (stc, index) {
            var arry = new Object();
            $scope.MONTH_FAST = [];
            for (var i = 0; i < $scope.textlabelsMonth.length; i++) {

                var vl = $scope.textlabelsMonth[i];
                var X = MONTH.filter(function (x) { return x.SESSION_ID == stc.ID && x.MONTH_NAME == vl });
                //var Y = MONTH.filter(function (y) { return y.SESSION_ID == 2 && y.MONTH_NAME == vl });
                //var Z = MONTH.filter(function (z) { return z.SESSION_ID == 3 && z.MONTH_NAME == vl });
                if (X.length > 0) { $scope.MONTH_FAST.push(X[0].SESSION_TOTAL_SALES); } else { $scope.MONTH_FAST.push(0) }
                //if (Y.length > 0) { $scope.MONTH_FAST.push(Y[0].SESSION_TOTAL_SALES); } else { $scope.MONTH_FAST.push(0); }
                //if (Z.length > 0) { $scope.MONTH_FAST.push(Z[0].SESSION_TOTAL_SALES); } else { $scope.MONTH_FAST.push(0); }

            };
            // $scope.Amtdata_Month.push($scope.MONTH_FAST);
            arry.label = stc.NAME,
                arry.data = $scope.MONTH_FAST,
                arry.backgroundColor = $scope.colours_RestaurantCash[index],
                //arry.hoverBackgroundColor = "#7E57C2",
                //arry.hoverBorderWidth = 1
                $scope.DatasetArray1.push(arry)

        });
        MonthChart($scope.textlabelsMonth, $scope.DatasetArray1)
    };
    function Restaurantchart(labels, datasetarr) {
        var bar_ctx = document.getElementById('bar-chart');
        var bar_chart = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: $scope.DatasetArray
            },
            options: {
                animation: {
                    duration: 0,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + $scope.CURRENCY_CULTURE_DIGITS_FY(parseFloat(tooltipItem.yLabel).toFixed(2));
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        barThickness: 70,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: false,
                        ticks: {
                            callback: function (value) { return numberWithCommas(value); },
                        },
                    }],
                },
                legend: { display: true },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            },


        }
        );
    };
    function MonthChart(labels, datasetarr) {
        if (MONTH_BAR_CHART) {
            MONTH_BAR_CHART.destroy();
        }
        var bar_ctx = document.getElementById('Month_bar_chart');
        MONTH_BAR_CHART = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetarr
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + $scope.CURRENCY_CULTURE_DIGITS_FY(parseFloat(tooltipItem.yLabel).toFixed(2));;
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: true,
                    }],
                },
                legend: { display: true },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }

            },
            plugins: [{
                beforeInit: function (chart) {
                    //chart.data.labels.forEach(function (value, index, array) {
                    //    var a = [];
                    //    a.push(value.slice(0, 5));
                    //    var i = 1;
                    //    while (value.length > (i * 5)) {
                    //        a.push(value.slice(i * 5, (i + 1) * 5));
                    //        i++;
                    //    }
                    //    array[index] = a;
                    //})
                }
            }]
        }
        );
    };
    function WeekChart(labels, datasetarr) {
        if (WEEK_BAR_CHART) {
            WEEK_BAR_CHART.destroy();
        }
        var bar_ctx = document.getElementById('Week_bar_chart');
        WEEK_BAR_CHART = new Chart(bar_ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasetarr
            },
            options: {
                animation: {
                    duration: 10,
                },
                tooltips: {
                    mode: 'label',
                    callbacks: {
                        label: function (tooltipItem, data) {
                            return data.datasets[tooltipItem.datasetIndex].label + ": " + $scope.CURRENCY_CULTURE_DIGITS_FY(parseFloat(tooltipItem.yLabel).toFixed(2));
                        }
                    }
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        gridLines: { display: false },
                    }],
                    yAxes: [{
                        stacked: true,

                    }],
                },
                legend: {
                    display: true
                },
                plugins: {
                    datalabels: {
                        display: false
                    }
                }
            },
            plugins: [{
                beforeInit: function (chart) {
                    chart.data.labels.forEach(function (value, index, array) {
                        var a = [];
                        a.push(value.slice(0, 5));
                        var i = 1;
                        while (value.length > (i * 5)) {
                            a.push(value.slice(i * 5, (i + 1) * 5));
                            i++;
                        }
                        array[index] = a;
                    })
                }
            }]
        }
        );
    };

    $(document).on("click", ".ranges ul li", function (event) {
        var a = $(this).attr("data-range-key");
        if (a == "Custom Date" && $scope.loader == 1) {
            $scope.loader = 2;
            var start = moment().startOf('month');
            var end = moment().add(1, 'M').endOf('month');
            //$('#' + ControlName).trigger('show.daterangepicker')
            $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left", 'Open');
            $('#reportrange').data('daterangepicker').show();
        }
        else {
            $scope.loader = 1;
        }
    });
    $scope.loader = 1;
    PrcCommMethods.GET_BRANCH_LIST(parseInt($cookies.get("ENTITY_ID")), parseInt($cookies.get("USERID")), 1).then(function (data) {
        $scope.BRANCH_LIST = data;
        $scope.DashboardSearch.BRANCH_ID = $scope.BRANCH_LIST[0].BRANCH_ID;
        $scope.GET_FIXED_DATE_GRPH();
        $scope.GET_SESN_CTGRY_ARA_MED_GRPH();
    });

    ///-----------Cosolidated report code-------------------------------
    $scope.BIReportSearch = {
        START_DATE: null, END_DATE: null, WEEK_DATE: null, MONTH_TO_DATE: null, YEAR_TO_DATE: null, CURRENT_DATE: null,
        WEEK_LIST: [], CUSTOMER_ID: null,
        WEEK_TD_LIST: [], SYSTEM_NAME: null, ENTITY_ID: null, YEARLY: new Date(),
        ALL_SOURCE_SELECTED_FLAG: 0, FIRST_DAY_OF_WEEK: 0, CALENDAR_SELECTED_DATE: null, IS_CLICKED: false, CLICKED_COUNT: 0,
        SELECTED_SITE_COUNT: 0, PDF_FDW: null, CUSTOMER_LOGO: null
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
    $scope.CASHUP_DASHBOARD_TAB_CLICK = function (TABID) {
        $scope.DAILY_TAB_SHOW_FLAG = false;
        $scope.COSOLIDATED_TAB_SHOW_FLAG = false;
        $scope.SALES_TAB_SHOW_FLAG = false;
        if (TABID == undefined || TABID == 1) {
            $scope.DAILY_TAB_SHOW_FLAG = true;
        }
        else if (TABID == 2) {
            $scope.COSOLIDATED_TAB_SHOW_FLAG = true;
            $scope.GET_USER_ENTITIES_WITH_EPOS();

        }
        else if (TABID == 3) {
            $scope.SALES_TAB_SHOW_FLAG = true;
        }

    };
    $scope.CASHUP_DASHBOARD_TAB_CLICK(1);
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
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

            //$scope.CASHUP_CONSOLIDATED_DASHBOARD();
            $scope.GET_CONSOLIDATED_DATES($scope.BIReportSearch.YEARLY);
        });
    };
    $scope.CASHUP_CONSOLIDATED_DASHBOARD = function () {
        $scope.BIReportForm.submitted = true;
        if ($scope.BIReportForm.$valid) {
            document.getElementById("BI_Loader").style.display = "block";
            $scope.BIReportSearch.PDF_FDW = $scope.FIRST_DAY_OF_WEEK.filter(p => p.ID == $scope.BIReportSearch.FIRST_DAY_OF_WEEK)[0]['WEEKDAY'];

            $scope.TEMP = [];
            angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
                if (item.SELECTED == true) {
                    $scope.TEMP.push(item.ENTITY_ID);
                }
            });
            $scope.BIReportSearch.ENTITY_ID = null;

            CashupModel = new Object();
            CashupModel.ENTITY_IDS = $scope.TEMP.toString();
            CashupModel.START_DATE = (new Date($scope.BIReportSearch.CURRENT_DATE)).toDateString();
            CashupModel.END_DATE = (new Date($scope.BIReportSearch.CURRENT_DATE)).toDateString();
            PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_DASHBOARD').then(function (data) {

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
                CashupModel.ENTITY_IDS = $scope.TEMP.toString(); //$scope.BIReportSearch.SYSTEM_NAME == null ? $scope.TEMP.toString() : $scope.BIReportSearch.ENTITY_ID.toString();
                CashupModel.START_DATE = (new Date($scope.BIReportSearch.START_DATE)).toDateString();
                CashupModel.END_DATE = (new Date($scope.BIReportSearch.CURRENT_DATE)).toDateString();
                PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_DASHBOARD').then(function (data) {
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
                    CashupModel.ENTITY_IDS = $scope.TEMP.toString();//$scope.BIReportSearch.SYSTEM_NAME == null ? $scope.TEMP.toString() : $scope.BIReportSearch.ENTITY_ID.toString();
                    CashupModel.START_DATE = (new Date($scope.BIReportSearch.MONTH_TO_DATE)).toDateString();
                    CashupModel.END_DATE = (new Date($scope.BIReportSearch.CURRENT_DATE)).toDateString();
                    PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_DASHBOARD').then(function (data) {
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
                        CashupModel.ENTITY_IDS = $scope.TEMP.toString();//$scope.BIReportSearch.SYSTEM_NAME == null ? $scope.TEMP.toString() : $scope.BIReportSearch.ENTITY_ID.toString();
                        CashupModel.START_DATE = (new Date($scope.BIReportSearch.YEAR_TO_DATE)).toDateString();
                        CashupModel.END_DATE = (new Date($scope.BIReportSearch.CURRENT_DATE)).toDateString();
                        PrcCommMethods.REPORT_API(CashupModel, 'CASHUP_CONSOLIDATED_DASHBOARD').then(function (data) {
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
        }
    };
    $scope.CASHUP_CONSOLIDATED_DASHBOARD_HIGHLIGHT = function (CLICKED_DATA) {

        if ($scope.BIReportSearch.CLICKED_COUNT == 0) {
            $scope.BIReportSearch.CLICKED_COUNT += 1;
            $scope.BIReportSearch.IS_CLICKED = true;
            $scope.ENTITY_HIGHLIGHT = CLICKED_DATA.ENTITY_ID;
        }
        else if ($scope.BIReportSearch.CLICKED_COUNT == 1) {
            $scope.BIReportSearch.CLICKED_COUNT = 0;
            $scope.BIReportSearch.IS_CLICKED = false;
            $scope.ENTITY_HIGHLIGHT = null;
        }
    };
    $scope.GET_CONSOLIDATED_DATES = function (SELECTED_DATE) {
        $scope.dateinputOpenDate_BI();
        $scope.BIReportSearch.CURRENT_DATE = new Date(SELECTED_DATE);
        if ($scope.USER_ENTITIES_WITH_EPOS.length > 0) {
            $scope.BIReportSearch.WEEK_LIST = [];

            if (SELECTED_DATE != null) {
                $scope.CREATE_DATES(SELECTED_DATE);

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

    };
    $scope.CREATE_DATES = function (SELECTED_DATE) {
        $scope.BIReportSearch.CURRENT_DATE = new Date(SELECTED_DATE)
        if ($scope.BIReportSearch.FIRST_DAY_OF_WEEK != null) {
            if (new Date(SELECTED_DATE).getDay() == $scope.BIReportSearch.FIRST_DAY_OF_WEEK) {
                //$scope.BIReportSearch.START_DATE = new Date(new Date(SELECTED_DATE).setDate(new Date(SELECTED_DATE).getDate() + (-7)));;
                $scope.BIReportSearch.START_DATE = new Date(SELECTED_DATE);
                $scope.BIReportSearch.END_DATE = new Date(new Date($scope.BIReportSearch.START_DATE).setDate(new Date($scope.BIReportSearch.START_DATE).getDate() + (6)));
            }
            else {
                var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
                var lastWeek_Date;
                var incriment_Day = new Date(lastWeek);
                for (var i = 0; i <= 7; i++) {
                    if (new Date(incriment_Day).getDay() == $scope.BIReportSearch.FIRST_DAY_OF_WEEK) {
                        lastWeek_Date = new Date(incriment_Day);
                        break;
                    }
                    else {
                        incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
                        incriment_Day = new Date(incriment_Day);
                    }
                }
                $scope.BIReportSearch.START_DATE = new Date(lastWeek_Date);
                //$scope.BIReportSearch.END_DATE = new Date(SELECTED_DATE);
                $scope.BIReportSearch.END_DATE = new Date(new Date(lastWeek_Date).setDate(new Date(lastWeek_Date).getDate() + (6)));
            }
        }
        if ($scope.BIReportSearch.FIRST_DAY_OF_WEEK == null) {
            if (new Date(SELECTED_DATE).getDay() == 0) {
                $scope.BIReportSearch.START_DATE = new Date(SELECTED_DATE);
                $scope.BIReportSearch.END_DATE = new Date(new Date(SELECTED_DATE).setDate(new Date(SELECTED_DATE).getDate() + (6)));
            }
            else {
                var lastWeek = new Date(new Date(SELECTED_DATE).getFullYear(), new Date(SELECTED_DATE).getMonth(), new Date(SELECTED_DATE).getDate() - 7);
                var lastWeek_Date;
                var incriment_Day = new Date(lastWeek);
                for (var i = 0; i < 7; i++) {
                    if (new Date(incriment_Day).getDay() == 0) {
                        lastWeek_Date = new Date(incriment_Day);
                        break;
                    }
                    else {
                        incriment_Day = new Date(lastWeek).setDate(new Date(lastWeek).getDate() + i);
                        incriment_Day = new Date(incriment_Day);
                    }
                }
                $scope.BIReportSearch.START_DATE = new Date(incriment_Day);
                //$scope.BIReportSearch.END_DATE = new Date(SELECTED_DATE);
                $scope.BIReportSearch.END_DATE = new Date(new Date(incriment_Day).setDate(new Date(incriment_Day).getDate() + (6)));
            }
        }
        $scope.BIReportSearch.WEEK_DATE = new Date($scope.BIReportSearch.START_DATE).getDate() + "/" + month[new Date($scope.BIReportSearch.START_DATE).getMonth()] + "/" + new Date($scope.BIReportSearch.START_DATE).getFullYear()
            + "-" + new Date($scope.BIReportSearch.END_DATE).getDate() + "/" + month[new Date($scope.BIReportSearch.END_DATE).getMonth()] + "/" + new Date($scope.BIReportSearch.END_DATE).getFullYear();
        $scope.BIReportSearch.MONTH_TO_DATE = new Date($scope.BIReportSearch.START_DATE.getFullYear(), $scope.BIReportSearch.START_DATE.getMonth(), 1);
        $scope.BIReportSearch.YEAR_TO_DATE = new Date($scope.BIReportSearch.START_DATE.getFullYear(), 0, 1);
        //$scope.BIReportSearch.CURRENT_DATE = new Date($scope.BIReportSearch.START_DATE);
        //$scope.CASHUP_CONSOLIDATED_DASHBOARD();
        date_input.datepicker('destroy');
        $scope.dateinputOpenDate_BI();

    };
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
        $scope.BIReportSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;

    };
    $scope.ONCHANGE_SINGLE_SELECT_SYSTEM_NAME = function (SYSTEM) {
        $scope.BIReportSearch.ALL_SOURCE_SELECTED_FLAG = 0;
        angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
            if (item.SELECTED == true)
                $scope.BIReportSearch.ALL_SOURCE_SELECTED_FLAG += 1;
            else
                $scope.BIReportSearch.ALL_SOURCE_SELECTED_FLAG -= 1;
        });
        $scope.BIReportSearch.ALL_SOURCE_SELECTED_FLAG == $scope.UNIQUE_SYSTEM_NAME.length ? $scope.BIReportSearch.SYSTEM_NAME = true : $scope.BIReportSearch.SYSTEM_NAME = false;
        $scope.BIReportSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;

    };
    $scope.ONCHANGE_SELECT_ENTITIES = function (ENTITY_LIST, SINGLE_OR_ALL_SELECT_CHECKED) {
        //$scope.CASHUP_CONSOLIDATED_DASHBOARD();
    };
    $scope.PRINT_PDF = function () {

        document.getElementById("BI_Loader").style.display = "block";
        const node = document.getElementById("content");
        const clone = node.cloneNode(true);
        
        clone.getElementsByClassName('border-bottom')[0].removeAttribute('hidden');
        clone.getElementsByClassName('border-bottom')[1].removeAttribute('hidden');
        clone.getElementsByClassName('border-bottom')[2].removeAttribute('hidden');

        for (var i = 0; i < clone.getElementsByTagName("td").length; i++) {
            if (clone.getElementsByTagName('td')[i].className == 'ng-binding text-grey' ) {
                clone.getElementsByTagName("td")[i].className = 'ng-binding';
            }
            if (clone.getElementsByTagName('td')[i].className == 'text-right ng-binding text-grey') {
                clone.getElementsByTagName("td")[i].className = 'text-right ng-binding ';
            }
        }

        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {
           
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            document.body.removeChild(clone);
            //$("#content .border-bottom").each(function () {
            //    debugger;
            //    $(this).removeAttr('hidden');
            //});

            var doc = new jsPDF("p", "mm", "a4");
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;

            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

            //const canvasWidth = canvas.width * ratio;
            const canvasHeight = canvas.height * ratio;

            //const marginX = (pageWidth - canvasWidth);
            //const marginY = (pageHeight - canvasHeight);
        

            doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
            doc.save('Consolidate_Report.pdf');
            document.getElementById("BI_Loader").style.display = "none";







            //var width = doc.internal.pageSize.width
            //var height = doc.internal.pageSize.height;
            //var imgBase64 = canvas.toDataURL('image/jpeg', 1.0);
            //doc.addImage(imgBase64, 'jpeg', 1, 1, width, height);
            //doc.save('BI_REPORT.pdf');
        });
    };
    $scope.NG_INIT = function () {
        $(document).ready(function () {
            $('#chkveg').multiselect({
                includeSelectAllOption: true,
                preventInputChangeEvent: false,
                includeResetOption: false,
            });
            $('#chkveg').multiselect('rebuild');
            $('#chkveg').multiselect('selectAll', true);
            $('#chkveg').multiselect({
                onChange: function (option, checked, select) {
                    //if (checked == false) { alert('');}
                    alert('Changed option ' + $(option).val() + '.');
                    //alert('Changed option ' + $(select).val() + '.');
                    //$scope.test123.push($(option).val());

                }
            });
        });
        //$(document).ready(function () {
        //    $('#chkveg').multiselect({
        //        onChange: function (option, checked, select) {
        //            alert('Changed option ' + $(option).val() + '.');
        //        }
        //    });
        //});
    };
    $scope.dateinputOpenDate_BI = function () {
        var date_inputs = document.getElementsByClassName("dateinputOpenDate_BI") //our date input has the name "date"
        if (date_inputs.length > 0) {
            for (var i = 0; i < date_inputs.length; i++) {
                date_input = $('input[name="' + date_inputs[i].name + '"]'); //our date input has the name "date"
                var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
                var options = {
                    todayBtn: "linked",
                    daysOfWeekHighlighted: $scope.BIReportSearch.FIRST_DAY_OF_WEEK == null || $scope.BIReportSearch.FIRST_DAY_OF_WEEK == 0 ? "0,6" : parseInt($scope.BIReportSearch.FIRST_DAY_OF_WEEK) + "," + (parseInt($scope.BIReportSearch.FIRST_DAY_OF_WEEK) - 1),
                    autoclose: true,
                    forceParse: false,
                    todayHighlight: true,
                    format: 'M dd, yyyy',
                    clearBtn: true,
                    closeBtn: true,// close button visible
                    weekStart: $scope.BIReportSearch.FIRST_DAY_OF_WEEK == null ? 0 : parseInt($scope.BIReportSearch.FIRST_DAY_OF_WEEK)
                };
                date_input.datepicker(options);
            }
        }

    };
    $scope.FILTER_ENTITY_BY_CUSTOMER = function () {
        $scope.BIReportForm.submitted = false;
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
        $scope.BIReportSearch.SYSTEM_NAME = false;
        $scope.BIReportSearch.SELECTED_SITE_COUNT = 0;
        $scope.UNIQUE_SYSTEM_NAME = $scope.USER_ENTITIES_WITH_EPOS.filter(p => p.CUSTOMER_ID == $scope.BIReportSearch.CUSTOMER_ID);
        if ($scope.UNIQUE_SYSTEM_NAME.length > 0) {
            angular.forEach($scope.UNIQUE_SYSTEM_NAME, function (item) {
                item.SELECTED = true;
            });
            $scope.BIReportSearch.SYSTEM_NAME = true;
            $scope.BIReportSearch.SELECTED_SITE_COUNT = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;
            $scope.BIReportSearch.CUSTOMER_LOGO = $scope.UNIQUE_SYSTEM_NAME.filter(p => p.CUSTOMER_ID == $scope.BIReportSearch.CUSTOMER_ID)[0]["LOGO_PATH"];
        }
        else {
            $scope.BIReportSearch.SYSTEM_NAME = false;
            $scope.BIReportSearch.SELECTED_SITE_COUNT = 0;//$scope.UNIQUE_SYSTEM_NAME.filter(p => p.SELECTED == true).length;
            $scope.BIReportSearch.CUSTOMER_LOGO = "";//$scope.UNIQUE_SYSTEM_NAME[0]['LOGO_PATH'];
        }
        //$scope.GET_CONSOLIDATED_DATES($scope.BIReportSearch.YEARLY);
    };
});
