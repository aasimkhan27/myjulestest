using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace EPOS_Integration.TOAST
{
    class TOAST_MODAL
    {
        public DataTable _Datatable1 { get; set; }
        public DataTable _Datatable2 { get; set; }
        public DataTable _Datatable3 { get; set; }
        public DataTable _Datatable4 { get; set; }
        public DataTable _Datatable5 { get; set; }

        public class ModifierSelectionDetail
        {
            public string Location { get; set; } 
            public string OrderId { get; set; } 
            public int OrderNumber { get; set; } 
            public DateTime SentDate { get; set; } 
            public DateTime OrderDate { get; set; } 
            public string CheckId { get; set; } 
            public string Server { get; set; } 
            public string Table { get; set; } 
            public string DiningArea { get; set; }
            public string Service { get; set; } 
            public string DiningOption { get; set; } 
            public string ItemSelectionId { get; set; } 
            public string ModifierId { get; set; }
            public string MasterId { get; set; } 
            public string ModifierSKU { get; set; } 
            public string ModifierPLU { get; set; } 
            public string Modifier { get; set; } 
            public string OptionGroupId { get; set; } 
            public string OptionGroupName { get; set; } 
            public string ParentMenuSelectionItemId { get; set; } 
            public string ParentMenuSelection { get; set; } 
            public string SalesCategory { get; set; } 
            public decimal GrossPrice { get; set; } 
            public decimal Discount { get; set; } 
            public decimal NetPrice { get; set; } 
            public int Quantity { get; set; } 
            public bool IsVoid { get; set; } 
            public string VoidReasonId { get; set; } 
            public string VoidReason { get; set; }
        }

        public class ItemSelectionDetail
        {
            public string Location { get; set; }
            public string OrderId { get; set; }
            public int OrderNumber { get; set; }
            public DateTime SentDate { get; set; }
            public DateTime OrderDate { get; set; }
            public string CheckId { get; set; }
            public string Server { get; set; }
            public string Table { get; set; }
            public string DiningArea { get; set; }
            public string Service { get; set; }
            public string DiningOption { get; set; }
            public string ItemSelectionId { get; set; }
            public string ItemId { get; set; }
            public string MasterId { get; set; }
            public string SKU { get; set; }
            public string PLU { get; set; }
            public string MenuItem { get; set; }
            public string MenuSubgroups { get; set; }
            public string MenuGroup { get; set; }
            public string Menu { get; set; }
            public string SalesCategory { get; set; }
            public decimal GrossPrice { get; set; }
            public decimal Discount { get; set; }
            public decimal NetPrice { get; set; }
            public int Quantity { get; set; }
            public decimal Tax { get; set; }
            public bool IsVoid { get; set; }
            public bool IsDeferred { get; set; }
            public bool IsTaxExempt { get; set; }
            public string TaxInclusionOption { get; set; }
            public string DiningOptionTax { get; set; }
            public string TabName { get; set; }
        }

        public class OrderDetail
        {
            public string Location { get; set; }
            public string OrderId { get; set; }
            public int OrderNumber { get; set; }
            public int Checks { get; set; }
            public DateTime Opened { get; set; }
            public int NumberOfGuests { get; set; }
            public string TabNames { get; set; }
            public string Server { get; set; }
            public string Table { get; set; }
            public string RevenueCenter { get; set; }
            public string DiningArea { get; set; }
            public string Service { get; set; }
            public string DiningOptions { get; set; }
            public decimal DiscountAmount { get; set; }
            public decimal Amount { get; set; }
            public decimal Tax { get; set; }
            public decimal Tip { get; set; }
            public decimal Gratuity { get; set; }
            public decimal Total { get; set; }
            public bool Voided { get; set; }
            public DateTime? Paid { get; set; }
            public DateTime? Closed { get; set; }
            public string DurationOpenedToPaid { get; set; }
            public string OrderSource { get; set; }
        }

        public class PaymentDetail
        {
            public string Location { get; set; }
            public string PaymentId { get; set; }
            public string OrderId { get; set; }
            public int OrderNumber { get; set; }
            public DateTime PaidDate { get; set; }
            public DateTime OrderDate { get; set; }
            public string CheckId { get; set; }
            public int CheckNumber { get; set; }
            public string TabName { get; set; }
            public string Server { get; set; }
            public string Table { get; set; }
            public string DiningArea { get; set; }
            public string Service { get; set; }
            public string DiningOption { get; set; }
            public string HouseAccountNumber { get; set; }
            public decimal Amount { get; set; }
            public decimal Tip { get; set; }
            public decimal Gratuity { get; set; }
            public decimal Total { get; set; }
            public decimal SwipedCardAmount { get; set; }
            public decimal KeyedCardAmount { get; set; }
            public decimal AmountTendered { get; set; }
            public decimal Refunded { get; set; }
            public DateTime? RefundDate { get; set; }
            public decimal RefundAmount { get; set; }
            public decimal RefundTipAmount { get; set; }
            public string VoidUser { get; set; }
            public string VoidApprover { get; set; }
            public DateTime? VoidDate { get; set; }
            public string Status { get; set; }
            public string Type { get; set; }
            public string CashDrawer { get; set; }
            public string CardType { get; set; }
            public string OtherType { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Last4CardDigits { get; set; }
            public decimal VmcDFees { get; set; }
            public string RoomInfo { get; set; }
            public string Receipt { get; set; }
            public string Source { get; set; }
            public string Last4GiftCardDigits { get; set; }
            public string First5GiftCardDigits { get; set; }
        }


    }
}
