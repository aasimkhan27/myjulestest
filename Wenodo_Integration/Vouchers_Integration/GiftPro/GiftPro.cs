using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using Vouchers_Integration.GIFTPRO.Models;
using System.Data;
using System.Data.SqlClient;
using Utility;

namespace Vouchers_Integration.GIFTPRO
{
    public sealed class GiftPro
    {
        public string BaseURL { get; set; }

        public string AuthorizationType {  get; set; }

        public string AuthorizationKey { get; set; }  
        
        public int IntegrationSystemID { get; set; }

        public int IntegrationTypeID { get; set; }

        public int BranchID {  get; set; }

        public int EntityID { get; set; }

        public DataTable OrderStructure { get; private set; }

        public DataTable OrderDetailsStructure { get; private set; }

        public DataTable OrderRedeemHistoryStructure { get; private set; }

        public DataTable VoucherStructure { get; private set; }

        public DataTable VoucherDetailsStructure { get; private set; }

        public DataTable VoucherImageStructure { get; private set; }

        private static GiftPro instance = null;

       private SystemInformation _systemInformation = new SystemInformation();

        private GiftPro() {
            this.OrderStructure = this.GetOrderDataTableStructure();
            this.OrderDetailsStructure = this.GetOrderDetailsDataTableStructure();
            this.OrderRedeemHistoryStructure = this.GetOrderRedeemHistoryDataTableStructure();
            this.VoucherStructure = this.GetVoucherDataTableStructure();
            this.VoucherDetailsStructure = this.GetVoucherDetailsDataTableStructure();
            this.VoucherImageStructure = this.GetVoucherImageDataTableStructure();
            DataTable dtSystemInfo = _systemInformation.GET_INTEGRATION_DETAILS();
            this.BranchID = Convert.ToInt32(dtSystemInfo.Rows[0]["BRANCH_ID"]);
            this.EntityID = Convert.ToInt32(dtSystemInfo.Rows[0]["ENTITY_ID"]);
            this.IntegrationSystemID = Convert.ToInt32(dtSystemInfo.Rows[0]["INTEGRATION_SYSTEM_ID"]);
            this.IntegrationTypeID = Convert.ToInt32(dtSystemInfo.Rows[0]["INTEGRATION_TYPE_ID"]);
            this.BaseURL = Convert.ToString(dtSystemInfo.Rows[0]["URL_PATH"]);
            this.AuthorizationKey = Convert.ToString(dtSystemInfo.Rows[0]["API_KEY"]);
            this.AuthorizationType = "Basic";
        }

        public static GiftPro Instance
        {
            get {
                if (instance == null)
                {
                    instance = new GiftPro();
                }
                return instance;
            }
        }

        public bool RunGiftProIntegration()
        {
            bool runStatus = false;
            try
            {
                this.ProcessOrders();
                this.ProcessVouchers();
                runStatus = true;
            }
            catch(Exception ex)
            {
                runStatus = false;
                LogExceptions.LogError("GiftPro :- Fail To Saving Data in DB - ", ex);
            }
            return runStatus;
        }

        private DataTable GetOrderDataTableStructure()
        {
            DataTable ORDER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(int)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOMAIN_ID", typeof(int)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOMAIN_NAME", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMAIL_ADDRESS", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_NAME", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_METHOD", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE_CREATED", typeof(DateTime)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LAST_CHANGED", typeof(DateTime)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_AMOUNT", typeof(decimal)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COMMISSION", typeof(decimal)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY", typeof(int)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FULFILLMENT", typeof(int)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY_CODE", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_LINE1", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_LINE2", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_LOCALITY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_COUNTY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_POST_CODE", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BILLING_ADDRESS_COUNTRY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_NAME", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_LINE1", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_LINE2", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_LOCALITY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_COUNTY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_POST_CODE", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_ADDRESS_COUNTrY", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PERSONAL_TAX_IDENTIFIER", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RECIPIENT_EMAIL_ADDRESS", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REQUESTED_DELIVERY_DATE", typeof(DateTime)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SENT_TO_RECIPIENT_MAIL", typeof(bool)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REQUESTED_EMAIL_TO_RECIPIENT", typeof(bool)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MARKETING_OPTED_IN", typeof(bool)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MARKETING_DOUBLE_OPTED_IN", typeof(bool)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_FIRST_NAME", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_LAST_NAME", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS1", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS2", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS3", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS4", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS5", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_BILLING_ADDRESS6", typeof(string)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_SIGN_UP", typeof(bool)); ORDER_TYPE.Columns.Add(COLUMN_HEADER);
            return ORDER_TYPE;
        }

        private DataTable GetOrderDetailsDataTableStructure()
        {
            DataTable ORDER_DETAILS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ROW_ID", typeof(int)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(int)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SUB_TOTAL", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_AMOUNT", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("META_MESSAGE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLASS", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REDEEM_CODE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLIENT_CODE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_DATE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REDEEMED_DATE", typeof(DateTime)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EXPIRY_DATE", typeof(DateTime)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_EXPIRY_DATE", typeof(DateTime)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOMAIN_ID", typeof(int)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_METHOD", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY_CODE", typeof(string)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PARTIALLY_REDEEMABLE", typeof(bool)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REMAINING_VALUE", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BALANCES_START_GBP_AMOUNT", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BALANCES_START_GBP_EXCHANGE_RATE", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BALANCES_CURRENT_GBP", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SELECTED_OPTIONS_VALUE", typeof(decimal)); ORDER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            return ORDER_DETAILS_TYPE;
        }

        private DataTable GetOrderRedeemHistoryDataTableStructure()
        {
            DataTable ORDER_REDEEM_HISTORY_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("EVENT_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("USER_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE_OF_CREATION", typeof(DateTime)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROW_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LOCATION_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY_CODE", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STARTING_BALANCE", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BALANCE", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_amount", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_exchangeRate", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_baseCurrencyCode", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_redeemedCurrencyCode", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_currencySymbol", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("Currencies_GBP_balance", typeof(decimal)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROW_CODE", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROW_TYPE", typeof(string)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REF_ORDER_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REF_PRODUCT_ID", typeof(int)); ORDER_REDEEM_HISTORY_TYPE.Columns.Add(COLUMN_HEADER);
            return ORDER_REDEEM_HISTORY_TYPE;
        }

        private DataTable GetVoucherDataTableStructure()
        {
            DataTable VOUCHER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOMAIN_ID", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPARTMENT_ID", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBILITY", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PERMALINK", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DESCRIPTION", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE_FROM", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE_TO", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SUFFIX", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UPDATED", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATED", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY_CODE", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLASS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REDEEM_INSTRUCTIONS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ALLOW_PARTIAL_REDEMPTION", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TERMS_CONDITIONS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_PRINTED_TERMS_CONDITIONS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRINTED_TERMS_CONDITIONS", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_PRINTED_DESCRIPTION", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRINTED_DESCRIPTION", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_PERIOD", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_LENGTH", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_FIXED_DATE", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_VALID_FROM_PERIOD", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_PERIOD", typeof(string)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_LENGTH", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_FIXED_DATE", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_GRACE_PERIOD", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_PERIOD", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_LENGTH", typeof(int)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_FIXED_DATE", typeof(DateTime)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_FIXED_STOCK_AMOUNT", typeof(bool)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COMLIMENTARY", typeof(bool)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REMAINING_STOCK", typeof(decimal)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MINIMUM", typeof(decimal)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MAXIMUM", typeof(decimal)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FACE_VALUE", typeof(decimal)); VOUCHER_TYPE.Columns.Add(COLUMN_HEADER);
            return VOUCHER_TYPE;
        }

        private DataTable GetVoucherDetailsDataTableStructure()
        {
            DataTable VOUCHER_DETAILS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOMAIN_ID", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPARTMENT_ID", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBILITY", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PERMALINK", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DESCRIPTION", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE_FROM", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE_TO", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SUFFIX", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UPDATED", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATED", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY_CODE", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLASS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REDEEM_INSTRUCTIONS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ALLOW_PARTIAL_REDEMPTION", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TERMS_CONDITIONS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_PRINTED_TERMS_CONDITIONS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRINTED_TERMS_CONDITIONS", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_PRINTED_DESCRIPTION", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRINTED_DESCRIPTION", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_PERIOD", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_LENGTH", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALIDITY_FIXED_DATE", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_VALID_FROM_PERIOD", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_PERIOD", typeof(string)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_LENGTH", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALID_FROM_FIXED_DATE", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_GRACE_PERIOD", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_PERIOD", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_LENGTH", typeof(int)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRACE_FIXED_DATE", typeof(DateTime)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_FIXED_STOCK_AMOUNT", typeof(bool)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COMLIMENTARY", typeof(bool)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REMAINING_STOCK", typeof(decimal)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MINIMUM", typeof(decimal)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MAXIMUM", typeof(decimal)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FACE_VALUE", typeof(decimal)); VOUCHER_DETAILS_TYPE.Columns.Add(COLUMN_HEADER);
            return VOUCHER_DETAILS_TYPE;
        }

        private DataTable GetVoucherImageDataTableStructure()
        {
            DataTable VOUCHER_IMAGE_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("FILE_NAME", typeof(string)); VOUCHER_IMAGE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HEIGHT", typeof(decimal)); VOUCHER_IMAGE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("WIDTH", typeof(decimal)); VOUCHER_IMAGE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REF_PRODUCT_ID", typeof(int)); VOUCHER_IMAGE_TYPE.Columns.Add(COLUMN_HEADER);
            return VOUCHER_IMAGE_TYPE;
        }

        public void ProcessOrders()
        {

            IEndpointsService service = new EndpointsService();
            List<Order> orders = service.GetOrders();

            DataTable dtOrder = this.OrderStructure;
            DataTable dtOrderDetails = this.OrderDetailsStructure;
            DataTable dtOrderDetailsRedeemHistory = this.OrderRedeemHistoryStructure;
            foreach (var order in orders)
            {
                order.EntityID = this.EntityID;
                order.BranchID = this.BranchID;
                DataRow dtOrderRow = dtOrder.NewRow();
                dtOrderRow["ORDER_ID"] = order.OrderID;
                dtOrderRow["DOMAIN_ID"] = order.DomainID;
                dtOrderRow["DOMAIN_NAME"] = order.DomainName;
                dtOrderRow["STATUS"] = order.Status;
                dtOrderRow["EMAIL_ADDRESS"] = order.EmailAddress;
                dtOrderRow["CUSTOMER_NAME"] = order.CustomerName;
                dtOrderRow["PAYMENT_METHOD"] = order.PaymentMethod;
                dtOrderRow["DATE_CREATED"] = order.DateCreated;
                dtOrderRow["LAST_CHANGED"] = order.LastChanged;
                dtOrderRow["DISCOUNT_AMOUNT"] = Convert.ToDecimal(order.DiscountAmount);
                dtOrderRow["TOTAL"] = Convert.ToDecimal(order.Total);
                dtOrderRow["COMMISSION"] = Convert.ToDecimal(order.Commission);
                dtOrderRow["DELIVERY"] = order.Delivery;
                dtOrderRow["FULFILLMENT"] = order.FulFillment;
                dtOrderRow["CURRENCY_CODE"] = order.CurrencyCode;
                dtOrderRow["BILLING_ADDRESS_LINE1"] = order.BillingAddressLine1;
                dtOrderRow["BILLING_ADDRESS_LINE2"] = order.BillingAddressLine2;
                dtOrderRow["BILLING_ADDRESS_LOCALITY"] = order.BillingAddressLocality;
                dtOrderRow["BILLING_ADDRESS_COUNTY"] = order.BillingAddressCounty;
                dtOrderRow["BILLING_ADDRESS_POST_CODE"] = order.BillingAddressPostCode;
                dtOrderRow["BILLING_ADDRESS_COUNTRY"] = order.BillingAddressCountry;
                dtOrderRow["DELIVERY_NAME"] = order.DeliveryName;
                dtOrderRow["DELIVERY_ADDRESS_LINE1"] = order.DeliveryAddressLine1;
                dtOrderRow["DELIVERY_ADDRESS_LINE2"] = order.DeliveryAddressLine2;
                dtOrderRow["DELIVERY_ADDRESS_LOCALITY"] = order.DeliveryAddressLocality;
                dtOrderRow["DELIVERY_ADDRESS_COUNTY"] = order.DeliveryAddressCounty;
                dtOrderRow["DELIVERY_ADDRESS_POST_CODE"] = order.DeliveryAddressPostCode;
                dtOrderRow["DELIVERY_ADDRESS_COUNTRY"] = order.DeliveryAddressCountry;
                dtOrderRow["PERSONAL_TAX_IDENTIFIER"] = order.PersonalTaxIdentifier;
                dtOrderRow["RECIPIENT_EMAIL_ADDRESS"] = order.RecipientEmailAddress;
                dtOrderRow["REQUESTED_DELIVERY_DATE"] = order.RequestedDeliveryDate == null ? DateTime.Today : order.RequestedDeliveryDate;
                dtOrderRow["SENT_TO_RECIPIENT_MAIL"] = order.SentToRecipientEmail;
                dtOrderRow["REQUESTED_EMAIL_TO_RECIPIENT"] = order.RequestedEmailToRecipient;
                dtOrderRow["MARKETING_OPTED_IN"] = order.MarketingOpted == null ? false : order.MarketingOpted;
                dtOrderRow["MARKETING_DOUBLE_OPTED_IN"] = order.MarketingDoubleOptedIn == null ? false : order.MarketingDoubleOptedIn;
                dtOrderRow["CUSTOMER_FIRST_NAME"] = order.CustomerLastName;
                dtOrderRow["CUSTOMER_LAST_NAME"] = order.CustomerLastName;
                dtOrderRow["META_BILLING_ADDRESS1"] = order.MetaBillingAddress.BillingAddress1;
                dtOrderRow["META_BILLING_ADDRESS2"] = order.MetaBillingAddress.BillingAddress2;
                dtOrderRow["META_BILLING_ADDRESS3"] = order.MetaBillingAddress.BillingAddress3;
                dtOrderRow["META_BILLING_ADDRESS4"] = order.MetaBillingAddress.BillingAddress4;
                dtOrderRow["META_BILLING_ADDRESS5"] = order.MetaBillingAddress.BillingAddress5;
                dtOrderRow["META_BILLING_ADDRESS6"] = order.MetaBillingAddress.BillingAddress6;
                dtOrderRow["META_SIGN_UP"] = Convert.ToInt32(order.MetaBillingAddress.SignUp);
                dtOrder.Rows.Add(dtOrderRow);

                OrderDetails orderDetails = service.GetOrderDetails(order.OrderID);
                DataRow drOrderDetailsRow = dtOrderDetails.NewRow();
                drOrderDetailsRow["ROW_ID"] = orderDetails.RowID;
                drOrderDetailsRow["ORDER_ID"] = orderDetails.OrderID;
                drOrderDetailsRow["PRODUCT_ID"] = orderDetails.ProductID;
                drOrderDetailsRow["TYPE"] = orderDetails.Type;
                drOrderDetailsRow["NAME"] = orderDetails.Name;
                drOrderDetailsRow["SUB_TOTAL"] = orderDetails.SubTotal;
                drOrderDetailsRow["DISCOUNT_AMOUNT"] = orderDetails.DiscountAmount;
                drOrderDetailsRow["TOTAL"] = orderDetails.Total;
                drOrderDetailsRow["META_MESSAGE"] = orderDetails.Message.ToString().Contains("_message") == true ? JsonConvert.DeserializeObject<MetaMessage>(orderDetails.Message.ToString()).Message : "";
                drOrderDetailsRow["CLASS"] = orderDetails.Class;
                drOrderDetailsRow["REDEEM_CODE"] = orderDetails.RedeemCode;
                drOrderDetailsRow["CLIENT_CODE"] = orderDetails.ClientCode;
                drOrderDetailsRow["VALID_FROM_DATE"] = orderDetails.ValidFromDate;
                drOrderDetailsRow["REDEEMED_DATE"] = orderDetails.RedeemedDate == null ? DateTime.Today : orderDetails.RedeemedDate;
                drOrderDetailsRow["EXPIRY_DATE"] = orderDetails.ExpiryDate;
                drOrderDetailsRow["GRACE_EXPIRY_DATE"] = orderDetails.GraceExpiryDate == null ? DateTime.Today : orderDetails.GraceExpiryDate; ;
                drOrderDetailsRow["STATUS"] = orderDetails.Status;
                drOrderDetailsRow["DOMAIN_ID"] = orderDetails.DomainID;
                drOrderDetailsRow["PAYMENT_METHOD"] = orderDetails.PaymentMethod;
                drOrderDetailsRow["CURRENCY_CODE"] = orderDetails.CurrencyCode;
                drOrderDetailsRow["PARTIALLY_REDEEMABLE"] = orderDetails.PartiallyRedeemable;
                drOrderDetailsRow["REMAINING_VALUE"] = orderDetails.RemainingValue;
                drOrderDetailsRow["BALANCES_START_GBP_AMOUNT"] = orderDetails.Balance.Starting.GBP.Amount;
                drOrderDetailsRow["BALANCES_START_GBP_EXCHANGE_RATE"] = orderDetails.Balance.Starting.GBP.ExchangeRate;
                drOrderDetailsRow["BALANCES_CURRENT_GBP"] = orderDetails.Balance.Current.GBP;
                drOrderDetailsRow["SELECTED_OPTIONS_VALUE"] = orderDetails.Options.Value.Value;
                dtOrderDetails.Rows.Add(drOrderDetailsRow);


                foreach (var orderDetail in orderDetails.OrderRedeemHistory)
                {
                    DataRow drOrderDetailsRedeemHistoryRow = dtOrderDetailsRedeemHistory.NewRow();
                    drOrderDetailsRedeemHistoryRow["EVENT_ID"] = orderDetail.EventID;
                    drOrderDetailsRedeemHistoryRow["USER_ID"] = orderDetail.UserID;
                    drOrderDetailsRedeemHistoryRow["DATE_OF_CREATION"] = orderDetail.DateOfCreation;
                    drOrderDetailsRedeemHistoryRow["ROW_ID"] = orderDetail.RowID;
                    drOrderDetailsRedeemHistoryRow["LOCATION_ID"] = orderDetail.LocationID;
                    drOrderDetailsRedeemHistoryRow["TYPE"] = orderDetail.Type;
                    drOrderDetailsRedeemHistoryRow["AMOUNT"] = orderDetail.Amount;
                    drOrderDetailsRedeemHistoryRow["CURRENCY_CODE"] = orderDetail.CurrencyCode;
                    drOrderDetailsRedeemHistoryRow["STARTING_BALANCE"] = orderDetail.StartingBalance;
                    drOrderDetailsRedeemHistoryRow["NAME"] = orderDetail.Name;
                    drOrderDetailsRedeemHistoryRow["BALANCE"] = orderDetail.Balance;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_amount"] = orderDetail.RedeemCurrencies.CurrencyGBP.Amount;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_exchangeRate"] = orderDetail.RedeemCurrencies.CurrencyGBP.ExchangeRate;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_baseCurrencyCode"] = orderDetail.RedeemCurrencies.CurrencyGBP.BaseCurrencyCode;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_redeemedCurrencyCode"] = orderDetail.RedeemCurrencies.CurrencyGBP.RedeemedCurrencyCode;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_currencySymbol"] = orderDetail.RedeemCurrencies.CurrencyGBP.CurrencySymbol;
                    drOrderDetailsRedeemHistoryRow["Currencies_GBP_balance"] = orderDetail.RedeemCurrencies.CurrencyGBP.Balance;
                    drOrderDetailsRedeemHistoryRow["ROW_CODE"] = orderDetail.RedeemRow.Code;
                    drOrderDetailsRedeemHistoryRow["ROW_TYPE"] = orderDetail.RedeemRow.Type;
                    drOrderDetailsRedeemHistoryRow["REF_ORDER_ID"] = orderDetails.OrderID;
                    drOrderDetailsRedeemHistoryRow["REF_PRODUCT_ID"] = orderDetails.ProductID;
                    dtOrderDetailsRedeemHistory.Rows.Add(drOrderDetailsRedeemHistoryRow);
                }
            }

            try
            {

                DBHelper Obj = new DBHelper();

                List<SqlParameter> orderParameters = new List<SqlParameter>();
                orderParameters.Add(new SqlParameter("@PI_ENTITY_ID", this.EntityID));
                orderParameters.Add(new SqlParameter("@PI_BRANCH_ID", this.BranchID));
                SqlParameter orderTypeParam = new SqlParameter();
                orderTypeParam.SqlDbType = SqlDbType.Structured;
                orderTypeParam.ParameterName = "PI_VOUCHER_ORDERS";
                orderTypeParam.Value = dtOrder;
                orderParameters.Add(orderTypeParam);
                Obj.ExecuteDataset_SP(orderParameters, "PRC_INS_UPD_GIFT_PRO_VOUCHER_ORDERS");


                List<SqlParameter> orderDetailsParameters = new List<SqlParameter>();
                orderDetailsParameters.Add(new SqlParameter("@PI_ENTITY_ID", this.EntityID));
                orderDetailsParameters.Add(new SqlParameter("@PI_BRANCH_ID", this.BranchID));

                SqlParameter orderDetailsTypeParam = new SqlParameter();
                orderDetailsTypeParam.SqlDbType = SqlDbType.Structured;
                orderDetailsTypeParam.ParameterName = "PI_VOUCHERS_ORDER_DETAILS";
                orderDetailsTypeParam.Value = dtOrderDetails;
                orderDetailsParameters.Add(orderDetailsTypeParam);

                SqlParameter orderDetailsRedeemHistoryTypeParam = new SqlParameter();
                orderDetailsRedeemHistoryTypeParam.SqlDbType = SqlDbType.Structured;
                orderDetailsRedeemHistoryTypeParam.ParameterName = "PI_VOUCHERS_ORDER_DETAILS_REDEEM_HISTORY";
                orderDetailsRedeemHistoryTypeParam.Value = dtOrderDetailsRedeemHistory;
                orderDetailsParameters.Add(orderDetailsRedeemHistoryTypeParam);

                Obj.ExecuteDataset_SP(orderDetailsParameters, "PRC_INS_UPD_GIFT_PRO_VOUCHERS_ORDER_DETAILS");
            }
            catch (SqlException ex)
            {
                LogExceptions.LogError("GiftPro :- Fail To Saving Data in DB - ", ex);
            }
        }

        public void ProcessVouchers()
        {
            IEndpointsService service = new EndpointsService();
            List<Voucher> vouchers = service.GetVouchers();

            DataTable dtVoucherDetails = this.VoucherDetailsStructure;
            DataTable dtVoucherDetailsImages = this.VoucherImageStructure;
            foreach (var voucher in vouchers)
            {
                VoucherDetails voucherDetails = service.GetVoucherDetails(voucher.ProductID);
                voucherDetails.HasFixedStockAmount = voucher.HasFixedStockAmount;
                voucherDetails.IsComplimentary = voucher.IsComplimentary;
                voucherDetails.VoucherImages = voucher.VoucherImages;

                DataRow drVoucherDetailsRow = dtVoucherDetails.NewRow();
                drVoucherDetailsRow["PRODUCT_ID"] = voucherDetails.ProductID;
                drVoucherDetailsRow["DOMAIN_ID"] = voucherDetails.DomainID;
                drVoucherDetailsRow["DEPARTMENT_ID"] = voucherDetails.DepartmentID == null ? 0 : voucherDetails.DepartmentID;
                drVoucherDetailsRow["PRICE"] = voucherDetails.Price;
                drVoucherDetailsRow["STATUS"] = voucherDetails.Status;
                drVoucherDetailsRow["VISIBILITY"] = voucherDetails.Visibility;
                drVoucherDetailsRow["NAME"] = voucherDetails.Name;
                drVoucherDetailsRow["PERMALINK"] = voucherDetails.PermaLink;
                drVoucherDetailsRow["DESCRIPTION"] = voucherDetails.Description;
                drVoucherDetailsRow["VISIBLE_FROM"] = voucherDetails.VisibleFrom == null ? DateTime.Today : voucherDetails.VisibleFrom;
                drVoucherDetailsRow["VISIBLE_TO"] = voucherDetails.VisibleTo == null ? DateTime.Today : voucherDetails.VisibleTo;
                drVoucherDetailsRow["SUFFIX"] = voucherDetails.Suffix;
                drVoucherDetailsRow["UPDATED"] = voucherDetails.Updated;
                drVoucherDetailsRow["CREATED"] = voucherDetails.Created;
                drVoucherDetailsRow["CURRENCY_CODE"] = voucherDetails.CurrencyCode;
                drVoucherDetailsRow["CLASS"] = voucherDetails.Class;
                drVoucherDetailsRow["REDEEM_INSTRUCTIONS"] = voucherDetails.RedeemInstructions;
                drVoucherDetailsRow["ALLOW_PARTIAL_REDEMPTION"] = voucherDetails.AllowPartialRedemption;
                drVoucherDetailsRow["TERMS_CONDITIONS"] = voucherDetails.TermsConditions;
                drVoucherDetailsRow["HAS_PRINTED_TERMS_CONDITIONS"] = voucherDetails.HasPrintedTermsConditions;
                drVoucherDetailsRow["PRINTED_TERMS_CONDITIONS"] = voucherDetails.PrintedTermsConditions;
                drVoucherDetailsRow["HAS_PRINTED_DESCRIPTION"] = voucherDetails.HasPrintedDescription;
                drVoucherDetailsRow["PRINTED_DESCRIPTION"] = voucherDetails.PrintedDescription;
                drVoucherDetailsRow["VALIDITY_PERIOD"] = voucherDetails.ValidityPeriod;
                drVoucherDetailsRow["VALIDITY_LENGTH"] = voucherDetails.ValidityLength;
                drVoucherDetailsRow["VALIDITY_FIXED_DATE"] = voucherDetails.ValidityFixedDate == null ? DateTime.Today : voucherDetails.ValidityFixedDate;
                drVoucherDetailsRow["HAS_VALID_FROM_PERIOD"] = voucherDetails.HasValidFromPeriod;
                drVoucherDetailsRow["VALID_FROM_PERIOD"] = voucherDetails.ValidFromPeriod;
                drVoucherDetailsRow["VALID_FROM_LENGTH"] = voucherDetails.ValidFromLength;
                drVoucherDetailsRow["VALID_FROM_FIXED_DATE"] = voucherDetails.ValidFromFixedDate == null ? DateTime.Today : voucherDetails.ValidFromFixedDate;
                drVoucherDetailsRow["HAS_GRACE_PERIOD"] = voucherDetails.HasGracePeriod;
                drVoucherDetailsRow["GRACE_PERIOD"] = voucherDetails.GracePeriod == null ? 0 : voucherDetails.GracePeriod;
                drVoucherDetailsRow["GRACE_LENGTH"] = voucherDetails.GraceLength;
                drVoucherDetailsRow["GRACE_FIXED_DATE"] = voucherDetails.GraceFixedDate == null ? DateTime.Today : voucherDetails.GraceFixedDate;
                drVoucherDetailsRow["HAS_FIXED_STOCK_AMOUNT"] = Convert.ToInt32(voucherDetails.HasFixedStockAmount);
                drVoucherDetailsRow["IS_COMLIMENTARY"] = Convert.ToInt32(voucherDetails.IsComplimentary);
                drVoucherDetailsRow["REMAINING_STOCK"] = voucherDetails.RemainingStock == null ? 0 : voucherDetails.RemainingStock;
                drVoucherDetailsRow["MINIMUM"] = voucherDetails.Minimum == null ? 0 : voucherDetails.Minimum;
                drVoucherDetailsRow["MAXIMUM"] = voucherDetails.Maximum == null ? 0 : voucherDetails.Maximum;
                drVoucherDetailsRow["FACE_VALUE"] = voucherDetails.FaceValue == null ? 0 : voucherDetails.FaceValue;
                dtVoucherDetails.Rows.Add(drVoucherDetailsRow);


                foreach (var productImage in voucherDetails.VoucherImages.ProductImages)
                {
                    DataRow drVoucherDetailsImagesRow = dtVoucherDetailsImages.NewRow();
                    drVoucherDetailsImagesRow["FILE_NAME"] = productImage.FileName;
                    drVoucherDetailsImagesRow["HEIGHT"] = productImage.Height;
                    drVoucherDetailsImagesRow["WIDTH"] = productImage.Width;
                    drVoucherDetailsImagesRow["REF_PRODUCT_ID"] = voucherDetails.ProductID;
                    dtVoucherDetailsImages.Rows.Add(drVoucherDetailsImagesRow);
                }
            }


            try
            {
                DBHelper Obj = new DBHelper();

                List<SqlParameter> voucherDetailsParameters = new List<SqlParameter>();
                voucherDetailsParameters.Add(new SqlParameter("@PI_ENTITY_ID", this.EntityID));
                voucherDetailsParameters.Add(new SqlParameter("@PI_BRANCH_ID", this.BranchID));

                SqlParameter voucherDetailsTypeParam = new SqlParameter();
                voucherDetailsTypeParam.SqlDbType = SqlDbType.Structured;
                voucherDetailsTypeParam.ParameterName = "PI_VOUCHERS_LIST_DETAILS";
                voucherDetailsTypeParam.Value = dtVoucherDetails;
                voucherDetailsParameters.Add(voucherDetailsTypeParam);

                SqlParameter voucherImagesTypeParam = new SqlParameter();
                voucherImagesTypeParam.SqlDbType = SqlDbType.Structured;
                voucherImagesTypeParam.ParameterName = "PI_VOUCHERS_LIST_DETAILS_IMAGES";
                voucherImagesTypeParam.Value = dtVoucherDetailsImages;
                voucherDetailsParameters.Add(voucherImagesTypeParam);

                Obj.ExecuteDataset_SP(voucherDetailsParameters, "PRC_INS_UPD_GIFT_PRO_VOUCHERS_LIST_DETAILS");
            }
            catch (SqlException ex)
            {
                LogExceptions.LogError("GiftPro :- Fail To Saving Data in DB - ", ex);
            }
        }

        public IRestResponse GetEndpointResponse(string endpoint)
        {
            IRestResponse JsonResult = null;
            var client = new RestClient(this.BaseURL + endpoint);
            client.Timeout = -1;
            var request = new RestRequest();
            request.AddHeader("Authorization", this.AuthorizationType + " " + this.AuthorizationKey);
            try
            {
                JsonResult = client.ExecuteAsGet(request, "GET");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("GiftPro :- Fail To Call endpoint - ", ex);
            }
            return JsonResult;
        }
    }
}