using App_Repository;
using EPOS_Integration.Common;
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
using EPOS_Integration.EPOS_SALES;
namespace EPOS_Integration.KOBAS
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
        public static int COUNT = 0;
    }
    public class KOBAS
    {
        string LSURL = string.Empty;
        string AccessToken = string.Empty;

        DataTable GlobleDatatable = new DataTable();
        DataTable KOBAS_HEADER_TYPE_FIELDS()
        {
            DataTable DATATABLE_KOBAS_HEADER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("BRAND_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BRAND_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REGION_ID", typeof(decimal)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REGION_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AREA_ID", typeof(int)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AREA_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE_ID", typeof(int)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TIMESTAMP", typeof(DateTime)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("BUSINESS_DATE", typeof(DateTime)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TILL_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_NAME", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAB_ID", typeof(int)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMER_ID", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_SOURCE", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CONSUMPTION_MODE", typeof(string)); DATATABLE_KOBAS_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_KOBAS_HEADER_TYPE;
        }
        DataTable KOBAS_ITEMS_TYPE_FIELDS()
        {
            DataTable DATATABLE_KOBAS_ITEMS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ITEM_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEAD_TYPE", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CATEGORY", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU_NAME", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SALE_ACTION", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FULL_BASE_PRICE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_NAME", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIXED_DISCOUNT", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIXED_DISCOUNT_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIXED_DISCOUNT_NAME", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MANUAL_PRICE_ADJUSTMENT", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_GROSS_SALE_PRICE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ACTUAL_NET_SALE_PRICE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_RATE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COST_PRICE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU_NOTES", typeof(string)); DATATABLE_KOBAS_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_KOBAS_ITEMS_TYPE;
        }
        DataTable DATATABLE_KOBAS_ITEMS_MODIFIERS_FIELDS()
        {
            DataTable DATATABLE_KOBAS_MODIFIERS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(string)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ITEM_ID", typeof(string)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INDEX", typeof(int)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFIER_GROUP_ID", typeof(int)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUESTION", typeof(string)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFIER_ANSWER_ID", typeof(int)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ANSWER", typeof(string)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GROSS_SALE_PRICE", typeof(decimal)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_RATE", typeof(decimal)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COST_PRICE", typeof(decimal)); DATATABLE_KOBAS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);

            return DATATABLE_KOBAS_MODIFIERS_TYPE;
        }
        DataTable DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS()
        {
            DataTable DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ITEM_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MOD_INDEX", typeof(int)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INGREDIENT_ID", typeof(int)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INGREDIENT_NAME", typeof(string)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_MEASUREMENT", typeof(string)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE;
        }
        DataTable DATATABLE_KOBAS_ITEMS_RECIPE_FIELDS()
        {
            DataTable DATATABLE_KOBAS_ITEMS_RECIPE_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ITEM_ID", typeof(string)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INGREDIENT_ID", typeof(int)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INGREDIENT_NAME", typeof(string)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_MEASUREMENT", typeof(string)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(string)); DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_KOBAS_ITEMS_RECIPE_TYPE;
        }
        DataTable DATATABLE_KOBAS_PAYMENTS_FIELDS()
        {
            DataTable DATATABLE_KOBAS_PAYMENTS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PAYMENT_ID", typeof(int)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(int)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAB_ID", typeof(int)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TOTAL", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_CASH", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_CARD", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_OTHER", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GRATUITY", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERVICE_CHARGE", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIPS", typeof(decimal)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_TIME", typeof(DateTime)); DATATABLE_KOBAS_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_KOBAS_PAYMENTS_TYPE;
        }

        public void SaveKboasDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
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
                        string[] SessionStarttimelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                        int start_hr = Convert.ToInt32(SessionStarttimelist[0]);
                        string[] SessionEndtimelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                        int end_hr = Convert.ToInt32(SessionEndtimelist[0]);

                        int variance = start_hr - end_hr;
                        DateTime Cashup_date_new = DateTime.Now;
                        DateTime Cashup_start_date_new = DateTime.Now;
                        DataSet KOBAS_SERIES_ORDER_HEADER_DATA = null;
                        //if (variance == 0 || variance > 0)
                        //{
                        //    Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                        //}
                        //else
                        //{
                        //   
                        //}
                        Cashup_date_new = Convert.ToDateTime(Cashup_date);
                        string Cashup_end = Cashup_date_new.ToString("yyyy-MM-dd");

                        //  string Cashup_end = "";
                        string Cashup_end_date = "";
                        string Cashup_start_date = "";
                        int INTEGRATION_STATUS = 0;

                        DataView dv = GlobleDatatable.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);

                        DataTable dtIntegrationData = dv.ToTable();
                        DataTable DT_CASH_UP_DATE = new DataTable();

                        DT_CASH_UP_DATE.Columns.Add("START_DATE");
                        DT_CASH_UP_DATE.Columns.Add("END_DATE");

                        DataSet KBOAS_DATA = null;
                        string[] newtime = Cashup_date.Split('-');
                        int hours = 24;

                        string AStart = (Convert.ToInt32(SessionStarttimelist[0])).ToString();
                        string BStart = (Convert.ToInt32(SessionStarttimelist[0]) + 1).ToString();
                        int Acount = Convert.ToInt32(AStart);
                        int Bcount = Convert.ToInt32(BStart);

                        for (int i = 0; i < hours; i++)
                        {
                            if (Acount == 24)
                            {
                                Acount = 0;
                                Cashup_start_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                                Cashup_date = Cashup_start_date_new.ToString("yyyy-MM-dd");
                            }
                            if (Bcount == 24)
                            {
                                Bcount = 0;
                                Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                                Cashup_end = Cashup_date_new.ToString("yyyy-MM-dd");
                            }
                            string timestart = (Acount == 0 ? "00" : Acount.ToString()) + ":" + SessionStarttimelist[1] + ":" + SessionStarttimelist[2];
                            string timeend = "00";
                            if (SessionStarttimelist[1] == "00")
                            {
                                timeend = (Bcount == 0 ? "00" : Bcount.ToString()) + ":" + "59" + ":" + "59";
                            }
                            else
                            {
                                timeend = (Bcount == 0 ? "00" : Bcount.ToString()) + ":" + (Convert.ToInt32(SessionStarttimelist[1]) - 1).ToString() + ":59";
                            }
                            DataRow casdr1 = DT_CASH_UP_DATE.NewRow();
                            casdr1[0] = i == 0 ? Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) : Cashup_date + "T" + Convert.ToString(timestart);
                            casdr1[1] = Cashup_end + "T" + Convert.ToString(timeend);
                            DT_CASH_UP_DATE.Rows.Add(casdr1);
                            Acount = Acount + 1;
                            Bcount = Bcount + 1;
                        }

                        Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]);
                        Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);

                        #region FetchVenueSalesDataByTime
                        try
                        {
                            KBOAS_DATA = FetchVenueSalesDataByTime(DT_CASH_UP_DATE, dtIntegrationData, dt_IntegrationDetails, dr);
                            if (KBOAS_DATA.Tables[0].Rows.Count > 0)
                            {
                                if (KBOAS_DATA.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                                {
                                    RequestConstants.COUNT++;
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 0;
                                    Obj.CashupModelObj.ERROR_MESSAGE = KBOAS_DATA.Tables[0].Rows[0][0].ToString();
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                }
                                if (RequestConstants.COUNT > 3)
                                {
                                    RequestConstants.COUNT = 0;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB -  Kboas - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }

                        if (KBOAS_DATA != null)
                        {
                            if (KBOAS_DATA.Tables.Count > 0)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFromKobasSeries(KBOAS_DATA, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                                if (INTEGRATION_STATUS == 2)
                                {
                                    try
                                    {
                                        TransformData<DataSet> transformDataSet = new TransformData<DataSet>();
                                        transformDataSet.DataTransform(IntegrationSource.KOBAS, dtIntegrationData, KBOAS_DATA, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                        INTEGRATION_STATUS = Convert.ToInt32(INTEGRATION_STATUS);
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    }
                                    catch (Exception ex)
                                    {

                                    }
                                }
                                else if (INTEGRATION_STATUS == 4)
                                {
                                    INTEGRATION_STATUS = 4;
                                    Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                                    Obj.CashupModelObj.ERROR_MESSAGE = "";
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                }
                            }
                            else
                            {
                                INTEGRATION_STATUS = 4;
                                Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                                Obj.CashupModelObj.ERROR_MESSAGE = "";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }

                        }
                        //else
                        //{
                        //    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        //    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        //}
                        #endregion FetchVenueSalesDataByTime
                    }
                }
            }
        }

        DataSet FetchVenueSalesDataByTime(DataTable DT_CASH_UP_DATE, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet DS_RECEIPT = new DataSet();
                DataTable DATATABLE_KOBAS_HEADER_TYPE = KOBAS_HEADER_TYPE_FIELDS();
                DataTable DATATABLE_KOBAS_ITEMS_TYPE = KOBAS_ITEMS_TYPE_FIELDS();
                DataTable DATATABLE_KOBAS_ITEMS_MODIFIERS_TYPE = DATATABLE_KOBAS_ITEMS_MODIFIERS_FIELDS();

                DataTable DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE = DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS();
                DataTable DATATABLE_KOBAS_ITEMS_RECIPE_TYPE = DATATABLE_KOBAS_ITEMS_RECIPE_FIELDS();
                DataTable DATATABLE_KOBAS_PAYMENTS_TYPE = DATATABLE_KOBAS_PAYMENTS_FIELDS();

                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);

                int AMOUNT = 100;
                int OFFSET = 0;
                bool IS_VALID = true;
                IList<KobasRoot> obj = new List<KobasRoot>();
                IList<PaymentRoot> Paymentobj = new List<PaymentRoot>();
                for (int i = 0; i < DT_CASH_UP_DATE.Rows.Count; i++)
                {
                    IS_VALID = true;
                    var JsonResult = JsonUrlReturn_fy(DT_CASH_UP_DATE.Rows[i]["START_DATE"].ToString(), DT_CASH_UP_DATE.Rows[i]["END_DATE"].ToString(), URL, dtIntegrationData, dt, AMOUNT, OFFSET, dr, 1);
                    string Payments = "https://api.kobas.co.uk/v3/venue/payments/";
                    var Payments_JsonResult = JsonUrlPaymentReturn_fy(DT_CASH_UP_DATE.Rows[i]["START_DATE"].ToString(), DT_CASH_UP_DATE.Rows[i]["END_DATE"].ToString(), Payments, dtIntegrationData, dt, AMOUNT, OFFSET, dr, 0);
                    if (Payments_JsonResult != "")
                    {
                        Paymentobj = JsonConvert.DeserializeObject<List<PaymentRoot>>(Payments_JsonResult.ToString());
                        foreach (var LS_Payment in Paymentobj)
                        {
                            DataRow DR_LS_PAYMENT = DATATABLE_KOBAS_PAYMENTS_TYPE.NewRow();
                            //var textArray = "[" + ((Newtonsoft.Json.Linq.JObject)LS_Payment.Payments).ToString() + "]";
                            //dept = JsonConvert.DeserializeObject<List<Payments>>(textArray.ToString());
                            DR_LS_PAYMENT["PAYMENT_ID"] = LS_Payment.PaymentID;
                            DR_LS_PAYMENT["ORDER_ID"] = LS_Payment.OrderID;
                            DR_LS_PAYMENT["TAB_ID"] = LS_Payment.TabID;
                            DR_LS_PAYMENT["PAYMENT_TOTAL"] = LS_Payment.PaymentTotal;
                            DR_LS_PAYMENT["PAYMENT_CASH"] = LS_Payment.PaymentCash;
                            DR_LS_PAYMENT["PAYMENT_CARD"] = LS_Payment.PaymentCard;
                            DR_LS_PAYMENT["PAYMENT_OTHER"] = LS_Payment.PaymentOther;
                            DR_LS_PAYMENT["GRATUITY"] = LS_Payment.Gratuity;
                            DR_LS_PAYMENT["SERVICE_CHARGE"] = LS_Payment.ServiceCharge;
                            DR_LS_PAYMENT["TIPS"] = LS_Payment.Tips;
                            DR_LS_PAYMENT["PAYMENT_TIME"] = LS_Payment.Time;
                            DATATABLE_KOBAS_PAYMENTS_TYPE.Rows.Add(DR_LS_PAYMENT);
                        }
                    }
                    if (JsonResult != "" && JsonResult != "[]")
                    {

                        obj = JsonConvert.DeserializeObject<List<KobasRoot>>(JsonResult.ToString());
                    }
                    else
                    {
                        IS_VALID = false;
                        //  break;
                    }
                    if (IS_VALID)
                    {
                        foreach (var LS_HEADER in obj)
                        {
                            //foreach (var LS_HEADER in HEADER.)
                            //{
                            DataRow DR_HEADER = DATATABLE_KOBAS_HEADER_TYPE.NewRow();
                            DR_HEADER["BRAND_ID"] = LS_HEADER.BrandID;
                            DR_HEADER["BRAND_NAME"] = LS_HEADER.BrandName;
                            DR_HEADER["REGION_ID"] = LS_HEADER.RegionID;
                            DR_HEADER["REGION_NAME"] = LS_HEADER.RegionName;
                            DR_HEADER["AREA_ID"] = LS_HEADER.AreaID;
                            DR_HEADER["AREA_NAME"] = LS_HEADER.AreaName;
                            DR_HEADER["VENUE_ID"] = LS_HEADER.VenueID;
                            DR_HEADER["VENUE_NAME"] = LS_HEADER.VenueName;

                            if (LS_HEADER.OrderTimestamp.ToString() == "1/1/1970 12:00:00 AM")
                            {
                                DR_HEADER["ORDER_TIMESTAMP"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["ORDER_TIMESTAMP"] = LS_HEADER.OrderTimestamp;
                            }


                            if (LS_HEADER.BusinessDate.ToString() == "1/1/1970 12:00:00 AM")
                            {
                                DR_HEADER["BUSINESS_DATE"] = DBNull.Value;
                            }
                            else
                            {
                                DR_HEADER["BUSINESS_DATE"] = LS_HEADER.BusinessDate;
                            }
                            DR_HEADER["ORDER_ID"] = LS_HEADER.OrderID;
                            DR_HEADER["TILL_ID"] = LS_HEADER.TillID;
                            DR_HEADER["STAFF_ID"] = LS_HEADER.StaffID;
                            DR_HEADER["STAFF_NAME"] = LS_HEADER.StaffName;
                            DR_HEADER["TABLE_ID"] = LS_HEADER.TableID;
                            DR_HEADER["TABLE_NAME"] = LS_HEADER.TableName;
                            DR_HEADER["TAB_ID"] = LS_HEADER.TabID;
                            DR_HEADER["CUSTOMER_ID"] = LS_HEADER.CustomerID;
                            DR_HEADER["ORDER_SOURCE"] = LS_HEADER.OrderSource;
                            DR_HEADER["CONSUMPTION_MODE"] = LS_HEADER.ConsumptionMode;
                            DATATABLE_KOBAS_HEADER_TYPE.Rows.Add(DR_HEADER);
                            if (LS_HEADER.Items != null)
                            {
                                foreach (var LS_ITEM in LS_HEADER.Items)
                                {
                                    DataRow DR_L_ITEM = DATATABLE_KOBAS_ITEMS_TYPE.NewRow();
                                    DR_L_ITEM["ORDER_ID"] = LS_HEADER.OrderID;
                                    DR_L_ITEM["ORDER_ITEM_ID"] = LS_ITEM.OrderItemID;
                                    DR_L_ITEM["LEAD_TYPE"] = LS_ITEM.LeadType;
                                    DR_L_ITEM["CATEGORY"] = LS_ITEM.Category;
                                    DR_L_ITEM["PLU_ID"] = LS_ITEM.PLUID;
                                    DR_L_ITEM["PLU_NAME"] = LS_ITEM.PLUName;
                                    DR_L_ITEM["SALE_ACTION"] = LS_ITEM.SaleAction;
                                    DR_L_ITEM["FULL_BASE_PRICE"] = LS_ITEM.FullBasePrice;
                                    DR_L_ITEM["DISCOUNT"] = LS_ITEM.Discount;
                                    DR_L_ITEM["DISCOUNT_ID"] = LS_ITEM.DiscountID;
                                    DR_L_ITEM["DISCOUNT_NAME"] = LS_ITEM.DiscountName;
                                    DR_L_ITEM["FIXED_DISCOUNT"] = LS_ITEM.FixedDiscount;
                                    DR_L_ITEM["FIXED_DISCOUNT_ID"] = LS_ITEM.FixedDiscountID;
                                    DR_L_ITEM["FIXED_DISCOUNT_NAME"] = LS_ITEM.FixedDiscountName;
                                    DR_L_ITEM["MANUAL_PRICE_ADJUSTMENT"] = LS_ITEM.ManualPriceAdjustment;
                                    DR_L_ITEM["ACTUAL_GROSS_SALE_PRICE"] = LS_ITEM.ActualGrossSalePrice;
                                    DR_L_ITEM["TAX"] = LS_ITEM.Tax;
                                    DR_L_ITEM["ACTUAL_NET_SALE_PRICE"] = LS_ITEM.ActualNetSalePrice;
                                    DR_L_ITEM["TAX_RATE"] = LS_ITEM.TaxRate.Replace('%', ' ').Trim();
                                    DR_L_ITEM["COST_PRICE"] = LS_ITEM.CostPrice;
                                    DR_L_ITEM["PLU_NOTES"] = LS_ITEM.PLUNotes;
                                    DATATABLE_KOBAS_ITEMS_TYPE.Rows.Add(DR_L_ITEM);
                                    if (LS_ITEM.Modifiers != null)
                                    {
                                        int mcount = 0;
                                        foreach (var Modifiers in LS_ITEM.Modifiers)
                                        {
                                            DataRow DR_MODIFIERS = DATATABLE_KOBAS_ITEMS_MODIFIERS_TYPE.NewRow();
                                            DR_MODIFIERS["ORDER_ID"] = LS_HEADER.OrderID;
                                            DR_MODIFIERS["ORDER_ITEM_ID"] = LS_ITEM.OrderItemID;
                                            DR_MODIFIERS["MODIFIER_GROUP_ID"] = Modifiers.ModifierGroupID;
                                            DR_MODIFIERS["QUESTION"] = Modifiers.Question;
                                            DR_MODIFIERS["MODIFIER_ANSWER_ID"] = Modifiers.ModifierAnswerID;
                                            DR_MODIFIERS["ANSWER"] = Modifiers.Answer;
                                            DR_MODIFIERS["GROSS_SALE_PRICE"] = Modifiers.GrossSalePrice;
                                            DR_MODIFIERS["TAX_RATE"] = Modifiers.TaxRate.Replace('%', ' ').Trim();
                                            DR_MODIFIERS["COST_PRICE"] = Modifiers.CostPrice;
                                            DR_MODIFIERS["INDEX"] = mcount;
                                            DATATABLE_KOBAS_ITEMS_MODIFIERS_TYPE.Rows.Add(DR_MODIFIERS);
                                            if (LS_ITEM.Recipe != null)
                                            {
                                                foreach (var ModifiersRecipe in Modifiers.Recipe)
                                                {
                                                    DataRow DR_ModifiersRecipe = DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.NewRow();
                                                    DR_ModifiersRecipe["ORDER_ID"] = LS_HEADER.OrderID;
                                                    DR_ModifiersRecipe["ORDER_ITEM_ID"] = LS_ITEM.OrderItemID;
                                                    DR_ModifiersRecipe["MOD_INDEX"] = mcount;
                                                    DR_ModifiersRecipe["INGREDIENT_ID"] = ModifiersRecipe.IngredientID;
                                                    DR_ModifiersRecipe["INGREDIENT_NAME"] = ModifiersRecipe.IngredientName;
                                                    DR_ModifiersRecipe["QUANTITY"] = ModifiersRecipe.Quantity;
                                                    DR_ModifiersRecipe["UNIT_MEASUREMENT"] = ModifiersRecipe.UnitMeasurement;
                                                    DR_ModifiersRecipe["PRICE"] = ModifiersRecipe.Price;
                                                    DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE.Rows.Add(DR_ModifiersRecipe);
                                                }
                                            }
                                            mcount = mcount + 1;
                                        }
                                    }
                                    if (LS_ITEM.Recipe != null)
                                    {
                                        foreach (var Recipe in LS_ITEM.Recipe)
                                        {
                                            DataRow DR_RECIPE = DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.NewRow();
                                            DR_RECIPE["ORDER_ID"] = LS_HEADER.OrderID;
                                            DR_RECIPE["ORDER_ITEM_ID"] = LS_ITEM.OrderItemID;
                                            DR_RECIPE["INGREDIENT_ID"] = Recipe.IngredientID;
                                            DR_RECIPE["INGREDIENT_NAME"] = Recipe.IngredientName;
                                            DR_RECIPE["QUANTITY"] = Recipe.Quantity;
                                            DR_RECIPE["UNIT_MEASUREMENT"] = Recipe.UnitMeasurement;
                                            DR_RECIPE["PRICE"] = Recipe.Price;
                                            DATATABLE_KOBAS_ITEMS_RECIPE_TYPE.Rows.Add(DR_RECIPE);
                                        }
                                    }

                                }
                            }
                            //if (LS_HEADER.Payments.ToString() != "[]")
                            //{
                            //    DataRow DR_LS_PAYMENT = DATATABLE_KOBAS_PAYMENTS_TYPE.NewRow();

                            //    IList<Payments> dept = new List<Payments>();
                            //    var textArray = "[" + ((Newtonsoft.Json.Linq.JObject)LS_HEADER.Payments).ToString() + "]";
                            //    dept = JsonConvert.DeserializeObject<List<Payments>>(textArray.ToString());
                            //    DR_LS_PAYMENT["ORDER_ID"] = LS_HEADER.OrderID;
                            //    DR_LS_PAYMENT["PAYMENT_ID"] = dept[0].PaymentID;
                            //    DR_LS_PAYMENT["PAYMENT_TYPE"] = dept[0].PaymentType;
                            //    DR_LS_PAYMENT["AMOUNT"] = dept[0].Amount;
                            //    DATATABLE_KOBAS_PAYMENTS_TYPE.Rows.Add(DR_LS_PAYMENT);
                            //}
                        }
                    }
                }


                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_HEADER_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_ITEMS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_ITEMS_MODIFIERS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_ITEMS_MODIFIERS_RECIPE_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_ITEMS_RECIPE_TYPE);



                DS_RECEIPT.Tables.Add(DATATABLE_KOBAS_PAYMENTS_TYPE);
                //}
                //else
                //{
                //    DataTable BAD_REQUEST = new DataTable();
                //    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                //    DataRow rows = BAD_REQUEST.NewRow();
                //    rows["BAD_REQUEST"] = "BAD_REQUEST";
                //    BAD_REQUEST.Rows.Add(rows);
                //    DS_RECEIPT.Tables.Add(BAD_REQUEST);
                //}
                return DS_RECEIPT;
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (400) Bad Request.")
                {
                    LogExceptions.LogError("FetchVenueSalesDataByTime - Kboas - ", ex);
                    DataTable BAD_REQUEST = new DataTable();
                    DataColumn COLUMN_HEADER = new DataColumn("BAD_REQUEST", typeof(int)); BAD_REQUEST.Columns.Add("BAD_REQUEST");
                    DataSet ERROR_RECEIPT = new DataSet();
                    DataRow rows = BAD_REQUEST.NewRow();
                    rows["BAD_REQUEST"] = "BAD_REQUEST";
                    BAD_REQUEST.Rows.Add(rows);
                    ERROR_RECEIPT.Tables.Add(BAD_REQUEST);
                    return ERROR_RECEIPT;
                }
                else
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - Kboas - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }
        }

        int SubmitdataFromKobasSeries(DataSet KOBAS_DATA, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BRANCH_ID)
        {

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database
                if (KOBAS_DATA.Tables.Count > 0 && KOBAS_DATA.Tables[0].Rows.Count > 0 && KOBAS_DATA.Tables[1].Rows.Count > 0 && KOBAS_DATA.Tables[2].Rows.Count > 0 && KOBAS_DATA.Tables[3].Rows.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.KOBAS_HEADER = KOBAS_DATA.Tables[0];
                    _ICashUp.CashupModelObj.KOBAS_ITEMS = KOBAS_DATA.Tables[1];
                    _ICashUp.CashupModelObj.KOBAS_ITEMS_MODIFIERS = KOBAS_DATA.Tables[2];


                    _ICashUp.CashupModelObj.KOBAS_ITEMS_MODIFIERS_RECIPE = KOBAS_DATA.Tables[3].Clone(); //KOBAS_DATA.Tables[3]


                    _ICashUp.CashupModelObj.KOBAS_ITEMS_RECIPE = KOBAS_DATA.Tables[4].Clone();//KOBAS_DATA.Tables[4];

                    _ICashUp.CashupModelObj.KOBAS_PAYMENTS = KOBAS_DATA.Tables[5];

                    _ICashUp.INS_UPD_KOBAS_CASHUP_DATA();
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" Kboas:- Fail To Saving Data in DB - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }

        string JsonUrlReturn_fy(string Start_date, string end_date, string URL, DataTable dtIntegrationData, DataTable dt, int amount, int offset, DataRow dr, int FLAG_PAY_OR)
        {
            if (Start_date == "23-10-28 18:30:00")
            {

            }
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            Cashup ObjNew = new Cashup();
            ObjNew.CashupModelObj = new CashupModel();
            string[] aa = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();

            obj.Add("from_date", Start_date);
            obj.Add("to_date", end_date);

            obj.Add("include_recipe", "1");

            obj.Add("venue_id", voucher_id);
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
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
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("date", Start_date);
                    obj1.Add("from_date", Start_date);
                    obj1.Add("to_date", end_date);
                    obj1.Add("include_recipe", "1");
                    obj1.Add("venue_id", voucher_id);
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dt, dr);
                }
                else
                {
                    //ObjNew.CashupModelObj.INTEGRATION_STATUS = 3;
                    //ObjNew.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //ObjNew.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return ex.Message.ToString();
                }
            }
            return JsonResult;
        }

        string JsonUrlPaymentReturn_fy(string Start_date, string end_date, string URL, DataTable dtIntegrationData, DataTable dt, int amount, int offset, DataRow dr, int FLAG_PAY_OR)
        {
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            Cashup ObjNew = new Cashup();
            ObjNew.CashupModelObj = new CashupModel();
            string[] aa = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            obj.Add("from_date", Start_date);
            obj.Add("to_date", end_date);
            obj.Add("venue_id", voucher_id);

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("cache-control", "no-cache");
            client.Headers.Add("User-Agent", @"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36");
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);

            client.QueryString = obj;

            IRestResponse response = null;
            var JsonResult = "";
            // var client = new HttpClient();
            // var request = new HttpRequestMessage(HttpMethod.Get, "https://api.kobas.co.uk/v3/venue/payments?from_date=23-08-07T5:30:00&to_date=23-11-09T11:30:00&venue_id=7");
            // request.Headers.Add("x-kobas-company-id", company_id);
            // request.Headers.Add("Authorization", "Bearer "+ AccessToken);
            // var response = client.SendAsync(request);

            //URL = "https://api.kobas.co.uk/v3/venue/payments?from_date=23-11-09T10:30:00&to_date=23-11-09T11:30:00&venue_id=5";
            //var client = new RestClient(URL);
            //var request = new RestRequest();
            //request.AddHeader("cache-control", "no-cache");
            //request.AddHeader("User-Agent", @"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36");
            //request.AddHeader("x-kobas-company-id", "2901");
            //request.AddHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJjZDQyMmIxZTU5YmM5MDkyOTZjOTE5NTYiLCJqdGkiOiI5Njg2ZDQ2MTk3N2E4MjlhMWQyMzliYjI3YWYxMjgyNmI4YWZhOTlhODYxZTZlNDQ1NDBhMTU1NDdiODk4MWIyMGE5MTNiZTFhZTZjMGI0YiIsImlhdCI6MTY5OTYzMDg5OS4xNDgwNjUsIm5iZiI6MTY5OTYzMDg5OS4xNDgwNjYsImV4cCI6MTY5OTYzNDQ5OS4xMzg4MjQsInN1YiI6IiIsInNjb3BlcyI6WyJ7XCJpZFwiOjIsXCJpZGVudGlmaWVyXCI6XCJpbnRlZ3JhdGlvblwiLFwiZGVzY3JpcHRpb25cIjpcIlNjb3BlIGZvciBhIGNvbXBhbnkgJ0ludGVncmF0aW9uIG1lbWJlcicgdXNpbmcgb0F1dGggQVBJXCJ9Il19.Kl6GRs-QhzyZ_gL6bSOvW0dTvtQcEtz5wj3ga090PXqOB_gS9meJtD3SpSifLXlRwOXko9VHAakSlnsAWC_cfUbJVdXug6PXMRke78sGUeVLC-Yu-kmBO8uCO5KYRZk0N_LpGd3aUNp-OCCMYxjumXyBoFKX7PoPFRB_VEIpp4PWMcxQJoAUzrFp5c8mAjcF-eDr4JBWi2zyAGDEMcQJti-UzCfH20D7mvDq-zA8phHgXyB8MClSsZzsZtOCQsY21rcj_5Lk0M2LcMo9lfpVluyX1IirIVdFaEH-y-aIkbFg39bM64Rt0qhcXkeIdQP2fg49ilgYWHUaRswW5B-gwQ");
            //response = client.ExecuteAsGet(request, "GET");

            //System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3;
            //var client1 = new RestClient(URL);
            //var request1 = new RestRequest(Method.GET);
            //request1.AddHeader("cache-control", "no-cache");
            //request1.AddHeader("User-Agent", @"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36");
            //request.AddHeader("x-kobas-company-id", "2901");
            //request.AddHeader("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJjZDQyMmIxZTU5YmM5MDkyOTZjOTE5NTYiLCJqdGkiOiI5Njg2ZDQ2MTk3N2E4MjlhMWQyMzliYjI3YWYxMjgyNmI4YWZhOTlhODYxZTZlNDQ1NDBhMTU1NDdiODk4MWIyMGE5MTNiZTFhZTZjMGI0YiIsImlhdCI6MTY5OTYzMDg5OS4xNDgwNjUsIm5iZiI6MTY5OTYzMDg5OS4xNDgwNjYsImV4cCI6MTY5OTYzNDQ5OS4xMzg4MjQsInN1YiI6IiIsInNjb3BlcyI6WyJ7XCJpZFwiOjIsXCJpZGVudGlmaWVyXCI6XCJpbnRlZ3JhdGlvblwiLFwiZGVzY3JpcHRpb25cIjpcIlNjb3BlIGZvciBhIGNvbXBhbnkgJ0ludGVncmF0aW9uIG1lbWJlcicgdXNpbmcgb0F1dGggQVBJXCJ9Il19.Kl6GRs-QhzyZ_gL6bSOvW0dTvtQcEtz5wj3ga090PXqOB_gS9meJtD3SpSifLXlRwOXko9VHAakSlnsAWC_cfUbJVdXug6PXMRke78sGUeVLC-Yu-kmBO8uCO5KYRZk0N_LpGd3aUNp-OCCMYxjumXyBoFKX7PoPFRB_VEIpp4PWMcxQJoAUzrFp5c8mAjcF-eDr4JBWi2zyAGDEMcQJti-UzCfH20D7mvDq-zA8phHgXyB8MClSsZzsZtOCQsY21rcj_5Lk0M2LcMo9lfpVluyX1IirIVdFaEH-y-aIkbFg39bM64Rt0qhcXkeIdQP2fg49ilgYWHUaRswW5B-gwQ");
            try
            {
                System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3;
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("date", Start_date);
                    obj1.Add("from_date", Start_date);
                    obj1.Add("to_date", end_date);
                    obj1.Add("venue_id", voucher_id);
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dt, dr);
                }
                else
                {
                    //ObjNew.CashupModelObj.INTEGRATION_STATUS = 3;
                    //ObjNew.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //ObjNew.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return ex.Message.ToString();
                }
            }
            return JsonResult;
        }
        string GetAccessToken(DataTable dtIntegrationData, NameValueCollection obj1, string URL, int FLAG, DataTable Maindt, DataRow dr)
        {
            string JsonResult = "";
            string[] aa = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString().Split(',');
            string client_id = aa[0].ToString();
            string client_secret = aa[1].ToString();
            string ACCESS_TOKEN_URL = aa[2].ToString();
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();
            Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            ACCESS_TOKEN_URL = "https://oauth.kobas.co.uk/access_token";
            var client = new RestClient(ACCESS_TOKEN_URL.Trim());
            var request = new RestRequest(Method.POST);
            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
            request.AddParameter("scope", "integration");
            request.AddParameter("x-kobas-company-id", company_id);
            IRestResponse response_Header = client.Execute(request);
            Access_token_Root Access_tokenobj = JsonConvert.DeserializeObject<Access_token_Root>(response_Header.Content.ToString());
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = new CashupModel();
            _ICashUp.CashupModelObj.TABLE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["TABLE_ID"]);
            _ICashUp.CashupModelObj.ENTITY_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
            _ICashUp.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]);
            _ICashUp.CashupModelObj.BRANCH_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["BRANCH_ID"]);
            _ICashUp.CashupModelObj.URL_PARAMETERS = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;
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
            if (Access_tokenobj.access_token != "" && Access_tokenobj.access_token != null)
            {
                DataTable FILTER_TABLE = new DataTable();
                string URLPR = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;
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
                    _ICashUp_temp.CashupModelObj.URL_PARAMETERS = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;
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
                    Return_FLAG = _ICashUp_temp.UPD_INTEGRATION_TOKENS();
                }
                for (int intCount = 0; intCount < dtIntegrationData.Rows.Count; intCount++)
                {
                    dtIntegrationData.Rows[intCount]["API_KEY"] = Access_tokenobj.access_token;
                }
                dtIntegrationData.AcceptChanges();
                for (int intCount = 0; intCount < GlobleDatatable.Rows.Count; intCount++)
                {
                    if (GlobleDatatable.Rows[intCount]["BRANCH_ID"].ToString() == dtIntegrationData.Rows[0]["BRANCH_ID"].ToString())
                    {
                        GlobleDatatable.Rows[intCount]["API_KEY"] = Access_tokenobj.access_token;
                    }
                }
                GlobleDatatable.AcceptChanges();
                if (Return_FLAG == 1)
                {
                    WebClient Newclient = new WebClient();
                    Newclient.UseDefaultCredentials = true;
                    Newclient.Credentials = CredentialCache.DefaultCredentials;
                    Newclient.Headers.Add("Authorization", _ICashUp.CashupModelObj.API_KEY);
                    Newclient.Headers.Add("x-kobas-company-id", company_id);
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
