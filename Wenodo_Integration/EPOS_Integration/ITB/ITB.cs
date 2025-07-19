using System;
using App_Repository;
using EPOS_Integration.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;
namespace EPOS_Integration.ITB
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
        public static int COUNT = 0;
    }
    public class ITB
    {
        string ITB_URL = string.Empty;
        string AccessToken = string.Empty;

        DataTable GlobleDatatable = new DataTable();
        DataTable DATATABLE_ITB_SALES_HEADER_FIELDS()
        {
            DataTable DATATABLE_ITB_SALES_HEADER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRIMARY_KEY", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROW_ID", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_ID", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_NO", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TRANSACTION_DATE", typeof(DateTime)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN_TIME", typeof(DateTime)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSE_TIME", typeof(DateTime)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STORE_NO", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STORE_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERVER_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORIG_PRICE", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SELL_PRICE", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEVEL_1_CAT_ID", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEVEL_1_CAT", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEVEL_2_CAT_ID", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEVEL_2_CAT", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPT_NO", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPT_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HH", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PROMO_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PROMO_AMT", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PROMO_BY_NO", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PROMO_BY_NAME", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SETTLED", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VOIDED", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VOID_REASON", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_STAMP", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE_STAMP", typeof(string)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERVICE_CHARGE", typeof(decimal)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COMBO", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COMBO_ID", typeof(int)); DATATABLE_ITB_SALES_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_ITB_SALES_HEADER_TYPE;
        }
        DataTable DATATABLE_ITB_PAYMENTS_DATA()
        {
            DataTable DATATABLE_ITB_PAYMENTS_DATA_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("CHECK_ID", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_BY_TENO", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TRANSACTION_DATE", typeof(DateTime)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STORE_NO", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPT_NO", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEPT_NAME", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMP_NUMBER", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIRST_NAME", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAY_ID", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAY_TYPE", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("X_REF", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_NAME", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIP_AMT", typeof(decimal)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAY_AMT", typeof(decimal)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COVERS", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POSTED", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REFERENCE", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AUTH_NO", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EXPIRY_DATE", typeof(DateTime)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("F_COVERS", typeof(int)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CARD_NO", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FREQ_DINER", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_DATE", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TIME", typeof(string)); DATATABLE_ITB_PAYMENTS_DATA_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_ITB_PAYMENTS_DATA_TYPE;
        }

        public void SaveITBDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            GlobleDatatable = dt_IntegrationDetails;
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.USER_ID = 1;
                //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                foreach (DataRow dr_session in dt_Session.Rows)
                {
                    if (Convert.ToInt32(dr_session["SESSION_MASTER_ID"]) == 4)
                    {
                        Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                        string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                        // string Cashup_date = "2022-02-15";
                        string[] SessionStarttimelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                        int start_hr = Convert.ToInt32(SessionStarttimelist[0]);
                        string[] SessionEndtimelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                        int end_hr = Convert.ToInt32(SessionEndtimelist[0]);
                        int variance = start_hr - end_hr;
                        DateTime Cashup_date_new = DateTime.Now;

                        Cashup_date_new = Convert.ToDateTime(Cashup_date);
                        string Cashup_end = Cashup_date_new.ToString("yyyy-MM-dd");
                        //string Cashup_end = "2022-02-16";
                        string Cashup_end_date = "";
                        string Cashup_start_date = "";
                        int INTEGRATION_STATUS = 0;

                        DataView dv = GlobleDatatable.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                        DataTable dtIntegrationData = dv.ToTable();
                        DataSet ITB_DATA_DATASET = null;

                        //year/month/day/hours/minute/secord
                        string[] newtime = Cashup_date.Split('-');
                        DateTime Startdate = new DateTime(Convert.ToInt32(newtime[0]), Convert.ToInt32(newtime[1]), Convert.ToInt32(newtime[2]), Convert.ToInt32(0), Convert.ToInt32(0), Convert.ToInt32(0));
                        bool value = Startdate.IsDaylightSavingTime();
                        if (value)
                        {
                            if (SessionStarttimelist[0] == "00")
                            {
                                Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]);
                                Cashup_start_date = Convert.ToDateTime(Cashup_start_date).AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss");
                            }
                            else
                            {
                                string a = (Convert.ToInt32(SessionStarttimelist[0]) - 1).ToString();
                                string time = Convert.ToString(a + ':' + SessionStarttimelist[1] + ':' + SessionStarttimelist[2]);
                                Cashup_start_date = Cashup_date + "T" + time;
                            }
                            //-1 in session
                        }
                        else
                        {
                            Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]);
                        }

                        //Cashup_start_date = Cashup_date + "T" + "+00:00"; 
                        Cashup_start_date = Cashup_date;
                        string[] CashupEndnewtime = Cashup_end.Split('-');
                        DateTime EndDatedate = new DateTime(Convert.ToInt32(CashupEndnewtime[0]), Convert.ToInt32(CashupEndnewtime[1]), Convert.ToInt32(CashupEndnewtime[2]), Convert.ToInt32(0), Convert.ToInt32(0), Convert.ToInt32(0));
                        bool value1 = EndDatedate.IsDaylightSavingTime();
                        if (value1)
                        {
                            //Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);
                            string a = (Convert.ToInt32(SessionEndtimelist[0]) - 1).ToString();
                            string time1 = Convert.ToString(a + ':' + SessionEndtimelist[1] + ':' + SessionEndtimelist[2]);
                            Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + time1;
                            //  Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(Convert.ToInt32(SessionEndtimelist[0]) - 1 + ':' + SessionEndtimelist[1] + ':' + SessionEndtimelist[2]);
                            //-1 in session
                        }
                        else
                        {
                            Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + "+00:00";
                            //Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";    
                        }
                        Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd");
                        #region FetchSalesDataByDate
                        try
                        {
                            ITB_DATA_DATASET = FetchSalesDataByDate(Cashup_start_date, Cashup_end_date, dtIntegrationData, dt_IntegrationDetails, dr);
                            if (ITB_DATA_DATASET.Tables[0].Rows.Count > 0)
                            {
                                //&& RequestConstants.COUNT <= 3
                                if (ITB_DATA_DATASET.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST")
                                {
                                    RequestConstants.COUNT++;
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 0;
                                    Obj.CashupModelObj.ERROR_MESSAGE = ITB_DATA_DATASET.Tables[0].Rows[0][0].ToString();
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    // EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                                    // Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 0);
                                }
                                //if (RequestConstants.COUNT > 3)
                                //{
                                //    RequestConstants.COUNT = 0;
                                //}
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB -  ITB Series - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }

                        if (ITB_DATA_DATASET != null)
                        {
                            if (ITB_DATA_DATASET.Tables.Count > 0)
                            {
                                //DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFromITB(ITB_DATA_DATASET, Convert.ToDecimal(dr["ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(dr["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                                //INTEGRATION_STATUS = SubmitdataFromITB(ITB_DATA_DATASET, Convert.ToDecimal(dr["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]));
                            }
                            else
                            {
                                INTEGRATION_STATUS = 4;
                            }

                            Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                            Obj.CashupModelObj.ERROR_MESSAGE = "";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        //else
                        //{
                        //    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        //    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        //}
                        #endregion FetchSalesDataByDate
                    }
                    //      FetchDailyFinancialData(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd"));
                }
            }
        }
        DataSet FetchSalesDataByDate(string Start_date, string End_date, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet DS_SALES = new DataSet();
                DataTable DATATABLE_ITB_SALES_HEADER_TYPE = DATATABLE_ITB_SALES_HEADER_FIELDS();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                int AMOUNT = 100;
                int OFFSET = 0;
                bool IS_VALID = true;
                IList<ROOT_SALES_DATA_HEADER> obj = new List<ROOT_SALES_DATA_HEADER>();

                var JsonResult = JsonUrlReturn_fy(Start_date, End_date, URL, dtIntegrationData, dt, AMOUNT, OFFSET, dr);
                ROOT_SALES_DATA_HEADER root_LSeriesobj = JsonConvert.DeserializeObject<ROOT_SALES_DATA_HEADER>(JsonResult.ToString());
                IS_VALID = true;
                obj.Add(root_LSeriesobj);
                if (IS_VALID)
                {
                    foreach (var HEADER in obj)
                    {
                        foreach (var LS_HEADER in HEADER.EventList)
                        {
                            DataRow DR_HEADER = DATATABLE_ITB_SALES_HEADER_TYPE.NewRow();
                            DR_HEADER["PRIMARY_KEY"] = LS_HEADER.Primary_Key;
                            DR_HEADER["ROW_ID"] = LS_HEADER.Row_ID;
                            DR_HEADER["CHECK_ID"] = LS_HEADER.CheckID;
                            DR_HEADER["CHECK_NO"] = LS_HEADER.CheckNo;
                            DR_HEADER["TRANSACTION_DATE"] = LS_HEADER.TransactionDate;
                            DR_HEADER["OPEN_TIME"] = LS_HEADER.OpenTime;
                            DR_HEADER["CLOSE_TIME"] = LS_HEADER.CloseTime;
                            DR_HEADER["STORE_NO"] = LS_HEADER.StoreNo;
                            DR_HEADER["STORE_NAME"] = LS_HEADER.StoreName;
                            DR_HEADER["TABLE_NAME"] = LS_HEADER.TableName;
                            DR_HEADER["SERVER_NAME"] = LS_HEADER.ServerName;
                            DR_HEADER["PLU"] = LS_HEADER.PLU;
                            DR_HEADER["ITEM_NAME"] = LS_HEADER.ItemName;
                            DR_HEADER["QUANTITY"] = LS_HEADER.Quantity;
                            DR_HEADER["ORIG_PRICE"] = LS_HEADER.OrigPrice;
                            DR_HEADER["SELL_PRICE"] = LS_HEADER.SellPrice;
                            DR_HEADER["LEVEL_1_CAT_ID"] = LS_HEADER.Level1CatID;
                            DR_HEADER["LEVEL_1_CAT"] = LS_HEADER.Level1Cat;
                            DR_HEADER["LEVEL_2_CAT_ID"] = LS_HEADER.Level2CatID;
                            DR_HEADER["LEVEL_2_CAT"] = LS_HEADER.Level2Cat;
                            DR_HEADER["DEPT_NO"] = LS_HEADER.DeptNo;
                            DR_HEADER["DEPT_NAME"] = LS_HEADER.DeptName;
                            DR_HEADER["HH"] = LS_HEADER.HH;
                            DR_HEADER["PROMO_NAME"] = LS_HEADER.PromoName;
                            DR_HEADER["PROMO_AMT"] = LS_HEADER.PromoAmt;
                            DR_HEADER["PROMO_BY_NO"] = LS_HEADER.PromoByNo;
                            DR_HEADER["PROMO_BY_NAME"] = LS_HEADER.PromoByName;
                            DR_HEADER["SETTLED"] = LS_HEADER.Settled;
                            DR_HEADER["VOIDED"] = LS_HEADER.voided;
                            DR_HEADER["VOID_REASON"] = LS_HEADER.voidReason;
                            DR_HEADER["TIME_STAMP"] = LS_HEADER.TimeStamp;
                            DR_HEADER["DATE_STAMP"] = LS_HEADER.DateStamp;
                            DR_HEADER["TAX"] = LS_HEADER.Tax;
                            DR_HEADER["SERVICE_CHARGE"] = LS_HEADER.ServiceCharge;
                            DR_HEADER["IS_COMBO"] = LS_HEADER.IsCombo;
                            DR_HEADER["COMBO_ID"] = LS_HEADER.ComboID;
                            DATATABLE_ITB_SALES_HEADER_TYPE.Rows.Add(DR_HEADER);
                        }
                    }

                    DS_SALES.Tables.Add(DATATABLE_ITB_SALES_HEADER_TYPE);
                    DataTable ITB_PAYMENT_DATA = FetchPaymentDataByDate(Start_date, End_date, dtIntegrationData, dt, dr);
                    DS_SALES.Tables.Add(ITB_PAYMENT_DATA);

                }
                else
                {
                    DataTable BAD_REQUEST = new DataTable();
                    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    DataRow rows = BAD_REQUEST.NewRow();
                    rows["BAD_REQUEST"] = "BAD_REQUEST";
                    BAD_REQUEST.Rows.Add(rows);
                    DS_SALES.Tables.Add(BAD_REQUEST);
                }
                return DS_SALES;
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (400) Bad Request.")
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed L Series - ", ex);
                    DataTable BAD_REQUEST = new DataTable();
                    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    DataSet ERROR_RECEIPT = new DataSet();
                    DataRow rows = BAD_REQUEST.NewRow();
                    rows["BAD_REQUEST"] = "BAD_REQUEST";
                    BAD_REQUEST.Rows.Add(rows);
                    ERROR_RECEIPT.Tables.Add(BAD_REQUEST);

                    //Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    //Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();

                    return ERROR_RECEIPT;
                }
                else
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed L Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }
        }
        DataTable FetchPaymentDataByDate(string Start_date, string End_date, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataTable DATATABLE_ITB_PAYMENTS_DATA_TYPE = DATATABLE_ITB_PAYMENTS_DATA();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                string URL = "https://biapp.itb-me.com:8451/StagingData/GetPaymentsData";

                int AMOUNT = 100;
                int OFFSET = 0;
                bool IS_VALID = true;
                IList<ROOT_PAYMENT_DATA_LIST> obj = new List<ROOT_PAYMENT_DATA_LIST>();
                //for (int i = 0; i < 100000; i++)
                // {
                ROOT_PAYMENT_DATA_LIST Paymentobj = new ROOT_PAYMENT_DATA_LIST();
                //  OFFSET = i * AMOUNT;
                var JsonResult = JsonUrlReturn_fy(Start_date, End_date, URL, dtIntegrationData, dt, AMOUNT, OFFSET, dr);
                ROOT_PAYMENT_DATA_LIST root_LSeriesobj = JsonConvert.DeserializeObject<ROOT_PAYMENT_DATA_LIST>(JsonResult.ToString());
                IS_VALID = true;
                obj.Add(root_LSeriesobj);
                //if (root_LSeriesobj.code == "bad_request")
                //{
                //    IS_VALID = false;
                //    break;
                //}
                //else
                //{
                //    
                //    if (root_LSeriesobj.results.Count < AMOUNT)
                //    {
                //        break;
                //    }
                //}
                // }
                if (IS_VALID)
                {
                    foreach (var HEADER in obj)
                    {
                        foreach (var LS_HEADER in HEADER.EventList)
                        {
                            DataRow DR_HEADER = DATATABLE_ITB_PAYMENTS_DATA_TYPE.NewRow();
                            DR_HEADER["CHECK_ID"] = LS_HEADER.CheckID;
                            DR_HEADER["CHECK_BY_TENO"] = LS_HEADER.CheckByteNo;
                            DR_HEADER["TRANSACTION_DATE"] = LS_HEADER.TransactionDate;
                            DR_HEADER["STORE_NO"] = LS_HEADER.StoreNo;
                            DR_HEADER["DEPT_NO"] = LS_HEADER.DeptNo;
                            DR_HEADER["DEPT_NAME"] = LS_HEADER.DeptName;
                            DR_HEADER["EMP_NUMBER"] = LS_HEADER.EmpNumber;
                            DR_HEADER["FIRST_NAME"] = LS_HEADER.FirstName;
                            DR_HEADER["PAY_ID"] = LS_HEADER.PayID;
                            DR_HEADER["PAY_TYPE"] = LS_HEADER.PayType;
                            DR_HEADER["X_REF"] = LS_HEADER.Xref;
                            DR_HEADER["PAYMENT_NAME"] = LS_HEADER.PaymentName;
                            DR_HEADER["TIP_AMT"] = LS_HEADER.TipAmt;
                            DR_HEADER["PAY_AMT"] = LS_HEADER.PayAmt;
                            DR_HEADER["COVERS"] = LS_HEADER.Covers;
                            DR_HEADER["POSTED"] = LS_HEADER.Posted;
                            DR_HEADER["REFERENCE"] = LS_HEADER.Reference;
                            DR_HEADER["AUTH_NO"] = LS_HEADER.AuthNo;

                            if (LS_HEADER.ExpiryDate.ToString() == "1/1/0001 12:00:00 AM")
                            {
                                DR_HEADER["EXPIRY_DATE"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["EXPIRY_DATE"] = LS_HEADER.ExpiryDate;
                            }
                            DR_HEADER["F_COVERS"] = LS_HEADER.FCovers;
                            DR_HEADER["CARD_NO"] = LS_HEADER.CardNo;
                            DR_HEADER["FREQ_DINER"] = LS_HEADER.FreqDiner;
                            DR_HEADER["PAYMENT_DATE"] = LS_HEADER.PaymentDate;
                            DR_HEADER["PAYMENT_TIME"] = LS_HEADER.paymentTime;

                            //if (LS_HEADER.closingDate.ToString() == "1/1/1970 12:00:00 AM")
                            //{
                            //    DR_HEADER["CLOSING_DATE"] = DBNull.Value;
                            //}
                            //else
                            //{
                            //    DR_HEADER["CLOSING_DATE"] = LS_HEADER.closingDate;
                            //}
                            //if (LS_HEADER.deliveryDate.ToString() == "1/1/0001 12:00:00 AM")
                            //{
                            //    DR_HEADER["DELIVERY_DATE"] = DBNull.Value;
                            //}
                            //else
                            //{
                            //    DR_HEADER["DELIVERY_DATE"] = LS_HEADER.deliveryDate;
                            //}
                            //if (LS_HEADER.printDate.ToString() == "1/1/1970 12:00:00 AM")
                            //{
                            //    DR_HEADER["PRINT_DATE"] = DBNull.Value;
                            //}
                            //else
                            //{
                            //    DR_HEADER["PRINT_DATE"] = LS_HEADER.printDate;
                            //}

                            DATATABLE_ITB_PAYMENTS_DATA_TYPE.Rows.Add(DR_HEADER);

                        }
                    }
                }
                else
                {
                    //DataTable BAD_REQUEST = new DataTable();
                    //DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    //DataRow rows = BAD_REQUEST.NewRow();
                    //rows["BAD_REQUEST"] = "BAD_REQUEST";
                    //BAD_REQUEST.Rows.Add(rows);
                    //DS_SALES.Tables.Add(BAD_REQUEST);
                }
                return DATATABLE_ITB_PAYMENTS_DATA_TYPE;
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (400) Bad Request.")
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed L Series - ", ex);
                    DataTable BAD_REQUEST = new DataTable();
                    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    //DataSet ERROR_RECEIPT = new DataSet();
                    DataRow rows = BAD_REQUEST.NewRow();
                    rows["BAD_REQUEST"] = "BAD_REQUEST";
                    BAD_REQUEST.Rows.Add(rows);
                    //ERROR_RECEIPT.Tables.Add(BAD_REQUEST);
                    //Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    //Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return BAD_REQUEST;
                }
                else
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed L Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }
        }
        int SubmitdataFromITB(DataSet ITB_DATA, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BRANCH_ID)
        {

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database
                if (ITB_DATA.Tables.Count > 0 && ITB_DATA.Tables[0].Rows.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.ITB_SALES_HEADER = ITB_DATA.Tables[0];
                    _ICashUp.CashupModelObj.ITB_PAYMENTS_DATA = ITB_DATA.Tables[1];
                    _ICashUp.INS_UPD_ITB_CASHUP_DATA();
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" ITB Series:- Fail To Saving Data in DB - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }
        string JsonUrlReturn_fy(string Start_date, string end_date, string URL, DataTable dtIntegrationData, DataTable dt, int amount, int offset, DataRow dr)
        {
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            Cashup ObjNew = new Cashup();
            ObjNew.CashupModelObj = new CashupModel();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            obj.Add("OrganizationID", "0");
            obj.Add("Token", AccessToken);
            obj.Add("StartDate", Start_date);
            obj.Add("EndDate", end_date);
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - ITB Series - ", ex);
                    string LSERIESURL = ConfigurationManager.AppSettings["LightSpeedLSeriesTokenPath"].ToString();
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("date", Start_date);
                    obj1.Add("from", Start_date);
                    obj1.Add("to", end_date);
                    obj1.Add("amount", amount.ToString());
                    obj1.Add("offset", offset.ToString());
                    obj1.Add("useModification", "true");
                    // JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, obj1, URL, 1, dt, dr);
                }
                else
                {
                    //ObjNew.CashupModelObj.INTEGRATION_STATUS = 3;
                    //ObjNew.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //ObjNew.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                }
            }
            return JsonResult;
        }
    }
}
