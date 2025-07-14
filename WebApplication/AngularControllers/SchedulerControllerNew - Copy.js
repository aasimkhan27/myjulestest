app.controller('SchedulerMainController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.overlay_loading_rota = 'block';
    $scope.$parent.TabActive(8);
    $filter('lowercase')($location.absUrl()).indexOf("emp_e_week_view") != -1 ? $scope.IS_EMPLOYEE = true : $filter('lowercase')($location.absUrl()).indexOf("emp_a_week_view") != -1 ? $scope.IS_EMPLOYEE = true : $scope.IS_EMPLOYEE = false;
    $scope.SHIFT_FLAG = 1;
    $scope.DEPARTMENT_LIST = [];
    $scope.SECTIONS = [];
    $scope.BREAK_LIST_FY = [];
    $scope.BREAK_LIST = [];
    $scope.SHIFT_STATUS = [];
    $scope.PARENT_SHIFTS_LIST_ALL = [];
    $scope.UNALOOCATED_SHIFT_COUNT = 0;
    $scope.IS_COPY_SHIFT = false;
    $scope.DUPLICATE_SHIFT = false;
    $scope.ASTRIC = "*****";
    $scope.DAY_OFF = "Weekly Off";
    $scope.ABSENCE_TYPE_NAME = "On Leave";
    $scope.CommentHeader = '';
    $scope.SELECTED_BRANCH_ID = null;
    $scope.WORK_PATTERN_SHIFTS = [];
    $scope.EMTY_SHIFT_LIST = [];
    $scope.EXCEL_REPORT_DATA_LIST = [];
    $scope.OVER_LAP_SHIFT_LIST = [];
    $scope.PDF_DATA = [];
    $scope.FY_CHANGE = 1;
    $scope.SHIFT_STATUS = [{ STATUS_ID: 23, STATUS_NAME: 'Approved', CLASS: 'text-green', badge: 'badge-light-green', STATUS_BORDER: 'text-grey' },
    { STATUS_ID: 21, STATUS_NAME: 'Unpublished', CLASS: 'text-light-yellow', badge: 'badge-light-yellow', STATUS_BORDER: 'text-grey' },
    { STATUS_ID: 22, STATUS_NAME: 'Published', CLASS: 'text-light-green', badge: 'badge-light-green', STATUS_BORDER: 'text-grey' }];

    $scope.Schedulerchild = {
    };
    $scope.Section_Week_Search = {
        showHeader: false,
        SECTION_ID: null,
        SECTION_ID_ROTA: null,
        SECTION_NAME: null,
        SECTION_NAME_ROTA: null,
        BRANCH_ID: null,
        BRANCH_ID_ROTA: null,
        DEPARTMENT_ID: null,
        DEPARTMENT_ID_ROTA: null,
        USER_ID: null,
        ACTIVE: null,
        ACTIVE_ROTA: null,
        PAGE_NO: 1, PAGE_SIZE: 10,
        SECTION_NAME: null,
        COLOR: null,
        LOCATION_ID: null,
        CUSTOMER_ID: null,
        ENTITY_ID: null,
        SHIFT_CODE: null,
        SHIFT_TITLE: null,

        PAID_BREAK: null,
        UN_PAID_BREAK: null,
        DURATION: null,
        ACTIVE: null,
        AREA_WEEK_SHIFT_CODE: null,
        AREA_WEEK_SHIFT_TITLE: null,
        AREA_WEEK_PAID_BREAK: null,
        AREA_WEEK_UN_PAID_BREAK: null,

        AREA_WEEK_DURATION: '00.00',
        OFF_DAY: false,
        TEMPLATE_NAME: null,
        SELECTED_BRANCH_ID: null,
        SELECTED_SECTION_ID: null, SECTION_NAME_ROTA: null,
        AREA_SHIFT_COUNT: 1,
        searchDepartmentText: '',
    };
    $scope.VIEW_TYPE = {
        'DAY': 1, 'WEEK': 2, 'FORTNIGHT': 3, 'MONTH': 4, 'ALL': 0
    };
    $scope.ENTITY_SETTING = [];
    $scope.START_DAY_OF_WEEK = 0;
    $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
    $scope.WEEK_OFF_DAY = null;
    $scope.WEEK_OFF_START = null;
    $scope.SORTORDER = null;
    $scope.SORTORDER_ASC_DESC = null;
    $scope.WORK_PATTERN_REQUIRED = 0;
    $scope.EMPLOYEE_FOCUS = true;
    //$scope.SETTING_VALUE_999 = 1;
    if (JSON.parse($localStorage.ENTITY_SETTINGS).length > 0) {
        $scope.START_DAY_OF_WEEK = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 4)[0]["SETTING_VALUE"];
        $scope.WEEK_OFF_DAY = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 5)[0]["SETTING_VALUE"];
        $scope.SECTION_REQUIRED = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 6)[0]["SETTING_VALUE"];
        $scope.WORK_PATTERN_REQUIRED = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 10)[0]["SETTING_VALUE"];
        $scope.IMAGE_SHOW_UPLOAD = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 11)[0]["SETTING_VALUE"];
        $scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 13)[0]["SETTING_VALUE"];
        $scope.SETTING_VALUE_25 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 25)[0]["SETTING_VALUE"];
        $scope.SETTING_VALUE_26 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 26)[0]["SETTING_VALUE"];
        $scope.SETTING_VALUE_41 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 41)[0]["SETTING_VALUE"];
        $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 33)[0]["SETTING_VALUE"];
    }
    else {
        $scope.START_DAY_OF_WEEK = $scope.$parent.GET_ENTITY_SETTINGS(4)[0].SETTING_VALUE;
        $scope.WEEK_OFF_DAY = $scope.$parent.GET_ENTITY_SETTINGS(5)[0].SETTING_VALUE;
        $scope.SECTION_REQUIRED = $scope.$parent.GET_ENTITY_SETTINGS(6)[0].SETTING_VALUE;
        $scope.IMAGE_SHOW_UPLOAD = $scope.$parent.GET_ENTITY_SETTINGS(11)[0].SETTING_VALUE;
        $scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES = ($scope.$parent.GET_ENTITY_SETTINGS(13)[0].SETTING_VALUE);
        $scope.SETTING_VALUE_25 = $scope.$parent.GET_ENTITY_SETTINGS(25)[0].SETTING_VALUE;
        $scope.SETTING_VALUE_26 = $scope.$parent.GET_ENTITY_SETTINGS(26)[0].SETTING_VALUE;
        $scope.SETTING_VALUE_41 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 41)[0]["SETTING_VALUE"];
        $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT = $scope.$parent.GET_ENTITY_SETTINGS(33)[0].SETTING_VALUE;

    }
    $scope.ADMIN_INS_UPD_SHIFT_MASTER = function (Section_Shift_Form) {
        Section_Shift_Form.submitted = true;
        var count = 0;
        if (Section_Shift_Form.$valid) {
            if ($scope.Section_Week_Search.AREA_SHIFT_COUNT == 0 || $scope.Section_Week_Search.AREA_SHIFT_COUNT == '' || $scope.Section_Week_Search.AREA_SHIFT_COUNT == null || $scope.Section_Week_Search.AREA_SHIFT_COUNT == undefined) {
                count++;
            }
        }


        if (Section_Shift_Form.$valid && count == 0) {
            if (moment($scope.Section_Week_Search.AREA_WEEK_START_TIME, 'HHmmss').toString() != 'Invalid date' && moment($scope.Section_Week_Search.AREA_WEEK_END_TIME, 'HHmmss').toString() != 'Invalid date') {
                ModelObj = new Object();
                ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
                ModelObj.SHIFT_MASTER_ID = $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID == null ? '' : $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID;
                ModelObj.SHIFT_CODE = $scope.Section_Week_Search.AREA_WEEK_SHIFT_CODE = null ? '' : $scope.Section_Week_Search.AREA_WEEK_SHIFT_CODE;
                ModelObj.SHIFT_TITLE = $scope.Section_Week_Search.AREA_WEEK_SHIFT_TITLE == null ? '' : $scope.Section_Week_Search.AREA_WEEK_SHIFT_TITLE;
                ModelObj.START_TIME = moment($scope.Section_Week_Search.AREA_WEEK_START_TIME, 'HHmmss').format('HH:mm:ss');
                ModelObj.END_TIME = moment($scope.Section_Week_Search.AREA_WEEK_END_TIME, 'HHmmss').format('HH:mm:ss');;
                ModelObj.PAID_BREAK = $scope.Section_Week_Search.PAID_BREAK == null ? 0 : $scope.Section_Week_Search.AREA_WEEK_PAID_BREAK;
                ModelObj.UN_PAID_BREAK = $scope.Section_Week_Search.UN_PAID_BREAK == null ? 0 : $scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK;
                ModelObj.DURATION = $scope.Section_Week_Search.AREA_WEEK_DURATION;
                ModelObj.ACTIVE = 1;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                ModelObj.CREATION_SOURCE = 2;
                ModelObj.SHIFT_COUNT = $scope.Section_Week_Search.AREA_SHIFT_COUNT;
                PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_INS_UPD_SHIFT_MASTER').then(function (data) {
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                    $scope.closeNav6(Section_Shift_Form);
                    $scope.ADMIN_GET_SHIFT_MASTER();
                    $scope.ON_SELECT_SHIFT_CLICK();

                });
            }
            else { $scope.$parent.ShowAlert("Error", "Start Time and End Time should be in valid format.", 3000); }
        }
        else {
            if (count > 0) {
                $scope.$parent.ShowAlert("Error", "Shift Count should be 1 Or more", 3000);
            }
        }
    };
    $scope.ADMIN_GET_SHIFT_MASTER = function () {
        var CONModelObj = new Object();
        CONModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        CONModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        CONModelObj.ACTIVE = 1;
        CONModelObj.SHIFT_MASTER_NAME = '';// $scope.ShiftSearch.SHIFT_MASTER_NAME;
        CONModelObj.PAGE_NO = 0;//$scope.ShiftSearch.PAGE_NO;
        CONModelObj.PAGE_SIZE = 1000;// $scope.ShiftSearch.PAGE_SIZE;
        CONModelObj.CREATION_SOURCE = 0;// $scope.ShiftSearch.PAGE_SIZE;
        PrcCommMethods.ADMIN_API(CONModelObj, 'ADMIN_GET_SHIFT_MASTER').then(function (data) {
            if (data.data.Table.length > 0) {
                angular.forEach(data.data.Table, function (SL) {
                    SL.html = '<button type="button" data-id="' + SL.SHIFT_TAG_ID + '"  class="btn btn-w-default btn-sm text-nowrap mw-150">' + SL.SHIFT_TITLE + '</button>';
                })
                $scope.SHIFT_MASTER_LIST = data.data.Table;
            }
        });
    };
    $scope.ADMIN_GET_SHIFT_MASTER();
    $scope.nginitBreakList = function (BL) {
        //BL.DELETE_FLAG = 0;
    }
    //-----------------------------------------------Add Section Code--------------------//
    $scope.$parent.PAGE_HEADER = 'Add Section';
    $scope.LOCATION = [];
    $scope.BRANCH_LIST = [];
    $scope.TODAYS_DATE = null;
    $scope.FINAL_SECTIONS = [];
    $scope.SHIFT_HISTORY_LIST = [];
    $scope.ROTA_TEMPLATES = [];
    $scope.SHIFT_TAGS_LIST = [];
    $scope.MEAL_BREAK = [];
    $scope.SHIFT_TYPES = [];
    $scope.APPROVE_SHIFT_ARRAY = [];
    $scope.FINAL_SHIFT_TYPES = [];
    $scope.BRANCH_AND_SECTION_LIST = [];
    $scope.MEAL_BREAK = [{ ID: 1, "NAME": 'Unpaid  Break' }, { ID: 2, "NAME": 'Paid Break' }];
    $scope.BREAK_LIST_FY = {
        TABLE_ID: 0,
        BREAK_TYPE_ID: null,
        DURATION: 0,
        BREAK_START: null,
        BREAK_END: null,
        NOTES: '',
        DELETE_FLAG: 0,
        ACTUAL_BREAK: 0,

    };
    $scope.ADD_BREAK = function () {
        $scope.BREAK_LIST.push(angular.copy($scope.BREAK_LIST_FY));
    }
    $scope.ADD_EMPLOYEE_BREAK = function () {
        //$scope.BREAK_LIST_FY.BREAK_START = moment($scope.SELECTED_CELL.NewDate, "YYYY-MM-DD");
        //   $scope.BREAK_LIST_FY.BREAK_END = moment($scope.SELECTED_CELL.NewDate, "YYYY-MM-DD");
        $scope.ACTUAL_BREAK_LIST.push(angular.copy($scope.BREAK_LIST_FY));
    }
    // $scope.ADD_BREAK();
    $scope.nginitBreakList = function (BL) {
        //BL.DELETE_FLAG = 0;
    }
    //-----------------------------------------------Add Section Code--------------------//
    $scope.$parent.PAGE_HEADER = 'Add Section';
    $scope.SECTION_GET_OR_FLAG = 0;//Postback condition -->if flag=0 than post LOCATION,DEPARTMENT DATA to get data from DB      

    $scope.SHIFT_HEADER_TEXT = 'Add Shift';
    $scope.Section_Week_Search.SELECT_SHIFT = '- Shifts -';
    $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = '- Shifts -';
    $scope.BRANCH_PUBLISH_LIST = [];

    $scope.ROTA_GET_BRANCH_SECTION = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_BRANCH_SECTION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.BRANCH_AND_SECTION_LIST = data.data.Table;
                $scope.BRANCH_AND_SECTION_PUBLISH_LIST = angular.copy(data.data.Table);
                $scope.BRANCH_LIST = $filter('unique')(data.data.Table, 'BRANCH_ID');
                if ($scope.SECTION_REQUIRED == 1) {
                    //$scope.DEPARTMENTS = $filter('unique')(data.data.Table, 'DEPARTMENT_ID');
                }
                $scope.FINAL_SECTIONS = [];
                angular.forEach($scope.BRANCH_AND_SECTION_LIST, function (x) {
                    var section = new Object()
                    if ($scope.SECTION_REQUIRED == 1) {
                        section.id = x.SECTION_ID;
                        section.text = x.BRANCH_NAME + '-' + x.SECTION_NAME;
                    }
                    else {
                        if (x.SECTION_NAME != null) {
                            section.id = x.SECTION_ID;
                            section.text = x.BRANCH_NAME + '-' + x.SECTION_NAME;
                        }
                        else {
                            section.id = "-" + x.BRANCH_ID;
                            section.text = x.BRANCH_NAME;
                        }
                    }
                    section.html = '<a class="text-sm d-inline-block"><i class="fas fa-square  mr-2" style="color:#' + x.SECTION_COLOR + '" ></i><div class="d-inline">' + section.text + '</div></a>';
                    $scope.FINAL_SECTIONS.push(section);
                });
            } else {
                $scope.BRANCH_AND_SECTION_LIST = [];
            };
        });
    }
    $scope.ROTA_GET_BRANCH_SECTION();

    $scope.ROTA_GET_SECTION = function () {
        if ($scope.BRANCH_LIST.length == 0) {
            ModelObj = new Object();
            ModelObj.SECTION_NAME = null;
            ModelObj.DEPARTMENT_NAME = null;
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));;
            ModelObj.ACTIVE = 1;
            ModelObj.PAGE_NO = 1;
            ModelObj.PAGE_SIZE = 999;
            ModelObj.BRANCH_ID = 0;
            ModelObj.SECTION_FILTER_ID = 0;
            PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SECTION').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.SECTIONS = data.data.Table;
                    $scope.DEPARTMENTS = $filter('unique')(data.data.Table, 'DEPARTMENT_ID');
                    $scope.SECTIONS_LIST = data.data.Table;
                }
            });
        }
    };
    $scope.ROTA_GET_SECTION();

    $scope.RESET_COPY_PAST = function () {
        $scope.Section_Week_Search.OVERALL_COST = 0;
        $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = "00.00";
        $scope.Section_Week_Search.SHIFT_COST = 0;
        $scope.Section_Week_Search.SHIFT_LENGTH = 0;
        $scope.Section_Week_Search.SHIFT_ID = '';
        $scope.Section_Week_Search.SECTION_ID = '';
        $scope.Section_Week_Search.SECTION_NAME = '';
        $scope.Section_Week_Search.START_TIME = '';
        $scope.Section_Week_Search.END_TIME = '';
        $scope.Section_Week_Search.NOTES = '';
        $scope.Section_Week_Search.PAID_BREAK = 0;
        $scope.Section_Week_Search.UN_PAID_BREAK = 0;

    }
    $scope.COPY_SHIFT = function (EMP, shift, VIEW_NAME) {
        $scope.SHIFT_FLAG = 1;
        $scope.APPROVE_FLAG = '';
        $scope.VIEW_FLAG = false;
        $scope.COPY_SHIFT_EMP = angular.copy(null);
        /// $scope.SELECTED_SHIFT = angular.copy(null);
        $scope.IS_COPY_SHIFT = true;
        $scope.COPY_SHIFT_EMP = angular.copy(EMP);
        $scope.OVERLAP_EMP_LIST = [];
        $scope.DISCARDED_BREAK_LIST = [];
        $scope.ACTUAL_BREAK_LIST = [];
        $scope.COPY_SHIFT_SHIFT = (shift);
        $scope.RESET_COPY_PAST();
        if (shift != undefined && shift.SHIFT_ID > 0) {
            $scope.SELECTED_SHIFT = shift;
            $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(shift);
            $scope.Section_Week_Search.SECTION_NAME = shift.SECTION_NAME;
            $scope.Section_Week_Search.SHIFT_ID = 0;
            $scope.Section_Week_Search.START_TIME = moment(shift.START_TIME);
            $scope.Section_Week_Search.END_TIME = moment(shift.END_TIME);
            $scope.Section_Week_Search.NOTES = shift.NOTES;
            $scope.Section_Week_Search.PAID_BREAK = shift.PAID_BREAK;
            $scope.Section_Week_Search.UN_PAID_BREAK = shift.UNPAID_BREAK;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = shift.SHIFT_TYPE_ID;
            $scope.Section_Week_Search.SHIFT_TYPE = shift.SHIFT_TYPE;
            $scope.Section_Week_Search.SECTION_ID = shift.SECTION_ID;
            $scope.Section_Week_Search.BRANCH_ID = shift.BRANCH_ID;
            $scope.Section_Week_Search.SHIFT_MASTER_ID = shift.SHIFT_MASTER_ID;
            $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = shift.SHIFT_TITLE;
            if (parseInt($scope.SECTION_REQUIRED) == 0 && ($scope.Section_Week_Search.SECTION_ID == null || $scope.Section_Week_Search.SECTION_ID == "" || $scope.Section_Week_Search.SECTION_ID == undefined)) {
                $scope.Section_Week_Search.SECTION_ID = -1 * shift.BRANCH_ID;
                $scope.Section_Week_Search.BRANCH_ID = shift.BRANCH_ID;
                $scope.COPY_SHIFT_SHIFT.SECTION_ID = $scope.Section_Week_Search.SECTION_ID;
            }
            else {
                $scope.Section_Week_Search.SECTION_ID = shift.SECTION_ID
                $scope.Section_Week_Search.BRANCH_ID = shift.BRANCH_ID;
            }
        }
    }
    $scope.PASTE_SHIFT = function (EMP, shift, CELL, VIEW_NAME) {
        var IS_VALID = true;
        $scope.VIEW_FLAG = false;
        $scope.SHIFT_FLAG = 1;
        if (Cell.IS_DEACTIVATED) {
            $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
            $('#EmployeeSearchBox').val('');
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
            IS_VALID = false;
        }
        if (IS_VALID) {
            $scope.RESET_COPY_PAST();
            $scope.APPROVE_FLAG = '';
            $scope.SHIFT_HISTORY_LIST = [];
            $scope.DISCARDED_BREAK_LIST = [];
            $scope.ACTUAL_BREAK_LIST = [];
            $scope.ADMIN_GET_SHIFT_TYPES();
            if ($scope.COPY_SHIFT_EMP.EMPTY_OPEN_FLAG == -1) {
                //$scope.Section_Week_Search.EMPLOYEE_NAME = 'Empty Shift';
                //$scope.Section_Week_Search.EMP_PRS_ID = -1;
                $scope.Section_Week_Search.EMPTY_SHIFT = false;
            }
            else if ($scope.COPY_SHIFT_EMP.EMPTY_OPEN_FLAG == -2) {
                //$scope.Section_Week_Search.EMPLOYEE_NAME = 'Open Shift';
                //$scope.Section_Week_Search.EMP_PRS_ID = -2;
                $scope.Section_Week_Search.EMPTY_SHIFT = false;
            }
            $scope.Section_Week_Search.EMPLOYEE_NAME = EMP.EMPLOYEE_NAME != undefined ? EMP.EMPLOYEE_NAME : $scope.COPY_SHIFT_EMP.EMPLOYEE_NAME;
            $scope.Section_Week_Search.EMP_PRS_ID = EMP.EMP_PRS_ID == undefined ? $scope.COPY_SHIFT_EMP.EMP_PRS_ID : EMP.EMP_PRS_ID;
            $scope.Section_Week_Search.EMPTY_SHIFT = true;

            $scope.Section_Week_Search.SHIFT_ID = '';
            $scope.Section_Week_Search.SECTION_ID = EMP.TABLE_ID == undefined ? $scope.COPY_SHIFT_SHIFT.SECTION_ID : EMP.TABLE_ID;
            $scope.Section_Week_Search.SECTION_NAME = EMP.TABLE_ID == undefined ? $scope.COPY_SHIFT_SHIFT.SECTION_NAME : EMP.DISPLAY_TEXT;
            $scope.Section_Week_Search.BRANCH_ID = EMP.BRANCH_ID == undefined ? $scope.COPY_SHIFT_SHIFT.BRANCH_ID : EMP.BRANCH_ID;

            $scope.Section_Week_Search.SHIFT_TYPE_ID = EMP.SHIFT_TYPE_ID == undefined ? $scope.COPY_SHIFT_SHIFT.SHIFT_TYPE_ID : EMP.SHIFT_TYPE_ID;
            $scope.Section_Week_Search.SHIFT_TYPE = $scope.COPY_SHIFT_SHIFT.SHIFT_TYPE;
            $scope.Section_Week_Search.SHIFT_MASTER_ID = $scope.COPY_SHIFT_SHIFT.SHIFT_MASTER_ID;
            $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = $scope.COPY_SHIFT_SHIFT.INS_SHIFT_COUNT_WEB;
            $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = $scope.COPY_SHIFT_SHIFT.SHIFT_TITLE == null ? '-Select Shifts-' : $scope.COPY_SHIFT_SHIFT.SHIFT_TITLE;
            $scope.ADMIN_GET_SHIFT_TAGS($scope.COPY_SHIFT_SHIFT)
            $scope.Section_Week_Search.NOTES = '';
            let START_TIME = moment($scope.COPY_SHIFT_SHIFT.START_TIME).set("date", shift.Days);
            let END_TIME = moment($scope.COPY_SHIFT_SHIFT.END_TIME).set("date", shift.Days);
            $scope.Section_Week_Search.START_TIME = '';
            $scope.Section_Week_Search.END_TIME = '';
            $scope.Section_Week_Search.START_TIME = moment(START_TIME, 'YYYY-MM-DD HH:mm');
            $scope.Section_Week_Search.END_TIME = moment(END_TIME, 'YYYY-MM-DD HH:mm');
            $scope.SELECTED_SHIFT = angular.copy($scope.COPY_SHIFT_SHIFT);
            $scope.SELECTED_SHIFT.STATUS_ID = 21;
            $scope.SELECTED_SHIFT.STATUS_NAME = "";
            $scope.SELECTED_SHIFT.STATUS_BADGE = "";
            $scope.SELECTED_SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID = [];
            $scope.SELECTED_SHIFT.LOGIN_LOGOUT_DETAILS = [];
            $scope.SELECTED_CELL = angular.copy(null);
            $scope.SELECTED_CELL = angular.copy(CELL);
            $scope.SELECTED_CELL.SHIFT_TEXT = "Copy";

            //$('#js-employee-templating').val($scope.Section_Week_Search.EMP_PRS_ID).trigger('change');
            var SectionId = "";

            if (parseInt($scope.SECTION_REQUIRED) == 0 && ($scope.Section_Week_Search.SECTION_ID == null || $scope.Section_Week_Search.SECTION_ID == "" || $scope.Section_Week_Search.SECTION_ID == undefined)) {
                SectionId = "-" + $scope.Section_Week_Search.BRANCH_ID;
                //$('#js-section-templating').val().trigger('change');
            }
            else {
                SectionId = $scope.Section_Week_Search.SECTION_ID;
                //$('#js-section-templating').val().trigger('change');
            }

            if (EMP.EMP_PRS_ID == undefined) {
                $scope.Section_Week_Search.EMPLOYEES = [];
                var EMPLIST = $scope.EMPLOYEE_LIST_UNIQUE.filter(function (x) { return x.EMP_PRS_ID == $scope.Section_Week_Search.EMP_PRS_ID });
                if (EMPLIST.length > 0) {
                    $scope.DDL_EMPLOYEE_LIST_FY(EMPLIST[0], CELL, VIEW_NAME);
                    if (EMPLIST[0].IS_DEACTIVATED) {
                        $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
                        $('#EmployeeSearchBox').val('');
                        $scope.SELECTED_EMPLOYEE = [];
                        $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                        $scope.Section_Week_Search.EMPLOYEES = [];
                        IS_VALID = false;
                    }
                    else {
                        $scope.Section_Week_Search.EMPLOYEES = [];
                        $scope.SELECTED_EMPLOYEE = angular.copy(EMPLIST[0]);
                        $scope.Section_Week_Search.EMPLOYEES.push(EMPLIST[0]);
                    }
                }
                else {

                    $scope.SELECTED_EMPLOYEE = angular.copy($scope.COPY_SHIFT_SHIFT);
                    $scope.Section_Week_Search.EMPLOYEES.push($scope.COPY_SHIFT_SHIFT);
                    $scope.DDL_EMPLOYEE_LIST_FY(EMPLIST[0], CELL, VIEW_NAME);
                }
            }
            else {
                $scope.Section_Week_Search.EMPLOYEES = [];
                $scope.Section_Week_Search.EMPLOYEES.push(EMP);
                $scope.SELECTED_EMPLOYEE = angular.copy(EMP);
                $scope.DDL_EMPLOYEE_LIST_FY(EMP, CELL, VIEW_NAME);
            }
            $scope.BREAK_LIST = angular.copy($scope.COPY_SHIFT_SHIFT.BREAK_LIST);

            $('#js-shifttype-templating').val($scope.Section_Week_Search.SHIFT_TYPE_ID).trigger('change');
            $('#js-section-templating').val(SectionId + '').trigger('change');

            if ($scope.BREAK_LIST.length > 0) {
                angular.forEach($scope.BREAK_LIST, function (x) {
                    x.TABLE_ID = 0;
                });
            }

            $('#Add_Shift').modal('show');

            $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            $('#AddSectionScroll').find('.dropdown-menu').addClass('custom-scrollbar');
            $scope.NG_CHANGE_COST = 1;
        }
    }

    $scope.ADD_BREAKS_FY = function (EMP, shift, CELL, VIEW_NAME) {


    }


    $scope.ADMIN_GET_LOCATION = function () {
        ModelObj = new Object()
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));//ENT[0].ENTITY_ID;
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.LOCATION_NAME = null;
        ModelObj.LOCATION_CODE = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_LOCATION').then(function (data) {
            $scope.LOCATION = data.data.Table;
        });
    };
    $scope.BRANCH_ADD_LIST = [];
    $scope.ADMIN_GET_BRANCH = function () {
        $scope.BRANCH_ADD_LIST = [];
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = $scope.Section_Week_Search.LOCATION_ID;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_ADD_LIST = data.data.Table;
        });
    };

    $scope.ROTA_PUBLISH_SHIFTS = function (PublishShift_Form, WHERE_CLICK, DEPARTMENTS) {
        if ($scope.OVER_LAP_SHIFT_LIST.length == 0) {
            PublishShift_Form.submitted = true;
            if (PublishShift_Form.$valid) {
                ModelObj = new Object();
                ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                ModelObj.EMP_PRS_ID = parseInt($cookies.get('EMPLOYEE_ID'));
                ModelObj.USER_ID = parseInt($cookies.get('USERID'));
                ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
                ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
                var sectioni = '', Brchi = '';
                angular.forEach($scope.BRANCH_PUBLISH_LIST, function (BRN) {
                    var SECTION = $scope.SECTIONS_PUBLISH_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
                    var count = 0;
                    angular.forEach(SECTION, function (SC) {
                        if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                            if (count == 0) {
                                if (Brchi == '') {
                                    Brchi = BRN.BRANCH_ID;
                                }
                                else {
                                    Brchi = Brchi + ',' + BRN.BRANCH_ID;
                                }
                            }
                            count++;
                            if (sectioni == '') {
                                sectioni = SC.TABLE_ID;
                            }
                            else {
                                sectioni = sectioni + ',' + SC.TABLE_ID;
                            }
                        }
                    });
                });

                ModelObj.SECTION_FILTER_SHIFT_IDS = sectioni;
                ModelObj.BRANCH_FILTER_EMP_IDS = Brchi;
                ModelObj.PUBLISH_ALL_FLAG = $scope.Section_Week_Search.PUBLISH_SHIFT == 2 ? 1 : 0;//-- 1 FOR BUBLISHING ALL AND 0 FOR PUBLISHING ONLY UPDATES
                ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;

                if ($scope.$parent.CheckSubModuleAccess(42)) {
                    ModelObj.FLAG = 1;
                }
                else if ($scope.$parent.CheckSubModuleAccess(109)) {
                    ModelObj.FLAG = 3;
                }
                else {
                    ModelObj.FLAG = 2;
                }
                if ((sectioni != '' && $scope.SECTION_REQUIRED == 1) || $scope.SECTION_REQUIRED == 0) {
                    PublishShift_Form.submitted = false;
                    PrcCommMethods.HR_API(ModelObj, 'ROTA_PUBLISH_SHIFTS').then(function (data) {
                        if (data.data == 1) {
                            $('#Publish_Shifts').modal('hide');
                            $scope.$parent.ShowAlert("Success", "Rota Publish Successfully", 3000);
                            $scope.BREAK_LIST = [];
                            if (WHERE_CLICK == "EMP_VIEW") {
                                $scope.Schedulerchild.PAGE_LOAD_FY();
                            }
                            if (WHERE_CLICK == "AREA_VIEW") {
                                //$scope.Schedulerchild.AREA_ROTA_GET_SECTION();
                                //$scope.Schedulerchild.GET_EMPLOYEE_LIST_FOR_ROTA();
                                $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                                $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                            }
                        }
                    });
                }
                else {
                    $scope.$parent.ShowAlert('Error', 'Please Select Section', 3000);
                }
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Please Check Overlapping Shifts', 3000);
        }
    };
    $scope.ROTA_GET_DEPT_FOR_SECTION = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_DEPT_FOR_SECTION').then(function (data) {
            $scope.DEPARTMENT_LIST = data.data.Table;
            $scope.SECTION_GET_OR_FLAG = 1;
        });
    };
    $scope.DISCARDED_BREAK_LIST = [];
    $scope.ROTA_GET_SHIFT_DETAILS_BY_ID = function (SHIFT) {
        $scope.ACTUAL_BREAK_LIST_BREAK_TAB = [];
        $scope.SHIFT_FLAG = 1;
        ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
        ModelObj.VIEW_TYPE = $scope.VIEW_TYPE;
        ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_DETAILS_BY_ID').then(function (data) {
            var EMP_BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK == false });
            $scope.ACTUAL_BREAK_LIST = data.data.Table1.filter(function (x) { return x.ACTUAL_BREAK && !x.IS_DISCARDED });
            $scope.DISCARDED_BREAK_LIST = data.data.Table1.filter(function (x) { return x.IS_DISCARDED });

            if ($scope.ACTUAL_BREAK_LIST.length > 0) {
                $scope.ACTUAL_BREAK_LIST_BREAK_TAB = angular.copy($scope.ACTUAL_BREAK_LIST);

                $scope.ACTUAL_BREAK_LIST.filter(function (x) {
                    x.BREAK_START_COPY = null;
                    x.BREAK_END_COPY = null;
                    if (x.BREAK_START != null) {

                        x.BREAK_START = moment(x.BREAK_START, 'YYYY-MM-DD HH:mm');
                    }
                    if (x.BREAK_END != null) {

                        x.BREAK_END = moment(x.BREAK_END, 'YYYY-MM-DD HH:mm');
                    }
                    x.DELETE_FLAG = 0;
                });
            }
            $scope.BREAK_LIST_TEMP = [];
            $scope.BREAK_LIST_TEMP = angular.copy(EMP_BREAK_LIST);
            $scope.BREAK_LIST = [];
            $scope.BREAK_LIST = EMP_BREAK_LIST;
            if ($scope.BREAK_LIST.length > 0) {
                $scope.BREAK_LIST.filter(function (x) {
                    x.TABLE_ID = 0;
                    if (x.BREAK_END != null && x.BREAK_START != null) {
                        x.SET_BREAK = true;
                        x.BREAK_START = moment(x.BREAK_START, 'YYYY-MM-DD HH:mm');
                        x.BREAK_END = moment(x.BREAK_END, 'YYYY-MM-DD HH:mm');
                    }
                    x.ACTUAL_BREAK = 0;
                });
            }
            SHIFT.BREAK_LIST = $scope.BREAK_LIST;
            if (data.data.Table2.length > 0) {
                // $scope.Section_Week_Search.OVERALL_COST = data.data.Table2[0].OVERALL_COST == null ? 0 : data.data.Table2[0].OVERALL_COST;
                // $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = data.data.Table2[0].OVERALL_SHIFT_LENGTH == null ? 0 : data.data.Table2[0].OVERALL_SHIFT_LENGTH;
                // $scope.Section_Week_Search.SHIFT_COST = data.data.Table2[0].SHIFT_COST == null ? 0 : data.data.Table2[0].SHIFT_COST;
                // $scope.Section_Week_Search.SHIFT_LENGTH = data.data.Table2[0].SHIFT_LENGTH == null ? 0 : data.data.Table2[0].SHIFT_LENGTH;
            }
            SHIFT.SHIFT_TAGS_LIST = data.data.Table4;
            if (data.data.Table3.length > 0) {
                data.data.Table3.filter(function (x) {
                    if (x.LOGIN_DATE != null) {
                        x.LOGIN_DATE = $filter('date')(x.LOGIN_DATE, "MMM  d, yyyy HH:mm")
                    }
                    if (x.LOGOUT_DATE != null) {
                        x.LOGOUT_DATE = $filter('date')(x.LOGOUT_DATE, "MMM  d, yyyy HH:mm")
                    }
                    if (x.APPROVED_LOGIN_DATE != null) {
                        x.APPROVED_LOGIN_DATE = $filter('date')(x.APPROVED_LOGIN_DATE, "MMM  d, yyyy HH:mm")
                    }
                    if (x.APPROVED_LOGOUT_DATE != null) {
                        x.APPROVED_LOGOUT_DATE = $filter('date')(x.APPROVED_LOGOUT_DATE, "MMM  d, yyyy HH:mm")
                    }
                });
            }
            SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID = data.data.Table3;
            if (SHIFT.STATUS_ID == 22 && ($scope.Section_Week_Search.EMP_PRS_ID != -1 && $scope.Section_Week_Search.EMP_PRS_ID != -2) || SHIFT.STATUS_ID == 23 && ($scope.Section_Week_Search.EMP_PRS_ID != -1 && $scope.Section_Week_Search.EMP_PRS_ID != -2)) {
                $scope.SHIFT_FLAG = 4;
            }
            $scope.ADMIN_GET_SHIFT_TAGS(SHIFT);




        });
    }
    $scope.ROTA_GET_SHIFT_COST_DETAILS = function (SHIFT, FLAG) {
        if ($scope.Section_Week_Search.SHIFT_TYPE_ID == undefined || $scope.Section_Week_Search.SHIFT_TYPE_ID == null || $scope.Section_Week_Search.SHIFT_TYPE_ID == '') {
            $scope.$parent.ShowAlert('Error', "Please select shift type", 20000)
        }
        else if ($scope.Section_Week_Search.START_TIME == '' || $scope.Section_Week_Search.START_TIME == true || $scope.Section_Week_Search.START_TIME == null || $scope.Section_Week_Search.START_TIME == undefined) {
            $scope.$parent.ShowAlert('Error', "Please Enter Start time", 20000)
        }
        else if ($scope.Section_Week_Search.END_TIME == null || $scope.Section_Week_Search.END_TIME == '' || $scope.Section_Week_Search.END_TIME == true || $scope.Section_Week_Search.END_TIME == undefined) {
            $scope.$parent.ShowAlert('Error', "Please Enter finish time", 20000)
        }
        else if ($scope.Section_Week_Search.EMP_PRS_ID == 0 || $scope.Section_Week_Search.EMP_PRS_ID == null || $scope.Section_Week_Search.EMP_PRS_ID == undefined) {
            $scope.$parent.ShowAlert('Error', "Invalid Employee", 20000)
        }
        else {
            if ($scope.FY_CHANGE == 1) {
                $scope.NG_CHANGE_COST = 0;
            }
            $scope.SHIFT_FLAG = 1;
            //if (SHIFT.STATUS_ID == 22 || SHIFT.STATUS_ID == 23) {
            //    $scope.SHIFT_FLAG = 4;
            //}
            if (SHIFT.STATUS_ID == 22 && ($scope.Section_Week_Search.EMP_PRS_ID != -1 && $scope.Section_Week_Search.EMP_PRS_ID != -2) || SHIFT.STATUS_ID == 23 && ($scope.Section_Week_Search.EMP_PRS_ID != -1 && $scope.Section_Week_Search.EMP_PRS_ID != -2)) {
                $scope.SHIFT_FLAG = 4;
            }
            ModelObj = new Object();
            ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;  // SHIFT == undefined ? 0 : SHIFT.SHIFT_ID;
            ModelObj.VIEW_TYPE = $scope.VIEW_TYPE;
            ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
            ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            ModelObj.EMP_PRS_ID = $scope.Section_Week_Search.EMP_PRS_ID;//parseInt($cookies.get("EMPLOYEE_ID"));
            START_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            END_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

            let START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
            var ST = START_TIME.split(':');
            let END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
            var ET = END_TIME.split(':');

            START_DATE.setHours(parseFloat(ST[0]));
            START_DATE.setMinutes(parseFloat(ST[1]));
            START_DATE.setSeconds(0);
            END_DATE.setHours(parseFloat(ET[0]));
            END_DATE.setMinutes(parseFloat(ET[1]));
            END_DATE.setSeconds(0);
            if (moment(START_DATE) >= moment(END_DATE)) {
                END_DATE.setDate(END_DATE.getDate() + 1);
            }
            var ms = moment(END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE, "DD/MM/YYYY HH:mm:ss"));
            var diffDuration = moment.duration(ms);

            // ModelObj.START_DATE = $scope.$parent.changeTimezone(new Date(START_DATE))
            //  ModelObj.END_DATE = $scope.$parent.changeTimezone(new Date(END_DATE))
            ModelObj.PAID_BREAK = $scope.Section_Week_Search.PAID_BREAK;
            ModelObj.UNPAID_BREAK = $scope.Section_Week_Search.UN_PAID_BREAK;
            //ModelObj.SHIFT_DURATION_IN_MINS = diffDuration._data.hours * 60 + diffDuration._data.minutes - (parseFloat(ModelObj.PAID_BREAK) + parseFloat(ModelObj.UNPAID_BREAK));
            if (diffDuration._data.days == 1) {
                ModelObj.SHIFT_DURATION_IN_MINS = 24 * 60 - (parseFloat(ModelObj.UNPAID_BREAK));
            }
            else {
                ModelObj.SHIFT_DURATION_IN_MINS = diffDuration._data.hours * 60 + diffDuration._data.minutes - (parseFloat(ModelObj.UNPAID_BREAK));
            }
            if (ModelObj.SHIFT_DURATION_IN_MINS < 0) {
                ModelObj.SHIFT_DURATION_IN_MINS = 0;
            }
            ModelObj.SHIFT_TYPE_ID = $scope.Section_Week_Search.SHIFT_TYPE_ID;
            ModelObj.SHIFT_COUNT = $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT;
            ModelObj.PRIVILAGE_FLAG = $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
            PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_COST_DETAILS').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.Section_Week_Search.OVERALL_COST_HTML = data.data.Table[0].OVERALL_COST == null ? 0 : parseFloat(data.data.Table[0].OVERALL_COST).toFixed(2) >= 0 && $scope.$parent.CheckSubModuleAccess(125) ? '<span ng-bind-html="CURRENCY_SYMBOL"></span> ' + parseFloat(data.data.Table[0].OVERALL_COST).toFixed(2) : "*****";
                    $scope.Section_Week_Search.OVERALL_COST = data.data.Table[0].OVERALL_COST == null ? 0 : data.data.Table[0].OVERALL_COST;
                    $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = data.data.Table[0].OVERALL_SHIFT_LENGTH == null ? 0 : (parseFloat(data.data.Table[0].OVERALL_SHIFT_LENGTH) / 60).toFixed(2);
                    $scope.Section_Week_Search.SHIFT_COST = data.data.Table[0].SHIFT_COST == null ? 0 : data.data.Table[0].SHIFT_COST;
                    $scope.Section_Week_Search.SHIFT_COST_HTML = data.data.Table[0].SHIFT_COST == null ? 0 : parseFloat(data.data.Table[0].SHIFT_COST).toFixed(2) >= 0 && $scope.$parent.CheckSubModuleAccess(125) ? '<span ng-bind-html="CURRENCY_SYMBOL"></span> ' + parseFloat(data.data.Table[0].SHIFT_COST).toFixed(2) : "*****";
                    $scope.Section_Week_Search.SHIFT_LENGTH = data.data.Table[0].SHIFT_LENGTH == null ? 0 : (parseFloat(data.data.Table[0].SHIFT_LENGTH) / 60).toFixed(2);
                }
                else {
                    $scope.Section_Week_Search.OVERALL_COST = 0;
                    $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = 0;
                    $scope.Section_Week_Search.SHIFT_COST = 0;
                    $scope.Section_Week_Search.SHIFT_LENGTH = 0;
                    $scope.Section_Week_Search.OVERALL_COST_HTML = '';
                    $scope.Section_Week_Search.OVERALL_COST_HTML = '';
                }
            });

        }
    }
    $scope.ROTA_GET_OVERLAPING_SHIFT_IDS = function (VIEW_NAME, PublishShift_Form, DEPARTMENTS, FLAG_PUBLISH) {
        $scope.OVER_LAP_SHIFT_LIST = [];
        ModelObj = new Object();
        ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        var sectioni = '', Brchi = '';
        if (FLAG_PUBLISH == undefined) {
            $scope.BRANCH_PUBLISH_LIST = angular.copy($scope.BRANCH_LIST);
            $scope.SECTIONS_PUBLISH_LIST = angular.copy($scope.SECTIONS_LIST);
        }
        angular.forEach($scope.BRANCH_PUBLISH_LIST, function (BRN) {
            var SECTION = $scope.SECTIONS_PUBLISH_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            var count = 0;
            angular.forEach(SECTION, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if (Brchi == '') {
                            Brchi = BRN.BRANCH_ID;
                        }
                        else {
                            Brchi = Brchi + ',' + BRN.BRANCH_ID;
                        }
                    }
                    count++;
                    if (sectioni == '') {
                        sectioni = SC.TABLE_ID;
                    }
                    else {
                        sectioni = sectioni + ',' + SC.TABLE_ID;
                    }
                }
            });
        });
        ModelObj.BRANCH_FILTER_SHIFT_IDS = Brchi
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        ModelObj.SECTION_FILTER_SHIFT_IDS = sectioni;
        if ($scope.$parent.CheckSubModuleAccess(42)) {//-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = "";// $scope.Section_Week_Search.DEPARTMENT_IDS;
        ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        ModelObj.FLAG_ALL_FILTERED = 1;
        ModelObj.TABLE_ID_LIST = [{ TABLE_ID: -1 }];

        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_OVERLAPING_SHIFT_IDS').then(function (data) {
            if (data.data.Table.length > 0) {
                $('#Publish_Shifts').modal('show');
                $scope.OVER_LAP_SHIFT_LIST = data.data.Table;
                $scope.Schedulerchild.PUBLISH_OVERLAP(data.data.Table)
            } else {
                $('#Publish_Shifts').modal('show');
            }
            if (FLAG_PUBLISH == 1) {
                $scope.ROTA_PUBLISH_SHIFTS(PublishShift_Form, VIEW_NAME, DEPARTMENTS);
            }
        });
    }
    $scope.START_TIME_SHIFT_CHANGES = function () {
        $scope.ROTA_GET_SHIFT_COST_DETAILS(undefined);
    }
    $scope.PUBLISH_SHIFTS_POP = function (VIEW_NAME, PublishShift_Form, DEPARTMENTS, FLAG_PUBLISH) {
        $scope.ROTA_GET_OVERLAPING_SHIFT_IDS(VIEW_NAME, PublishShift_Form, DEPARTMENTS, FLAG_PUBLISH);
    };
    $scope.SHIFT_TAB = function (FLAG) {
        $scope.SHIFT_FLAG = FLAG;
    }

    $scope.ADD_NEW_TAB_POP = function () {
        $scope.SHIFT_HISTORY_LIST = [];
        $('#ADD_NEW_TAG').modal('show');
    }
    $scope.ADMIN_GET_SHIFT_TAGS = function (SHIFT) {
        if ($scope.SHIFT_TAGS_LIST.length == undefined || $scope.SHIFT_TAGS_LIST.length == 0) {
            ModelObj = new Object();
            ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));;
            ModelObj.TAG_NAME = '';
            ModelObj.ACTIVE = 1;
            ModelObj.PAGE_NO = 0;
            ModelObj.PAGE_SIZE = 0;
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_SHIFT_TAGS').then(function (data) {
                $scope.SHIFT_TAGS_LIST = [];
                $scope.SHIFT_TAGS_LIST = data.data.Table;
                if (SHIFT != undefined) {
                    if (SHIFT.SHIFT_TAGS_LIST.length > 0) {
                        angular.forEach($scope.SHIFT_TAGS_LIST, function (xTags) {
                            SHIFT.SHIFT_TAGS_LIST.filter(function (x) {
                                if (x.SHIFT_TAG_ID == xTags.SHIFT_TAG_ID) {
                                    xTags.SELECTED = true;
                                }
                            });
                        });
                    }
                }
            });
        }
        else {
            $scope.SHIFT_TAGS_LIST.filter(function (x) { x.SELECTED = false; });
            if (SHIFT != undefined) {
                if (SHIFT.SHIFT_TAGS_LIST.length > 0) {
                    angular.forEach($scope.SHIFT_TAGS_LIST, function (xTags) {
                        SHIFT.SHIFT_TAGS_LIST.filter(function (x) {
                            if (x.SHIFT_TAG_ID == xTags.SHIFT_TAG_ID) {
                                xTags.SELECTED = true;
                            }
                        })
                    })
                }
            }
        }
    }
    $scope.ADMIN_INS_UPD_SHIFT_TAGS = function () {
        if ($scope.Section_Week_Search.TAG_NAME == '' || $scope.Section_Week_Search.TAG_NAME == null || $scope.Section_Week_Search.TAG_NAME == '') {
            $scope.$parent.ShowAlert("Error", 'Please enter tag name', 3000);
        }
        else {
            ModelObj = new Object();
            ModelObj.SHIFT_TAG_ID = $scope.Section_Week_Search.SHIFT_TAG_ID;
            ModelObj.TAG_NAME = $scope.Section_Week_Search.TAG_NAME;
            ModelObj.TAG_DESCRIPTION = $scope.Section_Week_Search.TAG_DESCRIPTION;
            ModelObj.USER_ID = parseInt($cookies.get('USERID'));
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            ModelObj.ACTIVE = 1;

            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_INS_UPD_SHIFT_TAGS').then(function (data) {
                if (data.data == 1) {
                    $('#ADD_NEW_TAG').modal('hide');
                    $scope.SHIFT_TAGS_LIST = [];
                    $scope.ADMIN_GET_SHIFT_TAGS();
                    $scope.$parent.ShowAlert("Success", "Tag Added Successfully", 3000);
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }

    }

    $scope.addOnClick = function (e) {

    }

    $scope.APPLY_SHIFT_TYPE_POP = function (Shift, EL, $index, $event) {
        $('#SHIFTOPEN').modal('show');
        $scope.Section_Week_Search.SHIFT_SEARCH = '';
        $scope.ADMIN_GET_SHIFT_TYPES();
        $scope.SELECTED_SHIFT = Shift;
    }
    $scope.APPLY_SHIFT_TYPE = function (SHIFT_LIST, VIEW_NAME) {
        SHIFT_ARRAY = [];
        var obj = new Object();
        obj.TABLE_ID = $scope.SELECTED_SHIFT.SHIFT_ID;
        SHIFT_ARRAY.push(obj);
        ModelObj = new Object();
        ModelObj.SHIFT_IDS = SHIFT_ARRAY;
        ModelObj.SHIFT_TYPE_ID = SHIFT_LIST.SHIFT_TYPE_ID;
        ModelObj.COMMENTS = $scope.Section_Week_Search.SHIFT_EDIT_COMMENTS;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.SECTION_ID = null;
        ModelObj.END_TIME_MULTI = null;
        ModelObj.START_TIME_MULTI = null
        ModelObj.TODAY_DATE = (new Date($scope.TODAY_DATE)).toDateString();
        ModelObj.FLAG = 1;
        ModelObj.SHIFT_MASTER_ID = null;
        ModelObj.SHIFT_COUNT_NULLABLE = null;
        Form_Edit_Multiple_Shifts.submitted = false;

        // ModelObj.SHIFT_COUNT =1// $scope.Section_Week_Search.APPLY_SHIFT_COUNT;
        /*@PI_FLAG 1 FOR UPDATE MULTIPLE SHIFTS 2 FOR DELETE MULTIPLE SHIFTS 3 FOR SET TO OPEN */
        PrcCommMethods.HR_API(ModelObj, 'ROTA_UPD_MULTIPLE_SHIFTS').then(function (data) {
            $('#SHIFTOPEN').modal('hide');
            $('#Multiple_Shifts').modal('hide');
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Shift Update Successfully", 3000);
                $scope.SELECTED_SHIFT.SHIFT_TYPE_ID = SHIFT_LIST.SHIFT_TYPE_ID;
                $scope.SELECTED_SHIFT.SHIFT_TYPE = SHIFT_LIST.SHIFT_TYPE;
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }

        });
    }

    $scope.COPY_WEEK_ARRAY = [];

    $scope.ROTA_INS_UPD_SECTION = function (SectionForm, WHERE_CLICK) {
        SectionForm.submitted = true;
        if (SectionForm.$valid) {
            ModelObj = new Object();
            //ModelObj.SECTION_ID = $scope.Section_Week_Search.SECTION_ID == null ? '' : $scope.Section_Week_Search.SECTION_ID;
            ModelObj.SECTION_ID = $scope.Section_Week_Search.SECTION_ID_ROTA == null ? 0 : $scope.Section_Week_Search.SECTION_ID_ROTA;

            //ModelObj.SECTION_NAME = $scope.Section_Week_Search.SECTION_NAME == null ? '' : $scope.Section_Week_Search.SECTION_NAME;
            ModelObj.SECTION_NAME = $scope.Section_Week_Search.SECTION_NAME_ROTA == null ? '' : $scope.Section_Week_Search.SECTION_NAME_ROTA;
            ModelObj.BRANCH_ID = $scope.Section_Week_Search.BRANCH_ID_ROTA == null ? '' : $scope.Section_Week_Search.BRANCH_ID_ROTA;
            ModelObj.DEPARTMENT_ID = $scope.Section_Week_Search.DEPARTMENT_ID_ROTA == null ? '' : $scope.Section_Week_Search.DEPARTMENT_ID_ROTA;
            ModelObj.USER_ID = parseInt($cookies.get('USERID'));
            ModelObj.ACTIVE = $scope.Section_Week_Search.ACTIVE_ROTA == true ? 1 : 0;
            ModelObj.SECTION_COLOR = document.getElementById('SECTION_COLOR').value;
            PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_SECTION').then(function (data) {
                if ($scope.Section_Week_Search.SECTION_ID_ROTA == null || $scope.Section_Week_Search.SECTION_ID_ROTA == undefined || $scope.Section_Week_Search.SECTION_ID_ROTA == '') {
                    $scope.$parent.ShowAlert('Success', 'Added Successfully', 3000);
                }
                else {
                    $scope.$parent.ShowAlert('Success', 'Updated Successfully', 3000);
                }
                $scope.closeNav5(SectionForm);
                $scope.DEPARTMENTS = [];
                $scope.BRANCH_LIST = [];
                $scope.SECTIONS_LIST = [];
                $scope.Section_Week_Search.SECTION_ID_ROTA = null;
                $scope.Section_Week_Search.SECTION_NAME_ROTA = null;
                $scope.Section_Week_Search.BRANCH_ID_ROTA = null;
                $scope.Section_Week_Search.DEPARTMENT_ID_ROTA = null;
                $scope.Section_Week_Search.ACTIVE_ROTA = false;
                $scope.ROTA_GET_BRANCH_SECTION();
                $scope.ROTA_GET_SECTION();
                $scope.Schedulerchild.ROTA_GET_SECTION_FY();
                //$scope.Schedulerchild.AREA_ROTA_GET_SECTION();
                $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                SectionForm.submitted = false;
            });
        }
        $scope.Section_Week_Search.SECTION_ID == null;
    };
    $scope.ROTA_CHK_EXISTING_SHIFTS_BEFORE_COPY_OLD = function (CopyWeek_Form, VIEW_NAME, VIEW_TYPE) {
        $scope.SHIFT_EXISTS = 0;
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_IDS;

        ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();//INT, --0 FOR ALL AND ID FOR 1 BRANCH
        ModelObj.VIEW_TYPE = VIEW_TYPE;//-- 1 DAY, 2 WEEK , 3 FORTNIGHT, 4 MONTH
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get('EMPLOYEE_ID'));
        ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
        var COPY_MULTI = [];
        var count = 0;
        angular.forEach($scope.COPY_WEEK_ARRAY, function (val) {
            if (val.IS_SELECTED) {
                var MultiShiftCopy = new Object();
                MultiShiftCopy.START_DATE = (new Date(val.START_DATE)).toDateString();
                MultiShiftCopy.END_DATE = (new Date(val.END_DATE)).toDateString();
                COPY_MULTI.push(MultiShiftCopy);
                count++;
            }
        });
        ModelObj.MULTI_DATE_TYPE_LIST = COPY_MULTI;
        ModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_IDS;
        if (count > 0) {
            PrcCommMethods.HR_API(ModelObj, 'ROTA_CHK_EXISTING_SHIFTS_BEFORE_COPY').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.SHIFT_EXISTS = data.data.Table[0].SHIFT_EXISTS;
                    if (data.data.Table[0].SHIFT_EXISTS == 1) {
                        CopyWeek_Form.submitted = true;
                        if (CopyWeek_Form.$valid) {
                            if (confirm('There are already shifts in selected time period,On Copying, all existing shifts will be deleted,Are you Sure?')) {
                                $scope.ROTA_COPY_SHIFTS(CopyWeek_Form, VIEW_NAME, VIEW_TYPE);
                            }
                        }
                    }
                    if (data.data.Table[0].SHIFT_EXISTS == 0) {
                        if (confirm('Are you Sure?')) {
                            $scope.ROTA_COPY_SHIFTS(CopyWeek_Form, VIEW_NAME, VIEW_TYPE, data.data.Table[0].SHIFT_EXISTS);
                        }
                    }
                }
            });
        }
        else {
            $scope.$parent.ShowAlert("Error", "Please select atleast One", 3000);
        }
    }

    $scope.ROTA_CHK_EXISTING_SHIFTS_BEFORE_COPY = function (CopyWeek_Form, VIEW_NAME, VIEW_TYPE, FLAG) {
        //   $scope.ROTA_COPY_SHIFTS(CopyWeek_Form, VIEW_NAME, VIEW_TYPE);
        $scope.overlay_loading_rota = 'display';
        $scope.OVER_LAP_SHIFT_LIST = [];
        ModelObj = new Object();
        ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        var sectioni = '', Brchi = ''; deprt = ""; Copysectioni = '', CopyBrchi = ''; Copydeprt = "";
        ModelObj.BRANCH_FILTER_SHIFT_IDS = "";
        ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = "";
        ModelObj.SECTION_FILTER_SHIFT_IDS = "";
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 1) { // in case of filtered branch and section not used but department filter is use
            ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS;
            ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID;
            ModelObj.SECTION_FILTER_SHIFT_IDS = ""//sectioni;
        }
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 2) {
            angular.forEach($scope.COPY_WEEK_BRANCH_LIST, function (BRN) {
                var count = 0;
                var SECLIST = $scope.COPY_WEEK_SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
                angular.forEach(SECLIST, function (SC) {
                    if (BRN.IS_CHECK_COPY_WEEK_BRANCH && SC.TABLE_ID != null) {
                        if (count == 0) {
                            if (CopyBrchi == '') {
                                CopyBrchi = BRN.BRANCH_ID;
                            }
                            else {
                                CopyBrchi = CopyBrchi + ',' + BRN.BRANCH_ID;
                            }
                        }
                        count++;
                        if (Copysectioni == '') {
                            Copysectioni = SC.TABLE_ID;
                        }
                        else {
                            Copysectioni = Copysectioni + ',' + SC.TABLE_ID;
                        }
                    }
                })
            });
            angular.forEach($scope.COPY_WEEK_DEPARTMENT_LIST, function (xdept) {
                if (xdept.IS_COPY_WEEK_CHECK_DEPT) {
                    if (Copydeprt == "") {
                        Copydeprt = xdept.DEPARTMENT_ID;
                    }
                    else {
                        Copydeprt = Copydeprt + ',' + xdept.DEPARTMENT_ID;
                    }
                }
            });
            ModelObj.BRANCH_FILTER_SHIFT_IDS = CopyBrchi;
            ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = Copydeprt;
            ModelObj.SECTION_FILTER_SHIFT_IDS = "";
        }


        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));

        if ($scope.$parent.CheckSubModuleAccess(42)) {//-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));

        ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;

        ModelObj.FLAG_ALL_FILTERED = $scope.Section_Week_Search.COPY_WEEK_VALUE == 1 ? 0 : 1;////-- 1 ALL 0 FILTERED
        ModelObj.TABLE_ID_LIST = [{ TABLE_ID: -1 }];
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 1) {
            ModelObj.TABLE_ID_LIST = [];
            if (VIEW_NAME == "AREA_VIEW") {
                angular.forEach($scope.SHIFTS_LIST_ALL, function (x) {
                    var objsoft = new Object();
                    objsoft.TABLE_ID = x.SHIFT_ID;
                    ModelObj.TABLE_ID_LIST.push(objsoft);
                });
            }
            if (VIEW_NAME == "EMP_VIEW") {
                angular.forEach($scope.EMPLOYEE_LIST, function (List) {
                    List.dayOfWeekNamesShort.filter(function (EM_shift) {
                        if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                            angular.forEach(EM_shift.TOTAL_SHIFT, function (x) {
                                var objsoft = new Object();
                                objsoft.TABLE_ID = x.SHIFT_ID;
                                ModelObj.TABLE_ID_LIST.push(objsoft);
                            });
                        };
                    })
                });
            };
        };

        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_OVERLAPING_SHIFT_IDS').then(function (data) {
            if (data.data.Table.length > 0) {
                //$('#Publish_Shifts').modal('show');
                $scope.OVER_LAP_SHIFT_LIST = data.data.Table;
                $scope.Schedulerchild.PUBLISH_OVERLAP(data.data.Table)
            } else {
                //$('#Publish_Shifts').modal('show');
                $scope.ROTA_COPY_SHIFTS(CopyWeek_Form, VIEW_NAME, VIEW_TYPE, ModelObj);
            }
            $scope.overlay_loading_rota = 'none';
        });

        //$scope.SHIFT_EXISTS = 0;
        //var sectioni = '', Brchi = ''; deprt = "";
        //var ModelObj = new Object();
        //ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        //ModelObj.BRANCH_FILTER_SHIFT_IDS = "";
        //ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        //ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();//INT, --0 FOR ALL AND ID FOR 1 BRANCH
        //ModelObj.BRANCH_FILTER_SHIFT_IDS = "";
        //ModelObj.VIEW_TYPE = VIEW_TYPE;//-- 1 DAY, 2 WEEK , 3 FORTNIGHT, 4 MONTH
        //ModelObj.USER_ID = parseInt($cookies.get("USERID"));

        //if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 2) {
        //   


        //var COPY_MULTI = [];
        //var count = 0;
        //angular.forEach($scope.COPY_WEEK_ARRAY, function (val) {
        //    if (val.IS_SELECTED) {
        //        var MultiShiftCopy = new Object();
        //        MultiShiftCopy.START_DATE = (new Date(val.START_DATE)).toDateString();
        //        MultiShiftCopy.END_DATE = (new Date(val.END_DATE)).toDateString();
        //        COPY_MULTI.push(MultiShiftCopy);
        //        count++;
        //    }
        //});
        //ModelObj.MULTI_DATE_TYPE_LIST = COPY_MULTI;
        //if (count > 0) {
        //    PrcCommMethods.HR_API(ModelObj, 'ROTA_CHK_EXISTING_SHIFTS_BEFORE_COPY').then(function (data) {
        //        if (data.data.Table.length > 0) {
        //            $scope.SHIFT_EXISTS = data.data.Table[0].SHIFT_EXISTS;
        //            if (data.data.Table[0].SHIFT_EXISTS == 1) {
        //                CopyWeek_Form.submitted = true;
        //                if (CopyWeek_Form.$valid) {
        //                    if (confirm('There are already shifts in selected time period,On Copying, all existing shifts will be deleted,Are you Sure?')) {
        //                        $scope.ROTA_COPY_SHIFTS(CopyWeek_Form, VIEW_NAME, VIEW_TYPE, "", sectioni, BRAN_DEPRT);
        //                    }
        //                }
        //            }
        //            if (data.data.Table[0].SHIFT_EXISTS == 0) {
        //                if (confirm('Are you Sure?')) {
        //                
        //                }
        //            }
        //        }
        //    });
        //}
        //else {
        //    $scope.$parent.ShowAlert("Error", "Please select atleast One", 3000);
        //}
    }

    $scope.ON_BRANCH_COPY_WEEK_ALL_CLICK = function () {
        // $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.CopyBRANCHALL = $scope.Section_Week_Search.CopyBRANCHALL ? false : true
        angular.forEach($scope.COPY_WEEK_BRANCH_LIST, function (item) {
            item.IS_CHECK_COPY_WEEK_BRANCH = $scope.Section_Week_Search.CopyBRANCHALL;
        });
    }
    $scope.ON_BRANCH_COPY_WEEK_LINE_CLICK = function (LINE) {
        // $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_COPY_WEEK_BRANCH = LINE.IS_CHECK_COPY_WEEK_BRANCH ? LINE.IS_CHECK_BRANCH = false : LINE.IS_CHECK_COPY_WEEK_BRANCH = true;
        $scope.Section_Week_Search.CopyBRANCHALL = true;
        angular.forEach($scope.COPY_WEEK_BRANCH_LIST, function (item) {
            if (!item.IS_CHECK_COPY_WEEK_BRANCH) {
                $scope.Section_Week_Search.CopyBRANCHALL = false;
            }
        });

    }

    $scope.ON_DEPT_COPY_WEEK_ALL_CLICK = function () {
        // $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DepartmentSearchAll = $scope.Section_Week_Search.DepartmentSearchAll ? false : true
        angular.forEach($scope.COPY_WEEK_DEPARTMENT_LIST, function (item) {
            item.IS_COPY_WEEK_CHECK_DEPT = $scope.Section_Week_Search.DepartmentSearchAll;
        });
    }
    $scope.ON_DEPT_COPY_WEEK_LINE_CLICK = function (LINE) {
        // $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_COPY_WEEK_CHECK_DEPT = LINE.IS_COPY_WEEK_CHECK_DEPT ? LINE.IS_CHECK_BRANCH = false : LINE.IS_COPY_WEEK_CHECK_DEPT = true;
        $scope.Section_Week_Search.DepartmentSearchAll = true;
        angular.forEach($scope.COPY_WEEK_DEPARTMENT_LIST, function (item) {
            if (!item.IS_COPY_WEEK_CHECK_DEPT) {
                $scope.Section_Week_Search.DepartmentSearchAll = false;
            }
        });
    }
    $scope.COPY_COUNT_LOAD = 0;
    $scope.COPY_WEEK_POP = function (VIEW_TYPE) {
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            $scope.SHIFT_EXISTS = 0;
            $scope.COPY_WEEK_STEP_FLAG = 2;
            $scope.Section_Week_Search.COPY_WEEK_VALUE = 1;
            $('#Copy_Weeks').modal('show');
            var date = new Date($scope.SHIFT_CELDER_END_DATE);
            var Array = [];
            for (var i = 0; i < 7; i++) {
                if (Array.length > 0) {
                    var date = new Date(Array[Array.length - 1].END_DATE);
                }
                start_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
                end_date_copy = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
                var NextWeekObj = new Object();
                NextWeekObj.START_DATE = angular.copy(start_date_copy);
                NextWeekObj.END_DATE = angular.copy(end_date_copy);
                Array.push(NextWeekObj);
            }
            $scope.COPY_WEEK_ARRAY = Array;
            if ($scope.COPY_COUNT_LOAD == 0) {
                $scope.COPY_WEEK_BRANCH_LIST = [];
                $scope.COPY_WEEK_DEPARTMENT_SHIFT_ROTA_LIST = [];

                $scope.COPY_WEEK_BRANCH_LIST = angular.copy($scope.BRANCH_LIST);
                $scope.COPY_WEEK_DEPARTMENT_LIST = angular.copy($scope.DEPARTMENT_SHIFT_ROTA_LIST);
                $scope.COPY_WEEK_SECTIONS_LIST = angular.copy($scope.SECTIONS_LIST);

                $scope.COPY_WEEK_DEPARTMENT_LIST.filter(function (x) { x.IS_COPY_WEEK_CHECK_DEPT = true });
                $scope.COPY_WEEK_BRANCH_LIST.filter(function (x) { x.IS_CHECK_COPY_WEEK_BRANCH = true });
                $scope.Section_Week_Search.CopyBRANCHALL = true;
                $scope.Section_Week_Search.DepartmentSearchAll = true;
                $scope.COPY_COUNT_LOAD++;
            }
            angular.forEach($scope.BRANCH_LIST, function (BRN) {
                var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
                for (var i = 0; i < SECLIST.length; i++) {
                    BRN.IS_CHECK_FILTER_BRH_SHIFT = false;
                    if (SECLIST[i].IS_CHECK_SECTION_SHIFT && SECLIST[i].TABLE_ID != null) {
                        BRN.IS_CHECK_FILTER_BRH_SHIFT = true;
                        break;
                    }
                };
            });
            $scope.OVER_LAP_SHIFT_LIST = [];
        }
        else {
            $scope.$parent.ShowAlert("Warning", "No shift available for copy", 3000);
        }
    }

    $scope.ROTA_COPY_SHIFTS = function (CopyWeek_Form, VIEW_NAME, VIEW_TYPE, OldModel) {
        var sectioni = '', Brchi = ''; deprt = ""; Copysectioni = '', CopyBrchi = ''; Copydeprt = "";
        var ModelObj = new Object();
        ModelObj.BRANCH_FILTER_SHIFT_IDS = "";
        ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = "";
        ModelObj.SECTION_FILTER_SHIFT_IDS = "";
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 1) { // in case of filtered branch and section not used but department filter is use
            //angular.forEach($scope.BRANCH_LIST, function (BRN) {
            //    var count = 0;
            //    var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            //    angular.forEach(SECLIST, function (SC) {
            //        if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
            //            if (count == 0) {
            //                if (Brchi == '') {
            //                    Brchi = BRN.BRANCH_ID;
            //                }
            //                else {
            //                    Brchi = Brchi + ',' + BRN.BRANCH_ID;
            //                }
            //            }
            //            //count++;
            //            //if (sectioni == '') {
            //            //    sectioni = SC.TABLE_ID;
            //            //}
            //            //else {
            //            //    sectioni = sectioni + ',' + SC.TABLE_ID;
            //            //}
            //        }
            //    })
            //});
            //angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (xdept) {
            //    if (xdept.IS_CHECK_DEPT_SHIFT) {
            //        if (deprt == "") {
            //            deprt = xdept.DEPARTMENT_ID;
            //        }
            //        else {
            //            deprt = deprt + ',' + xdept.DEPARTMENT_ID;
            //        }
            //    }
            //});
            ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS;
            ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID;
            ModelObj.SECTION_FILTER_SHIFT_IDS = ""//sectioni;
            //ModelObj.BRANCH_FILTER_SHIFT_IDS = "";// Brchi;
            //ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = deprt;
            ///ModelObj.SECTION_FILTER_SHIFT_IDS = "";// sectioni;
        }
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 2) {

            angular.forEach($scope.COPY_WEEK_BRANCH_LIST, function (BRN) {
                var count = 0;
                var SECLIST = $scope.COPY_WEEK_SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
                angular.forEach(SECLIST, function (SC) {
                    if (BRN.IS_CHECK_COPY_WEEK_BRANCH && SC.TABLE_ID != null) {
                        if (count == 0) {
                            if (CopyBrchi == '') {
                                CopyBrchi = BRN.BRANCH_ID;
                            }
                            else {
                                CopyBrchi = CopyBrchi + ',' + BRN.BRANCH_ID;
                            }
                        }
                        count++;
                        if (Copysectioni == '') {
                            Copysectioni = SC.TABLE_ID;
                        }
                        else {
                            Copysectioni = Copysectioni + ',' + SC.TABLE_ID;
                        }
                    }
                })
            });
            angular.forEach($scope.COPY_WEEK_DEPARTMENT_LIST, function (xdept) {
                if (xdept.IS_COPY_WEEK_CHECK_DEPT) {
                    if (Copydeprt == "") {
                        Copydeprt = xdept.DEPARTMENT_ID;
                    }
                    else {
                        Copydeprt = Copydeprt + ',' + xdept.DEPARTMENT_ID;
                    }
                }
            });
            ModelObj.BRANCH_FILTER_SHIFT_IDS = CopyBrchi;
            ModelObj.DEPARTMENT_FILTER_SHIFT_IDS = Copydeprt;
            ModelObj.SECTION_FILTER_SHIFT_IDS = "";
        }
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();//INT, --0 FOR ALL AND ID FOR 1 BRANCH
        ModelObj.VIEW_TYPE = VIEW_TYPE;//-- 1 DAY, 2 WEEK , 3 FORTNIGHT, 4 MONTH
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.MULTI_DATE_TYPE_LIST = [];
        angular.forEach($scope.COPY_WEEK_ARRAY, function (val) {
            if (val.IS_SELECTED) {
                var MultiShiftCopy = new Object();
                MultiShiftCopy.START_DATE = (new Date(val.START_DATE)).toDateString();
                MultiShiftCopy.END_DATE = (new Date(val.END_DATE)).toDateString();
                ModelObj.MULTI_DATE_TYPE_LIST.push(MultiShiftCopy);
            }
        });
        ModelObj.EMP_PRS_ID = parseInt($cookies.get('EMPLOYEE_ID'));
        if ($scope.$parent.CheckSubModuleAccess(42)) {//-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME, 4 HIDE COPY BUTTONAS
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }
        ModelObj.DELETE_SHIFT_FLAG = $scope.Section_Week_Search.DELETE_SHIFT_FLAG ? 1 : 0;//--1 FOR DELETE EXISTING SHIFT ELSE 0
        ModelObj.FLAG_ALL_FILTERED = $scope.Section_Week_Search.COPY_WEEK_VALUE == 1 ? 0 : 1;////-- 1 ALL 0 FILTERED
        ModelObj.TABLE_ID_LIST = [{ TABLE_ID: -1 }];
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 1) {
            ModelObj.TABLE_ID_LIST = [];
            //angular.forEach($scope.SHIFTS_LIST_ALL, function (x) {
            //    var objsoft = new Object();
            //    objsoft.TABLE_ID = x.SHIFT_ID;
            //    ModelObj.TABLE_ID_LIST.push(objsoft);
            //})
            ModelObj.TABLE_ID_LIST = OldModel.TABLE_ID_LIST;
        }
        //if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 1 && (deprt == "")) {
        //    $scope.$parent.ShowAlert("Error", "Please select at least one department", 3000);
        //}
        //else
        if ($scope.Section_Week_Search.COPY_WEEK_VALUE == 2 && (CopyBrchi == "" || Copydeprt == "")) {
            $scope.$parent.ShowAlert("Error", "Please select at least one branch and department", 3000);
        }
        else {
            if (ModelObj.MULTI_DATE_TYPE_LIST.length > 0) {
                PrcCommMethods.HR_API(ModelObj, 'ROTA_COPY_SHIFTS').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Copy Successfully", 3000);
                        $scope.Section_Week_Search.APPLY_COPYWEEK_SHIFT = null;
                        $scope.Section_Week_Search.DELETE_SHIFT_FLAG = false;
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    $('#Copy_Weeks').modal('hide');
                });
            }
            else {
                $scope.$parent.ShowAlert("Error", "Please select at least one week ", 3000);
            }
        }
    }
    $scope.ROTA_REVERT_SHIFT_APPROVAL = function (FLAG, VIEW_NAME) {
        $scope.DELETECOMMENTSFLAG = true;
        if ($scope.Section_Week_Search.textCommanComments == '' || $scope.Section_Week_Search.textCommanComments == null || $scope.Section_Week_Search.textCommanComments == '') {
            $scope.$parent.ShowAlert("Error", "Please provide valuable comment", 3000);
            $('#CommanComments').modal('show');
        } else {
            var ModelObj = new Object();
            ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;
            ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
            ModelObj.COMMENTS = $scope.Section_Week_Search.textCommanComments;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            PrcCommMethods.HR_API(ModelObj, 'ROTA_REVERT_SHIFT_APPROVAL').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Successfully Revert Approval", 3000);
                    $scope.Section_Week_Search.SHIFT_ID = '';
                    $scope.Section_Week_Search.EMP_PRS_ID = '';
                    $scope.Section_Week_Search.textCommanComments = '';
                    if (VIEW_NAME == 'AREA_VIEW') {
                        //$scope.Schedulerchild.AREA_ROTA_GET_SECTION();
                        //$scope.Schedulerchild.GET_EMPLOYEE_LIST_FOR_ROTA();
                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    }
                    if (VIEW_NAME == "EMP_VIEW") {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
                $('#CommanComments').modal('hide');
                $('#Multiple_Shifts').modal('hide');
            });
        }
    }
    $scope.ROTA_REVERT_SHIFT_APPROVAL_POP = function (EL, Shift) {
        $scope.DELETECOMMENTSFLAG = false;
        $scope.CommentHeader = 'Revert Approval';
        $scope.Section_Week_Search.textCommanComments = '';
        if (confirm('Are you Sure?')) {
            $scope.Section_Week_Search.SHIFT_ID = Shift.SHIFT_ID;
            $scope.Section_Week_Search.EMP_PRS_ID = EL.EMP_PRS_ID;
            $('#CommanComments').modal('show');
        }

        //$scope.ROTA_REVERT_SHIFT_APPROVAL();
    }

    $scope.ON_SELECT_SHIFT_CLICK = function (SHIFTDETAIL) {
        if (SHIFTDETAIL == null || SHIFTDETAIL == undefined) {
            $scope.Section_Week_Search.SELECT_SHIFT = '- Shifts -';
        }
        else {
            $scope.Section_Week_Search.SELECT_SHIFT = SHIFTDETAIL.SHIFT_TITLE;
        }
    };
    $scope.ON_ASSGING_SELECT_SHIFT_CLICK = function (SHIFTDETAIL) {
        if ($scope.FY_CHANGE == 1) {
            $scope.NG_CHANGE_COST = 1;
        }
        if (SHIFTDETAIL == null || SHIFTDETAIL == undefined) {
            $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = '- Shifts -';
        }
        else {
            START_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            END_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            var ST = SHIFTDETAIL.START_TIME.split(':');
            var ET = SHIFTDETAIL.END_TIME.split(':');

            START_DATE.setHours(parseFloat(ST[0]));
            START_DATE.setMinutes(parseFloat(ST[1]));
            START_DATE.setSeconds(0);
            END_DATE.setHours(parseFloat(ET[0]));
            END_DATE.setMinutes(parseFloat(ET[1]));
            END_DATE.setSeconds(0);

            $scope.Section_Week_Search.SHIFT_MASTER_ID = SHIFTDETAIL.SHIFT_MASTER_ID;
            $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = SHIFTDETAIL.SHIFT_TITLE;
            $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = SHIFTDETAIL.SHIFT_COUNT;

            $scope.Section_Week_Search.START_TIME = moment(START_DATE, 'HH:mm:ss');
            $scope.Section_Week_Search.END_TIME = moment(END_DATE, 'HH:mm:ss');

            $scope.BREAK_LIST = [];
            if (SHIFTDETAIL.UN_PAID_BREAK != undefined && SHIFTDETAIL.UN_PAID_BREAK != null && SHIFTDETAIL.UN_PAID_BREAK != '') {
                $scope.BREAK_LIST_NEW = {
                    TABLE_ID: 0,
                    BREAK_TYPE_ID: 1,
                    DURATION: SHIFTDETAIL.UN_PAID_BREAK,
                    BREAK_START: null,
                    BREAK_END: null,
                    NOTES: '',
                    DELETE_FLAG: 0,
                };
                $scope.BREAK_LIST.push(angular.copy($scope.BREAK_LIST_NEW));
            }
            if (SHIFTDETAIL.PAID_BREAK != undefined && SHIFTDETAIL.PAID_BREAK != null && SHIFTDETAIL.PAID_BREAK != '') {
                $scope.BREAK_LIST_NEW = {
                    TABLE_ID: 0,
                    BREAK_TYPE_ID: 2,
                    DURATION: SHIFTDETAIL.PAID_BREAK,
                    BREAK_START: null,
                    BREAK_END: null,
                    NOTES: '',
                    DELETE_FLAG: 0,
                };
                $scope.BREAK_LIST.push(angular.copy($scope.BREAK_LIST_NEW));
            }
        }
    };

    $scope.GET_UTC_TIME = function (EL, SelectedShift, CELL, VIEW_TYPE, SHIFT_BREAKS_FORM) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME').then(function (data) {

            var SHIFT_CELL_BREAK_TIME = angular.copy(new Date(CELL.NewDate));
            let EMPLOYEE_BREAK_TIME = moment(data.data).format('H:mm');
            var SST = EMPLOYEE_BREAK_TIME.split(':');
            if (SST.length > 0) {
                SHIFT_CELL_BREAK_TIME.setHours(parseFloat(SST[0]));
                SHIFT_CELL_BREAK_TIME.setMinutes(parseFloat(SST[1]));
                SHIFT_CELL_BREAK_TIME.setSeconds(0);
            };
            $scope.Section_Week_Search.EMPLOYEE_BREAK_NOTES = "";
            $scope.Section_Week_Search.EMPLOYEE_BREAK_TIME = moment(SHIFT_CELL_BREAK_TIME);
            if (SelectedShift.ON_BREAK_TABLE_ID > 0) {
                CELL.BREAK_START_END = 'End'
            }
            else {
                CELL.BREAK_START_END = 'Start'
            }
            $scope.SELECTED_SHIFT_BREAK_CELL = CELL;
            $('#ROTA_INS_SHIFT_BREAKS_POP').modal('show');

            $scope.SELECTED_EMPLOYEE = EL;
            $scope.SELECTED_SHIFT = SelectedShift;
            $scope.SELECTED_CELL = CELL;
            SHIFT_BREAKS_FORM.submitted = false;
        });
    };


    $scope.ROTA_INS_SHIFT_BREAKS_POP_FY = function (EL, SelectedShift, CELL, VIEW_TYPE, SHIFT_BREAKS_FORM) {
        if ($scope.SETTING_VALUE_41 == "1") {
            $scope.GET_UTC_TIME(EL, SelectedShift, CELL, VIEW_TYPE, SHIFT_BREAKS_FORM);
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Clock In & Out services has been disabled on this app. Please contact admin', 3000);
        }
    }
    $scope.ROTA_INS_SHIFT_BREAKS = function (EL, SelectedShift, VIEW_TYPE, SELECTED_CELL, SHIFT_BREAKS_FORM) {
        SHIFT_BREAKS_FORM.submitted = true;
        if (SHIFT_BREAKS_FORM.$valid) {
            var IS_OK = false, Count = 0;
            var SHIFT_CELL_BREAK_TIME = angular.copy($scope.Section_Week_Search.EMPLOYEE_BREAK_TIME);
            //var SHIFT_CELL_BREAK_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            //let EMPLOYEE_BREAK_TIME = moment($scope.Section_Week_Search.EMPLOYEE_BREAK_TIME).format('H:mm');
            //var SST = EMPLOYEE_BREAK_TIME.split(':');
            //if (SST.length > 0) {
            //    SHIFT_CELL_BREAK_TIME.setHours(parseFloat(SST[0]));
            //    SHIFT_CELL_BREAK_TIME.setMinutes(parseFloat(SST[1]));
            //    SHIFT_CELL_BREAK_TIME.setSeconds(0);
            //};
            //if (SelectedShift.ON_BREAK_TABLE_ID == 0) {
            //    if (!(moment(SHIFT_CELL_BREAK_TIME).isBetween(moment(SelectedShift.START_TIME), moment(SelectedShift.END_TIME), undefined, '[]'))) {
            //        Count++
            //        $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
            //    }
            //};
            //if (SelectedShift.ON_BREAK_TABLE_ID > 0) {
            //    if (!(moment(SHIFT_CELL_BREAK_TIME).isBetween(moment(SelectedShift.START_TIME), moment(SelectedShift.END_TIME), undefined, '[]'))) {
            //        Count++
            //        $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
            //    }
            //};

            if (SelectedShift.BREAK_START == null && (moment(SHIFT_CELL_BREAK_TIME) < moment(SelectedShift.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE))) {
                Count++
                $scope.$parent.ShowAlert('Error', 'please select timing after clock-in hours ', 1000);
            };
            if (SelectedShift.BREAK_START !== null && new Date(SelectedShift.BREAK_START) > new Date(SHIFT_CELL_BREAK_TIME)) {
                Count++
                $scope.$parent.ShowAlert("Error", "Pleace check Break-Out time.\nBreak-Out time cannot be less than Break-In time", 3000);
            }
            else if (SelectedShift.BREAK_START !== null && new Date(SelectedShift.BREAK_START) > new Date(SHIFT_CELL_BREAK_TIME)) {
                Count++
                $scope.$parent.ShowAlert("Error", "Pleace check Break-Out time.\nBreak-Out time cannot be greater than Break-In time", 3000);
            };
            if (Count == 0) {
                if ($scope.IS_EMPLOYEE) {
                    IS_OK = confirm("Are you sure, you want to " + SelectedShift.ON_BREAK_TABLE_ID > 1 ? "back on" : "go on" + "  break?")
                }
                if (!($scope.IS_EMPLOYEE)) {
                    var text = "";
                    if (SelectedShift.ON_BREAK_TABLE_ID == 0) {
                        text = "Are you sure, do you want to add a break record for " + EL.EMPLOYEE_NAME;
                    }
                    else {
                        text = "Are you sure, you want to end break for " + EL.EMPLOYEE_NAME;
                    }
                    //var text = "Are you sure, " + EL.EMPLOYEE_NAME + " is " + (SelectedShift.ON_BREAK_TABLE_ID > 1 ? "back on" : "go on") + " break?";
                    IS_OK = confirm(text);
                }
            }
            if (IS_OK) {
                var ModelObj = new Object();
                ModelObj.TABLE_ID = SelectedShift.ON_BREAK_TABLE_ID;
                ModelObj.SHIFT_ID = SelectedShift.SHIFT_ID;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.IN_OUT_FLAG = SelectedShift.ON_BREAK_TABLE_ID == 0 ? 1 : 0;//-- 1 FOR OUR 0 FOR IN
                ModelObj.NOTES = $scope.Section_Week_Search.EMPLOYEE_BREAK_NOTES;
                ModelObj.DATE_TIME = $scope.IS_EMPLOYEE == 1 ? null : $scope.$parent.changeTimezone(new Date(SHIFT_CELL_BREAK_TIME));//-- NULL FROM MOBILE APP
                ModelObj.BREAK_SOURCE = "WEB";
                PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_SHIFT_BREAKS').then(function (data) {
                    if (data.data.Table[0].TABLE_ID > 0 && SelectedShift.ON_BREAK_TABLE_ID == 0) {
                        $scope.$parent.ShowAlert("Success", "Successfully On Breaks", 3000);
                    }
                    else if (data.data.Table[0].TABLE_ID > 0 && SelectedShift.ON_BREAK_TABLE_ID > 1) {
                        $scope.$parent.ShowAlert("Success", "Successfully Back In Breaks", 3000);
                    }
                    if (data.data == undefined || data.data.Table == undefined) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                    if (VIEW_TYPE == "EMP_VIEW") {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                    }
                    if (VIEW_TYPE == "AREA_VIEW") {
                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    }
                    $('#ROTA_INS_SHIFT_BREAKS_POP').modal('hide');
                    $scope.Section_Week_Search.EMPLOYEE_BREAK_NOTES = "";
                    $scope.Section_Week_Search.EMPLOYEE_BREAK_TIME = "";
                    $('#Multiple_Shifts').modal('hide');
                });
            }
        }
    }


    $scope.ROTA_CHECK_SHIFT_EXIST_IN_SECTION = function (SECTION) {
        $scope.SHIFT_EXIST_IN_SECTION = [];
        //$scope.SECTION_EDIT_FLAG = true;
        ModelObj = new Object();
        ModelObj.SECTION_ID = SECTION.TABLE_ID;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_CHECK_SHIFT_EXIST_IN_SECTION').then(function (data) {
            $scope.SHIFT_EXIST_IN_SECTION = data.data.Table[0].SUCCESS;

            if ($scope.SHIFT_EXIST_IN_SECTION == -1) { $scope.SECTION_EDIT_FLAG = true; }
            if ($scope.SHIFT_EXIST_IN_SECTION == 1) { $scope.SECTION_EDIT_FLAG = false; }

        });
    };

    $scope.EDIT_SECTION_CLICK = function (SECTION) {
        $scope.ROTA_CHECK_SHIFT_EXIST_IN_SECTION(SECTION);
        $scope.Section_Week_Search.SECTION_ID_ROTA = null;
        $scope.Section_Week_Search.SECTION_NAME_ROTA = null;
        $scope.Section_Week_Search.BRANCH_ID_ROTA = null;
        $scope.Section_Week_Search.DEPARTMENT_ID_ROTA = null;

        $scope.IS_COPY_SHIFT = false;
        $scope.CHECK_SECTION_HEADER_TEXT = 1;
        $scope.SECTION_HEADER = 'Edit Section';
        $scope.Section_Week_Search.SECTION_ID_ROTA = SECTION.TABLE_ID;
        $scope.Section_Week_Search.SECTION_NAME_ROTA = SECTION.DISPLAY_TEXT;
        $scope.Section_Week_Search.BRANCH_ID_ROTA = SECTION.BRANCH_ID;
        $scope.Section_Week_Search.DEPARTMENT_ID_ROTA = SECTION.DEPARTMENT_ID == 0 ? null : SECTION.DEPARTMENT_ID;
        $scope.Section_Week_Search.LOCATION_ID = SECTION.LOCATION_ID;
        $scope.Section_Week_Search.ACTIVE_ROTA = SECTION.ACTIVE;
        document.getElementsByClassName('color-preview current-color')[0].style.backgroundColor = '#' + SECTION.SECTION_COLOR;
        document.getElementById('SECTION_COLOR').value = SECTION.SECTION_COLOR;
        $scope.ADMIN_GET_BRANCH();
    };
    $scope.EDIT_SHIFT_CLICK = function (SHIFLDETAIL) {
        $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID = null;
        $scope.CHECK_SHIFT_HEADER_TEXT = 1;
        $scope.SHIFT_HEADER_TEXT = 'Edit Shift';
        $scope.openNav6();
        $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID = SHIFLDETAIL.SHIFT_MASTER_ID;
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_CODE = SHIFLDETAIL.SHIFT_CODE;
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_TITLE = SHIFLDETAIL.SHIFT_TITLE;
        //$scope.Section_Week_Search.AREA_WEEK_START_TIME = moment(SHIFLDETAIL.END_TIME, 'HH:mm');
        $scope.Section_Week_Search.AREA_WEEK_START_TIME = moment(SHIFLDETAIL.START_TIME, 'HH:mm:ss');
        //$scope.Section_Week_Search.AREA_WEEK_START_TIME_MIN = SHIFLDETAIL.START_TIME.split(':')[1];
        //$scope.Section_Week_Search.START_TIME_SEC = SHIFLDETAIL.START_TIME.split(':')[2];
        $scope.Section_Week_Search.AREA_WEEK_END_TIME = moment(SHIFLDETAIL.END_TIME, 'HH:mm:ss');//.format('HH:mm:ss');
        //$scope.Section_Week_Search.END_TIME_MIN = SHIFLDETAIL.END_TIME.split(':')[1];
        //$scope.Section_Week_Search.END_TIME_SEC = SHIFLDETAIL.END_TIME.split(':')[2];
        $scope.Section_Week_Search.AREA_WEEK_PAID_BREAK = SHIFLDETAIL.PAID_BREAK;
        $scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK = SHIFLDETAIL.UN_PAID_BREAK;
        $scope.Section_Week_Search.AREA_WEEK_DURATION = SHIFLDETAIL.DURATION;
        $scope.Section_Week_Search.AREA_SHIFT_COUNT = SHIFLDETAIL.SHIFT_COUNT;

    };

    $scope.DELETE_SHIFT_CLICK = function (SHIFLDETAIL) {
        var Conf = confirm('Are you sure your want to proceed?');
        if (Conf) {
            ModelObj = new Object();
            ModelObj.DELETE_FLAG = 1;
            ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
            ModelObj.SHIFT_MASTER_ID = $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID == null ? '' : $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID;
            ModelObj.SHIFT_CODE = null;
            ModelObj.SHIFT_TITLE = null;
            ModelObj.START_TIME = null;
            ModelObj.END_TIME = null;
            ModelObj.PAID_BREAK = null;
            ModelObj.UN_PAID_BREAK = null;
            ModelObj.DURATION = null;
            ModelObj.ACTIVE = 0;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            ModelObj.CREATION_SOURCE = 2;
            ModelObj.SHIFT_COUNT = null;
            PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_INS_UPD_SHIFT_MASTER').then(function (data) {
                if (data.data == null) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Delete Successfully", 3000);
                    $scope.ADMIN_GET_SHIFT_MASTER();
                    $scope.ON_SELECT_SHIFT_CLICK();
                    $scope.closeNav6($scope.Section_Shift_Form);

                }
            });

        }
    };

    $scope.openNav5 = function () {
        $scope.BRANCH_ADD_LIST = [];
        $scope.CHECK_SECTION_HEADER_TEXT == null ? $scope.SECTION_HEADER_TEXT = 'Add Section' : $scope.SECTION_HEADER_TEXT = 'Edit Section';
        $scope.SECTION_EDIT_FLAG = false;
        document.getElementById("mySidenav5").style.width = "20%";
        document.getElementById("mySidenav5").style.zIndex = "1599";
        $scope.ADMIN_GET_LOCATION();
        // $scope.ROTA_GET_DEPT_FOR_SECTION();
    };
    $scope.closeNav5 = function (SectionForm) {
        $scope.BRANCH_ADD_LIST = [];
        if (SectionForm != undefined) {
            SectionForm.submitted = false;
            document.getElementsByClassName('color-preview current-color')[0].style.backgroundColor = 'rgb(0,0,0)';
        }
        document.getElementById("mySidenav5").style.width = "0";
        document.getElementById("mySidenav5").style.zIndex = "-1";
        $scope.Section_Week_Search.SECTION_ID_ROTA = null;
        $scope.Section_Week_Search.SECTION_NAME_ROTA = '';
        $scope.Section_Week_Search.LOCATION_ID = null;
        $scope.Section_Week_Search.BRANCH_ID_ROTA = null;
        $scope.Section_Week_Search.DEPARTMENT_ID_ROTA = null;
        $scope.CHECK_SECTION_HEADER_TEXT = null;
        $scope.Section_Week_Search.ACTIVE_ROTA = false;


    };

    $scope.openNav6 = function () {

        Section_Shift_Form.submitted = false;
        document.getElementById("mySidenav6").style.width = "25%";
        document.getElementById("mySidenav6").style.zIndex = "1599";
        $scope.CHECK_SHIFT_HEADER_TEXT == null ? $scope.SHIFT_HEADER_TEXT = 'Add Shift' : $scope.SHIFT_HEADER_TEXT = 'Edit Shift';
        $scope.Section_Week_Search.AREA_SHIFT_COUNT = 1;
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_CODE = null;
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_TITLE = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME_MIN = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME_SEC = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME_MIN = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME_SEC = null;
        $scope.Section_Week_Search.AREA_WEEK_PAID_BREAK = null;
        $scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK = null;
        $scope.CHECK_SHIFT_HEADER_TEXT = null;
        $scope.Section_Week_Search.DURATION = null;
    };
    $scope.closeNav6 = function (Section_Shift_Form) {
        Section_Shift_Form.submitted = false;
        document.getElementById("mySidenav6").style.width = "0";
        document.getElementById("mySidenav6").style.zIndex = "-1";
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_CODE = null;
        $scope.Section_Week_Search.AREA_WEEK_SHIFT_TITLE = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME_MIN = null;
        $scope.Section_Week_Search.AREA_WEEK_START_TIME_SEC = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME_MIN = null;
        $scope.Section_Week_Search.AREA_WEEK_END_TIME_SEC = null;
        $scope.Section_Week_Search.AREA_WEEK_PAID_BREAK = null;
        $scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK = null;
        $scope.Section_Week_Search.DRAG_SHIFT_MASTER_ID = null;
        $scope.Section_Week_Search.DURATION = null;
        $scope.CHECK_SHIFT_HEADER_TEXT = null;
        $scope.Section_Week_Search.AREA_SHIFT_COUNT = 1;
    };

    $scope.CalculateDuration = function (EndTime, StartTime) {
        if (EndTime != undefined && StartTime != undefined) {
            var timeTokens = new Date(EndTime)
            $scope.EndTime = new Date(1970, 0, 1, timeTokens.getHours(), timeTokens.getMinutes(), 0);
            timeTokens = new Date(StartTime);
            $scope.StartTime = new Date(1970, 0, 1, timeTokens.getHours(), timeTokens.getMinutes(), 0);
            if ($scope.EndTime <= $scope.StartTime) {
                $scope.EndTime.setDate($scope.EndTime.getDate() + 1);
            }
            var Duration = moment.duration(moment(moment.utc($scope.EndTime, "DD/MM/YYYY HH:mm:ss")).diff(moment(moment.utc($scope.StartTime, "DD/MM/YYYY HH:mm:ss")))).asMinutes();
            //moment.duration(moment(moment.utc($scope.EndTime, "DD/MM/YYYY HH:mm:ss")).diff(moment(moment.utc($scope.StartTime, "DD/MM/YYYY HH:mm:ss")))).format("HH:mm:ss")).asMinutes();
            if ($scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK > 0) {
                Duration = Duration - parseFloat($scope.Section_Week_Search.AREA_WEEK_UN_PAID_BREAK);
            }
            return Duration;
            //return ($scope.EndTime - $scope.StartTime) / 3600000;
        }
    };
    //----------------------------------------------Area Selection code ----------------------------------------------
    $scope.SetBreakStartChange = function (BL) {
        var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        if ((BL.BREAK_START == '' || BL.BREAK_START == null || BL.BREAK_START == undefined) || BL.BREAK_END == undefined || BL.BREAK_END == '' || BL.BREAK_END == null) {
            BL.DURATION = 0;
        }
        else {
            var SHIFT_CELL_START_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            var SHIFT_CELL_END_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

            let SHIFT_START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
            let SHIFT_END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
            var SST = SHIFT_START_TIME.split(':');
            if (SST.length > 0) {
                SHIFT_CELL_START_TIME.setHours(parseFloat(SST[0]));
                SHIFT_CELL_START_TIME.setMinutes(parseFloat(SST[1]));
                SHIFT_CELL_START_TIME.setSeconds(0);
            };
            var SET = SHIFT_END_TIME.split(':');
            if (SET.length > 0) {
                SHIFT_CELL_END_TIME.setHours(parseFloat(SET[0]));
                SHIFT_CELL_END_TIME.setMinutes(parseFloat(SET[1]));
                SHIFT_CELL_END_TIME.setSeconds(0);
            };

            if (moment(SHIFT_CELL_START_TIME) > moment(SHIFT_CELL_END_TIME)) {
                SHIFT_CELL_END_TIME.setDate(SHIFT_CELL_START_TIME.getDate() + 1);
            };


            let START_TIME = moment(BL.BREAK_START).format('H:mm')
            let END_TIME = moment(BL.BREAK_END).format('H:mm')
            var BST = START_TIME.split(':');
            if (BST.length > 0) {
                BREAK_START.setHours(parseFloat(BST[0]));
                BREAK_START.setMinutes(parseFloat(BST[1]));
                BREAK_START.setSeconds(0);
            };
            var BET = END_TIME.split(':');
            if (BET.length > 0) {
                BREAK_END.setHours(parseFloat(BET[0]));
                BREAK_END.setMinutes(parseFloat(BET[1]));
                BREAK_END.setSeconds(0);
            };

            if (moment(BREAK_START) > moment(BREAK_END)) {
                BREAK_END.setDate(BREAK_START.getDate() + 1);
            };
            var ms = moment(BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BREAK_START, "DD/MM/YYYY HH:mm:ss"));
            //var ms = moment(BL.BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BL.BREAK_START, "DD/MM/YYYY HH:mm:ss"));

            var diff = moment.duration(ms);
            if (ms < 0) {
                BL.BREAK_END = null;
                BL.BREAK_START = null;
                $scope.$parent.ShowAlert('Error', 'please select valid Start Time / End Time ', 1000);
            }
            else {
                var mint = 0;
                if (diff.hours() > 0) {
                    mint = diff.hours() * 60
                }
                BL.DURATION = diff.minutes() + mint; // return minutes


                //var SHIFT_CELL_START_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                //var SHIFT_CELL_END_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

                //let SHIFT_START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
                //let SHIFT_END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
                //var SST = SHIFT_START_TIME.split(':');
                //if (SST.length > 0) {
                //    SHIFT_CELL_START_TIME.setHours(parseFloat(SST[0]));
                //    SHIFT_CELL_START_TIME.setMinutes(parseFloat(SST[1]));
                //    SHIFT_CELL_START_TIME.setSeconds(0);
                //};
                //var SET = SHIFT_END_TIME.split(':');
                //if (SET.length > 0) {
                //    SHIFT_CELL_END_TIME.setHours(parseFloat(SET[0]));
                //    SHIFT_CELL_END_TIME.setMinutes(parseFloat(SET[1]));
                //    SHIFT_CELL_END_TIME.setSeconds(0);
                //};
                //if (moment(SHIFT_CELL_START_TIME) > moment(SHIFT_CELL_END_TIME)) {
                //    SHIFT_CELL_END_TIME.setDate(SHIFT_CELL_START_TIME.getDate() + 1);
                //};


                if ($scope.BREAK_LIST.length > 0) {
                    if (BL.BREAK_START != null) {
                        if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_START = null;
                        }
                    }
                    if (BL.BREAK_END != null) {
                        if (!(moment(BREAK_END).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_END = null;
                        }
                    }
                }
                //if ($scope.BREAK_LIST.length > 0) {
                //	if (BL.BREAK_START != null) {
                //		if (!(moment(BREAK_START).isBetween(moment($scope.Section_Week_Search.START_TIME), moment($scope.Section_Week_Search.END_TIME), undefined, '[]'))) {
                //			$scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                //			BL.BREAK_START = null;
                //		}
                //	}
                //	if (BL.BREAK_END != null) {
                //		if (!(moment(BREAK_END).isBetween(moment($scope.Section_Week_Search.START_TIME), moment($scope.Section_Week_Search.END_TIME), undefined, '[]'))) {
                //			$scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                //			BL.BREAK_END = null;
                //		}
                //	}
                //}
            }
        }
    };
    $scope.SetBreakEndChange = function (BL) {
        var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

        if ((BL.BREAK_START == '' || BL.BREAK_START == null || BL.BREAK_START == undefined) || BL.BREAK_END == undefined || BL.BREAK_END == '' || BL.BREAK_END == null) {
            BL.DURATION = 0;
        }
        else {
            var SHIFT_CELL_START_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            var SHIFT_CELL_END_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

            let SHIFT_START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
            let SHIFT_END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
            var SST = SHIFT_START_TIME.split(':');
            if (SST.length > 0) {
                SHIFT_CELL_START_TIME.setHours(parseFloat(SST[0]));
                SHIFT_CELL_START_TIME.setMinutes(parseFloat(SST[1]));
                SHIFT_CELL_START_TIME.setSeconds(0);
            };
            var SET = SHIFT_END_TIME.split(':');
            if (SET.length > 0) {
                SHIFT_CELL_END_TIME.setHours(parseFloat(SET[0]));
                SHIFT_CELL_END_TIME.setMinutes(parseFloat(SET[1]));
                SHIFT_CELL_END_TIME.setSeconds(0);
            };

            if (moment(SHIFT_CELL_START_TIME) > moment(SHIFT_CELL_END_TIME)) {
                SHIFT_CELL_END_TIME.setDate(SHIFT_CELL_START_TIME.getDate() + 1);
            };


            //if (moment(BREAK_START) > moment(BREAK_END)) {
            //    BREAK_END.setDate(BREAK_START.getDate() + 1);
            //}


            let START_TIME = moment(BL.BREAK_START).format('H:mm')
            let END_TIME = moment(BL.BREAK_END).format('H:mm')
            var BST = START_TIME.split(':');
            if (BST.length > 0) {
                BREAK_START.setHours(parseFloat(BST[0]));
                BREAK_START.setMinutes(parseFloat(BST[1]));
                BREAK_START.setSeconds(0);
            };
            var BET = END_TIME.split(':');
            if (BET.length > 0) {
                BREAK_END.setHours(parseFloat(BET[0]));
                BREAK_END.setMinutes(parseFloat(BET[1]));
                BREAK_END.setSeconds(0);
            };
            if (moment(SHIFT_CELL_START_TIME) > moment(BREAK_START)) {
                BREAK_START.setDate(BREAK_START.getDate() + 1);
            }

            if (moment(SHIFT_CELL_START_TIME) > moment(BREAK_END)) {
                BREAK_END.setDate(BREAK_END.getDate() + 1);
            }

            //if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
            //    $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
            //    BL.BREAK_START = null;
            //}

            //if (moment(BREAK_START) > moment(BREAK_END)) {
            //    BREAK_END.setDate(BREAK_START.getDate() + 1);
            //}


            var ms = moment(BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BREAK_START, "DD/MM/YYYY HH:mm:ss"));
            if (ms < 0) {
                BL.BREAK_END = null;
                BL.BREAK_START = null;
                $scope.$parent.ShowAlert('Error', 'please select valid Start Time / End Time ', 1000);
            }
            else {
                var diff = moment.duration(ms);
                diff.hours(); // return hours
                var mint = 0;
                if (diff.hours() > 0) {
                    mint = diff.hours() * 60
                }
                BL.DURATION = diff.minutes() + mint; // return minutes;

                if ($scope.BREAK_LIST.length > 0) {
                    if (BL.BREAK_START != null) {
                        if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_START = null;
                        }
                    }
                    if (BL.BREAK_END != null) {
                        if (!(moment(BREAK_END).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_END = null;
                        }
                    }
                }
            }
        }
    };

    $scope.SetBreakStartActChange = function (BL) {
        var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        if ((BL.BREAK_START == '' || BL.BREAK_START == null || BL.BREAK_START == undefined) || BL.BREAK_END == undefined || BL.BREAK_END == '' || BL.BREAK_END == null) {
            BL.DURATION = 0;
        }
        else {
            var SHIFT_CELL_START_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            var SHIFT_CELL_END_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

            let SHIFT_START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
            let SHIFT_END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
            var SST = SHIFT_START_TIME.split(':');
            if (SST.length > 0) {
                SHIFT_CELL_START_TIME.setHours(parseFloat(SST[0]));
                SHIFT_CELL_START_TIME.setMinutes(parseFloat(SST[1]));
                SHIFT_CELL_START_TIME.setSeconds(0);
            };
            var SET = SHIFT_END_TIME.split(':');
            if (SET.length > 0) {
                SHIFT_CELL_END_TIME.setHours(parseFloat(SET[0]));
                SHIFT_CELL_END_TIME.setMinutes(parseFloat(SET[1]));
                SHIFT_CELL_END_TIME.setSeconds(0);
            };

            if (moment(SHIFT_CELL_START_TIME) > moment(SHIFT_CELL_END_TIME)) {
                SHIFT_CELL_END_TIME.setDate(SHIFT_CELL_START_TIME.getDate() + 1);
            };


            let START_TIME = moment(BL.BREAK_START).format('H:mm')
            let END_TIME = moment(BL.BREAK_END).format('H:mm')
            var BST = START_TIME.split(':');
            if (BST.length > 0) {
                BREAK_START.setHours(parseFloat(BST[0]));
                BREAK_START.setMinutes(parseFloat(BST[1]));
                BREAK_START.setSeconds(0);
            };
            var BET = END_TIME.split(':');
            if (BET.length > 0) {
                BREAK_END.setHours(parseFloat(BET[0]));
                BREAK_END.setMinutes(parseFloat(BET[1]));
                BREAK_END.setSeconds(0);
            };

            //if (moment(BREAK_START) > moment(BREAK_END)) {
            //    BREAK_END.setDate(BREAK_START.getDate() + 1);
            //};
            var ms = moment(BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BREAK_START, "DD/MM/YYYY HH:mm:ss"));
            //var ms = moment(BL.BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BL.BREAK_START, "DD/MM/YYYY HH:mm:ss"));

            var diff = moment.duration(ms);
            if (ms < 0) {
                BL.BREAK_END = null;
                BL.BREAK_START = null;
                $scope.$parent.ShowAlert('Error', 'please select valid Start Time / End Time ', 1000);
                //   BL.BREAK_START = moment($scope.SELECTED_CELL.NewDate, "YYYY-MM-DD");
                //  BL.BREAK_END = moment($scope.SELECTED_CELL.NewDate, "YYYY-MM-DD");
            }
            else {
                var mint = 0;
                if (diff.hours() > 0) {
                    mint = diff.hours() * 60
                }
                BL.DURATION = diff.minutes() + mint; // return minutes

                if ($scope.BREAK_LIST.length > 0) {
                    if (BL.BREAK_START != null) {
                        if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_START = null;
                        }
                    }
                    if (BL.BREAK_END != null) {
                        if (!(moment(BREAK_END).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_END = null;
                        }
                    }
                }

            }
        }
    };
    $scope.SetBreakEndActChange = function (BL) {
        var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
        var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

        if ((BL.BREAK_START == '' || BL.BREAK_START == null || BL.BREAK_START == undefined) || BL.BREAK_END == undefined || BL.BREAK_END == '' || BL.BREAK_END == null) {
            BL.DURATION = 0;
        }
        else {
            var SHIFT_CELL_START_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
            var SHIFT_CELL_END_TIME = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

            let SHIFT_START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
            let SHIFT_END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
            var SST = SHIFT_START_TIME.split(':');
            if (SST.length > 0) {
                SHIFT_CELL_START_TIME.setHours(parseFloat(SST[0]));
                SHIFT_CELL_START_TIME.setMinutes(parseFloat(SST[1]));
                SHIFT_CELL_START_TIME.setSeconds(0);
            };
            var SET = SHIFT_END_TIME.split(':');
            if (SET.length > 0) {
                SHIFT_CELL_END_TIME.setHours(parseFloat(SET[0]));
                SHIFT_CELL_END_TIME.setMinutes(parseFloat(SET[1]));
                SHIFT_CELL_END_TIME.setSeconds(0);
            };

            if (moment(SHIFT_CELL_START_TIME) > moment(SHIFT_CELL_END_TIME)) {
                SHIFT_CELL_END_TIME.setDate(SHIFT_CELL_START_TIME.getDate() + 1);
            };
            //if (moment(BREAK_START) > moment(BREAK_END)) {
            //    BREAK_END.setDate(BREAK_START.getDate() + 1);
            //}
            let START_TIME = moment(BL.BREAK_START).format('H:mm')
            let END_TIME = moment(BL.BREAK_END).format('H:mm')
            var BST = START_TIME.split(':');
            if (BST.length > 0) {
                BREAK_START.setHours(parseFloat(BST[0]));
                BREAK_START.setMinutes(parseFloat(BST[1]));
                BREAK_START.setSeconds(0);
            };
            var BET = END_TIME.split(':');
            if (BET.length > 0) {
                BREAK_END.setHours(parseFloat(BET[0]));
                BREAK_END.setMinutes(parseFloat(BET[1]));
                BREAK_END.setSeconds(0);
            };
            if (moment(SHIFT_CELL_START_TIME) > moment(BREAK_START)) {
                BREAK_START.setDate(BREAK_START.getDate() + 1);
            }

            if (moment(SHIFT_CELL_START_TIME) > moment(BREAK_END)) {
                BREAK_END.setDate(BREAK_END.getDate() + 1);
            }

            //if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
            //    $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
            //    BL.BREAK_START = null;
            //}

            //if (moment(BREAK_START) > moment(BREAK_END)) {
            //    BREAK_END.setDate(BREAK_START.getDate() + 1);
            //}


            var ms = moment(BREAK_END, "DD/MM/YYYY HH:mm:ss").diff(moment(BREAK_START, "DD/MM/YYYY HH:mm:ss"));
            if (ms < 0) {
                BL.BREAK_END = null;
                BL.BREAK_START = null;
                $scope.$parent.ShowAlert('Error', 'please select valid Start Time / End Time ', 1000);
            }
            else {
                var diff = moment.duration(ms);
                diff.hours(); // return hours
                var mint = 0;
                if (diff.hours() > 0) {
                    mint = diff.hours() * 60
                }
                BL.DURATION = diff.minutes() + mint; // return minutes;

                if ($scope.BREAK_LIST.length > 0) {
                    if (BL.BREAK_START != null) {
                        if (!(moment(BREAK_START).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_START = null;
                        }
                    }
                    if (BL.BREAK_END != null) {
                        if (!(moment(BREAK_END).isBetween(moment(SHIFT_CELL_START_TIME), moment(SHIFT_CELL_END_TIME), undefined, '[]'))) {
                            $scope.$parent.ShowAlert('Error', 'please select timing  between shift hours ', 1000);
                            BL.BREAK_END = null;
                        }
                    }
                }
            }
        }
    };
    function Emptemplate(data) {
        $('.select2-dropdown--below').addClass('mn-w-250');
        return data.html;
    };
    function template(data) {
        $('.select2-dropdown--below').removeClass('mn-w-250');
        return data.html;
    };
    $scope.DDL_EMPLOYEE_LIST_FY = function (EMP, Shift, ViewName) {
        var EmpListData = [];
        var EmpListDataNew = [];
        angular.forEach($scope.EMPLOYEE_LIST_UNIQUE, function (Empval) {
            var EMP_ARRY = $scope.EMPLOYEE_LIST_ALL.filter(function (x) { return x.EMP_PRS_ID == Empval.EMP_PRS_ID && x.LEAVE_STATUS_ID != 0 })
            Empval.IS_DEACTIVATED = false;
            Empval.IS_NOT_JOIN_YET = true;
            // if (EMP_ARRY.length > 0) {
            Empval.ON_LEAVE_DIV = '';
            for (var i = 0; i < EMP_ARRY.length; i++) {
                var LEAVE_START_DATE = moment(EMP_ARRY[i].LEAVE_START_DATE).format('YYYY-MM-DD');
                var LEAVE_END_DATE = moment(EMP_ARRY[i].LEAVE_END_DATE).format('YYYY-MM-DD');
                var NEW_DATE = moment(Shift.NewDate).format('YYYY-MM-DD');
                var IS_VALED = moment(NEW_DATE).isBetween(LEAVE_START_DATE, LEAVE_END_DATE, undefined, '[]');
                Empval.IS_LEAVE = false;
                if (EMP_ARRY[i].TERMINATION_DATE != null && new Date(EMP_ARRY[i].TERMINATION_DATE) < new Date(Shift.NewDate)) {
                    Empval.IS_DEACTIVATED = true;
                    Empval.ON_LEAVE_DIV = ' <i title="DeActive" class="fas fa-user-slash float-right mt-1 text-danger" ></i>';
                }
                if (EMP_ARRY[i].START_DATE != null && new Date(EMP_ARRY[i].START_DATE) > new Date(Shift.NewDate)) {
                    Empval.IS_NOT_JOIN_YET = false;
                    Empval.ON_LEAVE_DIV = ' <i title="Not Join" class="fas fa-skiing float-right mt-1 text-danger" ></i>';
                }
                if (IS_VALED) {
                    Empval.IS_LEAVE = true;
                    Empval.ON_LEAVE_LIST = [];
                    Empval.ON_LEAVE_LIST.push(i);
                    Empval.ON_LEAVE_DIV = ' <i title="leave" class="fa fa-file-exclamation float-right mt-1 text-danger" ></i>';
                    break;
                };
            }
            if (Empval.IMAGE_PATH == null) {
                Empval.html = '<div class="row align-items-center"> <div class="col-md-2 px-0"><span  class="name-badge-inside">' + Empval.INITIALS + '</span></div><div class="col ml-2">' + Empval.EMPLOYEE_NAME + Empval.ON_LEAVE_DIV + '</div> </div>';
            }
            if (Empval.IMAGE_PATH != null) {
                Empval.html = '<div class="row align-items-center"><div class="col-md-2 px-0"><img  class="rota-profile-pic" src="' + window.location.origin + "/" + Empval.IMAGE_PATH + '" class="border-radius-5" width="16"></div> <div class="col text-limitations ml-2"> ' + Empval.EMPLOYEE_NAME + Empval.ON_LEAVE_DIV + '</div></div>';
            }
            //if (Empval.IS_DEACTIVATE) {
            var data = new Object();
            data.id = Empval.EMP_PRS_ID;
            data.text = Empval.EMPLOYEE_NAME;
            data.html = Empval.html;
            EmpListData.push(data);
            EmpListDataNew.push(Empval);
            //}
            //}
        });

        $("#js-employee-templating").select2({
            placeholder: 'Select Employee',
            allowClear: false,
            data: EmpListData,
            templateResult: Emptemplate,
            escapeMarkup: function (m) {
                return m;
            }
        });

        //$("#js-employee-templating_add").select2({
        //    placeholder: 'Select Employee',
        //    allowClear: false,
        //    data: EmpListData,
        //    templateResult: Emptemplate,
        //    escapeMarkup: function (m) {
        //        return m;
        //    }
        //});

        if ($scope.Section_Week_Search.EMP_PRS_ID >= -2) {
            $('#js-employee-templating').val($scope.Section_Week_Search.EMP_PRS_ID).trigger('change');
        }
        else {
            $('#js-employee-templating').val(null).trigger('change');
        }
        $("#js-section-templating").select2({
            placeholder: 'Select Section',
            allowClear: false,
            data: $scope.FINAL_SECTIONS,
            templateResult: template,
            escapeMarkup: function (m) {
                return m;
            }
        });

        if ($scope.SELECTED_CELL.SHIFT_TEXT == "Edit") {
            $scope.EMP_LIST_DDL = EmpListData;
        }
        else {
            $scope.EMP_LIST_DDL = EmpListDataNew;
        }
        if ($scope.Section_Week_Search.SECTION_ID > 0 || $scope.Section_Week_Search.SECTION_ID < 0) {
        }
        else {
            $('#js-section-templating').val(null).trigger('change');
        }
    };
    $scope.ROTA_GET_SHIFT_HISTORY = function (SHIFT_DETAILS) {
        $scope.SHIFT_HISTORY_LIST = [];
        ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT_DETAILS.SHIFT_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_HISTORY').then(function (data) {
            $scope.SHIFT_HISTORY_LIST = [];
            $scope.SHIFT_HISTORY_LIST = data.data.Table;
            SHIFT_DETAILS.SHIFT_HISTORY = data.data.Table;
        });
    };
    $scope.START_TIME_FY = function () {
        if ($scope.FY_CHANGE == 1) { $scope.NG_CHANGE_COST = 1; }

    };
    $scope.END_TIME_FY = function () {
        if ($scope.FY_CHANGE == 1) { $scope.NG_CHANGE_COST = 1; }
    };
    $scope.VIEW_FLAG = false;
    $scope.EDIT_SHIFT_POP = function (EMP, shift, FLAG, CELL, VIEW_NAME, VIEW_FLAG) {
        $scope.VIEW_FLAG = VIEW_FLAG;
        $scope.PICK_SHIFT_VALID = true;
        $scope.COPY_SHIFT_SHIFT = [];
        $scope.OVERLAP_EMP_LIST = [];
        $scope.BREAK_LIST = [];
        $scope.APPROVE_FLAG = '';
        $scope.APPROVE_FLAG = FLAG;
        $scope.ADMIN_GET_SHIFT_TYPES();
        $scope.FY_CHANGE = 0;
        $scope.NG_CHANGE_COST = 0;
        $scope.Section_Week_Search.SHIFT_ID = '';
        $scope.Section_Week_Search.SECTION_ID = '';
        $scope.Section_Week_Search.SECTION_NAME = '';
        $scope.Section_Week_Search.START_TIME = '';
        $scope.Section_Week_Search.END_TIME = '';
        $scope.Section_Week_Search.NOTES = '';
        $scope.Section_Week_Search.PAID_BREAK = 0;
        $scope.Section_Week_Search.UN_PAID_BREAK = 0;
        $scope.Section_Week_Search.SHIFT_TYPE_ID = '';
        $scope.Section_Week_Search.SHIFT_TYPE = '';
        $scope.Section_Week_Search.EMPLOYEES = [];
        $scope.Section_Week_Search.ASSIGN_SEARCH_SHIFT = '';
        $scope.IS_COPY_SHIFT = false;
        $scope.SELECTED_EMPLOYEE = null;
        $scope.SELECTED_SHIFT = null;

        $scope.SELECTED_EMPLOYEE = EMP;
        $scope.SELECTED_SHIFT = shift;
        $scope.SELECTED_CELL = CELL;

        $scope.Section_Week_Search.OVERALL_COST = 0;
        $scope.Section_Week_Search.SHIFT_MASTER_ID = '';
        $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = '- Shifts -';
        $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = "00.00";
        $scope.Section_Week_Search.SHIFT_COST = 0;
        $scope.Section_Week_Search.SHIFT_LENGTH = 0;
        $scope.SELECTED_CELL.SHIFT_DETAILS = "";
        $scope.Section_Week_Search.EMPTY_SHIFT = shift.EMPTY_OPEN_FLAG == -1 || shift.EMPTY_OPEN_FLAG == -2 ? false : true;
        if (shift != undefined && shift.SHIFT_ID > 0) {
            $scope.ROTA_GET_SHIFT_DETAILS_BY_ID(shift);
            $scope.ROTA_GET_SHIFT_HISTORY(shift);
            if ($scope.IS_EMPLOYEE) {
                $scope.Section_Week_Search.EMPLOYEE_NAME = $cookies.get("NAME");
                $scope.Section_Week_Search.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                if (EMP.EMP_PRS_ID < 0) {
                    $scope.SELECTED_CELL.SHIFT_TEXT = "Pick";
                }
                else {
                    $scope.SELECTED_CELL.SHIFT_TEXT = "View";
                    $scope.SELECTED_CELL.SHIFT_DETAILS = "Details";
                }
                if (new Date($scope.TODAY_DATE) >= new Date(shift.END_TIME)) {
                    $scope.PICK_SHIFT_VALID = false;
                }
            }
            else {
                $scope.Section_Week_Search.EMPLOYEE_NAME = EMP.EMPLOYEE_NAME != null ? EMP.EMPLOYEE_NAME : (EMP.EMPTY_OPEN_FLAG == -1 ? 'Empty Shift' : (EMP.EMPTY_OPEN_FLAG == -2 ? 'Open Shift' : ''));
                $scope.Section_Week_Search.EMP_PRS_ID = EMP.EMP_PRS_ID != null ? EMP.EMP_PRS_ID : (EMP.EMPTY_OPEN_FLAG == -1 ? EMP.EMP_PRS_ID = -1 : (EMP.EMPTY_OPEN_FLAG == -2 ? EMP.EMP_PRS_ID = -2 : null));
                if ($scope.VIEW_FLAG) {
                    $scope.SELECTED_CELL.SHIFT_TEXT = "View";
                }
                else {
                    $scope.SELECTED_CELL.SHIFT_TEXT = "Edit";
                }
            }
            $scope.Section_Week_Search.SHIFT_ID = shift.SHIFT_ID;
            $scope.Section_Week_Search.BRANCH_ID = shift.BRANCH_ID;
            $scope.Section_Week_Search.START_TIME = moment(shift.START_TIME, 'YYYY-MM-DD HH:mm');
            $scope.Section_Week_Search.END_TIME = moment(shift.END_TIME, 'YYYY-MM-DD HH:mm');

            $scope.Section_Week_Search.NOTES = shift.NOTES;
            $scope.Section_Week_Search.PAID_BREAK = shift.PAID_BREAK;
            $scope.Section_Week_Search.UN_PAID_BREAK = shift.UNPAID_BREAK;

            $scope.Section_Week_Search.SECTION_ID = shift.SECTION_ID
            $scope.Section_Week_Search.SECTION_NAME = shift.SECTION_NAME;

            $scope.Section_Week_Search.SHIFT_MASTER_ID = shift.SHIFT_MASTER_ID == undefined || shift.SHIFT_MASTER_ID == null || shift.SHIFT_MASTER_ID == '' ? '' : shift.SHIFT_MASTER_ID;
            $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = shift.SHIFT_TITLE == undefined || shift.SHIFT_TITLE == null || shift.SHIFT_TITLE == '' ? $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT : shift.SHIFT_TITLE;

            $scope.Section_Week_Search.SHIFT_TYPE_ID = shift.SHIFT_TYPE_ID;
            $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = shift.INS_SHIFT_COUNT_WEB;
            // $('#js-employee-templating').val($scope.Section_Week_Search.EMP_PRS_ID).trigger('change');
            $scope.DDL_EMPLOYEE_LIST_FY(EMP, CELL, VIEW_NAME);

            $scope.Section_Week_Search.BRANCH_ID = shift.BRANCH_ID;
            if (parseInt($scope.SECTION_REQUIRED) == 0 && ($scope.Section_Week_Search.SECTION_ID == null || $scope.Section_Week_Search.SECTION_ID == "" || $scope.Section_Week_Search.SECTION_ID == undefined)) {
                $('#js-section-templating').val("-" + $scope.Section_Week_Search.BRANCH_ID).trigger('change');
            }
            else {
                $('#js-section-templating').val($scope.Section_Week_Search.SECTION_ID).trigger('change');
            }
            $('#js-shifttype-templating').val($scope.Section_Week_Search.SHIFT_TYPE_ID).trigger('change');
            $scope.ROTA_GET_SHIFT_COST_DETAILS(shift);
        }
        else {
            $scope.Section_Week_Search.EMPLOYEE_NAME = EMP.EMPLOYEE_NAME;
            $scope.Section_Week_Search.EMP_PRS_ID = EMP.EMP_PRS_ID;
            $('#js-employee-templating').val($scope.Section_Week_Search.EMP_PRS_ID).trigger('change');
            $scope.Section_Week_Search.SHIFT_ID = '';
            $scope.Section_Week_Search.SECTION_ID = '';
            $scope.Section_Week_Search.SECTION_NAME = '';
            $scope.Section_Week_Search.START_TIME = '';
            $scope.Section_Week_Search.END_TIME = '';
            $scope.Section_Week_Search.NOTES = '';
            $scope.Section_Week_Search.PAID_BREAK = 0;
            $scope.Section_Week_Search.UN_PAID_BREAK = 0;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = '';
            $scope.Section_Week_Search.SHIFT_TYPE = '';
            $scope.SELECTED_CELL.SHIFT_TEXT = "Add";
            $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = 1;
            $scope.BREAK_LIST = [];
            //  $scope.ADD_BREAK();
        }
        $scope.Section_Week_Search.EMPLOYEES.push(EMP);
        $('#Add_Shift').modal('show');
        $scope.Section_Week_Search.OFF_DAY = CELL.OFF_DAY != undefined ? CELL.OFF_DAY : false;

        if ($scope.APPROVE_FLAG == 1) {
            $scope.SELECTED_CELL.SHIFT_TEXT = "Approve";
            //$scope.Section_Week_Search.IS_APPROVED = shift.LOGIN_LOGOUT_DETAILS.IS_APPROVED;
            //$scope.Section_Week_Search.EMPLOYEE_LOGIN = moment(shift.LOGIN_LOGOUT_DETAILS.LOGIN_DATE, 'YYYY-MM-DD HH:mm');
            //$scope.Section_Week_Search.EMPLOYEE_LOGOUT = moment(shift.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE, 'YYYY-MM-DD HH:mm');
            if (shift.LOGIN_LOGOUT_DETAILS != null && shift.LOGIN_LOGOUT_DETAILS.length > 0) {

                $scope.Section_Week_Search.IS_APPROVED = shift.LOGIN_LOGOUT_DETAILS[0].IS_APPROVED;

                $scope.Section_Week_Search.EMPLOYEE_LOGIN = moment(moment(shift.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE), 'YYYY-MM-DD HH:mm');
                if (shift.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE !== null) {
                    $scope.Section_Week_Search.EMPLOYEE_LOGOUT = moment(moment(shift.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE), 'YYYY-MM-DD HH:mm');
                }
                else {
                    $scope.Section_Week_Search.EMPLOYEE_LOGOUT = moment(shift.END_TIME, 'YYYY-MM-DD HH:mm');
                }

                if ($scope.Section_Week_Search.IS_APPROVED) {
                    $scope.Section_Week_Search.APPROVED_EMPLOYEE_LOGIN = moment(moment(shift.LOGIN_LOGOUT_DETAILS[0].APPROVED_LOGIN_DATE), 'YYYY-MM-DD HH:mm');
                    $scope.Section_Week_Search.APPROVED_EMPLOYEE_LOGOUT = moment(moment(shift.LOGIN_LOGOUT_DETAILS[0].APPROVED_LOGOUT_DATE), 'YYYY-MM-DD HH:mm');
                }
            }
        }

        if ($scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT == 1 && (shift.LOGIN_LOGOUT_DETAILS == null || shift.LOGIN_LOGOUT_DETAILS.length == 0)) {
            $scope.Section_Week_Search.EMPLOYEE_LOGIN = moment(shift.START_TIME, 'YYYY-MM-DD HH:mm');
            $scope.Section_Week_Search.EMPLOYEE_LOGOUT = moment(shift.END_TIME, 'YYYY-MM-DD HH:mm');
        }

        if (shift.STATUS_ID > 0) {
            $scope.SELECTED_SHIFT.STATUS_NAME = $scope.SHIFT_STATUS.filter(function (x) { return x.STATUS_ID == shift.STATUS_ID })[0].STATUS_NAME;
            $scope.SELECTED_SHIFT.STATUS_BADGE = $scope.SHIFT_STATUS.filter(function (x) { return x.STATUS_ID == shift.STATUS_ID })[0].badge;
        }
        $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar mn-w-250');
        $('#AddSectionScroll').find('.dropdown-menu').addClass('custom-scrollbar mn-w-250');
        //$('.select2-container').find('.select2-dropdown').addClass('mw-300');
        $scope.FY_CHANGE = 1;
    };
    $scope.ADD_NEW_SHIFT_POP = function (EMP, Cell, ViewName) {
        $scope.VIEW_FLAG = "";
        $scope.FY_CHANGE = 0;
        $scope.NG_CHANGE_COST = 0;
        $scope.APPROVE_FLAG = ''
        $scope.SHIFT_HISTORY_LIST = [];
        $scope.BREAK_LIST_TEMP = [];
        $scope.BREAK_LIST = [];
        $scope.ACTUAL_BREAK_LIST = [];
        $scope.OVERLAP_EMP_LIST = [];

        $scope.SHIFT_FLAG = 1;
        $scope.IS_COPY_SHIFT = false;

        $scope.SELECTED_SHIFT = '';
        $scope.SELECTED_CELL = Cell;
        $scope.Section_Week_Search.ASSIGN_SELECT_SHIFT = '-Select Shifts -';
        $scope.Section_Week_Search.EMPLOYEES = [];
        $scope.Section_Week_Search.SHIFT_MASTER_ID = '';
        $scope.Section_Week_Search.OVERALL_COST = 0;
        $scope.Section_Week_Search.OVERALL_SHIFT_LENGTH = "00.00";
        $scope.Section_Week_Search.SHIFT_COST = 0;
        $scope.Section_Week_Search.SHIFT_LENGTH = 0;
        $scope.Section_Week_Search.SHIFT_ID = '';
        $scope.Section_Week_Search.SECTION_ID = '';
        $scope.Section_Week_Search.SECTION_NAME = '';
        $scope.Section_Week_Search.START_TIME = '';
        $scope.Section_Week_Search.END_TIME = '';
        $scope.Section_Week_Search.NOTES = '';
        $scope.Section_Week_Search.PAID_BREAK = 0;
        $scope.Section_Week_Search.UN_PAID_BREAK = 0;
        $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = 1;
        $scope.SELECTED_CELL.SHIFT_TEXT = "Add";
        $scope.Section_Week_Search.SHIFT_TYPE = '';
        $scope.Section_Week_Search.ASSIGN_SEARCH_SHIFT = '';
        $scope.Section_Week_Search.EMPTY_SHIFT = EMP.EMP_PRS_ID == -1 || EMP.EMP_PRS_ID == -2 ? false : true;
        $scope.BREAK_LIST = [];
        $scope.ACTUAL_BREAK_LIST = [];

        $('#Add_Shift').modal('show');
        if (EMP == undefined) {
            $scope.SELECTED_EMPLOYEE = '';
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
            $scope.Section_Week_Search.EMP_PRS_ID = '';
        }
        else {
            $scope.SELECTED_EMPLOYEE = EMP;
            $scope.Section_Week_Search.EMP_PRS_ID = EMP.EMP_PRS_ID;
            $scope.DDL_EMPLOYEE_LIST_FY(EMP, Cell, ViewName);
            //  $('#js-employee-templating').val(EMP.EMP_PRS_ID).trigger('change')
            if (EMP.EMP_PRS_ID != undefined) {
                $scope.Section_Week_Search.EMPLOYEES.push(EMP);
            }

            EMP.ACTIVE ? $('#js-section-templating').val(EMP.TABLE_ID).trigger('change') : null;

            var ShtList = $scope.SHIFT_TYPES.filter(function (x) { return x.IS_DEFAULT });
            if (ShtList.length > 0) {
                $scope.Section_Week_Search.SHIFT_TYPE_ID = ShtList[0].SHIFT_TYPE_ID;
                $scope.Section_Week_Search.SHIFT_TYPE = ShtList[0].SHIFT_TYPE;
                $('#js-shifttype-templating').val(ShtList[0].SHIFT_TYPE_ID).trigger('change');
            }
            else {
                $('#js-shifttype-templating').val(null).trigger('change');
            }
            $scope.Section_Week_Search.BRANCH_ID = EMP.BRANCH_ID;
        }

        $scope.Section_Week_Search.OFF_DAY = Cell.OFF_DAY != undefined ? Cell.OFF_DAY : false;

        //$scope.ADD_BREAK();

        $scope.ADMIN_GET_SHIFT_TYPES(1);
        $scope.ADMIN_GET_SHIFT_TAGS();

        $('#AddCustomScroll').find('.dropdown-menu').addClass('custom-scrollbar');
        $('#AddSectionScroll').find('.dropdown-menu').addClass('custom-scrollbar');
        $scope.FY_CHANGE = 1;
        $(".lvl-over").removeClass("lvl-over");
    };

    $scope.displayTemplate = function (selection) {
        return '<span class="fa fa-user text-danger"></span> as formated selection';
    };
    $scope.resultTemplate = function (result) {
        return '<img  class="profile-pic" src="https://app.wenodo.com/Uploads//Customer/Entity/20210720174737931_Restratech-Logo.png" style="height:10px;width:10px">' + result.text + ' formated result</span>';
    };
    $scope.MULTIPLE_SHIFTS = function (EMP, SHIFT, CELL) {
        $('#Multiple_Shifts').modal('show');
        $scope.MULTI_SHIFT = [];
        $scope.MULTI_SHIFT = SHIFT;
        $scope.SELECTED_EMPLOYEE = EMP;
        $scope.SELECTED_CELL = CELL;

    };
    $scope.openNav = function (EMP) {
        //    $scope.SELECTED_EMPLOYEE = EMP;
        document.getElementById("mySidenav").style.width = "40%";
        document.getElementById("mySidenav").style.zIndex = "1599";
    };
    $scope.closeNav = function (FLAG) {
        //  $scope.SELECTED_EMPLOYEE = '';
        if (FLAG != undefined) { $scope.BREAK_LIST = []; $scope.ACTUAL_BREAK_LIST = []; }
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("mySidenav").style.zIndex = "-1";
    };
    $scope.selectChangeEmployeeTypeAhead = function (EMP) {
        $scope.Section_Week_Search.EMPLOYEES == undefined ? $scope.Section_Week_Search.EMPLOYEES = [] : '';
        var IS_VALID = true
        for (var j = 0; j < $scope.Section_Week_Search.EMPLOYEES.length; j++) {
            if ($scope.Section_Week_Search.EMPLOYEES[j].EMP_PRS_ID == EMP.EMP_PRS_ID) {
                $scope.$parent.ShowAlert('Error', $scope.Section_Week_Search.EMPLOYEES[j].EMPLOYEE_NAME + ' is Already Selected...!!!', 7000);
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                IS_VALID = false;
                break;
            }
        }
        if (IS_VALID) {
            $scope.Section_Week_Search.EMPLOYEES.push(EMP);
            $('#EmployeeSearchBox').val('');
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
            $scope.Section_Week_Search.IS_MULTI_SELECTED = true;
            if ($scope.Section_Week_Search.EMPLOYEES.length == 1) {
                $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -1 || $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -2 ? $scope.Section_Week_Search.EMPTY_SHIFT = false : $scope.Section_Week_Search.EMPTY_SHIFT = true;
                $scope.Section_Week_Search.IS_MULTI_SELECTED = false;
                $scope.Section_Week_Search.EMPLOYEE_NAME = $scope.Section_Week_Search.EMPLOYEES[0].EMPLOYEE_NAME;
                $scope.Section_Week_Search.EMP_PRS_ID = $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID;
                $scope.SELECTED_EMPLOYEE = $scope.Section_Week_Search.EMPLOYEES[0];
                if ($scope.Section_Week_Search.END_TIME != true && $scope.Section_Week_Search.END_TIME != '' && $scope.Section_Week_Search.END_TIME != null && $scope.Section_Week_Search.END_TIME != undefined && $scope.Section_Week_Search.START_TIME != '' && $scope.Section_Week_Search.START_TIME != null && $scope.Section_Week_Search.START_TIME != undefined && $scope.Section_Week_Search.START_TIME != true) {
                    $scope.ROTA_GET_SHIFT_COST_DETAILS($scope.SELECTED_SHIFT);
                }
            }
        }


    };
    $scope.selectEmployeeTypeAhead = function (EMP) {
        // $scope.EMPLOYEE_FOCUS = true;f
        if (EMP.IS_DEACTIVATED) {
            $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
            $('#EmployeeSearchBox').val('');
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
        }
        else if (!EMP.IS_NOT_JOIN_YET) {
            $scope.$parent.ShowAlert("Warning", "Employee Not join", 3000)
            $('#EmployeeSearchBox').val('');
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
        }
        else {
            $scope.Section_Week_Search.EMPLOYEES == undefined ? $scope.Section_Week_Search.EMPLOYEES = [] : '';
            var IS_VALID = true
            for (var j = 0; j < $scope.Section_Week_Search.EMPLOYEES.length; j++) {
                if ($scope.Section_Week_Search.EMPLOYEES[j].EMP_PRS_ID == EMP.EMP_PRS_ID) {
                    $scope.$parent.ShowAlert('Error', $scope.Section_Week_Search.EMPLOYEES[j].EMPLOYEE_NAME + ' is Already Selected...!!!', 7000);
                    $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                    IS_VALID = false;
                    break;
                }
            }
            if (IS_VALID) {
                $scope.Section_Week_Search.EMPLOYEES.push(EMP);
                $('#EmployeeSearchBox').val('');
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                $scope.Section_Week_Search.IS_MULTI_SELECTED = true;
                if ($scope.Section_Week_Search.EMPLOYEES.length == 1) {
                    $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -1 || $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -2 ? $scope.Section_Week_Search.EMPTY_SHIFT = false : $scope.Section_Week_Search.EMPTY_SHIFT = true;
                    $scope.Section_Week_Search.IS_MULTI_SELECTED = false;
                    $scope.Section_Week_Search.EMPLOYEE_NAME = $scope.Section_Week_Search.EMPLOYEES[0].EMPLOYEE_NAME;
                    $scope.Section_Week_Search.EMP_PRS_ID = $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID;
                    $scope.SELECTED_EMPLOYEE = $scope.Section_Week_Search.EMPLOYEES[0];
                    if ($scope.Section_Week_Search.END_TIME != true && $scope.Section_Week_Search.END_TIME != '' && $scope.Section_Week_Search.END_TIME != null && $scope.Section_Week_Search.END_TIME != undefined && $scope.Section_Week_Search.START_TIME != '' && $scope.Section_Week_Search.START_TIME != null && $scope.Section_Week_Search.START_TIME != undefined && $scope.Section_Week_Search.START_TIME != true) {
                        $scope.ROTA_GET_SHIFT_COST_DETAILS($scope.SELECTED_SHIFT);
                    }
                }
            }
        }
        // angular.element('#EmployeeSearchBox').trigger('focus');
    };
    $scope.DeleteFromSelectedEmployeeType = function (index, CATEGORY) {
        $scope.Section_Week_Search.EMPLOYEES.splice(index, 1);
        $scope.Section_Week_Search.IS_MULTI_SELECTED = true;
        if ($scope.Section_Week_Search.EMPLOYEES.length == 1) {
            $scope.Section_Week_Search.IS_MULTI_SELECTED = false;
            $scope.Section_Week_Search.EMPLOYEE_NAME = $scope.Section_Week_Search.EMPLOYEES[0].EMPLOYEE_NAME;
            $scope.Section_Week_Search.EMP_PRS_ID = $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID;
            $scope.SELECTED_EMPLOYEE = $scope.Section_Week_Search.EMPLOYEES[0];
            $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -1 || $scope.Section_Week_Search.EMPLOYEES[0].EMP_PRS_ID == -2 ? $scope.Section_Week_Search.EMPTY_SHIFT = false : $scope.Section_Week_Search.EMPTY_SHIFT = true;
            if ($scope.Section_Week_Search.END_TIME != '' && $scope.Section_Week_Search.END_TIME != null && $scope.Section_Week_Search.END_TIME != undefined && $scope.Section_Week_Search.START_TIME != '' && $scope.Section_Week_Search.START_TIME != null && $scope.Section_Week_Search.START_TIME != undefined) {
                $scope.ROTA_GET_SHIFT_COST_DETAILS($scope.SELECTED_SHIFT);
            }
        }
    };

    $(document).on('change', 'select#js-section-templating', function (e) {
        if (this.value != "") {
            $('#INWHICHSECTION').removeClass('error');
            var TABLE_ID = parseInt(this.value);
            if (parseInt(TABLE_ID) < 0) {
                var item = $scope.BRANCH_AND_SECTION_LIST.filter(function (x) { return x.BRANCH_ID == -1 * parseInt(TABLE_ID) });
                $scope.Section_Week_Search.SECTION_NAME = item[0].SECTION_NAME;
                $scope.Section_Week_Search.SECTION_ID = -1 * item[0].BRANCH_ID;
                $scope.Section_Week_Search.BRANCH_ID = -1 * item[0].BRANCH_ID;
            }
            else {
                var item = $scope.BRANCH_AND_SECTION_LIST.filter(function (x) { return x.SECTION_ID == TABLE_ID });
                $scope.Section_Week_Search.SECTION_NAME = item[0].SECTION_NAME;
                $scope.Section_Week_Search.SECTION_ID = item[0].SECTION_ID;
                $scope.Section_Week_Search.BRANCH_ID = item[0].BRANCH_ID;
            }
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
        else {
            $scope.Section_Week_Search.SECTION_NAME = '';
            $scope.Section_Week_Search.SECTION_ID = '';
            $scope.Section_Week_Search.BRANCH_ID = '';
        }
    });
    $(document).on('change', 'select#js-employee-templating', function (e) {
        if (this.value != "") {
            var EMP_PRS_ID = parseInt(this.value);
            var IS_VALID = true;
            $scope.Section_Week_Search.EMP_PRS_ID = EMP_PRS_ID;

            //if ($scope.SELECTED_CELL.SHIFT_TEXT == 'Add') {
            //    var SELECTED_EMP = $scope.EMP_LIST_DDL.filter(function (x) { return x.EMP_PRS_ID == EMP_PRS_ID });
            //    $scope.selectChangeEmployeeTypeAhead(SELECTED_EMP);
            //}
            //else {
            var SELECTED_EMP = $scope.EMPLOYEE_LIST_UNIQUE.filter(function (x) { return x.EMP_PRS_ID == EMP_PRS_ID });
            if (SELECTED_EMP != undefined && SELECTED_EMP.length > 0 && SELECTED_EMP[0].TERMINATION_DATE != null && new Date(SELECTED_EMP[0].TERMINATION_DATE) < new Date($scope.SELECTED_CELL.NewDate)) {
                IS_VALID = false;
                SELECTED_EMP[0].IS_DEACTIVATED = true;
                $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                $scope.Section_Week_Search.EMP_PRS_ID = '';
                $scope.SELECTED_EMPLOYEE = '';
                $('#js-employee-templating').val(null).trigger('change');
            }
            if (SELECTED_EMP != undefined && SELECTED_EMP.length > 0 && SELECTED_EMP[0].START_DATE != null && new Date(SELECTED_EMP[0].START_DATE) > new Date($scope.SELECTED_CELL.NewDate)) {
                IS_VALID = false;
                $scope.$parent.ShowAlert("Warning", "Employee not join yet", 3000)
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                $scope.Section_Week_Search.EMP_PRS_ID = '';
                $scope.SELECTED_EMPLOYEE = '';
                $('#js-employee-templating').val(null).trigger('change');
            }
            if (IS_VALID) {
                $('#WHOISWORKING').removeClass('error');
                $scope.Section_Week_Search.EMPLOYEE_NAME = SELECTED_EMP[0].EMPLOYEE_NAME;
                $scope.Section_Week_Search.EMP_PRS_ID = SELECTED_EMP[0].EMP_PRS_ID;
                $scope.SELECTED_EMPLOYEE = SELECTED_EMP[0];
                if ($scope.FY_CHANGE == 1) {
                    EMP_PRS_ID == -1 || EMP_PRS_ID == -2 ? $scope.Section_Week_Search.EMPTY_SHIFT = false : $scope.Section_Week_Search.EMPTY_SHIFT = true;
                    $scope.NG_CHANGE_COST = 1;
                    $scope.Section_Week_Search.EMPLOYEES = [];
                    $scope.Section_Week_Search.EMPLOYEES.push($scope.SELECTED_EMPLOYEE);
                };
            }
            //  }
            if (!$scope.$$phase) {
                $scope.$apply()
            }
        }
        else {
            $scope.Section_Week_Search.EMPLOYEE_NAME = '';
            $scope.Section_Week_Search.EMP_PRS_ID = '';
            $scope.SELECTED_EMPLOYEE = '';
        }
    });
    $(document).on('change', 'select#js-shifttype-templating', function (e) {
        if (this.value != "") {
            $('#SHIFT_TYPE_NAME').removeClass('error');
            var TABLE_ID = parseInt(this.value);
            var item = $scope.FINAL_SHIFT_TYPES.filter(function (x) { return x.id == TABLE_ID });
            $scope.Section_Week_Search.SHIFT_NAME = item[0].text;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = item[0].id;
            if ($scope.FY_CHANGE == 1) {
                $scope.NG_CHANGE_COST = 1;
            };
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }
        else {
            $scope.Section_Week_Search.SHIFT_NAME = '';
            $scope.Section_Week_Search.SHIFT_TYPE_ID = '';
        }
    });
    $(document).on('change', 'select#js-employee-templating_add', function (e) {
        if (this.value != "") {
            var EMP_PRS_ID = parseInt(this.value);
            var SELECTED_EMP = $scope.EMP_LIST_DDL.filter(function (x) { return x.EMP_PRS_ID == EMP_PRS_ID });

            if (!$scope.$$phase) {
                $scope.$apply()
            }
        }
    });

    $scope.selectTemplateTypeAhead = function (item) {
        $scope.Section_Week_Search.TEMPLATE_NAME = item.TEMPLATE_NAME;
        $scope.Section_Week_Search.TEMPLATE_ID = item.ROTA_TEMPLATE_ID;
    }
    $scope.selectSectionTypeAhead = function (item) { }
    $scope.selectShiftTypeAhead = function (item, FLAG, EL, Shift) {
        $scope.Section_Week_Search.SHIFT_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.SHIFT_TYPE_ID = item.TABLE_ID;
        if (FLAG == 1) {
            Shift.FILTER_SWTICH_ON_OFF = false;
            $scope.EDIT_SHIFT_POP(EL, Shift);
        }
    }

    function LoadShiftType(FLAG) {
        $scope.FINAL_SHIFT_TYPES = [];
        angular.forEach($scope.SHIFT_TYPES, function (x) {
            var stype = new Object()
            stype.id = x.TABLE_ID;
            stype.text = x.DISPLAY_TEXT;
            stype.html = '<a class="text-sm d-inline-block"><i class="fas fa-square mr-2" style="color:#' + x.COLOR + '" ></i><div class="d-inline">' + x.DISPLAY_TEXT + '</div></a>';
            $scope.FINAL_SHIFT_TYPES.push(stype);
        });

        $("#js-shifttype-templating").select2({
            placeholder: 'Select Shift Type',
            allowClear: false,
            data: $scope.FINAL_SHIFT_TYPES,
            templateResult: template,
            escapeMarkup: function (m) {
                return m;
            }
        });
        if (FLAG == 1) {
            var ShtList = $scope.SHIFT_TYPES.filter(function (x) { return x.IS_DEFAULT });
            if (ShtList.length > 0) {
                $scope.Section_Week_Search.SHIFT_TYPE_ID = ShtList[0].SHIFT_TYPE_ID;
                $scope.Section_Week_Search.SHIFT_TYPE = ShtList[0].SHIFT_TYPE;
            }
            $('#js-shifttype-templating').val(ShtList[0].SHIFT_TYPE_ID).trigger('change');
        }
    }

    $scope.ADMIN_GET_SHIFT_TYPES = function (FLAG) {
        if ($scope.SHIFT_TYPES == undefined || $scope.SHIFT_TYPES.length == 0) {
            ShiftModelObj = new Object();
            ShiftModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));;
            ShiftModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            ShiftModelObj.ACTIVE = 1;
            ShiftModelObj.SHIFT_TYPE = '';
            ShiftModelObj.PAGE_NO = 0;
            ShiftModelObj.PAGE_SIZE = 999;
            ShiftModelObj.IS_DEFAULT = -1;
            PrcCommMethods.ADMIN_API(ShiftModelObj, 'ADMIN_GET_SHIFT_TYPES').then(function (data) {
                if (data.data.Table.length > 0) {
                    $scope.SHIFT_TYPES = data.data.Table;
                    $scope.FINAL_SHIFT_TYPES = [];
                    LoadShiftType(FLAG)
                }
                else {
                    $scope.SHIFT_TYPES = [];
                    LoadShiftType(FLAG)
                }

            });
        }
        else {
            LoadShiftType(FLAG);
        }
    };
    $scope.ADMIN_GET_SHIFT_TYPES();

    $scope.CHECK_MULTI_SHFIT_SAME_DATE = function () {
        var Array1 = $scope.UNPUBLISH_SHIFT_LIST.concat($scope.EMTY_SHIFT_LIST);
        var APPROVE_SHIFT_ARRAY = Array1.concat($scope.PUBLISH_SHIFT_LIST);
        $scope.EDIT_MULTI_SHIFT_LIST = APPROVE_SHIFT_ARRAY;
        $scope.DUPLICATE_EMP = [];
        angular.forEach($scope.EDIT_MULTI_SHIFT_LIST, function (x) {
            var List = APPROVE_SHIFT_ARRAY.filter(function (Shift) { return Shift.EMP_PRS_ID == x.EMP_PRS_ID && x.Days == Shift.Days && Shift.SHIFT_SELECTED == x.SHIFT_SELECTED });
            if (List.length > 1) {
                $scope.DUPLICATE_EMP = $scope.DUPLICATE_EMP.concat(List);
            }
        })
    }
    $scope.DESELECTED_LOGIN_LOGOUT = function () {
        angular.forEach($scope.LOGIN_LIST, function (x) {
            x.SHIFT_SELECTED = false;
        })
        angular.forEach($scope.LOGIN_LOGOUT_LIST, function (x) {
            x.SHIFT_SELECTED = false;
        })
        //if (VIEW_NAME == 'EMP_VIEW') {
        $scope.Schedulerchild.ROTA_MULTIPLE_SHIFTS_CHECKBOX();
        //}
    }

    $scope.EDIT_MULTI_SHIFT_POP = function () {
        $('#Edit_Multiple_Shifts').modal('show');
        $scope.Section_Week_Search.SHIFT_MASTER_ID = '';
        $scope.ADMIN_GET_SHIFT_TYPES();
        var Array1 = $scope.UNPUBLISH_SHIFT_LIST.concat($scope.EMTY_SHIFT_LIST);
        var APPROVE_SHIFT_ARRAY = Array1.concat($scope.PUBLISH_SHIFT_LIST);
        $scope.EDIT_MULTI_SHIFT_LIST = APPROVE_SHIFT_ARRAY;
        var APPROVE_SHIFT_ARRAY_UNIQUE = $filter('unique')(APPROVE_SHIFT_ARRAY, 'EMP_PRS_ID');
        $scope.DUPLICATE_EMP = [];
        angular.forEach(APPROVE_SHIFT_ARRAY_UNIQUE, function (x) {
            var List = APPROVE_SHIFT_ARRAY.filter(function (Shift) { return Shift.EMP_PRS_ID == x.EMP_PRS_ID && x.Days == Shift.Days && Shift.SHIFT_SELECTED == x.SHIFT_SELECTED });
            if (List.length > 1) {
                $scope.DUPLICATE_EMP = $scope.DUPLICATE_EMP.concat(List);
            }
        })
        if (APPROVE_SHIFT_ARRAY.length > 1) {
            $scope.Section_Week_Search.APPROVE_START_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_END_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = null;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = null;

        }
        if (APPROVE_SHIFT_ARRAY.length == 1) {
            var START_TIME = moment(APPROVE_SHIFT_ARRAY[0].START_TIME);
            var END_TIME = moment(APPROVE_SHIFT_ARRAY[0].END_TIME);
            $scope.Section_Week_Search.APPROVE_START_TIME = moment(START_TIME, 'HH:mm:ss');
            $scope.Section_Week_Search.APPROVE_END_TIME = moment(END_TIME, 'HH:mm:ss');
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = APPROVE_SHIFT_ARRAY[0].SHIFT_TYPE
            $scope.Section_Week_Search.SHIFT_TYPE_ID = APPROVE_SHIFT_ARRAY[0].SHIFT_TYPE_ID
        }
        if (APPROVE_SHIFT_ARRAY.length == 0) {
            $scope.Section_Week_Search.APPROVE_START_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_END_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = null;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = null;
        }
    };
    $scope.EDIT_MULTI_SHIFT = function (Form_Edit_Multiple_Shifts, VIEW_NAME) {
        Form_Edit_Multiple_Shifts.submitted = true;
        if (Form_Edit_Multiple_Shifts.$valid) {
            if (confirm('Are you Sure?')) {
                var Array1 = $scope.UNPUBLISH_SHIFT_LIST.concat($scope.EMTY_SHIFT_LIST);
                var APPROVE_SHIFT_ARRAY = Array1.concat($scope.PUBLISH_SHIFT_LIST);
                $scope.ROTA_UPD_MULTIPLE_SHIFTS(Form_Edit_Multiple_Shifts, 1, VIEW_NAME, APPROVE_SHIFT_ARRAY);
            }
        }
    }

    $scope.LOGIN_SHIFT_POP = function (EMP, Shift, VIEW_NAME, LOGIN_OR_LOGOUT_FLAG, CELL) {//0 for login,1 for logout 
        if ($scope.SETTING_VALUE_41 == "1") {
            $('#Login_Shift').modal('show');
            LOGIN_OR_LOGOUT_FLAG == 0 ? $scope.Section_Week_Search.LOGIN_OR_LOGOUT_TEXT = 'Login' : $scope.Section_Week_Search.LOGIN_OR_LOGOUT_TEXT = ' Logout';
            $scope.Section_Week_Search.EMPLOYEE_NAME_LOGIN = EMP.EMPLOYEE_NAME;
            $scope.Section_Week_Search.EMPLOYEE_NOTES = EMP.NOTES;
            $scope.SELECTED_SHIFT = Shift;
            $scope.SELECTED_CELL = CELL;
            $scope.SELECTED_EMP = EMP;
            $scope.SELECTED_VIEW = VIEW_NAME;
            if (Shift.LOGIN_LOGOUT_DETAILS == null || Shift.LOGIN_LOGOUT_DETAILS.length == 0) {
                $scope.Section_Week_Search.LOGIN_START_TIME = moment(Shift.START_TIME);
                $scope.Section_Week_Search.LOGIN_DISPLAY_START_TIME = angular.copy(new Date(Shift.START_TIME));
                $scope.LOGIN_DISPLAY_TEXT = "Start Time";
            }
            if (Shift.LOGIN_LOGOUT_DETAILS.length > 0) {
                $scope.Section_Week_Search.LOGIN_START_TIME = moment(Shift.END_TIME);
                $scope.Section_Week_Search.LOGIN_DISPLAY_START_TIME = angular.copy(new Date(Shift.END_TIME));
                $scope.LOGIN_DISPLAY_TEXT = "Finish Time";
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Clock In & Out services has been disabled on this app. Please contact admin', 3000);
        }
        //$scope.startDateMoment = moment().add(2, 'month');
    };
    $scope.ROTA_UPD_MULTIPLE_SHIFTS = function (Form_Edit_Multiple_Shifts, FLAG, VIEW_NAME, APPROVE_SHIFT_ARRAY) {
        var SHIFT_ARRAY = [];
        if (VIEW_NAME == "AREA_VIEW") {
            APPROVE_SHIFT_ARRAY = $filter('unique')(APPROVE_SHIFT_ARRAY, 'SHIFT_ID');
        }
        angular.forEach(APPROVE_SHIFT_ARRAY, function (val) {
            var obj = new Object();
            obj.TABLE_ID = val.SHIFT_ID;
            SHIFT_ARRAY.push(obj);
        })
        ModelObj = new Object();
        ModelObj.SHIFT_IDS = SHIFT_ARRAY;
        ModelObj.SHIFT_TYPE_ID = $scope.Section_Week_Search.EDIT_SHIFT_TYPE_ID;
        ModelObj.COMMENTS = $scope.Section_Week_Search.EDIT_COMMENTS;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.SECTION_ID = $scope.Section_Week_Search.EDIT_SECTION_TYPE_ID;
        ModelObj.TODAY_DATE = (new Date($scope.TODAY_DATE)).toDateString();;
        if ($scope.Section_Week_Search.EDIT_START_TIME == undefined || $scope.Section_Week_Search.EDIT_START_TIME == null || $scope.Section_Week_Search.EDIT_START_TIME == '') {
            ModelObj.START_TIME_MULTI = null;
        }
        else {
            ModelObj.START_TIME_MULTI = $scope.$parent.changeTimezone(new Date($scope.Section_Week_Search.EDIT_START_TIME));
        }
        if ($scope.Section_Week_Search.EDIT_END_TIME == undefined || $scope.Section_Week_Search.EDIT_END_TIME == null || $scope.Section_Week_Search.EDIT_END_TIME == '') {
            ModelObj.END_TIME_MULTI = null;
        }
        else {
            ModelObj.END_TIME_MULTI = $scope.$parent.changeTimezone(new Date($scope.Section_Week_Search.EDIT_END_TIME));
        }
        ModelObj.FLAG = FLAG;
        ModelObj.SHIFT_MASTER_ID = $scope.Section_Week_Search.SHIFT_MASTER_ID;
        Form_Edit_Multiple_Shifts.submitted = false;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        /*@PI_FLAG 1 FOR UPDATE MULTIPLE SHIFTS 2 FOR DELETE MULTIPLE SHIFTS 3 FOR SET TO OPEN */
        PrcCommMethods.HR_API(ModelObj, 'ROTA_UPD_MULTIPLE_SHIFTS').then(function (data) {
            $scope.APPROVE_SHIFT_ARRAY = [];
            $('#Edit_Multiple_Shifts').modal('hide');
            $('#Approve_Multiple_Shifts').modal('hide');
            $('#Delete_Multi_Shift').modal('hide');
            $('#Set_Shifts_To_Open').modal('hide');
            $scope.Section_Week_Search.EDIT_START_TIME = '';
            $scope.Section_Week_Search.EDIT_END_TIME = '';
            $scope.Section_Week_Search.EDIT_SECTION_NAME = '';
            $scope.Section_Week_Search.EDIT_SECTION_TYPE_ID = '';
            $scope.Section_Week_Search.EDIT_SHIFT_NAME = '';
            $scope.Section_Week_Search.EDIT_SHIFT_TYPE_ID = '';
            if (data.data == 1) {
                if (VIEW_NAME == "EMP_VIEW") {
                    $scope.Schedulerchild.PAGE_LOAD_FY();
                }
                if (VIEW_NAME == "AREA_VIEW") {
                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                    if ($scope.APPROVE_SHIFT_ARRAY.length == 0) {
                        $scope.Schedulerchild.SHIFT_COUNT = 0;
                        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
                    }
                }
                if (FLAG == 1) {
                    $scope.$parent.ShowAlert("Success", "Shift Update Successfully", 3000);
                }
                if (FLAG == 2) {
                    $scope.$parent.ShowAlert("Success", "Shift Delete Successfully", 3000);
                }
                if (FLAG == 3) {
                    $scope.$parent.ShowAlert("Success", "Shift Open Successfully", 3000);
                }
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.APPROVE_SHIFT_POP = function () {
        $scope.ADMIN_GET_SHIFT_TYPES();
        $('#Approve_Multiple_Shifts').modal('show');
        var APPROVE_SHIFT_ARRAY = $scope.LOGIN_LOGOUT_LIST;
        APPROVE_SHIFT_ARRAY = APPROVE_SHIFT_ARRAY.filter(x => x.EMPTY_OPEN_FLAG != -1 && x.EMPTY_OPEN_FLAG != -2);
        if (APPROVE_SHIFT_ARRAY.length > 1) {
            $scope.Section_Week_Search.APPROVE_START_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_END_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = null;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = null;
        }
        if (APPROVE_SHIFT_ARRAY.length == 1) {
            var START_TIME = moment(APPROVE_SHIFT_ARRAY[0].START_TIME);
            var END_TIME = moment(APPROVE_SHIFT_ARRAY[0].END_TIME);
            $scope.Section_Week_Search.APPROVE_START_TIME = moment(START_TIME, 'HH:mm:ss');
            $scope.Section_Week_Search.APPROVE_END_TIME = moment(END_TIME, 'HH:mm:ss');
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = APPROVE_SHIFT_ARRAY[0].SHIFT_TYPE
            $scope.Section_Week_Search.SHIFT_TYPE_ID = APPROVE_SHIFT_ARRAY[0].SHIFT_TYPE_ID
        }
        if (APPROVE_SHIFT_ARRAY.length == 0) {
            $scope.Section_Week_Search.APPROVE_START_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_END_TIME = '00:00';
            $scope.Section_Week_Search.APPROVE_SHIFT_NAME = null;
            $scope.Section_Week_Search.SHIFT_TYPE_ID = null;
        }
    }
    $scope.APPROVE_SHIFT_FY = function (Form_Approve_Multiple_Shifts, VIEW_NAME) {
        $scope.ROTA_APPROVE_MULTIPLE_SHIFTS(1, VIEW_NAME, $scope.LOGIN_LOGOUT_LIST);
        Form_Approve_Multiple_Shifts.submitted = false;
    }

    $scope.DELETE_MULTIPLE_SHIFTS = function (FLAG, VIEW_NAME) {
        if (confirm('Are you Sure?')) {
            $scope.ROTA_UPD_MULTIPLE_SHIFTS('', 2, VIEW_NAME, $scope.DELETE_SHIFT_LIST);
            $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
        }
    }
    $scope.DELETE_MULTIPLE_SHIFTS_POP = function (FLAG, VIEW_NAME) {
        $('#Delete_Multi_Shift').modal('show');
    }

    $scope.SET_SHIFT_TO_OPEN_SINGLE = function (SHIFT_ID, VIEW_NAME) {
        if (confirm('Are your sure?')) {
            var SHIFT_ARRAY = [];
            var obj = new Object();
            obj.TABLE_ID = SHIFT_ID;
            SHIFT_ARRAY.push(obj);
            ModelObj = new Object();
            ModelObj.SHIFT_IDS = SHIFT_ARRAY;
            ModelObj.SHIFT_TYPE_ID = null;
            ModelObj.COMMENTS = null;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.SECTION_ID = null;
            ModelObj.FLAG = 3;
            ModelObj.SHIFT_MASTER_ID = null;
            ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
            /*@PI_FLAG 1 FOR UPDATE MULTIPLE SHIFTS 2 FOR DELETE MULTIPLE SHIFTS 3 FOR SET TO OPEN */
            PrcCommMethods.HR_API(ModelObj, 'ROTA_UPD_MULTIPLE_SHIFTS').then(function (data) {
                $scope.APPROVE_SHIFT_ARRAY = [];
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Shift Open Successfully", 3000);
                    if (VIEW_NAME == "EMP_VIEW") {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                        $('#Multiple_Shifts').modal('hide');
                    }
                    if (VIEW_NAME == "AREA_VIEW") {
                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);

                        $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                        $scope.Schedulerchild.SHIFT_COUNT = 0;
                        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
                    }


                };
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }
    $scope.SET_TO_OPEN_MULTIPLE_POP = function (FLAG, VIEW_NAME) {
        $('#Set_Shifts_To_Open').modal('show');
    }
    $scope.SET_TO_OPEN_MULTIPLE_FY = function (FLAG, VIEW_NAME) {
        if (confirm('Are you Sure?')) {
            $scope.ROTA_UPD_MULTIPLE_SHIFTS('', 3, VIEW_NAME, $scope.SET_SHIFT_TO_OPEN_LIST);
        }
    }
    $scope.NO_SHOW_REASONS_LIST = [];
    $scope.ROTA_GET_NO_SHOW_REASONS = function () {
        var ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_NO_SHOW_REASONS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.NO_SHOW_REASONS_LIST = data.data.Table;
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.NO_SHOW_ROTA_SHIFTS_FY = function (AssignShift_Form, WHERE_CLICK, EL, shift, FLAG, CELL) {
        $('#NO_SHOW_POP').modal('show');
        $scope.SELECTED_SHIFT = shift;
        $scope.SELECTED_EMPLOYEE = angular.copy(EL);
        $scope.SELECTED_CELL = CELL;
        $scope.Section_Week_Search.SHIFT_ID = shift.SHIFT_ID;
        $scope.Section_Week_Search.EMP_PRS_ID = EL.EMP_PRS_ID;
        $scope.Section_Week_Search.NO_SHOW_COMMENTS = '';
        $scope.ROTA_GET_NO_SHOW_REASONS();
    }



    $scope.ROTA_MARK_AND_REVERT_NO_SHOW = function (SELECTED_EMPLOYEE, SELECTED_SHIFT, VIEW_NAME, NoShow_Form) {
        NoShow_Form.submitted = true;
        if (NoShow_Form.$valid) {
            ModelObj = new Object();
            ModelObj.TABLE_ID_LIST = [];
            var obj = new Object();
            obj.TABLE_ID = $scope.Section_Week_Search.SHIFT_ID
            ModelObj.TABLE_ID_LIST.push(obj);
            ModelObj.COMMENTS = $scope.Section_Week_Search.NO_SHOW_COMMENTS;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            let ROTA_MARK_NO_SHOW = "ROTA_MARK_NO_SHOW";
            if (SELECTED_SHIFT.STATUS_ID == 24) {
                ROTA_MARK_NO_SHOW = "ROTA_REVERT_NO_SHOW";
            }
            ModelObj.START_DATE = new Date($scope.SHIFT_CELDER_START_DATE).toDateString();
            ModelObj.END_DATE = new Date($scope.SHIFT_CELDER_END_DATE).toDateString();
            ModelObj.VIEW_TYPE = VIEW_NAME == "EMP_VIEW" || VIEW_NAME == "AREA_VIEW" ? 2 : '';
            ModelObj.ROTA_NO_SHOW_REASONS_ID = $scope.Section_Week_Search.ROTA_NO_SHOW_REASONS_ID;
            PrcCommMethods.HR_API(ModelObj, ROTA_MARK_NO_SHOW).then(function (data) {
                $('#NO_SHOW_POP').modal('hide');
                $scope.Section_Week_Search.SHIFT_ID = '';
                $scope.Section_Week_Search.EMP_PRS_ID = '';
                $scope.Section_Week_Search.NO_SHOW_COMMENTS = '';
                $scope.Section_Week_Search.ROTA_NO_SHOW_REASONS_ID = null;
                if (data.data == 1) {
                    if (VIEW_NAME == "EMP_VIEW") {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                    }
                    if (VIEW_NAME == "AREA_VIEW") {
                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    }
                    if (SELECTED_SHIFT.STATUS_ID == 24) {
                        $scope.$parent.ShowAlert("Success", "Shift No Show Revert Successfully", 3000);
                        SELECTED_SHIFT.STATUS_ID = 22
                        $scope.SELECTED_SHIFT.STATUS_ID = 22
                    }
                    else {
                        $scope.$parent.ShowAlert("Success", "Shift No Show Successfully", 3000);
                        SELECTED_SHIFT.STATUS_ID = 24
                        $scope.SELECTED_SHIFT.STATUS_ID = 24
                    }
                    $scope.SELECTED_SHIFT = "";
                    $scope.SELECTED_EMPLOYEE = "";
                    NoShow_Form.submitted = false;
                };
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    }

    $scope.ROTA_APPROVE_MULTIPLE_SHIFTS = function (FLAG, VIEW_NAME, APPROVE_SHIFT_ARRAY) {
        var SHIFT_ARRAY = [];
        // var APPROVE_SHIFT_ARRAY = $filter('unique')($scope.APPROVE_SHIFT_ARRAY, 'SHIFT_ID');
        if ($scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT == 1) {
            angular.forEach($scope.PUBLISH_SHIFT_LIST, function (val) {
                var obj = new Object();
                obj.TABLE_ID = val.SHIFT_ID;
                SHIFT_ARRAY.push(obj);
            });
        }

        angular.forEach(APPROVE_SHIFT_ARRAY, function (val) {
            var obj = new Object();
            obj.TABLE_ID = val.SHIFT_ID;
            SHIFT_ARRAY.push(obj);
        });
        ModelObj = new Object();
        ModelObj.SHIFT_IDS_TABLE = SHIFT_ARRAY;
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        ModelObj.COMMENTS = $scope.Section_Week_Search.APPROVE_COMMENTS;
        ModelObj.SHIFT_TYPE_ID = $scope.Section_Week_Search.APPROVE_SHIFT_TYPE_ID;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_APPROVE_MULTIPLE_SHIFTS').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);

                $('#Approve_Multiple_Shifts').modal('hide');
                $scope.APPROVE_SHIFT_ARRAY = [];
                if (VIEW_NAME == "EMP_VIEW") {
                    $scope.Schedulerchild.PAGE_LOAD_FY();
                }
                if (VIEW_NAME == "AREA_VIEW") {

                    $scope.Schedulerchild.SHIFT_COUNT = 0;
                    $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
                    $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);

                }
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }
    $scope.ROTA_APPROVE_SHIFT = function (SHIFT_ID, FLAG, VIEW_NAME, APPROVE_START_TIME, APPROVE_END_TIME, APPROVE_SHIFT_TYPE_ID) {
        ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT_ID;
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.APPROVED_LOGIN_DATE = $scope.$parent.changeTimezone(new Date(APPROVE_START_TIME));
        ModelObj.APPROVED_LOGOUT_DATE = $scope.$parent.changeTimezone(new Date(APPROVE_END_TIME));

        ModelObj.SHIFT_TYPE_ID = APPROVE_SHIFT_TYPE_ID;
        ModelObj.COMMENTS = $scope.Section_Week_Search.APPROVE_COMMENTS;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_APPROVE_SHIFT').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $('#Approve_Multiple_Shifts').modal('hide');
                $('#AssignShift_Form').modal('hide');
                $('#Add_Shift').modal('hide');
                $('#Multiple_Shifts').modal('hide');


                $scope.APPROVE_SHIFT_ARRAY = [];
                if (VIEW_NAME == "EMP_VIEW") {
                    $scope.Schedulerchild.PAGE_LOAD_FY();

                }
                if (VIEW_NAME == "AREA_VIEW") {

                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                }
                document.getElementById("mySidenav").style.width = "0";
                document.getElementById("mySidenav").style.zIndex = "-1"
            };
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.BRACNH_CHANGE = function (BR) {
        $scope.BRANCH_PUBLISH_LIST.filter(function (B) {
            angular.forEach($scope.SECTIONS_PUBLISH_LIST, function (x) {
                if (x.BRANCH_ID == B.BRANCH_ID) {
                    x.IS_CHECK_SECTION_SHIFT = B.IS_BR_SELECTED;
                };
            });
        });
    }
    $scope.SECTION_CHANGE = function (SEC) {
        angular.forEach($scope.SECTIONS_PUBLISH_LIST, function (x) {
            if (!x.IS_CHECK_SECTION_SHIFT) {
                x.IS_BR_SELECTED = false;
            }
        })
    }

    $scope.PUBLISH_SECTION_CLICK = function (FLAG) {
        if (FLAG == 1) {
            $scope.SECTIONS_PUBLISH_LIST.filter(function (x) {
                x.IS_CHECK_SECTION_SHIFT = true;
            });
        }
        if (FLAG == 2) {
            $scope.SECTIONS_PUBLISH_LIST.filter(function (x) {
                x.IS_CHECK_SECTION_SHIFT = false;
            });
        }
        if (FLAG == 3) {
            $scope.SECTIONS_PUBLISH_LIST.filter(function (x) {
                x.IS_CHECK_SECTION_SHIFT = x.IS_CHECK_SECTION_SHIFT ? false : true;;
            });
        }
    }

    $scope.ngclickSetbreak = function () {

    }

    $scope.ROTA_INS_UPD_LOGIN_LOGOUT_FY = function (EL, SHIFT, VIEW_NAME, Form_Login_Shift, CELL) {
        if ($scope.SETTING_VALUE_41 == "1") {
            if (SHIFT.ON_BREAK_TABLE_ID > 0) {
                $scope.$parent.ShowAlert("Error", "Please mark " + EL.EMPLOYEE_NAME + " to break out", 3000);
            }
            else {
                Form_Login_Shift.submitted = true;
                var Count = 0;
                SHIFT.START_TIME_VALID = angular.copy(SHIFT.START_TIME);
                SHIFT.START_TIME_VALID = angular.copy(moment(SHIFT.START_TIME_VALID).subtract($scope.SHIFT_LOGIN_TOLERANCE_IN_MINUTES, "minutes").toDate());
                if (SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) {
                    if (new Date($scope.Section_Week_Search.LOGIN_START_TIME) < new Date(SHIFT.START_TIME_VALID) || new Date($scope.Section_Week_Search.LOGIN_START_TIME) > new Date(SHIFT.END_TIME)) {
                        Count++;
                        $scope.$parent.ShowAlert("Error", "Pleace check Clock-In time.\nClock-In time cannot be less than shift start time or greater than shift finish time", 3000);
                    }
                }
                if (SHIFT.LOGIN_LOGOUT_DETAILS != null && SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && SHIFT.LOGIN_LOGOUT_DETAILS[0].ROTA_LOGIN_LOGOUT_TABLE_ID != undefined) {
                    if (new Date(SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE) > new Date($scope.Section_Week_Search.LOGIN_START_TIME)) {
                        Count++
                        $scope.$parent.ShowAlert("Error", "Pleace check Clock-Out time.\nClock-Out time cannot be less than Clock-In date or greater than shift finish date", 3000);
                    }
                    //if (moment(new Date($scope.Section_Week_Search.LOGIN_START_TIME)).isAfter(new Date(SHIFT.END_TIME), 'day')) {
                    //    Count++
                    //    $scope.$parent.ShowAlert("Error", "Pleace check Clock-Out time.\nClock-Out time cannot be less than Clock-In date or greater than shift finish date", 3000);
                    //}
                }
                if (Form_Login_Shift.$valid && Count == 0) {
                    if (confirm('Are you Sure?')) {
                        var ModelObj = new Object();
                        ModelObj.TABLE_ID = SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0 ? 0 : SHIFT.LOGIN_LOGOUT_DETAILS[0].ROTA_LOGIN_LOGOUT_TABLE_ID;
                        ModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
                        if (SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) {
                            LOGIN_DATE = $scope.Section_Week_Search.LOGIN_START_TIME;
                        }
                        else {
                            LOGIN_DATE = null;
                        }
                        if (SHIFT.LOGIN_LOGOUT_DETAILS != null && SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && SHIFT.LOGIN_LOGOUT_DETAILS[0].ROTA_LOGIN_LOGOUT_TABLE_ID != undefined) {
                            LOGOUT_DATE = $scope.Section_Week_Search.LOGIN_START_TIME;
                        }
                        else {
                            LOGOUT_DATE = null;

                        }
                        ModelObj.LOGIN_DATE = LOGIN_DATE == null ? LOGIN_DATE : $scope.$parent.changeTimezone((new Date(LOGIN_DATE)));
                        ModelObj.LOGOUT_DATE = LOGOUT_DATE == null ? LOGOUT_DATE : $scope.$parent.changeTimezone((new Date(LOGOUT_DATE)));
                        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
                        ModelObj.LOGIN_INFO = "WEB" + VIEW_NAME;
                        PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_LOGIN_LOGOUT').then(function (data) {
                            if (data.data == 1) {
                                if (SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) {
                                    $scope.$parent.ShowAlert("Success", "Successfully Login", 3000);
                                }
                                else if (SHIFT.LOGIN_LOGOUT_DETAILS.length > 0) {
                                    $scope.$parent.ShowAlert("Success", "Successfully Logout", 3000);
                                }
                                if (VIEW_NAME == 'AREA_VIEW') {
                                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                                    $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                                }
                                if (VIEW_NAME == "EMP_VIEW") {
                                    $scope.Schedulerchild.PAGE_LOAD_FY();
                                }
                                SHIFT.FILTER_SWTICH_ON_OFF_4 = false;
                            }
                            if (data.data == 0) {
                                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                            }
                            $('#Login_Shift').modal('hide');
                            $('#Multiple_Shifts').modal('hide');
                        });
                    }
                }
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'Clock In & Out services has been disabled on this app. Please contact admin', 3000);
        }
    }
    $scope.ROTA_INS_UPD_LOGIN_LOGOUT = function (EL, SHIFT, VIEW_NAME, Form_Login_Shift, CELL) {
        var ModelObj = new Object();
        ModelObj.SHIFT_ID = SHIFT.SHIFT_ID;
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
        ModelObj.FLAG = 1;
        ModelObj.LOGIN_LOGOUT_FLAG = SHIFT.LOGIN_LOGOUT_DETAILS == undefined || SHIFT.LOGIN_LOGOUT_DETAILS == null || SHIFT.LOGIN_LOGOUT_DETAILS == "" ? 0 : 1;
        PrcCommMethods.HR_API(ModelObj, 'CHECK_CLOCKIN').then(function (data) {
            if (data.data.Table.length > 0 && data.data.Table[0].FLAG == 1) {
                $scope.ROTA_INS_UPD_LOGIN_LOGOUT_FY(EL, SHIFT, VIEW_NAME, Form_Login_Shift, CELL);
            };
            if (data.data.Table.length > 0 && data.data.Table[0].FLAG == 0) {
                $scope.$parent.ShowAlert("Error", data.data.Table[0].MESSAGE, 3000);
                if (VIEW_NAME == 'AREA_VIEW') {
                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    $scope.Schedulerchild.DESELECT_ALL_CHECKBOX();
                }
                if (VIEW_NAME == "EMP_VIEW") {
                    $scope.Schedulerchild.PAGE_LOAD_FY();
                }
                SHIFT.FILTER_SWTICH_ON_OFF_4 = false;
                $('#Login_Shift').modal('hide');
                $('#Multiple_Shifts').modal('hide');
            };
        });
        //}
    }

    $scope.selectEditShiftTypeAhead = function (item, FLAG, EL, Shift) {
        $scope.Section_Week_Search.EDIT_SHIFT_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.EDIT_SHIFT_TYPE_ID = item.TABLE_ID;
    };
    $scope.selectEditSectionTypeAhead = function (item) {
        $scope.Section_Week_Search.EDIT_SECTION_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.EDIT_SECTION_TYPE_ID = item.TABLE_ID;
    };

    $scope.ROTA_DELETE_TEMPLATE_FROM_SCHEDULED_SHIFTS = function (LIST, DELETE_FLAG, NAME_UPDATE_FLAG, VIEW_TYPE) {
        $scope.Section_Week_Search.TEMPLATE_ID = LIST.ROTA_TEMPLATE_ID
        $scope.Section_Week_Search.TEMPLATE_NAME = LIST.TEMPLATE_NAME
        $scope.ROTA_INS_UPD_TEMPLATE_FROM_SCHEDULED_SHIFTS(VIEW_TYPE, DELETE_FLAG, NAME_UPDATE_FLAG);
    }
    $scope.ROTA_UPD_TEMPLATE_FROM_SCHEDULED_SHIFTS = function (LIST, DELETE_FLAG, NAME_UPDATE_FLAG, VIEW_TYPE) {
        $scope.Section_Week_Search.TEMPLATE_ID = LIST.ROTA_TEMPLATE_ID
        $scope.Section_Week_Search.TEMPLATE_NAME = LIST.TEMPLATE_NAME
        $scope.ROTA_INS_UPD_TEMPLATE_FROM_SCHEDULED_SHIFTS(VIEW_TYPE, DELETE_FLAG, NAME_UPDATE_FLAG, LIST);
    }
    $scope.ROTA_INS_UPD_TEMPLATE_FROM_SCHEDULED_SHIFTS = function (VIEW_TYPE, DELETE_FLAG, NAME_UPDATE_FLAG) {
        var count = 0;
        if (DELETE_FLAG == 0 && ($scope.Section_Week_Search.TEMPLATE_NAME == '' || $scope.Section_Week_Search.TEMPLATE_NAME == null || $scope.Section_Week_Search.TEMPLATE_NAME == undefined)) {
            count = 1;
        }
        else if (DELETE_FLAG == 0 && ($scope.SHIFTS_LIST_ALL.length == undefined || $scope.SHIFTS_LIST_ALL.length == 0)) {
            count = 2;
        }
        if (count == 0) {
            if (confirm('Are you Sure?')) {
                var ModelObj = new Object();
                ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                //INT, --0 FOR ALL AND ID FOR 1 BRANCH
                ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
                ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
                ModelObj.VIEW_TYPE = VIEW_TYPE;
                //-- 1 DAY, 2 WEEK , 3 FORTNIGHT, 4 MONTH
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.BRANCH_IDS = '';
                ModelObj.SECTION_IDS = '';
                ModelObj.TEMPLATE_ID = $scope.Section_Week_Search.TEMPLATE_ID;
                ModelObj.TEMPLATE_NAME = $scope.Section_Week_Search.TEMPLATE_NAME;
                ModelObj.NAME_UPDATE_FLAG = NAME_UPDATE_FLAG;//-- 1 FOR ONLY UPDATE NAME AND 0 FOR UPDATING WHOLE TEMPLATE
                ModelObj.DELETE_FLAG = DELETE_FLAG;//-- 1 FOR DELETING TEMPLATE ELSE 0
                ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
                //-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME, 4 SELF
                ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
                ModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.FILTER_DEPARTMENT_ID == undefined ? '' : $scope.Section_Week_Search.FILTER_DEPARTMENT_ID;
                PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_TEMPLATE_FROM_SCHEDULED_SHIFTS').then(function (data) {
                    if (data.data == 1) {
                        if (DELETE_FLAG == 1) {
                            $scope.FILTER_SWTICH_ON_OFF_FY(2)
                            $scope.$parent.ShowAlert("Success", "Template Delete Successfully", 3000);
                        }
                        if (NAME_UPDATE_FLAG == 1) {
                            $scope.FILTER_SWTICH_ON_OFF_FY(2)
                            $scope.$parent.ShowAlert("Success", "Template Update Successfully", 3000);
                        }
                        if (NAME_UPDATE_FLAG == 0 && DELETE_FLAG == 0) {
                            $scope.FILTER_SWTICH_ON_OFF_FY(1)
                            $scope.$parent.ShowAlert("Success", "Template Save Successfully", 3000);
                        }
                        $scope.Section_Week_Search.TEMPLATE_NAME = '';
                        $scope.Section_Week_Search.TEMPLATE_ID = null;
                        $scope.ROTA_GET_TEMPLATES();
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                    }
                });
            }
        }
        if (count == 1) {
            $scope.$parent.ShowAlert("Error", "Enter Template Name", 3000);
        }
        if (count == 2) {
            $scope.$parent.ShowAlert("Warning", "No shift available", 3000);
        }
    }
    $scope.ROTA_HIDE_UNHIDE_SHIFTS_BY_DATE = function (Shift, FLAG) {
        Shift.HIDE_SHOW_HEADER_WISE = Shift.HIDE_SHOW_HEADER_WISE ? false : true;
        ModelObj = new Object();
        ModelObj.DATEONLY = Shift.NewDate
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.BRANCH_ID = '';
        ModelObj.SECTION_IDS = '';
        ModelObj.FLAG = Shift.HIDE_SHOW_HEADER_WISE ? 1 : 0;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_HIDE_UNHIDE_SHIFTS_BY_DATE').then(function (data) {
            if (data.data == 1) {
                $scope.$parent.ShowAlert('Success', 'Successfully hide employee cannot see shifts on this days', 3000);
            }
            if (data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
            }
        });
    }

    $scope.FILTERBYPAID = function (CL) {
        if (CL.BREAK_TYPE_ID == 1 || CL.DELETE_FLAG == 1) {
            return 0;
        }
        return (CL.BREAK_TYPE_ID != undefined && CL.BREAK_TYPE_ID != null);
    }
    $scope.FILTERBYUNPAID = function (CL) {
        if (CL.BREAK_TYPE_ID == 2 || CL.DELETE_FLAG == 1) {
            return 0
        }
        return (CL.BREAK_TYPE_ID != undefined && CL.BREAK_TYPE_ID != null);
    }

    $scope.SIDE_FILTER = function () {
        document.getElementById("Myfilters").style.zIndex = "1500";
        document.getElementById("Myfilters").style.width = "20%";
        $scope.ADMIN_GET_SHIFT_TYPES();
    };
    $scope.REMOVE_BREAK = function (BL, index) {
        if (BL.TABLE_ID == 0) {
            $scope.BREAK_LIST.splice(index, 1);
        }
        else {
            BL.DELETE_FLAG = 1;
        }
    };
    $scope.REMOVE_ACT_BREAK = function (BL, index) {
        if (BL.TABLE_ID == 0) {
            $scope.ACTUAL_BREAK_LIST.splice(index, 1);
        }
        else {
            BL.DELETE_FLAG = 1;
        }
    };
    $scope.DDL_VIEW_CLCIK = function (FLAG) {
        if (!$scope.IS_EMPLOYEE) {
            if (FLAG == 1) {
                $location.path('A_Day_View'); //href = "#!/A_Day_View"
            }
            else if (FLAG == 2) {
                //href = "#!/A_Week_View"
                $location.path('A_Week_View');
            }
            else if (FLAG == 3) {
                //$location.path('A_Week_View')
            }
            else if (FLAG == 4) {
                // href="#!/A_Month_View"
                $location.path('A_Month_View');
            }
            else if (FLAG == 5) {
                //href="#!/E_Day_View"
                $location.path('E_Day_View');
            }
            else if (FLAG == 6) {
                //href="#!/E_Week_View"
                $location.path('E_Week_View');
            }
            else if (FLAG == 7) {
                //href="#!/E_Week_View"
            }
            else if (FLAG == 8) {
                //href="#!/E_Week_View"
            }
            else if (FLAG == 9) {
                $location.path('C_Week_View');
            }
        }
        else {
            if (FLAG == 1) {
                $location.path('EA_Day_View'); //href = "#!/A_Day_View"
            }
            else if (FLAG == 2) {
                //href = "#!/A_Week_View"
                $location.path('Emp_A_Week_View');
            }
            else if (FLAG == 3) {
                //$location.path('A_Week_View')
            }
            else if (FLAG == 4) {
                // href="#!/A_Month_View"
                $location.path('EA_Month_View');
            }
            else if (FLAG == 5) {
                //href="#!/E_Day_View"
                $location.path('EE_Day_View');
            }
            else if (FLAG == 6) {
                //href="#!/E_Week_View"
                $location.path('Emp_E_Week_View');
            }
            else if (FLAG == 7) {
                //href="#!/E_Week_View"
            }
            else if (FLAG == 8) {
                //href="#!/E_Week_View"
            }
            else if (FLAG == 9) {
                $location.path('C_Week_View');
            }
        }
    }

    $scope.ROTA_OPTIONS_FY = function (FLAG, BRANCH_ID, SECTION_ID, VIEW_NAME) {
        $scope.DELETEWEEKFLAG = false;
        $scope.Section_Week_Search.DeleteWeekComments = '';
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            if (confirm('Are you Sure? ' + ($scope.IS_LOCK_FLAG ? 'Action restricted for locked dates' : ''))) {
                $('#DeleteweekCommentspop').modal('show');
            }

        }
        else {
            $scope.$parent.ShowAlert("Warning", "No shift available for deletion", 3000);
        }
    }
    $scope.ROTA_OPTIONS = function (FLAG, PARAM1, PARAM2, VIEW_NAME) {
        $scope.DELETEWEEKFLAG = true;
        if ($scope.Section_Week_Search.DeleteWeekComments != undefined && $scope.Section_Week_Search.DeleteWeekComments != null && $scope.Section_Week_Search.DeleteWeekComments != '') {
            var ModelObj = new Object();
            ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
            ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            ModelObj.BRANCH_ID = 0// BRANCH_ID == null ? 0 : BRANCH_ID;
            ModelObj.SECTION_ID = 0 // SECTION_ID == null ? 0 : SECTION_ID;
            ModelObj.OPTION_FLAG = FLAG;
            ModelObj.COMMENTS = $scope.Section_Week_Search.DeleteWeekComments;
            ModelObj.USER_ID = parseInt($cookies.get('USERID'));
            ModelObj.EMP_PRS_ID = parseInt($cookies.get('EMPLOYEE_ID'));
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                ModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                ModelObj.FLAG = 3;
            }
            else {
                ModelObj.FLAG = 2;
            }
            ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
            /*1 REMOVE ALL EMPLOYEE,2 REMOVE EMPTY SHIFTS,3 MARK EMPTY AS OPEN,4 DELETE ALL SHIFTS*/
            PrcCommMethods.HR_API(ModelObj, 'ROTA_OPTIONS').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Deleted Successfully", 3000);
                    $scope.Section_Week_Search.DeleteWeekComments = null;
                    $('#DeleteweekCommentspop').modal('hide');
                    if (VIEW_NAME == 'AREA_VIEW') {

                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    }
                    if (VIEW_NAME == 'EMP_VIEW') {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                    }
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        } else {
            $('#DeleteweekCommentspop').modal('show');
        }

    };

    $scope.BREAK_LIST_TEMP = [];
    $scope.ACTUAL_BREAK_LIST = [];
    $scope.NG_CHANGE_SHIFT_COUNT = function (value) {
        $scope.NG_CHANGE_COST = 1;
        //if ($scope.Section_Week_Search.INS_UPD_SHIFT_COUNT == 0) {
        //    $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT = 1;
        //}
    }

    $scope.ROTA_PICK_SHIFT_BY_EMP = function (AssignShift_Form, WHERE_CLICK) {
        if (confirm('Are you sure?')) {
            ModelObj = new Object();
            ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;
            ModelObj.EMP_PRS_ID = $scope.Section_Week_Search.EMP_PRS_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.START_DATE = new Date($scope.SHIFT_CELDER_START_DATE).toDateString();
            ModelObj.END_DATE = new Date($scope.SHIFT_CELDER_END_DATE).toDateString();
            ModelObj.VIEW_TYPE = WHERE_CLICK == "EMP_VIEW" || WHERE_CLICK == "AREA_VIEW" ? 2 : '';

            PrcCommMethods.HR_API(ModelObj, 'ROTA_PICK_SHIFT_BY_EMP').then(function (data) {
                if (data.data.Table.length > 0) {
                    if (data.data.Table[0].SUCCESS == 1) {
                        $scope.$parent.ShowAlert("Success", "Pick Successfully", 3000);
                        $scope.BREAK_LIST = [];
                        $scope.BREAK_LIST_TEMP = [];
                        $scope.ACTUAL_BREAK_LIST = [];
                        //$scope.ADD_BREAK();
                        if (WHERE_CLICK == "EMP_VIEW") {
                            $scope.Schedulerchild.PAGE_LOAD_FY();
                            $('#AssignShift_Form').modal('hide');
                        }
                        if (WHERE_CLICK == "AREA_VIEW") {
                            $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                        }
                        $('#Add_Shift').modal('hide');
                        $('#Multiple_Shifts').modal('hide');
                        $scope.closeNav();
                    }
                    else if (data.data.Table[0].SUCCESS == -1) {
                        $scope.$parent.ShowAlert("Warning", "Shift already picked by another employee", 3000);
                    }
                    else if (data.data.Table[0].SHIFT_ID > 0) {
                        $scope.$parent.ShowAlert("Warning", "You cannot pick two shifts at a time", 3000);
                    }
                }
            });
        }
    }
    $scope.ROTA_INS_UPD_SHIFTS_FY = function (AssignShift_Form, VIEW_NAME, SELECTED_SHIFT, SELECTED_CELL) {
        var count = 0;
        $scope.OVERLAP_EMP_LIST = [];
        if ($scope.Section_Week_Search.START_TIME != undefined && $scope.Section_Week_Search.START_TIME._d == "Invalid Date" && $scope.Section_Week_Search.END_TIME != undefined && $scope.Section_Week_Search.END_TIME._d == "Invalid Date") {
            $scope.Section_Week_Search.END_TIME = null;
            $scope.Section_Week_Search.START_TIME = null;
            $scope.$parent.ShowAlert('Error', 'please select valid start/finish time', 3000);
            count++;
        }
        else if ($scope.Section_Week_Search.START_TIME != undefined && $scope.Section_Week_Search.START_TIME._d == "Invalid Date") {
            $scope.Section_Week_Search.START_TIME = null;
            $scope.$parent.ShowAlert('Error', 'please select valid start time', 3000);
            count++;
        }
        else if ($scope.Section_Week_Search.END_TIME != undefined && $scope.Section_Week_Search.END_TIME._d == "Invalid Date") {
            $scope.Section_Week_Search.END_TIME = null;
            $scope.$parent.ShowAlert('Error', 'please select valid finish time', 3000);
            count++;
        }
        AssignShift_Form.submitted = true;
        if (AssignShift_Form.$valid) {
            for (var i = 0; i < $scope.BREAK_LIST.length; i++) {
                if ($scope.BREAK_LIST[i].BREAK_TYPE_ID == undefined || $scope.BREAK_LIST[i].BREAK_TYPE_ID == '' || $scope.BREAK_LIST[i].BREAK_TYPE_ID == null) {
                    $scope.$parent.ShowAlert('Error', 'please select valid break type', 3000);
                    count++;
                    break;
                }
                if ($scope.BREAK_LIST[i].DURATION == undefined || $scope.BREAK_LIST[i].DURATION == '' || $scope.BREAK_LIST[i].DURATION == null || $scope.BREAK_LIST[i].DURATION == 0 || $scope.BREAK_LIST[i].DURATION.toString() == "NaN") {
                    $scope.$parent.ShowAlert('Error', 'please enter valid duration in breaks', 3000);
                    count++;
                    break;
                }
                if ($scope.BREAK_LIST[i].SET_BREAK) {
                    if ($scope.BREAK_LIST[i].BREAK_START == undefined || $scope.BREAK_LIST[i].BREAK_START == '' || $scope.BREAK_LIST[i].BREAK_START == null || $scope.BREAK_LIST[i].BREAK_END == null || $scope.BREAK_LIST[i].BREAK_END == undefined || $scope.BREAK_LIST[i].BREAK_END == '') {
                        $scope.$parent.ShowAlert('Error', 'please enter valid start/end time in breaks', 3000);
                        count++;
                        break;
                    }
                }
            }

            if ($scope.ACTUAL_BREAK_LIST.length > 0) {
                for (var i = 0; i < $scope.ACTUAL_BREAK_LIST.length; i++) {
                    if ($scope.ACTUAL_BREAK_LIST[i].DELETE_FLAG != 1 && $scope.ACTUAL_BREAK_LIST[i].TABLE_ID == 0) {
                        $scope.ACTUAL_BREAK_LIST[i].ERROR = 0;
                        $scope.ACTUAL_BREAK_LIST[i].ERROR_MSG = "";
                        if ($scope.ACTUAL_BREAK_LIST[i].BREAK_START == undefined || $scope.ACTUAL_BREAK_LIST[i].BREAK_START == '' || $scope.ACTUAL_BREAK_LIST[i].BREAK_START == null || $scope.ACTUAL_BREAK_LIST[i].BREAK_END == null || $scope.ACTUAL_BREAK_LIST[i].BREAK_END == undefined || $scope.ACTUAL_BREAK_LIST[i].BREAK_END == '') {
                            $scope.ACTUAL_BREAK_LIST[i].ERROR = 1;
                            $scope.ACTUAL_BREAK_LIST[i].ERROR_MSG = "please enter valid start/end time in breaks";
                            count = 1;
                        };
                        if ($scope.ACTUAL_BREAK_LIST[i].BREAK_START != undefined && $scope.ACTUAL_BREAK_LIST[i].BREAK_START != '' && $scope.ACTUAL_BREAK_LIST[i].BREAK_START != null && $scope.ACTUAL_BREAK_LIST[i].BREAK_END != undefined && $scope.ACTUAL_BREAK_LIST[i].BREAK_END != null && $scope.ACTUAL_BREAK_LIST[i].BREAK_END != '') {
                            var END_DATE = $scope.Section_Week_Search.END_TIME;
                            if (!(moment($scope.ACTUAL_BREAK_LIST[i].BREAK_START).isBetween($scope.SELECTED_SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID[0].LOGIN_DATE, END_DATE, undefined, '[]'))) {
                                $scope.ACTUAL_BREAK_LIST[i].ERROR = 2;
                                $scope.ACTUAL_BREAK_LIST[i].ERROR_MSG = "Break Start Time in between clock-In start time and shift End time ";
                                count = 1;
                            }
                            if (!(moment($scope.ACTUAL_BREAK_LIST[i].BREAK_END).isBetween($scope.SELECTED_SHIFT.LOGIN_LOGOUT_DETAILS_BY_ID[0].LOGIN_DATE, END_DATE, undefined, '[]'))) {
                                $scope.ACTUAL_BREAK_LIST[i].ERROR = 3;
                                $scope.ACTUAL_BREAK_LIST[i].ERROR_MSG = "Break End Time in between clock-In start time and shift End time";
                                count = 1;
                            }
                        };
                    }
                    if (count == 99) {
                        //  $scope.$parent.ShowAlert('Error', 'please enter valid start/end time in breaks', 3000);
                    }
                }
            }
        }
        if (count == 0) {
            if ($scope.SELECTED_CELL.SHIFT_TEXT == 'Add' || ($scope.SELECTED_CELL.SHIFT_TEXT == 'Copy' && $scope.Section_Week_Search.EMPLOYEES.length > 1)) {
                $scope.ROTA_INS_MULTIPLE_SHIFTS(AssignShift_Form, VIEW_NAME, SELECTED_SHIFT, SELECTED_CELL);
            };
            if ($scope.SELECTED_CELL.SHIFT_TEXT == 'Edit' || $scope.SELECTED_CELL.SHIFT_TEXT == 'View' || $scope.SELECTED_CELL.SHIFT_TEXT == 'Approve' || ($scope.SELECTED_CELL.SHIFT_TEXT == 'Copy' && $scope.Section_Week_Search.EMPLOYEES.length == 1)) {
                $scope.ROTA_INS_UPD_SHIFTS(AssignShift_Form, VIEW_NAME, SELECTED_SHIFT, SELECTED_CELL);
            };
        }
    }
    $scope.ROTA_INS_UPD_SHIFTS = function (AssignShift_Form, WHERE_CLICK) {
        $('#WHOISWORKING').removeClass('error');
        $('#INWHICHSECTION').removeClass('error');
        if ($scope.APPROVE_FLAG == 1) {
            if ($scope.Section_Week_Search.EMPLOYEE_LOGIN == undefined || $scope.Section_Week_Search.EMPLOYEE_LOGIN == null || $scope.Section_Week_Search.EMPLOYEE_LOGIN == '') {
                $scope.$parent.ShowAlert("Error", "please provide Clock-In time.", 3000);
            }
            else if ($scope.Section_Week_Search.EMPLOYEE_LOGOUT == undefined || $scope.Section_Week_Search.EMPLOYEE_LOGOUT == null || $scope.Section_Week_Search.EMPLOYEE_LOGOUT == '') {
                $scope.$parent.ShowAlert("Error", "please provide Clock-Out time.", 3000);
            }
            else {
                var Count = 0;
                if (new Date($scope.Section_Week_Search.EMPLOYEE_LOGIN) > new Date($scope.SELECTED_SHIFT.END_TIME)) {
                    Count++
                    $scope.$parent.ShowAlert("Error", "Clock-In time can not be greater than shift finish time", 3000);
                }
                else if (new Date($scope.Section_Week_Search.EMPLOYEE_LOGIN) > new Date($scope.Section_Week_Search.EMPLOYEE_LOGOUT)) {
                    Count++
                    $scope.$parent.ShowAlert("Error", "Clock-Out time can not be greater than logout time ", 3000);
                }

                var tolrencemsg = "Are you sure?";

                if (Count == 0 && new Date($scope.Section_Week_Search.EMPLOYEE_LOGOUT) > new Date($scope.Section_Week_Search.END_TIME)) {
                    tolrencemsg = "Clocked-Out time is greater than shift finish time, Are you sure you want to proceed?";
                }
                if (Count == 0) {
                    if (confirm(tolrencemsg)) {
                        $scope.ROTA_APPROVE_SHIFT($scope.Section_Week_Search.SHIFT_ID, 2, WHERE_CLICK, $scope.Section_Week_Search.EMPLOYEE_LOGIN, $scope.Section_Week_Search.EMPLOYEE_LOGOUT, $scope.Section_Week_Search.SHIFT_TYPE_ID);
                    }
                }
            }
        }
        else {
            var count = 0;
            if ($scope.SELECTED_CELL != undefined) {
                var START_DATE = '';
                var END_DATE = '';

                START_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                END_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));

                let START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
                var ST = START_TIME.split(':');
                let END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
                var ET = END_TIME.split(':');

                START_DATE.setHours(parseFloat(ST[0]));
                START_DATE.setMinutes(parseFloat(ST[1]));
                START_DATE.setSeconds(0);
                END_DATE.setHours(parseFloat(ET[0]));
                END_DATE.setMinutes(parseFloat(ET[1]));
                END_DATE.setSeconds(0);
                if (moment(START_DATE) > moment(END_DATE)) {
                    END_DATE.setDate(END_DATE.getDate() + 1);
                }
            }
            if (!AssignShift_Form.$valid) {
                angular.forEach(AssignShift_Form.$error.required, function (x) {
                    if (x.$name == "WHOISWORKING") {
                        $('#WHOISWORKING').addClass('error');

                    }
                    if (x.$name == "INWHICHSECTION") {
                        $('#INWHICHSECTION').addClass('error');
                    }
                    if (x.$name == "SHIFT_TYPE_NAME") {
                        $('#SHIFT_TYPE_NAME').addClass('error');
                    }
                })
            }
            AssignShift_Form.submitted = true;
            if (AssignShift_Form.$valid && count == 0) {
                if (($scope.SECTION_REQUIRED == 0 || $scope.SECTION_REQUIRED == 1 && $scope.Section_Week_Search.SECTION_ID != undefined && $scope.Section_Week_Search.SECTION_ID != null) && $scope.Section_Week_Search.SHIFT_TYPE_ID != undefined && $scope.Section_Week_Search.SHIFT_TYPE_ID != null) {
                    ModelObj = new Object();
                    ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));;
                    ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;
                    ModelObj.EMP_PRS_ID = $scope.Section_Week_Search.EMP_PRS_ID;
                    ModelObj.SECTION_ID = $scope.Section_Week_Search.SECTION_ID < 0 ? null : $scope.Section_Week_Search.SECTION_ID;
                    START_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                    END_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                    let START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
                    var ST = START_TIME.split(':');
                    let END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
                    var ET = END_TIME.split(':');
                    START_DATE.setHours(parseFloat(ST[0]));
                    START_DATE.setMinutes(parseFloat(ST[1]));
                    START_DATE.setSeconds(0);
                    END_DATE.setHours(parseFloat(ET[0]));
                    END_DATE.setMinutes(parseFloat(ET[1]));
                    END_DATE.setSeconds(0);
                    if (moment(START_DATE) > moment(END_DATE)) {
                        END_DATE.setDate(END_DATE.getDate() + 1);
                    };
                    var ms = moment(END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE, "DD/MM/YYYY HH:mm:ss"));
                    var diffDuration = moment.duration(ms);
                    ModelObj.START_TIME = $scope.$parent.changeTimezone(new Date(START_DATE))
                    ModelObj.END_TIME = $scope.$parent.changeTimezone(new Date(END_DATE))
                    ModelObj.PAID_BREAK = $scope.Section_Week_Search.PAID_BREAK;
                    ModelObj.UNPAID_BREAK = $scope.Section_Week_Search.UN_PAID_BREAK;

                    ModelObj.SHIFT_DURATION_IN_MINS = diffDuration._data.hours * 60 + diffDuration._data.minutes - (parseFloat(ModelObj.UNPAID_BREAK));
                    ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                    ModelObj.NOTES = $scope.Section_Week_Search.NOTES;
                    ModelObj.DELETE_FLAG = 0;
                    ModelObj.SHIFT_BREAKS_LIST = [];
                    ModelObj.SHIFT_SHIFT_TYPE_ID = $scope.Section_Week_Search.SHIFT_TYPE_ID == null || $scope.Section_Week_Search.SHIFT_TYPE_ID == '' ? $scope.COPY_SHIFT_SHIFT.SHIFT_TYPE_ID : $scope.Section_Week_Search.SHIFT_TYPE_ID;
                    ModelObj.SHIFT_PICK_BY_EMP = $scope.Section_Week_Search.EMPTY_SHIFT ? 1 : 0;
                    ModelObj.BRANCH_ID = $scope.Section_Week_Search.BRANCH_ID < 0 ? -1 * $scope.Section_Week_Search.BRANCH_ID : $scope.Section_Week_Search.BRANCH_ID;
                    ModelObj.IS_VISIBLE = 1;
                    ModelObj.SHIFT_MASTER_ID = $scope.Section_Week_Search.SHIFT_MASTER_ID == null || $scope.Section_Week_Search.SHIFT_MASTER_ID == '' || $scope.Section_Week_Search.SHIFT_MASTER_ID == 0 ? null : $scope.Section_Week_Search.SHIFT_MASTER_ID;// $scope.Section_Week_Search.SHIFT_MASTER_ID==;
                    ModelObj.SHIFT_TAG_IDS = '';
                    if ($scope.SHIFT_TAGS_LIST.length > 0) {
                        angular.forEach($scope.SHIFT_TAGS_LIST, function (xTags) {
                            if (xTags.SELECTED) {
                                if (ModelObj.SHIFT_TAG_IDS == '') {
                                    ModelObj.SHIFT_TAG_IDS = xTags.SHIFT_TAG_ID
                                }
                                else {
                                    ModelObj.SHIFT_TAG_IDS = ModelObj.SHIFT_TAG_IDS + ',' + xTags.SHIFT_TAG_ID
                                }
                            }
                        });
                    };
                    if ($scope.BREAK_LIST.length > 0) {
                        angular.forEach($scope.BREAK_LIST, function (VAL_BL) {
                            if (VAL_BL.TABLE_ID == 0 &&
                                VAL_BL.BREAK_TYPE_ID == null &&
                                VAL_BL.DURATION == 0 &&
                                (VAL_BL.BREAK_START == null || VAL_BL.BREAK_START == undefined || VAL_BL.BREAK_START == '') &&
                                (VAL_BL.BREAK_END == null || VAL_BL.BREAK_END == undefined || VAL_BL.BREAK_END == '') &&
                                VAL_BL.NOTES == '' &&
                                VAL_BL.DELETE_FLAG == 0) {
                                var BL = new Object();
                                BL.TABLE_ID = -1,
                                    BL.BREAK_TYPE_ID = null,
                                    BL.DURATION = 0,
                                    BL.BREAK_START = null,
                                    BL.BREAK_END = null,
                                    BL.NOTES = '',
                                    BL.DELETE_FLAG = 0;
                                BL.ACTUAL_BREAK = 0;
                                ModelObj.SHIFT_BREAKS_LIST.push(BL);
                            }
                            else {
                                var BL = new Object()
                                if ($scope.IS_COPY_SHIFT == true) {
                                    BL.TABLE_ID = 0;
                                }
                                else {
                                    BL.TABLE_ID = VAL_BL.TABLE_ID
                                }
                                BL.BREAK_TYPE_ID = VAL_BL.BREAK_TYPE_ID;
                                BL.DURATION = VAL_BL.DURATION;
                                if (!VAL_BL.SET_BREAK) {
                                    BL.BREAK_START = null; //VAL_BL.BREAK_START,
                                    BL.BREAK_END = null;//VAL_BL.BREAK_END,
                                }
                                else {
                                    var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                                    var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                                    let START_TIME = moment(VAL_BL.BREAK_START).format('H:mm');
                                    let END_TIME = moment(VAL_BL.BREAK_END).format('H:mm');
                                    var BST = START_TIME.split(':');
                                    if (BST.length > 0) {
                                        BREAK_START.setHours(parseFloat(BST[0]));
                                        BREAK_START.setMinutes(parseFloat(BST[1]));
                                        BREAK_START.setSeconds(0);
                                    }
                                    var BET = END_TIME.split(':');
                                    if (BET.length > 0) {
                                        BREAK_END.setHours(parseFloat(BET[0]));
                                        BREAK_END.setMinutes(parseFloat(BET[1]));
                                        BREAK_END.setSeconds(0);
                                    }
                                    BL.BREAK_START = $scope.$parent.changeTimezone(new Date(BREAK_START));
                                    BL.BREAK_END = $scope.$parent.changeTimezone(new Date(BREAK_END));
                                }
                                BL.NOTES = VAL_BL.NOTES;
                                BL.DELETE_FLAG = VAL_BL.DELETE_FLAG;//DELETE_FLAG
                                BL.ACTUAL_BREAK = 0;
                                ModelObj.SHIFT_BREAKS_LIST.push(BL);
                            }
                        })
                        if ($scope.BREAK_LIST_TEMP.length > 0) {
                            if ($scope.IS_COPY_SHIFT == false) {
                                angular.forEach($scope.BREAK_LIST_TEMP, function (VAL_BL) {
                                    var BL = new Object();
                                    BL.TABLE_ID = VAL_BL.TABLE_ID,
                                        BL.BREAK_TYPE_ID = null,
                                        BL.DURATION = 0,
                                        BL.BREAK_START = null,
                                        BL.BREAK_END = null,
                                        BL.NOTES = '',
                                        BL.DELETE_FLAG = 1;
                                    BL.ACTUAL_BREAK = 0;
                                    ModelObj.SHIFT_BREAKS_LIST.push(BL);
                                });
                            }
                        }
                    }
                    else {
                        $scope.ADD_BREAK();
                        $scope.BREAK_LIST[0].TABLE_ID = -1
                        ModelObj.SHIFT_BREAKS_LIST = $scope.BREAK_LIST;
                        if ($scope.BREAK_LIST_TEMP.length > 0) {
                            if ($scope.IS_COPY_SHIFT == false) {
                                ModelObj.SHIFT_BREAKS_LIST = [];
                                angular.forEach($scope.BREAK_LIST_TEMP, function (x) {
                                    var BL = new Object();
                                    BL.TABLE_ID = x.TABLE_ID,
                                        BL.BREAK_TYPE_ID = null,
                                        BL.DURATION = 0,
                                        BL.BREAK_START = null,
                                        BL.BREAK_END = null,
                                        BL.NOTES = '',
                                        BL.DELETE_FLAG = 1;
                                    BL.ACTUAL_BREAK = 0;
                                    ModelObj.SHIFT_BREAKS_LIST.push(BL);
                                });
                            }
                        }
                    }
                    if ($scope.ACTUAL_BREAK_LIST.length > 0) {
                        if (ModelObj.SHIFT_BREAKS_LIST[0].TABLE_ID == -1) {
                            ModelObj.SHIFT_BREAKS_LIST = [];
                        }
                        angular.forEach($scope.ACTUAL_BREAK_LIST, function (VAL_BL) {
                            var BL = new Object()
                            BL.TABLE_ID = VAL_BL.TABLE_ID;
                            BL.BREAK_TYPE_ID = null;
                            BL.DURATION = VAL_BL.DURATION;
                            BL.BREAK_START = $scope.$parent.changeTimezone(new Date(VAL_BL.BREAK_START));
                            BL.BREAK_END = $scope.$parent.changeTimezone(new Date(VAL_BL.BREAK_END));
                            BL.NOTES = "";
                            BL.DELETE_FLAG = VAL_BL.DELETE_FLAG;//DELETE_FLAG
                            BL.ACTUAL_BREAK = 1;
                            ModelObj.SHIFT_BREAKS_LIST.push(BL);
                        });
                    };
                    ModelObj.SHIFT_COUNT = $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT;

                    ModelObj.BUSINESS_DATE = new Date($scope.SELECTED_CELL.NewDate).toDateString();
                    ModelObj.START_DATE = new Date($scope.SHIFT_CELDER_START_DATE).toDateString();
                    ModelObj.END_DATE = new Date($scope.SHIFT_CELDER_END_DATE).toDateString();
                    ModelObj.VIEW_TYPE = WHERE_CLICK == "EMP_VIEW" || WHERE_CLICK == "AREA_VIEW" ? 2 : '';
                    AssignShift_Form.submitted = false;
                    PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_SHIFTS').then(function (data) {
                        if (data.data.Table[0]["SUCCESS"] == -1) {
                            $scope.$parent.ShowAlert("Error", "Shift Overlapping, please correct shift timings", 3000);
                            $scope.OVERLAP_EMP_LIST = data.data.Table;
                            angular.forEach($scope.Section_Week_Search.EMPLOYEES, function (val) {
                                var List = data.data.Table.filter(function (x) { return x.EMP_PRS_ID == val.EMP_PRS_ID });
                                val.OVERLAP_FLAG = false;
                                if (List.length > 0) {
                                    val.OVERLAP_FLAG = true;
                                };
                            });
                        }
                        if (data.data.Table[0]["SUCCESS"] == 1) {
                            $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                            $scope.BREAK_LIST = [];
                            $scope.BREAK_LIST_TEMP = [];
                            $scope.ACTUAL_BREAK_LIST = [];
                            // $scope.ADD_BREAK();
                            if (WHERE_CLICK == "EMP_VIEW") {
                                $scope.Schedulerchild.PAGE_LOAD_FY();
                                $('#AssignShift_Form').modal('hide');
                            }
                            if (WHERE_CLICK == "AREA_VIEW") {
                                $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                            }
                            $('#Add_Shift').modal('hide');
                            $('#Multiple_Shifts').modal('hide');
                            $scope.Schedulerchild.FILTER_RESET_SIDE();
                            $scope.closeNav();
                        }
                    });
                }
                else {
                    if ($scope.Section_Week_Search.SECTION_ID == undefined || $scope.Section_Week_Search.SECTION_ID == null || $scope.Section_Week_Search.SECTION_ID == '') {
                        $scope.$parent.ShowAlert("Error", "Please selected valid section name.", 3000);
                    }
                    if ($scope.Section_Week_Search.SHIFT_TYPE_ID == undefined || $scope.Section_Week_Search.SHIFT_TYPE_ID == null || $scope.Section_Week_Search.SHIFT_TYPE_ID == '') {
                        $scope.$parent.ShowAlert("Error", "Please selected valid shift Type.", 3000);
                    }
                }
            }
            else {
                if (count > 0) {
                    $scope.$parent.ShowAlert("Error", "A shift is already setup between selected dates.", 3000);
                }
            }
        }

    }
    $scope.ROTA_INS_MULTIPLE_SHIFTS = function (AssignShift_Form, WHERE_CLICK) {
        $('#WHOISWORKING').removeClass('error');
        $('#INWHICHSECTION').removeClass('error');
        var count = 0;
        if (!AssignShift_Form.$valid) {
            angular.forEach(AssignShift_Form.$error.required, function (x) {
                if (x.$name == "INWHICHSECTION") {
                    $('#INWHICHSECTION').addClass('error');
                }
                if (x.$name == "SHIFT_TYPE_NAME") {
                    $('#SHIFT_TYPE_NAME').addClass('error');
                }
            })
        }
        if ($scope.Section_Week_Search.EMPLOYEES == undefined || $scope.Section_Week_Search.EMPLOYEES.length == 0) {
            count++;
        }
        AssignShift_Form.submitted = true;
        if (AssignShift_Form.$valid && count == 0) {
            if (($scope.SECTION_REQUIRED == 0 || $scope.SECTION_REQUIRED == 1 && $scope.Section_Week_Search.SECTION_ID != undefined && $scope.Section_Week_Search.SECTION_ID != null) && $scope.Section_Week_Search.SHIFT_TYPE_ID != undefined && $scope.Section_Week_Search.SHIFT_TYPE_ID != null) {
                ModelObj = new Object();
                ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;
                ModelObj.EMP_PRS_IDS = Array.prototype.map.call($scope.Section_Week_Search.EMPLOYEES, function (item) { return item.EMP_PRS_ID }).join(",");
                ModelObj.SECTION_ID = $scope.Section_Week_Search.SECTION_ID < 0 ? null : $scope.Section_Week_Search.SECTION_ID;
                START_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                END_DATE = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                let START_TIME = moment($scope.Section_Week_Search.START_TIME).format('H:mm')
                var ST = START_TIME.split(':');
                let END_TIME = moment($scope.Section_Week_Search.END_TIME).format('H:mm')
                var ET = END_TIME.split(':');
                START_DATE.setHours(parseFloat(ST[0]));
                START_DATE.setMinutes(parseFloat(ST[1]));
                START_DATE.setSeconds(0);
                END_DATE.setHours(parseFloat(ET[0]));
                END_DATE.setMinutes(parseFloat(ET[1]));
                END_DATE.setSeconds(0);
                if (moment(START_DATE) > moment(END_DATE)) {
                    END_DATE.setDate(END_DATE.getDate() + 1);
                };
                var ms = moment(END_DATE, "DD/MM/YYYY HH:mm:ss").diff(moment(START_DATE, "DD/MM/YYYY HH:mm:ss"));
                var diffDuration = moment.duration(ms);
                ModelObj.START_TIME = $scope.$parent.changeTimezone(new Date(START_DATE))
                ModelObj.END_TIME = $scope.$parent.changeTimezone(new Date(END_DATE))
                ModelObj.PAID_BREAK = $scope.Section_Week_Search.PAID_BREAK;
                ModelObj.UNPAID_BREAK = $scope.Section_Week_Search.UN_PAID_BREAK;
                ModelObj.SHIFT_DURATION_IN_MINS = diffDuration._data.hours * 60 + diffDuration._data.minutes - (parseFloat(ModelObj.UNPAID_BREAK));
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.NOTES = $scope.Section_Week_Search.NOTES;
                ModelObj.DELETE_FLAG = 0;
                ModelObj.SHIFT_BREAKS_LIST = [];
                ModelObj.SHIFT_SHIFT_TYPE_ID = $scope.Section_Week_Search.SHIFT_TYPE_ID == null || $scope.Section_Week_Search.SHIFT_TYPE_ID == '' ? $scope.COPY_SHIFT_SHIFT.SHIFT_TYPE_ID : $scope.Section_Week_Search.SHIFT_TYPE_ID;
                ModelObj.SHIFT_PICK_BY_EMP = $scope.Section_Week_Search.EMPTY_SHIFT ? 1 : 0;
                ModelObj.BRANCH_ID = $scope.Section_Week_Search.BRANCH_ID < 0 ? -1 * $scope.Section_Week_Search.BRANCH_ID : $scope.Section_Week_Search.BRANCH_ID;
                ModelObj.IS_VISIBLE = 1;
                ModelObj.SHIFT_MASTER_ID = $scope.Section_Week_Search.SHIFT_MASTER_ID;
                ModelObj.SHIFT_TAG_IDS = '';
                if ($scope.SHIFT_TAGS_LIST.length > 0) {
                    angular.forEach($scope.SHIFT_TAGS_LIST, function (xTags) {
                        if (xTags.SELECTED) {
                            if (ModelObj.SHIFT_TAG_IDS == '') {
                                ModelObj.SHIFT_TAG_IDS = xTags.SHIFT_TAG_ID;
                            }
                            else {
                                ModelObj.SHIFT_TAG_IDS = ModelObj.SHIFT_TAG_IDS + ',' + xTags.SHIFT_TAG_ID;
                            }
                        }
                    });
                }

                if ($scope.BREAK_LIST.length > 0) {
                    angular.forEach($scope.BREAK_LIST, function (VAL_BL) {
                        if (VAL_BL.TABLE_ID == 0 &&
                            VAL_BL.BREAK_TYPE_ID == null &&
                            VAL_BL.DURATION == 0 &&
                            (VAL_BL.BREAK_START == null || VAL_BL.BREAK_START == undefined || VAL_BL.BREAK_START == '') &&
                            (VAL_BL.BREAK_END == null || VAL_BL.BREAK_END == undefined || VAL_BL.BREAK_END == '') &&
                            VAL_BL.NOTES == '' &&
                            VAL_BL.DELETE_FLAG == 0) {
                            var BL = new Object();
                            BL.TABLE_ID = -1;
                            BL.BREAK_TYPE_ID = null;
                            BL.DURATION = 0;
                            BL.BREAK_START = null;
                            BL.BREAK_END = null;
                            BL.NOTES = '';
                            BL.DELETE_FLAG = 0;
                            BL.ACTUAL_BREAK = 0;
                            ModelObj.SHIFT_BREAKS_LIST.push(BL);
                        }
                        else {
                            var BL = new Object()
                            if ($scope.IS_COPY_SHIFT == true) {
                                BL.TABLE_ID = 0;
                            }
                            else {
                                BL.TABLE_ID = VAL_BL.TABLE_ID;
                            }
                            BL.BREAK_TYPE_ID = VAL_BL.BREAK_TYPE_ID;
                            BL.DURATION = VAL_BL.DURATION
                            if (!VAL_BL.SET_BREAK) {
                                BL.BREAK_START = null; //VAL_BL.BREAK_START,
                                BL.BREAK_END = null;//VAL_BL.BREAK_END,
                            }
                            else {
                                var BREAK_START = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                                var BREAK_END = angular.copy(new Date($scope.SELECTED_CELL.NewDate));
                                let START_TIME = moment(VAL_BL.BREAK_START).format('H:mm');
                                let END_TIME = moment(VAL_BL.BREAK_END).format('H:mm');
                                var BST = START_TIME.split(':');
                                if (BST.length > 0) {
                                    BREAK_START.setHours(parseFloat(BST[0]));
                                    BREAK_START.setMinutes(parseFloat(BST[1]));
                                    BREAK_START.setSeconds(0);
                                }
                                var BET = END_TIME.split(':');
                                if (BET.length > 0) {
                                    BREAK_END.setHours(parseFloat(BET[0]));
                                    BREAK_END.setMinutes(parseFloat(BET[1]));
                                    BREAK_END.setSeconds(0);
                                }
                                BL.BREAK_START = $scope.$parent.changeTimezone(new Date(BREAK_START));
                                BL.BREAK_END = $scope.$parent.changeTimezone(new Date(BREAK_END));
                            }
                            BL.NOTES = VAL_BL.NOTES;
                            BL.DELETE_FLAG = VAL_BL.DELETE_FLAG//DELETE_FLAG
                            BL.ACTUAL_BREAK = 0;
                            ModelObj.SHIFT_BREAKS_LIST.push(BL);
                        }
                    })
                    if ($scope.BREAK_LIST_TEMP.length > 0) {
                        if ($scope.IS_COPY_SHIFT == false) {
                            angular.forEach($scope.BREAK_LIST_TEMP, function (VAL_BL) {
                                var BL = new Object();
                                BL.TABLE_ID = VAL_BL.TABLE_ID;
                                BL.BREAK_TYPE_ID = null;
                                BL.DURATION = 0;
                                BL.BREAK_START = null;
                                BL.BREAK_END = null;
                                BL.NOTES = '';
                                BL.DELETE_FLAG = 1;
                                BL.ACTUAL_BREAK = 0;
                                ModelObj.SHIFT_BREAKS_LIST.push(BL);
                            });
                        }
                    }
                }
                else {
                    $scope.ADD_BREAK();
                    $scope.BREAK_LIST[0].TABLE_ID = -1;
                    ModelObj.SHIFT_BREAKS_LIST = $scope.BREAK_LIST;
                    if ($scope.BREAK_LIST_TEMP.length > 0) {
                        $scope.BREAK_LIST = [];
                        if ($scope.IS_COPY_SHIFT == false) {
                            ModelObj.SHIFT_BREAKS_LIST = [];
                            angular.forEach($scope.BREAK_LIST_TEMP, function (x) {
                                var BL = new Object();
                                BL.TABLE_ID = x.TABLE_ID;
                                BL.BREAK_TYPE_ID = null;
                                BL.DURATION = 0;
                                BL.BREAK_START = null;
                                BL.BREAK_END = null;
                                BL.NOTES = '';
                                BL.DELETE_FLAG = 1;
                                BL.ACTUAL_BREAK = 0;
                                ModelObj.SHIFT_BREAKS_LIST.push(BL);
                            });
                        }
                    }
                }
                ModelObj.SHIFT_COUNT = $scope.Section_Week_Search.INS_UPD_SHIFT_COUNT;

                ModelObj.BUSINESS_DATE = new Date($scope.SELECTED_CELL.NewDate).toDateString();
                ModelObj.START_DATE = new Date($scope.SHIFT_CELDER_START_DATE).toDateString();
                ModelObj.END_DATE = new Date($scope.SHIFT_CELDER_END_DATE).toDateString();
                ModelObj.VIEW_TYPE = WHERE_CLICK == "EMP_VIEW" || WHERE_CLICK == "AREA_VIEW" ? 2 : '';
                AssignShift_Form.submitted = false;
                PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_MULTIPLE_SHIFTS').then(function (data) {
                    if (data.data.Table[0]["SUCCESS"] == -1) {
                        $scope.$parent.ShowAlert("Error", "employee shifts overlapping, please correct shift timings and proceed", 3000);
                        $scope.OVERLAP_EMP_LIST = data.data.Table;
                        angular.forEach($scope.Section_Week_Search.EMPLOYEES, function (val) {
                            var List = data.data.Table.filter(function (x) { return x.EMP_PRS_ID == val.EMP_PRS_ID });
                            val.OVERLAP_FLAG = false;
                            if (List.length > 0) {
                                val.OVERLAP_FLAG = true;
                            };
                        });
                        if ($scope.BREAK_LIST[0].TABLE_ID = -1) {
                            $scope.BREAK_LIST = [];
                            $scope.BREAK_LIST_TEMP = [];
                            $scope.ACTUAL_BREAK_LIST = [];
                        }
                    }
                    if (data.data.Table[0]["SUCCESS"] == 1) {
                        $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                        $scope.BREAK_LIST = [];
                        $scope.BREAK_LIST_TEMP = [];
                        $scope.ACTUAL_BREAK_LIST = [];
                        $scope.ADD_BREAK();
                        if (WHERE_CLICK == "EMP_VIEW") {
                            $scope.Schedulerchild.PAGE_LOAD_FY();
                            $('#AssignShift_Form').modal('hide');
                        }
                        if (WHERE_CLICK == "AREA_VIEW") {
                            $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE, 1);
                        }
                        $('#Add_Shift').modal('hide');
                        $('#Multiple_Shifts').modal('hide');
                        $scope.Schedulerchild.FILTER_RESET_SIDE();
                        $scope.closeNav();
                    }
                });
            }
            else {
                if ($scope.Section_Week_Search.SECTION_ID == undefined || $scope.Section_Week_Search.SECTION_ID == null || $scope.Section_Week_Search.SECTION_ID == '') {
                    $scope.$parent.ShowAlert("Error", "Please select valid section name.", 3000);
                }
                if ($scope.Section_Week_Search.SHIFT_TYPE_ID == undefined || $scope.Section_Week_Search.SHIFT_TYPE_ID == null || $scope.Section_Week_Search.SHIFT_TYPE_ID == '') {
                    $scope.$parent.ShowAlert("Error", "Please select valid shift Type.", 3000);
                }
            }
        }
        else {
            if (count > 0) {
                //$scope.$parent.ShowAlert("Error", "please select employee.", 3000);
            }
        }
    }
    $scope.DELETE_ROTA_SHIFTS_FY = function (AssignShift_Form, WHERE_CLICK, EL, shift, CELL) {
        $scope.SELECTED_SHIFT = shift;
        $scope.SELECTED_CELL = CELL;
        $scope.Section_Week_Search.SHIFT_ID = shift.SHIFT_ID;
        $scope.Section_Week_Search.EMP_PRS_ID = EL.EMP_PRS_ID;
        $scope.DELETE_ROTA_SHIFTS(AssignShift_Form, WHERE_CLICK, shift);
    }
    $scope.DELETE_ROTA_SHIFTS = function (AssignShift_Form, WHERE_CLICK, shift) {
        $scope.overlay_loading_rota = 'block';
        if (confirm('Are you sure?')) {
            ModelObj = new Object();
            ModelObj.SHIFT_ID = $scope.Section_Week_Search.SHIFT_ID;
            ModelObj.EMP_PRS_ID = $scope.Section_Week_Search.EMP_PRS_ID;
            ModelObj.SECTION_ID = 0;//$scope.Section_Week_Search.SECTION_ID;
            ModelObj.START_TIME = null;
            ModelObj.END_TIME = null;
            ModelObj.UN_PAID_BREAK = 0;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.NOTES = '';
            ModelObj.DELETE_FLAG = 0;
            ModelObj.SHIFT_BREAKS_LIST = [];
            $scope.BREAK_LIST = [];
            $scope.ADD_BREAK();
            $scope.BREAK_LIST[0].TABLE_ID = -1
            ModelObj.SHIFT_BREAKS_LIST = $scope.BREAK_LIST;
            ModelObj.DELETE_FLAG = 1;
            ModelObj.BUSINESS_DATE = new Date($scope.SELECTED_CELL.NewDate).toDateString();
            ModelObj.START_DATE = new Date($scope.SHIFT_CELDER_START_DATE).toDateString();
            ModelObj.END_DATE = new Date($scope.SHIFT_CELDER_END_DATE).toDateString();
            ModelObj.VIEW_TYPE = WHERE_CLICK == "EMP_VIEW" || WHERE_CLICK == "AREA_VIEW" ? 2 : '';
            AssignShift_Form.submitted = false;
            PrcCommMethods.HR_API(ModelObj, 'ROTA_INS_UPD_SHIFTS').then(function (data) {
                $scope.$parent.ShowAlert("Success", "Delete Successfully", 3000);
                $scope.BREAK_LIST = [];
                $('#Add_Shift').modal('hide');
                $('#Multiple_Shifts').modal('hide');

                if (WHERE_CLICK == "EMP_VIEW") {
                    $scope.Schedulerchild.PAGE_LOAD_FY();
                    //if (shift.TOTAL_SHIFT.length > 1) {
                    //    angular.forEach(shift.TOTAL_SHIFT, function (RemoveShift) {
                    //        if (RemoveShift.SHIFT_ID == shift.SHIFT_ID) {
                    //            var index = shift.TOTAL_SHIFT.findIndex(x=>x.SHIFT_ID === shift.SHIFT_ID);
                    //            shift.TOTAL_SHIFT.splice(index, 1);
                    //        }
                    //    })
                    //}
                    //else {
                    //    shift.SHIFT_DETAILS = undefined;
                    //    shift.TOTAL_SHIFT = [];
                    //}
                }
                if (WHERE_CLICK == "AREA_VIEW") {

                    $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                }
                //if (data.data == 0) {
                //    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                //}
                $scope.closeNav();
            });
        }
        else {
            $scope.closeNav();
        }
    }

    $scope.FILTER_SWTICH_ON_OFF_FY = function (SWITCH_FLAG) {
        switch (SWITCH_FLAG) {
            case 1:
                $scope.FILTER_SWTICH_ON_OFF_3 = false;
                $scope.FILTER_SWTICH_ON_OFF_1 = !$scope.FILTER_SWTICH_ON_OFF_1;
                break;
            case 2:
                $scope.FILTER_SWTICH_ON_OFF_2 = !$scope.FILTER_SWTICH_ON_OFF_2;
                break;
            case 3:
                $scope.FILTER_SWTICH_ON_OFF_3 = !$scope.FILTER_SWTICH_ON_OFF_3;
                break;
            case 4:
                $scope.FILTER_SWTICH_ON_OFF_EMPLOYEE = !$scope.FILTER_SWTICH_ON_OFF_EMPLOYEE;
                break;
            case 10:
                $scope.FILTER_SWTICH_ON_OFF_10 = !$scope.FILTER_SWTICH_ON_OFF_10;
                break;
            default:
                $scope.DashboardSelected = true;
                break;
        }
    }

    $scope.ngintDept = function (DEP, index) {
        DEP.Deptindex = index
        var Section = $scope.SECTIONS.filter(function (x) { return x.DEPARTMENT_ID == DEP.DEPARTMENT_ID });
        if (Section.length > 0) {
            DEP.SECTIONS = Section;
        }
    }

    $scope.ROTA_CREATE_SHIFTS_BY_WORKPATTERN_POP = function (Employee_Work_PTN_Form, VIEW_TYPE, WHERE_CLICK) {
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            $('#APPLY_WORK_PATTERN').modal('show');
            $scope.FILTER_SWTICH_ON_OFF_3 = false;
        }
        else {
            $scope.ROTA_CREATE_SHIFTS_BY_WORKPATTERN(1, VIEW_TYPE, WHERE_CLICK);
        }
    }
    $scope.ROTA_CREATE_SHIFTS_BY_WORKPATTERN = function (Employee_Work_PTN_Form, VIEW_TYPE, WHERE_CLICK) {
        if (Employee_Work_PTN_Form != 1) {
            Employee_Work_PTN_Form.submitted = true;
        }
        if (Employee_Work_PTN_Form.$valid || Employee_Work_PTN_Form == 1) {
            ModelObj = new Object();
            ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
            ModelObj.BRANCH_ID = $scope.SELECTED_BRANCH_ID == null ? 0 : $scope.SELECTED_BRANCH_ID;
            ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
            ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
            ModelObj.VIEW_TYPE = VIEW_TYPE;
            ModelObj.USER_ID = parseInt($cookies.get('USERID'));
            ModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
            ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
            ModelObj.DELETE_SHIFT_FLAG = 1;//cope.Section_Week_Search.APPLY_WORK_PATHERN_SHIFT; //--1 FOR DELETE EXISTING SHIFTS, 0 FOR OVERLAP
            PrcCommMethods.HR_API(ModelObj, 'ROTA_CREATE_SHIFTS_BY_WORKPATTERN').then(function (data) {
                if (data.data == 1) {
                    $scope.$parent.ShowAlert("Success", "Work Pattern Applied Successfully", 3000);
                    if (WHERE_CLICK == "EMP_VIEW") {
                        $scope.Schedulerchild.PAGE_LOAD_FY();
                    }
                    if (WHERE_CLICK == "AREA_VIEW") {
                        $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);

                    }
                    $('#APPLY_WORK_PATTERN').modal('hide');
                }
                if (data.data == 0) {
                    $scope.$parent.ShowAlert("Error", $scope.$parent.SOMETHINGWENTWRONG, 3000);
                }
            });
        }
    };

    $scope.ROTA_GET_TEMPLATES = function (VIEW_TYPE, OPEN_TAB) {
        $scope.FILTER_SWTICH_ON_OFF_FY(OPEN_TAB);
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.TEMPLATE_NAME = ''//$scope.Section_Week_Search.TEMPLATE_NAME == null ? '' : $scope.Section_Week_Search.TEMPLATE_NAME;
        ModelObj.VIEW_TYPE = VIEW_TYPE;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 100;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_TEMPLATES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.ROTA_TEMPLATES = data.data.Table;
            } else {
                $scope.ROTA_TEMPLATES = [];
            };
        });
    };
    $scope.ROTA_CREATE_SHIFTS_BY_TEMPLATE_POP = function (Employee_APPLY_TEMPLATE_Form, VIEW_TYPE, WHERE_CLICK) {
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            if ($scope.Section_Week_Search.ROTA_TEMPLATE_ID == null || $scope.Section_Week_Search.ROTA_TEMPLATE_ID == '') {
                $scope.$parent.ShowAlert("Error", "Please Select Template", 3000);
            }
            else {
                $('#APPLY_TEMPLATE').modal('show');
                $scope.FILTER_SWTICH_ON_OFF_3 = false;
                $scope.FILTER_SWTICH_ON_OFF_10 = false;
            }
        }
        else {
            $scope.ROTA_CREATE_SHIFTS_BY_TEMPLATE(1, VIEW_TYPE, WHERE_CLICK);
        }
    }

    $scope.ROTA_CREATE_SHIFTS_BY_TEMPLATE = function (Employee_APPLY_TEMPLATE_Form, VIEW_TYPE, WHERE_CLICK) {
        if ($scope.Section_Week_Search.ROTA_TEMPLATE_ID == null || $scope.Section_Week_Search.ROTA_TEMPLATE_ID == '') {
            $scope.$parent.ShowAlert("Error", "Please Select Template", 3000);
        }
        else {
            if (Employee_APPLY_TEMPLATE_Form != 1) {
                Employee_APPLY_TEMPLATE_Form.submitted = true;
            }
            if (Employee_APPLY_TEMPLATE_Form.$valid || Employee_APPLY_TEMPLATE_Form == 1) {
                ModelObj = new Object();
                ModelObj.TEMPLATE_ID = $scope.Section_Week_Search.ROTA_TEMPLATE_ID;
                ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                ModelObj.BRANCH_ID = '';
                ModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
                ModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
                ModelObj.VIEW_TYPE = VIEW_TYPE;
                ModelObj.USER_ID = parseInt($cookies.get("USERID"));
                ModelObj.DELETE_SHIFT_FLAG = 1;//$scope.Section_Week_Search.APPLY_TEMPLATE_SHIFT; //--1 FOR DELETE EXISTING SHIFTS, 0 FOR OVERLAP
                PrcCommMethods.HR_API(ModelObj, 'ROTA_CREATE_SHIFTS_BY_TEMPLATE').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert("Success", "Selected Template Applied Succesfully", 3000);
                        if (WHERE_CLICK == 'AREA_VIEW') { $scope.Schedulerchild.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE); }
                        if (WHERE_CLICK == 'EMP_VIEW') { $scope.Schedulerchild.PAGE_LOAD_FY(); }
                        $scope.ROTA_SHIFTS_BY_TEMPLATE = data.data.Table;
                        $scope.FILTER_SWTICH_ON_OFF_10 = false;
                        $scope.FILTER_SWTICH_ON_OFF_3 = false;
                        $scope.Section_Week_Search.ROTA_TEMPLATE_ID = null
                        $('#APPLY_TEMPLATE').modal('hide');
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                        $scope.ROTA_SHIFTS_BY_TEMPLATE = [];
                        $scope.FILTER_SWTICH_ON_OFF_10 = false;
                    };
                });
            }
        }
    };

    $scope.DRAG_SHIFT = function (shift) {
    }
    $scope.dropped = function (dragEl, dropEl, EL, Cell, VIEW_NAME) {
        $scope.NG_CHANGE_COST = 1;
        var attrbt = $('#' + dragEl).attr('data-id');
        if (attrbt != 'objects--1' && attrbt != 'objects--2') {
            if (!EL.ACTIVE && VIEW_NAME == "AREA_VIEW") {/////check for In active section  AREA_VIEW 
                $scope.$parent.ShowAlert("Warning", "Inactive Section", 3000)
                $('#EmployeeSearchBox').val('');
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                $scope.Section_Week_Search.START_TIME = '';
            }
            else if (Cell.IS_DEACTIVATED) {/////check for employee week view 
                $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
                $('#EmployeeSearchBox').val('');
                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                $scope.Section_Week_Search.START_TIME = '';
            } else {
                //  var emp = $('#' + dragEl).attr('data-id');
                var shiftDragDrop = parseInt(attrbt.substring(7, 9999999));
                var EMPDragDrop = parseInt(attrbt.substring(8, 9999999));
                var DRAG_SHIFT = {};
                $scope.SELECTED_CELL = Cell;
                if (EMPDragDrop > -1) {
                    for (var i = 0; i < $scope.EMPLOYEE_LIST_ALL.length; i++) {
                        if ($scope.EMPLOYEE_LIST_ALL[i].EMP_PRS_ID == EMPDragDrop) {
                            $scope.Section_Week_Search.EMP_PRS_ID = $scope.EMPLOYEE_LIST_ALL[i].EMP_PRS_ID;
                            $scope.Section_Week_Search.EMPLOYEE_NAME = $scope.EMPLOYEE_LIST_ALL[i].EMPLOYEE_NAME;
                            $scope.EMPLOYEE_LIST_ALL[i].TABLE_ID = EL.TABLE_ID;
                            $scope.EMPLOYEE_LIST_ALL[i].SECTION_NAME = EL.DISPLAY_TEXT;
                            $scope.EMPLOYEE_LIST_ALL[i].ACTIVE = EL.ACTIVE;
                            $scope.EMPLOYEE_LIST_ALL[i].BRANCH_ID = EL.BRANCH_ID;
                            ///check for area week view 
                            $scope.EMPLOYEE_LIST_ALL[i].IS_DEACTIVATED = false;
                            if ($scope.EMPLOYEE_LIST_ALL[i].TERMINATION_DATE != null && new Date($scope.EMPLOYEE_LIST_ALL[i].TERMINATION_DATE) < new Date(Cell.NewDate)) {
                                $scope.EMPLOYEE_LIST_ALL[i].IS_DEACTIVATED = true;
                                $scope.$parent.ShowAlert("Warning", "Leaver cannot be added", 3000)
                                $('#EmployeeSearchBox').val('');
                                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                                $scope.Section_Week_Search.START_TIME = '';
                                $scope.$apply();
                                break;
                            }
                            if ($scope.EMPLOYEE_LIST_ALL[i].START_DATE != null && new Date($scope.EMPLOYEE_LIST_ALL[i].START_DATE) > new Date(Cell.NewDate)) {
                                $scope.$parent.ShowAlert("Warning", "Employee not join yet", 3000)
                                $scope.EMPLOYEE_LIST_ALL[i].IS_NOT_JOIN_YET = false;
                                $scope.$parent.ShowAlert("Warning", "Employee Not join yet", 3000)
                                $('#EmployeeSearchBox').val('');
                                $scope.Section_Week_Search.EMPLOYEE_NAME = '';
                                $scope.Section_Week_Search.START_TIME = '';
                                $scope.$apply();
                                break;
                            }


                            $scope.ADD_NEW_SHIFT_POP($scope.EMPLOYEE_LIST_ALL[i], Cell, VIEW_NAME);
                            $scope.$apply();
                            break;
                        }
                    }
                }
                else {
                    $scope.ADD_NEW_SHIFT_POP(EL, Cell, VIEW_NAME)
                    for (var i = 0; i < $scope.SHIFT_MASTER_LIST.length; i++) {
                        if (i == shiftDragDrop) {
                            $scope.ON_ASSGING_SELECT_SHIFT_CLICK($scope.SHIFT_MASTER_LIST[i]);
                            $scope.$apply();
                            break;
                        }
                    }
                }
                //ng-click="ADD_NEW_SHIFT_POP(EL,Shift,'EMP_VIEW'
                //drop.addClass(bgClass);
                //drop.attr('data-id', bgClass);
                //if (drag.attr("x-lvl-drop-target")) {
                //    drag.removeClass(bgClass);
                //}
            }
        }
        else { $(".lvl-over").removeClass("lvl-over"); }

    }
    $scope.PRINT_ROTA = function () {

        if ($scope.Section_Week_Search.RotaReportWeeky == 1) {
            if ($scope.PDF_DATA.length > 0) {
                var doc = new jsPDF("l", "pt", "a3");
                var res = doc.autoTableHtmlToJson(document.getElementById("PDF"));
                doc.text("Rota - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 400, 30)
                doc.autoTable(res.columns, res.data, {
                    startY: false,
                    margin: { horizontal: 10 },
                    showHead: "everyPage",
                    theme: "striped",
                    tableWidth: 'auto',
                    columnWidth: 'wrap',
                    tableLineColor: 100,
                    tableLineWidth: 0,
                    columnStyles: {
                        0: {
                            columnWidth: 'auto'
                        },
                        1: {
                            columnWidth: 'auto'
                        },
                        2: {
                            columnWidth: 'auto'
                        },
                        3: {
                            columnWidth: 'auto'
                        },
                        4: {
                            columnWidth: 'auto'
                        },
                        5: {
                            columnWidth: 'auto'
                        },
                        6: {
                            columnWidth: 'auto'
                        },
                        7: {
                            columnWidth: 'auto'
                        },
                        8: {
                            columnWidth: 'auto'
                        },
                        9: {
                            columnWidth: 'auto'
                        },
                        10: {
                            columnWidth: 'auto'
                        }
                    },
                    headerStyles: {
                        theme: 'grid'
                    },
                    styles: {
                        overflow: 'linebreak',
                        columnWidth: 'wrap',
                        //font: getFontList().arial,
                        fontSize: 8,
                        cellPadding: 8,
                        overflowColumns: 'linebreak'
                    },
                    didParseCell: function (row, res) {

                        if (res.row.raw[0].trim().length == 16) {
                        }
                    },
                    didDrawPage: function (data) {
                        // Header
                        doc.setFontSize(20);
                        doc.setTextColor(40);
                        doc.text("Report", 10, 10);
                        // Footer
                        var str = "Page " + doc.internal.getNumberOfPages();
                        doc.setFontSize(10);
                        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                        var pageSize = doc.internal.pageSize;
                        var pageHeight = pageSize.height
                            ? pageSize.height
                            : pageSize.getHeight();
                        doc.text(str, data.settings.margin.left, pageHeight - 10);
                    },
                    drawRow: function (row, res) {

                        if (res.row.raw[0].trim().length == 16) {
                            res.row.styles.fontSize = '15';
                            //    var str = "Page " + doc.internal.getNumberOfPages() + 1;
                            //    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                            //    var pageSize = doc.internal.pageSize;
                            //    var pageHeight = pageSize.height
                            //        ? pageSize.height
                            //        : pageSize.getHeight();
                            //    doc.text(str, res.settings.margin.left, pageHeight - 10);
                            //    doc.addPage();
                        }
                    },
                    drawCell: function (row, res) {
                        if (res.row.raw[0] == 'EMPLOYEE NAME') {
                            doc.setFillColor(41, 128, 186);
                            doc.setTextColor(255, 255, 255);
                            doc.setFontStyle('bold');
                        }

                    },
                    createdHeaderCell: function (cell, res) {
                        if (cell.raw != '') {
                            if (cell.raw.trim().split(':').length > 0) {
                                cell.styles.fontSize = 12;
                                cell.styles.fillColor = 250;
                                cell.styles.columnWidth = "auto";
                                cell.styles.fontStyle = "normal";
                                cell.styles.rowHeight = 20.5;
                                cell.styles.textColor = 70;
                                cell.styles.theme = "grid";
                            }
                            // res.row.styles.fillColor = 245;
                            // res.row.styles.textColor = 120;
                        }
                    },
                    createdCell: function (cell, res) {
                        if (cell.raw != '') {
                            if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                                cell.styles.fontSize = 12;
                                cell.styles.fillColor = 250;
                                res.row.styles.fillColor = 250;

                                //cell.styles.cellPadding = 12;
                                //cell.styles.textColor = [255, 0, 0];
                            }
                        }
                    },
                    drawHeaderRow: function (row, res) {
                        if (res.pageCount > 1) {
                            return false;
                        }
                    }
                });
                doc.save("Rota - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + ".pdf");
            } else {
                $scope.$parent.ShowAlert('Attention', 'No Record Found.', 3000);
            }
        }
        else if ($scope.Section_Week_Search.RotaReportWeeky == 2) {
            var doc = new jsPDF("l", "pt", "a3");
            var res = doc.autoTableHtmlToJson(document.getElementById("BookStorePDF"));
            doc.text("Weekly Schedule - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 400, 30)
            doc.autoTable(res.columns, res.data, {
                startY: false,
                //margin: { horizontal: 10 },
                showHead: "everyPage",
                theme: "grid",
                tableWidth: 'auto',
                columnWidth: 'wrap',
                tableLineColor: 100,
                tableLineWidth: 0,
                columnStyles: {
                    0: {
                        columnWidth: 140
                    },
                    1: {
                        columnWidth: 140
                    },
                    2: {
                        columnWidth: 140
                    },
                    3: {
                        columnWidth: 140
                    },
                    4: {
                        columnWidth: 140
                    },
                    5: {
                        columnWidth: 140
                    },
                    6: {
                        columnWidth: 140
                    },
                    7: {
                        columnWidth: 140
                    },
                    8: {
                        columnWidth: 140
                    },
                    9: {
                        columnWidth: 140
                    },
                    10: {
                        columnWidth: 140
                    }
                },
                headerStyles: {
                    theme: 'grid'
                },
                styles: {
                    overflow: 'linebreak',
                    columnWidth: 'wrap',
                    //font: getFontList().arial,
                    fontSize: 8,
                    cellPadding: 8,
                    overflowColumns: 'linebreak'
                },
                didParseCell: function (row, res) {

                    //if (res.row.raw[0].trim().length == 16) {
                    //}
                },
                didDrawPage: function (data) {
                    // Header
                    doc.setFontSize(20);
                    doc.setTextColor(40);
                    doc.text("Report", 10, 10);
                    // Footer
                    var str = "Page " + doc.internal.getNumberOfPages();
                    doc.setFontSize(10);
                    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                    var pageSize = doc.internal.pageSize;
                    var pageHeight = pageSize.height
                        ? pageSize.height
                        : pageSize.getHeight();
                    doc.text(str, data.settings.margin.left, pageHeight - 10);
                },
                drawRow: function (row, res) {
                    //if (res.row.raw[0].trim().length == 16) {
                    //    res.row.styles.fontSize = '15';
                    //}
                    // res.row.styles.fillColor = (0, 75, 109);
                },
                drawCell: function (row, res) {
                    //if (res.row.raw[0] == 'EMPLOYEE NAME') {
                    //doc.setFillColor(0, 75, 109);
                    //	doc.setTextColor(255, 255, 255);
                    //	doc.setFontStyle('bold');
                    //}

                },
                createdHeaderCell: function (cell, res) {
                    if (cell.raw != '') {
                        if (cell.raw.trim().split(':').length > 0) {
                            cell.styles.fillColor = (0, 75, 109);
                            //cell.setFillColor(0, 75, 109);
                            // cell.styles.columnWidth = "100";
                            //cell.styles.fontStyle = "normal";
                            cell.styles.halign = 'left';
                            cell.styles.valign = 'middle';
                            cell.styles.fontSize = 16;
                            //cell.styles.lineWidth = 0.1;
                            cell.styles.cellPadding = 5;
                            //lineWidth: 0.1
                            cell.styles.rowHeight = 30;
                            //cell.styles.textColor = 70;
                            //cell.styles.theme = "grid";
                        }
                        //cellPadding: 8
                        //columnWidth: "auto"
                        //fillColor: (3)[26, 188, 156]
                        //fillStyle: "F"
                        //font: "helvetica"
                        //fontSize: 8
                        //fontStyle: "bold"
                        //halign: "left"
                        //lineColor: 200
                        //lineWidth: 0.1
                        //overflow: "linebreak"
                        //overflowColumns: "linebreak"
                        //rowHeight: 23
                        //textColor: 255
                        //theme: "grid"
                        //valign: "top"
                    }
                },
                createdCell: function (cell, res) {
                    if (cell.raw != '') {
                        if (cell.raw.trim().split(':').length > 0) {
                            cell.styles.halign = 'left';
                            cell.styles.valign = 'middle';
                            cell.styles.fontSize = 10;
                            //cell.styles.fillColor = 250;
                            cell.styles.columnWidth = "auto";
                            //cell.styles.fontStyle = "normal";
                            cell.styles.rowHeight = 5;
                            cell.styles.cellPadding = 5;
                            //cell.styles.lineWidth = 0.1;
                            //cell.styles.textColor = 70;
                            //  cell.styles.theme = "grid";
                        }

                        //	if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                        //		cell.styles.fontSize = 12;
                        //		cell.styles.fillColor = 250;
                        //		res.row.styles.fillColor = 250;
                        //	}
                    }
                },
                drawHeaderRow: function (row, res) {
                    if (res.pageCount > 1) {
                        return false;
                    }
                }
            });
            doc.save("Rota - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + ".pdf");
        }
        else if ($scope.Section_Week_Search.RotaReportWeeky == 3) {
            //var doc = new jsPDF("l", "pt", "a3");
            //var res = doc.autoTableHtmlToJson(document.getElementById("SectionPDF"));
            //doc.text("Weekly Schedule - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 400, 30)
            //doc.autoTable(res.columns, res.data, {
            //    startY: false,
            //    //margin: { horizontal: 10 },
            //    showHead: "everyPage",
            //    theme: "grid",
            //    tableWidth: 'auto',
            //    columnWidth: 'wrap',
            //    tableLineColor: 100,
            //    tableLineWidth: 0,
            //    columnStyles: {
            //        0: {
            //            columnWidth: 140
            //        },
            //        1: {
            //            columnWidth: 140
            //        },
            //        2: {
            //            columnWidth: 140
            //        },
            //        3: {
            //            columnWidth: 140
            //        },
            //        4: {
            //            columnWidth: 140
            //        },
            //        5: {
            //            columnWidth: 140
            //        },
            //        6: {
            //            columnWidth: 140
            //        },
            //        7: {
            //            columnWidth: 140
            //        },
            //        8: {
            //            columnWidth: 140
            //        },
            //        9: {
            //            columnWidth: 140
            //        },
            //        10: {
            //            columnWidth: 140
            //        }
            //    },
            //    headerStyles: {
            //        theme: 'grid'
            //    },
            //    styles: {
            //        overflow: 'linebreak',
            //        columnWidth: 'wrap',
            //        //font: getFontList().arial,
            //        fontSize: 8,
            //        cellPadding: 8,
            //        overflowColumns: 'linebreak'
            //    },
            //    didParseCell: function (row, res) {

            //        //if (res.row.raw[0].trim().length == 16) {
            //        //}
            //    },
            //    didDrawPage: function (data) {
            //        // Header
            //        doc.setFontSize(20);
            //        doc.setTextColor(40);
            //        doc.text("Report", 10, 10);
            //        // Footer
            //        var str = "Page " + doc.internal.getNumberOfPages();
            //        doc.setFontSize(10);
            //        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
            //        var pageSize = doc.internal.pageSize;
            //        var pageHeight = pageSize.height
            //            ? pageSize.height
            //            : pageSize.getHeight();
            //        doc.text(str, data.settings.margin.left, pageHeight - 10);
            //    },
            //    drawRow: function (row, res) {
            //        //if (res.row.raw[0].trim().length == 16) {
            //        //    res.row.styles.fontSize = '15';
            //        //}
            //        // res.row.styles.fillColor = (0, 75, 109);
            //    },
            //    drawCell: function (row, res) {
            //        //if (res.row.raw[0] == 'EMPLOYEE NAME') {
            //        //doc.setFillColor(0, 75, 109);
            //        //	doc.setTextColor(255, 255, 255);
            //        //	doc.setFontStyle('bold');
            //        //}

            //    },
            //    createdHeaderCell: function (cell, res) {
            //        if (cell.raw != '') {
            //            if (cell.raw.trim().split(':').length > 0) {
            //                cell.styles.fillColor = (0, 75, 109);
            //                //cell.setFillColor(0, 75, 109);
            //                // cell.styles.columnWidth = "100";
            //                //cell.styles.fontStyle = "normal";
            //                cell.styles.halign = 'left';
            //                cell.styles.valign = 'top';
            //                cell.styles.fontSize = 16;
            //                //cell.styles.lineWidth = 0.1;
            //                cell.styles.cellPadding = -8;
            //                //lineWidth: 0.1
            //                cell.styles.rowHeight = 5;
            //                //cell.styles.textColor = 70;
            //                //cell.styles.theme = "grid";
            //            }
            //            //cellPadding: 8
            //            //columnWidth: "auto"
            //            //fillColor: (3)[26, 188, 156]
            //            //fillStyle: "F"
            //            //font: "helvetica"
            //            //fontSize: 8
            //            //fontStyle: "bold"
            //            //halign: "left"
            //            //lineColor: 200
            //            //lineWidth: 0.1
            //            //overflow: "linebreak"
            //            //overflowColumns: "linebreak"
            //            //rowHeight: 23
            //            //textColor: 255
            //            //theme: "grid"
            //            //valign: "top"
            //        }
            //    },
            //    createdCell: function (cell, res) {
            //        if (cell.raw != '') {
            //            if (cell.raw.trim().split(':').length > 0) {
            //                cell.styles.halign = 'left';
            //                cell.styles.valign = 'middle';
            //                cell.styles.fontSize = 10;
            //                //cell.styles.fillColor = 250;
            //                cell.styles.columnWidth = "auto";
            //                //cell.styles.fontStyle = "normal";
            //                cell.styles.rowHeight = 5;
            //                cell.styles.cellPadding = 5;
            //                //cell.styles.lineWidth = 0.1;
            //                //cell.styles.textColor = 70;
            //                //  cell.styles.theme = "grid";
            //            }

            //            //	if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
            //            //		cell.styles.fontSize = 12;
            //            //		cell.styles.fillColor = 250;
            //            //		res.row.styles.fillColor = 250;
            //            //	}
            //        }
            //    },
            //    drawHeaderRow: function (row, res) {
            //        if (res.pageCount > 1) {
            //            return false;
            //        }
            //    }
            //});
            //doc.save("Rota - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + ".pdf");
            $scope.PRINT_PDF_RotaSectionView();
        }
    }
    $scope.MODAL_CLOCKOUT = function () {
        $('#CLOCKOUT').modal("hide");
    }
    $scope.MODAL_CLOCKIN = function () {
        $('#CLOCKIN').modal("hide");
    }
    $scope.PRINT_PDF_POP = function () {
        //if ($scope.SHIFTS_LIST_ALL.length > 0) { }
        $scope.Section_Week_Search.RotaReportWeeky = "1";
        $('#PRINTROTA').modal('show');

    };
    $scope.saveAsXlsx = function () {
        if ($scope.PDF_DATA.length > 0) {
            $scope.EXCEL_REPORT_DATA_LIST = [];
            angular.forEach($scope.PDF_DATA, function (item) {
                if ($scope.LOGIN_LOGOUT_DETAILS.length > 0) {
                    var logn = $scope.LOGIN_LOGOUT_DETAILS.filter(function (x) { return x.SHIFT_ID == item.SHIFT_ID });
                    if (item.LOGIN_LOGOUT_DETAILS == undefined) {
                        item.LOGIN_LOGOUT_DETAILS = {};
                    }
                    if (logn.length > 0) {
                        item.LOGIN_LOGOUT_DETAILS = logn[0];
                    }
                }
                $scope.SELECTED_DATA = [];
                $scope.EXCEL_FILE_NAME = null;
                $scope.SELECTED_DATA =
                    {
                        'EMPLOYEE NAME': item.EMPLOYEE_NAME == null ? (item.EMPTY_OPEN_FLAG == -1 ? 'EMPTY SHIFT' : 'OPEN SHIFT') : item.EMPLOYEE_NAME,
                        'SECTION NAME': item.SECTION_NAME == null ? '--' : item.SECTION_NAME,
                        'DEPARTMENT NAME': item.DEPARTMENT_NAME == null ? '--' : item.DEPARTMENT_NAME,
                        'BRANCH NAME': item.BRANCH_NAME == null ? '--' : item.BRANCH_NAME,
                        'START TIME(min)': $filter('date')(new Date(item.START_TIME), 'HH:mm'),
                        'END TIME(min)': $filter('date')(new Date(item.END_TIME), 'HH:mm'),
                        'PAID BREAK': item.PAID_BREAK == null ? '--' : item.PAID_BREAK,
                        'UNPAID BREAK': item.UNPAID_BREAK == null ? '--' : item.UNPAID_BREAK,
                        'SHIFT COUNT': item.INS_SHIFT_COUNT_WEB,
                        'SHIFT TYPE': item.SHIFT_TYPE == null ? '--' : item.SHIFT_TYPE,
                        'STATUS ID': item.STATUS_ID == 21 ? 'Unpublished' : (item.STATUS_ID == 22 ? 'Published' : 'Approved'),
                        'APPROVED(Hr.)': item.LOGIN_LOGOUT_DETAILS == undefined || item.LOGIN_LOGOUT_DETAILS.APPROVED_DURATION_IN_MINS == null ? '00.00' : ((item.LOGIN_LOGOUT_DETAILS.APPROVED_DURATION_IN_MINS) / 60).toFixed(2)
                    };
                $scope.EXCEL_REPORT_DATA_LIST.push($scope.SELECTED_DATA);
            });
            $scope.EXCEL_FILE_NAME = "Rota - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")";
            //alasql('SELECT * INTO XLSX("Rota - ("' + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + '".xlsx",{headers:true}) FROM ?', [$scope.EXCEL_REPORT_DATA_LIST]);

            alasql('SELECT * INTO XLSX("' + $scope.EXCEL_FILE_NAME + '.xlsx",{headers:true}) FROM ? Order By [START TIME(min)]', [$scope.EXCEL_REPORT_DATA_LIST]);
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'No Record Found.', 3000);
        }
    };
    $scope.WEEK_PRINT = function () {
        var contents = $("#dvContents").html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>DIV Contents</title>');
        frameDoc.document.write('</head><body>');
        //Append the external CSS file.
        frameDoc.document.write('<link rel=\"stylesheet\" href=\"https:\\testing.wenodo.com\E_Content/bootstrap.min.css\" type=\"text/css\" media=\"print\"/>');
        frameDoc.document.write('<link rel=\"stylesheet\" href=\"https:\\testing.wenodo.com\E_Content\CustomCss\hr-admin.min.css\" type=\"text/css\" media=\"print\"/>');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);

    }

    $scope.IS_ADD_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(43, 2);
    $scope.IS_EDIT_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(43, 3);
    $scope.IS_DELETE_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(43, 4);
    $scope.IS_DELETE_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(43, 4);

    ////////////////////////////////////////////////////////////////////
    $scope.PRINT_PDF_RotaSectionView = function () {
        window.scrollTo(0, 0);
        const node = document.getElementById("content");
        const clone = node.cloneNode(true);
        clone.querySelector("#content1").remove();
        clone.querySelector("#content2").remove();
        html2canvas(document.body.appendChild(clone), { useCORS: true, scale: 2 }).then(function (canvas) {
            var imgBase64 = canvas.toDataURL('image/jpeg', 2.0);
            document.body.removeChild(clone);
            var doc = new jsPDF("p", "pt", "a4");
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const widthRatio = pageWidth / canvas.width;
            const heightRatio = pageHeight / canvas.height;
            const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;
            const canvasHeight = canvas.height * ratio;
            doc.addImage(imgBase64, 'JPEG', 2, 5, pageWidth - 3, canvasHeight);
            doc.save('Rota Section View.pdf');
        });
    };

});
app.controller('New_AreaWeekViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $filter('lowercase')($location.absUrl()).indexOf("emp_e_week_view") != -1 ? $scope.$parent.IS_EMPLOYEE = true : $scope.$parent.IS_EMPLOYEE = false;
    $filter('lowercase')($location.absUrl()).indexOf("emp_a_week_view") != -1 ? $scope.$parent.IS_EMPLOYEE = true : $scope.$parent.IS_EMPLOYEE = false;
    $scope.Section_Week_Search.SELECTED_BRANCH_ID = null;
    $scope.COMMON_CODE_CHANGE();
    $scope.Section_Week_Search.EMP_SEARCH = '';
    $scope.$parent.VIEW_TYPE = 2;
    $scope.ROTA_DAYS_LENGTH = 7;
    $scope.PAGE_LOAD_FLAG = 1;
    $scope.TOTAL_DATEWISE_COST = 0;
    $scope.Section_Week_Search.DISPLAY_TEXT = "ALL";
    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = "-Department-";
    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = "-Department-";
    $scope.Section_Week_Search.DDL_BRANCH_TEXT = "-Branch-";
    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = undefined;
    $scope.Section_Week_Search.searchDepartmentText = '';
    $scope.Section_Week_Search.searchText = '';

    $scope.Section_Week_Search.DepartmentALL = false;
    $scope.Section_Week_Search.DepartmentShiftALL = false;
    $scope.Section_Week_Search.BranchSectionALL = false;
    $scope.Section_Week_Search.BRANCHALL = false;

    $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS = "";
    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";

    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";


    $scope.$parent.closeNav5();
    $scope.propertyName = 'FIRST_NAME';
    $scope.SHOW_ALL_DETIAL_FILTER = true;
    var ShowAllDtls = $scope.FilterModuleAccess(1, 6);//Show All Details
    if (ShowAllDtls != "") { $scope.SHOW_ALL_DETIAL_FILTER = ShowAllDtls.VALUE == '1' ? true : false; }

    $scope.NextWeek = [];
    $scope.$parent.APPROVE_SHIFT_ARRAY = [];
    $scope.JUMPTO_NEXT_COUNTER = 0;
    var EMPLOYEE_EMP_PRS_ID;
    $scope.weekpicker, $scope.start_date, $scope.end_date;
    $scope.weekpicker_copy, $scope.start_date_copy, $scope.end_date_copy;
    var PARAM_STARTDATE;
    $scope.$parent.BRANCH_ADD_LIST = [];
    $scope.APPROVED_LEAVE_COUNT = 0;
    $scope.EMPTY_COUNT = 0;
    $scope.OPEN_COUNT = 0;
    $scope.PENDING_LEAVE_COUNT = 0;
    $scope.PUBLISHED_COUNT = 0;
    $scope.UNPUBLISHED_COUNT = 0;
    $scope.WARNINGS = 0;
    $scope.NO_SHOW_SHIFT_COUNT = 0;
    var INDEX_OF_REMOVE_ID = null;
    $scope.DEPORSECSELECT = null;

    $scope.APPROVAL_IDS = [];
    $scope.SELECT_DESELECT_DATE_WISE_GRID = [];
    $scope.TOTAL_MINTS = 0;
    $scope.TOTAL_HOURS = 0;
    $scope.TOTAL_MINTS_SUM = 0;
    $scope.HIGHLIGHTED = false;
    $scope.HIGHLIGHT_EMPLOYEE_ID = 0;
    $scope.TOTAL_SHIFT_COUNT = 0;
    $scope.FOOTER_SHIFT_SHIFTCOUNT = 0;

    $scope.SORT_ORDER_LIST = [
        //{ ID: 1, NAME: "Display Name" },
        { ID: 1, NAME: "First Name", ASC: true, IS_ACTIVE: true, SORT_BY: "FIRST_NAME" },
        { ID: 3, NAME: "Last Name", ASC: false, IS_ACTIVE: false, SORT_BY: "LAST_NAME" },
        { ID: 4, NAME: "Total Hours", ASC: false, IS_ACTIVE: false, SORT_BY: "SHIFT_DURATION" },
        { ID: 5, NAME: "No Of Shifts", ASC: false, IS_ACTIVE: false, SORT_BY: "NO_OF_SHIFTS" },
        //{ ID: 6, NAME: "Base Cost" },
        //{ ID: 7, NAME: "Stress" },
        { ID: 5, NAME: "Age", ASC: false, IS_ACTIVE: false, SORT_BY: "DATE_OF_BIRTH" },
        { ID: 6, NAME: "Position", ASC: false, IS_ACTIVE: false, SORT_BY: "POSITION_TITLE" },
        //{ ID: 9, NAME: "Role" },
        //{ ID: 10, NAME: "Most Qualified" },
        //{ ID: 11, NAME: "Distance" },
        { ID: 7, NAME: "Tenure", ASC: false, IS_ACTIVE: false, SORT_BY: "START_DATE" },
        //{ ID: 13, NAME: "Leave/Available" },
    ];

    $scope.PUBLISH_SHIFT_LIST = [];
    $scope.LOGIN_LOGOUT_LIST = [];
    $scope.SET_SHIFT_TO_OPEN_LIST = [];
    $scope.DELETE_SHIFT_LIST = [];
    $scope.UNPUBLISH_SHIFT_LIST = [];
    $scope.APPROVE_SHIFT_LIST = [];
    $scope.LOGIN_LIST = [];
    $scope.OPEN_SHIFT_LIST = [];
    $scope.APPROVE_SHIFT_LIST = [];
    $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
    $scope.EMTY_SHIFT_LIST = [];
    $scope.$parent.LOGIN_LOGOUT_LIST = [];
    $scope.LOGIN_LOGOUT_DETAILS = [];
    $scope.$parent.LOGIN_LOGOUT_DETAILS = [];
    $scope.$parent.SET_SHIFT_TO_OPEN_LIST = [];
    $scope.$parent.DELETE_SHIFT_LIST = [];
    $scope.$parent.UNPUBLISH_SHIFT_LIST = [];
    $scope.$parent.APPROVE_SHIFT_LIST = [];
    $scope.$parent.LOGIN_LIST = [];
    $scope.$parent.PUBLISH_SHIFT_LIST = [];
    $scope.OPEN_SHIFT_LIST = [];
    $scope.$parent.EMTY_SHIFT_LIST = [];
    $scope.$parent.OPEN_SHIFT_LIST = [];
    $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
    // $scope.SECTIONS_LIST = [];
    $scope.FORECAST_REVENUE_LIST = [];
    $scope.AREA_DEPARTMENTS = [];
    $scope.DEPARTMENT_ROTA_LIST = [];
    $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
    $scope.REVENUE_SEARCH = {
        LAST_YEAR: {}, WAGE_SETTING: {},
        PLUS_MINUS_ICON_REVENUR: false,
        PLUS_MINUS_ICON_LAST_YEAR: false,
        PLUS_MINUS_ICON_LAST_WEEK_SALES: false,
        PLUS_MINUS_ICON_BUDGET_REVENUE: false,
        PLUS_MINUS_ICON_FORECAST_REVENUE: false,
        PLUS_MINUS_ICON_ACTUAL_REVENUE: false,

        PLUS_MINUS_WAGE_COST: false,
        PLUS_MINUS_WAGE_COST_VS_BUDGET: false,
        PLUS_MINUS_WAGE_COST_VS_FORECAST: false,
        PLUS_MINUS_WAGE_COST_VS_ACTUAL: false,


        PLUS_MINUS_WAGE_COST_OUT: false,
        PLUS_MINUS_WAGE_COST_VS_ACTUAL_OUT: false,
    };


    $scope.DAYOFWEEKNAMES = [{ ID: 1, NAME: "Mon", WAGE_COST_VS_BUDGET: 0 }, { ID: 2, NAME: "Tue", WAGE_COST_VS_BUDGET: 0 }, { ID: 3, NAME: "Wed", WAGE_COST_VS_BUDGET: 0 }, { ID: 4, NAME: "Thu", WAGE_COST_VS_BUDGET: 0 }, { ID: 5, NAME: "Fri", WAGE_COST_VS_BUDGET: 0 }, { ID: 6, NAME: "Sat", WAGE_COST_VS_BUDGET: 0 }, { ID: 7, NAME: "Sun", WAGE_COST_VS_BUDGET: 0 }];
    $scope.OPEN_EMPTY_SHIFT = [{ EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shifts ', dayOfWeekNamesShort: angular.copy($scope.dayOfWeekNamesShort) }, { EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shifts ', dayOfWeekNamesShort: angular.copy($scope.dayOfWeekNamesShort) }];
    $scope.START_DAY_OF_WEEK = $scope.$parent.START_DAY_OF_WEEK == undefined ? 0 : $scope.$parent.START_DAY_OF_WEEK;
    //-----------------------------------Week Calendar code + DATE CHANGE IN GRID FUNCTIONALITY ------------------------------------------//


    if ($scope.BRANCH_LIST.length > 0) {
        angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = false; });
        angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = false; });
    }
    $scope.GET_EMPLOYEE_LIST = function () {
        $scope.$parent.EMPLOYEE_LIST_ALL = [];
        var PosiModelObj = new Object();
        PosiModelObj.NAME = null;
        PosiModelObj.SORT_BY = 1;
        PosiModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.USER_ID = $cookies.get("USERID");
        if ($scope.$parent.IS_EMPLOYEE) { PosiModelObj.FLAG = 4; } else {
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                PosiModelObj.FLAG = 3;
            }
            else {
                PosiModelObj.FLAG = 2;
            };
        }
        PosiModelObj.DEPARTMENT_IDS = null;
        PosiModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_LIST_FOR_ROTA').then(function (data) {
            $scope.$parent.EMPLOYEE_LIST_UNIQUE = [];
            $scope.$parent.EMPLOYEE_LIST_ALL = [];
            $scope.EMPLOYEE_LIST_ALL = [];
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST_ALL = angular.copy(data.data.Table);
                var OPEN_EMPTY = [];
                if ($scope.IS_EMPLOYEE) {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', INITIALS: 'OS' });
                }
                else {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', INITIALS: 'OS' }, { EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shift', INITIALS: 'ES' });
                }
                $scope.$parent.EMPLOYEE_LIST_ALL = angular.copy(data.data.Table);
                var EMPLOYEE_LIST_UNIQUE = $filter('unique')(data.data.Table, 'EMP_PRS_ID');
                $scope.$parent.EMPLOYEE_LIST_UNIQUE = OPEN_EMPTY.concat(EMPLOYEE_LIST_UNIQUE);
            }
        });
    };
    $scope.GET_EMPLOYEE_LIST();
    $scope.GET_EMPLOYEE_LIST_FOR_ROTA = function () {
        var PosiModelObj = new Object();
        PosiModelObj.NAME = null;// $scope.Section_Week_Search.EMP_SEARCH;
        var LIST = $scope.SORT_ORDER_LIST.filter(function (x) { return x.IS_ACTIVE == true })
        if (LIST.length > 0) {
            PosiModelObj.SORT_BY = LIST[0].IS_ACTIVE && LIST[0].ASC ? LIST[0].ID : LIST[0].ID + 1;
        }
        angular.forEach($scope.BRANCH_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = SC.BRANCH_ID;
                }
                else {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS + "," + SC.BRANCH_ID;
                }
            }
            if ($scope.PAGE_LOAD_FLAG == 1 && $scope.$parent.SETTING_VALUE_26 != 1 && !$scope.IS_EMPLOYEE && $scope.USER_FILTER_APPLY == 0) { $scope.Section_Week_Search.BRANCHALL = true;; SC.IS_CHECK_BRANCH = true };
        });
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT) {
                if ($scope.Section_Week_Search.DEPARTMENT_EMP_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS + "," + SC.DEPARTMENT_ID;
                }
            }
            if ($scope.PAGE_LOAD_FLAG == 1 && $scope.$parent.SETTING_VALUE_26 != 1 && !$scope.IS_EMPLOYEE && $scope.USER_FILTER_APPLY == 0) {
                SC.IS_CHECK_DEPT = true; $scope.Section_Week_Search.DepartmentALL = true;
            };
        });

        PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS;

        //PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS == null ? '' : $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;
        //PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == null ? 0 : $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;
        //PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.FILTER_DEPARTMENT_ID == undefined ? '' : $scope.Section_Week_Search.FILTER_DEPARTMENT_ID;


        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.USER_ID = $cookies.get("USERID");

        if ($scope.$parent.IS_EMPLOYEE) {
            PosiModelObj.FLAG = 4;
        }
        else {
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                PosiModelObj.FLAG = 3;
            }
            else {
                PosiModelObj.FLAG = 2;
            }
        }
        PosiModelObj.PRIVILAGE_FLAG = $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_LIST_FOR_ROTA').then(function (data) {
            // $scope.$parent.EMPLOYEE_LIST_UNIQUE = [];
            // $scope.$parent.EMPLOYEE_LIST_ALL = [];
            //   $scope.EMPLOYEE_LIST_ALL = [];
            $scope.EMPLOYEE_LIST = [];
            $scope.OPEN_EMPTY_LIST = [];
            $scope.EMPLOYEE_LIST_COPY = [];
            if (data.data.Table.length > 0) {
                // $scope.EMPLOYEE_LIST_ALL = angular.copy(data.data.Table);
                var OPEN_EMPTY = [];
                if ($scope.IS_EMPLOYEE) {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0, INITIALS: 'OS' });
                }
                else {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0, INITIALS: 'OS' }, { EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shift', SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0, INITIALS: 'ES' });
                }
                if (data.data.Table1.length > 0) {
                    angular.forEach(OPEN_EMPTY, function (OP) {
                        var LIST = data.data.Table1.filter(x => x.EMP_PRS_ID == OP.EMP_PRS_ID);
                        if (LIST.length > 0) {
                            OP.SHIFT_DURATION = LIST[0].SHIFT_DURATION;
                            OP.NO_OF_SHIFTS = LIST[0].NO_OF_SHIFTS;
                        }
                    })
                }
                $scope.LEAVE_LIST = [];
                $scope.LEAVE_LIST = data.data.Table.filter(function (x) { return x.LEAVE_STATUS_ID != null });
                var EMPLOYEE_LIST_UNIQUE = angular.copy($filter('unique')(data.data.Table, 'EMP_PRS_ID'));
                EMPLOYEE_LIST_UNIQUE = EMPLOYEE_LIST_UNIQUE;

                $scope.OPEN_EMPTY_LIST = angular.copy(OPEN_EMPTY);
                // $scope.$parent.EMPLOYEE_LIST_ALL = angular.copy($scope.EMPLOYEE_LIST_ALL);
                OPEN_EMPTY = OPEN_EMPTY.concat(EMPLOYEE_LIST_UNIQUE);
                $scope.EMPLOYEE_LIST = OPEN_EMPTY;
                // $scope.$parent.EMPLOYEE_LIST_UNIQUE = angular.copy($scope.EMPLOYEE_LIST);
                $scope.EMPLOYEE_LIST_COPY = angular.copy($scope.EMPLOYEE_LIST);
                if ($scope.Section_Week_Search.EMP_SEARCH != '') {
                    $scope.EMPLOYEE_LIST = angular.copy($filter('unique')(data.data.Table.filter(x => x.EMPLOYEE_NAME.toLocaleUpperCase().includes($scope.Section_Week_Search.EMP_SEARCH.toLocaleUpperCase())), 'EMP_PRS_ID'));
                    $scope.EMPLOYEE_LIST = $scope.OPEN_EMPTY_LIST.concat($scope.EMPLOYEE_LIST);
                }
            }
            else {
                $scope.EMPLOYEE_LIST.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0, INITIALS: 'OS' }, { EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shift', SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0, INITIALS: 'ES' });
            }

        });
    };
    function set_week_picker(date, FLAG) {
        $scope.start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());//new Date(date.getFullYear(), date.getMonth(), 1 + date.getDate() - date.getDay());
        $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6); //new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
        // $scope.end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);

        if ($scope.start_date > date) {
            if (FLAG == 1) {
                var increasedays = $scope.start_date.getDate() - date.getDate();
                $scope.start_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() - ((7 - increasedays) + increasedays));
                //  $scope.end_date = new Date(date.getFullYear(), date.getMonth(), $scope.start_date.getDate() + (6));
                $scope.end_date = new Date($scope.start_date).addDays(6);
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

        $scope.weekpicker.datepicker('update', $scope.start_date); //(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear()));
        $scope.weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        //$scope.weekpicker.val(($scope.start_date.getMonth() + 1) + '/' + $scope.start_date.getDate() + '/' + $scope.start_date.getFullYear() + ' - ' + ($scope.end_date.getMonth() + 1) + '/' + $scope.end_date.getDate() + '/' + $scope.end_date.getFullYear());

        $scope.TOTAL_SHIFT_COUNT = 0;
        $scope.TOTAL_HOURS = 0;
        $scope.TOTAL_MINTS_SUM = 0;
        $scope.FOOTER_SHIFT_DERATION = 0;
        $scope.FOOTER_SHIFT_SHIFTCOUNT = 0;
        $scope.$parent.SHIFT_CELDER_START_DATE = $scope.start_date;
        $scope.$parent.SHIFT_CELDER_END_DATE = $scope.end_date;
        $scope.AREA_WEEK_VIEW_CALENDAR($scope.start_date);
    };
    $scope.DATE_WEEK_PICKER = function (date) {
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
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date($scope.end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    };
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    $scope.GET_UTC_TIME = function () {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME_HR_GET_EMP_BRANCH').then(function (data) {
            var EMPLOYEE_BRANCH = $scope.FilterModuleAccess(1, 1);
            var EMPLOYEE_DEPARTMENT = $scope.FilterModuleAccess(1, 2);
            var SHIFT_DEPARTMENT = $scope.FilterModuleAccess(1, 3);
            var SHIFT_VIEW = $scope.FilterModuleAccess(1, 4);
            var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);
            $scope.USER_FILTER_APPLY = 0;
            if (EMPLOYEE_BRANCH != "" || EMPLOYEE_DEPARTMENT != "" || SHIFT_DEPARTMENT != "" || SHIFT_BRANCH_SECTION != "") {
                $scope.USER_FILTER_APPLY = 1
                if (EMPLOYEE_BRANCH != "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = EMPLOYEE_BRANCH.VALUE;
                }
                if (EMPLOYEE_DEPARTMENT != "") {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = EMPLOYEE_DEPARTMENT.VALUE;
                }
                if (SHIFT_DEPARTMENT != "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SHIFT_DEPARTMENT.VALUE;
                }
                if (SHIFT_BRANCH_SECTION != "") {
                    //$scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SHIFT_BRANCH_SECTION.VALUE;
                }
                //$scope.COMMON_SHIFT_BRANCH_LOAD(1);
            }
            else if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
                $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
                $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";
                $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";

                $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = data.data.CustomTable1[0].BRANCH_ID + '';
                $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                $scope.COMMON_SHIFT_BRANCH_LOAD(2);
                $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = data.data.CustomTable1[0].BRANCH_ID + '';
            }
            else {
                //$scope.COMMON_EMP_BRANCH_LOAD();
                //$scope.COMMON_SHIFT_BRANCH_LOAD();
                //$scope.COMMON_EMP_DEPARTMENT_LOAD();
                //$scope.COMMON_SHIFT_DEPARTMENT_LOAD();
                //$scope.Section_Week_Search.DEPARTMENT_EMP_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                //$scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                //$scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = data.data.CustomTable1[0].BRANCH_ID + '';
                if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = true; }); };
                if ($scope.SECTIONS_LIST != undefined && $scope.SECTIONS_LIST.length > 0) { angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = true; }); };
            }
            $scope.TODAY_DAY = new Date(data.data.UTC_TIME[0].UTC_TIME).getDate();
            $scope.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();
            $scope.$parent.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();
            var today = new Date(data.data.UTC_TIME[0].UTC_TIME)
            today.setHours(0, 0, 0, 0);
            $scope.ONLY_TODAY_DATE = today;
            if ($scope.$parent.SHIFT_CELDER_START_DATE == undefined) {
                $scope.DATE_WEEK_PICKER(new Date(data.data.UTC_TIME[0].UTC_TIME))
            }
            else {
                $scope.DATE_WEEK_PICKER(new Date($scope.$parent.SHIFT_CELDER_START_DATE))
            }
            if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE && $scope.USER_FILTER_APPLY == 0) {
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_EMP_DEPARTMENT_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD(2);
                $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
            }
        });
    };
    $scope.GET_UTC_TIME();

    $scope.AREA_WEEK_VIEW_CALENDAR = function (param_StartDate, LOAG_AFTER_CLICK) {
        //var s = JSON.parse($localStorage.ENTITY_SETTINGS);
        //if (LOAG_AFTER_CLICK == undefined) {
        $scope.NextWeek = [];
        PARAM_STARTDATE = new Date(param_StartDate);//new Date(param_StartDate.getFullYear(), param_StartDate.getMonth(), 1 + param_StartDate.getDate() - param_StartDate.getDay());
        PARAM_ENDDATE = new Date(param_StartDate).addDays(6);//new Date(param_StartDate.getFullYear(), param_StartDate.getMonth(), 1 + param_StartDate.getDate() - param_StartDate.getDay() + 6);
        var STARTDATE = PARAM_STARTDATE;// startOfWeek(new Date(PARAM_STARTDATE));
        for (var i = 0; i < $scope.ROTA_DAYS_LENGTH; i++) {
            var NextWeekObj = new Object();
            NextWeekObj.NewDate = STARTDATE.addDays(i);
            NextWeekObj.NewDate.getDate() == new Date().getDate() ? (NextWeekObj.NewDate.getMonth() == new Date().getMonth() ? NextWeekObj.TODAY = 'Today' : NextWeekObj.TODAY = null) : NextWeekObj.TODAY = null;
            NextWeekObj.Days = NextWeekObj.NewDate.getDate();
            NextWeekObj.MONTH = NextWeekObj.NewDate.getMonth();
            if ($scope.$parent.WEEK_OFF_DAY.split(',').length > 0) {
                var List = $scope.$parent.WEEK_OFF_DAY.split(',').filter(function (x) { return x == moment(NextWeekObj.NewDate).day() });
                if (List.length > 0) {
                    NextWeekObj.OFF_DAY = true;
                }
            }

            NextWeekObj.DateAsString = $filter('date')(NextWeekObj.NewDate, "yyyy-MM-dd") + 'T00:00:00';
            NextWeekObj.DATEWISE_COST = 0;
            NextWeekObj.DATEWISE_COST_WAGE = 0;
            NextWeekObj.DATEWISE_COST_WAGE_APP = 0;
            NextWeekObj.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = 0;
            NextWeekObj.BRANCH_DATEWISE_COST_WAGE = 0;
            NextWeekObj.WAGE_COST_VS_BUDGET = 0;
            NextWeekObj.WAGE_COST_VS_ACTUAL = 0;
            NextWeekObj.WAGE_COST_VS_FORECAST = 0;
            $scope.NextWeek.push(NextWeekObj);
            //}
            $scope.Schedulerchild.SHIFT_COUNT = 0;
            $scope.$parent.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
            $scope.$parent.APPROVE_SHIFT_ARRAY = [];
            $scope.DAYOFWEEKNAMES = [];
            $scope.APPROVE_SHIFT_ARRAY = [];
            $scope.AREA_SECTIONS = [];
            $scope.DAYOFWEEKNAMES = angular.copy($scope.NextWeek);
        }
        $scope.overlay_loading_rota = 'block';
        $scope.Section_Week_Search.SELECTED_SECTION_ID = null;
        $scope.Section_Week_Search.SELECTED_BRANCH_ID = null;
        $scope.Section_Week_Search.SELECTED_DEPARTMENT_ID = null;

        //$scope.Section_Week_Search.DISPLAY_TEXT = "ALL";

        $scope.GET_EMPLOYEE_LIST_FOR_ROTA();

        $scope.AREA_ROTA_GET_SECTION();
        $scope.DESELECT_ALL_CHECKBOX();
    };
    //----------------------------------------------------------------------------------------------------------------------------------------
    //////////////////////////////////////Filter Function////////////////////////////////////////////////////////////
    $scope.ADMIN_ROTA_GET_BRANCH = function () {
        $scope.BRANCH_ROTA_LIST = [];
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = $scope.Section_Week_Search.LOCATION_ID;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_ROTA_LIST = data.data.Table;
            var EMPLOYEE_BRANCH = $scope.FilterModuleAccess(1, 1);
            var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);
            $scope.USER_FILTER_APPLY = 0;
            if (EMPLOYEE_BRANCH != "" || SHIFT_BRANCH_SECTION != "") {
                $scope.USER_FILTER_APPLY = 1
                if (EMPLOYEE_BRANCH != "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = EMPLOYEE_BRANCH.VALUE;
                }
                if (SHIFT_BRANCH_SECTION != "") {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SHIFT_BRANCH_SECTION.VALUE;
                }
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD();
            }
            else if ($scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                //$scope.BRANCH_ROTA_LIST.filter(function (x) { x.IS_CHECK_BRANCH = false; })
                // if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = false; }); angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = false; }); }
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD();
            }
            else {
                $scope.Section_Week_Search.BRANCHALL = true;
                $scope.Section_Week_Search.BranchSectionALL = true;
                $scope.BRANCH_ROTA_LIST.filter(function (x) { x.IS_CHECK_BRANCH = true; })
                if ($scope.BRANCH_LIST.length > 0) {
                    //angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = true; });
                    //angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = true; });

                }
            }
        });
    };
    $scope.ADMIN_ROTA_GET_BRANCH();
    $scope.HR_GET_DEPARTMENTS = function (FLAG) {
        $scope.DEPARTMENT_ROTA_LIST = [];
        $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
        var POSModelObj = new Object();
        POSModelObj.DEPARTMENT_NAME = '';
        POSModelObj.DIVISION_NAME = '';
        POSModelObj.DEPARTMENT_CODE = '';
        POSModelObj.DIVISION_CODE = '';
        POSModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.PAGE_NO = 0;
        POSModelObj.PAGE_SIZE = 0;
        POSModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 3;
        POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        POSModelObj.ACTIVE = 1;
        POSModelObj.SORT_COLUMN_NO = 1;
        POSModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(POSModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DEPARTMENT_ROTA_LIST = data.data.Table;
                $scope.DEPARTMENT_SHIFT_ROTA_LIST = data.data.Table;
                $scope.$parent.DEPARTMENT_SHIFT_ROTA_LIST = data.data.Table;
                $scope.DEPARTMENT_LIST = data.data.Table;
                $scope.SECTION_GET_OR_FLAG = 1;
                var EMPLOYEE_DEPARTMENT = $scope.FilterModuleAccess(1, 2);
                var SHIFT_DEPARTMENT = $scope.FilterModuleAccess(1, 3);

                $scope.USER_FILTER_APPLY = 0;
                if (EMPLOYEE_DEPARTMENT != "" || SHIFT_DEPARTMENT != "") {
                    $scope.USER_FILTER_APPLY = 1
                    if (EMPLOYEE_DEPARTMENT != "") {
                        $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";
                        $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = EMPLOYEE_DEPARTMENT.VALUE;
                    }
                    if (SHIFT_DEPARTMENT != "") {
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SHIFT_DEPARTMENT.VALUE;
                    }
                    $scope.COMMON_EMP_DEPARTMENT_LOAD();
                    $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
                }
                else if ($scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                    if ($scope.DEPARTMENT_SHIFT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT_SHIFT = false; }); }
                    if ($scope.DEPARTMENT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT = false; }); }
                    $scope.COMMON_EMP_DEPARTMENT_LOAD();
                    $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
                }
                else {
                    $scope.Section_Week_Search.DepartmentShiftALL = true;
                    $scope.Section_Week_Search.DepartmentALL = true;
                    if ($scope.DEPARTMENT_SHIFT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT_SHIFT = true; }); }
                    if ($scope.DEPARTMENT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT = true; }); }
                }
            }
            else {
                $scope.DEPARTMENT_ROTA_LIST = [];
                $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
                $scope.DEPARTMENT_LIST = [];
            };
        });
    }
    $scope.HR_GET_DEPARTMENTS(1);

    $scope.FLAG_DEPART = 2;
    $scope.COMMON_EMP_BRANCH_LOAD = function () {
        if ($scope.BRANCH_ROTA_LIST.length == 1) {
            $scope.Section_Week_Search.BRANCHALL = true;
        }
        let Brtxt = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS.split(',');
        $scope.BRANCH_ROTA_LIST.filter(function (x) {
            if (Brtxt.find(element => element == x.BRANCH_ID) != undefined) {
                x.IS_CHECK_BRANCH = true;
                $scope.Section_Week_Search.DDL_BRANCH_TEXT == '-Branch-' ?
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = x.BRANCH_NAME :
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT =
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT + "," + x.BRANCH_NAME;
            }


        });
    }
    $scope.COMMON_SHIFT_BRANCH_LOAD = function (FLAG) {
        if ($scope.BRANCH_LIST.length == 1) { $scope.Section_Week_Search.BranchSectionALL = true; };
        let Sectiontxt = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = false;
            if (item.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS && FLAG == 2) { item.IS_CHECK_BRH_SHIFT = true; };
            var sectionCount = 0;
            $scope.SEC_LIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == item.BRANCH_ID });
            angular.forEach($scope.SEC_LIST, function (x) {
                if (FLAG == 1) {
                    if (Sectiontxt.find(element => element == x.TABLE_ID) != undefined) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                        $scope.Section_Week_Search.DISPLAY_TEXT == "ALL" ?
                            $scope.Section_Week_Search.DISPLAY_TEXT = x.DISPLAY_TEXT :
                            $scope.Section_Week_Search.DISPLAY_TEXT =
                            $scope.Section_Week_Search.DISPLAY_TEXT + "," + x.DISPLAY_TEXT;
                        sectionCount = sectionCount + 1;
                    }
                }
                if (FLAG == 2) {
                    if ((item.BRANCH_ID == x.BRANCH_ID) && item.IS_CHECK_BRH_SHIFT) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                        $scope.Section_Week_Search.DISPLAY_TEXT == "ALL" ?
                            $scope.Section_Week_Search.DISPLAY_TEXT = x.DISPLAY_TEXT :
                            $scope.Section_Week_Search.DISPLAY_TEXT =
                            $scope.Section_Week_Search.DISPLAY_TEXT + "," + x.DISPLAY_TEXT;
                        sectionCount = sectionCount + 1;
                    };
                }
            });
            if ($scope.SEC_LIST.length == sectionCount) {
                item.IS_CHECK_BRH_SHIFT = true;
            }
        });
    }

    $scope.COMMON_EMP_DEPARTMENT_LOAD = function () {
        var AreaDeprtCount = 0;
        let Brtxt = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS.split(',');
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) {
            if ($scope.FLAG_DEPART == 1) { x.IS_CHECK_DEPT = true; }
            else {
                x.IS_CHECK_DEPT = Brtxt.find(element => element == x.DEPARTMENT_ID) != undefined ? true : false;
            }
            if (x.IS_CHECK_DEPT) {
                AreaDeprtCount = AreaDeprtCount + 1;
                $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT == '-Department-' ?
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = x.DEPARTMENT_NAME :
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT =
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT + "," + x.DEPARTMENT_NAME;
            }
        });
        $scope.Section_Week_Search.DepartmentALL = $scope.FLAG_DEPART == 1 ? true : false;
        if ($scope.DEPARTMENT_ROTA_LIST.length == AreaDeprtCount) {
            $scope.Section_Week_Search.DepartmentALL = true;
        }
    }
    $scope.COMMON_SHIFT_DEPARTMENT_LOAD = function () {
        var AreaDeprtCount2 = 0;
        Brtxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) {
            if ($scope.FLAG_DEPART == 1) {
                x.IS_CHECK_DEPT_SHIFT = true;
            }
            else {
                x.IS_CHECK_DEPT_SHIFT = Brtxt.find(element => element == x.DEPARTMENT_ID) != undefined ? true : false;
            }
            if (x.IS_CHECK_DEPT_SHIFT) {
                AreaDeprtCount2 = AreaDeprtCount2 + 1;
                $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT == '-Department-' ?
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = x.DEPARTMENT_NAME :
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT =
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT + "," + x.DEPARTMENT_NAME;
            }

        });

        $scope.Section_Week_Search.DepartmentShiftALL = $scope.FLAG_DEPART == 1 ? true : false;
        if ($scope.DEPARTMENT_SHIFT_ROTA_LIST.length == AreaDeprtCount2) {
            $scope.Section_Week_Search.DepartmentShiftALL = true;
        }
    }

    $scope.RESET_AREA_PAGE_FY = function () {
        $scope.GET_EMPLOYEE_LIST_FOR_ROTA();
        $scope.AREA_ROTA_GET_SECTION();
        $scope.DESELECT_ALL_CHECKBOX();
    }

    $scope.PAGE_LOAD_FY = function () {
        $scope.RESET_AREA_PAGE_FY();
    };

    $scope.ON_SECTION_ALL_CLICK = function (count) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        //$scope.Section_Week_Search.BranchSectionALL = $scope.Section_Week_Search.BranchSectionALL ? false : true
        $scope.Section_Week_Search.BranchSectionALL = true;
        if (count == $scope.BRANCH_LIST.length) {
            $scope.Section_Week_Search.BranchSectionALL = false;
        }

        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = $scope.Section_Week_Search.BranchSectionALL;
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID) {
                    x.IS_CHECK_SECTION_SHIFT = item.IS_CHECK_BRH_SHIFT;
                }
            })
        });
    }
    $scope.ON_SECTION_BRANCH_SELECT_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_BRH_SHIFT = LINE.IS_CHECK_BRH_SHIFT ? LINE.IS_CHECK_BRH_SHIFT = false : LINE.IS_CHECK_BRH_SHIFT = true;
        angular.forEach($scope.SECTIONS_LIST, function (x) {
            if (x.BRANCH_ID == LINE.BRANCH_ID) {
                x.IS_CHECK_SECTION_SHIFT = LINE.IS_CHECK_BRH_SHIFT
            };
        });
    }
    $scope.ON_SECTION_LINE_CLICK = function (LINE, HEADER) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        HEADER.IS_CHECK_BRH_SHIFT = true;
        LINE.IS_CHECK_SECTION_SHIFT = LINE.IS_CHECK_SECTION_SHIFT ? LINE.IS_CHECK_SECTION_SHIFT = false : LINE.IS_CHECK_SECTION_SHIFT = true;
        angular.forEach($scope.BRANCH_LIST, function (item) {
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID && !x.IS_CHECK_SECTION_SHIFT) {
                    item.IS_CHECK_BRH_SHIFT = false;
                }
            })
        });
    }
    $scope.ON_SECTION_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DISPLAY_TEXT = "ALL";
        $scope.Section_Week_Search.BranchSectionALL = false;
        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = false;
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID) {
                    x.IS_CHECK_SECTION_SHIFT = false;
                };
            });
        });
        $scope.PAGE_LOAD_FY();
    }
    $scope.ON_BRANCH_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = '-Department-';
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.FILTER_BRANCH_ID == '') {
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = item.BRANCH_ID + '';
                }
                else {

                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = $scope.Section_Week_Search.DDL_BRANCH_TEXT + "," + item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = $scope.Section_Week_Search.FILTER_BRANCH_ID + "," + item.BRANCH_ID;
                }
            }
        });
        //$scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.DEPARTMENT_NAME : '' }).join(",");
        //$scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.EMP_PRS_ID : '' }).join(",");
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };


    $scope.ON_SECTION_BRANCH_SHIFT_APPLY_CLICK = function (FLAG) {
        $scope.Section_Week_Search.DISPLAY_TEXT = "All";
        $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = "";
        $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = "";
        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = "";
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = BRN.BRANCH_ID + '';
                            $scope.Section_Week_Search.DISPLAY_TEXT = BRN.BRANCH_NAME;
                        }
                        else {
                            $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS + ',' + BRN.BRANCH_ID;

                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = SC.TABLE_ID;
                        $scope.Section_Week_Search.DISPLAY_TEXT = SC.DISPLAY_TEXT;
                    }
                    else {
                        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS + ',' + SC.TABLE_ID;
                        $scope.Section_Week_Search.DISPLAY_TEXT = $scope.Section_Week_Search.DISPLAY_TEXT + ',' + SC.DISPLAY_TEXT;
                    }
                }
            })
        });
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    }
    $scope.ON_DEPARTMENT_ALL_CLICK = function () {

        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DepartmentALL = $scope.Section_Week_Search.DepartmentALL ? false : true
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT = $scope.Section_Week_Search.DepartmentALL;
        });
    }
    $scope.ON_DEPARTMENT_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_DEPT = LINE.IS_CHECK_DEPT ? LINE.IS_CHECK_DEPT = false : LINE.IS_CHECK_DEPT = true;
        $scope.Section_Week_Search.DepartmentALL = true;
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_DEPT) {
                $scope.Section_Week_Search.DepartmentALL = false;
            }
        });
    }
    $scope.ON_DEPARTMENT_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = "-Department-";
        $scope.Section_Week_Search.DepartmentALL = false;
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT = false;
        });
        $scope.PAGE_LOAD_FY();
    }
    $scope.ON_DEPARTMENT_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = '-Department-';
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT) {
                if ($scope.Section_Week_Search.FILTER_DEPARTMENT_ID == '') {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = item.DEPARTMENT_ID + '';
                }
                else {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT + "," + item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = $scope.Section_Week_Search.FILTER_DEPARTMENT_ID + "," + item.DEPARTMENT_ID;
                }
            }
        });
       if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };

    $scope.ON_BRANCH_ALL_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.BRANCHALL = $scope.Section_Week_Search.BRANCHALL ? false : true
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            item.IS_CHECK_BRANCH = $scope.Section_Week_Search.BRANCHALL;
        });
    }
    $scope.ON_BRANCH_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_BRANCH = LINE.IS_CHECK_BRANCH ? LINE.IS_CHECK_BRANCH = false : LINE.IS_CHECK_BRANCH = true;

        $scope.Section_Week_Search.BRANCHALL = true;
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_BRANCH) {
                $scope.Section_Week_Search.BRANCHALL = false;
            }
        });

    }
    $scope.ON_BRANCH_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.BRANCHALL = false;
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = "-Branch-";
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            item.IS_CHECK_BRANCH = false;
        });
        $scope.PAGE_LOAD_FY();
    }
    $scope.ON_BRANCH_APPLY_CLICK = function (FLAG) {
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = '-Branch-';
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.FILTER_BRANCH_ID == '') {
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = item.BRANCH_ID + '';
                }
                else {
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = $scope.Section_Week_Search.DDL_BRANCH_TEXT + "," + item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = $scope.Section_Week_Search.FILTER_BRANCH_ID + "," + item.BRANCH_ID;
                }
            }
        });
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };

    $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION = function () {
        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
        $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";

        $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS = "";
        $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
        $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";
    }

    $scope.ON_DEPARTMENT_SHIFT_ALL_CLICK = function () {

        $scope.Section_Week_Search.DepartmentShiftALL = $scope.Section_Week_Search.DepartmentShiftALL ? false : true
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT_SHIFT = $scope.Section_Week_Search.DepartmentShiftALL;
        });
    }
    $scope.ON_DEPARTMENT_SHIFT_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_DEPT_SHIFT = LINE.IS_CHECK_DEPT_SHIFT ? LINE.IS_CHECK_DEPT_SHIFT = false : LINE.IS_CHECK_DEPT_SHIFT = true;
        $scope.Section_Week_Search.DepartmentShiftALL = true;
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_DEPT_SHIFT) {
                $scope.Section_Week_Search.DepartmentShiftALL = false;
            }
        });

    }
    $scope.ON_DEPARTMENT_SHIFT_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = "-Department-";
        $scope.Section_Week_Search.DepartmentShiftALL = false;
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT_SHIFT = false;
        });
        $scope.PAGE_LOAD_FY();
    }

    $scope.ON_DEPARTMENT_SHIFT_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = '-Filter by Department-';
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID == '') {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = item.DEPARTMENT_ID + '';
                }
                else {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT + "," + item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID + "," + item.DEPARTMENT_ID;
                }
            }
        });
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    }

    //$scope.USER_FILTER_COMM = function (LIST, varObject, FILTERS_ID) {
    //    angular.forEach(LIST, function (item) {
    //        if (item.IS_CHECK_BRANCH) {
    //            if (readOnly.VALUE == "") {
    //                readOnly.VALUE = item.BRANCH_ID + '';
    //            }
    //            else {
    //                readOnly.VALUE = readOnly.VALUE + "," + item.BRANCH_ID;
    //            }
    //        }
    //    });
    //}

    $scope.INS_UPD_USER_FILTERS_FY = function () {
        //if (confirm('This will replace previously saved filter, are you sure you want to proceed?')) {
        var USER_FILTER = [];
        //1	Employee Branch //2	Employee Department //3	Shift Department //4	Shift View //5	Shift Branch Section
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if (readOnly.VALUE == "") {
                    readOnly.VALUE = item.BRANCH_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.BRANCH_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 1;
        USER_FILTER.push(readOnly);
        //2	Employee Department
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT) {
                if (readOnly.VALUE == '') {
                    readOnly.VALUE = item.DEPARTMENT_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.DEPARTMENT_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 2;
        USER_FILTER.push(readOnly);
        //3	Shift Department
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT_SHIFT) {
                if (readOnly.VALUE == '') {
                    readOnly.VALUE = item.DEPARTMENT_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.DEPARTMENT_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 3;
        USER_FILTER.push(readOnly);

        //4	Week View
        var readOnly = new Object();
        readOnly.VALUE = "A_Week_View";
        readOnly.FILTERS_ID = 4;
        USER_FILTER.push(readOnly);



        //5	Shift Branch Section
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (readOnly.VALUE == "") {
                        readOnly.VALUE = SC.TABLE_ID;
                    }
                    else {
                        readOnly.VALUE = readOnly.VALUE + ',' + SC.TABLE_ID;
                    }
                }
            })
        });
        readOnly.FILTERS_ID = 5;
        USER_FILTER.push(readOnly);

        //6	Show Shift Details
        var readOnly = new Object();
        readOnly.VALUE = $scope.SHOW_ALL_DETIAL_FILTER ? 1 : 0;
        readOnly.FILTERS_ID = 6;
        USER_FILTER.push(readOnly);

        $scope.INS_UPD_USER_FILTERS(1, USER_FILTER);
        // }
    }

    //////////////////////////////////////Filter Function////////////////////////////////////////////////////////////

    $scope.REVENUE_SETTING = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 19)[0]["SETTING_VALUE"];
    $scope.WAGE_SETTING = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 20)[0]["SETTING_VALUE"];
    $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 33)[0]["SETTING_VALUE"];
    $scope.SETTING_29 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 29)[0]["SETTING_VALUE"];
    $scope.SETTING_38 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 38)[0]["SETTING_VALUE"];
    //Allow clock-in by application
    $scope.SETTING_41 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 41)[0]["SETTING_VALUE"];

    $scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 34)[0]["SETTING_VALUE"] == '1' ? false : true;


    $scope.SHOW_INDIVIDUAL_COST_IN_SCHEDULE = 0;
    $scope.REVENUE_SETTING_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(119, 1);
    $scope.REVENUE_SETTING_PRIVILAGE_EDIT = $scope.$parent.CHECK_MODULE_ACCESS(119, 3);
    $scope.SHOW_INDIVIDUAL_COST_IN_SCHEDULE = $scope.$parent.CheckSubModuleAccess(125) ? 1 : 0; //125   Show Individual Cost in Schedule Tab

    $scope.REVENUE_SAVE_BTN = false;
    $scope.GET_WAGE_COST_FORECASTING = function (WAGE_SETTING) {
        var ModelObj = new Object();
        $scope.WAGE_COST_LIST = [];
        ModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
        ModelObj.BRANCH_ID = $scope.Section_Week_Search.BRANCH_IDS;
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.WAGE_SETTING = $scope.WAGE_SETTING;
        ModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");

      
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = BRN.BRANCH_ID;
                        }
                        else {
                            //$scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + '';
                            let Brtxt = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS.split(',');
                            if (Brtxt.find(element => element == BRN.BRANCH_ID) == undefined) {
                                $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                            }

                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                    }
                    else {
                       // $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + '';
                        let sectxt = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
                        if (sectxt.find(element => element == SC.TABLE_ID) == undefined) {
                            $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                        }

                    }
                }
            })
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == null || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID;
                }
                else {

                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + '';
                    let Depttxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
                    if (Depttxt.find(element => element == SC.DEPARTMENT_ID) == undefined) {
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                    }
                  //  $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                }
            }
        });



        ModelObj.BRANCH_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;
        ModelObj.SECTION_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;
        ModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;;

        //-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME
        if ($scope.$parent.CheckSubModuleAccess(42)) {
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }

        ModelObj.PRIVILAGE_103 = $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;/// 
        ModelObj.PRIVILAGE_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0
        ModelObj.SETTING_29 = $scope.SETTING_29;
        ModelObj.SETTING_38 = $scope.SETTING_38;
        ModelObj.ROTA_DAYS_LENGTH = $scope.ROTA_DAYS_LENGTH;;


        PrcCommMethods.HR_API(ModelObj, 'GET_WAGE_COST_FORECASTING').then(function (data) {
            if (data.data.ALL_DATASET.Table.length > 0) {
                $scope.REVENUE_SEARCH.BRANCH_LIST = data.data.ALL_DATASET.Table;//Setting in false
                for (var i = 0; i < $scope.REVENUE_SEARCH.BRANCH_LIST.length; i++) {
                    if ($scope.REVENUE_SEARCH.BRANCH_LIST[i].INTEGRATION_EXISTS == 0) {
                        $scope.REVENUE_SAVE_BTN = true;
                        break;
                    }
                }
            };
            if (data.data.ALL_DATASET.Table1.length > 0) {
                $scope.REVENUE_SEARCH.WAGE_SETTING = data.data.ALL_DATASET.Table1[0];//Setting in false
            };
            if (data.data.WAGE_COST_CLS_OBJ.length > 0) {
                $scope.WAGE_COST_LIST = data.data.WAGE_COST_CLS_OBJ;
            };
            if (data.data.WAGE_TARGET_CLS_OBJ.length > 0) {
                $scope.WAGE_TARGET_LIST = data.data.WAGE_TARGET_CLS_OBJ;
            };
            if (data.data.LAST_YEAR_REVENUE_CLS_OBJ.length > 0) {
                $scope.LAST_YEAR = data.data.LAST_YEAR_REVENUE_CLS_OBJ;
            };
            if (data.data.LAST_WEEK_REVENUE_CLS_OBJ.length > 0) {
                $scope.LAST_WEEK_SALES = data.data.LAST_WEEK_REVENUE_CLS_OBJ;
            };
            if (data.data.BUDGET_REVENUE_CLS_OBJ.length > 0) {
                $scope.BUDGET_REVENUE_LIST = data.data.BUDGET_REVENUE_CLS_OBJ;
            };
            if (data.data.FORECAST_REVENUE_CLS_OBJ.length > 0) {
                $scope.FORECAST_REVENUE_LIST = data.data.FORECAST_REVENUE_CLS_OBJ;
            };
            if (data.data.ACTUAL_REVENUE_CLS_OBJ.length > 0) {
                $scope.ACTUAL_REVENUE_LIST = data.data.ACTUAL_REVENUE_CLS_OBJ;
            };
        });
    }
    $scope.UPD_WAGE_COST_FORECASTING = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.ROTA_WAGE_TARGET_PER_TYPE = [];
        ModelObj.FORECASTED_REVENUE_TYPE = [];
        ModelObj.DAILY_SALES_BY_BRANCH_TYPE = [];
        angular.forEach($scope.WAGE_TARGET_LIST, function (val) {
            Readonly = new Object();
            Readonly.TABLE_ID = val.TABLE_ID;
            Readonly.DATE = val.START_DATE;
            Readonly.PERCENTAGE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);
            ModelObj.ROTA_WAGE_TARGET_PER_TYPE.push(Readonly);
        });
        angular.forEach($scope.FORECAST_REVENUE_LIST, function (val) {
            Readonly = new Object();
            Readonly.TABLE_ID = val.TABLE_ID;
            Readonly.FORECAST_DATE = val.START_DATE;
            Readonly.REVENUE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);
            Readonly.BRANCH_ID = val.BRANCH_ID;
            ModelObj.FORECASTED_REVENUE_TYPE.push(Readonly);
        });



        angular.forEach($scope.ACTUAL_REVENUE_LIST, function (val) {
            ReadModelObj = new Object();
            ReadModelObj.BRANCH_ID = val.BRANCH_ID;
            ReadModelObj.DATE = val.START_DATE;
            ReadModelObj.NET_REVENUE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);;
            ModelObj.DAILY_SALES_BY_BRANCH_TYPE.push(ReadModelObj);
        });

        PrcCommMethods.HR_API(ModelObj, 'UPD_WAGE_COST_FORECASTING').then(function (data) {
            if (data.data == undefined || data.data == null || data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.GET_WAGE_COST_FORECASTING();
            }
        });
    }

    $scope.CHANGE_SELECT = function () {
        if ($scope.Section_Week_Search.searchText.length == 0) {
            $scope.Section_Week_Search.AREA = "Select Area";
        }
    };
    //---------------------------------------CREAT/EDIT AREA WEEK VIEW SHIFT-----------------------------
    $scope.ROTA_GET_SECTION_FY = function () {
        $scope.SECTIONS = [];
        $scope.SECTIONS_LIST = [];
        ModelObj = new Object();
        ModelObj.SECTION_NAME = null;
        ModelObj.DEPARTMENT_NAME = null;
        ModelObj.ACTIVE = 1;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.BRANCH_ID = 0;
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.SECTION_FILTER_ID = 0;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SECTION').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.SECTIONS_LIST = data.data.Table;
                $scope.$parent.SECTIONS_LIST = data.data.Table;
                $scope.overlay_loading_rota = 'none';
                var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);
                $scope.USER_FILTER_APPLY = 0;
                if (SHIFT_BRANCH_SECTION != "") {
                    $scope.USER_FILTER_APPLY = 1
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SHIFT_BRANCH_SECTION.VALUE;
                    $scope.COMMON_SHIFT_BRANCH_LOAD(1);
                }
                else if ($scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                    $scope.COMMON_SHIFT_BRANCH_LOAD(2);
                }
                else {
                }
            }
        });
    };
    $scope.ROTA_GET_SECTION_FY();

    $scope.AREA_ROTA_GET_SECTION = function () {
        $scope.overlay_loading_rota = 'block';
        $scope.ROTA_GET_SHIFT_COUNTS();
        $scope.SECTIONS = [];
        $scope.LOGIN_LOGOUT_DETAILS = [];
        $scope.Section_Week_Search.COSE_PRIVILEGE = $scope.IS_EMPLOYEE ? 0 : $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        $scope.DAYOFWEEKNAMES.filter(function (Items) {
            Items.HEADER_SELECTED_MINUS = false;
            Items.HEADER_SHOW_CHECKBOX = false;
            Items.IS_LOCK = false;
            Items.DATEWISE_SHIFT_COUNT_WEB = 0;
            Items.HEADER_SHOW_TOTAL_SHIFT = [];
            Items.DATEWISE_SHIFT_DURATION_IN_MIN = 0;
            Items.IS_TIME_CAL = undefined,
                Items.SHIFT_DURATION = '00.00';
            Items.NO_OF_SHIFTS = 0,
                Items.SHIFT_COUNT = 0
        });
        ModelObj = new Object();
        ModelObj.SECTION_NAME = null;
        ModelObj.DEPARTMENT_NAME = null;
        ModelObj.BRANCH_ID = null;
        ModelObj.SECTION_FILTER_ID = null;
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.ACTIVE = -1;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.VIEW_NAME = 'AREA_WEEK_VIEW';
        ModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();

        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
        ModelObj.USER_ID = $cookies.get("USERID");
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = BRN.BRANCH_ID + '';
                        }
                        else {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + '';
                            let Brtxt = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS.split(',');
                            if (Brtxt.find(element => element == BRN.BRANCH_ID) == undefined) {
                                $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                            }
                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID + '';
                    }
                    else {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + '';
                        let sectxt = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
                        if (sectxt.find(element => element == SC.TABLE_ID) == undefined) {
                            $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                        }
                    }
                }
            })
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + '';
                    let Depttxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
                    if (Depttxt.find(element => element == SC.DEPARTMENT_ID) == undefined) {
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                    }
                }
            }
            if ($scope.PAGE_LOAD_FLAG == 1 && $scope.$parent.SETTING_VALUE_26 != 1 && !$scope.IS_EMPLOYEE && $scope.USER_FILTER_APPLY == 0) { SC.IS_CHECK_DEPT_SHIFT = true; $scope.Section_Week_Search.DepartmentShiftALL = true };
        });

        ModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;
        ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;
        ModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;
        if ($scope.$parent.IS_EMPLOYEE) {
            ModelObj.FLAG = 4;
        }
        else {
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                ModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                ModelObj.FLAG = 3;
            }
            else {
                ModelObj.FLAG = 2;
            }
        }
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ROTA_DAYS_LENGTH = $scope.ROTA_DAYS_LENGTH;
        ModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE = $scope.IS_EMPLOYEE ? 0 : $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        ModelObj.WEB_FLAG = 1;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SECTION_OBJ').then(function (data) {
            $scope.GET_WAGE_COST_FORECASTING();
            if (data.data.AREA_OBJ.length > 0) {
                $scope.AREA_SECTIONS = data.data.AREA_OBJ;
            }
            else { $scope.overlay_loading_rota = 'none'; }
            if (data.data.ShiftDataset.Table1.length > 0) {
                $scope.LOGIN_LOGOUT_DETAILS = data.data.ShiftDataset.Table1;
                $scope.$parent.LOGIN_LOGOUT_DETAILS = data.data.ShiftDataset.Table1;
            }
            if (data.data.ShiftDataset.Table3.length > 0) {
                $scope.LOCK_DETAILS = data.data.ShiftDataset.Table3;
                //$scope.$parent.LOCK_DETAILS = data.data.ShiftDataset.Table3;
            }
            if (data.data.ShiftDataset.Table.length > 0) {
                $scope.SHIFTS_LIST_ALL = [];
                $scope.$parent.SHIFTS_LIST_ALL = [];
                $scope.$parent.PARENT_SHIFTS_LIST_ALL = [];
                $scope.SHIFTS_LIST_ALL = data.data.ShiftDataset.Table;
                $scope.$parent.SHIFTS_LIST_ALL = data.data.ShiftDataset.Table;
                $scope.$parent.PDF_DATA = [];
                $scope.$parent.PARENT_SHIFTS_LIST_ALL = data.data.ShiftDataset.Table;
                $scope.FOOTER_SHIFT_DERATION = data.data.ShiftDataset.Table2.length > 0 ? data.data.ShiftDataset.Table2[0].TOTAL_SHIFT_DURATION_IN_MINS : 00;
                $scope.FOOTER_SHIFT_SHIFTCOUNT = data.data.ShiftDataset.Table2.length > 0 ? data.data.ShiftDataset.Table2[0].TOTAL_NO_OF_SHIFTS_WEB : 00;
                $scope.TOTAL_DATEWISE_COST = data.data.ShiftDataset.Table2[0].TOTAL_COST;
            }
            else {
                $scope.FOOTER_SHIFT_DERATION = data.data.ShiftDataset.Table2.length > 0 ? data.data.ShiftDataset.Table2[0].TOTAL_SHIFT_DURATION_IN_MINS : 00;
                $scope.FOOTER_SHIFT_SHIFTCOUNT = data.data.ShiftDataset.Table2.length > 0 ? data.data.ShiftDataset.Table2[0].TOTAL_NO_OF_SHIFTS_WEB : 00;
                $scope.TOTAL_DATEWISE_COST = 0.00;
                $scope.SHIFTS_LIST_ALL = [];
                $scope.$parent.PARENT_SHIFTS_LIST_ALL = [];
                $scope.$parent.SHIFTS_LIST_ALL = [];
                $scope.$parent.PARENT_SHIFTS_LIST_ALL = [];
                $scope.$parent.PDF_DATA = [];
                $scope.PDF_DATA = [];
            }
            $scope.IS_LOCK_FLAG = false;
            $scope.$parent.IS_LOCK_FLAG = false;
            if (data.data.ShiftDataset.Table3.length > 0) {
                $scope.IS_LOCK_FLAG = true;
                $scope.$parent.IS_LOCK_FLAG = true;
            }
            $scope.$parent.dayOfWeekNamesShort = $scope.DAYOFWEEKNAMES;
            $scope.overlay_loading_rota = 'none';
            if ($scope.PAGE_LOAD_FLAG == 1 && $scope.USER_FILTER_APPLY == 0) {
                $scope.ON_DEPARTMENT_SHIFT_APPLY_CLICK(1);
                $scope.ON_SECTION_BRANCH_SHIFT_APPLY_CLICK(1);
                $scope.ON_BRANCH_APPLY_CLICK(1);
                $scope.ON_DEPARTMENT_APPLY_CLICK(1)
            }
            $scope.PAGE_LOAD_FLAG = 2;
        });
    };
    $scope.ON_EMPLOYEE_SHIFT_CLICK = function (EMP) {
        $scope.Section_Week_Search.EMPLOYEE_NAME = EMP.EMPLOYEE_NAME;
    };
    $scope.nginitDepartment = function (DPT) {
        DPT.DAYOFWEEKNAMES = angular.copy($scope.DAYOFWEEKNAMES);
        DPT.SECTIONWISE_SHIFT_COUNT_WEB = 0;
        if ($scope.SHIFTS_LIST_ALL.filter(x => x.SECTION_ID == DPT.TABLE_ID).length > 0) {
            DPT.SECTIONWISE_SHIFT_COUNT_WEB = $scope.SHIFTS_LIST_ALL.filter(x => x.SECTION_ID == DPT.TABLE_ID)[0]['SECTIONWISE_SHIFT_COUNT_WEB'];
            DPT.SECTIONWISE_SHIFT_DURATION_IN_MIN = $scope.SHIFTS_LIST_ALL.filter(x => x.SECTION_ID == DPT.TABLE_ID)[0]['SECTIONWISE_SHIFT_DURATION_IN_MIN'];
        }
    };

    $scope.nginitShiftweek = function (DPT, Cell, Shift) {
        if ($scope.LEAVE_LIST.length > 0) {
            var LEAVE_OBJ = $scope.LEAVE_LIST.filter(function (x) { return x.EMP_PRS_ID == Shift.EMP_PRS_ID && x.LEAVE_STATUS_ID != null && moment(Cell.NewDate).isBetween(x.LEAVE_START_DATE, x.LEAVE_END_DATE, undefined, '[]'); });
            if (Shift.ON_LEAVE_LIST == undefined) {
                Shift.ON_LEAVE_LIST = [];
            }
            if (LEAVE_OBJ.length > 0) {
                Shift.ON_LEAVE_LIST.push(LEAVE_OBJ[0]);
            }
        }
    };

    $scope.SORTBY = function (propertyName, ASC_OR_DESC) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !ASC_OR_DESC : false;
        $scope.propertyName = propertyName;

        var filtered = [];
        var TOP_RECORD = [];
        angular.forEach($scope.EMPLOYEE_LIST, function (item) {
            if (item.INITIALS == 'ES' || item.INITIALS == 'OS') {
                TOP_RECORD.push(item);
            }
            else {
                filtered.push(item);
            }
        });

        filtered = $filter('orderBy')(filtered, $scope.propertyName, $scope.reverse);
        TOP_RECORD = TOP_RECORD.concat(filtered);
        $scope.EMPLOYEE_LIST = TOP_RECORD;
    };
    $scope.CLICK_SORT_ORDER = function (SOL) {
        $scope.SORT_ORDER_LIST.filter(function (x) { x.IS_ACTIVE = false });
        SOL.IS_ACTIVE = true;
        SOL.ASC = SOL.ASC ? false : true;
        $scope.SELECTED_SORT_ORDER = SOL;
        $scope.SORTBY($scope.SELECTED_SORT_ORDER.SORT_BY, SOL.ASC);
    };

    $scope.SHOWALL_REVENUE_FY = function () {
        for (var a = 1; a < 6; a++) {
            $('.menu' + a).toggle("slide");
        }
    }
    $scope.CHANGE_PLUS_MINUS_ICON = function (T) {
        if ($scope.REVENUE_SEARCH[T] == true) {
            $scope.REVENUE_SEARCH[T] = false;
        }
        else if ($scope.REVENUE_SEARCH[T] == false) {
            $scope.REVENUE_SEARCH[T] = true;
        }
        $('.' + T).toggle("slide");
    };
    $scope.HIDE_SHOW_REVENUE_FY = function () {
        $scope.REVENUE_SEARCH.HIDE_SHOW = $scope.REVENUE_SEARCH.HIDE_SHOW == true ? false : true;
    };
    $scope.ROTA_EMP_SET_ALL_SHIFT_TO_OPEN = function (EL, VIEW_NAME) {
        if ($scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EL.EMP_PRS_ID).length > 0) {
            if (confirm('Are you sure you want to turn all shift to open?' + ($scope.IS_LOCK_FLAG ? 'Action restricted for locked dates' : ''))) {
                var PosiModelObj = new Object();
                PosiModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
                PosiModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
                PosiModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
                PosiModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                PosiModelObj.USER_ID = parseInt($cookies.get('USERID'));
                PosiModelObj.EMP_NAME = EL.FIRST_NAME + ' ' + EL.LAST_NAME;
                PrcCommMethods.HR_API(PosiModelObj, 'ROTA_EMP_SET_ALL_SHIFT_TO_OPEN').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Shift Open Successfully', 3000)
                        $scope.ROTA_GET_SHIFT_COUNTS();
                        $scope.AREA_WEEK_VIEW_CALENDAR($scope.SHIFT_CELDER_START_DATE);
                    }
                    if (data.data == 0) {
                    }
                });
            }
        }
        else {
            $scope.$parent.ShowAlert('Attention', 'No Record Found.', 3000);
        }
    };
    $scope.ROTA_EMP_SET_ALL_HIGHLIGHT_SHIFTS = function (EMPLOYEE) {
        $scope.JUMPTO_NEXT_COUNTER = 0;
        $scope.HIGHLIGHT_EMPLOYEE_ID = EMPLOYEE.EMP_PRS_ID;
        $scope.HIGHLIGHTED = true;
        EMPLOYEE.EMP_ID_IS_CHECK = true;
        //EMPLOYEE_EMP_PRS_ID = null;
        //$scope.SHIFTS_LIST_ALL.filter(function (x) {
        //    x.HIGHLIGHT_SHIFT_FLAG = false;
        //});
        //$scope.SHIFTS_LIST_ALL.filter(function (x) {
        //    if (x.EMP_PRS_ID == EMPLOYEE_LIST.EMP_PRS_ID) {
        //        x.HIGHLIGHT_SHIFT_FLAG = true;
        //    }
        //});
    };
    $scope.ROTA_EMP_UNHIGHLIGHT_SHIFTS = function (EMPLOYEE) {
        $scope.JUMPTO_NEXT_COUNTER = 0;
        $scope.HIGHLIGHT_EMPLOYEE_ID = 0;
        $scope.HIGHLIGHTED = false;
        //EMPLOYEE.EMP_ID_IS_CHECK = false;
    };

    $scope.ROTA_EMP_SET_ALL_JUMPTO_NEXT_SHIFTS = function (EMPLOYEE_LIST) {

        $scope.SHIFTS_LIST_ALL.filter(function (x) {
            x.HIGHLIGHT_SHIFT_FLAG = false;
        });
        if (EMPLOYEE_EMP_PRS_ID == null) {
            EMPLOYEE_EMP_PRS_ID = EMPLOYEE_LIST.EMP_PRS_ID;
            $scope.JUMPTO_NEXT_COUNTER = 0;
        }
        else {
            if (EMPLOYEE_EMP_PRS_ID != EMPLOYEE_LIST.EMP_PRS_ID) {
                EMPLOYEE_EMP_PRS_ID = EMPLOYEE_LIST.EMP_PRS_ID;
                $scope.JUMPTO_NEXT_COUNTER = 0;
            }
            else {
                $scope.JUMPTO_NEXT_COUNTER += 1;
            }
        }

        if ($scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EMPLOYEE_EMP_PRS_ID).length != $scope.JUMPTO_NEXT_COUNTER) {

            $scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EMPLOYEE_EMP_PRS_ID)[$scope.JUMPTO_NEXT_COUNTER].HIGHLIGHT_SHIFT_FLAG = true;


            //var divID = $scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EMPLOYEE_EMP_PRS_ID)[$scope.JUMPTO_NEXT_COUNTER].SHIFT_ID;
            //$('#' + $scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EMPLOYEE_EMP_PRS_ID)[$scope.JUMPTO_NEXT_COUNTER].SHIFT_ID).scrollTop(scrollTo.offset().top - $('#' + $scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EMPLOYEE_EMP_PRS_ID)[$scope.JUMPTO_NEXT_COUNTER].SHIFT_ID)).offset().top;
            //$('html, body').animate({ scrollTop: $("#" + divID).offset().top }, 'slow');

        }
        else {
            $scope.JUMPTO_NEXT_COUNTER = -1;
        }
    };
    $scope.ROTA_EMP_SHOW_UNALLOCATED_SHIFT = function () {
        $scope.SHIFTS_LIST_ALL.filter(function (x) {
            x.HIGHLIGHT_SHIFT_FLAG = false;
        });

        if ($scope.SHIFTS_LIST_ALL.filter(x => x.EMPTY_OPEN_FLAG == -2).length != $scope.JUMPTO_NEXT_COUNTER) {
            $scope.SHIFTS_LIST_ALL.filter(x => x.EMPTY_OPEN_FLAG == -2)[$scope.JUMPTO_NEXT_COUNTER].HIGHLIGHT_SHIFT_FLAG = true;
            $scope.JUMPTO_NEXT_COUNTER += 1;
        }
        else {
            $scope.JUMPTO_NEXT_COUNTER = 0;
        }

    };
    $scope.ROTA_EMP_SHOW_UNALLOCATED_SHIFT_ALL = function () {
        if ($scope.NEXT_COUNTER == undefined || $scope.NEXT_COUNTER == 0) {
            $scope.SHIFTS_LIST_ALL.filter(function (x) {
                x.HIGHLIGHT_SHIFT_FLAG = false;
            });
            $scope.SHIFTS_LIST_ALL.filter(function (x) {
                if (x.EMPTY_OPEN_FLAG == -2 && x.EMP_PRS_ID == null) {
                    x.HIGHLIGHT_SHIFT_FLAG = true;
                }
            });
            //$scope.SHIFTS_LIST_ALL.filter(function (x) {
            //    if (x.EMPTY_OPEN_FLAG == -1 && x.EMP_PRS_ID == null) {
            //        x.HIGHLIGHT_SHIFT_FLAG = true;
            //    }
            //});
            $scope.NEXT_COUNTER = 1;
        }
        else {
            $scope.SHIFTS_LIST_ALL.filter(function (x) {
                x.HIGHLIGHT_SHIFT_FLAG = false;
            });
            $scope.NEXT_COUNTER = 0;
        }

        //$scope.$parent.UNALOOCATED_SHIFT_COUNT = $scope.SHIFTS_LIST_ALL.filter(x => x.EMPTY_OPEN_FLAG == -2).length;
    };
    $scope.ROTA_GET_SHIFT_COUNTS = function () {
        $scope.$parent.UNPUBLISHED_COUNT = 0;
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get('EMPLOYEE_ID'));
        ModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();

        ModelObj.LEAVE_COUNT_REQUIRED = 1;
        ModelObj.NAME = $scope.Section_Week_Search.NAME;

        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
        if ($scope.$parent.CheckSubModuleAccess(42)) {
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }
        ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;

        //$scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
        //$scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
        //$scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";

        angular.forEach($scope.SECTIONS_LIST, function (SC) {
            if (SC.IS_CHECK_SECTION_SHIFT) {
                if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                }
                else {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + '';
                    let SecRed = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
                    if (SecRed.find(element => element == SC.TABLE_ID) == undefined) {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + "," + SC.TABLE_ID;
                    }
                }
            }
        });
        angular.forEach($scope.BRANCH_LIST, function (SC) {
            if (SC.IS_CHECK_BRH_SHIFT) {
                if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = SC.BRANCH_ID + '';
                }
                else {
                    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + '';
                    let txt = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS.split(',');
                    if (txt.find(element => element == SC.BRANCH_ID) == undefined) {
                        $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + "," + SC.BRANCH_ID;
                    }
                }
            }
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID + '';
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + '';
                    let Depttxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
                    if (Depttxt.find(element => element == SC.DEPARTMENT_ID) == undefined) {
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                    }
                }
            }
        });

        ModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        ModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;

        //ModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.SELECTED_DEPARTMENT_ID == null ? '' : $scope.Section_Week_Search.SELECTED_DEPARTMENT_ID;
        //ModelObj.BRANCH_IDS = $scope.Section_Week_Search.SELECTED_BRANCH_ID;//$scope.Section_Week_Search.BRANCH_IDS;
        //ModelObj.SECTION_IDS = $scope.Section_Week_Search.SELECTED_SECTION_ID;//$scope.Section_Week_Search.SECTION_IDS;


        AssignShift_Form.submitted = false;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_COUNTS').then(function (data) {
            $scope.ROTA_SHIFT_COUNTS = data.data.Table;
            $scope.APPROVED_LEAVE_COUNT = $scope.ROTA_SHIFT_COUNTS[0].APPROVED_LEAVE_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].APPROVED_LEAVE_COUNT : 0;
            $scope.EMPTY_COUNT = $scope.ROTA_SHIFT_COUNTS[0].EMPTY_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].EMPTY_COUNT : 0;
            $scope.OPEN_COUNT = $scope.ROTA_SHIFT_COUNTS[0].OPEN_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].OPEN_COUNT : 0;
            $scope.PENDING_LEAVE_COUNT = $scope.ROTA_SHIFT_COUNTS[0].PENDING_LEAVE_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].PENDING_LEAVE_COUNT : 0;
            $scope.PUBLISHED_COUNT = $scope.ROTA_SHIFT_COUNTS[0].PUBLISHED_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].PUBLISHED_COUNT : 0;
            $scope.UNPUBLISHED_COUNT = $scope.ROTA_SHIFT_COUNTS[0].UNPUBLISHED_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].UNPUBLISHED_COUNT : 0;
            $scope.APPROVED_SHIFT_COUNT = $scope.ROTA_SHIFT_COUNTS[0].APPROVED_SHIFT_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].APPROVED_SHIFT_COUNT : 0;
            $scope.NO_SHOW_COUNT = $scope.ROTA_SHIFT_COUNTS[0].NO_SHOW_COUNT != null ? $scope.ROTA_SHIFT_COUNTS[0].NO_SHOW_COUNT : 0;
            $scope.WARNINGS = 0;
            if ($scope.ROTA_SHIFT_COUNTS[0].EMPTY_COUNT == null && $scope.ROTA_SHIFT_COUNTS[0].OPEN_COUNT == null && $scope.ROTA_SHIFT_COUNTS[0].PUBLISHED_COUNT == null && $scope.ROTA_SHIFT_COUNTS[0].UNPUBLISHED_COUNT == null) {
                $scope.PUBLISH_SHIFTS = 'No Shifts';

            }
            else {
                if ($scope.UNPUBLISHED_COUNT > 0) {
                    $scope.PUBLISH_SHIFTS = 'Publish ' + $scope.UNPUBLISHED_COUNT + ' Shifts';
                    $scope.$parent.UNPUBLISHED_COUNT = $scope.UNPUBLISHED_COUNT;
                }
                if ($scope.UNPUBLISHED_COUNT == 0) {
                    $scope.PUBLISH_SHIFTS = 'All Shifts Published';
                }
            }
        });
    };

    $scope.ROTA_PRINT_NG_CHANGE = function () {
        if ($scope.Section_Week_Search.RotaReportWeeky == "1") { }
        else if ($scope.Section_Week_Search.RotaReportWeeky == "2") {
            //if ($scope.EMPLOYEE_LIST_ROTA==undefined || $scope.EMPLOYEE_LIST_ROTA.length == 0) {
            $scope.GET_WEEKLY_SCHEDULE_REPORT(2);
            //}
        }
        else if ($scope.Section_Week_Search.RotaReportWeeky == "3") {
            $scope.GET_WEEKLY_SCHEDULE_REPORT(3);
        }
    }
    $scope.GET_WEEKLY_SCHEDULE_REPORT = function (IS_ROTA_VIEW) {
        $scope.overlay_loading_rota = 'block';
        $scope.EMPLOYEE_LIST_ROTA = [];
        var PosiModelObj = new Object();
        PosiModelObj.NAME = $scope.Section_Week_Search.EMP_SEARCH;
        PosiModelObj.SORT_BY = 1;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
        PosiModelObj.USER_ID = $cookies.get("USERID");
        if ($scope.$parent.IS_EMPLOYEE) {
            PosiModelObj.FLAG = 4;
            PosiModelObj.IS_EMPLOYEE = 1;
        }
        else {
            PosiModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
            PosiModelObj.IS_EMPLOYEE = 0;
        }

        PosiModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null ? '' : $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;
        PosiModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null ? '' : $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;
        PosiModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == null ? '' : $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;


        PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;
        PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;
        PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS;

        PosiModelObj.USER_ID = $cookies.get("USERID");
        PosiModelObj.VIEW_NAME = "EMP_VIEW";
        PosiModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        PosiModelObj.ROTA_DAYS_LENGTH = 7;

        PosiModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE = $scope.IS_EMPLOYEE ? 0 : $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PosiModelObj.IS_ROTA_VIEW = IS_ROTA_VIEW;
        PosiModelObj.ACTIVE = 1; // For Section view
        PrcCommMethods.HR_API(PosiModelObj, 'GET_WEEKLY_SCHEDULE_REPORT').then(function (data) {

            if ($scope.Section_Week_Search.RotaReportWeeky == "1") { }
            else if ($scope.Section_Week_Search.RotaReportWeeky == "2") {
                if (data.data.EmployeeList.length > 0) {
                    $scope.EMPLOYEE_LIST_ROTA = [];
                    $scope.dayOfWeekNamesShortROTA = $scope.dayOfWeekNamesShort;
                    var EmpList = [];
                    angular.forEach(data.data.EmployeeList, function (x) {
                        if (x.NO_OF_SHIFTS > 0) {
                            x.INDEX = 0;
                            if (x.SHIFT_ROW == 1) {
                                EmpList.push(x);
                            }
                            if (x.SHIFT_ROW >= 2) {
                                for (var i = 0; i < x.SHIFT_ROW; i++) {
                                    var b = angular.copy(x);
                                    b.INDEX = i;
                                    EmpList.push(angular.copy(b));
                                };
                            };
                        }
                        else if (x.NO_OF_SHIFTS == 0) {
                            x.INDEX = 0;
                            EmpList.push(x);
                        };
                    });
                    $scope.EMPLOYEE_LIST_ROTA = EmpList;
                    if ($scope.EMPLOYEE_LIST_ROTA == 0) {
                        $scope.dayOfWeekNamesShortROTA = [];
                    }
                    $scope.overlay_loading_rota = 'none';
                }
            }
            else if ($scope.Section_Week_Search.RotaReportWeeky == "3") {
                if (data.data.Areaobj.AREA_OBJ.length > 0) {
                    $scope.AREA_WEEK_VIEW_ROTA = [];
                    $scope.AREA_WEEK_VIEW_ROTA = data.data.Areaobj.AREA_OBJ;
                    $scope.dayOfWeekNamesShortROTA = $scope.dayOfWeekNamesShort;
                    $scope.overlay_loading_rota = 'none';
                }
            }
            else {
                $scope.overlay_loading_rota = 'none';
            }
        });
    }



    $scope.LISTOF_IDS_FOR_APPROVAL = function (EMP, SHIFT, DAYOFWEEKNAMES) {
        if (EMP.EMP_ID_IS_CHECK == true) {
            var APPROVAL_ID = new Object();
            APPROVAL_ID.SHIFT_ID = EMP.SHIFT_ID;
            APPROVAL_ID.NewDate = SHIFT.NewDate;
            APPROVAL_ID.NewDate = SHIFT.NewDate;
            APPROVAL_ID.SECTION_ID = EMP.SECTION_ID;
            $scope.$parent.APPROVE_SHIFT_ARRAY.push(EMP);
            $scope.APPROVAL_IDS.push(APPROVAL_ID);
            //if (EMP.STATUS_ID == 21) {
            //    $scope.UNPUBLISH_SHIFT_LIST.push(EMP);
            //}
            //if (EMP.STATUS_ID == 22) {
            //    $scope.PUBLISH_SHIFT_LIST.push(EMP);
            //}
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE != null && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE != null && EMP.STATUS_ID == 22) {
            //    $scope.LOGIN_LOGOUT_LIST.push(EMP);
            //}
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21) && EMP.EMPTY_OPEN_FLAG != -2) {
            //    $scope.SET_SHIFT_TO_OPEN_LIST.push(EMP);
            //}
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && EMP.STATUS_ID == 21 && EMP.GREATER_THAN_DATE <= SHIFT.NewDate) {
            //    $scope.DELETE_SHIFT_LIST.push(EMP);
            //}
            if (EMP.STATUS_ID == 21 && EMP.EMPTY_OPEN_FLAG != -1) {
                $scope.UNPUBLISH_SHIFT_LIST.push(EMP);
                $scope.$parent.UNPUBLISH_SHIFT_LIST.push(EMP);
            }
            //if (EMP.STATUS_ID == 22 && EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == null && EMP.EMPTY_OPEN_FLAG != -1) {
            //	$scope.PUBLISH_SHIFT_LIST.push(EMP);
            //	$scope.$parent.PUBLISH_SHIFT_LIST.push(EMP);
            //}
            if (EMP.STATUS_ID == 22 && (EMP.LOGIN_LOGOUT_DETAILS == null || EMP.LOGIN_LOGOUT_DETAILS.length == 0) && EMP.EMPTY_OPEN_FLAG != -1) {
                $scope.PUBLISH_SHIFT_LIST.push(EMP);
                $scope.$parent.PUBLISH_SHIFT_LIST.push(EMP);
            }
            //if (EMP.STATUS_ID == 22 && EMP.EMPTY_OPEN_FLAG != -1 && EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE != null && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == null) {
            //	$scope.LOGIN_LIST.push(EMP);
            //	$scope.$parent.LOGIN_LIST.push(EMP);
            //         }

            if (EMP.STATUS_ID == 22 && EMP.EMPTY_OPEN_FLAG != -1 && EMP.LOGIN_LOGOUT_DETAILS != null && EMP.LOGIN_LOGOUT_DETAILS.length > 0) {
                if (EMP.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && EMP.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE == null) {
                    $scope.LOGIN_LIST.push(EMP);
                    $scope.$parent.LOGIN_LIST.push(EMP);
                }
            }

            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE != null && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE != null && EMP.STATUS_ID == 22) {
            //	$scope.LOGIN_LOGOUT_LIST.push(EMP);
            //	$scope.$parent.LOGIN_LOGOUT_LIST.push(EMP);
            //}
            if (EMP.LOGIN_LOGOUT_DETAILS != null && EMP.LOGIN_LOGOUT_DETAILS.length > 0 && EMP.STATUS_ID == 22) {
                if (EMP.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && EMP.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE != null) {
                    $scope.LOGIN_LOGOUT_LIST.push(EMP);
                    $scope.$parent.LOGIN_LOGOUT_LIST.push(EMP);
                }
            }
            if (EMP.STATUS_ID == 23) {
                $scope.APPROVE_SHIFT_LIST.push(EMP);
                $scope.$parent.APPROVE_SHIFT_LIST.push(EMP);
            }
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21) && !EMP.GREATER_THAN_DATE && EMP.EMPTY_OPEN_FLAG != -2) {
            //	$scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(EMP);
            //	$scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(EMP);
            //}
            if (EMP.EMPTY_OPEN_FLAG == -1) {
                $scope.EMTY_SHIFT_LIST.push(EMP);;
                $scope.$parent.EMTY_SHIFT_LIST.push(EMP);;
            }
            if (EMP.EMPTY_OPEN_FLAG == -2) {
                $scope.OPEN_SHIFT_LIST.push(EMP);
                $scope.$parent.OPEN_SHIFT_LIST.push(EMP);
            }
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21) && EMP.GREATER_THAN_DATE && EMP.EMPTY_OPEN_FLAG != -2) {
            //	$scope.SET_SHIFT_TO_OPEN_LIST.push(EMP);
            //	$scope.$parent.SET_SHIFT_TO_OPEN_LIST.push(EMP);
            //}
            //if (EMP.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && EMP.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21)) {
            //	$scope.DELETE_SHIFT_LIST.push(EMP);
            //	$scope.$parent.DELETE_SHIFT_LIST.push(EMP);

            //}

            if ((EMP.LOGIN_LOGOUT_DETAILS == null || EMP.LOGIN_LOGOUT_DETAILS.length == 0) && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21) && EMP.EMPTY_OPEN_FLAG != -2) {
                $scope.SET_SHIFT_TO_OPEN_LIST.push(EMP);
                $scope.$parent.SET_SHIFT_TO_OPEN_LIST.push(EMP);

            }
            if ((EMP.LOGIN_LOGOUT_DETAILS == null || EMP.LOGIN_LOGOUT_DETAILS.length == 0) && (EMP.STATUS_ID == 22 || EMP.STATUS_ID == 21)) {
                $scope.DELETE_SHIFT_LIST.push(EMP);
                $scope.$parent.DELETE_SHIFT_LIST.push(EMP);
            }

            angular.forEach(DAYOFWEEKNAMES, function (Items) {
                if (Items.Days == SHIFT.Days) {
                    Items.CHECK_COUNT += 1;
                }
            });
            // SHIFT.SHIFT_DETAILS.CHECK_COUNT = SHIFT.SHIFT_DETAILS.CHECK_COUNT == undefined ? SHIFT.SHIFT_DETAILS.CHECK_COUNT = 1 : SHIFT.SHIFT_DETAILS.CHECK_COUNT+=1;
            $scope.SELECT_DATE_CHECK(SHIFT, DAYOFWEEKNAMES, 1);
        }
        else {
            angular.forEach($scope.APPROVAL_IDS, function (Items, index) {
                if (Items.NewDate == SHIFT.NewDate && Items.SHIFT_ID == EMP.SHIFT_ID) {
                    INDEX_OF_REMOVE_ID = index;
                    $scope.APPROVAL_IDS.splice(INDEX_OF_REMOVE_ID, 1);
                }
            });
            angular.forEach($scope.$parent.APPROVE_SHIFT_ARRAY, function (Items, index) {
                if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                    INDEX_OF_REMOVE_ID = index;
                    $scope.$parent.APPROVE_SHIFT_ARRAY.splice(INDEX_OF_REMOVE_ID, 1);
                }
            });
            angular.forEach(DAYOFWEEKNAMES, function (Items) {
                if (Items.Days == SHIFT.Days) {
                    Items.CHECK_COUNT -= 1;
                }
            });
            if ($scope.UNPUBLISH_SHIFT_LIST != undefined && $scope.UNPUBLISH_SHIFT_LIST.length > 0) {
                angular.forEach($scope.UNPUBLISH_SHIFT_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.UNPUBLISH_SHIFT_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.UNPUBLISH_SHIFT_LIST = [];
                $scope.$parent.UNPUBLISH_SHIFT_LIST = $scope.UNPUBLISH_SHIFT_LIST;
            }
            if ($scope.PUBLISH_SHIFT_LIST != undefined && $scope.PUBLISH_SHIFT_LIST.length > 0) {
                angular.forEach($scope.PUBLISH_SHIFT_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.PUBLISH_SHIFT_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.PUBLISH_SHIFT_LIST = [];
                $scope.$parent.PUBLISH_SHIFT_LIST = $scope.PUBLISH_SHIFT_LIST;
            }
            if ($scope.LOGIN_LIST != undefined && $scope.LOGIN_LIST.length > 0) {
                angular.forEach($scope.LOGIN_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.LOGIN_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.LOGIN_LIST = [];
                $scope.$parent.LOGIN_LIST = $scope.LOGIN_LIST;
            }
            if ($scope.APPROVE_SHIFT_LIST != undefined && $scope.APPROVE_SHIFT_LIST.length > 0) {
                angular.forEach($scope.APPROVE_SHIFT_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.APPROVE_SHIFT_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.APPROVE_SHIFT_LIST = [];
                $scope.$parent.APPROVE_SHIFT_LIST = $scope.APPROVE_SHIFT_LIST;
            }
            if ($scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST != undefined && $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.length > 0) {
                angular.forEach($scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
                $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST;
            }
            if ($scope.LOGIN_LOGOUT_LIST != undefined && $scope.LOGIN_LOGOUT_LIST.length > 0) {
                angular.forEach($scope.LOGIN_LOGOUT_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.LOGIN_LOGOUT_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.LOGIN_LOGOUT_LIST = [];
                $scope.$parent.LOGIN_LOGOUT_LIST = $scope.LOGIN_LOGOUT_LIST;
            }
            if ($scope.SET_SHIFT_TO_OPEN_LIST != undefined && $scope.SET_SHIFT_TO_OPEN_LIST.length > 0) {
                angular.forEach($scope.SET_SHIFT_TO_OPEN_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.SET_SHIFT_TO_OPEN_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.SET_SHIFT_TO_OPEN_LIST = [];
                $scope.$parent.SET_SHIFT_TO_OPEN_LIST = $scope.SET_SHIFT_TO_OPEN_LIST;
            }
            if ($scope.DELETE_SHIFT_LIST != undefined && $scope.DELETE_SHIFT_LIST.length > 0) {
                angular.forEach($scope.DELETE_SHIFT_LIST, function (Items, index) {
                    if (Items.SHIFT_ID == EMP.SHIFT_ID) {
                        INDEX_OF_REMOVE_ID = index;
                        $scope.DELETE_SHIFT_LIST.splice(INDEX_OF_REMOVE_ID, 1);
                    }
                });
                $scope.$parent.DELETE_SHIFT_LIST = [];
                $scope.$parent.DELETE_SHIFT_LIST = $scope.DELETE_SHIFT_LIST;
            }
            $scope.SELECT_DATE_CHECK(SHIFT, DAYOFWEEKNAMES, 0);
        }
        $scope.SHIFT_COUNT = $scope.APPROVAL_IDS.length;
        $scope.APPROVAL_IDS = $filter('unique')($scope.APPROVAL_IDS, 'SHIFT_ID');
        $scope.$parent.APPROVE_SHIFT_ARRAY = $filter('unique')($scope.$parent.APPROVE_SHIFT_ARRAY, 'SHIFT_ID');
        $scope.UNPUBLISH_SHIFT_LIST = $filter('unique')($scope.UNPUBLISH_SHIFT_LIST, 'SHIFT_ID');
        $scope.PUBLISH_SHIFT_LIST = $filter('unique')($scope.PUBLISH_SHIFT_LIST, 'SHIFT_ID');
        $scope.LOGIN_LOGOUT_LIST = $filter('unique')($scope.LOGIN_LOGOUT_LIST, 'SHIFT_ID');
        $scope.SET_SHIFT_TO_OPEN_LIST = $filter('unique')($scope.SET_SHIFT_TO_OPEN_LIST, 'SHIFT_ID');
        $scope.DELETE_SHIFT_LIST = $filter('unique')($scope.DELETE_SHIFT_LIST, 'SHIFT_ID');
        $scope.LOGIN_LIST = $filter('unique')($scope.LOGIN_LIST, 'SHIFT_ID');
        $scope.APPROVE_SHIFT_LIST = $filter('unique')($scope.APPROVE_SHIFT_LIST, 'SHIFT_ID');
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = $filter('unique')($scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST, 'SHIFT_ID');

    };
    $scope.FILTER_RESET_SIDE = function () {

        $scope.SHIFT_STATUS.filter(function (x) { x.FILTER_SELECTED = false });
        $scope.SHIFT_TYPES.filter(function (x) { x.SELECTED = false });
        //
        $scope.FILTER_SHIFT_STATUS();
    };
    $scope.CHECK_UNCHECK_ALL_DATE_WISE = function (FLAG, FLAG_1, DL, BOOL) {
        var count = 0;
        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = true;
        $scope.SHIFT_COUNT = 0;
        $scope.PUBLISH_SHIFT_LIST = [];
        $scope.LOGIN_LOGOUT_LIST = [];
        $scope.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.DELETE_SHIFT_LIST = [];
        $scope.UNPUBLISH_SHIFT_LIST = [];
        $scope.APPROVE_SHIFT_LIST = [];
        $scope.LOGIN_LIST = [];
        $scope.OPEN_SHIFT_LIST = [];
        $scope.APPROVE_SHIFT_LIST = [];
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.EMTY_SHIFT_LIST = [];
        $scope.NO_SHOW_SHIFT_LIST = [];
        $scope.$parent.NO_SHOW_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LOGOUT_LIST = [];
        $scope.$parent.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.$parent.DELETE_SHIFT_LIST = [];
        $scope.$parent.UNPUBLISH_SHIFT_LIST = [];
        $scope.$parent.APPROVE_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LIST = [];
        $scope.$parent.PUBLISH_SHIFT_LIST = [];
        $scope.$parent.EMTY_SHIFT_LIST = [];
        $scope.$parent.OPEN_SHIFT_LIST = [];
        $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.FOOTER_SELECT_ALL_MINUS = true;
        $scope.FOOTER_SELECT_ALL_CHECKBOX = false;

        $scope.NO_SHOW_SHIFT_COUNT = 0;
        $scope.UNPUBLISH_SHIFT_COUNT = 0;
        $scope.PUBLISH_SHIFT_COUNT = 0;
        $scope.LOGIN_LIST_COUNT = 0;
        $scope.LOGIN_LOGOUT_LIST_COUNT = 0;
        $scope.APPROVE_SHIFT_COUNT = 0;
        $scope.EMTY_SHIFT_COUNT = 0;
        $scope.OPEN_SHIFT_COUNT = 0;
        $scope.SET_SHIFT_TO_OPEN_COUNT = 0;
        $scope.DELETE_SHIFT_COUNT = 0;
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_COUNT = 0;
        $scope.APPROVE_COUNT = 0;
        $scope.$parent.APPROVE_COUNT = 0;
        $scope.DAYOFWEEKNAMES.filter(function (x) { x.SHIFT_COUNT = 0 });
        if (FLAG_1 == 1) {
            DL.MINUS_SQUARE = false;
            DL.DATE_CHECKBOX_IS_SELECTED = true;
        }
        if (FLAG == 'HEADER') {
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        if (SHIFT.Days == DL.Days) {
                            SHIFT.EMP_ID_IS_CHECK = DL.DATE_CHECKBOX_IS_SELECTED;
                        }
                    });
                });
            });
        }
        if (FLAG == 'FOOTER_DESELECT_ALL') {
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        SHIFT.EMP_ID_IS_CHECK = week.IS_LOCK ? BOOL : false;
                    });
                });
            });
            $scope.FOOTER_SELECT_ALL_MINUS = BOOL = false;
            $scope.FOOTER_SELECT_ALL_CHECKBOX = false;
        }
        if (FLAG == 'FOOTER_SELECT_ALL') {
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        SHIFT.EMP_ID_IS_CHECK = week.IS_LOCK ? BOOL : false;;
                    });
                });
            });
            $scope.FOOTER_SELECT_ALL_MINUS = BOOL = false;
            $scope.FOOTER_SELECT_ALL_CHECKBOX = true;
        }
        if (FLAG == 'FOOTER_STATUS') {
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        if (SHIFT.STATUS_ID == BOOL) {
                            SHIFT.EMP_ID_IS_CHECK = false;
                        }
                        if (SHIFT.EMPTY_OPEN_FLAG == BOOL) {
                            SHIFT.EMP_ID_IS_CHECK = false;
                        }
                    });
                });
            });
        }

        if (FLAG == 1) {
        }
        $scope.AREA_SECTIONS.filter(function (DPT) {
            angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                angular.forEach(week.TOTAL_SHIFT, function (ALL_SHIFT) {
                    var Header = $scope.DAYOFWEEKNAMES.filter(function (EMP_SHIFT) { return EMP_SHIFT.Days == week.Days });
                    if (ALL_SHIFT.EMP_ID_IS_CHECK) {
                        ALL_SHIFT.SHIFT_COUNT = ALL_SHIFT.DATEWISE_SHIFT_COUNT_WEB;
                        $scope.SHIFT_COUNT = $scope.SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        $scope.$parent.APPROVE_SHIFT_ARRAY.push(ALL_SHIFT)
                        if (ALL_SHIFT.STATUS_ID == 21 && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && week.IS_LOCK) {
                            $scope.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.UNPUBLISH_SHIFT_COUNT = $scope.UNPUBLISH_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }
                        if (ALL_SHIFT.STATUS_ID == 23 && week.IS_LOCK) {
                            $scope.APPROVE_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.APPROVE_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.APPROVE_SHIFT_COUNT = $scope.APPROVE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }
                        if (ALL_SHIFT.STATUS_ID == 24 && week.IS_LOCK) {
                            $scope.NO_SHOW_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.NO_SHOW_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.NO_SHOW_SHIFT_COUNT = $scope.NO_SHOW_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }
                        //if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && !ALL_SHIFT.GREATER_THAN_DATE && ALL_SHIFT.EMPTY_OPEN_FLAG != -2) {
                        //	$scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(ALL_SHIFT);
                        //	$scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(ALL_SHIFT);
                        //}

                        //if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && ALL_SHIFT.GREATER_THAN_DATE && ALL_SHIFT.EMPTY_OPEN_FLAG != -2) {
                        //	$scope.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                        //	$scope.$parent.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                        //}

                        //if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGIN_DATE == undefined && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.LOGOUT_DATE == undefined && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21)) {
                        //	$scope.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                        //	$scope.$parent.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                        //}

                        if (ALL_SHIFT.EMPTY_OPEN_FLAG == -1 && week.IS_LOCK) {
                            $scope.EMTY_SHIFT_LIST.push(ALL_SHIFT && week.IS_LOCK);
                            $scope.$parent.EMTY_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.EMTY_SHIFT_COUNT = $scope.EMTY_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }
                        if (ALL_SHIFT.EMPTY_OPEN_FLAG == -2 && week.IS_LOCK) {
                            $scope.OPEN_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.OPEN_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.OPEN_SHIFT_COUNT = $scope.OPEN_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }

                        if ((ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && ALL_SHIFT.EMPTY_OPEN_FLAG != -2 && week.IS_LOCK) {
                            $scope.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                            $scope.$parent.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                            $scope.SET_SHIFT_TO_OPEN_COUNT = $scope.SET_SHIFT_TO_OPEN_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;

                        }
                        //if ((ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21)) {
                        //    $scope.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                        //    $scope.$parent.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                        //    $scope.DELETE_SHIFT_COUNT = $scope.DELETE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;

                        //}
                        if ((ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && week.IS_LOCK) {
                            $scope.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.DELETE_SHIFT_COUNT = $scope.DELETE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;

                        }
                        if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && ALL_SHIFT.STATUS_ID == 22 && week.IS_LOCK) {
                            if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE != null) {
                                $scope.LOGIN_LOGOUT_LIST.push(ALL_SHIFT);
                                $scope.$parent.LOGIN_LOGOUT_LIST.push(ALL_SHIFT);
                                $scope.LOGIN_LOGOUT_LIST_COUNT = $scope.LOGIN_LOGOUT_LIST_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                        }
                        if (ALL_SHIFT.STATUS_ID == 22 && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && ALL_SHIFT.LOGIN_LOGOUT_DETAILS != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && week.IS_LOCK) {
                            if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE == null) {
                                $scope.LOGIN_LIST.push(ALL_SHIFT);
                                $scope.$parent.LOGIN_LIST.push(ALL_SHIFT);
                                $scope.LOGIN_LIST_COUNT = $scope.LOGIN_LIST_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                        }
                        if (ALL_SHIFT.STATUS_ID == 22 && (ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && week.IS_LOCK || ALL_SHIFT.STATUS_ID == 22 && $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT == 1) {
                            $scope.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.$parent.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            $scope.PUBLISH_SHIFT_COUNT = $scope.PUBLISH_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                        }
                        if (Header.length > 0) {
                            Header[0].MINUS_SQUARE = false;
                            Header[0].DATE_CHECKBOX_IS_SELECTED = true;
                            Header[0].SHIFT_COUNT = Header[0].SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            //Header[0].HEADER_SHOW_CHECKBOX = false;
                            //$scope.$parent.APPROVE_SHIFT_ARRAY.push(ALL_SHIFT);
                            if (Header[0].SHIFT_COUNT > 0) {
                                Header[0].MINUS_SQUARE = true;
                                Header[0].HEADER_SHOW_CHECKBOX = false;
                                Header[0].DATE_CHECKBOX_IS_SELECTED = false;
                            }
                            if (Header[0].SHIFT_COUNT == Header[0].DATEWISE_SHIFT_COUNT_WEB) {
                                Header[0].MINUS_SQUARE = false;
                                Header[0].HEADER_SHOW_CHECKBOX = true;
                                Header[0].DATE_CHECKBOX_IS_SELECTED = true;
                            }

                            else {

                            }
                        }

                    }
                    else {
                        if (Header.length > 0) {
                            if (Header[0].SHIFT_COUNT > 0) {
                                Header[0].MINUS_SQUARE = true;
                                Header[0].HEADER_SHOW_CHECKBOX = false;
                                Header[0].DATE_CHECKBOX_IS_SELECTED = false;
                            }
                            if (Header[0].SHIFT_COUNT == 0) {
                                Header[0].MINUS_SQUARE = true;
                                Header[0].HEADER_SHOW_CHECKBOX = false;
                                Header[0].DATE_CHECKBOX_IS_SELECTED = false;
                                if ($scope.SHIFT_COUNT > 0) {
                                    Header[0].MINUS_SQUARE = false;
                                    Header[0].HEADER_SHOW_CHECKBOX = true;
                                }
                            }
                            if (Header[0].SHIFT_COUNT == Header[0].DATEWISE_SHIFT_COUNT_WEB) {
                                Header[0].MINUS_SQUARE = false;
                                Header[0].HEADER_SHOW_CHECKBOX = true;
                                Header[0].DATE_CHECKBOX_IS_SELECTED = true;
                            }
                        }
                        //if (DPT.EMP_SHIFT_COUNT > 0) {
                        //    DPT.MINUS_SQUARE = true;
                        //    DPT.EMP_SELECTED = false;
                        //}
                        //else if (DPT.EMP_SHIFT_COUNT == 0) {
                        //    DPT.MINUS_SQUARE = true;
                        //    DPT.EMP_SELECTED = false;
                        //}
                        //if (DPT.EMP_SHIFT_COUNT == DPT.NO_OF_SHIFTS && DPT.NO_OF_SHIFTS > 0) {
                        //    DPT.EMP_SELECTED = true;
                        //    DPT.MINUS_SQUARE = false;
                        //}
                    };

                });


            })
        });
        //if (DL.DATEWISE_SHIFT_COUNT_WEB == count) {
        //    DL.MINUS_SQUARE = false;
        //    DL.DATE_CHECKBOX_IS_SELECTED = true;
        //}
        //else {
        //    DL.MINUS_SQUARE = true;
        //    DL.DATE_CHECKBOX_IS_SELECTED = false;
        //}
        if ($scope.SHIFT_COUNT == 0) {
            $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
        }
        else {
            $scope.DAYOFWEEKNAMES.filter(function (x) {
                if (x.DATEWISE_SHIFT_COUNT_WEB > 0) {
                    x.HEADER_SHOW_CHECKBOX = true
                    if (x.DATEWISE_SHIFT_COUNT_WEB == x.SHIFT_COUNT) {

                    }
                    else if (x.SHIFT_COUNT > 0) {
                        x.HEADER_SHOW_CHECKBOX = false;
                    }
                }
                ;
            });
        }
    };

    $scope.SELECT_DATE_CHECK = function (SHIFT, DAYOFWEEKNAMES, CHECK_UNCHECK_FLAG) {
        DAYOFWEEKNAMES.filter(function (x) {
            if (x.Days == SHIFT.Days) {
                //if (x.CHECK_COUNT == SHIFT.TOTAL_SHIFT[0].SHIFT_DETAILS.DATEWISE_SHIFT_COUNT_WEB) {
                //if (x.CHECK_COUNT == $scope.SHIFTS_LIST_ALL.filter(x => x.STATUS_ID != 23 && x.Days == SHIFT.Days).length) {
                var APPROVE_SHIFT_COUNT_DAYWISE = $scope.SHIFTS_LIST_ALL.filter(y => y.STATUS_ID == 23 && y.Days == SHIFT.Days).length;
                if (x.CHECK_COUNT == ($scope.SHIFTS_LIST_ALL.filter(z => z.STATUS_ID != 23 && z.Days == SHIFT.Days)[0].DATEWISE_SHIFT_COUNT_WEB - APPROVE_SHIFT_COUNT_DAYWISE)) {
                    x.MINUS_SQUARE = false;
                    x.DATE_CHECKBOX_IS_SELECTED = true;
                }
                else {
                    if (x.CHECK_COUNT == 0) {
                        x.MINUS_SQUARE = false;
                        x.DATE_CHECKBOX_IS_SELECTED = false;
                    }
                    else {
                        x.MINUS_SQUARE = true;
                        x.DATE_CHECKBOX_IS_SELECTED = false;
                    }
                }
            }
        });
    };
    $scope.DESELECT_ALL_CHECKBOX = function () {
        $scope.APPROVAL_IDS = [];
        $scope.$parent.APPROVE_SHIFT_ARRAY = [];
        $scope.PUBLISH_SHIFT_LIST = [];
        $scope.LOGIN_LOGOUT_LIST = [];
        $scope.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.DELETE_SHIFT_LIST = [];
        $scope.UNPUBLISH_SHIFT_LIST = [];
        $scope.APPROVE_SHIFT_LIST = [];
        $scope.LOGIN_LIST = [];
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.EMTY_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LOGOUT_LIST = [];
        $scope.$parent.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.$parent.DELETE_SHIFT_LIST = [];
        $scope.$parent.UNPUBLISH_SHIFT_LIST = [];
        $scope.$parent.APPROVE_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LIST = [];
        $scope.$parent.PUBLISH_SHIFT_LIST = [];
        $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.FOOTER_SHIFT_DERATION = 0;
        $scope.FOOTER_SHIFT_SHIFTCOUNT = 0;
        angular.forEach($scope.SELECT_DESELECT_DATE_WISE_GRID, function (Items) {
            angular.forEach(Items.TOTAL_SHIFT, function (DESELECT_ALL) {
                DESELECT_ALL.EMP_ID_IS_CHECK = false;
            });
        });
        angular.forEach($scope.DAYOFWEEKNAMES, function (Items) {
            Items.MINUS_SQUARE = false;
            Items.DATE_CHECKBOX_IS_SELECTED = false;
        });
        $scope.UNIQUE_SHIFT_BRANCH_WISE = $filter('unique')($scope.SHIFTS_LIST_ALL, 'SECTION_ID');
        if ($scope.UNIQUE_SHIFT_BRANCH_WISE.length > 0) {
            angular.forEach($scope.UNIQUE_SHIFT_BRANCH_WISE, function (Item) {
                $scope.FOOTER_SHIFT_DERATION += Item.SECTIONWISE_SHIFT_DURATION_IN_MIN;
                $scope.FOOTER_SHIFT_SHIFTCOUNT += Item.SECTIONWISE_SHIFT_COUNT_WEB;
            });
        }
        else {
            $scope.FOOTER_SHIFT_DERATION = 0;
            $scope.FOOTER_SHIFT_SHIFTCOUNT = 0;
        }

        $scope.APPROVAL_IDS = [];
        $scope.$parent.APPROVE_SHIFT_ARRAY = [];
    };
    $scope.selectApproveShiftTypeAhead = function (item, FLAG, EL, Shift) {
        $scope.Section_Week_Search.APPROVE_SHIFT_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.APPROVE_SHIFT_TYPE_ID = item.TABLE_ID;
    }

    $scope.FILTER_SHIFT_STATUS = function (CLICK_FLAG) {
        $scope.FILTER_COUNT = 0;
        $scope.$parent.PDF_DATA = [];
        angular.forEach($scope.SHIFT_STATUS, function (STATUS_SELECTED) {
            if (STATUS_SELECTED.FILTER_SELECTED) {
                $scope.FILTER_COUNT++;
                var List = $scope.SHIFTS_LIST_ALL.filter(x => x.STATUS_ID == STATUS_SELECTED.STATUS_ID);
                $scope.$parent.PDF_DATA = $scope.$parent.PDF_DATA.concat(List);
            }
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        if (SHIFT.STATUS_ID == STATUS_SELECTED.STATUS_ID) {
                            SHIFT.FILTER_SELECTED = !STATUS_SELECTED.FILTER_SELECTED;
                        }
                    });
                });
            });
        });
        if ($scope.FILTER_COUNT == 0) {
            $scope.$parent.PDF_DATA = [];
            $scope.$parent.PDF_DATA = $scope.SHIFTS_LIST_ALL;
        }

    }
    $scope.FILTER_SHIFT_TYPE = function () {
        $scope.FILTER_COUNT = 0;
        angular.forEach($scope.SHIFT_TYPES, function (SHIFT_TYPE_SELECTED) {
            if (SHIFT_TYPE_SELECTED.SELECTED) {
                $scope.FILTER_COUNT++;
            }
            //angular.forEach($scope.EMPLOYEE_LIST, function (List) {
            //	List.dayOfWeekNamesShort.filter(function (EM_shift) {
            //		if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
            //			angular.forEach(EM_shift.TOTAL_SHIFT, function (x) {
            //				if (x.SHIFT_TYPE_ID == SHIFT_TYPE_SELECTED.SHIFT_TYPE_ID) {
            //					x.FILTER_SELECTED = !SHIFT_TYPE_SELECTED.SELECTED;
            //				}
            //			})

            //		}
            //	})
            //});
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                        if (SHIFT.SHIFT_TYPE_ID == SHIFT_TYPE_SELECTED.SHIFT_TYPE_ID) {
                            SHIFT.FILTER_SELECTED = !SHIFT_TYPE_SELECTED.SELECTED;
                        }
                    });
                });
            });

        });
    }

    $scope.PUBLISH_OVERLAP = function (OVER_LAP_SHIFT_LIST) {
        angular.forEach($scope.AREA_SECTIONS, function (DPT) {
            angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                    var OverlapShift = OVER_LAP_SHIFT_LIST.filter(function (y) { return y.SHIFT_ID == SHIFT.SHIFT_ID });
                    if (OverlapShift.length > 0) {
                        //SHIFT.IS_OVER_LAP = true;
                        SHIFT.IS_OVER_LAP = true
                    }
                });
            });
        });
    }
    $scope.EMPLOYEE_FILTER = function () {
        var SEARCH_TEXT = '';
        $scope.FILTERED_EMPLOYEE_NAME_LIST = [];
        $scope.OPEN_EMPTY_ARRAY_LIST = [];

        if ($scope.Section_Week_Search.EMP_SEARCH == undefined || $scope.Section_Week_Search.EMP_SEARCH == null || $scope.Section_Week_Search.EMP_SEARCH == '') {
            $scope.EMPLOYEE_LIST = $scope.EMPLOYEE_LIST_COPY;
        }
        else {
            SEARCH_TEXT = $scope.Section_Week_Search.EMP_SEARCH.toLocaleUpperCase();
            angular.forEach($scope.EMPLOYEE_LIST, function (item) {
                if (item.INITIALS == 'ES' || item.INITIALS == 'OS') {
                    $scope.OPEN_EMPTY_ARRAY_LIST.push(item);
                }
                else {
                    $scope.FILTERED_EMPLOYEE_NAME_LIST.push(item);
                }
            });
            $scope.EMPLOYEE_LIST = $scope.FILTERED_EMPLOYEE_NAME_LIST.filter(x => x.EMPLOYEE_NAME.toLocaleUpperCase().includes(SEARCH_TEXT));
            $scope.OPEN_EMPTY_ARRAY_LIST = $scope.OPEN_EMPTY_ARRAY_LIST.concat($scope.EMPLOYEE_LIST);
            $scope.EMPLOYEE_LIST = $scope.OPEN_EMPTY_ARRAY_LIST;
        }
    };
    $scope.BRANCH_ID_UNIQUE = [];
    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.BRANCH_ID_UNIQUE = [];
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            angular.forEach($scope.AREA_SECTIONS, function (DPT) {
                angular.forEach(DPT.DAYOFWEEKNAMES, function (week) {
                    Cell.NewDate = new Date(week.NewDate);
                    if (week.TOTAL_SHIFT.length > 0) {
                        angular.forEach(week.TOTAL_SHIFT, function (SHIFT) {
                            $scope.DAYOFWEEKNAMES.filter(function (x) {
                                if (x.Days == SHIFT.Days) {
                                    if (x.TOTAL_SHIFT == undefined) {
                                        x.TOTAL_SHIFT = [];
                                    }
                                    if (week.TOTAL_SHIFT != undefined && week.TOTAL_SHIFT.length > 0) {
                                        var val = 0;
                                        val = SHIFT != undefined ? angular.copy(week.TOTAL_SHIFT[0].DATEWISE_SHIFT_DURATION_IN_MIN) : 0;
                                        $scope.TOTAL_MINTS = val;
                                        $scope.TOTAL_MINTS_SUM += val;
                                        x.DATEWISE_SHIFT_COUNT_WEB = week.TOTAL_SHIFT[0].DATEWISE_SHIFT_COUNT_WEB != null ? week.TOTAL_SHIFT[0].DATEWISE_SHIFT_COUNT_WEB : 0;
                                        x.DATEWISE_COST = week.TOTAL_SHIFT[0].DATEWISE_COST;
                                        x.DATEWISE_COST_WAGE = week.TOTAL_SHIFT[0].DATEWISE_COST_WAGE;
                                        x.BRANCH_DATEWISE_COST = week.TOTAL_SHIFT[0].BRANCH_DATEWISE_COST;

                                        x.DATEWISE_COST_WAGE_APP = week.TOTAL_SHIFT[0].DATEWISE_COST_WAGE_APP;
                                        x.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = week.TOTAL_SHIFT[0].DATEWISE_COST_WAGE_APP_EX_NO_SHOW;




                                        x.DATEWISE_SHIFT_DURATION_IN_MIN = $scope.TOTAL_MINTS;
                                        x.DATE_CHECKBOX_IS_SELECTED = false;
                                        x.CHECK_COUNT = 0;
                                        x.TOTAL_SHIFT = angular.copy(week.TOTAL_SHIFT);
                                        x.IS_LOCK = week.IS_LOCK ? false : true;
                                    }
                                    else {
                                        x.DATEWISE_COST = x.DATEWISE_COST > 0 ? x.DATEWISE_COST : x.DATEWISE_COST = 0;
                                        x.DATEWISE_COST_WAGE = x.DATEWISE_COST_WAGE > 0 ? x.DATEWISE_COST_WAGE : x.DATEWISE_COST_WAGE = 0;

                                        x.DATEWISE_COST_WAGE_APP = x.DATEWISE_COST_WAGE_APP > 0 ? x.DATEWISE_COST_WAGE_APP : x.DATEWISE_COST_WAGE_APP = 0;
                                        x.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = x.DATEWISE_COST_WAGE_APP_EX_NO_SHOW > 0 ? x.DATEWISE_COST_WAGE_APP_EX_NO_SHOW : x.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = 0;


                                        x.BRANCH_DATEWISE_COST = x.BRANCH_DATEWISE_COST > 0 ? x.BRANCH_DATEWISE_COST : x.BRANCH_DATEWISE_COST = 0;
                                        x.DATEWISE_SHIFT_COUNT_WEB = x.DATEWISE_SHIFT_COUNT_WEB > 0 ? x.DATEWISE_SHIFT_COUNT_WEB : 0;
                                        x.DATEWISE_SHIFT_DURATION_IN_MIN = x.DATEWISE_SHIFT_DURATION_IN_MIN > 0 ? x.DATEWISE_SHIFT_DURATION_IN_MIN : 0; //moment.utc().startOf('day').add({ minutes: $scope.TOTAL_MINTS }).format('H:mm') != undefined ? moment.utc().startOf('day').add({ minutes: $scope.TOTAL_MINTS }).format('H:mm') : '00:00';
                                        x.DATE_CHECKBOX_IS_SELECTED = false;
                                        x.CHECK_COUNT = 0;
                                        x.IS_LOCK = week.IS_LOCK ? false : true;
                                    }
                                }
                            });

                        });
                    } else {
                        $scope.DAYOFWEEKNAMES.filter(function (x) {
                            if (x.Days == week.Days) {
                                x.IS_LOCK = week.IS_LOCK ? false : true;
                            }
                        });
                    }
                });
                $scope.overlay_loading_rota = 'none';
            });
            $scope.PDF_DATA = $scope.SHIFTS_LIST_ALL;
            angular.forEach($scope.PDF_DATA, function (item) {
                if ($scope.LOGIN_LOGOUT_DETAILS.length > 0) {
                    var logn = $scope.LOGIN_LOGOUT_DETAILS.filter(function (x) { return x.SHIFT_ID == item.SHIFT_ID });
                    if (item.LOGIN_LOGOUT_DETAILS == undefined) {
                        item.LOGIN_LOGOUT_DETAILS = {};
                    }
                    if (logn.length > 0) {
                        item.LOGIN_LOGOUT_DETAILS = logn[0];
                    }
                }
                if ($scope.BRANCH_ID_UNIQUE.length == 0) {
                    $scope.BRANCH_ID_UNIQUE.push(item);
                };
                if ($scope.BRANCH_ID_UNIQUE.length > 0) {
                    var results = $scope.BRANCH_ID_UNIQUE.filter(function (x) { return x.BRANCH_ID == item.BRANCH_ID && x.Days == item.Days; })
                    if (results.length == 0) {
                        $scope.BRANCH_ID_UNIQUE.push(item);
                    }
                };

            });
            $scope.$parent.PDF_DATA = $scope.PDF_DATA;
            $scope.overlay_loading_rota = 'none';
            $scope.SHOW_HIDE_AREA_WAGE_CAST();

        }
        else {
            $scope.$parent.PDF_DATA = [];
            $scope.PDF_DATA = [];
            $scope.overlay_loading_rota = 'none';
        }

    });
    $scope.LOAD_AFTER_WAGE = function () {
        angular.forEach($scope.DAYOFWEEKNAMES, function (value) {
            value.WAGE_COST_VS_BUDGET = 0;
            value.WAGE_COST_VS_ACTUAL = 0;
            value.WAGE_COST_VS_FORECAST = 0;
            value.WAGE_COST_TOTAL = 0;
            var arr = $scope.WAGE_COST_LIST.filter(function (x) { return x.START_DATE == value.DateAsString })
            for (let i = 0; i < arr.length; i++) {
                value.WAGE_COST_TOTAL += arr[i].WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL == null ? 0 : arr[i].WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL;
            };

            if (value.WAGE_COST_VS_BUDGET == "Infinity") {
                value.WAGE_COST_VS_BUDGET = 0;
            }
            if (value.WAGE_COST_VS_ACTUAL == "Infinity") {
                value.WAGE_COST_VS_ACTUAL = 0;
            }
            if (value.WAGE_COST_VS_FORECAST == "Infinity") {
                value.WAGE_COST_VS_FORECAST = 0;
            }

            if (value.WAGE_COST_TOTAL > 0) {
                value.WAGE_COST_VS_BUDGET = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.BUDGET_REVENUE_TOTAL);
                value.WAGE_COST_VS_ACTUAL = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.ACTUAL_REVENUE_TOTAL);
                value.WAGE_COST_VS_FORECAST = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.FORECAST_REVENUE_TOTAL);
            }
            else {
                value.WAGE_COST_TOTAL = 0;
            }
        });
        //$scope.DAYOFWEEKNAMES.filter(function (x) {




        //});
    }

    $scope.SHOW_HIDE_AREA_WAGE_CAST = function () {
        //BRANCH_DATEWISE_COST_WAGE_APP use in BRANCH_ID_UNIQUE
        //BRANCH_DATEWISE_COST_WAGE_EX_NO_SHOW use in BRANCH_ID_UNIQUE
        //DATEWISE_COST_WAGE_APP use in DAYOFWEEKNAMES
        //DATEWISE_COST_WAGE_APP_EX_NO_SHOW use in DAYOFWEEKNAMES

        //$scope.BRANCH_ID_UNIQUE.filter(function (x) {
        //    if ($scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST) {
        //        x.BRANCH_DATEWISE_COST_WAGE = angular.copy(x.BRANCH_DATEWISE_COST_WAGE_EX_NO_SHOW);
        //    }
        //    else {
        //        x.BRANCH_DATEWISE_COST_WAGE = angular.copy(x.BRANCH_DATEWISE_COST_WAGE_APP);
        //    }
        //});
        if ($scope.WAGE_COST_LIST.length > 0) {

            $scope.WAGE_COST_LIST.filter(function (x) {
                x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL = 0;
                if ($scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST) {
                    x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL = angular.copy(x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL_EX_NO_SHOW);
                }
                else {
                    x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL = angular.copy(x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL_APP);
                }
            });
            $scope.LOAD_AFTER_WAGE();
        }
    }
    $scope.ShowAreaContextMenu = function (EMP, shift, CELL, VIEW_NAME) {
        $scope.SELECTED_EMPLOYEE = angular.copy(EMP);
        $scope.SELECTED_CELL = angular.copy(CELL);
        $scope.SELECTED_SHIFT = angular.copy(shift);
    }
    $scope.SHOW_ALL_DETIAL_FILTER_FY = function () {
        $scope.SHOW_ALL_DETIAL_FILTER = !$scope.SHOW_ALL_DETIAL_FILTER;
    }
    $scope.$parent.SHIFT_STATUS.filter(function (x) { x.FILTER_SELECTED = false });
    $scope.SHIFT_TYPES.length > 0 ? $scope.SHIFT_TYPES.filter(function (x) { return x.SELECTED = false }) : '';

    $scope.$parent.TabActive(8);
    $scope.$parent.Schedulerchild = $scope;

    $scope.PRINT_PDF_BUDGETREVENUE = function () {
        $('#PRINT_BUDGETREVENUE').modal('hide');
        $scope.REVENUE_PDF_PRINT();

    };
    $scope.REVENUE_PDF_PRINT = function () {

        $scope.SELECTED_COLUMNS = [];
        $scope.SELECTED_ROWS = [];
        $scope.SELECTED_DATA = [];
        var doc = new jsPDF("l", "pt", "a4");
        var res = doc.autoTableHtmlToJson(document.getElementById("Revenue_PDF"));
        angular.forEach(res.columns, function (item) {
            item = item.trim().replace(/\n +/g, "");
            $scope.SELECTED_COLUMNS.push(item);
        });
        res.columns = $scope.SELECTED_COLUMNS;

        angular.forEach(res.data, function (items) {
            $scope.SELECTED_ROWS = [];
            angular.forEach(items, function (item) {
                item = item.trim().replace(/\n +/g, "");
                if ((items[0].trim() == "Wage Cost" || items[0].trim() == "Wage Cost vs Budget %" || items[0].trim() == "Wage Cost vs Forecast %" || items[0].trim() == "Wage Cost vs Actual %") && $scope.Section_Week_Search.COSE_PRIVILEGE == 0) {
                    $scope.SELECTED_ROWS.push(item.trim() == "Wage Cost" || item.trim() == "Wage Cost vs Budget %" || item.trim() == "Wage Cost vs Forecast %" || item.trim() == "Wage Cost vs Actual %" ? item : $scope.$parent.ASTRIC);
                }
                else {
                    if (item == "∞") {
                        $scope.SELECTED_ROWS.push(0.00);
                    }
                    else {
                        $scope.SELECTED_ROWS.push(item);
                    }
                }
            });
            $scope.SELECTED_DATA.push($scope.SELECTED_ROWS);
        });
        res.data = $scope.SELECTED_DATA;
        // var imgsrc = $cookies.get("LOGO_PATH");
        //var imgsrc = "C:/Users/lenovo/Downloads/sample-birch-400x300.jpg";//$cookies.get("IMAGE_PATH");
        //doc.addImage(imgsrc, 'JPG',10, 10, 20, 20);
        //doc.text("Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 200, 30);
        doc.text($cookies.get("ENTITY_NAME") + " - " + "Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 150, 30);

        //  doc.text($cookies.get("ENTITY_NAME")+"                      "+"Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 100, 30)
        doc.autoTable(res.columns, res.data, {
            startY: false,
            margin: { horizontal: 10 },
            showHead: "everyPage",
            // theme: "striped",
            //theme: "grid",
            theme: "plain",
            tableWidth: 'auto',
            columnWidth: 'wrap',
            tableLineColor: 100,
            tableLineWidth: 0,

            columnStyles: {
                0: {
                    columnWidth: 'auto'
                },
                1: {
                    columnWidth: 'auto'
                },
                2: {
                    columnWidth: 'auto'
                },
                3: {
                    columnWidth: 'auto'
                },
                4: {
                    columnWidth: 'auto'
                },
                5: {
                    columnWidth: 'auto'
                },
                6: {
                    columnWidth: 'auto'
                },
                7: {
                    columnWidth: 'auto'
                },
                8: {
                    columnWidth: 'auto'
                }
            },
            headerStyles: {
                theme: 'grid',
                //fillColor: '#3f51b5',
                //textColor: '#fff',
            },
            styles: {
                overflow: 'linebreak',
                columnWidth: 'wrap',
                //font: getFontList().arial,
                fontSize: 8,
                cellPadding: 8,
                overflowColumns: 'linebreak',

            },
            didParseCell: function (row, res) {

                //if (res.row.raw[0].trim().length == 22) {
                //}
            },

            didDrawPage: function (data) {

                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.text("Report", 10, 10);
                // Footer
                var str = "Page " + doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            },
            drawRow: function (row, res) {

                //if (res.row.raw[0].trim().length == 16) {
                //    res.row.styles.fontSize = '15';
                //}
                // res.row.styles.fillColor = (0, 75, 109);
            },
            drawCell: function (row, res) {


                if (res.row.raw[0] == 'Revenue') {
                    doc.setFillColor(0, 75, 109);
                    doc.setTextColor(255, 255, 255);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                } if (res.row.raw[0] == 'Last Year') {
                    doc.setFillColor(244, 245, 246);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Last Week Sales') {
                    doc.setFillColor(244, 245, 246);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Budget Revenue') {
                    doc.setFillColor(225, 249, 219);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Forecast Revenue') {
                    doc.setFillColor(243, 248, 251);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Actual Revenue') {
                    doc.setFillColor(255, 235, 235);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Target Cost') {
                    doc.setFillColor(255, 255, 255);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost') {
                    doc.setFillColor(255, 255, 255);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Budget %') {
                    doc.setFillColor(225, 249, 219);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Forecast %') {
                    doc.setFillColor(243, 248, 251);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Actual %') {
                    doc.setFillColor(255, 235, 235);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }


            },
            createdHeaderCell: function (cell, res) {

                if (cell.raw != '') {
                    if (cell.raw.trim().split(':').length > 0) {
                        cell.styles.fontSize = 11;
                        cell.styles.fillColor = 250;
                        //cell.styles.columnWidth = "auto";
                        cell.styles.fontStyle = "bold";
                        cell.styles.rowHeight = 30.5;
                        cell.styles.textColor = 70;
                        cell.styles.theme = "grid";
                        cell.styles.halign = 'left';
                        cell.styles.valign = 'middle';

                    }
                    res.row.styles.fillColor = 245;
                    // res.row.styles.textColor = 120;
                }
            },
            createdCell: function (cell, res) {

                if (cell.raw != '') {
                    if (cell.raw.trim().split(':').length > 0) {
                        cell.styles.halign = 'left';
                        cell.styles.valign = 'middle';
                        cell.styles.fontSize = 10;

                        //cell.styles.fillColor = 250;
                        // cell.styles.columnWidth = "auto";
                        //cell.styles.fontStyle = "normal";
                        // cell.styles.rowHeight = 5;
                        //cell.styles.cellPadding = 5;
                        //cell.styles.lineWidth = 0.1;
                        //cell.styles.textColor = 70;
                        //  cell.styles.theme = "grid";
                    }

                    //if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                    //	cell.styles.fontSize = 16;
                    //	cell.styles.fillColor = 250;
                    //	res.row.styles.fillColor = 250;
                    //}
                }
                //if (cell.raw != '') {
                //    if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                //        cell.styles.fontSize = 10;
                //        cell.styles.fillColor = 250;
                //        res.row.styles.fillColor = 250;

                //        cell.styles.cellPadding = 12;
                //        cell.styles.textColor = [255, 0, 0];
                //    }
                //}
            },
            drawHeaderRow: function (row, res) {
                if (res.pageCount > 1) {
                    return false;
                }
            }
        });
        doc.save("Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + ".pdf");

    }
});
app.controller('NewEmployeeWeekViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, $interval) {
    $filter('lowercase')($location.absUrl()).indexOf("emp_e_week_view") != -1 ? $scope.$parent.IS_EMPLOYEE = true : $scope.$parent.IS_EMPLOYEE = false;
    $scope.Dptid = getUrlParameter('EmpID', $location.absUrl());
    $scope.COMMON_CODE_CHANGE();
    $scope.SHIFT_COUNT_MODAL = false;
    $scope.Section_Week_Search.EMP_SEARCH = '';
    $scope.propertyName = 'FIRST_NAME';
    $scope.ROTA_DAYS_LENGTH = 7;
    $scope.$parent.VIEW_TYPE = 2;
    $scope.PAGE_LOAD_FLAG_EMP = 1;
    $scope.PAGE_LOAD_DEPT_EMP_FLAG = 1;
    $scope.PAGE_LOAD_BRNH_EMP_FLAG = 1;
    $scope.PAGE_LOAD_DEPT_SHIFT_FLAG = 1;
    $scope.PAGE_LOAD_BRNH_SHIFT_FLAG = 1;
    $scope.PAGE_LOAD_SEC_SHIFT_FLAG = 1;
    $scope.TOTAL_SHIFT_COUNT = 0;
    $scope.TOTAL_DATEWISE_COST = 0;
    $scope.LEAVE_OBJ = [];
    $scope.WORKING_SHIFT_LIST = [];
    $scope.TOTAL_MINTS = 0;
    $scope.TOTAL_HOURS = 0;
    $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
    $scope.SHIFT_OVERVIEW_LIST = [];
    $scope.SHIFT_OVER_VEIW_LIST = [];
    $scope.$parent.BRANCH_ADD_LIST = [];
    //  $scope.SECTIONS_LIST = [];
    $scope.BRANCH_ROTA_LIST = [];
    $scope.FORECAST_REVENUE_LIST = [];
    $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
    $scope.DEPARTMENT_ROTA_LIST = [];
    $scope.REVENUE_SEARCH = {
        LAST_YEAR: {}, WAGE_SETTING: {},
        PLUS_MINUS_ICON_REVENUR: false,
        PLUS_MINUS_ICON_LAST_YEAR: false,
        PLUS_MINUS_ICON_LAST_WEEK_SALES: false,
        PLUS_MINUS_ICON_BUDGET_REVENUE: false,
        PLUS_MINUS_ICON_FORECAST_REVENUE: false,
        PLUS_MINUS_ICON_ACTUAL_REVENUE: false,

        PLUS_MINUS_WAGE_COST: false,
        PLUS_MINUS_WAGE_COST_VS_BUDGET: false,
        PLUS_MINUS_WAGE_COST_VS_FORECAST: false,
        PLUS_MINUS_WAGE_COST_VS_ACTUAL: false,


        PLUS_MINUS_WAGE_COST_OUT: false,
        PLUS_MINUS_WAGE_COST_VS_ACTUAL_OUT: false,

    };
    //if ($scope.DEPARTMENT_SHIFT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT_SHIFT = false; }); };
    //if ($scope.DEPARTMENT_ROTA_LIST.length > 0) { angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) { x.IS_CHECK_DEPT = false; }); };

    $scope.Section_Week_Search.DISPLAY_TEXT = "-All-";
    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = "-Department-";
    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = "-Department-";
    $scope.Section_Week_Search.DDL_BRANCH_TEXT = "-Branch-";


    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = undefined;
    $scope.Section_Week_Search.searchDepartmentText = '';
    $scope.Section_Week_Search.searchText = '';
    $scope.Section_Week_Search.DepartmentALL = false;
    $scope.Section_Week_Search.DepartmentShiftALL = false;
    $scope.Section_Week_Search.BranchSectionALL = false;
    $scope.Section_Week_Search.BRANCHALL = false;

    $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS = "";
    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";

    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";

    $scope.SHOW_ALL_DETIAL_FILTER = true;
    var ShowAllDtls = $scope.FilterModuleAccess(1, 6);//Show All Details
    if (ShowAllDtls != "") { $scope.SHOW_ALL_DETIAL_FILTER = ShowAllDtls.VALUE == '1' ? true : false; }


    $scope.$parent.closeNav5();
    $scope.goBack = function () {
        window.history.back();
    }
    var LeaveDays = [];
    $scope.OPEN_SHIFT_COUNT = 0;
    $scope.SORT_ORDER_LIST = [
        { ID: 1, NAME: "First Name", ASC: true, IS_ACTIVE: true, SORT_BY: "FIRST_NAME" },
        { ID: 3, NAME: "Last Name", ASC: false, IS_ACTIVE: false, SORT_BY: "LAST_NAME" },
        { ID: 4, NAME: "Total Hours", ASC: false, IS_ACTIVE: false, SORT_BY: "SHIFT_DURATION" },
        { ID: 5, NAME: "No Of Shifts", ASC: false, IS_ACTIVE: false, SORT_BY: "NO_OF_SHIFTS" },
        { ID: 5, NAME: "Age", ASC: false, IS_ACTIVE: false, SORT_BY: "DATE_OF_BIRTH" },
        { ID: 6, NAME: "Position", ASC: false, IS_ACTIVE: false, SORT_BY: "POSITION_TITLE" },
        { ID: 7, NAME: "Tenure", ASC: false, IS_ACTIVE: false, SORT_BY: "START_DATE" },
    ];
    $scope.START_DAY_OF_WEEK = $scope.$parent.START_DAY_OF_WEEK == undefined ? 0 : $scope.$parent.START_DAY_OF_WEEK;
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    var weekpicker, start_date, end_date;
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 2, NAME: "Tue", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 3, NAME: "Wed", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 4, NAME: "Thu", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 5, NAME: "Fri", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 6, NAME: "Sat", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 7, NAME: "Sun", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }];

    $scope.REST_DAYOFWEEKNAMESSHORT = function (SELECTED_SHIFT) {
        $scope.dayOfWeekNamesShort.filter(function (Items, NEW_MINUTES) {
            if (Items.Days == SELECTED_SHIFT.Days) {
                Items.DATEWISE_SHIFT_COUNT_WEB = Items.DATEWISE_SHIFT_COUNT_WEB + 1;
                Items.DATEWISE_SHIFT_DURATION_IN_MIN = Items.DATEWISE_SHIFT_DURATION_IN_MIN + NEW_MINUTES;
            }
        });
    }
    $scope.ROTA_GET_SHIFT_COUNTS = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();

        angular.forEach($scope.SECTIONS_LIST, function (SC) {
            if (SC.IS_CHECK_SECTION_SHIFT) {
                if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                }
                else {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + '';
                    let SecRed = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
                    if (SecRed.find(element => element == SC.TABLE_ID) == undefined) {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + "," + SC.TABLE_ID;
                    }
                }
            }
        });
        angular.forEach($scope.BRANCH_LIST, function (SC) {
            if (SC.IS_CHECK_BRH_SHIFT) {
                if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = SC.BRANCH_ID + '';
                }
                else {
                    $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + '';
                    let txt = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS.split(',');
                    if (txt.find(element => element == SC.BRANCH_ID) == undefined) {
                        $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + "," + SC.BRANCH_ID;
                    }
                }
            }
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID + '';
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + '';
                    let Depttxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
                    if (Depttxt.find(element => element == SC.DEPARTMENT_ID) == undefined) {
                        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                    }
                }
            }
        });

        ModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        ModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        ModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;

        ModelObj.LEAVE_COUNT_REQUIRED = 1;
        ModelObj.NAME = $scope.Section_Week_Search.NAME;
        ModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
        ModelObj.USER_ID = $cookies.get("USERID");

        if ($scope.$parent.CheckSubModuleAccess(42)) {
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }
        ModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;

        //ModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;

        ModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.SELECTED_DEPARTMENT_ID == null ? '' : $scope.Section_Week_Search.SELECTED_DEPARTMENT_ID;
        AssignShift_Form.submitted = false;
        PrcCommMethods.HR_API(ModelObj, 'ROTA_GET_SHIFT_COUNTS').then(function (data) {
            $scope.ROTA_SHIFT_COUNTS = data.data.Table[0];
            if ($scope.ROTA_SHIFT_COUNTS.EMPTY_COUNT == null && $scope.ROTA_SHIFT_COUNTS.OPEN_COUNT == null && $scope.ROTA_SHIFT_COUNTS.PUBLISHED_COUNT == null && $scope.ROTA_SHIFT_COUNTS.UNPUBLISHED_COUNT == null) {
                $scope.PUBLISH_SHIFTS = 'No Shifts';
            }
            else {
                if ($scope.ROTA_SHIFT_COUNTS.UNPUBLISHED_COUNT > 0) {
                    $scope.PUBLISH_SHIFTS = 'Publish ' + $scope.ROTA_SHIFT_COUNTS.UNPUBLISHED_COUNT + ' Shifts';
                }
                if ($scope.ROTA_SHIFT_COUNTS.UNPUBLISHED_COUNT == 0) {
                    $scope.PUBLISH_SHIFTS = 'All Shifts Published';
                }
            }
        });
    }

    function set_week_picker(date, FLAG) {
        $scope.overlay_loading_rota = 'block';
        var count = 0;
        start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
        end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        if (start_date > date) {
            if (FLAG == 1) {
                var increasedays = start_date.getDate() - date.getDate();
                start_date = new Date(date.getFullYear(), date.getMonth(), start_date.getDate() - ((7 - increasedays) + increasedays));
                end_date = new Date(start_date).addDays(6);
            }
        }
        weekpicker.datepicker('update', start_date);
        $scope.$parent.SHIFT_CELDER_START_DATE = start_date;
        $scope.$parent.SHIFT_CELDER_END_DATE = end_date;
        $scope.GET_EMPLOYEE_LIST_FOR_ROTA();
        $scope.ROTA_GET_SHIFT_COUNTS();
        var StartDD = start_date.getDate();
        var Startmm = start_date.getMonth() + 1;
        var start_dateyyyy = start_date.getFullYear();
        var EndDD = end_date.getDate();
        var Endmm = end_date.getMonth() + 1;
        var Endyyyy = end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;
        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        //weekpicker.val((start_date.getMonth() + 1) + '/' + start_date.getDate() + '/' + start_date.getFullYear() + ' - ' + (end_date.getMonth() + 1) + '/' + end_date.getDate() + '/' + end_date.getFullYear());
        var STARTDATE = new Date(start_date);
        // $scope.NextWeek = [];
        $scope.dayOfWeekNamesShort = [];
        if ($scope.$parent.WEEK_OFF_DAY.split(',').length > 0 && LeaveDays.length == 0) {
            LeaveDays = $scope.$parent.WEEK_OFF_DAY.split(',');
        }
        for (var i = 0; i < $scope.ROTA_DAYS_LENGTH; i++) {
            var NextWeekObj = new Object();
            NextWeekObj.NewDate = STARTDATE.addDays(i);
            NextWeekObj.Days = NextWeekObj.NewDate.getDate();
            NextWeekObj.DATEWISE_SHIFT_DURATION_IN_MIN = 0
            if (LeaveDays.length > 0) {
                var List = LeaveDays.filter(function (x) { return x == moment(NextWeekObj.NewDate).day() });
                if (List.length > 0) {
                    NextWeekObj.OFF_DAY = true;
                }
            }
            NextWeekObj.DateAsString = $filter('date')(NextWeekObj.NewDate, "yyyy-MM-dd") + 'T00:00:00';
            NextWeekObj.WAGE_COST_VS_BUDGET = 0;
            NextWeekObj.WAGE_COST_VS_ACTUAL = 0;
            NextWeekObj.WAGE_COST_VS_FORECAST = 0;
            $scope.dayOfWeekNamesShort.push(NextWeekObj);
        }
        $scope.GET_EMPLOYEE_LIST();


        // $scope.OPEN_EMPTY_SHIFT = [{ EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shifts ', dayOfWeekNamesShort: angular.copy($scope.dayOfWeekNamesShort), SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0 }, { EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shifts ', dayOfWeekNamesShort: angular.copy($scope.dayOfWeekNamesShort), SHIFT_DURATION: '00.00', NO_OF_SHIFTS: 0 }];
    };
    $scope.DATE_WEEK_PICKER = function (date) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME_HR_GET_EMP_BRANCH').then(function (data) {
            $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
            $scope.Section_Week_Search.FILTER_SECTION_ID = '';

            var EMPLOYEE_BRANCH = $scope.FilterModuleAccess(1, 1);
            var EMPLOYEE_DEPARTMENT = $scope.FilterModuleAccess(1, 2);
            var SHIFT_DEPARTMENT = $scope.FilterModuleAccess(1, 3);
            var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);

            $scope.USER_FILTER_APPLY = 0
            if (EMPLOYEE_BRANCH != "" || EMPLOYEE_DEPARTMENT != "" || EMPLOYEE_DEPARTMENT != "" || SHIFT_DEPARTMENT != "") {
                $scope.USER_FILTER_APPLY = 1;
                if (EMPLOYEE_BRANCH != "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = EMPLOYEE_BRANCH.VALUE;
                }
                if (EMPLOYEE_DEPARTMENT != "") {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = EMPLOYEE_DEPARTMENT.VALUE;
                }
                if (SHIFT_DEPARTMENT != "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SHIFT_DEPARTMENT.VALUE;
                }
                if (SHIFT_BRANCH_SECTION != "") {
                    $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SHIFT_BRANCH_SECTION.VALUE;
                }
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD(1);
                $scope.COMMON_EMP_DEPARTMENT_LOAD();
                $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
            }
            else if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = data.data.CustomTable1[0].BRANCH_ID + '';
                $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = data.data.CustomTable1[0].BRANCH_ID + '';
                $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = data.data.CustomTable1[0].DEPARTMENT_ID + '';
                $scope.COMMON_SHIFT_BRANCH_LOAD(2);

            } else {
                if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = true; }); };
                if ($scope.SECTIONS_LIST != undefined && $scope.SECTIONS_LIST.length > 0) { angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = true; }); };
            }
            if ($scope.$parent.SHIFT_CELDER_START_DATE == undefined) {
                $scope.DATEPICKERDATE_FY(new Date(data.data.UTC_TIME[0].UTC_TIME))
            }
            else {
                $scope.DATEPICKERDATE_FY(new Date($scope.$parent.SHIFT_CELDER_START_DATE))
            };
            $scope.TODAY_DAY = new Date(data.data.UTC_TIME[0].UTC_TIME).getDate();
            $scope.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();
            $scope.$parent.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();
            var today = new Date(data.data.UTC_TIME[0].UTC_TIME)
            today.setHours(0, 0, 0, 0);
            $scope.ONLY_TODAY_DATE = today;
            if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE && $scope.USER_FILTER_APPLY == 0) {
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD(2);
                $scope.COMMON_EMP_DEPARTMENT_LOAD();
                $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
            };
        });
    };
    $scope.DATEPICKERDATE_FY = function (date) {
        weekpicker = $('.week-picker');
        weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            container: '#week-picker-wrapper',
            todayHighlight: true
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date(start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date(end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    }

    $scope.GET_EMPLOYEE_LIST = function () {
        $scope.$parent.EMPLOYEE_LIST_ALL = [];
        var PosiModelObj = new Object();
        PosiModelObj.NAME = null;
        PosiModelObj.SORT_BY = 1;

        //PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;
        //PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;
        //PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS;


        PosiModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PosiModelObj.USER_ID = $cookies.get("USERID");
        if ($scope.$parent.IS_EMPLOYEE) { PosiModelObj.FLAG = 4; } else {
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                PosiModelObj.FLAG = 3;
            }
            else {
                PosiModelObj.FLAG = 2;
            };
        }
        PosiModelObj.DEPARTMENT_IDS = null;
        PosiModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_LIST_FOR_ROTA').then(function (data) {
            $scope.$parent.EMPLOYEE_LIST_UNIQUE = [];
            $scope.$parent.EMPLOYEE_LIST_ALL = [];
            $scope.EMPLOYEE_LIST_ALL = [];
            if (data.data.Table.length > 0) {
                $scope.EMPLOYEE_LIST_ALL = angular.copy(data.data.Table);
                var OPEN_EMPTY = [];
                if ($scope.IS_EMPLOYEE) {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', INITIALS: 'OS' });
                }
                else {
                    OPEN_EMPTY.push({ EMP_PRS_ID: -2, EMPLOYEE_NAME: 'Open Shift', INITIALS: 'OS' }, { EMP_PRS_ID: -1, EMPLOYEE_NAME: 'Empty Shift', INITIALS: 'ES' });
                }
                $scope.$parent.EMPLOYEE_LIST_ALL = angular.copy(data.data.Table);
                var EMPLOYEE_LIST_UNIQUE = $filter('unique')(data.data.Table, 'EMP_PRS_ID');
                $scope.$parent.EMPLOYEE_LIST_UNIQUE = OPEN_EMPTY.concat(EMPLOYEE_LIST_UNIQUE);
            }
        });
    };
    $scope.GET_EMPLOYEE_LIST_FOR_ROTA = function (LIST) {
        $scope.overlay_loading_rota = 'block';
        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
        $scope.TOTAL_SHIFT_COUNT = 0;
        $scope.TOTAL_MINTS = 0;
        $scope.TOTAL_HOURS = 0;
        $scope.$parent.PDF_DATA = [];
        $scope.SHIFTS_LIST_ALL_TEMP = [];
        $scope.$parent.LOGIN_LOGOUT_DETAILS = [];
        $scope.SHIFTS_LIST_ALL = [];
        $scope.$parent.SHIFTS_LIST_ALL = [];
        $scope.LOGIN_LOGOUT_DETAILS = [];
        $scope.EMPLOYEE_LIST = [];
        $scope.Section_Week_Search.COSE_PRIVILEGE = $scope.IS_EMPLOYEE ? 0 : $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        var PosiModelObj = new Object();
        PosiModelObj.NAME = $scope.Section_Week_Search.EMP_SEARCH;
        var LIST = $scope.SORT_ORDER_LIST.filter(function (x) { return x.IS_ACTIVE == true })
        if (LIST.length > 0) { PosiModelObj.SORT_BY = LIST[0].IS_ACTIVE && LIST[0].ASC ? LIST[0].ID : LIST[0].ID + 1; }
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
        PosiModelObj.USER_ID = $cookies.get("USERID");
        if ($scope.$parent.IS_EMPLOYEE) {
            PosiModelObj.FLAG = 4;
            PosiModelObj.IS_EMPLOYEE = 1;
        }
        else {
            if ($scope.$parent.CheckSubModuleAccess(42)) {
                PosiModelObj.FLAG = 1;
            }
            else if ($scope.$parent.CheckSubModuleAccess(109)) {
                PosiModelObj.FLAG = 3;
            }
            else {
                PosiModelObj.FLAG = 2;
            }
            PosiModelObj.IS_EMPLOYEE = 0;
        }
        //  -- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME, 4 SELF
        //$scope.Section_Week_Search.SECTION_FILTER_EMP_IDS = "";
        //$scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
        //$scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";

        angular.forEach($scope.BRANCH_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = SC.BRANCH_ID;
                }
                else {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS + "," + SC.BRANCH_ID;
                }
            }
        });
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT) {
                if ($scope.Section_Week_Search.DEPARTMENT_EMP_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_EMP_IDS == null || $scope.Section_Week_Search.DEPARTMENT_EMP_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS + "," + SC.DEPARTMENT_ID;
                };
            };
        });

        PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS;


        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = BRN.BRANCH_ID;
                        }
                        else {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                    }
                    else {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                    }
                }
            })
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == null || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                }
            }
        });

        PosiModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        PosiModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        PosiModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;

        //PosiModelObj.BRANCH_IDS = $scope.Section_Week_Search.FILTER_BRANCH_ID == null ? '' : $scope.Section_Week_Search.FILTER_BRANCH_ID;
        //PosiModelObj.SECTION_IDS = $scope.Section_Week_Search.FILTER_SECTION_ID == undefined ? '' : $scope.Section_Week_Search.FILTER_SECTION_ID;
        //PosiModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.FILTER_DEPARTMENT_ID == undefined ? '' : $scope.Section_Week_Search.FILTER_DEPARTMENT_ID;


        PosiModelObj.USER_ID = $cookies.get("USERID");
        PosiModelObj.VIEW_NAME = "EMP_VIEW";
        PosiModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");

        PosiModelObj.ROTA_DAYS_LENGTH = $scope.ROTA_DAYS_LENGTH;
        PosiModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PosiModelObj.WEB_FLAG = 1;
        PrcCommMethods.HR_API(PosiModelObj, 'GET_EMPLOYEE_LIST_FOR_ROTA_OBJ').then(function (data) {
            $scope.GET_WAGE_COST_FORECASTING();
            if (data.data.EmployeeList.length > 0) {
                $scope.dayOfWeekNamesShort.filter(function (Items) {
                    Items.HEADER_SELECTED_MINUS = false;
                    Items.HEADER_SHOW_CHECKBOX = false;
                    Items.DATEWISE_SHIFT_COUNT_WEB = 0;
                    Items.DATEWISE_COST = 0;
                    Items.DATEWISE_COST_WAGE = 0;
                    Items.DATEWISE_COST_WAGE_APP = 0;
                    Items.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = 0;
                    Items.BRANCH_DATEWISE_COST_WAGE = 0;
                    Items.HEADER_SHOW_TOTAL_SHIFT = [];
                    Items.DATEWISE_SHIFT_DURATION_IN_MIN = 0;
                    Items.IS_TIME_CAL = undefined;
                    Items.SHIFT_DURATION = '00.00';
                    Items.NO_OF_SHIFTS = 0;
                    Items.SHIFT_COUNT = 0;
                    Items.WAGE_COST_VS_BUDGET = 0;
                    Items.WAGE_COST_VS_ACTUAL = 0;
                    Items.WAGE_COST_VS_FORECAST = 0;
                });
                $scope.EMPLOYEE_LIST = data.data.EmployeeList;
            }
            else {
                $scope.EMPLOYEE_LIST = [];
            }
            if (data.data.ShiftDataset.Table1.length > 0) {
                $scope.LOGIN_LOGOUT_DETAILS = data.data.ShiftDataset.Table1;
                $scope.$parent.LOGIN_LOGOUT_DETAILS = data.data.ShiftDataset.Table1;
            }
            if (data.data.ShiftDataset.Table2.length > 0) {
                $scope.TOTAL_SHIFT_COUNT = data.data.ShiftDataset.Table2[0].TOTAL_NO_OF_SHIFTS_WEB;
                $scope.TOTAL_SHIFT_DURATION_IN_MINS = data.data.ShiftDataset.Table2[0].TOTAL_SHIFT_DURATION_IN_MINS;
                $scope.TOTAL_DATEWISE_COST = data.data.ShiftDataset.Table2[0].TOTAL_COST;
            }
            if (data.data.ShiftDataset.Table.length > 0) {
                $scope.$parent.SHIFTS_LIST_ALL = [];
                $scope.SHIFTS_LIST_ALL = [];
                $scope.SHIFTS_LIST_ALL_TEMP = [];
                $scope.$parent.PDF_DATA = [];
                if (data.data.ShiftDataset.Table.length > 0) {
                    $scope.SHIFTS_LIST_ALL_TEMP = angular.copy(data.data.ShiftDataset.Table);
                    $scope.SHIFTS_LIST_ALL = data.data.ShiftDataset.Table;
                    $scope.$parent.SHIFTS_LIST_ALL = [];
                    $scope.$parent.SHIFTS_LIST_ALL = data.data.ShiftDataset.Table;
                }
                else {
                    if ($scope.IS_EMPLOYEE) { };
                    $scope.SHIFTS_LIST_ALL = [];
                }
            }
            $scope.IS_LOCK_FLAG = false;
            $scope.$parent.IS_LOCK_FLAG = false;
            if (data.data.ShiftDataset.Table3.length > 0) {
                $scope.IS_LOCK_FLAG = true;
                $scope.$parent.IS_LOCK_FLAG = true;
            }
            if ($scope.PAGE_LOAD_FLAG_EMP == 1) {
                $scope.ON_DEPARTMENT_SHIFT_APPLY_CLICK(1);
                $scope.ON_SECTION_BRANCH_SHIFT_APPLY_CLICK(1);
                $scope.ON_BRANCH_APPLY_CLICK(1);
                $scope.ON_DEPARTMENT_APPLY_CLICK(1)
            }

            $scope.PAGE_LOAD_FLAG_EMP = 2;

            $scope.overlay_loading_rota = 'none';
            $scope.$parent.dayOfWeekNamesShort = $scope.dayOfWeekNamesShort;
            // $scope.GET_EMPLOYEE_LIST();
            $scope.$parent.EMPLOYEE_LIST = $scope.EMPLOYEE_LIST;
        });
    }

    $scope.PAGE_LOAD_FY = function () {
        $scope.GET_EMPLOYEE_LIST_FOR_ROTA();
        $scope.GET_WAGE_COST_FORECASTING();
        $scope.ROTA_GET_SHIFT_COUNTS();
    }

    $scope.DAILY_SHIFT_OVERVIEW_POP = function (DWN) {
        $('#dailyshiftOverview').modal('show');
        if (DWN.SHIFT_LTH == undefined) {
            angular.forEach(DWN.HEADER_SHOW_TOTAL_SHIFT, function (x) {
                angular.forEach(x.TOTAL_SHIFT, function (Shift) {
                    if (DWN.SHIFT_LTH == undefined) { DWN.SHIFT_LTH = 0; }
                    DWN.SHIFT_LTH++;
                    if (DWN.WORKING_SHIFT_LIST == undefined) { DWN.WORKING_SHIFT_LIST = []; }
                    if (DWN.PUBLISH_SHIFT_LIST == undefined) { DWN.PUBLISH_SHIFT_LIST = []; }
                    if (DWN.UNPUBLISH_SHIFT_LIST == undefined) { DWN.UNPUBLISH_SHIFT_LIST = []; }
                    if (DWN.APPROVAL_SHIFT_LIST == undefined) { DWN.APPROVAL_SHIFT_LIST = []; }
                    if (Shift.STATUS_ID == 21) { DWN.UNPUBLISH_SHIFT_LIST.push(Shift); }
                    if (Shift.STATUS_ID == 22) { DWN.PUBLISH_SHIFT_LIST.push(Shift); }
                    if (Shift.STATUS_ID == 23) { DWN.APPROVAL_SHIFT_LIST.push(Shift); }
                    if (Shift.LOGIN_LOGOUT_DETAILS.LOGIN_DATE != null && (Shift.STATUS_ID == 23 || Shift.STATUS_ID == 22)) { DWN.WORKING_SHIFT_LIST.push(Shift); }
                })
            })
        }
        $scope.DAILY_SHIFT_OVERVIEW_DETAILS = DWN;
    }
    $scope.ROTA_EMP_SET_ALL_SHIFT_TO_OPEN = function (EL, VIEW_NAME) {
        var SHIFT_LIST = [];
        SHIFT_LIST = $scope.SHIFTS_LIST_ALL.filter(x => x.EMP_PRS_ID == EL.EMP_PRS_ID).length > 0;
        if (SHIFT_LIST == 0) {
            $scope.$parent.ShowAlert('Attention', 'No Record Found.', 3000);
        }
        else {
            if (confirm('Are you sure you want to turn all shift to open? ' + ($scope.IS_LOCK_FLAG ? 'Action restricted for locked dates' : ''))) {
                var PosiModelObj = new Object();
                PosiModelObj.EMP_PRS_ID = EL.EMP_PRS_ID;
                PosiModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
                PosiModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
                PosiModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
                PosiModelObj.USER_ID = parseInt($cookies.get('USERID'));
                PosiModelObj.EMP_NAME = EL.FIRST_NAME + ' ' + EL.LAST_NAME;
                PrcCommMethods.HR_API(PosiModelObj, 'ROTA_EMP_SET_ALL_SHIFT_TO_OPEN').then(function (data) {
                    if (data.data == 1) {
                        $scope.$parent.ShowAlert('Success', 'Shift Open Successfully', 3000)
                        $scope.GET_EMPLOYEE_LIST_FOR_ROTA();
                        $scope.ROTA_GET_SHIFT_COUNTS();
                    }
                });
            }
        }
    }
    $scope.ROTA_EMP_SHIFT_OVERVIEW = function (EL) {
        $('#Employee_Shifts_dtls').modal('show');
        $scope.SHIFTOVERCOUNT = 0;
        $scope.SHIFT_OVERVIEW_LIST = [];
        $scope.SHIFT_OVERVIEW_LIST = EL.dayOfWeekNamesShort;
    }

    $scope.DE_SELECTED_ALL = function (truefalse) {
        $scope.SHIFT_COUNT_MODAL = false;
        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = truefalse;
        $scope.SHIFT_COUNT = 0;
        $scope.$parent.APPROVE_SHIFT_ARRAY = [];
        angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
            EMP.EMP_SELECTED_MINUS = truefalse;
            EMP.EMP_SHOW_CHECKBOX = truefalse
            EMP.EMP_SELECTED = truefalse;
            angular.forEach(EMP.dayOfWeekNamesShort, function (LIST) {
                angular.forEach(LIST.TOTAL_SHIFT, function (TOTL) {
                    TOTL.SHIFT_SELECTED = truefalse;
                })
            });
        });
        $scope.dayOfWeekNamesShort.filter(function (x) {
            x.HEADER_SELECTED_MINUS = truefalse;
            x.HEADER_SHOW_CHECKBOX = truefalse;
            x.HEADER_SELECTED = truefalse;
        });
    };
    $scope.DE_SELECT_STATUS_ID = function (STATUS_ID) {
        angular.forEach($scope.EMPLOYEE_LIST, function (List) {
            List.dayOfWeekNamesShort.filter(function (EM_shift) {
                if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                    List.EMP_SHOW_CHECKBOX = true;
                    angular.forEach(EM_shift.TOTAL_SHIFT, function (ALL_SHIFT) {
                        if (ALL_SHIFT.SHIFT_SELECTED) {
                            List.EMP_SELECTED_MINUS = true;
                            List.EMP_SHIFT_COUNT = List.EMP_SHIFT_COUNT + 1;
                            count++;
                            $scope.SHIFT_COUNT = count;
                            $scope.$parent.APPROVE_SHIFT_ARRAY.push(ALL_SHIFT)
                            if (STATUS_ID == 21) {
                                $scope.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            }
                            if (STATUS_ID == 22) {
                                $scope.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                            }
                            if (List.EMP_SHIFT_COUNT == List.NO_OF_SHIFTS) {
                                List.EMP_SELECTED = true;
                                List.EMP_SELECTED_MINUS = false;
                            }
                        }
                        else {
                            if (List.EMP_SHIFT_COUNT > 0) {
                                List.EMP_SELECTED_MINUS = true;
                                List.EMP_SELECTED = false;
                            }
                            else if (List.EMP_SHIFT_COUNT == 0) {
                                List.EMP_SELECTED_MINUS = true;
                                List.EMP_SELECTED = false;
                            }
                            if (List.EMP_SHIFT_COUNT == List.NO_OF_SHIFTS && List.NO_OF_SHIFTS > 0) {
                                List.EMP_SELECTED = true;
                                List.EMP_SELECTED_MINUS = false;
                            }
                        };
                    })
                }
            })
        });
    }

    $scope.ROTA_MULTIPLE_SHIFTS_CHECKBOX = function (EL, shift, FLAG, PLUS_MINUS, STATUS) {
        var count = 0;
        $scope.$parent.APPROVE_SHIFT_ARRAY = [];
        $scope.SHIFT_COUNT = 0;
        $scope.SHIFT_COUNT_MODAL = false;
        $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = true;
        $scope.$parent.PUBLISH_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LOGOUT_LIST = [];
        $scope.$parent.UNPUBLISH_SHIFT_LIST = [];
        $scope.$parent.OPEN_SHIFT_LIST = [];
        $scope.$parent.EMTY_SHIFT_LIST = [];
        $scope.$parent.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.$parent.DELETE_SHIFT_LIST = [];
        $scope.$parent.APPROVE_SHIFT_LIST = [];
        $scope.$parent.LOGIN_LIST = [];
        $scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.PUBLISH_SHIFT_LIST = [];
        $scope.LOGIN_LOGOUT_LIST = [];
        $scope.UNPUBLISH_SHIFT_LIST = [];
        $scope.OPEN_SHIFT_LIST = [];
        $scope.EMTY_SHIFT_LIST = [];
        $scope.APPROVE_SHIFT_LIST = [];
        $scope.SET_SHIFT_TO_OPEN_LIST = [];
        $scope.DELETE_SHIFT_LIST = [];
        $scope.LOGIN_LIST = [];
        $scope.NO_SHOW_SHIFT_LIST = [];
        $scope.$parent.NO_SHOW_SHIFT_LIST = [];
        $scope.NO_SHOW_SHIFT_COUNT = 0;
        $scope.UNPUBLISH_SHIFT_COUNT = 0;
        $scope.PUBLISH_SHIFT_COUNT = 0;
        $scope.LOGIN_LIST_COUNT = 0;
        $scope.LOGIN_LOGOUT_LIST_COUNT = 0;
        $scope.APPROVE_SHIFT_COUNT = 0;
        $scope.EMTY_SHIFT_COUNT = 0;
        $scope.OPEN_SHIFT_COUNT = 0;
        $scope.SET_SHIFT_TO_OPEN_COUNT = 0;
        $scope.DELETE_SHIFT_COUNT = 0;
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_COUNT = 0;
        $scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST = [];
        $scope.APPROVE_COUNT = 0;
        $scope.$parent.APPROVE_COUNT = 0;
        if (FLAG == 'HEADER') {
            if (PLUS_MINUS == 1) {
                EL.HEADER_SELECTED_MINUS = false;
                EL.HEADER_SHOW_CHECKBOX = true;
                EL.HEADER_SELECTED = true;
            }
            angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
                EMP.dayOfWeekNamesShort.filter(function (EMP_SHIFT) {
                    EL.HEADER_SHOW_CHECKBOX = true;
                    if (EMP_SHIFT.Days == EL.Days) {
                        angular.forEach(EMP_SHIFT.TOTAL_SHIFT, function (NewEMP) {
                            NewEMP.SHIFT_SELECTED = EL.HEADER_SELECTED;
                        })
                    }
                });
            });
        }
        if (FLAG == 'EMP_HEADER') {
            if (PLUS_MINUS == 1) {
                EL.EMP_SELECTED_MINUS = false;
                EL.EMP_SELECTED = true;
                EL.EMP_SHOW_CHECKBOX = true;
            }
            var EMP_LIST = $scope.EMPLOYEE_LIST.filter(function (x) { return x.EMP_PRS_ID == EL.EMP_PRS_ID });
            angular.forEach(EMP_LIST, function (EMP) {
                angular.forEach(EMP.dayOfWeekNamesShort, function (LIST) {
                    angular.forEach(LIST.TOTAL_SHIFT, function (NewList) {
                        NewList.SHIFT_SELECTED = EMP.EMP_SELECTED;
                    });
                });
            });
        }
        if (FLAG == "FOOTER") {
            angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
                angular.forEach(EMP.dayOfWeekNamesShort, function (LIST) {
                    angular.forEach(LIST.TOTAL_SHIFT, function (NewList) {
                        NewList.SHIFT_SELECTED = STATUS;
                    });
                });
            });
        }
        if (FLAG == "FOOTER_DE_SELECT") {
            angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
                angular.forEach(EMP.dayOfWeekNamesShort, function (LIST) {
                    angular.forEach(LIST.TOTAL_SHIFT, function (NewList) {
                        NewList.SHIFT_SELECTED = STATUS;
                    });
                });
            });
        }
        if (FLAG == "FOOTER_STATUS") {
            angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
                angular.forEach(EMP.dayOfWeekNamesShort, function (LIST) {
                    angular.forEach(LIST.TOTAL_SHIFT, function (NewList) {
                        if (NewList.STATUS_ID == STATUS) {
                            NewList.SHIFT_SELECTED = false;
                        }
                        //if (STATUS == 21) {
                        //    NewList.SHIFT_SELECTED = false;
                        //}
                        //if (STATUS == 22) {
                        //    NewList.SHIFT_SELECTED = false;
                        //}
                        if (NewList.EMPTY_OPEN_FLAG == STATUS) {
                            NewList.SHIFT_SELECTED = false;
                        }
                    });
                });
            });
        }
        $scope.EMPLOYEE_LIST.filter(function (x) { return x.EMP_SHIFT_COUNT = 0 });
        angular.forEach($scope.EMPLOYEE_LIST, function (List) {
            List.dayOfWeekNamesShort.filter(function (EM_shift) {
                if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                    List.EMP_SHOW_CHECKBOX = true;
                    angular.forEach(EM_shift.TOTAL_SHIFT, function (ALL_SHIFT) {
                        if (ALL_SHIFT.SHIFT_SELECTED) {
                            List.EMP_SELECTED_MINUS = true;
                            List.EMP_SHIFT_COUNT = List.EMP_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT;
                            count++;
                            $scope.$parent.APPROVE_SHIFT_ARRAY.push(ALL_SHIFT)
                            if (ALL_SHIFT.STATUS_ID == 21 && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && EM_shift.IS_LOCK) {
                                $scope.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.UNPUBLISH_SHIFT_COUNT = $scope.UNPUBLISH_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            if (ALL_SHIFT.STATUS_ID == 22 && (ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && EM_shift.IS_LOCK
                                || ALL_SHIFT.STATUS_ID == 22 && $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT == 1) {
                                $scope.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.PUBLISH_SHIFT_COUNT = $scope.PUBLISH_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            if (ALL_SHIFT.STATUS_ID == 22 && ALL_SHIFT.EMPTY_OPEN_FLAG != -1 && ALL_SHIFT.LOGIN_LOGOUT_DETAILS != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && EM_shift.IS_LOCK) {
                                if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE == null) {
                                    $scope.LOGIN_LIST.push(ALL_SHIFT);
                                    $scope.$parent.LOGIN_LIST.push(ALL_SHIFT);
                                    $scope.LOGIN_LIST_COUNT = $scope.LOGIN_LIST_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                                }
                            }
                            if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && ALL_SHIFT.STATUS_ID == 22 && EM_shift.IS_LOCK) {
                                if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE != null) {
                                    $scope.LOGIN_LOGOUT_LIST.push(ALL_SHIFT);
                                    $scope.$parent.LOGIN_LOGOUT_LIST.push(ALL_SHIFT);
                                    $scope.LOGIN_LOGOUT_LIST_COUNT = $scope.LOGIN_LOGOUT_LIST_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                                }
                            }

                            if (ALL_SHIFT.STATUS_ID == 23 && EM_shift.IS_LOCK) {
                                $scope.APPROVE_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.APPROVE_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.APPROVE_SHIFT_COUNT = $scope.APPROVE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            if (ALL_SHIFT.STATUS_ID == 24 && EM_shift.IS_LOCK) {
                                $scope.NO_SHOW_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.NO_SHOW_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.NO_SHOW_SHIFT_COUNT = $scope.NO_SHOW_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;

                            }
                            if (ALL_SHIFT.EMPTY_OPEN_FLAG == -1 && EM_shift.IS_LOCK) {
                                $scope.EMTY_SHIFT_LIST.push(ALL_SHIFT);;
                                $scope.$parent.EMTY_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.EMTY_SHIFT_COUNT = $scope.EMTY_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            if (ALL_SHIFT.EMPTY_OPEN_FLAG == -2 && EM_shift.IS_LOCK) {
                                $scope.OPEN_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.OPEN_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.OPEN_SHIFT_COUNT = $scope.OPEN_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            //if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS != null && ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length > 0 && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && !ALL_SHIFT.GREATER_THAN_DATE && ALL_SHIFT.EMPTY_OPEN_FLAG != -2) {
                            //	if (ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGIN_DATE == undefined && ALL_SHIFT.LOGIN_LOGOUT_DETAILS[0].LOGOUT_DATE == undefined) {
                            //		$scope.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(ALL_SHIFT);
                            //		$scope.$parent.BACK_SET_SHIFT_NOT_TO_OPEN_LIST.push(ALL_SHIFT);
                            //	}
                            //}

                            if ((ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && ALL_SHIFT.EMPTY_OPEN_FLAG != -2 && EM_shift.IS_LOCK) {
                                $scope.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                                $scope.$parent.SET_SHIFT_TO_OPEN_LIST.push(ALL_SHIFT);
                                $scope.SET_SHIFT_TO_OPEN_COUNT = $scope.SET_SHIFT_TO_OPEN_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;

                            }
                            /// NEW CODE END
                            if ((ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21) && EM_shift.IS_LOCK) {
                                $scope.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.$parent.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                                $scope.DELETE_SHIFT_COUNT = $scope.DELETE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            }
                            /// ENDCODE E
                            ///OLD CODE 

                            //if ((ALL_SHIFT.LOGIN_LOGOUT_DETAILS == null || ALL_SHIFT.LOGIN_LOGOUT_DETAILS.length == 0) && (ALL_SHIFT.STATUS_ID == 22 || ALL_SHIFT.STATUS_ID == 21)) {
                            //    $scope.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                            //    $scope.$parent.DELETE_SHIFT_LIST.push(ALL_SHIFT);
                            //    $scope.DELETE_SHIFT_COUNT = $scope.DELETE_SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                            //}
                            /// OLD CODE END
                            if (List.EMP_SHIFT_COUNT == List.NO_OF_SHIFTS) {
                                List.EMP_SELECTED = true;
                                List.EMP_SELECTED_MINUS = false;
                            }
                        }
                        else {
                            if (List.EMP_SHIFT_COUNT > 0) {
                                List.EMP_SELECTED_MINUS = true;
                                List.EMP_SELECTED = false;
                            }
                            else if (List.EMP_SHIFT_COUNT == 0) {
                                List.EMP_SELECTED_MINUS = true;
                                List.EMP_SELECTED = false;
                            }
                            if (List.EMP_SHIFT_COUNT == List.NO_OF_SHIFTS && List.NO_OF_SHIFTS > 0) {
                                List.EMP_SELECTED = true;
                                List.EMP_SELECTED_MINUS = false;
                            }
                        };
                    })

                }
            })
        });
        var count = 0;
        $scope.dayOfWeekNamesShort.filter(function (x) { x.SHIFT_COUNT = 0 });
        angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
            for (var i = 0; i < EMP.dayOfWeekNamesShort.length; i++) {
                var LIST = EMP.dayOfWeekNamesShort[i];
                var Header = $scope.dayOfWeekNamesShort.filter(function (EMP_SHIFT) { return EMP_SHIFT.Days == LIST.Days });
                if (Header.length > 0) {
                    if (LIST.Days == Header[0].Days) {
                        if (LIST.TOTAL_SHIFT != undefined && LIST.TOTAL_SHIFT.length > 0) {
                            angular.forEach(LIST.TOTAL_SHIFT, function (ALL_SHIFT) {
                                if (ALL_SHIFT.SHIFT_SELECTED) {
                                    Header[0].HEADER_SELECTED_MINUS = false;
                                    Header[0].HEADER_SHOW_CHECKBOX = true;
                                    count++;

                                    Header[0].SHIFT_COUNT = Header[0].SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                                    //$scope.SHIFT_COUNT = count;
                                    $scope.SHIFT_COUNT = $scope.SHIFT_COUNT + ALL_SHIFT.INS_SHIFT_COUNT_WEB;
                                    $scope.$parent.APPROVE_SHIFT_ARRAY.push(ALL_SHIFT);
                                    //if (ALL_SHIFT.STATUS_ID == 21) {
                                    //    $scope.UNPUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                    //}
                                    //if (ALL_SHIFT.STATUS_ID == 22) {
                                    //    $scope.PUBLISH_SHIFT_LIST.push(ALL_SHIFT);
                                    //}
                                    if (Header[0].SHIFT_COUNT > 0) {
                                        Header[0].HEADER_SELECTED_MINUS = true;
                                        Header[0].HEADER_SHOW_CHECKBOX = false;
                                        Header[0].HEADER_SELECTED = false;
                                    }
                                    if (Header[0].SHIFT_COUNT == Header[0].DATEWISE_SHIFT_COUNT_WEB) {
                                        Header[0].HEADER_SELECTED_MINUS = false;
                                        Header[0].HEADER_SHOW_CHECKBOX = true;
                                        Header[0].HEADER_SELECTED = true;
                                    }
                                }
                                else {
                                    if (Header[0].SHIFT_COUNT > 0) {
                                        Header[0].HEADER_SELECTED_MINUS = true;
                                        Header[0].HEADER_SHOW_CHECKBOX = false;
                                        Header[0].HEADER_SELECTED = false;
                                    }
                                    if (Header[0].SHIFT_COUNT == 0) {
                                        Header[0].HEADER_SELECTED_MINUS = true;
                                        Header[0].HEADER_SHOW_CHECKBOX = false;
                                        Header[0].HEADER_SELECTED = false;
                                        if ($scope.SHIFT_COUNT > 0) {
                                            Header[0].HEADER_SELECTED_MINUS = false;
                                            Header[0].HEADER_SHOW_CHECKBOX = true;
                                        }
                                    }
                                    if (Header[0].SHIFT_COUNT == Header[0].DATEWISE_SHIFT_COUNT_WEB) {
                                        Header[0].HEADER_SELECTED_MINUS = false;
                                        Header[0].HEADER_SHOW_CHECKBOX = true;
                                        Header[0].HEADER_SELECTED = true;
                                    }
                                }
                            });
                        }
                    }
                }
            };
        });
        if ($scope.SHIFT_COUNT == 0) {
            $scope.MULTIPLE_SHIFTS_FOOTER_SHOW = false;
        }
        else {
            $scope.dayOfWeekNamesShort.filter(function (x) {
                if (x.DATEWISE_SHIFT_COUNT_WEB > 0) {
                    x.HEADER_SHOW_CHECKBOX = true
                    if (x.DATEWISE_SHIFT_COUNT_WEB == x.SHIFT_COUNT) {
                    }
                    else if (x.SHIFT_COUNT > 0) {
                        x.HEADER_SHOW_CHECKBOX = false;
                    }
                };
            });
        }
        if ($scope.SHIFT_COUNT == $scope.TOTAL_SHIFT_COUNT) {
            $scope.SHIFT_COUNT_MODAL = true;
        }
    }

    $scope.selectApproveShiftTypeAhead = function (item, FLAG, EL, Shift) {
        $scope.Section_Week_Search.APPROVE_SHIFT_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.APPROVE_SHIFT_TYPE_ID = item.TABLE_ID;
    }
    $scope.selectEditShiftTypeAhead = function (item, FLAG, EL, Shift) {
        $scope.Section_Week_Search.EDIT_SHIFT_NAME = item.DISPLAY_TEXT;
        $scope.Section_Week_Search.EDIT_SHIFT_TYPE_ID = item.TABLE_ID;
    }

    $scope.SOVSGIFT = function (index) {
        $scope.SHIFTOVERCOUNT++;
    }

    $scope.REVENUE_SETTING = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 19)[0]["SETTING_VALUE"];
    $scope.WAGE_SETTING = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 20)[0]["SETTING_VALUE"];
    $scope.APPROVE_SHIFTS_WITHOUT_CLOCK_IN_AND_CLOCK_OUT = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 33)[0]["SETTING_VALUE"];
    $scope.SETTING_29 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 29)[0]["SETTING_VALUE"];
    $scope.SETTING_38 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 38)[0]["SETTING_VALUE"];
    $scope.SETTING_41 = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 41)[0]["SETTING_VALUE"];
    $scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST = JSON.parse($localStorage.ENTITY_SETTINGS).filter(x => x.SETTING_ID == 34)[0]["SETTING_VALUE"] == '1' ? false : true;

    $scope.REVENUE_SETTING_PRIVILAGE = $scope.$parent.CHECK_MODULE_ACCESS(119, 1);
    $scope.REVENUE_SETTING_PRIVILAGE_EDIT = $scope.$parent.CHECK_MODULE_ACCESS(119, 3);
    $scope.SHOW_INDIVIDUAL_COST_IN_SCHEDULE = $scope.$parent.CheckSubModuleAccess(125) ? 1 : 0;//125   Show Individual Cost in Schedule Tab

    $scope.SHOWALL_REVENUE_FY = function () {
        for (var a = 1; a < 6; a++) {
            $('.menu' + a).toggle("slide");
        }
    }
    $scope.CHANGE_PLUS_MINUS_ICON = function (T) {
        if ($scope.REVENUE_SEARCH[T] == true) {
            $scope.REVENUE_SEARCH[T] = false;
        }
        else if ($scope.REVENUE_SEARCH[T] == false) {
            $scope.REVENUE_SEARCH[T] = true;
        }
        $('.' + T).toggle("slide");
    };

    $scope.TEXT_FLAG = 1;
    $scope.GET_WAGE_COST_FORECASTING = function (WAGE_SETTING) {
        var ModelObj = new Object();
        $scope.WAGE_COST_LIST = [];
        ModelObj.START_DATE = (new Date($scope.$parent.SHIFT_CELDER_START_DATE)).toDateString();
        ModelObj.END_DATE = (new Date($scope.$parent.SHIFT_CELDER_END_DATE)).toDateString();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.WAGE_SETTING = $scope.WAGE_SETTING;

        ModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");

        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = BRN.BRANCH_ID;
                        }
                        else {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                    }
                    else {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                    }
                }
            })
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == null || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                }
            }
        });


        ModelObj.BRANCH_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;
        ModelObj.SECTION_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;
        ModelObj.DEPARTMENT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;;

        //-- 1 ROTA ADMIN ,2 MY TEAM , 3 ALL BELOW ME
        if ($scope.$parent.CheckSubModuleAccess(42)) {
            ModelObj.FLAG = 1;
        }
        else if ($scope.$parent.CheckSubModuleAccess(109)) {
            ModelObj.FLAG = 3;
        }
        else {
            ModelObj.FLAG = 2;
        }

        ModelObj.PRIVILAGE_103 = $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;/// 
        ModelObj.PRIVILAGE_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0
        ModelObj.SETTING_29 = $scope.SETTING_29;
        ModelObj.SETTING_38 = $scope.SETTING_38;
        ModelObj.ROTA_DAYS_LENGTH = $scope.ROTA_DAYS_LENGTH;;
        PrcCommMethods.HR_API(ModelObj, 'GET_WAGE_COST_FORECASTING').then(function (data) {
            if (data.data.ALL_DATASET.Table.length > 0) {
                $scope.REVENUE_SEARCH.BRANCH_LIST = data.data.ALL_DATASET.Table;//Setting in false
                for (var i = 0; i < $scope.REVENUE_SEARCH.BRANCH_LIST.length; i++) {
                    if ($scope.REVENUE_SEARCH.BRANCH_LIST[i].INTEGRATION_EXISTS == 0) {
                        $scope.REVENUE_SAVE_BTN = true;
                        break;
                    }
                }
            }
            if (data.data.WAGE_COST_CLS_OBJ.length > 0) {
                $scope.WAGE_COST_LIST = data.data.WAGE_COST_CLS_OBJ;
            }
            if (data.data.ALL_DATASET.Table1.length > 0) {
                $scope.REVENUE_SEARCH.WAGE_SETTING = data.data.ALL_DATASET.Table1[0];//Setting in false
            }
            if (data.data.WAGE_TARGET_CLS_OBJ.length > 0) {
                $scope.WAGE_TARGET_LIST = data.data.WAGE_TARGET_CLS_OBJ;
            }
            if (data.data.LAST_YEAR_REVENUE_CLS_OBJ.length > 0) {
                $scope.LAST_YEAR = data.data.LAST_YEAR_REVENUE_CLS_OBJ;
            }
            if (data.data.LAST_WEEK_REVENUE_CLS_OBJ.length > 0) {
                $scope.LAST_WEEK_SALES = data.data.LAST_WEEK_REVENUE_CLS_OBJ;
            }
            if (data.data.BUDGET_REVENUE_CLS_OBJ.length > 0) {
                $scope.BUDGET_REVENUE_LIST = data.data.BUDGET_REVENUE_CLS_OBJ;
            }
            if (data.data.FORECAST_REVENUE_CLS_OBJ.length > 0) {
                $scope.FORECAST_REVENUE_LIST = data.data.FORECAST_REVENUE_CLS_OBJ;
            }
            if (data.data.ACTUAL_REVENUE_CLS_OBJ.length > 0) {
                $scope.ACTUAL_REVENUE_LIST = data.data.ACTUAL_REVENUE_CLS_OBJ;
            }

        });
    }
    $scope.UPD_WAGE_COST_FORECASTING = function () {
        ModelObj = new Object();
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));
        ModelObj.USER_ID = parseInt($cookies.get('USERID'));
        ModelObj.ROTA_WAGE_TARGET_PER_TYPE = [];
        ModelObj.FORECASTED_REVENUE_TYPE = [];
        ModelObj.DAILY_SALES_BY_BRANCH_TYPE = [];
        angular.forEach($scope.WAGE_TARGET_LIST, function (val) {
            Readonly = new Object();
            Readonly.TABLE_ID = val.TABLE_ID;
            Readonly.DATE = val.START_DATE;
            Readonly.PERCENTAGE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);
            //Readonly.PERCENTAGE = val.REVENUE == "" || val.REVENUE == null ? 0 : parseFloat(val.REVENUE).toFixed(5);
            ModelObj.ROTA_WAGE_TARGET_PER_TYPE.push(Readonly);
        });
        angular.forEach($scope.FORECAST_REVENUE_LIST, function (val) {
            Readonly = new Object();
            Readonly.TABLE_ID = val.TABLE_ID;
            Readonly.FORECAST_DATE = val.START_DATE;
            //Readonly.REVENUE = val.REVENUE;
            Readonly.REVENUE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);
            Readonly.BRANCH_ID = val.BRANCH_ID;
            ModelObj.FORECASTED_REVENUE_TYPE.push(Readonly);
        });
        angular.forEach($scope.ACTUAL_REVENUE_LIST, function (val) {
            ReadModelObj = new Object();
            ReadModelObj.BRANCH_ID = val.BRANCH_ID;
            ReadModelObj.DATE = val.START_DATE;
            ReadModelObj.NET_REVENUE = val.REVENUE == undefined || val.REVENUE == "" || val.REVENUE == null ? parseFloat(0).toFixed(5) : parseFloat(val.REVENUE).toFixed(5);
            ModelObj.DAILY_SALES_BY_BRANCH_TYPE.push(ReadModelObj);
        });
        PrcCommMethods.HR_API(ModelObj, 'UPD_WAGE_COST_FORECASTING').then(function (data) {
            if (data.data == undefined || data.data == null || data.data == 0) {
                $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
            }
            else if (data.data == 1) {
                $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                $scope.GET_WAGE_COST_FORECASTING();
            }
        });
    }

    $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION = function () {
        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = "";
        $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = "";
        $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = "";

        $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS = "";
        $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = "";
        $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = "";
    }

    $scope.ON_SECTION_ALL_CLICK = function (count) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        // $scope.Section_Week_Search.BranchSectionALL = $scope.Section_Week_Search.BranchSectionALL ? false : true;
        $scope.Section_Week_Search.BranchSectionALL = true;
        if (count == $scope.BRANCH_LIST.length) {
            $scope.Section_Week_Search.BranchSectionALL = false;
        }
        $scope.Section_Week_Search.BranchSectionALL = true;
        if (count == $scope.BRANCH_LIST.length) {
            $scope.Section_Week_Search.BranchSectionALL = false;
        }
        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = $scope.Section_Week_Search.BranchSectionALL;
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID) {
                    x.IS_CHECK_SECTION_SHIFT = item.IS_CHECK_BRH_SHIFT;
                }
            })
        });
    }
    $scope.ON_SECTION_BRANCH_SELECT_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_BRH_SHIFT = LINE.IS_CHECK_BRH_SHIFT ? LINE.IS_CHECK_BRH_SHIFT = false : LINE.IS_CHECK_BRH_SHIFT = true;

        angular.forEach($scope.SECTIONS_LIST, function (x) {
            if (x.BRANCH_ID == LINE.BRANCH_ID) {
                x.IS_CHECK_SECTION_SHIFT = LINE.IS_CHECK_BRH_SHIFT
            };
        });
    }
    $scope.ON_SECTION_LINE_CLICK = function (LINE, HEADER) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        HEADER.IS_CHECK_BRH_SHIFT = true;
        LINE.IS_CHECK_SECTION_SHIFT = LINE.IS_CHECK_SECTION_SHIFT ? LINE.IS_CHECK_SECTION_SHIFT = false : LINE.IS_CHECK_SECTION_SHIFT = true;

        angular.forEach($scope.BRANCH_LIST, function (item) {
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID && !x.IS_CHECK_SECTION_SHIFT) {
                    item.IS_CHECK_BRH_SHIFT = false;
                }
            })
        });
    }
    $scope.ON_SECTION_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DISPLAY_TEXT = "ALL";
        $scope.Section_Week_Search.BranchSectionALL = false;
        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = false;
            angular.forEach($scope.SECTIONS_LIST, function (x) {
                if (x.BRANCH_ID == item.BRANCH_ID) {
                    x.IS_CHECK_SECTION_SHIFT = false;
                };
            });
        });
        $scope.PAGE_LOAD_FY();
    }

    $scope.ON_BRANCH_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = '-Department-';
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.FILTER_BRANCH_ID == '') {
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = item.BRANCH_ID + '';
                }
                else {

                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = $scope.Section_Week_Search.DDL_BRANCH_TEXT + "," + item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = $scope.Section_Week_Search.FILTER_BRANCH_ID + "," + item.BRANCH_ID;
                }
            }
        });
        //$scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.DEPARTMENT_NAME : '' }).join(",");
        //$scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.EMP_PRS_ID : '' }).join(",");
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };
    $scope.ON_SECTION_BRANCH_SHIFT_APPLY_CLICK = function (FLAG) {
        $scope.Section_Week_Search.DISPLAY_TEXT = "All";
        $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = "";
        $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = "";
        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = "";
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = BRN.BRANCH_ID + '';
                            //$scope.Section_Week_Search.DISPLAY_TEXT = BRN.BRANCH_NAME;
                        }
                        else {
                            $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS = $scope.Section_Week_Search.FILTER_BRANCH_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                            //$scope.Section_Week_Search.DISPLAY_TEXT = $scope.Section_Week_Search.DISPLAY_TEXT + ',' + BRN.BRANCH_NAME;
                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = SC.TABLE_ID;
                        $scope.Section_Week_Search.DISPLAY_TEXT = SC.DISPLAY_TEXT;
                    }
                    else {
                        $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS = $scope.Section_Week_Search.FILTER_SECTION_SHIFT_IDS + ',' + SC.TABLE_ID;
                        $scope.Section_Week_Search.DISPLAY_TEXT = $scope.Section_Week_Search.DISPLAY_TEXT + ',' + SC.DISPLAY_TEXT;
                    }
                }
            })
        });
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    }
    $scope.ON_DEPARTMENT_ALL_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DepartmentALL = $scope.Section_Week_Search.DepartmentALL ? false : true
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT = $scope.Section_Week_Search.DepartmentALL;
        });
    }
    $scope.ON_DEPARTMENT_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_DEPT = LINE.IS_CHECK_DEPT ? LINE.IS_CHECK_DEPT = false : LINE.IS_CHECK_DEPT = true;
        $scope.Section_Week_Search.DepartmentALL = true;
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_DEPT) {
                $scope.Section_Week_Search.DepartmentALL = false;
            }
        });
    }
    $scope.ON_DEPARTMENT_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = "-Department-";
        $scope.Section_Week_Search.DepartmentALL = false;
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT = false;
        });
        $scope.PAGE_LOAD_FY();
    }

    $scope.ON_DEPARTMENT_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = '-Department-';
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT) {
                if ($scope.Section_Week_Search.FILTER_DEPARTMENT_ID == '') {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = item.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT + "," + item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = $scope.Section_Week_Search.FILTER_DEPARTMENT_ID + "," + item.DEPARTMENT_ID;
                }
            }
        });
        //$scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.DEPARTMENT_NAME : '' }).join(",");
        //$scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.EMP_PRS_ID : '' }).join(",");
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };

    $scope.ON_BRANCH_ALL_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.BRANCHALL = $scope.Section_Week_Search.BRANCHALL ? false : true
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            item.IS_CHECK_BRANCH = $scope.Section_Week_Search.BRANCHALL;
        });
    }
    $scope.ON_BRANCH_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_BRANCH = LINE.IS_CHECK_BRANCH ? LINE.IS_CHECK_BRANCH = false : LINE.IS_CHECK_BRANCH = true;

        $scope.Section_Week_Search.BRANCHALL = true;
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_BRANCH) {
                $scope.Section_Week_Search.BRANCHALL = false;
            }
        });

    }
    $scope.ON_BRANCH_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.BRANCHALL = false;
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = "-Branch-";
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            item.IS_CHECK_BRANCH = false;
        });
        $scope.PAGE_LOAD_FY();
    }

    $scope.ON_BRANCH_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_BRANCH_ID = '';
        $scope.Section_Week_Search.DDL_BRANCH_TEXT = '-Department-';
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.FILTER_BRANCH_ID == '') {
                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = item.BRANCH_ID + '';
                }
                else {

                    $scope.Section_Week_Search.DDL_BRANCH_TEXT = $scope.Section_Week_Search.DDL_BRANCH_TEXT + "," + item.BRANCH_NAME;
                    $scope.Section_Week_Search.FILTER_BRANCH_ID = $scope.Section_Week_Search.FILTER_BRANCH_ID + "," + item.BRANCH_ID;
                }
            }
        });
        //$scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.DEPARTMENT_NAME : '' }).join(",");
        //$scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.EMP_PRS_ID : '' }).join(",");
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    };

    $scope.ON_DEPARTMENT_SHIFT_ALL_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.DepartmentShiftALL = $scope.Section_Week_Search.DepartmentShiftALL ? false : true
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT_SHIFT = $scope.Section_Week_Search.DepartmentShiftALL;
        });
    }
    $scope.ON_DEPARTMENT_SHIFT_LINE_CLICK = function (LINE) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        LINE.IS_CHECK_DEPT_SHIFT = LINE.IS_CHECK_DEPT_SHIFT ? LINE.IS_CHECK_DEPT_SHIFT = false : LINE.IS_CHECK_DEPT_SHIFT = true;
        $scope.Section_Week_Search.DepartmentShiftALL = true;
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (!item.IS_CHECK_DEPT_SHIFT) {
                $scope.Section_Week_Search.DepartmentShiftALL = false;
            }
        });

    }
    $scope.ON_DEPARTMENT_SHIFT_RESET_CLICK = function () {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = "-Department-";
        $scope.Section_Week_Search.DepartmentShiftALL = false;
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            item.IS_CHECK_DEPT_SHIFT = false;
        });
        $scope.PAGE_LOAD_FY();
    }

    $scope.ON_DEPARTMENT_SHIFT_APPLY_CLICK = function (FLAG) {
        $scope.RESET_SHIFT_EMP_BRANCH_DEPARTMENT_SECTION();
        $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = '';
        $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = '-Filter by Department-';
        //if (FLAG == 0) {
        //    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = "-All-";
        //    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = '';
        //}
        //else if (FLAG == 1) {
        //    $scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Item.DEPARTMENT_NAME;
        //    $scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Item.DEPARTMENT_ID;
        //}

        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID == '') {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = item.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT = $scope.Section_Week_Search.DDL_DEPARTMENT_SHIFT_TEXT + "," + item.DEPARTMENT_NAME;
                    $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID = $scope.Section_Week_Search.FILTER_DEPARTMENT_SHIFT_ID + "," + item.DEPARTMENT_ID;
                }
            }
        });


        //$scope.Section_Week_Search.DDL_DEPARTMENT_TEXT = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.DEPARTMENT_NAME : '' }).join(",");
        //$scope.Section_Week_Search.FILTER_DEPARTMENT_ID = Array.prototype.map.call($scope.DEPARTMENT_ROTA_LIST, function (item) { return item.IS_CHECK_DEPT ? item.EMP_PRS_ID : '' }).join(",");
        if (FLAG == undefined) {
            $scope.PAGE_LOAD_FY();
        }
    }

    $scope.ROTA_PRINT_NG_CHANGE = function () {
        if ($scope.Section_Week_Search.RotaReportWeeky == "1") { }
        if ($scope.Section_Week_Search.RotaReportWeeky == "2") {
            $scope.GET_WEEKLY_SCHEDULE_REPORT(2);
        }
        else if ($scope.Section_Week_Search.RotaReportWeeky == "3") {
            $scope.GET_WEEKLY_SCHEDULE_REPORT(3);
        }
    }
    $scope.GET_WEEKLY_SCHEDULE_REPORT = function (IS_ROTA_VIEW) {
        $scope.overlay_loading_rota = 'block';
        $scope.EMPLOYEE_LIST_ROTA = [];
        var PosiModelObj = new Object();
        PosiModelObj.NAME = $scope.Section_Week_Search.EMP_SEARCH;
        PosiModelObj.SORT_BY = 1;
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.START_DATE = (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString();
        PosiModelObj.END_DATE = (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString();
        PosiModelObj.EMP_PRS_ID = $cookies.get("EMPLOYEE_ID");
        PosiModelObj.USER_ID = $cookies.get("USERID");
        if ($scope.$parent.IS_EMPLOYEE) {
            PosiModelObj.FLAG = 4;
            PosiModelObj.IS_EMPLOYEE = 1;
        }
        else {
            PosiModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(42) ? 1 : 2;
            PosiModelObj.IS_EMPLOYEE = 0;
        }

        angular.forEach($scope.BRANCH_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_BRANCH) {
                if ($scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS == "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = SC.BRANCH_ID;
                }
                else {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS + "," + SC.BRANCH_ID;
                }
            }
        });
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT) {
                if ($scope.Section_Week_Search.DEPARTMENT_EMP_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_EMP_IDS == null || $scope.Section_Week_Search.DEPARTMENT_EMP_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS + "," + SC.DEPARTMENT_ID;
                };
            };
        });

        PosiModelObj.SECTION_FILTER_EMP_IDS = $scope.Section_Week_Search.SECTION_FILTER_EMP_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        PosiModelObj.BRANCH_FILTER_EMP_IDS = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        PosiModelObj.DEPARTMENT_EMP_IDS = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS;

        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var count = 0;
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (count == 0) {
                        if ($scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS == "") {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = BRN.BRANCH_ID;
                        }
                        else {
                            $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS + ',' + BRN.BRANCH_ID;
                        }
                    }
                    count++;
                    if ($scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == undefined || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == null || $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS == "") {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = SC.TABLE_ID;
                    }
                    else {
                        $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS + ',' + SC.TABLE_ID;
                    }
                }
            })
        });
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (SC) {
            if (SC.IS_CHECK_DEPT_SHIFT) {
                if ($scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == undefined || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == null || $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS == "") {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = SC.DEPARTMENT_ID;
                }
                else {
                    $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS + "," + SC.DEPARTMENT_ID;
                }
            }
        });

        PosiModelObj.SECTION_FILTER_SHIFT_IDS = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.SECTIONS_LIST, function (item) { return item.IS_CHECK_SECTION_SHIFT ? item.SECTION_ID : '' }).join(",");
        PosiModelObj.BRANCH_FILTER_SHIFT_IDS = $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS;// Array.prototype.map.call($scope.BRANCH_LIST, function (item) { return item.IS_CHECK_BRH_SHIFT ? item.BRANCH_ID : '' }).join(",");
        PosiModelObj.DEPARTMENT_SHIFT_IDS = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS;

        PosiModelObj.USER_ID = $cookies.get("USERID");
        PosiModelObj.VIEW_NAME = "EMP_VIEW";
        PosiModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");

        PosiModelObj.ROTA_DAYS_LENGTH = 7;
        PosiModelObj.PRIVILAGE_FLAG = $scope.Section_Week_Search.COSE_PRIVILEGE = $scope.IS_EMPLOYEE ? 0 : $scope.$parent.CheckSubModuleAccess(103) ? 1 : 0;
        PosiModelObj.PRIVILAGE_FLAG_111 = $scope.$parent.CheckSubModuleAccess(111) ? 1 : 0;
        PosiModelObj.IS_ROTA_VIEW = IS_ROTA_VIEW;
        PosiModelObj.ACTIVE = 1; // For Section view
        PrcCommMethods.HR_API(PosiModelObj, 'GET_WEEKLY_SCHEDULE_REPORT').then(function (data) {
            //if (data.data.EmployeeList.length > 0) {
            //    $scope.EMPLOYEE_LIST_ROTA = [];
            //    $scope.dayOfWeekNamesShortROTA = $scope.dayOfWeekNamesShort;
            //    var EmpList = [];
            //    angular.forEach(data.data.EmployeeList, function (x) {
            //        if (x.NO_OF_SHIFTS > 0) {
            //            x.INDEX = 0;
            //            if (x.SHIFT_ROW == 1) {
            //                EmpList.push(x);
            //            }
            //            if (x.SHIFT_ROW >= 2) {
            //                for (var i = 0; i < x.SHIFT_ROW; i++) {
            //                    var b = angular.copy(x);
            //                    b.INDEX = i;
            //                    EmpList.push(angular.copy(b));
            //                };
            //            };
            //        };
            //    });
            //    $scope.EMPLOYEE_LIST_ROTA = EmpList;
            //    if ($scope.EMPLOYEE_LIST_ROTA == 0) {
            //        $scope.dayOfWeekNamesShortROTA = [];
            //    }
            //    $scope.overlay_loading_rota = 'none';
            //} else {
            //    $scope.overlay_loading_rota = 'none';
            //}

            if ($scope.Section_Week_Search.RotaReportWeeky == "1") { }
            else if ($scope.Section_Week_Search.RotaReportWeeky == "2") {
                if (data.data.EmployeeList.length > 0) {
                    $scope.EMPLOYEE_LIST_ROTA = [];
                    $scope.dayOfWeekNamesShortROTA = $scope.dayOfWeekNamesShort;
                    var EmpList = [];
                    angular.forEach(data.data.EmployeeList, function (x) {
                        if (x.NO_OF_SHIFTS > 0) {
                            x.INDEX = 0;
                            if (x.SHIFT_ROW == 1) {
                                EmpList.push(x);
                            }
                            if (x.SHIFT_ROW >= 2) {
                                for (var i = 0; i < x.SHIFT_ROW; i++) {
                                    var b = angular.copy(x);
                                    b.INDEX = i;
                                    EmpList.push(angular.copy(b));
                                };
                            };
                        }
                        else if (x.NO_OF_SHIFTS == 0) {
                            x.INDEX = 0;
                            EmpList.push(x);
                        };
                    });
                    $scope.EMPLOYEE_LIST_ROTA = EmpList;
                    if ($scope.EMPLOYEE_LIST_ROTA == 0) {
                        $scope.dayOfWeekNamesShortROTA = [];
                    }
                    $scope.overlay_loading_rota = 'none';
                }
            }
            else if ($scope.Section_Week_Search.RotaReportWeeky == "3") {
                if (data.data.Areaobj.AREA_OBJ.length > 0) {
                    $scope.AREA_WEEK_VIEW_ROTA = [];
                    $scope.AREA_WEEK_VIEW_ROTA = data.data.Areaobj.AREA_OBJ;
                    $scope.dayOfWeekNamesShortROTA = $scope.dayOfWeekNamesShort;
                    $scope.overlay_loading_rota = 'none';
                }
            }
            else {
                $scope.overlay_loading_rota = 'none';
            }

        });
    }
    $scope.BRANCH_ID_UNIQUE = [];
    $scope.BRANCH_DATEWISE_COST_FY = function () {



    }

    $scope.RESET_SECTION_ADD = function () {
        $scope.Section_Week_Search = {
            SECTION_ID: null,
            SECTION_NAME: null,
            BRANCH_ID: '',
            DEPARTMENT_ID: '',
            USER_ID: null,
            ACTIVE: null, PAGE_NO: 1, PAGE_SIZE: 10,
            SECTION_NAME: null,
            COLOR: null,
            LOCATION_ID: ''
        };
    };

    $scope.ADMIN_ROTA_GET_BRANCH = function () {
        $scope.BRANCH_ROTA_LIST = [];
        ModelObj = new Object();

        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.ENTITY_ID = parseInt($cookies.get('ENTITY_ID'));

        ModelObj.BRANCH_CODE = null;//$scope.GroupSearch.BRANCH_CODE;
        ModelObj.BRANCH_NAME = null;// $scope.GroupSearch.BRANCH_NAME;
        ModelObj.CONTACT_NAME = null;// $scope.GroupSearch.CONTACT_NAME;
        ModelObj.LOCATION_IDS = $scope.Section_Week_Search.LOCATION_ID;
        ModelObj.ACTIVE = 1;//$scope.BrachSearch.ACTIVE ? 1 : 0;
        ModelObj.PAGE_NO = 1;
        ModelObj.PAGE_SIZE = 999;
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_ROTA_LIST = data.data.Table;
            var EMPLOYEE_BRANCH = $scope.FilterModuleAccess(1, 1);
            var EMPLOYEE_DEPARTMENT = $scope.FilterModuleAccess(1, 2);
            var SHIFT_DEPARTMENT = $scope.FilterModuleAccess(1, 3);
            var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);

            $scope.USER_FILTER_APPLY = 0
            if (EMPLOYEE_BRANCH != "" || EMPLOYEE_DEPARTMENT != "" || EMPLOYEE_DEPARTMENT != "" || SHIFT_DEPARTMENT != "") {
                $scope.USER_FILTER_APPLY = 1;
                if (EMPLOYEE_BRANCH != "") {
                    $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS = EMPLOYEE_BRANCH.VALUE;
                }
                $scope.COMMON_EMP_BRANCH_LOAD();
            }
            else if ($scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {

                if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = false; }); };
                if ($scope.SECTIONS_LIST != undefined && $scope.SECTIONS_LIST.length > 0) { angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = false; }); };
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD();
            }
            else {
                $scope.Section_Week_Search.BRANCHALL = true;
                $scope.Section_Week_Search.BranchSectionALL = true;
                $scope.BRANCH_ROTA_LIST.filter(function (x) { x.IS_CHECK_BRANCH = true; })
                // if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = true; }); };
                // if ($scope.SECTIONS_LIST != undefined && $scope.SECTIONS_LIST.length > 0) { angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = true; }); };
            };
            $scope.PAGE_LOAD_BRNH_EMP_FLAG = 2;

        });
    };
    $scope.ADMIN_ROTA_GET_BRANCH()

    $scope.HR_GET_DEPARTMENTS = function (FLAG) {
        $scope.DEPARTMENT_ROTA_LIST = [];
        $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
        var POSModelObj = new Object();
        POSModelObj.DEPARTMENT_NAME = '';
        POSModelObj.DIVISION_NAME = '';
        POSModelObj.DEPARTMENT_CODE = '';
        POSModelObj.DIVISION_CODE = '';
        POSModelObj.CUSTOMER_ID = parseInt($cookies.get("CUSTOMER_ID"));
        POSModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        POSModelObj.PAGE_NO = 0;
        POSModelObj.PAGE_SIZE = 0;
        POSModelObj.FLAG = $scope.$parent.CheckSubModuleAccess(46) ? 1 : 3;
        POSModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        POSModelObj.ACTIVE = 1;
        POSModelObj.SORT_COLUMN_NO = 1;
        POSModelObj.SORT_ORDER_NO = 1;
        PrcCommMethods.HR_API(POSModelObj, 'HR_GET_DEPARTMENTS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.DEPARTMENT_ROTA_LIST = data.data.Table;
                $scope.DEPARTMENT_SHIFT_ROTA_LIST = data.data.Table;
                $scope.$parent.DEPARTMENT_SHIFT_ROTA_LIST = data.data.Table;
                $scope.DEPARTMENT_LIST = data.data.Table;
                $scope.SECTION_GET_OR_FLAG = 1;
                var EMPLOYEE_BRANCH = $scope.FilterModuleAccess(1, 1);
                var EMPLOYEE_DEPARTMENT = $scope.FilterModuleAccess(1, 2);
                var SHIFT_DEPARTMENT = $scope.FilterModuleAccess(1, 3);
                var SHIFT_BRANCH_SECTION = $scope.FilterModuleAccess(1, 5);

                $scope.USER_FILTER_APPLY = 0
                if (EMPLOYEE_BRANCH != "" || EMPLOYEE_DEPARTMENT != "" || EMPLOYEE_DEPARTMENT != "" || SHIFT_DEPARTMENT != "") {
                    $scope.USER_FILTER_APPLY = 1;
                }
                else if ($scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                    $scope.COMMON_EMP_DEPARTMENT_LOAD();
                    $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
                }
                else {
                    $scope.Section_Week_Search.DepartmentShiftALL = true;
                    $scope.DEPARTMENT_SHIFT_ROTA_LIST.filter(function (x) { x.IS_CHECK_DEPT_SHIFT = true; })
                    $scope.Section_Week_Search.DepartmentALL = true;
                    $scope.DEPARTMENT_ROTA_LIST.filter(function (x) { x.IS_CHECK_DEPT = true; })
                }
                $scope.PAGE_LOAD_DEPT_EMP_FLAG = 2;
                $scope.PAGE_LOAD_DEPT_SHIFT_FLAG = 2;

            }
            else {
                $scope.DEPARTMENT_ROTA_LIST = [];
                $scope.DEPARTMENT_SHIFT_ROTA_LIST = [];
                $scope.DEPARTMENT_LIST = [];
            };
        });
    }
    $scope.HR_GET_DEPARTMENTS(1);
    $scope.FLAG_DEPART = 2;

    $scope.COMMON_EMP_BRANCH_LOAD = function () {
        if ($scope.BRANCH_ROTA_LIST.length == 1) {
            $scope.Section_Week_Search.BRANCHALL = true;
        }
        let Brtxt = $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS.split(',');
        $scope.BRANCH_ROTA_LIST.filter(function (x) {
            if (Brtxt.find(element => element == x.BRANCH_ID) != undefined) {
                x.IS_CHECK_BRANCH = true;
            }
        });
    }
    $scope.COMMON_SHIFT_BRANCH_LOAD_OLD = function (FLAG) {
        if ($scope.BRANCH_LIST.length == 1) {
            $scope.Section_Week_Search.BranchSectionALL = true;
        };
        let Sectiontxt = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
        angular.forEach($scope.BRANCH_LIST, function (item) {
            if (item.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS && FLAG == 2) {
                item.IS_CHECK_BRH_SHIFT = true;
            };
            $scope.SEC_LIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == item.BRANCH_ID });
            angular.forEach($scope.SEC_LIST, function (x) {
                if (FLAG == 1) {
                    if (Sectiontxt.find(element => element == x.TABLE_ID) != undefined) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                    }
                }
                if (FLAG == 2) {
                    if ((item.BRANCH_ID == x.BRANCH_ID) && item.IS_CHECK_BRH_SHIFT) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                    };
                }


            });
        });
        //angular.forEach($scope.BRANCH_LIST, function (item) {
        //    if (item.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS) {
        //        item.IS_CHECK_BRH_SHIFT = true;
        //    };
        //    angular.forEach($scope.SECTIONS_LIST, function (x) {
        //        if ((item.BRANCH_ID == x.BRANCH_ID) && item.IS_CHECK_BRH_SHIFT) {
        //            x.IS_CHECK_SECTION_SHIFT = true;
        //        };
        //    })
        //});
    }
    $scope.COMMON_SHIFT_BRANCH_LOAD = function (FLAG) {

        if ($scope.BRANCH_LIST.length == 1) { $scope.Section_Week_Search.BranchSectionALL = true; };
        let Sectiontxt = $scope.Section_Week_Search.SECTION_FILTER_SHIFT_IDS.split(',');
        angular.forEach($scope.BRANCH_LIST, function (item) {
            item.IS_CHECK_BRH_SHIFT = false;
            if (item.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS && FLAG == 2) { item.IS_CHECK_BRH_SHIFT = true; };
            var sectionCount = 0;
            $scope.SEC_LIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == item.BRANCH_ID });
            angular.forEach($scope.SEC_LIST, function (x) {
                if (FLAG == 1) {
                    if (Sectiontxt.find(element => element == x.TABLE_ID) != undefined) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                        $scope.Section_Week_Search.DISPLAY_TEXT == "ALL" ?
                            $scope.Section_Week_Search.DISPLAY_TEXT = x.DISPLAY_TEXT :
                            $scope.Section_Week_Search.DISPLAY_TEXT =
                            $scope.Section_Week_Search.DISPLAY_TEXT + "," + x.DISPLAY_TEXT;
                        sectionCount = sectionCount + 1;
                    }
                }
                if (FLAG == 2) {
                    if ((item.BRANCH_ID == x.BRANCH_ID) && item.IS_CHECK_BRH_SHIFT) {
                        x.IS_CHECK_SECTION_SHIFT = true;
                        $scope.Section_Week_Search.DISPLAY_TEXT == "ALL" ?
                            $scope.Section_Week_Search.DISPLAY_TEXT = x.DISPLAY_TEXT :
                            $scope.Section_Week_Search.DISPLAY_TEXT =
                            $scope.Section_Week_Search.DISPLAY_TEXT + "," + x.DISPLAY_TEXT;
                        sectionCount = sectionCount + 1;
                    };
                }
            });
            if ($scope.SEC_LIST.length == sectionCount) {
                item.IS_CHECK_BRH_SHIFT = true;
            }
        });
    }
    $scope.COMMON_EMP_DEPARTMENT_LOAD = function () {

        let Brtxt = $scope.Section_Week_Search.DEPARTMENT_EMP_IDS.split(',');
        var DeprtCount = 0;
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) {
            if ($scope.FLAG_DEPART == 1) {
                x.IS_CHECK_DEPT = true;
            }
            else {
                x.IS_CHECK_DEPT = Brtxt.find(element => element == x.DEPARTMENT_ID) != undefined ? true : false;

            }
            if (x.IS_CHECK_DEPT) {
                DeprtCount = DeprtCount + 1;
            }
        });
        $scope.Section_Week_Search.DepartmentALL = $scope.FLAG_DEPART == 1 ? true : false;
        if ($scope.DEPARTMENT_ROTA_LIST.length == DeprtCount) {
            $scope.Section_Week_Search.DepartmentALL = true;
        }
    }
    $scope.COMMON_SHIFT_DEPARTMENT_LOAD = function () {
        var deprtcount2 = 0;
        Brtxt = $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS.split(',');
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) {
            if ($scope.FLAG_DEPART == 1) {
                x.IS_CHECK_DEPT_SHIFT = true;
            }
            else {
                x.IS_CHECK_DEPT_SHIFT = Brtxt.find(element => element == x.DEPARTMENT_ID) != undefined ? true : false;

            }
            if (x.IS_CHECK_DEPT_SHIFT) {
                deprtcount2 = deprtcount2 + 1;
            }
        });
        $scope.Section_Week_Search.DepartmentShiftALL = $scope.FLAG_DEPART == 1 ? true : false;
        if ($scope.DEPARTMENT_SHIFT_ROTA_LIST.length == deprtcount2) {
            $scope.Section_Week_Search.DepartmentShiftALL = true;
        }
    }


    //$scope.FILTER_ROTA_GET_SECTION = function () {
    //    $scope.COMMON_SHIFT_BRANCH_LOAD();
    //}
    //$scope.COMMON_EMP_BRANCH_LOAD = function () {
    //    if ($scope.BRANCH_ROTA_LIST.length == 1) {
    //        $scope.Section_Week_Search.BRANCHALL = true;
    //    };
    //    $scope.BRANCH_ROTA_LIST.filter(function (x) {
    //        if (x.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_EMP_IDS) {
    //            x.IS_CHECK_BRANCH = true;
    //        };
    //    });
    //}
    //$scope.COMMON_SHIFT_BRANCH_LOAD = function () {
    //    if ($scope.BRANCH_LIST.length == 1) {
    //        $scope.Section_Week_Search.BranchSectionALL = true;
    //    }
    //    angular.forEach($scope.BRANCH_LIST, function (item) {
    //        if (item.BRANCH_ID == $scope.Section_Week_Search.BRANCH_FILTER_SHIFT_IDS) {
    //            item.IS_CHECK_BRH_SHIFT = true;
    //        };
    //        angular.forEach($scope.SECTIONS_LIST, function (x) {
    //            if ((item.BRANCH_ID == x.BRANCH_ID) && item.IS_CHECK_BRH_SHIFT) {
    //                x.IS_CHECK_SECTION_SHIFT = true;
    //            };
    //        });
    //    });
    //}
    //$scope.COMMON_EMP_DEPARTMENT_LOAD = function () {
    //    $scope.Section_Week_Search.DepartmentALL = $scope.FLAG_DEPART == 1 ? true : false;
    //    angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (x) {
    //        if ($scope.FLAG_DEPART == 1) {
    //            x.IS_CHECK_DEPT = true;
    //        }
    //        else {
    //            x.IS_CHECK_DEPT = x.DEPARTMENT_ID == $scope.Section_Week_Search.DEPARTMENT_EMP_IDS ? true : false;;
    //        }
    //    });
    //}
    //$scope.COMMON_SHIFT_DEPARTMENT_LOAD = function () {
    //    $scope.Section_Week_Search.DepartmentShiftALL = $scope.FLAG_DEPART == 1 ? true : false;;
    //    angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (x) {
    //        if ($scope.FLAG_DEPART == 1) {
    //            x.IS_CHECK_DEPT_SHIFT = true;
    //        }
    //        else {
    //            x.IS_CHECK_DEPT_SHIFT = x.DEPARTMENT_ID == $scope.Section_Week_Search.DEPARTMENT_SHIFT_IDS ? true : false;
    //        }
    //    });
    //}


    $scope.INS_UPD_USER_FILTERS_FY = function () {
        // if (confirm('This will replace previously saved filter, are you sure you want to proceed?')) { {
        var USER_FILTER = [];
        //1	Employee Branch //2	Employee Department //3	Shift Department //4	Shift View //5	Shift Branch Section
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.BRANCH_ROTA_LIST, function (item) {
            if (item.IS_CHECK_BRANCH) {
                if (readOnly.VALUE == "") {
                    readOnly.VALUE = item.BRANCH_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.BRANCH_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 1;
        USER_FILTER.push(readOnly);

        //2	Employee Department
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.DEPARTMENT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT) {
                if (readOnly.VALUE == '') {
                    readOnly.VALUE = item.DEPARTMENT_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.DEPARTMENT_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 2;
        USER_FILTER.push(readOnly);

        //3	Shift Department
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.DEPARTMENT_SHIFT_ROTA_LIST, function (item) {
            if (item.IS_CHECK_DEPT_SHIFT) {
                if (readOnly.VALUE == '') {
                    readOnly.VALUE = item.DEPARTMENT_ID + '';
                }
                else {
                    readOnly.VALUE = readOnly.VALUE + "," + item.DEPARTMENT_ID;
                }
            }
        });
        readOnly.FILTERS_ID = 3;
        USER_FILTER.push(readOnly);

        //4	Week View
        var readOnly = new Object();
        readOnly.VALUE = "E_Week_View";
        readOnly.FILTERS_ID = 4;
        USER_FILTER.push(readOnly);


        //5	Shift Branch Section
        var readOnly = new Object();
        readOnly.VALUE = "";
        angular.forEach($scope.BRANCH_LIST, function (BRN) {
            var SECLIST = $scope.SECTIONS_LIST.filter(function (x) { return x.BRANCH_ID == BRN.BRANCH_ID });
            angular.forEach(SECLIST, function (SC) {
                if (SC.IS_CHECK_SECTION_SHIFT && SC.TABLE_ID != null) {
                    if (readOnly.VALUE == "") {
                        readOnly.VALUE = SC.TABLE_ID;
                    }
                    else {
                        readOnly.VALUE = readOnly.VALUE + ',' + SC.TABLE_ID;
                    }
                }
            })
        });
        readOnly.FILTERS_ID = 5;
        USER_FILTER.push(readOnly);

        //6	Show Shift Details
        var readOnly = new Object();
        readOnly.VALUE = $scope.SHOW_ALL_DETIAL_FILTER ? 1 : 0;
        readOnly.FILTERS_ID = 6;
        USER_FILTER.push(readOnly);

        $scope.INS_UPD_USER_FILTERS(1, USER_FILTER);
        // }
    }
    $scope.PUBLISH_SECTION_CLICK = function (FLAG) {
        if (FLAG == 1) {
            angular.forEach($scope.SECTIONS_PUBLISH_LIST, function (val) {
                val.IS_CHECK_SECTION_SHIFT = true;
            })
        }
        if (FLAG == 2) {
            angular.forEach($scope.SECTIONS_PUBLISH_LIST, function (val) {
                val.IS_CHECK_SECTION_SHIFT = false;
            })
        }
        if (FLAG == 3) {
            angular.forEach($scope.SECTIONS_PUBLISH_LIST, function (val) {
                val.IS_CHECK_SECTION_SHIFT = val.IS_CHECK_SECTION_SHIFT ? false : true;
            });
        }
    }
    $scope.SORTBY = function (propertyName, ASC_OR_DESC) {
        $scope.reverse = ($scope.propertyName === propertyName) ? !ASC_OR_DESC : false;
        $scope.propertyName = propertyName;
        var filtered = [];
        var TOP_RECORD = [];
        angular.forEach($scope.EMPLOYEE_LIST, function (item) {
            if (item.INITIALS == 'ES' || item.INITIALS == 'OS') {
                TOP_RECORD.push(item);
            }
            else {
                filtered.push(item);
            }
        });

        filtered = $filter('orderBy')(filtered, $scope.propertyName, $scope.reverse);
        TOP_RECORD = TOP_RECORD.concat(filtered);
        $scope.EMPLOYEE_LIST = TOP_RECORD;
    };
    $scope.CLICK_SORT_ORDER = function (SOL) {
        $scope.SORT_ORDER_LIST.filter(function (x) { x.IS_ACTIVE = false });
        SOL.IS_ACTIVE = true;
        SOL.ASC = SOL.ASC ? false : true;
        $scope.SELECTED_SORT_ORDER = SOL;
        $scope.SORTBY($scope.SELECTED_SORT_ORDER.SORT_BY, SOL.ASC);
    }

    $scope.WORKING_TODAY_FY = function (SELECTED_HEADER_LIST) {
        $scope.WORKING_SHIFT_LIST = [];
        $scope.WORKING_SHIFT_LIST = SELECTED_HEADER_LIST.WORKING_SHIFT_LIST;
    }
    $scope.BACK_WORKING_FY = function () {
        $scope.WORKING_SHIFT_LIST = [];
    }
    $scope.PUBLISH_OVERLAP = function (OVER_LAP_SHIFT_LIST) {
        angular.forEach($scope.EMPLOYEE_LIST, function (List) {
            List.dayOfWeekNamesShort.filter(function (EM_shift) {
                EM_shift.IS_OVER_LAP = false;
                if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                    angular.forEach(EM_shift.TOTAL_SHIFT, function (Shift) {
                        var OVERLAPSHIFT = OVER_LAP_SHIFT_LIST.filter(function (y) { return y.SHIFT_ID == Shift.SHIFT_ID });
                        if (OVERLAPSHIFT.length > 0) {
                            Shift.IS_OVER_LAP = true;
                            EM_shift.IS_OVER_LAP = true
                        }
                        else {
                        }
                    })
                }
            })
        });
    }

    $scope.FILTER_RESET_SIDE = function () {
        $scope.SHIFT_STATUS.filter(function (x) { x.FILTER_SELECTED = false });
        $scope.SHIFT_TYPES.filter(function (x) { x.SELECTED = false });
        $scope.FILTER_SHIFT_STATUS();
    }
    $scope.FILTER_SHIFT_TYPE = function () {
        $scope.FILTER_COUNT = 0;
        angular.forEach($scope.SHIFT_TYPES, function (SHIFT_TYPE_SELECTED) {
            if (SHIFT_TYPE_SELECTED.SELECTED) {
                $scope.FILTER_COUNT++;
            }
            angular.forEach($scope.EMPLOYEE_LIST, function (List) {
                List.dayOfWeekNamesShort.filter(function (EM_shift) {
                    if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                        angular.forEach(EM_shift.TOTAL_SHIFT, function (x) {
                            if (x.SHIFT_TYPE_ID == SHIFT_TYPE_SELECTED.SHIFT_TYPE_ID) {
                                x.FILTER_SELECTED = !SHIFT_TYPE_SELECTED.SELECTED;
                            }
                        })

                    }
                })
            });
        });
    }
    $scope.FILTER_SHIFT_STATUS = function (CLICK_FLAG) {
        $scope.FILTER_COUNT = 0;
        $scope.$parent.PDF_DATA = [];
        angular.forEach($scope.SHIFT_STATUS, function (STATUS_SELECTED) {
            if (STATUS_SELECTED.FILTER_SELECTED) {
                $scope.FILTER_COUNT++;
                var List = $scope.SHIFTS_LIST_ALL.filter(x => x.STATUS_ID == STATUS_SELECTED.STATUS_ID);
                $scope.$parent.PDF_DATA = $scope.$parent.PDF_DATA.concat(List);
            }
            angular.forEach($scope.EMPLOYEE_LIST, function (List) {
                List.dayOfWeekNamesShort.filter(function (EM_shift) {
                    if (EM_shift.TOTAL_SHIFT != undefined && EM_shift.TOTAL_SHIFT.length > 0) {
                        angular.forEach(EM_shift.TOTAL_SHIFT, function (x) {
                            if (x.STATUS_ID == STATUS_SELECTED.STATUS_ID) {
                                var jj = $scope.SHIFT_TYPES.filter(function (y) { return y.SELECTED == true && x.SHIFT_TYPE_ID == y.SHIFT_TYPE_ID });
                                if (jj.length > 0) {
                                    x.FILTER_SELECTED = !STATUS_SELECTED.FILTER_SELECTED;
                                    x.STATUS_BORDER = STATUS_SELECTED.STATUS_BORDER;
                                }
                                else {
                                    x.FILTER_SELECTED = !STATUS_SELECTED.FILTER_SELECTED;
                                    x.STATUS_BORDER = STATUS_SELECTED.STATUS_BORDER;
                                }
                            }
                        })
                    }
                })
            });

        });
        if ($scope.FILTER_COUNT == 0) {
            $scope.$parent.PDF_DATA = [];
            $scope.$parent.PDF_DATA = $scope.SHIFTS_LIST_ALL;
        }
    }
    $scope.FILTER_OPEN_SHIFT_STATUS = function (CLICK_FLAG) {
        if ($scope.FILTER_SHIFT_LIST.length > 0) {
            $scope.SHIFTS_LIST_ALL = angular.copy($scope.FILTER_SHIFT_LIST);
        }
        else {
            $scope.SHIFTS_LIST_ALL = [];
            $scope.SHIFTS_LIST_ALL = angular.copy($scope.SHIFTS_LIST_ALL_TEMP);
        }
        $scope.EMPLOYEE_LIST = [];
        $scope.EMPLOYEE_LIST = angular.copy($scope.EMPLOYEE_LIST_TEMP);
    }

    $scope.$on('ngRepeatFinishedRender', function (ngRepeatFinishedEvent) {
        $scope.BRANCH_ID_UNIQUE = [];
        if ($scope.SHIFTS_LIST_ALL.length > 0) {
            angular.forEach($scope.EMPLOYEE_LIST, function (EMP) {
                for (var i = 0; i < EMP.dayOfWeekNamesShort.length; i++) {
                    var LIST = EMP.dayOfWeekNamesShort[i];
                    if (LIST.TOTAL_SHIFT != undefined && LIST.TOTAL_SHIFT.length > 0) {
                        angular.forEach(LIST.TOTAL_SHIFT, function (ALL_SHIFT) {
                            $scope.dayOfWeekNamesShort.filter(function (EMP_SHIFT) {
                                if (EMP_SHIFT.Days == LIST.Days) {
                                    EMP_SHIFT.DATEWISE_SHIFT_COUNT_WEB = ALL_SHIFT.DATEWISE_SHIFT_COUNT_WEB;
                                    EMP_SHIFT.DATEWISE_COST = ALL_SHIFT.DATEWISE_COST;
                                    EMP_SHIFT.DATEWISE_COST_WAGE = ALL_SHIFT.DATEWISE_COST_WAGE;

                                    EMP_SHIFT.DATEWISE_COST_WAGE_APP = ALL_SHIFT.DATEWISE_COST_WAGE_APP;
                                    EMP_SHIFT.DATEWISE_COST_WAGE_APP_EX_NO_SHOW = ALL_SHIFT.DATEWISE_COST_WAGE_APP_EX_NO_SHOW;

                                    EMP_SHIFT.BRANCH_DATEWISE_COST_WAGE = ALL_SHIFT.BRANCH_DATEWISE_COST;
                                    EMP_SHIFT.IS_LOCK = LIST.IS_LOCK ? false : true;
                                    if (EMP_SHIFT.IS_TIME_CAL == undefined) {
                                        EMP_SHIFT.IS_TIME_CAL = 1;
                                        EMP_SHIFT.DATEWISE_SHIFT_DURATION_IN_MIN = ALL_SHIFT.DATEWISE_SHIFT_DURATION_IN_MIN;
                                    }
                                    if (EMP_SHIFT.HEADER_SHOW_TOTAL_SHIFT == undefined) {
                                        EMP_SHIFT.HEADER_SHOW_TOTAL_SHIFT = [];
                                    }
                                    EMP_SHIFT.HEADER_SHOW_TOTAL_SHIFT.push(ALL_SHIFT);
                                }
                            });
                        });
                    }
                    else {
                        $scope.dayOfWeekNamesShort.filter(function (EMP_SHIFT) {
                            if (EMP_SHIFT.Days == LIST.Days) {
                                EMP_SHIFT.IS_LOCK = LIST.IS_LOCK ? false : true;
                            }
                        });
                    }
                };
            });
            $scope.PDF_DATA = $scope.SHIFTS_LIST_ALL;
            angular.forEach($scope.PDF_DATA, function (item) {
                if ($scope.LOGIN_LOGOUT_DETAILS.length > 0) {
                    var logn = $scope.LOGIN_LOGOUT_DETAILS.filter(function (x) { return x.SHIFT_ID == item.SHIFT_ID });
                    if (item.LOGIN_LOGOUT_DETAILS == undefined) {
                        item.LOGIN_LOGOUT_DETAILS = {};
                    }
                    if (logn.length > 0) {
                        item.LOGIN_LOGOUT_DETAILS = logn[0];
                    }
                }
                if ($scope.BRANCH_ID_UNIQUE.length == 0) {
                    $scope.BRANCH_ID_UNIQUE.push(item);
                };
                if ($scope.BRANCH_ID_UNIQUE.length > 0) {
                    var results = $scope.BRANCH_ID_UNIQUE.filter(function (x) { return x.BRANCH_ID == item.BRANCH_ID && x.Days == item.Days; })
                    if (results.length == 0) {
                        $scope.BRANCH_ID_UNIQUE.push(item);
                    }
                };
            });
            $scope.$parent.PDF_DATA = $scope.PDF_DATA;
            $scope.SHOW_HIDE_EMP_WAGE_CAST();
        }
        else {
            $scope.$parent.PDF_DATA = [];
            $scope.PDF_DATA = [];
            //$scope.dayOfWeekNamesShort.filter(function (EMP_SHIFT) {
            //    if (EMP_SHIFT.Days == LIST.Days) {
            //        EMP_SHIFT.IS_LOCK = LIST.IS_LOCK ? false : true;
            //    }
            //});

        }
        //$scope.BRANCH_LIST.filter(function (x) { x.IS_CHECK_BRH_SHIFT = true;})
        //$scope.SECTIONS_LIST.filter(function (x) { x.IS_CHECK_SECTION_SHIFT = true; });
    });

    $scope.LOAD_AFTER_WAGE = function () {
        //$scope.dayOfWeekNamesShort.filter(function (x) {
        //    x.WAGE_COST_VS_BUDGET = 0;
        //    x.WAGE_COST_VS_ACTUAL = 0;
        //    x.WAGE_COST_VS_FORECAST = 0;
        //    if (x.WAGE_COST_TOTAL > 0) {
        //        x.WAGE_COST_VS_BUDGET = (parseFloat(x.WAGE_COST_TOTAL) * 100) / parseFloat(x.BUDGET_REVENUE_TOTAL);
        //        x.WAGE_COST_VS_ACTUAL = (parseFloat(x.WAGE_COST_TOTAL) * 100) / parseFloat(x.ACTUAL_REVENUE_TOTAL);
        //        x.WAGE_COST_VS_FORECAST = (parseFloat(x.WAGE_COST_TOTAL) * 100) / parseFloat(x.FORECAST_REVENUE_TOTAL);

        //    }

        //    if (x.WAGE_COST_VS_BUDGET == "Infinity") {
        //        x.WAGE_COST_VS_BUDGET = 0;
        //    }
        //    if (x.WAGE_COST_VS_ACTUAL == "Infinity") {
        //        x.WAGE_COST_VS_ACTUAL = 0;
        //    }
        //    if (x.WAGE_COST_VS_FORECAST == "Infinity") {
        //        x.WAGE_COST_VS_FORECAST = 0;
        //    }
        //});


        angular.forEach($scope.dayOfWeekNamesShort, function (value) {
            value.WAGE_COST_VS_BUDGET = 0;
            value.WAGE_COST_VS_ACTUAL = 0;
            value.WAGE_COST_VS_FORECAST = 0;
            value.WAGE_COST_TOTAL = 0;
            var arr = $scope.WAGE_COST_LIST.filter(function (x) { return x.START_DATE == value.DateAsString })
            for (let i = 0; i < arr.length; i++) {
                value.WAGE_COST_TOTAL += arr[i].WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL == null ? 0 : arr[i].WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL;
            };

            if (value.WAGE_COST_VS_BUDGET == "Infinity") {
                value.WAGE_COST_VS_BUDGET = 0;
            }
            if (value.WAGE_COST_VS_ACTUAL == "Infinity") {
                value.WAGE_COST_VS_ACTUAL = 0;
            }
            if (value.WAGE_COST_VS_FORECAST == "Infinity") {
                value.WAGE_COST_VS_FORECAST = 0;
            }

            if (value.WAGE_COST_TOTAL > 0) {
                value.WAGE_COST_VS_BUDGET = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.BUDGET_REVENUE_TOTAL);
                value.WAGE_COST_VS_ACTUAL = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.ACTUAL_REVENUE_TOTAL);
                value.WAGE_COST_VS_FORECAST = (parseFloat(value.WAGE_COST_TOTAL) * 100) / parseFloat(value.FORECAST_REVENUE_TOTAL);
            }
            else {
                value.WAGE_COST_TOTAL = 0;
            }
        });


    }
    $scope.SHOW_HIDE_EMP_WAGE_CAST = function () {
        //$scope.BRANCH_ID_UNIQUE.filter(function (x) {
        //    if ($scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST) {
        //        x.BRANCH_DATEWISE_COST_WAGE = angular.copy(x.BRANCH_DATEWISE_COST_WAGE_EX_NO_SHOW);
        //    }
        //    else {
        //        x.BRANCH_DATEWISE_COST_WAGE = angular.copy(x.BRANCH_DATEWISE_COST_WAGE_APP);
        //    }
        //});
        if ($scope.WAGE_COST_LIST.length > 0) {
            $scope.WAGE_COST_LIST.filter(function (x) {
                if ($scope.Section_Week_Search.SHOW_HIDE_WAGE_CAST) {
                    x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL = angular.copy(x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL_EX_NO_SHOW);
                }
                else {
                    x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL = angular.copy(x.WAGE_COST_INCLUDING_HOLIDAY_ACCRUAL_APP);
                }
            });
            $scope.LOAD_AFTER_WAGE();
        }
    }
    $scope.ShowContextMenu = function (EMP, shift, CELL, VIEW_NAME) {
        $scope.SELECTED_EMPLOYEE = angular.copy(EMP);
        $scope.SELECTED_CELL = angular.copy(CELL);
        $scope.SELECTED_SHIFT = angular.copy(shift);
    }
    $scope.SHOW_AREA_ALL_DETIAL_FILTER_FY = function () {
        $scope.SHOW_ALL_DETIAL_FILTER = !$scope.SHOW_ALL_DETIAL_FILTER;
    }

    $scope.getTheFilesLoginUpload = function ($files) {
        var FileSize = 5;
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = 5;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {

            var validFormats = ['jpg', 'jpeg', 'png'];
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
                    angular.element("input[id='file-input']").val(null);
                    return;
                }
            }
            else {
                $scope.ShowAlert('Error', 'Not a valid file.', 5000);
                angular.element("input[id='file-input']").val(null);
                return;
            }
        }
        $scope.Files = $files;
        var fileUpload = document.getElementById('file-input');
        extension = fileUpload.files[0].name;
        $scope.uploadFilesLogin_Imag($scope.SELECTED_SHIFT);
    };
    $scope.uploadFilesLogin_Imag = function (FILE_TYPE) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("SHIFT_ID", $scope.SELECTED_SHIFT.SHIFT_ID);
            data.append("TABLE_ID", 0);
            data.append("USER_ID", parseInt($cookies.get("USERID")));
            data.append("EMP_PRS_ID", parseInt($scope.SELECTED_SHIFT.EMP_PRS_ID));
            data.append("ENTITY_ID", parseInt($cookies.get("ENTITY_ID")));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_HR_API() + "api/HrAPI/CLOCK_IN_CLOCK_OUT_IMAGE_UPLOAD",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                FILE_TYPE.IMAGE_PATH = d.data.FILE_PATH + '' + d.data.SERVER_FILE_NAME;
            });
        }
    };

    $scope.HIDE_SHOW_FILTER_FY = function () {
        $scope.HIDE_SHOW_HEADER_FILTER = !$scope.HIDE_SHOW_HEADER_FILTER;
    }
    $scope.HIDE_SHOW_REVENUE_FY = function () {
        $scope.REVENUE_SEARCH.HIDE_SHOW = $scope.REVENUE_SEARCH.HIDE_SHOW == true ? false : true;
    }

    if ($filter('lowercase')($location.absUrl()).indexOf("e_week_view") != -1) { $scope.HIDE_SHOW_HEADER_FILTER = true; $scope.SHOW_BTN = false; } else { $scope.SHOW_BTN = true; $scope.HIDE_SHOW_HEADER_FILTER = false; };
    $scope.$parent.SHIFT_STATUS.filter(function (x) { x.FILTER_SELECTED = false });
    $scope.SHIFT_TYPES.length > 0 ? $scope.SHIFT_TYPES.filter(function (x) { return x.SELECTED = false }) : '';

    $scope.$parent.TabActive(8);
    $scope.$parent.Schedulerchild = $scope;
    //=============================================================
    $scope.PRINT_PDF_BUDGETREVENUE = function () {

        $('#PRINT_BUDGETREVENUE').modal('hide');
        $scope.REVENUE_PDF_PRINT();

    };
    $scope.REVENUE_PDF_PRINT = function () {

        $scope.SELECTED_COLUMNS = [];

        $scope.SELECTED_ROWS = [];
        $scope.SELECTED_DATA = [];
        var doc = new jsPDF("l", "pt", "a4");
        var res = doc.autoTableHtmlToJson(document.getElementById("Revenue_PDF"));
        angular.forEach(res.columns, function (item) {
            item = item.trim().replace(/\n +/g, "");
            $scope.SELECTED_COLUMNS.push(item);
        });
        res.columns = $scope.SELECTED_COLUMNS;
        angular.forEach(res.data, function (items) {
            $scope.SELECTED_ROWS = [];
            angular.forEach(items, function (item) {
                item = item.trim().replace(/\n +/g, "");
                if ((items[0].trim() == "Wage Cost" || items[0].trim() == "Wage Cost vs Budget %" || items[0].trim() == "Wage Cost vs Forecast %" || items[0].trim() == "Wage Cost vs Actual %") && $scope.Section_Week_Search.COSE_PRIVILEGE == 0) {
                    $scope.SELECTED_ROWS.push(item.trim() == "Wage Cost" || item.trim() == "Wage Cost vs Budget %" || item.trim() == "Wage Cost vs Forecast %" || item.trim() == "Wage Cost vs Actual %" ? item : $scope.$parent.ASTRIC);
                }
                else {
                    if (item == "∞") {
                        $scope.SELECTED_ROWS.push(0.00);
                    }
                    else {
                        $scope.SELECTED_ROWS.push(item);
                    }
                }
            });
            $scope.SELECTED_DATA.push($scope.SELECTED_ROWS);
        });
        res.data = $scope.SELECTED_DATA;
        // doc.text($cookies.get("ENTITY_NAME") + "                      " + "Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 100, 30)
        doc.text($cookies.get("ENTITY_NAME") + " - " + "Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 150, 30);

        // doc.text("Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")", 200, 30)
        doc.autoTable(res.columns, res.data, {
            startY: false,
            margin: { horizontal: 10 },
            showHead: "everyPage",
            // theme: "striped",
            //theme: "grid",
            theme: "plain",
            tableWidth: 'auto',
            columnWidth: 'wrap',
            tableLineColor: 100,
            tableLineWidth: 0,

            columnStyles: {
                0: {
                    columnWidth: 'auto'
                },
                1: {
                    columnWidth: 'auto'
                },
                2: {
                    columnWidth: 'auto'
                },
                3: {
                    columnWidth: 'auto'
                },
                4: {
                    columnWidth: 'auto'
                },
                5: {
                    columnWidth: 'auto'
                },
                6: {
                    columnWidth: 'auto'
                },
                7: {
                    columnWidth: 'auto'
                },
                8: {
                    columnWidth: 'auto'
                }
            },
            headerStyles: {
                theme: 'grid',
                //fillColor: '#3f51b5',
                //textColor: '#fff',
            },
            styles: {
                overflow: 'linebreak',
                columnWidth: 'wrap',
                //font: getFontList().arial,
                fontSize: 8,
                cellPadding: 8,
                overflowColumns: 'linebreak',

            },
            didParseCell: function (row, res) {

                //if (res.row.raw[0].trim().length == 22) {
                //}
            },

            didDrawPage: function (data) {

                // Header
                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.text("Report", 10, 10);
                // Footer
                var str = "Page " + doc.internal.getNumberOfPages();
                doc.setFontSize(10);
                // jsPDF 1.4+ uses getWidth, <1.4 uses .width
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height
                    ? pageSize.height
                    : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);
            },
            drawRow: function (row, res) {

                //if (res.row.raw[0].trim().length == 16) {
                //    res.row.styles.fontSize = '15';
                //}
                // res.row.styles.fillColor = (0, 75, 109);
            },
            drawCell: function (row, res) {
                if (res.row.raw[0] == 'Revenue') {
                    doc.setFillColor(0, 75, 109);
                    doc.setTextColor(255, 255, 255);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                } if (res.row.raw[0] == 'Last Year') {
                    doc.setFillColor(244, 245, 246);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Last Week Sales') {
                    doc.setFillColor(244, 245, 246);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Budget Revenue') {
                    doc.setFillColor(225, 249, 219);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Forecast Revenue') {
                    doc.setFillColor(243, 248, 251);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Actual Revenue') {
                    doc.setFillColor(255, 235, 235);
                    // doc.setTextColor(128, 128, 128);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Target Cost') {
                    doc.setFillColor(255, 255, 255);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost') {
                    doc.setFillColor(255, 255, 255);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Budget %') {
                    doc.setFillColor(225, 249, 219);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Forecast %') {
                    doc.setFillColor(243, 248, 251);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
                if (res.row.raw[0] == 'Wage Cost vs Actual %') {
                    doc.setFillColor(255, 235, 235);
                    doc.setTextColor(0, 0, 0);
                    doc.setFontStyle('bold');
                    doc.setFontSize(11);
                }
            },
            createdHeaderCell: function (cell, res) {

                if (cell.raw != '') {
                    if (cell.raw.trim().split(':').length > 0) {
                        cell.styles.fontSize = 11;
                        cell.styles.fillColor = 250;
                        //cell.styles.columnWidth = "auto";
                        cell.styles.fontStyle = "bold";
                        cell.styles.rowHeight = 30.5;
                        cell.styles.textColor = 70;
                        cell.styles.theme = "grid";
                        cell.styles.halign = 'left';
                        cell.styles.valign = 'middle';

                    }
                    res.row.styles.fillColor = 245;
                    // res.row.styles.textColor = 120;
                }
            },
            createdCell: function (cell, res) {

                if (cell.raw != '') {
                    if (cell.raw.trim().split(':').length > 0) {
                        cell.styles.halign = 'left';
                        cell.styles.valign = 'middle';
                        cell.styles.fontSize = 10;

                        //cell.styles.fillColor = 250;
                        // cell.styles.columnWidth = "auto";
                        //cell.styles.fontStyle = "normal";
                        // cell.styles.rowHeight = 5;
                        //cell.styles.cellPadding = 5;
                        //cell.styles.lineWidth = 0.1;
                        //cell.styles.textColor = 70;
                        //  cell.styles.theme = "grid";
                    }

                    //if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                    //	cell.styles.fontSize = 16;
                    //	cell.styles.fillColor = 250;
                    //	res.row.styles.fillColor = 250;
                    //}
                }
                //if (cell.raw != '') {
                //    if (cell.raw.trim().split(':').length > 0 && cell.raw.trim().split(':')[0] == 'Date') {
                //        cell.styles.fontSize = 10;
                //        cell.styles.fillColor = 250;
                //        res.row.styles.fillColor = 250;

                //        cell.styles.cellPadding = 12;
                //        cell.styles.textColor = [255, 0, 0];
                //    }
                //}
            },
            drawHeaderRow: function (row, res) {
                if (res.pageCount > 1) {
                    return false;
                }
            }
        });
        doc.save("Budget_Revenue - (" + (new Date($scope.SHIFT_CELDER_START_DATE)).toDateString() + "-" + (new Date($scope.SHIFT_CELDER_END_DATE)).toDateString() + ")_" + $cookies.get("ENTITY_ID").toString() + ".pdf");

    }

});
app.controller('RotaLockViewController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage, $interval) {
    $scope.COMMON_CODE_CHANGE();
    $scope.goBack = function () {
        window.history.back();
    }
    $scope.LOCK_DATES_LIST = [];
    $scope.SearchRotaLock = {
        START_DATE: '',
        END_DATE: '',
        END_DATE: '',
        PAGE_NO: 1,
        PAGE_SIZE: 10,
        IS_UNLOCK: $scope.$parent.CheckSubModuleAccess(121),
    }
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }
    var weekpicker, start_date, end_date;
    $scope.dayOfWeekNamesShort = [{ ID: 1, NAME: "Mon", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 2, NAME: "Tue", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 3, NAME: "Wed", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 4, NAME: "Thu", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 5, NAME: "Fri", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 6, NAME: "Sat", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }, { ID: 7, NAME: "Sun", DATEWISE_SHIFT_DURATION_IN_MIN: 0 }];


    function set_week_picker(date, FLAG) {
        $scope.overlay_loading_rota = 'block';
        var count = 0;
        start_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay());
        end_date = new Date(date.getFullYear(), date.getMonth(), parseInt($scope.START_DAY_OF_WEEK) + date.getDate() - date.getDay() + 6);
        if (start_date > date) {
            if (FLAG == 1) {
                var increasedays = start_date.getDate() - date.getDate();
                start_date = new Date(date.getFullYear(), date.getMonth(), start_date.getDate() - ((7 - increasedays) + increasedays));
                end_date = new Date(start_date).addDays(6);
            }
        }
        weekpicker.datepicker('update', start_date);
        $scope.$parent.SHIFT_CELDER_START_DATE = start_date;
        $scope.$parent.SHIFT_CELDER_END_DATE = end_date;
        $scope.ROTA_GET_EMP_SHIFTS_FOR_APPROVAL();
        var StartDD = start_date.getDate();
        var Startmm = start_date.getMonth() + 1;
        var start_dateyyyy = start_date.getFullYear();
        var EndDD = end_date.getDate();
        var Endmm = end_date.getMonth() + 1;
        var Endyyyy = end_date.getFullYear();

        if (StartDD < 10) { StartDD = '0' + StartDD; }
        if (Startmm < 10) { Startmm = '0' + Startmm; }
        var start_dateddmmyy = StartDD + '/' + Startmm + '/' + start_dateyyyy;
        if (EndDD < 10) { EndDD = '0' + EndDD; }
        if (Endmm < 10) { Endmm = '0' + Endmm; }
        var end_dateddmmyy = EndDD + '/' + Endmm + '/' + Endyyyy;
        weekpicker.val(start_dateddmmyy + ' - ' + end_dateddmmyy);
        var STARTDATE = new Date(start_date);

        $scope.dayOfWeekNamesShort = [];
        if ($scope.$parent.WEEK_OFF_DAY.split(',').length > 0 && LeaveDays.length == 0) {
            LeaveDays = $scope.$parent.WEEK_OFF_DAY.split(',');
        }
        for (var i = 0; i < $scope.ROTA_DAYS_LENGTH; i++) {
            var NextWeekObj = new Object();
            NextWeekObj.NewDate = STARTDATE.addDays(i);
            NextWeekObj.Days = NextWeekObj.NewDate.getDate();
            NextWeekObj.DATEWISE_SHIFT_DURATION_IN_MIN = 0
            if (LeaveDays.length > 0) {
                var List = LeaveDays.filter(function (x) { return x == moment(NextWeekObj.NewDate).day() });
                if (List.length > 0) {
                    NextWeekObj.OFF_DAY = true;
                }
            }
            NextWeekObj.DateAsString = $filter('date')(NextWeekObj.NewDate, "yyyy-MM-dd") + 'T00:00:00';
            NextWeekObj.WAGE_COST_VS_BUDGET = 0;
            NextWeekObj.WAGE_COST_VS_ACTUAL = 0;
            NextWeekObj.WAGE_COST_VS_FORECAST = 0;
            $scope.dayOfWeekNamesShort.push(NextWeekObj);
        }
    };
    $scope.DATE_WEEK_PICKER = function (date) {
        var ModelObj = new Object();
        ModelObj.TIMEZONE_OFFSET = $cookies.get("TIMEZONE_OFFSET");
        ModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        ModelObj.EMP_PRS_ID = parseInt($cookies.get("EMPLOYEE_ID"));
        PrcCommMethods.HR_API(ModelObj, 'GET_UTC_TIME_HR_GET_EMP_BRANCH').then(function (data) {
            $scope.Rota_Approval_Search.FILTER_BRANCH_ID = '';
            $scope.Rota_Approval_Search.FILTER_SECTION_ID = '';
            if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                $scope.Rota_Approval_Search.BRANCH_FILTER_EMP_IDS = data.data.CustomTable1[0].BRANCH_ID;
                $scope.Rota_Approval_Search.BRANCH_FILTER_SHIFT_IDS = data.data.CustomTable1[0].BRANCH_ID;

                $scope.Rota_Approval_Search.DEPARTMENT_EMP_IDS = data.data.CustomTable1[0].DEPARTMENT_ID;
                $scope.Rota_Approval_Search.DEPARTMENT_SHIFT_IDS = data.data.CustomTable1[0].DEPARTMENT_ID;

            };
            if ($scope.$parent.SHIFT_CELDER_START_DATE == undefined) {
                $scope.DATEPICKERDATE_FY(new Date(data.data.UTC_TIME[0].UTC_TIME))
            }
            else {
                $scope.DATEPICKERDATE_FY(new Date($scope.$parent.SHIFT_CELDER_START_DATE))
            };

            $scope.TODAY_DAY = new Date(data.data.UTC_TIME[0].UTC_TIME).getDate();
            $scope.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();
            $scope.$parent.TODAY_DATE = new Date(data.data.UTC_TIME[0].UTC_TIME).toISOString();

            var today = new Date(data.data.UTC_TIME[0].UTC_TIME)
            today.setHours(0, 0, 0, 0);

            $scope.ONLY_TODAY_DATE = today;
            if (data.data.CustomTable1.length > 0 && $scope.$parent.SETTING_VALUE_26 == 1 && !$scope.IS_EMPLOYEE) {
                $scope.COMMON_EMP_BRANCH_LOAD();
                $scope.COMMON_SHIFT_BRANCH_LOAD();

                $scope.COMMON_EMP_DEPARTMENT_LOAD();
                $scope.COMMON_SHIFT_DEPARTMENT_LOAD();
            } else {
                if ($scope.BRANCH_LIST.length > 0) { angular.forEach($scope.BRANCH_LIST, function (x) { x.IS_CHECK_BRH_SHIFT = true; }); };
                if ($scope.SECTIONS_LIST != undefined && $scope.SECTIONS_LIST.length > 0) { angular.forEach($scope.SECTIONS_LIST, function (x) { x.IS_CHECK_SECTION_SHIFT = true; }); };
            }
        });
    };
    $scope.DATEPICKERDATE_FY = function (date) {

        weekpicker = $('.week-picker');
        weekpicker.datepicker({
            weekStart: parseInt($scope.START_DAY_OF_WEEK),
            autoclose: true,
            forceParse: false,
            container: '#week-picker-wrapper',
            todayHighlight: true
        }).on("changeDate", function (e) {
            set_week_picker(e.date);
        });
        $('.week-prev').on('click', function () {
            var prev = new Date(start_date.getTime());
            prev.setDate(prev.getDate() - 6);
            set_week_picker(prev);
        });
        $('.week-next').on('click', function () {
            var next = new Date(end_date.getTime());
            next.setDate(next.getDate() + 1);
            set_week_picker(next);
        });
        set_week_picker(date, 1);
    }

    $scope.LAZY_LOAD_GET_LOCK_DATES = function () {
        $scope.ROTA_GET_LOCK_DATES();
    }


    $scope.ROTA_GET_LOCK_DATES = function (FLAG) {
        if (FLAG == 1) {
            $scope.LOCK_DATES_LIST = [];
            $scope.SearchRotaLock.PAGE_NO = 1;
            $scope.PosiModelObj_Dir_Copy = "";
        }
        $scope.overlay_loading_rota = 'block';
        var PosiModelObj = new Object();
        PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
        PosiModelObj.START_DATE = new Date($scope.SearchRotaLock.START_DATE).toDateString();
        PosiModelObj.END_DATE = new Date($scope.SearchRotaLock.END_DATE).toDateString();
        PosiModelObj.PAGE_NO = $scope.SearchRotaLock.PAGE_NO;
        PosiModelObj.PAGE_SIZE = $scope.SearchRotaLock.PAGE_SIZE;
        if (FLAG == 1) {
            $scope.PosiModelObj_Dir_Copy = angular.copy(PosiModelObj);
        }
        else {
            $scope.PosiModelObj_Dir_Copy.PAGE_NO = FLAG == undefined ? angular.copy($scope.SearchRotaLock.PAGE_NO) : $scope.PosiModelObj_Dir_Copy.PAGE_NO;
        }
        PrcCommMethods.HR_API(PosiModelObj, 'ROTA_GET_LOCK_DATES').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.LOCK_DATES_LIST = $scope.LOCK_DATES_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.SearchRotaLock.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.SearchRotaLock.PAGE_NO = parseInt($scope.SearchRotaLock.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            }
            else {
                if ($scope.LOCK_DATES_LIST.length == 0) {
                }
                $scope.GetData = false;
            }
            $scope.overlay_loading_rota = 'none';
        });
    }


    $scope.RESET_ROTA_LOCK = function () {
        $scope.SearchRotaLock.LOCK_START_DATE = "";
        $scope.SearchRotaLock.LOCK_END_DATE = "";
        $scope.SearchRotaLock.LOCK_COMMENTS = "";
        $scope.OVERLAP_DATES_LIST = [];
        $scope.LockForm.submitted = false;

    }
    $scope.UNLOCK_POP = function (LINE) {
        $scope.SELECTED_LOCK_LINE = LINE
        $('#Unlock_Rota').modal('show')
    }
    $scope.RESET_ROTA_UNLOCK = function () {
        $scope.SearchRotaLock.UNLOCK_COMMENTS = "";
        $scope.UnLockForm.submitted = false;
    };
    $scope.OVERLAP_DATES_LIST = [];
    $scope.ROTA_LOCK = function () {
        $scope.LockForm.submitted = true;
        var count = 0;
        if (new Date($scope.SearchRotaLock.LOCK_END_DATE) < new Date($scope.SearchRotaLock.LOCK_START_DATE)) {
            count = 1;
            $scope.$parent.ShowAlert("Error", "The start date must be earlier than the end date.", 3000);
            $scope.LockForm.submitted = false;
        }
        if ($scope.LockForm.$valid && count == 0) {
            if (confirm('Are you sure?')) {
                $scope.overlay_loading_rota = 'block';
                var PosiModelObj = new Object();
                PosiModelObj.ENTITY_ID = parseInt($cookies.get("ENTITY_ID"));
                PosiModelObj.START_DATE = new Date($scope.SearchRotaLock.LOCK_START_DATE).toDateString();
                PosiModelObj.END_DATE = new Date($scope.SearchRotaLock.LOCK_END_DATE).toDateString();
                PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PosiModelObj.COMMENTS = $scope.SearchRotaLock.LOCK_COMMENTS;
                PrcCommMethods.HR_API(PosiModelObj, 'ROTA_LOCK').then(function (data) {
                    if (data.data.Table.length > 0) {
                        if (data.data.Table[0].TABLE_ID > 0 && data.data.Table[0].ENTITY_ID == undefined) {
                            $scope.$parent.ShowAlert("Success", "locked Successfully", 3000);
                            $('#lock_comments').modal('hide');
                            $scope.RESET_ROTA_LOCK();
                            $scope.ROTA_GET_LOCK_DATES(1);
                        }
                        else {
                            $scope.OVERLAP_DATES_LIST = data.data.Table;
                            $scope.$parent.ShowAlert("Warning", "Date overlap", 3000);
                        }
                    }
                    $scope.overlay_loading_rota = 'none';
                });
            }
        }
    }
    $scope.ROTA_UNLOCK = function () {
        $scope.UnLockForm.submitted = true;
        if ($scope.UnLockForm.$valid) {
            if (confirm('Are you sure?')) {
                $scope.overlay_loading_rota = 'block';
                var PosiModelObj = new Object();
                PosiModelObj.TABLE_ID = $scope.SELECTED_LOCK_LINE.TABLE_ID;
                PosiModelObj.USER_ID = parseInt($cookies.get("USERID"));
                PosiModelObj.COMMENTS = $scope.SearchRotaLock.UNLOCK_COMMENTS;
                PrcCommMethods.HR_API(PosiModelObj, 'ROTA_UNLOCK').then(function (data) {
                    if (data.data == 1) {
                        $scope.RESET_ROTA_UNLOCK();
                        $scope.ROTA_GET_LOCK_DATES(1);
                        $scope.$parent.ShowAlert("Success", "Unlock Successfully", 3000);
                        $('#Unlock_Rota').modal('hide')
                    }
                    if (data.data == 0) {
                        $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                    }
                    $scope.overlay_loading_rota = 'none';
                });
            }
        }
    }

    function reportrange(start, end) {
        $scope.SearchRotaLock.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.SearchRotaLock.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $scope.RESET_ROTA_GET_LOCK_DATES = function () {
        $scope.PAGE_LOAD_FY(1);
    }
    $scope.PAGE_LOAD_FY = function (FLAG) {
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.SearchRotaLock.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.SearchRotaLock.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.ROTA_GET_LOCK_DATES(FLAG);
    }

    $scope.PAGE_LOAD_FY(1);
    $scope.$parent.dateinputOpenDate();
});
app.controller('RevenuesUploadesController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.RevenuesSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        SALES_FILE_PATH: '',
        SALES_SERVER_FILE_NAME: '',
        SALES_ORIGINAL_FILE_NAME: '',
        FORECAST_REVENUE_1: 0,
        FORECAST_REVENUE_2: 0,
        FORECAST_REVENUE_3: 0,
        FORECAST_REVENUE_4: 0,
        FORECAST_REVENUE_5: 0,
        FORECAST_REVENUE_5: 0,
        FORECAST_REVENUE_6: 0,
        FORECAST_REVENUE_7: 0,
    }
    $scope.TAB_FLAG = 1;
    $scope.BRANCH_LIST = [];
    $scope.DAILY_SALES_LIST = [];
    $scope.DAILY_BUDGET_LIST = [];
    $scope.DAILY_FORCAST_LIST = [];
    $scope.SALES_CODE_ARRY = [];
    $scope.COMMON_CODE_CHANGE();
    $scope.DAILY_SALES_TYPE = [{ ID: 1, COLUMN_NAME: 'DATE', MATCH_COLUMN_NAME: 'DATE', IS_MANDATORY: true, HEADER_NAME: 'DATE', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'NET_REVENUE', MATCH_COLUMN_NAME: 'NET_REVENUE', IS_MANDATORY: true, HEADER_NAME: 'NET_REVENUE', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];

    $scope.BRANCH_BUDGETS_TYPE = [{ ID: 1, COLUMN_NAME: 'BUDGET_DATE', MATCH_COLUMN_NAME: 'Date', IS_MANDATORY: true, HEADER_NAME: 'Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'BUDGET_CATEGORY', MATCH_COLUMN_NAME: 'Category', IS_MANDATORY: false, HEADER_NAME: 'Category', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 3, COLUMN_NAME: 'BUDGET', MATCH_COLUMN_NAME: 'Budget', IS_MANDATORY: true, HEADER_NAME: 'Budget', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 4, COLUMN_NAME: 'COVERS', MATCH_COLUMN_NAME: 'Covers', IS_MANDATORY: false, HEADER_NAME: 'Covers', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];

    $scope.BRANCH_FORECAST_TYPE = [{ ID: 1, COLUMN_NAME: 'BUDGET_DATE', MATCH_COLUMN_NAME: 'Date', IS_MANDATORY: true, HEADER_NAME: 'Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'BUDGET_CATEGORY', MATCH_COLUMN_NAME: 'Category', IS_MANDATORY: false, HEADER_NAME: 'Category', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: false },
    { ID: 3, COLUMN_NAME: 'BUDGET', MATCH_COLUMN_NAME: 'Forecast', IS_MANDATORY: true, HEADER_NAME: 'Forecast', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 4, COLUMN_NAME: 'COVERS', MATCH_COLUMN_NAME: 'Covers', IS_MANDATORY: false, HEADER_NAME: 'Covers', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: false }];


    $scope.GET_THE_FILES_TO_UPLOAD_REVENUES = function ($files, FileSize, List, index, UPLOAD_ID_NAME, LOGO_UPLOADED_BY) {
        if (FileSize == undefined || FileSize == null || FileSize == 0 || FileSize == '') {
            FileSize = AppVal.FileSize;
        }
        $scope.imagesrc = [];
        var valid = 0;
        for (var i = 0; i < $files.length; i++) {
            var validFormats = ['doc', 'docx', 'xml', 'pdf', 'csv', 'txt', 'text', 'jpg', 'jpeg', 'png', 'MPEG4', 'MP4', 'video/mp4', 'excel', 'sheet'];
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
        if (UPLOAD_ID_NAME == undefined) {
            extension = $scope.Files[0].name;
        }
        else {
            var fileUpload = document.getElementById(UPLOAD_ID_NAME + index);
            extension = fileUpload.files[0].name;
        }
        $scope.UPLOAD_FILES_ALL(1, '', extension, List, index, LOGO_UPLOADED_BY);
    };
    $scope.UPLOAD_FILES_ALL = function (Attachment_UPLOAD_TYPE_ID, ATTACHEMENT_TYPE_ID, filename, List, index, LOGO_UPLOADED_BY) {
        if (($scope.Files != undefined && $scope.Files.length > 0)) {
            $scope.DocImageResult = [];
            var data = new FormData();
            data.append("RelativeID", 1);
            data.append("UPLOAD_TYPE_ID", 1);
            if (LOGO_UPLOADED_BY == 'SALES') {
                data.append("VIRTUALPATH", '/SALES/');
                data.append("FLAG", 1);
            }
            else if (LOGO_UPLOADED_BY == 'BUDGET') {
                data.append("VIRTUALPATH", '/BUDGET/');
                data.append("FLAG", 1);
            }
            else if (LOGO_UPLOADED_BY == 'FORCAST') {
                data.append("VIRTUALPATH", '/FORECAST/');
                data.append("FLAG", 1);
            };
            data.append("UPLOAD_ID", 0);
            data.append("ORIGINAL_FILE_NAME", filename);
            data.append("USER_ID", $scope.IS_PLAIN ? 0 : parseInt($cookies.get("USERID")));
            for (var i in $scope.Files) {
                data.append("uploadedFile", $scope.Files[i]);
            }
            var request = {
                method: 'POST',
                url: CommService.Get_CASHUP_API() + "api/CashupAPI/ONLY_FILES_UPLOAD",
                data: data,
                headers: {
                    'Content-Type': undefined
                }
            };
            $http(request).then(function (d) {
                if (List != undefined) {
                    $scope.RevenuesSearch.LOGO_UPLOADED_BY = LOGO_UPLOADED_BY;
                    if (LOGO_UPLOADED_BY == 'SALES') {
                        $scope.RevenuesSearch.SALES_FILE_PATH = d.data.FILE_PATH
                        $scope.RevenuesSearch.SALES_SERVER_FILE_NAME = d.data.SERVER_FILE_NAME;
                        $scope.RevenuesSearch.SALES_ORIGINAL_FILE_NAME = d.data.ORIGINAL_FILE_NAME;
                        $scope.GET_OPENXML_UPLOAD_SCHEDULE_REVENUES();
                        $scope.TAB_FLAG = 1;
                    }
                    else if (LOGO_UPLOADED_BY == 'BUDGET') {
                        $scope.RevenuesSearch.BUDGET_FILE_PATH = d.data.FILE_PATH
                        $scope.RevenuesSearch.BUDGET_SERVER_FILE_NAME = d.data.SERVER_FILE_NAME;
                        $scope.RevenuesSearch.BUDGET_ORIGINAL_FILE_NAME = d.data.ORIGINAL_FILE_NAME;
                        $scope.GET_OPENXML_UPLOAD_SCHEDULE_REVENUES();
                        $scope.TAB_FLAG = 2;
                    }
                    else if (LOGO_UPLOADED_BY == 'FORCAST') {
                        $scope.RevenuesSearch.FORCAST_FILE_PATH = d.data.FILE_PATH
                        $scope.RevenuesSearch.FORCAST_SERVER_FILE_NAME = d.data.SERVER_FILE_NAME;
                        $scope.RevenuesSearch.FORCAST_ORIGINAL_FILE_NAME = d.data.ORIGINAL_FILE_NAME;
                        $scope.GET_OPENXML_UPLOAD_SCHEDULE_REVENUES();
                        $scope.TAB_FLAG = 3;
                    };
                }
            });
        }
    };

    $scope.REDIRECTION = function (FLAG, NAME) {
        if (NAME == "SALES") {
            $location.path('Daily').search('FLAG', FLAG);
        }
        else if (NAME == "BUDGET") {
            $location.path('Budget').search('FLAG', FLAG);
        }
        else if (NAME == "FORECAST") {
            $location.path('Forecast').search('FLAG', FLAG);
        }
    };
    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {
        $scope.TAB_FLAG = TAB_FLAG;
    }
    $scope.GET_OPENXML_UPLOAD_SCHEDULE_REVENUES = function () {
        ModelObj = new Object();
        ModelObj.SEPARATOR = ":;:";
        ModelObj.DATETIME_FORMAT = $scope.$parent.DATE_FORMATE_LABEL_DD_MM_YYYY;
        ModelObj.DATETIME_FORMAT_CULTURE = $scope.$parent.DATE_FORMATE_CULTURE;
        ModelObj.LANGUAGE_SYMBOL = $scope.$parent.LANGUAGE_SYMBOL;
        if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'SALES') {
            ModelObj.ACTUALFILEPATH = $scope.RevenuesSearch.SALES_FILE_PATH + $scope.RevenuesSearch.SALES_SERVER_FILE_NAME;
            ModelObj.FILE_PATH = $scope.RevenuesSearch.SALES_FILE_PATH;
            ModelObj.SERVER_FILE_NAME = $scope.RevenuesSearch.SALES_SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.RevenuesSearch.SALES_ORIGINAL_FILE_NAME;
            ModelObj.DAILY_SALES = $scope.DAILY_SALES_TYPE;
        }
        else if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'BUDGET') {
            ModelObj.ACTUALFILEPATH = $scope.RevenuesSearch.BUDGET_FILE_PATH + $scope.RevenuesSearch.BUDGET_SERVER_FILE_NAME;
            ModelObj.FILE_PATH = $scope.RevenuesSearch.BUDGET_FILE_PATH;
            ModelObj.SERVER_FILE_NAME = $scope.RevenuesSearch.BUDGET_SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.RevenuesSearch.BUDGET_ORIGINAL_FILE_NAME;
            ModelObj.DAILY_SALES = $scope.BRANCH_BUDGETS_TYPE;
        }
        else if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'FORCAST') {
            ModelObj.ACTUALFILEPATH = $scope.RevenuesSearch.FORCAST_FILE_PATH + $scope.RevenuesSearch.FORCAST_SERVER_FILE_NAME;
            ModelObj.FILE_PATH = $scope.RevenuesSearch.FORCAST_FILE_PATH;
            ModelObj.SERVER_FILE_NAME = $scope.RevenuesSearch.FORCAST_SERVER_FILE_NAME;
            ModelObj.ORIGINAL_FILE_NAME = $scope.RevenuesSearch.FORCAST_ORIGINAL_FILE_NAME;
            ModelObj.DAILY_SALES = $scope.BRANCH_FORECAST_TYPE;
        };
        PrcCommMethods.HR_API(ModelObj, 'GET_OPENXML_UPLOAD_SCHEDULE_REVENUES').then(function (data) {

            if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'SALES') {
                $scope.SALES_AFTER_FILE_UPLOAD(data);
            }
            else if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'BUDGET') {
                //$scope.DAILY_BUDGET_LIST = data.data;
                $scope.BUDGET_AFTER_FILE_UPLOAD(data);
            }
            else if ($scope.RevenuesSearch.LOGO_UPLOADED_BY == 'FORCAST') {
                //$scope.DAILY_FORCAST_LIST = data.data;
                $scope.FORCAST_AFTER_FILE_UPLOAD(data);
            };
        });
    };
    $scope.DOWNLOAD_OPENXML_UPLOAD = function (UPLOADED_BY) {
        ModelObj = new Object();
        if (UPLOADED_BY == 'SALES') {
            ModelObj.FILE_NAME = "SALES";
            ModelObj.FILE_PATH = "SALES";
            ModelObj.EXCEL_DATATABLE = $scope.DAILY_SALES_TYPE;
            ModelObj.UPLOADE_TYPE_ID = 1;
        }

        else if (UPLOADED_BY == 'BUDGET') {
            ModelObj.FILE_NAME = "BUDGET";
            ModelObj.FILE_PATH = "BUDGET";
            ModelObj.EXCEL_DATATABLE = $scope.BRANCH_BUDGETS_TYPE;
            ModelObj.UPLOADE_TYPE_ID = 2;
        }
        else if (UPLOADED_BY == 'FORCAST') {
            ModelObj.FILE_NAME = "FORECAST";
            ModelObj.FILE_PATH = "FORECAST";
            ModelObj.EXCEL_DATATABLE = $scope.BRANCH_FORECAST_TYPE;
            ModelObj.UPLOADE_TYPE_ID = 3;
        };
        PrcCommMethods.HR_API(ModelObj, 'DOWNLOAD_OPENXML_UPLOAD').then(function (data) {
            $scope.SERVER_FILE_PATH = '/' + data.data.FOLDER_NAME + data.data.RETURN_FILE_NAME;
            $scope.FILE_NAME = ModelObj.FILE_NAME;
            window.location.href = $scope.SERVER_FILE_PATH;
        });

    }

    $scope.SALES_AFTER_FILE_UPLOAD = function (data) {
        if (data.data == null) {
            // $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
        }
        else {
            $scope.Uploading = false;
            $scope.submitted = true;
            $scope.DAILY_SALES_LIST = data.data.HEADER_CLOUMN_NAMES.filter(function (x) { return x.DATE = new Date(x.DATE) });
            $scope.SALES_CODE_ARRY = data.data.EXCEL_TO_BUG_TABLE;
            $scope.IS_SALES_VALID_UPLOAD_FILE = true;
            if (data.data.IS_VALID_COUNT > 0) {
                $scope.SALES_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.IS_SALES_VALID_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.SALES_INVALID_EXCLE_CELL_FLAG = true;
                /// $('#View_Report').modal('show');
            }
            else if (data.data.error == "CODE0001") {
                $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                $scope.submitted = false;
                $scope.IS_SALES_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.error == "CODE0003") {
                $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                $scope.submitted = false;
                $scope.IS_SALES_VALID_UPLOAD_FILE = false;
                if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                    $scope.Message = "";
                    var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                    $scope.SALES_CODE_ARRY.push(List);
                    $scope.SALES_COPY_CODE_ARRY.push(List);
                };
            }
            else if (data.data.error == "CODE0002") {
                $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                $scope.submitted = false;
                $scope.IS_SALES_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                $scope.submitted = false;
                $scope.IS_SALES_VALID_UPLOAD_FILE = false;
            }
            else {
                $scope.INVALID_EXCLE_CELL_FLAG = false;
                $scope.SALES_UPLOAD_TAB = true;
                $scope.SALES_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.$parent.ShowAlert('Success', 'File validated successfully, please click on Upload', 5000);
            }
            //if ($scope.IS_VALID_UPLOAD_FILE == true) {
            //    $scope.TAB_BANK_FLAG = 2;
            //}
        }
    }
    $scope.BUDGET_AFTER_FILE_UPLOAD = function (data) {
        if (data.data == null) {
            // $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
        }
        else {
            $scope.Uploading = false;
            $scope.submitted = true;
            $scope.DAILY_BUDGET_LIST = data.data.HEADER_CLOUMN_NAMES.filter(function (x) { return x.BUDGET_DATE = new Date(x.BUDGET_DATE) });
            //data.data.HEADER_CLOUMN_NAMES;
            $scope.BUDGET_CODE_ARRY = data.data.EXCEL_TO_BUG_TABLE;

            $scope.IS_BUDGET_VALID_UPLOAD_FILE = true;
            if (data.data.IS_VALID_COUNT > 0) {
                $scope.BUDGET_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.IS_BUDGET_VALID_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.BUDGET_INVALID_EXCLE_CELL_FLAG = true;
                //$('#View_Report').modal('show');
            }
            else if (data.data.error == "CODE0001") {
                $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                $scope.submitted = false;
                $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.error == "CODE0003") {
                $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                $scope.submitted = false;
                $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
                if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                    $scope.Message = "";
                    var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                    $scope.BUDGET_CODE_ARRY.push(List);
                    $scope.BUDGET_COPY_CODE_ARRY.push(List);
                };
            }
            else if (data.data.error == "CODE0002") {
                $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                $scope.submitted = false;
                $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                $scope.submitted = false;
                $scope.IS_BUDGET_VALID_UPLOAD_FILE = false;
            }
            else {
                $scope.INVALID_EXCLE_CELL_FLAG = false;
                $scope.BUDGET_UPLOAD_TAB = true;
                $scope.BUDGET_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.$parent.ShowAlert('Success', 'File validated successfully, please click on Upload', 5000);
            }
            //if ($scope.IS_VALID_UPLOAD_FILE == true) {
            //    $scope.TAB_BANK_FLAG = 2;
            //}
        }
    }
    $scope.FORCAST_AFTER_FILE_UPLOAD = function (data) {
        if (data.data == null) {
            // $scope.$parent.ShowAlert('Warning', "We found some changes in file, please validate uploaded file with support team", 30000);
        }
        else {
            $scope.Uploading = false;
            $scope.submitted = true;
            $scope.DAILY_FORCAST_LIST = data.data.HEADER_CLOUMN_NAMES.filter(function (x) { return x.BUDGET_DATE = new Date(x.BUDGET_DATE) });
            //data.data.HEADER_CLOUMN_NAMES;
            $scope.FORCAST_CODE_ARRY = data.data.EXCEL_TO_BUG_TABLE;
            $scope.IS_FORCAST_VALID_UPLOAD_FILE = true;
            if (data.data.IS_VALID_COUNT > 0) {
                $scope.FORCAST_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.IS_FORCAST_VALID_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.FORCAST_INVALID_EXCLE_CELL_FLAG = true;
                // $('#View_Report').modal('show');
            }
            else if (data.data.error == "CODE0001") {
                $scope.$parent.ShowAlert('Warning', 'No changes found in uploaded Excel', 3000);
                $scope.submitted = false;
                $scope.IS_FORCAST_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.error == "CODE0003") {
                $scope.$parent.ShowAlert('Warning', 'Some thing worng in excel or Enable editing mode in excel', 3000);
                $scope.submitted = false;
                $scope.IS_FORCAST_VALID_UPLOAD_FILE = false;
                if (data.data.Msg == 'A malformed URI was found in the document. Please provide a OpenSettings.RelationshipErrorRewriter to handle these errors while opening a package.') {
                    $scope.Message = "";
                    var List = { DISPLAY_TEXT: "", IS_VALID: false, IS_DATA_VALID: true, CODE: "CODE0003" };
                    $scope.FORCAST_CODE_ARRY.push(List);
                    $scope.FORCAST_COPY_CODE_ARRY.push(List);
                };
            }
            else if (data.data.error == "CODE0002") {
                $scope.$parent.ShowAlert('Warning', 'Invalid Excel,either the column header is deleted or mismatch', 3000);
                $scope.submitted = false;
                $scope.IS_FORCAST_VALID_UPLOAD_FILE = false;
            }
            else if (data.data.HEADER_CLOUMN_NAMES.length == 0) {
                $scope.$parent.ShowAlert('Warning', 'No record found', 3000);
                $scope.submitted = false;
                $scope.IS_FORCAST_VALID_UPLOAD_FILE = false;
            }
            else {
                $scope.INVALID_EXCLE_CELL_FLAG = false;
                $scope.FORCAST_UPLOAD_TAB = true;
                $scope.FORCAST_INVALID_EXCLE_CELL_COUNT = parseInt(data.data.IS_VALID_COUNT);
                $scope.$parent.ShowAlert('Success', 'File validated successfully, please click on Upload', 5000);
            }
            //if ($scope.IS_VALID_UPLOAD_FILE == true) {
            //    $scope.TAB_BANK_FLAG = 2;
            //}
        }
    }

    $scope.RESET_SALES = function () {
        angular.element("input[id='uploadExcel1']").val(null);
        $scope.DAILY_SALES_LIST = [];
        $scope.SALES_CODE_ARRY = [];
    }
    $scope.RESET_BUDGET = function () {
        angular.element("input[id='uploadExcel2']").val(null);
        $scope.DAILY_BUDGET_LIST = [];
        $scope.BUDGET_CODE_ARRY = [];
    }
    $scope.RESET_FORCAST = function () {
        angular.element("input[id='uploadExcel3']").val(null);
        $scope.DAILY_FORCAST_LIST = [];
        $scope.FORCAST_CODE_ARRY = [];
    }

    $scope.INS_UPD_DAILY_SALES = function () {
        $scope.RevenueForm.submitted = true;
        if ($scope.RevenueForm.$valid && $scope.DAILY_SALES_LIST.length > 0) {
            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.RevenuesSearch.BRANCH_ID;
            ModelObj.ENTITY_ID = $scope.RevenuesSearch.ENTITY_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.FILE_NAME = $scope.RevenuesSearch.SALES_ORIGINAL_FILE_NAME + ":;:" + $scope.RevenuesSearch.SALES_SERVER_FILE_NAME + ":;:" + $scope.RevenuesSearch.SALES_FILE_PATH;
            ModelObj.DAILY_SALES = [];
            angular.forEach($scope.DAILY_SALES_LIST, function (val) {
                ReadModelObj = new Object();
                ReadModelObj.DATE = $filter('date')(val.DATE, "MM/dd/yyyy");
                ReadModelObj.NET_REVENUE = parseFloat(val.NET_REVENUE).toFixed(5);
                ModelObj.DAILY_SALES.push(ReadModelObj);
            });

            PrcCommMethods.HR_API(ModelObj, 'INS_UPD_DAILY_SALES').then(function (data) {
                if (data == null || data.data == undefined) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data.Table.length > 0) {
                    $scope.DAILY_SALES_LIST = data.data.Table;
                    angular.element("input[id='uploadExcel1']").val(null);
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                }
            });
        }
        else {
            if ($scope.DAILY_SALES_LIST.length == 0 && $scope.RevenueForm.$valid == true) {
                $scope.$parent.ShowAlert("Error", "Please upload Excel", 3000);
            }
        }
    }

    $scope.BRANCH_BUDGETS_TYPE = [{ ID: 1, COLUMN_NAME: 'BUDGET_DATE', MATCH_COLUMN_NAME: 'Date', IS_MANDATORY: true, HEADER_NAME: 'Date', FIELD_TYPE_ID: 9, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 2, COLUMN_NAME: 'BUDGET_CATEGORY', MATCH_COLUMN_NAME: 'Category', IS_MANDATORY: false, HEADER_NAME: 'Category', FIELD_TYPE_ID: 1, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 3, COLUMN_NAME: 'BUDGET', MATCH_COLUMN_NAME: 'Budget', IS_MANDATORY: true, HEADER_NAME: 'Budget', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true },
    { ID: 4, COLUMN_NAME: 'COVERS', MATCH_COLUMN_NAME: 'Covers', IS_MANDATORY: false, HEADER_NAME: 'Covers', FIELD_TYPE_ID: 10, VALUES_ENTITY: '', ACTIVE: true, IS_EXCEL_COLUMN: true }];



    $scope.INS_UPD_BRANCH_BUDGETS = function () {
        $scope.RevenueForm.submitted = true;
        if ($scope.RevenueForm.$valid && $scope.DAILY_BUDGET_LIST.length > 0) {
            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.RevenuesSearch.BRANCH_ID;
            ModelObj.ENTITY_ID = $scope.RevenuesSearch.ENTITY_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.FILE_NAME = $scope.RevenuesSearch.BUDGET_ORIGINAL_FILE_NAME + ":;:" + $scope.RevenuesSearch.BUDGET_SERVER_FILE_NAME + ":;:" + $scope.RevenuesSearch.BUDGET_FILE_PATH;
            ModelObj.BRANCH_BUDGETS = []
            //$scope.DAILY_BUDGET_LIST;

            angular.forEach($scope.DAILY_BUDGET_LIST, function (val) {
                ReadModelObj = new Object();
                ReadModelObj.BUDGET_DATE = $filter('date')(val.BUDGET_DATE, "MM/dd/yyyy");
                ReadModelObj.BUDGET_CATEGORY = val.BUDGET_CATEGORY;
                ReadModelObj.BUDGET = parseFloat(val.BUDGET).toFixed(5);
                ReadModelObj.COVERS = val.COVERS == "" || val.COVERS == undefined || val.COVERS == null ? 0 : parseFloat(val.COVERS).toFixed(0);
                ModelObj.BRANCH_BUDGETS.push(ReadModelObj);
            });

            PrcCommMethods.REPORT_API(ModelObj, 'INS_UPD_BRANCH_BUDGETS').then(function (data) {
                if (data == null || data.data == undefined) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data.Table.length > 0) {
                    $scope.DAILY_BUDGET_LIST = data.data.Table;
                    angular.element("input[id='uploadExcel2']").val(null);
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                }
            });
        }
        else {
            if ($scope.DAILY_BUDGET_LIST.length == 0 && $scope.RevenueForm.$valid == true) {
                $scope.$parent.ShowAlert("Error", "Please upload Excel", 3000);
            }
        }
    }
    $scope.INS_UPD_FORECASTED_REVENUE = function () {
        $scope.RevenueForm.submitted = true;
        if ($scope.RevenueForm.$valid && $scope.DAILY_FORCAST_LIST.length > 0) {
            ModelObj = new Object();
            ModelObj.BRANCH_ID = $scope.RevenuesSearch.BRANCH_ID;
            ModelObj.ENTITY_ID = $scope.RevenuesSearch.ENTITY_ID;
            ModelObj.USER_ID = parseInt($cookies.get("USERID"));
            ModelObj.FILE_NAME = $scope.RevenuesSearch.FORCAST_ORIGINAL_FILE_NAME + ":;:" + $scope.RevenuesSearch.FORCAST_SERVER_FILE_NAME + ":;:" + $scope.RevenuesSearch.FORCAST_FILE_PATH;
            ModelObj.FORECASTED_REVENUE = [];
            angular.forEach($scope.DAILY_FORCAST_LIST, function (val) {
                ReadModelObj = new Object();
                ReadModelObj.BUDGET_DATE = $filter('date')(val.BUDGET_DATE, "MM/dd/yyyy");
                ReadModelObj.BUDGET_CATEGORY = "";
                ReadModelObj.BUDGET = parseFloat(val.BUDGET).toFixed(5);
                ReadModelObj.COVERS = 0;
                ModelObj.FORECASTED_REVENUE.push(ReadModelObj);
            });

            PrcCommMethods.HR_API(ModelObj, 'INS_UPD_FORECASTED_REVENUE').then(function (data) {
                if (data == null || data.data == undefined) {
                    $scope.$parent.ShowAlert("Error", $scope.SOMETHINGWENTWRONG, 3000);
                }
                if (data.data.Table.length > 0) {
                    $scope.DAILY_FORCAST_LIST = data.data.Table;
                    angular.element("input[id='uploadExcel3']").val(null);
                    $scope.$parent.ShowAlert("Success", "Save Successfully", 3000);
                }
            });
        }
        else {
            if ($scope.DAILY_FORCAST_LIST.length == 0 && $scope.RevenueForm.$valid == true) {
                $scope.$parent.ShowAlert("Error", "Please upload Excel", 3000);
            }
        }
    }

    $scope.ADMIN_GET_BRANCH = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));

        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = $scope.RevenuesSearch.ENTITY_ID
        ModelObj.BRANCH_CODE = null; ModelObj.BRANCH_NAME = null; ModelObj.CONTACT_NAME = null; ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1; ModelObj.PAGE_NO = 0; ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    }
    $scope.ADMIN_GET_BRANCH();
});
app.controller('RevenuesDailyFileController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.UploadedSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        PAGE_NO: 1,
        PAGE_NO_LOGS: 1,
        PAGE_SIZE: 10,
        PAGE_SIZE_LOGS: 10,
        FILTER_START_DATE: null,
        FILTER_END_DATE: null,
        START_DATE: null,
        END_DATE: null,

    }
    $scope.FLAG = getUrlParameter('FLAG', $location.absUrl());
    $scope.COMMON_CODE_CHANGE();
    $scope.TAB_FLAG = $scope.FLAG;

    $scope.DAILY_SALES_UPLOADED_LIST = [];
    $scope.DAILY_SALES_LOG_DETAILS = [];
    $scope.DAILY_SALES_LOGS_LIST = [];

    function reportrange(start, end) {
        $scope.UploadedSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    function reportrangeUploaded(start, end) {
        $scope.UploadedSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.UploadedSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        if ($scope.TAB_FLAG == 1) {
            $scope.GET_DAILY_SALES_UPLOADED(1);
        }
        else if ($scope.TAB_FLAG == 2) {
            $scope.GET_DAILY_SALES_LOGS(1);
        }
    });



    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {
        $scope.TAB_FLAG = TAB_FLAG;
        if (TAB_FLAG == 2) {
            $scope.GET_DAILY_SALES_LOGS(1);
        }
    }
    $scope.RESET_DAILY_SALES_FILTER = function () {
        $scope.UploadedSearch.BRANCH_ID = null;
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format))
        $scope.GET_DAILY_SALES_UPLOADED(1);
    }


    $scope.LAZY_GET_DAILY_SALES_UPLOADED = function () {
        $scope.GET_DAILY_SALES_UPLOADED();
    }
    $scope.GET_DAILY_SALES_UPLOADED = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedSearch.PAGE_NO = 1;
            $scope.DAILY_SALES_UPLOADED_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.START_DATE = $scope.UploadedSearch.START_DATE;
        ModelObj.END_DATE = $scope.UploadedSearch.END_DATE;
        ModelObj.ENTITY_ID = $scope.UploadedSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedSearch.BRANCH_ID == undefined ? 0 : $scope.UploadedSearch.BRANCH_ID;
        ModelObj.PAGE_NO = $scope.UploadedSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.UploadedSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(ModelObj, 'GET_DAILY_SALES_UPLOADED').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.DAILY_SALES_UPLOADED_LIST = $scope.DAILY_SALES_UPLOADED_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.UploadedSearch.PAGE_NO = parseInt($scope.UploadedSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                if ($scope.DAILY_SALES_UPLOADED_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.LAZY_GET_DAILY_SALES = function () {
        $scope.GET_DAILY_SALES_LOGS();
    }
    $scope.RESET_DAILY_SALES_LOGS_FILTER = function () {
        $scope.UploadedSearch.FILTER_BRANCH_ID = null;
        $scope.UploadedSearch.FILE_NAME = "";
        var start = moment().startOf('month');
        var end = moment().endOf('month');

        $scope.UploadedSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);


        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");

        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_DAILY_SALES_LOGS(1);
    }

    $scope.GET_DAILY_SALES_LOGS = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedSearch.PAGE_NO_LOGS = 1;
            $scope.DAILY_SALES_LOGS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.FILE_NAME = $scope.UploadedSearch.FILE_NAME;
        ModelObj.ENTITY_ID = $scope.UploadedSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedSearch.FILTER_BRANCH_ID == undefined ? 0 : $scope.UploadedSearch.FILTER_BRANCH_ID;
        ModelObj.START_DATE = $scope.UploadedSearch.FILTER_START_DATE;
        ModelObj.END_DATE = $scope.UploadedSearch.FILTER_END_DATE;
        ModelObj.PAGE_NO = $scope.UploadedSearch.PAGE_NO_LOGS;
        ModelObj.PAGE_SIZE = $scope.UploadedSearch.PAGE_SIZE_LOGS;
        PrcCommMethods.HR_API(ModelObj, 'GET_DAILY_SALES_LOGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.DAILY_SALES_LOGS_LIST = $scope.DAILY_SALES_LOGS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedSearch.PAGE_SIZE_LOGS) {
                    $scope.GetDataLog = false;
                }
                else {
                    $scope.UploadedSearch.PAGE_NO_LOGS = parseInt($scope.UploadedSearch.PAGE_NO_LOGS) + 1;
                    $scope.GetDataLog = true;
                }
            } else {
                if ($scope.DAILY_SALES_LOGS_LIST.length == 0) { }
                $scope.GetDataLog = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.GET_DAILY_SALES_LOG_DETAILS = function (XIL) {
        if (XIL.DAILY_SALES_LOG_DETAILS == undefined) {
            XIL.DAILY_SALES_LOG_DETAILS = [];
        }
        ModelObj = new Object();
        ModelObj.DAILY_SALES_LOG_ID = XIL.DAILY_SALES_LOG_ID;
        ModelObj.PAGE_NO = 0// $scope.UploadedSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.UploadedSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(ModelObj, 'GET_DAILY_SALES_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                //XIL.DAILY_SALES_LOG_DETAILS = XIL.DAILY_SALES_LOG_DETAILS.concat();
                $scope.DAILY_SALES_LOG_DETAILS = data.data.Table;
                $('#LOG_DTLS').modal('show');
                if (data.data.Table.length < $scope.UploadedSearch.PAGE_SIZE) {
                    $scope.GetDataDtls = false;
                }
                else {
                    $scope.UploadedSearch.PAGE_NO = parseInt($scope.UploadedSearch.PAGE_NO) + 1;
                    $scope.GetDataDtls = true;
                }
            } else {
                if ($scope.DAILY_SALES_LOG_DETAILS.length == 0) { }
                $('#LOG_DTLS').modal('show');
                $scope.GetDataDtls = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }



    $scope.ADMIN_GET_BRANCH = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = $scope.UploadedSearch.ENTITY_ID
        ModelObj.BRANCH_CODE = null; ModelObj.BRANCH_NAME = null; ModelObj.CONTACT_NAME = null; ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1; ModelObj.PAGE_NO = 0; ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    }
    $scope.ADMIN_GET_BRANCH();


});
app.controller('RevenuesBudgetFileController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.UploadedBudgeSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        PAGE_NO: 1,
        PAGE_NO_LOGS: 1,
        PAGE_SIZE: 10,
        PAGE_SIZE_LOGS: 10,
    }
    $scope.FLAG = getUrlParameter('FLAG', $location.absUrl());
    $scope.COMMON_CODE_CHANGE();
    $scope.TAB_FLAG = parseInt($scope.FLAG);

    $scope.BRANCH_BUDGETS_LIST = [];
    $scope.BRANCH_BUDGET_LOGS_LIST = [];

    function reportrange(start, end) {
        $scope.UploadedBudgeSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    function reportrangeUploaded(start, end) {
        $scope.UploadedBudgeSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedBudgeSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.UploadedBudgeSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");

        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));

        if ($scope.TAB_FLAG == 1) {
            $scope.GET_BRANCH_BUDGETS();
        }
        else if ($scope.TAB_FLAG == 2) {
            $scope.GET_BRANCH_BUDGET_LOGS(1);
        }

    });

    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {
        $scope.TAB_FLAG = TAB_FLAG;
        if (TAB_FLAG == 2) {
            $scope.GET_DAILY_SALES_LOGS(1);
        }
    }
    $scope.RESET_DAILY_SALES_FILTER = function () {
        $scope.UploadedBudgeSearch.BRANCH_ID = null;
        var start = moment().startOf('month');
        var end = moment().endOf('month');

        $scope.UploadedBudgeSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format))
        $scope.GET_BRANCH_BUDGETS(1);
    }


    $scope.LAZY_GET_BRANCH_BUDGETS = function () {
        $scope.GET_BRANCH_BUDGETS();
    };
    $scope.GET_BRANCH_BUDGETS = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedBudgeSearch.PAGE_NO = 1;
            $scope.BRANCH_BUDGETS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.START_DATE = $scope.UploadedBudgeSearch.START_DATE;
        ModelObj.END_DATE = $scope.UploadedBudgeSearch.END_DATE;
        ModelObj.ENTITY_ID = $scope.UploadedBudgeSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedBudgeSearch.BRANCH_ID;
        ModelObj.PAGE_NO = $scope.UploadedBudgeSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.UploadedBudgeSearch.PAGE_SIZE;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGETS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.BRANCH_BUDGETS_LIST = $scope.BRANCH_BUDGETS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedBudgeSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.UploadedBudgeSearch.PAGE_NO = parseInt($scope.UploadedBudgeSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                if ($scope.BRANCH_BUDGETS_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }

    $scope.LAZY_GET_BRANCH_BUDGET_LOGS = function () {
        $scope.GET_BRANCH_BUDGET_LOGS();
    }
    $scope.RESET_DAILY_SALES_LOGS_FILTER = function () {
        $scope.UploadedBudgeSearch.FILTER_BRANCH_ID = null;
        $scope.UploadedBudgeSearch.FILE_NAME = "";

        var start = moment().startOf('month');
        var end = moment().endOf('month');

        $scope.UploadedBudgeSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedBudgeSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);


        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");

        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_BRANCH_BUDGET_LOGS(1);
    }

    $scope.GET_BRANCH_BUDGET_LOGS = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedBudgeSearch.PAGE_NO_LOGS = 1;
            $scope.BRANCH_BUDGET_LOGS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.FILE_NAME = $scope.UploadedBudgeSearch.FILE_NAME;
        ModelObj.ENTITY_ID = $scope.UploadedBudgeSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedBudgeSearch.FILTER_BRANCH_ID;
        ModelObj.START_DATE = $scope.UploadedBudgeSearch.FILTER_START_DATE;
        ModelObj.END_DATE = $scope.UploadedBudgeSearch.FILTER_END_DATE;
        ModelObj.PAGE_NO = $scope.UploadedBudgeSearch.PAGE_NO_LOGS;
        ModelObj.PAGE_SIZE = $scope.UploadedBudgeSearch.PAGE_SIZE_LOGS;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGET_LOGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.BRANCH_BUDGET_LOGS_LIST = $scope.BRANCH_BUDGET_LOGS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedBudgeSearch.PAGE_SIZE_LOGS) {
                    $scope.GetDataLog = false;
                }
                else {
                    $scope.UploadedBudgeSearch.PAGE_NO_LOGS = parseInt($scope.UploadedBudgeSearch.PAGE_NO_LOGS) + 1;
                    $scope.GetDataLog = true;
                }
            } else {
                if ($scope.BRANCH_BUDGET_LOGS_LIST.length == 0) { }
                $scope.GetDataLog = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.GET_BRANCH_BUDGET_LOG_DETAILS = function (XIL) {
        if (XIL.BRANCH_BUDGET_LOG_DETAILS == undefined) {
            XIL.BRANCH_BUDGET_LOG_DETAILS = [];
        }
        ModelObj = new Object();
        ModelObj.BRANCH_BUDGET_LOG_ID = XIL.BRANCH_BUDGET_LOG_ID;
        ModelObj.PAGE_NO = 0//$scope.UploadedBudgeSearch.PAGE_NO_LOG_DETAILS;
        ModelObj.PAGE_SIZE = $scope.UploadedBudgeSearch.PAGE_SIZE_LOG_DETAILS;
        PrcCommMethods.REPORT_API(ModelObj, 'GET_BRANCH_BUDGET_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                // XIL.BRANCH_BUDGET_LOG_DETAILS = XIL.BRANCH_BUDGET_LOG_DETAILS.concat(data.data.Table);
                $scope.BRANCH_BUDGET_LOG_DETAILS = data.data.Table;//XIL.BRANCH_BUDGET_LOG_DETAILS;
                $('#LOG_DTLS').modal('show');
                if (data.data.Table.length < $scope.UploadedBudgeSearch.PAGE_SIZE_LOG_DETAILS) {
                    $scope.GetDataDtls = false;
                }
                else {
                    $scope.UploadedBudgeSearch.PAGE_NO_LOG_DETAILS = parseInt($scope.UploadedBudgeSearch.PAGE_NO_LOG_DETAILS) + 1;
                    $scope.GetDataDtls = true;
                }
            } else {
                if ($scope.BRANCH_BUDGET_LOG_DETAILS.length == 0) { }
                $('#LOG_DTLS').modal('show');
                $scope.GetDataDtls = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }





    $scope.ADMIN_GET_BRANCH = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = $scope.UploadedBudgeSearch.ENTITY_ID
        ModelObj.BRANCH_CODE = null; ModelObj.BRANCH_NAME = null; ModelObj.CONTACT_NAME = null; ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1; ModelObj.PAGE_NO = 0; ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    }
    $scope.ADMIN_GET_BRANCH();
});
app.controller('RevenuesForecastFileController', function ($scope, $http, CommService, $cookies, $filter, PrcCommMethods, $location, $localStorage) {
    $scope.UploadedForecastSearch = {
        ENTITY_ID: parseInt($cookies.get('ENTITY_ID')),
        PAGE_NO: 1,
        PAGE_NO_LOGS: 1,
        PAGE_SIZE: 10,
        PAGE_SIZE_LOGS: 10,
    }
    $scope.FLAG = getUrlParameter('FLAG', $location.absUrl());

    $scope.COMMON_CODE_CHANGE();
    $scope.TAB_FLAG = parseInt($scope.FLAG);
    $scope.FORECASTED_REVENUE_LIST = [];
    $scope.FORECASTED_REVENUE_LOGS_LIST = [];

    function reportrange(start, end) {
        $scope.UploadedForecastSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    function reportrangeUploaded(start, end) {
        $scope.UploadedForecastSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
    };
    $(function () {
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedForecastSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.UploadedForecastSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);


        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));

        if ($scope.TAB_FLAG == 1) {
            $scope.GET_FORECASTED_REVENUE(1);
        }
        else if ($scope.TAB_FLAG == 2) {
            $scope.GET_FORECASTED_REVENUE_LOGS(1);
        }

    });

    $scope.TAB_CLICK_SHDL_FY = function (TAB_FLAG) {
        $scope.TAB_FLAG = TAB_FLAG;
    };

    $scope.RESET_FORECASTED_FILTER = function () {
        $scope.UploadedForecastSearch.BRANCH_ID = null;
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedForecastSearch.START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.END_DATE = end.format($scope.$parent.Datelocaleformat.format);
        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrange', start, end, reportrange, 1, "left");
        $('#reportrange span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_FORECASTED_REVENUE(1);
    }


    $scope.LAZY_GET_FORECASTED_REVENUE = function () {
        $scope.GET_FORECASTED_REVENUE();
    }
    $scope.GET_FORECASTED_REVENUE = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedForecastSearch.PAGE_NO = 1;
            $scope.FORECASTED_REVENUE_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.START_DATE = $scope.UploadedForecastSearch.START_DATE;
        ModelObj.END_DATE = $scope.UploadedForecastSearch.END_DATE;
        ModelObj.ENTITY_ID = $scope.UploadedForecastSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedForecastSearch.BRANCH_ID == undefined ? 0 : $scope.UploadedForecastSearch.BRANCH_ID;
        ModelObj.PAGE_NO = $scope.UploadedForecastSearch.PAGE_NO;
        ModelObj.PAGE_SIZE = $scope.UploadedForecastSearch.PAGE_SIZE;
        PrcCommMethods.HR_API(ModelObj, 'GET_FORECASTED_REVENUE').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.FORECASTED_REVENUE_LIST = $scope.FORECASTED_REVENUE_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedForecastSearch.PAGE_SIZE) {
                    $scope.GetData = false;
                }
                else {
                    $scope.UploadedForecastSearch.PAGE_NO = parseInt($scope.UploadedForecastSearch.PAGE_NO) + 1;
                    $scope.GetData = true;
                }
            } else {
                if ($scope.FORECASTED_REVENUE_LIST.length == 0) { }
                $scope.GetData = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.LAZY_GET_DAILY_SALES = function () {
        $scope.GET_DAILY_SALES_LOGS();
    }
    $scope.RESET_FORECASTED_LOGS_FILTER = function () {
        $scope.UploadedForecastSearch.FILTER_BRANCH_ID = null;
        $scope.UploadedForecastSearch.FILE_NAME = "";
        var start = moment().startOf('month');
        var end = moment().endOf('month');
        $scope.UploadedForecastSearch.FILTER_START_DATE = start.format($scope.$parent.Datelocaleformat.format);
        $scope.UploadedForecastSearch.FILTER_END_DATE = end.format($scope.$parent.Datelocaleformat.format);

        $scope.$parent.SetUpDateRangeMultiDatePicker('reportrangeUploaded', start, end, reportrangeUploaded, 1, "left");
        $('#reportrangeUploaded span').html(start.format($scope.$parent.Datelocaleformat.format) + ' - ' + end.format($scope.$parent.Datelocaleformat.format));
        $scope.GET_FORECASTED_REVENUE_LOGS(1);
    }

    $scope.GET_FORECASTED_REVENUE_LOGS = function (FLAG) {
        if (FLAG == 1) {
            $scope.UploadedForecastSearch.PAGE_NO_LOGS = 1;
            $scope.FORECASTED_REVENUE_LOGS_LIST = [];
        }
        ModelObj = new Object();
        ModelObj.FILE_NAME = $scope.UploadedForecastSearch.FILE_NAME;
        ModelObj.ENTITY_ID = $scope.UploadedForecastSearch.ENTITY_ID;
        ModelObj.BRANCH_ID = $scope.UploadedForecastSearch.FILTER_BRANCH_ID == undefined ? 0 : $scope.UploadedForecastSearch.FILTER_BRANCH_ID;
        ModelObj.START_DATE = $scope.UploadedForecastSearch.FILTER_START_DATE;
        ModelObj.END_DATE = $scope.UploadedForecastSearch.FILTER_END_DATE;
        ModelObj.PAGE_NO = $scope.UploadedForecastSearch.PAGE_NO_LOGS;
        ModelObj.PAGE_SIZE = $scope.UploadedForecastSearch.PAGE_SIZE_LOGS;
        PrcCommMethods.HR_API(ModelObj, 'GET_FORECASTED_REVENUE_LOGS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                $scope.FORECASTED_REVENUE_LOGS_LIST = $scope.FORECASTED_REVENUE_LOGS_LIST.concat(data.data.Table);
                if (data.data.Table.length < $scope.UploadedForecastSearch.PAGE_SIZE_LOGS) {
                    $scope.GetDataLog = false;
                }
                else {
                    $scope.UploadedForecastSearch.PAGE_NO_LOGS = parseInt($scope.UploadedForecastSearch.PAGE_NO_LOGS) + 1;
                    $scope.GetDataLog = true;
                }
            } else {
                if ($scope.FORECASTED_REVENUE_LOGS_LIST.length == 0) { }
                $scope.GetDataLog = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }
    $scope.GET_FORECASTED_REVENUE_LOG_DETAILS = function (XIL) {
        if (XIL.DAILY_SALES_LOG_DETAILS == undefined) {
            XIL.DAILY_SALES_LOG_DETAILS = [];
        }
        ModelObj = new Object();
        ModelObj.FORECASTED_REVENUE_LOG_ID = XIL.FORECASTED_REVENUE_LOG_ID;
        ModelObj.PAGE_NO = $scope.UploadedForecastSearch.PAGE_NO_REVENUE_LOG;
        ModelObj.PAGE_SIZE = $scope.UploadedForecastSearch.PAGE_SIZE_REVENUE_LOG;
        PrcCommMethods.HR_API(ModelObj, 'GET_FORECASTED_REVENUE_LOG_DETAILS').then(function (data) {
            if (data.data.Table.length > 0) {
                $scope.$parent.overlay_loadingNew = 'none';
                //XIL.DAILY_SALES_LOG_DETAILS = XIL.DAILY_SALES_LOG_DETAILS.concat(data.data.Table);
                $scope.DAILY_SALES_LOG_DETAILS = data.data.Table;//XIL.DAILY_SALES_LOG_DETAILS;
                $('#LOG_DTLS').modal('show');
                if (data.data.Table.length < $scope.UploadedForecastSearch.PAGE_SIZE) {
                    $scope.GetDataDtls = false;
                }
                else {
                    $scope.UploadedForecastSearch.PAGE_NO = parseInt($scope.UploadedForecastSearch.PAGE_NO) + 1;
                    $scope.GetDataDtls = true;
                }
            } else {
                if ($scope.DAILY_SALES_LOG_DETAILS.length == 0) { }
                $('#LOG_DTLS').modal('show');
                $scope.GetDataDtls = false;
                $scope.$parent.overlay_loadingNew = 'none';
            }
        });
    }


    $scope.ADMIN_GET_BRANCH = function () {
        ModelObj = new Object();
        ModelObj.CUSTOMER_ID = parseInt($cookies.get('CUSTOMER_ID'));
        ModelObj.USER_ID = parseInt($cookies.get("USERID"));
        ModelObj.ENTITY_ID = $scope.UploadedForecastSearch.ENTITY_ID
        ModelObj.BRANCH_CODE = null; ModelObj.BRANCH_NAME = null; ModelObj.CONTACT_NAME = null; ModelObj.LOCATION_IDS = null;
        ModelObj.ACTIVE = 1; ModelObj.PAGE_NO = 0; ModelObj.PAGE_SIZE = 0;
        PrcCommMethods.ADMIN_API(ModelObj, 'ADMIN_GET_BRANCH').then(function (data) {
            $scope.BRANCH_LIST = data.data.Table;
        });
    }
    $scope.ADMIN_GET_BRANCH();
});