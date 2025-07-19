using System;
using Newtonsoft.Json;

namespace Vouchers_Integration.GIFTPRO.Models
{
    public class Order
    {
        [JsonProperty("orderID")]
        public int? OrderID { get; set; }

        [JsonProperty("domainID")]
        public int? DomainID { get; set; }

        [JsonProperty("domainName")]
        public string DomainName { get; set; }

        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("emailAddress")]
        public string EmailAddress { get; set; }

        [JsonProperty("customerName")]
        public string CustomerName { get; set; }

        [JsonProperty("paymentMethod")]
        public string PaymentMethod { get; set; }

        [JsonProperty("dateCreated")]
        public DateTime? DateCreated { get; set; }

        [JsonProperty("lastChanged")]
        public DateTime? LastChanged { get; set; }

        [JsonProperty("discountAmount")]
        public decimal? DiscountAmount { get; set; }

        [JsonProperty("total")]
        public decimal? Total { get; set; }

        [JsonProperty("commission")]
        public decimal? Commission { get; set; }

        [JsonProperty("delivery")]
        public int? Delivery { get; set; }

        [JsonProperty("fulfillment")]
        public int? FulFillment { get; set; }

        [JsonProperty("currencyCode")]
        public string CurrencyCode { get; set; }

        [JsonProperty("billingAddressLine1")]
        public string BillingAddressLine1 { get; set; }

        [JsonProperty("billingAddressLine2")]
        public string BillingAddressLine2 { get; set; }

        [JsonProperty("billingAddressLocality")]
        public string BillingAddressLocality { get; set; }

        [JsonProperty("billingAddressCounty")]
        public string BillingAddressCounty { get; set; }

        [JsonProperty("billingAddressPostCode")]
        public string BillingAddressPostCode { get; set; }

        [JsonProperty("billingAddressCountry")]
        public string BillingAddressCountry { get; set; }

        [JsonProperty("deliveryName")]
        public string DeliveryName { get; set; }

        [JsonProperty("deliveryAddressLine1")]
        public string DeliveryAddressLine1 { get; set; }

        [JsonProperty("deliveryAddressLine2")]
        public string DeliveryAddressLine2 { get; set; }

        [JsonProperty("deliveryAddressLocality")]
        public string DeliveryAddressLocality { get; set; }

        [JsonProperty("deliveryAddressCounty")]
        public string DeliveryAddressCounty { get; set; }

        [JsonProperty("deliveryAddressPostCode")]
        public string DeliveryAddressPostCode { get; set; }

        [JsonProperty("deliveryAddressCountry")]
        public string DeliveryAddressCountry { get; set; }

        [JsonProperty("personalTaxIdentifier")]
        public string PersonalTaxIdentifier { get; set; }

        [JsonProperty("recipientEmailAddress")]
        public string RecipientEmailAddress { get; set; }

        [JsonProperty("requestedDeliveryDate")]
        public DateTime? RequestedDeliveryDate { get; set; }

        [JsonProperty("sentToRecipientEmail")]
        public bool? SentToRecipientEmail { get; set; }

        [JsonProperty("requestedEmailToRecipient")]
        public bool? RequestedEmailToRecipient { get; set; }

        [JsonProperty("marketingOpted")]
        public bool? MarketingOpted { get; set; }

        [JsonProperty("marketingDoubleOptedIn")]
        public bool? MarketingDoubleOptedIn { get; set; }

        [JsonProperty("customerFirstName")]
        public string CustomerFirstName { get; set; }

        [JsonProperty("customerLastName")]
        public string CustomerLastName { get; set; }

        [JsonProperty("meta")]
        public Meta MetaBillingAddress { get; set; }

        public int? EntityID { get; set; }

        public int? BranchID { get; set; }

        public bool? Active { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }
    }
}