using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
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



namespace EPOS_Integration.OMEGA
{

    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class OMEGA_EPOS
    {
        string OMEGAURL = string.Empty;
        string AccessToken = string.Empty;
        private string _webClientData = string.Empty;
        //MM_Token MM_Token = new MM_Token();
        int OMEGA_RECORD_COUT_FALG = 0;
        Root_Omega root_Omega = null;

        DataTable Create_DataTable_Header()
        {
            DataTable DATATABLE_OMEGA_HEADER = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("OMEGA_HEADER_ID", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INVOICE_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INVOICE_AMOUNT_WITHOUTTAX", typeof(decimal)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INVOICE_SUM_TAXES", typeof(decimal)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CUSTOMERS_NUMBER", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEVICE_ID", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEVICE_NAME", typeof(string)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_ID", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_CENTER_ID", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_CENTER", typeof(string)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HEADER_ID", typeof(int)); DATATABLE_OMEGA_HEADER.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMEGA_HEADER;
        }
        DataTable Create_DataTable_Payment()
        {
            DataTable DATATABLE_OMEGA_PAYMENT = new DataTable();
            DataColumn COLUMN_PAYMENT = new DataColumn("OMEGA_PAYMENTS_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("CODE", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("DESCRIPTION", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("PAYMENT_METHOD_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("NET_AMOUNT_WITHTAX", typeof(decimal)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("CURRENCY", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("TIP", typeof(decimal)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("DEVICE_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("DEVICE_NAME", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("STAFF_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("REVENUE_CENTER_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("REVENUE_CENTER", typeof(string)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("HEADER_ID", typeof(int)); DATATABLE_OMEGA_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            return DATATABLE_OMEGA_PAYMENT;
        }
        DataTable Create_DataTable_Discount()
        {
            DataTable DATATABLE_OMEGA_DISCOUNT = new DataTable();
            DataColumn COLUMN_DISCOUNT = new DataColumn("OMEGA_DISCOUNT_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("DISCOUNT_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("DISCOUNT_DESCRIPTION", typeof(string)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("DISCOUNT_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("DEVICE_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("DEVICE_NAME", typeof(string)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("STAFF_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("REVENUE_CENTER_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("REVENUE_CENTER", typeof(string)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);
            COLUMN_DISCOUNT = new DataColumn("HEADER_ID", typeof(int)); DATATABLE_OMEGA_DISCOUNT.Columns.Add(COLUMN_DISCOUNT);

            return DATATABLE_OMEGA_DISCOUNT;
        }
        DataTable Create_DataTable_Detail()
        {
            DataTable DATATABLE_OMEGA_DETAIL = new DataTable();
            DataColumn COLUMN_DETAIL = new DataColumn("OMEGA_DETAILS_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            //COLUMN_DETAIL = new DataColumn("TOTAL_NET_AMOUNT_WITHTAX", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TOTAL_NET_AMOUNT_WITHOUTTAX", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("MENU_LIST_PRICE", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("UNIT_COST_PRICE", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX1_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX2_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX3_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX_AMOUNT", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("SKU", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("NAME", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("STATISTIC_GROUP", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX1_RATE_PERCENTAGE", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX2_RATE_PERCENTAGE", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TAX3_RATE_PERCENTAGE", typeof(decimal)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("ACCOUNTING_GROUP_ACCOUNTING_GROUP_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("ACCOUNTING_GROUP_NAME", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("ACCOUNTING_GROUP_CODE", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("CURRENCY", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("REVENUE_CENTER_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("REVENUE_CENTER", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("CATEGORIES_CATEGORY", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("CATEGORIES_VALUE", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("TIME_OF_SALE", typeof(DateTime)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("VOID_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("VOID_DESCRIPTION", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("STAFF_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("DEVICE_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("DEVICE_NAME", typeof(string)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            COLUMN_DETAIL = new DataColumn("HEADER_ID", typeof(int)); DATATABLE_OMEGA_DETAIL.Columns.Add(COLUMN_DETAIL);
            return DATATABLE_OMEGA_DETAIL;
        }

        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
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
                    string Cashup_start_date = Cashup_date + "T00:00:00";// + Convert.ToString(dr_session["SESSION_START"]) + "+00:00";
                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();
                    DataSet OMEGADATA = null;
                    Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]);
                    Obj.CashupModelObj.CASHUP_START_DATE = Cashup_start_date;
                    Obj.CashupModelObj.CASHUP_END_DATE = Cashup_end_date;

                    try
                    {
                        OMEGADATA = FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj);
                        if (OMEGADATA != null)
                        {

                            DataSet dataSet = null;
                            string select = string.Empty;
                            if (Obj.CashupModelObj.INTEGRATION_SYSTEM_ID == 10)
                            {
                                dataSet = Obj.GET_OMEGA_REVENUE_CENTER_BY_BRANCH();
                            }

                            if (dataSet != null && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
                            {
                                foreach (DataRow DR in dataSet.Tables[0].Rows)
                                {
                                    select = select + "REVENUE_CENTER ='" + DR["REVENUE_CENTER"] + "' or ";
                                }
                            }

                            DataTable VALIDATE_OMEGA_HEADER_RECORDS = select == "" ? OMEGADATA.Tables[0] : (OMEGADATA.Tables[0].Select(select.Remove(select.LastIndexOf("or"), 2)).Count() == 0 ? null : OMEGADATA.Tables[0].Select(select.Remove(select.LastIndexOf("or"), 2)).CopyToDataTable());

                            if (OMEGADATA.Tables.Count > 0  && VALIDATE_OMEGA_HEADER_RECORDS!=null)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFromOmega(OMEGADATA, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, 
                                    Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                                if (INTEGRATION_STATUS == 2)
                                {
                                    TransformData<Root_Omega> transformData = new TransformData<Root_Omega>();
                                    transformData.DataTransform(IntegrationSource.OMEGA, dtIntegrationData, root_Omega, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                    INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                }
                                else
                                {
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                    Obj.CashupModelObj.ERROR_MESSAGE = "INTEGRATION_STATUS from OMEGA while savaing data through SubmitdataFromOmega() returned status=4";
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                }
                            }
                            else
                            {
                                INTEGRATION_STATUS = 4;
                                Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                                Obj.CashupModelObj.ERROR_MESSAGE = "Total records count on OMEGA:-OMEGA_HEADER:-" + OMEGADATA.Tables[0].Rows.Count + ".OMEGA_PAYMENTS:-" + OMEGADATA.Tables[1].Rows.Count + ".OMEGA_DETAILS:-" + OMEGADATA.Tables[2].Rows.Count + ".OMEGA_DISCOUNT:-" + OMEGADATA.Tables[3].Rows.Count;
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        else if (OMEGADATA == null && Obj.CashupModelObj.INTEGRATION_STATUS == 3)
                        {
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        else {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                            Obj.CashupModelObj.ERROR_MESSAGE = ".Total Records count in OMEGA:- No record found.";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("SaveDataToDB - OMEGA - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos Main.--------\n" + "Exception - OMEGA - start_date:-" + Cashup_start_date + " , end_date:-" + Cashup_end_date + " , ID:-" + Convert.ToDecimal(dr["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(dr["BRANCH_ID"]).ToString()+"--"+ ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }

                }

                //      FetchDailyFinancialData(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd"));
            }
        }

        DataSet FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup _ICashUp)
        {
            string Omega_Status = string.Empty;
            string Omega_Message = string.Empty;
            try
            {
                //GeT Data from URL
                DataSet DS_OMEGA = new DataSet();
                DataTable DATATABLE_OMEGA_HEADER = Create_DataTable_Header();
                DataTable DATATABLE_OMEGA_PAYMENT = Create_DataTable_Payment();
                DataTable DATATABLE_OMEGA_DISCOUNT = Create_DataTable_Discount();
                DataTable DATATABLE_OMEGA_DETAILS = Create_DataTable_Detail();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                

                OMEGAURL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                bodyParameter.Add("from_date", Start_date);
                bodyParameter.Add("to_date", Start_date);
                bodyParameter.Add("branch_custid", Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]));

                var client = new WebClient();
                client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                client.Headers.Add("key", AccessToken);
                client.Headers.Add("Content-Type", "application/json");
                var response_Header = client.UploadString(OMEGAURL, "post", JsonConvert.SerializeObject(bodyParameter));
                root_Omega = JsonConvert.DeserializeObject<Root_Omega>(response_Header);
                 Omega_Status = root_Omega.status == null ? root_Omega.staus : root_Omega.status;
                Omega_Message = root_Omega.message;
                if (root_Omega.data != null && root_Omega.staus.ToLower() != "FAILED".ToLower())
                {
                    if (root_Omega.data.headers.Count > 0 && root_Omega.staus.ToLower() == "OK".ToLower())
                    { 
                        foreach (var OMEGA_HEADER in root_Omega.data.headers)
                        {
                            DataRow DR_OMEGA_HEADER = DATATABLE_OMEGA_HEADER.NewRow();
                            DR_OMEGA_HEADER["OMEGA_HEADER_ID"] = OMEGA_HEADER.ID;
                            DR_OMEGA_HEADER["INVOICE_AMOUNT"] = Convert.ToString(OMEGA_HEADER.INVOICE_AMOUNT) == "" ? 0 : Convert.ToDecimal(OMEGA_HEADER.INVOICE_AMOUNT);
                            DR_OMEGA_HEADER["INVOICE_AMOUNT_WITHOUTTAX"] = Convert.ToString(OMEGA_HEADER.INVOICE_AMOUNT_WITHOUTTAX) == "" ? 0 : Convert.ToDecimal(OMEGA_HEADER.INVOICE_AMOUNT_WITHOUTTAX);
                            DR_OMEGA_HEADER["INVOICE_SUM_TAXES"] = Convert.ToString(OMEGA_HEADER.INVOICE_SUM_TAXES) == "" ? 0 : Convert.ToDecimal(OMEGA_HEADER.INVOICE_SUM_TAXES);
                            DR_OMEGA_HEADER["CUSTOMERS_NUMBER"] = OMEGA_HEADER.CUSTOMERS_NUMBER;
                            DR_OMEGA_HEADER["DEVICE_ID"] = OMEGA_HEADER.DEVICEID;
                            DR_OMEGA_HEADER["DEVICE_NAME"] = OMEGA_HEADER.DEVICENAME == null || OMEGA_HEADER.DEVICENAME == "" ? "" : OMEGA_HEADER.DEVICENAME;
                            DR_OMEGA_HEADER["STAFF_ID"] = OMEGA_HEADER.STAFFID;
                            DR_OMEGA_HEADER["STAFF_NAME"] = Convert.ToString(OMEGA_HEADER.STAFFNAME);
                            DR_OMEGA_HEADER["REVENUE_CENTER_ID"] = Convert.ToString(OMEGA_HEADER.REVENUECENTERID) == "" ? 0 : OMEGA_HEADER.REVENUECENTERID;
                            DR_OMEGA_HEADER["REVENUE_CENTER"] = Convert.ToString(OMEGA_HEADER.REVENUECENTER);
                            DR_OMEGA_HEADER["HEADER_ID"] = OMEGA_HEADER.HEADER_ID;
                            DATATABLE_OMEGA_HEADER.Rows.Add(DR_OMEGA_HEADER);
                        }
                        foreach (var OMEGA_PAYMENT in root_Omega.data.payments)
                        {
                            DataRow DR_OMEGA_PAYMENT = DATATABLE_OMEGA_PAYMENT.NewRow();
                            DR_OMEGA_PAYMENT["OMEGA_PAYMENTS_ID"] = OMEGA_PAYMENT.ID;
                            DR_OMEGA_PAYMENT["CODE"] = OMEGA_PAYMENT.CODE;
                            DR_OMEGA_PAYMENT["DESCRIPTION"] = Convert.ToString(OMEGA_PAYMENT.DESCRIPTION);
                            DR_OMEGA_PAYMENT["PAYMENT_METHOD_ID"] = OMEGA_PAYMENT.PAYMENTMETHODID;
                            DR_OMEGA_PAYMENT["NET_AMOUNT_WITHTAX"] = OMEGA_PAYMENT.NETAMOUNTWITHTAX.Equals(null) || Convert.ToString(OMEGA_PAYMENT.NETAMOUNTWITHTAX) == "" ? 0 : Convert.ToDecimal(OMEGA_PAYMENT.NETAMOUNTWITHTAX);
                            DR_OMEGA_PAYMENT["CURRENCY"] = OMEGA_PAYMENT.CURRENCY;
                            DR_OMEGA_PAYMENT["TIP"] = OMEGA_PAYMENT.TIP.Equals(null) || Convert.ToString(OMEGA_PAYMENT.TIP) == "" ? 0 : Convert.ToDecimal(OMEGA_PAYMENT.TIP);
                            DR_OMEGA_PAYMENT["DEVICE_ID"] = OMEGA_PAYMENT.DEVICEID;
                            DR_OMEGA_PAYMENT["DEVICE_NAME"] = OMEGA_PAYMENT.DEVICENAME;
                            DR_OMEGA_PAYMENT["STAFF_ID"] = OMEGA_PAYMENT.STAFFID;
                            DR_OMEGA_PAYMENT["STAFF_NAME"] = Convert.ToString(OMEGA_PAYMENT.STAFFNAME);
                            DR_OMEGA_PAYMENT["REVENUE_CENTER_ID"] = OMEGA_PAYMENT.REVENUECENTERID.Equals(null) | Convert.ToString(OMEGA_PAYMENT.REVENUECENTERID) == "" ? 0 : OMEGA_PAYMENT.REVENUECENTERID;
                            DR_OMEGA_PAYMENT["REVENUE_CENTER"] = Convert.ToString(OMEGA_PAYMENT.REVENUECENTER);
                            DR_OMEGA_PAYMENT["HEADER_ID"] = OMEGA_PAYMENT.HEADER_ID;
                            DATATABLE_OMEGA_PAYMENT.Rows.Add(DR_OMEGA_PAYMENT);
                        }
                        foreach (var OMEGA_DETAILS in root_Omega.data.details)
                        {
                            DataRow DR_OMEGA_DETAILS = DATATABLE_OMEGA_DETAILS.NewRow();
                            DR_OMEGA_DETAILS["OMEGA_DETAILS_ID"] = OMEGA_DETAILS.ID;
                            // DR_OMEGA_DETAILS["TOTAL_NET_AMOUNT_WITHTAX"] = Convert.ToDecimal(OMEGA_DETAILS.TOTALNETAMOUNTWITHTAX);
                            DR_OMEGA_DETAILS["TOTAL_NET_AMOUNT_WITHOUTTAX"] = Convert.ToDecimal(OMEGA_DETAILS.TOTALNETAMOUNTWITHOUTTAX);
                            DR_OMEGA_DETAILS["MENU_LIST_PRICE"] = Convert.ToDecimal(OMEGA_DETAILS.MENULISTPRICE);
                            DR_OMEGA_DETAILS["UNIT_COST_PRICE"] = Convert.ToDecimal(OMEGA_DETAILS.UNITCOSTPRICE);
                            DR_OMEGA_DETAILS["TAX1_AMOUNT"] = Convert.ToDecimal(OMEGA_DETAILS.TAX1AMOUNT);
                            DR_OMEGA_DETAILS["TAX2_AMOUNT"] = Convert.ToDecimal(OMEGA_DETAILS.TAX2AMOUNT);
                            DR_OMEGA_DETAILS["TAX3_AMOUNT"] = Convert.ToDecimal(OMEGA_DETAILS.TAX3AMOUNT);
                            DR_OMEGA_DETAILS["TAX_AMOUNT"] = Convert.ToDecimal(OMEGA_DETAILS.TAXAMOUNT);
                            DR_OMEGA_DETAILS["SKU"] = OMEGA_DETAILS.SALESITEMID;
                            DR_OMEGA_DETAILS["NAME"] = OMEGA_DETAILS.NAME;
                            DR_OMEGA_DETAILS["STATISTIC_GROUP"] = OMEGA_DETAILS.STATISTICGROUP;
                            DR_OMEGA_DETAILS["QUANTITY"] = OMEGA_DETAILS.QUANTITY.Equals(null) || Convert.ToString(OMEGA_DETAILS.QUANTITY) == "" ? 0 : Convert.ToDecimal(OMEGA_DETAILS.QUANTITY);
                            DR_OMEGA_DETAILS["TAX1_RATE_PERCENTAGE"] = Convert.ToDecimal(OMEGA_DETAILS.TAX1RATEPERCENTAGE);
                            DR_OMEGA_DETAILS["TAX2_RATE_PERCENTAGE"] = Convert.ToDecimal(OMEGA_DETAILS.TAX2RATEPERCENTAGE);
                            DR_OMEGA_DETAILS["TAX3_RATE_PERCENTAGE"] = Convert.ToDecimal(OMEGA_DETAILS.TAX3RATEPERCENTAGE);
                            DR_OMEGA_DETAILS["ACCOUNTING_GROUP_ACCOUNTING_GROUP_ID"] = OMEGA_DETAILS.ACCOUNTINGGROUP_ACCOUNTINGGROUPID.Equals(null) || Convert.ToString(OMEGA_DETAILS.ACCOUNTINGGROUP_ACCOUNTINGGROUPID) == "" ? 0 : OMEGA_DETAILS.ACCOUNTINGGROUP_ACCOUNTINGGROUPID;
                            DR_OMEGA_DETAILS["ACCOUNTING_GROUP_NAME"] = Convert.ToString(OMEGA_DETAILS.ACCOUNTINGGROUP_NAME);
                            DR_OMEGA_DETAILS["ACCOUNTING_GROUP_CODE"] = Convert.ToString(OMEGA_DETAILS.ACCOUNTINGGROUP_CODE);
                            DR_OMEGA_DETAILS["CURRENCY"] = OMEGA_DETAILS.CURRENCY;
                            DR_OMEGA_DETAILS["REVENUE_CENTER_ID"] = OMEGA_DETAILS.REVENUECENTERID;
                            DR_OMEGA_DETAILS["REVENUE_CENTER"] = OMEGA_DETAILS.REVENUECENTER;
                            DR_OMEGA_DETAILS["CATEGORIES_CATEGORY"] = OMEGA_DETAILS.CATEGORIES_CATEGORY;
                            DR_OMEGA_DETAILS["CATEGORIES_VALUE"] = OMEGA_DETAILS.CATEGORIES_VALUE;
                            DR_OMEGA_DETAILS["TIME_OF_SALE"] = OMEGA_DETAILS.TIMEOFSALE.ToString();
                            DR_OMEGA_DETAILS["VOID_ID"] = OMEGA_DETAILS.VOIDID == null || Convert.ToString(OMEGA_DETAILS.VOIDID) == "" ? (object)DBNull.Value : OMEGA_DETAILS.VOIDID;
                            DR_OMEGA_DETAILS["VOID_DESCRIPTION"] = OMEGA_DETAILS.VOIDDESCRIPTION;
                            DR_OMEGA_DETAILS["STAFF_ID"] = OMEGA_DETAILS.STAFFID;
                            DR_OMEGA_DETAILS["STAFF_NAME"] = OMEGA_DETAILS.STAFFNAME;
                            DR_OMEGA_DETAILS["DEVICE_ID"] = OMEGA_DETAILS.DEVICEID;
                            DR_OMEGA_DETAILS["DEVICE_NAME"] = OMEGA_DETAILS.DEVICENAME;
                            DR_OMEGA_DETAILS["HEADER_ID"] = OMEGA_DETAILS.HEADER_ID;
                            DATATABLE_OMEGA_DETAILS.Rows.Add(DR_OMEGA_DETAILS);

                        }
                        foreach (var OMEGA_DISCOUNT in root_Omega.data.discounts)
                        {
                            DataRow DR_OMEGA_DISCOUNT = DATATABLE_OMEGA_DISCOUNT.NewRow();
                            DR_OMEGA_DISCOUNT["OMEGA_DISCOUNT_ID"] = OMEGA_DISCOUNT.ID;
                            DR_OMEGA_DISCOUNT["DISCOUNT_ID"] = OMEGA_DISCOUNT.DISCOUNTID;
                            DR_OMEGA_DISCOUNT["DISCOUNT_DESCRIPTION"] = OMEGA_DISCOUNT.DISCOUNTDESCRIPTION;
                            DR_OMEGA_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToString(OMEGA_DISCOUNT.DISCOUNTAMOUNT) == "" ? 0 : Convert.ToDecimal(OMEGA_DISCOUNT.DISCOUNTAMOUNT);
                            DR_OMEGA_DISCOUNT["DEVICE_ID"] = OMEGA_DISCOUNT.DEVICEID;
                            DR_OMEGA_DISCOUNT["DEVICE_NAME"] = OMEGA_DISCOUNT.DEVICENAME;
                            DR_OMEGA_DISCOUNT["STAFF_ID"] = OMEGA_DISCOUNT.STAFFID;
                            DR_OMEGA_DISCOUNT["STAFF_NAME"] = OMEGA_DISCOUNT.STAFFNAME;
                            DR_OMEGA_DISCOUNT["REVENUE_CENTER_ID"] = OMEGA_DISCOUNT.REVENUECENTERID;
                            DR_OMEGA_DISCOUNT["REVENUE_CENTER"] = OMEGA_DISCOUNT.REVENUECENTER;
                            DR_OMEGA_DISCOUNT["HEADER_ID"] = OMEGA_DISCOUNT.HEADER_ID;
                            DATATABLE_OMEGA_DISCOUNT.Rows.Add(DR_OMEGA_DISCOUNT);
                        }
                        DS_OMEGA.Tables.Add(DATATABLE_OMEGA_HEADER);
                        DS_OMEGA.Tables.Add(DATATABLE_OMEGA_PAYMENT);
                        DS_OMEGA.Tables.Add(DATATABLE_OMEGA_DETAILS);
                        DS_OMEGA.Tables.Add(DATATABLE_OMEGA_DISCOUNT);
                        OMEGA_RECORD_COUT_FALG = 2;
                        _ICashUp.CashupModelObj.ERROR_MESSAGE = Convert.ToString(root_Omega.data.headers.Count);
                        return DS_OMEGA;
                    }
                    else
                    {
                        OMEGA_RECORD_COUT_FALG = 4;
                        _ICashUp.CashupModelObj.ERROR_MESSAGE = "FetchFinancialDataByTime - OMEGA - no records found in HEADER. Header record count is:-" + Convert.ToString(root_Omega.data.headers.Count);
                        return null;
                    }
                }
                else
                {

                    LogExceptions.LogInfo("FetchFinancialDataByTime - OMEGA - Status-" + Convert.ToString(root_Omega.status) + " ,OMEGA - Staus - " + Convert.ToString(root_Omega.status) + " ,OMEGA - Message -" + Convert.ToString(root_Omega.message));
                    _ICashUp.CashupModelObj.ERROR_MESSAGE = "FetchFinancialDataByTime - OMEGA - Status-" + Convert.ToString(root_Omega.status) + " ,OMEGA - Staus - " + Convert.ToString(root_Omega.status) + ", Message:-" + Convert.ToString(root_Omega.message);
                    OMEGA_RECORD_COUT_FALG = 3;
                    _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;


                    return null;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("FetchFinancialDataByTime - OMEGA - ", ex);
                OMEGA_RECORD_COUT_FALG = 3;
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                throw;
            }
        }

        int SubmitdataFromOmega(DataSet OMEGADATA, decimal CashupHeaderID, decimal SessionID, int INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BRANCH_ID )
        {
            Cashup _ICashUp = new Cashup();
            try
            {
                //Save Data in Database
                if (OMEGADATA.Tables.Count > 0 && OMEGADATA.Tables[0].Rows.Count > 0 && OMEGADATA.Tables[2].Rows.Count > 0)
                {

                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID = INTEGRATION_SYSTEM_ID;
                    _ICashUp.CashupModelObj.OMEGA_HEADER = OMEGADATA.Tables[0];
                    _ICashUp.CashupModelObj.OMEGA_PAYMENTS = OMEGADATA.Tables[1];
                    _ICashUp.CashupModelObj.OMEGA_DETAILS = OMEGADATA.Tables[2];
                    _ICashUp.CashupModelObj.OMEGA_DISCOUNT = OMEGADATA.Tables[3];




                    _ICashUp.INS_UPD_OMEGA_CASHUP_DATA();
                    
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("OMEGA:- Fail To Saving Data in DB - ", ex);
                throw;
                //return 3;
            }
        }
    }
    public class Header
    {
        public int ID { get; set; }
        public decimal INVOICE_AMOUNT { get; set; }
        public decimal INVOICE_AMOUNT_WITHOUTTAX { get; set; }
        public decimal INVOICE_SUM_TAXES { get; set; }
        public int CUSTOMERS_NUMBER { get; set; }
        public int DEVICEID { get; set; }
        public string DEVICENAME { get; set; }
        public int STAFFID { get; set; }
        public string STAFFNAME { get; set; }
        public int REVENUECENTERID { get; set; }
        public string REVENUECENTER { get; set; }
        public int HEADER_ID { get; set; }
    }

    public class Discount
    {
        public int ID { get; set; }
        public int DISCOUNTID { get; set; }
        public string DISCOUNTDESCRIPTION { get; set; }
        public decimal DISCOUNTAMOUNT { get; set; }
        public int DEVICEID { get; set; }
        public string DEVICENAME { get; set; }
        public int STAFFID { get; set; }
        public string STAFFNAME { get; set; }
        public int REVENUECENTERID { get; set; }
        public string REVENUECENTER { get; set; }
        public int HEADER_ID { get; set; }
    }

    public class Payment
    {
        public int ID { get; set; }
        public string CODE { get; set; }
        public string DESCRIPTION { get; set; }
        public int PAYMENTMETHODID { get; set; }
        public decimal NETAMOUNTWITHTAX { get; set; }
        public string CURRENCY { get; set; }
        public decimal TIP { get; set; }
        public int DEVICEID { get; set; }
        public string DEVICENAME { get; set; }
        public int STAFFID { get; set; }
        public string STAFFNAME { get; set; }
        public int REVENUECENTERID { get; set; }
        public string REVENUECENTER { get; set; }
        public int HEADER_ID { get; set; }
    }

    public class Detail
    {
        public int ID { get; set; }
        // public double TOTALNETAMOUNTWITHTAX { get; set; }
        public decimal TOTALNETAMOUNTWITHOUTTAX { get; set; }
        public decimal MENULISTPRICE { get; set; }
        public decimal UNITCOSTPRICE { get; set; }
        public decimal TAX1AMOUNT { get; set; }
        public decimal TAX2AMOUNT { get; set; }
        public decimal TAX3AMOUNT { get; set; }
        public decimal TAXAMOUNT { get; set; }
        public string SKU { get; set; }
        public string NAME { get; set; }
        public string STATISTICGROUP { get; set; }
        public decimal QUANTITY { get; set; }
        public decimal TAX1RATEPERCENTAGE { get; set; }
        public decimal TAX2RATEPERCENTAGE { get; set; }
        public decimal TAX3RATEPERCENTAGE { get; set; }
        public int ACCOUNTINGGROUP_ACCOUNTINGGROUPID { get; set; }
        public string ACCOUNTINGGROUP_NAME { get; set; }
        public string ACCOUNTINGGROUP_CODE { get; set; }
        public string CURRENCY { get; set; }
        public int REVENUECENTERID { get; set; }
        public string REVENUECENTER { get; set; }
        public string CATEGORIES_CATEGORY { get; set; }
        public int CATEGORIES_VALUE { get; set; }
        public int SALESITEMID { get; set; }
        public string TIMEOFSALE { get; set; }
        public object VOIDID { get; set; }
        public object VOIDDESCRIPTION { get; set; }
        public int STAFFID { get; set; }
        public string STAFFNAME { get; set; }
        public int DEVICEID { get; set; }
        public string DEVICENAME { get; set; }
        public int HEADER_ID { get; set; }
    }

    public class Data
    {
        public List<Header> headers { get; set; }
        public List<Discount> discounts { get; set; }
        public List<Payment> payments { get; set; }
        public List<Detail> details { get; set; }
    }

    public class Root_Omega
    {
        public string staus { get; set; }
        public string status { get; set; }
        public string message { get; set; }
        public Data data { get; set; }
    }
    
}


