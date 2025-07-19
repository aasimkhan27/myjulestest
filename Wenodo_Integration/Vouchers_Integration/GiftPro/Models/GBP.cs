using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class GBP
    {
        [JsonProperty("baseCurrencyCode")]
        public string BaseCurrencyCode { get; set; }

        [JsonProperty("exchangeRate")]
        public decimal? ExchangeRate { get; set; }

        [JsonProperty("redeemedCurrencyCode")]
        public string RedeemedCurrencyCode { get; set; }

        [JsonProperty("amount")]
        public decimal? Amount { get; set; }

        [JsonProperty("currencySymbol")]
        public string CurrencySymbol { get; set; }

        [JsonProperty("balance")]
        public decimal? Balance { get; set; }
    }
}