app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/CL', {
                templateUrl: '../AngularViews/CashUp/CashupList.html?v=' + AppVersion,
                controller: 'CashupListController'
            }).when('/CAL', {
                templateUrl: '../AngularViews/CashUp/CashupAppList.html?v=' + AppVersion,
                controller: 'ApprovalListController'
            }).when('/CashupReport', {
                templateUrl: '../AngularViews/CashUp/CashupReport.html?v=2' + AppVersion,
                controller: 'CashupReportController'
            }).when('/CE', {
                templateUrl: '../AngularViews/CashUp/CashupEntry.html?v=' + AppVersion,
                controller: 'CashupEntryController'
            }).when('/bi_report', {
                templateUrl: '../AngularViews/CashUp/bi_report.html?v=' + AppVersion,
                controller: 'DashBoardController'
            })
            //=========================New Cashup Edit================================
            .when('/CLN', {
                templateUrl: '../AngularViews/CashUp/CashupListN.html?v=' + AppVersion,
                controller: 'CashupListControllerNew'
            }).when('/CALN', {
                templateUrl: '../AngularViews/CashUp/CashupAppListN.html?v=' + AppVersion,
                controller: 'ApprovalListControllerNew'
            }).when('/CEN', {
                templateUrl: '../AngularViews/CashUp/CashupEntryNew.html?v=2' + AppVersion,
                controller: 'CashEntryControllerNew'
            }).when('/Float', {
                templateUrl: '../AngularViews/CashUp/Float.html?v=235' + AppVersion,
                controller: 'FloatController'
            }).when('/Cash', {
                // templateUrl: '../AngularViews/CashUp/Cash.html?v=5' + AppVersion,
                templateUrl: '../AngularViews/CashUp/cash-changes.html?v=12' + AppVersion,
                controller: 'CashController'
            }).when('/Cards', {
                templateUrl: '../AngularViews/CashUp/Cards.html?v=5' + AppVersion,
                controller: 'CardController'
            }).when('/PtyCash', {
                templateUrl: '../AngularViews/CashUp/PettyCash.html?v=4' + AppVersion,
                controller: 'PettyCashController'
            }).when('/Delivery', {
                templateUrl: '../AngularViews/CashUp/Delivery.html?v=' + AppVersion,
                controller: 'DeliveryController'
            }).when('/AccountCustomer', {
                templateUrl: '../AngularViews/CashUp/AccountCustomer.html?v=10' + AppVersion,
                controller: 'AccountCustomerController'
            }).when('/Vouchers', {
                templateUrl: '../AngularViews/CashUp/Vouchers.html?v=1' + AppVersion,
                controller: 'VouchersController'
            }).when('/Deposits', {
                templateUrl: '../AngularViews/CashUp/Deposits.html?v=2' + AppVersion,
                controller: 'DepositsController'
            }).when('/Complimentary', {
                templateUrl: '../AngularViews/CashUp/Complimentary.html?v=3' + AppVersion,
                controller: 'ComplimentaryController'
            }).when('/Reviews', {
                templateUrl: '../AngularViews/CashUp/Reviews.html?v=6' + AppVersion,
                controller: 'ReviewsController'
            })
            //=========================New Cashup View================================
            .when('/CEN_VIEW', {
                templateUrl: '../AngularViews/CashUp/CashupEntryNew_View.html?v=1' + AppVersion,
                controller: 'CashEntryControllerNew'
            }).when('/Float_View', {
                templateUrl: '../AngularViews/CashUp/Float_View.html?v=232' + AppVersion,
                controller: 'FloatController'
            }).when('/Cash_View', {
                templateUrl: '../AngularViews/CashUp/Cash_View.html?v=555   ' + AppVersion,
                controller: 'CashController'
            }).when('/Cards_View', {
                templateUrl: '../AngularViews/CashUp/Card_View.html?v=' + AppVersion,
                controller: 'CardController'
            }).when('/PtyCash_View', {
                templateUrl: '../AngularViews/CashUp/PettyCash_View.html?v=' + AppVersion,
                controller: 'PettyCashController'
            }).when('/Delivery_View', {
                templateUrl: '../AngularViews/CashUp/Delivery_View.html?v=' + AppVersion,
                controller: 'DeliveryController'
            }).when('/AccountCustomer_View', {
                templateUrl: '../AngularViews/CashUp/AccountCustomer_View.html?v=10' + AppVersion,
                controller: 'AccountCustomerController'
            }).when('/Vouchers_View', {
                templateUrl: '../AngularViews/CashUp/Vouchers_View.html?v=' + AppVersion,
                controller: 'VouchersController'
            }).when('/Deposits_View', {
                templateUrl: '../AngularViews/CashUp/Deposits_View.html?v=' + AppVersion,
                controller: 'DepositsController'
            }).when('/Complimentary_View', {
                templateUrl: '../AngularViews/CashUp/Complimentary_View.html?v=' + AppVersion,
                controller: 'ComplimentaryController'
            }).when('/Reviews_View', {
                templateUrl: '../AngularViews/CashUp/Reviews_View.html?v=2' + AppVersion,
                controller: 'ReviewsController'
            })
            //==================Cashup App ====================
            .when('/Test', {
                templateUrl: '../AngularViews/CashUpApp/Test.html?v=6' + AppVersion,
                  controller: 'CashupAppIndexController'
            })
            //======================================================
            .when('/RE', {
                templateUrl: '../AngularViews/Restaurant/RestaurantEntry.html?v=' + AppVersion,
                controller: 'RestaurantEntryController'
            }).when('/RL', {
                templateUrl: '../AngularViews/Restaurant/RestaurantList.html?v=' + AppVersion,
                controller: 'RestaurantListController'
            }).when('/Dsh_board', {
                templateUrl: '../AngularViews/Dashboard/Dashboard.html?v=2' + AppVersion,
                controller: 'DashBoardController'
            }).when('/Report_bi', {
                templateUrl: '../AngularViews/CashUp/Report_bi.html?v=10213' + AppVersion,
                controller: 'CashupListControllerNew'
            }).when('/Comps_Review', {
                templateUrl: '../AngularViews/CashUp/Comps_Review.html?v=2' + AppVersion,
                controller: 'CashupListControllerNew'
            }).when('/WSA', {
                templateUrl: '../AngularViews/CashUp/Weekly_Sales_Analysis.html?v=2' + AppVersion,
                controller: 'CashupListControllerNew'
            }).when('/SA', {
                templateUrl: '../AngularViews/CashUp/Sales_Analystics.html?v=' + AppVersion,
                controller: 'CashupListControllerNew'
            }).when('/Hr_index', {
                templateUrl: '../AngularViews/HR/Index.html?v=2' + AppVersion,
                controller: 'HRDashBoardController'
            }).when('/Hr_index2', {
                templateUrl: '../AngularViews/HR/Index2.html?v=4' + AppVersion,
                controller: 'HRDashBoardController'
            }).when('/Hr_Cnt', {
                templateUrl: '../AngularViews/HR/Contact.html?v=' + AppVersion,
                controller: 'HRController'
            })
            .when('/Addteam', {
                templateUrl: '../AngularViews/HR/Add_team.html?v=' + AppVersion,
                controller: 'HRController'
            }).when('/Probation', {
                templateUrl: '../AngularViews/Admin/HR/ProbationMaster.html?v=' + AppVersion,
                controller: 'ProbationMasterController'
            }).when('/Division', {
                templateUrl: '../AngularViews/Admin/HR/DivisionMaster.html?v=' + AppVersion,
                controller: 'DivisionMasterController'
            }).when('/Adddepartment', {
                templateUrl: '../AngularViews/HR/Department/Add_department.html?v=5' + AppVersion,
                controller: 'DepartmentController'
            }).when('/Addposition1', {
                templateUrl: '../AngularViews/HR/Add_position.html?v=' + AppVersion,
                controller: 'PositionController'
            }).when('/Addposition', {
                templateUrl: '../AngularViews/HR/AddPosition/Position.html?v=3' + AppVersion,
                controller: 'PositionController'
            })
            .when('/AddpositionEmpdtl', {
                templateUrl: '../AngularViews/HR/AddPosition/Employement.html?v=1' + AppVersion,
                controller: 'EmployeeDtlController'
            }).when('/AddpositionCntdtls', {
                templateUrl: '../AngularViews/HR/AddPosition/Contract.html?v=1' + AppVersion,
                controller: 'ContractController'
            }).when('/Addemployee', {
                templateUrl: '../AngularViews/HR/AddEmployee/Personal.html?v=2' + AppVersion,
                controller: 'PersonalController'
            }).when('/EmpContact', {
                templateUrl: '../AngularViews/HR/AddEmployee/Contact.html?v=1' + AppVersion,
                controller: 'ContactController'
            }).when('/ViewContact', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewContact.html?v=4' + AppVersion,
                controller: 'ContactController'
            }).when('/EditContact', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditContact.html?v=12' + AppVersion,
                controller: 'ContactController'
            }).when('/ViewEmpemplment', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewEmployment.html?v=2' + AppVersion,
                controller: 'EmploymentController'
            }).when('/Empemplment', {
                templateUrl: '../AngularViews/HR/AddEmployee/Employment.html?v=1' + AppVersion,
                controller: 'EmploymentController'
            }).when('/EditEmpemplment', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditEmployment.html?v=2' + AppVersion,
                controller: 'EmploymentController'
            }).when('/EmpQualifi', {
                templateUrl: '../AngularViews/HR/AddEmployee/Qualifications.html?v=' + AppVersion,
                controller: 'QualificationsController'
            }).when('/EditEmpQualifi', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditQualifications.html?v=' + AppVersion,
                controller: 'QualificationsController'
            }).when('/ViewQualifi', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewQualifications.html?v=' + AppVersion,
                controller: 'QualificationsController'
            }).when('/EmpComp', {
                templateUrl: '../AngularViews/HR/AddEmployee/Compensation.html?v=2' + AppVersion,
                controller: 'CompensationController'
            }).when('/EditEmpComp', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditCompensation.html?v=1' + AppVersion,
                controller: 'CompensationController'
            }).when('/ViewEmpComp', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewCompensation.html?v=2' + AppVersion,
                controller: 'CompensationController'
            }).when('/ViewEmpLev', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewLeave.html?v=8' + AppVersion,
                controller: 'EmpLeaveController'
            }).when('/EditEmpLev', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditLeave.html?v=2' + AppVersion,
                controller: 'EmpLeaveController'
            }).when('/EmpLev', {
                templateUrl: '../AngularViews/HR/AddEmployee/Leave.html?v=' + AppVersion,
                controller: 'EmpLeaveController'
            }).when('/ViewEmpDoc', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewDocuments.html?v=' + AppVersion,
                controller: 'DocumentsController'
            }).when('/EditEmpDoc', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditDocuments.html?v=' + AppVersion,
                controller: 'DocumentsController'
            }).when('/EmpDoc', {
                templateUrl: '../AngularViews/HR/AddEmployee/Documents.html?v=' + AppVersion,
                controller: 'DocumentsController'
            }).when('/ViewPosition', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewPosition.html?v=' + AppVersion,
                controller: 'ViewPositionController'
            }).when('/ViewOther', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewOthers.html?v=' + AppVersion,
                controller: 'ViewOthersController'
            }).when('/PU', {
                templateUrl: '../AngularViews/WeFyle/Upload.html?v=1' + AppVersion,
                controller: 'PayrollUploadController'
            })
            //.when('/PL', {
            //    templateUrl: '../AngularViews/WeFyle/UploadList.html?v=' + AppVersion,
            //    controller: 'PayrollListController'
            //})
            //.when('/WeFyle', {
            //    templateUrl: '../AngularViews/WeFyle/WeFyle.html?v=' + AppVersion,
            //    controller: 'PayrollListController'
            //})
            .when('/PL', {
                templateUrl: '../AngularViews/WeFyle/WeFyle.html?v=' + AppVersion,
                controller: 'PayrollListController'
            }).when('/AUL', {
                templateUrl: '../AngularViews/WeFyle/ApprovalList.html?v=' + AppVersion,
                controller: 'ApprovalUploadListController'
            }).when('/APL', {
                templateUrl: '../AngularViews/HR/Add_employee.html?v=' + AppVersion,
                controller: 'ApprovalPListController'
            }).when('/PDL', {
                templateUrl: '../AngularViews/Wefyle/PayrollDetails.html?v=34654' + AppVersion,
                controller: 'PayrollDetailController'
            }).when('/Schedule', {
                templateUrl: '../AngularViews/HR/Schedule.html?v=' + AppVersion,
                controller: 'SchedulerController'
            }).when('/A_Day_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Area_Day_View.html?v=' + AppVersion,
                controller: 'SchedulerController'
            }).when('/team', {
                templateUrl: '../AngularViews/HR/team.html?v=2' + AppVersion,
                controller: 'TeamListController'
            }).when('/History', {
                templateUrl: '../AngularViews/HR/ViewEmployee/HistoryList.html?v=' + AppVersion,
                controller: 'HistoryListController'
            }).when('/HR_Note', {
                templateUrl: '../AngularViews/HR/ViewEmployee/HR_Note.html?v=8' + AppVersion,
                controller: 'NoteController'
            }).when('/EditProfile', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewPersonal.html?v=2' + AppVersion,
                controller: 'PersonalController'
            }).when('/ViewPersonal1', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewPersonal.html?v=' + AppVersion,
                controller: 'PersonalController'
            }).when('/ViewPersonalNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewPersonalNew.html?v=1' + AppVersion,
                controller: 'PersonalController'
            }).when('/ViewContactNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewContactNew.html?v=' + AppVersion,
                controller: 'ContactController'
            }).when('/ViewEmpemplmentNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewEmploymentNew.html?v=' + AppVersion,
                controller: 'EmploymentController'
            }).when('/ViewQualifiNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewQualificationsNew.html?v=' + AppVersion,
                controller: 'QualificationsController'
            }).when('/ViewLeaveNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewLeaveNew.html?v=1' + AppVersion,
                controller: 'EmpLeaveController'
            }).when('/ViewEmpCompNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewCompensationNew.html?v=1' + AppVersion,
                controller: 'CompensationController'
            }).when('/ViewEmpDocNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewDocumentsNew.html?v=' + AppVersion,
                controller: 'DocumentsController'
            }).when('/ViewOtherNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/ViewOthersNew.html?v=' + AppVersion,
                controller: 'ViewOthersController'
            }).when('/HistoryNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/HistoryListNew.html?v=' + AppVersion,
                controller: 'HistoryListController'
            }).when('/EditPersonalNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditPersonalNew.html?v=2' + AppVersion,
                controller: 'PersonalController'
            }).when('/EditContactNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditContactNew.html?v=12' + AppVersion,
                controller: 'ContactController'
            }).when('/EditEmploymentNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditEmploymentNew.html?v=2' + AppVersion,
                controller: 'EmploymentController'
            }).when('/EditEmpQualifiNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditQualificationsNew.html?v=' + AppVersion,
                controller: 'QualificationsController'
            }).when('/EditEmpLevNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditLeaveNew.html?v=' + AppVersion,
                controller: 'EmpLeaveController'
            }).when('/EditEmpDocNew', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditDocumentsNew.html?v=' + AppVersion,
                controller: 'DocumentsController'
            }).when('/ViwProfile', {
                templateUrl: '../AngularViews/HR/view-profile.html?v=' + AppVersion,
                controller: 'EmployeeController'
            }).when('/Reminders', {
                templateUrl: '../AngularViews/HR/reminders.html?v=' + AppVersion,
                controller: 'RemindersController'
            }).when('/Appsuit', {
                templateUrl: '../AngularViews/HR/appsuit.html?v=' + AppVersion,
                controller: 'HRController'
            }).when('/YourTask', {
                templateUrl: '../AngularViews/HR/YourTask.html?v=' + AppVersion,
                controller: 'YourTaskController'
            }).when('/RTask', {
                templateUrl: '../AngularViews/HR/ResponsiblilityTask.html?v=' + AppVersion,
                controller: 'YourTaskController'
            }).when('/PendingRequest', {
                templateUrl: '../AngularViews/HR/PendingRequest.html?v=5' + AppVersion,
                controller: 'LeaveListController'
            }).when('/Calendar', {
                templateUrl: '../AngularViews/HR/Calendar.html?v=2' + AppVersion,
                controller: 'LeaveController'
            }).when('/Payroll', {
                templateUrl: '../AngularViews/HR/Payroll.html?v=' + AppVersion,
                controller: 'PayrollController'
            }).when('/Reports', {
                templateUrl: '../AngularViews/HR/Reports.html?v=' + AppVersion,
                controller: 'ReportsController'
            }).when('/P2PReports', {
                templateUrl: '../AngularViews/P2P/P2PReports/P2PReports.html?v=1' + AppVersion,
                controller: 'ReportsController'
            }).when('/Documents', {
                templateUrl: '../AngularViews/HR/Documents.html?v=' + AppVersion,
                controller: 'DocumentController'
            }).when('/SP', {
                templateUrl: '../AngularViews/HR/confirm-password.html?v=' + AppVersion,
                controller: 'HRController'
            }).when('/XD', {
                templateUrl: '../AngularViews/ProfitandLoss/Xero_Dashboard.html?v=' + AppVersion,
                controller: 'PNLController'
            }).when('/P&L', {
                templateUrl: '../AngularViews/ProfitandLoss/Profit_&_Loss.html?v=' + AppVersion,
                controller: 'PNLController'
            }).when('/XReports', {
                templateUrl: '../AngularViews/ProfitandLoss/XReports.html?v=' + AppVersion,
                controller: 'PNLController'
            }).when('/Sindx', {
                templateUrl: '../AngularViews/Admin/Setup/SetupIndex.html?v=' + AppVersion,
                controller: 'AdminController'
            }).when('/Setup_Cust', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Cust.html?v=' + AppVersion,
                controller: 'CustomerController'
            }).when('/Setup_Rest', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Rest.html?v=' + AppVersion,
                controller: 'EntityController'
            }).when('/Setup_CreateEntity', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_CreateRest.html?v=' + AppVersion,
                controller: 'EntityController'
            }).when('/Setup_Location', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Location.html?v=' + AppVersion,
                controller: 'LocationController'
            }).when('/Setup_User', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_User.html?v=' + AppVersion,
                controller: 'UserCreationController'
            }).when('/Setup_UserList', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_UserList.html?v=' + AppVersion,
                controller: 'UserCreationController'
            }).when('/Setup_Branch', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Branch.html?v=' + AppVersion,
                controller: 'BranchController'
            }).when('/Setup_Area', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Area.html?v=' + AppVersion,
                controller: 'AreaController'
            }).when('/Setup_Area_Mapping', {
                templateUrl: '../AngularViews/Admin/Setup/Setup_Area_Mapping.html?v=' + AppVersion,
                controller: 'AreaBranchMapController'
            }).when('/Setup_Cash', {
                templateUrl: '../AngularViews/Admin/Cashup/Setup_cashup.html?v=' + AppVersion,
                controller: 'AdminController'
            }).when('/Cashup_session_mapping', {
                templateUrl: '../AngularViews/Admin/Cashup/Cashup_session_mapping.html?v=' + AppVersion,
                controller: 'SessionMappingController'
            }).when('/Cashup_Till', {
                templateUrl: '../AngularViews/Admin/Cashup/Cashup_Till.html?v=' + AppVersion,
                controller: 'TillController'
            }).when('/Setup_HR', {
                templateUrl: '../AngularViews/Admin/HR/Setup_HR.html?v=' + AppVersion,
                controller: 'AdminController'
            }).when('/HR_Cost_Center', {
                templateUrl: '../AngularViews/Admin/HR/HR_Cost_Center.html?v=' + AppVersion,
                controller: 'CostCenterController'
            }).when('/Setup_Wefyle', {
                templateUrl: '../AngularViews/Admin/Wefyle/Setup_Wefyle.html?v=' + AppVersion,
                controller: 'AdminController'
            }).when('/rle_lst', {
                templateUrl: '../AngularViews/Admin/RoleList.html?v=' + AppVersion,
                controller: 'RoleController'
            }).when('/Adrl', {
                templateUrl: '../AngularViews/Admin/AddRole.html?v=' + AppVersion,
                controller: 'RoleController'
            }).when('/Grp_Map', {
                templateUrl: '../AngularViews/Admin/AddGroup.html?v=' + AppVersion,
                controller: 'GroupController'
            }).when('/Grp', {
                templateUrl: '../AngularViews/Admin/GroupList.html?v=' + AppVersion,
                controller: 'GroupController'
            }).when('/Ass_Grp', {
                templateUrl: '../AngularViews/Admin/AddAssignGroup.html?v=' + AppVersion,
                controller: 'AssignController'
            }).when('/Ass_Grp_lst', {
                templateUrl: '../AngularViews/Admin/AssignGroupList.html?v=' + AppVersion,
                controller: 'AssignController'
            }).when('/Employee_Category', {
                templateUrl: '../AngularViews/Admin/HR/Employee_Category.html?v=' + AppVersion,
                controller: 'EmpCatController'
            }).when('/Employee_Sub_Category', {
                templateUrl: '../AngularViews/Admin/HR/Employee_Sub_Category.html?v=' + AppVersion,
                controller: 'SubEmpCatController'
            }).when('/Contract_Type', {
                templateUrl: '../AngularViews/Admin/HR/Contract_Type.html?v=' + AppVersion,
                controller: 'ContractController'
            }).when('/WorkPatternList', {
                templateUrl: '../AngularViews/Admin/HR/WorkPatternList.html?v=' + AppVersion,
                controller: 'WorkPatternController'
            }).when('/WorkPattern', {
                templateUrl: '../AngularViews/Admin/HR/WorkPattern.html?v=' + AppVersion,
                controller: 'WorkPatternController'
            }).when('/NoticePeriod', {
                templateUrl: '../AngularViews/Admin/HR/Notice_Period.html?v=' + AppVersion,
                controller: 'NoticePeriodController'
            }).when('/Nationality', {
                templateUrl: '../AngularViews/Admin/HR/Nationality.html?v=' + AppVersion,
                controller: 'NationalityController'
            }).when('/National_ID_Type', {
                templateUrl: '../AngularViews/Admin/HR/National_ID_Type.html?v=' + AppVersion,
                controller: 'NationalityIDController'
            }).when('/EmergencyContactRelationship', {
                templateUrl: '../AngularViews/Admin/HR/EmergencyContactRelationship.html?v=' + AppVersion,
                controller: 'EmergencyContactRelationshipController'
            }).when('/Shift', {
                templateUrl: '../AngularViews/Admin/HR/Shift.html?v=' + AppVersion,
                controller: 'ShiftController'
            }).when('/Pay_Frequency', {
                templateUrl: '../AngularViews/Admin/HR/Pay_Frequency.html?v=' + AppVersion,
                controller: 'PayFrequencyController'
            }).when('/Cource', {
                templateUrl: '../AngularViews/Admin/HR/Cource_Name.html?v=' + AppVersion,
                controller: 'CourceController'
            }).when('/HolidayEntitlement', {
                templateUrl: '../AngularViews/Admin/HR/HolidayEntitlement.html?v=' + AppVersion,
                controller: 'HolidayEntitlementController'
            }).when('/Paid_By', {
                templateUrl: '../AngularViews/Admin/HR/Paid_By.html?v=' + AppVersion,
                controller: 'PaidByController'
            }).when('/Pay_Code', {
                templateUrl: '../AngularViews/Admin/HR/Pay_Code.html?v=' + AppVersion,
                controller: 'PayCodeController'
            }).when('/Payment_Type', {
                templateUrl: '../AngularViews/Admin/HR/Payment_Type.html?v=' + AppVersion,
                controller: 'PaymentTypeController'
            }).when('/Absence_Type', {
                templateUrl: '../AngularViews/Admin/HR/Absence_Type.html?v=' + AppVersion,
                controller: 'AbsenceTypeController'
            }).when('/PensionSch', {
                templateUrl: '../AngularViews/Admin/HR/Pension_Schema.html?v=' + AppVersion,
                controller: 'PensionSchController'
            }).when('/Units', {
                templateUrl: '../AngularViews/Admin/HR/Units.html?v=' + AppVersion,
                controller: 'UnitController'
            }).when('/Work_Permit_Type', {
                templateUrl: '../AngularViews/Admin/HR/Work_Permit_Type.html?v=' + AppVersion,
                controller: 'WorkTypeController'
            }).when('/Document_Type', {
                templateUrl: '../AngularViews/Admin/HR/Document_Type.html?v=' + AppVersion,
                controller: 'DocumentTypeController'
            }).when('/Setup_Fields', {
                templateUrl: '../AngularViews/Admin/HR/Setup_Fields.html?v=' + AppVersion,
                controller: 'SetupFieldsController'
            }).when('/Setup_Fields_Mapping', {
                templateUrl: '../AngularViews/Admin/HR/Setup_Fields_Mapping.html?v=11' + AppVersion,
                controller: 'SetupFieldsController'
            }).when('/TerminationReason', {
                templateUrl: '../AngularViews/Admin/HR/TerminationReason.html?v=' + AppVersion,
                controller: 'TerminationReasonController'
            }).when('/AssetType', {
                templateUrl: '../AngularViews/Admin/HR/Asset_Type.html?v=' + AppVersion,
                controller: 'AssetTypeController'
            }).when('/EditPersonal', {
                templateUrl: '../AngularViews/HR/ViewEmployee/EditPersonal.html?v=3' + AppVersion,
                controller: 'PersonalController'
            }).when('/Setup_Page_Header', {
                templateUrl: '../AngularViews/Admin/HR/Setup_Page_Header.html?v=' + AppVersion,
                controller: 'SetupPageHeaderController'
            }).when('/Page_Header', {
                templateUrl: '../AngularViews/Admin/HR/Page_Header.html?v=' + AppVersion,
                controller: 'SetupPageHeaderController'
            }).when('/Pay_F_EN', {
                templateUrl: '../AngularViews/Admin/HR/Pay_frequency_Entity_Mapping.html?v=' + AppVersion,
                controller: 'PayFreqEnitiyMapController'
            }).when('/Paid_By_EN', {
                templateUrl: '../AngularViews/Admin/HR/Paid_By_Entity_Mapping.html?v=' + AppVersion,
                controller: 'PaidByEnitiyMapController'
            }).when('/Dpt_Lst', {
                templateUrl: '../AngularViews/Hr/Department/DepartmentList.html?v=1' + AppVersion,
                controller: 'DepartmentListController'
            }).when('/Pst_Lst', {
                templateUrl: '../AngularViews/Hr/AddPosition/PositionList.html?v=1' + AppVersion,
                controller: 'PositionListController'
            }).when('/Ent_Setting', {
                templateUrl: '../AngularViews/Admin/Setup/EntitySetting.html?v=' + AppVersion,
                controller: 'SettingController'
            }).when('/Cashup_Tabs', {
                templateUrl: '../AngularViews/Admin/Cashup/Cashup_Tabs.html?v=' + AppVersion,
                controller: 'CashupTabsController'
            }).when('/Branchstaff_Tabs', {
                templateUrl: '../AngularViews/Admin/Cashup/Branch_Staff.html?v=' + AppVersion,
                controller: 'BranchstafftabsController'
            }).when('/PDQ', {
                templateUrl: '../AngularViews/Admin/Cashup/PDQ.html?v=' + AppVersion,
                controller: 'PDQController'
            }).when('/CPMM', {
                templateUrl: '../AngularViews/Admin/Cashup/Cashup_Payment_Method_Mapping.html?v=' + AppVersion,
                controller: 'CashupPaymentMappingController'
            }).when('/Reasonfor_Complimentary', {
                templateUrl: '../AngularViews/Admin/Cashup/Reasonfor_Complimentary.html?v=' + AppVersion,
                controller: 'ReasonforComplimentaryController'
            }).when('/ReasonforVOID', {
                templateUrl: '../AngularViews/Admin/Cashup/Reasonfor_VOID.html?v=' + AppVersion,
                controller: 'ReasonforVOIDController'
            }).when('/PettyCashMapping', {
                templateUrl: '../AngularViews/Admin/Cashup/Petty_cash_mapping.html?v=' + AppVersion,
                controller: 'PettyCashMappingController'
            }).when('/SessionMappingCovers', {
                templateUrl: '../AngularViews/Admin/Cashup/SessionMappingCovers.html?v=' + AppVersion,
                controller: 'SessionMappingCoversController'
            }).when('/PettyCash', {
                templateUrl: '../AngularViews/Admin/Cashup/Petty_cash.html?v=' + AppVersion,
                controller: 'PettyCashController'
            }).when('/Hrdeclaration', {
                templateUrl: '../AngularViews/Admin/HR/HRdeclaration.html?v=' + AppVersion,
                controller: 'HrdeclarationController'
            }).when('/ShiftType', {
                templateUrl: '../AngularViews/Admin/HR/ShiftType.html?v=' + AppVersion,
                controller: 'ShiftTypeController'
            }).when('/FalloutReport', {
                templateUrl: '../AngularViews/Admin/FalloutReport/FalloutReports.html?v=' + AppVersion,
                controller: 'FalloutReportsController'
            }).when('/MarkermanFalloutReport', {
                templateUrl: '../AngularViews/Admin/FalloutReport/MarkermanFalloutReports.html?v=' + AppVersion,
                controller: 'MarkermanFalloutReportsController'
            }).when('/EmailFallout', {
                templateUrl: '../AngularViews/Admin/FalloutReport/EmailFallout.html?v=' + AppVersion,
                controller: 'EmailFalloutController'
            }).when('/ReportIndex', {
                templateUrl: '../AngularViews/Admin/FalloutReport/ReportIndex.html?v=' + AppVersion,
                controller: 'AdminController'
            }).when('/RequestIndex', {
                templateUrl: '../AngularViews/Admin/Request/RequestIndex.html?v=' + AppVersion,
                controller: 'RequestFormController'
            }).when('/CustomerIntegration', {
                templateUrl: '../AngularViews/Admin/CustomerIntegration.html?v=1' + AppVersion,
                controller: 'CustomerIntegrationController'
            }).when('/BIDashBoardIndex', {
                templateUrl: '../AngularViews/Reports/BIDashBoardIndex.html?v=' + AppVersion,
                controller: 'BIDashBoardController'
            }).when('/RPT', {
                templateUrl: '../AngularViews/Reports/ReportIndex.html?v=' + AppVersion,
                controller: 'ReportsController'
            }).when('/RPT_LIGHT_SPEED', {
                templateUrl: '../AngularViews/Reports/LightSpeed.html?v=' + AppVersion,
                controller: 'LightSpeedController'
            }).when('/A_Month_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Area_Month_View.html?v=' + AppVersion,
                controller: 'EmployeeWeekViewController'
            }).when('/Employee_Leave_List', {
                templateUrl: '../AngularViews/HR/Scheduler/Employee_Leave_List.html?v=1' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/Employee_Leave_details', {
                templateUrl: '../AngularViews/HR/Scheduler/Employee_Leave_details.html?v=1' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/Support', {
                templateUrl: '../AngularViews/Admin/Support.html?v=' + AppVersion,
                controller: 'SupportRequestController'
            }).when('/TASK_M', {
                templateUrl: '../AngularViews/TaskManagment/TaskManagment.html?v=' + AppVersion,
                controller: 'TaskManagmentController'
            }).when('/Report_Mapping', {
                templateUrl: '../AngularViews/Admin/Setup/Report_Mapping.html?v=' + AppVersion,
                controller: 'ReportMappingController'
            }).when('/AddApplicant', {
                templateUrl: '../AngularViews/HR/AddApplicant/Applicant.html?v=' + AppVersion,
                controller: 'InviteApplicantController'
            }).when('/EmpSignUp', {
                templateUrl: '../AngularViews/CommonView/InviteEmp.html?v=' + AppVersion,
                controller: 'InviteApplicantController'
            }).when('/BasicInfo', {
                templateUrl: '../AngularViews/AccountSetting/BasicInfo.html?v=' + AppVersion,
                controller: 'BasicInfoController'
            }).when('/Setup_NICategory', {
                templateUrl: '../AngularViews/Admin/HR/Setup_NICategory.html?v=' + AppVersion,
                controller: 'NICategoryController'
            }).when('/Rota_Shifts', {
                templateUrl: '../AngularViews/HR/Scheduler/Rota_Shifts.html?v=' + AppVersion,
                controller: 'EmployeeWeekViewController'
            }).when('/Rota_Approval', {
                templateUrl: '../AngularViews/HR/Scheduler/Rota_Approval.html?v=18' + AppVersion,
                controller: 'RotaLockViewController'
            }).when('/Revenue_Settings', {
                templateUrl: '../AngularViews/HR/Scheduler/Revenue_Settings.html?v=' + AppVersion,
                controller: 'New_AreaWeekViewController'
            }).when('/Time_of_Schedule', {
                templateUrl: '../AngularViews/HR/Scheduler/Time_of_Schedule.html?v=113' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/A_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Area_Week_View_New.html?v=50' + AppVersion,
                controller: 'New_AreaWeekViewController'
            }).when('/E_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/E_Week_View_New.html?v=32' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/Emp_A_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Area_Week_View_New.html?v=' + AppVersion,
                controller: 'New_AreaWeekViewController'
            }).when('/Emp_E_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/E_Week_View_New.html?v=15' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/C_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Compact_Rota_View.html?v=5' + AppVersion,
                controller: 'NewEmployeeWeekViewController'
            }).when('/AC_Week_View', {
                templateUrl: '../AngularViews/HR/Scheduler/A_Compact_Rota_View.html?v=1' + AppVersion,
                controller: 'New_AreaWeekViewController'
            }).when('/E_Day_View', {
                templateUrl: '../AngularViews/HR/Scheduler/Employee_Day_View.html?v=' + AppVersion,
                controller: 'DayViewController'
            }).when('/PosDptEmpBulkUpload', {
                templateUrl: '../AngularViews/HR/PosDptEmpBulkUpload.html?v=' + AppVersion,
                controller: 'BulkUploadController'
            }).when('/Resources', {
                templateUrl: '../AngularViews/Resources/Resources.html?v=1' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/blog_des', {
                templateUrl: '../AngularViews/Resources/blog_des.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Scanning_Process', {
                templateUrl: '../AngularViews/Resources/Scanning_Process.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Approval_Max', {
                templateUrl: '../AngularViews/Resources/Approval_Max.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Telleroo', {
                templateUrl: '../AngularViews/Resources/Telleroo.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Process_Documents', {
                templateUrl: '../AngularViews/Resources/Process_Documents.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Wefyle_User_Manual', {
                templateUrl: '../AngularViews/Resources/Wefyle_User_Manual.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Employee_Onboard_Guide', {
                templateUrl: '../AngularViews/Resources/Employee_Onboard_Guide.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Cash_Handling', {
                templateUrl: '../AngularViews/Resources/Cash_Handling.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Client_Onboarding_Checklist', {
                templateUrl: '../AngularViews/Resources/Client_Onboarding_Checklist.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/autoentry', {
                templateUrl: '../AngularViews/Resources/autoentry.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Cash_Up_User_Manual', {
                templateUrl: '../AngularViews/Resources/Cash_Up_User_Manual.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Add_New_Resources', {
                templateUrl: '../AngularViews/Resources/Add_New_Resources.html?v=2' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Accounts_Training', {
                templateUrl: '../AngularViews/Resources/Accounts_Training.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Holiday_Comms', {
                templateUrl: '../AngularViews/Resources/Holiday_Comms.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Other_Process', {
                templateUrl: '../AngularViews/Resources/Other_Process.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Payroll_Training', {
                templateUrl: '../AngularViews/Resources/Payroll_Training.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/Power_BI_Training', {
                templateUrl: '../AngularViews/Resources/Power_BI_Training.html?v=' + AppVersion,
                controller: 'ResourcesInfoController'
            }).when('/EntLeave', {
                templateUrl: '../AngularViews/HR/EntLeaveAssignEmp.html?v=1' + AppVersion,
                controller: 'EntLeaveAssignEmpController'
            }).when('/VendorOnboarding', {
                templateUrl: '../AngularViews/HR/AddApplicant/VendorOnboarding.html?v=' + AppVersion,
                controller: 'VendorOnboardingController'
            }).when('/GenRateToken', {
                templateUrl: '../AngularViews/CommonView/Generatetoken.html?v=' + AppVersion,
                controller: 'TokenController'
            }).when('/BUDGET_UPLOAD', {
                templateUrl: '../AngularViews/Budget/Budget_Upload.html?v=' + AppVersion,
                controller: 'BudgetController'
            }).when('/View_Budget', {
                templateUrl: '../AngularViews/Budget/View_Budget.html?v=' + AppVersion,
                controller: 'BudgetController'
            }).when('/Budget_Index', {
                templateUrl: '../AngularViews/Budget/Budget.html?v=' + AppVersion,
                controller: 'BudgetController'
            }).when('/AuthlgtSpeed_L', {
                templateUrl: '../AngularViews/CommonView/AuthprozeLightSpeed_L.html?v=' + AppVersion,
                controller: 'LoginController'
            }).when('/PKCE', {
                templateUrl: '../AngularViews/Admin/Cashup/PKCE.html?v=' + AppVersion,
                controller: 'PKCEController'
            }).when('/Covers_Upload', {
                templateUrl: '../AngularViews/Cashup/Covers_Upload.html?v=' + AppVersion,
                controller: 'CoversController'
            }).when('/Covers_View', {
                templateUrl: '../AngularViews/Cashup/View_Covers.html?v=' + AppVersion,
                controller: 'CoversController'
            }).when('/Cash_Banking', {
                templateUrl: '../AngularViews/Cashup/CashBanking/Cash_Banking.html?v=4' + AppVersion,
                controller: 'CashBankinglistController'
            }).when('/Cash_Banking_View', {
                templateUrl: '../AngularViews/Cashup/CashBanking/Cash_Banking_Read_only.html?v=4' + AppVersion,
                controller: 'CashBankinglistController'
            }).when('/Cashup_Invoice', {
                templateUrl: '../AngularViews/Cashup/CashBanking/Cashup_Invoice.html?v=4' + AppVersion,
                controller: 'CashBankinglistController'
            }).when('/Cash_Banking_Edit', {
                templateUrl: '../AngularViews/Cashup/CashBanking/Cash_Banking_Edit.html?v=2' + AppVersion,
                controller: 'CashBankingInsUpdController'
            }).when('/Cash_changes', {
                templateUrl: '../AngularViews/CashUp/Cash.html?v=7' + AppVersion,
                //templateUrl: '../AngularViews/CashUp/cash-changes.html?v=5' + AppVersion,
                controller: 'CashController'
            }).when('/CD', {
                templateUrl: '../AngularViews/CashUp/Cash_Deposits.html?v=9' + AppVersion,
                controller: 'DepositsAddListController'
            }).when('/DepositUpload', {
                templateUrl: '../AngularViews/CashUp/Deposit_Upload.html?v=9' + AppVersion,
                controller: 'DepositsUploadController'
            }).when('/CV', {
                templateUrl: '../AngularViews/CashUp/Cash_Voucher.html?v=9' + AppVersion,
                controller: 'VoucherAddListController'
            }).when('/VoucherUpload', {
                templateUrl: '../AngularViews/CashUp/Voucher_Upload.html?v=9' + AppVersion,
                controller: 'VoucherUploadController'
            })
            .when('/Voucher', {
                templateUrl: '../AngularViews/CashUp/Voucher.html?v=9' + AppVersion,
                controller: 'DepositsAddListController'
            }).when('/AD', {
                templateUrl: '../AngularViews/CashUp/Add_Deposits.html?v=4' + AppVersion,
                controller: 'AddDepositsController'
            }).when('/CME', {
                templateUrl: '../AngularViews/Cashup/Cash_Multiple_Entry.html?v=1' + AppVersion,
                controller: 'CashBankinglistController'
            }).when('/CashupIntegrationFallouts', {
                templateUrl: '../AngularViews/Admin/FalloutReport/CashupIntegrationFallouts.html?v=' + AppVersion,
                controller: 'CashupIntegrationFalloutsController'
            }).when('/BranchCategories', {
                templateUrl: '../AngularViews/Admin/Setup/BranchCategories.html?v=' + AppVersion,
                controller: 'BranchCategoriesController'
            }).when('/BranchCategoriesMapping', {
                templateUrl: '../AngularViews/Admin/Setup/BranchCategoriesMapping.html?v=' + AppVersion,
                controller: 'BranchCategoriesMappingController'
            }).when('/Statement', {
                templateUrl: '../AngularViews/Payment/Statement.html?v=4' + AppVersion,
                controller: 'Pay_StatementController'
            }).when('/Statement_View', {
                templateUrl: '../AngularViews/Payment/Statement_View.html?v=3' + AppVersion,
                controller: 'Pay_StatementViewController'
            }).when('/Invoice', {
                templateUrl: '../AngularViews/Payment/Invoice.html?v=31' + AppVersion,
                controller: 'Pay_InvoiceController'
            }).when('/Schedule_Payments', {
                templateUrl: '../AngularViews/Payment/Schedule_Payments.html?v=' + AppVersion,
                controller: 'PaymentController'
            }).when('/Approvals', {
                templateUrl: '../AngularViews/Payment/Approvals.html?v=12' + AppVersion,
                controller: 'Pay_ApprovalsController'
            }).when('/Approvals_View', {
                templateUrl: '../AngularViews/Payment/Approvals_View.html?v=42' + AppVersion,
                controller: 'Pay_ApprovalsViewController'
            }).when('/Reconcile', {
                templateUrl: '../AngularViews/Payment/Reconcile.html?v=2' + AppVersion,
                controller: 'Pay_StatementReconcileController'
            }).when('/My_Schedule', {
                templateUrl: '../AngularViews/Payment/MySchedule.html?v=12' + AppVersion,
                controller: 'Pay_MySchedulesController'
            }).when('/Supplier_Details', {
                templateUrl: '../AngularViews/Payment/Supplier_Details.html?v=12' + AppVersion,
                controller: 'Pay_ContactController'
            }).when('/Request', {
                templateUrl: '../AngularViews/Payment/Request.html?v=4' + AppVersion,
                controller: 'Pay_RequestController'
            }).when('/Request_Statement', {
                templateUrl: '../AngularViews/Payment/Request_Statement.html?v=4' + AppVersion,
                controller: 'Pay_RequestStateController'
            }).when('/Send_to_Supplier', {
                templateUrl: '../AngularViews/Payment/Send_to_Supplier.html?v=' + AppVersion,
                controller: 'PaymentController'
            }).when('/Dashboard', {
                templateUrl: '../AngularViews/Payment/Dashboard.html?v=10' + AppVersion,
                controller: 'Pay_DashboardController'
            }).when('/View_Schedule', {
                templateUrl: '../AngularViews/Payment/View_Schedule.html?v=1' + AppVersion,
                controller: 'Pay_ViewSchedularController'
            }).when('/MicrosDataUpload', {
                templateUrl: '../AngularViews/Admin/Cashup/MicrosDataUpload.html?v=' + AppVersion,
                controller: 'MicrosDataUploadController'
            }).when('/RevenuesUploades', {
                templateUrl: '../AngularViews/HR/Scheduler/Revenue/RevenuesUploades.html?v=5' + AppVersion,
                controller: 'RevenuesUploadesController'
            }).when('/Daily', {
                templateUrl: '../AngularViews/HR/Scheduler/Revenue/DailySalesList.html?v=6' + AppVersion,
                controller: 'RevenuesDailyFileController'
            }).when('/Forecast', {
                templateUrl: '../AngularViews/HR/Scheduler/Revenue/ForecastList.html?v=3' + AppVersion,
                controller: 'RevenuesForecastFileController'
            }).when('/Clock_In_Out', {
                templateUrl: '../AngularViews/HR/Clock_In_Out.html?v=8' + AppVersion,
                controller: 'Clock_In_OutController'
            }).when('/Budget', {
                templateUrl: '../AngularViews/HR/Scheduler/Revenue/BudgetList.html?v=' + AppVersion,
                controller: 'RevenuesBudgetFileController'
            }).when('/IntegrationMapping', {
                templateUrl: '../AngularViews/Admin/Setup/IntegrationMapping.html?v=' + AppVersion,
                controller: 'IntegrationMappingController'
            }).when('/IntegrationSearch', {
                templateUrl: '../AngularViews/Admin/Setup/IntegrationSearch.html?v=' + AppVersion,
                controller: 'IntegrationSearchController'
            }).when('/IntegrationCategoryMapping', {
                templateUrl: '../AngularViews/Admin/Setup/XeroCategoryMapping.html?v=' + AppVersion,
                controller: 'IntegrationCategoryMappingController'
            }).when('/MM_Categories', {
                templateUrl: '../AngularViews/Admin/Setup/MM_Categories.html?v=' + AppVersion,
                controller: 'MM_CategoriesController'
            }).when('/Message', {
                templateUrl: '../AngularViews/Admin/Setup/Message.html?v=' + AppVersion,
                controller: 'MessageController'
            }).when('/Currency_Setup', {
                templateUrl: '../AngularViews/Admin/Setup/Currency_Setup.html?v=' + AppVersion,
                controller: 'CurrencyConversionController'
            }).when('/Currency_Conversion', {
                templateUrl: '../AngularViews/Admin/Setup/Currency_Conversion.html?v=' + AppVersion,
                controller: 'CurrencyConversionController'
            }).when('/Currency_Conversion_View', {
                templateUrl: '../AngularViews/Admin/Setup/Currency_Conversion_View.html?v=' + AppVersion,
                controller: 'CurrencyConversionViewController'
            }).when('/SalesValidation', {
                templateUrl: '../AngularViews/SalesValidation/SellsValidationIndex.html?v=' + AppVersion,
                controller: 'SalesValidationController'
            }).when('/SalesData', {
                templateUrl: '../AngularViews/SalesValidation/Sales_Invoice.html?v=' + AppVersion,
                controller: 'SalesValidationDataController'
            }).when('/InventoryIndex', {
                templateUrl: '../AngularViews/Inventory/InventoryIndex.html?v=' + AppVersion,
                controller: 'InventoryController'
            }).when('/HDR', {
                templateUrl: '../AngularViews/Inventory/Hospitality_Dashboard_Reporting.html?v=2' + AppVersion,
                controller: 'InventoryController'
            }).when('/AT', {
                templateUrl: '../AngularViews/Inventory/Analytics_Table.html?v=2' + AppVersion,
                controller: 'InventoryController'
            }).when('/InvRec_List', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_List.html?v=6' + AppVersion,
                controller: 'InvRecListController'
            }).when('/InvRec_Upload', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/Invoice_Recon_Upload.html?v=32' + AppVersion,
                controller: 'InvUploadController'
            }).when('/InvRec_ContactMapp', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_ContactMapping.html?v=24' + AppVersion,
                controller: 'InvContactMappController'
            }).when('/InvRec_Conflict', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Conflict.html?v=25' + AppVersion,
                controller: 'InvConflictController'
            }).when('/InvRec_Reconcile', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Reconcile.html?v=124' + AppVersion,
                controller: 'InvRecReconcileController'
            }).when('/InvRec_AccrualStp', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Accrual_Setup.html?v=34' + AppVersion,
                controller: 'InvAccrualSetupController'
            }).when('/InvRec_AccrualJV', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Accrual_JV.html?v=29' + AppVersion,
                controller: 'InvAccrualJVController'
            }).when('/InvRec_PrepaymentStp', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Prepayment_Setup.html?v=24' + AppVersion,
                controller: 'InvRecPrepayment_Setup'
            }).when('/InvRec_Prepayment_JV', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Prepayment_JV.html?v=30' + AppVersion,
                controller: 'InvRec_Prepayment_JV_Controller'
            }).when('/InvRec_Finalize', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/InvRec_Finalize.html?v=27' + AppVersion,
                controller: 'InvRec_FinalizeController'
            }).when('/Inv_Upload_File_Details', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/Invoice_Recon_Upload_File_Details.html?v=5' + AppVersion,
                controller: 'InvRecordController'
            }).when('/Status_Dtls', {
                templateUrl: '../AngularViews/SalesValidation/Status_Dtls.html?v=1' + AppVersion,
                controller: 'InvRecordController'
            }).when('/Recon_Settings', {
                templateUrl: '../AngularViews/SalesValidation/Invoice_Recon/Recon_Settings.html?v=7' + AppVersion,
                controller: 'ReconSettingsController'
            }).when('/Rota_Lock', {
                templateUrl: '../AngularViews/HR/Scheduler/Rota_Locking.html?v=2' + AppVersion,
                controller: 'RotaLockViewController'
            }).when('/EPOS_Validations', {
                templateUrl: '../AngularViews/SalesValidation/EPOS_Validations.html?v=2' + AppVersion,
                controller: 'RotaLockViewController'
            }).when('/EPOS_Validations_View', {
                templateUrl: '../AngularViews/SalesValidation/EPOS_Validations_View.html?v=2' + AppVersion,
                controller: 'EPOSValidationViewController'
            }).when('/EPOS_Validations_Entry', {
                templateUrl: '../AngularViews/SalesValidation/EPOS_Validations_Entry.html?v=2' + AppVersion,
                controller: 'EPOS_Validation_EntryController'
            }).when('/Reconcile', {
                templateUrl: '../AngularViews/SalesValidation/Reconcile.html?v=1' + AppVersion,
                controller: 'InvRecordController'
            }).when('/Reconcile1', {
                templateUrl: '../AngularViews/SalesValidation/Reconcile1.html?v=1' + AppVersion,
                controller: 'InvRecordController'
            }).when('/Reconcile2', {
                templateUrl: '../AngularViews/SalesValidation/Reconcile2.html?v=1' + AppVersion,
                controller: 'InvRecordController'
            }).when('/DRL', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Landing.html?v=34' + AppVersion,
                controller: 'RevenueController'
            }).when('/DRDA', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Detailed_Analytics.html?v=17' + AppVersion,
                controller: 'RevenueAnalyticsController'
            }).when('/PR', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Payroll_Reports.html?v=9' + AppVersion,
                controller: 'PayrollDshBtController'
            }).when('/TR', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Takings_Review.html?v=10' + AppVersion,
                controller: 'TakingReviewController'
            }).when('/NSS', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Net_Sales_Summary.html?v=9' + AppVersion,
                controller: 'NSSController'
            }).when('/Consolidated_Revenue_Dashboard', {
                templateUrl: '../AngularViews/Dashboard/Revenue/Consolidated_Revenue_Dashboard.html?v=11' + AppVersion,
                controller: 'ConsolidatedRevenueController'
            }).when('/Cogs', {
                templateUrl: '../AngularViews/Dashboard/Cogs/Cogs.html?v=4' + AppVersion,
                controller: 'CogsDshBtController'
            }).when('/PNL_Dasboard_Upload', {
                templateUrl: '../AngularViews/Dashboard/PNL/PNL_Dasboard_Upload.html?v=5' + AppVersion,
                controller: 'PNLDshBtUploadController'
            }).when('/Client_Desk', {
                templateUrl: '../AngularViews/HR/Scheduler/Client_Desk.html?v=' + AppVersion,
                controller: 'New_AreaWeekViewController'
            }).when('/MP', {
                templateUrl: '../AngularViews/Dashboard/Cogs/Menu_Profitability.html?v=3' + AppVersion,
                controller: 'ProfitabilityDshBtController'
            }).when('/Purchases', {
                templateUrl: '../AngularViews/Dashboard/Cogs/Purchases.html?v=2' + AppVersion,
                controller: 'PurchasesController'
            }).when('/PR_Request', {
                templateUrl: '../AngularViews/P2P/PO/Purchase_Request.html?v=36' + AppVersion,
                controller: 'PurchaseRequestController'
            }).when('/Requisition', {
                templateUrl: '../AngularViews/P2P/REQ/Requisition.html?v=109' + AppVersion,
                controller: 'REQController'
            }).when('/Purchase_Order', {
                templateUrl: '../AngularViews/P2P/PO/Purchase_Order.html?v=39' + AppVersion,
                controller: 'POController'
            }).when('/Request_Approvals', {
                templateUrl: '../AngularViews/P2P/Approval/Request_Approvals.html?v=40' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/PO_Approvals', {
                templateUrl: '../AngularViews/P2P/Approval/PO_Approvals.html?v=51' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/Bill_Approvals', {
                templateUrl: '../AngularViews/P2P/Approval/Bill_Approvals.html?v=83' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/Bill_View', {
                templateUrl: '../AngularViews/P2P/Approval/Bill_Approvals_View.html?v=60' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/Budget', {
                templateUrl: '../AngularViews/P2P/Approval/Budget.html?v=60' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/WFS', {
                templateUrl: '../AngularViews/P2P/Approval_Chain/WorkflowSetup.html?v=' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/WFL', {
                templateUrl: '../AngularViews/P2P/Approval_Chain/WorkflowList.html?v=' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/WFA', {
                templateUrl: '../AngularViews/P2P/Approval_Chain/Approval_Workflows.html?v=' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/Approval_Chain', {
                templateUrl: '../AngularViews/P2P/Approval_Chain/Approval_Chain.html?v=' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/Approval_Matrix', {
                templateUrl: '../AngularViews/P2P/Approval/Approval_Matrix.html?v=' + AppVersion,
                controller: 'PurchaseRequestApprovalController'
            }).when('/CommonIntegrationMapping', {
                templateUrl: '../AngularViews/Admin/Setup/CommonIntegration.html?v=' + AppVersion,
                controller: 'CommonIntegrationMappingController'
            }).when('/Setup_NoShowReason', {
                templateUrl: '../AngularViews/Admin/HR/Setup_NoShowReason.html?v=' + AppVersion,
                controller: 'NoShowReasonController'
            }).when('/EposSales_Categoty_Mapping', {
                templateUrl: '../AngularViews/Admin/Setup/EposSalesCategotyMapping.html?v=' + AppVersion,
                controller: 'EposSalesCategotyMappingController'
            }).when('/PI_Landing', {
                templateUrl: '../AngularViews/PowerInsight/Landing/PowerInsightLanding.html?v=29' + AppVersion,
                controller: 'PI_LandingController'
            }).when('/PI_Sales_Summary', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Sales_Summary.html?v=9' + AppVersion,
                controller: 'PI_Sales_SummaryController'
            }).when('/PI_Product_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Product_Analysis.html?v=9' + AppVersion,
                controller: 'PI_Product_AnalysisController'
            }).when('/PI_Detailed_Sales_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Detailed_Sales_Analysis.html?v=17' + AppVersion,
                controller: 'PI_Detailed_Sales_AnalysisController'
            }).when('/PI_Daily_Weekly_Flash', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Daily_Weekly_Flash.html?v=7' + AppVersion,
                controller: 'PI_Daily_Weekly_FlashController'
            }).when('/PI_Covers', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Covers.html?v=11' + AppVersion,
                controller: 'PI_CoversController'
            }).when('/PI_Sales_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Sales_Analysis.html?v=10' + AppVersion,
                controller: 'PI_CoversController'
            }).when('/PI_Comps_Voids_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Comps_Void.html?v=12' + AppVersion,
                controller: 'PI_Comps_VoidController'
            }).when('/PI_Consolidated_Sales', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Consolidated_merged.html?v=9' + AppVersion,
                controller: 'PI_Consolidated_SalesController'
            }).when('/PI_COGS_Summary', {
                templateUrl: '../AngularViews/PowerInsight/COGS/COGS_Summary.html?v=4' + AppVersion,
                controller: 'PI_COGS_SummaryController'
            }).when('/PI_Purchase_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/COGS/Purchase_Analysis.html?v=2' + AppVersion,
                controller: 'PI_Purchase_AnalysisController'
            }).when('/PI_Performance_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/COGS/Performance_Analysis.html?v=1' + AppVersion,
                controller: 'PI_Performance_AnalysisController'
            }).when('/PI_Wastage_Analysis', {
                templateUrl: '../AngularViews/PowerInsight/COGS/Wastage_Analysis.html?v=4' + AppVersion,
                controller: 'PI_Wastage_AnalysisController'
            }).when('/PI_Menu_Profitability', {
                templateUrl: '../AngularViews/PowerInsight/COGS/Menu_Profitability.html?v=1' + AppVersion,
                controller: 'PI_Menu_ProfitabilityController'
            }).when('/PI_Staff_Food_Cost', {
                templateUrl: '../AngularViews/PowerInsight/COGS/Staff_Food_Cost.html?v=' + AppVersion,
                controller: 'PI_Staff_Food_CostController'
            }).when('/PI_Staff_Summary', {
                templateUrl: '../AngularViews/PowerInsight/Staff/Staff_Summary.html?v=1' + AppVersion,
                controller: 'PI_Staff_SummaryController'
            }).when('/PI_Headcount_Overview', {
                templateUrl: '../AngularViews/PowerInsight/Staff/Headcount_Overview.html?v=' + AppVersion,
                controller: 'PI_Headcount_OverviewController'
            }).when('/PI_Staff_Cost', {
                templateUrl: '../AngularViews/PowerInsight/Staff/Staff_Cost.html?v=' + AppVersion,
                controller: 'PI_Staff_CostController'
            }).when('/PI_Weekly_P_L', {
                templateUrl: '../AngularViews/PowerInsight/Profit/Weekly_P_L.html?v=3' + AppVersion,
                controller: 'PI_Weekly_P_LController'
            }).when('/PI_TopBottom_Sellers', {
                templateUrl: '../AngularViews/PowerInsight/Sales/TopBottom_Sellers.html?v=3' + AppVersion,
                controller: 'PI_TopBottom_SellersController'
            }).when('/Addmind_Report', {
                templateUrl: '../AngularViews/PowerInsight/Profit/Addmind_Report.html?v=3' + AppVersion,
                controller: 'PI_Weekly_P_LController'
            }).when('/PNL_Upload_DTSH', {
                templateUrl: '../AngularViews/PowerInsight/Profit/PNL_Dasboard_Upload.html?v=8' + AppVersion,
                controller: 'PNLDshBtUploadController'
            }).when('/EPOS_Category_Mapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/EPOS_Category_Mapping.html?v=' + AppVersion,
                controller: 'PI_Comps_VoidController'
            }).when('/Inside_Page', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/Inside_Page.html?v=' + AppVersion,
                controller: 'PI_Comps_VoidController'
            }).when('/ControlPanel', {
                //--Start control panel--//
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/ControlPanel.html?v=' + AppVersion,
                controller: 'MappingController'
            }).when('/Ctrl_Cat_Mapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/Cat_Mapping.html?v=' + AppVersion,
                controller: 'CategotyMappingController'
            }).when('/Ctrl_Subscription_Mapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/SubscriptionMapping.html?v=3' + AppVersion,
                controller: 'SubscriptionMappingController'
            }).when('/Ctrl_BranchCoversSettingForPowerInsightMapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/BranchCoverMapping.html?v=2' + AppVersion,
                controller: 'BranchCoversSettingForPowerInsightMappingController'
            }).when('/Chart_Subscription', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/Chart_Subscription.html?v=2' + AppVersion,
                controller: 'ReservationMappingController'
            }).when('/Ctrl_ReservationMapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/ReservationMapping.html?v=2' + AppVersion,
                controller: 'ReservationMappingController'
            }).when('/Ctrl_InventoryMapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/EposInventoryMapping.html?v=2' + AppVersion,
                controller: 'InventoryMappingController'
            }).when('/Ctrl_RevenueReservationMapping', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/RevenuewithReservationMapping.html?v=2' + AppVersion,
                controller: 'RevenuewithReservationMappingController'
            }).when('/Ctrl_RevenueCenterSorting', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/RevenueCenterSorting.html?v=2' + AppVersion,
                controller: 'RevenueCenterSortingController'
            }).when('/Opening_Hours', {
                templateUrl: '../AngularViews/PowerInsight/Control_Panel/Opening_Hours.html?v=2' + AppVersion,
                controller: 'OpeningHoursController'
            }).when('/Mapping_index', {
                templateUrl: '../AngularViews/Mapping/Mapping.html?v=2' + AppVersion,
                controller: 'MappingController'
            }).when('/CategoryMapping', {
                templateUrl: '../AngularViews/Mapping/SalesCategotyMapping.html?v=2' + AppVersion,
                controller: 'CategotyMappingController'
            }).when('/SubscriptionMapping', {
                templateUrl: '../AngularViews/Mapping/SubscriptionMapping.html?v=2' + AppVersion,
                controller: 'SubscriptionMappingController'
            }).when('/BranchCoversSettingForPowerInsightMapping', {
                templateUrl: '../AngularViews/Mapping/BranchCoverMapping.html?v=2' + AppVersion,
                controller: 'BranchCoversSettingForPowerInsightMappingController'
            }).when('/ReservationMapping', {
                templateUrl: '../AngularViews/Mapping/ReservationMapping.html?v=2' + AppVersion,
                controller: 'ReservationMappingController'
            }).when('/Epos_Integration_Notification', {
                templateUrl: '../AngularViews/Mapping/Epos_Integration_Notification.html?v=123' + AppVersion,
                controller: 'EposIntegrationNotificationController'
            }).when('/Epos_Integration_Documentation', {
                templateUrl: '../AngularViews/Mapping/Epos_Integration_Documentation.html?v=123' + AppVersion,
                controller: 'EposIntegrationDocumentationController'
            }).when('/P2PContact', {
                templateUrl: '../AngularViews/P2P/Invoice/ContactList.html?v=123' + AppVersion,
                controller: 'ContactListController'
            }).when('/P2PAP', {
                templateUrl: '../AngularViews/P2P/AP/Account_Payable.html?v=123' + AppVersion,
                controller: 'APController'
            }).when('/Credit_Note', {
                templateUrl: '../AngularViews/P2P/Memo/CreditNotes.html?v=123' + AppVersion,
                controller: 'CreditNotesController'
            }).when('/Basic_Details', {
                templateUrl: '../AngularViews/HumanResource/Lets_Start/Basic_Details.html?v=1' + AppVersion,
                controller: 'BasicDetailsController'
            }).when('/Enter_Sites', {
                templateUrl: '../AngularViews/HumanResource/Lets_Start/Enter_Sites.html?v=1' + AppVersion,
                controller: 'EntitySiteController'
            }).when('/Enter_Departments', {
                templateUrl: '../AngularViews/HumanResource/Lets_Start/Enter_Departments.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Enter_Positions', {
                templateUrl: '../AngularViews/HumanResource/Lets_Start/Enter_Positions.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Invite_Personal_Details', {
                templateUrl: '../AngularViews/HumanResource/Invite_Applicant/Invite_Personal_Details.html?v=1' + AppVersion,
                controller: 'InvitePersonalDetailsController'
            }).when('/Invite_Contact_Details', {
                templateUrl: '../AngularViews/HumanResource/Invite_Applicant/Invite_Contact_Details.html?v=1' + AppVersion,
                controller: 'InviteContactDetailsController'
            }).when('/Invite_Other_Details', {
                templateUrl: '../AngularViews/HumanResource/Invite_Applicant/Invite_Other_Details.html?v=1' + AppVersion,
                controller: 'InviteOtherDetailsController'
            }).when('/Invite_Emergency_Contact', {
                templateUrl: '../AngularViews/HumanResource/Invite_Applicant/Invite_Emergency_Contact.html?v=1' + AppVersion,
                controller: 'InviteEmergencyDetailsController'
            }).when('/Invite_Payment_Details', {
                templateUrl: '../AngularViews/HumanResource/Invite_Applicant/Invite_Payment_Details.html?v=1' + AppVersion,
                controller: 'InvitePaymentDetailsController'
            }).when('/Manager_Dashboard', {
                templateUrl: '../AngularViews/HumanResource/Dashboard/Manager_Dashboard.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Employee_Dashboard', {
                templateUrl: '../AngularViews/HumanResource/Dashboard/Employee_Dashboard.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Organisation', {
                templateUrl: '../AngularViews/HumanResource/Admin/Organisation.html?v=1' + AppVersion,
                controller: 'OrganisationController'
            }).when('/General', {
                templateUrl: '../AngularViews/HumanResource/Admin/General.html?v=1' + AppVersion,
                controller: 'GeneralController'
            }).when('/Access', {
                templateUrl: '../AngularViews/HumanResource/Admin/Access.html?v=1' + AppVersion,
                controller: 'AccessController'
            }).when('/Users', {
                templateUrl: '../AngularViews/HumanResource/Admin/Users.html?v=1' + AppVersion,
                controller: 'UsersController'
            }).when('/Work_Pattern', {
                templateUrl: '../AngularViews/HumanResource/Admin/Work_Pattern.html?v=1' + AppVersion,
                controller: 'WorkPatternsController'
            }).when('/Edit_Work_Pattern', {
                templateUrl: '../AngularViews/HumanResource/Admin/Edit_Work_Pattern.html?v=1' + AppVersion,
                controller: 'SettingController'
            }).when('/Schedule_Admin', {
                templateUrl: '../AngularViews/HumanResource/Admin/Schedule_Admin.html?v=1' + AppVersion,
                controller: 'ScheduleController'
            }).when('/Punch_Clock', {
                templateUrl: '../AngularViews/HumanResource/Admin/Punch_Clock.html?v=1' + AppVersion,
                controller: 'PunchClockController'
            }).when('/Absence', {
                templateUrl: '../AngularViews/HumanResource/Admin/Absence.html?v=1' + AppVersion,
                controller: 'AbsenceController'
            }).when('/Payroll_Admin', {
                templateUrl: '../AngularViews/HumanResource/Admin/Payroll_Admin.html?v=1' + AppVersion,
                controller: 'PayrollController'
            }).when('/Reporting_Admin', {
                templateUrl: '../AngularViews/HumanResource/Admin/Reporting_Admin.html?v=1' + AppVersion,
                controller: 'ReportingController'
            }).when('/Integration', {
                templateUrl: '../AngularViews/HumanResource/Admin/Integration.html?v=1' + AppVersion,
                controller: 'IntegrationController'
            }).when('/Manage_Employees', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Manage_Employees.html?v=1' + AppVersion,
                controller: 'ManageHRController'
            }).when('/Employee_List', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Employee_List.html?v=1' + AppVersion,
                controller: 'EmployeeListController'
            }).when('/PrimaryDetails', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/PrimaryDetails.html?v=1' + AppVersion,
                controller: 'EmpPrimaryDetailsController'
            }).when('/EmploymentInfo', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/EmploymentInfo.html?v=1' + AppVersion,
                controller: 'EmpEmploymentInfoController'
            }).when('/Wages', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Wages.html?v=1' + AppVersion,
                controller: 'EmpWagesController'
            }).when('/EmpAbsences', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Absences.html?v=1' + AppVersion,
                controller: 'EmpAbsencesController'
            }).when('/EmpAccess', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Access.html?v=1' + AppVersion,
                controller: 'EmpAccessController'
            }).when('/Document', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Document.html?v=1' + AppVersion,
                controller: 'EmpDocumentController'
            }).when('/Assets', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Assets.html?v=1' + AppVersion,
                controller: 'EmpAssetsController'
            }).when('/Qualificaiton', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Qualificaiton.html?v=1' + AppVersion,
                controller: 'EmpQualificaitonController'
            }).when('/Notes', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Employee/Notes.html?v=1' + AppVersion,
                controller: 'EmpNotesController'
            }).when('/UserJR', {
                templateUrl: '../AngularViews/HumanResource/UserJourney.html?v=1' + AppVersion,
                controller: 'UserJRController'
            }).when('/Approve_manager_rota', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/ApproveSchedule.html?v=1' + AppVersion,
                controller: 'ApproveScheduleController'
            }).when('/Bulk_Update', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Bulk_Update.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Wages', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Wages.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Bulk_Update_Manager', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Bulk_Update_Manager.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Manager', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Manager.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Record_Absence', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Record_Absence.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Absences', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Absences.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Terminate', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Terminate.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Terminations', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Terminations.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Holiday_Entitlement', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Holiday_Entitlement.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Holiday_Entitlements', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Holiday_Entitlements.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Set_Access', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Set_Access.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Accesses', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Accesses.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Assign_Work_Pattern', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Assign_Work_Pattern.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Preview_And_Update_Accesses_Work_Pattern', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Preview_And_Update_Accesses_Work_Pattern.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/EmpReports', {
                templateUrl: '../AngularViews/HumanResource/Reports/Reports.html?v=1' + AppVersion,
                controller: 'EmpReportingController'
            }).when('/Report_Payroll', {
                templateUrl: '../AngularViews/HumanResource/Reports/Report_Payroll.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Labour_Variance', {
                templateUrl: '../AngularViews/HumanResource/Reports/Labour_Variance.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Absence_Tracker', {
                templateUrl: '../AngularViews/HumanResource/Reports/Absence_Tracker.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Holiday_Allowance', {
                templateUrl: '../AngularViews/HumanResource/Reports/Holiday_Allowance.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Leaver_Balance', {
                templateUrl: '../AngularViews/HumanResource/Reports/Leaver_Balance.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/UAR', {
                templateUrl: '../AngularViews/HumanResource/Reports/User_Access_Report.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/EOSR', {
                templateUrl: '../AngularViews/HumanResource/Reports/End_Of_Service_Report.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/HRM_My_Leaves', {
                templateUrl: '../AngularViews/HumanResource/Manage_Leaves/Manage_Leaves.html?v=1' + AppVersion,
                controller: 'ManageLeaveController'
            }).when('/Feeds', {
                templateUrl: '../AngularViews/HumanResource/Feeds/Feeds.html?v=1' + AppVersion,
                controller: 'FEEDSController'
            }).when('/Personal_Details', {
                templateUrl: '../AngularViews/HumanResource/Manage_Employees/Personal_Details.html?v=1' + AppVersion,
                controller: 'ManageHRController'
            }).when('/QR_Code', {
                templateUrl: '../AngularViews/HumanResource/QR_Code/QR_Code.html?v=1' + AppVersion,
                controller: 'PunchHRMClockController'
            }).when('/HRM_Schedule', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Scheduler.html?v=3' + AppVersion,
                controller: 'EmpSchedulerController'
            }).when('/Schedule_By_Department', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_By_Department.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_By_Position_Than_Person', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_By_Position_Than_Person.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_By_Position', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_By_Position.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_By_Department_Then_Section', {
                templateUrl: '../AngularViews/HumanResource/ScheSchedulerdule/Schedule_By_Department_Then_Section.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_Day_View', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_Day_View.html?v=2' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_Day_View_Department', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_Day_View_Department.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_Day_View_Position_then_Person', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_Day_View_Position_then_Person.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Schedule_Day_View_Department_Then_Section', {
                templateUrl: '../AngularViews/HumanResource/Scheduler/Schedule_Day_View_Department_Then_Section.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Services_monitoring', {
                templateUrl: '../AngularViews/HumanResource/Services_monitoring.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Cashup_Basic_Details', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Basic_Details/Basic_Details.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Cashup_Enter_Sites', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Basic_Details/Enter_Sites.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Enter_Methods', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Basic_Details/Enter_Methods.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Enter_Areas', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Basic_Details/Enter_Areas.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Enter_Sessions', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Basic_Details/Enter_Sessions.html?v=1' + AppVersion,
                controller: 'HRDashboardController'
            }).when('/Cashup_Organisation', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_Organisation.html?v=1' + AppVersion,
                controller: 'OrganisationController'
            }).when('/Cashup_General', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_General.html?v=1' + AppVersion,
                controller: 'CashUpGeneralController'
            }).when('/Cashup_User', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_User.html?v=1' + AppVersion,
                controller: 'CashupUserListController'
            }).when('/Add_Cashup_User', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Add_Cashup_User.html?v=1' + AppVersion,
                controller: 'CashUpUsersController'
            }).when('/Cashup_Setup', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_Setup.html?v=1' + AppVersion,
                controller: 'SetupController'
            }).when('/CashUpApp_Cashup_Upload', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_Upload.html?v=1' + AppVersion,
                controller: 'DataUploadController'
            }).when('/Cashup_Integration', {
                templateUrl: '../AngularViews/CashUpApp/Admin/Cashup_Integration.html?v=1' + AppVersion,
                controller: 'IntegrationController' 
            }).when('/Cashup_Dashboard', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Dashboard.html?v=1' + AppVersion,
                controller: 'CashupAppDashboardController'
            }).when('/Cashup_Register', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Entry/Cashup_Register.html?v=1' + AppVersion,
                controller: 'CashupRegisterController'
            }).when('/CashUpApp_Entry', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Entry/Cashup_Entry.html?v=1' + AppVersion,
                controller: 'CashupEntryController'
            }).when('/Cashup_Entry_Actual_Reviews', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Entry/Cashup_Entry_Actual_Reviews.html?v=1' + AppVersion,
                controller: 'ReviewActualsController'
            }).when('/CashUpApp_ePOS_upload', {
                templateUrl: '../AngularViews/CashUpApp/Data_Upload/ePOS_upload.html?v=1' + AppVersion,
                controller: 'EPOSEntryController'
            }).when('/CashUpApp_covers_upload', {
                templateUrl: '../AngularViews/CashUpApp/Data_Upload/covers_upload.html?v=1' + AppVersion,
                controller: 'CoverEntryController'
            }).when('/CashUpApp_petty_cash_upload', {
                templateUrl: '../AngularViews/CashUpApp/Data_Upload/petty_cash_upload.html?v=1' + AppVersion,
                controller: 'PettyCashEntryController'
            }).when('/CashUpApp_float_upload', {
                templateUrl: '../AngularViews/CashUpApp/Data_Upload/float_upload.html?v=1' + AppVersion,
                controller: 'FlaotEntryController'
            }).when('/CashUpApp_Account_Credit_Management', {
                templateUrl: '../AngularViews/CashUpApp/Recievables/Account_Credit_Management.html?v=1' + AppVersion,
                controller: 'AccountCreditMgtController'
            }).when('/CashUpApp_Voucher_Management', {
                templateUrl: '../AngularViews/CashUpApp/Recievables/Voucher_Management.html?v=1' + AppVersion,
                controller: 'VoucherMgtController'
            }).when('/CashUpApp_Deposit_Management', {
                templateUrl: '../AngularViews/CashUpApp/Recievables/Deposit_Management.html?v=1' + AppVersion,
                controller: 'DepositMgtController'
            }).when('/CashUpApp_Cash_Banking', {
                templateUrl: '../AngularViews/CashUpApp/Cash_Banking.html?v=1' + AppVersion,
                controller: 'CashBankingController'
            }).when('/CashUpApp_Reports_Daily_Cashup', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Daily_Cashup.html?v=1' + AppVersion,
                controller: 'CashupReportsDailyController'
            }).when('/CashUpApp_Reports_Weekly_Cashup', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Weekly_Cashup.html?v=1' + AppVersion,
                controller: 'CashupReportsWeeklyController'
            }).when('/CashUpApp_Reports_Weekly_Sales', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Weekly_Sales.html?v=1' + AppVersion,
                controller: 'CashupReportsWeeklySalesController'
            }).when('/CashUpApp_Reports_Cash_Banking', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Cash_Banking.html?v=1' + AppVersion,
                controller: 'CashupReportsCashbankingController'
            }).when('/CashUpApp_Reports_Account_Customer', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Account_Customer.html?v=1' + AppVersion,
                controller: 'CashupReportsAccountCustomerController'
            }).when('/CashUpApp_Reports_Cashup_Deposit', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Cashup_Deposit.html?v=1' + AppVersion,
                controller: 'CashupReportsDepositController'
            }).when('/Reports_Petty_Cash', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Petty_Cash.html?v=1' + AppVersion,
                controller: 'CashupReportsPettyCashController'
            }).when('/CashUpApp_Reports_Voucher', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Voucher.html?v=1' + AppVersion,
                controller: 'CashupReprotsVoucherController'
            }).when('/CashUpApp_Reports_Comps', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Comps.html?v=1' + AppVersion,
                controller: 'CashupReportCompsController'
            }).when('/CashUpApp_Reports_Voids', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Voids.html?v=1' + AppVersion,
                controller: 'CashupReportsVoidsController'
            }).when('/CashUpApp_Reports_Float', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Float.html?v=1' + AppVersion,
                controller: 'CashupReportsFloatController'
            }).when('/CashUpApp_Reports_Total_Cash', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Total_Cash.html?v=1' + AppVersion,
                controller: 'CashupReportsTotalCashController'
            }).when('/CashUpApp_Reports_Comments', {
                templateUrl: '../AngularViews/CashUpApp/Cashup_Reports/Reports_Comments.html?v=1' + AppVersion,
                controller: 'CashupReportsCommentsController'
            }).when('/CashUpApp_Cash', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Cash.html?v=1' + AppVersion,
                controller: 'CashController'
            }).when('/CashUpApp_Account', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Account.html?v=1' + AppVersion,
                controller: 'AccountController'
            }).when('/CashUpApp_Cards', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Cards.html?v=1' + AppVersion,
                controller: 'CardsController'
            }).when('/CashUpApp_Complimentary', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Complimentary.html?v=1' + AppVersion,
                controller: 'ComplimentaryController'
            }).when('/CashUpApp_Delivery', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Delivery.html?v=1' + AppVersion,
                controller: 'DeliveryController'
            }).when('/CashUpApp_Deposits', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Deposits.html?v=1' + AppVersion,
                controller: 'DepositsController'
            }).when('/CashUpApp_PettyCash', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/PettyCash.html?v=1' + AppVersion,
                controller: 'PettyCashController'
            }).when('/CashUpApp_Review', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Review.html?v=1' + AppVersion,
                controller: 'ReviewController'
            }).when('/CashUpApp_Vouchers', {
                templateUrl: '../AngularViews/CashupApp/Cashup_Entry/Vouchers.html?v=1' + AppVersion,
                controller: 'VouchersController'
            }).when('/Cashup_Users_Setting_Landing', {
                templateUrl: '../AngularViews/CashupApp/Setting_Landing_Page.html?v=1' + AppVersion,
                controller: 'SettingLandingPageController'
            }).when('/OpenAIChatBot', {
                templateUrl: '../AngularViews/PowerInsight/OpenAI/OpenAIChatBot.html?v=1' + AppVersion,
                controller: 'PI_OPENAIController'
            }).when('/Chatbox', {
                templateUrl: '../AngularViews/PowerInsight/Sales/Chatbox.html?v=1' + AppVersion,
                controller: 'PI_OPENAIController'
            });

        $locationProvider.html5Mode(false).hashPrefix('!');
    }]);