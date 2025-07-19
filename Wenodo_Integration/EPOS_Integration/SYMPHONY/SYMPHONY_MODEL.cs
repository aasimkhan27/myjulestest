using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.SIMPHONY
{
    public class SYMPHONY_MODEL
    {
        #region -- Simphony--
        public class Root_Signin
        {
            public string nextOp { get; set; }
            public bool success { get; set; }
            public string redirectUrl { get; set; }
        }
        public class Body_Parameterts
        {
            public string busDt { get; set; }
            public string locRef { get; set; }
        }
        // Root  getGuestChecks;
        public class DetailLine
        {
            public decimal guestCheckLineItemId { get; set; }
            public decimal? dtlOtNum { get; set; }
            public decimal? lineNum { get; set; }
            public decimal? dtlId { get; set; }
            public DateTime? detailUTC { get; set; }
            public DateTime? detailLcl { get; set; }
            public DateTime? lastUpdateUTC { get; set; }
            public DateTime? lastUpdateLcl { get; set; }
            public string busDt { get; set; }
            public decimal? wsNum { get; set; }
            public decimal? dspTtl { get; set; }
            public decimal? dspQty { get; set; }
            public decimal? aggTtl { get; set; }
            public decimal? aggQty { get; set; }
            public decimal? chkEmpId { get; set; }
            public decimal? chkEmpNum { get; set; }
            public decimal? svcRndNum { get; set; }
            public MenuItem menuItem { get; set; }
            public decimal? parDtlId { get; set; }
            public decimal? transEmpId { get; set; }
            public decimal? transEmpNum { get; set; }
            public TenderMedia tenderMedia { get; set; }
            public string refInfo1 { get; set; }
            public Other other { get; set; }
            public ServiceCharge serviceCharge { get; set; }
            public Discount discount { get; set; }
            public bool? doNotShowFlag { get; set; }
            public bool? errCorFlag { get; set; }
            public ErrorCorrect errorCorrect { get; set; }
            public decimal? mgrEmpId { get; set; }
            public decimal? mgrEmpNum { get; set; }
            public bool? vdFlag { get; set; }
            public decimal? rsnCodeNum { get; set; }
        }

        public class Discount
        {
            public decimal? dscNum { get; set; }
            public decimal? dscMiNum { get; set; }
            public string activeTaxes { get; set; }
            public int num { get; set; }
            public string name { get; set; }
            public decimal posPercent { get; set; }
        }
        public class ErrorCorrect
        {
            public decimal? type { get; set; }
            public decimal? objectNum { get; set; }
        }
        public class GuestCheck
        {
            public decimal guestCheckId { get; set; }
            public decimal chkNum { get; set; }
            public string opnBusDt { get; set; }
            public DateTime opnUTC { get; set; }
            public DateTime opnLcl { get; set; }
            public string clsdBusDt { get; set; }
            public DateTime? clsdUTC { get; set; }
            public DateTime? clsdLcl { get; set; }
            public DateTime? lastTransUTC { get; set; }
            public DateTime? lastTransLcl { get; set; }
            public DateTime? lastUpdatedUTC { get; set; }
            public DateTime? lastUpdatedLcl { get; set; }
            public bool clsdFlag { get; set; }
            public decimal? gstCnt { get; set; }
            public decimal subTtl { get; set; }
            public decimal? nonTxblSlsTtl { get; set; }
            public decimal? chkTtl { get; set; }
            public decimal? dscTtl { get; set; }
            public decimal? payTtl { get; set; }
            public decimal? balDueTtl { get; set; }
            public int rvcNum { get; set; }
            public Nullable<int> otNum { get; set; }
            public int tblNum { get; set; }
            public string tblName { get; set; }
            public int empNum { get; set; }
            public List<Taxis> taxes { get; set; }
            public List<DetailLine> detailLines { get; set; }
            public string xferStatus { get; set; }
            public decimal? xferToChkNum { get; set; }
            public decimal? svcChgTtl { get; set; }
            public decimal? tipTotal { get; set; }
            public string chkName { get; set; }
            public string chkRef { get; set; }
            public bool cancelFlag { get; set; }
            public int spltFrmChk { get; set; }
        }
        public class Other
        {
            public int detailType { get; set; }
            public int detailNum { get; set; }
        }
        public class Root_GetGuestChecks
        {
            public DateTime curUTC { get; set; }
            public string locRef { get; set; }
            public List<GuestCheck> guestChecks { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class MenuItem
        {
            public int miNum { get; set; }
            public string activeTaxes { get; set; }
            public int? prcLvl { get; set; }
            public int num { get; set; }
            public string name { get; set; }
            public string name2 { get; set; }
            public int majGrpNum { get; set; }
            public string majGrpName { get; set; }
            public int famGrpNum { get; set; }
            public string famGrpName { get; set; }
        }
        public class ServiceCharge
        {
            public int svcChgNum { get; set; }
            public int num { get; set; }
            public string name { get; set; }
            public decimal? posPercent { get; set; }
            public bool? chrgTipsFlag { get; set; }
            public bool? revFlag { get; set; }
        }
        public class Taxis
        {
            public int taxNum { get; set; }
            public decimal txblSlsTtl { get; set; }
            public decimal taxCollTtl { get; set; }
            public decimal taxRate { get; set; }
            public int type { get; set; }
            public int num { get; set; }
            public string name { get; set; }

        }
        public class TenderMedia
        {
            public int tmedNum { get; set; }
            public int num { get; set; }
            public string name { get; set; }
            public int type { get; set; }
        }
        public class OrderType
        {
            public int num { get; set; }
            public string name { get; set; }
        }
        public class Root_OrderType
        {
            public string locRef { get; set; }
            public DateTime curUTC { get; set; }
            public List<OrderType> orderTypes { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class ReasonCode
        {
            public int num { get; set; }
            public string name { get; set; }
        }
        public class Root_ReasonCode
        {
            public string locRef { get; set; }
            public List<ReasonCode> reasonCodes { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class RevenueCenter
        {
            public int num { get; set; }
            public string name { get; set; }
        }
        public class Root_RevenueCenter
        {
            public string locRef { get; set; }
            public DateTime curUTC { get; set; }
            public List<RevenueCenter> revenueCenters { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Root_ServiceCharge
        {
            public string locRef { get; set; }
            public List<ServiceCharge> serviceCharges { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Root_Taxis
        {
            public string locRef { get; set; }
            public List<Taxis> taxes { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Root_TenderMedia
        {
            public string locRef { get; set; }
            public List<TenderMedia> tenderMedias { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Root_MenuItem
        {
            public string locRef { get; set; }
            public DateTime curUTC { get; set; }
            public List<MenuItem> menuItems { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Employee
        {
            public int num { get; set; }
            public int employeeId { get; set; }
            public string fName { get; set; }
            public string lName { get; set; }
            public string payrollId { get; set; }
            public string homeLocRef { get; set; }
            public int classNum { get; set; }
            public string className { get; set; }
        }
        public class Root_Employee
        {
            public string locRef { get; set; }
            public List<Employee> employees { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }
        public class Root_Access_Token
        {
            public string id_token { get; set; }
            public string access_token { get; set; }
            public int expires_in { get; set; }
            public string token_type { get; set; }
            public string refresh_token { get; set; }
            public string scope { get; set; }
            public string error { get; set; }
            public string status { get; set; }
            public string message { get; set; }
            public string code { get; set; }
        }
        public class Root_Discount
        {
            public string locRef { get; set; }
            public List<Discount> discounts { get; set; }
            public string detail { get; set; }
            public int status { get; set; }
            public string type { get; set; }
            public string title { get; set; }
        }

        #endregion
    }
}
