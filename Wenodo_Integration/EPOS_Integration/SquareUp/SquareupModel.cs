using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.SquareUp
{
    public class SquareupModel
    {
        // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
        public class Location_Root
        {
            public List<Location> locations { get; set; }
        }
        public class Catalog_Root
        {
            public string cursor { get; set; }
            public List<Object> objects { get; set; }
        }
        public class ItemVariation_Root
        {
            public string cursor { get; set; }
            public List<Object> objects { get; set; }
        }
        public class Item_Root
        {
            public List<Object> objects { get; set; }
            public string cursor { get; set; }
        }
        public class Discount_Root
        {
            public List<Object> objects { get; set; }
        }
        public class ModifierList_Root
        {
            public List<Object> objects { get; set; }
        }
        public class Modifier_Root
        {
            public List<Object> objects { get; set; }
        }
        public class ItemOption_Root
        {
            public List<Object> objects { get; set; }
        }
        public class ItemOptionValue_Root
        {
            public List<Object> objects { get; set; }
        }
        public class Tax_Root
        {
            public List<Object> objects { get; set; }
        }
        public class QuickAmountsSettings_Root
        {
            public List<Object> objects { get; set; }
        }
        public class Order_Root
        {
            public List<Order> orders { get; set; }
            public Order order { get; set; }
            public string cursor { get; set; }
        }
        public class Payment_Root
        {
            public List<Payment> payments { get; set; }
            public string cursor { get; set; }
        }
        public class Refund_Root
        {
            public List<Refund> refunds { get; set; }
            public string cursor { get; set; }
        }
        public class Retrive_Catalog_Root
        {
            public Object @object { get; set; }
            public List<RelatedObject> related_objects { get; set; }
        }
    }
    #region ---Location---
    public class Address
    {
        public string address_line_1 { get; set; }
        public string address_line_2 { get; set; }
        public string locality { get; set; }
        public string postal_code { get; set; }
        public string country { get; set; }
    }
    public class BusinessHours
    {
    }
    public class Coordinates
    {
        public double latitude { get; set; }
        public double longitude { get; set; }
    }
    public class Location
    {
        public string id { get; set; }
        public string name { get; set; }
        public Address address { get; set; }
        public string timezone { get; set; }
        public List<string> capabilities { get; set; }
        public string status { get; set; }
        public DateTime created_at { get; set; }
        public string merchant_id { get; set; }
        public string country { get; set; }
        public string language_code { get; set; }
        public string currency { get; set; }
        public string phone_number { get; set; }
        public string business_name { get; set; }
        public string type { get; set; }
        public BusinessHours business_hours { get; set; }
        public string business_email { get; set; }
        public Coordinates coordinates { get; set; }
        public string mcc { get; set; }
        public TaxIds tax_ids { get; set; }
    }
    public class TaxIds
    {
    }
    #endregion
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    #region --- CATEGORY ---
    public class Amount
    {
        public string type { get; set; }
        public Amount amount { get; set; }
        public int score { get; set; }
    }

    public class Amount2
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class CatalogV1Id
    {
        public string catalog_v1_id { get; set; }
        public string location_id { get; set; }
    }

    public class CategoryData
    {
        public string name { get; set; }
        public int ordinal { get; set; }
        public bool? is_top_level { get; set; }
    }

    public class ItemData
    {
        public string name { get; set; }
        public string description { get; set; }
        public string label_color { get; set; }
        public string visibility { get; set; }
        public string category_id { get; set; }
        public List<Variation> variations { get; set; }
        public string product_type { get; set; }
        public bool skip_modifier_screen { get; set; }
        public string ecom_visibility { get; set; }
        public string description_html { get; set; }
        public string description_plaintext { get; set; }
        public bool? available_online { get; set; }
        public bool? available_for_pickup { get; set; }
        public bool? available_electronically { get; set; }
        public int? ordinal { get; set; }
        public List<string> tax_ids { get; set; }
        public bool? ecom_available { get; set; }
        public List<ModifierListInfo> modifier_list_info { get; set; }
        public string kitchen_name { get; set; }
        public List<Category> categories { get; set; }
    }
    public class Category
    {
        public string id { get; set; }
        public string ordinal { get; set; }
    }

    public class ItemOptionData
    {
        public string name { get; set; }
        public string display_name { get; set; }
        public bool show_colors { get; set; }
        public List<Value> values { get; set; }
    }

    public class ItemOptionValueData
    {
        public string item_option_id { get; set; }
        public string name { get; set; }
        public string color { get; set; }
        public int ordinal { get; set; }
    }

    public class ItemVariationData
    {
        public string item_id { get; set; }
        public string name { get; set; }
        public int ordinal { get; set; }
        public string pricing_type { get; set; }
        public bool track_inventory { get; set; }
        public bool sellable { get; set; }
        public bool stockable { get; set; }
        public PriceMoney price_money { get; set; }
        public List<LocationOverride> location_overrides { get; set; }
    }

   

    public class LocationOverride
    {
        public string location_id { get; set; }
        public bool track_inventory { get; set; }
        public bool? sold_out { get; set; }
    }

    public class Modifier
    {
        public string uid { get; set; }
        public string type { get; set; }
        public string id { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime created_at { get; set; }
        public object version { get; set; }
        public bool is_deleted { get; set; }
        public bool present_at_all_locations { get; set; }
        public List<string> present_at_location_ids { get; set; }
        public ModifierData modifier_data { get; set; }
        public List<string> absent_at_location_ids { get; set; }


        public BasePriceMoney base_price_money { get; set; }
        public TotalPriceMoney total_price_money { get; set; }
        public string name { get; set; }
        public string catalog_object_id { get; set; }
        public object catalog_version { get; set; }
        public string quantity{get; set;}
    }

    public class ModifierData
    {
        public string name { get; set; }
        public bool on_by_default { get; set; }
        public int ordinal { get; set; }
        public string modifier_list_id { get; set; }
      
    }

    public class ModifierListData
    {
        public string name { get; set; }
        public string selection_type { get; set; }
        public List<Modifier> modifiers { get; set; }
        public int? ordinal { get; set; }
        
    }

    public class ModifierListInfo
    {
        public string modifier_list_id { get; set; }
        public string visibility { get; set; }
        public int min_selected_modifiers { get; set; }
        public int max_selected_modifiers { get; set; }
        public bool enabled { get; set; }
    }

    public class Object
    {
        public string type { get; set; }
        public string id { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime created_at { get; set; }
        public object version { get; set; }
        public bool is_deleted { get; set; }
        public bool present_at_all_locations { get; set; }
        public CategoryData category_data { get; set; }
        public List<string> present_at_location_ids { get; set; }
        public ModifierListData modifier_list_data { get; set; }
        public ItemOptionData item_option_data { get; set; }
        public List<string> absent_at_location_ids { get; set; }
        public ItemData item_data { get; set; }
        public TaxData tax_data { get; set; }
        public QuickAmountsSettingsData quick_amounts_settings_data { get; set; }
        public List<CatalogV1Id> catalog_v1_ids { get; set; }
        public ItemVariationData item_variation_data { get; set; }
        public DiscountData discount_data { get; set; }
        public ModifierData modifier_data { get; set; }
        public ItemOptionValueData item_option_value_data { get; set; }

    }
   
    public class PriceMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
   
    public class QuickAmountsSettingsData
    {
        public string option { get; set; }
        public bool eligible_for_auto_amounts { get; set; }
        public List<Amount> amounts { get; set; }
    }

    public class TaxData
    {
        public string name { get; set; }
        public string calculation_phase { get; set; }
        public string inclusion_type { get; set; }
        public string percentage { get; set; }
        public bool applies_to_custom_amounts { get; set; }
        public bool enabled { get; set; }
        public string tax_type_id { get; set; }
        public string tax_type_name { get; set; }        
    }

    public class Value
    {
        public string type { get; set; }
        public string id { get; set; }
        public object version { get; set; }
        public ItemOptionValueData item_option_value_data { get; set; }
    }

    public class Variation
    {
        public string type { get; set; }
        public string id { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime created_at { get; set; }
        public object version { get; set; }
        public bool is_deleted { get; set; }
        public bool present_at_all_locations { get; set; }
        public List<string> absent_at_location_ids { get; set; }
        public ItemVariationData item_variation_data { get; set; }
        public List<string> present_at_location_ids { get; set; }
        public List<CatalogV1Id> catalog_v1_ids { get; set; }
    }


    public class DiscountData
    {
        public string name { get; set; }
        public string discount_type { get; set; }
        public string percentage { get; set; }
        public bool pin_required { get; set; }
        public string application_method { get; set; }
        public string modify_tax_basis { get; set; }
    }

    #endregion

    #region ITEM,ITEM_VARIATION,DISCOUNT
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    //same as location and category and object merge in those class object.
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);

    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);



    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);



    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class AmountMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class AppliedMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class AppliedTaxis
    {
        public string uid { get; set; }
        public string tax_uid { get; set; }
        public AppliedMoney applied_money { get; set; }
    }

    public class BasePriceMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class Card
    {
        public string card_brand { get; set; }
        public string last_4 { get; set; }
        public string fingerprint { get; set; }
        public int exp_month { get; set; }
        public int exp_year { get; set; }
        public string card_type { get; set; }
        public string prepaid_type { get; set; }
        public string bin { get; set; }
        public string cardholder_name { get; set; }
    }
    public class CardDetails
    {
        public string status { get; set; }
        public Card card { get; set; }
        public string entry_method { get; set; }
        public string cvv_status { get; set; }
        public string avs_status { get; set; }
        public string auth_result_code { get; set; }
        public string application_identifier { get; set; }
        public string application_cryptogram { get; set; }
        public string statement_description { get; set; }
        public DeviceDetails device_details { get; set; }
        public CardPaymentTimeline card_payment_timeline { get; set; }
        public string application_name { get; set; }
        public string verification_method { get; set; }
        public string verification_results { get; set; }
        public List<Error> errors { get; set; }
    }
    
    public class DiscountMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class GrossReturnMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class GrossSalesMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class LineItem
    {
        public string uid { get; set; }
        public string catalog_object_id { get; set; }
        public object catalog_version { get; set; }
        public string quantity { get; set; }
        public string name { get; set; }
        public string variation_name { get; set; }
        public BasePriceMoney base_price_money { get; set; }
        public GrossSalesMoney gross_sales_money { get; set; }
        public TotalTaxMoney total_tax_money { get; set; }
        public TotalDiscountMoney total_discount_money { get; set; }
        public TotalMoney total_money { get; set; }
        public VariationTotalPriceMoney variation_total_price_money { get; set; }
        public List<AppliedTaxis> applied_taxes { get; set; }
        public string item_type { get; set; }
        public List<Modifier> modifiers { get; set; }
        public string note { get; set; }
        public List<AppliedDiscount> applied_discounts { get; set; }
    }

    public class NetAmountDueMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class NetAmounts
    {
        public TotalMoney total_money { get; set; }
        public TaxMoney tax_money { get; set; }
        public DiscountMoney discount_money { get; set; }
        public TipMoney tip_money { get; set; }
        public ServiceChargeMoney service_charge_money { get; set; }
    }

    public class Order
    {
        public string id { get; set; }
        public string location_id { get; set; }
        public List<LineItem> line_items { get; set; }
        public List<Taxis> taxes { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string state { get; set; }
        public TotalTaxMoney total_tax_money { get; set; }
        public TotalDiscountMoney total_discount_money { get; set; }
        public TotalTipMoney total_tip_money { get; set; }
        public TotalMoney total_money { get; set; }
        public DateTime closed_at { get; set; }
        public List<Tender> tenders { get; set; }
        public TotalServiceChargeMoney total_service_charge_money { get; set; }
        public ReturnAmounts return_amounts { get; set; }
        public NetAmounts net_amounts { get; set; }
        public NetAmountDueMoney net_amount_due_money { get; set; }      
        public List<Return> returns { get; set; }
        public List<Refund> refunds { get; set; }
        public List<Discount> discounts { get; set; }
        public List<ServiceCharge> service_charges { get; set; }
        public string ticket_name { get; set; }
        public List<AppliedDiscount> applied_discounts { get; set; }
        public List<AppliedTaxis> applied_taxes { get; set; }
    }
    public class Return
    {
        public string source_order_id { get; set; }
        public List<ReturnLineItem> return_line_items { get; set; }
        public List<ReturnServiceCharge> return_service_charges { get; set; }
        public List<ReturnTaxis> return_taxes { get; set; }
        public List<ReturnDiscount> return_discounts { get; set; }
    }
    public class ReturnDiscount
    {
        public string uid { get; set; }
        public string catalog_object_id { get; set; }
        public long catalog_version { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string percentage { get; set; }
        public AppliedMoney applied_money { get; set; }
        public string scope { get; set; }
    }
    public class Refund
    {
        public string id { get; set; }
        public string location_id { get; set; }
        public string transaction_id { get; set; }
        public string tender_id { get; set; }
        public DateTime created_at { get; set; }
        public string reason { get; set; }
        public AmountMoney amount_money { get; set; }
        public string status { get; set; }
        public ProcessingFeeMoney processing_fee_money { get; set; }
        public string payment_id { get; set; }
        public string order_id { get; set; }
        public DateTime updated_at { get; set; }
        public List<ProcessingFee> processing_fee { get; set; }

    }
   
    public class ReturnLineItem
    {
        public string uid { get; set; }
        public string quantity { get; set; }
        public string catalog_version { get; set; }
        public string catalog_object_id { get; set; }
        public string source_line_item_uid { get; set; }
        public string name { get; set; }
        public string variation_name { get; set; }
        public string item_type { get; set; }
        public BasePriceMoney base_price_money { get; set; }
        public VariationTotalPriceMoney variation_total_price_money { get; set; }
        public GrossReturnMoney gross_return_money { get; set; }
        public TotalTaxMoney total_tax_money { get; set; }
        public TotalDiscountMoney total_discount_money { get; set; }
        public TotalMoney total_money { get; set; }
        public List<AppliedTaxis> applied_taxes { get; set; }
        public List<AppliedDiscount> applied_discounts { get; set; }
        public TotalServiceChargeMoney total_service_charge_money { get; set; }
    }
    public class ProcessingFeeMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }


    public class ReturnAmounts
    {
        public TotalMoney total_money { get; set; }
        public TaxMoney tax_money { get; set; }
        public DiscountMoney discount_money { get; set; }
        public TipMoney tip_money { get; set; }
        public ServiceChargeMoney service_charge_money { get; set; }
    }
    
    public class ServiceChargeMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class Taxis
    {
        public string uid { get; set; }
        public string catalog_object_id { get; set; }
        public long catalog_version { get; set; }
        public string name { get; set; }
        public string percentage { get; set; }
        public string type { get; set; }
        public AppliedMoney applied_money { get; set; }
        public string scope { get; set; }
    }

    public class TaxMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class Tender
    {
        public string id { get; set; }
        public string location_id { get; set; }
        public string transaction_id { get; set; }
        public DateTime created_at { get; set; }
        public AmountMoney amount_money { get; set; }
        public ProcessingFeeMoney processing_fee_money { get; set; }
        public string customer_id { get; set; }
        public string type { get; set; }
        public CardDetails card_details { get; set; }
        public TipMoney tip_money { get; set; }
        public CashDetails cash_details { get; set; }
        public string note { get; set; }
    }

    public class TipMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class TotalDiscountMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class TotalMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class TotalServiceChargeMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class TotalTaxMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class TotalTipMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class VariationTotalPriceMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class Discount
    {
        public string uid { get; set; }
        public string catalog_object_id { get; set; }
        public object catalog_version { get; set; }
        public string name { get; set; }
        public string percentage { get; set; }
        public AppliedMoney applied_money { get; set; }
        public string type { get; set; }
        public string scope { get; set; }
    }
    public class ChangeBackMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class AppliedDiscount
    {
        public string uid { get; set; }
        public string discount_uid { get; set; }
        public AppliedMoney applied_money { get; set; }
    }
    public class BuyerTenderedMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class CashDetails
    {
        public BuyerTenderedMoney buyer_tendered_money { get; set; }
        public ChangeBackMoney change_back_money { get; set; }
    }
    public class TotalPriceMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class ServiceCharge
    {
        public string uid { get; set; }
        public string percentage { get; set; }
        public AppliedMoney applied_money { get; set; }
        public string calculation_phase { get; set; }
        public bool taxable { get; set; }
        public TotalMoney total_money { get; set; }
        public TotalTaxMoney total_tax_money { get; set; }
        public List<AppliedTaxis> applied_taxes { get; set; }
        public string catalog_object_id { get; set; }
        public object catalog_version { get; set; }
        public string type { get; set; }

    }




    #endregion

    #region // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);


    public class ApplicationDetails
    {
        public string square_product { get; set; }
    }

    public class ApprovedMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }
    public class CardPaymentTimeline
    {
        public DateTime authorized_at { get; set; }
        public DateTime captured_at { get; set; }
        public DateTime? voided_at { get; set; }
    }

    public class DeviceDetails
    {
        public string device_id { get; set; }
        public string device_name { get; set; }
        public string device_installation_id { get; set; }
    }

    public class Error
    {
        public string code { get; set; }
        public string detail { get; set; }
        public string category { get; set; }
    }

    public class Payment
    {
        public string id { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public AmountMoney amount_money { get; set; }
        public string status { get; set; }
        public string source_type { get; set; }
        public CardDetails card_details { get; set; }
        public string location_id { get; set; }
        public string order_id { get; set; }
        public List<ProcessingFee> processing_fee { get; set; }
        public TotalMoney total_money { get; set; }
        public ApprovedMoney approved_money { get; set; }
        public string receipt_number { get; set; }
        public string receipt_url { get; set; }
        public DeviceDetails device_details { get; set; }
        public ApplicationDetails application_details { get; set; }
        public string version_token { get; set; }
        public ExternalDetails external_details { get; set; }
        public RefundedMoney refunded_money { get; set; }
        public List<string> refund_ids { get; set; }
        public string employee_id { get; set; }
        public string team_member_id { get; set; }    
        public TipMoney tip_money { get; set; }        
    }

  
    public class ExternalDetails
    {
        public string type { get; set; }
        public string source { get; set; }
    }
    public class ProcessingFee
    {
        public DateTime effective_at { get; set; }
        public string type { get; set; }
        public AmountMoney amount_money { get; set; }
    }

    #endregion
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class RelatedObject
    {
        public string type { get; set; }
        public string id { get; set; }
        public DateTime updated_at { get; set; }
        public DateTime created_at { get; set; }
        public long version { get; set; }
        public bool is_deleted { get; set; }
        public List<CatalogV1Id> catalog_v1_ids { get; set; }
        public bool present_at_all_locations { get; set; }
        public List<string> present_at_location_ids { get; set; }
        public ItemData item_data { get; set; }
    }
    public class RefundedMoney
    {
        public int amount { get; set; }
        public string currency { get; set; }
    }

    public class Root
    {
        public Payment payment { get; set; }
    }


    public class ReturnServiceCharge
    {
        public string uid { get; set; }
        public string source_service_charge_uid { get; set; }
        public string catalog_object_id { get; set; }
        public long catalog_version { get; set; }
        public string percentage { get; set; }
        public AppliedMoney applied_money { get; set; }
        public TotalMoney total_money { get; set; }
        public TotalTaxMoney total_tax_money { get; set; }
        public string calculation_phase { get; set; }
        public bool taxable { get; set; }
        public List<AppliedTaxis> applied_taxes { get; set; }
    }

    public class ReturnTaxis
    {
        public string uid { get; set; }
        public string catalog_object_id { get; set; }
        public long catalog_version { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public string percentage { get; set; }
        public AppliedMoney applied_money { get; set; }
        public string scope { get; set; }
    }





    #region body filter
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class ClosedAt
    {
        public string start_at { get; set; }
        public string end_at { get; set; }
    }

    public class DateTimeFilter
    {
        public Created_at created_at { get; set; }
    }

    public class Filter
    {
        public DateTimeFilter date_time_filter { get; set; }
        public StateFilter state_filter { get; set; }
    }

    public class Query
    {
        public Filter filter { get; set; }
        //public Sort sort { get; set; }
    }

    public class Root_Body
    {
        public string cursor { get; set; }
        public List<string> location_ids { get; set; }
        public Query query { get; set; }
    }

    public class Sort
    {
        public string sort_field { get; set; }
        public string sort_order { get; set; }
    }

    public class StateFilter
    {
        public List<string> states { get; set; }
    }
    public class Created_at
    {
        public string start_at { get; set; }
        public string end_at { get; set; }
    }

    #endregion
}
