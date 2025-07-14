app.controller('PNLController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.Search_FY = {
        ShowDetails: false,
    };
    $scope.DisplayDetails = function (SelectedLine) {
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    };
});
app.controller('HrIndexController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.HR_GET_ORG_HIERARCHY = function () {
        $scope.$parent.$parent.overlay_loadingNew = 'block';
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_ORG_HIERARCHY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                $scope.ORG_HIERARCHY_ALL = angular.copy(data.data.Table);
                $scope.ORG_HIERARCHY = data.data.Table.filter(function (x) { return x.PID == null });
                var ORGLIST = []
                angular.forEach($scope.ORG_HIERARCHY, function (val, index) {
                    var obh = new Object()
                    obh.id = val.ID;
                    obh.Name = val.NAME;
                    obh.Department = val.DEPARTMENT_NAME;
                    obh.Email = val.BUSINESS_EMAIL;
                    obh.Position = val.POSITION_TITLE;
                    obh.Phone = val.MOBILE_NO;
                    obh.Telephone = val.TELEPHONE_NO;
                    if (val.IMG == null) {
                        obh.img = "https://png.pngitem.com/pimgs/s/80-801053_aws-simple-icons-non-service-specific-user-default.png";//val.IMG;
                    }
                    else {
                        obh.img = window.location.origin + '/' + val.IMG;
                    }
                    obh.c = val.DEPARTMENT_COLOR;
                    ORGLIST.push(obh);
                    var PLIST = $scope.ORG_HIERARCHY_ALL.filter(function (x) { return x.PID == val.ID })
                    if (PLIST.length > 0) {
                        angular.forEach(PLIST, function (plist) {
                            var obh = new Object()
                            obh.id = plist.ID;
                            obh.pid = plist.PID;
                            obh.Name = plist.NAME;
                            obh.Department = plist.DEPARTMENT_NAME;
                            obh.Email = plist.BUSINESS_EMAIL;
                            obh.Position = plist.POSITION_TITLE;
                            obh.Phone = plist.MOBILE_NO;
                            obh.Telephone = plist.TELEPHONE_NO;
                            if (plist.IMG == null) {
                                obh.img = "https://png.pngitem.com/pimgs/s/80-801053_aws-simple-icons-non-service-specific-user-default.png";//val.IMG;
                            }
                            else {
                                obh.img = window.location.origin + '/' + plist.IMG;
                            }
                            obh.c = val.DEPARTMENT_COLOR;
                            ORGLIST.push(obh);
                        })
                    }
                })
                OrgChart.templates.ana.size = [250, 250];
                OrgChart.templates.ana.node = '<rect x="0" y="0" rx="4" ry="5" filter="url(#shadow1)" style="font-size: 12px;"  height="250" width="180" fill="#f3f8fb" stroke-width="0" stroke="#2e6491"></rect>' +
                    '<rect x="0" y="0" rx="5" ry="5" height="36" width="180" fill="#004B6D" stroke-width="1" stroke="#2e6491"></rect>' +
                    '<line x1="9.5" y1="32" x2="190.5" y2="32" stroke-width="10" stroke="#004B6D" />'
                //'<circle cx="90" cy="80" r="30" stroke="#721e09" stroke-width="3"></circle>';

                //   OrgChart.templates.ana.defs = '<filter x="-10%" y="0%" width="200%" height="200%" filterUnits="objectBoundingBox" id="shadow1">' +
                //'<feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1" /><feGaussianBlur stdDeviation="5" in="shadowOffsetOuter1" result="shadowBlurOuter1" />' +
                //'<feColorMatrix values="0 0 0 1 0   0 0 0 1 0   0 0 0 1 0  0 0 0 1 0" in="shadowBlurOuter1" type="matrix" result="shadowMatrixOuter1" />' +
                //'<feMerge>' +
                //'<feMergeNode in="shadowMatrixOuter1" /><feMergeNode in="SourceGraphic" /></feMerge></filter>';
                //OrgChart.templates.ana.link = '<path stroke-linejoin="round" stroke="#4485d9" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}"/>';
                //OrgChart.templates.ana.node = '<rect cx="100" cy="90" x="0" y="10" height="250" width="180" fill="#f3f8fb" stroke-width="0" stroke="#f3f8fb" rx="15" ry="15"></rect>' +
                ////'<rect x="0" y="4" height="30" width="180" fill="#ccc" stroke-width="0" stroke="#ccc" rx="0" ry="0"></rect>'
                ////OrgChart.templates.white.node =  '<rect x="0" y="0" rx="5" ry="5" filter="url(#shadow1)"  height="172" width="180" fill="white" stroke-width="1" stroke="#2e6491"></rect>' +
                // '<rect x="0" y="0" rx="5" ry="5" height="43" width="180" fill="#2e6491" stroke-width="1" stroke="#2e6491"></rect>' 
                //OrgChart.templates.rony.node = '<rect filter="url(#{randId})" x="0" y="0" height="250" width="200" fill="#ffffff" stroke-width="0" rx="5" ry="5"></rect>';
                //OrgChart.templates.rony.node = '<rect x="0" y="5" height="35" width="{w}" fill="#ccc" stroke-width="1" stroke="#ccc" rx="5" ry="5"></rect>' ;
                OrgChart.templates.ana.field_Department = ' <text   width="140" style="font-size: 12px;" fill="#fff" x="100" y="20" text-anchor="middle">{val}</text> ';
                OrgChart.templates.ana.img_0 = '<clipPath id="{randId}"><circle cx="100" cy="100" r="40"></circle></clipPath><image preserveAspectRatio="xMidYMid slice" clip-path="url(#{randId})" xlink:href="{val}" x="60" y="60"  width="80" height="105"></image>';
                OrgChart.templates.ana.field_Name = '<text width="140" style="font-size: 14px;font-weight: bold;" fill="#004B6D" x="100" y="155" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Position = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="100" y="180" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Email = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="100" y="200" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Phone = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="100" y="225" text-anchor="middle">{val}</text>';
                OrgChart.templates.ana.field_Telephone = '<text width="140" style="font-size: 11px;" fill="#004B6D" x="100" y="225" text-anchor="middle">{val}</text>';
                var chart = new OrgChart(document.getElementById("tree"), {
                    template: "ana",
                    mouseScrool: OrgChart.action.scroll,
                    enableDragDrop: true,
                    assistantSeparation: 170,
                    menu: {
                        pdfPreview: {
                            text: "Export to PDF",
                            icon: OrgChart.icon.pdf(24, 24, '#7A7A7A'),
                            onClick: preview
                        },
                        csv: { text: "Save as CSV" }
                    },
                    nodeMenu: {
                        details: { text: "Details" },
                        edit: { text: "Edit" },
                        add: { text: "Add" },
                        remove: { text: "Remove" }
                    },
                    align: OrgChart.ORIENTATION,
                    toolbar: {
                        fullScreen: true,
                        zoom: true,
                        fit: true,
                        expandAll: true
                    },
                    nodeBinding: {
                        img_0: "img",
                        field_Name: "Name",
                        field_Department: "Department",
                        field_Position: "Position",
                        field_Email: "Email",
                        field_Phone: "Phone",
                        field_Phone: "Telephone",
                    },
                    nodes: ORGLIST
                });
            }
        });
    };
    //  $scope.HR_GET_ORG_HIERARCHY();
});
app.controller('HRDashBoardController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.TabActive(1);
    $scope.dayOfWeekNamesShort = [];
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon" }, { ID: 2, NAME: "Tue" }, { ID: 3, NAME: "Wed" }, { ID: 4, NAME: "Thu" }, { ID: 5, NAME: "Fri" }, { ID: 6, NAME: "Sat" }, { ID: 7, NAME: "Sun" }];

    $scope.IS_DEPARTMENT_FLAG = false;
    $scope.IS_POSITION_FLAG = false;

    $scope.monthNames = [
        { ID: 1, NAME: "January" },
        { ID: 2, NAME: "February" },
        { ID: 3, NAME: "March" },
        { ID: 4, NAME: "April" },
        { ID: 5, NAME: "May" },
        { ID: 6, NAME: "June" },
        { ID: 7, NAME: "July" },
        { ID: 8, NAME: "August" },
        { ID: 9, NAME: "September" },
        { ID: 10, NAME: "October" },
        { ID: 11, NAME: "November" },
        { ID: 12, NAME: "December" }];
    $scope.LeaveSearch = {
        ABSENCE_TYPE_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
        SORT_BY: '',
        DEPARTMENT_IDS: '',
        POSITION_IDS: '',
        REPORTING_MANAGER_ID: '',
        START_DATE: '',
        END_DATE: '',
        ADMIN_FLAG: 0,
    };
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    };
    function startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
    };
    dt = new Date();
    var curr = new Date; // get current date
    var currdate = new Date; // get current date
    var first = (curr.getDate() - curr.getDay()); // First day is the day of the month - the day of the week
    var lstDays = first + 6;
    var monthno = curr.getMonth();
    $scope.CURR_DAY = curr.getDate();
    $scope.CURRENT_YEAR = curr.getFullYear();
    $scope.CURRENT_MONTH = $scope.monthNames.filter(function (x) { return x.ID == (monthno + 1) })[0].NAME;
    var chnageMothn = 0;
    var STARTDATE = startOfWeek(new Date());
    $scope.NextWeek = [];
    for (var i = 0; i < 7; i++) {
        var NextWeekObj = new Object();
        NextWeekObj.NewDate = STARTDATE.addDays(i);
        NextWeekObj.Days = NextWeekObj.NewDate.getDate();
        $scope.NextWeek.push(NextWeekObj);
    };
    $scope.dayOfWeekNamesShort = angular.copy($scope.NextWeek);
    $scope.Search_FY = {
        ShowDetails: false,
    };
    $scope.DisplayDetails = function (SelectedLine) {
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    };
    $scope.GET_PENDING_LEAVE_REQUESTS_COUNT = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;//-- 1 FOR ADMIN ELSE 0
        PrcCommMethods.HR_API(PosiModelObj, 'GET_PENDING_LEAVE_REQUESTS_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PENDING_COUNT = data.data.Table[0].PENDING;
            }
            else {
                $scope.PENDING_COUNT = 0;
            }
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.HR_GET_DASHBOARD_COUNTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ALL_DEPT = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 0;
        PosiModelObj.ALL_POSITION = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 0;
        PosiModelObj.ALL_EMP = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_DASHBOARD_COUNTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNT_LIST = data.data.Table;
            }
            else {

            }
        });
    };
    $scope.HR_GET_DASHBOARD_COUNTS();
    $scope.USERS_CALENDAR_LIST = [];

    $scope.LeaveSearch.START_DATE = $scope.dayOfWeekNamesShort[0].NewDate;
    $scope.LeaveSearch.END_DATE = $scope.dayOfWeekNamesShort[6].NewDate;

    function dateCheck(from, to, check) {
        var fDate, lDate, cDate;
        fDate = Date.parse(from);
        lDate = Date.parse(to);
        cDate = Date.parse(check);
        if ((cDate <= lDate && cDate >= fDate)) {
            return true;
        }
        return false;
    };
    $scope.GET_PENDING_LEAVE_REQUESTS_COUNT();
    $scope.TEAM_ARRAY = [{ ID: 1, NAME: 'All Employee' }, { ID: 0, NAME: 'Team' }];

    $scope.GET_LEAVE_REQUEST_FOR_CALENDAR = function (NextPrev) {
        var PosiModelObj = new Object();
        PosiModelObj.SORT_BY = $scope.LeaveSearch.SORT_BY;
        PosiModelObj.DEPARTMENT_IDS = $scope.LeaveSearch.DEPARTMENT_ID;
        PosiModelObj.POSITION_IDS = $scope.LeaveSearch.POSITION_ID;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.START_DATE = $scope.LeaveSearch.START_DATE;
        PosiModelObj.END_DATE = $scope.LeaveSearch.END_DATE;
        PosiModelObj.ALL_EMP_FLAG = -1;////-- -1 FOR ALL EMP AND 1 FOR EMP WITH LEAVE
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.LeaveSearch.ADMIN_FLAG;//-1 FOR ALL EMP AND 1 FOR EMP WITH LEAVE
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_FOR_CALENDAR').then(function (data) {
            $scope.USERS_CALENDAR_LIST_ALL = angular.copy(data.data.Table);
            var USERS = $filter('unique')(data.data.Table, 'USER_ID');
            $scope.USERS_CALENDAR_LIST = USERS;
            // $scope.USERS_CALENDAR_LIST = data.data.Table;
            //   angular.forEach($scope.USERS_CALENDAR_LIST, function (val) {
            //val.dayOfWeekNamesShort = angular.copy($scope.dayOfWeekNamesShort)
            //var Date1 = new Date(val.START_DATE);
            //var Date2 = new Date(val.END_DATE);
            //val.Leavestartday = Date1.getDate();
            //val.Leaveendday = Date2.getDate();
            //val.count = 0;
            //val.IS_CURRENT = false;
            //var START_DATE = new Date(val.START_DATE);
            //START_DATE.setHours(0, 0, 0, 0);
            //var END_DATE = new Date(val.END_DATE);
            //END_DATE.setHours(0, 0, 0, 0);
            //angular.forEach(val.dayOfWeekNamesShort, function (week, index) {
            //    var NextDate = (val.dayOfWeekNamesShort[index].NewDate).setHours(0, 0, 0, 0);
            //    if (dateCheck(new Date(START_DATE), new Date(END_DATE), new Date(NextDate))) {
            //        week.IS_CURRENT = true;
            //    }
            //    else {
            //        week.IS_CURRENT = false;
            //    }
            //    if (week.Days <= val.Leaveendday && week.Days >= val.Leavestartday) {
            //        val.count++;
            //    }
            //})
            //if (val.count > 0) {
            //    if (val.count >= 7) {
            //        val.width = "69.5"
            //    }
            //    else {
            //        val.width = (9.9) * parseInt(val.count)
            //    }
            //}
            //});

            setTimeout(function () {
                document.getElementById("LOADER_ID").style.zIndex = "999";
                document.getElementById("overlay_loading_div").style.display = "initial";
            }, 1000)
            //style = "z-index:{{overlay_loading_div_zindex}}"

            $scope.$parent.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.GET_LEAVE_REQUEST_FOR_CALENDAR();
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        HolEntitlObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        HolEntitlObj.HOLIDAY_ENTITLEMENT_NAME = '';
        HolEntitlObj.ACTIVE = 1;
        HolEntitlObj.PAGE_NO = 0;
        HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
        HolEntitlObj.MANAGER = -1;
        HolEntitlObj.EMPLOYEE = -1;
        HolEntitlObj.ENTITLEMENT_REQUIRED = -1;
        PrcCommMethods.HR_API(HolEntitlObj, 'ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER').then(function (data) {
            $scope.ABSENCE_TYPE_ENTITLEMENT = data.data.Table;
        });
    };
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER();
    $scope.ON_CLICK_ORG = function (FLAG) {
        if (FLAG == 1) {
            if ($scope.$parent.CHECK_MODULE_ACCESS(1, 1) || $scope.$parent.CheckSubModuleAccess(46)) {
                $location.path('Dpt_Lst');
            }
            else {
                $scope.ShowAlert('Warning', $scope.$parent.ACCESS_TEXT, 5000);
            }
        }
        if (FLAG == 2) {
            if ($scope.$parent.CHECK_MODULE_ACCESS(2, 1) || $scope.$parent.CheckSubModuleAccess(47)) {
                $location.path('Pst_Lst');
            }
            else {
                $scope.ShowAlert('Warning', $scope.$parent.ACCESS_TEXT, 5000);
            }
        }
        if (FLAG == 3) {
            if ($scope.$parent.CHECK_MODULE_ACCESS(3, 1) || $scope.$parent.CheckSubModuleAccess(48)) {
                $location.path('team').search('FLG', 1);
            }
            else {
                $scope.ShowAlert('Warning', $scope.$parent.ACCESS_TEXT, 5000);
            }
        }
    };

    $scope.nginitusercalendarlist = function (val) {
        //   angular.forEach($scope.USERS_CALENDAR_LIST, function (val) {
        val.dayOfWeekNamesShort = angular.copy($scope.dayOfWeekNamesShort)
        var Date1 = new Date(val.START_DATE);
        var Date2 = new Date(val.END_DATE);
        val.Leavestartday = Date1.getDate();
        val.Leaveendday = Date2.getDate();
        val.count = 0;
        val.IS_CURRENT = false;
        //});

    };
    $scope.nginitdayOfWeekNamesShort = function (week, index, val) {
        week.USER_LEAVE = [];
        var USERS_LEAVE = $scope.USERS_CALENDAR_LIST_ALL.filter(function (x) { return x.USER_ID == val.USER_ID });
        angular.forEach(USERS_LEAVE, function (US_LEAVE) {
            var START_DATE = new Date(US_LEAVE.START_DATE);
            START_DATE.setHours(0, 0, 0, 0);
            var END_DATE = new Date(US_LEAVE.END_DATE);
            END_DATE.setHours(0, 0, 0, 0);
            if (val.count == 0) {
                var result = END_DATE.getDate() - START_DATE.getDate();
                //var mom_START_DATE = moment(US_LEAVE.START_DATE, "DD-MM-YYYY")
                //var mom_END_DATE = moment(US_LEAVE.END_DATE, "DD-MM-YYYY")
                //var result = mom_END_DATE.diff(mom_START_DATE, 'days');
            }


            // angular.forEach(val.dayOfWeekNamesShort, function (week, index) {
            var NextDate = (val.dayOfWeekNamesShort[index].NewDate).setHours(0, 0, 0, 0);
            if (dateCheck(new Date(START_DATE), new Date(END_DATE), new Date(NextDate))) {
                week.IS_CURRENT = true;
                val.count++;
            }
            else {
                week.IS_CURRENT = false;
            }
            //if (week.Days <= val.Leaveendday && week.Days >= val.Leavestartday) {

            //}
            //})

            if (week.IS_CURRENT) {
                var obj_leave = new Object();
                obj_leave.Days = week.Days;
                obj_leave.diff = result;
                obj_leave.IS_CURRENT = week.IS_CURRENT;
                obj_leave.COUNT = val.count;
                obj_leave.ABSENCE_COLOR_CODE = US_LEAVE.ABSENCE_COLOR_CODE;
                week.USER_LEAVE.push(obj_leave);
            }

        })
        if (val.count > 0) {
            if (val.count >= 7) {
                val.width = "69.5"
            }
            else {
                val.width = (9.9) * parseInt(val.count)
            }
        }
        // }
    };
    $scope.EMPLOYEE_LIST = [];
    $scope.HR_GET_SEARCH_RESULTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.SEARCH_PARAMETER = "";
        PosiModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 2;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_SEARCH_RESULTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST = data.data.Table;
            }
        });
    };
    $scope.HR_GET_SEARCH_RESULTS();
    $scope.RedirectiononEmp = function (EMP) {
        $('#New_Employee').modal('hide');
        if (EMP.STEP_NO == 1) {
            window.location.href = '../DashBoard/hrIndex#!/Addemployee?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 2) {
            window.location.href = '../DashBoard/hrIndex#!/EmpContact?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 3) {
            window.location.href = '../DashBoard/hrIndex#!/Empemplment?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 4) {
            window.location.href = '../DashBoard/hrIndex#!/EmpQualifi?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 5) {
            window.location.href = '../DashBoard/hrIndex#!/EmpComp?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 6) {
            window.location.href = '../DashBoard/hrIndex#!/EmpLev?x=1&EmpID=' + EMP.ID;
        }
        if (EMP.STEP_NO == 7) {
            window.location.href = '../DashBoard/hrIndex#!/EmpDoc?x=1&EmpID=' + EMP.ID;
        }


    };
    $scope.SELECT_EMP_RESULT = function () {
        if ($scope.selectedEmployee !== null && $scope.selectedEmployee !== undefined && $scope.selectedEmployee.originalObject !== undefined) {
            if ($scope.selectedEmployee.originalObject.STEP_NO == 7) {
                //../DashBoard/hrIndex#!/EditProfile?EmpID=2&STG=7;
                $location.path('EditProfile').search('EmpID', $scope.selectedEmployee.originalObject.ID).search('STG', $scope.selectedEmployee.originalObject.STEP_NO);
            }
            else if ($scope.selectedEmployee.originalObject.STEP_NO < 7) {
                //../DashBoard/hrIndex#!/EditProfile?EmpID=2&STG=7;
                $scope.RedirectiononEmp($scope.selectedEmployee.originalObject);
            };
        }
        else {
            $scope.$parent.ShowAlert('Warning', 'no result found ', 3000);
        }
    }
    var PREVIOUS = 0, NEXT = 0;
    $scope.PREVIOUS_WEEK = function () {
        document.getElementById("overlay_loading_div").style.display = "block";
        document.getElementById("LOADER_ID").style.zIndex = "-1";
        var lstDays = $scope.dayOfWeekNamesShort[0].Days - 8;
        monthno = new Date($scope.dayOfWeekNamesShort[0].NewDate).getMonth();
        $scope.PREVWeek = [];
        for (var i = -7; i < 0; i++) {
            var NextWeekObj = new Object();
            NextWeekObj.NewDate = new Date($scope.dayOfWeekNamesShort[0].NewDate).addDays(i);
            NextWeekObj.Days = NextWeekObj.NewDate.getDate()
            $scope.PREVWeek.push(NextWeekObj);
        }
        $scope.dayOfWeekNamesShort = angular.copy($scope.PREVWeek);
        $scope.LeaveSearch.START_DATE = $scope.dayOfWeekNamesShort[0].NewDate;
        $scope.LeaveSearch.END_DATE = $scope.dayOfWeekNamesShort[6].NewDate;
        $scope.GET_LEAVE_REQUEST_FOR_CALENDAR();
    };
    $scope.$parent.overlay_loading_div = 'initial';
    $scope.NEXT_WEEK = function () {
        document.getElementById("overlay_loading_div").style.display = "block";
        $scope.$parent.overlay_loading_div_zindex = '-1';
        document.getElementById("LOADER_ID").style.zIndex = "-1";
        var setdays = 0;
        var chnageMothn = 0;
        var monthno = 0
        var lstDays = $scope.dayOfWeekNamesShort[6].Days;
        new Date($scope.dayOfWeekNamesShort[6].NewDate).getDay(lstDays);
        monthno = new Date($scope.dayOfWeekNamesShort[6].NewDate).getDay(lstDays);
        $scope.NextWeek = [];
        for (var i = 1; i < 8; i++) {
            var NextWeekObj = new Object();
            NextWeekObj.NewDate = new Date($scope.dayOfWeekNamesShort[6].NewDate).addDays(i);
            NextWeekObj.Days = NextWeekObj.NewDate.getDate()
            $scope.NextWeek.push(NextWeekObj);
        }

        $scope.dayOfWeekNamesShort = angular.copy($scope.NextWeek);
        // $scope.$parent.overlay_loading_div = 'none';

        $scope.LeaveSearch.START_DATE = $scope.dayOfWeekNamesShort[0].NewDate;
        $scope.LeaveSearch.END_DATE = $scope.dayOfWeekNamesShort[6].NewDate;
        $scope.GET_LEAVE_REQUEST_FOR_CALENDAR();

    };

    $scope.CHECK_LEAVE_START = function (CL, Lev) {
        //CL.START_LEAVE = false;
        //if (CL.Leavestartday == Lev.Days) {
        //    CL.START_LEAVE = true;
        //}

    };

    $scope.GET_YOUR_TASKS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_YOUR_TASKS').then(function (data) {
            $scope.YOUR_TASKS = data.data.Table[0];
            $scope.$parent.overlay_loadingNew = 'none';
        });
    };
    $scope.GET_YOUR_TASKS();
    $scope.REDIRECT_INDEX = function (FLAG) {
        if (FLAG == 1) {
            $location.path('Reminders');
        }
        else if (FLAG == 2) {
            $location.path('PendingRequest').search('FLAG', 2);
        }
        else if (FLAG == 3) {
            //$location.path('PendingRequest');
        }
        else if (FLAG == 4) {
            $location.path('PendingRequest');
        }
    };
    //  setInterval(DEPARTMENT, 1000);
    $scope.$parent.child_scope = $scope;
    $scope.checkDeptPostion = function () {
        $scope.$apply(function () {
            $scope.IS_DEPARTMENT_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" ? true : false;
            $scope.IS_POSITION_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? true : false;
        });
    }
    setTimeout($scope.checkDeptPostion, 1000);
});
app.controller('HRController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.Dptid = getUrlParameter('DptID', $location.absUrl());
    $scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.COLMD = 'col-md-4'
    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(1, $scope.COLMD);

    $scope.IS_DEPARTMENT_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(31)[0].SETTING_VALUE == "1" ? true : false;
    $scope.IS_POSITION_FLAG = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? true : false;

    $scope.CUSTOM_CUNTROL_LIST = [];
    $scope.GetData = false;
    $scope.GetDataE = false;
    $scope.PNDNG_POSITIONS_LIST = [];
    $scope.PNDNG_EMP_LIST = [];
    $scope.Search_FY = {
        ShowDetails: false,
    };
    $scope.DisplayDetails = function (SelectedLine) {
        if (SelectedLine.ShowDetails) {
            SelectedLine.ShowDetails = false;
        }
        else {
            SelectedLine.ShowDetails = true;
        }
    };
    $scope.DeparmentSearch = {
        DEPARTMENT_NAME: "",
        DEPARTMENT_COLOR: '',
        PARENT_DEPARTMENT_ID: null,
        DIVISION_ID: null,
        DIVISION_NAME: null,
        DIVISION_CODE: null,
        DEPARTMENT_CODE: null,
        CUSTOM_FIELD_1: null,
        CUSTOM_FIELD_2: null,
        CUSTOM_FIELD_3: null,
        CUSTOM_FIELD_4: null,
        CUSTOM_FIELD_5: null,
        CUSTOM_FIELD_6: null,
        CUSTOM_FIELD_7: null,
        CUSTOM_FIELD_8: null,
        CUSTOM_FIELD_9: null,
        CUSTOM_FIELD_10: null,
        CUSTOM_FIELD_11: null,
        CUSTOM_FIELD_12: null,
        CUSTOM_FIELD_13: null,
        CUSTOM_FIELD_14: null,
        CUSTOM_FIELD_15: null,
        PAGE_NO: 1,
        PAGE_SIZE: 999,
    };
    $scope.ResetDept = function () {
        $scope.DeparmentSearch = {
            DEPARTMENT_NAME: "",
            DEPARTMENT_COLOR: '',
            PARENT_DEPARTMENT_ID: null,
            DIVISION_ID: null,
            DIVISION_NAME: null,
            DIVISION_CODE: null,
            DEPARTMENT_CODE: null,
            CUSTOM_FIELD_1: null,
            CUSTOM_FIELD_2: null,
            CUSTOM_FIELD_3: null,
            CUSTOM_FIELD_4: null,
            CUSTOM_FIELD_5: null,
            CUSTOM_FIELD_6: null,
            CUSTOM_FIELD_7: null,
            CUSTOM_FIELD_8: null,
            CUSTOM_FIELD_9: null,
            CUSTOM_FIELD_10: null,
            CUSTOM_FIELD_11: null,
            CUSTOM_FIELD_12: null,
            CUSTOM_FIELD_13: null,
            CUSTOM_FIELD_14: null,
            CUSTOM_FIELD_15: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
        angular.forEach($scope.CUSTOM_FIELDS_LIST, function (x) {
            x.FIELD_VALUE = '';
            if (x.FIELD_TYPE_ID == 3) {
                x.FIELD_VALUE = null;
            }
            if (x.FIELD_TYPE_ID == 7) {
                x.checkedOption = [];
            }
        })
        $scope.CustomForm.submitted = false;

    };
    $scope.HR_GET_DEPARTMENTS = function (CUSTOM_FIELD) {
        var DeptModelObj = new Object();
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.SORT_COLUMN_NO = 1;
        DeptModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_DIVISION = function (CUSTOM_FIELD) {
        var DeptModelObj = new Object();
        DeptModelObj.ACTIVE = -1;
        DeptModelObj.PAGE_NO = 0;
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DIVISION').then(function (data) {
            CUSTOM_FIELD.OPTION_LIST = data.data.Table;
        });
    };
    $scope.INS_UPD_DEPARTMENT = function (FLAG) {
        $scope.CustomForm.submitted = true;
        if ($scope.CustomForm.$valid) {
            var DeptModelObj = new Object();
            var IsValidCount = 0;
            angular.forEach($scope.$parent.CUSTOM_FIELDS_LIST, function (val) {
                if (val.FIELD_TYPE_ID == 7) {
                    var i = '';
                    for (var j = 0; j < val.checkedOption.length; j++) {
                        if (i == '') {
                            i = val.checkedOption[j];
                        }
                        else {
                            i = i + ':;:' + val.checkedOption[j];
                        }
                    }
                    val.FIELD_VALUE = i;
                }
                if (val.FIELD_TYPE_ID == 11) {
                    if (val.UploadedFiles == undefined || val.UploadedFiles.length == 0) {
                        if (val.IS_MANDATORY == 1) {
                            IsValidCount++;
                        }
                    }
                    else {
                        var FILE = '';
                        for (var j = 0; j < val.UploadedFiles.length; j++) {
                            if (FILE == '') {
                                FILE = val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                            else {
                                FILE = FILE + ':;:' + val.UploadedFiles[j].FILE_PATH + ':;:' + val.UploadedFiles[j].ORIGINAL_FILE_NAME + ':;:' + val.UploadedFiles[j].SERVER_FILE_NAME;
                            }
                        }
                        val.FIELD_VALUE = FILE;
                    }
                }
                if (val.FIELD_VALUE == undefined) {
                    val.FIELD_VALUE = '';
                }
                DeptModelObj[val.NG_MODEL] = val.FIELD_VALUE;
                if (val.FIELD_MASTER_ID == 2) {
                    var color = document.getElementById('ids2').value;
                    DeptModelObj.DEPARTMENT_COLOR = color;
                }
                //DeptModelObj.DEPARTMENT_COLOR = $scope.DeparmentSearch.DEPARTMENT_COLOR;

            });
            DeptModelObj.USER_ID = parseInt($cookies.get("USERID"));
            DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            //DeptModelObj.DEPARTMENT_NAME = $scope.DeparmentSearch.DEPARTMENT_NAME;
            //DeptModelObj.DEPARTMENT_COLOR = $scope.DeparmentSearch.DEPARTMENT_COLOR;
            //DeptModelObj.DIVISION_ID = null;//$scope.DeparmentSearch.DIVISION_ID
            //DeptModelObj.PARENT_DEPARTMENT_ID = $scope.DeparmentSearch.PARENT_DEPARTMENT_ID;
            //DeptModelObj.USER_ID = parseInt($cookies.get("USERID"));
            //DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            if (IsValidCount == 0) {
                PrcCommMethods.HR_API(DeptModelObj, 'HR_INS_UPD_DEPARTMENT').then(function (data) {
                    //$scope.ResetDept();
                    // $scope.HR_GET_DEPARTMENTS();
                    if (FLAG == 1) {
                        $location.path('Addposition');
                    }
                    if (FLAG == 2) {
                        $location.path('Addteam');
                    }
                    $scope.ShowAlert('Success', 'Department Added Successfully', 5000);
                });
            }
        }
    };
    $scope.AddTeam = {
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        PAGE_NOE: 1,
        PAGE_SIZEE: 10,
    };
    $scope.GET_POSITION_LAZY_LOAD = function () {
        $scope.GET_PNDNG_POSITIONS();
    };
    $scope.GET_PNDNG_POSITIONS = function (FLAG) {
        if (FLAG == 1) {
            $scope.PNDNG_POSITIONS_LIST = [];
            $scope.AddTeam.PAGE_NO = 1;
        }
        var POSModelObj = new Object();
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 2;
        POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        POSModelObj.PAGE_NO = $scope.AddTeam.PAGE_NO;
        POSModelObj.PAGE_SIZE = $scope.AddTeam.PAGE_SIZE;
        PrcCommMethods.HR_API(POSModelObj, 'HR_GET_PNDNG_POSITIONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PNDNG_POSITIONS_LIST = $scope.PNDNG_POSITIONS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AddTeam.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.AddTeam.PAGE_NO = parseInt($scope.AddTeam.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.PNDNG_POSITIONS_LIST.length == 0) {
                }
                $scope.GetData = false;
            }

        });
    };
    $scope.HR_GET_PNDNG_EMP = function (FLAG) {
        if (FLAG == 1) {
            $scope.PNDNG_EMP_LIST = [];
            $scope.AddTeam.PAGE_NO = 1;
        }
        var POSModelObj = new Object();
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 2;
        POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        POSModelObj.PAGE_NO = $scope.AddTeam.PAGE_NOE;
        POSModelObj.PAGE_SIZE = $scope.AddTeam.PAGE_SIZEE;
        PrcCommMethods.HR_API(POSModelObj, 'HR_GET_PNDNG_EMP').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PNDNG_EMP_LIST = $scope.PNDNG_EMP_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.AddTeam.PAGE_SIZEE) {
                    $scope.GetDataE = false;
                }
                else {
                    $scope.AddTeam.PAGE_NO = parseInt($scope.AddTeam.PAGE_NOE) + 1;
                    $scope.GetDataE = true;
                }
            }
            else {
                if ($scope.PNDNG_EMP_LIST.length == 0) {
                }
                $scope.GetDataE = false;
            }
        });
    };
    $scope.HR_GET_PNDNG_POS_EMP_CNT = function () {
        var POSModelObj = new Object();
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.ALL_EMP = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;
        POSModelObj.ALL_POSITION = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 0;
        POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(POSModelObj, 'HR_GET_PNDNG_POS_EMP_CNT').then(function (data) {
            $scope.POSITION_COUNT_LIST = data.data.Table[0];
        });
    };
    $scope.HR_GET_PNDNG_POS_EMP_CNT();
    $scope.RedirectiononPosition = function (POSITION_ID, STEP_NO) {
        $('#New_Position').modal('hide');
        if (STEP_NO == 1) {
            window.location.href = '../DashBoard/hrIndex#!/Addposition?x=1&PId=' + POSITION_ID + '&STG=' + STEP_NO;
        }
        if (STEP_NO == 2) {
            window.location.href = '../DashBoard/hrIndex#!/AddpositionEmpdtl?x=1&PId=' + POSITION_ID + '&STG=' + STEP_NO;
        }
        if (STEP_NO == 3) {
            window.location.href = '../DashBoard/hrIndex#!/AddpositionCntdtls?x=1&PId=' + POSITION_ID + '&STG=' + STEP_NO;
        }
    };
    $scope.RedirectiononEmp = function (EMP) {
        $('#New_Employee').modal('hide');
        if (EMP.STEP_NO == 1) {
            window.location.href = '../DashBoard/hrIndex#!/Addemployee?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 2) {
            window.location.href = '../DashBoard/hrIndex#!/EmpContact?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 3) {
            window.location.href = '../DashBoard/hrIndex#!/Empemplment?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 4) {
            window.location.href = '../DashBoard/hrIndex#!/EmpQualifi?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 5) {
            window.location.href = '../DashBoard/hrIndex#!/EmpComp?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 6) {
            window.location.href = '../DashBoard/hrIndex#!/EmpLev?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
        if (EMP.STEP_NO == 7) {
            window.location.href = '../DashBoard/hrIndex#!/EmpDoc?x=1&EmpID=' + EMP.EMP_PRS_ID;
        }
    };
    // Fetchig custom fields and value from db 07/05/2021-------
    $scope.toggleCheck = function (Optionvalue, LINE) {
        if (LINE.checkedOption == undefined) {
            LINE.checkedOption = [];
        }
        if (LINE.checkedOption.indexOf(Optionvalue) === -1) {
            LINE.checkedOption.push(Optionvalue);
        } else {
            LINE.checkedOption.splice(LINE.checkedOption.indexOf(Optionvalue), 1);
        }
    };
    $scope.IS_VALID_COUNT = 0;
    $scope.DOWNLOAD_POP_FY = function (FLAG) {
        $scope.DOWNLOAD_FLAG = FLAG;
        switch (FLAG) {
            case 16:
                $scope.DOWNLOAD_REPORT_NAME = 'DEPARTMENT';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=1&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            case 17:
                $scope.DOWNLOAD_REPORT_NAME = 'POSITION';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=2&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            case 19:
                $scope.DOWNLOAD_REPORT_NAME = 'EMPLOYEE';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=3&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            default:
                break;
        }
    };
    $scope.$parent.$parent.child_scope = $scope;
    //$scope.$parent.DateInputLoad();
    //-----------------------------------------------------------------------------------------
});
app.controller('DocumentController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(5);
    $scope.YESNO = [{ ID: 1, NAME: "Yes" }, { ID: 2, NAME: "No" }];
    $scope.FOLDERPUBLIC = [{ ID: 1, NAME: "Public" }, { ID: 0, NAME: "Private" }];
    $scope.FOLDER_EDIT = 0;
    $scope.FLAG = 1;
    $scope.DocSearch = {
        DOCUMENT_NAME: "",
        DOCUMENT_ID: '',
        DOCUMENT_TYPE_ID: null,
        FOLDER_ID: null,
        SUB_FOLDER_ID: null,
        REFERENCE_NO: null,
        END_DATE: null,
        UPLOAD_IDS: "",
        PAGE_NO: 1,
        PAGE_SIZE: 10,
    };
    $scope.ResetDoc = function () {
        $scope.DocSearch = {
            DOCUMENT_NAME: "",
            DOCUMENT_ID: '',
            DOCUMENT_TYPE_ID: null,
            FOLDER_ID: null,
            SUB_FOLDER_ID: null,
            REFERENCE_NO: null,
            END_DATE: null,
            UPLOAD_IDS: "",
            PAGE_NO: 1,
            PAGE_SIZE: 10,
        }
        $scope.DocForm.submitted = false;
    };
    $scope.GET_DOCUMENT_TYPE = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_DOCUMENT_TYPE').then(function (data) {
            $scope.DOCUMENT_TYPE = data.data.Table;
        });
    };
    $scope.GET_FOLDER = function (FLAG, Sub) {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_FOLDER').then(function (data) {
            $scope.FOLDER = data.data.Table;
            if (FLAG == 1) {
                $scope.SubFolderSearch.FOLDER_ID = Sub.FOLDER_ID
            }
        });
    };
    $scope.GET_SUB_FOLDER = function () {
        $scope.SUB_FOLDER = [];
        var PosiModelObj = new Object();
        PosiModelObj.FOLDER_ID = $scope.DocSearch.FOLDER_ID;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_SUB_FOLDER').then(function (data) {
            var SUB_FOLDER = data.data.Table.filter(function (x) { return x.ADD_FILES == true });
            $scope.SUB_FOLDER = SUB_FOLDER;
        });
    };
    $scope.GET_FOLDER_SUB_FOLDER = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_FOLDER_SUB_FOLDER').then(function (data) {
            $scope.SIDE_FOLDER_LIST_ALL = angular.copy(data.data.Table);
            var FOLDER = $filter('unique')(data.data.Table, 'FOLDER_ID');
            $scope.SIDE_FOLDER_LIST = FOLDER;

        });
    };

    $scope.nginitSubfolder = function (SFL, Sub, index, index1) {
        if (index == 0 && index1 == 0) {
            $scope.GET_DOCUMENT_LIST(SFL.FOLDER_ID, Sub.SUB_FOLDER_ID, SFL.FOLDER_NAME, Sub.SUB_FOLDER_NAME);
        }
    };
    $scope.GET_DOCUMENT_LIST = function (FOLDER_ID, SUB_FOLDER_ID, FOLDER_NAME, SUB_FOLDER_NAME) {
        $scope.FLAG = 2;
        $scope.FOLDER_NAME = "";
        $scope.SUB_FOLDER_NAME = null;
        $scope.FOLDER_ID = FOLDER_ID;
        $scope.FOLDER_NAME = FOLDER_NAME;
        $scope.SUB_FOLDER_NAME = SUB_FOLDER_NAME;
        $scope.SUB_FOLDER_ID = SUB_FOLDER_ID;
        var PosiModelObj = new Object();
        PosiModelObj.FOLDER_ID = FOLDER_ID;
        PosiModelObj.SUB_FOLDER_ID = SUB_FOLDER_ID;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_DOCUMENT').then(function (data) {
            //$scope.DOC_UPLOAD_LIST = [];
            //$scope.DOC_LIST = data.data.Table;
            //var DOC_LIST = $filter('unique')(data.data.Table, 'DOCUMENT_ID');
            //$scope.DOC_UPLOAD_LIST = DOC_LIST;
            $scope.DOC_UPLOAD_LIST = data.data.Table


        });
    };
    $scope.FOLDER_CLICK = function (FOLDER) {
        $scope.FOLDER_NAME = "";
        $scope.SUB_FOLDER_NAME = null;
        $scope.FOLDER_NAME = FOLDER.FOLDER_NAME;
        $scope.GET_DOCUMENT_LIST(FOLDER.FOLDER_ID, 0, FOLDER.FOLDER_NAME, null)
    };
    $scope.GET_FOLDER_SUB_FOLDER();
    $scope.FlderSearch = {
        FOLDER_NAME: '',
        FOLDER_ID: null,
    };
    $scope.FolderSearch = {
        FOLDER_NAME: '',
        FOLDER_ID: null,
    };
    $scope.SubFolderSearch = {
        FOLDER_NAME: '',
        SUB_FOLDER_ID: null,
        SUB_FOLDER_NAME: "",
        FOLDER_ID: null,
    };
    $scope.ResetFolder = function () {
        $scope.FolderSearch = {
            FOLDER_NAME: '',
            FOLDER_ID: null,
        }
        $scope.FolderForm.submitted = false;
    };
    $scope.ResetSubFolder = function () {
        $scope.SubFolderSearch = {
            FOLDER_NAME: '',
            SUB_FOLDER_ID: null,
            SUB_FOLDER_NAME: "",
            FOLDER_ID: null,
        }
        $scope.SubFolderForm.submitted = false;
        $scope.SUB_FOLDER_EDIT = 0;
    };
    $scope.$parent.DateInputLoad();
    $scope.DOCUMENT_LIST = [{ TABLE_ID: 0, DOCUMENT_ID: 0, SHARE_WITH_EMP_PRS_ID: parseInt($cookies.get("EMPLOYEE_ID")), ALLOW_EDIT: 0, ALLOW_DELETE: 0, EXPIRY_DATE: null, REMOVE_FLAG: 0 }];
    $scope.getTheFilesToUploadDoc = function ($files, ControlName, FileSize) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel'];

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
                if (($files[i].size / 1000000).toFixed(2) <= FileSize) {//File Size should not be more than 5 MB
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
                    //     reader.readAsDataURL($files[i]);
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
        var fileUpload = document.getElementById("AddDocument");
        extension = fileUpload.files[0].name;;
        $scope.uploadFiles(8, '', extension);
    };
    $scope.uploadFiles = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var Number = parseInt($cookies.get("EMPLOYEE_ID")) + '' + $scope.$parent.generaterandom(12);
            var data = new FormData();
            data.append("RelativeID", Number);
            data.append("UPLOAD_TYPE_ID", Attachment_UPLOAD_TYPE_ID);
            data.append("VIRTUALPATH", '/Customer/Entity/' + parseInt($cookies.get("ENTITY_ID")) + '/HR/Employee/' + parseInt($cookies.get("EMPLOYEE_ID")) + '/Documents/' + Attachment_UPLOAD_TYPE_ID + '/');
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
                data.append("uploadedFile", $scope.Files[i]);
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
                    $scope.UploadedFiles = d.data;
                }
            });
        }
    };
    $scope.POP_DOC = function () {
        $scope.UploadedFiles = [];

        $('#Add_Document').modal('show')
        $scope.GET_DOCUMENT_TYPE();
        $scope.GET_FOLDER();
    };
    $scope.POP_ADDFOLDER = function (Folder) {
        $scope.ResetSubFolder();
        $('#Add_SUB_Folder').modal('show');
        $scope.SubFolderSearch.FOLDER_ID = Folder.FOLDER_ID
        $scope.SUB_FOLDER_EDIT = 0;
        $scope.FOLDER_EDIT = 0;
    };
    $scope.POP_EDIT_ADDFOLDER = function (Folder, FLAG) {
        $('#Add_Folder').modal('show');
        $scope.FolderSearch.FOLDER_ID = Folder.FOLDER_ID
        $scope.FolderSearch.FOLDER_NAME = Folder.FOLDER_NAME
        $scope.SUB_FOLDER_EDIT = 0;
        $scope.FOLDER_EDIT = 1;
    };
    $scope.POP_ADDSUBFOLDER = function (Sub, FLAG) {
        $scope.ResetSubFolder();
        $('#Add_SUB_Folder').modal('show');
        $scope.SUB_FOLDER_EDIT = 0;
        $scope.FOLDER_EDIT = 0;
        if (FLAG == 1) {
            $scope.SUB_FOLDER_EDIT = 1;
            $scope.GET_FOLDER(1, Sub);
            $scope.SubFolderSearch.SUB_FOLDER_ID = Sub.SUB_FOLDER_ID
            $scope.SubFolderSearch.SUB_FOLDER_NAME = Sub.SUB_FOLDER_NAME
        }
        else {
            $scope.GET_FOLDER();
        }
    };
    $scope.GET_FOLDER();
    $scope.INS_UPD_DOCUMENT = function () {
        var docModelObj = new Object();
        $scope.DocForm.submitted = true;
        var IS_VALID = false;
        $scope.IS_VALID = IS_VALID;
        if ($scope.UploadedFiles == undefined || $scope.UploadedFiles.length == 0) {
            IS_VALID = false;
            $scope.$parent.ShowAlert("Error", "Upload File is Require", 3000);
            $scope.IS_VALID = IS_VALID;
        }
        if ($scope.UploadedFiles.length > 0) {
            IS_VALID = true;
            $scope.IS_VALID = IS_VALID;
            angular.forEach($scope.UploadedFiles, function (value) {
                if ($scope.DocSearch.UPLOAD_IDS == "") {
                    $scope.DocSearch.UPLOAD_IDS = value.ID + '';
                }
                else {
                    $scope.DocSearch.UPLOAD_IDS = $scope.DocSearch.UPLOAD_IDS + "," + value.ID;
                }
            })
        }
        if ($scope.DocForm.$valid && IS_VALID) {
            docModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            docModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            docModelObj.DOCUMENT_ID = $scope.DocSearch.DOCUMENT_ID;
            docModelObj.DOCUMENT_NAME = $scope.DocSearch.DOCUMENT_NAME;
            docModelObj.DOCUMENT_TYPE_ID = null //$scope.DocSearch.DOCUMENT_TYPE_ID;
            docModelObj.FOLDER_ID = $scope.DocSearch.FOLDER_ID;
            docModelObj.SUB_FOLDER_ID = $scope.DocSearch.SUB_FOLDER_ID;
            docModelObj.REFERENCE_NO = $scope.DocSearch.REFERENCE_NO;
            docModelObj.END_DATE = $scope.DocSearch.END_DATE;
            var UPO = $scope.DocSearch.UPLOAD_IDS.split(',');
            docModelObj.UPLOAD_ID = UPO[0];
            docModelObj.USER_ID = parseInt($cookies.get("USERID"));
            docModelObj.DOCUMENTS = $scope.DOCUMENT_LIST;
            docModelObj.DOCUMENTS = []//$scope.DOCUMENT_LIST;
            docModelObj.DIGITAL_SIGN_REQUIRED = $scope.DocSearch.DIGITAL_SIGN_REQUIRED_ID;
            docModelObj.IS_PUBLIC = $scope.DocSearch.IS_PUBLIC;
            docModelObj.ACTIVE = 1;
            $scope.DocForm.submitted = false;
            PrcCommMethods.HR_API(docModelObj, 'INS_UPD_DOCUMENT').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data > 0) {
                    $('#Add_Document').modal('hide');
                    $scope.GET_DOCUMENT_LIST($scope.FOLDER_ID, $scope.SUB_FOLDER_ID, $scope.FOLDER_NAME, $scope.SUB_FOLDER_NAME);
                    $scope.$parent.ShowAlert('Success', 'Document Uploaded Successfully', 5000);
                    $scope.ResetDoc()
                    $scope.UploadedFiles = [];
                }
            });
        }
    };
    $scope.INS_UPD_FOLDERS = function () {
        var FolderModelObj = new Object();
        $scope.FolderForm.submitted = true;
        if ($scope.FolderForm.$valid) {
            FolderModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            FolderModelObj.FOLDER_ID = $scope.FolderSearch.FOLDER_ID;
            FolderModelObj.FOLDER_NAME = $scope.FolderSearch.FOLDER_NAME;
            FolderModelObj.USER_ID = parseInt($cookies.get("USERID"));
            FolderModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            FolderModelObj.IS_PREDEFINED = 0;
            FolderModelObj.IS_PUBLIC = 0;
            FolderModelObj.IS_EDITABLE = 1;
            FolderModelObj.ADD_FILES = 1;
            FolderModelObj.DOCUMENTS_DTLS = [];
            //FolderModelObj.DOCUMENTS_DTLS = $scope.DOCUMENT_LIST;
            PrcCommMethods.HR_API(FolderModelObj, 'INS_UPD_FOLDERS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data > 0) {
                    $scope.$parent.ShowAlert('Success', 'Folder Added Successfully', 5000);
                    $('#Add_Folder').modal('hide');
                    $scope.ResetFolder();
                    $scope.GET_FOLDER();
                    $scope.GET_FOLDER_SUB_FOLDER();

                }
            });
        }
    };
    $scope.INS_UPD_SUB_FOLDERS = function () {
        $scope.SubFolderForm.submitted = true;
        if ($scope.SubFolderForm.$valid) {
            var FolderModelObj = new Object();
            FolderModelObj.FOLDER_ID = $scope.SubFolderSearch.FOLDER_ID;
            FolderModelObj.SUB_FOLDER_ID = $scope.SubFolderSearch.SUB_FOLDER_ID;
            FolderModelObj.SUB_FOLDER_NAME = $scope.SubFolderSearch.SUB_FOLDER_NAME;
            FolderModelObj.USER_ID = parseInt($cookies.get("USERID"));

            FolderModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            FolderModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));

            FolderModelObj.IS_PREDEFINED = 0;
            FolderModelObj.IS_PUBLIC = 0;
            FolderModelObj.IS_EDITABLE = 1;
            FolderModelObj.ADD_FILES = 1;


            PrcCommMethods.HR_API(FolderModelObj, 'INS_UPD_SUB_FOLDERS').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data > 0) {
                    $scope.GET_FOLDER_SUB_FOLDER();

                    $scope.ResetSubFolder();
                    $scope.$parent.ShowAlert('Success', 'Sub Folder Added Successfully', 5000);
                    $('#Add_SUB_Folder').modal('hide');

                }
            });
        }
    };
    $scope.HR_DELETE_DOCUMENT = function (DOC) {
        //if (confirm('Are you sure?')) {
        //    FolderModelObj.DOCUMENT_ID = DOC.DOCUMENT_ID;
        //    FolderModelObj.UPLOAD_ID = DOC.UPLOAD_ID;
        //    FolderModelObj.USER_ID = parseInt($cookies.get("USERID"));
        //    PrcCommMethods.HR_API(FolderModelObj, 'HR_DELETE_DOCUMENT').then(function (data) {
        //        if (data.data == 0) {
        //            $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
        //        }
        //        if (data.data == 1) {
        //            $scope.$parent.ShowAlert('Success', 'Inactive Successfully', 5000);
        //            $scope.GET_DOCUMENT_LIST($scope.FOLDER_ID, $scope.SUB_FOLDER_ID, $scope.FOLDER_NAME, $scope.SUB_FOLDER_NAME);

        //        }
        //    });
        //}
        var docModelObj = new Object();
        if (confirm('Are you sure?')) {
            docModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            docModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            docModelObj.DOCUMENT_ID = DOC.DOCUMENT_ID;
            docModelObj.DOCUMENT_NAME = DOC.DOCUMENT_NAME;
            docModelObj.DOCUMENT_TYPE_ID = null //$scope.DocSearch.DOCUMENT_TYPE_ID;
            docModelObj.FOLDER_ID = DOC.FOLDER_ID;
            docModelObj.SUB_FOLDER_ID = DOC.SUB_FOLDER_ID;
            docModelObj.REFERENCE_NO = DOC.REFERENCE_NO;
            docModelObj.END_DATE = DOC.END_DATE;
            docModelObj.UPLOAD_ID = DOC.UPLOAD_ID;
            docModelObj.USER_ID = parseInt($cookies.get("USERID"));
            docModelObj.DOCUMENTS = [];
            docModelObj.DIGITAL_SIGN_REQUIRED = 0;
            docModelObj.IS_PUBLIC = 0;
            docModelObj.ACTIVE = 0;
            PrcCommMethods.HR_API(docModelObj, 'INS_UPD_DOCUMENT').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                if (data.data > 0) {
                    $scope.GET_DOCUMENT_LIST($scope.FOLDER_ID, $scope.SUB_FOLDER_ID, $scope.FOLDER_NAME, $scope.SUB_FOLDER_NAME);
                    $scope.$parent.ShowAlert('Success', 'Inactive Successfully', 5000);
                }
            });
        }

    };
    $scope.HR_FOLDER_SUB_DELETE = function (List, FLAG) {
        var FolderModelObj = new Object();
        if (confirm('Are you sure?')) {
            FolderModelObj.FOLDER_ID = List.FOLDER_ID;
            FolderModelObj.SUB_FOLDER_ID = List.SUB_FOLDER_ID;
            FolderModelObj.FLAG = FLAG;
            FolderModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HR_API(FolderModelObj, 'HR_FOLDER_SUB_DELETE').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', 'Something went wrong,please retry', 5000);
                }
                if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Deleted Successfully', 5000);
                    $scope.GET_FOLDER_SUB_FOLDER();
                }
            });
        }
    };
});
app.controller('LeaveController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, uiCalendarConfig) {
    if ($filter('lowercase')($location.absUrl()).indexOf("calendar") != -1) {
        $scope.$parent.TabActive(3);
    }
    $calendar = $('[ui-calendar]');

    $scope.OVERLAP_LIST = [];
    $scope.HOURSES = $scope.$parent.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
    $scope.filterLeaveSearch = {
        ABSENCE_TYPE_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
        SORT_BY: '',
        DEPARTMENT_IDS: '',
        POSITION_IDS: '',
        REPORTING_MANAGER_ID: '',
        START_DATE: '',
        END_DATE: '',
        ADMIN_FLAG: 0,
    };
    $scope.$parent.dateinputOpenDate();
    $scope.dateinputStartDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("StartDate") //our date input has the name "date"
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
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e.date != undefined) {
                            var stringdate = e.date;
                            $scope.LeaveSearch.START_DATE_ACTUAL = e.date;
                            $scope.LeaveSearch.END_DATE_ACTUAL = e.date;
                            $scope.LeaveSearch.START_DATE = moment(e.date).format("DD/MM/YYYY");
                            $scope.LeaveSearch.END_DATE = moment(e.date).format("DD/MM/YYYY");
                            $scope.SetCompleteDate($scope.LeaveSearch.START_TIME, $scope.LeaveSearch.START_DATE, 1);
                            $scope.$apply();
                        }
                    })
                }
            }
        });
    };
    $scope.dateinputEndDate = function () {
        $(document).ready(function () {
            var date_inputs = document.getElementsByClassName("EndDate") //our date input has the name "date"
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
                        format: 'dd/mm/yyyy',
                        clearBtn: true,
                        closeBtn: true,// close button visible
                    };
                    date_input.datepicker(options).on("hide", function (e) {
                        if (e.date != undefined) {
                            $scope.LeaveSearch.END_DATE_ACTUAL = e.date;
                            $scope.LeaveSearch.END_DATE = moment(e.date).format("DD/MM/YYYY");
                            //var date = moment($scope.LeaveSearch.START_DATE).format("DD/MM/YYYY");
                            //var a = moment(e.date).diff(moment($scope.LeaveSearch.START_DATE_ACTUAL), 'days')
                            //$scope.LeaveSearch.DAYS = a + 1;
                            $scope.SetCompleteDate($scope.LeaveSearch.END_TIME, $scope.LeaveSearch.END_DATE, 2);
                            $scope.$apply();
                        }
                    })
                }
            }
        });
    };
    $scope.TEAM_ARRAY = [{ ID: 1, NAME: 'All Employee' }, { ID: 0, NAME: 'Team' }]
    $scope.dayOfWeekNamesShort = [];
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon" }, { ID: 2, NAME: "Tue" }, { ID: 3, NAME: "Wed" }, { ID: 4, NAME: "Thu" }, { ID: 5, NAME: "Fri" }, { ID: 6, NAME: "Sat" }, { ID: 7, NAME: "Sun" }];
    $scope.monthNames = [
        { ID: 1, NAME: "January" },
        { ID: 2, NAME: "February" },
        { ID: 3, NAME: "March" },
        { ID: 4, NAME: "April" },
        { ID: 5, NAME: "May" },
        { ID: 6, NAME: "June" },
        { ID: 7, NAME: "July" },
        { ID: 8, NAME: "August" },
        { ID: 9, NAME: "September" },
        { ID: 10, NAME: "October" },
        { ID: 11, NAME: "November" },
        { ID: 12, NAME: "December" }];
    $scope.HR_GET_POSITION = function () {
        var PosiModelObj = new Object();
        PosiModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 2;
        POSModelObj.SORT_COLUMN_NO = 1;
        POSModelObj.SORT_ORDER_NO = 1
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_POSITION_LIST').then(function (data) {
            $scope.POSITION_LIST = data.data.Table;
        });
    };
    $scope.HR_GET_DEPARTMENTS = function () {
        var DeptModelObj = new Object();
        DeptModelObj.DEPARTMENT_NAME = "";
        DeptModelObj.DIVISION_NAME = "";
        DeptModelObj.PAGE_NO = 1;
        DeptModelObj.PAGE_SIZE = 100;
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DeptModelObj.SORT_COLUMN_NO = 1;
        DeptModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            $scope.HR_DEPARTMENTS = data.data.Table;
        });
    };
    // $scope.HR_GET_POSITION();
    // $scope.HR_GET_DEPARTMENTS();
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var curr = new Date; // get current date
    var currdate = new Date; // get current date
    $scope.CURR_DAY = curr.getDay();
    $scope.CURRENT_YEAR = curr.getFullYear();
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var LAST_DATE = first + 6;
    var Month = curr.getMonth();
    $scope.CURRENT_MONTH = $scope.monthNames.filter(function (x) { return x.ID == (Month + 1) })[0].NAME;
    var START_DATE = new Date(curr.setDate(first)).toUTCString();
    var myFutureDate = new Date(START_DATE);
    myFutureDate.setDate(myFutureDate.getDate() + LAST_DATE);
    $scope.filterLeaveSearch.START_DATE = new Date(date.getFullYear(), date.getMonth(), 1);
    $scope.filterLeaveSearch.END_DATE = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    angular.forEach($scope.dayOfWeekNamesShort, function (val) {
        var setdays = first + val.ID;
        var days = new Date(curr.setDate(setdays)).toUTCString();
        var Wekday = new Date(days);
        val.Days = Wekday.getDate()
        val.CurrentDate = currdate.getDate();
    });
    function clearCalendar() {
        if (uiCalendarConfig.calendars.Calendar != null) {
            uiCalendarConfig.calendars.Calendar.fullCalendar('removeEvents');
        }
    };
    $scope.eventsTab = [];
    $scope.events = [$scope.eventsTab];
    $scope.EventObj = {};
    $scope.HR_GET_DASHBOARD_COUNTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ALL_DEPT = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 0;
        PosiModelObj.ALL_POSITION = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 0;
        PosiModelObj.ALL_EMP = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_DASHBOARD_COUNTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.COUNT_LIST = data.data.Table;
            }
            else {

            }
        });
    };
    $scope.HR_GET_DASHBOARD_COUNTS();
    $scope.PAGE_LOAD = 1;

    $scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE = function () {
        try {
            if ($scope.$parent.$parent != null) {
                $scope.$parent.$parent.overlay_loadingNew = 'block';
            }
            else {
                $scope.$parent.overlay_loadingNew = 'block';
            }
        }
        catch (err) {
        }
        finally {
        }
        var PosiModelObj = new Object();
        PosiModelObj.SORT_BY = $scope.filterLeaveSearch.SORT_BY;
        PosiModelObj.DEPARTMENT_IDS = $scope.filterLeaveSearch.DEPARTMENT_ID;
        PosiModelObj.POSITION_IDS = $scope.filterLeaveSearch.POSITION_ID;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));

        PosiModelObj.START_DATE = (new Date($scope.filterLeaveSearch.START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.filterLeaveSearch.END_DATE)).toDateString();

        PosiModelObj.ALL_EMP_FLAG = 1; //-- - 1 FOR ALL EMP AND 1 FOR EMP WITH LEAVE ONLY
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.filterLeaveSearch.ADMIN_FLAG;//--1 FOR ADMIN ELSE 0
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_FOR_CALENDAR').then(function (data) {
            $scope.CALENDAR_LIST = data.data.Table;
            clearCalendar();
            $scope.events = [];
            $scope.eventSources = [];
            angular.forEach($scope.CALENDAR_LIST, function (val) {
                if (val.IMAGE_PATH == null) {
                    val.imageurl = window.location.origin + '/dist/img/user1-128x128.jpg';
                }
                else {
                    // val.imageurl = val.IMAGE_PATH;
                    val.imageurl = window.location.origin + '/' + val.IMAGE_PATH;
                }
                val.START_DATE = new Date(val.START_DATE);
                val.END_DATE = new Date(val.END_DATE);
                if (new Date(val.END_DATE).getMinutes() > 0 || new Date(val.END_DATE).getHours() > 0) { }
                else { val.END_DATE.setHours(23, 59, 0, 0); };
                $scope.eventsTab.push({
                    id: 1,
                    title: val.EMPLOYEE_NAME,
                    allDay: false,
                    stick: true,
                    description: val.EMPLOYEE_NAME,
                    start: (val.START_DATE),
                    end: (val.END_DATE),
                    imageurl: val.imageurl,
                    backgroundColor: val.ABSENCE_COLOR_CODE == null ? '#' + val.ABSENCE_COLOR_CODE : '#' + val.ABSENCE_COLOR_CODE,
                    borderColor: val.ABSENCE_COLOR_CODE == null ? '#' + val.ABSENCE_COLOR_CODE : '#' + val.ABSENCE_COLOR_CODE,
                    employees: val.EMPLOYEE_NAME,
                    DataArray: val,
                });
            });
            $scope.events = [$scope.eventsTab];
            $scope.uiConfig = {
                calendar: {
                    height: 450,
                    editable: true,
                    displayEventTime: true,
                    eventStartEditable: false,
                    lang: "da",
                    header: {
                        center: 'prev ,today, next ',
                        left: 'title  ',
                        right: '',
                    },
                    firstDay: 1,
                    allDay: false,
                    stick: true,
                    selectable: true,
                    viewRender: function (view, element) {
                        if ($scope.PAGE_LOAD == 2) {
                            var visStart = $('#calendar').fullCalendar('getView').start.format()
                            var visEnd = $('#calendar').fullCalendar('getView').end.format()
                            $scope.filterLeaveSearch.START_DATE = new Date(visStart);
                            $scope.filterLeaveSearch.END_DATE = new Date(visEnd);
                            $scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE();
                        }
                        $scope.PAGE_LOAD = 2;
                    },
                    eventClick: function (event) {
                        $scope.POP_LEVAE_APPROVE(event.DataArray);
                    },
                    eventRender: function (event, eventElement) {
                        if (event.imageurl) {
                            eventElement.find("div.fc-content").addClass('d-flex').prepend("<img class='fc-event img-size-20 mr-1 img-circle' src='" + event.imageurl + "' width='15' height='15'>");
                        }
                    },
                }
            };
            try {
                if ($scope.$parent.$parent != null) {
                    $scope.$parent.$parent.overlay_loadingNew = 'none';
                }
                else {
                    $scope.$parent.overlay_loadingNew = 'none';
                }
            }
            catch (err) {
                console.log(err);
            }
            finally {
            }
        });
    };
    $scope.changeView = function (view, FLAG) {
        $calendar.fullCalendar('changeView', view);
        $scope.IS_TAB_MWD = FLAG

        var visStart = $('#calendar').fullCalendar('getView').start.format()
        var visEnd = $('#calendar').fullCalendar('getView').end.format()
        $scope.filterLeaveSearch.START_DATE = new Date(visStart);
        $scope.filterLeaveSearch.END_DATE = new Date(visEnd);

        //if ($scope.IS_TAB_MWD == 1) {
        //}
        //if ($scope.IS_TAB_MWD == 2) {
        //    $scope.filterLeaveSearch.START_DATE = new Date(visStart);
        //    $scope.filterLeaveSearch.END_DATE = angular.copy(visEnd);
        //    //var numberOfDaysToAdd = 6;
        //    //$scope.filterLeaveSearch.END_DATE.setDate($scope.filterLeaveSearch.END_DATE.getDate() + numberOfDaysToAdd);
        //}
        //if ($scope.IS_TAB_MWD == 3) {
        //    $scope.filterLeaveSearch.START_DATE = new Date(visStart);
        //    $scope.filterLeaveSearch.END_DATE = new Date(visEnd);
        //}
        $scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE();

    };
    $scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE();
    $scope.IS_TAB_MWD = 1;
    $scope.EMPLOYEE_LEAVE_DETAILS = function (EMP) {
        $scope.GET_LEAVE_REQUEST_BY_ID(EMP);
    };
    $scope.GET_LEAVE_REQUEST_BY_ID = function (EMP) {
        var PosiModelObj = new Object();
        PosiModelObj.TABLE_ID = EMP.LEAVE_ID;
        PosiModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_BY_ID').then(function (data) {
            EMP.OVERLAP_LIST = [];
            EMP.UPLOADED_FILES = [];
            if (data.data.Table1.length > 0) { EMP.OVERLAP_LIST = data.data.Table1; }
            if (data.data.Table2.length > 0) { EMP.UPLOADED_FILES = data.data.Table2; }
            EMP.CAL_LEAVE_DAYS = (parseFloat(EMP.DURATION_DAYS) + (parseFloat(EMP.DURATION_HOURS)));

            if (data.data.Table.length > 0) {
                EMP.ENTITLEMENT_UNIT_ID = data.data.Table[0].ENTITLEMENT_UNIT_ID;
                EMP.DURATION_DAYS_PAID = data.data.Table[0].DURATION_DAYS_PAID;
                EMP.DURATION_DAYS_UNPAID = data.data.Table[0].DURATION_DAYS_UNPAID;
                EMP.DURATION_HOURS_PAID = data.data.Table[0].DURATION_HOURS_PAID;
                EMP.DURATION_HOURS_UNPAID = data.data.Table[0].DURATION_HOURS_UNPAID;
            }
            $scope.EMP_DTDS = EMP;

        });
    };
    $scope.GET_PENDING_LEAVE_REQUESTS_COUNT = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_PENDING_LEAVE_REQUESTS_COUNT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.PENDING_COUNT = data.data.Table[0].PENDING;
            }
            else {
                $scope.PENDING_COUNT = 0;
            }
        });
    };

    $scope.APP_REJ_HR_LEAVE_REQUESTS = function (LEVAE_FLAG, EMP_DTDS, WHERE_CLICK) {
        $scope.AbsenceSubmit.submitted = true;
        if ($scope.AbsenceLeave.$valid) {
            if (confirm('Are you Sure?')) {
                var LevModelObj = new Object();
                LevModelObj.TABLE_ID = EMP_DTDS.LEAVE_ID;
                LevModelObj.STATUS_ID = LEVAE_FLAG;
                LevModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                LevModelObj.COMMENTS = $scope.LEAVE_CANCEL;
                LevModelObj.DURATION_PAID = 0;
                LevModelObj.DURATION_UNPAID = 0;
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 1 || EMP_DTDS.ENTITLEMENT_UNIT_ID == 3) {
                    LevModelObj.DURATION_PAID = DURATION_DAYS_PAID;
                    LevModelObj.DURATION_UNPAID = DURATION_DAYS_UNPAID;
                }
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 2) {
                    LevModelObj.DURATION_PAID = DURATION_HOURS_PAID;
                    LevModelObj.DURATION_UNPAID = DURATION_HOURS_UNPAID;
                }
                PrcCommMethods.HR_API(LevModelObj, 'APP_REJ_HR_LEAVE_REQUESTS').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', (LEVAE_FLAG == 12 ? 'Approved' : 'Rejected') + ' Successfully', 5000);
                        $('#Leave_details_C').modal('hide');
                        $scope.GET_LEAVE_REQUEST_LIST(1);
                    }
                    if (WHERE_CLICK == "PROFILE_VIEW_PAGE") {
                        $scope.$parent.GET_LEAVE_REQUEST_LIST(1);
                    }
                });
            }
        }
    };
    $scope.GET_PENDING_LEAVE_REQUESTS_COUNT();
    if ($filter('lowercase')($location.absUrl()).indexOf("hr_index") != -1) {
        $scope.GET_ABSENCE_TYPE();
        //   $scope.GET_TIME_LIST();
        $scope.$parent.TabActive(1);
    };
    $scope.SelectedEvent = null;
    var isFirstTime = true;
    $scope.POP_LEVAE_APPROVE = function (LIST) {
        $('#Leave_details_C').modal('show');
        $scope.LEAVE_CANCEL = '';
        $scope.EMP_DTDS = LIST;
        LIST.COLMD = 'col-md-4';
        $scope.EMPLOYEE_LEAVE_DETAILS(LIST);
        $scope.$parent.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(14, LIST);
    };
    $scope.POP_VIEW_OVERLAP = function (LIST) {
        $('#Leave_details_C').modal('show');
        $scope.OVER_LAP_EMP_DTDS = LIST;
        LIST.COLMD = 'col-md-4';
        //$scope.EMPLOYEE_LEAVE_DETAILS(LIST);
        $scope.$parent.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(14, LIST);
    };
    //$scope.POP_LEAVE = function (WHERE_CLICK) {
    //    $('#leave').modal('show')
    //    $scope.Resetleave();
    //    if (WHERE_CLICK == undefined) {
    //        $scope.GET_ABSENCE_TYPE();
    //        $scope.$parent.RANDOM_NUMBER = $scope.$parent.generaterandom(12);
    //    }
    //    //   $scope.GET_TIME_LIST();
    //    $scope.GET_REPORTING_EMPLOYEE_LIST(WHERE_CLICK);
    //    //if ($scope.$parent.CUSTOM_FIELDS_LIST == undefined || $scope.$parent.CUSTOM_FIELDS_LIST.length == 0) {
    //    //    $scope.COLMD = 'col-md-4';
    //    //    $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(14, $scope.COLMD);
    //    //}
    //    //if ($scope.$parent.CUSTOM_FIELDS_LIST.length > 0) {
    //    //    var a = $scope.$parent.CUSTOM_FIELDS_LIST.filter(function (x) { return x.APP_PAGE_ID == 14 });
    //    //    if (a.length == 0) {
    //    //        $scope.COLMD = 'col-md-4';
    //    //        $scope.$parent.GET_CUSTOM_APP_FIELD_MAPPING(14, $scope.COLMD);
    //    //    }
    //    //}
    //};
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        HolEntitlObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        HolEntitlObj.HOLIDAY_ENTITLEMENT_NAME = '';
        HolEntitlObj.ACTIVE = 1;
        HolEntitlObj.PAGE_NO = 0;
        HolEntitlObj.USER_ID = parseInt($cookies.get("USERID"));
        HolEntitlObj.MANAGER = -1;
        HolEntitlObj.EMPLOYEE = -1;
        HolEntitlObj.ENTITLEMENT_REQUIRED = -1;
        PrcCommMethods.HR_API(HolEntitlObj, 'ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER').then(function (data) {
            $scope.ABSENCE_TYPE_ENTITLEMENT = data.data.Table;
        });
    };
    $scope.ADMIN_GET_HOLIDAY_ENTITLEMENT_MASTER();
    //$scope.$parent.$parent.child_scope = $scope;
    $(document).on("click", "button.fc-today-button", function (event) {
        var visStart = $('#calendar').fullCalendar('getView').start.format()
        var visEnd = $('#calendar').fullCalendar('getView').end.format()
        $scope.filterLeaveSearch.START_DATE = new Date(visStart);
        $scope.filterLeaveSearch.END_DATE = new Date(visEnd);
        //var date = new Date(get_Date);
        //if ($scope.IS_TAB_MWD == 1) {
        //    $scope.filterLeaveSearch.START_DATE = new Date(date.getFullYear(), date.getMonth(), 1);
        //    $scope.filterLeaveSearch.END_DATE = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        //}
        //if ($scope.IS_TAB_MWD == 2) {
        //    $scope.filterLeaveSearch.START_DATE = new Date(get_Date);
        //    $scope.filterLeaveSearch.END_DATE = angular.copy($scope.filterLeaveSearch.START_DATE);
        //    var numberOfDaysToAdd = 6;
        //    $scope.filterLeaveSearch.END_DATE.setDate($scope.filterLeaveSearch.END_DATE.getDate() + numberOfDaysToAdd);
        //}
        //if ($scope.IS_TAB_MWD == 3) {
        //    $scope.filterLeaveSearch.START_DATE = new Date(get_Date);
        //    $scope.filterLeaveSearch.END_DATE = new Date(get_Date);
        //}
        $scope.GET_LEAVE_REQUEST_FOR_CALENDAR_PAGE();
    });
    $scope.$parent.child_scope = $scope;
});
app.controller('LeaveListController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.FLAG = getUrlParameter('FLAG', $location.absUrl());
    $scope.STEP_FLAG = $scope.FLAG == undefined ? 1 : parseInt($scope.FLAG);//1  for my leave 2 for employee leave
    $scope.HOURSES = $scope.$parent.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
    $scope.LeaveSearch = {
        ABSENCE_TYPE_ID: null,
        ABSENCE_TYPE_ID: null,
        STATUS_ID: null,
        DEPARTMENT_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
    };
    $scope.LeaveRequestSearch = {
        ABSENCE_TYPE_ID: null,
        ABSENCE_TYPE_ID: null,
        STATUS_ID: null,
        DEPARTMENT_ID: null,
        HOURS: '',
        DAYS: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
    };
    $scope.ResetMyLeave = function () {
        $scope.LeaveSearch = {
            ABSENCE_TYPE_ID: null,
            STATUS_ID: null,
            DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
        }
    };
    $scope.ResetReqLev = function () {
        $scope.LeaveRequestSearch = {
            ABSENCE_TYPE_ID: null,
            STATUS_ID: null,
            DEPARTMENT_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',


        }
    };
    $scope.RESET_LEAVE = function () {
        $scope.LeaveSearch = {
            ABSENCE_TYPE_ID: null,
            HOURS: '',
            DAYS: '',
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
        }
        $scope.START_DATE_REQUIRED_VALID = true;
        $scope.END_DATE_REQUIRED_VALID = true;
        $scope.START_DATE_VALID = true;
        $scope.END_DATE_VALID = true;
    };

    $scope.ABSENCE_TYPE = [];
    $scope.STATUS_LIST = [];
    $scope.LEAVE_MY_LIST = [];

    $scope.STATUS_LIST = [{ ID: 12, NAME: "Approved" }, { ID: 15, NAME: "Auto Approved" },
    { ID: 13, NAME: "Rejected" },
    { ID: 11, NAME: "Pending" }, { ID: 14, NAME: "Cancelled" }];

    $scope.ADMIN_GET_ABSENCE_TYPE = function () {
        if ($scope.ABSENCE_TYPE.length == 0) {
            var PosiModelObj = new Object();
            PosiModelObj.PAGE_NO = 0;
            PosiModelObj.ACTIVE = 1;
            PrcCommMethods.ADMIN_API(PosiModelObj, 'ADMIN_GET_ABSENCE_TYPE').then(function (data) {
                $scope.ABSENCE_TYPE = data.data.Table;
            });
        }
    };
    $scope.HR_GET_DEPARTMENTS = function () {
        var DeptModelObj = new Object();
        DeptModelObj.DEPARTMENT_NAME = $scope.LeaveSearch.DEPARTMENT_NAME;
        DeptModelObj.DIVISION_NAME = $scope.LeaveSearch.DIVISION_NAME;
        DeptModelObj.PAGE_NO = $scope.LeaveSearch.PAGE_NO;
        DeptModelObj.PAGE_SIZE = $scope.LeaveSearch.PAGE_SIZE;
        DeptModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        DeptModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        DeptModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 3;
        DeptModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        DeptModelObj.SORT_COLUMN_NO = 1;
        DeptModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(DeptModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            $scope.HR_DEPARTMENTS = data.data.Table;
        });
    };

    $scope.HR_GET_DEPARTMENTS();
    $scope.ADMIN_GET_ABSENCE_TYPE();

    $scope.GET_LEAVE_REQUEST_BY_ID = function (EMP) {
        $scope.EMP_DTDS = [];
        var PosiModelObj = new Object();
        PosiModelObj.TABLE_ID = EMP.LEAVE_ID;
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;//-- 1 FOR ADMIN ELSE 0
        PosiModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_BY_ID').then(function (data) {
            EMP.OVERLAP_LIST = [];
            EMP.UPLOADED_FILES = [];
            if (data.data.Table1.length > 0) { EMP.OVERLAP_LIST = data.data.Table1; }
            if (data.data.Table2.length > 0) { EMP.UPLOADED_FILES = data.data.Table2; }
            if (data.data.Table.length > 0) {
                EMP.ENTITLEMENT_UNIT_ID = data.data.Table[0].ENTITLEMENT_UNIT_ID;
                EMP.DURATION_DAYS_PAID = data.data.Table[0].DURATION_DAYS_PAID;
                EMP.DURATION_DAYS_UNPAID = data.data.Table[0].DURATION_DAYS_UNPAID;
                EMP.DURATION_HOURS_PAID = data.data.Table[0].DURATION_HOURS_PAID;
                EMP.DURATION_HOURS_UNPAID = data.data.Table[0].DURATION_HOURS_UNPAID;
            }
            $scope.EMP_DTDS = EMP;
        });
    };
    $scope.GET_LEAVE_REQUEST_BY_ID_OVER_LAP = function (EMP) {
        var PosiModelObj = new Object();
        PosiModelObj.TABLE_ID = EMP.LEAVE_ID;
        PosiModelObj.ADMIN_FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;//-- 1 FOR ADMIN ELSE 0
        PosiModelObj.TIME_ZONE = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_BY_ID').then(function (data) {
            EMP.OVERLAP_LIST = [];
            EMP.UPLOADED_FILES = [];
            if (data.data.Table1.length > 0) { EMP.OVERLAP_LIST = data.data.Table1; }
            if (data.data.Table2.length > 0) { EMP.UPLOADED_FILES = data.data.Table2; }
        });
    };

    $scope.POP_LEVAE_APPROVE = function (LIST, FLAG, TAB_CLICK) {
        //$scope.MYREQUEST = '';
        //$scope.REJECT_APPROVE_FLAG = '';
        $scope.EMP_DTDS = LIST;
        $scope.EMP_DTDS.TAB_CLICK = TAB_CLICK;
        $scope.LEAVE_CANCEL = '';
        if (FLAG == "CANCEL_LEAVE") {
            // $scope.MYREQUEST = "MYREQUEST";
            $scope.REJECT_APPROVE_FLAG = 0;
            $('#Leave_details_Cancel').modal('show');
        }
        else {
            $('#Leave_details_Approve_Reject').modal('show');
        }

        LIST.COLMD = 'col-md-4';
        $scope.GET_LEAVE_REQUEST_BY_ID(LIST);
        $scope.$parent.GET_CUSTOM_LABEL_APP_FIELD_MAPPING(14, LIST);
    };
    $scope.POP_VIEW_OVERLAP = function (LL) {
        $('#Leave_details_VIEW_OVERLAP').modal('show');
        $scope.OVERLAP_DATA = (LL);
        $scope.GET_LEAVE_REQUEST_BY_ID_OVER_LAP(LL);
    };


    $scope.COMMENT_FLAG = true;
    $scope.AbsenceSubmit = {
        submitted: false,
    };

    $scope.APP_REJ_HR_LEAVE_REQUESTS = function (LEVAE_FLAG, EMP_DTDS) {
        $scope.AbsenceSubmit.submitted = true;
        $scope.REJECT_APPROVE_FLAG = 0;
        var count = 0;
        if (LEVAE_FLAG == 13) {
            if ($scope.LEAVE_CANCEL == "" || $scope.LEAVE_CANCEL == null || $scope.LEAVE_CANCEL == undefined) {
                $scope.REJECT_APPROVE_FLAG = 1;
                count = 1;
            }
        }
        var DURATION_DAYS_PAID = EMP_DTDS.DURATION_DAYS_PAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_DAYS_PAID))) {
            DURATION_DAYS_PAID = 0;
        }
        var DURATION_DAYS_UNPAID = EMP_DTDS.DURATION_DAYS_UNPAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_DAYS_UNPAID))) {
            DURATION_DAYS_UNPAID = 0;
        }
        var DURATION_HOURS_PAID = EMP_DTDS.DURATION_HOURS_PAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_HOURS_PAID))) {
            DURATION_HOURS_PAID = 0;
        }
        var DURATION_HOURS_UNPAID = EMP_DTDS.DURATION_HOURS_UNPAID;
        if (isNaN(parseFloat(EMP_DTDS.DURATION_HOURS_UNPAID))) {
            DURATION_HOURS_UNPAID = 0;
        }
        if (LEVAE_FLAG == 12 && (EMP_DTDS.ENTITLEMENT_UNIT_ID == 1 || EMP_DTDS.ENTITLEMENT_UNIT_ID == 3)) {
            var DAYS = parseFloat(DURATION_DAYS_PAID) + parseFloat(DURATION_DAYS_UNPAID);
            if (parseFloat(DAYS) > parseFloat(EMP_DTDS.DURATION_DAYS) || parseFloat(DAYS) < parseFloat(EMP_DTDS.DURATION_DAYS)) {
                count = 2;
            }
        };
        if (LEVAE_FLAG == 12 && EMP_DTDS.ENTITLEMENT_UNIT_ID == 2) {
            var HOURS = parseFloat(DURATION_HOURS_PAID) + parseFloat(DURATION_HOURS_UNPAID);
            if (parseFloat(HOURS) > parseFloat(EMP_DTDS.DURATION_HOURS) || parseFloat(HOURS) < parseFloat(EMP_DTDS.DURATION_HOURS)) {
                count = 2;
            }
        };
        if ($scope.AbsenceLeave.$valid && count == 0) {
            if (confirm('Are you Sure?')) {
                var LevModelObj = new Object();
                LevModelObj.TABLE_ID = EMP_DTDS.LEAVE_ID;
                LevModelObj.STATUS_ID = LEVAE_FLAG;
                LevModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                LevModelObj.COMMENTS = $scope.LEAVE_CANCEL;
                LevModelObj.USER_ID = parseInt($cookies.get("USERID"));
                LevModelObj.DURATION_PAID = 0;
                LevModelObj.DURATION_UNPAID = 0;
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 1 || EMP_DTDS.ENTITLEMENT_UNIT_ID == 3) {
                    LevModelObj.DURATION_PAID = parseFloat(DURATION_DAYS_PAID).toFixed(5);
                    LevModelObj.DURATION_UNPAID = parseFloat(DURATION_DAYS_UNPAID).toFixed(5);
                }
                if (EMP_DTDS.ENTITLEMENT_UNIT_ID == 2) {
                    LevModelObj.DURATION_PAID = parseFloat(DURATION_HOURS_PAID).toFixed(5);
                    LevModelObj.DURATION_UNPAID = parseFloat(DURATION_HOURS_UNPAID).toFixed(5);
                }
                PrcCommMethods.HR_API(LevModelObj, 'APP_REJ_HR_LEAVE_REQUESTS').then(function (data) {
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                    }
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', (LEVAE_FLAG == 12 ? 'Approve' : 'Reject') + ' Successfully', 5000);
                        $('#Leave_details_Approve_Reject').modal('hide');
                        $('#Leave_details_Cancel').modal('hide');
                        $scope.GET_LEAVE_REQUEST_LIST(1);
                    }
                });
            }
        }
        else {
            if (count == 2) {
                $scope.ShowAlert('Error', "Sum of Paid and Unpaid should be equal to total leave duration.", 5000);
            }
        }
    };
    $scope.LAZY_LOAD = function () {
        $scope.GET_MY_LEAVE_LIST();
    };
    $scope.LAZY_LOAD_REQUEST = function () {
        $scope.GET_LEAVE_REQUEST_LIST();
    };
    $scope.GET_MY_LEAVE_LIST = function (FLAG) {
        if (FLAG == '1') {
            $scope.LEAVE_MY_LIST = [];
            $scope.LeaveSearch.PAGE_NO = 1;
        }
        var PosiModelObj = new Object();
        PosiModelObj.SELF_FLAG = 1;

        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ABSENCE_TYPE_IDS = $scope.LeaveSearch.ABSENCE_TYPE_ID;
        PosiModelObj.DEPARMENT_IDS = $scope.LeaveSearch.DEPARTMENT_ID;
        PosiModelObj.STATUS_IDS = $scope.LeaveSearch.STATUS_ID;
        PosiModelObj.SORT_BY = $scope.LeaveSearch.SORT_BY;
        PosiModelObj.PAGE_NO = $scope.LeaveSearch.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.LeaveSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.LEAVE_MY_LIST = $scope.LEAVE_MY_LIST.concat(data.data.Table);
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                if (data.data.Table.length < $scope.LeaveSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.LeaveSearch.PAGE_NO = parseInt($scope.LeaveSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.LEAVE_MY_LIST.length == 0) {

                }
                $scope.GetData = false;
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.GetDataR = false;
    $scope.GET_LEAVE_REQUEST_LIST = function (FLAG) {
        $scope.EMPLOYEE_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        if (FLAG == '1') {
            $scope.LEAVE_REQUEST_LIST = [];
            $scope.LeaveRequestSearch.PAGE_NO = 1;
        }
        var PosiModelObj = new Object();
        PosiModelObj.SELF_FLAG = 0;
        if ($scope.$parent.CheckSubModuleAccess(48)) {
            PosiModelObj.SELF_FLAG = 2;
        }
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ABSENCE_TYPE_IDS = $scope.LeaveRequestSearch.ABSENCE_TYPE_ID;
        PosiModelObj.DEPARMENT_IDS = $scope.LeaveRequestSearch.DEPARTMENT_ID;
        PosiModelObj.STATUS_IDS = $scope.LeaveRequestSearch.STATUS_ID;
        PosiModelObj.SORT_BY = $scope.LeaveRequestSearch.SORT_BY;
        PosiModelObj.PAGE_NO = $scope.LeaveRequestSearch.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.LeaveRequestSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_LEAVE_REQUEST_LIST').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.$parent.overlay_loadingNew = 'none';
                $scope.LEAVE_REQUEST_LIST = $scope.LEAVE_REQUEST_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.LeaveSearch.PAGE_SIZE) {
                    $scope.GetDataR = false;
                }
                else {
                    $scope.LeaveRequestSearch.PAGE_NO = parseInt($scope.LeaveRequestSearch.PAGE_NO) + 1;
                    $scope.GetDataR = true;
                }
            }
            else {
                if ($scope.LEAVE_REQUEST_LIST.length == 0) { }
                $scope.GetDataR = false;
                $scope.$parent.$parent.overlay_loadingNew = 'none';
            }
        });
    };
    $scope.NG_INIT_LEAVE_LIST = function (LL) {
        //LL.CAL_LEAVE_DAYS = (LL.DURATION_DAYS + (parseFloat(LL.DURATION_HOURS) / parseFloat($scope.HOURSES))) old calucation
        LL.CAL_LEAVE_DAYS = (parseFloat(LL.DURATION_DAYS) + parseFloat(LL.DURATION_HOURS));
    };
    // $scope.GET_MY_LEAVE_LIST(1);
    $scope.CNCL_HR_LEAVE_REQUESTS = function (EMP_DTDS, FLAG) {
        $scope.AbsenceSubmit.submitted = true;
        $scope.REJECT_APPROVE_FLAG = 0;
        var count = 0;

        if ($scope.LEAVE_CANCEL == "" || $scope.LEAVE_CANCEL == null || $scope.LEAVE_CANCEL == undefined) {
            count = 1;
            $scope.REJECT_APPROVE_FLAG = 1;
        }
        if ($scope.AbsenceLeave.$valid && count == 0) {
            if (confirm('Are you sure?')) {
                var LevModelObj = new Object();
                LevModelObj.TABLE_ID = EMP_DTDS.LEAVE_ID;
                LevModelObj.STATUS_ID = 14;
                LevModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                LevModelObj.USER_ID = parseInt($cookies.get("USERID"));
                LevModelObj.COMMENTS = $scope.LEAVE_CANCEL;
                LevModelObj.DURATION_PAID = 0;
                LevModelObj.DURATION_UNPAID = 0;
                PrcCommMethods.HR_API(LevModelObj, 'APP_REJ_HR_LEAVE_REQUESTS').then(function (data) {
                    if (data.data == 1) {
                        $('#Leave_details_Cancel').modal('hide');
                        if (FLAG == 1) {
                            $scope.GET_MY_LEAVE_LIST(1);
                        }
                        if (FLAG == 2) {
                            $scope.GET_LEAVE_REQUEST_LIST(1);
                        }
                        $scope.LEAVE_CANCEL = "";
                        $scope.ShowAlert('Success', 'Leave Cancel Successfully', 5000);
                    }
                })
            };
        }
        else {
            if (count == 2) {
                $scope.ShowAlert('Error', "Paid Or Unpaid can not be exceed and less than duration", 5000);
            }
        }
    };
    $scope.LEVAE_COMMENS_FY = function (FLAG) {
        $scope.REJECT_APPROVE_FLAG = 0;
        if ($scope.LEAVE_CANCEL == "" || $scope.LEAVE_CANCEL == null || $scope.LEAVE_CANCEL == undefined) {
            $scope.REJECT_APPROVE_FLAG = 1;
        }
    }
    $scope.TAB_CLICK = function (FLAG) {
        $scope.$parent.$parent.overlay_loadingNew = 'block';
        $scope.STEP_FLAG = FLAG;
        $scope.MYREQUEST = "";
        if (FLAG == 1) {
            $scope.GET_MY_LEAVE_LIST(1);
        }
        if (FLAG == 2) {
            $scope.GET_LEAVE_REQUEST_LIST(1);
        }
    };
    $scope.TAB_CLICK($scope.STEP_FLAG);
});
app.controller('YourTaskController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.RES_ID = getUrlParameter('ID', $location.absUrl());
    $scope.$parent.$parent.overlay_loadingNew = 'block';
    $scope.$parent.TabActive(6);
    $scope.YourTaskSearch = {
        STATUS_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
    };
    $scope.ResetMyTask = function () {
        $scope.YourTaskSearch = {
            STATUS_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
        }
    };
    $scope.LAZY_LOAD = function () {
        $scope.GET_MY_LEAVE_LIST();
    };
    $scope.LAZY_LOAD_REQUEST = function () {
        $scope.GET_LEAVE_REQUEST_LIST();
    };
    $scope.IS_PREV_VISIBLE = false;
    $scope.IS_NEXT_VISIBLE = false;
    $scope.EMPLOYEE_RESPONSBILITY = [];
    $scope.GET_EMPLOYEE_RESPONSBILITY = function (FLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_RESPONSBILITY').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_RESPONSBILITY = data.data.Table;
                if (data.data.Table.length < $scope.YourTaskSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.YourTaskSearch.PAGE_NO = parseInt($scope.YourTaskSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.EMPLOYEE_RESPONSBILITY.length == 0) {

                }
                $scope.GetData = false;
            }
            $scope.$parent.$parent.overlay_loadingNew = 'none';
            if ($filter('lowercase')($location.absUrl()).indexOf("rtask") != -1) {
                $scope.GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_ID();
            }
        });
    };
    $scope.inittask = function (EMP, index) {
        if (index == 0 || index == 5) {
            EMP.COLOR = 'bg-box-blue';
        }
        if (index == 1 || index == 6) {
            EMP.COLOR = 'bg-box-pink';
        }
        if (index == 2 || index == 7) {
            EMP.COLOR = 'bg-box-yellow';
        }
        if (index == 3 || index == 8) {
            EMP.COLOR = 'bg-box-purple';
        }
        if (index == 4 || index == 9) {
            EMP.COLOR = 'bg-box-navy-blue';
        }
        //if (index == 5 || index == 11) {
        //    EMP.COLOR = 'bg-box-navy-blue';
        //}
    };
    $scope.PREV_VISIBLE = function (NEXT) {
        $scope.RESPONSBILITY_INDEX = NEXT - 1
        for (var i = 0; i < $scope.EMPLOYEE_RESPONSBILITY.length; i++) {
            if ($scope.RESPONSBILITY_INDEX == i) {
                if ($scope.EMPLOYEE_RESPONSBILITY[i].TASK_LIST == undefined) {
                    $scope.GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_NEXT($scope.EMPLOYEE_RESPONSBILITY[i])
                }
                break;
            }
        }
    };
    $scope.NEXT_VISIBLE = function (NEXT) {
        $scope.RESPONSBILITY_INDEX = NEXT + 1
        // const index = $scope.EMPLOYEE_RESPONSBILITY.findIndex((item) => item.POSITION_RESPONSIBILITY_ID == parseInt($scope.RES_ID));
        for (var i = 0; i < $scope.EMPLOYEE_RESPONSBILITY.length; i++) {
            if ($scope.RESPONSBILITY_INDEX == i) {
                if ($scope.EMPLOYEE_RESPONSBILITY[i].TASK_LIST == undefined) {
                    $scope.GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_NEXT($scope.EMPLOYEE_RESPONSBILITY[i])
                }
                break;
            }
        }
    };
    $scope.GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_ID = function (FLAG) {
        var PosiModelObj = new Object();
        PosiModelObj.RESPONSIBLE_ID = $scope.RES_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach($scope.EMPLOYEE_RESPONSBILITY, function (val) {
                    if (val.POSITION_RESPONSIBILITY_ID == parseInt($scope.RES_ID)) {
                        if (val.TASK_LIST == undefined) {
                            val.TASK_LIST = [];
                        }
                        val.TASK_LIST = data.data.Table;
                    }
                })
            }
            $scope.RESPONSIBLE_LENGTH = $scope.EMPLOYEE_RESPONSBILITY.length;
            $scope.IS_NEXT_VISIBLE = false;
            const index = $scope.EMPLOYEE_RESPONSBILITY.findIndex((item) => item.POSITION_RESPONSIBILITY_ID == parseInt($scope.RES_ID));
            $scope.RESPONSBILITY_INDEX = index;
            if ($scope.EMPLOYEE_RESPONSBILITY.length > 1) {
                $scope.IS_NEXT_VISIBLE = true;
            }
        });
    };
    $scope.GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_NEXT = function (LIST) {
        var PosiModelObj = new Object();
        PosiModelObj.RESPONSIBLE_ID = LIST.POSITION_RESPONSIBILITY_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_RESPONSIBILITY_DETAIL_BY_ID').then(function (data) {
            if (data.data.Table.length > 0) {
                //  $scope.TASK_LIST = data.data.Table;
                if (LIST.TASK_LIST == undefined) {
                    LIST.TASK_LIST = [];
                }
                LIST.TASK_LIST = data.data.Table;

            }
        });
    };
    $scope.GET_EMPLOYEE_RESPONSBILITY();
    $scope.GET_YOUR_TASKS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.EMPLOYEE_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'GET_YOUR_TASKS').then(function (data) {
            $scope.YOUR_TASKS = data.data.Table[0];
        });
    };
    $scope.REDIRECT_INDEX = function (FLAG) {
        if (FLAG == 1) {
            $location.path('Reminders');
        }
        else if (FLAG == 2) {
            $location.path('PendingRequest').search('FLAG', 2);
        }
        else if (FLAG == 3) {
            //$location.path('PendingRequest');
        }
        else if (FLAG == 4) {
            $location.path('PendingRequest');
        }
    };
    if ($filter('lowercase')($location.absUrl()).indexOf("yourtask") != -1) {
        $scope.GET_YOUR_TASKS();
    };
});
app.controller('RemindersController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(6);
    $scope.USER_REMINDER = [];
    $scope.RemindersSearch = {
        STATUS_ID: null,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        COMMENT: '',
    };
    $scope.ResetReminders = function () {
        $scope.RemindersSearch = {
            STATUS_ID: null,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            COMMENT: '',
        }
    };
    $scope.LAZY_LOAD = function () {
        $scope.GET_MY_LEAVE_LIST();
    };
    $scope.UPD_REMINDER_TO_DO_STATUS = function (REM) {
        var ModelObj = new Object();
        ModelObj.TABLE_ID = REM.TABLE_ID;
        ModelObj.FLAG = 1;
        ModelObj.STATUS_ID = 2;
        PrcCommMethods.HR_API(ModelObj, 'UPD_REMINDER_TO_DO_STATUS').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Successfully Remove', 10000);
                REM.TABLE_ID = 0;
                if ($scope.USER_REMINDER.filter(function (x) { return x.TABLE_ID != 0 }).length == 0) {
                    $scope.GET_USER_REMINDER()
                }
            }
        });
    };
    $scope.GET_USER_REMINDER = function () {
        var ModelObj = new Object();
        ModelObj.USER_ID = 0;
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        ModelObj.MODULE_ID = 2;
        PrcCommMethods.HR_API(ModelObj, 'GET_USER_REMINDER').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.USER_REMINDER = data.data.Table;
            }
            else {
                $scope.USER_REMINDER = [];
            }
        });
    };
    if (isNaN(parseInt($cookies.get("EMPLOYEE_ID")))) {
    }
    else {
        $scope.GET_USER_REMINDER();
    };
});
app.controller('PayrollController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.$parent.TabActive(4);
});
app.controller('BulkUploadController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.FLAG_ID = getUrlParameter('Id', $location.absUrl());
    $scope.EXPORT_DATA = 'Export Data';
    $scope.EXPORT_TEMP = 'Download Template';
    $scope.DATA_UPLOAD_LIST = [];
    $scope.CODE_ARRY = [];
    $scope.COPY_CODE_ARRY = [];
    $scope.GetData = false;
    $scope.BulkUploadSeach = {
    };
    $scope.submitted = false;
    $scope.IS_VALID_UPLOAD_FILE = false;
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.LIST_DEPARTEMT_ACTIVE = [];
    $scope.$parent.Files = null;
    $scope.DATE_OF_BIRTH_DIFF = 13;
    //$scope.Files = null;
    $scope.RESET_CHOOSE_FILE = function () {
        if ($scope.STEP_FLAG == 19 || $scope.STEP_FLAG == 20 || $scope.STEP_FLAG == 21 || $scope.STEP_FLAG == 22 || $scope.STEP_FLAG == 23 || $scope.STEP_FLAG == 18) {
            angular.element("input[id='ngexcelfile_HR_" + $scope.STEP_FLAG + "']").val(null);
        }
        else {
            angular.element("input[id='ngexcelfile_HR']").val(null);
        }

    }
    $scope.CANCEL_EXCEL_FY = function () {
        $scope.$parent.Files = [];
        $scope.$apply()
    }
    $scope.RESET_EXCEL = function () {
        $scope.Message = '';
        $scope.DATA_VALIDATED_LIST = undefined;
        $scope.submitted = false;
        $scope.IS_VALID_UPLOAD_FILE = false;
        $scope.IS_DB_VALID_FILE = false;
        $scope.CODE_ARRY = [];
        $scope.COPY_CODE_ARRY = [];
        $scope.DUPLICATES = [];
        $scope.RESET_CHOOSE_FILE();
        $scope.$parent.Files = []

    };

    $scope.VALIDATE_EXCEL = function () {
        $scope.Message = '';
        $scope.COPY_CODE_ARRY = [];
        $scope.EXCEL_PATH = null;
        $scope.IS_DB_VALID_FILE = false;
        $scope.submitted = false;
        $scope.$parent.overlay_loadingNew = 'block';
        var fileUpload = '';
        if ($scope.FLAG_ID == 19) {
            fileUpload = document.getElementById("ngexcelfile_HR_" + $scope.STEP_FLAG);
        }
        else {
            fileUpload = document.getElementById("ngexcelfile_HR");
        }
        $scope.uploadFiles_FY(fileUpload.value);

    };
    $scope.VALIDATE_DB_EXCEL = function () {
        $scope.IS_DB_VALID_FILE = false;
        $scope.EXCEL_PATH = null;
        $scope.$parent.overlay_loadingNew = 'block';
        var HRModelObj = new Object();
        HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
        HRModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        if ($scope.FLAG_ID == 19) {
            HRModelObj.UPLOAD_TYPE_ID = $scope.STEP_FLAG;
        }
        else {
            HRModelObj.UPLOAD_TYPE_ID = $scope.FLAG_ID;
        }
        HRModelObj.DATA_FLAG = 2;//-- 1 FOR FETCHING DATA ELSE 0
        HRModelObj.INCLUDE_INCOMPLETE = $scope.BulkUploadSeach.INCLUDE_INCOMPLETE ? 1 : 0;;
        HRModelObj.INCLUDE_INACTIVE = 0//INCLUDE_INACTIVE;
        HRModelObj.FLAG = 0
        HRModelObj.FILE_PATH = $scope.UPLOAD_EXCEL_PATH;
        HRModelObj.EMP_PRS_ID = isNaN(parseInt($cookies.get("EMPLOYEE_ID"))) ? 0 : parseInt($cookies.get("EMPLOYEE_ID"));
        HRModelObj.ORIGINAL_FILE_NAME = $scope.BulkUploadSeach.FILE_NAME //$scope.DOWNLOAD_REPORT_NAME;
        HRModelObj.SERVER_FILE_NAME = $scope.SERVER_FILE_NAME;
        HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
        HRModelObj.LANGUAGE_ID = 1;
        if ($scope.FLAG_ID == 19) { HRModelObj.UPLOAD_TYPE_ID = $scope.STEP_FLAG; }
        else { HRModelObj.UPLOAD_TYPE_ID = $scope.FLAG_ID; }
        HRModelObj.BULK_UPLOAD_OBJ_ARRY_LIST = $scope.OBJ_ARRAY;
        HRModelObj.BULK_UPLOAD_VALIDATED_LIST = $scope.DATA_VALIDATED_LIST;
        HRModelObj.SETTING_32 = $scope.$parent.GET_ENTITY_SETTINGS(32)[0].SETTING_VALUE == "1" ? 1 : 0;
        PrcCommMethods.HR_API(HRModelObj, "HR_UPLOAD_DB_VALIDATE_ALL").then(function (data) {
            $scope.$parent.overlay_loadingNew = 'none';
            $scope.IS_DB_VALID_FILE = true;
            if (data.data == null) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
            else {
                if (data.data.IS_VALID_COUNT == 0) {
                    $scope.$parent.ShowAlert('Success', 'Record uploaded successfully', 3000);
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Partially save,please read comment for details', 3000);
                }
                $scope.DATA_VALIDATED_LIST = data.data.HEADER_CLOUMN_NAMES;
            }
        });
    };

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.CODE_ARRY = $scope.COPY_CODE_ARRY;
    });
    $scope.ngintvalidationDubvalue = function (key, value) {
        var List
        var val = value.split(':;:');
        List = { DISPLAY_TEXT: val[0], IS_VALID: false, IS_DATA_VALID: true };
        return List;
    };
    $scope.ngintvalidationvalue = function (key, value) {
        var List
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
                else if (val[0] == "UPLOAD0001") {
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
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
                    List = { DISPLAY_TEXT: value, IS_VALID: false };
                }
            }
        }
        return List;
    };
    $scope.DOWNLOAD_POP_FY = function (FLAG) {
        $scope.DOWNLOAD_FLAG = FLAG;
        switch (FLAG) {
            case 16:
                $scope.DOWNLOAD_REPORT_NAME = 'DEPARTMENT';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=1&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            case 17:
                $scope.DOWNLOAD_REPORT_NAME = 'POSITION';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=2&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            case 19:
                $scope.DOWNLOAD_REPORT_NAME = 'EMPLOYEE';
                window.location.href = '../DashBoard/hrIndex#!/PosDptEmpBulkUpload?x=3&Id=' + $scope.DOWNLOAD_FLAG;
                break;
            default:
                break;
        }
    };

    $scope.uploadFiles_FY = function (filename) {
        $scope.DUPLICATES = [];
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RELATIVE_ID", $scope.FLAG_ID);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            data.append("FOLDER_NAME", "UPLOAD_EXCEL");
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_HR_API() + "api/HrAPI/BULK_UPLOAD_FILE",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                $scope.UploadedFiles = d.data;
                var HRModelObj = new Object();
                HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
                HRModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                if ($scope.FLAG_ID == 19) { HRModelObj.UPLOAD_TYPE_ID = $scope.STEP_FLAG; } else { HRModelObj.UPLOAD_TYPE_ID = $scope.FLAG_ID; }
                HRModelObj.DATA_FLAG = 2;//-- 1 FOR FETCHING DATA ELSE 0
                HRModelObj.INCLUDE_INCOMPLETE = $scope.BulkUploadSeach.INCLUDE_INCOMPLETE ? 1 : 0;;
                HRModelObj.INCLUDE_INACTIVE = 0//INCLUDE_INACTIVE;
                HRModelObj.FLAG = 0
                HRModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                HRModelObj.ORIGINAL_FILE_NAME = $scope.Files[0].name;
                HRModelObj.USER_ID = parseInt($cookies.get("USERID"));
                HRModelObj.BULK_UPLOAD_OBJ_ARRY_LIST = $scope.OBJ_ARRAY;
                //HRModelObj.FILE_PATH = "D:\\Uploads\\" + d.data.FILE_PATH + "\\" + d.data.SERVER_FILE_NAME;
                HRModelObj.FILE_PATH = "\\" + d.data.FILE_PATH + "\\" + d.data.SERVER_FILE_NAME;
                $scope.BulkUploadSeach.FILE_NAME = $scope.Files[0].name;
                $scope.UPLOAD_EXCEL_PATH = HRModelObj.FILE_PATH;
                $scope.SERVER_FILE_NAME = d.data.SERVER_FILE_NAME;
                HRModelObj.IS_BANKCHECKER = 1;
                HRModelObj.EMAIL_REGEX = $scope.$parent.EMAIL_PATTERN.source;
                HRModelObj.DATE_OF_BIRTH_DIFF = $scope.DATE_OF_BIRTH_DIFF;
                PrcCommMethods.HR_API(HRModelObj, "HR_UPLOAD_DPT_POSI_EMP_FY_VALIDATE").then(function (data) {
                    $scope.Uploading = false;
                    $scope.submitted = true;

                    $scope.$parent.overlay_loadingNew = 'none';
                    if (data.data.error == "CODE0001") {
                        $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.error == "CODE0003") {
                        $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
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
                        $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else if (data.data.IS_VALID_EXCEL == 1) {
                        $scope.$parent.ShowAlert('Error', 'please upload the "' + $scope.DOWNLOAD_REPORT_NAME + '" file ', 3000);
                        $scope.submitted = false;
                        $scope.IS_VALID_UPLOAD_FILE = false;
                    }
                    else {
                        if ($scope.STEP_FLAG == 22) {
                            $scope.IS_VALID_UPLOAD_FILE = data.data.IS_VALID_COUNT > 0 ? false : true;
                            $scope.DUPLICATES = []
                            angular.forEach(data.data.HEADER_CLOUMN_NAMES, function (x) {
                                var Ilist = data.data.HEADER_CLOUMN_NAMES.filter(function (y) { return x["COURSE_NAME*"].toLowerCase() == y["COURSE_NAME*"].toLowerCase() && x["EMPLOYEE_NO*"].toLowerCase() == y["EMPLOYEE_NO*"].toLowerCase() && x.ROW_INDEX != y.ROW_INDEX })
                                if (Ilist.length > 0) {
                                    $scope.DUPLICATES.push(Ilist[0]);
                                }
                            })
                            console.log($scope.DUPLICATES);
                            $scope.IS_VALID_UPLOAD_FILE = data.data.IS_VALID_COUNT > 0 ? false : true;
                            AFTER_SYSTEM_VALIDATION(data)
                        }
                        else {
                            $scope.IS_VALID_UPLOAD_FILE = data.data.IS_VALID_COUNT > 0 ? false : true;
                            AFTER_SYSTEM_VALIDATION(data)
                        }
                    };
                    $scope.RESET_CHOOSE_FILE();
                });
            });
        }
    };
    function AFTER_SYSTEM_VALIDATION(data) {
        if (data.data.HEADER_CLOUMN_NAMES.length > 0) {
            $scope.DATA_VALIDATED_LIST = data.data.HEADER_CLOUMN_NAMES;
        }
        else {
            $scope.submitted = false;
            $scope.IS_VALID_UPLOAD_FILE = false;
            $scope.DATA_VALIDATED_LIST = [];
        }
    }
    function download(file) {
        var element = document.createElement('a');
        element.setAttribute('href',
            'data:text/plain;charset=utf-8, ');
        element.setAttribute('download', file);
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
    $scope.OBJ_ARRAY = [];
    $scope.TAB_CLICK = function (FLAG) {
        $scope.$parent.Files = null;
        $scope.STEP_FLAG = FLAG;
        switch (parseInt(FLAG)) {
            case 16:
                $scope.DISPLAY_REPORT_NAME = 'Department';
                $scope.DOWNLOAD_REPORT_NAME = 'DEPARTMENT_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 17:
                $scope.DISPLAY_REPORT_NAME = 'Position';
                $scope.DOWNLOAD_REPORT_NAME = 'POSITION_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 18:
                $scope.DISPLAY_REPORT_NAME = 'Complete Employee';
                $scope.DOWNLOAD_REPORT_NAME = 'Complete_Employee_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 19:
                $scope.DISPLAY_REPORT_NAME = 'Profile and Contact';
                $scope.DOWNLOAD_REPORT_NAME = 'EMPLOYEE_CONTACT_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 20:
                $scope.DISPLAY_REPORT_NAME = 'Employment';
                $scope.DOWNLOAD_REPORT_NAME = 'Employment_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 21:
                $scope.DISPLAY_REPORT_NAME = 'Compensation';
                $scope.DOWNLOAD_REPORT_NAME = 'Compensation_' + $cookies.get("ENTITY_NAME").toUpperCase();
                break;
            case 22:
                $scope.DISPLAY_REPORT_NAME = 'Qualification';
                $scope.DOWNLOAD_REPORT_NAME = 'Qualification_' + $cookies.get("ENTITY_NAME").toUpperCase()
                $scope.OBJ_ARRAY = [
                    { COLUMN_NAME: 'COURSE_NAME*', 'SORT_ORDER': 1, 'PAGE_SORT_ORDER': 1, OBJECT_COLUMN_NAME: 'COURSE_NAME', IS_MANDATORY: true, ACTIVE: true, FIELD_TYPE_ID: 1, VALUES_ENTITY: '', IS_DB_DROPDOWN: false, APP_ACTIVE: true, IS_CUSTOM_FIELD: true, FIELD_MASTER_ID: 999 },
                    { COLUMN_NAME: 'EXPIRY_DATE', 'SORT_ORDER': 2, 'PAGE_SORT_ORDER': 1, OBJECT_COLUMN_NAME: 'EXPIRY_DATE', IS_MANDATORY: false, ACTIVE: true, FIELD_TYPE_ID: 9, VALUES_ENTITY: '', IS_DB_DROPDOWN: false, APP_ACTIVE: true, IS_CUSTOM_FIELD: true, FIELD_MASTER_ID: 999 }];

                //row12[0] = COLNAME; row12[1] = 6; row12[2] = 1; row12[3] = COLNAME; row12[4] = true; row12[5] = true; row12[6] = 1; row12[7] = ""; row12[8] = true; row12[9] = true; row12[10] = true;

                break;
            case 23:
                $scope.DISPLAY_REPORT_NAME = 'Leave';
                $scope.DOWNLOAD_REPORT_NAME = 'Leave_' + $cookies.get("ENTITY_NAME").toUpperCase()

                $scope.OBJ_ARRAY =
                    [{ COLUMN_NAME: 'ABSENCE_TYPE*', OBJECT_COLUMN_NAME: 'ABSENCE_TYPE', ACTIVE: true, FIELD_TYPE_ID: 1, IS_MANDATORY: true, FIELD_MASTER_ID: 999 },
                    { COLUMN_NAME: 'ALLOCATION*', OBJECT_COLUMN_NAME: 'ALLOCATION', ACTIVE: true, FIELD_TYPE_ID: 1, IS_MANDATORY: true, FIELD_MASTER_ID: 999 },
                    { COLUMN_NAME: 'UNITS*', OBJECT_COLUMN_NAME: 'UNITS', ACTIVE: true, FIELD_TYPE_ID: 1, IS_MANDATORY: true, FIELD_MASTER_ID: 999 },
                    { COLUMN_NAME: 'START*', OBJECT_COLUMN_NAME: 'START', ACTIVE: true, FIELD_TYPE_ID: 9, IS_MANDATORY: true, FIELD_MASTER_ID: 999 },
                    { COLUMN_NAME: 'END*', OBJECT_COLUMN_NAME: 'END', ACTIVE: true, FIELD_TYPE_ID: 9, IS_MANDATORY: true, FIELD_MASTER_ID: 999 }
                    ];
                break;
            case 24:
                $scope.DISPLAY_REPORT_NAME = 'EMPLOYEE';
                $scope.DOWNLOAD_REPORT_NAME = 'EMPLOYEE_' + $cookies.get("ENTITY_NAME").toUpperCase()
                break;
            case 25:
                $scope.DISPLAY_REPORT_NAME = 'EMPLOYEE';
                $scope.DOWNLOAD_REPORT_NAME = 'EMPLOYEE_' + $cookies.get("ENTITY_NAME").toUpperCase()
                break;
            default:
                break;
        }
        $scope.RESET_EXCEL();
    };
    $scope.TAB_CLICK($scope.FLAG_ID);

    $scope.GET_DATA_FOR_TEMPLATE_DOWNLOADS_PATH = function (DATA_FLAG) {
        $scope.EXCEL_PATH = null;
        $scope.RESET_EXCEL();
        $scope.$parent.overlay_loadingNew = 'block';
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        if ($scope.FLAG_ID == 19) {
            ModelObj.UPLOAD_TYPE_ID = $scope.STEP_FLAG;
        }
        else {
            ModelObj.UPLOAD_TYPE_ID = $scope.FLAG_ID;

        }
        if (ModelObj.UPLOAD_TYPE_ID == 16) {
            ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 0;
        }
        else if (ModelObj.UPLOAD_TYPE_ID == 17) {
            ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(47) ? 1 : 0;
        }
        else {
            ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 0;
        }
        ModelObj.DATA_FLAG = DATA_FLAG;//-- 1 FOR FETCHING DATA ELSE 0
        ModelObj.INCLUDE_INCOMPLETE = $scope.BulkUploadSeach.INCLUDE_INCOMPLETE ? 1 : 0;
        ModelObj.INCLUDE_INACTIVE = 0//INCLUDE_INACTIVE;

        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        ModelObj.ORIGINAL_FILE_NAME = $scope.DOWNLOAD_REPORT_NAME;/// 
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.BULK_UPLOAD_OBJ_ARRY_LIST = $scope.OBJ_ARRAY;
        PrcCommMethods.HR_API(ModelObj, 'GET_DATA_FOR_TEMPLATE_DOWNLOADS_PATH').then(function (data) {
            $scope.$parent.overlay_loadingNew = 'none';
            if (data.data == null) {
                $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
            }
            else {
                $scope.DOWNLOAD_FLAG = ModelObj.UPLOAD_TYPE_ID
                var Ary = data.data.split(":;:");
                $scope.EXCEL_PATH = Ary[0];
                $scope.DOWNLAOD_FILE_NAME = $scope.DOWNLOAD_REPORT_NAME + '_' + Ary[1];
                $scope.ORIGINN = window.location.origin;
                //download($scope.ORIGINN + "" + $scope.EXCEL_PATH);
            }
        });
    };

    $scope.$parent.child_scope = $scope;
});
app.controller('EntLeaveAssignEmpController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location) {
    $scope.HolidayEntitlementSearch = {
        CUSTOMER_ID: null,
        COURSE_ID: "",
        COURSE_NAME: '',
        ACTIVE: -1,
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        ENTITLEMENT_REQUIRED: -1,
        EMPLOYEE: -1,
        MANAGER: -1,
        ENTITY_ID: null,
        CLICK_SEARCH: null
    };
    $scope.HOURSES = $scope.$parent.GET_ENTITY_SETTINGS(2)[0].SETTING_VALUE;
    $scope.WEEKY_WORKING_DAYS = $scope.$parent.GET_ENTITY_SETTINGS(3)[0].SETTING_VALUE;
    $scope.TeamSearch = {
        EMPLOYEE_NO: '',
        EMPLOYEE_NAME: ''
    }
    $scope.LEAVE_ASSIGNEMT = [];
    $scope.ResetTeamSearch = function () {
        if ($scope.DELETE_ASSI_EMP_LIST.length == $scope.LEAVE_ASSIGNEMT.length) {

        }
        else {
            $scope.DELETE_ASSI_EMP_LIST = [];
        }
        $scope.TeamSearch = {
            EMPLOYEE_NO: '',
            EMPLOYEE_NAME: ''
        }
    }
    $scope.RESET_HOLIDAY_ENTITLEMENT = function () {
        $scope.HolidayEntitlementSearch = {
            CUSTOMER_ID: null, ENTITY_ID: null,
            COURSE_ID: "",
            COURSE_NAME: '',
            ACTIVE: -1,
            PAGE_NO: 1,
            PAGE_SIZE: 10,
            CUSTOMER_ID: null,
            ENTITLEMENT_REQUIRED: -1,
            EMPLOYEE: -1,
            MANAGER: -1,
            CLICK_SEARCH: null
        };
        $scope.HolidayForm.submitted = false; $scope.ENTITY_LIST = [];
    }
    $scope.ResetStepEnt = function () {

        $scope.SELECT_LEAVE = "Select Entitlement Type";
        $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID = null;
        $scope.HolidayEntitlementSearch.MANAGER = false;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = false;
        $scope.HolidayEntitlementSearch.IS_EMPLOYEE = false;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID = null;
        $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = null;
        $scope.HolidayEntitlementSearch.YEAR_START_DATE = '';
        $scope.HolidayEntitlementSearch.YEAR_END_DATE = '';
        $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE = '';
        $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID = '';
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED_VALID = false;
        $scope.EXISTING_HOLIDAY_ENTITLEMENT = [];
        $scope.HolidayForm.submitted = false;
    }
    $scope.ACCRUAL_METHOD_LIST = [{
        ACCRUAL_METHOD_ID: 1,
        ACCRUAL_METHOD_NAME: 'Daily'
    }, {
        ACCRUAL_METHOD_ID: 2,
        ACCRUAL_METHOD_NAME: 'Weekly'
    }, {
        ACCRUAL_METHOD_ID: 3,
        ACCRUAL_METHOD_NAME: 'Monthly'
    }, {
        ACCRUAL_METHOD_ID: 4,
        ACCRUAL_METHOD_NAME: 'Annual Allocation'
    }];
    $scope.ENTITLEMENT_LIST = [{
        ENTITLEMENT_ID: 1,
        ENTITLEMENT_NAME: 'Days'
    }, {
        ENTITLEMENT_ID: 2,
        ENTITLEMENT_NAME: 'Hours'
    }, {
        ENTITLEMENT_ID: 3,
        ENTITLEMENT_NAME: 'Shift'
    }];

    $scope.ADMIN_GET_ABSENCE_TYPE = function () {
        HolEntitlObj = new Object();
        HolEntitlObj.ABSENCE_TYPE_ID = '';
        HolEntitlObj.ABSENCE_TYPE_NAME = '';
        HolEntitlObj.HOLIDAY_ENTITLEMENT_NAME = '';
        HolEntitlObj.ACTIVE = 1;
        HolEntitlObj.PAGE_NO = 0;
        HolEntitlObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(HolEntitlObj, 'ADMIN_GET_ABSENCE_TYPE').then(function (data) {
            $scope.ABSENCE_TYPE_ENTITLEMENT_INT_UPD = angular.copy(data.data.Table);
        });
    };
    $scope.ABSENCE_TYPE_ENTITLEMENT_INT_UPD = [];
    $scope.ADMIN_GET_ABSENCE_TYPE();
    $scope.SAVE_RUN_ENTITLMENT = function () {
        $scope.DELETE_ASSI_EMP_LIST = [];
        $scope.ResetTeamSearch();
        $scope.HolidayForm.submitted = true;
        if ($scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE == '.') {
            $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE = '';
        }
        else {
            if ($scope.HolidayForm.$valid) {
                var dateFormat = 'DD/MM/YYYY';
                var START_DATE = moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, dateFormat, true).isValid();
                var END_DATE = moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, dateFormat, true).isValid();
                if (!START_DATE || !END_DATE || moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY")._d == "Invalid Date" || moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY")._d == "Invalid Date" || isNaN($scope.HolidayEntitlementSearch.YEAR_END_DATE) == false || isNaN($scope.HolidayEntitlementSearch.YEAR_END_DATE) == false) {
                    $scope.$parent.ShowAlert("Error", "Invalid Date format", 2000);
                }
                else if (moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY") > moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY")) {
                    $scope.$parent.ShowAlert("Error", "Year end date should be less then year start date", 2000);
                }
                else if (($scope.HolidayEntitlementSearch.MANAGER == null && $scope.HolidayEntitlementSearch.IS_EMPLOYEE == null) || ($scope.HolidayEntitlementSearch.MANAGER == false) && ($scope.HolidayEntitlementSearch.IS_EMPLOYEE == false)) {
                    $scope.$parent.ShowAlert("Error", "At least one of them ('By Manager' or 'By Employee') should be selected", 2000);
                }
                else {

                    if (!$scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED) {
                        $scope.VALIDATE_HOLIDAY_ENTITLEMENT(1);
                    }
                    else if ($scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED) {
                        $scope.$parent.overlay_loadingNew = 'block';
                        $scope.VALIDATE_HOLIDAY_ENTITLEMENT();
                    }
                }
            }
        }
    }

    //$scope.APPLY_ALL = function () {
    //    $scope.HolidayForm.submitted = true;
    //    if ($scope.HolidayForm.$valid) {
    //        if (moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY") > moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY")) {
    //            $scope.$parent.ShowAlert("Error", "Year end date should be less then year start date", 2000);
    //        }
    //        else if (($scope.HolidayEntitlementSearch.MANAGER == false) && ($scope.HolidayEntitlementSearch.IS_EMPLOYEE == false)) {
    //            $scope.$parent.ShowAlert("Error", "At least one of them ('By Manager' or 'By Employee') should be selected", 2000);
    //        }
    //        else {

    //        }
    //    }
    //}
    $scope.VALIDATE_HOLIDAY_ENTITLEMENT = function (FLAG) {

        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;;
        PosiModelObj.UNIT_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID;
        var YEAR_START_DATE = moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY");
        var YEAR_START_DATE_FIN = YEAR_START_DATE.toDate();

        var YEAR_END_DATE = moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY");
        var YEAR_END_DATE = YEAR_END_DATE.toDate();
        YEAR_END_DATE.setHours(23)
        YEAR_END_DATE.setMinutes(59);
        YEAR_END_DATE.setSeconds(59);
        PosiModelObj.START_DATE = new Date(YEAR_START_DATE_FIN).toDateString();
        PosiModelObj.END_DATE = new Date(YEAR_END_DATE).toDateString();
        PosiModelObj.HOLIDAY_ENTITLEMENT_ID = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'VALIDATE_HOLIDAY_ENTITLEMENT').then(function (data) {
            if (data.data.ENTITLEMENT_DS.Table.length > 0) {
                if (data.data.PO_SUCCESS == 1 && FLAG == undefined) {
                    $scope.EMPLOYEE_LIST_FOR_LEAVE_ASSIGNEMT();
                    $('#Add_Leave').modal('show');
                }
                else if (data.data.PO_SUCCESS == -1) {
                    $scope.$parent.ShowAlert("Error", "Holiday year dates are overlapping", 3000);
                }
                else if (data.data.PO_SUCCESS == -2) {
                    $scope.$parent.ShowAlert("Error", "There is gap between last entitlement date and selected start date", 3000);
                }
                else if (FLAG == 1) {
                    $scope.INS_UPD_BULK_EMPLOYEE_LEAVE_ENT_REQUR_FALSE();
                }
                if (data.data.PO_SUCCESS == -1 || data.data.PO_SUCCESS == -2) {
                    angular.forEach(data.data.ENTITLEMENT_DS.Table, function (dubliids) {
                        $scope.EXISTING_HOLIDAY_ENTITLEMENT.filter(function (x) {
                            if (x.HOLIDAY_ENTITLEMENT_ID == dubliids.ID) {
                                x.IS_HIGH_LIGHT = true;
                            }
                        })
                    })
                }
                $scope.$parent.overlay_loadingNew = 'none';
            }
            else {
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });

    }
    $scope.EMPLOYEE_LIST_FOR_LEAVE_ASSIGNEMT = function (FLAG) {
        $scope.LEAVE_ASSIGNEMT = [];
        $scope.$parent.$parent.overlay_loadingNew = 'block';
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.NAME = '';
        PosiModelObj.HOLIDAY_ENTITLEMENT_ID = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID;
        PosiModelObj.EMPLOYEE_NO = '';
        //HolidayEntitlementSearch.YEAR_END_DATE
        var YEAR_END_DATE = moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY");
        var YEAR_END_DATE = YEAR_END_DATE.toDate();
        PosiModelObj.END_DATE = new Date(YEAR_END_DATE).toDateString();
        PosiModelObj.ENTITLEMENT_UNIT_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_LIST_FOR_LEAVE_ASSIGNEMT').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (x) {
                    $scope.NGINIT_EMP_LEAVE_ALLOCATE(x);
                });
                $scope.LEAVE_ASSIGNEMT = $scope.LEAVE_ASSIGNEMT.concat(data.data.Table);
            }
        });
    };

    $scope.NGINIT_EMP_LEAVE_ALLOCATE = function (EMP) {
        if (!EMP.LEAVE_BOOKED) {
            EMP.END_DATE = $scope.HolidayEntitlementSearch.YEAR_END_DATE;
            EMP.UNIT_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID;
            EMP.ALLOCATION_DAYS = $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE;

            EMP.IS_SELECTED = true;
            var START_DATE = moment(moment(EMP.EMPLOYEE_START_DATE), "DD/MM/YYYY");
            var days = "";
            if (START_DATE > moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY")) {
                var arrayvar = (EMP.EMPLOYEE_START_DATE).split('-');
                EMP.START_DATE = ((parseInt(arrayvar[2])) < 10 ? "0" + (parseInt(arrayvar[2])) : (parseInt(arrayvar[2]))) + "/" + ((parseInt(arrayvar[1])) < 10 ? "0" + (parseInt(arrayvar[1])) : (parseInt(arrayvar[1]))) + "/" + arrayvar[0];
                days = moment(EMP.END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment(moment(START_DATE), "DD/MM/YYYY HH:mm:ss"), 'days');
            }
            else {
                EMP.START_DATE = $scope.HolidayEntitlementSearch.YEAR_START_DATE //new Date($scope.HolidayEntitlementSearch.YEAR_START_DATE);
                days = moment(EMP.END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY HH:mm:ss"), 'days');
            }

            EMP.Entitlmentdays = moment(EMP.END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY HH:mm:ss"), 'days');
            EMP.Entitlmentdays = EMP.Entitlmentdays + 1;
            EMP.days = days + 1;
            if ($scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == 4 || $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == undefined || $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == '' || $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == null) {
                EMP.ALLOCATION_DAYS_CAL = EMP.ALLOCATION_DAYS;
            }
            else {
                var SHIFT_HRS = 0;
                if ($scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID == 1 || $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID == 3) {// day and shift

                    //Employee Weekly Working Days*((Year END date-(Employee Start Date or year start date which ever is latest))/7))*(Total Yearly Entitlement/(Total Working Days in a week*52)
                    //=(E5*((D6-C7)/7))*(E4/(E3*52.143));

                    //var Result1 = EMP.ALLOCATION_DAYS / (parseFloat($scope.WEEKY_WORKING_DAYS) * 52.143);
                    //$scope.EMP_WRK_PTTN_DTLS.WEEKLY_HOURS * 1 / $scope.EMP_WRK_PTTN_DTLS.AVG_DAILY_HOURS * 1

                    var Result = parseFloat(EMP.WEEKLY_HOURS * 1 / EMP.AVG_DAILY_HOURS * 1) * (EMP.days / 7);
                    var Result1 = EMP.ALLOCATION_DAYS / (parseFloat($scope.WEEKY_WORKING_DAYS) * (parseFloat(EMP.Entitlmentdays) / 7));

                    EMP.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                    if ((Result * Result1).toFixed(2) > EMP.ALLOCATION_DAYS) {
                        EMP.ALLOCATION_DAYS_CAL = EMP.ALLOCATION_DAYS;
                    }
                    else {
                        EMP.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                    }

                }
                else if ($scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID == 2) { //hour
                    //=(L5*((D6-C7)/7))*(L4/(L3*52.143));
                    //var EM_SHIFT_WRK_HRS = parseFloat($scope.EMP_WRK_PTTN_DTLS.NO_OF_SHIFTS_PER_WEEK) * parseFloat($scope.HOURSES);
                    var EM_SHIFT_WRK_HRS = parseFloat(EMP.WEEKLY_HOURS);
                    var ENTITY_SHIFT_WRK_HRS = parseFloat($scope.WEEKY_WORKING_DAYS) * parseFloat($scope.HOURSES);
                    var Result = EM_SHIFT_WRK_HRS * (EMP.days / 7);
                    //var Result1 = EMP.ALLOCATION_DAYS / (parseFloat(ENTITY_SHIFT_WRK_HRS) * 52.143);
                    var Result1 = EMP.ALLOCATION_DAYS / (parseFloat(ENTITY_SHIFT_WRK_HRS) * (parseFloat(EMP.Entitlmentdays) / 7));
                    EMP.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                }
                //else if ($scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID == 3) {
                //    //Employee Weekly Working Days*((Year END date-(Employee Start Date or year start date which ever is latest))/7))*(Total Yearly Entitlement/(Total Working Days in a week*52)
                //    //=(E5*((D6-C7)/7))*(E4/(E3*52.143));
                //    var Result = parseFloat(EMP.NO_OF_SHIFTS_PER_WEEK) * (EMP.days / 7);
                //    //var Result1 = EMP.ALLOCATION_DAYS / (parseFloat($scope.WEEKY_WORKING_DAYS) * 52.143);
                //    var Result1 = EMP.ALLOCATION_DAYS / (parseFloat($scope.WEEKY_WORKING_DAYS) * (parseFloat(EMP.Entitlmentdays) / 7));
                //    EMP.ALLOCATION_DAYS_CAL = (Result * Result1).toFixed(2);
                //};
            }
        }
        else {
            EMP.ALLOCATION_DAYS_CAL = EMP.ALLOCATION_DAYS;
            EMP.IS_SELECTED = true;

            var arrayvar = (EMP.START_DATE).split('-');
            var arrayvar1 = (EMP.START_DATE).split('/');

            EMP.START_DATE = ((parseInt(arrayvar[2])) < 10 ? "0" + (parseInt(arrayvar[2])) : (parseInt(arrayvar[2]))) + "/" + ((parseInt(arrayvar[1])) < 10 ? "0" + (parseInt(arrayvar[1])) : (parseInt(arrayvar[1]))) + "/" + arrayvar[0];

            var arrayvar = (EMP.END_DATE).split('-');
            EMP.END_DATE = ((parseInt(arrayvar[2])) < 10 ? "0" + (parseInt(arrayvar[2])) : (parseInt(arrayvar[2]))) + "/" + ((parseInt(arrayvar[1])) < 10 ? "0" + (parseInt(arrayvar[1])) : (parseInt(arrayvar[1]))) + "/" + arrayvar[0];

            //EMP.START_DATE = moment(EMP.START_DATE).format("DD/MM/YYYY");
            //EMP.END_DATE = moment(EMP.END_DATE).format("DD/MM/YYYY");

        }


    }
    $scope.ON_ENTITLEMENT_SELECT_CLICK = function (LL, index) {
        if ($scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID != undefined && $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID != null && $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID != '') {
            if (confirm('Are you sure,your changes will be lost.')) {
                $scope.ResetStepEnt();
                $scope.SELECT_LEAVE = LL.ABSENCE_TYPE_NAME;
                $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID = LL.ABSENCE_TYPE_ID;
                $scope.HolidayEntitlementSearch.MANAGER = LL.MANAGER;
                $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = LL.ENTITLEMENT_REQUIRED;
                $scope.HolidayEntitlementSearch.IS_EMPLOYEE = LL.EMP;
                $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID = 1;
                if (LL.ENTITLEMENT_REQUIRED) {
                    $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = 1;
                }
                else {
                    $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = null;
                }
                $scope.HolidayEntitlementSearch.IS_PAID = LL.IS_PAID;
            }

        }
        else {
            $scope.SELECT_LEAVE = LL.ABSENCE_TYPE_NAME;
            $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID = LL.ABSENCE_TYPE_ID;
            $scope.HolidayEntitlementSearch.MANAGER = LL.MANAGER;
            $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = LL.ENTITLEMENT_REQUIRED;
            $scope.HolidayEntitlementSearch.IS_EMPLOYEE = LL.EMP;
            $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID = 1;
            if (LL.ENTITLEMENT_REQUIRED) {
                $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = 1;
            }
            else {
                $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = null;
            }
            $scope.HolidayEntitlementSearch.IS_PAID = LL.IS_PAID;
        }
        $scope.GET_EXISTING_HOLIDAY_ENTITLEMENT(1);
    }
    $scope.SELECT_LEAVE = "Select Entitlement Type";

    $scope.ENTITLEMENT_REQUIRED_NGCHANGE = function () {
        if ($scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED) {
            $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = 1;
        }
        else {
            $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = null;
        }
    }

    $scope.DELETE_HEADER_LEAVE = function (LL, index) {
        $scope.ABSENCE_TYPE_ENTITLEMENT_INT_UPD.push(LL);
        angular.forEach($scope.LEAVE_ASSIGNEMT, function (val, index1) {
            angular.forEach(val.LEAVE_ALLOCATE, function (LA, index2) {
                if (LA.ABSENCE_TYPE_ID == LL.ABSENCE_TYPE_ID) {
                    val.LEAVE_ALLOCATE.splice(index2, 1);
                }
            })
        })
        $scope.ABSENCE_TYPE_ENTITLEMENT.splice(index, 1);
    }

    $scope.INS_UPD_BULK_EMPLOYEE_LEAVE_ENT_REQUR_FALSE = function () {
        $scope.ResetTeamSearch();
        if (confirm('Are your sure?')) {
            var ModelObj = new Object();
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.HOLIDAY_ENTITLEMENT_ID = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID;
            ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;
            ModelObj.ENTITLEMENT_UNIT_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID;
            ModelObj.ENTITLEMENT_UNIT_NAME = $scope.ENTITLEMENT_LIST.filter(function (x) { return x.ENTITLEMENT_ID == $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID })[0].ENTITLEMENT_NAME;
            ModelObj.DEFAULT_ENTITLEMENT_VALUE = $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE;
            var dateMomentObject = moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY");
            var dateObject = dateMomentObject.toDate();
            var YEAR_END_DATE = moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY");
            var YEAR_END_DATE = YEAR_END_DATE.toDate();
            ModelObj.YEAR_START_DATE = new Date(dateObject).toDateString();
            ModelObj.YEAR_END_DATE = new Date(YEAR_END_DATE).toDateString();
            ModelObj.MANAGER = $scope.HolidayEntitlementSearch.MANAGER ? 1 : 0;
            ModelObj.EMPLOYEE = $scope.HolidayEntitlementSearch.IS_EMPLOYEE ? 1 : 0;
            ModelObj.ENTITLEMENT_REQUIRED = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED ? 1 : 0;
            ModelObj.ACCRUAL_METHOD_ID = 4;
            ModelObj.ACCRUAL_METHOD_NAME = $scope.ACCRUAL_METHOD_LIST.filter(function (x) { return x.ACCRUAL_METHOD_ID == 4 })[0].ACCRUAL_METHOD_NAME;
            ModelObj.EMP_LEAVE = [];
            var Obj = new Object();
            Obj.TABLE_ID = null;
            Obj.ABSENCE_TYPE_ID = null;
            Obj.UNIT_ID = null;
            Obj.ALLOCATION_DAYS = null;
            Obj.DELETE_FLAG = null;
            Obj.START_DATE = null;
            Obj.END_DATE = null;
            Obj.HOLIDAY_ENTITLEMENT_ID = 0;
            Obj.MAX_ALLOWED_CARRY_OVER = 0;
            Obj.CARRY_OVER_VALIDITY_IN_MONTHS = 0;
            Obj.ACTUAL_CARRY_OVER = 0;
            Obj.CARRY_OVER = 0;
            Obj.EMP_PRS_ID = null;
            Obj.ALREADY_ACCURED = null;
            ModelObj.EMP_LEAVE.push(Obj);
            ModelObj.IS_PAID = $scope.HolidayEntitlementSearch.IS_PAID ? 1 : 0
            PrcCommMethods.HR_API(ModelObj, 'INS_UPD_BULK_EMPLOYEE_LEAVE').then(function (data) {
                if (data.data == 0) {
                    $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                }
                else if (data.data == 1 && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != undefined && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != null && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != '') {
                    $scope.$parent.ShowAlert('Success', 'Entitlement Updated Successfully', 5000);
                    $scope.ResetStepEnt();
                    $('#Add_Leave').modal('hide');

                }
                else if (data.data == 1) {
                    $scope.$parent.ShowAlert('Success', 'Entitlement Save Successfully', 5000);
                    $scope.ResetStepEnt();
                }
            });
        }
    }
    $scope.INS_UPD_BULK_EMPLOYEE_LEAVE = function () {
        $scope.ResetTeamSearch();
        var count = 0;
        $scope.AddResform.submitted = true;
        if ($scope.AddResform.$valid) {
            angular.forEach($scope.LEAVE_ASSIGNEMT, function (EMP) {
                if (EMP.DELETE_FLAG == 0) {
                    if (moment(EMP.START_DATE, "DD/MM/YYYY") > moment(EMP.END_DATE, "DD/MM/YYYY")) {
                        count = 1;
                    }
                    else if (EMP.ALLOCATION_DAYS_CAL < 0) {
                        count = 2;
                    }
                    if (EMP.ALLOCATION_DAYS_CAL == '.') {
                        EMP.ALLOCATION_DAYS_CAL = '';
                        count = 3;
                    }
                }
            });
            if (count == 1) {
                $scope.$parent.ShowAlert("Error", "Year end date should be less than year start date", 2000);
            }
            if (count == 2) {
                $scope.$parent.ShowAlert("Error", "Entitlement should be greater than zero", 2000);
            }
            if (count == 0) {
                if (confirm('Are your sure you want to proceed?')) {
                    var ModelObj = new Object();
                    ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    ModelObj.HOLIDAY_ENTITLEMENT_ID = $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID;
                    ModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
                    ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                    ModelObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;
                    ModelObj.ENTITLEMENT_UNIT_ID = $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID;
                    ModelObj.ENTITLEMENT_UNIT_NAME = $scope.ENTITLEMENT_LIST.filter(function (x) { return x.ENTITLEMENT_ID == $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID })[0].ENTITLEMENT_NAME;
                    ModelObj.DEFAULT_ENTITLEMENT_VALUE = $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE;
                    var dateMomentObject = moment($scope.HolidayEntitlementSearch.YEAR_START_DATE, "DD/MM/YYYY");
                    var dateObject = dateMomentObject.toDate();
                    var YEAR_END_DATE = moment($scope.HolidayEntitlementSearch.YEAR_END_DATE, "DD/MM/YYYY");
                    var YEAR_END_DATE = YEAR_END_DATE.toDate();
                    YEAR_END_DATE.setHours(23)
                    YEAR_END_DATE.setMinutes(59);
                    YEAR_END_DATE.setSeconds(59);
                    ModelObj.YEAR_START_DATE = new Date(dateObject).toDateString();
                    ModelObj.YEAR_END_DATE = new Date(YEAR_END_DATE).toDateString();
                    ModelObj.MANAGER = $scope.HolidayEntitlementSearch.MANAGER ? 1 : 0;
                    ModelObj.EMPLOYEE = $scope.HolidayEntitlementSearch.IS_EMPLOYEE ? 1 : 0;
                    ModelObj.ENTITLEMENT_REQUIRED = $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED ? 1 : 0;
                    ModelObj.ACCRUAL_METHOD_ID = $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID;
                    if ($scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == undefined || $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == null || $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID == '') {
                        ModelObj.ACCRUAL_METHOD_ID = 4;
                        ModelObj.ACCRUAL_METHOD_NAME = $scope.ACCRUAL_METHOD_LIST.filter(function (x) { return x.ACCRUAL_METHOD_ID == 4 })[0].ACCRUAL_METHOD_NAME;
                    }
                    else {
                        ModelObj.ACCRUAL_METHOD_NAME = $scope.ACCRUAL_METHOD_LIST.filter(function (x) { return x.ACCRUAL_METHOD_ID == $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID })[0].ACCRUAL_METHOD_NAME;;
                    }
                    ModelObj.EMP_LEAVE = [];
                    angular.forEach($scope.LEAVE_ASSIGNEMT, function (EMP) {
                        if (EMP.DELETE_FLAG == 0 && EMP.TABLE_ID == 0 || EMP.TABLE_ID != 0) {
                            var Obj = new Object();
                            Obj.TABLE_ID = EMP.TABLE_ID;
                            Obj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;;
                            Obj.UNIT_ID = EMP.UNIT_ID;
                            Obj.ALLOCATION_DAYS = EMP.ALLOCATION_DAYS_CAL;
                            Obj.DELETE_FLAG = EMP.DELETE_FLAG;
                            //  Obj.START_DATE = EMP.START_DATE;
                            // Obj.END_DATE = EMP.END_DATE;
                            var dateMomentObject = moment(EMP.START_DATE, "DD/MM/YYYY");
                            var dateObject = dateMomentObject.toDate();
                            var YEAR_END_DATE = moment(EMP.END_DATE, "DD/MM/YYYY");
                            var YEAR_END_DATE = YEAR_END_DATE.toDate();
                            Obj.START_DATE = moment(EMP.START_DATE, "DD/MM/YYYY").format('L');
                            Obj.END_DATE = moment(EMP.END_DATE, "DD/MM/YYYY").format('L');
                            //  Obj.END_DATE = new Date(YEAR_END_DATE).toDateString();
                            Obj.HOLIDAY_ENTITLEMENT_ID = 0;
                            Obj.MAX_ALLOWED_CARRY_OVER = 0;
                            Obj.CARRY_OVER_VALIDITY_IN_MONTHS = 0;
                            Obj.ACTUAL_CARRY_OVER = 0;
                            Obj.CARRY_OVER = 0;
                            Obj.EMP_PRS_ID = EMP.EMP_PRS_ID;
                            Obj.ALREADY_ACCURED = EMP.ALREADY_ACCURED;

                            ModelObj.EMP_LEAVE.push(Obj);
                        }
                    });
                    ModelObj.IS_PAID = $scope.HolidayEntitlementSearch.IS_PAID ? 1 : 0
                    PrcCommMethods.HR_API(ModelObj, 'INS_UPD_BULK_EMPLOYEE_LEAVE').then(function (data) {
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert('Error', $scope.$parent.SOMETHINGWENTWRONG, 5000);
                        }
                        else if (data.data == 1 && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != undefined && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != null && $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID != '') {
                            $scope.$parent.ShowAlert('Success', 'Entitlement Updated Successfully', 5000);
                            $scope.ResetStepEnt();
                            $('#Add_Leave').modal('hide');

                        }
                        else if (data.data == 1) {
                            $scope.$parent.ShowAlert('Success', 'Entitlement Save Successfully', 5000);
                            $scope.ResetStepEnt();
                            $('#Add_Leave').modal('hide');
                        }
                        $scope.$parent.overlay_loadingNew = 'none';
                    });
                }
            }
        }
    }
    $scope.EDIT_HOLIDAY_ENTITLEMENT = function (LL) {
        $scope.HolidayEntitlementSearch.YEAR_START_DATE = '';
        $scope.HolidayEntitlementSearch.YEAR_END_DATE = '';
        $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID = LL.ABSENCE_TYPE_ID;
        $scope.HolidayEntitlementSearch.MANAGER = LL.MANAGER;
        $scope.HolidayEntitlementSearch.DEFAULT_ENTITLEMENT_VALUE = LL.DEFAULT_ENTITLEMENT_VALUE;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED = LL.ENTITLEMENT_REQUIRED;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_REQUIRED_VALID = angular.copy(LL.ENTITLEMENT_REQUIRED);

        $scope.HolidayEntitlementSearch.YEAR_START_DATE = moment(LL.YEAR_START_DATE).format("DD/MM/YYYY");
        $scope.HolidayEntitlementSearch.YEAR_END_DATE = moment(LL.YEAR_END_DATE).format("DD/MM/YYYY");

        //var DD = new Date(LL.YEAR_START_DATE).getDate();
        //var MM = new Date(LL.YEAR_START_DATE).getDay()-1;
        //var YYYY = new Date(LL.YEAR_START_DATE).getFullYear();

        //$scope.HolidayEntitlementSearch.YEAR_START_DATE = (DD < 10 ? '0' + DD : DD) + "/" + (MM < 10 ? '0' + MM : MM) + "/" + YYYY;

        //var DD = new Date(LL.YEAR_END_DATE).getDate();
        //var MM = new Date(LL.YEAR_END_DATE).getDay()-1;
        //var YYYY = new Date(LL.YEAR_END_DATE).getFullYear();

        ////$scope.HolidayEntitlementSearch.YEAR_END_DATE = moment(LL.YEAR_END_DATE, "DD/MM/YYYY");

        //$scope.HolidayEntitlementSearch.YEAR_END_DATE = (DD < 10 ? '0' + DD : DD) + "/" + (MM < 10 ? '0' + MM : MM) + "/" + YYYY;

        $scope.HolidayEntitlementSearch.IS_EMPLOYEE = LL.EMP;
        $scope.HolidayEntitlementSearch.ENTITLEMENT_UNIT_ID = LL.ENTITLEMENT_UNIT_ID;
        $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = LL.ACCRUAL_METHOD_ID;
        $scope.HolidayEntitlementSearch.ACCRUAL_METHOD_ID = LL.ACCRUAL_METHOD_ID;
        $scope.HolidayEntitlementSearch.HOLIDAY_ENTITLEMENT_ID = LL.HOLIDAY_ENTITLEMENT_ID;
        $scope.HolidayEntitlementSearch.IS_PAID = LL.IS_PAID;

        // $(".YEAR_START_DATE").datepicker("setDate", new Date());
        //  $(".YEAR_END_DATE").datepicker("setDate", new Date());
    }
    $scope.DELETE_LINE_LEAVE = function (LL, index, AL) {
        if (LL.ABSENCE_TYPE_ENTITLEMENT_INT_UPD == undefined) {
            LL.ABSENCE_TYPE_ENTITLEMENT_INT_UPD = [];;
        }
        LL.ABSENCE_TYPE_ENTITLEMENT_INT_UPD.push(AL);
        LL.LEAVE_ALLOCATE.splice(index, 1);
    }
    $scope.ABSENCE_TYPE_ENTITLEMENT = [];
    $scope.APPLY_HEADER_DDL = function () {
        angular.forEach($scope.ABSENCE_TYPE_ENTITLEMENT_INT_UPD, function (val, index) {
            if (val.IS_SELECTED) {
                //angular.forEach($scope.LEAVE_ASSIGNEMT, function (val1, index1) {
                //    val1.LEAVE_ALLOCATE.push(angular.copy(val));
                //})
                $scope.ABSENCE_TYPE_ENTITLEMENT.push(angular.copy(val));
                $scope.ABSENCE_TYPE_ENTITLEMENT_INT_UPD.splice(index, 1);
            }
        })
    }

    $scope.APPLY_LINE_DDL = function (EML) {
        angular.forEach(EML.ABSENCE_TYPE_ENTITLEMENT_INT_UPD, function (val, index) {
            if (val.IS_SELECTED) {
                angular.forEach($scope.LEAVE_ASSIGNEMT, function (val1, index1) {
                    val1.LEAVE_ALLOCATE.push(angular.copy(val));
                })
                EML.ABSENCE_TYPE_ENTITLEMENT.push(angular.copy(val));
                EML.ABSENCE_TYPE_ENTITLEMENT_INT_UPD.splice(index, 1);
            }
        })
    }

    //$scope.NG_INIT_LEAVE = function (LL) {
    //    LL.ALLOCATION = LL.DEFAULT_ENTITLEMENT_VALUE
    //}

    $scope.GET_EXISTING_HOLIDAY_ENTITLEMENT_LAZY_LOAD = function () {
        $scope.GET_EXISTING_HOLIDAY_ENTITLEMENT();
    };
    $scope.DELETE_ASSI_EMP_LIST = [];
    $scope.DELETE_INS_UPD_EMP = function (EML) {
        //EML.ALLOCATION_DAYS_CAL = 0;
        //EML.START_DATE = $scope.HolidayEntitlementSearch.YEAR_START_DATE;
        //EML.END_DATE = $scope.HolidayEntitlementSearch.YEAR_END_DATE
        //EML.MAX_ALLOWED_CARRY_OVER = 0;
        //EML.CARRY_OVER_VALIDITY_IN_MONTHS = 0;
        //EML.ACTUAL_CARRY_OVER = 0;
        //EML.CARRY_OVER = 0;
        EML.DELETE_FLAG = 1;
        $scope.DELETE_ASSI_EMP_LIST.push(EML);
    }

    $scope.EXISTING_HOLIDAY_ENTITLEMENT = [];
    $scope.GET_EXISTING_HOLIDAY_ENTITLEMENT = function (FLAG) {
        if (FLAG == 1) {
            $scope.EXISTING_HOLIDAY_ENTITLEMENT = [];
            $scope.HolidayEntitlementSearch.PAGE_NO = 1;
        }
        var POSModelObj = new Object();
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.ABSENCE_TYPE_ID = $scope.HolidayEntitlementSearch.ABSENCE_TYPE_ID;
        POSModelObj.PAGE_NO = $scope.HolidayEntitlementSearch.PAGE_NO;
        POSModelObj.PAGE_SIZE = $scope.HolidayEntitlementSearch.PAGE_SIZE;
        POSModelObj.HOLIDAY_ENTITLEMENT_ID = 0;
        PrcCommMethods.HR_API(POSModelObj, 'GET_EXISTING_HOLIDAY_ENTITLEMENT').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EXISTING_HOLIDAY_ENTITLEMENT = $scope.EXISTING_HOLIDAY_ENTITLEMENT.concat(data.data.Table);
                if (data.data.Table.length < $scope.HolidayEntitlementSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.HolidayEntitlementSearch.PAGE_NO = parseInt($scope.HolidayEntitlementSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.EXISTING_HOLIDAY_ENTITLEMENT.length == 0) {
                }
                $scope.GetData = false;
            }
        });
    };

});
app.controller('Clock_In_OutController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, $interval) {
    if ($scope.$parent.CheckSubModuleAccess(110) == false) {
        window.location.href = "../Main/MainIndex";
    }

    //$scope.$on('$destroy', function () {
    //    alert()
    //    localStorage.page_available = undefined;
    //});
    localStorage.openpages = Date.now();
    var onLocalStorageEvent = function (e) {
        if (e.key == "openpages") {
            // Emit that you're already available.
            localStorage.page_available = Date.now();
        }
        if (e.key == "page_available") {
            //   alert("One more page already open");
        }
    };
    window.addEventListener('storage', onLocalStorageEvent, false);

    $scope.noBack = function () {
        window.history.forward();
    }
    $scope.noBack();
    $scope.$parent.DISSABLE_WINDOW_ICON = false;
    $scope.ClockInOutSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        PAGE_NO: 1,
        PAGE_NO_LOGS: 1,
        PAGE_SIZE: 10,
        PAGE_SIZE_LOGS: 10,
        BRANCH_ID: 0,
        VALUE_FOR_QR: 0,
        USER_NAME: "",
        PASSWORD: '',
        FIRST_NAME: '-',
        LAST_NAME: '-',
    }
    $scope.COMMON_CODE_CHANGE();
    var TODAY_DAY;
    $scope.$parent.CLOCK_IN_OUT_PAGE_LOAD = 1;
    $scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES = ($scope.$parent.GET_ENTITY_SETTINGS(13)[0].SETTING_VALUE);
    $scope.SETTING_VALUE_25 = $scope.$parent.GET_ENTITY_SETTINGS(25)[0].SETTING_VALUE;
    $scope.SETTING_VALUE_36 = $scope.$parent.GET_ENTITY_SETTINGS(36)[0].SETTING_VALUE;
    $scope.SETTING_VALUE_43 = $scope.$parent.GET_ENTITY_SETTINGS(43)[0].SETTING_VALUE;

    $scope.ROTA_GET_BRANCH_SECTION = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'HR_GET_EMP_BRANCH').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_AND_SECTION_LIST = $filter("unique")(data.data.Table, 'BRANCH_ID');
                if (data.data.CustomTable1.length > 0) {
                    $scope.ClockInOutSearch.BRANCH_ID = data.data.CustomTable1[0].BRANCH_ID;
                }
                else {
                    $scope.ClockInOutSearch.BRANCH_ID = data.data.Table[0].BRANCH_ID;
                }

                $scope.GET_VALUE_FOR_QR_GENERATION();
            } else {
                $scope.BRANCH_AND_SECTION_LIST = [];
            };
        });
    }
    $scope.ROTA_GET_BRANCH_SECTION()
    var promise;
    $scope.GET_VALUE_FOR_QR_GENERATION = function (Flag) {
        ModelObj = new Object();
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.BRANCH_ID = $scope.ClockInOutSearch.BRANCH_ID;
        PrcCommMethods.HR_API(ModelObj, 'GET_VALUE_FOR_QR_GENERATION').then(function (data) {
            if (data.data.Table.length > 0) {
                if (Flag == 1) {
                    if (confirm('Are you sure, refresh the QR code?')) {
                        var tag_id = document.getElementById('RenderHtml');
                        tag_id.innerHTML = '<div id="qrcode"></div>';
                        $('#qrcode').qrcode('' + data.data.Table[0].VALUE_FOR_QR);
                        $scope.ClockInOutSearch.VALUE_FOR_QR = data.data.Table[0].VALUE_FOR_QR;

                    }
                } else {
                    var tag_id = document.getElementById('RenderHtml');
                    tag_id.innerHTML = '<div id="qrcode"></div>';
                    $('#qrcode').qrcode('' + data.data.Table[0].VALUE_FOR_QR);
                    $scope.ClockInOutSearch.VALUE_FOR_QR = data.data.Table[0].VALUE_FOR_QR;
                }

                if (parseInt($scope.SETTING_VALUE_36) > 0) {
                    $interval.cancel(promise);
                    $scope.TIMER_START();
                }
            }
        });

    }
    $scope.GET_EMP_PRS_ID = function () {
        $scope.ClockInOutForm.submitted = true;
        if ($scope.ClockInOutForm.$valid) {
            $scope.PAGE_LOAD = 2;
            $scope.CLICK_BUTTON = true;
            ModelObj = new Object();
            ModelObj.USER_NAME = $scope.ClockInOutSearch.USER_NAME;
            ModelObj.PASSWORD = $scope.ClockInOutSearch.PASSWORD;
            ModelObj.SETTING_FLAG = $scope.SETTING_VALUE_25;
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID')),
                PrcCommMethods.HR_API(ModelObj, 'GET_EMP_PRS_ID').then(function (data) {
                    if (data.data.Table.length > 0) {
                        $scope.ROTA_MOB_GET_SHIFT_COUNT(data.data.Table[0].EMP_PRS_ID);
                        $scope.EMP_PRS_ID = data.data.Table[0].EMP_PRS_ID;
                        $scope.ClockInOutSearch.FIRST_NAME = data.data.Table[0].FIRST_NAME;
                        $scope.ClockInOutSearch.LAST_NAME = data.data.Table[0].LAST_NAME;
                    }
                    else {
                        $scope.ShowAlert('Error', 'Invalid Login Email / Employee # Or Password', 5000);
                        $scope.ClockInOutSearch.USER_NAME = "";
                        $scope.ClockInOutSearch.PASSWORD = "";
                        $scope.ClockInOutForm.submitted = false;
                        $scope.ClockInOutSearch.FIRST_NAME = "-";
                        $scope.ClockInOutSearch.LAST_NAME = "-";
                    }
                    $scope.GET_UTC_TIME(1);
                    $scope.CLICK_BUTTON = false;
                });
        }
    }
    $scope.RESET_EMP = function () {
        $scope.ClockInOutSearch.USER_NAME = "";
        $scope.ClockInOutSearch.PASSWORD = "";
        $scope.ClockInOutForm.submitted = false;
        $scope.ClockInOutSearch.FIRST_NAME = "-";
        $scope.ClockInOutSearch.LAST_NAME = "-";
        $scope.CLOCK_IN_SHIFT_LIST = [];
        $scope.TODAY_SHIFT_LIST = [];
        $scope.CLOCK_IN_SHIFT_DETAILS = [];
        $scope.PAGE_LOAD = 1;
        $scope.EMP_PRS_ID = "";
        $scope.GET_UTC_TIME(1);
    }
    $scope.TODAY_SHIFT_LIST = [];
    $scope.CLOCK_IN_SHIFT_LIST = [];
    $scope.CLICK_BUTTON = false;
    $scope.PAGE_LOAD = 1;

    $scope.ROTA_INS_UPD_LOGIN_LOGOUT_FY = function (EL, SHIFT) {
        if ($scope.SETTING_VALUE_43 == "1") {
            if (SHIFT.ON_BREAK_TABLE_ID > 0) {
                $scope.$parent.ShowAlert("Error", "Please mark your self to break out", 3000);
            }
            else {

                var text = "";
                if (SHIFT.CLOCK_IN_SHIFT_DETAILS == null || SHIFT.CLOCK_IN_SHIFT_DETAILS.length == 0) {
                    text = "Are you sure, you want to clock-in";
                }
                else {
                    text = "Are you sure, you want to clock-out";
                }
                if (confirm(text)) {
                    var ModelObj = new Object();
                    ModelObj.TABLE_ID = SHIFT.CLOCK_IN_SHIFT_DETAILS == null || SHIFT.CLOCK_IN_SHIFT_DETAILS.length == 0 ? 0 : SHIFT.CLOCK_IN_SHIFT_DETAILS[0].ROTA_LOGIN_LOGOUT_TABLE_ID;
                    ModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
                    ModelObj.LOGIN_DATE = null;
                    ModelObj.LOGOUT_DATE = null;
                    ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
                    ModelObj.IS_MOBILE = "1";
                    ModelObj.LOGIN_INFO = "WEB InOut";
                    PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_LOGIN_LOGOUT').then(function (data) {
                        if (data.data == 1) {
                            if (SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) {
                                $scope.$parent.ShowAlert("Success", "Successfully Login", 3000);
                            }
                            else if (SHIFT.LOGIN_LOGOUT_DETAILS.length > 0) {
                                $scope.$parent.ShowAlert("Success", "Successfully Logout", 3000);
                            }
                            $scope.ROTA_MOB_GET_SHIFT_COUNT($scope.EMP_PRS_ID);
                        }
                        if (data.data == 0) {
                            $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                        }
                    });
                }
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Clock In & Out services has been disabled on this app. Please contact admin', 3000);
        }
    }
    $scope.ROTA_INS_UPD_LOGIN_LOGOUT = function (EL, SHIFT) {

        var ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
        ModelObj.FLAG = 1;
        ModelObj.LOGIN_LOGOUT_FLAG = SHIFT.CLOCK_IN_SHIFT_DETAILS == undefined || SHIFT.CLOCK_IN_SHIFT_DETAILS == null || SHIFT.CLOCK_IN_SHIFT_DETAILS == "" ? 0 : 1;
        //ROTA_SHIFT_LOGIN_VALIDATION 
        PrcCommMethods.HR_API(ModelObj, 'CHECK_CLOCKIN').then(function (data) {
            if (data.data.Table.length > 0 && data.data.Table[0].FLAG == 1) {
                $scope.ROTA_INS_UPD_LOGIN_LOGOUT_FY(EL, SHIFT);
            };
            if (data.data.Table.length > 0 && data.data.Table[0].FLAG == 0) {
                $scope.$parent.ShowAlert("Error", data.data.Table[0].MESSAGE, 3000);
                SHIFT.FILTER_SWTICH_ON_OFF_4 = false;
            };
        });
    }
    $scope.MESSAGE_CLICK = function (SHIFT, FLAG) {
        if (FLAG == 1) {
            if (SHIFT.CLOCK_IN_SHIFT_DETAILS.length > 0 && SHIFT.CLOCK_IN_SHIFT_DETAILS[0].LOGIN_DATE != null && SHIFT.CLOCK_IN_SHIFT_DETAILS[0].LOGOUT_DATE == null) {
                $scope.$parent.ShowAlert('Error', 'Already Clock-In', 3000);
            }
            else if (SHIFT.CLOCK_IN_SHIFT_DETAILS.length > 0 && SHIFT.CLOCK_IN_SHIFT_DETAILS[0].LOGIN_DATE != null && SHIFT.CLOCK_IN_SHIFT_DETAILS[0].LOGOUT_DATE != null) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-In, as the shift has already been completed', 3000);
            } else if (SHIFT.CLCIN_CLCOUT_GONE) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-In , as the shift time has passed or not started yet ', 3000);
            } else if (!SHIFT.CLCIN_IN) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-In , in future shifts', 3000);
            };
        };
        if (FLAG == 2) {
            if (SHIFT.CLOCK_IN_SHIFT_DETAILS > 0 && SHIFT.CLOCK_IN_SHIFT_DETAILS[0].LOGOUT_DATE != null) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-Out, as the shift has already been completed', 3000);
            }
            else if (SHIFT.CLCIN_CLCOUT_GONE) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-Out , as the shift time has passed or not started yet ', 3000);
            }
            else if (!SHIFT.CLCIN_IN) {
                $scope.$parent.ShowAlert('Error', 'Can not clock-Out in future shifts', 3000);
            };;
        };
    };
    $scope.ROTA_MOB_GET_SHIFT_COUNT = function (EMP_PRS_ID) {
        ModelObj = new Object();
        ModelObj.START_DATE = new Date(TODAY_DAY).toDateString();
        ModelObj.END_DATE = new Date(TODAY_DAY).toDateString();
        ModelObj.TODAY_DATE = new Date(TODAY_DAY).toDateString();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = EMP_PRS_ID;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_MOB_GET_SHIFT_COUNT').then(function (data) {
            $scope.PAGE_LOAD = 1;
            $scope.CLOCK_IN_SHIFT_LIST = [];
            $scope.TODAY_SHIFT_LIST = [];
            $scope.CLOCK_IN_SHIFT_DETAILS = [];
            if (data.data.Table3.length > 0) {
                $scope.TODAY_SHIFT_LIST = data.data.Table3;//Current shift details 
                $scope.PAGE_LOAD = 2;
            }
            if (data.data.Table1.length > 0) {
                $scope.CLOCK_IN_SHIFT_LIST = data.data.Table1;/// Clock in Shift;
                $scope.CLOCK_IN_SHIFT_DETAILS = data.data.Table2;
                $scope.PAGE_LOAD = 2;
            }
            if (data.data.Table4.length > 0) {
                //$scope.CLOCK_IN_SHIFT_LIST = data.data.Table1;/// ;
                $scope.CLOCK_IN_SHIFT_DETAILS = data.data.Table4; //Clock in clock Out Shift;
                $scope.PAGE_LOAD = 2;
            }
            if (data.data.Table1.length == 0) {
                $scope.PAGE_LOAD = 2;
            }
            $scope.CLICK_BUTTON = false;
        });
    }
    $scope.NG_INIT_CLOCK_IN_SHIFT_DETAILS_FY = function (LINE) {
        LINE.START_TIME_TOLERANCE = angular.copy(moment(LINE.START_TIME).subtract($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES, "minutes").toDate());
        LINE.END_TIME_MOMENT = angular.copy(moment(LINE.END_TIME));
        LINE.CLOCK_IN_SHIFT_DETAILS = $scope.CLOCK_IN_SHIFT_DETAILS.filter(function (x) { return x.SHIFT_ID == LINE.SHIFT_ID });
    }
    function clockUpdate() {
        if (TODAY_DAY !== undefined) {
            var date = new moment(TODAY_DAY).add(1, 'seconds');
            let displayDate = Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: 'numeric', second: 'numeric' }).format(new Date(date)); TODAY_DAY = new Date(date);
            $scope.CURRENT_TIME_ACCORDING_TIME_ZONE = date;
            $scope.CURRENT_TIME_HOURS = moment(date).hour();
            $scope.CURRENT_TIME_MINUTE = moment(date).minute();
            $scope.CURRENT_TIME_SECOND = moment(date).second();
            var a = moment(TODAY_DAY);//now
            var b = moment($scope.COPY_TODAY_DAY);
            var minutes = a.diff(b, 'minutes')
            if (minutes > 2) {
                $scope.$parent.UPDATE_UEM();
                $scope.GET_UTC_TIME(1);
            }
            $scope.$apply();
        }
    }
    $scope.GET_UTC_TIME = function (FLAG) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {
            TODAY_DAY = new Date(data.data);
            $scope.COPY_TODAY_DAY = angular.copy(new Date(data.data));
            if (FLAG == undefined) {
                $(document).ready(function () {
                    clockUpdate();
                    setInterval(clockUpdate, 1000);
                })
            }
        });
    };
    $scope.GET_UTC_TIME();
    function RefreshQRCode() {
        $scope.GET_VALUE_FOR_QR_GENERATION()
    }

    $scope.TIMER_START = function () {
        if (parseInt($scope.SETTING_VALUE_36) > 0) {
            let millsec = parseInt($scope.SETTING_VALUE_36) * 60000;
            promise = $interval(RefreshQRCode, millsec);
        }
    }
    $scope.TIMER_START();

    $scope.VALIDATE_QR_FOR_SHIFT_LOGIN = function () {
        ModelObj = new Object();
        ModelObj.QR_VALUE = $scope.ClockInOutSearch.VALUE_FOR_QR;
        PrcCommMethods.HR_API(ModelObj, 'VALIDATE_QR_FOR_SHIFT_LOGIN').then(function (data) {
            if (data.data.Table[0].SUCCESS == 1) {
            }
            if (data.data.Table[0].SUCCESS == 0) {
            }
        });
    }

    $scope.SELECT_EMP_RESULT = function () {
        if ($scope.selectedEmployee !== null && $scope.selectedEmployee !== undefined && $scope.selectedEmployee.originalObject !== undefined) {
            if ($scope.selectedEmployee.originalObject.STEP_NO == 7) {
                $scope.ROTA_MOB_GET_SHIFT_COUNT($scope.selectedEmployee.originalObject.ID);
            }
        }
        else {
            $scope.$parent.ShowAlert('Warning', 'no result found ', 3000);
        }
    }
    $scope.SHOW_VIEW_DETAILS = function (LINE, index, viewdetailname) {
        //$('#showmenu').click(function () {
        LINE.STEP_FLAG = 1;
        $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(LINE);
        LINE.HIDE_SHOW = LINE.HIDE_SHOW == undefined || LINE.HIDE_SHOW == false ? LINE.HIDE_SHOW = true : LINE.HIDE_SHOW = false;
        $('#' + viewdetailname + '' + index).slideToggle("slow");
        //});
    }
    $scope.ROTA_GET_SHIFT_DETAILS_BY_ID = function (SHIFT) {
        $scope.SHIFT_FLAG = 1;
        ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_DETAILS_BY_ID').then(function (data) {
            SHIFT.SHIFT_TAGS_LIST = data.data.Table4;
            SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID = data.data.Table3;
            SHIFT.BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK == false });
            SHIFT.ACTUAL_BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK && !x.IS_DISCARDED });
            SHIFT.DISCARDED_BREAK_LIST = data.data.Table1.filter(function (x) { return x.IS_DISCARDED });

        });
    }
    $scope.TAB_CLICK = function (FLAG, SHIFT) {
        SHIFT.STEP_FLAG = FLAG;
    }
    $scope.HR_GET_SEARCH_RESULTS = function () {
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.SEARCH_PARAMETER = "";
        PosiModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(48) ? 1 : 2;
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(PosiModelObj, 'HR_GET_SEARCH_RESULTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST = data.data.Table;
            }
        });
    };
    $scope.LOGIN_MANAGER = function () {
        var UserModelObj = new Object();
        UserModelObj.UserName = $scope.$parent.User_Email;
        UserModelObj.Password = $scope.ClockInOutSearch.MANAGER_PASSWORD;
        var httpRequest = $http({
            method: 'POST',
            url: CommService.Get_CASHUP_API() + 'api/LoginAPI/USER_LOGIN',
            data: UserModelObj
        }).then(function (data) {
            if (data.data != null && data.data.Table.length > 0 && data.data.Table1.length > 0) {
                $scope.$parent.CLOCK_IN_OUT_PAGE_LOAD = undefined;
                $scope.$parent.DISSABLE_WINDOW_ICON = true;
                $('#Login').modal('hide');
                window.location.href = "../DashBoard/hrIndex#!/Hr_index";
            }
            else {
                $scope.ShowAlert('Error', 'Invalid  Password', 5000);
            }
        });
    }
    $scope.RESET_LOGIN_MANAGER = function () {
        $scope.ClockInOutSearch.MANAGER_PASSWORD = "";
    }
    //=====================Printing QR Code===========================
    $scope.PRINT_QRCODE = function () {
        $('#PRINT_QRCODE').modal('show');
        $scope.QRCODE_PRINT();

    };
    $scope.QRCODE_PRINT = function () {

        html2canvas($("#qrcode"), { // DIV ID HERE
            onrendered: function (canvas) {
                var imgData = canvas.toDataURL('image/png');
                var doc = new jsPDF('landscape');
                var Branch_Name = "";
                $scope.BRANCH_AND_SECTION_LIST.filter(function (x) {
                    if (x.BRANCH_ID == $scope.ClockInOutSearch.BRANCH_ID) {
                        Branch_Name = x.BRANCH_NAME;
                    }
                });
                doc.setFontSize(30);

                doc.text(75, 25, Branch_Name + " - " + (new Date().toLocaleString()));
                doc.addImage(imgData, 'PDF', 60, 40, 160, 100);
                doc.save("QR_COD - (" + Branch_Name + " - " + (new Date().toLocaleString()) + ")" + ".pdf");

            }
        });

        window.history.pushState(null, "", window.location.href);
        window.onpopstate = function () {
            window.history.pushState(null, "", window.location.href);
        };
        //alert("Successfully!, Browser back button disabled");
        // $("#message").text("Successfully!, Browser back button disabled").delay(2000).fadeOut(1000);
    }
    $scope.SELECTED_SHIFT = {
    };
    $scope.ON_SHIFT_CLICK = function (shift, FLAG) {
        $scope.SELECT_FLAG = FLAG
        $scope.SELECTED_SHIFT = shift;
        $('#Preview_Image').modal('show');
    }
    $scope.MODAL_CLOCKIN = function (shift) {
        $('#Preview_Image').modal('hide');
        $scope.SELECTED_SHIFT = {
        };
    }

    $scope.ROTA_INS_SHIFT_BREAKS = function (LINE) {
        //if (!(moment(SHIFT_CELL_BREAK_TIME).isBetween(moment(LINE.START_TIME), moment(LINE.END_TIME), undefined, '[]'))) {
        //    Count++
        //    $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
        //}
        var text = "";
        if (LINE.ON_BREAK_TABLE_ID == 0) {
            text = "Are you sure, do you want to go on break";
        }
        else {
            text = "Are you sure, you want to end your break";
        }
        IS_OK = confirm(text);
        if (IS_OK) {
            var ModelObj = new Object();
            ModelObj.TABLE_ID = LINE.ON_BREAK_TABLE_ID;
            ModelObj.SHIFT_ID = LINE.SHIFT_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.IN_OUT_FLAG = LINE.ON_BREAK_TABLE_ID == 0 ? 1 : 0;//-- 1 FOR OUR 0 FOR IN
            ModelObj.NOTES = "";
            ModelObj.DATE_TIME = null;
            ModelObj.LOGIN_INFO = "WEB InOut";
            ModelObj.BREAK_SOURCE = "WEB InOut";
            PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_SHIFT_BREAKS').then(function (data) {
                if (data.data.Table[0].TABLE_ID > 0 && LINE.ON_BREAK_TABLE_ID == 0) {
                    $scope.$parent.ShowAlert("Success", "Successfully On Breaks", 3000);
                }
                else if (data.data.Table[0].TABLE_ID > 0 && LINE.ON_BREAK_TABLE_ID > 1) {
                    $scope.$parent.ShowAlert("Success", "Successfully Back In Breaks", 3000);
                }
                if (data.data == undefined || data.data.Table == undefined) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                $scope.GET_EMP_PRS_ID();
                $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(LINE);
            });
        }
    }

    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
        window.history.go(1);
    };

});