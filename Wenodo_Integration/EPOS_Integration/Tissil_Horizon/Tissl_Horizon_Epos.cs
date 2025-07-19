using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using RestSharp;
using RestSharp.Serialization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.TISSL_HORIZON
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class TISSL_HORIZON
    {
        DataTable Create_DataTable_Header()
        {
            DataTable DATATABLE_TISSL_HEADER = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN_TIME", typeof(DateTime)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSE_TIME", typeof(DateTime)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN_TERMINAL_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSE_TERMINAL_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN_TERMINAL_DESC", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSE_TERMINAL_DESC", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("RECEIPT_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_CENTRE_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_CENTRE_DESC", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_CODE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COVERS", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_QUANTITY", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CURRENCY", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_LIST_PRICE", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_TAX", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_PRICE_PAID", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_TENDER_AMOUNT", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_DEDUCTION", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL_CHARITY_DONATION", typeof(decimal)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN_TAB_OWNER_DESC", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSE_TAB_OWNER_DESC", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORIGINAL_OPEN_TAB_OWNER", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORIGINAL_CLOSE_TAB_OWNER", typeof(string)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_TRAINING", typeof(bool)); DATATABLE_TISSL_HEADER.Columns.Add(COLUMN_HEADER);
            return DATATABLE_TISSL_HEADER;
        }
        DataTable Create_DataTable_Line()
        {
            DataTable DATATABLE_TISSL_LINE = new DataTable();
            DataColumn COLUMN_LINE = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TERMINAL_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TERMINAL_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("RECORD_ACTIVITY_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SALES_ITEM_ID", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SALES_ITEM_PLU", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SALES_ITEM_GUID", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SALES_ITEM_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("QTY", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("LINE_TAX", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("LIST_PRICE", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("PRICE_PAID", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("DEDUCTION", typeof(decimal)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("DEDUCTION_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("DEDUCTION_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("MENU_BAND", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("MAJOR_GROUP_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("FAMILY_GROUP_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("SUB_GROUP_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TAB_OWNER_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("ORIGINAL_TAB_OWNER_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("IS_DELETED", typeof(bool)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("GUEST_DESC", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("GUEST_CODE", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("TIME_SENT_TO_PREP", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("BUMP_TIME", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("UNIVERSAL_TIME_SLOT_ID", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_1", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_2", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_3", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_4", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_5", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_6", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_7", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_8", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_9", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FIELD_10", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FACT_1", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("CUSTOM_FACT_2", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            COLUMN_LINE = new DataColumn("DATE_FACT", typeof(string)); DATATABLE_TISSL_LINE.Columns.Add(COLUMN_LINE);
            return DATATABLE_TISSL_LINE;
        }
        DataTable Create_DataTable_Payment()
        {
            DataTable DATATABLE_TISSL_PAYMENT = new DataTable();
            DataColumn COLUMN_PAYMENT = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("TENDER_TYPE_CODE", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("TENDER_TYPE_DESC", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("TENDER_AMOUNT", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            COLUMN_PAYMENT = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_PAYMENT.Columns.Add(COLUMN_PAYMENT);
            return DATATABLE_TISSL_PAYMENT;
        }
        DataTable Create_DataTable_Service_Charge()
        {
            DataTable DATATABLE_TISSL_SERVICE_CHARGES = new DataTable();
            DataColumn COLUMN_SERVICE_CHARGES = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_SERVICE_CHARGES.Columns.Add(COLUMN_SERVICE_CHARGES);
            COLUMN_SERVICE_CHARGES = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_SERVICE_CHARGES.Columns.Add(COLUMN_SERVICE_CHARGES);
            COLUMN_SERVICE_CHARGES = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_SERVICE_CHARGES.Columns.Add(COLUMN_SERVICE_CHARGES);
            COLUMN_SERVICE_CHARGES = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_SERVICE_CHARGES.Columns.Add(COLUMN_SERVICE_CHARGES);
            COLUMN_SERVICE_CHARGES = new DataColumn("TENDER_AMOUNT", typeof(decimal)); DATATABLE_TISSL_SERVICE_CHARGES.Columns.Add(COLUMN_SERVICE_CHARGES);
            return DATATABLE_TISSL_SERVICE_CHARGES;
        }
        DataTable Create_DataTable_Charity()
        {
            DataTable DATATABLE_TISSL_CHARITY = new DataTable();
            DataColumn COLUMN_TIPS = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            COLUMN_TIPS = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            COLUMN_TIPS = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            COLUMN_TIPS = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            COLUMN_TIPS = new DataColumn("DEDUCTION_CODE", typeof(string)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            COLUMN_TIPS = new DataColumn("PRICE_PAID", typeof(decimal)); DATATABLE_TISSL_CHARITY.Columns.Add(COLUMN_TIPS);
            return DATATABLE_TISSL_CHARITY;
        }
        DataTable Create_DataTable_Void_Trans()
        {
            DataTable DATATABLE_TISSL_VOID_TRANS = new DataTable();
            DataColumn COLUMN_VOID_TRANS = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("TREDING_DATE", typeof(DateTime)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("QTY", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("TAX", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("DEDUCTION", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("LIST_PRICE", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("PRICE_PAID", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("TENDER_AMOUNT", typeof(decimal)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("CUSTOM_FIELD_1", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("CUSTOM_FIELD_2", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            COLUMN_VOID_TRANS = new DataColumn("CUSTOM_FIELD_3", typeof(string)); DATATABLE_TISSL_VOID_TRANS.Columns.Add(COLUMN_VOID_TRANS);
            return DATATABLE_TISSL_VOID_TRANS;
        }
        DataTable Create_DataTable_Refund_Trans()
        {
            DataTable DATATABLE_TISSL_REFUND_TRANS = new DataTable();
            DataColumn COLUMN_REFUND_TRANS = new DataColumn("TRANSACTION_ID", typeof(string)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("CHECK_CODE", typeof(string)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("TRANSACTION_TYPE_CODE", typeof(string)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("QTY", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("TAX", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("DEDUCTION", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("LIST_PRICE", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("PRICE_PAID", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            COLUMN_REFUND_TRANS = new DataColumn("TENDER_AMOUNT", typeof(decimal)); DATATABLE_TISSL_REFUND_TRANS.Columns.Add(COLUMN_REFUND_TRANS);
            return DATATABLE_TISSL_REFUND_TRANS;
        }

        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            try
            {                
                foreach (DataRow dr in dt.Rows)
                {
                    LogExceptions.LogInfo("Total Records TISSL_HORIZON-" + dt.Rows.Count +":;:CAHSUP_MAIN_ID" + Convert.ToString(dr["ID"]));
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;

                    DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                    //foreach (DataRow dr_session in dt_Session.Rows)
                    //{
                    Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dt_Session.Rows[0]["SESSION_MAPPING_ID"]);
                    string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                    string[] timelist = Convert.ToString(dt_Session.Rows[0]["SESSION_START"]).Split(':');
                    int start_hr = Convert.ToInt32(timelist[0]);
                    timelist = Convert.ToString(dt_Session.Rows[0]["SESSION_END"]).Split(':');
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

                    string Cashup_start_date = Cashup_date + "T" + Convert.ToString(dt_Session.Rows[0]["SESSION_START"]) + "+00:00";
                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dt_Session.Rows[0]["SESSION_END"]) + "+00:00";
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
                                INTEGRATION_STATUS = SubmitdataFromTissl(FinancialData, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Obj.CashupModelObj.BRANCH_ID);
                                if (INTEGRATION_STATUS == 2)
                                {

                                    TransformData<DataSet> transformData = new TransformData<DataSet>();
                                    DataTable TISSL_HEADER = new DataTable("TISSL_HEADER"); TISSL_HEADER = FinancialData.Tables[0].Copy();
                                    DataTable TISSL_LINES = new DataTable("TISSL_LINES"); TISSL_LINES = FinancialData.Tables[1].Copy();
                                    DataTable TISSL_PAYMENTS = new DataTable("TISSL_PAYMENTS"); TISSL_PAYMENTS = FinancialData.Tables[2].Copy();
                                    DataTable TISSL_SERVICE_CHARGES = new DataTable("TISSL_SERVICE_CHARGES"); TISSL_SERVICE_CHARGES = FinancialData.Tables[3].Copy();
                                    DataTable TISSL_CHARITY = new DataTable("TISSL_CHARITY"); TISSL_CHARITY = FinancialData.Tables[4].Copy();
                                    DataTable TISSL_VOID_TRANS = new DataTable("TISSL_VOID_TRANS"); TISSL_VOID_TRANS = FinancialData.Tables[5].Copy();
                                    DataTable TISSL_REFUND_TRANS = new DataTable("TISSL_REFUND_TRANS"); TISSL_REFUND_TRANS = FinancialData.Tables[6].Copy();

                                    DataSet Dataset = new DataSet();
                                    Dataset.Tables.Add(TISSL_HEADER);
                                    Dataset.Tables.Add(TISSL_LINES);
                                    Dataset.Tables.Add(TISSL_PAYMENTS);
                                    Dataset.Tables.Add(TISSL_SERVICE_CHARGES);
                                    Dataset.Tables.Add(TISSL_CHARITY);
                                    Dataset.Tables.Add(TISSL_VOID_TRANS);
                                    Dataset.Tables.Add(TISSL_REFUND_TRANS);

                                    transformData.DataTransform(IntegrationSource.TISSL_HORIZON, dtIntegrationData, Dataset, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                    INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                    //EXCEPTION = Obj.CashupModelObj.ERROR_MESSAGE;

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
                        else
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                            Obj.CashupModelObj.ERROR_MESSAGE = "";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("SaveDataToDB - TISSL INSIDE 'dt_Session' - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString() + "--", ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "SaveDataToDB - TISSL - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                }
                //}
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SaveDataToDB - TISSLHorizon ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = Obj.CashupModelObj.ERROR_MESSAGE = "SaveDataToDB - TISSL -" + ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        DataSet FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup cashup)
        {
            DataSet DS_TISSL = new DataSet();
            DataTable DATATABLE_TISSL_HEADER = Create_DataTable_Header();
            DataTable DATATABLE_TISSL_LINE = Create_DataTable_Line();
            DataTable DATATABLE_TISSL_PAYMENTS = Create_DataTable_Payment();
            DataTable DATATABLE_TISSL_SERVICE_CHARGES = Create_DataTable_Service_Charge();
            DataTable DATATABLE_TISSL_CHARITY = Create_DataTable_Charity();
            DataTable DATATABLE_TISSL_VOID_TRANS = Create_DataTable_Void_Trans();
            DataTable DATATABLE_TISSL_REFUND_TRANS = Create_DataTable_Refund_Trans();

            //DataTable DATATABLE_TISSL_DISCOUNTS = Create_DataTable_Discount();
            //DataTable DATATABLE_TISSL_MODIFIRES = Create_DataTable_Modifier();
            //DataTable DATATABLE_TISSL_TIPS = Create_DataTable_Tips();
            //DataTable DATATABLE_TISSL_TENDER_REFUND = Create_DataTable_Tender_Refund();
            //DataTable DATATABLE_TISSL_VOID_ITEMS = Create_DataTable_Void_Items();
            int counter = 0;
            bool IS_TRAINING = false;
            string error_Detail_String = string.Empty;
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                var client = new RestClient(Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]));
                var request = new RestRequest(Method.POST);
                request.AddHeader("APIKey", Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]));
                request.AddHeader("Content-Type", "application/json");
                var body = @"{""site"":{""id"":""TISSL_ID""},""fromDate"":""Start_date"",""toDate"":""End_date"",""unitCode"":"""",""siteLocationCode"":"""",""tipsAsServiceCharge"": false,""useSeqNumber"":true}";
                body = body.Replace("TISSL_ID", Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]));

                body = body.Replace("Start_date", Start_date);
                body = body.Replace("End_date", Start_date);
                request.RequestFormat = DataFormat.Json;
                request.AddJsonBody(body);
                IRestResponse response = client.Execute(request);
                var tissl_Response = JsonConvert.DeserializeObject<List<TisslRoot>>(response.Content);
                //IList<TisslRoot> tissl_Response = JsonConvert.DeserializeObject<List<TisslRoot>>(response.Content);
                var test = tissl_Response.Select(p => p.checkID).ToArray();
                if (response.StatusCode.ToString().ToLower() == "OK".ToLower() && tissl_Response.Count > 0)
                {
                    var UNIQUE_TISSL_CHECK_ID = tissl_Response.GroupBy(p => p.checkID).Select(grp => grp.First()).ToArray();//tissl_Response.Where(p => p.terminaldesc.ToUpper() != "TISSL Training".ToUpper()).GroupBy(p => p.checkID).Select(grp => grp.First()).ToArray(); 
                    foreach (var TISSL_ROW in UNIQUE_TISSL_CHECK_ID)
                    {
                        try
                        {
                            var LINE = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID &&
                            (p.transactiontypecode == "SALES_ITEM" || p.transactiontypecode == "MODIFIER_ITEM" || p.transactiontypecode == "DISC_ITEM" || p.transactiontypecode == "VOID_ITEM")).ToArray();
                            foreach (var line_Rows in LINE)
                            {
                                DataRow line_DataRow = DATATABLE_TISSL_LINE.NewRow();
                                line_DataRow["TRANSACTION_ID"] = line_Rows.transactionid == null ? (object)DBNull.Value : line_Rows.transactionid.Substring(0, line_Rows.transactionid.IndexOf("_"));
                                line_DataRow["TERMINAL_CODE"] = line_Rows.terminalcode == null ? (object)DBNull.Value : line_Rows.terminalcode;
                                line_DataRow["TERMINAL_DESC"] = line_Rows.terminaldesc == null ? (object)DBNull.Value : line_Rows.terminaldesc;
                                line_DataRow["RECORD_ACTIVITY_CODE"] = line_Rows.recordactivitycode == null ? (object)DBNull.Value : line_Rows.recordactivitycode;
                                line_DataRow["CHECK_ID"] = TISSL_ROW.checkID == null ? (object)DBNull.Value : TISSL_ROW.checkID;
                                line_DataRow["CHECK_CODE"] = line_Rows.checkcode == null ? (object)DBNull.Value : line_Rows.checkcode;
                                line_DataRow["TRANSACTION_TYPE_CODE"] = line_Rows.transactiontypecode == null ? (object)DBNull.Value : line_Rows.transactiontypecode;
                                line_DataRow["SALES_ITEM_ID"] = line_Rows.salesitemid == null ? (object)DBNull.Value : line_Rows.salesitemid;
                                line_DataRow["SALES_ITEM_PLU"] = line_Rows.salesitemPLU == "" || line_Rows.salesitemPLU == null ? (object)DBNull.Value : Convert.ToDecimal(line_Rows.salesitemPLU);
                                line_DataRow["SALES_ITEM_GUID"] = line_Rows.salesitemGUID == null ? (object)DBNull.Value : line_Rows.salesitemGUID;
                                line_DataRow["SALES_ITEM_DESC"] = line_Rows.salesitemdesc == null ? (object)DBNull.Value : line_Rows.salesitemdesc;
                                line_DataRow["QTY"] = line_Rows.qty.Equals(null) ? (object)DBNull.Value : line_Rows.qty;
                                line_DataRow["LINE_TAX"] = line_Rows.tax.Equals(null) ? (object)DBNull.Value : line_Rows.tax;
                                line_DataRow["LIST_PRICE"] = line_Rows.listprice.Equals(null) ? (object)DBNull.Value : line_Rows.listprice;
                                line_DataRow["PRICE_PAID"] = line_Rows.pricepaid.Equals(null) ? (object)DBNull.Value : line_Rows.pricepaid;
                                line_DataRow["DEDUCTION"] = line_Rows.deduction.Equals(null) ? (object)DBNull.Value : line_Rows.deduction;
                                line_DataRow["DEDUCTION_CODE"] = line_Rows.deductioncode == null ? (object)DBNull.Value : line_Rows.deductioncode;
                                line_DataRow["DEDUCTION_DESC"] = line_Rows.deductiondesc == null ? (object)DBNull.Value : line_Rows.deductiondesc;
                                line_DataRow["MENU_BAND"] = line_Rows.menuband == null ? (object)DBNull.Value : line_Rows.menuband;
                                line_DataRow["MAJOR_GROUP_DESC"] = line_Rows.majorgroupdesc == null ? (object)DBNull.Value : line_Rows.majorgroupdesc;
                                line_DataRow["FAMILY_GROUP_DESC"] = line_Rows.familygroupdesc == null ? (object)DBNull.Value : line_Rows.familygroupdesc;
                                line_DataRow["SUB_GROUP_DESC"] = line_Rows.subgroupdesc == null ? (object)DBNull.Value : line_Rows.subgroupdesc;
                                line_DataRow["TAB_OWNER_DESC"] = line_Rows.tabownerdesc == null ? (object)DBNull.Value : line_Rows.tabownerdesc;
                                line_DataRow["ORIGINAL_TAB_OWNER_DESC"] = line_Rows.originaltabownerdesc == null ? (object)DBNull.Value : line_Rows.originaltabownerdesc;
                                line_DataRow["IS_DELETED"] = Convert.ToInt32(line_Rows.isDeleted) == 1 ? true : false;
                                line_DataRow["GUEST_DESC"] = line_Rows.guestdesc == null ? (object)DBNull.Value : line_Rows.guestdesc;
                                line_DataRow["GUEST_CODE"] = line_Rows.guestcode == null ? (object)DBNull.Value : line_Rows.guestcode;
                                line_DataRow["TIME_SENT_TO_PREP"] = line_Rows.timesenttoprep == null ? (object)DBNull.Value : line_Rows.timesenttoprep;
                                line_DataRow["BUMP_TIME"] = line_Rows.bumptime == null ? (object)DBNull.Value : line_Rows.bumptime;
                                line_DataRow["UNIVERSAL_TIME_SLOT_ID"] = line_Rows.universaltimeslotid == null ? (object)DBNull.Value : line_Rows.universaltimeslotid;
                                line_DataRow["CUSTOM_FIELD_1"] = line_Rows.customfield1 == null ? (object)DBNull.Value : line_Rows.customfield1;
                                line_DataRow["CUSTOM_FIELD_2"] = line_Rows.customfield2 == null ? (object)DBNull.Value : line_Rows.customfield2;
                                line_DataRow["CUSTOM_FIELD_3"] = line_Rows.customfield3 == null ? (object)DBNull.Value : line_Rows.customfield3;
                                line_DataRow["CUSTOM_FIELD_4"] = line_Rows.customfield4 == null ? (object)DBNull.Value : line_Rows.customfield4;
                                line_DataRow["CUSTOM_FIELD_5"] = line_Rows.customfield5 == null ? (object)DBNull.Value : line_Rows.customfield5;
                                line_DataRow["CUSTOM_FIELD_6"] = line_Rows.customfield6 == null ? (object)DBNull.Value : line_Rows.customfield6;
                                line_DataRow["CUSTOM_FIELD_7"] = line_Rows.customfield7 == null ? (object)DBNull.Value : line_Rows.customfield7;
                                line_DataRow["CUSTOM_FIELD_8"] = line_Rows.customfield8 == null ? (object)DBNull.Value : line_Rows.customfield8;
                                line_DataRow["CUSTOM_FIELD_9"] = line_Rows.customfield9 == null ? (object)DBNull.Value : line_Rows.customfield9;
                                line_DataRow["CUSTOM_FIELD_10"] = line_Rows.customfield10 == null ? (object)DBNull.Value : line_Rows.customfield10;
                                line_DataRow["CUSTOM_FACT_1"] = line_Rows.customfact1 == null ? (object)DBNull.Value : line_Rows.customfact1;
                                line_DataRow["CUSTOM_FACT_2"] = line_Rows.customfact2 == null ? (object)DBNull.Value : line_Rows.customfact2;
                                line_DataRow["DATE_FACT"] = line_Rows.datefact == null ? (object)DBNull.Value : line_Rows.datefact;
                                DATATABLE_TISSL_LINE.Rows.Add(line_DataRow);
                                if (line_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || line_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-LINE.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        try
                        {
                            var PAYMENTS = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && (p.transactiontypecode == "TENDER" || p.transactiontypecode == "TIPS" || p.transactiontypecode == "TENDER_REFUND")).ToArray();
                            foreach (var payment_Rows in PAYMENTS)
                            {
                                DataRow payment_DataRow = DATATABLE_TISSL_PAYMENTS.NewRow();
                                payment_DataRow["TRANSACTION_ID"] = payment_Rows.transactionid.Equals(null) ? (object)DBNull.Value : payment_Rows.transactionid.Substring(0, payment_Rows.transactionid.IndexOf("_")); ;
                                payment_DataRow["TRANSACTION_TYPE_CODE"] = payment_Rows.transactiontypecode.Equals(null) ? (object)DBNull.Value : payment_Rows.transactiontypecode;
                                payment_DataRow["TENDER_TYPE_CODE"] = payment_Rows.tendertypecode.Equals(null) ? (object)DBNull.Value : payment_Rows.tendertypecode;
                                payment_DataRow["TENDER_TYPE_DESC"] = payment_Rows.tendertypedesc.Equals(null) ? (object)DBNull.Value : payment_Rows.tendertypedesc;
                                payment_DataRow["TENDER_AMOUNT"] = payment_Rows.tenderamount.Equals(null) ? (object)DBNull.Value : Convert.ToDecimal(payment_Rows.tenderamount);
                                payment_DataRow["CHECK_ID"] = payment_Rows.checkID.Equals(null) ? (object)DBNull.Value : payment_Rows.checkID;
                                payment_DataRow["CHECK_CODE"] = payment_Rows.checkcode.Equals(null) ? (object)DBNull.Value : payment_Rows.checkcode;
                                DATATABLE_TISSL_PAYMENTS.Rows.Add(payment_DataRow);
                                if (payment_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || payment_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-PAYMENTS.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        try
                        {
                            var TISSL_SERVICE_CHARGE = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "SERVICE_CHARGE").ToArray();
                            foreach (var serviceCharges_Rows in TISSL_SERVICE_CHARGE)
                            {
                                DataRow serviceCharges_DataRow = DATATABLE_TISSL_SERVICE_CHARGES.NewRow();
                                serviceCharges_DataRow["TRANSACTION_ID"] = serviceCharges_Rows.transactionid.Equals(null) ? (object)DBNull.Value : serviceCharges_Rows.transactionid.Substring(0, serviceCharges_Rows.transactionid.IndexOf("_"));
                                serviceCharges_DataRow["CHECK_ID"] = serviceCharges_Rows.checkID.Equals(null) ? (object)DBNull.Value : serviceCharges_Rows.checkID;
                                serviceCharges_DataRow["CHECK_CODE"] = serviceCharges_Rows.checkcode.Equals(null) ? (object)DBNull.Value : serviceCharges_Rows.checkcode;
                                serviceCharges_DataRow["TRANSACTION_TYPE_CODE"] = serviceCharges_Rows.transactiontypecode.Equals(null) ? (object)DBNull.Value : serviceCharges_Rows.transactiontypecode;
                                serviceCharges_DataRow["TENDER_AMOUNT"] = serviceCharges_Rows.tenderamount.Equals(null) ? (object)DBNull.Value : serviceCharges_Rows.tenderamount;
                                DATATABLE_TISSL_SERVICE_CHARGES.Rows.Add(serviceCharges_DataRow);
                                if (serviceCharges_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || serviceCharges_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-SERVICE_CHARGE.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        try
                        {
                            var TISSL_CHARITY_DONATION = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "CHARITY_DONATION").ToArray();
                            foreach (var charity_Rows in TISSL_CHARITY_DONATION)
                            {
                                DataRow charity_DataRow = DATATABLE_TISSL_CHARITY.NewRow();
                                charity_DataRow["TRANSACTION_ID"] = charity_Rows.transactionid.Equals(null) ? (object)DBNull.Value : charity_Rows.transactionid.Substring(0, charity_Rows.transactionid.IndexOf("_"));
                                charity_DataRow["CHECK_ID"] = charity_Rows.checkID.Equals(null) ? (object)DBNull.Value : charity_Rows.checkID;
                                charity_DataRow["CHECK_CODE"] = charity_Rows.checkcode.Equals(null) ? (object)DBNull.Value : charity_Rows.checkcode;
                                charity_DataRow["TRANSACTION_TYPE_CODE"] = charity_Rows.transactiontypecode.Equals(null) ? (object)DBNull.Value : charity_Rows.transactiontypecode;
                                charity_DataRow["DEDUCTION_CODE"] = charity_Rows.deductioncode.Equals(null) ? (object)DBNull.Value : charity_Rows.deductioncode;
                                charity_DataRow["PRICE_PAID"] = charity_Rows.pricepaid.Equals(null) ? (object)DBNull.Value : charity_Rows.pricepaid;
                                DATATABLE_TISSL_CHARITY.Rows.Add(charity_DataRow);
                                if (charity_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || charity_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-CHARITY_DONATION.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        try
                        {
                            var TISSL_VOID_TRANS = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "VOID_TRANS").ToArray();
                            foreach (var void_Trans_Rows in TISSL_VOID_TRANS)
                            {
                                DataRow void_Trans_DataRow = DATATABLE_TISSL_VOID_TRANS.NewRow();
                                void_Trans_DataRow["TRANSACTION_ID"] = void_Trans_Rows.transactionid.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.transactionid.Substring(0, void_Trans_Rows.transactionid.IndexOf("_"));
                                void_Trans_DataRow["TREDING_DATE"] = void_Trans_Rows.tradingdate.Equals(null) ? (object)DBNull.Value : Convert.ToDateTime(void_Trans_Rows.tradingdate + " " + void_Trans_Rows.time);
                                void_Trans_DataRow["CHECK_ID"] = void_Trans_Rows.checkID.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.checkID;
                                void_Trans_DataRow["CHECK_CODE"] = void_Trans_Rows.checkcode.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.checkcode;
                                void_Trans_DataRow["TRANSACTION_TYPE_CODE"] = void_Trans_Rows.transactiontypecode.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.transactiontypecode;
                                void_Trans_DataRow["QTY"] = void_Trans_Rows.qty.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.qty;
                                void_Trans_DataRow["TAX"] = void_Trans_Rows.tax.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.tax;
                                void_Trans_DataRow["DEDUCTION"] = void_Trans_Rows.deduction.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.deduction;
                                void_Trans_DataRow["LIST_PRICE"] = void_Trans_Rows.listprice.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.listprice;
                                void_Trans_DataRow["PRICE_PAID"] = void_Trans_Rows.pricepaid.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.pricepaid;
                                void_Trans_DataRow["TENDER_AMOUNT"] = void_Trans_Rows.tenderamount.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.tenderamount;
                                void_Trans_DataRow["CUSTOM_FIELD_1"] = void_Trans_Rows.customfield1.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.customfield1;
                                void_Trans_DataRow["CUSTOM_FIELD_2"] = void_Trans_Rows.customfield2.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.customfield2;
                                void_Trans_DataRow["CUSTOM_FIELD_3"] = void_Trans_Rows.customfield3.Equals(null) ? (object)DBNull.Value : void_Trans_Rows.customfield3;
                                DATATABLE_TISSL_VOID_TRANS.Rows.Add(void_Trans_DataRow);
                                if (void_Trans_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || void_Trans_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-_VOID_TRANS.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        try
                        {
                            var TISSL_REFUND = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "REFUND_TRANS").ToArray();
                            foreach (var refund_Rows in TISSL_REFUND)
                            {
                                DataRow refund_DataRow = DATATABLE_TISSL_REFUND_TRANS.NewRow();
                                refund_DataRow["TRANSACTION_ID"] = refund_Rows.transactionid.Equals(null) ? (object)DBNull.Value : refund_Rows.transactionid.Substring(0, refund_Rows.transactionid.IndexOf("_"));
                                refund_DataRow["CHECK_ID"] = refund_Rows.checkID.Equals(null) ? (object)DBNull.Value : refund_Rows.checkID;
                                refund_DataRow["CHECK_CODE"] = refund_Rows.checkcode.Equals(null) ? (object)DBNull.Value : refund_Rows.checkcode;
                                refund_DataRow["TRANSACTION_TYPE_CODE"] = refund_Rows.transactiontypecode.Equals(null) ? (object)DBNull.Value : refund_Rows.transactiontypecode;
                                refund_DataRow["QTY"] = refund_Rows.qty.Equals(null) ? (object)DBNull.Value : refund_Rows.qty;
                                refund_DataRow["TAX"] = refund_Rows.tax.Equals(null) ? (object)DBNull.Value : refund_Rows.tax;
                                refund_DataRow["DEDUCTION"] = refund_Rows.deduction.Equals(null) ? (object)DBNull.Value : refund_Rows.deduction;
                                refund_DataRow["LIST_PRICE"] = refund_Rows.listprice.Equals(null) ? (object)DBNull.Value : refund_Rows.listprice;
                                refund_DataRow["PRICE_PAID"] = refund_Rows.pricepaid.Equals(null) ? (object)DBNull.Value : refund_Rows.pricepaid;
                                refund_DataRow["TENDER_AMOUNT"] = refund_Rows.tenderamount.Equals(null) ? (object)DBNull.Value : refund_Rows.tenderamount;
                                DATATABLE_TISSL_REFUND_TRANS.Rows.Add(refund_DataRow);
                                if (refund_Rows.terminaldesc.ToLower() == "TISSL Training".ToLower() || refund_Rows.customfield1.ToLower() == "Training".ToLower())
                                {
                                    IS_TRAINING = true;
                                }
                                else
                                    IS_TRAINING = false;
                            }
                        }
                        catch (Exception ex)
                        {
                            error_Detail_String += "\nError-REFUND.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString(); ;
                            cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                            throw;
                        }
                        if (IS_TRAINING == false)
                        {
                            var OPEN_TAB = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "TAB_OPEN").ToArray();
                            var CLOSE_TAB = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "TAB_CLOSE").ToArray();
                            var CHARITY_DONATION = tissl_Response.Where(p => p.checkID == TISSL_ROW.checkID && p.transactiontypecode == "CHARITY_DONATION").ToArray();
                            if (OPEN_TAB.Length > 0)
                            {
                                try
                                {
                                    DataRow header_DataRow = DATATABLE_TISSL_HEADER.NewRow();
                                    header_DataRow["TRANSACTION_ID"] = OPEN_TAB[0].transactionid == null ? (object)DBNull.Value : OPEN_TAB[0].transactionid.Substring(0, OPEN_TAB[0].transactionid.IndexOf("_"));
                                    header_DataRow["OPEN_TIME"] = OPEN_TAB[0].tradingdate == null ? (object)DBNull.Value : Convert.ToDateTime(OPEN_TAB[0].tradingdate + " " + OPEN_TAB[0].time);
                                    header_DataRow["CLOSE_TIME"] = CLOSE_TAB[0].tradingdate == null ? (object)DBNull.Value : Convert.ToDateTime(CLOSE_TAB[0].tradingdate + " " + CLOSE_TAB[0].time);
                                    header_DataRow["OPEN_TERMINAL_CODE"] = OPEN_TAB[0].terminalcode == null ? (object)DBNull.Value : OPEN_TAB[0].terminalcode;
                                    header_DataRow["CLOSE_TERMINAL_CODE"] = CLOSE_TAB[0].terminalcode == null ? (object)DBNull.Value : CLOSE_TAB[0].terminalcode;
                                    header_DataRow["OPEN_TERMINAL_DESC"] = OPEN_TAB[0].terminaldesc == null ? (object)DBNull.Value : OPEN_TAB[0].terminaldesc;
                                    header_DataRow["CLOSE_TERMINAL_DESC"] = CLOSE_TAB[0].terminaldesc == null ? (object)DBNull.Value : CLOSE_TAB[0].terminaldesc;
                                    header_DataRow["RECEIPT_CODE"] = OPEN_TAB[0].receiptcode == null ? (object)DBNull.Value : OPEN_TAB[0].receiptcode;
                                    header_DataRow["CHECK_CODE"] = OPEN_TAB[0].checkcode == null ? (object)DBNull.Value : OPEN_TAB[0].checkcode;
                                    header_DataRow["CHECK_ID"] = OPEN_TAB[0].checkID == null ? (object)DBNull.Value : OPEN_TAB[0].checkID;
                                    header_DataRow["REVENUE_CENTRE_CODE"] = OPEN_TAB[0].revenuecentrecode == null ? (object)DBNull.Value : OPEN_TAB[0].revenuecentrecode;
                                    header_DataRow["REVENUE_CENTRE_DESC"] = OPEN_TAB[0].revenuecentredesc == null ? (object)DBNull.Value : OPEN_TAB[0].revenuecentredesc;
                                    header_DataRow["TABLE_CODE"] = OPEN_TAB[0].tablecode == null ? (object)DBNull.Value : OPEN_TAB[0].tablecode;
                                    header_DataRow["COVERS"] = OPEN_TAB[0].covers.Equals(null) ? (object)DBNull.Value : OPEN_TAB[0].covers;
                                    header_DataRow["TOTAL_QUANTITY"] = CLOSE_TAB[0].qty.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].qty;
                                    header_DataRow["CURRENCY"] = OPEN_TAB[0].currency == null ? (object)DBNull.Value : OPEN_TAB[0].currency;
                                    header_DataRow["TOTAL_LIST_PRICE"] = CLOSE_TAB[0].listprice.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].listprice;
                                    header_DataRow["TOTAL_TAX"] = CLOSE_TAB[0].tax.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].tax;
                                    header_DataRow["TOTAL_PRICE_PAID"] = CLOSE_TAB[0].pricepaid.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].pricepaid;
                                    header_DataRow["TOTAL_TENDER_AMOUNT"] = CLOSE_TAB[0].tenderamount.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].tenderamount;
                                    header_DataRow["TOTAL_DEDUCTION"] = CLOSE_TAB[0].deduction.Equals(null) ? (object)DBNull.Value : CLOSE_TAB[0].deduction;
                                    header_DataRow["TOTAL_CHARITY_DONATION"] = CHARITY_DONATION.Length > 0 ? CHARITY_DONATION.AsEnumerable().Select(x => (decimal)x.pricepaid).Sum() : 0;
                                    header_DataRow["ORDER_TYPE"] = CLOSE_TAB[0].ordertypedesc == null ? (object)DBNull.Value : CLOSE_TAB[0].ordertypedesc;
                                    header_DataRow["OPEN_TAB_OWNER_DESC"] = OPEN_TAB[0].tabownerdesc == null ? (object)DBNull.Value : OPEN_TAB[0].tabownerdesc;
                                    header_DataRow["CLOSE_TAB_OWNER_DESC"] = CLOSE_TAB[0].tabownerdesc == null ? (object)DBNull.Value : CLOSE_TAB[0].tabownerdesc;
                                    header_DataRow["ORIGINAL_OPEN_TAB_OWNER"] = OPEN_TAB[0].originaltabowner == null ? (object)DBNull.Value : OPEN_TAB[0].originaltabowner;
                                    header_DataRow["ORIGINAL_CLOSE_TAB_OWNER"] = CLOSE_TAB[0].originaltabowner == null ? (object)DBNull.Value : CLOSE_TAB[0].originaltabowner;
                                    header_DataRow["IS_TRAINING"] = IS_TRAINING == true ? true : false;
                                    DATATABLE_TISSL_HEADER.Rows.Add(header_DataRow);
                                    IS_TRAINING = false;
                                }
                                catch (Exception ex)
                                {
                                    error_Detail_String += "Error-HEADER.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString();
                                    cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                                    throw;
                                }
                            }
                        }
                        if (IS_TRAINING == true)
                        {
                            try
                            {
                                DataRow header_DataRow = DATATABLE_TISSL_HEADER.NewRow();
                                header_DataRow["TRANSACTION_ID"] = TISSL_ROW.transactionid == null ? (object)DBNull.Value : TISSL_ROW.transactionid.Substring(0, TISSL_ROW.transactionid.IndexOf("_")); ;
                                header_DataRow["OPEN_TIME"] = (object)DBNull.Value;
                                header_DataRow["CLOSE_TIME"] = (object)DBNull.Value;
                                header_DataRow["OPEN_TERMINAL_CODE"] = (object)DBNull.Value;
                                header_DataRow["CLOSE_TERMINAL_CODE"] = (object)DBNull.Value;
                                header_DataRow["OPEN_TERMINAL_DESC"] = (object)DBNull.Value;
                                header_DataRow["CLOSE_TERMINAL_DESC"] = (object)DBNull.Value;
                                header_DataRow["RECEIPT_CODE"] = (object)DBNull.Value;
                                header_DataRow["CHECK_CODE"] = TISSL_ROW.checkcode == null ? (object)DBNull.Value : TISSL_ROW.checkcode;
                                header_DataRow["CHECK_ID"] = TISSL_ROW.checkID == null ? (object)DBNull.Value : TISSL_ROW.checkID;
                                header_DataRow["REVENUE_CENTRE_CODE"] = (object)DBNull.Value;
                                header_DataRow["REVENUE_CENTRE_DESC"] = (object)DBNull.Value;
                                header_DataRow["TABLE_CODE"] = (object)DBNull.Value;
                                header_DataRow["COVERS"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_QUANTITY"] = (object)DBNull.Value;
                                header_DataRow["CURRENCY"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_LIST_PRICE"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_TAX"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_PRICE_PAID"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_TENDER_AMOUNT"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_DEDUCTION"] = (object)DBNull.Value;
                                header_DataRow["TOTAL_CHARITY_DONATION"] = (object)DBNull.Value;
                                header_DataRow["ORDER_TYPE"] = (object)DBNull.Value;
                                header_DataRow["OPEN_TAB_OWNER_DESC"] = (object)DBNull.Value;
                                header_DataRow["CLOSE_TAB_OWNER_DESC"] = (object)DBNull.Value;
                                header_DataRow["ORIGINAL_OPEN_TAB_OWNER"] = (object)DBNull.Value;
                                header_DataRow["ORIGINAL_CLOSE_TAB_OWNER"] = (object)DBNull.Value;
                                header_DataRow["IS_TRAINING"] = true;
                                DATATABLE_TISSL_HEADER.Rows.Add(header_DataRow);

                            }
                            catch (Exception ex)
                            {
                                error_Detail_String += "Error-HEADER.Start_date:-" + Start_date.ToString() + "End_date:-" + End_date.ToString() + "CHECK_ID:-" + TISSL_ROW.checkID.ToString() + ex.ToString();
                                cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                                throw;
                            }
                        }
                        counter++;
                        IS_TRAINING = false;
                    }

                    DS_TISSL.Tables.Add(DATATABLE_TISSL_HEADER);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_LINE);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_PAYMENTS);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_SERVICE_CHARGES);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_CHARITY);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_VOID_TRANS);
                    DS_TISSL.Tables.Add(DATATABLE_TISSL_REFUND_TRANS);

                    //DS_TISSL.Tables.Add(DATATABLE_TISSL_MODIFIRES);
                    //DS_TISSL.Tables.Add(DATATABLE_TISSL_TIPS);
                    //DS_TISSL.Tables.Add(DATATABLE_TISSL_TENDER_REFUND);
                    //DS_TISSL.Tables.Add(DATATABLE_TISSL_VOID_ITEMS);
                    //DS_TISSL.Tables.Add(DATATABLE_TISSL_DISCOUNTS);
                    return DS_TISSL;
                }
                else
                {
                    cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                    cashup.CashupModelObj.ERROR_MESSAGE = response.StatusCode.ToString();
                    return null;
                }
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = error_Detail_String;
                throw;
            }
        }
        int SubmitdataFromTissl(DataSet FinancialData, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BEANCH_ID)
        {
            Cashup _ICashUp = new Cashup();
            try
            {
                //Save Data in Database
                if (FinancialData.Tables.Count > 0 && FinancialData.Tables[0].Rows.Count > 0 && FinancialData.Tables[1].Rows.Count > 0) //(dtx.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("TISSL_HEADER ROW COUNT:" + FinancialData.Tables[0].Rows.Count.ToString() + ", TISSL_LINES ROW COUNT:" + FinancialData.Tables[1].Rows.Count.ToString() +
                        ", TISSL_PAYMENTS ROW COUNT:" + FinancialData.Tables[2].Rows.Count.ToString() + "TISSL_SERVICE_CHARGES ROW COUNT:" + FinancialData.Tables[3].Rows.Count.ToString() + "TISSL_CHARITY ROW COUNT:" + FinancialData.Tables[4].Rows.Count.ToString() +
                        "TISSL_VOID_TRANS ROW COUNT:" + FinancialData.Tables[4].Rows.Count.ToString() + "TISSL_REFUND_TRANS ROW COUNT:" + FinancialData.Tables[5].Rows.Count.ToString()); 

                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BEANCH_ID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.TISSL_HEADER = FinancialData.Tables[0];
                    _ICashUp.CashupModelObj.TISSL_LINES = FinancialData.Tables[1];
                    _ICashUp.CashupModelObj.TISSL_PAYMENTS = FinancialData.Tables[2];
                    _ICashUp.CashupModelObj.TISSL_SERVICE_CHARGES = FinancialData.Tables[3];
                    _ICashUp.CashupModelObj.TISSL_CHARITY = FinancialData.Tables[4];
                    _ICashUp.CashupModelObj.TISSL_VOID_TRANS = FinancialData.Tables[5];
                    _ICashUp.CashupModelObj.TISSL_REFUND_TRANS = FinancialData.Tables[6];
                    _ICashUp.INS_UPD_TISSL_CASHUP_DATA();

                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
    public class TisslRoot
    {
        public string transactionid { get; set; }
        public string unitid { get; set; }
        public string sitelocationcode { get; set; }
        public string tradingdate { get; set; }
        public string time { get; set; }
        public string timefact { get; set; }
        public string terminalcode { get; set; }
        public string terminaldesc { get; set; }
        public string recordactivitycode { get; set; }
        public string receiptcode { get; set; }
        public string checkcode { get; set; }
        public string tablecode { get; set; }
        public string revenuecentrecode { get; set; }
        public string revenuecentredesc { get; set; }
        public string transactiontypecode { get; set; }
        public string salesitemid { get; set; }
        public string salesitemPLU { get; set; }
        public string salesitemGUID { get; set; }
        public string salesitemdesc { get; set; }
        public string tendertypecode { get; set; }
        public string tendertypedesc { get; set; }
        public string deductioncode { get; set; }
        public string deductiondesc { get; set; }
        public decimal covers { get; set; }
        public decimal qty { get; set; }
        public string currency { get; set; }
        public decimal listprice { get; set; }
        public decimal tax { get; set; }
        public decimal pricepaid { get; set; }
        public decimal deduction { get; set; }
        public decimal tenderamount { get; set; }
        public decimal costpricetheo { get; set; }
        public decimal listpriceconv { get; set; }
        public decimal taxconv { get; set; }
        public decimal pricepaidconv { get; set; }
        public decimal deductionconv { get; set; }
        public decimal tenderamountconv { get; set; }
        public decimal costpricetheoconv { get; set; }
        public string ordertypedesc { get; set; }
        public string menuband { get; set; }
        public string majorgroupdesc { get; set; }
        public string familygroupdesc { get; set; }
        public string subgroupdesc { get; set; }
        public string tabowner { get; set; }
        public string tabownerdesc { get; set; }
        public string originaltabowner { get; set; }
        public string originaltabownerdesc { get; set; }
        public string oldtablecode { get; set; }
        public string prevtransactioncode { get; set; }
        public string authorisedby { get; set; }
        public string textfield { get; set; }
        public string guestdesc { get; set; }
        public string guestcode { get; set; }
        public string timesenttoprep { get; set; }
        public string bumptime { get; set; }
        public string universaltimeslotid { get; set; }
        public string timeslotdesc { get; set; }
        public string transactionstartend { get; set; }
        public string isDeleted { get; set; }
        public string customfield1 { get; set; }
        public string customfield2 { get; set; }
        public string customfield3 { get; set; }
        public string customfact1 { get; set; }
        public string customfact2 { get; set; }
        public string datefact { get; set; }
        public string checkID { get; set; }
        public string customfield4 { get; set; }
        public string customfield5 { get; set; }
        public string customfield6 { get; set; }
        public string customfield7 { get; set; }
        public string customfield8 { get; set; }
        public string customfield9 { get; set; }
        public string customfield10 { get; set; }
    }

}
