using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.QUADRANET
{
    public class QUADRANET_TABLES
    {
        public class QUADRANET_HEADER_TYPE
        {
            public string BRAND { get; set; }
            public decimal? SITE_ID { get; set; }
            public string SITE_NAME { get; set; }
            public decimal? BILL_HEADER_ID { get; set; }
            public decimal? CHECK_ITEM_ID { get; set; }
            public decimal? SPLIT_NUMBER { get; set; }
            public decimal? COVERS { get; set; }
            public decimal? ITEM_TOTAL { get; set; }
            public decimal? BILL_TOTAL { get; set; }
            public decimal? TAX_TOTAL { get; set; }
            public decimal? SERVICE_CHARGE { get; set; }
            public decimal? SERVICE_PERCENTAGE { get; set; }
            public decimal? DISCOUNT_TOTAL { get; set; }
            public string CUSTOMER_TABLE { get; set; }
            public DateTime? HEADER_DATE { get; set; }
            public string SESSION_NAME { get; set; }
            public decimal? SESSION_SORT_ORDER { get; set; }
            public string REPORT_GROUP_NAME { get; set; }
            public DateTime? CREATED_ON { get; set; }
            public string USER_NAME { get; set; }
            public string CLOSED_BY_NAME { get; set; }
            public decimal? TERMINAL_ID { get; set; }
            public string TERMINAL_NAME { get; set; }
            public DateTime? CHECK_CLOSE { get; set; }
            public decimal? DWELL_TIME { get; set; }
            public string BOOKING_REFERENCE { get; set; }
            public string TOP_MESSAGE { get; set; }
            public string DAY { get; set; }
            public decimal? DAY_SORT { get; set; }
            public string LOYALTY_SWIPE_ID { get; set; }
        }
        public class QUADRANET_ITEMS_TYPE
        {
            public string BRAND { get; set; }
            public decimal? SITE_ID { get; set; }
            public string SITE_NAME { get; set; }
            public decimal? BILL_HEADER_ID { get; set; }
            public decimal? CHECK_ITEM_ID { get; set; }
            public decimal? CHECK_DETAIL_ID { get; set; }
            public decimal? SPLIT_NUMBER { get; set; }
            public string BOOKING_REFERENCE { get; set; }
            public string REPORT_GROUP_NAME { get; set; }
            public string STATION_NAME { get; set; }
            public string LOCATION_NAME { get; set; }
            public decimal? COVERS { get; set; }
            public decimal? ITEM_TOTAL { get; set; }
            public decimal? BILL_TOTAL { get; set; }
            public decimal? TAX_TOTAL { get; set; }
            public decimal? SERVICE_CHARGE { get; set; }
            public decimal? DISCOUNT_TOTAL { get; set; }
            public decimal? DEPOSIT_TOTAL { get; set; }
            public string CUSTOMER_TABLE { get; set; }
            public string SESSION_NAME { get; set; }
            public string BILL_WAITER { get; set; }
            public string DESCRIPTION { get; set; }
            public string MESSAGE { get; set; }
            public string CLASS_NAME { get; set; }
            public string PF_DESCRIPTION { get; set; }
            public string CATEGORY_NAME { get; set; }
            public string CATEGORY_CODE { get; set; }
            public string PLU_CODE { get; set; }
            public string BIN_NUMBER { get; set; }
            public decimal? ITEM_ID { get; set; }
            public DateTime CREATED_ON { get; set; }
            public DateTime DATE { get; set; }
            public string WEEK { get; set; }
            public string DAY { get; set; }
            public decimal? DAY_SORT { get; set; }
            public string TERMINAL_NAME { get; set; }
            public decimal? SYSTEM_USER_ID { get; set; }
            public string USER_NAME { get; set; }
            public string BRAND_CODE { get; set; }
            public decimal? ITEM_PERCENTAGE { get; set; }
            public string STOCK_ITEM_ID { get; set; }
            public decimal? QUANTITY { get; set; }
            public decimal? COST_PRICE { get; set; }
            public decimal? MENU_PRICE { get; set; }
            public decimal? ITEMS_TOTAL { get; set; }
            public decimal? ITEMS_NET { get; set; }
            public decimal? CONTRIBUTION { get; set; }
            public string REVENUE_CENTRE_NAME { get; set; }
            public decimal PRIX_FIXE_ADJUSTMENT { get; set; }
            public decimal COMP_ADJUSTMENT { get; set; }
            public decimal SPECIAL_PRICE_ADJUSTMENT { get; set; }
            public decimal OPEN_ITEM { get; set; }
            public string DELETED_BEFORE_PAYMENT { get; set; }
            public decimal TAX_AMOUNT { get; set; }
            public string STATUS { get; set; }
            public decimal? TAX_PERCENT { get; set; }
            public string PRIX_FIXE_ID { get; set; }
            public string PARENT_CHECK_DETAIL_ID { get; set; }
            public string FIRST_CHECK_DETAIL_ID { get; set; }
            public decimal? MODE_ID { get; set; }
            public decimal? PRINT_PROFILE_ID { get; set; }
            public decimal? MODIFIER_ONLY_ITEM { get; set; }
            public string REPORTING_CATEGORY_1 { get; set; }
            public string REPORTING_CATEGORY_2 { get; set; }
            public decimal? QBRG { get; set; }
            public decimal? FRIENDLY_ORDER_NO { get; set; }
            public decimal? MINIMUM_SPEND { get; set; }
            public decimal? ORIGINAL_SERVICE_CHARGE { get; set; }
            public string FISCAL_RECEIPT_NUMBER { get; set; }
            public decimal? CI_MODE_ID { get; set; }
            public string PARENT_ITEM { get; set; }
            public string LOYALTY_SWIPE_ID { get; set; }
            public string DISCOUNT_DESCRIPTION { get; set; }
            public decimal? QUADRANET_ITEMS_KEY { get; set; }
        }
        public class QUADRANET_DISCOUNT_TYPE
        {
            public string BRAND { get; set; }
            public decimal? SITE_ID { get; set; }
            public string SITE_NAME { get; set; }
            public decimal? CHECK_ITEM_ID { get; set; }
            public decimal? CHECK_DETAIL_ID { get; set; }
            public decimal? SPLIT_NUMBER { get; set; }
            public string REVENUE_CENTRE_NAME { get; set; }
            public string CLASS_NAME { get; set; }
            public string CATEGORY_NAME { get; set; }
            public string DESCRIPTION { get; set; }
            public decimal? ITEM_ID { get; set; }
            public string PLU_CODE { get; set; }
            public decimal? QUANTITY { get; set; }
            public decimal? MENU_PRICE { get; set; }
            public decimal? TOTAL_PRICE { get; set; }
            public decimal? DISCOUNT_VALUE { get; set; }
            public bool COMP { get; set; }
            public bool PF { get; set; }
            public bool SPL { get; set; }
            public bool DISCOUNT { get; set; }
            public bool OPEN_ITEM { get; set; }
            public bool DELETED_BEFORE_PAYMENT { get; set; }
            public bool PRICED_NON_ITEM_MODIFIER { get; set; }
            public bool PRICE_ADJ { get; set; }
            public string DISC_USER_NAME { get; set; }
            public DateTime? CREATED_ON { get; set; }
            public string SESSION { get; set; }
            public string TERMINAL_NAME { get; set; }
            public string LOCATION { get; set; }
            public string CUSTOMER_TABLE_ID { get; set; }
            public string REPORT { get; set; }
            public string NOTES { get; set; }
        }
        public class QUADRANET_PAYMENTS_TYPE
        {
            public string BRAND { get; set; }
            public decimal? SITE_ID { get; set; }
            public string SITE_NAME { get; set; }
            public decimal? BILL_HEADER_ID { get; set; }
            public decimal? CHECK_ITEM_ID { get; set; }
            public decimal? PAYMENT_TYPE { get; set; }
            public string PAYMENT_NAME { get; set; }
            public string CUSTOMER_TABLE { get; set; }
            public string LOCATION_NAME { get; set; }
            public string TERMINAL_NAME { get; set; }
            public DateTime? PAYMENT_TIME { get; set; }
            public string PAYMENT_TAKEN_BY_NAME { get; set; }
            public decimal? PAYMENT_METHOD { get; set; }
            public decimal? PAYMENT_GROUP { get; set; }
            public string PAYMENT_GROUP_NAME { get; set; }
            public string INFO { get; set; }
            public string DETAILS { get; set; }
            public decimal? SERVICE_CHARGE { get; set; }
            public decimal? METHOD_TOTAL { get; set; }
            public decimal? GRATUITY { get; set; }
            public decimal? PAYMENT_TOTAL { get; set; }
            public decimal? COVERS { get; set; }
            public string COVER_TYPE { get; set; }
            public string DEPOSIT_OWNER { get; set; }
            public decimal? DEPOSIT_ID { get; set; }
            public DateTime? EVENT_DATE { get; set; }
            public string SPLIT_NUMBER { get; set; }
            public string RECEIPT_NUMBER { get; set; }
            public decimal? CHECK_PAYMENT_ID { get; set; }
        }
        public class QUADRANET_VOIDS_TYPE
        {
            public decimal SITE_ID { get; set; }
            public string SITE_NAME { get; set; }
            public decimal BILL_HEADER_ID { get; set; }
            public decimal CHECK_ITEM_ID { get; set; }
            public decimal CHECK_DETAIL_ID { get; set; }
            public decimal SPLIT_NUMBER { get; set; }
            public string REPORT_GROUP_NAME { get; set; }
            public string STATION_NAME { get; set; }
            public string LOCATION_NAME { get; set; }
            public decimal ITEM_TOTAL { get; set; }
            public decimal BILL_TOTAL { get; set; }
            public decimal TAX_TOTAL { get; set; }
            public decimal SERVICE_CHARGE { get; set; }
            public decimal DISCOUNT_TOTAL { get; set; }
            public decimal DEPOSIT_TOTAL { get; set; }
            public string CUSTOMER_TABLE { get; set; }
            public string SESSION_NAME { get; set; }
            public string BILL_WAITER { get; set; }
            public string DESCRIPTION { get; set; }
            public string CLASS_NAME { get; set; }
            public string CATEGORY_NAME { get; set; }
            public object PLU_CODE { get; set; }
            public DateTime CREATED_ON { get; set; }
            public string TERMINAL_NAME { get; set; }
            public string USER_NAME { get; set; }
            public object BRAND_CODE { get; set; }
            public decimal ITEM_PERCENTAGE { get; set; }
            public object STOCK_ITEM_ID { get; set; }
            public decimal QUANTITY { get; set; }
            public decimal COST_PRICE { get; set; }
            public decimal MENU_PRICE { get; set; }
            public decimal ITEMS_TOTAL { get; set; }
            public string REVENUE_CENTRE_NAME { get; set; }
            public decimal PRIX_FIXE_ADJUSTMENT { get; set; }
            public decimal COMP_ADJUSTMENT { get; set; }
            public decimal SPECIAL_PRICE_ADJUSTMENT { get; set; }
            public decimal OPEN_ITEM { get; set; }
            public object DELETED_BEFORE_PAYMENT { get; set; }
            public decimal TAX_AMOUNT { get; set; }
            public object STATUS { get; set; }
            public string REASON_TEXT { get; set; }
            public string DELETED_BY_NAME { get; set; }
            public string PARENT_REASON_TEXT { get; set; }
            public object MESSAGE { get; set; }
            public string CLOSED_BY_NAME { get; set; }
        }
    }
}
