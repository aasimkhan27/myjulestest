$(function () {

    var TotalSpend = 5000;

    var activeUsers = 100;


    CanvasJS.addColorSet("customColorSet", [
	 '#FDB45C', // yellow
                '#6680c8', // blue
                '#46BFBD', // green
                '#ff9fa1', // red
                '#949FB1', // grey  
                '#4D5360',  // dark grey
                '#DCDCDC', // light grey    
                
                
    ]);

    // CanvasJS doughnut chart to show device type of active users
    var usersDeviceDoughnutChart = new CanvasJS.Chart("users-device-doughnut-chart", {
        animationDuration: 800,
        animationEnabled: true,
        backgroundColor: "transparent",
        colorSet: "customColorSet",
        theme: "theme2",
        legend: {
            fontFamily: "calibri",
            fontSize: 14,
            horizontalAlign: "left",
            verticalAlign: "center",
            itemTextFormatter: function (e) {
                return e.dataPoint.name + ": " + Math.round(e.dataPoint.y / TotalSpend * 100) + "%";
            }
        },
        title: {
            dockInsidePlotArea: true,
            fontSize: 12,
            fontWeight: "normal",
            horizontalAlign: "center",
            verticalAlign: "center",
            text: "Total Spend: " + TotalSpend
        },
        toolTip: {
            cornerRadius: 0,
            fontStyle: "normal",
            contentFormatter: function (e) {
                return e.entries[0].dataPoint.name + ": " + Math.round(e.entries[0].dataPoint.y / TotalSpend * 100) + "% (" + e.entries[0].dataPoint.y + ")";
            }
        },
        data: [
			{
			    innerRadius: "80%",
			    radius: "90%",
			    legendMarkerType: "square",
			    showInLegend: false,
			    startAngle: 90,
			    indexLabelFontSize: 10,
			    indexLabel: "{name} - #percent%",
			    type: "doughnut",
			    dataPoints: [
					{ y: 100, name: "NON-PRODUCTION / INDIRECT MATERIALS" },
					{ y: 500, name: " INFORMATION TECHNOLOGY" },
					{ y: 200, name: "TOOLING" },
			        { y: 1000, name: "NON-PRODUCTION / INDIRECT SERVICES" },
                    { y: 600, name: "MISCELLANEOUS" },
                    
			    ]
			}
        ]
    });






    // CanvasJS bar chart to show active users by state
    var usersStateBarChart = new CanvasJS.Chart("users-state-bar-chart", {
        animationDuration: 800,
        animationEnabled: true,
        backgroundColor: "transparent",
        colorSet: "customColorSet",
        axisX: {
            labelFontColor: "#717171",
            labelFontSize: 18,
            lineThickness: 0,
            tickThickness: 0
        },
        axisY: {
            gridThickness: 0,
            lineThickness: 0,
            tickThickness: 0,
            valueFormatString: " "
        },
        toolTip: {
            cornerRadius: 0,
            fontStyle: "normal",
            contentFormatter: function (e) {
                return e.entries[0].dataPoint.label + ": " + Math.round(e.entries[0].dataPoint.y / activeUsers * 100) + "% (" + e.entries[0].dataPoint.y + ")";
            }
        },
        data: [
			{
			    indexLabelFontColor: "#717171",
			    indexLabelFontFamily: "calibri",
			    indexLabelFontSize: 18,
			    indexLabelPlacement: "outside",
			    indexLabelFormatter: function (e) {
			        return Math.round(e.dataPoint.y / activeUsers * 100) + "%";
			    },
			    type: "bar",
			    dataPoints: [
					{ y: 16, label: "Others" },
					{ y: 4, label: "Pennsylvania" },
					{ y: 5, label: "Florida" },
					{ y: 7, label: "Texas" },
					{ y: 11, label: "New York" },
					{ y: 12, label: "California" }
			    ]
			}
        ]
    });

    (function init() {

        usersDeviceDoughnutChart.render();
        usersStateBarChart.render();
    })();

});