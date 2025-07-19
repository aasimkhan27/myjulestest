using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Current
    {
        [JsonProperty("GBP")]
        public decimal? GBP { get; set; }
    }
}