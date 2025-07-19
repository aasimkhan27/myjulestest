using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Balances
    {
        [JsonProperty("starting")]
        public Starting Starting { get; set; }

        [JsonProperty("current")]
        public Current Current { get; set; }
    }
}