using Newtonsoft.Json;

namespace EPOS_Integration.IIKO
{
    public class IikoGetTransactionModel
    {
        [JsonProperty("UniqOrderId.Id")]
        public string UniqOrderIdId { get; set; }

        [JsonProperty("OpenDate.Typed")]
        public string OpenDateTyped { get; set; }
        public string CloseTime { get; set; }
        public bool Storned { get; set; }
        [JsonProperty("DishDiscountSumInt.withoutVAT")]
        public string DishDiscountSumIntwithoutVAT { get; set; }
    }
}