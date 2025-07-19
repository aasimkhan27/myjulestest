using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace ViewModels
{
    public class CashupModel
    {

        public decimal CUSTOMER_ID { get; set; }
        public decimal ID { get; set; }
        public decimal CASHUP_MAIN_ID { get; set; }
        public decimal INTEGRATION_STATUS { get; set; }
        public decimal RESTAURANT_ID { get; set; }
        public decimal BRANCH_ID { get; set; }
        public decimal AREA_ID { get; set; }
        public decimal TILL_ID { get; set; }
        public decimal SESSION_ID { get; set; }
        public decimal USER_ID { get; set; }
        public decimal TOTAL_FLOAT { get; set; }
        public decimal TOTAL_CASH { get; set; }
        public decimal TOTAL_CARD { get; set; }
        public decimal NOTE_TABLE_ID { get; set; }
        public decimal NOTE_TYPE_ID { get; set; }
        public decimal TOTAL_PETTY_CASH { get; set; }
        public decimal TOTAL_CHEQUE { get; set; }
        public decimal ACCOUNT_TOTAL { get; set; }
        public decimal ISSUE_TOTAL { get; set; }
        public decimal DEPOSIT_TOTAL { get; set; }
        public decimal REDEEMED_TOTAL { get; set; }
        public decimal VOID_COUNT { get; set; }
        public decimal VOID_TOTAL { get; set; }
        public decimal COMPLEMENTRY_TOTAL { get; set; }
        public decimal UPLOAD_ID { get; set; }
        public decimal REMOVE_FLAG { get; set; }
        public decimal TOTAL_SALES { get; set; }
        public decimal TOTAL_TAX { get; set; }
        public decimal CUSTOMER_PAYMENTS { get; set; }
        public decimal DUE_ROUNDING { get; set; }
        public decimal GIFT_CERT_TOTAL { get; set; }
        public decimal OPT_SVC_CH { get; set; }
        public decimal HOUSE_TIPS { get; set; }
        public decimal ROA_TOTAL { get; set; }
        public decimal GO_TO_SURCHARGES { get; set; }
        public decimal ZONE_CHARGES { get; set; }
        public decimal PAID_OUTS { get; set; }
        public decimal EMP_TIPOUTS { get; set; }
        public decimal BANK_GC_CASHOUTS { get; set; }
        public decimal TOTAL_ACCOUNTABLE { get; set; }
        public decimal ENTITY_ID { get; set; }
        public decimal DOB { get; set; }

        public IList<decimal> Cashup_Epos_Header { get; set; }
        public IList<decimal> MEDIA_TOTAL_EPOS_HEADER { get; set; }
        public IList<decimal> EH_DISCOUNT_TOTAL { get; set; }
        public IList<decimal> VOIDED_ITEMS { get; set; }
        public IList<decimal> SERVING_PERIOD_TOTAL { get; set; }

        public decimal INTEGRATION_TYPE_ID { get; set; }
        public string NOTE { get; set; }
        public string URL_PARAMETERS { get; set; }
        public string API_KEY { get; set; }
        public string CASHUP_HEADER_ID { get; set; }
        public string ENCRYPTED_USER_ID { get; set; }
        public string UPLOAD_TYPE_ID { get; set; }
        public string NEW_FILE_NAME { get; set; }
        public string ORIGINAL_FILE_NAME { get; set; }
        public string SERVER_FILE_NAME { get; set; }
        public string FILE_PATH { get; set; }
        public string VIRTUAL_PATH { get; set; }
        public string URL_PATH { get; set; }
        public string ERROR_MESSAGE { get; set; }

        public int ATTACHMENT_TYPE_ID { get; set; }
        public int TABLE_ID { get; set; }
        public int TYPE { get; set; }
        public int DECLARATION_TYPE_ID { get; set; }
        public int STEP_NO { get; set; }
        public int CURRENCY_ID { get; set; }
        public int INTEGRATION_SYSTEM_ID { get; set; }
        public int MM_INTEGRATION_SYSTEM_ID { get; set; }
        public int MODULE_ID { get; set; }
        public string USERID { get; set; }
        public string PASSWORD { get; set; }
        public bool IS_OUTBOUND { get; set; }
        public bool INTEGRATION_PICKUP_FLAG { get; set; }
        public Nullable<int> GROUP_ID { get; set; }
        public string CASHUP_START_DATE { get; set; }
        public string CASHUP_END_DATE { get; set; }


        public DataTable VITA_MOJO_HEADER { get; set; }
        public DataTable VITA_MOJO_LINE { get; set; }
        public DataTable OMEGA_HEADER { get; set; }
        public DataTable OMEGA_PAYMENTS { get; set; }
        public DataTable OMEGA_DETAILS { get; set; }
        public DataTable OMEGA_DISCOUNT { get; set; }

        public DataTable LSL_RECEIPT_FIELDS { get; set; }
        public DataTable LSL_ITEMS_FIELDS { get; set; }
        public DataTable LSL_PAYMENTS_FIELDS { get; set; }
        public DataTable LSL_TAX_INFO { get; set; }

        public DataTable LSL_ACTION_ITEMS { get; set; }
        public DataTable DECLARATION_DETAILS { get; set; }
        public DataTable COMP_DECLARATION { get; set; }
        public DataTable EPOS_DISCOUNTS_TYPE { get; set; }
        public DataTable EPOS_TAXES_TYPE { get; set; }
        public DataTable EPOS_SERVING_PERIOD_TYPE { get; set; }
        public DataTable INTEGRATION_DATA_TYPE { get; set; }
        public DateTime CASHUP_DATE { get; set; }
        public DataTable DT_GROUP_INFO { get; set; }
        public DataTable DT_HEADER { get; set; }
        public DataTable DT_LINES { get; set; }
        public DataTable DT_PAYMENT { get; set; }
        public DataTable DT_LINE_CATEGORIES { get; set; }
        public DataTable DT_SURCHARGES { get; set; }
        public DataTable DT_TABLE_TYPES { get; set; }
        public DataTable DT_EVENTS { get; set; }
        public DataTable DT_CLEARS { get; set; }
        public DataTable DT_LINKED_ITEM_TYPES { get; set; }
        public DataTable DT_EMPLOYEES { get; set; }
        public DataTable DT_COMP { get; set; }
        public DataTable DT_VOID { get; set; }
        public DataTable LSL_GROUP_MASTER { get; set; }
        public DataTable LSL_PRODUCT_LIST { get; set; }
        public DataTable LSL_PRODUCT_ADDITIONS { get; set; }
        public DataTable LSL_PRODUCT_ADDITIONS_VALUES { get; set; }
        public DataTable OMNIVORE_TICKETS { get; set; }
        public DataTable OMNIVORE_TICKET_ITEMS_TYPE { get; set; }
        public DataTable OMNIVORE_TICKET_ITEM_MODIFIER_TYPE { get; set; }
        public DataTable OMNIVORE_TICKET_PAYMENTS_TYPE { get; set; }
        public DataTable OMNIVORE_TICKET_DISCOUNTS_TYPE { get; set; }
        public DataTable OMNIVORE_TICKET_SERVICE_CHARGES_TYPE { get; set; }
        public DataSet DATATABLE_SQUARE_UP_DS { get; set; }
        public DataTable TISSL_HEADER { get; set; }
        public DataTable TISSL_LINES { get; set; }
        public DataTable TISSL_PAYMENTS { get; set; }
        public DataTable TISSL_DISCOUNTS { get; set; }
        public DataTable TISSL_REFUNDS { get; set; }
        public DataTable TISSL_SERVICE_CHARGES { get; set; }
        public DataTable TISSL_MODIFIERS { get; set; }
        public DataTable TISSL_TIPS { get; set; }
        public DataTable TISSL_CHARITY { get; set; }
        public DataTable TISSL_VOID_TRANS { get; set; }
        public DataTable TISSL_TENDER_REFUND { get; set; }
        public DataTable TISSL_VOID_ITEMS { get; set; }
        public DataTable TISSL_REFUND_TRANS { get; set; }

        public DataTable ICG_SALES_HEADER { get; set; }
        public DataTable ICG_SALES_LINES { get; set; }
        public DataTable ICG_SALES_HEADER_TAXES { get; set; }
        public DataTable ICG_SALES_COLLECTION { get; set; }
        public DataTable ICG_SALES_MODIFIERS { get; set; }
        public DataTable ICG_ITEMS { get; set; }

        public DataTable IIKO_HEADER { get; set; }
        public DataTable IIKO_LINES { get; set; }
        public DataTable IIKO_PAYMENTS { get; set; }

        public DataTable EPOS_SALES_HEADER { get; set; }
        public DataTable EPOS_SALES_LINES { get; set; }
        public DataTable EPOS_SALES_PAYMENTS { get; set; }
        public DataTable EPOS_SALES_DISCOUNTS { get; set; }

        public DataTable ITB_SALES_HEADER { get; set; }
        public DataTable ITB_PAYMENTS_DATA { get; set; }

        public DataTable KOBAS_HEADER { get; set; }
        public DataTable KOBAS_ITEMS { get; set; }
        public DataTable KOBAS_ITEMS_MODIFIERS { get; set; }
        public DataTable KOBAS_ITEMS_MODIFIERS_RECIPE { get; set; }
        public DataTable KOBAS_ITEMS_RECIPE { get; set; }
        public DataTable KOBAS_PAYMENTS { get; set; }


        public DataTable LOL_ORDERS_TYPE { get; set; }
        public DataTable LOL_ORDERS_LINE_TYPE { get; set; }
        public DataTable LOL_ORDERS_PAYMENTS_TYPE { get; set; }
        public DataTable LOL_ORDERS_LINE_MODIFIERS_TYPE { get; set; }
        public DataTable SQUARE_UP_CATEGORY_TYPE { get; set; }
        public DataTable SQURL_SESSION { get; set; }
        public DataTable SQURL_INTEGRATION_DETAIL { get; set; }

        public DataTable DATATABLE_COMMON { get; set; }
        public DataTable DATATABLE_1 { get; set; }
        public DataTable DATATABLE_2 { get; set; }
        public DataTable DATATABLE_3 { get; set; }
        public DataTable DATATABLE_4 { get; set; }
        public DataTable DATATABLE_5 { get; set; }
        public DataTable DATATABLE_6 { get; set; }
        public DataTable DATATABLE_LOCATION { get; set; }
        public DataTable DATATABLE_BRANCH { get; set; }
        public DataTable SYMPHONY_REFRESH_TOKEN_DT { get; set; }
        public int EPOS_THREAD_SLEEP_TIME { get; set; }

        //public decimal ID { get; set; }
        //public decimal CASHUP_MAIN_ID { get; set; }
        //public decimal INTEGRATION_STATUS { get; set; }
        //public decimal RESTAURANT_ID { get; set; }
        //public decimal BRANCH_ID { get; set; }
        //public decimal AREA_ID { get; set; }
        //public decimal TILL_ID { get; set; }
        //public decimal SESSION_ID { get; set; }
        //public decimal USER_ID { get; set; }
        //public decimal TOTAL_FLOAT { get; set; }
        //public decimal TOTAL_CASH { get; set; }
        //public decimal TOTAL_CARD { get; set; }
        //public decimal NOTE_TABLE_ID { get; set; }
        //public decimal NOTE_TYPE_ID { get; set; }
        //public decimal TOTAL_PETTY_CASH { get; set; }
        //public decimal TOTAL_CHEQUE { get; set; }
        //public decimal ACCOUNT_TOTAL { get; set; }
        //public decimal ISSUE_TOTAL { get; set; }
        //public decimal DEPOSIT_TOTAL { get; set; }
        //public decimal REDEEMED_TOTAL { get; set; }
        //public decimal VOID_COUNT { get; set; }
        //public decimal VOID_TOTAL { get; set; }
        //public decimal COMPLEMENTRY_TOTAL { get; set; }
        //public int TYPE { get; set; }
        //public int DECLARATION_TYPE_ID { get; set; }
        //public int STEP_NO { get; set; }
        //public int CURRENCY_ID { get; set; }
        //public int INTEGRATION_SYSTEM_ID { get; set; }
        //public DataTable DECLARATION_DETAILS { get; set; }
        //public DataTable COMP_DECLARATION { get; set; }
        //public DataTable EPOS_DISCOUNTS_TYPE { get; set; }
        //public DataTable EPOS_TAXES_TYPE { get; set; }
        //public DataTable EPOS_SERVING_PERIOD_TYPE { get; set; }
        //public DataTable INTEGRATION_DATA_TYPE { get; set; }
        //public DateTime CASHUP_DATE { get; set; }

        //public DataTable DT_GROUP_INFO { get; set; }

        //public DataTable DT_HEADER { get; set; }
        //public DataTable DT_LINES { get; set; }
        //public DataTable DT_PAYMENT { get; set; }

        //public DataTable DT_LINE_CATEGORIES { get; set; }
        //public DataTable DT_SURCHARGES { get; set; }
        //public DataTable DT_TABLE_TYPES { get; set; }
        //public DataTable DT_EVENTS { get; set; }
        //public DataTable DT_CLEARS { get; set; }
        //public DataTable DT_LINKED_ITEM_TYPES { get; set; }
        //public DataTable DT_EMPLOYEES { get; set; }
        //public DataTable DT_COMP { get; set; }
        //public DataTable DT_VOID { get; set; }

        //public string NOTE { get; set; }
        //public int TABLE_ID { get; set; }
        //public string URL_PARAMETERS { get; set; }
        //public string API_KEY { get; set; }

        //public string CASHUP_HEADER_ID { get; set; }

        //public string ENCRYPTED_USER_ID { get; set; }
        //public string UPLOAD_TYPE_ID { get; set; }
        //public int ATTACHMENT_TYPE_ID { get; set; }
        //public string NEW_FILE_NAME { get; set; }
        //public string ORIGINAL_FILE_NAME { get; set; }
        //public string SERVER_FILE_NAME { get; set; }
        //public string FILE_PATH { get; set; }
        //public string VIRTUAL_PATH { get; set; }
        //public decimal UPLOAD_ID { get; set; }

        //public decimal REMOVE_FLAG { get; set; }
        //public IList<decimal> Cashup_Epos_Header { get; set; }
        //public IList<decimal> MEDIA_TOTAL_EPOS_HEADER { get; set; }
        //public IList<decimal> EH_DISCOUNT_TOTAL { get; set; }
        //public IList<decimal> VOIDED_ITEMS { get; set; }
        //public IList<decimal> SERVING_PERIOD_TOTAL { get; set; }
        //public decimal TOTAL_SALES { get; set; }
        //public decimal TOTAL_TAX { get; set; }
        //public decimal CUSTOMER_PAYMENTS { get; set; }
        //public decimal DUE_ROUNDING { get; set; }
        //public decimal GIFT_CERT_TOTAL { get; set; }
        //public decimal OPT_SVC_CH { get; set; }
        //public decimal HOUSE_TIPS { get; set; }
        //public decimal ROA_TOTAL { get; set; }
        //public decimal GO_TO_SURCHARGES { get; set; }
        //public decimal ZONE_CHARGES { get; set; }
        //public decimal PAID_OUTS { get; set; }
        //public decimal EMP_TIPOUTS { get; set; }
        //public decimal BANK_GC_CASHOUTS { get; set; }
        //public decimal TOTAL_ACCOUNTABLE { get; set; }
        //public decimal ENTITY_ID { get; set; }
        //public decimal DOB { get; set; }

        //public DataTable VITA_MOJO_HEADER { get; set; }
        //public DataTable VITA_MOJO_LINE { get; set; }

        //public DataTable OMEGA_HEADER { get; set; }
        //public DataTable OMEGA_PAYMENTS { get; set; }
        //public DataTable OMEGA_DETAILS { get; set; }
        //public DataTable OMEGA_DISCOUNT { get; set; }




        //public DataTable LSL_RECEIPT_FIELDS { get; set; }
        //public DataTable LSL_ITEMS_FIELDS { get; set; }
        //public DataTable LSL_PAYMENTS_FIELDS { get; set; }
        //public DataTable LSL_TAX_INFO { get; set; }


        //public DataTable LSL_ACTION_ITEMS { get; set; }
        //public DataTable DECLARATION_DETAILS { get; set; }
        //public DataTable COMP_DECLARATION { get; set; }
        //public DataTable EPOS_DISCOUNTS_TYPE { get; set; }
        //public DataTable EPOS_TAXES_TYPE { get; set; }
        //public DataTable EPOS_SERVING_PERIOD_TYPE { get; set; }
        //public DataTable INTEGRATION_DATA_TYPE { get; set; }
        //public DateTime CASHUP_DATE { get; set; }
        //public DataTable DT_GROUP_INFO { get; set; }
        //public DataTable DT_HEADER { get; set; }
        //public DataTable DT_LINES { get; set; }
        //public DataTable DT_PAYMENT { get; set; }
        //public DataTable DT_LINE_CATEGORIES { get; set; }
        //public DataTable DT_SURCHARGES { get; set; }
        //public DataTable DT_TABLE_TYPES { get; set; }
        //public DataTable DT_EVENTS { get; set; }
        //public DataTable DT_CLEARS { get; set; }
        //public DataTable DT_LINKED_ITEM_TYPES { get; set; }
        //public DataTable DT_EMPLOYEES { get; set; }
        //public DataTable DT_COMP { get; set; }
        //public DataTable DT_VOID { get; set; }
        //public DataTable LSL_GROUP_MASTER { get; set; }
        //public DataTable LSL_PRODUCT_LIST { get; set; }
        //public DataTable LSL_PRODUCT_ADDITIONS { get; set; }
        //public DataTable LSL_PRODUCT_ADDITIONS_VALUES { get; set; }
        public class Root_Currency_Conversion
        {
            [JsonProperty("result")]
            public string Result { get; set; }

            [JsonProperty("documentation")]
            public Uri Documentation { get; set; }

            [JsonProperty("terms_of_use")]
            public Uri TermsOfUse { get; set; }

            [JsonProperty("year")]
            public long Year { get; set; }

            [JsonProperty("month")]
            public long Month { get; set; }

            [JsonProperty("day")]
            public long Day { get; set; }

            [JsonProperty("base_code")]
            public string BaseCode { get; set; }

            [JsonProperty("conversion_rates")]
            public System.Collections.Generic.Dictionary<string, decimal> ConversionRates { get; set; }
        }
        public class CURRENCY_CONVERSION_TYPE
        {
            public string CODE { get; set; }
            public decimal RATE { get; set; }
        }
    }

}