using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.VitaMojo
{
    public class Source
    {
        public string initialAccountId { get; set; }
        public string previousAccountId { get; set; }
    }
    public class Intervals {
        public DateTimeOffset StartTime { get; set; }
        public DateTimeOffset EndTime { get; set; }
    }
    public class AccountingGroup
    {
        public decimal accountingGroupId { get; set; }
        public string name { get; set; }
        public string code { get; set; }
    }

    public class Category
    {
        public string category { get; set; }
        public string value { get; set; }
    }

    public class SalesLine
    {
        public string id { get; set; }
        public string totalNetAmountWithTax { get; set; }
        public string totalNetAmountWithoutTax { get; set; }
        public string menuListPrice { get; set; }
        public string unitCostPrice { get; set; }
        public string serviceCharge { get; set; }
        public string discountAmount { get; set; }
        public string taxAmount { get; set; }
        public string accountDiscountAmount { get; set; }
        public string totalDiscountAmount { get; set; }
        public string sku { get; set; }
        public string name { get; set; }
        public string statisticGroup { get; set; }
        public string quantity { get; set; }
        public string taxRatePercentage { get; set; }
        public AccountingGroup accountingGroup { get; set; }
        public string currency { get; set; }
        public List<string> tags { get; set; }
        public string revenueCenter { get; set; }
        public long revenueCenterId { get; set; }
        public List<Category> categories { get; set; }
        public DateTime timeOfSale { get; set; }
        public int staffId { get; set; }
        public string staffName { get; set; }
        public int deviceId { get; set; }
        public string deviceName { get; set; }
        public string accountProfileCode { get; set; }
    }

    public class Payment
    {
        public string code { get; set; }
        public string description { get; set; }
        public long paymentMethodId { get; set; }
        public string netAmountWithTax { get; set; }
        public string currency { get; set; }
        public string tip { get; set; }
        public string type { get; set; }
        public int deviceId { get; set; }
        public string deviceName { get; set; }
        public int staffId { get; set; }
        public string staffName { get; set; }
        public string revenueCenter { get; set; }
        public long revenueCenterId { get; set; }
    }

    public class Sale
    {
        public string accountReference { get; set; }
        public string accountFiscId { get; set; }
        public string receiptId { get; set; }
        public Source source { get; set; }
        public List<SalesLine> salesLines { get; set; }
        public List<Payment> payments { get; set; }
        public DateTime timeOfOpening { get; set; }
        public DateTime timeOfCloseAndPaid { get; set; }
        public string tableName { get; set; }
        public string accountProfileCode { get; set; }
        public string ownerName { get; set; }
        public int ownerId { get; set; }
        public string type { get; set; }
        public double nbCovers { get; set; }
        public bool dineIn { get; set; }
        public int deviceId { get; set; }
        public string deviceName { get; set; }
    }

    public class Self
    {
        public string href { get; set; }
    }

    public class Links
    {
        public Self self { get; set; }
    }

    public class Root
    {
        public string businessName { get; set; }
        public DateTime nextStartOfDayAsIso8601 { get; set; }
        public long businessLocationId { get; set; }
        public List<Sale> sales { get; set; }
        public bool dataComplete { get; set; }
        public Links _links { get; set; }

    }



    public class EPOS_DATA
    {
        public decimal accountingGroupId { get; set; }
        public string AccountingGroup { get; set; }
        public string AG_CODE { get; set; }
        public string SalesLineID { get; set; }
        public string SKU { get; set; }
        public string NAME { get; set; }
        public decimal Quantity { get; set; }
        public decimal Total_with_tax_Less_discounts { get; set; }
        public decimal Discounts { get; set; }
        public decimal Total_taxes { get; set; }
        public decimal Total_without_tax { get; set; }
        public decimal percent { get; set; }
        public decimal ServiceCharge { get; set; }
        public decimal Total { get; set; }
        public string Account_FISC_ID { get; set; }
        public decimal nbCovers { get; set; }
        public string Type { get; set; }
        public DateTime Time { get; set; }
    }
    public class EPOS_PAYMENTS
    {
        public string Payment_method { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public decimal Total { get; set; }
    }
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class VitaMojo_EPOS
    {
        string MainVitaMojoURL = string.Empty;
        string AccessToken = string.Empty;
        int Errorflag = 0;
        string ErrorMessage = string.Empty;

        DataTable Create_DataTable_Header()
        {
            DataTable DATATABLE_VITAMOJO_HEADER = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("COUNT", typeof(int)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_AMOUNT", typeof(decimal)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT", typeof(decimal)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REFUND_AMOUNT", typeof(decimal)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_NUMBER", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKEAWAY", typeof(int)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_DELIVERY", typeof(int)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);

            COLUMN_HEADER = new DataColumn("HEADER_UUID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER); ;
            COLUMN_HEADER = new DataColumn("CUSTOMER_ID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_CARD_ID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_STATUS", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);

            COLUMN_HEADER = new DataColumn("ORDER_PROMOTION_NAME", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_STATUS", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_MODE", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TENANT", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STORE", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STORE_UUID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MENU_NAME", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("USER_IN_STORE_NAME", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATE_SOURCE", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_SOURCE", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_UUID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_NUMBER", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHANNEL", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TILL_ID", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPERATOR_EMAIL", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUM_TOTAL_ORDERS_SOFAR", typeof(decimal)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);

            //COLUMN_HEADER = new DataColumn("CREATED_AT", typeof(DateTime)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            //COLUMN_HEADER = new DataColumn("SLOT", typeof(string)); DATATABLE_VITAMOJO_HEADER.Columns.Add(COLUMN_HEADER);
            return DATATABLE_VITAMOJO_HEADER;
        }
        DataTable Create_DataTable_Line()
        {
            DataTable DATATABLE_VITAMOJO_LINE = new DataTable();

            DataColumn COLUMN_LINE = new DataColumn("BUNDLE_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CATALOG_BUNDLE_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CATALOG_ITEM_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CATEGORY", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TYPE", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("BUNDLE", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_NAME", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_GROUP_NAME", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("MEAL_DEAL_NAME", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("MEAL_DEAL_BASKET_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_QUANTITY_PORTIONS", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_QUANTITY", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_SIZE", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CATALOG_PROMOTION_NAME", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("VAT_RATE", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CATALOG_VAT_RATE", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CREATED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("UPDATED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("UPDATED_AT_UTC", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("PICKUP_TIME_DT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SLOT15MIN", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SLOT60MIN", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("FIRST_ORDER_DATE", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CONFIRMED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("IN_PRODUCTION_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("READY_TO_COLLECT_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("COLLECTED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CANCELLED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("REFUNDED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("INTEGRATION_ERROR_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("INTEGRATION_ERROR_CORRECTED_AT", typeof(DateTime)); COLUMN_LINE.AllowDBNull = true; DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("EXTERNAL_CATEGORY", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("VM_OS_VERSION", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TAX_EXEMPT", typeof(int)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("BUNDLE_TAX_EXEMPT", typeof(int)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SALES_TAX_RATE", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("BRAND", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_TOTAL_PRICE", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_TOTAL_AMOUNT", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_DISCOUNT", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ITEM_REFUND", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("VA_TABLE_SALES", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("NON_VATABLE_SALES", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("MENU_ITEMS_SOLD", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("VAT", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("NET_SALES", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("HEADER_UUID", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SLOT", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("IS_RECOMMENDATION", typeof(int)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("IS_UPSELL", typeof(int)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("IS_EOTHO", typeof(int)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("PROMOTION_NAME", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            //COLUMN_LINE = new DataColumn("COUNT", typeof(decimal)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);              
            //COLUMN_LINE = new DataColumn("ORDER_NUMBER", typeof(string)); DATATABLE_VITAMOJO_LINE.Columns.Add(COLUMN_LINE);
            return DATATABLE_VITAMOJO_LINE;
        }
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            try
            {
                foreach (DataRow dr in dt.Rows)
                {
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;
                    //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                    DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                    foreach (DataRow dr_session in dt_Session.Select("SESSION_MASTER_ID=4").CopyToDataTable().Rows)
                    {
                        Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                        string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                        string[] timelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                        int start_hr = Convert.ToInt32(timelist[0]);
                        timelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                        int end_hr = Convert.ToInt32(timelist[0]);
                        int variance = start_hr - end_hr;
                        DateTime Cashup_date_new = DateTime.Now;
                        if (variance == 0 || variance > 0)
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                        }
                        else
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date);
                        }
                        string Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) + "+00:00";
                        string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]) + "+00:00";
                        int INTEGRATION_STATUS = 0;
                        DataView dv = dt_IntegrationDetails.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                        DataTable dtIntegrationData = dv.ToTable();
                        DataSet FinancialData = null;
                        try
                        {
                            FinancialData = FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj);
                            if (FinancialData != null)
                            {
                                if (FinancialData.Tables.Count > 0)
                                {
                                    DataSet ds = Obj.GET_CASHUP_BY_ID();
                                    INTEGRATION_STATUS = SubmitdataFromVitaMojo(FinancialData, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Obj.CashupModelObj.BRANCH_ID);
                                    if (INTEGRATION_STATUS == 2)
                                    {
                                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                                        transformData.DataTransform(IntegrationSource.VITAMOJO, dtIntegrationData, FinancialData, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                        INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    }
                                }
                                else
                                {
                                    INTEGRATION_STATUS = 4;
                                }

                                Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();

                            }
                            else
                            {
                                Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB - VITAMOJO - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }

        DataSet FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup cashup)
        { 
            string Exception_Message = string.Empty;
            int Exception_Counter = 0;
            int Inner_Loop_Counter = 0;
        Refetch:
            try
            {
                #region --- split time in slots, commented code-----
                //string inputDateStr = Start_date;
                //IList<Intervals> breakIntervals = new List<Intervals>();
                //DateTime StartDT = DateTimeOffset.Parse(Start_date).UtcDateTime;
                //DateTime EndDT = DateTimeOffset.Parse(End_date).UtcDateTime;
                //DateTime inputDate;
                //breakIntervals.Add(DateTimeOffset.Parse(Start_date).UtcDateTime.AddMinutes(0).AddSeconds(0));
                //while (StartDT < EndDT)
                //{
                //    Intervals Obj = new Intervals();
                //    //if (DateTime.TryParseExact(StartDT.ToUniversalTime().ToString(), "M/dd/yyyy hh:mm:ss tt", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out inputDate))
                //    //{
                //    //    breakIntervals.Add(inputDate.AddHours(2));
                //    //    StartDT = inputDate.AddHours(2);
                //    //}

                //    Obj.StartTime = StartDT;
                //    StartDT = StartDT.AddHours(2);
                //    Obj.EndTime = StartDT;
                //    breakIntervals.Add(Obj);
                //    //StartDT = StartDT.AddHours(2);

                //    // breakIntervals.Add(StartDT.AddHours(2).AddMinutes(59).AddSeconds(59));
                //    //StartDT = StartDT.AddHours(2);//DateTimeOffset.Parse(Start_date).UtcDateTime.AddHours(2);
                //}
                #endregion

                //GeT Data from VITAMOJO
                DataSet DS_VITA_MOJO = new DataSet();
                DataTable DATATABLE_VITAMOJO_HEADER = Create_DataTable_Header();
                DataTable DATATABLE_VITAMOJO_LINE = Create_DataTable_Line();
                string STOREUUID = string.Empty;
                //string MainVitaMojoURL = "https://data.vmos-serverless.com/cubejs-api/v1/load";

                MainVitaMojoURL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                STOREUUID = Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]);
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

                string[] SplitStartTime = Start_date.Split('T');
                string[] TimeArray = new string[12];
                TimeArray[0] = Start_date;
                TimeArray[1] = SplitStartTime[0] + "T10:00:00+00:00";
                TimeArray[2] = SplitStartTime[0] + "T10:00:00+00:00";
                TimeArray[3] = SplitStartTime[0] + "T15:00:00+00:00";
                TimeArray[4] = SplitStartTime[0] + "T15:00:00+00:00";
                TimeArray[5] = SplitStartTime[0] + "T19:00:00+00:00";
                TimeArray[6] = SplitStartTime[0] + "T19:00:00+00:00";
                TimeArray[7] = SplitStartTime[0] + "T21:00:00+00:00";
                TimeArray[8] = SplitStartTime[0] + "T21:00:00+00:00";
                TimeArray[9] = SplitStartTime[0] + "T22:00:00+00:00";
                TimeArray[10] = SplitStartTime[0] + "T22:00:00+00:00";
                TimeArray[11] = End_date;
                for (int i = 0; i < 6; i++)
                {
                    Inner_Loop_Counter = i;
                    var Common_Query = @"{""query"":{""measures"":[ ""OrderItems.count"", ""OrderItems.totalAmount"",""OrderItems.price"",""OrderItems.discount"",""OrderItems.refundAmount"",""OrderItems.quantity"",""OrderItems.itemTotalPrice"",
                                    ""OrderItems.itemTotalAmount"",""OrderItems.itemDiscount"",""OrderItems.itemRefund"",""OrderItems.vatableSales"",""OrderItems.nonVatableSales"",""OrderItems.menuItemsSold"",
                                    ""OrderItems.vat"",""OrderItems.netSales""],""dimensions"":[""OrderItems.takeaway"",""OrderItems.isDelivery"",""OrderItems.isRecommendation"",""OrderItems.isUpsell"",""OrderItems.isEotho"",
                                    ""OrderItems.uuid"",""OrderItems.customerId"",""OrderItems.customerCardId"",""OrderItems.orderStatus"",""OrderItems.paymentStatus"",""OrderItems.currency"",""OrderItems.paymentMode"",
                                    ""OrderItems.tenant"",""OrderItems.store"",""OrderItems.storeUuid"",""OrderItems.menuName"",""OrderItems.orderType"",""OrderItems.userInstoreName"",""OrderItems.createSource"",
                                    ""OrderItems.slot"",""OrderItems.deliverySource"",""OrderItems.orderUuid"",""OrderItems.bundleUuid"",""OrderItems.itemUuid"",""OrderItems.catalogBundleUuid"",""OrderItems.catalogItemUuid"",
                                    ""OrderItems.category"",""OrderItems.type"",""OrderItems.bundle"",""OrderItems.itemName"",""OrderItems.itemGroupName"",""OrderItems.mealDealName"",""OrderItems.mealDealBasketUuid"",
                                    ""OrderItems.itemQuantityPortions"",""OrderItems.itemQuantity"",""OrderItems.promotionName"",""OrderItems.itemSize"",""OrderItems.orderPromotionName"",""OrderItems.catalogPromotionName"",
                                    ""OrderItems.tableNumber"",""OrderItems.channel"",""OrderItems.tillId"",""OrderItems.operatorEmail"",""OrderItems.vatRate"",""OrderItems.catalogVatRate"",""OrderItems.createdAt"",
                                    ""OrderItems.updatedAt"",""OrderItems.updatedAtUtc"",""OrderItems.pickupTimeDt"",""OrderItems.slot15min"",""OrderItems.slot60min"",""OrderItems.firstOrderDate"",""OrderItems.confirmedAt"",
                                    ""OrderItems.inProductionAt"",""OrderItems.readyToCollectAt"",""OrderItems.collectedAt"",""OrderItems.cancelledAt"",""OrderItems.refundedAt"",""OrderItems.integrationErrorAt"",
                                    ""OrderItems.integrationErrorCorrectedAt"",""OrderItems.externalCategory"",""OrderItems.numTotalOrdersSoFar"",""OrderItems.vmosVersion"",""OrderItems.taxExempt"",""OrderItems.bundleTaxExempt"",
                                    ""OrderItems.salesTaxRate"",""OrderItems.orderNumber"",""OrderItems.brand""],
                                    ""filters"":[{""member"": ""OrderItems.storeUuid"",""operator"": ""equals"",""values"":[""URL_PARAMETERS""]}],
                                    ""timeDimensions"":[{""dimension"":""OrderItems.createdAt"",""granularity"":""day"",
                                     ""dateRange"":[" + '"' + TimeArray[i + i] + '"' + "," + '"' + TimeArray[i + i + 1] + '"' + "]}]}}";

                    Common_Query = Common_Query.Replace("URL_PARAMETERS", STOREUUID);
                    var client = new WebClient();
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("authorization", AccessToken);
 
                    Root_VitaMojo VITA_MOJO_ROOT_HEADER_DATA = null;
                    do
                    {
                        client.Headers.Add("Content-Type", "application/json");
                        var response_Header = client.UploadString(MainVitaMojoURL, "post", Common_Query);
                        VITA_MOJO_ROOT_HEADER_DATA = JsonConvert.DeserializeObject<Root_VitaMojo>(response_Header);
                        if (VITA_MOJO_ROOT_HEADER_DATA.error == null)
                        { System.Threading.Thread.Sleep(5000); break; }
                    }

                    while (VITA_MOJO_ROOT_HEADER_DATA.error == "Continue wait");
                    var UNIQUE_ITEM_UUID = VITA_MOJO_ROOT_HEADER_DATA.data.GroupBy(p => p.OrderItemsUuid).Select(grp => grp.First()).ToArray();
                    foreach (var ObjHeader in UNIQUE_ITEM_UUID)
                    {
                        DataRow DR_VITAMOJO_HEADER = DATATABLE_VITAMOJO_HEADER.NewRow();
                        var COUNT = VITA_MOJO_ROOT_HEADER_DATA.data.Where(x => x.OrderItemsUuid == ObjHeader.OrderItemsUuid.ToString()).Count();
                        DR_VITAMOJO_HEADER["COUNT"] = Convert.ToInt32(COUNT); //Convert.ToInt32(ObjHeader.OrderItemsCount);
                        DR_VITAMOJO_HEADER["TOTAL_AMOUNT"] = Convert.ToDecimal(ObjHeader.OrderItemsTotalAmount);
                        DR_VITAMOJO_HEADER["PRICE"] = Convert.ToDecimal(ObjHeader.OrderItemsPrice);
                        DR_VITAMOJO_HEADER["DISCOUNT"] = Convert.ToDecimal(ObjHeader.OrderItemsDiscount);
                        DR_VITAMOJO_HEADER["REFUND_AMOUNT"] = Convert.ToDecimal(ObjHeader.OrderItemsRefundAmount);
                        DR_VITAMOJO_HEADER["ORDER_NUMBER"] = Convert.ToString(ObjHeader.OrderItemsOrderNumber);
                        DR_VITAMOJO_HEADER["TAKEAWAY"] = Convert.ToInt32(ObjHeader.OrderItemsTakeaway);
                        DR_VITAMOJO_HEADER["IS_DELIVERY"] = Convert.ToInt32(ObjHeader.OrderItemsIsDelivery);

                        DR_VITAMOJO_HEADER["HEADER_UUID"] = Convert.ToString(ObjHeader.OrderItemsUuid);
                        DR_VITAMOJO_HEADER["CUSTOMER_ID"] = Convert.ToString(ObjHeader.OrderItemsCustomerId);
                        DR_VITAMOJO_HEADER["CUSTOMER_CARD_ID"] = Convert.ToString(ObjHeader.OrderItemsCustomerCardId);
                        DR_VITAMOJO_HEADER["ORDER_STATUS"] = Convert.ToString(ObjHeader.OrderItemsOrderStatus);

                        DR_VITAMOJO_HEADER["ORDER_PROMOTION_NAME"] = Convert.ToString(ObjHeader.OrderItemsOrderPromotionName);
                        DR_VITAMOJO_HEADER["PAYMENT_STATUS"] = Convert.ToString(ObjHeader.OrderItemsPaymentStatus);
                        DR_VITAMOJO_HEADER["CURRENCY"] = Convert.ToString(ObjHeader.OrderItemsCurrency);
                        DR_VITAMOJO_HEADER["PAYMENT_MODE"] = Convert.ToString(ObjHeader.OrderItemsPaymentMode);
                        DR_VITAMOJO_HEADER["TENANT"] = Convert.ToString(ObjHeader.OrderItemsTenant);
                        DR_VITAMOJO_HEADER["STORE"] = Convert.ToString(ObjHeader.OrderItemsStore);
                        DR_VITAMOJO_HEADER["STORE_UUID"] = Convert.ToString(ObjHeader.OrderItemsStoreUuid);
                        DR_VITAMOJO_HEADER["MENU_NAME"] = Convert.ToString(ObjHeader.OrderItemsMenuName);
                        DR_VITAMOJO_HEADER["ORDER_TYPE"] = Convert.ToString(ObjHeader.OrderItemsOrderType);
                        DR_VITAMOJO_HEADER["USER_IN_STORE_NAME"] = Convert.ToString(ObjHeader.OrderItemsUserInstoreName);
                        DR_VITAMOJO_HEADER["CREATE_SOURCE"] = Convert.ToString(ObjHeader.OrderItemsCreateSource);
                        DR_VITAMOJO_HEADER["DELIVERY_SOURCE"] = Convert.ToString(ObjHeader.OrderItemsDeliverySource);
                        DR_VITAMOJO_HEADER["ORDER_UUID"] = Convert.ToString(ObjHeader.OrderItemsOrderUuid);
                        DR_VITAMOJO_HEADER["TABLE_NUMBER"] = Convert.ToString(ObjHeader.OrderItemsTableNumber);
                        DR_VITAMOJO_HEADER["CHANNEL"] = Convert.ToString(ObjHeader.OrderItemsChannel);
                        DR_VITAMOJO_HEADER["TILL_ID"] = Convert.ToString(ObjHeader.OrderItemsTillId);
                        DR_VITAMOJO_HEADER["OPERATOR_EMAIL"] = Convert.ToString(ObjHeader.OrderItemsOperatorEmail);
                        DR_VITAMOJO_HEADER["NUM_TOTAL_ORDERS_SOFAR"] = ObjHeader.OrderItemsNumTotalOrdersSoFar == null || Convert.ToString(ObjHeader.OrderItemsNumTotalOrdersSoFar) == "" ? 0 : Convert.ToDecimal(ObjHeader.OrderItemsNumTotalOrdersSoFar);
                        DATATABLE_VITAMOJO_HEADER.Rows.Add(DR_VITAMOJO_HEADER);
                    }
                    Root_VitaMojo VITA_MOJO_ROOT_LINE_DATA = null;
                    foreach (var ObjLine in VITA_MOJO_ROOT_HEADER_DATA.data)
                    {
                        DataRow DR_VITAMOJO_LINE = DATATABLE_VITAMOJO_LINE.NewRow();
                        DR_VITAMOJO_LINE["BUNDLE_UUID"] = ObjLine.OrderItemsBundleUuid == null || Convert.ToString(ObjLine.OrderItemsBundleUuid) == "" ? "" : Convert.ToString(ObjLine.OrderItemsBundleUuid);  //Convert.ToString(ObjLine.OrderItemsBundleUuid);
                        DR_VITAMOJO_LINE["ITEM_UUID"] = ObjLine.OrderItemsItemUuid == null || Convert.ToString(ObjLine.OrderItemsItemUuid) == "" ? "" : Convert.ToString(ObjLine.OrderItemsItemUuid);
                        DR_VITAMOJO_LINE["CATALOG_BUNDLE_UUID"] = Convert.ToString(ObjLine.OrderItemsCatalogBundleUuid) == "" || ObjLine.OrderItemsCatalogBundleUuid == null ? "" : ObjLine.OrderItemsCatalogBundleUuid;
                        DR_VITAMOJO_LINE["CATALOG_ITEM_UUID"] = Convert.ToString(ObjLine.OrderItemsCatalogItemUuid) == "" || ObjLine.OrderItemsCatalogItemUuid == null ? "" : ObjLine.OrderItemsCatalogItemUuid; //Convert.ToString(ObjLine.OrderItemsCatalogItemUuid);
                        DR_VITAMOJO_LINE["CATEGORY"] = Convert.ToString(ObjLine.OrderItemsCategory) == "" || ObjLine.OrderItemsCategory == null ? "" : Convert.ToString(ObjLine.OrderItemsCategory);
                        DR_VITAMOJO_LINE["TYPE"] = Convert.ToString(ObjLine.OrderItemsType) == "" || ObjLine.OrderItemsType == null ? "" : Convert.ToString(ObjLine.OrderItemsType);
                        DR_VITAMOJO_LINE["BUNDLE"] = Convert.ToString(ObjLine.OrderItemsBundle) == "" || ObjLine.OrderItemsBundle == null ? "" : Convert.ToString(ObjLine.OrderItemsBundle);
                        DR_VITAMOJO_LINE["ITEM_NAME"] = Convert.ToString(ObjLine.OrderItemsItemName) == "" || ObjLine.OrderItemsItemName == null ? "" : Convert.ToString(ObjLine.OrderItemsItemName);
                        DR_VITAMOJO_LINE["ITEM_GROUP_NAME"] = Convert.ToString(ObjLine.OrderItemsItemGroupName) == "" || ObjLine.OrderItemsItemGroupName == null ? "" : Convert.ToString(ObjLine.OrderItemsItemGroupName);
                        DR_VITAMOJO_LINE["MEAL_DEAL_NAME"] = Convert.ToString(ObjLine.OrderItemsMealDealName) == "" || ObjLine.OrderItemsMealDealName == null ? "" : Convert.ToString(ObjLine.OrderItemsMealDealName);
                        DR_VITAMOJO_LINE["MEAL_DEAL_BASKET_UUID"] = ObjLine.OrderItemsMealDealBasketUuid == null || Convert.ToString(ObjLine.OrderItemsMealDealBasketUuid) == "" ? "" : Convert.ToString(ObjLine.OrderItemsMealDealBasketUuid);
                        DR_VITAMOJO_LINE["ITEM_QUANTITY_PORTIONS"] = ObjLine.OrderItemsItemQuantityPortions == null || Convert.ToString(ObjLine.OrderItemsItemQuantityPortions) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsItemQuantityPortions);
                        DR_VITAMOJO_LINE["ITEM_QUANTITY"] = ObjLine.OrderItemsItemQuantity == null || Convert.ToString(ObjLine.OrderItemsItemQuantity) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsItemQuantity);
                        DR_VITAMOJO_LINE["ITEM_SIZE"] = ObjLine.OrderItemsItemSize == null || Convert.ToString(ObjLine.OrderItemsItemSize) == "" ? (object)DBNull.Value : Convert.ToString(ObjLine.OrderItemsItemSize);
                        DR_VITAMOJO_LINE["CATALOG_PROMOTION_NAME"] = ObjLine.OrderItemsCatalogPromotionName == null || Convert.ToString(ObjLine.OrderItemsCatalogPromotionName) == "" ? "" : Convert.ToString(ObjLine.OrderItemsCatalogPromotionName);
                        DR_VITAMOJO_LINE["VAT_RATE"] = ObjLine.OrderItemsVatRate == null || Convert.ToString(ObjLine.OrderItemsVatRate) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsVatRate);
                        DR_VITAMOJO_LINE["CATALOG_VAT_RATE"] = ObjLine.OrderItemsCatalogVatRate == null || Convert.ToString(ObjLine.OrderItemsCatalogVatRate) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsCatalogVatRate);
                        DR_VITAMOJO_LINE["CREATED_AT"] = ObjLine.OrderItemsCreatedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsCreatedAt;
                        DR_VITAMOJO_LINE["UPDATED_AT"] = ObjLine.OrderItemsUpdatedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsUpdatedAt;
                        DR_VITAMOJO_LINE["UPDATED_AT_UTC"] = ObjLine.OrderItemsUpdatedAtUtc == null ? (object)DBNull.Value : ObjLine.OrderItemsUpdatedAtUtc;
                        DR_VITAMOJO_LINE["PICKUP_TIME_DT"] = ObjLine.OrderItemsPickupTimeDt == null ? (object)DBNull.Value : ObjLine.OrderItemsPickupTimeDt;
                        DR_VITAMOJO_LINE["SLOT15MIN"] = ObjLine.OrderItemsSlot15min == null ? (object)DBNull.Value : ObjLine.OrderItemsSlot15min;
                        DR_VITAMOJO_LINE["SLOT60MIN"] = ObjLine.OrderItemsSlot60min == null ? (object)DBNull.Value : ObjLine.OrderItemsSlot60min;
                        DR_VITAMOJO_LINE["FIRST_ORDER_DATE"] = ObjLine.OrderItemsFirstOrderDate == null ? (object)DBNull.Value : ObjLine.OrderItemsFirstOrderDate;
                        DR_VITAMOJO_LINE["CONFIRMED_AT"] = ObjLine.OrderItemsConfirmedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsConfirmedAt;
                        DR_VITAMOJO_LINE["IN_PRODUCTION_AT"] = ObjLine.OrderItemsInProductionAt == null ? (object)DBNull.Value : ObjLine.OrderItemsInProductionAt;
                        DR_VITAMOJO_LINE["READY_TO_COLLECT_AT"] = ObjLine.OrderItemsReadyToCollectAt == null ? (object)DBNull.Value : ObjLine.OrderItemsReadyToCollectAt;
                        DR_VITAMOJO_LINE["COLLECTED_AT"] = ObjLine.OrderItemsCollectedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsCollectedAt;
                        DR_VITAMOJO_LINE["CANCELLED_AT"] = ObjLine.OrderItemsCancelledAt == null ? (object)DBNull.Value : ObjLine.OrderItemsCancelledAt;
                        DR_VITAMOJO_LINE["REFUNDED_AT"] = ObjLine.OrderItemsRefundedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsRefundedAt;
                        DR_VITAMOJO_LINE["INTEGRATION_ERROR_AT"] = ObjLine.OrderItemsIntegrationErrorAt == null ? (object)DBNull.Value : ObjLine.OrderItemsIntegrationErrorAt;
                        DR_VITAMOJO_LINE["INTEGRATION_ERROR_CORRECTED_AT"] = ObjLine.OrderItemsIntegrationErrorCorrectedAt == null ? (object)DBNull.Value : ObjLine.OrderItemsIntegrationErrorCorrectedAt;
                        DR_VITAMOJO_LINE["EXTERNAL_CATEGORY"] = Convert.ToString(ObjLine.OrderItemsExternalCategory) == "" || ObjLine.OrderItemsExternalCategory == null ? "" : Convert.ToString(ObjLine.OrderItemsExternalCategory);
                        DR_VITAMOJO_LINE["VM_OS_VERSION"] = Convert.ToString(ObjLine.OrderItemsVmosVersion);
                        DR_VITAMOJO_LINE["TAX_EXEMPT"] = Convert.ToInt32(ObjLine.OrderItemsTaxExempt);
                        DR_VITAMOJO_LINE["BUNDLE_TAX_EXEMPT"] = ObjLine.OrderItemsBundleTaxExempt == null || Convert.ToString(ObjLine.OrderItemsBundleTaxExempt) == "" ? 0 : Convert.ToInt32(ObjLine.OrderItemsBundleTaxExempt);
                        DR_VITAMOJO_LINE["SALES_TAX_RATE"] = ObjLine.OrderItemsSalesTaxRate == null || Convert.ToString(ObjLine.OrderItemsSalesTaxRate) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsSalesTaxRate);
                        DR_VITAMOJO_LINE["BRAND"] = Convert.ToString(ObjLine.OrderItemsBrand) == "" || ObjLine.OrderItemsBrand == null ? "" : Convert.ToString(ObjLine.OrderItemsBrand);
                        DR_VITAMOJO_LINE["QUANTITY"] = Convert.ToDecimal(ObjLine.OrderItemsQuantity);
                        DR_VITAMOJO_LINE["ITEM_TOTAL_PRICE"] = Convert.ToDecimal(ObjLine.OrderItemsItemTotalPrice);
                        DR_VITAMOJO_LINE["ITEM_TOTAL_AMOUNT"] = Convert.ToDecimal(ObjLine.OrderItemsItemTotalAmount);
                        DR_VITAMOJO_LINE["ITEM_DISCOUNT"] = Convert.ToDecimal(ObjLine.OrderItemsItemDiscount);
                        DR_VITAMOJO_LINE["ITEM_REFUND"] = Convert.ToDecimal(ObjLine.OrderItemsItemRefund);
                        DR_VITAMOJO_LINE["VA_TABLE_SALES"] = Convert.ToDecimal(ObjLine.OrderItemsVatableSales);
                        DR_VITAMOJO_LINE["NON_VATABLE_SALES"] = Convert.ToDecimal(ObjLine.OrderItemsNonVatableSales);
                        DR_VITAMOJO_LINE["MENU_ITEMS_SOLD"] = Convert.ToDecimal(ObjLine.OrderItemsMenuItemsSold);
                        DR_VITAMOJO_LINE["VAT"] = Convert.ToDecimal(ObjLine.OrderItemsVat);
                        DR_VITAMOJO_LINE["NET_SALES"] = Convert.ToDecimal(ObjLine.OrderItemsNetSales);
                        DR_VITAMOJO_LINE["HEADER_UUID"] = Convert.ToString(ObjLine.OrderItemsUuid);
                        DR_VITAMOJO_LINE["SLOT"] = Convert.ToString(ObjLine.OrderItemsSlot) == "" || ObjLine.OrderItemsSlot == null ? "" : Convert.ToString(ObjLine.OrderItemsSlot);
                        DR_VITAMOJO_LINE["IS_RECOMMENDATION"] = Convert.ToInt32(ObjLine.OrderItemsIsRecommendation);
                        DR_VITAMOJO_LINE["IS_UPSELL"] = Convert.ToInt32(ObjLine.OrderItemsIsUpsell);
                        DR_VITAMOJO_LINE["IS_EOTHO"] = Convert.ToInt32(ObjLine.OrderItemsIsEotho);
                        DR_VITAMOJO_LINE["PROMOTION_NAME"] = Convert.ToString(ObjLine.OrderItemsPromotionName) == "" || ObjLine.OrderItemsPromotionName == null ? "" : Convert.ToString(ObjLine.OrderItemsPromotionName);
                        //DR_VITAMOJO_LINE["COUNT"] = ObjLine.OrderItemsCount == null || Convert.ToString(ObjLine.OrderItemsCount) == "" ? 0 : Convert.ToDecimal(ObjLine.OrderItemsCount);
                        //DR_VITAMOJO_LINE["ORDER_NUMBER"] = Convert.ToString(ObjLine.OrderItemsOrderNumber);
                        DATATABLE_VITAMOJO_LINE.Rows.Add(DR_VITAMOJO_LINE);
                    }
                }
                DS_VITA_MOJO.Tables.Add(DATATABLE_VITAMOJO_HEADER);
                DS_VITA_MOJO.Tables.Add(DATATABLE_VITAMOJO_LINE);
                return DS_VITA_MOJO;
            }
            catch (Exception ex)
            {
                Exception_Counter += 1;
                Exception_Message = string.Empty;
                Exception_Message = ex.Message;
                LogExceptions.LogInfo("Inner loop counter of FetchFinancialDataByTime function in - VITAMOJO - Inner_Loop_Counter= " + Convert.ToString(Inner_Loop_Counter));
                if (Exception_Message.ToLower() == "The remote server returned an error: (400) Bad Request.".ToLower()
                || Exception_Message.ToLower() == "The remote server returned an error: (403) Forbidden.".ToLower()
                || Exception_Message.ToLower() == "Internal server error".ToLower())
                {
                    if (Exception_Counter <= 2)
                    {
                        System.Threading.Thread.Sleep(20000);
                        goto Refetch;
                    }
                }

                //if (ex.Message.ToLower() == "The remote server returned an error: (400) Bad Request.".ToLower() || ex.Message.ToLower() == "The remote server returned an error: (403) Forbidden.".ToLower() || ex.Message.ToLower()== "Internal server error".ToLower())
                //{
                //    cashup.CashupModelObj.INTEGRATION_STATUS = 0;
                //    cashup.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                //    cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                //    return null;
                //}
                //else
                //{
                //    cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                //    cashup.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                //    cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                //    return null;
                //    //throw;
                //}
                Exception_Counter = 0;
                Inner_Loop_Counter = 0;
                throw;
            }
        }
        int SubmitdataFromVitaMojo(DataSet FinancialData, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BEANCH_ID)
        {
            Cashup _ICashUp = new Cashup();
            try
            {
                //Save Data in Database
                if (FinancialData.Tables.Count > 0 && FinancialData.Tables[0].Rows.Count > 0 && FinancialData.Tables[1].Rows.Count > 0) //(dtx.Rows.Count > 0)
                {
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BEANCH_ID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.VITA_MOJO_HEADER = FinancialData.Tables[0];
                    _ICashUp.CashupModelObj.VITA_MOJO_LINE = FinancialData.Tables[1];
                    _ICashUp.INS_UPD_VITA_MOJO_DATA();
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("VITAMOJO: Fail to Saving Data in DB - ", ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }

    }

    #region ------------------Header + Line Item Class-------------------
    public class TimeDimension
    {
        public string dimension { get; set; }
        public string granularity { get; set; }
        public List<DateTime> dateRange { get; set; }

        [JsonProperty("OrderItems.createdAt.day")]
        public OrderItemsCreatedAtDay OrderItemsCreatedAtDay { get; set; }
        [JsonProperty("OrderItems.createdAt")]
        public OrderItemsCreatedAt OrderItemsCreatedAt { get; set; }
    }

    public class Query
    {
        public List<string> measures { get; set; }
        public List<string> dimensions { get; set; }
        public List<TimeDimension> timeDimensions { get; set; }
        public string timezone { get; set; }
        public List<object> order { get; set; }
        public List<object> filters { get; set; }
    }
    public class Stage
    {
        public string stage { get; set; }
        public int timeElapsed { get; set; }
    }
    public class Datum
    {
        #region---Header----

        [JsonProperty("OrderItems.takeaway")]
        public bool OrderItemsTakeaway { get; set; }

        [JsonProperty("OrderItems.isDelivery")]
        public bool OrderItemsIsDelivery { get; set; }

        [JsonProperty("OrderItems.isRecommendation")]
        public bool? OrderItemsIsRecommendation { get; set; }

        [JsonProperty("OrderItems.isUpsell")]
        public bool OrderItemsIsUpsell { get; set; }

        [JsonProperty("OrderItems.isEotho")]
        public bool OrderItemsIsEotho { get; set; }

        [JsonProperty("OrderItems.customerId")]
        public string OrderItemsCustomerId { get; set; }

        [JsonProperty("OrderItems.customerCardId")]
        public string OrderItemsCustomerCardId { get; set; }

        [JsonProperty("OrderItems.orderStatus")]
        public string OrderItemsOrderStatus { get; set; }

        [JsonProperty("OrderItems.paymentStatus")]
        public string OrderItemsPaymentStatus { get; set; }

        [JsonProperty("OrderItems.currency")]
        public string OrderItemsCurrency { get; set; }

        [JsonProperty("OrderItems.paymentMode")]
        public string OrderItemsPaymentMode { get; set; }

        [JsonProperty("OrderItems.tenant")]
        public string OrderItemsTenant { get; set; }

        [JsonProperty("OrderItems.store")]
        public string OrderItemsStore { get; set; }

        [JsonProperty("OrderItems.storeUuid")]
        public string OrderItemsStoreUuid { get; set; }

        [JsonProperty("OrderItems.menuName")]
        public string OrderItemsMenuName { get; set; }

        [JsonProperty("OrderItems.orderType")]
        public string OrderItemsOrderType { get; set; }

        [JsonProperty("OrderItems.userInstoreName")]
        public string OrderItemsUserInstoreName { get; set; }

        [JsonProperty("OrderItems.createSource")]
        public string OrderItemsCreateSource { get; set; }

        [JsonProperty("OrderItems.slot")]
        public string OrderItemsSlot { get; set; }

        [JsonProperty("OrderItems.deliverySource")]
        public string OrderItemsDeliverySource { get; set; }

        [JsonProperty("OrderItems.orderUuid")]
        public string OrderItemsOrderUuid { get; set; }

        [JsonProperty("OrderItems.bundleUuid")]
        public string OrderItemsBundleUuid { get; set; }

        [JsonProperty("OrderItems.orderNumber")]
        public string OrderItemsOrderNumber { get; set; }

        [JsonProperty("OrderItems.brand")]
        public string OrderItemsBrand { get; set; }

        [JsonProperty("OrderItems.createdAt.day")]
        public DateTime OrderItemsCreatedAtDay { get; set; }

        [JsonProperty("OrderItems.createdAt")]
        public DateTime OrderItemsCreatedAt { get; set; }

        [JsonProperty("OrderItems.count")]
        public string OrderItemsCount { get; set; }

        [JsonProperty("OrderItems.totalAmount")]
        public string OrderItemsTotalAmount { get; set; }

        [JsonProperty("OrderItems.price")]
        public string OrderItemsPrice { get; set; }

        [JsonProperty("OrderItems.discount")]
        public string OrderItemsDiscount { get; set; }

        [JsonProperty("OrderItems.refundAmount")]
        public string OrderItemsRefundAmount { get; set; }

        [JsonProperty("OrderItems.quantity")]
        public string OrderItemsQuantity { get; set; }

        [JsonProperty("OrderItems.itemTotalPrice")]
        public string OrderItemsItemTotalPrice { get; set; }

        [JsonProperty("OrderItems.itemTotalAmount")]
        public string OrderItemsItemTotalAmount { get; set; }

        [JsonProperty("OrderItems.itemDiscount")]
        public string OrderItemsItemDiscount { get; set; }

        [JsonProperty("OrderItems.itemRefund")]
        public string OrderItemsItemRefund { get; set; }

        [JsonProperty("OrderItems.vatableSales")]
        public string OrderItemsVatableSales { get; set; }

        [JsonProperty("OrderItems.nonVatableSales")]
        public string OrderItemsNonVatableSales { get; set; }

        [JsonProperty("OrderItems.menuItemsSold")]
        public string OrderItemsMenuItemsSold { get; set; }

        [JsonProperty("OrderItems.vat")]
        public string OrderItemsVat { get; set; }

        [JsonProperty("OrderItems.netSales")]
        public string OrderItemsNetSales { get; set; }


        #endregion

        [JsonProperty("OrderItems.uuid")]
        public string OrderItemsUuid { get; set; }

        //[JsonProperty("OrderItems.bundleUuid")]
        //public string OrderItemsBundleUuid { get; set; }

        //[JsonProperty("OrderItems.orderNumber")]
        //public string OrderItemsOrderNumber { get; set; }

        [JsonProperty("OrderItems.itemUuid")]
        public string OrderItemsItemUuid { get; set; }

        [JsonProperty("OrderItems.catalogBundleUuid")]
        public string OrderItemsCatalogBundleUuid { get; set; }

        [JsonProperty("OrderItems.catalogItemUuid")]
        public string OrderItemsCatalogItemUuid { get; set; }

        [JsonProperty("OrderItems.category")]
        public string OrderItemsCategory { get; set; }

        [JsonProperty("OrderItems.type")]
        public string OrderItemsType { get; set; }

        [JsonProperty("OrderItems.bundle")]
        public string OrderItemsBundle { get; set; }

        [JsonProperty("OrderItems.itemName")]
        public string OrderItemsItemName { get; set; }

        [JsonProperty("OrderItems.itemGroupName")]
        public string OrderItemsItemGroupName { get; set; }

        [JsonProperty("OrderItems.mealDealName")]
        public object OrderItemsMealDealName { get; set; }

        [JsonProperty("OrderItems.mealDealBasketUuid")]
        public object OrderItemsMealDealBasketUuid { get; set; }

        [JsonProperty("OrderItems.itemQuantityPortions")]
        public string OrderItemsItemQuantityPortions { get; set; }

        [JsonProperty("OrderItems.itemQuantity")]
        public object OrderItemsItemQuantity { get; set; }

        [JsonProperty("OrderItems.promotionName")]
        public string OrderItemsPromotionName { get; set; }

        [JsonProperty("OrderItems.itemSize")]
        public string OrderItemsItemSize { get; set; }

        [JsonProperty("OrderItems.orderPromotionName")]
        public string OrderItemsOrderPromotionName { get; set; }

        [JsonProperty("OrderItems.catalogPromotionName")]
        public string OrderItemsCatalogPromotionName { get; set; }

        [JsonProperty("OrderItems.tableNumber")]
        public string OrderItemsTableNumber { get; set; }

        [JsonProperty("OrderItems.channel")]
        public string OrderItemsChannel { get; set; }

        [JsonProperty("OrderItems.tillId")]
        public string OrderItemsTillId { get; set; }

        [JsonProperty("OrderItems.operatorEmail")]
        public object OrderItemsOperatorEmail { get; set; }

        [JsonProperty("OrderItems.vatRate")]
        public string OrderItemsVatRate { get; set; }

        [JsonProperty("OrderItems.catalogVatRate")]
        public string OrderItemsCatalogVatRate { get; set; }

        //[JsonProperty("OrderItems.createdAt")]
        //public DateTime OrderItemsCreatedAt { get; set; }

        [JsonProperty("OrderItems.updatedAt")]
        public DateTime? OrderItemsUpdatedAt { get; set; }

        [JsonProperty("OrderItems.updatedAtUtc")]
        public DateTime? OrderItemsUpdatedAtUtc { get; set; }

        [JsonProperty("OrderItems.pickupTimeDt")]
        public DateTime? OrderItemsPickupTimeDt { get; set; }

        [JsonProperty("OrderItems.slot15min")]
        public DateTime? OrderItemsSlot15min { get; set; }

        [JsonProperty("OrderItems.slot60min")]
        public DateTime? OrderItemsSlot60min { get; set; }

        [JsonProperty("OrderItems.firstOrderDate")]
        public DateTime? OrderItemsFirstOrderDate { get; set; }

        [JsonProperty("OrderItems.confirmedAt")]
        public DateTime? OrderItemsConfirmedAt { get; set; }

        [JsonProperty("OrderItems.inProductionAt")]
        public DateTime? OrderItemsInProductionAt { get; set; }

        [JsonProperty("OrderItems.readyToCollectAt")]
        public DateTime? OrderItemsReadyToCollectAt { get; set; }

        [JsonProperty("OrderItems.collectedAt")]
        public object OrderItemsCollectedAt { get; set; }

        [JsonProperty("OrderItems.cancelledAt")]
        public object OrderItemsCancelledAt { get; set; }

        [JsonProperty("OrderItems.refundedAt")]
        public object OrderItemsRefundedAt { get; set; }

        [JsonProperty("OrderItems.integrationErrorAt")]
        public object OrderItemsIntegrationErrorAt { get; set; }

        [JsonProperty("OrderItems.integrationErrorCorrectedAt")]
        public object OrderItemsIntegrationErrorCorrectedAt { get; set; }

        [JsonProperty("OrderItems.externalCategory")]
        public string OrderItemsExternalCategory { get; set; }

        [JsonProperty("OrderItems.numTotalOrdersSoFar")]
        public string OrderItemsNumTotalOrdersSoFar { get; set; }

        [JsonProperty("OrderItems.vmosVersion")]
        public int OrderItemsVmosVersion { get; set; }

        [JsonProperty("OrderItems.taxExempt")]
        public int? OrderItemsTaxExempt { get; set; }

        [JsonProperty("OrderItems.bundleTaxExempt")]
        public int? OrderItemsBundleTaxExempt { get; set; }

        [JsonProperty("OrderItems.salesTaxRate")]
        public string OrderItemsSalesTaxRate { get; set; }

        //[JsonProperty("OrderItems.createdAt.day")]
        //public DateTime OrderItemsCreatedAtDay { get; set; }

        //[JsonProperty("OrderItems.count")]
        //public string OrderItemsCount { get; set; }
    }

    public class DrillMembersGrouped
    {
        public List<object> measures { get; set; }
        public List<string> dimensions { get; set; }
    }

    public class OrderItemsCount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<string> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsTotalAmount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsPrice
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsDiscount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsRefundAmount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsQuantity
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsItemTotalPrice
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsItemTotalAmount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsItemDiscount
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsItemRefund
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsVatableSales
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsNonVatableSales
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class OrderItemsMenuItemsSold
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsVat
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }

    public class OrderItemsNetSales
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
        public List<object> drillMembers { get; set; }
        public DrillMembersGrouped drillMembersGrouped { get; set; }
    }
    public class Measures
    {
        [JsonProperty("OrderItems.count")]
        public OrderItemsCount OrderItemsCount { get; set; }
        [JsonProperty("OrderItems.totalAmount")]
        public OrderItemsTotalAmount OrderItemsTotalAmount { get; set; }

        [JsonProperty("OrderItems.price")]
        public OrderItemsPrice OrderItemsPrice { get; set; }

        [JsonProperty("OrderItems.discount")]
        public OrderItemsDiscount OrderItemsDiscount { get; set; }

        [JsonProperty("OrderItems.refundAmount")]
        public OrderItemsRefundAmount OrderItemsRefundAmount { get; set; }

        [JsonProperty("OrderItems.quantity")]
        public OrderItemsQuantity OrderItemsQuantity { get; set; }

        [JsonProperty("OrderItems.itemTotalPrice")]
        public OrderItemsItemTotalPrice OrderItemsItemTotalPrice { get; set; }

        [JsonProperty("OrderItems.itemTotalAmount")]
        public OrderItemsItemTotalAmount OrderItemsItemTotalAmount { get; set; }

        [JsonProperty("OrderItems.itemDiscount")]
        public OrderItemsItemDiscount OrderItemsItemDiscount { get; set; }

        [JsonProperty("OrderItems.itemRefund")]
        public OrderItemsItemRefund OrderItemsItemRefund { get; set; }

        [JsonProperty("OrderItems.vatableSales")]
        public OrderItemsVatableSales OrderItemsVatableSales { get; set; }

        [JsonProperty("OrderItems.nonVatableSales")]
        public OrderItemsNonVatableSales OrderItemsNonVatableSales { get; set; }

        [JsonProperty("OrderItems.menuItemsSold")]
        public OrderItemsMenuItemsSold OrderItemsMenuItemsSold { get; set; }

        [JsonProperty("OrderItems.vat")]
        public OrderItemsVat OrderItemsVat { get; set; }

        [JsonProperty("OrderItems.netSales")]
        public OrderItemsNetSales OrderItemsNetSales { get; set; }

    }

    public class OrderItemsUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsBundleUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOrderNumber
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCatalogBundleUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCatalogItemUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCategory
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsType
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsBundle
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemGroupName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsMealDealName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsMealDealBasketUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemQuantityPortions
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemQuantity
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsPromotionName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsItemSize
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOrderPromotionName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCatalogPromotionName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsTableNumber
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsChannel
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsTillId
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOperatorEmail
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsVatRate
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCatalogVatRate
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCreatedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsUpdatedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsUpdatedAtUtc
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsPickupTimeDt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsSlot15min
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsSlot60min
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsFirstOrderDate
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsConfirmedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsInProductionAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsReadyToCollectAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCollectedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCancelledAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsRefundedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIntegrationErrorAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIntegrationErrorCorrectedAt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsExternalCategory
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsNumTotalOrdersSoFar
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsVmosVersion
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsTaxExempt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsBundleTaxExempt
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsSalesTaxRate
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class Dimensions
    {
        #region---Header----

        [JsonProperty("OrderItems.takeaway")]
        public OrderItemsTakeaway OrderItemsTakeaway { get; set; }

        [JsonProperty("OrderItems.isDelivery")]
        public OrderItemsIsDelivery OrderItemsIsDelivery { get; set; }

        [JsonProperty("OrderItems.isRecommendation")]
        public OrderItemsIsRecommendation OrderItemsIsRecommendation { get; set; }

        [JsonProperty("OrderItems.isUpsell")]
        public OrderItemsIsUpsell OrderItemsIsUpsell { get; set; }

        [JsonProperty("OrderItems.isEotho")]
        public OrderItemsIsEotho OrderItemsIsEotho { get; set; }

        [JsonProperty("OrderItems.uuid")]
        public OrderItemsUuid OrderItemsUuid { get; set; }

        [JsonProperty("OrderItems.customerId")]
        public OrderItemsCustomerId OrderItemsCustomerId { get; set; }

        [JsonProperty("OrderItems.customerCardId")]
        public OrderItemsCustomerCardId OrderItemsCustomerCardId { get; set; }

        [JsonProperty("OrderItems.orderStatus")]
        public OrderItemsOrderStatus OrderItemsOrderStatus { get; set; }

        [JsonProperty("OrderItems.paymentStatus")]
        public OrderItemsPaymentStatus OrderItemsPaymentStatus { get; set; }

        [JsonProperty("OrderItems.currency")]
        public OrderItemsCurrency OrderItemsCurrency { get; set; }

        [JsonProperty("OrderItems.paymentMode")]
        public OrderItemsPaymentMode OrderItemsPaymentMode { get; set; }

        [JsonProperty("OrderItems.tenant")]
        public OrderItemsTenant OrderItemsTenant { get; set; }

        [JsonProperty("OrderItems.store")]
        public OrderItemsStore OrderItemsStore { get; set; }

        [JsonProperty("OrderItems.storeUuid")]
        public OrderItemsStoreUuid OrderItemsStoreUuid { get; set; }

        [JsonProperty("OrderItems.menuName")]
        public OrderItemsMenuName OrderItemsMenuName { get; set; }

        [JsonProperty("OrderItems.orderType")]
        public OrderItemsOrderType OrderItemsOrderType { get; set; }

        [JsonProperty("OrderItems.userInstoreName")]
        public OrderItemsUserInstoreName OrderItemsUserInstoreName { get; set; }

        [JsonProperty("OrderItems.createSource")]
        public OrderItemsCreateSource OrderItemsCreateSource { get; set; }

        [JsonProperty("OrderItems.slot")]
        public OrderItemsSlot OrderItemsSlot { get; set; }

        [JsonProperty("OrderItems.deliverySource")]
        public OrderItemsDeliverySource OrderItemsDeliverySource { get; set; }

        [JsonProperty("OrderItems.orderUuid")]
        public OrderItemsOrderUuid OrderItemsOrderUuid { get; set; }

        [JsonProperty("OrderItems.bundleUuid")]
        public OrderItemsBundleUuid OrderItemsBundleUuid { get; set; }

        [JsonProperty("OrderItems.orderNumber")]
        public OrderItemsOrderNumber OrderItemsOrderNumber { get; set; }

        [JsonProperty("OrderItems.brand")]
        public OrderItemsBrand OrderItemsBrand { get; set; }

        #endregion

        //[JsonProperty("OrderItems.uuid")]
        //public OrderItemsUuid OrderItemsUuid { get; set; }

        //[JsonProperty("OrderItems.bundleUuid")]
        //public OrderItemsBundleUuid OrderItemsBundleUuid { get; set; }

        //[JsonProperty("OrderItems.orderNumber")]
        //public OrderItemsOrderNumber OrderItemsOrderNumber { get; set; }

        [JsonProperty("OrderItems.itemUuid")]
        public OrderItemsItemUuid OrderItemsItemUuid { get; set; }

        [JsonProperty("OrderItems.catalogBundleUuid")]
        public OrderItemsCatalogBundleUuid OrderItemsCatalogBundleUuid { get; set; }

        [JsonProperty("OrderItems.catalogItemUuid")]
        public OrderItemsCatalogItemUuid OrderItemsCatalogItemUuid { get; set; }

        [JsonProperty("OrderItems.category")]
        public OrderItemsCategory OrderItemsCategory { get; set; }

        [JsonProperty("OrderItems.type")]
        public OrderItemsType OrderItemsType { get; set; }

        [JsonProperty("OrderItems.bundle")]
        public OrderItemsBundle OrderItemsBundle { get; set; }

        [JsonProperty("OrderItems.itemName")]
        public OrderItemsItemName OrderItemsItemName { get; set; }

        [JsonProperty("OrderItems.itemGroupName")]
        public OrderItemsItemGroupName OrderItemsItemGroupName { get; set; }

        [JsonProperty("OrderItems.mealDealName")]
        public OrderItemsMealDealName OrderItemsMealDealName { get; set; }

        [JsonProperty("OrderItems.mealDealBasketUuid")]
        public OrderItemsMealDealBasketUuid OrderItemsMealDealBasketUuid { get; set; }

        [JsonProperty("OrderItems.itemQuantityPortions")]
        public OrderItemsItemQuantityPortions OrderItemsItemQuantityPortions { get; set; }

        [JsonProperty("OrderItems.itemQuantity")]
        public OrderItemsItemQuantity OrderItemsItemQuantity { get; set; }

        [JsonProperty("OrderItems.promotionName")]
        public OrderItemsPromotionName OrderItemsPromotionName { get; set; }

        [JsonProperty("OrderItems.itemSize")]
        public OrderItemsItemSize OrderItemsItemSize { get; set; }

        [JsonProperty("OrderItems.orderPromotionName")]
        public OrderItemsOrderPromotionName OrderItemsOrderPromotionName { get; set; }

        [JsonProperty("OrderItems.catalogPromotionName")]
        public OrderItemsCatalogPromotionName OrderItemsCatalogPromotionName { get; set; }

        [JsonProperty("OrderItems.tableNumber")]
        public OrderItemsTableNumber OrderItemsTableNumber { get; set; }

        [JsonProperty("OrderItems.channel")]
        public OrderItemsChannel OrderItemsChannel { get; set; }

        [JsonProperty("OrderItems.tillId")]
        public OrderItemsTillId OrderItemsTillId { get; set; }

        [JsonProperty("OrderItems.operatorEmail")]
        public OrderItemsOperatorEmail OrderItemsOperatorEmail { get; set; }

        [JsonProperty("OrderItems.vatRate")]
        public OrderItemsVatRate OrderItemsVatRate { get; set; }

        [JsonProperty("OrderItems.catalogVatRate")]
        public OrderItemsCatalogVatRate OrderItemsCatalogVatRate { get; set; }

        [JsonProperty("OrderItems.createdAt")]
        public OrderItemsCreatedAt OrderItemsCreatedAt { get; set; }

        [JsonProperty("OrderItems.updatedAt")]
        public OrderItemsUpdatedAt OrderItemsUpdatedAt { get; set; }

        [JsonProperty("OrderItems.updatedAtUtc")]
        public OrderItemsUpdatedAtUtc OrderItemsUpdatedAtUtc { get; set; }

        [JsonProperty("OrderItems.pickupTimeDt")]
        public OrderItemsPickupTimeDt OrderItemsPickupTimeDt { get; set; }

        [JsonProperty("OrderItems.slot15min")]
        public OrderItemsSlot15min OrderItemsSlot15min { get; set; }

        [JsonProperty("OrderItems.slot60min")]
        public OrderItemsSlot60min OrderItemsSlot60min { get; set; }

        [JsonProperty("OrderItems.firstOrderDate")]
        public OrderItemsFirstOrderDate OrderItemsFirstOrderDate { get; set; }

        [JsonProperty("OrderItems.confirmedAt")]
        public OrderItemsConfirmedAt OrderItemsConfirmedAt { get; set; }

        [JsonProperty("OrderItems.inProductionAt")]
        public OrderItemsInProductionAt OrderItemsInProductionAt { get; set; }

        [JsonProperty("OrderItems.readyToCollectAt")]
        public OrderItemsReadyToCollectAt OrderItemsReadyToCollectAt { get; set; }

        [JsonProperty("OrderItems.collectedAt")]
        public OrderItemsCollectedAt OrderItemsCollectedAt { get; set; }

        [JsonProperty("OrderItems.cancelledAt")]
        public OrderItemsCancelledAt OrderItemsCancelledAt { get; set; }

        [JsonProperty("OrderItems.refundedAt")]
        public OrderItemsRefundedAt OrderItemsRefundedAt { get; set; }

        [JsonProperty("OrderItems.integrationErrorAt")]
        public OrderItemsIntegrationErrorAt OrderItemsIntegrationErrorAt { get; set; }

        [JsonProperty("OrderItems.integrationErrorCorrectedAt")]
        public OrderItemsIntegrationErrorCorrectedAt OrderItemsIntegrationErrorCorrectedAt { get; set; }

        [JsonProperty("OrderItems.externalCategory")]
        public OrderItemsExternalCategory OrderItemsExternalCategory { get; set; }

        [JsonProperty("OrderItems.numTotalOrdersSoFar")]
        public OrderItemsNumTotalOrdersSoFar OrderItemsNumTotalOrdersSoFar { get; set; }

        [JsonProperty("OrderItems.vmosVersion")]
        public OrderItemsVmosVersion OrderItemsVmosVersion { get; set; }

        [JsonProperty("OrderItems.taxExempt")]
        public OrderItemsTaxExempt OrderItemsTaxExempt { get; set; }

        [JsonProperty("OrderItems.bundleTaxExempt")]
        public OrderItemsBundleTaxExempt OrderItemsBundleTaxExempt { get; set; }

        [JsonProperty("OrderItems.salesTaxRate")]
        public OrderItemsSalesTaxRate OrderItemsSalesTaxRate { get; set; }
    }

    public class Segments
    {
    }

    public class OrderItemsCreatedAtDay
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }
    //public class OrderItemsCreatedAt
    //{
    //    public string title { get; set; }
    //    public string shortTitle { get; set; }
    //    public string type { get; set; }
    //}
    public class Annotation
    {
        public Measures measures { get; set; }
        public Dimensions dimensions { get; set; }
        public Segments segments { get; set; }
        public TimeDimension timeDimensions { get; set; }
    }

    public class Root_VitaMojo
    {
        public Query query { get; set; }
        public List<Datum> data { get; set; }
        public DateTime lastRefreshTime { get; set; }
        public Annotation annotation { get; set; }
        public bool slowQuery { get; set; }
        public string error { get; set; }
        public Stage stage { get; set; }
    }
    public class OrderItemsTakeaway
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIsDelivery
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIsRecommendation
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIsUpsell
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsIsEotho
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    //public class OrderItemsUuid
    //{
    //    public string title { get; set; }
    //    public string shortTitle { get; set; }
    //    public string type { get; set; }
    //}

    public class OrderItemsCustomerId
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCustomerCardId
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOrderStatus
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsPaymentStatus
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCurrency
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsPaymentMode
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsTenant
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsStore
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsStoreUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsMenuName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOrderType
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsUserInstoreName
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsCreateSource
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsSlot
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsDeliverySource
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    public class OrderItemsOrderUuid
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }

    //public class OrderItemsBundleUuid
    //{
    //    public string title { get; set; }
    //    public string shortTitle { get; set; }
    //    public string type { get; set; }
    //}

    //public class OrderItemsOrderNumber
    //{
    //    public string title { get; set; }
    //    public string shortTitle { get; set; }
    //    public string type { get; set; }
    //}

    public class OrderItemsBrand
    {
        public string title { get; set; }
        public string shortTitle { get; set; }
        public string type { get; set; }
    }
    #endregion
}


