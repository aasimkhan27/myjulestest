using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.SYRVE
{
    public class SYRVE_MODEL
    {
        public DataTable DATATABLE_COMMON = null;
        public DataTable DATATABLE_1 = null;
        public DataTable DATATABLE_2 = null;
        public DataTable DATATABLE_3 = null;
        public DataTable DATATABLE_4 = null;
        public DataTable DATATABLE_5 = null;
        public DataTable DATATABLE_6 = null;
        public DataTable DATATABLE_7 = null;

        public class Root_Token
        {
            public string correlationId { get; set; }
            public string token { get; set; }
            public bool error { get; set; }
            public bool warning { get; set; }
            public string message { get; set; }
            public int sessionTtl { get; set; }
            public bool enableUserProfile { get; set; }
            public object store { get; set; }
            public object storeId { get; set; }
            public bool formValidationError { get; set; }
        }
        public class CalculatedField
        {
            public string name { get; set; }
            public string title { get; set; }
            public string description { get; set; }
            public string formula { get; set; }
            public string type { get; set; }
            public bool canSum { get; set; }
        }

        public class Filter
        {
            public string field { get; set; }
            public string filterType { get; set; }
            public string dateFrom { get; set; }
            public string dateTo { get; set; }
            public object valueMin { get; set; }
            public object valueMax { get; set; }
            public List<object> valueList { get; set; }
            public bool includeLeft { get; set; }
            public bool includeRight { get; set; }
            public bool inclusiveList { get; set; }
        }

        public class Syrve_Root
        {
            public string olapType { get; set; }
            public List<string> storeIds { get; set; }
            public List<object> categoryFields { get; set; }
            public List<string> groupFields { get; set; }
            public bool stackByDataFields { get; set; }
            public List<string> dataFields { get; set; }
            public List<CalculatedField> calculatedFields { get; set; }
            public List<Filter> filters { get; set; }
            public bool includeVoidTransactions { get; set; }
            public bool includeNonBusinessPaymentTypes { get; set; }
        }
        public class SyrveTips_Root
        {
            public string olapType { get; set; }
            public List<string> storeIds { get; set; }
            public List<object> categoryFields { get; set; }
            public List<string> groupFields { get; set; }
            public bool stackByDataFields { get; set; }
            public List<string> dataFields { get; set; }
            public List<CalculatedField> calculatedFields { get; set; }
            public List<Filter> filters { get; set; }
            //public bool includeVoidTransactions { get; set; }
            //public bool includeNonBusinessPaymentTypes { get; set; }
        }
        public class Syrve_Init_Root
        {
            public bool error { get; set; }
            public bool warning { get; set; }
            public string data { get; set; }
            public bool formValidationError { get; set; }
        }

        public class RawDatum
        {
            public string Cashier { get; set; }

            [JsonProperty("Cashier.Code")]
            public string CashierCode { get; set; }
            public DateTime CloseTime { get; set; }

            [JsonProperty("Currencies.Currency")]
            public string CurrenciesCurrency { get; set; }
            public string Department { get; set; }
            public decimal DiscountPercent { get; set; }
            public decimal DiscountSum { get; set; }
            public decimal DishAmountInt { get; set; }
            public string DishCategory { get; set; }

            [JsonProperty("DishCategory.Id")]
            public string DishCategoryId { get; set; }
            public string DishCode { get; set; }
            public decimal DishDiscountSumInt { get; set; }

            [JsonProperty("DishDiscountSumInt.withoutVAT")]
            public decimal DishDiscountSumIntwithoutVAT { get; set; }
            public string DishGroup { get; set; }

            [JsonProperty("DishGroup.Id")]
            public string DishGroupId { get; set; }

            [JsonProperty("DishGroup.Num")]
            public string DishGroupNum { get; set; }

            [JsonProperty("DishGroup.SecondParent")]
            public string DishGroupSecondParent { get; set; }

            [JsonProperty("DishGroup.ThirdParent")]
            public string DishGroupThirdParent { get; set; }

            [JsonProperty("DishGroup.TopParent")]
            public string DishGroupTopParent { get; set; }
            public string DishName { get; set; }
            public decimal DishReturnSum { get; set; }

            [JsonProperty("DishReturnSum.withoutVAT")]
            public decimal DishReturnSumwithoutVAT { get; set; }
            public decimal GuestNum { get; set; }

            [JsonProperty("OpenDate.Typed")]
            public string OpenDateTyped { get; set; }
            public DateTime OpenTime { get; set; }

            [JsonProperty("OrderDiscount.Type")]
            public string OrderDiscountType { get; set; }

            [JsonProperty("OrderDiscount.Type.IDs")]
            public string OrderDiscountTypeIDs { get; set; }
            public string OrderNum { get; set; }

            [JsonProperty("OrderWaiter.Id")]
            public string OrderWaiterId { get; set; }

            [JsonProperty("OrderWaiter.Name")]
            public string OrderWaiterName { get; set; }
            public string PayTypes { get; set; }

            [JsonProperty("PayTypes.Group")]
            public string PayTypesGroup { get; set; }

            [JsonProperty("PaymentTransaction.Id")]
            public string PaymentTransactionId { get; set; }
            public string RestorauntGroup { get; set; }
            public decimal SessionNum { get; set; }
            public string SoldWithDish { get; set; }

            [JsonProperty("SoldWithDish.Id")]
            public string SoldWithDishId { get; set; }

            [JsonProperty("SoldWithItem.Id")]
            public string SoldWithItemId { get; set; }
            public string Storned { get; set; }
            public decimal TableNum { get; set; }

            [JsonProperty("UniqOrderId.Id")]
            public string UniqOrderIdId { get; set; }

            [JsonProperty("VAT.Percent")]
            public decimal? VATPercent { get; set; }

            [JsonProperty("VAT.Sum")]
            public decimal VATSum { get; set; }
            public decimal _BusinessDays { get; set; }
            public decimal _SalesNet { get; set; }
            public decimal _Transactions { get; set; }
            public decimal? Sales { get; set; }

            [JsonProperty("Account.Name")]
            public string AccountName { get; set; }
            [JsonProperty("DateTime.DateTyped")]
            public string DateTimeDateTyped { get; set; }
            [JsonProperty("Sum.ResignedSum")]
            public decimal? SumResignedSum { get; set; }

        }

        public class Result
        {
            public List<RawDatum> rawData { get; set; }
            public decimal totalDaysInPeriod { get; set; }
            public decimal totalRevenueInPeriod { get; set; }
            public decimal totalMainItemSalesNet { get; set; }
            public decimal totalMainItemCost { get; set; }
            public decimal totalMainItemSalesGross { get; set; }
            public decimal totalMainItemQty { get; set; }
            public decimal totalTransactionsInPeriod { get; set; }
        }
        public class Syrve_OLAP_Root
        {
            public bool error { get; set; }
            public bool warning { get; set; }
            public Result result { get; set; }
            public bool formValidationError { get; set; }
        }

        public class Syrve_Table_Type
        {
            public string Cashier { get; set; }
            public string CashierCode { get; set; }
            public DateTime CloseTime { get; set; }
            public string CurrenciesCurrency { get; set; }
            public string Department { get; set; }
            public decimal DiscountPercent { get; set; }
            public decimal DiscountSum { get; set; }
            public decimal DishAmountInt { get; set; }
            public string DishCategory { get; set; }
            public string DishCategoryId { get; set; }
            public string DishCode { get; set; }
            public decimal DishDiscountSumInt { get; set; }
            public decimal DishDiscountSumIntwithoutVAT { get; set; }
            public string DishGroup { get; set; }
            public string DishGroupId { get; set; }
            public string DishGroupNum { get; set; }
            public string DishGroupSecondParent { get; set; }
            public string DishGroupThirdParent { get; set; }
            public string DishGroupTopParent { get; set; }
            public string DishName { get; set; }
            public decimal DishReturnSum { get; set; }
            public decimal DishReturnSumwithoutVAT { get; set; }
            public decimal GuestNum { get; set; }
            public string OpenDateTyped { get; set; }
            public DateTime OpenTime { get; set; }
            public string OrderDiscountType { get; set; }
            public string OrderDiscountTypeIDs { get; set; }
            public string OrderNum { get; set; }
            public string OrderWaiterId { get; set; }
            public string OrderWaiterName { get; set; }
            public string PayTypes { get; set; }
            public string PayTypesGroup { get; set; }
            public string PaymentTransactionId { get; set; }
            public string RestorauntGroup { get; set; }
            public decimal SessionNum { get; set; }
            public string SoldWithDish { get; set; }
            public string SoldWithDishId { get; set; }
            public string SoldWithItemId { get; set; }
            public string Storned { get; set; }
            public decimal TableNum { get; set; }
            public string UniqOrderIdId { get; set; }
            public decimal? VATPercent { get; set; }
            public decimal VATSum { get; set; }
            public decimal _BusinessDays { get; set; }
            public decimal _SalesNet { get; set; }
            public decimal _Transactions { get; set; }
            public decimal? Sales { get; set; }
        }

        public class Syrve_Tips_Table_Type
        {
            public string AccountName { get; set; }
            public string DateTimeDateTyped { get; set; }
            public string Department { get; set; }
            public string OrderNum { get; set; }
            public decimal? SumResignedSum { get; set; }
        }
    }
}

