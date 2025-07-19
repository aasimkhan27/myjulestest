using System;
using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class RedeemHistory
    {
        [JsonProperty("eventID")]
        public int? EventID { get; set; }

        [JsonProperty("userID")]
        public int? UserID { get; set; }

        [JsonProperty("created")]
        public DateTime? DateOfCreation { get; set; }

        [JsonProperty("rowID")]
        public int? RowID { get; set; }

        [JsonProperty("locationID")]
        public int? LocationID { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("amount")]
        public decimal? Amount { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }

        [JsonProperty("startingBalance")]
        public decimal? StartingBalance { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("balance")]
        public decimal? Balance { get; set; }

        [JsonProperty("currencies")]
        public Currencies RedeemCurrencies { get; set; }

        [JsonProperty("row")]
        public Row RedeemRow { get; set; }
    }
}