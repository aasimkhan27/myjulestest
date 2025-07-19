using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.QUADRANET
{
    class QUADRANET_MODEL
    {      
        public class Root_Header
        {
            public string Brand { get; set; }
            public decimal? Siteid { get; set; }
            public string Sitename { get; set; }
            public decimal? BillHeaderID { get; set; }
            public decimal? CheckItemID { get; set; }
            public decimal? SplitNumber { get; set; }
            public decimal? Covers { get; set; }
            public decimal? ItemTotal { get; set; }
            public decimal? BillTotal { get; set; }
            public decimal? TaxTotal { get; set; }
            public decimal? ServiceCharge { get; set; }
            public decimal? ServicePercentage { get; set; }
            public decimal? DiscountTotal { get; set; }
            public string CustomerTable { get; set; }
            public DateTime? Date { get; set; }
            public string SessionName { get; set; }
            public decimal? SessionSortOrder { get; set; }
            public string ReportGroupName { get; set; }
            public DateTime? createdon { get; set; }
            public string Username { get; set; }
            public string ClosedByName { get; set; }
            public decimal? TerminalID { get; set; }
            public string TerminalName { get; set; }
            public DateTime? CheckClose { get; set; }
            public decimal? DwellTime { get; set; }
            public string BookingReference { get; set; }
            public string TopMessage { get; set; }
            public string Day { get; set; }
            public decimal? DaySort { get; set; }
            public string LoyaltySwipeID { get; set; }
        }         
        public class Root_Line
        {
            public string Brand { get; set; }
            public decimal? Siteid { get; set; }
            public string Sitename { get; set; }
            public decimal? BillHeaderID { get; set; }
            public decimal? CheckItemID { get; set; }
            public decimal? CheckDetailid { get; set; }
            public decimal? SplitNumber { get; set; }
            public string BookingReference { get; set; }
            public string ReportGroupName { get; set; }
            public string StationName { get; set; }
            public string LocationName { get; set; }
            public decimal? Covers { get; set; }
            public decimal? ItemTotal { get; set; }
            public decimal? BillTotal { get; set; }
            public decimal? TaxTotal { get; set; }
            public decimal? ServiceCharge { get; set; }
            public decimal? DiscountTotal { get; set; }
            public decimal? DepositTotal { get; set; }
            public string CustomerTable { get; set; }
            public string SessionName { get; set; }
            public string BillWaiter { get; set; }
            public string Description { get; set; }
            public string Message { get; set; }
            public string ClassName { get; set; }
            public string PFDescription { get; set; }
            public string CategoryName { get; set; }
            public string CategoryCode { get; set; }
            public string PLUCode { get; set; }
            public string Binnumber { get; set; }
            public decimal? Itemid { get; set; }
            public DateTime CreatedOn { get; set; }
            public DateTime Date { get; set; }
            public string Week { get; set; }
            public string Day { get; set; }
            public decimal? DaySort { get; set; }
            public string TerminalName { get; set; }
            public decimal? Systemuserid { get; set; }
            public string UserName { get; set; }
            public string BrandCode { get; set; }
            public decimal? ItemPercentage { get; set; }
            public string StockItemID { get; set; }
            public decimal? Quantity { get; set; }
            public decimal? CostPrice { get; set; }
            public decimal? MenuPrice { get; set; }
            public decimal? ItemsTotal { get; set; }
            public decimal? ItemsNet { get; set; }
            public decimal? Contribution { get; set; }
            public string RevenueCentreName { get; set; }
            public decimal PrixFixeAdjustment { get; set; }
            public decimal CompAdjustment { get; set; }
            public decimal SpecialPriceAdjustment { get; set; }
            public decimal OpenItem { get; set; }
            public string DeletedBeforePayment { get; set; }
            public decimal TaxAmount { get; set; }
            public string Status { get; set; }
            public decimal? Taxpercent { get; set; }
            public string PrixFixeID { get; set; }
            public string ParentCheckDetailId { get; set; }
            public string FirstCheckDetailId { get; set; }
            public decimal? Modeid { get; set; }
            public decimal? PrintProfileID { get; set; }
            public decimal? ModifierOnlyItem { get; set; }
            public string ReportingCategory1 { get; set; }
            public string ReportingCategory2 { get; set; }
            public decimal? QBRG { get; set; }
            public decimal? FriendlyOrderNo { get; set; }
            public decimal? MinimumSpend { get; set; }
            public decimal? OriginalServiceCharge { get; set; }
            public string FiscalReceiptNumber { get; set; }
            public decimal? CIModeID { get; set; }
            public string ParentItem { get; set; }
            public string loyaltyswipeid { get; set; }
            public string DiscountDescription { get; set; }
            public decimal? Key { get; set; }

        }       
        public class Root_Discount
        {
            public string Brand { get; set; }
            public decimal? Siteid { get; set; }
            public string Sitename { get; set; }
            public decimal? CheckItemid { get; set; }
            public decimal? CheckdetailId { get; set; }
            public decimal? SplitNumber { get; set; }
            public string RevenueCentreName { get; set; }
            public string ClassName { get; set; }
            public string CategoryName { get; set; }
            public string Description { get; set; }
            public decimal? Itemid { get; set; }
            public string PLUCODE { get; set; }
            public decimal? Quantity { get; set; }
            public decimal? MenuPrice { get; set; }
            public decimal? TotalPrice { get; set; }
            public decimal? DiscountValue { get; set; }
            public bool Comp { get; set; }
            public bool PF { get; set; }
            public bool SPL { get; set; }
            public bool Discount { get; set; }
            public bool OpenItem { get; set; }
            public bool DeletedBeforePayment { get; set; }
            public bool PricedNonItemModifier { get; set; }
            public bool PriceAdj { get; set; }
            public string DiscUserName { get; set; }
            public DateTime? Createdon { get; set; }
            public string Session { get; set; }
            public string TerminalName { get; set; }
            public string Location { get; set; }
            public string CustomertableID { get; set; }
            public string Report { get; set; }
            public string Notes { get; set; }
        }         
        public class Root_Payment
        {
            public string Brand { get; set; }
            public decimal? Siteid { get; set; }
            public string SiteName { get; set; }
            public decimal? BillheaderID { get; set; }
            public decimal? CheckitemID { get; set; }
            public decimal? PaymentType { get; set; }
            public string PaymentName { get; set; }
            public string CustomerTable { get; set; }
            public string LocationName { get; set; }
            public string TerminalName { get; set; }
            public DateTime? Paymenttime { get; set; }
            public string PaymentTakenByName { get; set; }
            public decimal? PaymentMethod { get; set; }
            public decimal? PaymentGroup { get; set; }
            public string PaymentGroupName { get; set; }
            public string Info { get; set; }
            public string Details { get; set; }
            public decimal? ServiceCharge { get; set; }
            public decimal? MethodTotal { get; set; }
            public decimal? Gratuity { get; set; }
            public decimal? PaymentTotal { get; set; }
            public decimal? Covers { get; set; }
            public string CoverType { get; set; }
            public string DepositOwner { get; set; }
            public decimal? DepositID { get; set; }
            public DateTime? EventDate { get; set; }
            public string SplitNumber { get; set; }
            public string ReceiptNumber { get; set; }
            public decimal? checkpaymentid { get; set; }
        }

        // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
        public class Root_Voids
        {
            public decimal Siteid { get; set; }
            public string Sitename { get; set; }
            public decimal BillHeaderID { get; set; }
            public decimal CheckItemID { get; set; }
            public decimal CheckDetailid { get; set; }
            public decimal SplitNumber { get; set; }
            public string ReportGroupName { get; set; }
            public string StationName { get; set; }
            public string LocationName { get; set; }
            public decimal ItemTotal { get; set; }
            public decimal BillTotal { get; set; }
            public decimal TaxTotal { get; set; }
            public decimal ServiceCharge { get; set; }
            public decimal DiscountTotal { get; set; }
            public decimal DepositTotal { get; set; }
            public string CustomerTable { get; set; }
            public string SessionName { get; set; }
            public string BillWaiter { get; set; }
            public string Description { get; set; }
            public string ClassName { get; set; }
            public string CategoryName { get; set; }
            public object PLUCode { get; set; }
            public DateTime CreatedOn { get; set; }
            public string TerminalName { get; set; }
            public string UserName { get; set; }
            public object BrandCode { get; set; }
            public decimal ItemPercentage { get; set; }
            public object StockItemID { get; set; }
            public decimal Quantity { get; set; }
            public decimal CostPrice { get; set; }
            public decimal MenuPrice { get; set; }
            public decimal ItemsTotal { get; set; }
            public string RevenueCentreName { get; set; }
            public decimal PrixFixeAdjustment { get; set; }
            public decimal CompAdjustment { get; set; }
            public decimal SpecialPriceAdjustment { get; set; }
            public decimal OpenItem { get; set; }
            public object DeletedBeforePayment { get; set; }
            public decimal TaxAmount { get; set; }
            public object Status { get; set; }
            public string ReasonText { get; set; }
            public string DeletedbyName { get; set; }
            public string ParentReasonText { get; set; }
            public object Message { get; set; }
            public string Closedbyname { get; set; }
        }


    }
}
