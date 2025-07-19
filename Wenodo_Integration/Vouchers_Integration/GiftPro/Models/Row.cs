using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Row
    {
        [JsonProperty("code")]
        public string Code { get; set; }

        [JsonProperty("type")]
        public string Type { get; set; }
    }
}