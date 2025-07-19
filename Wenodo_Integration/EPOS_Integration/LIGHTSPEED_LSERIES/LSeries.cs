using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
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
namespace EPOS_Integration.LIGHTSPEED_LSERIES
{

    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
        public static int COUNT = 0;
    }

    public class LSeries
    {
        string LSURL = string.Empty;
        string AccessToken = string.Empty;
        DataTable GlobleDatatable = new DataTable();
        DataSet PRODUCT = new DataSet();

        DataTable LIGHTSPEED_L_PRODUCT_GROUP_DT = new DataTable();
        DataTable LIGHTSPEED_L_ALL_PRODUCT_DT = new DataTable();


        //DataTable DATATABLE_LSL_RECEIPT_FIELDS_TYPE = DATATABLE_LSL_RECEIPT_FIELDS();
        //DataTable DATATABLE_LSL_ITEMS_FIELDS_TYPE = DATATABLE_LSL_ITEMS_FIELDS();
        //DataTable DATATABLE_LSL_PAYMENTS_FIELDS_TYPE = DATATABLE_LSL_PAYMENTS_FIELDS();
        //DataTable DATATABLE_LSL_TAX_INFO_TYPE = DATATABLE_LSL_TAX_INFO();

        DataTable DATATABLE_LSL_RECEIPT_FIELDS()
        {
            DataTable DATATABLE_LSL_RECEIPT_FIELDS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("RECEIPT_FIELDS_ID", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SEQUENTIAL_ID", typeof(decimal)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SEQUENCE_NUMBER", typeof(decimal)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UUID", typeof(string)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PARENT_ID", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FLOOR_ID", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_ID", typeof(string)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_ID", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_UUID", typeof(string)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("USER_ID", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATION_DATE", typeof(DateTime)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFICATION_DATE", typeof(DateTime)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSING_DATE", typeof(DateTime)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_DATE", typeof(DateTime)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRINT_DATE", typeof(DateTime)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_WITHOUT_TAX", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER_OF_CUSTOMERS", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENT_COURSE", typeof(int)); DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LSL_RECEIPT_FIELDS_TYPE;
        }
        DataTable DATATABLE_LSL_ITEMS_FIELDS()
        {
            DataTable DATATABLE_LSL_ITEMS_FIELDS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(string)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_PLU", typeof(string)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PROD_ID", typeof(int)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_NAME", typeof(string)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INFO", typeof(string)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_PRICE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_PRICE_WITHOUT_VAT", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_PRICE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_PRICE_WITHOUT_VAT", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VAT_PERCENTAGE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_VAT_PERCENTAGE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_VAT_PERCENTAGE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_TYPE_ID", typeof(int)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RECEIPT_FIELDS_ID", typeof(int)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_PRICE", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_PRICE_WITHOUT_VAT", typeof(decimal)); DATATABLE_LSL_ITEMS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LSL_ITEMS_FIELDS_TYPE;
        }
        DataTable DATATABLE_LSL_PAYMENTS_FIELDS()
        {
            DataTable DATATABLE_LSL_PAYMENTS_FIELDS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PAYMENT_ID", typeof(int)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TYPE_ID", typeof(decimal)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TYPE_CATEGORY_ID", typeof(string)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIPS", typeof(decimal)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RESTITUTION", typeof(string)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS_ID", typeof(int)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEVICE_ID", typeof(string)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATION_DATE", typeof(DateTime)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFICATION_DATE", typeof(DateTime)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RECEIPT_FIELDS_ID", typeof(int)); DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LSL_PAYMENTS_FIELDS_TYPE;
        }
        DataTable DATATABLE_LSL_TAX_INFO()
        {
            DataTable DATATABLE_LSL_TAX_INFO_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("TAX_RATE", typeof(decimal)); DATATABLE_LSL_TAX_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_RATE_CODE", typeof(string)); DATATABLE_LSL_TAX_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_TOTAL", typeof(decimal)); DATATABLE_LSL_TAX_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RECEIPT_FIELDS_ID", typeof(int)); DATATABLE_LSL_TAX_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LSL_TAX_INFO_TYPE;
        }

        DataTable LSL_GROUP_MASTER()
        {
            DataTable LSL_GROUP_MASTER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("GROUP_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SEQUENCE", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE", typeof(bool)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CATEGORY_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SHORTCUT_CATEGORY", typeof(bool)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_GROUP_MASTER_TYPE;
        }
        DataTable LSL_PRODUCT_LIST()
        {
            DataTable LSL_PRODUCT_LIST_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE", typeof(int)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("KITCHEN_IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CFD_IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_TYPE", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SKU", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STOCK_AMOUNT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GROUP_IDS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INFO", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_LIST_TYPE;
        }
        DataTable LSL_PRODUCT_ADDITIONS()
        {
            DataTable LSL_PRODUCT_ADDITIONS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ADDITION_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISPLAY_NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MULTI_SELECT", typeof(bool)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MIN_SELECTED_AMOUNT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MAX_SELECTED_AMOUNT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_ADDITIONS_TYPE;
        }
        DataTable LSL_PRODUCT_ADDITIONS_VALUES()
        {
            DataTable LSL_PRODUCT_ADDITIONS_VALUES_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("VALUES_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INFO", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEFAULT", typeof(bool)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ADDITION_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_ADDITIONS_VALUES_TYPE;
        }

        public void SaveLSeriesDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
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
                        if (variance == 0 || variance > 0)
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                        }
                        else
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date);
                        }
                        string Cashup_end = Cashup_date_new.ToString("yyyy-MM-dd");
                        //string Cashup_end = "2022-02-16";
                        string Cashup_end_date = "";
                        string Cashup_start_date = "";
                        int INTEGRATION_STATUS = 0;

                        DataView dv = GlobleDatatable.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                        DataTable dtIntegrationData = dv.ToTable();
                        DataSet LIGHTSPEED_L_SERIESDATA = null;
                        //year/month/day/hours/minute/secord
                        string[] newtime = Cashup_date.Split('-');
                        DateTime Startdate = new DateTime(Convert.ToInt32(newtime[0]), Convert.ToInt32(newtime[1]), Convert.ToInt32(newtime[2]), Convert.ToInt32(SessionStarttimelist[0]), Convert.ToInt32(SessionStarttimelist[1]), Convert.ToInt32(SessionStarttimelist[2]));
                        bool value = Startdate.IsDaylightSavingTime();
                        if (value)
                        {
                            if (SessionStarttimelist[0] == "00")
                            {
                                //string a = (Convert.ToInt32(SessionStarttimelist[0]) - 1).ToString();
                                //string time = Convert.ToString(a + ':' + SessionStarttimelist[1] + ':' + SessionStarttimelist[2]);
                                // Cashup_start_date =Convert.ToDateTime(Cashup_date + "T" + time).ToLongDateString();
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
                        string[] CashupEndnewtime = Cashup_end.Split('-');
                        DateTime EndDatedate = new DateTime(Convert.ToInt32(CashupEndnewtime[0]), Convert.ToInt32(CashupEndnewtime[1]), Convert.ToInt32(CashupEndnewtime[2]), Convert.ToInt32(SessionEndtimelist[0]), Convert.ToInt32(SessionEndtimelist[1]), Convert.ToInt32(SessionEndtimelist[2]));
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
                            Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";    
                        }
                        #region FetchReceiptDataByDate
                        try
                        {
                            SaveLSeriesDataToDBProduct(dtIntegrationData);                             
                            LIGHTSPEED_L_SERIESDATA = FetchReceiptDataByDate(Cashup_start_date, Cashup_end_date, dtIntegrationData, dt_IntegrationDetails, dr);
                            if (LIGHTSPEED_L_SERIESDATA.Tables[0].Rows.Count > 0)
                            {
                                if (LIGHTSPEED_L_SERIESDATA.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                                {
                                    RequestConstants.COUNT++;
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 0;
                                    Obj.CashupModelObj.ERROR_MESSAGE = LIGHTSPEED_L_SERIESDATA.Tables[0].Rows[0][0].ToString();
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    // EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                                    // Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 0);
                                }
                                if (RequestConstants.COUNT > 3)
                                {
                                    RequestConstants.COUNT = 0;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB -  LightSpeed L Series - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }

                        if (LIGHTSPEED_L_SERIESDATA != null)
                        {
                            if (LIGHTSPEED_L_SERIESDATA.Tables.Count > 0)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFromLSeries(LIGHTSPEED_L_SERIESDATA, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]));
                                if (INTEGRATION_STATUS == 2)
                                {
                                    TransformData<DataSet> transformData = new TransformData<DataSet>();
                                    DataSet LS_ALL_DATA_DS = new DataSet();
                                    LS_ALL_DATA_DS = LIGHTSPEED_L_SERIESDATA;

                                    DataTable PRODUCT_DT = LIGHTSPEED_L_ALL_PRODUCT_DT.Copy();
                                    PRODUCT_DT.TableName = "PRODUCT_DT";
                                    LS_ALL_DATA_DS.Tables.Add(PRODUCT_DT);

                                    DataTable GROUP_DT = LIGHTSPEED_L_PRODUCT_GROUP_DT.Copy();
                                    GROUP_DT.TableName = "GROUP_DT";
                                    LS_ALL_DATA_DS.Tables.Add(GROUP_DT);
                                    

                                    transformData.DataTransform(IntegrationSource.LIGHTSPEED_LS, dtIntegrationData, LS_ALL_DATA_DS, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                    INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
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
                        //else
                        //{
                        //    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        //    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        //}
                        #endregion
                    }
                    //      FetchDailyFinancialData(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd"));
                }
            }
        }
        public void SaveLSeriesDataToDBProduct(DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            foreach (DataRow dr in dt_IntegrationDetails.Rows)
            {
                if (Convert.ToDecimal(dr["INTEGRATION_TYPE_ID"]) == 8)
                {
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;

                    DataSet LIGHTSPEED_L_PRODUCT_GROUP = null;
                    DataSet LIGHTSPEED_L_ALL_PRODUCT = null;
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "INTEGRATION_TYPE_ID=8 and BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();

                    #region FetchProductGroup
                    try
                    {

                        LIGHTSPEED_L_PRODUCT_GROUP = FetchProductGroup(dtIntegrationData, dt_IntegrationDetails, dr);

                        if (LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                        {
                            RequestConstants.COUNT++;
                            EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                            Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 8);
                        }
                        if (RequestConstants.COUNT > 3)
                        {
                            RequestConstants.COUNT = 0;
                        }

                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchProductGroup - LightSpeed L Series - ", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    #endregion
                    #region FetchAllProduct
                    try
                    {
                        LIGHTSPEED_L_ALL_PRODUCT = FetchAllProduct(dtIntegrationData, dt_IntegrationDetails, dr);
                        if (LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                        {
                            RequestConstants.COUNT++;
                            EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                            Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 8);
                        }
                        if (RequestConstants.COUNT > 3)
                        {
                            RequestConstants.COUNT = 0;
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchAllProduct - LightSpeed L Series - ", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    if (LIGHTSPEED_L_ALL_PRODUCT != null && LIGHTSPEED_L_PRODUCT_GROUP != null)
                    {
                        if (LIGHTSPEED_L_ALL_PRODUCT.Tables.Count > 0 && LIGHTSPEED_L_PRODUCT_GROUP.Tables.Count > 0)
                        {
                            INTEGRATION_STATUS = SubmitAllProductWithGroup(LIGHTSPEED_L_ALL_PRODUCT, LIGHTSPEED_L_PRODUCT_GROUP, Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                            if (INTEGRATION_STATUS == 1)
                            {
                                LIGHTSPEED_L_ALL_PRODUCT_DT = LIGHTSPEED_L_ALL_PRODUCT.Tables[0].Copy();
                                LIGHTSPEED_L_PRODUCT_GROUP_DT = LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Copy();
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
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "LIGHTSPEED_L_ALL_PRODUCT is null && LIGHTSPEED_L_PRODUCT_GROUP is null";
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    #endregion
                }
            }
        }
        public void SaveLSeriesDataToDBProduct_FY(DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            foreach (DataRow dr in dt_IntegrationDetails.Rows)
            {
                if (Convert.ToDecimal(dr["INTEGRATION_TYPE_ID"]) == 8)
                {
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;

                    DataSet LIGHTSPEED_L_PRODUCT_GROUP = null;
                    DataSet LIGHTSPEED_L_ALL_PRODUCT = null;
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "INTEGRATION_TYPE_ID=8 and BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();

                    #region FetchProductGroup
                    try
                    {

                        LIGHTSPEED_L_PRODUCT_GROUP = FetchProductGroup(dtIntegrationData, dt_IntegrationDetails, dr);

                        if (LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                        {
                            RequestConstants.COUNT++;
                            EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                            Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 8);
                        }
                        if (RequestConstants.COUNT > 3)
                        {
                            RequestConstants.COUNT = 0;
                        }

                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchProductGroup - LightSpeed L Series - ", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    #endregion
                    #region FetchAllProduct
                    try
                    {
                        LIGHTSPEED_L_ALL_PRODUCT = FetchAllProduct(dtIntegrationData, dt_IntegrationDetails, dr);
                        if (LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                        {
                            RequestConstants.COUNT++;
                            EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                            Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 8);
                        }
                        if (RequestConstants.COUNT > 3)
                        {
                            RequestConstants.COUNT = 0;
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("FetchAllProduct - LightSpeed L Series - ", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    if (LIGHTSPEED_L_ALL_PRODUCT != null && LIGHTSPEED_L_PRODUCT_GROUP != null)
                    {
                        if (LIGHTSPEED_L_ALL_PRODUCT.Tables.Count > 0 && LIGHTSPEED_L_PRODUCT_GROUP.Tables.Count > 0)
                        {
                            INTEGRATION_STATUS = SubmitAllProductWithGroup(LIGHTSPEED_L_ALL_PRODUCT, LIGHTSPEED_L_PRODUCT_GROUP, Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                            if (INTEGRATION_STATUS == 1)
                            {
                                LIGHTSPEED_L_ALL_PRODUCT_DT = LIGHTSPEED_L_ALL_PRODUCT.Tables[0].Copy();
                                LIGHTSPEED_L_PRODUCT_GROUP_DT = LIGHTSPEED_L_PRODUCT_GROUP.Tables[0].Copy();
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
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "LIGHTSPEED_L_ALL_PRODUCT is null && LIGHTSPEED_L_PRODUCT_GROUP is null";
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    #endregion
                }
            }
        }

        DataSet FetchReceiptDataByDate(string Start_date, string End_date, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //GeT Data from URL

                DataSet DS_RECEIPT = new DataSet();
                DataTable DATATABLE_LSL_RECEIPT_FIELDS_TYPE = DATATABLE_LSL_RECEIPT_FIELDS();
                DataTable DATATABLE_LSL_ITEMS_FIELDS_TYPE = DATATABLE_LSL_ITEMS_FIELDS();
                DataTable DATATABLE_LSL_PAYMENTS_FIELDS_TYPE = DATATABLE_LSL_PAYMENTS_FIELDS();
                DataTable DATATABLE_LSL_TAX_INFO_TYPE = DATATABLE_LSL_TAX_INFO();

                //OMEGAURL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();

                // AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);

                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                //WebClient client = new WebClient();
                //NameValueCollection obj = new NameValueCollection();
                //obj.Add("date", Start_date);
                //client.UseDefaultCredentials = true;
                //client.Credentials = CredentialCache.DefaultCredentials;
                //client.Headers.Add("Authorization", AccessToken);
                //client.QueryString = obj;

                int AMOUNT = 100;
                int OFFSET = 0;
                bool IS_VALID = true;
                IList<Root_LSeries> obj = new List<Root_LSeries>();
                for (int i = 0; i < 100000; i++)
                {
                    Root_LSeries item = new Root_LSeries();
                    OFFSET = i * AMOUNT;
                    var JsonResult = JsonUrlReturn_fy(Start_date, End_date, URL, dtIntegrationData, dt, AMOUNT, OFFSET, dr);
                    Root_LSeries root_LSeriesobj = JsonConvert.DeserializeObject<Root_LSeries>(JsonResult.ToString());
                    if (root_LSeriesobj.code == "bad_request")
                    {
                        IS_VALID = false;
                        break;
                    }
                    else
                    {
                        obj.Add(root_LSeriesobj);
                        if (root_LSeriesobj.results.Count < AMOUNT)
                        {
                            break;
                        }
                    }
                }
                if (IS_VALID)
                {
                    // var JsonResult = JsonUrlReturn_fy(Start_date,End_date, AccessToken, URL, dtIntegrationData, dt,PAGE_NO,PAGE_SIZE);
                    // Root_LSeries root_LSeriesobj = JsonConvert.DeserializeObject<Root_LSeries>(JsonResult.ToString());
                    foreach (var HEADER in obj)
                    {
                        foreach (var LS_HEADER in HEADER.results)
                        {
                            DataRow DR_HEADER = DATATABLE_LSL_RECEIPT_FIELDS_TYPE.NewRow();
                            DR_HEADER["RECEIPT_FIELDS_ID"] = LS_HEADER.id;
                            DR_HEADER["SEQUENTIAL_ID"] = LS_HEADER.sequentialId;
                            DR_HEADER["SEQUENCE_NUMBER"] = LS_HEADER.sequenceNumber;
                            DR_HEADER["UUID"] = LS_HEADER.uuid;
                            DR_HEADER["PARENT_ID"] = LS_HEADER.parentId;
                            DR_HEADER["FLOOR_ID"] = LS_HEADER.floorId;
                            DR_HEADER["TABLE_ID"] = LS_HEADER.tableId;
                            DR_HEADER["CUSTOMER_ID"] = LS_HEADER.customerId;
                            DR_HEADER["CUSTOMER_UUID"] = LS_HEADER.customerUuid;
                            DR_HEADER["USER_ID"] = LS_HEADER.userId;
                            DR_HEADER["STATUS"] = LS_HEADER.status;
                            DR_HEADER["TYPE"] = LS_HEADER.type;
                            DR_HEADER["CREATION_DATE"] = LS_HEADER.creationDate;
                            DR_HEADER["MODIFICATION_DATE"] = LS_HEADER.modificationDate;
                            if (LS_HEADER.closingDate.ToString() == "1/1/1970 12:00:00 AM")
                            {
                                DR_HEADER["CLOSING_DATE"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["CLOSING_DATE"] = LS_HEADER.closingDate;
                            }
                            if (LS_HEADER.deliveryDate.ToString() == "1/1/0001 12:00:00 AM")
                            {
                                DR_HEADER["DELIVERY_DATE"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["DELIVERY_DATE"] = LS_HEADER.deliveryDate;
                            }
                            if (LS_HEADER.printDate.ToString() == "1/1/1970 12:00:00 AM")
                            {
                                DR_HEADER["PRINT_DATE"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["PRINT_DATE"] = LS_HEADER.printDate;
                            }
                            DR_HEADER["TOTAL"] = LS_HEADER.total;
                            DR_HEADER["TOTAL_WITHOUT_TAX"] = LS_HEADER.totalWithoutTax;
                            DR_HEADER["NUMBER_OF_CUSTOMERS"] = LS_HEADER.numberOfCustomers;
                            DR_HEADER["CURRENT_COURSE"] = LS_HEADER.currentCourse;
                            DATATABLE_LSL_RECEIPT_FIELDS_TYPE.Rows.Add(DR_HEADER);
                            if (LS_HEADER.items != null)
                            {
                                foreach (var LS_ITEM in LS_HEADER.items)
                                {
                                    DataRow DR_L_ITEM = DATATABLE_LSL_ITEMS_FIELDS_TYPE.NewRow();
                                    DR_L_ITEM["PRODUCT_ID"] = LS_ITEM.productId;
                                    DR_L_ITEM["PRODUCT_PLU"] = LS_ITEM.productPLU;
                                    DR_L_ITEM["PROD_ID"] = LS_ITEM.prodId;
                                    DR_L_ITEM["PRODUCT_NAME"] = LS_ITEM.productName;
                                    DR_L_ITEM["INFO"] = LS_ITEM.info;
                                    DR_L_ITEM["AMOUNT"] = LS_ITEM.amount;
                                    DR_L_ITEM["UNIT_PRICE"] = LS_ITEM.unitPrice;
                                    DR_L_ITEM["UNIT_PRICE_WITHOUT_VAT"] = LS_ITEM.unitPriceWithoutVat;
                                    DR_L_ITEM["TOTAL_PRICE"] = LS_ITEM.totalPrice;
                                    DR_L_ITEM["TOTAL_PRICE_WITHOUT_VAT"] = LS_ITEM.totalPriceWithoutVat;
                                    DR_L_ITEM["VAT_PERCENTAGE"] = LS_ITEM.vatPercentage;
                                    DR_L_ITEM["DELIVERY_VAT_PERCENTAGE"] = LS_ITEM.deliveryVatPercentage;
                                    DR_L_ITEM["TAKE_AWAY_VAT_PERCENTAGE"] = LS_ITEM.takeawayVatPercentage;
                                    DR_L_ITEM["PRICE_TYPE_ID"] = LS_ITEM.priceTypeId;
                                    DR_L_ITEM["RECEIPT_FIELDS_ID"] = LS_HEADER.id;
                                    DR_L_ITEM["DISCOUNT_PRICE"] = LS_ITEM.discountPrice;
                                    DR_L_ITEM["DISCOUNT_PRICE_WITHOUT_VAT"] = LS_ITEM.discountPriceWithoutVat;
                                    DATATABLE_LSL_ITEMS_FIELDS_TYPE.Rows.Add(DR_L_ITEM);
                                }
                            }
                            //if (LS_HEADER.actionItems != null)
                            //{
                            //    foreach (var LS_ITEM in LS_HEADER.actionItems)
                            //    {
                            //        DataRow DR_L_ITEM = DATATABLE_ACTION_LSL_ITEMS_TYPE.NewRow();
                            //        DR_L_ITEM["PRODUCT_ID"] = LS_ITEM.productId;
                            //        DR_L_ITEM["PRODUCT_PLU"] = LS_ITEM.productPLU;
                            //        DR_L_ITEM["PROD_ID"] = LS_ITEM.prodId;
                            //        DR_L_ITEM["PRODUCT_NAME"] = LS_ITEM.productName;
                            //        DR_L_ITEM["INFO"] = LS_ITEM.info;
                            //        DR_L_ITEM["AMOUNT"] = LS_ITEM.amount;
                            //        DR_L_ITEM["UNIT_PRICE"] = LS_ITEM.unitPrice;
                            //        DR_L_ITEM["UNIT_PRICE_WITHOUT_VAT"] = LS_ITEM.unitPriceWithoutVat;
                            //        DR_L_ITEM["TOTAL_PRICE"] = LS_ITEM.totalPrice;
                            //        DR_L_ITEM["TOTAL_PRICE_WITHOUT_VAT"] = LS_ITEM.totalPriceWithoutVat;
                            //        DR_L_ITEM["VAT_PERCENTAGE"] = LS_ITEM.vatPercentage;
                            //        DR_L_ITEM["DELIVERY_VAT_PERCENTAGE"] = LS_ITEM.deliveryVatPercentage;
                            //        DR_L_ITEM["TAKE_AWAY_VAT_PERCENTAGE"] = LS_ITEM.takeawayVatPercentage;
                            //        DR_L_ITEM["PRICE_TYPE_ID"] = LS_ITEM.priceTypeId;
                            //        DR_L_ITEM["RECEIPT_FIELDS_ID"] = LS_HEADER.id;
                            //        DATATABLE_ACTION_LSL_ITEMS_TYPE.Rows.Add(DR_L_ITEM);
                            //    }
                            //}

                            foreach (var LS_PAYMENT in LS_HEADER.payments)
                            {
                                DataRow DR_LS_PAYMENT = DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.NewRow();
                                DR_LS_PAYMENT["PAYMENT_ID"] = LS_PAYMENT.id;
                                DR_LS_PAYMENT["TYPE"] = LS_PAYMENT.type;
                                DR_LS_PAYMENT["PAYMENT_TYPE_ID"] = LS_PAYMENT.paymentTypeId;
                                DR_LS_PAYMENT["PAYMENT_TYPE_CATEGORY_ID"] = LS_PAYMENT.paymentTypeCategoryId;
                                DR_LS_PAYMENT["AMOUNT"] = LS_PAYMENT.amount;
                                DR_LS_PAYMENT["TIPS"] = LS_PAYMENT.tips;
                                DR_LS_PAYMENT["RESTITUTION"] = LS_PAYMENT.restitution;
                                DR_LS_PAYMENT["STATUS_ID"] = LS_PAYMENT.statusId;
                                DR_LS_PAYMENT["DEVICE_ID"] = LS_PAYMENT.deviceId;
                                DR_LS_PAYMENT["CREATION_DATE"] = LS_PAYMENT.creationDate;
                                DR_LS_PAYMENT["MODIFICATION_DATE"] = LS_PAYMENT.modificationDate;
                                DR_LS_PAYMENT["RECEIPT_FIELDS_ID"] = LS_HEADER.id;
                                DATATABLE_LSL_PAYMENTS_FIELDS_TYPE.Rows.Add(DR_LS_PAYMENT);
                            }
                            foreach (var LS_TAX in LS_HEADER.taxInfo)
                            {
                                DataRow DR_LS_TAX = DATATABLE_LSL_TAX_INFO_TYPE.NewRow();
                                DR_LS_TAX["TAX_RATE"] = LS_TAX.taxRate;
                                DR_LS_TAX["TAX_RATE_CODE"] = LS_TAX.taxRateCode;
                                DR_LS_TAX["TAX_TOTAL"] = LS_TAX.taxTotal;
                                DR_LS_TAX["RECEIPT_FIELDS_ID"] = LS_HEADER.id;
                                DATATABLE_LSL_TAX_INFO_TYPE.Rows.Add(DR_LS_TAX);
                            }
                        }
                    }
                    DS_RECEIPT.Tables.Add(DATATABLE_LSL_RECEIPT_FIELDS_TYPE);
                    DS_RECEIPT.Tables.Add(DATATABLE_LSL_ITEMS_FIELDS_TYPE);
                    DS_RECEIPT.Tables.Add(DATATABLE_LSL_PAYMENTS_FIELDS_TYPE);
                    DS_RECEIPT.Tables.Add(DATATABLE_LSL_TAX_INFO_TYPE);
                }
                else
                {
                    DataTable BAD_REQUEST = new DataTable();
                    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    DataRow rows = BAD_REQUEST.NewRow();
                    rows["BAD_REQUEST"] = "BAD_REQUEST";
                    BAD_REQUEST.Rows.Add(rows);
                    DS_RECEIPT.Tables.Add(BAD_REQUEST);
                }
                return DS_RECEIPT;
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
        DataSet FetchProductGroup(DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet LSL_GROUP_MASTER_DATASET = new DataSet();
                DataTable DATATABLE_LSL_GROUP_MASTER_TYPE = LSL_GROUP_MASTER();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                string URL = "https://lightspeedapis.com/resto/rest/inventory/productgroup";
                var JsonResult = JsonUrlReturn_getproductgroup(AccessToken, dtIntegrationData, URL, dt, dr);

                List<LSeriesPrductGroupRoot> root_LSeriesobj = JsonConvert.DeserializeObject<List<LSeriesPrductGroupRoot>>(JsonResult);
                //LSeriesPrductGroupRoot root_LSeriesobj = JsonConvert.DeserializeObject<LSeriesPrductGroupRoot>(JsonResult.ToString());
                foreach (var LS_HEADER in root_LSeriesobj)
                {
                    DataRow DR_HEADER = DATATABLE_LSL_GROUP_MASTER_TYPE.NewRow();
                    DR_HEADER["GROUP_ID"] = LS_HEADER.id;
                    DR_HEADER["NAME"] = LS_HEADER.name;
                    DR_HEADER["SEQUENCE"] = LS_HEADER.sequence;
                    DR_HEADER["VISIBLE"] = LS_HEADER.visible;
                    DR_HEADER["CATEGORY_ID"] = LS_HEADER.categoryId;
                    DR_HEADER["SHORTCUT_CATEGORY"] = LS_HEADER.shortcutCategory;
                    DR_HEADER["TYPE_ID"] = 0;
                    if (LS_HEADER.id == 1883401 || LS_HEADER.id == 1931345)
                    {
                        DR_HEADER["TYPE_ID"] = 1;//Discounts
                    }
                    DATATABLE_LSL_GROUP_MASTER_TYPE.Rows.Add(DR_HEADER);
                }
                LSL_GROUP_MASTER_DATASET.Tables.Add(DATATABLE_LSL_GROUP_MASTER_TYPE);
                return LSL_GROUP_MASTER_DATASET;
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

                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return ERROR_RECEIPT;
                }
                else
                {
                    LogExceptions.LogError("FetchProductGroup - LightSpeed L Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }
        }
        DataSet FetchAllProduct(DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet DS = new DataSet();
                DataTable LSL_PRODUCT_LIST_TYPE = LSL_PRODUCT_LIST();
                DataTable LSL_PRODUCT_ADDITIONS_TYPE = LSL_PRODUCT_ADDITIONS();
                DataTable LSL_PRODUCT_ADDITIONS_VALUES_TYPE = LSL_PRODUCT_ADDITIONS_VALUES();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                string URL = "https://lightspeedapis.com/resto/rest/inventory/product";
                List<LSeriesProduct> obj = new List<LSeriesProduct>();
                int AMOUNT = 100;
                int OFFSET = 0;
                for (int i = 0; i < 10000; i++)
                {
                    OFFSET = AMOUNT * i;
                    var JsonResult = JsonUrlReturn_getAllproduct(dtIntegrationData, URL, dt, AMOUNT, OFFSET, dr);
                    List<LSeriesProduct> root_LSeriesobj = JsonConvert.DeserializeObject<List<LSeriesProduct>>(JsonResult);
                    obj.AddRange(root_LSeriesobj);
                    if (root_LSeriesobj.Count < AMOUNT) { break; }
                }
                foreach (var LS_HEADER in obj)
                {
                    DataRow DR_HEADER = LSL_PRODUCT_LIST_TYPE.NewRow();
                    DR_HEADER["PRODUCT_ID"] = LS_HEADER.id;
                    DR_HEADER["NAME"] = LS_HEADER.name;
                    DR_HEADER["VISIBLE"] = LS_HEADER.visible ? 1 : 0;
                    DR_HEADER["IMAGE_LOCATION"] = LS_HEADER.imageLocation;
                    DR_HEADER["KITCHEN_IMAGE_LOCATION"] = LS_HEADER.kitchenImageLocation;
                    DR_HEADER["CFD_IMAGE_LOCATION"] = LS_HEADER.cfdImageLocation;
                    DR_HEADER["PRICE"] = LS_HEADER.price;
                    DR_HEADER["PRICE_WITHOUT_VAT"] = LS_HEADER.priceWithoutVat;
                    DR_HEADER["TAKE_AWAY_PRICE"] = LS_HEADER.takeawayPrice;
                    DR_HEADER["TAKE_AWAY_PRICE_WITHOUT_VAT"] = LS_HEADER.takeawayPriceWithoutVat;
                    DR_HEADER["DELIVERY_PRICE"] = LS_HEADER.deliveryPrice;
                    DR_HEADER["DELIVERY_PRICE_WITHOUT_VAT"] = LS_HEADER.deliveryPriceWithoutVat;
                    DR_HEADER["PRODUCT_TYPE"] = LS_HEADER.productType;
                    DR_HEADER["SKU"] = LS_HEADER.sku;
                    DR_HEADER["TAX_CLASS"] = LS_HEADER.taxClass;
                    DR_HEADER["DELIVERY_TAX_CLASS"] = LS_HEADER.deliveryTaxClass;
                    DR_HEADER["TAKE_AWAY_TAX_CLASS"] = LS_HEADER.takeawayTaxClass;
                    DR_HEADER["STOCK_AMOUNT"] = LS_HEADER.stockAmount;
                    var grpi = "";
                    foreach (var gids in LS_HEADER.groupIds)
                    {
                        if (grpi == "")
                        {
                            grpi = gids.ToString();
                        }
                        else
                        {
                            grpi = grpi + "," + gids.ToString();
                        }
                    }
                    DR_HEADER["GROUP_IDS"] = grpi;
                    if (LS_HEADER.additions != null)
                    {
                        foreach (var LS_additions in LS_HEADER.additions)
                        {
                            DataRow DR_CHILD = LSL_PRODUCT_ADDITIONS_TYPE.NewRow();
                            DR_CHILD["PRODUCT_ADDITION_ID"] = LS_additions.id;
                            DR_CHILD["NAME"] = LS_additions.name;
                            DR_CHILD["DISPLAY_NAME"] = LS_additions.displayName;
                            DR_CHILD["MULTI_SELECT"] = LS_additions.multiselect;
                            DR_CHILD["MIN_SELECTED_AMOUNT"] = LS_additions.minSelectedAmount;
                            DR_CHILD["MAX_SELECTED_AMOUNT"] = LS_additions.maxSelectedAmount;
                            DR_CHILD["PRODUCT_ID"] = LS_HEADER.id;
                            foreach (var LS_values in LS_additions.values)
                            {
                                DataRow DR_SUB_CHILD = LSL_PRODUCT_ADDITIONS_VALUES_TYPE.NewRow();
                                DR_SUB_CHILD["VALUES_ID"] = LS_values.id;
                                DR_SUB_CHILD["NAME"] = LS_values.name;
                                DR_SUB_CHILD["PRICE"] = LS_values.price;
                                DR_SUB_CHILD["PRICE_WITHOUT_VAT"] = LS_values.priceWithoutVAT;
                                DR_SUB_CHILD["INFO"] = LS_values.info;
                                DR_SUB_CHILD["PLU"] = LS_values.plu;
                                DR_SUB_CHILD["DEFAULT"] = LS_values.@default;
                                DR_SUB_CHILD["PRODUCT_ID"] = LS_HEADER.id;
                                DR_SUB_CHILD["PRODUCT_ADDITION_ID"] = LS_additions.id;
                                LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Rows.Add(DR_SUB_CHILD);
                            }
                            LSL_PRODUCT_ADDITIONS_TYPE.Rows.Add(DR_CHILD);
                        }
                    }
                    LSL_PRODUCT_LIST_TYPE.Rows.Add(DR_HEADER);
                }

                DS.Tables.Add(LSL_PRODUCT_LIST_TYPE);
                DS.Tables.Add(LSL_PRODUCT_ADDITIONS_TYPE);
                DS.Tables.Add(LSL_PRODUCT_ADDITIONS_VALUES_TYPE);
                return DS;
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
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();

                    return ERROR_RECEIPT;
                }
                else
                {
                    LogExceptions.LogError("FetchAllProduct - LightSpeed L Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }
        }
        int SubmitdataFromLSeries(DataSet LSDATA, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID)
        {

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database
                if (LSDATA.Tables.Count > 0 && LSDATA.Tables[0].Rows.Count > 0 && LSDATA.Tables[1].Rows.Count > 0 && LSDATA.Tables[2].Rows.Count > 0 && LSDATA.Tables[3].Rows.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.LSL_RECEIPT_FIELDS = LSDATA.Tables[0];
                    _ICashUp.CashupModelObj.LSL_ITEMS_FIELDS = LSDATA.Tables[1];
                    _ICashUp.CashupModelObj.LSL_PAYMENTS_FIELDS = LSDATA.Tables[2];
                    _ICashUp.CashupModelObj.LSL_TAX_INFO = LSDATA.Tables[3];
                    _ICashUp.INS_UPD_LIGHTSPEED_L_SERIES();
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" LightSpeed L Series:- Fail To Saving Data in DB - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }
        int SubmitAllProductWithGroup(DataSet LIGHTSPEED_L_ALL_PRODUCT, DataSet LIGHTSPEED_L_PRODUCT_GROUP, decimal ENTITY_ID, decimal BRANCH_ID)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database
                if (LIGHTSPEED_L_ALL_PRODUCT.Tables.Count > 0 && LIGHTSPEED_L_PRODUCT_GROUP.Tables.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.LSL_GROUP_MASTER = LIGHTSPEED_L_PRODUCT_GROUP.Tables[0];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_LIST = LIGHTSPEED_L_ALL_PRODUCT.Tables[0];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_ADDITIONS = LIGHTSPEED_L_ALL_PRODUCT.Tables[1];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_ADDITIONS_VALUES = LIGHTSPEED_L_ALL_PRODUCT.Tables[2];
                    _ICashUp.INS_UPD_LSL_PRODUCTS();
                    return 1;
                }
                else
                {
                    return 2;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" LightSpeed L Series Product All:- Fail To Saving Data in DB - ", ex);
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
            // obj.Add("date", Start_date);
            obj.Add("from", Start_date);
            obj.Add("to", end_date);
            obj.Add("amount", amount.ToString());
            obj.Add("offset", offset.ToString());
            obj.Add("useModification", "true");
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Authorization", AccessToken);
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
                    LogExceptions.LogError("JsonUrlReturn_fy - LightSpeed L Series - ", ex);
                    string LSERIESURL = ConfigurationManager.AppSettings["LightSpeedLSeriesTokenPath"].ToString();
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("date", Start_date);
                    obj1.Add("from", Start_date);
                    obj1.Add("to", end_date);
                    obj1.Add("amount", amount.ToString());
                    obj1.Add("offset", offset.ToString());
                    obj1.Add("useModification", "true");
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, obj1, URL, 1, dt, dr);
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
        string JsonUrlReturn_getproductgroup(string AccessToken, DataTable dtIntegrationData, string URL, DataTable MainDt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Authorization", AccessToken);
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("JsonUrlReturn_getproductgroup - LightSpeed L Series - ", ex);
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    string LSERIESURL = ConfigurationManager.AppSettings["LightSpeedLSeriesTokenPath"].ToString();
                    NameValueCollection obj1 = new NameValueCollection();
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, obj1, URL, 0, MainDt, dr);
                }
                else
                {
                    // Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    // Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //  Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                }
            }
            return JsonResult;
        }
        string JsonUrlReturn_getAllproduct(DataTable dtIntegrationData, string URL, DataTable MainDt, int AMOUNT, int OFFSET, DataRow dr)
        {
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Authorization", AccessToken);
            obj.Add("amount", AMOUNT.ToString());
            obj.Add("offset", OFFSET.ToString());
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("JsonUrlReturn_getAllproduct - LightSpeed L Series - ", ex);
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    string LSERIESURL = ConfigurationManager.AppSettings["LightSpeedLSeriesTokenPath"].ToString();
                    NameValueCollection obj1 = new NameValueCollection();
                    obj1.Add("amount", AMOUNT.ToString());
                    obj1.Add("offset", OFFSET.ToString());
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, obj1, URL, 1, MainDt, dr);
                }

            }
            return JsonResult;
        }
        string GetAccessToken(string LSERIESURL, DataTable dtIntegrationData, NameValueCollection obj1, string URL, int FLAG, DataTable Maindt, DataRow dr)
        {

            string JsonResult = "";
            string[] aa = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString().Split(',');
            string refresh_token_old = aa[0].ToString();
            string Base64ClientIDSecret = aa[1].ToString();
            Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            var client = new RestClient(LSERIESURL.Trim());
            client.Timeout = -1;
            var request = new RestRequest(Method.POST);
            request.AddHeader("Authorization", "Basic " + Base64ClientIDSecret);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("grant_type", "refresh_token");
            request.AddParameter("refresh_token", refresh_token_old);
            IRestResponse response_Header = client.Execute(request);


            //bodyParameter.Add("grant_type", "refresh_token");
            //bodyParameter.Add("refresh_token", "WIJ3upf5cifjCs9THzcAsFcJY2XeU1BF");
            //var client = new WebClient();
            //client.Headers.Add("Content-Type", "application/x-www-form-urlencoded");
            //client.Headers.Add("Authorization", "Basic U2diR1h4cUFFa3NCSGRVWEFVSWVkbGlCb1BoSDgwNzc6TmZSV1RBQjlQSTVkVmVEYQ==");
            // var response_Header = client.UploadString(LSERIESURL.Trim(), "POST", JsonConvert.SerializeObject(bodyParameter));
            Access_token_Root Access_tokenobj = JsonConvert.DeserializeObject<Access_token_Root>(response_Header.Content.ToString());
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = new CashupModel();
            _ICashUp.CashupModelObj.TABLE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["TABLE_ID"]);
            _ICashUp.CashupModelObj.ENTITY_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
            _ICashUp.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]);
            _ICashUp.CashupModelObj.BRANCH_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["BRANCH_ID"]);
            _ICashUp.CashupModelObj.URL_PARAMETERS = Access_tokenobj.refresh_token + ',' + Base64ClientIDSecret;
            _ICashUp.CashupModelObj.API_KEY = Access_tokenobj.access_token;
            _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["INTEGRATION_SYSTEM_ID"]);
            _ICashUp.CashupModelObj.USER_ID = 1;
            _ICashUp.CashupModelObj.URL_PATH = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]); 
            _ICashUp.CashupModelObj.INTEGRATION_TYPE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["INTEGRATION_TYPE_ID"]);
            _ICashUp.CashupModelObj.MODULE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["MODULE_ID"]);
            _ICashUp.CashupModelObj.USERID = null;
            _ICashUp.CashupModelObj.PASSWORD = null;
            _ICashUp.CashupModelObj.IS_OUTBOUND = false;
            _ICashUp.CashupModelObj.INTEGRATION_PICKUP_FLAG = false;
            //_ICashUp.CashupModelObj.GROUP_ID =Convert.ToInt32(dtIntegrationData.Rows[0]["GROUP_ID"]); 
            //DataRow[] rows = Maindt.Select("BRANCH_ID" + dtIntegrationData.Rows[0]["BRANCH_ID"] + "AND CUSTOMER_ID" + Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]) + "AND ENTITY_ID" + Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]));
            if (Access_tokenobj.access_token != "" && Access_tokenobj.access_token != null && Access_tokenobj.refresh_token != "" && Access_tokenobj.refresh_token != null)
            {
                DataTable FILTER_TABLE = new DataTable();
                string URLPR = Access_tokenobj.refresh_token + ',' + Base64ClientIDSecret;
                int Return_FLAG = 0;
                Maindt.DefaultView.RowFilter = "BRANCH_ID = " + dtIntegrationData.Rows[0]["BRANCH_ID"] + " and CUSTOMER_ID= " + Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]) + "and ENTITY_ID=" + Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
                FILTER_TABLE = (Maindt.DefaultView).ToTable();
                for (int intCount = 0; intCount < FILTER_TABLE.Rows.Count; intCount++)
                {
                    Cashup _ICashUp_temp = new Cashup();
                    _ICashUp_temp.CashupModelObj = new CashupModel();
                    _ICashUp_temp.CashupModelObj.TABLE_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["TABLE_ID"]);
                    _ICashUp_temp.CashupModelObj.ENTITY_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["ENTITY_ID"]);
                    _ICashUp_temp.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["CUSTOMER_ID"]);
                    _ICashUp_temp.CashupModelObj.BRANCH_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["BRANCH_ID"]);
                    _ICashUp_temp.CashupModelObj.URL_PARAMETERS = Access_tokenobj.refresh_token + ',' + Base64ClientIDSecret;
                    _ICashUp_temp.CashupModelObj.API_KEY = Access_tokenobj.access_token;
                    _ICashUp_temp.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_SYSTEM_ID"]);
                    _ICashUp_temp.CashupModelObj.USER_ID = 1;
                    _ICashUp_temp.CashupModelObj.URL_PATH = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                    _ICashUp_temp.CashupModelObj.INTEGRATION_TYPE_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_TYPE_ID"]);
                    _ICashUp_temp.CashupModelObj.MODULE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["MODULE_ID"]);
                    _ICashUp_temp.CashupModelObj.USERID = null;
                    _ICashUp_temp.CashupModelObj.PASSWORD = null;
                    _ICashUp_temp.CashupModelObj.IS_OUTBOUND = false;
                    _ICashUp_temp.CashupModelObj.INTEGRATION_PICKUP_FLAG = false;
                    //_ICashUp_temp.CashupModelObj.GROUP_ID = null; 
                    Return_FLAG = _ICashUp_temp.UPD_INTEGRATION_TOKENS();

                    //Return_FLAG = _ICashUp_temp.UPD_INTEGRATION_TOKENS(Convert.ToInt32(FILTER_TABLE.Rows[intCount]["ENTITY_ID"]),
                    //   Convert.ToInt32(FILTER_TABLE.Rows[intCount]["BRANCH_ID"]),
                    //   Convert.ToInt32(FILTER_TABLE.Rows[intCount]["CUSTOMER_ID"]),
                    //    Access_tokenobj.access_token,
                    //    URLPR,
                    //     1,
                    //     Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_SYSTEM_ID"]),
                    //   Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_TYPE_ID"]));
                }
                for (int intCount = 0; intCount < dtIntegrationData.Rows.Count; intCount++)
                {
                    dtIntegrationData.Rows[intCount]["API_KEY"] = Access_tokenobj.access_token;
                    dtIntegrationData.Rows[intCount]["URL_PARAMETERS"] = Access_tokenobj.refresh_token + ',' + Base64ClientIDSecret;
                }
                dtIntegrationData.AcceptChanges();
                for (int intCount = 0; intCount < GlobleDatatable.Rows.Count; intCount++)
                {
                    if (GlobleDatatable.Rows[intCount]["BRANCH_ID"].ToString() == dtIntegrationData.Rows[0]["BRANCH_ID"].ToString())
                    {
                        GlobleDatatable.Rows[intCount]["API_KEY"] = Access_tokenobj.access_token;
                        GlobleDatatable.Rows[intCount]["URL_PARAMETERS"] = Access_tokenobj.refresh_token + ',' + Base64ClientIDSecret;
                    }
                }
                GlobleDatatable.AcceptChanges();
                if (Return_FLAG == 1)
                {
                    WebClient Newclient = new WebClient();
                    Newclient.UseDefaultCredentials = true;
                    Newclient.Credentials = CredentialCache.DefaultCredentials;
                    Newclient.Headers.Add("Authorization", _ICashUp.CashupModelObj.API_KEY);
                    if (FLAG == 1)
                    {
                        Newclient.QueryString = obj1;
                    }
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                    JsonResult = Newclient.DownloadString(URL);
                }
            }
            if (Access_tokenobj.code == "bad_request")
            {
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 0;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "bad_request";
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                JsonResult = response_Header.Content.ToString();
            }
            return JsonResult;
        }
    }
}
