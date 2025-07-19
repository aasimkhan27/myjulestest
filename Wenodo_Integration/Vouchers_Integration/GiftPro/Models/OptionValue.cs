using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class OptionValue
    {
        [JsonProperty("value")]
        public decimal? Value { get; set; }
    }
}