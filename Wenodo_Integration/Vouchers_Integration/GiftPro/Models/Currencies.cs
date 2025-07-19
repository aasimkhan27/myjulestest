using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Currencies
    {
        [JsonProperty("GBP")]
        public GBP CurrencyGBP { get; set; }
    }
}