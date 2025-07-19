using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.LIGHTSPEED_LSERIES
{
    public class LSeriesModel
    {
    }

    public class ActionItem
    {
        public string productId { get; set; }
        public string productPLU { get; set; }
        public string prodId { get; set; }
        public string productName { get; set; }
        public string info { get; set; }
        public int amount { get; set; }
        public double unitPrice { get; set; }
        public double unitPriceWithoutVat { get; set; }
        public double totalPrice { get; set; }
        public double totalPriceWithoutVat { get; set; }
        public double vatPercentage { get; set; }
        public double deliveryVatPercentage { get; set; }
        public double takeawayVatPercentage { get; set; }
        public int priceTypeId { get; set; }
        public List<ModifierValue> modifierValues { get; set; }
        public string id { get; set; }
        public string parentId { get; set; }
        public int seat { get; set; }
        public int course { get; set; }
        public DateTime creationDate { get; set; }
        public DateTime sentDate { get; set; }
        public double discountPrice { get; set; }
        public double discountPriceWithoutVat { get; set; }
    }

    public class Payment
    {
        public int id { get; set; }
        public string type { get; set; }
        public int paymentTypeId { get; set; }
        public int paymentTypeCategoryId { get; set; }
        public double amount { get; set; }
        public double tips { get; set; }
        public double restitution { get; set; }
        public int statusId { get; set; }
        public string deviceId { get; set; }
        public DateTime creationDate { get; set; }
        public DateTime modificationDate { get; set; }
    }

    public class Result
    {
        public int id { get; set; }
        public int sequentialId { get; set; }
        public int sequenceNumber { get; set; }
        public string uuid { get; set; }
        public int parentId { get; set; }
        public int floorId { get; set; }
        public int tableId { get; set; }
        public int customerId { get; set; }
        public string customerUuid { get; set; }
        public int userId { get; set; }
        public string status { get; set; }
        public string type { get; set; }
        public DateTime creationDate { get; set; }
        public DateTime modificationDate { get; set; }
        public DateTime closingDate { get; set; }
        public DateTime deliveryDate { get; set; }
        public DateTime printDate { get; set; }
        public double total { get; set; }
        public double totalWithoutTax { get; set; }
        public List<Item> items { get; set; }
        public List<ActionItem> actionItems { get; set; }
        public List<Payment> payments { get; set; }
        public List<TaxInfo> taxInfo { get; set; }
        public int numberOfCustomers { get; set; }
        public int currentCourse { get; set; }
    }
    public class ModifierValue
    {
        public int id { get; set; }
        public int modifierId { get; set; }
        public string name { get; set; }
        public double price { get; set; }
        public double priceWithoutVAT { get; set; }
        public string info { get; set; }
        public string plu { get; set; }
        public bool @default { get; set; }
    }
    public class Item
    {
        public string productId { get; set; }
        public string productPLU { get; set; }
        public string prodId { get; set; }
        public string productName { get; set; }
        public string info { get; set; }
        public double amount { get; set; }
        public double unitPrice { get; set; }
        public double unitPriceWithoutVat { get; set; }
        public double totalPrice { get; set; }
        public double totalPriceWithoutVat { get; set; }
        public double vatPercentage { get; set; }
        public double deliveryVatPercentage { get; set; }
        public double takeawayVatPercentage { get; set; }
        public int priceTypeId { get; set; }
        public List<ModifierValue> modifierValues { get; set; }
        public string id { get; set; }
        public string parentId { get; set; }
        public int seat { get; set; }
        public int course { get; set; }
        public DateTime creationDate { get; set; }
        public DateTime sentDate { get; set; }
        public double discountPrice { get; set; }
        public double discountPriceWithoutVat { get; set; }

    }
    public class Root_LSeries
    {
        public List<Result> results { get; set; }
        public int amount { get; set; }
        public int offset { get; set; }
        public string access_token { get; set; }
        public string refresh_token { get; set; }
        public int expires_in { get; set; }
        public string code { get; set; }
        public string message { get; set; }
        public int statusCode { get; set; }
        public List<Detail> details { get; set; }
    }
    public class Detail
    {
        public string code { get; set; }
        public string message { get; set; }
    }
    public class Access_token_Root
    {
        public string access_token { get; set; }
        public string refresh_token { get; set; }
        public int expires_in { get; set; }
        public string code { get; set; }
        public string message { get; set; }
        public int statusCode { get; set; }
        public List<Detail> details { get; set; }
    }
    public class TaxInfo
    {
        public double taxRate { get; set; }
        public string taxRateCode { get; set; }
        public double taxTotal { get; set; }
    }


    public class LSeriesPrductGroup
    {
        public int id { get; set; }
        public string name { get; set; }
        public int sequence { get; set; }
        public bool visible { get; set; }
        public int categoryId { get; set; }
        public bool shortcutCategory { get; set; }
        public List<object> products { get; set; }
    }
    public class LSeriesPrductGroupRoot
    {
        public int id { get; set; }
        public string name { get; set; }
        public int sequence { get; set; }
        public bool visible { get; set; }
        public int categoryId { get; set; }
        public bool shortcutCategory { get; set; }
        public List<object> products { get; set; }
    }




    public class LSeriesProductAddition
    {
        public int id { get; set; }
        public string name { get; set; }
        public string displayName { get; set; }
        public List<LSeriesProductValue> values { get; set; }
        public bool multiselect { get; set; }
        public int minSelectedAmount { get; set; }
        public int maxSelectedAmount { get; set; }
    }

    public class LSeriesProductRoot
    {
        public List<LSeriesProduct> Product { get; set; }
    }

    public class LSeriesProduct
    {
        public int id { get; set; }
        public string name { get; set; }
        public bool visible { get; set; }
        public string imageLocation { get; set; }
        public string kitchenImageLocation { get; set; }
        public string cfdImageLocation { get; set; }
        public double price { get; set; }
        public double priceWithoutVat { get; set; }
        public double takeawayPrice { get; set; }
        public double takeawayPriceWithoutVat { get; set; }
        public double deliveryPrice { get; set; }
        public double deliveryPriceWithoutVat { get; set; }
        public string productType { get; set; }
        public string sku { get; set; }
        public string taxClass { get; set; }
        public string deliveryTaxClass { get; set; }
        public string takeawayTaxClass { get; set; }
        public int stockAmount { get; set; }
        public List<int> groupIds { get; set; }
        public List<LSeriesProductAddition> additions { get; set; }
        public string info { get; set; }
    }

    public class LSeriesProductValue
    {
        public int id { get; set; }
        public string name { get; set; }
        public double price { get; set; }
        public double priceWithoutVAT { get; set; }
        public string info { get; set; }
        public string plu { get; set; }
        public bool @default { get; set; }
    }
}
