using System;
using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class VoucherDetails
    {
        [JsonProperty("productID")]
        public int? ProductID { get; set; }

        [JsonProperty("domainID")]
        public int? DomainID { get; set; }

        [JsonProperty("departmentID")]
        public int? DepartmentID { get; set; }

        [JsonProperty("price")]
        public decimal? Price { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("visibility")]
        public string Visibility { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("permalink")]
        public string PermaLink { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("visibleFrom")]
        public DateTime? VisibleFrom { get; set; }

        [JsonProperty("visibleTo")]
        public DateTime? VisibleTo { get; set; }

        [JsonProperty("suffix")]
        public string Suffix { get; set; }

        [JsonProperty("updated")]
        public DateTime? Updated { get; set; }

        [JsonProperty("created")]
        public DateTime? Created { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }

        [JsonProperty("class")]
        public string Class { get; set; }

        [JsonProperty("redeemInstructions")]
        public string RedeemInstructions { get; set; }

        [JsonProperty("allowPartialRedemption")]
        public int? AllowPartialRedemption { get; set; }

        [JsonProperty("termsConditions")]
        public string TermsConditions { get; set; }

        [JsonProperty("hasPrintedTermsConditions")]
        public string HasPrintedTermsConditions { get; set; }

        [JsonProperty("printedTermsConditions")]
        public string PrintedTermsConditions { get; set; }

        [JsonProperty("hasPrintedDescription")]
        public int? HasPrintedDescription { get; set; }

        [JsonProperty("printedDescription")]
        public string PrintedDescription { get; set; }

        [JsonProperty("validityPeriod")]
        public string ValidityPeriod { get; set; }

        [JsonProperty("validityLength")]
        public int? ValidityLength { get; set; }

        [JsonProperty("validityFixedDate")]
        public DateTime? ValidityFixedDate { get; set; }

        [JsonProperty("hasValidFromPeriod")]
        public int? HasValidFromPeriod { get; set; }

        [JsonProperty("validFromPeriod")]
        public string ValidFromPeriod { get; set; }

        [JsonProperty("validFromLength")]
        public int? ValidFromLength { get; set; }

        [JsonProperty("validFromFixedDate")]
        public DateTime? ValidFromFixedDate { get; set; }

        [JsonProperty("hasGracePeriod")]
        public int? HasGracePeriod { get; set; }

        [JsonProperty("gracePeriod")]
        public int? GracePeriod { get; set; }

        [JsonProperty("graceLength")]
        public int? GraceLength { get; set; }

        [JsonProperty("graceFixedDate")]
        public DateTime? GraceFixedDate { get; set; }

        [JsonProperty("hasFixedStockAmount")]
        public string HasFixedStockAmount { get; set; }

        [JsonProperty("isComplimentary")]
        public string IsComplimentary { get; set; }

        [JsonProperty("remainingStock")]
        public decimal? RemainingStock { get; set; }

        [JsonProperty("minimum")]
        public decimal? Minimum { get; set; }

        [JsonProperty("maximum")]
        public decimal? Maximum { get; set; }

        [JsonProperty("faceValue")]
        public decimal? FaceValue { get; set; }

        [JsonProperty("images")]
        public Images VoucherImages { get; set; }
    }
}