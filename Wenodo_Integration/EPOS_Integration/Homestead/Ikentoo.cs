using App_Repository;
using EPOS_Integration.Common;
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

namespace EPOS_Integration.LightSpeed
{
    public class Source
    {
        public string initialAccountId { get; set; }
        public string previousAccountId { get; set; }
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
        public string parentLineId { get; set; }
        public string totalNetAmountWithTax { get; set; }
        public string totalNetAmountWithoutTax { get; set; }
        public string menuListPrice { get; set; }
        public string unitCostPrice { get; set; }
        public string serviceCharge { get; set; }
        public string discountAmount { get; set; }
        public string taxAmount { get; set; }
        public string discountType { get; set; }
        public string discountCode { get; set; }
        public string discountName { get; set; }
        public string accountDiscountAmount { get; set; }
        public string accountDiscountType { get; set; }
        public string accountDiscountCode { get; set; }
        public string accountDiscountName { get; set; }
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
        public string voidReason { get; set; }
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
        public string nextPageToken { get; set; }
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
    public class Ikentoo
    {
        string MainIkentooURL = "https://api.ikentoo.com/f/finance/245611999789058/";
        string AccessToken = "access_token=ca322ad0-d840-4977-a58b-86ef13bf089a";

        /// <summary>
        ///   Code to pass all session data in common data structure.
        ///   To do so using datatable and dataset to use that data in common data structure.
        /// </summary>

        DataTable EPOS_SALES_HEADERS = new DataTable();
        DataTable EPOS_SALES_LINES = new DataTable();
        DataTable EPOS_SALES_PAYMENTS = new DataTable();
        DataTable EPOS_INTEGRATION_DT = new DataTable();
        int SESSION_MASTER_ID = 0;
        DataSet EPOS_DATASET = new DataSet();

        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            string EXCEPTION = string.Empty;

            EPOS_SALES_HEADERS.Clear();
            EPOS_SALES_LINES.Clear();
            EPOS_SALES_PAYMENTS.Clear();
            EPOS_INTEGRATION_DT.Clear();

            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.USER_ID = 1;
                Obj.CashupModelObj.EPOS_THREAD_SLEEP_TIME = Convert.ToInt32(System.Configuration.ConfigurationManager.AppSettings["EPOS_THREAD_SLEEP"]);
                //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                foreach (DataRow dr_session in dt_Session.Select("USE_IN_CASHUP=true").CopyToDataTable().Rows)
                {
                    int counter = 0;

                    Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                    SESSION_MASTER_ID = Convert.ToInt32(dr_session["SESSION_MASTER_ID"]);

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
                    DateTime theDate = Convert.ToDateTime(Cashup_date); // may 1st
                    TimeZoneInfo tzi = TimeZoneInfo.FindSystemTimeZoneById("Central European Standard Time");
                    bool isCurrentlyDaylightSavings = tzi.IsDaylightSavingTime(theDate);
                    string Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) + "+00:00";

                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]) + "+00:00";

                    if (isCurrentlyDaylightSavings)
                    {
                        Cashup_start_date = Convert.ToDateTime(Cashup_start_date).ToUniversalTime().AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss") + "+00:00";
                        Cashup_end_date = Convert.ToDateTime(Cashup_end_date).ToUniversalTime().AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss") + "+00:00";
                    }
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();
                    EPOS_INTEGRATION_DT = dtIntegrationData;
                    try
                    {
                        Root FinancialData = new Root();

                        IList<EPOS_DATA> EPOS_DATA_LIST = new List<EPOS_DATA>();
                        IList<EPOS_PAYMENTS> EPOS_PAYMENTS_LIST = new List<EPOS_PAYMENTS>();
                        DataSet TransactionDataSet = Create_DataTables();
                        DataTable dt_Header = TransactionDataSet.Tables[0];
                        DataTable dt_Line = TransactionDataSet.Tables[1];
                        DataTable dt_Payment = TransactionDataSet.Tables[2];
                        string nextPageToken = "";
                        int PageSize = 10;
                        for (int i = 0; i < 100000; i++)
                        {

                            Root temp_FinancialData = FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, nextPageToken, PageSize);
                            if (FinancialData.sales == null || FinancialData.sales.Count == 0)
                            {
                                FinancialData = temp_FinancialData;
                            }
                            else
                            {
                                FinancialData.sales = FinancialData.sales.Concat(temp_FinancialData.sales).ToList();
                            }
                            nextPageToken = "";
                            nextPageToken = temp_FinancialData.nextPageToken;

                            if (temp_FinancialData.nextPageToken == null)
                            {
                                break;
                            }
                        }
                        if (FinancialData != null)
                        {
                            int Flag = FillDatasetIkento(FinancialData, dt_Header, dt_Line, dt_Payment, EPOS_DATA_LIST, EPOS_PAYMENTS_LIST);
                            DataSet ds = Obj.GET_CASHUP_BY_ID();
                            INTEGRATION_STATUS = SubmitdataFromIkento(EPOS_DATA_LIST, EPOS_PAYMENTS_LIST, dt_Header,
                                dt_Line, dt_Payment, Convert.ToDecimal(ds.Tables[0].Rows[0]["ID"]),
                                Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]),
                                Convert.ToDecimal(dr["ENTITY_ID"]));

                            if (INTEGRATION_STATUS == 2 && Convert.ToDecimal(dr_session["SESSION_MASTER_ID"]) == 4)
                            {
                                EPOS_DATASET = new DataSet();
                                EPOS_DATASET.Tables.Add(EPOS_SALES_HEADERS.Copy());
                                EPOS_DATASET.Tables.Add(EPOS_SALES_LINES.Copy());
                                EPOS_DATASET.Tables.Add(EPOS_SALES_PAYMENTS.Copy());
                                EPOS_SALES.TransformData<DataSet> TRANSFORMDATA = new EPOS_SALES.TransformData<DataSet>();
                                TRANSFORMDATA.DataTransform(IntegrationSource.LightSpeed, EPOS_INTEGRATION_DT, EPOS_DATASET, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                EXCEPTION = Obj.CashupModelObj.ERROR_MESSAGE;
                            }
                        }
                        else
                        {
                            INTEGRATION_STATUS = 4;
                        }

                        Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                        Obj.CashupModelObj.ERROR_MESSAGE = EXCEPTION;
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    catch (System.Data.SqlClient.SqlException sqlEx)
                    {
                        try
                        {
                            counter += 1;
                            if (counter <= 1)
                            {
                                EPOS_DATASET = new DataSet();
                                EPOS_DATASET.Tables.Add(EPOS_SALES_HEADERS.Copy());
                                EPOS_DATASET.Tables.Add(EPOS_SALES_LINES.Copy());
                                EPOS_DATASET.Tables.Add(EPOS_SALES_PAYMENTS.Copy());
                                EPOS_SALES.TransformData<DataSet> TRANSFORMDATA = new EPOS_SALES.TransformData<DataSet>();
                                TRANSFORMDATA.DataTransform(IntegrationSource.LightSpeed, EPOS_INTEGRATION_DT, EPOS_DATASET, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);

                                Obj.CashupModelObj.INTEGRATION_STATUS = 2;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj.CashupModelObj.ERROR_MESSAGE = "Exception Common save function.--------" + Obj.CashupModelObj.ERROR_MESSAGE + ex.ToString();
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    catch (Exception ex)
                    {
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos Main.--------" + Obj.CashupModelObj.ERROR_MESSAGE + ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }

                }

                //      FetchDailyFinancialData(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd"))

            }
        }

        Root FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, string nextPageToken, int PageSize)
        {
            try
            {
                //  date = "2021-01-03";
                // dtIntegrationData
                MainIkentooURL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);

                string URL = MainIkentooURL + "financials/" + Start_date + "/" + End_date + "?includeConsumers=true&include=staff,table,consumer,revenue_center,account_profile,payment_authorization,payments&pageSize=" + PageSize + "&nextPageToken=" + nextPageToken;
                //string URL = MainIkentooURL + "financials/" + Start_date + "/" + End_date + "?" + AccessToken + "&includeConsumers=true&include=staff,table,consumer,revenue_center,account_profile,payment_authorization,payments&pageSize=50000";
                var client = new WebClient();
                client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                client.Headers.Add("Authorization", "Bearer " + AccessToken.Replace("access_token=", ""));
                client.Credentials = CredentialCache.DefaultCredentials;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var response = client.DownloadString(URL);
                JObject objects = JObject.Parse(response);
                Root DailyFinancialData = JsonConvert.DeserializeObject<Root>(response);

                return DailyFinancialData;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("FetchFinancialDataByTime - ", ex);
                throw;
            }
        }

        int FillDatasetIkento(Root FinancialData, DataTable dt_Header, DataTable dt_Line,
            DataTable dt_Payment, IList<EPOS_DATA> EPOS_DATA_LIST, IList<EPOS_PAYMENTS> EPOS_PAYMENTS_LIST)
        {
            //IList<EPOS_DATA> EPOS_DATA_LIST = new List<EPOS_DATA>();
            //IList<EPOS_PAYMENTS> EPOS_PAYMENTS_LIST = new List<EPOS_PAYMENTS>();
            //DataSet TransactionDataSet = Create_DataTables();
            //DataTable dt_Header = TransactionDataSet.Tables[0];
            //DataTable dt_Line = TransactionDataSet.Tables[1];
            //DataTable dt_Payment = TransactionDataSet.Tables[2];

            int index = 0;
            try
            {
                foreach (Sale s in FinancialData.sales)
                {
                    try
                    {
                        DataRow DR = dt_Header.NewRow();
                        DR[0] = index;
                        DR[1] = s.accountReference;
                        DR[2] = s.accountFiscId;
                        DR[3] = s.receiptId;
                        DR[4] = s.source.initialAccountId;
                        DR[5] = s.timeOfOpening;
                        DR[6] = s.timeOfCloseAndPaid;
                        DR[7] = s.tableName;
                        DR[8] = s.accountProfileCode;
                        DR[9] = s.ownerName;
                        DR[10] = s.ownerId;
                        DR[11] = s.type;
                        DR[12] = s.nbCovers;
                        DR[13] = s.dineIn;
                        DR[14] = s.deviceId;
                        DR[15] = s.deviceName;
                        dt_Header.Rows.Add(DR);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    foreach (SalesLine sl in s.salesLines)
                    {
                        try
                        {
                            DataRow DR_line = dt_Line.NewRow();
                            DR_line[0] = index;
                            DR_line[1] = sl.id;
                            DR_line[2] = sl.totalNetAmountWithTax;
                            DR_line[3] = sl.totalNetAmountWithoutTax == null ? "0" : sl.totalNetAmountWithoutTax;
                            DR_line[4] = sl.menuListPrice;
                            DR_line[5] = sl.unitCostPrice == null ? 0 : Convert.ToDecimal(sl.unitCostPrice);
                            DR_line[6] = sl.serviceCharge;
                            DR_line[7] = sl.discountAmount;
                            DR_line[8] = sl.taxAmount == null ? "0" : sl.taxAmount;
                            DR_line[9] = sl.accountDiscountAmount;
                            DR_line[10] = sl.totalDiscountAmount;
                            DR_line[11] = sl.sku;
                            DR_line[12] = sl.name;

                            bool validateJsonFormat = false;
                            try
                            {
                                var Data = JsonConvert.DeserializeObject<List<StaticGroup>>(sl.statisticGroup);
                                validateJsonFormat = true;
                            }
                            catch (Exception ex)
                            {
                                validateJsonFormat = false;
                            }

                            if (validateJsonFormat == false)
                            {
                                DR_line[13] = sl.statisticGroup;
                            }
                            else
                            {
                                var Data = JsonConvert.DeserializeObject<List<StaticGroup>>(sl.statisticGroup);
                                DR_line[13] = DR_line[13] = Data == null ? "" : string.Join(",", Data.Select(p => p.value).Distinct());
                            }
                            DR_line[14] = sl.quantity;
                            DR_line[15] = sl.taxRatePercentage;

                            DR_line[16] = sl.accountingGroup.accountingGroupId;
                            DR_line[17] = sl.accountingGroup.name;
                            DR_line[18] = sl.accountingGroup.code;
                            DR_line[19] = sl.currency;
                            DR_line[20] = String.Join(",", sl.tags);
                            DR_line[21] = sl.revenueCenter;
                            DR_line[22] = sl.revenueCenterId;
                            //DR_line[23] = null; categories.catagoty
                            //DR_line[24] = null //categories.value;
                            DR_line[25] = sl.timeOfSale;
                            DR_line[26] = sl.staffId;
                            DR_line[27] = sl.staffName;
                            DR_line[28] = sl.deviceId;
                            DR_line[29] = sl.deviceName;
                            DR_line[30] = sl.accountProfileCode;
                            if (sl.discountType != null || sl.accountDiscountType != null)
                            {
                                DR_line[31] = sl.discountType != null ? sl.discountType : sl.accountDiscountType;
                            }
                            if (sl.discountCode != null || sl.accountDiscountCode != null)
                            {
                                DR_line[32] = sl.discountCode != null ? sl.discountCode : sl.accountDiscountCode;
                            }
                            if (sl.discountName != null || sl.accountDiscountName != null)
                            {
                                DR_line[33] = sl.discountName != null ? sl.discountName : sl.accountDiscountName;
                            }

                            if (sl.parentLineId != null)
                                DR_line[34] = sl.parentLineId;

                            if (sl.voidReason != null)
                                DR_line[35] = sl.voidReason;




                            dt_Line.Rows.Add(DR_line);

                            EPOS_DATA Obj = new EPOS_DATA();
                            Obj.accountingGroupId = sl.accountingGroup.accountingGroupId;
                            Obj.AccountingGroup = sl.accountingGroup.name;
                            Obj.AG_CODE = sl.accountingGroup.code;
                            Obj.SKU = sl.sku;
                            Obj.NAME = sl.name;
                            Obj.Quantity = Convert.ToDecimal(sl.quantity);
                            Obj.Total_with_tax_Less_discounts = Convert.ToDecimal(sl.totalNetAmountWithTax);
                            Obj.Discounts = Convert.ToDecimal(sl.totalDiscountAmount);
                            Obj.Total_taxes = Convert.ToDecimal(sl.taxAmount);
                            Obj.Total_without_tax = Convert.ToDecimal(sl.totalNetAmountWithoutTax);
                            Obj.ServiceCharge = Convert.ToDecimal(sl.serviceCharge);
                            Obj.Time = Convert.ToDateTime(sl.timeOfSale);
                            Obj.SalesLineID = Convert.ToString(sl.id);
                            Obj.Account_FISC_ID = Convert.ToString(s.accountFiscId);
                            Obj.nbCovers = Convert.ToDecimal(s.nbCovers);
                            Obj.Type = s.type;
                            EPOS_DATA_LIST.Add(Obj);
                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }

                    }
                    try
                    {
                        if (s.payments != null)
                        {
                            foreach (Payment p in s.payments)
                            {

                                DataRow DR_Payment = dt_Payment.NewRow();
                                DR_Payment[0] = index;
                                DR_Payment[1] = p.code;
                                DR_Payment[2] = p.description;
                                DR_Payment[3] = p.paymentMethodId;
                                DR_Payment[4] = p.netAmountWithTax;
                                DR_Payment[5] = p.currency;
                                DR_Payment[6] = p.tip;
                                DR_Payment[7] = p.type;
                                DR_Payment[8] = p.deviceId;
                                DR_Payment[9] = p.deviceName;
                                DR_Payment[10] = p.staffId;
                                DR_Payment[11] = p.staffName;
                                DR_Payment[12] = p.revenueCenter;
                                DR_Payment[13] = p.revenueCenterId;
                                dt_Payment.Rows.Add(DR_Payment);

                                EPOS_PAYMENTS Obj = new EPOS_PAYMENTS();
                                Obj.Payment_method = (p.description == null || Convert.ToString(p.description) == "" || p.description == "null") ? "Total transitory" : p.description;
                                Obj.Type = p.type;
                                Obj.Amount = Convert.ToDecimal(p.netAmountWithTax);
                                EPOS_PAYMENTS_LIST.Add(Obj);

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    try
                    {
                        if (s.payments != null)
                        {
                            if (s.type == "TRANSITORY")
                            {
                                foreach (Payment p in s.payments)
                                {
                                    if (Convert.ToDecimal(p.netAmountWithTax) != 0)
                                    {
                                        EPOS_PAYMENTS Obj = new EPOS_PAYMENTS();
                                        Obj.Payment_method = "Total transitory";
                                        Obj.Type = p.type;
                                        Obj.Amount = Convert.ToDecimal(p.netAmountWithTax);
                                        EPOS_PAYMENTS_LIST.Add(Obj);
                                    }
                                }
                            }
                        }
                        index++;
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return 1;
        }

        int SubmitdataFromIkento(IList<EPOS_DATA> EPOS_DATA_LIST,
            IList<EPOS_PAYMENTS> EPOS_PAYMENTS_LIST,
            DataTable dt_Header, DataTable dt_Line, DataTable dt_Payment,
            decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID)
        {
            try
            {
                //IList<EPOS_DATA> EPOS_DATA_LIST = new List<EPOS_DATA>();
                //IList<EPOS_PAYMENTS> EPOS_PAYMENTS_LIST = new List<EPOS_PAYMENTS>();
                //DataSet TransactionDataSet = Create_DataTables();
                //DataTable dt_Header = TransactionDataSet.Tables[0];
                //DataTable dt_Line = TransactionDataSet.Tables[1];
                //DataTable dt_Payment = TransactionDataSet.Tables[2];
                int index = 0;
                //try
                //{
                //    foreach (Sale s in FinancialData.sales)
                //    {
                //        try
                //        {
                //            DataRow DR = dt_Header.NewRow();
                //            DR[0] = index;
                //            DR[1] = s.accountReference;
                //            DR[2] = s.accountFiscId;
                //            DR[3] = s.receiptId;
                //            DR[4] = s.source.initialAccountId;
                //            DR[5] = s.timeOfOpening;
                //            DR[6] = s.timeOfCloseAndPaid;
                //            DR[7] = s.tableName;
                //            DR[8] = s.accountProfileCode;
                //            DR[9] = s.ownerName;
                //            DR[10] = s.ownerId;
                //            DR[11] = s.type;
                //            DR[12] = s.nbCovers;
                //            DR[13] = s.dineIn;
                //            DR[14] = s.deviceId;
                //            DR[15] = s.deviceName;
                //            dt_Header.Rows.Add(DR);
                //        }
                //        catch (Exception ex)
                //        {
                //            throw ex;
                //        }
                //        foreach (SalesLine sl in s.salesLines)
                //        {
                //            try
                //            {
                //                DataRow DR_line = dt_Line.NewRow();
                //                DR_line[0] = index;
                //                DR_line[1] = sl.id;
                //                DR_line[2] = sl.totalNetAmountWithTax;
                //                DR_line[3] = sl.totalNetAmountWithoutTax == null ? "0" : sl.totalNetAmountWithoutTax;
                //                DR_line[4] = sl.menuListPrice;
                //                DR_line[5] = sl.unitCostPrice == null ? 0 : Convert.ToDecimal(sl.unitCostPrice);
                //                DR_line[6] = sl.serviceCharge;
                //                DR_line[7] = sl.discountAmount;
                //                DR_line[8] = sl.taxAmount == null ? "0" : sl.taxAmount;
                //                DR_line[9] = sl.accountDiscountAmount;
                //                DR_line[10] = sl.totalDiscountAmount;
                //                DR_line[11] = sl.sku;
                //                DR_line[12] = sl.name;

                //                bool validateJsonFormat = false;
                //                try
                //                {
                //                    var Data = JsonConvert.DeserializeObject<List<StaticGroup>>(sl.statisticGroup);
                //                    validateJsonFormat = true;
                //                }
                //                catch (Exception ex)
                //                {
                //                    validateJsonFormat = false;
                //                }

                //                if (validateJsonFormat == false)
                //                {
                //                    DR_line[13] = sl.statisticGroup;
                //                }
                //                else
                //                {
                //                    var Data = JsonConvert.DeserializeObject<List<StaticGroup>>(sl.statisticGroup);
                //                    DR_line[13] = DR_line[13] = Data == null ? "" : string.Join(",", Data.Select(p => p.value).Distinct());
                //                }
                //                DR_line[14] = sl.quantity;
                //                DR_line[15] = sl.taxRatePercentage;

                //                DR_line[16] = sl.accountingGroup.accountingGroupId;
                //                DR_line[17] = sl.accountingGroup.name;
                //                DR_line[18] = sl.accountingGroup.code;
                //                DR_line[19] = sl.currency;
                //                DR_line[20] = String.Join(",", sl.tags);
                //                DR_line[21] = sl.revenueCenter;
                //                DR_line[22] = sl.revenueCenterId;
                //                //DR_line[23] = null; categories.catagoty
                //                //DR_line[24] = null //categories.value;
                //                DR_line[25] = sl.timeOfSale;
                //                DR_line[26] = sl.staffId;
                //                DR_line[27] = sl.staffName;
                //                DR_line[28] = sl.deviceId;
                //                DR_line[29] = sl.deviceName;
                //                DR_line[30] = sl.accountProfileCode;
                //                if (sl.discountType != null || sl.accountDiscountType != null)
                //                {
                //                    DR_line[31] = sl.discountType != null ? sl.discountType : sl.accountDiscountType;
                //                }
                //                if (sl.discountCode != null || sl.accountDiscountCode != null)
                //                {
                //                    DR_line[32] = sl.discountCode != null ? sl.discountCode : sl.accountDiscountCode;
                //                }
                //                if (sl.discountName != null || sl.accountDiscountName != null)
                //                {
                //                    DR_line[33] = sl.discountName != null ? sl.discountName : sl.accountDiscountName;
                //                }

                //                if (sl.parentLineId != null)
                //                    DR_line[34] = sl.parentLineId;

                //                if (sl.voidReason != null)
                //                    DR_line[35] = sl.voidReason;




                //                dt_Line.Rows.Add(DR_line);

                //                EPOS_DATA Obj = new EPOS_DATA();
                //                Obj.accountingGroupId = sl.accountingGroup.accountingGroupId;
                //                Obj.AccountingGroup = sl.accountingGroup.name;
                //                Obj.AG_CODE = sl.accountingGroup.code;
                //                Obj.SKU = sl.sku;
                //                Obj.NAME = sl.name;
                //                Obj.Quantity = Convert.ToDecimal(sl.quantity);
                //                Obj.Total_with_tax_Less_discounts = Convert.ToDecimal(sl.totalNetAmountWithTax);
                //                Obj.Discounts = Convert.ToDecimal(sl.totalDiscountAmount);
                //                Obj.Total_taxes = Convert.ToDecimal(sl.taxAmount);
                //                Obj.Total_without_tax = Convert.ToDecimal(sl.totalNetAmountWithoutTax);
                //                Obj.ServiceCharge = Convert.ToDecimal(sl.serviceCharge);
                //                Obj.Time = Convert.ToDateTime(sl.timeOfSale);
                //                Obj.SalesLineID = Convert.ToString(sl.id);
                //                Obj.Account_FISC_ID = Convert.ToString(s.accountFiscId);
                //                Obj.nbCovers = Convert.ToDecimal(s.nbCovers);
                //                Obj.Type = s.type;
                //                EPOS_DATA_LIST.Add(Obj);
                //            }
                //            catch (Exception ex)
                //            {
                //                throw ex;
                //            }

                //        }
                //        try
                //        {
                //            if (s.payments != null)
                //            {
                //                foreach (Payment p in s.payments)
                //                {

                //                    DataRow DR_Payment = dt_Payment.NewRow();
                //                    DR_Payment[0] = index;
                //                    DR_Payment[1] = p.code;
                //                    DR_Payment[2] = p.description;
                //                    DR_Payment[3] = p.paymentMethodId;
                //                    DR_Payment[4] = p.netAmountWithTax;
                //                    DR_Payment[5] = p.currency;
                //                    DR_Payment[6] = p.tip;
                //                    DR_Payment[7] = p.type;
                //                    DR_Payment[8] = p.deviceId;
                //                    DR_Payment[9] = p.deviceName;
                //                    DR_Payment[10] = p.staffId;
                //                    DR_Payment[11] = p.staffName;
                //                    DR_Payment[12] = p.revenueCenter;
                //                    DR_Payment[13] = p.revenueCenterId;
                //                    dt_Payment.Rows.Add(DR_Payment);

                //                    EPOS_PAYMENTS Obj = new EPOS_PAYMENTS();
                //                    Obj.Payment_method = (p.description == null || Convert.ToString(p.description) == "" || p.description == "null") ? "Total transitory" : p.description;
                //                    Obj.Type = p.type;
                //                    Obj.Amount = Convert.ToDecimal(p.netAmountWithTax);
                //                    EPOS_PAYMENTS_LIST.Add(Obj);

                //                }
                //            }
                //        }
                //        catch (Exception ex)
                //        {
                //            throw ex;
                //        }
                //        try
                //        {
                //            if (s.payments != null)
                //            {
                //                if (s.type == "TRANSITORY")
                //                {
                //                    foreach (Payment p in s.payments)
                //                    {
                //                        if (Convert.ToDecimal(p.netAmountWithTax) != 0)
                //                        {
                //                            EPOS_PAYMENTS Obj = new EPOS_PAYMENTS();
                //                            Obj.Payment_method = "Total transitory";
                //                            Obj.Type = p.type;
                //                            Obj.Amount = Convert.ToDecimal(p.netAmountWithTax);
                //                            EPOS_PAYMENTS_LIST.Add(Obj);
                //                        }
                //                    }
                //                }
                //            }
                //            index++;
                //        }
                //        catch (Exception ex)
                //        {
                //            throw ex;
                //        }

                //    }
                //}
                //catch (Exception ex)
                //{
                //    throw ex;
                //}

                List<EPOS_DATA> result = EPOS_DATA_LIST
                          .GroupBy(l => l.accountingGroupId)
                          .SelectMany(cl => cl.Select(
                              csLine => new EPOS_DATA
                              {
                                  accountingGroupId = csLine.accountingGroupId,
                                  AccountingGroup = csLine.AccountingGroup,
                                  AG_CODE = csLine.AG_CODE,
                                  Quantity = cl.Sum(c => c.Quantity),
                                  Total_with_tax_Less_discounts = cl.Sum(c => c.Total_with_tax_Less_discounts),
                                  Discounts = cl.Sum(c => c.Discounts),
                                  Total_taxes = cl.Sum(c => c.Total_taxes),
                                  Total_without_tax = cl.Sum(c => c.Total_without_tax),
                                  ServiceCharge = cl.Sum(c => c.ServiceCharge)
                              })).Distinct().ToList<EPOS_DATA>().GroupBy(x => x.accountingGroupId)
                              .Select(grp => grp.First())
                              .ToList();
                List<EPOS_PAYMENTS> result_payment = EPOS_PAYMENTS_LIST
                    .GroupBy(l => l.Payment_method)
                    .SelectMany(cl => cl.Select(
                        csLine => new EPOS_PAYMENTS
                        {
                            Payment_method = csLine.Payment_method,
                            Type = csLine.Type,
                            Amount = cl.Sum(c => c.Amount)
                        })).Distinct().ToList<EPOS_PAYMENTS>().GroupBy(x => x.Payment_method)
                              .Select(grp => grp.First())
                              .ToList();

                DataTable dtx = ToDataTables(result);
                DataTable dty = ToDataTables(result_payment);
                result = result.GroupBy(l => l.percent)
                   .SelectMany(cl => cl.Select(
                         csLine => new EPOS_DATA
                         {
                             accountingGroupId = 010,
                             AccountingGroup = "Total",
                             AG_CODE = "T",
                             Quantity = cl.Sum(c => c.Quantity),
                             Total_with_tax_Less_discounts = cl.Sum(c => c.Total_with_tax_Less_discounts),
                             Discounts = cl.Sum(c => c.Discounts),
                             Total_taxes = cl.Sum(c => c.Total_taxes),
                             Total_without_tax = cl.Sum(c => c.Total_without_tax),
                             ServiceCharge = cl.Sum(c => c.ServiceCharge)
                         })).ToList<EPOS_DATA>().GroupBy(x => x.percent)
                             .Select(grp => grp.First())
                             .ToList(); ;
                result_payment = result_payment.GroupBy(l => l.Total)
                  .SelectMany(cl => cl.Select(
                        csLine => new EPOS_PAYMENTS
                        {
                            Payment_method = "X",
                            Type = "T",
                            Amount = cl.Sum(c => c.Amount)
                        })).ToList<EPOS_PAYMENTS>().GroupBy(x => x.Total)
                            .Select(grp => grp.First())
                            .ToList(); ;
                DataTable dt_total = ToDataTables(result);
                DataTable dt_total_payment = ToDataTables(result_payment);
                if (dtx.Rows.Count > 0)
                {
                    //EPOS_FILE_UPLOAD_HOMESTEAD(dtx, dty, dt_total, dt_total_payment, EPOS_DATA_LIST, CashupHeaderID, SessionID, INTEGRATION_SYSTEM_ID);
                    INS_UPD_LIGHTSPEED_HEADER(dt_Header, dt_Line, dt_Payment, CashupHeaderID, ENTITY_ID);
                    LogExceptions.LogInfo("END Time :" + DateTime.Now.ToLongTimeString() + ".CashupHeaderID=" + CashupHeaderID + " " + ".HEADERS=" + dt_Header.Rows.Count + ".LINES=" + dt_Line.Rows.Count + ".PAYMENTS=" + dt_Payment.Rows.Count);
                    if (SESSION_MASTER_ID == 4)
                    {
                        EPOS_SALES_HEADERS = dt_Header.Copy();
                        EPOS_SALES_LINES = dt_Line.Copy();
                        EPOS_SALES_PAYMENTS = dt_Payment.Copy();
                    }
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Saviung Data To DB - ", ex);
                //return 3;
                throw;
            }
        }
        DataTable ToDataTables<EPOS_DATA>(IList<EPOS_DATA> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(EPOS_DATA));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                table.Columns.Add(prp.Name, prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (EPOS_DATA item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
        DataSet Create_DataTables()
        {
            DataSet ds = new DataSet();

            #region HEADER
            DataTable HEADER = new DataTable();
            // Adding Columns    
            DataColumn COLUMN = new DataColumn();
            COLUMN.ColumnName = "INDEX";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTREFERENCE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTFISCID";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "RECEIPTID";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SOURCE_INITIALACCOUNTID";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIMEOFOPENING";
            COLUMN.DataType = typeof(DateTime);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIMEOFCLOSEANDPAID";
            COLUMN.DataType = typeof(DateTime);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TABLENAME";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTPROFILECODE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "OWNERNAME";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "OWNERID";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NBCOVERS";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DINEIN";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DEVICEID";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DEVICENAME";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            ds.Tables.Add(HEADER);
            #endregion

            #region LINE
            DataTable LINE = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "INDEX";
            COLUMN_LINE.DataType = typeof(int);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "LIGHTSPEED_LINES_ID";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TOTALNETAMOUNTWITHTAX";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TOTALNETAMOUNTWITHOUTTAX";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "MENULISTPRICE";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "UNITCOSTPRICE";
            COLUMN_LINE.DataType = typeof(decimal);
            COLUMN_LINE.AllowDBNull = true;
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SERVICECHARGE";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "DISCOUNTAMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TAXAMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTDISCOUNTAMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TOTALDISCOUNTAMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SKU";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "NAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "STATISTICGROUP";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "QUANTITY";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TAXRATEPERCENTAGE";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTINGGROUP_ACCOUNTINGGROUPID";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTINGGROUP_NAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTINGGROUP_CODE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "CURRENCY";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TAGS";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "REVENUECENTER";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "REVENUECENTERID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "CATEGORIES_CATEGORY";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "CATEGORIES_VALUE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TIMEOFSALE";
            COLUMN_LINE.DataType = typeof(DateTime);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "STAFFID";
            COLUMN_LINE.DataType = typeof(int);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "STAFFNAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "DEVICEID";
            COLUMN_LINE.DataType = typeof(int);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "DEVICENAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTPROFILECODE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTDISCOUNTTYPE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTDISCOUNTCODE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ACCOUNTDISCOUNTNAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PARENT_LINE_ID";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "VOID_REASON";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);
            ds.Tables.Add(LINE);
            #endregion

            #region PAYMENT

            DataTable PAYMENT = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "INDEX";
            COLUMN_PAYMENT.DataType = typeof(int);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "CODE";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "DESCRIPTION";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "PAYMENTMETHODID";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "NETAMOUNTWITHTAX";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "CURRENCY";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "TIP";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "TYPE";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "DEVICEID";
            COLUMN_PAYMENT.DataType = typeof(int);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "DEVICENAME";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "STAFFID";
            COLUMN_PAYMENT.DataType = typeof(int);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "STAFFNAME";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "REVENUECENTER";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "REVENUECENTERID";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            ds.Tables.Add(PAYMENT);
            #endregion

            return ds;
        }
        DataSet EPOS_FILE_UPLOAD_HOMESTEAD(DataTable DECLARATION_DETAILS, DataTable PAYMENTS, DataTable dtTOTAL, DataTable dt_total_payment, IList<EPOS_DATA> EPOS_DATA_LIST, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID)
        {
            #region datatables

            DataTable DECLARATION_DETAIL = new DataTable();

            // Adding Columns    
            DataColumn COLUMN = new DataColumn();
            COLUMN.ColumnName = "PRODUCT_NAME";
            COLUMN.DataType = typeof(string);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "UNITS";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GROSS";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DISC_CPN";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "VAT_TAX";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NET";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL_PER";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GROSS_LESS_DISCOUNT";
            COLUMN.DataType = typeof(decimal);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PRODUCT_CODE";
            COLUMN.DataType = typeof(string);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNT_GROUP_ID";
            COLUMN.DataType = typeof(string);
            DECLARATION_DETAIL.Columns.Add(COLUMN);

            DataTable MEDIA_DETAIL = new DataTable();

            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "MEDIA";
            COLUMN.DataType = typeof(string);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COUNT";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SALES_AMT";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HS_TIPS";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "EMP_TIPS";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "EMP_GRATS";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL_SALES";
            COLUMN.DataType = typeof(decimal);
            MEDIA_DETAIL.Columns.Add(COLUMN);

            DataTable EPOS_DISCOUNTS_TYPE = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DISCOUNT";
            COLUMN.DataType = typeof(string);
            EPOS_DISCOUNTS_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COUNT";
            COLUMN.DataType = typeof(decimal);
            EPOS_DISCOUNTS_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            EPOS_DISCOUNTS_TYPE.Columns.Add(COLUMN);

            DataTable EPOS_TAXES_TYPE = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TAX_DESCRIPTION";
            COLUMN.DataType = typeof(string);
            EPOS_TAXES_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SALES";
            COLUMN.DataType = typeof(decimal);
            EPOS_TAXES_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TAX";
            COLUMN.DataType = typeof(decimal);
            EPOS_TAXES_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "EXEMPT";
            COLUMN.DataType = typeof(decimal);
            EPOS_TAXES_TYPE.Columns.Add(COLUMN);


            DataTable EPOS_SERVING_PERIOD_TYPE = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SERVING_PERIOD";
            COLUMN.DataType = typeof(string);
            EPOS_SERVING_PERIOD_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CUST_COUNT";
            COLUMN.DataType = typeof(decimal);
            EPOS_SERVING_PERIOD_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL";
            COLUMN.DataType = typeof(decimal);
            EPOS_SERVING_PERIOD_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AVG_CHECK";
            COLUMN.DataType = typeof(decimal);
            EPOS_SERVING_PERIOD_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AVG_CUST";
            COLUMN.DataType = typeof(decimal);
            EPOS_SERVING_PERIOD_TYPE.Columns.Add(COLUMN);


            DataTable INTEGRATION_DATA_TYPE = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "INTEGRATION_SYSTEMS_ID";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTING_GROUP_ID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTING_GROUP";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AG_CODE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SALES_LINE_ID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SKU";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NAME";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "QUANTITY";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL_WITH_TAX_LESS_DISCOUNTS";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DISCOUNTS";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL_TAXES";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL_WITHOUT_TAX";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIME";
            COLUMN.DataType = typeof(DateTime);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TRANSACTION_ID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NB_COVERS";
            COLUMN.DataType = typeof(decimal);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_CASHIER";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_CLOSETIME";
            COLUMN.DataType = typeof(DateTime);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DEPARTMENTCODE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHDISCOUNTSUMINT_HEAD";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHRETURNSUM_HEAD";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_OPENDATETYPED";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_ORDERNUM";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_ORDERTYPE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_SESSIONNUM";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_STORNED";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_UNIQORDERIDID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHSUMINT_HEAD";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_TABLENUM";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_OPENTIME";
            COLUMN.DataType = typeof(DateTime);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYACTUALTIME";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYPHONE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYCUSTOMERNAME";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYADDRESS";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYCOURIER";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_PAYTYPES";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_STORNED_PMT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYISDELIVERY";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DELIVERYSERVICETYPE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHDISCOUNTSUMINT_PMT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHRETURNSUM_PMT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISCOUNTSUM_PMT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHSUMINT_PMT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_VATSUM";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_STORNED_LINE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHGROUP";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHNAME";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHSIZENAME";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_ORDERITEMS";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_SOLDWITHDISHID";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_ORDERDISCOUNTTYPE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHSUMINT_LINE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISCOUNTSUM_LINE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHRETURNSUM_LINE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHDISCOUNTSUMINT_LINE";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "IIKO_DISHAMOUNTINT";
            COLUMN.DataType = typeof(string);
            INTEGRATION_DATA_TYPE.Columns.Add(COLUMN);

            #endregion

            IList<decimal> Cashup_Epos_Header = new List<decimal>();
            foreach (EPOS_DATA ed in EPOS_DATA_LIST)
            {
                DataRow DR = INTEGRATION_DATA_TYPE.NewRow();
                DR[0] = INTEGRATION_SYSTEM_ID;
                DR[1] = ed.accountingGroupId;
                DR[2] = ed.AccountingGroup;
                DR[3] = ed.AG_CODE;
                DR[4] = ed.SalesLineID;
                DR[5] = ed.SKU;
                DR[6] = ed.NAME;
                DR[7] = ed.Quantity;
                DR[8] = ed.Total_with_tax_Less_discounts;
                DR[9] = ed.Discounts;
                DR[10] = ed.Total_taxes;
                DR[11] = ed.Total_without_tax;
                DR[12] = ed.Time;
                DR[13] = ed.Account_FISC_ID;
                DR[14] = ed.nbCovers;
                DR[15] = ed.Type;
                INTEGRATION_DATA_TYPE.Rows.Add(DR);
            }
            foreach (DataRow dr in DECLARATION_DETAILS.Rows)
            {
                DataRow DR = DECLARATION_DETAIL.NewRow();
                DR[0] = Convert.ToString(dr["AccountingGroup"]);
                DR[1] = Convert.ToString(dr["Quantity"]) == "" ? 0 : Convert.ToDecimal(dr["Quantity"]);
                DR[2] = Convert.ToString(dr["Total_with_tax_Less_discounts"]) == "" ? 0 : Convert.ToDecimal(dr["Total_with_tax_Less_discounts"]);// - (Convert.ToString(dr["Service charge 12.5%"]) == "" ? 0 : Convert.ToDecimal(dr["Service charge 12.5%"]));
                DR[3] = Convert.ToString(dr["Discounts"]) == "" ? 0 : Convert.ToDecimal(dr["Discounts"]);
                DR[4] = Convert.ToString(dr["Total_taxes"]) == "" ? 0 : Convert.ToDecimal(dr["Total_taxes"]);
                DR[5] = Convert.ToString(dr["Total_without_tax"]) == "" ? 0 : Convert.ToDecimal(dr["Total_without_tax"]);
                DR[6] = 0;
                DR[7] = Convert.ToString(dr["Total"]) == "" ? 0 : Convert.ToDecimal(dr["Total"]);
                DR[8] = Convert.ToString(dr["AG_CODE"]).Trim() == "0" || Convert.ToString(dr["AG_CODE"]).Trim() == "" || Convert.ToString(dr["AG_CODE"]) == DBNull.Value.ToString() ? "" : Convert.ToString(dr["AG_CODE"]);
                DR[9] = Convert.ToString(dr["accountingGroupId"]) == "" ? "0" : Convert.ToString(dr["accountingGroupId"]);

                DECLARATION_DETAIL.Rows.Add(DR);
            }
            foreach (DataRow dr in PAYMENTS.Rows)
            {
                if (Convert.ToString(dr["Payment_method"]) != "")
                {
                    DataRow DR = MEDIA_DETAIL.NewRow();
                    DR[0] = Convert.ToString(dr["Payment_method"]);
                    DR[6] = Convert.ToDecimal(dr["Amount"]);
                    MEDIA_DETAIL.Rows.Add(DR);
                }
            }

            Cashup_Epos_Header.Add(Convert.ToDecimal(dtTOTAL.Rows[0]["Total_with_tax_Less_discounts"]));
            Cashup_Epos_Header.Add(Convert.ToDecimal(dtTOTAL.Rows[0]["ServiceCharge"]));
            Cashup_Epos_Header.Add(Convert.ToDecimal(dtTOTAL.Rows[0]["Discounts"]));
            Cashup_Epos_Header.Add(Convert.ToDecimal(dt_total_payment.Rows[0]["Amount"]));
            Cashup_Epos_Header.Add(Convert.ToDecimal(dtTOTAL.Rows[0]["Total_taxes"]));

            CashupModel CashupModelObj = new CashupModel();
            CashupModelObj.USER_ID = 1;
            CashupModelObj.Cashup_Epos_Header = Cashup_Epos_Header;
            CashupModelObj.CASHUP_HEADER_ID = CashupHeaderID.ToString();
            CashupModelObj.SESSION_ID = SessionID;
            CashupModelObj.COMP_DECLARATION = MEDIA_DETAIL;
            CashupModelObj.DECLARATION_DETAILS = DECLARATION_DETAIL;
            CashupModelObj.EPOS_DISCOUNTS_TYPE = EPOS_DISCOUNTS_TYPE;
            CashupModelObj.EPOS_TAXES_TYPE = EPOS_TAXES_TYPE;
            CashupModelObj.EPOS_SERVING_PERIOD_TYPE = EPOS_SERVING_PERIOD_TYPE;
            CashupModelObj.INTEGRATION_DATA_TYPE = INTEGRATION_DATA_TYPE;
            CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(INTEGRATION_SYSTEM_ID);
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = CashupModelObj;
            return _ICashUp.EPOS_FILE_UPLOAD_HOMESTEAD();
        }
        DataSet INS_UPD_LIGHTSPEED_HEADER(DataTable DT_HEADER, DataTable DT_LINES, DataTable DT_PAYMENT, decimal CashupHeaderID, decimal ENTITY_ID)
        {
            try
            {
                LogExceptions.LogInfo("Start Time :" + DateTime.Now.ToLongTimeString() + ".CashupHeaderID=" + CashupHeaderID + " " + ".HEADERS=" + DT_HEADER.Rows.Count + ".LINES=" + DT_LINES.Rows.Count + ".PAYMENTS=" + DT_PAYMENT.Rows.Count);
                Cashup _ICashUp = new Cashup();
                _ICashUp.CashupModelObj = new CashupModel();
                _ICashUp.CashupModelObj.CASHUP_HEADER_ID = CashupHeaderID.ToString();
                _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                _ICashUp.CashupModelObj.DT_HEADER = DT_HEADER;
                _ICashUp.CashupModelObj.DT_LINES = DT_LINES;
                _ICashUp.CashupModelObj.DT_PAYMENT = DT_PAYMENT;
                return _ICashUp.INS_UPD_LIGHTSPEED_HEADER();
            }
            catch (System.Data.SqlClient.SqlException sqlEx)
            {
                LogExceptions.LogError("INS_UPD_LIGHTSPEED_HEADER, SQL EXCEPTION." + "CashupHeaderID=" + CashupHeaderID + " " + ".HEADERS=" + DT_HEADER.Rows.Count + ".LINES=" + DT_LINES.Rows.Count + ".PAYMENTS=" + DT_PAYMENT.Rows.Count, sqlEx);
                throw;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("INS_UPD_LIGHTSPEED_HEADER,Generic exception." + "CashupHeaderID=" + CashupHeaderID + " " + ".HEADERS=" + DT_HEADER.Rows.Count + ".LINES=" + DT_LINES.Rows.Count + ".PAYMENTS=" + DT_PAYMENT.Rows.Count, ex);
                throw;
            }
        }

        ///Not In Use
        Root FetchDailyFinancialData(string date)
        {
            try
            {
                //  date = "2021-01-03";
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                string URL = MainIkentooURL + "dailyFinancials?" + AccessToken + "&date=" + date + "&includeConsumers=false&include=payments";

                var client = new WebClient();
                client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                var response = client.DownloadString(URL);
                JObject objects = JObject.Parse(response);
                Root DailyFinancialData = JsonConvert.DeserializeObject<Root>(response);
                return DailyFinancialData;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
    public class StaticGroup
    {
        public string category { get; set; }
        public string value { get; set; }
    }
}




