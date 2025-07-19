using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Meta
    {

        [JsonProperty("billing_address1")]
        public string BillingAddress1 { get; set; }

        [JsonProperty("billing_address2")]
        public string BillingAddress2 { get; set; }

        [JsonProperty("billing_address3")]
        public string BillingAddress3 { get; set; }

        [JsonProperty("billing_address4")]
        public string BillingAddress4 { get; set; }

        [JsonProperty("billing_address5")]
        public string BillingAddress5 { get; set; }

        [JsonProperty("billing_address6")]
        public string BillingAddress6 { get; set; }

        [JsonProperty("signup")]
        public string SignUp { get; set; }
    }
}