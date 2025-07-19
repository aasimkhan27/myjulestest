using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class MetaMessage
    {
        [JsonProperty("_message")]
        public string Message { get; set; }
    }
}