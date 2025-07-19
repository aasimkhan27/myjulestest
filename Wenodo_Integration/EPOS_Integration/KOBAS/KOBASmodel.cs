using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.KOBAS
{
    public class KOBASmodel
    {
    }
    // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class Item
    {
        [JsonProperty("Order Item ID")]
        public int OrderItemID { get; set; }

        [JsonProperty("Lead Type")]
        public string LeadType { get; set; }
        public string Category { get; set; }

        [JsonProperty("PLU ID")]
        public int PLUID { get; set; }

        [JsonProperty("PLU Name")]
        public string PLUName { get; set; }

        [JsonProperty("Sale Action")]
        public string SaleAction { get; set; }

        [JsonProperty("Full Base Price")]
        public string FullBasePrice { get; set; }
        public string Discount { get; set; }

        [JsonProperty("Discount ID")]
        public object DiscountID { get; set; }

        [JsonProperty("Discount Name")]
        public string DiscountName { get; set; }

        [JsonProperty("Fixed Discount")]
        public string FixedDiscount { get; set; }

        [JsonProperty("Fixed Discount ID")]
        public string FixedDiscountID { get; set; }

        [JsonProperty("Fixed Discount Name")]
        public string FixedDiscountName { get; set; }

        [JsonProperty("Manual Price Adjustment")]
        public double ManualPriceAdjustment { get; set; }

        [JsonProperty("Actual Gross Sale Price")]
        public double ActualGrossSalePrice { get; set; }
        public double Tax { get; set; }

        [JsonProperty("Actual Net Sale Price")]
        public double ActualNetSalePrice { get; set; }

        [JsonProperty("Tax Rate")]
        public string TaxRate { get; set; }

        [JsonProperty("Cost Price")]
        public double CostPrice { get; set; }
        public List<Modifier> Modifiers { get; set; }
        public List<Recipe> Recipe { get; set; }

        [JsonProperty("PLU Notes")]
        public string PLUNotes { get; set; }
    }

    public class Modifier
    {
        [JsonProperty("Modifier Group ID")]
        public int ModifierGroupID { get; set; }
        public string Question { get; set; }

        [JsonProperty("Modifier Answer ID")]
        public int ModifierAnswerID { get; set; }
        public string Answer { get; set; }

        [JsonProperty("Gross Sale Price")]
        public double GrossSalePrice { get; set; }

        [JsonProperty("Tax Rate")]
        public string TaxRate { get; set; }

        [JsonProperty("Cost Price")]
        public double CostPrice { get; set; }
        public List<Recipe> Recipe { get; set; }
    }

    public class Recipe
    {
        [JsonProperty("Ingredient ID")]
        public int IngredientID { get; set; }

        [JsonProperty("Ingredient Name")]
        public string IngredientName { get; set; }
        public double Quantity { get; set; }

        [JsonProperty("Unit Measurement")]
        public string UnitMeasurement { get; set; }
        public double Price { get; set; }
    }

    public class KobasRoot
    {
        [JsonProperty("Brand ID")]
        public string BrandID { get; set; }

        [JsonProperty("Brand Name")]
        public string BrandName { get; set; }

        [JsonProperty("Region ID")]
        public int RegionID { get; set; }

        [JsonProperty("Region Name")]
        public string RegionName { get; set; }

        [JsonProperty("Area ID")]
        public int AreaID { get; set; }

        [JsonProperty("Area Name")]
        public string AreaName { get; set; }

        [JsonProperty("Venue ID")]
        public int VenueID { get; set; }

        [JsonProperty("Venue Name")]
        public string VenueName { get; set; }

        [JsonProperty("Order Timestamp")]
        public string OrderTimestamp { get; set; }

        [JsonProperty("Business Date")]
        public string BusinessDate { get; set; }

        [JsonProperty("Order ID")]
        public int OrderID { get; set; }

        [JsonProperty("Till ID")]
        public object TillID { get; set; }

        [JsonProperty("Staff ID")]
        public int StaffID { get; set; }

        [JsonProperty("Staff Name")]
        public string StaffName { get; set; }

        [JsonProperty("Table ID")]
        public object TableID { get; set; }

        [JsonProperty("Table Name")]
        public string TableName { get; set; }

        [JsonProperty("Tab ID")]
        public int TabID { get; set; }

        [JsonProperty("Customer ID")]
        public string CustomerID { get; set; }

        [JsonProperty("Order Source")]
        public string OrderSource { get; set; }

        [JsonProperty("Consumption Mode")]
        public string ConsumptionMode { get; set; }
        public List<Item> Items { get; set; }
        public object Payments { get; set; }
        public List<object> Discounts { get; set; }
        public string code { get; set; }
    }
    // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class PaymentRoot
    {
        [JsonProperty("Payment ID")]
        public int PaymentID { get; set; }

        [JsonProperty("Venue ID")]
        public int VenueID { get; set; }
        public string Time { get; set; }

        [JsonProperty("Tab ID")]
        public int TabID { get; set; }

        [JsonProperty("Order ID")]
        public int OrderID { get; set; }

        [JsonProperty("Customer ID")]
        public int CustomerID { get; set; }

        [JsonProperty("Payment Total")]
        public string PaymentTotal { get; set; }

        [JsonProperty("Payment Cash")]
        public string PaymentCash { get; set; }

        [JsonProperty("Payment Card")]
        public string PaymentCard { get; set; }

        [JsonProperty("Payment Other")]
        public string PaymentOther { get; set; }
        public string Gratuity { get; set; }

        [JsonProperty("Service Charge")]
        public string ServiceCharge { get; set; }
        public string Tips { get; set; }
    }


    public class Payments
    {
        [JsonProperty("Payment ID")]
        public int PaymentID { get; set; }
        [JsonProperty("Payment Type")]
        public string PaymentType { get; set; }
        public decimal Amount { get; set; }
    }

    public class Access_token_Root
    {
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string access_token { get; set; }
        public string code { get; set; }
    }

}
