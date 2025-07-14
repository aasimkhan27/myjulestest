// time 
function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    // var s = today.getSeconds();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    m = checkTime(m);
    // s = checkTime(s);
    document.getElementById('txt').innerHTML =
        h + ":" + m + ' ' + ampm;
    var t = setTimeout(startTime, 500);
}
function checkTime(i) {
    if (i < 10) { i = "0" + i };  // add zero in front of numbers < 10
    return i;
}

// order chart
var options2 = {
  series: [{
    name: 'Daily',
    data: [2.15, 3, 1.5, 2, 2.4, 3, 2.4,
      2.8, 1.5, 1.7, 3, 2.50, 3, 2, 2.15, 3, 1.10
    ]
  },
  {
    name: 'Weekly',
    data: [-2.15, -3, -1.5, -2, -2.4, -3, -2.4,
    -2.8, -1.5, -1.7, -3, -2.50, -3, -2, -2.15, -3, -1.10
    ]
  },
  {
    name: 'Monthly',
    data: [-2.25, -2.35, -2.45, -2.55, -2.65, -2.75, -2.85,
    -2.95, -3.00, -3.10, -3.20, -3.25, -3.10, -3.00, -2.95, -2.85, -2.75
    ]
  },
  {
    name: 'Yearly',
    data: [2.25, 2.35, 2.45, 2.55, 2.65, 2.75, 2.85,
    2.95, 3.00, 3.10, 3.20, 3.25, 3.10, 3.00, 2.95, 2.85, 2.75
    ]
  }
  ],
  chart: {
    type: 'bar',
    width: 180,
    height: 120,
    stacked: true,
    toolbar: {
      show: false
    },
  },
  plotOptions: {
    bar: {
      vertical: true,
      columnWidth: '40%',
      barHeight: '80%',
      startingShape: 'rounded',
      endingShape: 'rounded'
    },
  },
  colors: [ CubaAdminConfig.primary , CubaAdminConfig.primary , "#F2F3F7", "#F2F3F7"],
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0,
  },
  legend: {
    show: false,
  },
  grid: {
    xaxis: {
        offsetX: -2,
      lines: {
        show: false
      }
    },
    yaxis: {
      lines: {
        show: false
      }
    },
  },
  yaxis: {
    min: -5,
    max: 5,
    show: false,
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false,
    },
    
  },
  tooltip: {
    shared: false,
    x: {
          show: false,
      },
      y: {
          show: false,
      },
      z: {
          show: false,
      },
  },
  xaxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
    offsetX: 0,
    offsetY: 0,
    labels: {
      offsetX: 0,
    offsetY: 0,
      show: false
    },
    axisBorder: {
        offsetX: 0,
    offsetY: 0,
      show: false
    },
    axisTicks: {
        offsetX: 0,
    offsetY: 0,
      show: false
    }

  },
  responsive: [{
          breakpoint: 1760,
          options: {
            chart: {
              width: 160,
            }
          },
        },
        {
          breakpoint: 1601,
          options: {
            chart: {
              height: 110,
            }
          },
        },
        {
          breakpoint: 1560,
          options: {
            chart: {
              width: 140,
            }
          },
        },
        {
          breakpoint: 1460,
          options: {
            chart: {
              width: 120,
            }
          },
        },
        {
          breakpoint: 1400,
          options: {
            chart: {
              width: 290,
            }
          },
        },
        {
          breakpoint: 1110,
          options: {
            chart: {
              width: 200,
            }
          },
        },
        {
          breakpoint: 700,
          options: {
            chart: {
              width: 150,
            }
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              width: 220,
            }
          },
        },
        {
          breakpoint: 420,
          options: {
            chart: {
              width: 150,
            }
          },
        },
      ]
};

var chart2 = new ApexCharts(document.querySelector("#orderchart"),
  options2
);

chart2.render();

// profit chart
var options3 = {
 series: [{
            name: "Desktops",
            data: [210, 180, 650, 200, 600, 100, 800, 300, 500]
        }],
          chart: {
          width: 200,
          height: 150,
          type: 'line',
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: '#16C7F9',
            opacity: 0.3
          },
          zoom: {
            enabled: false
          }
        },
        colors: ["#16C7F9"],
        dataLabels: {
          enabled: false
        },
        stroke: {
          width : 2,
          curve: 'smooth'
        },
        grid: {
          show: false
        },
        tooltip: {
            x: {
                show: false,
            },
            y: {
                show: false,
            },
            z: {
                show: false,
            },
            marker: {
                show: false
            }
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
            labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          }
        },
        responsive: [{
          breakpoint: 1780,
          options: {
            chart: {
              width: 180,
            }
          },
        },
        {
          breakpoint: 1680,
          options: {
            chart: {
              width: 160,
            }
          },
        },
        {
          breakpoint: 1601,
          options: {
            chart: {
              height: 110,
            }
          },
        },
         {
          breakpoint: 1560,
          options: {
            chart: {
              width: 140,
            }
          },
        },
        {
          breakpoint: 1460,
          options: {
            chart: {
              width: 120,
            }
          },
        },
        {
          breakpoint: 1400,
          options: {
            chart: {
              width: 290,
            }
          },
        },
         {
          breakpoint: 1110,
          options: {
            chart: {
              width: 200,
            }
          },
        },
        {
          breakpoint: 700,
          options: {
            chart: {
              width: 150,
            }
          },
        },
        {
          breakpoint: 576,
          options: {
            chart: {
              width: 220,
            }
          },
        },
        {
          breakpoint: 420,
          options: {
            chart: {
              width: 150,
            }
          },
        },
        ]
};

    var chart3 = new ApexCharts(document.querySelector("#profitchart"), options3);
        chart3.render();

// currently sale
var options = {
     series: [
      {
        name:'Earning',
        data:[200,200, 350, 400, 200, 250,250,350, 350, 500, 500, 700,850,700, 400, 400, 250, 250,400, 350,400]
      },
      {
        name: 'Expense',
        data: [400,600,700,400,700,800,800,850,850,900,900,700,600,500,800,800,800,800,400,700,800]
      }
    ],
    chart:{
      type:'bar',
      height:300,
      stacked:true,
      toolbar:{
        show:false,
      },
       dropShadow: {
        enabled: true,
        top: 8,
        left: 0,
        blur: 10,
        color: '#7064F5',
        opacity: 0.1
      }
    }, 
    plotOptions: {
      bar:{       
        horizontal: false,
        columnWidth: '25px',
        borderRadius: 0,
      },
    }, 
    grid: {
      show:true,   
      borderColor: 'var(--chart-border)',               
    },
    dataLabels:{
      enabled: false,
    },
    stroke: {
      width: 2,
      dashArray: 0,
      lineCap: 'butt',
      colors: "#fff",     
    },
    fill: {
      opacity: 1
    },
    legend: {
      show:false
    },    
    states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
    },
    colors:[CubaAdminConfig.primary,'#AAAFCB'],
    yaxis: {
      tickAmount: 3,   
      labels: {
        show: true,
        style: {
          fontFamily: 'Rubik, sans-serif',
        },
      },  
      axisBorder:{
       show:false,
     },
      axisTicks:{
        show: false,
      },
    },
    xaxis:{     
      categories:[
        '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18', '19','20','21'
      ],
      labels: {
        style: {
          fontFamily: 'Rubik, sans-serif',
        },
      },
      axisBorder:{
       show:false,
     },
    axisTicks:{
        show: false,
      },
    },
    states: {          
      hover: {
        filter: {
          type: 'darken',
          value: 1,
        }
      }           
    },    
    responsive: [
        {
          breakpoint: 1661,
          options:{
            chart: {
                height: 290,
            }
          }
        },
         {
          breakpoint: 767,
          options:{
            plotOptions: {
              bar:{       
                columnWidth: '35px',
              },
            }, 
             yaxis: {
                  labels: {
                    show: false,
                  }
                }
          }
        },
        {
          breakpoint: 481,
          options:{
            chart: {
                height: 200,
            }
          }
        },
        {
          breakpoint: 420,
          options:{
            chart: {
                height: 170,
            },
            plotOptions: {
              bar:{       
                columnWidth: '40px',
              },
            }, 
          }
        },
      ]    
  };

var chart = new ApexCharts(document.querySelector("#chart-currently"), options);
chart.render();

// recent chart
var recentoptions = {
    series: [100],
    chart: {
    height: 130,
    type: 'radialBar',
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    radialBar: {
        hollow: {
        margin: 0,
        size: '60%',
        background: 'var(--recent-chart-bg)',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
        dropShadow: {
          enabled: true,
          top: 3,
          left: 0,
          blur: 4,
          opacity: 0.05
        }
      },
      track: {
        background: '#F4F4F4',
        strokeWidth: '67%',
        margin: 0,
        dropShadow: {
          enabled: true,
          top: 0,
          left: 0,
          blur: 10,
          color: '#ddd',
          opacity: 1
        }
      },
  
      dataLabels: {
        show: true,
        name: {
          offsetY: 30,
          show: true,
          color: '#888',
          fontSize: '17px',
          fontWeight: '500',
          fontFamily: 'Rubik, sans-serif',
        },
        value: {
          formatter: function(val) {
            return parseInt(val);
          },
          offsetY: -8,
          color: '#111',
          fontSize: '20px',
          show: true,
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'horizontal',
      shadeIntensity: 0.5,
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#7366FF",
          opacity: 1
        },
        {
          offset: 20,
          color: "#3EA4F1",
          opacity: 1
        },
        {
          offset: 100,
          color: "#FFFFFF",
          opacity: 1
        },
      ]
    }
  },
  stroke: {
    lineCap: 'round'
  },
  labels: [''],
  responsive: [
        {
          breakpoint: 1840,
          options:{
            chart: {
                height: 260,
            }
          }
        },
        {
          breakpoint: 1700,
          options:{
            chart: {
                height: 250,
            }
          }
        },
        {
          breakpoint: 1660,
          options:{
            chart: {
                height: 100,
                dataLabels: {
                  name: {
                    fontSize: '15px',
                  }
                }
            },
          },
        },
        {
          breakpoint: 1561,
          options:{
            chart: {
                height: 275,
            },
          },
        },
        {
          breakpoint: 1400,
          options:{
            chart: {
                height: 360,
            },
          },
        },
        {
          breakpoint: 1361,
          options:{
            chart: {
                height: 300,
            },
          },
        },
        {
          breakpoint: 1200,
          options:{
            chart: {
                height: 230,
            },
          },
        },
        {
          breakpoint: 1007,
          options:{
            chart: {
                height: 240,
            },
          },
        },
        {
          breakpoint: 600,
          options:{
            chart: {
                height: 230,
            },
          },
        },
      ]  
  };

  var recentchart = new ApexCharts(document.querySelector("#recentchart"), recentoptions);
  recentchart.render();


  // schedule chart
  var scheduleoptions = {
    series: [
    {
      data: [
        {
          x: 'Analysis',
          y: [
            new Date('2022-01-01').getTime(),
            new Date('2022-02-30').getTime()
          ],
          fillColor: 'var(--theme-deafult)'
        },
        {
          x: 'Design',
          y: [
            new Date('2022-02-20').getTime(),
            new Date('2022-04-08').getTime()
          ],
          fillColor: '#54BA4A'
        },
        {
          x: 'Coding',
          y: [
            new Date('2022-01-25').getTime(),
            new Date('2022-03-20').getTime()
          ],
          fillColor: '#FFAA05'
        },
        {
          x: 'Testing',
          y: [
            new Date('2022-01-01').getTime(),
            new Date('2022-03-12').getTime()
          ],
          fillColor: '#46A7FB'
        },
      ]
    }
  ],
    chart: {
    height: 355,
    type: 'rangeBar',
    toolbar:{
        show:false,
      },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      distributed: true,
      barHeight: '40%',
      dataLabels: {
        hideOverflowingLabels: false,
      },
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function(val, opts) {
      var label = opts.w.globals.labels[opts.dataPointIndex]
      var a = moment(val[0])
      var b = moment(val[1])
      var diff = b.diff(a, 'days')
      return label
    },
    textAnchor: 'end',
    offsetX: 0,
    offsetY: 0,
     background: {
    enabled: true,
    foreColor: '#52526C',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'var(--white)',
    opacity: 0.9,
  },
  },
  xaxis: {
    type: 'datetime',
     position: 'top',
  },
  yaxis: {
    axisBorder: {
      show: false
     },
     axisTicks: {
      show: false
     }
  },
  grid: {
    row: {
      colors: ['var(--light-background)', 'var(--white)'],
      opacity: 1
    },
  },
  responsive: [
  {
    breakpoint: 576,
    options:{
      yaxis:{     
        labels: {
          show: false
        },
      },
      grid: {
        padding: {
          left: -10
        }
      }
    }
  },
  ] 
  };

  var schedulechart = new ApexCharts(document.querySelector("#schedulechart"), scheduleoptions);
  schedulechart.render();

 // growth chart
 var growthoptions = {
    series: [{
    name: 'Forecast/Budget',
    data: [10, 12, 15, 5, 15, 12, 13, 10, 20, 12, 15,5]
  },{
    name: 'CY',
    data: [15, 12, 14, 20, 15, 11, 15, 20, 18, 12, 15,10]
  },{
    name: 'LY',
    data: [10, 20, 12, 10, 20, 25, 8, 15, 11, 16, 12,20]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#66DA26', '#2E93fA', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: true
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    }
  }
  };

var growthchart = new ApexCharts(document.querySelector("#growthchart"), growthoptions);
growthchart.render();


// covers chart
 var coversoptions = {
    series: [{
    name: 'Forecast/Budget',
    data: [10, 13, 15, 20, 15, 12, 13, 10, 20, 12, 15,5]
  },{
    name: 'CY',
    data: [15, 18, 10, 20, 15, 11, 15, 20, 18, 12, 15,10]
  },{
    name: 'LY',
    data: [18, 15, 12, 10, 20, 25, 8, 15, 11, 16, 12,20]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#66DA26', '#2E93fA', '#f8507b','#546E7A'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    }
  }
  };

var coverschart = new ApexCharts(document.querySelector("#coverschart"), coversoptions);
coverschart.render();


// COGSchart
 var COGSoptions = {
    series: [{
    name: 'Forecast/Budget',
    data: [10, 13, 15, 20, 15, 12, 13, 10, 20, 12, 15,18, 15, 20, 15, 12, 13, 10, 20, 12, 15,18, 15, 20, 15, 12, 13, 10, 20, 12, 15,18, 15, 20, 15, 12, 13, 10, 20, 12, 15,18, 15, 20, 15, 12, 13, 10, 20, 12, 15,18,10,15,21,26,12,10]
  },{
    name: 'CY',
    data: [15, 18, 10, 20, 15, 11, 15, 20, 18, 12, 15,10, 10, 20, 15, 11, 15, 20, 18, 12, 15,10, 10, 20, 15, 11, 15, 20, 18, 12, 15,10, 10, 20, 15, 11, 15, 20, 18, 12, 15,10, 10, 20, 15, 11, 15, 20, 18, 12, 15,10,18,25,13,19,21,26]
  },{
    name: 'LY',
    data: [18, 15, 12, 10, 20, 25, 8, 15, 11, 16, 12,20, 12, 10, 20, 25, 8, 15, 11, 16, 12,20, 12, 10, 20, 25, 8, 15, 11, 16, 12,20, 12, 10, 20, 25, 8, 15, 11, 16, 12,20, 12, 10, 20, 25, 8, 15, 11, 16, 12,20,10,15,13,25,21,14]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#66DA26', '#2E93fA', '#f8507b', '#546E7A'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    tickAmount: 16,
    categories: ['CW','Week 01', 'Week 02', 'Week 03', 'Week 04', 'Week 04', 'Week 05', 'Week 05', 'Week 06', 'Week 07', 'Week 07', 'Week 08', 'Week 09', 'Week 10', 'Week 11', 'Week 12', 'Week 13', 'Week 14', 'Week 14', 'Week 15', 'Week 16', 'Week 17', 'Week 18', 'Week 19', 'Week 20', 'Week 21', 'Week 22', 'Week 23', 'Week 24', 'Week 25', 'Week 26', 'Week 27', 'Week 28', 'Week 29', 'Week 20', 'Week 30', 'Week 31', 'Week 32', 'Week 32', 'Week 34', 'Week 35', 'Week 36', 'Week 37', 'Week 38', 'Week 39', 'Week 40', 'Week 41', 'Week 42', 'Week 43', 'Week 44', 'Week 45', 'Week 46', 'Week 47', 'Week 48', 'Week 49', 'Week 50', 'Week 51', 'Week 52'],
   
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 1,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    }
  }
  };

var COGSchart = new ApexCharts(document.querySelector("#COGSchart"), COGSoptions);
COGSchart.render();



// Staff chart
 var Staffoptions = {
    series: [{
    name: 'Forecast/Budget',
    data: [10, 13, 15, 20, 15, 12, 13, 10, 20, 12, 15,5]
  },{
    name: 'CY',
    data: [15, 18, 10, 20, 15, 11, 15, 20, 18, 12, 15,10]
  },{
    name: 'LY',
    data: [18, 15, 12, 10, 20, 25, 8, 15, 11, 16, 12,20]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#66DA26', '#2E93fA', '#f8507b', '#546E7A'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    }
  }
  };

var Staffchart = new ApexCharts(document.querySelector("#Staffchart"), Staffoptions);
Staffchart.render();


// Profitability chart
 var Profitabilityoptions = {
    series: [{
    name: 'Forecast/Budget',
    data: [10, 13, 15, 20, 15, 12, 13, 10, 20, 12, 15,5]
  },{
    name: 'CY',
    data: [15, 18, 10, 20, 15, 11, 15, 20, 18, 12, 15,10]
  },{
    name: 'LY',
    data: [18, 15, 12, 10, 20, 25, 8, 15, 11, 16, 12,20]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#66DA26', '#2E93fA', '#f8507b', '#546E7A'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    }
  }
  };

var Profitabilitychart = new ApexCharts(document.querySelector("#Profitabilitychart"), Profitabilityoptions);
Profitabilitychart.render();


   var options = {
          series: [{
          name: 'CW Spend',
          type: 'column',
          data: [440, 505, 414, 671, 227, 413, 201]
        }, {
          name: 'Avg. 4 Weeks',
          type: 'line',
          data: [23, 42, 35, 27, 39, 22, 17]
        },{
          name: 'Avg. 13 Weeks',
          type: 'line',
          data: [16, 18, 25, 15, 28, 12, 29]
        },{
          name: 'Avg. 26 Weeks',
          type: 'line',
          data: [23, 42, 35, 27, 34, 22, 17]
        },
        {
          name: 'Avg. 52 Weeks',
          type: 'line',
          data: [14, 35, 20, 38, 15, 30, 35]
        }],
          chart: {
          height: 290,          
          type: 'line',
          fontFamily: 'Rubik, sans-serif',
            toolbar: {show: false},
            dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#a2a2a2',
            opacity: 0.22
          },

        },
        plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
        }
    },
        //colors: ['#a5d1ff', '#ee9b00', '#0a9396', '#088379', '#e91e63'],
        //colors: ['#a5d1ff','#2E93fA', '#66DA26', '#546E7A', '#FF9800'],
        //colors: ['#a5d1ff', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],

        colors: ['#a5d1ff','#008ffb', '#80f1cb', '#b879f4', '#00a86f'],
        stroke: {
          width: [3, 3, 3, 3, 3],
          curve: 'smooth'
        },
        // title: {
        //   text: 'Traffic Sources'
        // },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1],
          fontFamily: "Rubik, sans-serif",
        },
        labels: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        legend: {
          fontFamily: 'Rubik, sans-serif',
        },
        xaxis: {
          type: 'week'
        },
        yaxis: [{
          title: {
            text: '',
          },
        
        }, {
          opposite: true,
          title: {
            text: ''
          }
        },]
        };

        var Weeklychart = new ApexCharts(document.querySelector("#WeeklySpendchart"), options);
        Weeklychart.render();


// Sales/Covers

   var options = {
          series: [{
          name: 'Covers',
          type: 'column',
          data: [40, 58, 66, 45, 37, 54, 39]
        }, {
          name: 'Sales',
          type: 'line',
          data: [1869, 1258, 2589, 2258, 1258, 3698, 1565]
        }],
          chart: {
          height: 300,
          type: 'line',
          fontFamily: 'Rubik, sans-serif',
          toolbar: {show: false},
          dropShadow: {
              enabled: true,
              enabledOnSeries: undefined,
              top: 5,
              left: 0,
              blur: 4,
              color: '#a2a2a2',
              opacity: 0.3
      },

        },

        colors: ['#a5d1ff','#00a86f', '#80f1cb', '#b879f4', '#00a86f'],
        stroke: {
          width: [3, 3],
          curve: 'smooth'
        },
        // title: {
        //   text: 'Traffic Sources'
        // },
        dataLabels: {
          enabled: false,
          enabledOnSeries: [1],
          fontFamily: "Rubik, sans-serif",
        },
        labels: [ '18 Feb','19 Feb', '20 Feb', '21 Feb', '22 Feb', '23 Feb', '24 Feb'],
        legend: {
      fontFamily: 'Rubik, sans-serif',
    },

    yaxis: {
      labels: {
        show: true,
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
    },

    grid: {
      show: true,
    },

    yaxis: [{
          title: {
            text: '',
          },
        
        }, {
          opposite: true,
          title: {
            text: ''
          }
        },]
        };

        var Weeklychart = new ApexCharts(document.querySelector("#Sales_Covers"), options);
        Weeklychart.render();



var SalesByCategoryoptions = {
          series: [
          {
            name: 'WTD',
            group: 'budget',
            data: [44000, 55000, 41000, 67000, 22000]
          },
          {
            name: 'Avg Last 4 Weeks',
            group: 'actual',
            data: [48000, 50000, 40000, 65000, 25000]
          },
          {
            name: 'Avg Last 13 Weeks',
            group: 'budget',
            data: [13000, 36000, 20000, 8000, 13000]
          },
          {
            name: 'Avg Last 52 Weeks',
            group: 'actual',
            data: [20000, 40000, 25000, 10000, 12000]
          }
        ],
          chart: {
          type: 'bar',
          columnWidth: '100%',
          fontFamily: 'Rubik, sans-serif',
          height: 300,
          toolbar: {
          show: false },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#a2a2a2',
            opacity: 0.50
          },
        
        },
        stroke: {
          width: 0,
          colors: ['#fff']
        },
        dataLabels: {
          enabled: false,
          formatter: (val) => {
            return val / 1000 + 'K'
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
            horizontal: false
          }
        },
        xaxis: {
          categories: [
            'Food',
            'Wine',
            'Tobacco',
            'Drink',
            'Others',
          ]
        },
        fill: {
          opacity: 1
        },
        // colors: ['#88c3ff', '#84fc8f', '#87a9b8', '#ebb687'],
         colors: ['#80c7fd', '#008ffb', '#80f1cb', '#00a86f'],
        yaxis: {
          labels: {
            formatter: (val) => {
              return val / 1000 + 'K'
            }
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        }
        };

        var SalesByCategorychart = new ApexCharts(document.querySelector("#SalesByCategorychart"), SalesByCategoryoptions);
        SalesByCategorychart.render();


/*Line chart*/
  var optionslinechart = {
    chart: {
      toolbar: {
        show: false,
      },

      height: 100,
      width: '88%',
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      show: true,
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
        "2018-09-19T07:30:00",
        "2018-09-19T08:30:00",
        "2018-09-19T09:30:00",
        "2018-09-19T10:30:00",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        top: -25,
        right: -60,
        bottom: -40,
      },
    },
    fill: {
      opacity: 0.2,
    },
    // colors: [CubaAdminConfig.primary],
    colors: ['#a5d1ff','#2E93fA', '#66DA26', '#546E7A', '#FF9800'],
    series: [
      {
        data: [70, 60, 82, 65, 60, 90, 70, 100, 50, 60, 0],
      },
    ],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 100,
          }
        }
      }
    ]
  };

  var chartlinechart = new ApexCharts(
    document.querySelector("#chart-widget1"),
    optionslinechart
  );

  chartlinechart.render();



/*Line chart*/
  var optionslinechart = {
    chart: {
      toolbar: {
        show: false,
      },
      height: 100,
      width: '90%',
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      show: false,
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
        "2018-09-19T07:30:00",
        "2018-09-19T08:30:00",
        "2018-09-19T09:30:00",
        "2018-09-19T10:30:00",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        top: -25,
        right: -60,
        bottom: -40,
      },
    },
    fill: {
      opacity: 0.2,
    },
    // colors: [CubaAdminConfig.primary],
    colors: ['#ffc95f'],
    series: [
      {
        data: [70, 60, 82, 80, 60, 90, 70, 120, 50, 60, 0],
      },
    ],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 100,
          }
        }
      }
    ]
  };

  var chartlinechart = new ApexCharts(
    document.querySelector("#chart-widget2"),
    optionslinechart
  );

  chartlinechart.render();








      
/*Line chart*/
  var optionslinechart = {
    chart: {
      toolbar: {
        show: false,
      },
      height: 100,
      width: '90%',
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      show: false,
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
        "2018-09-19T07:30:00",
        "2018-09-19T08:30:00",
        "2018-09-19T09:30:00",
        "2018-09-19T10:30:00",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        top: -25,
        right: -60,
        bottom: -40,
      },
    },
    fill: {
      opacity: 0.2,
    },
    // colors: [CubaAdminConfig.primary],
    colors: ['#ff6e65'],
    series: [
      {
        data: [70, 60, 82, 80, 60, 90, 70, 80, 50, 60, 0],
      },
    ],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 100,
          }
        }
      }
    ]
  };

  var chartlinechart = new ApexCharts(
    document.querySelector("#chart-widget3"),
    optionslinechart
  );

  chartlinechart.render();







  /*Line chart*/
  var optionslinechart = {
    chart: {
      toolbar: {
        show: false,
      },
      height: 100,
      width: '90%',
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      show: false,
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
        "2018-09-19T07:30:00",
        "2018-09-19T08:30:00",
        "2018-09-19T09:30:00",
        "2018-09-19T10:30:00",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        top: -25,
        right: -60,
        bottom: -40,
      },
    },
    fill: {
      opacity: 0.2,
    },
    // colors: [CubaAdminConfig.success],
    colors: ['#54BA4A'],
    series: [
      {
        data: [70, 60, 82, 80, 60, 90, 40, 70, 80, 60, 0],
      },
    ],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 100,
          }
        }
      }
    ]
  };

  var chartlinechart = new ApexCharts(
    document.querySelector("#chart-widget4"),
    optionslinechart
  );

  chartlinechart.render();




/*Sales_Trend*/
   var options = {
          series: [{
          name: 'Current',
          data: [31, 40, 28, 51, 42, 23, 35]
        }, {
          name: 'Budget',
          data: [11, 32, 45, 32, 34, 52, 41]
        }, {
          name: 'LY',
          data: [18, 25, 31, 40, 18, 43, 37]
        }],
          chart: {
            toolbar: {
            show: false,
            },
          height: 250,
          type: 'area',
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: -5,
            left: 0,
            blur: 4,
            color: '#c8c8c8',
            opacity: 0.22
          },
        },
        
        dataLabels: {
          enabled: false
        },
        colors: ['#66da26','#2e93fa', '#546e7a'],
        stroke: {
          width: 3,
          curve: "smooth",
        },
        xaxis: {
          type: 'category',
          categories: ['18 Feb', '19 Feb', '20 Feb', '20 Feb', '21 Feb', '22 Feb', '24 Feb'],
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
        };

        var chart = new ApexCharts(document.querySelector("#Sales_Trend"), options);
        chart.render();





// covers Spend
 var coversoptions = {
    series: [{
    name: 'Covers',
    data: [10, 13, 15, 20, 15, 12, 13]
  },{
    name: 'SPH',
    data: [15, 18, 10, 18, 21, 11, 15]
  },{
    name: 'LY Covers',
    data: [18, 15, 12, 10, 20, 18, 8]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#9476e1', '#a5d1ff', '#f8507b', '#546E7A'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  xaxis: {
    type: 'category',
    categories: ['18 Feb', '19 Feb', '20 Feb', '20 Feb', '21 Feb', '22 Feb', '24 Feb'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  yaxis: [{
          title: {
            text: '',
          },
        
        }, {
          opposite: true,
          title: {
            text: ''
          }
        },]
  };

var coverschart = new ApexCharts(document.querySelector("#coversspend"), coversoptions);
coverschart.render();



// Category_Breakdown
var optionsvisitor = {
  series: [
    {
      name: "Total Sales %",
      data: [18, 22,  25, 35],
    },
    {
      name: "LY %",
      data: [20, 30,  10, 40],
    },
  ],
  chart: {
    type: "bar",
    height: 250,
    toolbar: {
      show: false,
    },
      
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#c8c8c8',
        opacity: 0.30
      },
  },
  plotOptions: {
    bar: {
      borderRadius: 3,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      horizontal: true,
      columnWidth: "50%",
      dataLabels: {
      position: 'top'
    },
    },
    
  },
  dataLabels: {
    formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: 10,
          textAnchor: "start",
          style: {
            fontSize: '10px',
            colors: ['#797979'],
          }
        },
  stroke: {
    show: true,
    width: 1,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: false,
      },
    },
  },

  colors: ['#2e93fa', "#f8507b"],
  xaxis: {
    categories: ["Food","Wine", "Drinks",  "Others"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      show: false,
      style: {
        fontFamily: "Rubik, sans-serif",
      },
      formatter: (val) => {
              return val + '%'
            },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    categories: ["0%","20%","40%", "60%",  "80%", '100%'],
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      show: true,
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  tooltip: {
        y: {
          formatter: function(value, opts) {
              // const sum = opts.series[0].reduce((a, b) => a + b, 0);
              // const percent = (value / sum) * 100;
              // return percent.toFixed(0) + '%';

              return value.toFixed(0) + '%'
          },
        },
    },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#Category_Breakdown"),
  optionsvisitor
);
chartvisitor.render();








// radial chart js
function radialCommonOption(data) {
  return {
      series: data.radialYseries,
      chart: {
        height: 105,
        type: 'radialBar',
        dropShadow: {
            enabled: true,
            top: 3,
            left: 0,
            blur: 10,
            color: data.dropshadowColor,
            opacity: 0.22
        }
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '80%',
            },
            track: {
                strokeWidth: '100%',
                opacity: 1,
                margin: 0,
            },
            dataLabels: {
                showOn: "always",
                value: {
                    color: "var(--chart-text-color)",
                    fontSize: "14px",
                    show: true,
                    offsetY: -10,
                }
            }
        },
    },
    colors: data.color,
    stroke: {
        lineCap: "round",
    },
    responsive: [
      {
        breakpoint: 1500,
        options:{
            chart: {
              height: 100,
            }
        }
      },
    ]
  }
}

const radial1 = {
  color: ["var(--theme-deafult)"],
  dropshadowColor:"var(--theme-deafult)",
  radialYseries: [70],
};

const radialchart1 = document.querySelector('#radial-chart');
if (radialchart1) {
  var radialprogessChart1 = new ApexCharts(radialchart1, radialCommonOption(radial1));
  radialprogessChart1.render();
}






// Sales_Trend_Spline
  var optionsproductchart = {
    chart: {
      height: 250,
      fontFamily: 'Rubik, sans-serif',
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },
    series: [
      {
        name: "Current",
        data: [50, 120, 90, 100, 70, 95, 40],
      },
      {
        name: "Budget",
        data: [35, 60, 40, 90, 70, 110, 90],
      },
      {
        name: "LY",
        data: [20, 30, 35, 75, 50, 90, 105],
      },
    ],
    fill: {
      // colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
       colors: ['#66da26','#2e93fa','#f8507b', '#546e7a'],
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "rgba(196,196,196, 0.3)",
      padding: {
        top: 0,
        bottom: 10,
        right: 0,
      },
    },
    //colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
    colors: ['#2e93fa','#66da26','#f8507b', '#546e7a'],
    labels: [
      "18 Feb",
      "19 Feb",
      "20 Feb",
      "21 Feb",
      "22 Feb",
      "23 Feb",
      "24 Feb",
    ],
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        color: "rgba(196,196,196, 0.3)",
      },
    },
    yaxis: [
      {
        title: {
          text: "",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
  };

  var chartproductchart = new ApexCharts(
    document.querySelector("#Sales_Trend_Spline"),
    optionsproductchart
  );

    chartproductchart.render();







// sales-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
        fontSize:10,
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#sales-chart"),
  optionsvisitor
);
chartvisitor.render();




// covers-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#covers-chart"),
  optionsvisitor
);
chartvisitor.render();





// spend-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#spend-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();





// sales-wtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#sales-wtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();





// covers-wtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#covers-wtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();






// spend-wtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#spend-wtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();






// sales-mtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#sales-mtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();






// covers-mtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#covers-mtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();









// spend-mtd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#spend-mtd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();






// sales-ytd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#sales-ytd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();





// covers-ytd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#covers-ytd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();





// spend-ytd-consolidated-chart
var optionsvisitor = {
  series: [
    {
      name: "CY",
      data: [18, 10, 65, 18],
    },
    {
      name: "LY",
      data: [25, 50, 30, 30],
    },
    {
      name: "Budget",
      data: [25, 50, 40, 45],
    },
  ],
  chart: {
    type: "bar",
    height: 240,
    toolbar: {
      show: false,
    },
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 5,
        blur: 4,
        color: '#a2a2a2',
        opacity: 0.22
      },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: true,
      },
    },
  },
  colors: ['#2e93fa', '#f8507b', '#66da26','#546E7A'],
  xaxis: {
    categories: ["Notting Hill", "South Ken", "Roll Baby", "Westfield White City"],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    // min: 0,
    // max: 100,
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    fontWeight: 500,
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#spend-ytd-consolidated-chart"),
  optionsvisitor
);
chartvisitor.render();





// Bar_Chart
 var coversoptions = {
   series: [{
    name: 'CW',
    data: [10, 13, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [15, 18, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  title: {
          text: 'Bar',
          align: 'center',
          style: {
            fontSize:  '14px',
            fontWeight:  '500',
            color:  'var(--theme-deafult)'
          },
        },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Bar_Chart"), coversoptions);
coverschart.render();




// Restaurant_Chart
 var coversoptions = {
    series: [{
    name: 'CW',
    data: [10, 13, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [15, 18, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  title: {
          text: 'Restaurant',
          align: 'center',
          style: {
            fontSize:  '14px',
            fontWeight:  '500',
            color:  'var(--theme-deafult)'
          },
        },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Restaurant_Chart"), coversoptions);
coverschart.render();



// Dining_Chart
 var coversoptions = {
    series: [{
    name: 'CW',
    data: [10, 13, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [15, 18, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  title: {
          text: 'Dining',
          align: 'center',
          style: {
            fontSize:  '14px',
            fontWeight:  '500',
            color:  'var(--theme-deafult)'
          },
        },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dining_Chart"), coversoptions);
coverschart.render();




// Breakfast_Chart
 var coversoptions = {
    series: [{
    name: 'CW',
    data: [10, 13, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [15, 18, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Breakfast',
  //         align: 'center',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Breakfast_Chart"), coversoptions);
coverschart.render();




// Lunch_Chart
 var coversoptions = {
    series: [{
    name: 'CW',
    data: [15, 18, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [10, 13, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Lunch',
  //         align: 'center',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Lunch_Chart"), coversoptions);
coverschart.render();





// Dinner_Chart
 var coversoptions = {
    series: [{
    name: 'CW',
    data: [15, 18, 20, 12, 16, 20, 10]
  },{
    name: 'LW',
    data: [12, 15, 10, 18, 21, 11, 15]
  },{
    name: 'LY',
    data: [19, 10, 15, 20, 18, 16, 12]
  }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: ['#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Dinner',
  //         align: 'center',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dinner_Chart"), coversoptions);
coverschart.render();



// Food_Chart
 var coversoptions = {
    series: [
    {
    name: 'Budget',
    data: [15, 20, 13, 18, 11, 19, 10]
    },
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#66da26','#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Food_Chart"), coversoptions);
coverschart.render();



// Wine_Chart
 var coversoptions = {
    series: [{
    name: 'Budget',
    data: [15, 20, 13, 18, 11, 19, 10]
    },
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#66da26','#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Wine',
  //         align: 'center',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Wine_Chart"), coversoptions);
coverschart.render();



// Drinks_Chart
 var coversoptions = {
    series: [{
    name: 'Budget',
    data: [15, 20, 13, 18, 11, 19, 10]
    },
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#66da26','#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Drinks',
  //         align: 'center',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Drinks_Chart"), coversoptions);
coverschart.render();



//Weekly_Sales
var options = {
          series: [{
          name: 'Cash',
          data: [20, 20, 15, 25, 22, 43, 40, 30, 28]
        }, {
          name: 'Visa',
          data: [20, 25, 30, 35, 16, 27, 15, 15, 20]
        }, {
          name: 'Amex',
          data: [20, 25, 10, 20, 21, 14, 20, 10, 12]
        }, {
          name: 'Pay by Link',
          data: [20, 10, 10, 8, 19, 8, 10, 20, 10]
        }, {
          name: 'Crypto',
          data: [20, 20, 35, 12, 22, 8, 15, 25, 30]
        }],
          chart: {
          type: 'bar',
          height: 240,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        grid: {
            show: false,
          },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        //colors: [ '#caf270','#45c490', '#008d93', '#2e5468', '#183646'],
        colors: [ '#027ad4','#0088ef', '#1197fc', '#37a8fc', '#57b4fa'],
        xaxis: {
          tickAmount: 100,
          categories: ['Wk-8', 'Wk-7', 'Wk-6', 'Wk-5', 'Wk-4', 'Wk-3', 'Wk-2', 'Wk-1','CW'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          min: 0,
          max: 100,
          labels: {
            show: false
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Weekly_Sales"), options);
        chart.render();



// Monthly_Sales
var options = {
          series: [{
          name: 'Cash',
          data: [20, 20, 15]
        }, {
          name: 'Visa',
          data: [20, 25, 30]
        }, {
          name: 'Amex',
          data: [20, 25, 10]
        }, {
          name: 'Pay by Link',
          data: [20, 10, 10]
        }, {
          name: 'Crypto',
          data: [20, 20, 35]
        }],
          chart: {
          type: 'bar',
          height: 240,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        grid: {
            show: false,
          },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        colors: [ '#027ad4','#0088ef', '#1197fc', '#37a8fc', '#57b4fa'],
        xaxis: {
          tickAmount: 100,
          categories: ['M-2', 'M-1', 'CM'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          min: 0,
          max: 100,
          labels: {
            show: false
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Monthly_Sales"), options);
        chart.render();




//Weekly_Sales_Color
var options = {
          series: [{
          name: 'Cash',
          data: [20, 20, 15, 25, 22, 43, 40, 30, 28]
        }, {
          name: 'Visa',
          data: [20, 25, 30, 35, 16, 27, 15, 15, 20]
        }, {
          name: 'Amex',
          data: [20, 25, 10, 20, 21, 14, 20, 10, 12]
        }, {
          name: 'Pay by Link',
          data: [20, 10, 10, 8, 19, 8, 10, 20, 10]
        }, {
          name: 'Crypto',
          data: [20, 20, 35, 12, 22, 8, 15, 25, 30]
        }],
          chart: {
          type: 'bar',
          height: 240,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        grid: {
            show: false,
          },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        colors: [ '#008ffb','#00e396', '#feb016', '#f5425c', '#775dd0'],
        xaxis: {
          tickAmount: 100,
          categories: ['Wk-8', 'Wk-7', 'Wk-6', 'Wk-5', 'Wk-4', 'Wk-3', 'Wk-2', 'Wk-1','CW'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          min: 0,
          max: 100,
          labels: {
            show: false
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Weekly_Sales_Color"), options);
        chart.render();



// Monthly_Sales_Color
var options = {
          series: [{
          name: 'Cash',
          data: [20, 20, 15]
        }, {
          name: 'Visa',
          data: [20, 25, 30]
        }, {
          name: 'Amex',
          data: [20, 25, 10]
        }, {
          name: 'Pay by Link',
          data: [20, 10, 10]
        }, {
          name: 'Crypto',
          data: [20, 20, 35]
        }],
          chart: {
          type: 'bar',
          height: 240,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        grid: {
            show: false,
          },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        colors: [ '#008ffb','#00e396', '#feb016', '#f5425c', '#775dd0'],
        xaxis: {
          tickAmount: 100,
          categories: ['M-2', 'M-1', 'CM'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          min: 0,
          max: 100,
          labels: {
            show: false
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Monthly_Sales_Color"), options);
        chart.render();







// area_restaurant_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#area_restaurant_chart"), coversoptions);
coverschart.render();



// Bar_restaurant_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Bar_restaurant_chart"), coversoptions);
coverschart.render();



// Dining_restaurant_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dining_restaurant_chart"), coversoptions);
coverschart.render();





// brkfst_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#brkfst_session_chart"), coversoptions);
coverschart.render();



// Lunch_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Lunch_session_chart"), coversoptions);
coverschart.render();



// Dinner_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dinner_session_chart"), coversoptions);
coverschart.render();




//Reservations_by_Source
var options = {
          series: [{
          name: 'Walk in',
          data: [20, 20, 15, 25, 22, 43, 40]
        }, {
          name: 'Bookings',
          data: [20, 25, 30, 35, 16, 27, 15]
        }, {
          name: 'Reservations',
          data: [20, 25, 10, 20, 21, 14, 20]
        }],
          chart: {
          type: 'bar',
          height: 228,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 0,
            left: 4,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        colors: [ '#008ffb','#29a2fe', '#4eb3ff', '#45c490', '#72df22'],
        xaxis: {
          tickAmount: 100,
          categories: ['M-6', 'M-5', 'M-4', 'M-3', 'M-2', 'M-1','CM'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          // min: 0,
          // max: 100,
          labels: {
            show: true
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Reservations_by_Source"), options);
        chart.render();






// Restaurant_spend_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Restaurant_spend_chart"), coversoptions);
coverschart.render();



// Bar_spend_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Bar_spend_chart"), coversoptions);
coverschart.render();




// Dining_spend_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dining_spend_chart"), coversoptions);
coverschart.render();




// Breakfast_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Breakfast_session_chart"), coversoptions);
coverschart.render();





// Bar_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Bar_session_chart"), coversoptions);
coverschart.render();




// Dining_session_chart
 var coversoptions = {
    series: [
    
    {
      name: 'CW',
      data: [10, 13, 15, 20, 15, 12, 13]
    },{
      name: 'LW',
      data: [12, 10, 18, 15, 18, 13, 15]
    },
    {
      name: 'LY',
      data: [10, 19, 11, 18, 13, 20, 12]
    }],
    chart: {
      height: 250,
      type: 'line',
      fontFamily: 'Rubik, sans-serif',
      toolbar: {
        show: false
      },
      dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#7366ff',
        opacity: 0.22
      },
    },
  grid: {
    yaxis: {
      lines: {
          show: true
      }
    },  
  },
  colors: [ '#2e93fa', '#f2aa2e', '#f8507b'],
  stroke: {
    width: 3,
    curve: 'smooth'
  },
  // title: {
  //         text: 'Food',
  //         align: 'left',
  //         style: {
  //           fontSize:  '14px',
  //           fontWeight:  '500',
  //           color:  'var(--theme-deafult)'
  //         },
  //       },
  xaxis: {
    type: 'category',
    categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    tickAmount: 10,
    labels: {
      style: {
          fontFamily: 'Rubik, sans-serif',
      },
    },
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  },
  fill: {
    type: 'solid',
    gradient: {
      shade: 'dark',
      gradientToColors: [ '#5527FF' ],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      colorStops: [
        {
          offset: 0,
          color: "#5527FF",
          opacity: 1
        },
        {
          offset: 100,
          color: "#E069AE",
          opacity: 1
        },
      ]
      // stops: [0, 100, 100, 100]
    },
  },
  yaxis: {
    // min: 0,
    // max: 28,
    labels: {
      show: true
    },
  },
  // yaxis: [{
  //         title: {
  //           text: '',
  //         },
        
  //       }, {
  //         opposite: true,
  //         title: {
  //           text: ''
  //         }
  //       },]
  };

var coverschart = new ApexCharts(document.querySelector("#Dining_session_chart"), coversoptions);
coverschart.render();


   //Sales_Mix_Chart   
        var options = {
          series: [{
          name: 'FB - Notting Hill',
          data: [30, 23, 29]
        }, {
          name: 'FB - South Ken',
          data: [30, 23, 31]
        }, {
          name: 'RB - Notting hill',
          data: [10, 14, 19]
        }, {
          name: 'RB - Westfield White City',
          data: [30, 40, 21]
        }],
          chart: {
          type: 'bar',
          height: 250,
          stacked: true,
          stackType: '100%',
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
           bar: {
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            horizontal: true,
            columnWidth: "50%",
            barHeight: '50%',
            dataLabels: {
            position: 'center',
            show:false,
          }
        },
        },
         dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: 0,
          style: {
            fontSize: '12px',
            colors: ["#fff"]
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        // title: {
        //   text: 'Fiction Books Sales'
        // },
       
        xaxis: {
          show: false,
           categories: ['CY', 'LY', 'Budget'],
          labels: {
            show:false,

            // formatter: function (val) {
            //   return  val + "%"
            // }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: undefined
          },

        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "%"
            }
          }
        },
        colors: [ '#0092c3', '#98aab9', '#f88c24','#425273'],
        fill: {
          opacity: 1
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
        grid: {
          yaxis: {
            lines: {
                show: false
            }
          },  
        },
        };

        var chart = new ApexCharts(document.querySelector("#Sales_Mix_Chart"), options);
        chart.render();




/////YTD_Sales_Mix_Chart
var options = {
          series: [{
          name: 'FB - Notting Hill',
          data: [80, 50, 30, 40, 100, 20,80, 50, 30, 40, 100, 20],
        }, {
          name: 'FB - South Ken',
          data: [20, 30, 40, 80, 20, 80,20, 30, 40, 80, 20, 80],
        }, {
          name: 'RB - Notting hill',
          data: [44, 76, 78, 13, 43, 10,44, 76, 78, 13, 43, 10],
        },
        {
          name: 'RB - Westfield White City',
          data: [9, 7, 5]
        }],
          chart: {
          height: 250,
          type: 'radar',
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
          toolbar: {
            show: false,
          },
        },
        // title: {
        //   text: 'Radar Chart - Multi Series'
        // },
        stroke: {
          width: 2
        },
        fill: {
          opacity: 0.1
        },
        markers: {
          size: 0
        },
        xaxis: {
        tickAmount: 12,
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }
        
        };

        var chart = new ApexCharts(document.querySelector("#YTD_Sales_Mix_Chart"), options);
        chart.render();






// Covers_Spend_Consolidated
  var optionsproductchart = {
    chart: {
      height: 250,
      fontFamily: 'Rubik, sans-serif',
      type: "area",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 0,
    },
    series: [
      {
        name: "Covers",
        data: [50, 120, 90, 100, 70, 95, 40],
      },
      {
        name: "Avg. Spend",
        data: [35, 60, 40, 90, 70, 110, 90],
      },
    ],
    fill: {
      // colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
       colors: ['#9476e1','#a5d1ff'],
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.4,
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.8,
        stops: [0, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "rgba(196,196,196, 0.3)",
      padding: {
        top: 0,
        bottom: 10,
        right: 0,
      },
    },
    //colors: [CubaAdminConfig.primary, CubaAdminConfig.secondary],
    colors: ['#9476e1','#a5d1ff'],
    labels: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],
    markers: {
      size: 0,
    },
    xaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        color: "rgba(196,196,196, 0.3)",
      },
    },
    yaxis: [
      {
        title: {
          text: "",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " points";
          }
          return y;
        },
      },
    },
  };

  var chartproductchart = new ApexCharts(
    document.querySelector("#Covers_Spend_Consolidated"),
    optionsproductchart
  );

    chartproductchart.render();




// Comps_by_Reason
var options8 = {
    chart: {
        height: 297,
        type: 'pie',
        // dropShadow: {
        //     enabled: true,
        //     enabledOnSeries: undefined,
        //     top: 5,
        //     left: 0,
        //     blur: 4,
        //     color: '#000',
        //     opacity: 0.2
        //   },
    },
    labels: ['Mgmt offer 100%', '10% Local business', '25% Local business', '50% Local business', 'Monetary reduction', '10% Hambros staff', 'Staff discount 50%',  'Supplier discount 25%', 'Director 70% & R&D'],
    series: [44, 55, 13, 43, 22, 46, 52, 14, 26],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return parseInt(val)
      },
    },
      // fill: {
      //     type: 'gradient',
      //   },
      legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                show: false
            }
        }
    }],
    //colors:[ '#0890c2' , '#616264' , '#c8cfd7', '#425273', '#d93a50', '#1f3c50', '#794f77', '#ef701f', '#efd658']
    //colors:[ '#eea146' , '#e77924' , '#e44c27', '#ab3a1c', '#30425a', '#3b84a4', '#426579', '#4198a1', '#1cb4bf']
    colors: [ '#003e6b', '#004a82', '#105e99', '#0067b5', '#027ad4','#0088ef', '#1197fc', '#37a8fc', '#57b4fa'],
}

var chart8 = new ApexCharts(
    document.querySelector("#Comps_by_Reason"),
    options8
);

chart8.render();







// Voids_by_Reason
var options8 = {
    chart: {
        height: 297,
        type: 'pie',
        // dropShadow: {
        //     enabled: true,
        //     enabledOnSeries: undefined,
        //     top: 5,
        //     left: 0,
        //     blur: 4,
        //     color: '#000',
        //     opacity: 0.2
        //   },
    },
    labels: ['Mgmt offer 100%', '10% Local business', '25% Local business', '50% Local business', 'Monetary reduction', '10% Hambros staff', 'Staff discount 50%',  'Supplier discount 25%', 'Director 70% & R&D'],
    series: [35, 44, 26, 55, 22, 13, 52, 43, 14 ],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return parseInt(val)
      },
    },
      // fill: {
      //     type: 'gradient',
      //   },
      legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                show: false
            }
        }
    }],
    //colors:[ '#0890c2' , '#616264' , '#c8cfd7', '#425273', '#d93a50', '#1f3c50', '#794f77', '#ef701f', '#efd658']
    //colors:[ '#eea146' , '#e77924' , '#e44c27', '#ab3a1c', '#30425a', '#3b84a4', '#426579', '#4198a1', '#1cb4bf']
    colors: [ '#003e6b', '#004a82', '#105e99', '#0067b5', '#027ad4','#0088ef', '#1197fc', '#37a8fc', '#57b4fa'],
}

var chart8 = new ApexCharts(
    document.querySelector("#Voids_by_Reason"),
    options8
);

chart8.render();












// Comps
var options = {
          series: [{
          name: 'Comps',
          data: [31, 40, 28, 51, 42, 23, 35]
        }],
          chart: {
            toolbar: {
            show: false,
            },
          height: 250,
          type: 'area',
          dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: -5,
        left: 0,
        blur: 4,
        color: '#c8c8c8',
        opacity: 0.22
      },
        },
        
        dataLabels: {
          enabled: false
        },
        colors: ['#10c762','#2e93fa', '#546e7a'],
        stroke: {
          width: 3,
          curve: "smooth",
        },
        xaxis: {
          type: 'category',
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy HH:mm'
          },
        },
        };

        var chart = new ApexCharts(document.querySelector("#Comps"), options);
        chart.render();




//Voids
var options7 = {
    chart: {
        height: 250,
        type: 'line',
        stacked: false,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#ccc',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    stroke: {
        width: [0, 2, 5],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          columnWidth: '50%'
        }
    },
    series: [{
        name: 'Units',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37]
    }, {
        name: 'Amount',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21]
    }],

    fill: {
        opacity: [0.85,0.25,1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    labels: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    markers: {
        size: 0
    },
    xaxis: {
        type:'week'
    },
    yaxis: {
        min: 0
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if(typeof y !== "undefined") {
                    return  y.toFixed(0) + " views";
                }
                return y;

            }
        }
    },
    legend: {
        labels: {
            useSeriesColors: true
        },
    },
    colors:['#0082e4' , '#4ad000'  ]
}

var chart7 = new ApexCharts(
    document.querySelector("#Voids"),
    options7
);

chart7.render();







//Voids_by_Employee   
        var options = {
          series: [{
          name: 'FB - Notting Hill',
          data: [44, 55, 41, 20]
        }],
          chart: {
          type: 'bar',
          height: 270,
          //stacked: true,
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 3,
            left: 0,
            blur: 4,
            color: '#006cff',
            opacity: 0.2
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar:{
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
              horizontal: true,
              columnWidth: "50%",
              dataLabels: {
              //position: 'top',
              show:true,
            },
          },
        },
         dataLabels: {
          enabled: true,
          formatter: function (val) {
            return  (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
          },
          //offsetY: -20,
          // style: {
          //   fontSize: '12px',
          //   colors: ["#304758"]
          // }
        },
        stroke: {
          width: 0,
          colors:   ['#fff']
        },
        // title: {
        //   text: 'Fiction Books Sales'
        // },
       
        xaxis: {
           categories: ['Employee 01', 'Employee 02', 'Employee 03', 'Employee 04'],
          labels: {
            formatter: function (val) {
              return (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
            }
          },
          show: false,
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          show:false,
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
        grid: {
          yaxis: {
            lines: {
                show: false
            }
          },  
        },
        // colors:['#000' , '#4ad000'  ]
        };

        var chart = new ApexCharts(document.querySelector("#Voids_by_Employee"), options);
        chart.render();





//Comps_by_Employee   
        var options = {
          series: [{
          name: 'FB - Notting Hill',
          data: [44, 55, 41, 20]
        }],
          chart: {
          type: 'bar',
          height: 270,
          //stacked: true,
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 3,
            left: 0,
            blur: 4,
            color: '#006cff',
            opacity: 0.2
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar:{
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
              horizontal: true,
              columnWidth: "50%",
              dataLabels: {
              //position: 'top',
              show:true,
            },
          },
        },
         dataLabels: {
          enabled: true,
          formatter: function (val) {
            return  (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
          },
          //offsetY: -20,
          // style: {
          //   fontSize: '12px',
          //   colors: ["#304758"]
          // }
        },
        stroke: {
          width: 0,
          colors:   ['#fff']
        },
        // title: {
        //   text: 'Fiction Books Sales'
        // },
       
        xaxis: {
           categories: ['Employee 01', 'Employee 02', 'Employee 03', 'Employee 04'],
          labels: {
            formatter: function (val) {
              return (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
            }
          },
          show: false,
          labels: {
            show: false
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: undefined
          },
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return (val *100/140).toFixed(2)+ "%" +" / 140 "  ;
            }
          }
        },
        fill: {
          opacity: 1
        },
        legend: {
          show:false,
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
        grid: {
          yaxis: {
            lines: {
                show: false
            }
          },  
        },
        // colors:['#000' , '#4ad000'  ]
        };

        var chart = new ApexCharts(document.querySelector("#Comps_by_Employee"), options);
        chart.render();








// GP_Categories
var options_GP = {
          series: [
          // {
          //   name: 'CW Cost',
          //   group: 'budget',
          //   data: [44000, 49000, 41000]
          // },
          {
            name: 'CW GP',
            group: 'budget',
            data: [48000, 50000, 40000]
          },
          // {
          //   name: 'LW Cost',
          //   group: 'actual',
          //   data: [13000, 36000, 20000]
          // },
          {
            name: 'LW GP',
            group: 'actual',
            data: [20000, 40000, 25000]
          }
        ],
          chart: {
          type: 'bar',
          height: 245,
          stacked: true,
          toolbar: {
              show: false
            },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 6,
            color: '#7366ff',
            opacity: 0.15
          },
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        dataLabels: {
          formatter: (val) => {
            return val / 1000 + '%'
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
           bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "first",
            horizontal: true,
            columnWidth: "50%",
            dataLabels: {
            position: 'center',
            show:false,
          }
        },
        },
        xaxis: {
          categories: [ 'Food', 'Drink', 'Wine' ],
          labels: {
            show: false,
            formatter: (val) => {
              return val / 1000 + 'K'
            }
          },
        },
        grid: {
          yaxis: {
            lines: {
                show: false
            }
          },  
        },
        fill: {
          opacity: 1,
        },
        colors: [ '#2e93fa', '#f8507b', '#00E396', '#fb0000'],
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        }
        };

        var chart1 = new ApexCharts(document.querySelector("#GP_Categories"), options_GP);
        chart1.render();









//Variance_by_Reason
var options = {
          series: [44, 55, 41, 17, 15],
          chart: {
          height: 300,
          type: 'donut',
          // dropShadow: {
          //   enabled: true,
          //   enabledOnSeries: undefined,
          //   top: 5,
          //   left: 0,
          //   blur: 6,
          //   color: '#7366ff',
          //   opacity: 0.15
          // },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              labels: {
                show: true,
                value: {},
                total: {
                  show: true
                }
              }
            }
          }
        },
         labels: ['GP Variance', 'Stock Variance', 'Staff Food', 'Wastage', 'Unidentified'],
        dataLabels: {
          style: {
            // fontSize: '10px',
            colors: ['#fff'],
          },
          enabled: true
        },
        
        // legend: {
        //   formatter: function(val, opts) {
        //     return val + " - " + opts.w.globals.series[opts.seriesIndex]
        //   }
        // },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "13px",
          fontWeight:"300",
        },
        //colors:[ '#0890c2' , '#616264' , '#591d35', '#425273', '#d93a50', '#1f3c50', '#794f77', '#ef701f', '#efd658'],
        colors:[ '#008ffb' , '#80c7fd' , '#00e196', '#7eedcc', '#f84f7c', '#f77e9e', '#f14e1b', '##f57851', '#efd658'],
        //colors:[ '#eea146' , '#e77924' , '#e44c27', '#ab3a1c', '#30425a', '#3b84a4', '#426579', '#4198a1', '#1cb4bf'],
        // title: {
        //   text: 'Gradient Donut with custom Start-angle'
        // },
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };

        var chart = new ApexCharts(document.querySelector("#Variance_by_Reason"), options);
        chart.render();
      
    




//Top_Contributors
    var options = {
          series: [{
          name: 'Item',
          data: [5.45, 10.42, 5.9,12.5, 17.5, 20.58, 19.23,-8.69, -15.5, -10.42, -12.6, -18.1, -20.68,-22.36 ]
        }],
          chart: {
          type: 'bar',
          height: 300,
          toolbar: {
              show: false
            },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            colors: {
              ranges: [{
                from: -100,
                to: -46,
                color: '#F15B46'
              }, {
                from: -45,
                to: 0,
                color: '#FEB019'
              }]
            },
            columnWidth: '80%',
          },
        },
        dataLabels: {
          enabled: false,
        },
        yaxis: {
          // title: {
          //   text: 'Growth',
          // },
          labels: {
            formatter: function (y) {
              return y.toFixed(0) + "K";  
            }
          }
        },
        xaxis: {
          // type: 'datetime',
          categories: [
            'Food', 'Drinks', 'Wine', 'Tobacco', 'Others', 'Hot Bev', 'Pizza', 'Burger', 'Donut', 'Twister', 'Pasta', 'Bread', 'Mocktails', 'Cocktails', ],
          labels: {
            // rotate: -90
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Top_Contributors"), options);
        chart.render();
      



 //Week_Rolling_GP
var options = {
          series: [{
          name: 'Food',
          data: [22, 43, 40, 30, 28]
        }, {
          name: 'Drinks',
          data: [20, 25, 30, 35, 16]
        }, {
          name: 'Wine',
          data: [21, 14, 20, 10, 12]
        }, {
          name: 'Tobacco',
          data: [20, 10, 10, 20, 10]
        }, {
          name: 'Others',
          data: [20, 8, 15, 25, 30]
        }],
          chart: {
          type: 'bar',
          height: 280,
          stacked: true,
          toolbar: {
            show: false
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
          zoom: {
            enabled: true
          }
        },
        responsive: [{
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0
            }
          }
        }],
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: false,
                style: {
                  fontSize: '12px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        grid: {
            show: false,
          },
        dataLabels: {
          formatter: (val) => {
              return val + '%'
            },
          enabled: true,
          offsetX: -8,
          textAnchor: "start",
          style: {
            fontSize: '10px',
          }
        },
        //colors: [ '#caf270','#45c490', '#008d93', '#2e5468', '#183646'],
        colors: [ '#027ad4','#0088ef', '#1197fc', '#37a8fc', '#57b4fa'],
        xaxis: {
          tickAmount: 100,
          categories: ['Wk-4', 'Wk-3', 'Wk-2', 'Wk-1','CW'],
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          fontFamily: "Rubik, sans-serif",
        },
        fill: {
          opacity: 1
        },
        yaxis: {
          
          // min: 0,
          // max: 100,
          labels: {
            show: false
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Week_Rolling_GP"), options);
        chart.render();






/*Cogs_Sales*/
  var optionslinechart = {
    chart: {
      toolbar: {
        show: false,
      },

      height: 160,
      width: '100%',
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 3,
      curve: "smooth",
    },
    xaxis: {
      show: true,
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00",
        "2018-09-19T01:30:00",
        "2018-09-19T02:30:00",
        "2018-09-19T03:30:00",
        "2018-09-19T04:30:00",
        "2018-09-19T05:30:00",
        "2018-09-19T06:30:00",
        "2018-09-19T07:30:00",
        "2018-09-19T08:30:00",
        "2018-09-19T09:30:00",
        "2018-09-19T10:30:00",
      ],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    grid: {
      show: false,
      padding: {
        left: -10,
        top: -25,
        right: -60,
        bottom: -40,
      },
    },
    fill: {
      opacity: 0.2,
    },
    // colors: [CubaAdminConfig.primary],
    colors: ['#cfe6ff','#2E93fA', '#66DA26', '#546E7A', '#FF9800'],
    series: [
      {
        data: [70, 60, 82, 65, 60, 90, 70, 100, 50, 60, 0],
      },
    ],
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
    responsive: [
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 100,
          }
        }
      }
    ]
  };

  var chartlinechart = new ApexCharts(
    document.querySelector("#Cogs_Sales"),
    optionslinechart
  );

  chartlinechart.render();






//Purchase_by_Supplier1
  var options = {
          series: [{
          name: 'Invoice Count',
          type: 'column',
          data: [1.4, 2, 2.5, 1.5, 2.5, 2.8]
        }, {
          name: 'LW Count',
          type: 'column',
          data: [1.1, 3, 3.1, 4, 4.1, 4.9]
        }, {
          name: 'Invoice Amount',
          type: 'area',
          data: [12, 16, 24, 20, 34, 38]
        }, {
          name: 'LW Amount',
          type: 'area',
          data: [20, 29, 37, 36, 44, 45]
        }],
          chart: {
          height: 350,
          type: 'line',
          stacked: false,
          toolbar: {
            show: false,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 10,
            color: '#373737',
            opacity: 0.10
          },
        },
        fill: {
        opacity: [0.85,0.25,1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.25,
            opacityTo: 0.1,
            stops: [0, 100, 100, 100]
        }
    },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: [3, 3, 3, 3, 3, 3],
          curve: "smooth"
        },
        title: {
          //text: 'XYZ - Stock Analysis (2009 - 2016)',
          align: 'left',
          offsetX: 110
        },
        xaxis: {
          categories: ['Supplier 01', 'Supplier 02', 'Supplier 03', 'Supplier 04', 'Supplier 05', 'Supplier 06'],
        },
        yaxis: [
          {
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB'
            },
            labels: {
              style: {
                colors: '#008FFB',
              }
            },
            title: {
              text: "Supplier",
              style: {
                color: '#008FFB',
              }
            },
            tooltip: {
              enabled: true
            }
          },
          {
            seriesName: 'Income',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396'
            },
            labels: {
              style: {
                colors: '#00E396',
              }
            },
            title: {
              text: "Operating Cashflow (thousand crores)",
              style: {
                color: '#00E396',
              }
            },
          },
          {
            seriesName: 'Revenue',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#FEB019'
            },
            labels: {
              style: {
                colors: '#FEB019',
              },
            },
            title: {
              text: "Revenue (thousand crores)",
              style: {
                color: '#FEB019',
              }
            }
          },
        ],
        tooltip: {
          fixed: {
            enabled: true,
            position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
            offsetY: 30,
            offsetX: 60
          },
        },
        legend: {
          horizontalAlign: 'left',
          offsetX: 40
        }
        };

        var chart = new ApexCharts(document.querySelector("#Purchase_by_Supplier1"), options);
        chart.render();
      



//Purchase_by_Supplier
var options7 = {
    chart: {
        height: 250,
        type: 'line',
        stacked: false,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#ccc',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    stroke: {
        width: [2, 2, 2, 2],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "first",
          horizontal: false,
          columnWidth: "50%",
    },
  },
    series: [{
        name: 'Invoice Count',
        type: 'column',
        data: [29, 15, 18, 22, 19, 12, 30]
    },{
        name: 'LW Count',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37]
    },{
        name: 'Invoice Amount',
        type: 'area',
        data: [21, 43, 22, 41, 65, 54, 40]
    },{
        name: 'LW Amount',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21]
    }],

    fill: {
        opacity: [1, 1, 0.25, 0.25],
        gradient: {
            inverseColors: false,
            shade: 'light',
            //type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
        }
    },
    labels: [ 'Supplier 01', 'Supplier 02', 'Supplier 03', 'Supplier 04', 'Supplier 05', 'Supplier 06', 'Supplier 07'],
    markers: {
        size: 0
    },
    // xaxis: {
    //     type:'week'
    // },
    yaxis: {
        min: 0
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: {
            formatter: function (y) {
                if(typeof y !== "undefined") {
                    return  y.toFixed(0) + " views";
                }
                return y;

            }
        }
    },
    legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
    colors: [ '#2e93fa', '#f8507b', '#59aafc', '#ff86a5',],
}

var chart7 = new ApexCharts(
    document.querySelector("#Purchase_by_Supplier"),
    options7
);

chart7.render();








 //Cost_by_Category   
        var options = {
          series: [{
          name: 'Food',
          data: [30, 23]
        }, {
          name: 'Drinks',
          data: [30, 23]
        }, {
          name: 'Wine',
          data: [10, 14]
        }, {
          name: 'Others',
          data: [30, 40]
        }],
          chart: {
          type: 'bar',
          height: 250,
          stacked: true,
          stackType: '100%',
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              total: {
                enabled: true,
                offsetX: 0,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
           bar: {
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            horizontal: true,
            columnWidth: "20%",
            barHeight: '40%',
            dataLabels: {
            position: 'center',
            show:false,
          }
        },
        },
         dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: 0,
          style: {
            fontSize: '12px',
            colors: ["#fff"]
          }
        },
        stroke: {
          width: 1,
          colors: ['#fff']
        },
        // title: {
        //   text: 'Fiction Books Sales'
        // },
       
        xaxis: {
          show: false,
           categories: [ 'CW', 'LW'],
          labels: {
            show:false,

            // formatter: function (val) {
            //   return  val + "%"
            // }
          },
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: undefined
          },

        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + "%"
            }
          }
        },
        colors: [ '#0092c3', '#98aab9', '#f88c24','#425273'],
        fill: {
          opacity: 1
        },
        legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
        grid: {
          yaxis: {
            lines: {
                show: false
            }
          },  
        },
        };

        var chart = new ApexCharts(document.querySelector("#Cost_by_Category"), options);
        chart.render();





// Weekly_Purchase_Category
var optionsvisitor = {
  series: [
    {
      name: "CW",
      data: [18, 22,  25, 35, 40, 28, 58, 65],
    },
    {
      name: "LW",
      data: [20, 30,  10, 40, 45, 69, 35, 56],
    },
  ],
  chart: {
    type: "bar",
    height: 590,
    toolbar: {
      show: false,
    },
      
    dropShadow: {
        enabled: true,
        enabledOnSeries: undefined,
        top: 5,
        left: 0,
        blur: 4,
        color: '#c8c8c8',
        opacity: 0.30
      },
  },
  plotOptions: {
    bar: {
      borderRadius: 2,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
      horizontal: true,
      columnWidth: "50%",
      dataLabels: {
      position: 'top'
    },
    },
    
  },
  dataLabels: {
    // formatter: (val) => {
    //           return val + 'k'
    //         },
          enabled: true,
          offsetX: 10,
          textAnchor: "start",
          style: {
            fontSize: '10px',
            colors: ['#797979'],
          }
        },
  stroke: {
    show: true,
    width: 1,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    borderColor: "var(--chart-border)",
    xaxis: {
      lines: {
        show: false,
      },
    },
  },

  colors: [ '#2e93fa', '#f8507b', '#00E396', '#fb0000'],
  xaxis: {
    categories: ["3rd Party Finished Goods", "Bread", "Fruit & Veg",  "Ingredient - Ambient",  "Ingredient - Chilled", "Meat & Fish", "Milk - Ambient", "Milk - Chilled Milk", "Soft Drink - Ambient", "Soft Drink - Chilled", "Soft Drink", "Stockable Recipe -  Chilled", "Stockable Recipe -  Meat & Fish",],
    tickAmount: 4,
    tickPlacement: "between",
    labels: {
      show: false,
      style: {
        fontFamily: "Rubik, sans-serif",
      },
      formatter: (val) => {
              return val + '%'
            },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    categories: ["0%","20%","40%", "60%",  "80%", '100%'],
    tickAmount: 5,
    tickPlacement: "between",
    labels: {
      show: true,
      style: {
        fontFamily: "Rubik, sans-serif",
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "bottom",
    horizontalAlign: "center",
    fontFamily: "Rubik, sans-serif",
    fontSize: "12px",
    labels: {
      colors: "var(--chart-text-color)",
    },
    markers: {
      width: 10,
      height: 10,
      radius: 12,
    },
    itemMargin: {
      horizontal: 10,
    },
  },
  tooltip: {
        y: {
          // formatter: function(value, opts) {
          //     const sum = opts.series[0].reduce((a, b) => a + b, 0);
          //     const percent = (value / sum) * 100;
          //     return percent.toFixed(0) + '%';

          //     return value.toFixed(0) + '%'
          // },
        },
    },
  responsive: [
    {
      breakpoint: 1366,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "80%",
          },
        },
        grid: {
          padding: {
            right: 0,
          },
        },
      },
    },
    {
      breakpoint: 992,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "70%",
          },
        },
      },
    },
    {
      breakpoint: 576,
      options: {
        plotOptions: {
          bar: {
            columnWidth: "60%",
          },
        },
        grid: {
          padding: {
            right: 5,
          },
        },
      },
    },
  ],
};

var chartvisitor = new ApexCharts(
  document.querySelector("#Weekly_Purchase_Category"),
  optionsvisitor
);
chartvisitor.render();






//Order_Value_Comparison
var options7 = {
    chart: {
        height: 250,
        type: 'line',
        stacked: false,
         dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    stroke: {
        width: [2, 2, 2, 2],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
          borderRadius: 3,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "first",
          horizontal: false,
          columnWidth: "50%",
    },
  },
    series: [{
        name: 'Invoice Amount',
        type: 'column',
        data: [29, 15, 18, 22, 19, 12, 30, 23, 11, 22, 27]
    },{
        name: 'PO Amount',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 29, 15, 18, 22]
    }],

    labels: [ 'Feeling Fruity', 'Albion Foods', 'Estate Dairy', 'Roasting Party', 'HG Walter', 'Clarence Court', 'John Ross', 'Farm Girl Kitchens', 'Eaten Alive', 'Baked@8', 'Odysea'],
    markers: {
        size: 0
    },
     xaxis: {
    //     type:'week',
          tickAmount: 10,
     },
    yaxis: {
        min: 0,
    },
    
    legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
        },
    colors: [ '#008FFB', '#FEB019', '#00E396', '#fb0000'],
}

var chart7 = new ApexCharts(
    document.querySelector("#Order_Value_Comparison"),
    options7
);

chart7.render();







//Food_Wastage

var Food_Wastage_options = {
    chart: {
        height: 250,
        type: 'bar',
        fontFamily: "Rubik, sans-serif",
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    // stroke: {
    //     width: [2, 2, 2, 2],
    //     curve: 'smooth'
    // },
    plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 5,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "first",
    },
  },
      series: [{
          data: [21, 22, 10, 28, 16, 21, 13, 12]
        }],
    
     xaxis: {
   categories: [ 'Pizza', 'Burger', 'Curry', 'Bread', 'Noodles', 'Rice', 'Fried Rice', 'Dosa' ],
     },
    yaxis: {
        min: 0,
    },
    
    legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
          show:false
        },
    //colors: [ '#008FFB', '#FEB019', '#00E396', '#fb0000'],
}

var chart8 = new ApexCharts(
    document.querySelector("#Food_Wastage"),
    Food_Wastage_options
);

chart8.render();






//Bar_Wastage
var Bar_Wastage_options = {
    chart: {
        height: 250,
        type: 'bar',
        fontFamily: "Rubik, sans-serif",
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    // stroke: {
    //     width: [2, 2, 2, 2],
    //     curve: 'smooth'
    // },
    plotOptions: {
        bar: {
          columnWidth: '50%',
          distributed: true,
          borderRadius: 5,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "first",
    },
  },
      series: [{
          data: [21, 22, 10, 28, 16, 21]
        }],
    
     xaxis: {
   categories: [ 'Cocktails', 'Mocktails', 'Champagne', 'Beer', 'Water', 'Ice' ],
   tickAmount:100,
     },
    yaxis: {
        min: 0,
    },
    legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
          show:false
        },
    //colors: [ '#008FFB', '#FEB019', '#00E396', '#fb0000'],
}

var chart9 = new ApexCharts(
    document.querySelector("#Bar_Wastage"),
    Bar_Wastage_options
);

chart9.render();








//Other_Wastage
var Other_Wastage_options = {
    chart: {
        height: 250,
        type: 'bar',
        fontFamily: "Rubik, sans-serif",
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 4,
            color: '#7366ff',
            opacity: 0.22
          },
        toolbar:{
          show: false
        }
    },
    // stroke: {
    //     width: [2, 2, 2, 2],
    //     curve: 'smooth'
    // },
    plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          borderRadius: 5,
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "first",
    },
  },
      series: [{
          data: [21, 22, 10, 28, 16, 21, 13, 12]
        }],
    
     xaxis: {
   categories: [ 'Pizza', 'Burger', 'Curry', 'Bread', 'Noodles', 'Rice', 'Fried Rice', 'Dosa' ],
     },
    yaxis: {
        min: 0,
    },
    
    legend: {
          position: "bottom",
          horizontalAlign: "center",
          fontFamily: "Rubik, sans-serif",
          fontSize: "12px",
          show:false
        },
    //colors: [ '#008FFB', '#FEB019', '#00E396', '#fb0000'],
}

var chart9 = new ApexCharts(
    document.querySelector("#Other_Wastage"),
    Other_Wastage_options
);

chart9.render();





//Last_Four_Weeks
var options = {
          series: [{
          name: 'Sales',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        }, {
          name: 'Wastage',
          data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
        }],
          chart: {
          type: 'bar',
          height: 350,
          fontFamily: "Rubik, sans-serif",
          dropShadow: {
              enabled: true,
              enabledOnSeries: undefined,
              top: 5,
              left: 0,
              blur: 4,
              color: '#7366ff',
              opacity: 0.22
            },
          toolbar:{
            show: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "first",
            },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['Cocktails', 'Mocktails', 'Champagne', 'Beer', 'Water', 'Ice', 'Pizza', 'Burger', 'Curry',],
        },
        yaxis: {
          title: {
            // text: '$ (thousands)'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return "$ " + val + " thousands"
            }
          }
        },
        colors: [ '#008FFB', '#FEB019', '#00E396', '#fb0000'],
        };

        var chart = new ApexCharts(document.querySelector("#Last_Four_Weeks"), options);
        chart.render();








//Reason_Wastage_CW
  var options = {
          series: [
          {
            data: [
              {
                x: 'Date Expired',
                y: 218
              },
              {
                x: 'Other',
                y: 149
              },
              {
                x: 'Item Rendered Unusable',
                y: 184
              },
              {
                x: 'Kitchen Error',
                y: 55
              }
            ]
          }
        ],
          legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Rubik, sans-serif",
            fontSize: '12px',
          },
          formatter: function(text, op) {
            return [text, op.value]
          },
          offsetY: -4
        },
        chart: {
          height: 350,
          type: 'treemap',
          // dropShadow: {
          //     enabled: true,
          //     enabledOnSeries: undefined,
          //     top: 5,
          //     left: 0,
          //     blur: 4,
          //     color: '#000',
          //     opacity: 0.22
          //   },
          toolbar:{
            show: false
          }
        },
        colors: [ '#008FFB'],
        title: {
          //text: 'Basic Treemap'
        }
        };

        var chart = new ApexCharts(document.querySelector("#Reason_Wastage_CW"), options);
        chart.render();







//Reason_Wastage_LW
  var options = {
          series: [
          {
            data: [
              {
                x: 'Date Expired',
                y: 125
              },
              {
                x: 'Other',
                y: 258
              },
              {
                x: 'Item Rendered Unusable',
                y: 100
              },
              {
                x: 'Kitchen Error',
                y: 100
              }
            ]
          }
        ],
          legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Rubik, sans-serif",
            fontSize: '12px',
          },
          formatter: function(text, op) {
            return [text, op.value]
          },
          offsetY: -4
        },
        chart: {
          height: 350,
          type: 'treemap',
          // dropShadow: {
          //     enabled: true,
          //     enabledOnSeries: undefined,
          //     top: 5,
          //     left: 0,
          //     blur: 4,
          //     color: '#000',
          //     opacity: 0.22
          //   },
          toolbar:{
            show: false
          }
        },
        colors: [ '#f84f7c'],
        title: {
          //text: 'Basic Treemap'
        }
        };

        var chart = new ApexCharts(document.querySelector("#Reason_Wastage_LW"), options);
        chart.render();







 var options = {
          series: [{
          name: 'Cost of Sales',
          type: 'column',
          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 21, 31]
        }, {
          name: '% of Cost of Sales',
          type: 'area',
          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43, 37, 21,]
        }],
          chart: {
          height: 350,
        type: 'line',
        stacked: false,
        dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 6,
            color: '#000',
            opacity: 0.15
          },
        toolbar:{
          show: false
        }
        },
        stroke: {
          width: [0, 2, 5],
          curve: 'smooth'
        },
        plotOptions: {
          bar: {
            borderRadius: 5,
            borderRadiusApplication: "end",
            borderRadiusWhenStacked: "last",
            columnWidth: '50%'
          }
        },
        
        fill: {
          opacity: [0.85, 0.25, 1],
          gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            stops: [0, 100, 100, 100]
          }
        },
        labels: [ 'Wk-12', 'Wk-11', 'Wk-10', 'Wk-9', 'Wk-8', 'Wk-7', 'Wk-6', 'Wk-5', 'Wk-4', 'Wk-3', 'Wk-2', 'Wk-1', 'CW'],
        markers: {
          size: 0
        },
        colors:['#0082e4' , '#4ad000'],
        xaxis: {
          //type: 'datetime'
        },
        yaxis: {
          title: {
            //text: 'Points',
          },
          min: 0
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (y) {
              if (typeof y !== "undefined") {
                return y.toFixed(0) + " points";
              }
              return y;
        
            }
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#Wastage_Summary_13"), options);
        chart.render();