using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class ProductImage
    {
        [JsonProperty("filename")]
        public string FileName { get; set; }

        [JsonProperty("h")]
        public decimal Height { get; set; }

        [JsonProperty("w")]
        public decimal Width { get; set; }
    }
}