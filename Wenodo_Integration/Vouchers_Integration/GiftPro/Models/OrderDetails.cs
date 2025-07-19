using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class OrderDetails
    {
        [JsonProperty("rowID")]
        public int? RowID { get; set; }

        [JsonProperty("orderID")]
        public int? OrderID { get; set; }

        [JsonProperty("ProductID")]
        public int? ProductID { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("subtotal")]
        public decimal? SubTotal { get; set; }

        [JsonProperty("discountAmount")]
        public decimal? DiscountAmount { get; set; }

        [JsonProperty("total")]
        public decimal? Total { get; set; }

        [JsonProperty("meta")]
        public Object Message { get; set; }

        [JsonProperty("class")]
        public string Class { get; set; }

        [JsonProperty("redeemCode")]
        public string RedeemCode { get; set; }

        [JsonProperty("clientCode")]
        public string ClientCode { get; set; }

        [JsonProperty("validFromDate")]
        public string ValidFromDate { get; set; }

        [JsonProperty("redeemedDate")]
        public DateTime? RedeemedDate { get; set; }

        [JsonProperty("expiryDate")]
        public DateTime? ExpiryDate { get; set; }

        [JsonProperty("graceeExpiryDate")]
        public DateTime? GraceExpiryDate { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("domainID")]
        public int? DomainID { get; set; }

        [JsonProperty("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }

        [JsonProperty("partiallyRedeemable")]
        public bool? PartiallyRedeemable { get; set; }

        [JsonProperty("remainingValue")]
        public decimal? RemainingValue { get; set; }

        [JsonProperty("balances")]
        public Balances Balance { get; set; }

        [JsonProperty("selectedOptions")]
        public SelectedOptions Options { get; set; }

        [JsonProperty("redeemHistory")]
        public List<RedeemHistory> OrderRedeemHistory { get; set; }
    }
}