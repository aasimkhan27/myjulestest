using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HR_Integration.S4Labour
{
   public class S4LabourModel
    {
        public class Root_Nationalities
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public int Region { get; set; }
        }
        public class Root_Genders
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_MaritalStatus
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_Sites
        {
            public int ID { get; set; }
            public string Name { get; set; }
            public string OtherRef { get; set; }
            public string SiteCode { get; set; }
        }
        public class Root_SiteLevelPositions
        {
            public int ID { get; set; }
            public int PositionID { get; set; }
            public string Name { get; set; }
            public int OrgPosID { get; set; }
            public string OtherRef { get; set; }
        }
        public class Root_OrganisationPositions
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_PayTypes
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_Titles
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_DocumentTypes
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }        
        public class Root_Employee
        {
            public int EmployeeID { get; set; }
            public string WorkingPattern { get; set; }
            public string ContractType { get; set; }
            public int SiteID { get; set; }
            public string StartDate { get; set; }
            public decimal ContractedHours { get; set; }
            public decimal ContractedDays { get; set; }
            public decimal? ContractedHolidays { get; set; }
            public int Position { get; set; }
            public int PayType { get; set; }
            public decimal? PayRate { get; set; }
            public decimal? UpperRate { get; set; }
            public bool FixedHours { get; set; }
            public string Forename { get; set; }
            public string Surname { get; set; }
            public string DateOfBirth { get; set; }
            public int Gender { get; set; }
            public int MaritalStatus { get; set; }
            public string sessionID { get; set; }
            public int Title { get; set; }
            public string Initial { get; set; }
            public string KnownAs { get; set; }
            public string EmployeeNumber { get; set; }
            public string NINumber { get; set; }
            public string EmailAddress { get; set; }
            public string PhoneNumber { get; set; }
            public string MobileNumber { get; set; }
            public int? Nationality { get; set; }
            public string Address1 { get; set; }
            public string Address2 { get; set; }
            public string Address3 { get; set; }
            public string Address4 { get; set; }
            public string Postcode { get; set; }
            public string Country { get; set; }
            public string Information { get; set; }
            public string Bank { get; set; }
            public string BuildingSocietyNo { get; set; }
            public string AccountName { get; set; }
            public string AccountNumber { get; set; }
            public string SortCode { get; set; }
            public string ICEContact { get; set; }
            public string ICERelationship { get; set; }
            public string ICEPhoneNumber { get; set; }
            public string AdditionalField1 { get; set; }
            public string AdditionalField2 { get; set; }
            public string AdditionalField3 { get; set; }
            public string AdditionalField4 { get; set; }
            public bool CanLogin { get; set; }
            public bool Overtime { get; set; }
        }
        public class Root_PayrollExport
        {
            public int EmployeeID { get; set; }
            public string EmployeeNumber { get; set; }
            public string FirstName { get; set; }
            public string LasttName { get; set; }
            public string DOB { get; set; }
            public string StartDate { get; set; }
            public string Information { get; set; }
            public string LocationCode { get; set; }
            public string Location { get; set; }
            public string Division { get; set; }
            public string JobTitle { get; set; }
            public string PayType { get; set; }
            public decimal PayRate { get; set; }
            public string TerminationDate { get; set; }
            public string Message { get; set; }
            public string SiteCode { get; set; }
            public int S4SiteID { get; set; }
            public int EmployeeShiftID { get; set; }
            public string EmailAddress { get; set; }
        }
        public class Root_Login
        {
            public string SessionID { get; set; }
            public string UserName { get; set; }
            public bool CanWrite { get; set; }
            public object UserID { get; set; }
            public object EmployeeID { get; set; }
            public bool IsManagerial { get; set; }
            public bool IsHR { get; set; }
            public object CalledName { get; set; }
            public bool HasS4TAP { get; set; }
            public object AppVersion { get; set; }
            public string Message { get; set; }
        }
        public class Root_Organisations
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_OrganisationsLevelPosition
        {
            public int ID { get; set; }
            public string Name { get; set; }
        }
        public class Root_StartersAndLeavers
        {
            public int PhysicalSiteID { get; set; }
            public string SiteCode { get; set; }
            public string Site { get; set; }
            public string EmployeeName { get; set; }
            public string EmployeeNumber { get; set; }
            public int EmployeeID { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public string Type { get; set; }
            public string ReasonForLeaving { get; set; }
            public DateTime? ActionedDate { get; set; }
            public decimal LeavingHoliday { get; set; }
        }
        public class Root_OrganisationAdditionalPay
        {
            public int IncrID { get; set; }
            public int EmployeeID { get; set; }
            public string PayrollNumber { get; set; }
            public string NINumber { get; set; }
            public string SiteCode { get; set; }
            public string SiteName { get; set; }
            public decimal CCTips { get; set; }
            public decimal SP { get; set; }
        }
        public class Root_Amended_Forecast
        {
            public int IncrID { get; set; }
            public int ShiftID { get; set; }
            public int EmployeeID { get; set; }
            public string PayrollNumber { get; set; }
            public string NINumber { get; set; }
            public string SiteCode { get; set; }
            public string SiteName { get; set; }
            public DateTime ShiftStart { get; set; }
            public DateTime? ShiftEnd { get; set; }
            public string AbsenceCode { get; set; }
            public int SiteID { get; set; }
            public int OrganisationID { get; set; }
        }
        public class Root_ActualPayrollShifts
        {
            public string Position { get; set; }
            public int IncrID { get; set; }
            public int ShiftID { get; set; }
            public int EmployeeID { get; set; }
            public string PayrollNumber { get; set; }
            public string NINumber { get; set; }
            public string SiteCode { get; set; }
            public string SiteName { get; set; }
            public DateTime ShiftStart { get; set; }
            public DateTime? ShiftEnd { get; set; }
            public string AbsenceCode { get; set; }
            public int SiteID { get; set; }
            public int OrganisationID { get; set; }
        }

    }
}
