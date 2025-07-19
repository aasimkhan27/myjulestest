using System.Collections.Generic;
using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Images
    {
        [JsonProperty("product-image")]
        public List<ProductImage> ProductImages { get; set; }
    }
}