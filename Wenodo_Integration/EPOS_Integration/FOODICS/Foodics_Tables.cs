using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.FOODICS
{
    public class Foodics_Tables
    {
        public DataTable DATATABLE_FOODICS_COMMON = null;
        public DataTable DATATABLE_FOODICS_BRANCH = null;
        public DataTable DATATABLE_FOODICS_1 = null;
        public DataTable DATATABLE_FOODICS_2 = null;
        public DataTable DATATABLE_FOODICS_3 = null;
        public DataTable DATATABLE_FOODICS_4 = null;
        public DataTable DATATABLE_FOODICS_5 = null;
        public DataTable DATATABLE_FOODICS_6 = null;
        public DataTable DATATABLE_FOODICS_7 = null;
        public class FOODICS_BRANCHE_TYPE
        {
            public string BRANCHES_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public string REFERENCE { get; set; }
            public int? TYPE { get; set; }
            public string LATITUDE { get; set; }
            public string LONGITUDE { get; set; }
            public string PHONE { get; set; }
            public string OPENING_FROM { get; set; }
            public string OPENING_TO { get; set; }
            public string INVENTORY_END_OF_DAY_TIME { get; set; }
            public string RECEIPT_HEADER { get; set; }
            public string RECEIPT_FOOTER { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
            public bool RECEIVES_ONLINE_ORDERS { get; set; }
            public bool ACCEPTS_RESERVATIONS { get; set; }
            public int? RESERVATION_DURATION { get; set; }
            public string RESERVATION_TIMES { get; set; }
            public string ADDRESS { get; set; }
            public string SETTINGS_BRANCH_TAX_NUMBER { get; set; }
            public bool? SETTINGS_DISPLAY_BACKGROUND_IMAGE { get; set; }
            public string SETTINGS_BRANCH_COMMERCIAL_REGISTRATION_NUMBER { get; set; }
        }
        public class FOODICS_PRODUCTS_TYPE
        {
            public string PRODUCT_ID { get; set; }
            public string SKU { get; set; }
            public string BARCODE { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public string DESCRIPTION { get; set; }
            public string DESCRIPTION_LOCALIZED { get; set; }
            public string IMAGE { get; set; }
            public bool IS_ACTIVE { get; set; }
            public bool IS_STOCK_PRODUCT { get; set; }
            public bool IS_NON_REVENUE { get; set; }
            public bool IS_READY { get; set; }
            public int PRICING_METHOD { get; set; }
            public int SELLING_METHOD { get; set; }
            public int COSTING_METHOD { get; set; }
            public string PREPARATION_TIME { get; set; }
            public decimal PRICE { get; set; }
            public decimal COST { get; set; }
            public decimal CALORIES { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
            public string META { get; set; }
        }
        public class FOODICS_CATEGORIES_TYPE
        {
            public string CATEGORIES_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public string REFERENCE { get; set; }
            public string IMAGE { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
        }
        public class FOODICS_PAYMENT_METHODS_TYPE
        {
            public string PAYMENTS_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public int? TYPE { get; set; }
            public string CODE { get; set; }
            public bool AUTO_OPEN_DRAWER { get; set; }
            public bool IS_ACTIVE { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
            public int INDEX_ID { get; set; }
        }
        public class FOODICS_TAXS_TYPE
        {
            public string TAXES_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public decimal RATE { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
        }
        public class FOODICS_TAXES_TAX_GROUPS_TYPE
        {
            public string TAXES_TAX_GROUP_ID { get; set; }
            public string TAXES_TAX_GROUP_NAME { get; set; }
            public string TAXES_TAX_GROUP_NAME_LOCALIZED { get; set; }
            public string TAXES_TAX_GROUP_REFERENCE { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
            public string PIVOT_TAX_ID { get; set; }
            public string PIVOT_TAX_GROUP_ID { get; set; }
            public string REF_TAXES_ID { get; set; }
        }
        public class FOODICS_MODIFIERS_TYPE
        {
            public string MODIFIERS_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public bool IS_READY { get; set; }
            public string REFERENCE { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
        }
        public class FOODICS_MODIFIERS_OPTIONS_TYPE
        {
            public string MODIFIERS_OPTIONS_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public string SKU { get; set; }
            public bool IS_ACTIVE { get; set; }
            public int? COSTING_METHOD { get; set; }
            public decimal? PRICE { get; set; }
            public decimal? COST { get; set; }
            public decimal? CALORIES { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
            public int? MODIFIERS_OPTIONS_INDEX { get; set; }
            public string MOD_OPT_MODIFIER_ID { get; set; }
        }
        public class FOODICS_REASONS_TYPE
        {
            public string REASONS_ID { get; set; }
            public int? TYPE { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
        }

        public class FOODICS_ORDERS_PRODUCTS_OPTIONS_TYPE
        {
            public string ORDERS_PRODUCTS_OPTIONS_ID { get; set; }
            public decimal? QUANTITY { get; set; }
            public decimal? PARTITION { get; set; }
            public decimal? UNIT_PRICE { get; set; }
            public decimal? TOTAL_PRICE { get; set; }
            public decimal? TOTAL_COST { get; set; }
            public decimal? TAX_EXCLUSIVE_UNIT_PRICE { get; set; }
            public decimal? TAX_EXCLUSIVE_TOTAL_PRICE { get; set; }
            public decimal? TAX_EXCLUSIVE_DISCOUNT_AMOUNT { get; set; }
            public DateTime? ADDED_AT { get; set; }
            public string MODIFIER_OPTION_ID { get; set; }
            public string MODIFIER_OPTION_NAME { get; set; }
            public string MODIFIER_OPTION_NAME_LOCALIZED { get; set; }
            public string MODIFIER_OPTION_SKU { get; set; }
            public bool MODIFIER_OPTION_IS_ACTIVE { get; set; }
            public int? MODIFIER_OPTION_COSTING_METHOD { get; set; }
            public decimal? MODIFIER_OPTION_PRICE { get; set; }
            public decimal? MODIFIER_OPTION_COST { get; set; }
            public decimal? MODIFIER_OPTION_CALORIES { get; set; }
            public DateTime? MODIFIER_OPTION_CREATED_AT { get; set; }
            public DateTime? MODIFIER_OPTION_UPDATED_AT { get; set; }
            public DateTime? MODIFIER_OPTION_DELETED_AT { get; set; }
            public int? MODIFIER_OPTION_INDEX { get; set; }
            public string REF_ORDERS_ID { get; set; }
            public string REF_FOODICS_ORDERS_PRODUCTS_ID { get; set; }
        }
        public class FOODICS_ORDERS_PRODUCTS_TYPE
        {
            public string FOODICS_ORDERS_PRODUCTS_ID { get; set; }
            public string DISCOUNT_TYPE { get; set; }
            public decimal? QUANTITY { get; set; }
            public decimal? RETURNED_QUANTITY { get; set; }
            public decimal? UNIT_PRICE { get; set; }
            public decimal? DISCOUNT_AMOUNT { get; set; }
            public decimal? TOTAL_PRICE { get; set; }
            public decimal? TOTAL_COST { get; set; }
            public decimal? TAX_EXCLUSIVE_DISCOUNT_AMOUNT { get; set; }
            public decimal? TAX_EXCLUSIVE_UNIT_PRICE { get; set; }
            public decimal? TAX_EXCLUSIVE_TOTAL_PRICE { get; set; }
            public int? STATUS { get; set; }
            public int? IS_INGREDIENTS_WASTED { get; set; }
            public string DELAY_IN_SECONDS { get; set; }
            public string KITCHEN_NOTES { get; set; }
            public string META_UUID { get; set; }
            public DateTime? ADDED_AT { get; set; }
            public DateTime? CLOSED_AT { get; set; }
            public string PROMOTION { get; set; }
            public string DISCOUNT { get; set; }
            public string ORDERS_PRODUCTS_ID { get; set; }
            public string ORDERS_PRODUCTS_SKU { get; set; }
            public string ORDERS_PRODUCTS_BARCODE { get; set; }
            public string ORDERS_PRODUCTS_NAME { get; set; }
            public string ORDERS_PRODUCTS_NAME_LOCALIZED { get; set; }
            public string ORDERS_PRODUCTS_DESCRIPTION { get; set; }
            public string ORDERS_PRODUCTS_DESCRIPTION_LOCALIZED { get; set; }
            public string ORDERS_PRODUCTS_IMAGE { get; set; }
            public bool ORDERS_PRODUCTS_IS_ACTIVE { get; set; }
            public bool ORDERS_PRODUCTS_IS_STOCK_PRODUCT { get; set; }
            public bool ORDERS_PRODUCTS_IS_NON_REVENUE { get; set; }
            public bool ORDERS_PRODUCTS_IS_READY { get; set; }
            public int? ORDERS_PRODUCTS_PRICING_METHOD { get; set; }
            public int? ORDERS_PRODUCTS_SELLING_METHOD { get; set; }
            public int? ORDERS_PRODUCTS_COSTING_METHOD { get; set; }
            public string ORDERS_PRODUCTS_PREPARATION_TIME { get; set; }
            public decimal? ORDERS_PRODUCTS_PRICE { get; set; }
            public decimal? ORDERS_PRODUCTS_COST { get; set; }
            public decimal? ORDERS_PRODUCTS_CALORIES { get; set; }
            public string ORDERS_PRODUCTS_CATEGORY_ID { get; set; }
            public string ORDERS_PRODUCTS_CATEGORY_NAME { get; set; }
            public string ORDERS_PRODUCTS_CATEGORY_REFERENCE { get; set; }
            public string ORDERS_PRODUCTS_CREATOR_ID { get; set; }
            public string ORDERS_PRODUCTS_CREATOR_NAME { get; set; }
            public string ORDERS_PRODUCTS_CREATOR_PIN { get; set; }
            public string ORDERS_PRODUCTS_VOID_RZN_ID { get; set; }
            public int? ORDERS_PRODUCTS_VOID_RZN_TYPE { get; set; }
            public string ORDERS_PRODUCTS_VOID_RZN_NAME { get; set; }
            public string ORDERS_PRODUCTS_VOID_RZN_NAME_LOCALIZED { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOID_RZN_CREATED_AT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOID_RZN_UPDATED_AT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOID_RZN_DELETED_AT { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_ID { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_NAME { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_NUMBER { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_EMAIL { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_PHONE { get; set; }
            public string ORDERS_PRODUCTS_VOIDER_LANG { get; set; }
            public bool ORDERS_PRODUCTS_VOIDER_DISPLAY_LOCALIZED_NAMES { get; set; }
            public bool ORDERS_PRODUCTS_VOIDER_EMAIL_VERIFIED { get; set; }
            public bool ORDERS_PRODUCTS_VOIDER_MUST_USE_FINGERPRINT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOIDER_LAST_CONSOLE_LOGIN_AT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOIDER_LAST_CASHIER_LOGIN_AT { get; set; }
            public bool ORDERS_PRODUCTS_VOIDER_ASSOCIATE_TO_ALL_BRANCHES { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOIDER_CREATED_AT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOIDER_UPDATED_AT { get; set; }
            public DateTime? ORDERS_PRODUCTS_VOIDER_DELETED_AT { get; set; }
            public bool ORDERS_PRODUCTS_VOIDER_TWO_FACTOR_AUTH_ENABLED { get; set; }
            public string REF_ORDERS_ID { get; set; }
        }
        public class FOODICS_ORDERS_PAYMENT_TYPE
        {
            public string ORDERS_PAYMENT_ID { get; set; }
            public decimal? AMOUNT { get; set; }
            public decimal? TENDERED { get; set; }
            public decimal? TIPS { get; set; }
            public DateTime? BUSINESS_DATE { get; set; }
            public DateTime? ADDED_AT { get; set; }
            public string USER_ID { get; set; }
            public string USER_NAME { get; set; }
            public string USER_PIN { get; set; }
            public string payment_method_ID { get; set; }
            public string payment_method_NAME { get; set; }
            public int? payment_method_TYPE { get; set; }
            public string payment_method_CODE { get; set; }
            public bool PAYMENT_METHOD_IS_ACTIVE { get; set; }
            public string REF_ORDERS_ID { get; set; }
        }
        public class FOODICS_ORDERS_TYPE
        {
            public string ORDERS_ID { get; set; }
            public string APP_ID { get; set; }
            public string PROMOTION_ID { get; set; }
            public int? DISCOUNT_TYPE { get; set; }
            public string REFERENCE_X { get; set; }
            public int? NUMBER { get; set; }
            public int? TYPE { get; set; }
            public int? SOURCE { get; set; }
            public int? STATUS { get; set; }
            public int? DELIVERY_STATUS { get; set; }
            public int? GUESTS { get; set; }
            public string KITCHEN_NOTES { get; set; }
            public string CUSTOMER_NOTES { get; set; }
            public DateTime? BUSINESS_DATE { get; set; }
            public decimal? SUBTOTAL_PRICE { get; set; }
            public decimal? DISCOUNT_AMOUNT { get; set; }
            public decimal? ROUNDING_AMOUNT { get; set; }
            public decimal? TOTAL_PRICE { get; set; }
            public decimal? TAX_EXCLUSIVE_DISCOUNT { get; set; }
            public string DELAY_IN_SECONDS { get; set; }
            public DateTime? OPENED_AT { get; set; }
            public DateTime? ACCEPTED_AT { get; set; }
            public DateTime? DUE_AT { get; set; }
            public DateTime? DRIVER_ASSIGNED_AT { get; set; }
            public DateTime? DISPATCHED_AT { get; set; }
            public DateTime? DRIVER_COLLECTED_AT { get; set; }
            public DateTime? DELIVERED_AT { get; set; }
            public DateTime? CLOSED_AT { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public string REFERENCE { get; set; }
            public int? CHECK_NUMBER { get; set; }
            public string META_FOODICS_DEVICE_ID { get; set; }
            public bool META_FOODICS_AUTO_CLOSED { get; set; }
            public DateTime? META_FOODICS_KITCHEN_RECEIVED_AT { get; set; }
            public DateTime? META_FOODICS_BUSINESS_DATE_IN_UTC { get; set; }
            public string META_FOODICS_VOID_APPROVER_ID { get; set; }
            public string META_FOODICS_PRINTING_MODEL { get; set; }
            public string META_FOODICS_PRINTING_STATUS { get; set; }
            public string PROMOTION { get; set; }
            public string ORIGINAL_ORDER { get; set; }
            public string TABLE_ID { get; set; }
            public string TABLE_NAME { get; set; }
            public int? TABLE_STATUS { get; set; }
            public int? TABLE_SEATS { get; set; }
            public string TABLE_SECTION_ID { get; set; }
            public string TABLE_SECTION_NAME { get; set; }
            public string CREATOR_ID { get; set; }
            public string CREATOR_NAME { get; set; }
            public string CREATOR_PIN { get; set; }
            public string CLOSER_ID { get; set; }
            public string CLOSER_NAME { get; set; }
            public string CLOSER_PIN { get; set; }
            public string DRIVER { get; set; }
            public string CUSTOMER { get; set; }
            public string CUSTOMER_ADDRESS { get; set; }
            public string DISCOUNT { get; set; }
            public string COUPON { get; set; }
            public string GIFT_CARD { get; set; }
            public string DISCOUNT_ID { get; set; }
            public string DISCOUNT_NAME { get; set; }
            public string DISCOUNT_NAME_LOCALIZED { get; set; }
            public int? DISCOUNT_QUALIFICATION { get; set; }
            public decimal? DIS_ODR_AMOUNT { get; set; }
        }
        public class FOODICS_ORDERS_META_PRODUCTS_KITCHEN_TYPE
        {
            public string PRODUCTS_KITCHEN_UUID { get; set; }
            public DateTime? PRODUCTS_KITCHEN_SENT_AT { get; set; }
            public string REF_ORDERS_ID { get; set; }
        }
        public class FOODICS_ORDERS_PRODUCTS_TAXES_TYPE
        {
            public string ORDERS_PRODUCTS_TAXES_id { get; set; }
            public string ORDERS_PRODUCTS_TAXES_name { get; set; }
            public string ORDERS_PRODUCTS_TAXES_name_localized { get; set; }
            public decimal? ORDERS_PRODUCTS_TAXES_rate { get; set; }
            public DateTime? ORDERS_PRODUCTS_TAXES_created_at { get; set; }
            public DateTime? ORDERS_PRODUCTS_TAXES_updated_at { get; set; }
            public DateTime? ORDERS_PRODUCTS_TAXES_deleted_at { get; set; }
            public decimal? TAXES_PIVOT_AMOUNT { get; set; }
            public decimal? TAXES_PIVOT_RATE { get; set; }
            public decimal? TAXES_PIVOT_TAX_EXCLUSIVE_DISCOUNT_AMOUNT { get; set; }
            public string REF_ORDERS_ID { get; set; }
            public string REF_FOODICS_ORDERS_PRODUCTS_ID { get; set; }
        }
        public class FOODICS_DISCOUNTS_TYPE
        {
            public string DISCOUNT_ID { get; set; }
            public string NAME { get; set; }
            public string NAME_LOCALIZED { get; set; }
            public int QUALIFICATION { get; set; }
            public decimal? AMOUNT { get; set; }
            public decimal? MINIMUM_PRODUCT_PRICE { get; set; }
            public decimal? MINIMUM_ORDER_PRICE { get; set; }
            public decimal? MAXIMUM_AMOUNT { get; set; }
            public bool IS_PERCENTAGE { get; set; }
            public bool IS_TAXABLE { get; set; }
            public string REFERENCE { get; set; }
            public bool ASSOCIATE_TO_ALL_BRANCHES { get; set; }
            public bool INCLUDE_MODIFIERS { get; set; }
            public DateTime? CREATED_AT { get; set; }
            public DateTime? UPDATED_AT { get; set; }
            public DateTime? DELETED_AT { get; set; }
        }
    }
}
