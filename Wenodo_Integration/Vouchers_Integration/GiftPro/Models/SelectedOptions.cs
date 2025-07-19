using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class SelectedOptions
    {
        [JsonProperty("Value")]
        public OptionValue Value { get; set; }
    }
}