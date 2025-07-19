using App_Repository;
using EPOS_Integration.Common;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using Utility;
using ViewModels;
using System.Threading;
using EPOS_Integration.EPOS_SALES;
namespace EPOS_Integration.LIGHTSPEED_O_SERIES
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
        public static int COUNT = 0;
    }
    public class LO_Series
    {
        string LOSURL = string.Empty;
        string AccessToken = string.Empty;
        DataTable GlobleDatatable = new DataTable();

        DataTable DATATABLE_LOS_ORDER_HEADER_FIELDS()
        {
            DataTable DATATABLE_LOS_ORDER_HEADER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SALE_NUMBER", typeof(string)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NOTES", typeof(string)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SITE_ID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REGISTER_ID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_ID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_TAX", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELETED", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATED_AT", typeof(DateTime)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UPDATED_AT", typeof(DateTime)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE", typeof(string)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            // COLUMN_HEADER = new DataColumn("IS_REFUND", typeof(Nullable<int>)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REFUNDED_ORDER_ID", typeof(decimal)); DATATABLE_LOS_ORDER_HEADER_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_ORDER_HEADER_TYPE;
        }
        DataTable DATATABLE_LOS_ORDERS_TYPE_FIELDS()
        {
            DataTable DATATABLE_LOS_ORDERS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDER_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SALE_NUMBER", typeof(string)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STATUS", typeof(string)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NOTES", typeof(string)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIPS", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REGISTER_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SITE_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_MEMBER_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELETED", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_VARIATION", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_FIXED_VARIATION", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_PAYMENT_TYPE", typeof(string)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATED_AT", typeof(DateTime)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UPDATED_AT", typeof(DateTime)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REFUND_ORDER_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_ORDERS_TYPE;
        }
        DataTable DATATABLE_LOS_ORDERS_LINE_FIELDS()
        {
            DataTable DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("NUMBER", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LINE_ID", typeof(string)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_VARIATION", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_FIXED_VARIATION", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NOTES", typeof(string)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_PRICE", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_TAX", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LINE_TOTAL_EX_TAX", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LINE_TOTAL_TAX", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PART_OF_OPTION_SET", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);

            COLUMN_HEADER = new DataColumn("TAXES_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAXES_NAME", typeof(string)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAXES_RATE", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_NAME", typeof(string)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDERS_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELETED", typeof(decimal)); DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE;
        }

        DataTable DATATABLE_LOS_OPTION_FIELDS()
        {
            DataTable DATATABLE_LOS_OPTION_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(decimal)); DATATABLE_LOS_OPTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_LOS_OPTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_PRICE", typeof(decimal)); DATATABLE_LOS_OPTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_TAX", typeof(decimal)); DATATABLE_LOS_OPTION_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LINE_NUMBER", typeof(decimal)); DATATABLE_LOS_OPTION_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_OPTION_TYPE;
        }
        DataTable DATATABLE_LOS_OPTIONSET_FIELDS()
        {
            DataTable DATATABLE_LOS_OPTIONSET_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("name", typeof(string)); DATATABLE_LOS_OPTIONSET_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPTION_SET_ID", typeof(decimal)); DATATABLE_LOS_OPTIONSET_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_OPTIONSET_TYPE;
        }

        DataTable DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS()
        {
            DataTable DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PAYMENT_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NUMBER", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIP", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CREATED_AT", typeof(DateTime)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REF", typeof(string)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("METHOD_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("METHOD_NAME", typeof(string)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDERS_ID", typeof(decimal)); DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS_TYPE;
        }
        DataTable DATATABLE_LOS_TAXES_INFO()
        {
            DataTable DATATABLE_LOS_TAXES_INFO_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("TAX_ID", typeof(decimal)); DATATABLE_LOS_TAXES_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_LOS_TAXES_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RATE", typeof(decimal)); DATATABLE_LOS_TAXES_INFO_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_TAXES_INFO_TYPE;
        }
        DataTable DATATABLE_LOS_MODIFIERS_TYPE_FIELDS()
        {
            DataTable DATATABLE_LOS_MODIFIERS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("ORDERS_ID", typeof(decimal)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LINE_ID", typeof(string)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFIER_ID", typeof(decimal)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MODIFIER_NAME", typeof(string)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_PRICE", typeof(decimal)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("UNIT_TAX", typeof(decimal)); DATATABLE_LOS_MODIFIERS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_LOS_MODIFIERS_TYPE;
        }
        public void SaveLOSSeriesDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            GlobleDatatable = dt_IntegrationDetails;
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            LogExceptions.LogInfo("Total Records KOUNTA - dt.Rows");
            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.USER_ID = 1;
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                foreach (DataRow dr_session in dt_Session.Rows)
                {
                    if (Convert.ToInt32(dr_session["SESSION_MASTER_ID"]) == 4)
                    {
                        LogExceptions.LogInfo("Total Records KOUNTA - SESSION_MASTER_ID");
                        Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                        string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
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
                        string Cashup_end_date = "";
                        string Cashup_start_date = "";
                        int INTEGRATION_STATUS = 0;

                        DataView dv = GlobleDatatable.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                        DataTable dtIntegrationData = dv.ToTable();
                        DataSet L_O_SERIES_ORDER_HEADER_DATA = null;
                        DataSet ALLOrderBydataset = null;
                        //year/month/day/hours/minute/secord
                        string[] newtime = Cashup_date.Split('-');
                        DateTime Startdate = new DateTime(Convert.ToInt32(newtime[0]), Convert.ToInt32(newtime[1]), Convert.ToInt32(newtime[2]), Convert.ToInt32(SessionStarttimelist[0]), Convert.ToInt32(SessionStarttimelist[1]), Convert.ToInt32(SessionStarttimelist[2]));
                        bool value = Startdate.IsDaylightSavingTime();
                        if (value)
                        {
                            if (SessionStarttimelist[0] == "00")
                            {
                                Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) + "Z";
                                Cashup_start_date = Convert.ToDateTime(Cashup_start_date).AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ssZ");
                            }
                            else
                            {
                                string a = (Convert.ToInt32(SessionStarttimelist[0]) - 1).ToString();
                                string time = Convert.ToString(a + ':' + SessionStarttimelist[1] + ':' + SessionStarttimelist[2]);
                                Cashup_start_date = Cashup_date + "T" + time + "Z";
                            }
                            //-1 in session
                        }
                        else
                        {
                            Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) + "Z";
                        }
                        string[] CashupEndnewtime = Cashup_end.Split('-');
                        DateTime EndDatedate = new DateTime(Convert.ToInt32(CashupEndnewtime[0]), Convert.ToInt32(CashupEndnewtime[1]), Convert.ToInt32(CashupEndnewtime[2]), Convert.ToInt32(SessionEndtimelist[0]), Convert.ToInt32(SessionEndtimelist[1]), Convert.ToInt32(SessionEndtimelist[2]));
                        bool value1 = EndDatedate.IsDaylightSavingTime();
                        if (value1)
                        {
                            string a = (Convert.ToInt32(SessionEndtimelist[0]) - 1).ToString();
                            string time1 = Convert.ToString(a + ':' + SessionEndtimelist[1] + ':' + SessionEndtimelist[2]);
                            Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + time1 + "Z";
                        }
                        else
                        {
                            Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]) + "Z";// + "+00:00";    
                        }
                        #region FetchReceiptDataByDate
                        try
                        {
                            L_O_SERIES_ORDER_HEADER_DATA = FetchSalesHeaderDataByDate(Cashup_start_date, Cashup_end_date, dtIntegrationData, dt_IntegrationDetails, dr);

                            if (L_O_SERIES_ORDER_HEADER_DATA.Tables[0].Rows.Count > 0)
                            {
                                if (L_O_SERIES_ORDER_HEADER_DATA.Tables[0].Rows[0][0].ToString() == "BAD_REQUEST" && RequestConstants.COUNT <= 3)
                                {
                                    RequestConstants.COUNT++;
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 0;
                                    Obj.CashupModelObj.ERROR_MESSAGE = L_O_SERIES_ORDER_HEADER_DATA.Tables[0].Rows[0][0].ToString();
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    // EPOS_Integration_Decision Obj12 = new EPOS_Integration_Decision();
                                    // Obj12.GET_CASHUP_MAIN_FOR_INTEGRATION(Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 0);
                                }
                                else
                                {
                                    LogExceptions.LogInfo("Total Records KOUNTA - start ALLOrderBydataset");
                                    ALLOrderBydataset = FetchSalesByIDDataByDate(dtIntegrationData, dt_IntegrationDetails, dr, L_O_SERIES_ORDER_HEADER_DATA.Tables[0]);
                                    LogExceptions.LogInfo("Total Records KOUNTA - END ALLOrderBydataset");
                                }
                                if (RequestConstants.COUNT > 3)
                                {
                                    RequestConstants.COUNT = 0;
                                }
                            }
                            else
                            {
                                Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                Obj.CashupModelObj.ERROR_MESSAGE ="";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB -  LightSpeed LO Series - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;                            Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }

                        if (ALLOrderBydataset != null)
                        {
                            if (ALLOrderBydataset.Tables.Count > 0)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                LogExceptions.LogInfo("Total Records KOUNTA -SubmitdataFromLOSeries");
                                INTEGRATION_STATUS = SubmitdataFromLOSeries(ALLOrderBydataset, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToInt32(dr["BRANCH_ID"]));
                                if (INTEGRATION_STATUS == 2)
                                {
                                    try
                                    {
                                        DataTable dtnew = new DataTable();
                                        dtnew = L_O_SERIES_ORDER_HEADER_DATA.Tables[0];
                                        dtnew.TableName = "ORDER_HEADER";
                                        ALLOrderBydataset.Tables.Add(L_O_SERIES_ORDER_HEADER_DATA.Tables[0].Copy());
                                        TransformData<DataSet> transformDataSet = new TransformData<DataSet>();
                                        LogExceptions.LogInfo("Total Records KOUNTA - Start transformDataSet");
                                        transformDataSet.DataTransform(IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES, dtIntegrationData, ALLOrderBydataset, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                        INTEGRATION_STATUS = Convert.ToInt32(INTEGRATION_STATUS);
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                        LogExceptions.LogInfo("Total Records KOUNTA -END transformDataSet");
                                    }
                                    catch (Exception ex)
                                    {
                                        LogExceptions.LogError("Total Records KOBAS transformDataSet -", ex);
                                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    }
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

        DataSet FetchSalesHeaderDataByDate(string Start_date, string End_date, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet DS_RECEIPT = new DataSet();
                DataTable DATATABLE_LOS_ORDER_HEADER_FIELDS_TYPE = DATATABLE_LOS_ORDER_HEADER_FIELDS();
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                int HitOnServer = 100000;
                if (Start_date == System.DateTime.Now.ToString("yyyy-MM-ddT00:00:00Z")) {
                     HitOnServer = 5;
                }
                TimeSpan ts = new TimeSpan(0, 0, 1);
       
                for (int i = 0; i < HitOnServer; i++)
                {
                    IList<LOS_HEADER_Root> obj = new List<LOS_HEADER_Root>();
                    IRestResponse JsonResult = null;
                    JsonResult = JsonUrlReturn_fy(Start_date, End_date, URL, dtIntegrationData, dt, dr, i);
                    if (JsonResult.Content.ToString() == "Limit exceeded") {
                        Thread.Sleep(ts);
                    }
                    string IS_XNEXTPAGE = "";
                    if (JsonResult.Content.ToString() != "[]" && JsonResult.Content.ToString() != "" && JsonResult.Content.ToString() != "Limit exceeded")
                    {
                        
                        obj = JsonConvert.DeserializeObject<List<LOS_HEADER_Root>>(JsonResult.Content.ToString());
                        foreach (var LS_HEADER in obj)
                        {
                            DataRow DR_HEADER = DATATABLE_LOS_ORDER_HEADER_FIELDS_TYPE.NewRow();
                            DR_HEADER["ID"] = LS_HEADER.id;
                            DR_HEADER["SALE_NUMBER"] = LS_HEADER.sale_number;
                            DR_HEADER["STATUS"] = LS_HEADER.status;
                            DR_HEADER["NOTES"] = LS_HEADER.notes;
                            DR_HEADER["SITE_ID"] = LS_HEADER.site_id;
                            DR_HEADER["REGISTER_ID"] = LS_HEADER.register_id;
                            DR_HEADER["STAFF_ID"] = LS_HEADER.staff_id;
                            DR_HEADER["TOTAL"] = LS_HEADER.total;
                            DR_HEADER["TOTAL_TAX"] = LS_HEADER.total_tax;
                            DR_HEADER["PAID"] = LS_HEADER.paid;
                            DR_HEADER["STATUS"] = LS_HEADER.status;
                            DR_HEADER["DELETED"] = LS_HEADER.deleted;
                            DR_HEADER["CREATED_AT"] = LS_HEADER.created_at;
                            DR_HEADER["UPDATED_AT"] = LS_HEADER.updated_at;
                            DR_HEADER["TOTAL"] = LS_HEADER.total;
                            DR_HEADER["ORDER_TYPE"] = LS_HEADER.order_type;

                            // DR_HEADER["IS_REFUND"] = LS_HEADER.is_refund==null? null : LS_HEADER.is_refund;
                            //DR_HEADER["REFUNDED_ORDER_ID"] = LS_HEADER.refunded_order_id;
                            DATATABLE_LOS_ORDER_HEADER_FIELDS_TYPE.Rows.Add(DR_HEADER);
                        }
                        

                    }
                    if (JsonResult.Headers != null)
                    {
                        foreach (var jsonHeader in JsonResult.Headers)
                        {
                            if (jsonHeader.Name.ToString() == "X-Next-Page")
                            {
                                URL = jsonHeader.Value.ToString();
                                IS_XNEXTPAGE = jsonHeader.Name.ToString();
                                break;
                            }
                        }
                    }
                    if (IS_XNEXTPAGE == "X-Next-Page")
                    {
                    }
                    else
                    {
                        break;
                    }
                }
                DS_RECEIPT.Tables.Add(DATATABLE_LOS_ORDER_HEADER_FIELDS_TYPE);
                return DS_RECEIPT;
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (400) Bad Request.")
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed LO Series - ", ex);
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
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed LO Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }

        }
        DataSet FetchSalesByIDDataByDate(DataTable dtIntegrationData, DataTable dt, DataRow dr, DataTable AllOrder)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                DataSet DS_RECEIPT = new DataSet();
                DataTable DATATABLE_LOS_ORDERS_FIELDS_TYPE = DATATABLE_LOS_ORDERS_TYPE_FIELDS();
                DataTable DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE = DATATABLE_LOS_ORDERS_LINE_FIELDS();
                DataTable DATATABLE_LOS_ORDERS_PAYMENT_FIELDS_TYPE = DATATABLE_LOS_ORDERS_PAYMENTS_FIELDS();
                DataTable DATATABLE_LOS_MODIFIERS_TYPE = DATATABLE_LOS_MODIFIERS_TYPE_FIELDS();

                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                bool IS_VALID = true;
                TimeSpan ts = new TimeSpan(0, 0, 1);

                int count = 0;
                for (int i = 0; i < AllOrder.Rows.Count; i++)
                {
                    Thread.Sleep(ts);
                    if (count > 100)
                    {
                        count = 0;
                    }
                    count++;
                    URL = "https://api.kounta.com/v1/companies/29572/orders/" + AllOrder.Rows[i]["ID"].ToString() + ".json";
                    IRestResponse JsonResult = null;
                    JsonResult = JsonUrlReturnSalesByID_FY(URL, dtIntegrationData, dt, dr);
                    LOS_Root LOS_HEADER_obj = new LOS_Root();

                    if (JsonResult.Content.ToString() != "Limit exceeded")
                    {
                        LOS_HEADER_obj = JsonConvert.DeserializeObject<LOS_Root>(JsonResult.Content.ToString());
                    }
                    if (JsonResult.Content.ToString() == "Limit exceeded")
                    {
                    }
                    if (IS_VALID)
                    {
                        if (LOS_HEADER_obj.id == 0)
                        {

                        }

                        DataRow DR_HEADER_ORDERS = DATATABLE_LOS_ORDERS_FIELDS_TYPE.NewRow();
                        DR_HEADER_ORDERS["ORDER_ID"] = LOS_HEADER_obj.id;
                        DR_HEADER_ORDERS["SALE_NUMBER"] = LOS_HEADER_obj.sale_number;
                        DR_HEADER_ORDERS["STATUS"] = LOS_HEADER_obj.status;
                        DR_HEADER_ORDERS["NOTES"] = LOS_HEADER_obj.notes;
                        DR_HEADER_ORDERS["TOTAL"] = LOS_HEADER_obj.total;
                        DR_HEADER_ORDERS["PAID"] = LOS_HEADER_obj.paid;
                        DR_HEADER_ORDERS["TIPS"] = LOS_HEADER_obj.tips;
                        DR_HEADER_ORDERS["REGISTER_ID"] = LOS_HEADER_obj.register_id;
                        DR_HEADER_ORDERS["SITE_ID"] = LOS_HEADER_obj.site_id;
                        DR_HEADER_ORDERS["STAFF_MEMBER_ID"] = LOS_HEADER_obj.staff_member_id;
                        DR_HEADER_ORDERS["DELETED"] = LOS_HEADER_obj.deleted;
                        DR_HEADER_ORDERS["PRICE_VARIATION"] = LOS_HEADER_obj.price_variation;
                        DR_HEADER_ORDERS["PRICE_FIXED_VARIATION"] = LOS_HEADER_obj.price_fixed_variation;
                        DR_HEADER_ORDERS["ORDER_PAYMENT_TYPE"] = LOS_HEADER_obj.order_payment_type;
                        DR_HEADER_ORDERS["CREATED_AT"] = LOS_HEADER_obj.created_at;
                        DR_HEADER_ORDERS["UPDATED_AT"] = LOS_HEADER_obj.updated_at;
                        DR_HEADER_ORDERS["REFUND_ORDER_ID"] = LOS_HEADER_obj.refunded_order_id;
                        DATATABLE_LOS_ORDERS_FIELDS_TYPE.Rows.Add(DR_HEADER_ORDERS);

                        if (LOS_HEADER_obj.lines != null)
                        {
                            foreach (var LOS_lines in LOS_HEADER_obj.lines)
                            {
                                DataRow DR_L_ITEM = DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.NewRow();
                                DR_L_ITEM["NUMBER"] = LOS_lines.number;
                                DR_L_ITEM["LINE_ID"] = LOS_lines.line_id;
                                DR_L_ITEM["QUANTITY"] = LOS_lines.quantity;
                                DR_L_ITEM["PRICE_VARIATION"] = LOS_lines.price_variation;
                                DR_L_ITEM["PRICE_FIXED_VARIATION"] = LOS_lines.price_fixed_variation;
                                DR_L_ITEM["NOTES"] = LOS_lines.notes;
                                DR_L_ITEM["UNIT_PRICE"] = LOS_lines.unit_price;
                                DR_L_ITEM["UNIT_TAX"] = LOS_lines.unit_tax;
                                DR_L_ITEM["LINE_TOTAL_EX_TAX"] = LOS_lines.line_total_ex_tax;
                                DR_L_ITEM["LINE_TOTAL_TAX"] = LOS_lines.line_total_tax;
                                DR_L_ITEM["PART_OF_OPTION_SET"] = LOS_lines.part_of_option_set;
                                foreach (var LS_TAX in LOS_lines.taxes)
                                {
                                    DR_L_ITEM["TAXES_ID"] = LS_TAX.id;
                                    DR_L_ITEM["TAXES_NAME"] = LS_TAX.name;
                                    DR_L_ITEM["TAXES_RATE"] = LS_TAX.rate;
                                }
                                DR_L_ITEM["PRODUCT_ID"] = LOS_lines.product.id;
                                DR_L_ITEM["PRODUCT_NAME"] = LOS_lines.product.name;
                                DR_L_ITEM["ORDERS_ID"] = LOS_HEADER_obj.id;
                                DR_L_ITEM["DELETED"] = LOS_HEADER_obj.deleted;
                                DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE.Rows.Add(DR_L_ITEM);
                                Option options = new Option();
                                options = LOS_HEADER_obj.options.Where(row => row.product_id == LOS_lines.product.id).FirstOrDefault();
                                if (options != null)
                                {
                                    if (options.option_sets != null)
                                    {
                                        foreach (var optionSet in options.option_sets)
                                        {
                                            foreach (var Mod in LOS_lines.modifiers)
                                            {
                                                options = optionSet.options.Where(row => row.product_id == Mod).FirstOrDefault();
                                                DataRow DR_L_MOD = DATATABLE_LOS_MODIFIERS_TYPE.NewRow();
                                                if (options != null)
                                                {
                                                    DR_L_MOD["ORDERS_ID"] = LOS_HEADER_obj.id;
                                                    DR_L_MOD["LINE_ID"] = LOS_lines.line_id;
                                                    DR_L_MOD["MODIFIER_ID"] = Mod;
                                                    DR_L_MOD["MODIFIER_NAME"] = options.name;
                                                    DR_L_MOD["UNIT_PRICE"] = options.unit_price;
                                                    DR_L_MOD["UNIT_TAX"] = options.unit_tax;
                                                    DATATABLE_LOS_MODIFIERS_TYPE.Rows.Add(DR_L_MOD);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        if (LOS_HEADER_obj.payments != null)
                        {
                            foreach (var LS_PAYMENT in LOS_HEADER_obj.payments)
                            {
                                DataRow DR_LS_PAYMENT = DATATABLE_LOS_ORDERS_PAYMENT_FIELDS_TYPE.NewRow();
                                DR_LS_PAYMENT["PAYMENT_ID"] = LS_PAYMENT.id;
                                DR_LS_PAYMENT["NUMBER"] = LS_PAYMENT.number;
                                DR_LS_PAYMENT["AMOUNT"] = LS_PAYMENT.amount;
                                DR_LS_PAYMENT["TIP"] = LS_PAYMENT.tip;
                                DR_LS_PAYMENT["CREATED_AT"] = LS_PAYMENT.created_at;
                                DR_LS_PAYMENT["REF"] = LS_PAYMENT.@ref;
                                DR_LS_PAYMENT["METHOD_ID"] = LS_PAYMENT.method.id;
                                DR_LS_PAYMENT["METHOD_NAME"] = LS_PAYMENT.method.name;
                                DR_LS_PAYMENT["ORDERS_ID"] = LOS_HEADER_obj.id;
                                DATATABLE_LOS_ORDERS_PAYMENT_FIELDS_TYPE.Rows.Add(DR_LS_PAYMENT);
                            }
                        }
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
                }


                DS_RECEIPT.Tables.Add(DATATABLE_LOS_ORDERS_FIELDS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_LOS_ORDERS_LINE_FIELDS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_LOS_ORDERS_PAYMENT_FIELDS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_LOS_MODIFIERS_TYPE);

                //DS_RECEIPT.Tables.Add(DATATABLE_LOS_OPTION_FIELDS_TYPE);
                //DS_RECEIPT.Tables.Add(DATATABLE_LOS_OPTIONSET_FIELDS_TYPE);
                //DS_RECEIPT.Tables.Add(DATATABLE_LOS_TAXES_INFO_TYPE);

                return DS_RECEIPT;
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (400) Bad Request.")
                {
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed LO Series - ", ex);
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
                    LogExceptions.LogError("FetchFinancialDataByTime - LightSpeed LO Series - ", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return null;
                    throw;
                }
            }

        }

        int SubmitdataFromLOSeries(DataSet LSDATA, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, int BRANCH_ID)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            try
            {
                //Save Data in Database
                if (LSDATA.Tables.Count > 0 && LSDATA.Tables[0].Rows.Count > 0 && LSDATA.Tables[1].Rows.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.LOL_ORDERS_TYPE = LSDATA.Tables[0];
                    _ICashUp.CashupModelObj.LOL_ORDERS_LINE_TYPE = LSDATA.Tables[1];
                    _ICashUp.CashupModelObj.LOL_ORDERS_PAYMENTS_TYPE = LSDATA.Tables[2];
                    _ICashUp.CashupModelObj.LOL_ORDERS_LINE_MODIFIERS_TYPE = LSDATA.Tables[3];
                    _ICashUp.INS_UPD_LIGHTSPEED_LO_SERIES();
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

        IRestResponse JsonUrlReturn_fy(string Start_date, string end_date, string URL, DataTable dtIntegrationData, DataTable dt, DataRow dr, int i)
        {
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            Cashup ObjNew = new Cashup();
            ObjNew.CashupModelObj = new CashupModel();
            IRestResponse JsonResult = null;
            //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | SecurityProtocolType.Ssl3;
            var client = new RestClient(URL.Trim());
            client.Timeout = -1;
            var request = new RestRequest();
            request.AddHeader("Authorization", "Bearer " + AccessToken);
            if (i == 0)
            {

                request.AddQueryParameter("created_gte", Start_date);
                request.AddQueryParameter("created_lt", end_date);
            }
            try
            {
                JsonResult = client.ExecuteAsGet(request, "GET");
                if (JsonResult.StatusDescription.ToString() == "Unauthorized")
                {
                    LogExceptions.LogInfo("JsonUrlReturn_fy - LightSpeed O Series - Unauthorized ");
                    string LSERIESURL = "https://api.kounta.com/v1/token.json";
                    var requestOld = new RestRequest();
                    requestOld.AddQueryParameter("created_gte", Start_date);
                    requestOld.AddQueryParameter("created_lt", end_date);
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, requestOld, URL, 1, dt, dr);
                }

            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - LightSpeed O Series - ", ex);
                    string LSERIESURL = "https://api.kounta.com/v1/token.json";
                    var requestOld = new RestRequest();
                    requestOld.AddQueryParameter("created_gte", Start_date);
                    requestOld.AddQueryParameter("created_lt", end_date);
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, requestOld, URL, 1, dt, dr);
                }
            }
            return JsonResult;
        }
        IRestResponse JsonUrlReturnSalesByID_FY(string URL, DataTable dtIntegrationData, DataTable dt, DataRow dr)
        {
            AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
            Cashup ObjNew = new Cashup();
            ObjNew.CashupModelObj = new CashupModel();
            IRestResponse JsonResult = null;
            var client = new RestClient(URL.Trim());
            client.Timeout = -1;
            var request = new RestRequest();
            request.AddHeader("Authorization", "Bearer " + AccessToken);
            try
            {
                JsonResult = client.ExecuteAsGet(request, "GET");
                if (JsonResult.Content.ToString() == "")
                {
                    string LSERIESURL = "https://api.kounta.com/v1/token.json";
                    var requestOld = new RestRequest();
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, requestOld, URL, 1, dt, dr);
                }
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - LightSpeed O Series - ", ex);
                    string LSERIESURL = "https://api.kounta.com/v1/token.json";
                    var requestOld = new RestRequest();
                    JsonResult = GetAccessToken(LSERIESURL, dtIntegrationData, requestOld, URL, 1, dt, dr);
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

        IRestResponse GetAccessToken(string LO_SERIES_URL, DataTable dtIntegrationData, RestRequest requestOld, string URL, int FLAG, DataTable Maindt, DataRow dr)
        {
            string[] separators = { ":;:" };
            IRestResponse response_Header = null;
            string[] Splitresult = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString().Split(separators, 10, StringSplitOptions.None);
            string Site_id = Splitresult[0].ToString();
            string refresh_token_old = Splitresult[1].ToString();

            Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            var client = new RestClient(LO_SERIES_URL.Trim());
            client.Timeout = -1;
            var request = new RestRequest();
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("refresh_token", Splitresult[1].ToString());
            request.AddParameter("client_id", Splitresult[2].ToString());
            request.AddParameter("client_secret", Splitresult[3].ToString());
            request.AddParameter("grant_type", "refresh_token");
            response_Header = client.ExecuteAsPost(request, "POST");

            Access_token_Root Access_tokenobj = JsonConvert.DeserializeObject<Access_token_Root>(response_Header.Content.ToString());
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = new CashupModel();
            _ICashUp.CashupModelObj.TABLE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["TABLE_ID"]);
            _ICashUp.CashupModelObj.ENTITY_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
            _ICashUp.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]);
            _ICashUp.CashupModelObj.BRANCH_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["BRANCH_ID"]);
            _ICashUp.CashupModelObj.URL_PARAMETERS = dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString();
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
                    _ICashUp_temp.CashupModelObj.URL_PARAMETERS = FILTER_TABLE.Rows[intCount]["URL_PARAMETERS"].ToString();
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
                    response_Header = null;
                    var clientOld = new RestClient(URL.Trim());
                    clientOld.Timeout = -1;
                    requestOld.AddHeader("Authorization", "Bearer " + Access_tokenobj.access_token);
                    requestOld.AddHeader("Content-Type", "application/x-www-form-urlencoded");
                    response_Header = clientOld.ExecuteAsGet(requestOld, "GET");
                }
            }
            if (Access_tokenobj.code == "bad_request")
            {
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 0;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "bad_request";
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
            return response_Header;
        }
    }
}
