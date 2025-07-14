var _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'ui.bootstrap', 'moment-picker', 'ui.calendar'];

if (window.location.href.toLowerCase().indexOf("dashboard/index") != -1 || window.location.href.toLowerCase().indexOf("dashboard/hrindex") != -1 || window.location.href.toLowerCase().indexOf("report/reportindex") != -1) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'ui.bootstrap', 'chart.js', 'ui.calendar', 'moment-picker'];
}
if (window.location.href.toLowerCase().indexOf("dashboard/hrindex") != -1 || window.location.href.toLowerCase().indexOf("scheduler/indexscheduler") != -1 || window.location.href.toLowerCase().indexOf("Payment/Index") != -1) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'ui.bootstrap', 'chart.js', 'ui.calendar', 'moment-picker', 'ngCsv', 'lvl.directives.dragdrop'];
}
if (window.location.href.toLowerCase().indexOf("inventory/inventoryindex") != -1) {
    //_requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'chart.js', 'ng-fusioncharts'];
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'chart.js'];
}
if (window.location.href.toLowerCase().indexOf("inventory/inventoryindex") != -1 || window.location.href.toLowerCase().indexOf("dashboard/dashboardindex") != -1) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'chart.js'];
}
if (window.location.href.toLowerCase().indexOf("p2p/p2pindex") != -1) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'ui.bootstrap', 'pdf'];
}
if (window.location.href.toLowerCase().indexOf("dashboard/powerinsightindex") != -1 ) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker'];
}
if (window.location.href.toLowerCase().indexOf("hr/hrindex") != -1  || window.location.href.toLowerCase().indexOf("cashup/cashupappindex") != -1  ) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'scania.angular.select2', 'ui.bootstrap'];
}
if (window.location.href.toLowerCase().indexOf("hr/hrindex") != -1 || window.location.href.toLowerCase().indexOf("hr/hrm_o_index") != -1 || window.location.href.toLowerCase().indexOf("cashup/cashupappindex") != -1) {
    _requires = ['ngCookies', 'ngRoute', 'ngAnimate', 'ngStorage', 'ngSanitize', 'moment-picker', 'scania.angular.select2', 'ui.bootstrap'];
}
var app = angular.module('RestaurantEnterprise', _requires).config(['momentPickerProvider', function (momentPickerProvider) {
    momentPickerProvider.options({
    //    /* Picker properties */
    //    locale:        'en',
    //    format:        'L LTS',
    //    minView:       'decade',
    //    maxView:       'minute',
    //    startView:     'year',
    //    autoclose:     true,
    //    today:         false,
    //    keyboard:      false,

    //    /* Extra: Views properties */
    //    leftArrow:     '&larr;',
    //    rightArrow:    '&rarr;',
    //    yearsFormat:   'YYYY',
    //    monthsFormat:  'MMM',
    //    daysFormat:    'D',
    //    hoursFormat:   'HH:mm',
        minutesFormat: 'HH:mm',// moment.localeData().longDateFormat('LT').replace(/[aA]/, ''),
    //    secondsFormat: 'ss',
   // minutesStep: 15
    //    secondsStep:   1
      });
}]);


app.service('CommService', function ($http) {
    this.Get_CASHUP_API = function Get_CASHUP_API() {
        return "http://localhost:8318/";
    };
    this.Get_HR_API = function Get_HR_API() {
        return "http://localhost:35160/";
    };
    this.GET_HUMANRESOURCE_API = function GET_HUMANRESOURCE_API() {
        return "http://localhost:54022/";
    };
    this.GET_ADMIN_API = function GET_ADMIN_API() {
        return "http://localhost:62644/";
    };
    this.Get_Login_API = function Get_Login_API() {
        return "http://localhost:8318/";
    };
    this.GET_REPORT_API = function GET_REPORT_API() {
        return "http://localhost:32160/";
    };
    this.GET_INVOICE_API = function GET_INVOICE_API() {
        return "http://localhost:58057/";
    };
    this.GET_DASHBOARD_API = function GET_DASHBOARD_API() {
        return "http://localhost:49366/";
    };
    this.GET_INVENTORY_API = function GET_INVENTORY_API() {
        return "http://localhost:62863/";
    };
    this.GET_P2P_API = function GET_P2P_API() {
        return "http://localhost:52624/";
    };
    this.GET_UTILITY_API = function GET_UTILITY_API() {
        return "http://localhost:52624/";
    };
    this.GET_CASHUP_APP_API = function GET_CASHUP_APP_API() {
        return "http://localhost:8318/";
    };

});
function getUrlParameter(param, location) {
    var sPageURL = location,
        sURLVariables = sPageURL.split(/[&||?]/),
        res;

    for (var i = 0; i < sURLVariables.length; i += 1) {
        var paramName = sURLVariables[i],
            sParameterName = (paramName || '').split('=');

        if (sParameterName[0] === param) {
            res = sParameterName[1];
        }
    }
    return res;
}

