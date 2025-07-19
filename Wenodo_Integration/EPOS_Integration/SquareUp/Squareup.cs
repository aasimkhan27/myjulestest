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
using EPOS_Integration.SquareUp;
using static EPOS_Integration.SquareUp.SquareupModel;
using System.Collections.Specialized;
using EPOS_Integration.EPOS_SALES;

namespace EPOS_Integration.SquareUp
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class Squareup
    {
        string URL = string.Empty;
        string Access_Token = string.Empty;

        #region --SQUAREUP DATATABLE--
        DataTable SQUARE_UP_ORDERS_TYPE = null;
        DataTable SQUARE_UP_ORDERS_LINE_ITEMS_TYPE = null;
        DataTable SQUARE_UP_ORDERS_PAYMENTS_TYPE = null;
        DataTable SQUARE_UP_CATEGORY_TYPE = null;
        DataTable SQUARE_UP_CATEGORY_FOE_EPOS_SALES = null;
        DataTable SQUARE_UP_CATALOGUE_ITEM_TYPE = null;
        DataTable SQUARE_UP_LOCATION = null;
        DataTable SQUARE_UP_ORDERS_DISCOUNTS_TYPE = null;
        DataSet DS_ORDERS_LINE_DATA = null;
        DataSet DS_ORDERS_CATALOG_AND_ITEM_DATA = new DataSet();
        String SQR_UP_LICATION_ID = string.Empty;
        public void CREATE_SQUARE_UP_ORDERS_TYPE_TABLES()
        {
            SQUARE_UP_ORDERS_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("LOCATION_ID", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CREATED_AT", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UPDATED_AT", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STATE", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_TAX_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_DISCOUNT_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_TIP_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CLOSED_AT", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_SERVICE_CHARGE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RETURN_TOTAL_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RETURN_TAX_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RETURN_DISCOUNT_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RETURN_SERVICE_CHARGE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RETURN_TIP_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TICKET_NAME", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_AMOUNT_DUE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CURRENCY", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("UID", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("CATALOG_OBJECT_ID", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("NAME", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("PERCENTAGE", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("APPLIED_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("TYPE", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("SCOPE", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_TOTAL_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_TAX_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_DISCOUNT_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_TIP_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET_SERVICE_CHARGE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SOURCE_ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
            //COLUMN = new DataColumn("SERVICE_CHARGE_DISCOUNTS", typeof(string)); SQUARE_UP_ORDERS_TYPE.Columns.Add(COLUMN);
        }
        public void CREATE_SQUARE_UP_ORDERS_LINE_ITEMS_TYPE_TABLE()
        {
            SQUARE_UP_ORDERS_LINE_ITEMS_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SOURCE_ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATALOG_OBJECT_ID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATALOG_VERSION", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("QUANTITY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NAME", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VARIATION_NAME", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("BASE_PRICE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("GROSS_SALES_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("GROSS_RETURN_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_TAX_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_DISCOUNT_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VARIATION_TOTAL_PRICE_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_TYPE", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("APPLIED_TAXES", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);     
            COLUMN = new DataColumn("CATEGORY_ID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);            
            COLUMN = new DataColumn("SOURCE_LINE_ITEM_UID", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);            
            COLUMN = new DataColumn("TAX_NAME", typeof(string)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);            
            COLUMN = new DataColumn("TAX_PERCENTAGE", typeof(decimal)); SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Columns.Add(COLUMN);            
        }
        public void CREATE_SQUARE_UP_ORDERS_PAYMENTS_TYPE_TABLE()
        {
            SQUARE_UP_ORDERS_PAYMENTS_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_ID", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CREATED_AT", typeof(DateTime)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UPDATED_AT", typeof(DateTime)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("AMOUNT_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STATUS", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SOURCE_TYPE", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CARD_BRAND", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CARD_TYPE", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("LOCATION_ID", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PROCESSING_AMOUNT", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("APPROVED_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("RECEIPT_NUMBER", typeof(string)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("REFUND_AMOUNT", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TIP_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_PAYMENTS_TYPE.Columns.Add(COLUMN);
        }
        public void CREATE_SQUARE_UP_LOCATION()
        {
            SQUARE_UP_LOCATION = new DataTable();
            DataColumn COLUMN = new DataColumn("ID", typeof(string)); SQUARE_UP_LOCATION.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NAME", typeof(string)); SQUARE_UP_LOCATION.Columns.Add(COLUMN);
        }
        public void CREATE_SQUARE_UP_CATEGORY()
        {
            SQUARE_UP_CATEGORY_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("TYPE", typeof(string)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_ID", typeof(string)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UPDATED_AT", typeof(string)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CREATED_AT", typeof(string)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VERSION", typeof(int)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("IS_DELETED", typeof(int)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PRESENT_AT_ALL_LOCATIONS", typeof(int)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_NAME", typeof(string)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_ORDINAL", typeof(int)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_IS_TOP_LEVEL", typeof(int)); SQUARE_UP_CATEGORY_TYPE.Columns.Add(COLUMN);
        }
        public void CREATE_QUARE_UP_CATEGORY_FOE_EPOS_SALES()
        {
            SQUARE_UP_CATEGORY_FOE_EPOS_SALES = new DataTable();
            DataColumn COLUMN = new DataColumn("TYPE", typeof(string)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_ID", typeof(string)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UPDATED_AT", typeof(string)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CREATED_AT", typeof(string)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VERSION", typeof(int)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("IS_DELETED", typeof(int)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PRESENT_AT_ALL_LOCATIONS", typeof(int)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_NAME", typeof(string)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_ORDINAL", typeof(int)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_DATA_IS_TOP_LEVEL", typeof(int)); SQUARE_UP_CATEGORY_FOE_EPOS_SALES.Columns.Add(COLUMN);
        }
        public void CREATE_SQUARE_UP_CATALOGUE_ITEM()
        {
            SQUARE_UP_CATALOGUE_ITEM_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("CATALOGUE_ITEM_ID", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UPDATED_AT", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CREATED_AT", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VERSION", typeof(int)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("IS_DELETED", typeof(int)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATALOG_V1_IDS", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_NAME", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_DESCRIPTION", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_LABEL_COLOR", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_VISIBILITY", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_CATEGORY_ID", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_PRODUCT_TYPE", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_SKIP_MODIFIER_SCREEN", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_ECOM_VISIBILITY", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_DESCRIPTION_HTML", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ITEM_DATA_DESCRIPTION_PLAINTEXT", typeof(string)); SQUARE_UP_CATALOGUE_ITEM_TYPE.Columns.Add(COLUMN);

        }
        public void CREATE_SQUARE_UP_ORDERS_DISCOUNTS_ITEM()
        {
            SQUARE_UP_ORDERS_DISCOUNTS_TYPE = new DataTable();
            DataColumn COLUMN = new DataColumn("UID", typeof(string)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NAME", typeof(string)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PERCENTAGE", typeof(decimal)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("APPLIED_MONEY", typeof(decimal)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TYPE", typeof(string)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SCOPE", typeof(string)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ORDER_ID", typeof(string)); SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Columns.Add(COLUMN);
        }
        public void CREATE_COMMON_TABLE()
        {
            CREATE_SQUARE_UP_LOCATION();
            CREATE_SQUARE_UP_ORDERS_TYPE_TABLES();
            CREATE_SQUARE_UP_ORDERS_LINE_ITEMS_TYPE_TABLE();
            CREATE_SQUARE_UP_ORDERS_PAYMENTS_TYPE_TABLE();
            CREATE_SQUARE_UP_CATEGORY();
            CREATE_SQUARE_UP_CATALOGUE_ITEM();
            CREATE_SQUARE_UP_ORDERS_DISCOUNTS_ITEM();
            CREATE_QUARE_UP_CATEGORY_FOE_EPOS_SALES();
        }

        #endregion
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            
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
                    string Cashup_start_date = Cashup_date + "T00:00:00";// + Convert.ToString(dr_session["SESSION_START"]) + "+00:00";
                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();
                    DataSet SQUAREUP = null;
                    try
                    {
                        SaveSquareupDataToDBCategory(dtIntegrationData, ref Obj);
                       
                        SQUAREUP = FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj);
                        if (SQUAREUP != null)
                        {
                            if (SQUAREUP.Tables.Count > 0)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFromSquareUp(SQUAREUP, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Obj.CashupModelObj.BRANCH_ID); ;
                                if (INTEGRATION_STATUS == 2)
                                {
                                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                                    

                                    if (Obj.CashupModelObj.INTEGRATION_STATUS == 0)
                                    {
                                        DataTable SQ_CATALOG = new DataTable();
                                        SQ_CATALOG =  Obj.CashupModelObj.SQUARE_UP_CATEGORY_TYPE.Copy();
                                        SQ_CATALOG.TableName = "SQ_CATALOG"; 
                                        
                                        SQUAREUP.Tables.Add(SQ_CATALOG);
                                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                                        transformData.DataTransform(IntegrationSource.SQUAREUP, dtIntegrationData, SQUAREUP, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                    }
                                    else
                                    {
                                        LogExceptions.LogInfo("Error while Refetch Catalog Item for EPOS_SALES");
                                    }
                                    INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                }
                            }
                            else
                            {
                                INTEGRATION_STATUS = 4;
                            }

                            Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                            //Obj.CashupModelObj.ERROR_MESSAGE = "";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        else
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                            //Obj.CashupModelObj.ERROR_MESSAGE = "";
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("SaveDataToDB - SQUAREUP - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }

                }
            }
        }
        public void SaveSquareupDataToDBCategory(DataTable dt_IntegrationDetails,ref Cashup obj_Cashup)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            Obj.CashupModelObj.USER_ID = 1;
            int INTEGRATION_STATUS = 0;
            CREATE_COMMON_TABLE();
            String cursor = string.Empty;
            DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Clear();
            try
            {


                foreach (DataRow dr in dt_IntegrationDetails.Rows)
                {
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                    DS_ORDERS_CATALOG_AND_ITEM_DATA = new DataSet();
                    SQUARE_UP_CATALOG(dr);
                    //As discussed no need of items only catagory required
                    //SQUARE_UP_CATALOGUE_ITEM(dr);
                    //DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Add(SQUARE_UP_CATALOGUE_ITEM_TYPE);
                    DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Add(SQUARE_UP_CATEGORY_TYPE);

                    if (DS_ORDERS_CATALOG_AND_ITEM_DATA != null && DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Count > 0)
                    {

                        INTEGRATION_STATUS = INS_UPD_SQUARE_UP_CATALOG_AND_ITEMS(DS_ORDERS_CATALOG_AND_ITEM_DATA, dr);
                        obj_Cashup.CashupModelObj.SQUARE_UP_CATEGORY_TYPE = SQUARE_UP_CATEGORY_TYPE;
                    }
                    //else
                    //{
                    //    INTEGRATION_STATUS = 4;
                    //}
                    //Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                    //Obj.CashupModelObj.ERROR_MESSAGE = "";
                    //Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();


                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQUAREUP CATALOG ITEM ERROE--- ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = "SQUAREUP CATALOG ITEM ERROE:--"+ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }

        }
        DataSet FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup _ICashUp)
        {
            DS_ORDERS_LINE_DATA = new DataSet();
            CREATE_COMMON_TABLE();
            String cursor = string.Empty;
            try
            {
                do
                {
                    var client = new WebClient();
                    var body = "";
                    
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                    client.UseDefaultCredentials = true;
                    client.Credentials = CredentialCache.DefaultCredentials;
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]));
                    client.Headers.Add("Content-Type", "application/json");

                    Root_Body _body =new Root_Body();
                    _body.cursor = cursor;
                    _body.location_ids = new List<string>() { dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString() };
                    _body.query = new Query() {
                        filter=new Filter() {
                            date_time_filter=new DateTimeFilter() {
                                created_at=new Created_at() {
                                    start_at= Start_date,
                                    end_at= End_date
                                }
                            },                           
                            state_filter = new StateFilter()
                            {
                                states = new List<string>() { "COMPLETED", "CANCELED","OPEN" }
                            }
                        }
                    };

                    body = Newtonsoft.Json.JsonConvert.SerializeObject(_body);                  

                    //body = @"{""cursor"":""CURSOR_ID"",""location_ids"": [""SQR_UP_LICATION_ID""],""query"":{""filter"":{""state_filter"": {""states"": [""COMPLETED"",""CANCELED""]},""date_time_filter"":{""created_at"": {""end_at"": ""End_date"",""start_at"": ""Start_date""}}}}}";
                    //body = body.Replace("SQR_UP_LICATION_ID", dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString());
                    //body = body.Replace("Start_date", Start_date);
                    //body = body.Replace("End_date", End_date);
                    //body = body.Replace("CURSOR_ID", cursor);
                    var response = client.UploadString("https://connect.squareup.com/v2/orders/search", "post", body);
                    Order_Root order_Root = JsonConvert.DeserializeObject<Order_Root>(response);
                    cursor = order_Root.cursor == null ? "" : order_Root.cursor;

                    SQR_ORDER_ITEMS(order_Root);
                    SQR_ORDER_LINE_ITEMS(order_Root, dtIntegrationData);
                } while (cursor != "");

                SQR_PAYMENTS_ITEMS(Start_date, End_date, dtIntegrationData);

                DS_ORDERS_LINE_DATA.Tables.Add(SQUARE_UP_ORDERS_TYPE);
                DS_ORDERS_LINE_DATA.Tables.Add(SQUARE_UP_ORDERS_LINE_ITEMS_TYPE);
                DS_ORDERS_LINE_DATA.Tables.Add(SQUARE_UP_ORDERS_PAYMENTS_TYPE);
                DS_ORDERS_LINE_DATA.Tables.Add(SQUARE_UP_ORDERS_DISCOUNTS_TYPE);
                return DS_ORDERS_LINE_DATA;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("FetchFinancialDataByTime - SQUAREUP - ", ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                DS_ORDERS_LINE_DATA.Tables.Clear();
                return null;
                //throw;
            }
        }
        int SubmitdataFromSquareUp(DataSet FinancialData, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BEANCH_ID)
        {
            Cashup _ICashUp = new Cashup();
            try
            {
                //Save Data in Database
                if (FinancialData.Tables.Count > 0 && FinancialData.Tables[0].Rows.Count > 0 ) //(dtx.Rows.Count > 0)
                {
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BEANCH_ID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.DATATABLE_SQUARE_UP_DS = FinancialData;
                    _ICashUp.INS_UPD_SQUARE_UP_ORDERS(FinancialData);
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
                DS_ORDERS_LINE_DATA.Tables.Clear();
                throw;
            }
        }
       
        public void SQR_ORDER_ITEMS(Order_Root order_Root)
        {
            try
            {
                if (order_Root.orders != null)
                {
                    foreach (var order in order_Root.orders)
                    {
                        if (order.state.ToLower() == "COMPLETED".ToLower())
                        {
                            DataRow DRORDER = SQUARE_UP_ORDERS_TYPE.NewRow();
                            DRORDER["ORDER_ID"] = order.id;
                            DRORDER["LOCATION_ID"] = order.location_id;
                            DRORDER["CREATED_AT"] = order.created_at;
                            DRORDER["UPDATED_AT"] = order.updated_at;
                            DRORDER["STATE"] = order.state;
                            DRORDER["TOTAL_TAX_MONEY"] = order.total_tax_money.amount;
                            DRORDER["TOTAL_DISCOUNT_MONEY"] = order.total_discount_money.amount;
                            DRORDER["TOTAL_TIP_MONEY"] = order.total_tip_money.amount;
                            DRORDER["TOTAL_MONEY"] = order.total_money.amount;
                            DRORDER["CLOSED_AT"] = order.closed_at;
                            DRORDER["TOTAL_SERVICE_CHARGE_MONEY"] = order.total_service_charge_money.amount;
                            DRORDER["RETURN_TOTAL_MONEY"] = order.return_amounts==null? (object)DBNull.Value : order.return_amounts.total_money.amount;
                            DRORDER["RETURN_TAX_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.tax_money.amount;
                            DRORDER["RETURN_DISCOUNT_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.discount_money.amount;
                            DRORDER["RETURN_SERVICE_CHARGE_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.service_charge_money.amount;
                            DRORDER["RETURN_TIP_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.tax_money.amount;
                            DRORDER["TICKET_NAME"] = order.ticket_name;
                            DRORDER["NET_AMOUNT_DUE_MONEY"] = order.net_amount_due_money.amount;
                            DRORDER["CURRENCY"] = order.net_amount_due_money.currency;
                                //DRORDER["UID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].uid;
                                //DRORDER["CATALOG_OBJECT_ID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].catalog_object_id;
                                //DRORDER["NAME"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].name;
                                //DRORDER["PERCENTAGE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].percentage;
                                //DRORDER["APPLIED_MONEY"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].applied_money.amount;
                                //DRORDER["TYPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].type;
                                //DRORDER["SCOPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].scope;
                            DRORDER["NET_TOTAL_MONEY"] = order.net_amounts.total_money.amount;
                            DRORDER["NET_TAX_MONEY"] =  order.net_amounts.tax_money.amount;
                            DRORDER["NET_DISCOUNT_MONEY"] = order.net_amounts.discount_money.amount;
                            DRORDER["NET_TIP_MONEY"] = order.net_amounts.tip_money.amount;
                            DRORDER["NET_SERVICE_CHARGE_MONEY"] =  order.net_amounts.service_charge_money.amount;
                            DRORDER["SOURCE_ORDER_ID"] = order.returns == null ? (object)DBNull.Value : order.returns[0].source_order_id;
                            //DRORDER["SERVICE_CHARGE_DISCOUNTS"] = order.service_charges == null ? (object)DBNull.Value : order.service_charges[0].percentage;
                            SQUARE_UP_ORDERS_TYPE.Rows.Add(DRORDER);
                           
                        }
                        else if (order.state.ToLower() == "CANCELED".ToLower())
                        {
                            DataRow DRORDER = SQUARE_UP_ORDERS_TYPE.NewRow();
                            DRORDER["ORDER_ID"] = order.id;
                            DRORDER["LOCATION_ID"] = order.location_id;
                            DRORDER["CREATED_AT"] = order.created_at;
                            DRORDER["UPDATED_AT"] = order.updated_at;
                            DRORDER["STATE"] = order.state;
                            DRORDER["TOTAL_TAX_MONEY"] = order.total_tax_money.amount;
                            DRORDER["TOTAL_DISCOUNT_MONEY"] = order.total_discount_money.amount;
                            DRORDER["TOTAL_TIP_MONEY"] = order.total_tip_money.amount;
                            DRORDER["TOTAL_MONEY"] = order.total_money.amount;
                            DRORDER["CLOSED_AT"] = DBNull.Value;
                            DRORDER["TOTAL_SERVICE_CHARGE_MONEY"] = order.total_service_charge_money.amount;
                            DRORDER["RETURN_TOTAL_MONEY"] = order.return_amounts==null?0:order.return_amounts.total_money.amount;
                            DRORDER["RETURN_TAX_MONEY"] = order.return_amounts == null ? 0 : order.return_amounts.tax_money.amount;
                            DRORDER["RETURN_DISCOUNT_MONEY"] = order.return_amounts == null ? 0 : order.return_amounts.discount_money.amount;
                            DRORDER["RETURN_SERVICE_CHARGE_MONEY"] = order.return_amounts == null ? 0 : order.return_amounts.service_charge_money.amount;
                            DRORDER["RETURN_TIP_MONEY"] = order.return_amounts == null ? 0 : order.return_amounts.tax_money.amount;
                            DRORDER["TICKET_NAME"] = order.ticket_name;
                            DRORDER["NET_AMOUNT_DUE_MONEY"] = order.net_amount_due_money.amount;
                            DRORDER["CURRENCY"] = order.net_amount_due_money.currency;
                                //DRORDER["UID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].uid;
                                //DRORDER["CATALOG_OBJECT_ID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].catalog_object_id;
                                //DRORDER["NAME"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].name;
                                //DRORDER["PERCENTAGE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].percentage;
                                //DRORDER["APPLIED_MONEY"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].applied_money.amount;
                                //DRORDER["TYPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].type;
                                //DRORDER["SCOPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].scope;
                            DRORDER["NET_TOTAL_MONEY"] = order.net_amounts.tax_money.amount;
                            DRORDER["NET_TAX_MONEY"] = order.net_amounts.tax_money.amount;
                            DRORDER["NET_DISCOUNT_MONEY"] = order.net_amounts.discount_money.amount;
                            DRORDER["NET_TIP_MONEY"] = order.net_amounts.tip_money.amount;
                            DRORDER["NET_SERVICE_CHARGE_MONEY"] = order.net_amounts.service_charge_money.amount;
                            DRORDER["SOURCE_ORDER_ID"] = order.returns == null ? (object)DBNull.Value : order.returns[0].source_order_id;
                            //["SERVICE_CHARGE_DISCOUNTS"] = order.service_charges == null ? (object)DBNull.Value : order.service_charges[0].percentage;
                            SQUARE_UP_ORDERS_TYPE.Rows.Add(DRORDER);
                        }
                        if (order.state.ToLower() == "OPEN".ToLower())
                        {
                            DataRow DRORDER = SQUARE_UP_ORDERS_TYPE.NewRow();
                            DRORDER["ORDER_ID"] = order.id;
                            DRORDER["LOCATION_ID"] = order.location_id;
                            DRORDER["CREATED_AT"] = order.created_at;
                            DRORDER["UPDATED_AT"] = order.updated_at;
                            DRORDER["STATE"] = order.state;
                            DRORDER["TOTAL_TAX_MONEY"] = order.total_tax_money.amount;
                            DRORDER["TOTAL_DISCOUNT_MONEY"] = order.total_discount_money.amount;
                            DRORDER["TOTAL_TIP_MONEY"] = order.total_tip_money.amount;
                            DRORDER["TOTAL_MONEY"] = order.total_money.amount;
                            DRORDER["CLOSED_AT"] = DBNull.Value; 
                            DRORDER["TOTAL_SERVICE_CHARGE_MONEY"] = order.total_service_charge_money.amount;
                            DRORDER["RETURN_TOTAL_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.total_money.amount;
                            DRORDER["RETURN_TAX_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.tax_money.amount;
                            DRORDER["RETURN_DISCOUNT_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.discount_money.amount;
                            DRORDER["RETURN_SERVICE_CHARGE_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.service_charge_money.amount;
                            DRORDER["RETURN_TIP_MONEY"] = order.return_amounts == null ? (object)DBNull.Value : order.return_amounts.tax_money.amount;
                            DRORDER["TICKET_NAME"] = order.ticket_name;
                            DRORDER["NET_AMOUNT_DUE_MONEY"] = order.net_amount_due_money.amount;
                            DRORDER["CURRENCY"] = order.net_amount_due_money.currency;
                            //DRORDER["UID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].uid;
                            //DRORDER["CATALOG_OBJECT_ID"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].catalog_object_id;
                            //DRORDER["NAME"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].name;
                            //DRORDER["PERCENTAGE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].percentage;
                            //DRORDER["APPLIED_MONEY"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].applied_money.amount;
                            //DRORDER["TYPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].type;
                            //DRORDER["SCOPE"] = order.discounts == null || order.discounts.Count == 0 ? (object)DBNull.Value : order.discounts[0].scope;
                            DRORDER["NET_TOTAL_MONEY"] = order.net_amounts.total_money.amount;
                            DRORDER["NET_TAX_MONEY"] = order.net_amounts.tax_money.amount;
                            DRORDER["NET_DISCOUNT_MONEY"] = order.net_amounts.discount_money.amount;
                            DRORDER["NET_TIP_MONEY"] = order.net_amounts.tip_money.amount;
                            DRORDER["NET_SERVICE_CHARGE_MONEY"] = order.net_amounts.service_charge_money.amount;
                            DRORDER["SOURCE_ORDER_ID"] = order.returns == null ? (object)DBNull.Value : order.returns[0].source_order_id;
                            //DRORDER["SERVICE_CHARGE_DISCOUNTS"] = order.service_charges == null ? (object)DBNull.Value : order.service_charges[0].percentage;
                            SQUARE_UP_ORDERS_TYPE.Rows.Add(DRORDER);

                        }
                        if (order.discounts !=null)
                        {
                            foreach (var discount in order.discounts)
                            {
                                DataRow DRDISCOUNT = SQUARE_UP_ORDERS_DISCOUNTS_TYPE.NewRow();
                                DRDISCOUNT["UID"] = discount.uid;
                                DRDISCOUNT["NAME"] = discount.name;
                                DRDISCOUNT["PERCENTAGE"] = discount.percentage ==null?(object)DBNull.Value: discount.percentage;
                                DRDISCOUNT["APPLIED_MONEY"] = discount.applied_money.amount;
                                DRDISCOUNT["TYPE"] = discount.type;
                                DRDISCOUNT["SCOPE"] = discount.scope;
                                DRDISCOUNT["ORDER_ID"] = order.id;
                                SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Rows.Add(DRDISCOUNT);
                            }
                        }
                        else if (order.returns != null)
                        {
                            foreach (var returns in order.returns)
                            {
                                if (returns.return_discounts != null)
                                {
                                    foreach (var returnDisc in returns.return_discounts)
                                    {
                                        DataRow DRDISCOUNT = SQUARE_UP_ORDERS_DISCOUNTS_TYPE.NewRow();
                                        DRDISCOUNT["UID"] = returnDisc.uid;
                                        DRDISCOUNT["NAME"] = returnDisc.name;
                                        DRDISCOUNT["PERCENTAGE"] = returnDisc.percentage == null ? (object)DBNull.Value : returnDisc.percentage; ;
                                        DRDISCOUNT["APPLIED_MONEY"] = returnDisc.applied_money.amount * -1;
                                        DRDISCOUNT["TYPE"] = returnDisc.type;
                                        DRDISCOUNT["SCOPE"] = returnDisc.scope;
                                        DRDISCOUNT["ORDER_ID"] = order.id;
                                        SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Rows.Add(DRDISCOUNT);
                                    }
                                }
                            }
                        }
                        else
                        {
                            DataRow DRDISCOUNT = SQUARE_UP_ORDERS_DISCOUNTS_TYPE.NewRow();
                            DRDISCOUNT["UID"] = (object)DBNull.Value;
                            DRDISCOUNT["NAME"] = (object)DBNull.Value;
                            DRDISCOUNT["PERCENTAGE"] = (object)DBNull.Value;
                            DRDISCOUNT["APPLIED_MONEY"] = (object)DBNull.Value;
                            DRDISCOUNT["TYPE"] = (object)DBNull.Value;
                            DRDISCOUNT["SCOPE"] = (object)DBNull.Value;
                            DRDISCOUNT["ORDER_ID"] = (object)DBNull.Value;
                            SQUARE_UP_ORDERS_DISCOUNTS_TYPE.Rows.Add(DRDISCOUNT);
                        }

                    }
                }      
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQR_ORDER_ITEMS - SQUAREUP - ", ex);
                SQUARE_UP_ORDERS_TYPE.Clear();
                throw;
            }
            
        }
        public void SQR_ORDER_LINE_ITEMS(Order_Root order_Root,DataTable dtIntegrationData)
        {
            try
            {
                Retrive_Catalog_Root retrive_Catalog_Root = null;

                if (order_Root.orders != null)
                {
                    foreach (var line in order_Root.orders)
                    {
                        if (line.line_items != null)
                        {
                            var order_id = line.id;
                            foreach (var line_items in line.line_items)
                            {
                                if (line_items.catalog_version != null)
                                {
                                    var client = new WebClient();
                                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                                    client.UseDefaultCredentials = true;
                                    client.Credentials = CredentialCache.DefaultCredentials;
                                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                                    client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]));
                                    client.QueryString.Add("catalog_version", line_items.catalog_version.ToString());
                                    client.QueryString.Add("include_related_objects", "true");
                                    var response = client.DownloadString("https://connect.squareup.com/v2/catalog/object/" + line_items.catalog_object_id.ToString());
                                    retrive_Catalog_Root = JsonConvert.DeserializeObject<Retrive_Catalog_Root>(response);
                                }
                                else
                                {
                                    retrive_Catalog_Root = null;
                                }


                                DataRow DRLINE = SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.NewRow();
                                DRLINE["ORDER_ID"] = line.id;
                                DRLINE["SOURCE_ORDER_ID"] = null;
                                DRLINE["UID"] = line_items.uid;
                                DRLINE["CATALOG_OBJECT_ID"] = line_items.catalog_object_id;
                                DRLINE["CATALOG_VERSION"] = line_items.catalog_version == null ? "" : line_items.catalog_version;
                                DRLINE["QUANTITY"] = line_items.quantity;
                                DRLINE["NAME"] = line_items.name;
                                DRLINE["VARIATION_NAME"] = line_items.variation_name;
                                DRLINE["BASE_PRICE_MONEY"] = line_items.base_price_money.amount;
                                DRLINE["GROSS_SALES_MONEY"] = line_items.gross_sales_money.amount;
                                DRLINE["GROSS_RETURN_MONEY"] = 0;
                                DRLINE["TOTAL_TAX_MONEY"] = line_items.total_tax_money.amount;
                                DRLINE["TOTAL_DISCOUNT_MONEY"] = line_items.total_discount_money.amount;
                                DRLINE["TOTAL_MONEY"] = line_items.total_money.amount;
                                DRLINE["VARIATION_TOTAL_PRICE_MONEY"] = line_items.variation_total_price_money.amount;
                                DRLINE["ITEM_TYPE"] = line_items.item_type;
                                DRLINE["APPLIED_TAXES"] = line_items.applied_taxes == null ? (object)DBNull.Value : line_items.applied_taxes[0].applied_money.amount;
                                
                                if (retrive_Catalog_Root == null)
                                {                                    
                                  DRLINE["CATEGORY_ID"] = (object)DBNull.Value;
                                }
                                else
                                {
                                    if (retrive_Catalog_Root.related_objects[0].item_data.category_id == null)
                                    {
                                        if (retrive_Catalog_Root.related_objects[0].item_data.categories != null)
                                        {
                                            DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.categories[0].id.ToString();
                                        }
                                        else {
                                            DRLINE["CATEGORY_ID"] = (object)DBNull.Value;
                                        }
                                    }
                                    else {
                                        DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.category_id.ToString();
                                    }
                                    //DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.category_id == null ? (object)DBNull.Value : retrive_Catalog_Root.related_objects[0].item_data.category_id.ToString();
                                }
                                DRLINE["SOURCE_LINE_ITEM_UID"] = (object)DBNull.Value;
                                if (line.taxes != null)
                                {
                                    foreach (var tax in line.taxes)
                                    {
                                        if (line_items.applied_taxes != null)
                                        {
                                            if (tax.uid == line_items.applied_taxes[0].tax_uid)
                                            {
                                                DRLINE["TAX_NAME"] = tax.name;
                                                DRLINE["TAX_PERCENTAGE"] = tax.percentage;
                                            }
                                            else
                                            {
                                                DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                                DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                            }
                                        }
                                        else
                                        {
                                            DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                            DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                        }
                                    }
                                }
                                else
                                {
                                    DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                    DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                }

                                SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Rows.Add(DRLINE);
                            }

                        }
                        else if (line.returns != null)
                        {
                            foreach (var return_line in line.returns)
                            {
                                var order_id = line.id;
                                foreach (var return_line_items in return_line.return_line_items)
                                {
                                    if (return_line_items.catalog_version != null)
                                    {
                                        var client = new WebClient();
                                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                                        client.UseDefaultCredentials = true;
                                        client.Credentials = CredentialCache.DefaultCredentials;
                                        client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                                        client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]));
                                        client.QueryString.Add("catalog_version", return_line_items.catalog_version.ToString());
                                        client.QueryString.Add("include_related_objects", "true");
                                        var response = client.DownloadString("https://connect.squareup.com/v2/catalog/object/" + return_line_items.catalog_object_id.ToString());
                                        retrive_Catalog_Root = JsonConvert.DeserializeObject<Retrive_Catalog_Root>(response);
                                    }
                                    else { retrive_Catalog_Root = null; }


                                    DataRow DRLINE = SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.NewRow();
                                    DRLINE["ORDER_ID"] = order_id;
                                    DRLINE["SOURCE_ORDER_ID"] = return_line.source_order_id;
                                    DRLINE["UID"] = return_line_items.uid;
                                    DRLINE["CATALOG_OBJECT_ID"] = return_line_items.catalog_object_id == null ? "" : return_line_items.catalog_object_id;
                                    DRLINE["CATALOG_VERSION"] = return_line_items.catalog_version == null ? "" : return_line_items.catalog_version;
                                    DRLINE["QUANTITY"] = return_line_items.quantity;
                                    DRLINE["NAME"] = return_line_items.name;
                                    DRLINE["VARIATION_NAME"] = return_line_items.variation_name == null ? "" : return_line_items.variation_name;
                                    DRLINE["BASE_PRICE_MONEY"] = return_line_items.base_price_money.amount;
                                    DRLINE["GROSS_SALES_MONEY"] = 0;
                                    DRLINE["GROSS_RETURN_MONEY"] = return_line_items.gross_return_money.amount;
                                    DRLINE["TOTAL_TAX_MONEY"] = return_line_items.total_tax_money.amount;
                                    DRLINE["TOTAL_DISCOUNT_MONEY"] = return_line_items.total_discount_money.amount;
                                    DRLINE["TOTAL_MONEY"] = return_line_items.total_money.amount;
                                    DRLINE["VARIATION_TOTAL_PRICE_MONEY"] = return_line_items.variation_total_price_money.amount;
                                    DRLINE["ITEM_TYPE"] = return_line_items.item_type;
                                    DRLINE["APPLIED_TAXES"] = 0;
                                    
                                    if (retrive_Catalog_Root == null)
                                    {
                                        DRLINE["CATEGORY_ID"] = (object)DBNull.Value;
                                    }
                                    else
                                    {
                                        if (retrive_Catalog_Root.related_objects[0].item_data.category_id == null)
                                        {
                                            if (retrive_Catalog_Root.related_objects[0].item_data.categories != null)
                                            {
                                                DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.categories[0].id.ToString();
                                            }
                                            else
                                            {
                                                DRLINE["CATEGORY_ID"] = (object)DBNull.Value;
                                            }
                                        }
                                        else
                                        {
                                            DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.category_id.ToString();
                                        }
                                        //DRLINE["CATEGORY_ID"] = retrive_Catalog_Root.related_objects[0].item_data.category_id == null ? (object)DBNull.Value : retrive_Catalog_Root.related_objects[0].item_data.category_id.ToString();
                                    }                                    
                                    DRLINE["SOURCE_LINE_ITEM_UID"] = return_line_items.source_line_item_uid == null ? (object)DBNull.Value : return_line_items.source_line_item_uid.ToString();
                                    if (return_line.return_taxes != null)
                                    {
                                        foreach (var tax in return_line.return_taxes)
                                        {
                                            if (return_line_items.applied_taxes != null)
                                            {
                                                if (tax.uid == return_line_items.applied_taxes[0].tax_uid)
                                                {
                                                    DRLINE["TAX_NAME"] = tax.name;
                                                    DRLINE["TAX_PERCENTAGE"] = tax.percentage;
                                                }
                                                else
                                                {
                                                    DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                                    DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                                }
                                            }
                                            else
                                            {
                                                DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                                DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                            }

                                        }
                                    }
                                    else
                                    {
                                        DRLINE["TAX_NAME"] = (object)DBNull.Value; ;
                                        DRLINE["TAX_PERCENTAGE"] = (object)DBNull.Value; ;
                                    }
                                    SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Rows.Add(DRLINE);
                                }
                                
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQR_ORDER_LINE_ITEMS - SQUAREUP - ", ex);
                SQUARE_UP_ORDERS_LINE_ITEMS_TYPE.Clear();
                //throw;
            }
            
        }
        public void SQR_PAYMENTS_ITEMS(string Start_date, string End_date, DataTable dtIntegrationData)
        {
            String cursor = string.Empty;
            try
            {
                do
                {
                    var client = new WebClient();
                    NameValueCollection obj = new NameValueCollection();
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                    client.UseDefaultCredentials = true;
                    client.Credentials = CredentialCache.DefaultCredentials;
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]));
                    obj.Add("location_id", dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString());
                    obj.Add("sort_order", "ASC");
                    obj.Add("begin_time", Start_date);
                    obj.Add("end_time", End_date);
                    if(cursor!="" && cursor != null)
                        obj.Add("cursor", cursor==""?"": cursor);

                    client.QueryString = obj;
                    var response = client.DownloadString("https://connect.squareup.com/v2/payments");
                    Payment_Root payment_Root = JsonConvert.DeserializeObject<Payment_Root>(response);
                    cursor = payment_Root.cursor;
                    if (payment_Root.payments != null)
                    {
                        foreach (var item in payment_Root.payments)
                        {
                            DataRow DRPAYMENTS = SQUARE_UP_ORDERS_PAYMENTS_TYPE.NewRow();
                            DRPAYMENTS["ORDER_ID"] = item.order_id.ToString();
                            DRPAYMENTS["PAYMENT_ID"] = item.id.ToString();
                            DRPAYMENTS["CREATED_AT"] = item.created_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.created_at.ToString();
                            DRPAYMENTS["UPDATED_AT"] = item.updated_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.updated_at.ToString();
                            DRPAYMENTS["AMOUNT_MONEY"] = Convert.ToDecimal(item.amount_money.amount);
                            DRPAYMENTS["STATUS"] = item.status.ToString();
                            DRPAYMENTS["SOURCE_TYPE"] = item.source_type.ToString();
                            DRPAYMENTS["CARD_BRAND"] = item.card_details == null ? (object)DBNull.Value : item.card_details.card.card_brand.ToString();
                            DRPAYMENTS["CARD_TYPE"] = item.card_details == null ? (object)DBNull.Value : item.card_details.card.card_type.ToString();
                            DRPAYMENTS["LOCATION_ID"] = item.location_id.ToString();
                            DRPAYMENTS["PROCESSING_AMOUNT"] = item.processing_fee == null ? (object)DBNull.Value : Convert.ToDecimal(item.processing_fee[0].amount_money.amount);
                            DRPAYMENTS["TOTAL_MONEY"] = Convert.ToDecimal(item.total_money.amount);
                            DRPAYMENTS["APPROVED_MONEY"] = item.approved_money == null ? (object)DBNull.Value : Convert.ToDecimal(item.approved_money.amount);
                            DRPAYMENTS["RECEIPT_NUMBER"] = item.receipt_number == null ? (object)DBNull.Value : item.receipt_number.ToString();
                            DRPAYMENTS["REFUND_AMOUNT"] = item.refunded_money == null ? (object)DBNull.Value : Convert.ToDecimal(item.refunded_money.amount);
                            DRPAYMENTS["TIP_MONEY"] = item.tip_money == null ? (object)DBNull.Value : Convert.ToDecimal(item.tip_money.amount);
                            SQUARE_UP_ORDERS_PAYMENTS_TYPE.Rows.Add(DRPAYMENTS);
                        }
                    }
                } while (cursor!=null);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQR_PAYMENTS_ITEMS - SQUAREUP - ", ex);
                SQUARE_UP_ORDERS_PAYMENTS_TYPE.Clear();
                throw;
            }            
        }
      
        public void SQR_REFUND_ITEMS()
        {
            String cursor = string.Empty;
            try
            {
                do
                {
                    var client = new WebClient();
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                    client.UseDefaultCredentials = true;
                    client.Credentials = CredentialCache.DefaultCredentials;
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("Authorization", "Bearer EAAAFIyamNu7ilX6sfZX90BPwTBUQTeg5oA96YDxOX14WMbo_84V9lP41AQIVXTQ");
                    client.QueryString.Add("location_id", SQR_UP_LICATION_ID);
                    client.QueryString.Add("sort_order", "ASC");
                    client.QueryString.Add("begin_time", "2021-07-31T00:00:00Z");
                    client.QueryString.Add("end_time", "2022-07-31T23:59:59Z");
                    if (cursor != "" && cursor != null)
                        client.QueryString.Add("cursor", cursor == "" ? "" : cursor);

                    var response = client.DownloadString("https://connect.squareup.com/v2/refunds");
                    Refund_Root refund_Root = JsonConvert.DeserializeObject<Refund_Root>(response);
                    cursor = refund_Root.cursor;
                    if (refund_Root.refunds != null)
                    {
                        foreach (var item in refund_Root.refunds)
                        {
                            //DataRow DRPAYMENTS = SQUARE_UP_ORDERS_PAYMENTS_TYPE.NewRow();
                            //DRPAYMENTS["ORDER_ID"] = item.order_id.ToString();
                            //DRPAYMENTS["PAYMENT_ID"] = item.id.ToString();
                            //DRPAYMENTS["CREATED_AT"] = item.created_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.created_at.ToString();
                            //DRPAYMENTS["UPDATED_AT"] = item.updated_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.updated_at.ToString();
                            //DRPAYMENTS["AMOUNT_MONEY"] = Convert.ToDecimal(item.amount_money.amount);
                            //DRPAYMENTS["STATUS"] = item.status.ToString();
                            //DRPAYMENTS["SOURCE_TYPE"] = item.source_type.ToString();
                            //DRPAYMENTS["CARD_BRAND"] = item.card_details == null ? "" : item.card_details.card.card_brand.ToString();
                            //DRPAYMENTS["CARD_TYPE"] = item.card_details == null ? "" : item.card_details.card.card_type.ToString();
                            //DRPAYMENTS["LOCATION_ID"] = item.location_id.ToString();
                            //DRPAYMENTS["PROCESSING_AMOUNT"] = item.processing_fee == null ? 0 : Convert.ToDecimal(item.processing_fee[0].amount_money.amount);
                            //DRPAYMENTS["TOTAL_MONEY"] = Convert.ToDecimal(item.total_money.amount);
                            //DRPAYMENTS["APPROVED_MONEY"] = item.approved_money == null ? 0 : Convert.ToDecimal(item.approved_money.amount);
                            //DRPAYMENTS["RECEIPT_NUMBER"] = item.receipt_number == null ? "" : item.receipt_number.ToString();
                            //SQUARE_UP_ORDERS_PAYMENTS_TYPE.Rows.Add(DRPAYMENTS);
                        }
                    }
                } while (cursor != null);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQR_REFUND_ITEMS - SQUAREUP - ", ex);
                //throw;
            }

        }
        public void SQUARE_UP_CATALOG(DataRow dtIntegrationData)
        {
            String cursor = string.Empty;
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Clear();
            try
            {
                do
                {
                    var client = new WebClient();
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                    client.UseDefaultCredentials = true;
                    client.Credentials = CredentialCache.DefaultCredentials;
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData["API_KEY"]));
                    client.QueryString.Add("types", "CATEGORY");
                    if (cursor != "" && cursor != null)
                        client.QueryString.Add("cursor", cursor == "" ? "" : cursor);

                    var response = client.DownloadString("https://connect.squareup.com/v2/catalog/list");
                    Catalog_Root catalog_Root = JsonConvert.DeserializeObject<Catalog_Root>(response);
                    cursor = catalog_Root.cursor;
                    CREATE_SQUARE_UP_CATEGORY();
                    if (catalog_Root.objects != null)
                    {
                        foreach (var item in catalog_Root.objects)
                        {
                            DataRow DRCATALOG = SQUARE_UP_CATEGORY_TYPE.NewRow();
                            DRCATALOG["TYPE"] = item.type.ToString();
                            DRCATALOG["CATEGORY_ID"] = item.id;
                            DRCATALOG["UPDATED_AT"] = item.updated_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.created_at.ToString();
                            DRCATALOG["CREATED_AT"] = item.created_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.updated_at.ToString();
                            DRCATALOG["VERSION"] = 0;
                            DRCATALOG["IS_DELETED"] = item.is_deleted == true ? 1 : 0; ;
                            DRCATALOG["PRESENT_AT_ALL_LOCATIONS"] = item.present_at_all_locations == true ? 1 : 0; ;
                            DRCATALOG["CATEGORY_DATA_NAME"] = item.category_data.name == null ? "" : item.category_data.name.ToString();
                            DRCATALOG["CATEGORY_DATA_ORDINAL"] = item.category_data.ordinal;
                            DRCATALOG["CATEGORY_DATA_IS_TOP_LEVEL"] = item.category_data.is_top_level == true ? 1 : 0; 
                            SQUARE_UP_CATEGORY_TYPE.Rows.Add(DRCATALOG);
                        }
                    }
                } while (cursor != null);
                SQUARE_UP_CATEGORY_FOE_EPOS_SALES = SQUARE_UP_CATEGORY_TYPE;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQUARE_UP_CATALOG - SQUAREUP - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                SQUARE_UP_CATEGORY_TYPE.Clear();
               // throw;
            }

        }
        public void SQUARE_UP_CATALOGUE_ITEM(DataRow dtIntegrationData)
        {
            String cursor = string.Empty;
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            DS_ORDERS_CATALOG_AND_ITEM_DATA.Tables.Clear();
            try
            {
                do
                {
                    var client = new WebClient();
                    ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                    client.UseDefaultCredentials = true;
                    client.Credentials = CredentialCache.DefaultCredentials;
                    client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                    client.Headers.Add("Authorization", Convert.ToString(dtIntegrationData["API_KEY"]));
                    client.QueryString.Add("types", "ITEM");
                    if (cursor != "" && cursor != null)
                        client.QueryString.Add("cursor", cursor == "" ? "" : cursor);

                    var response = client.DownloadString("https://connect.squareup.com/v2/catalog/list");
                    Item_Root item_Root = JsonConvert.DeserializeObject<Item_Root>(response);
                    cursor = item_Root.cursor;
                    CREATE_SQUARE_UP_CATALOGUE_ITEM();
                    if (item_Root.objects != null)
                    {
                        foreach (var item in item_Root.objects)
                        {
                            DataRow DRCATALOG_ITEM = SQUARE_UP_CATALOGUE_ITEM_TYPE.NewRow();
                            DRCATALOG_ITEM["CATALOGUE_ITEM_ID"] = item.id.ToString();
                            DRCATALOG_ITEM["UPDATED_AT"] = item.updated_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.created_at.ToString();
                            DRCATALOG_ITEM["CREATED_AT"] = item.created_at.ToString() == "1/1/0001 12:00:00 AM" ? (object)DBNull.Value : item.updated_at.ToString();
                            DRCATALOG_ITEM["VERSION"] = 0;
                            DRCATALOG_ITEM["IS_DELETED"] = item.is_deleted == true ? 1 : 0;
                            DRCATALOG_ITEM["CATALOG_V1_IDS"] = item.catalog_v1_ids == null ? DBNull.Value.ToString() : item.catalog_v1_ids[0].catalog_v1_id;
                            DRCATALOG_ITEM["ITEM_DATA_NAME"] = item.item_data.name;
                            DRCATALOG_ITEM["ITEM_DATA_DESCRIPTION"] = item.item_data.description; ;
                            DRCATALOG_ITEM["ITEM_DATA_LABEL_COLOR"] = item.item_data.label_color; ;
                            DRCATALOG_ITEM["ITEM_DATA_VISIBILITY"] = item.item_data.visibility;
                            DRCATALOG_ITEM["ITEM_DATA_CATEGORY_ID"] = item.item_data.category_id;
                            DRCATALOG_ITEM["ITEM_DATA_PRODUCT_TYPE"] = item.item_data.product_type; ;
                            DRCATALOG_ITEM["ITEM_DATA_SKIP_MODIFIER_SCREEN"] = item.item_data.skip_modifier_screen;
                            DRCATALOG_ITEM["ITEM_DATA_ECOM_VISIBILITY"] = item.item_data.ecom_visibility;
                            DRCATALOG_ITEM["ITEM_DATA_DESCRIPTION_HTML"] = item.item_data.description_html;
                            DRCATALOG_ITEM["ITEM_DATA_DESCRIPTION_PLAINTEXT"] = item.item_data.description_plaintext;
                            SQUARE_UP_CATALOGUE_ITEM_TYPE.Rows.Add(DRCATALOG_ITEM);
                        }
                    }
                } while (cursor != null);
                
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("SQUARE_UP_CATALOGUE_ITEM - SQUAREUP - ", ex);
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                SQUARE_UP_CATALOGUE_ITEM_TYPE.Clear();
                //throw;
            }
           
        }
        public int INS_UPD_SQUARE_UP_CATALOG_AND_ITEMS(DataSet SQUARE_UP_CATALOG_AND_ITEMS , DataRow dtIntegrationData)
        {
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = new CashupModel();
            try
            {
                if (SQUARE_UP_CATALOG_AND_ITEMS.Tables.Count > 0) //(dtx.Rows.Count > 0)
                {                    
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = 0;
                    _ICashUp.CashupModelObj.BRANCH_ID =Convert.ToInt32(dtIntegrationData["BRANCH_ID"]);
                    _ICashUp.CashupModelObj.ENTITY_ID = Convert.ToInt32(dtIntegrationData["ENTITY_ID"]);
                    _ICashUp.CashupModelObj.DATATABLE_SQUARE_UP_DS = SQUARE_UP_CATALOG_AND_ITEMS;
                    _ICashUp.INS_UPD_SQUARE_UP_ITEMS(SQUARE_UP_CATALOG_AND_ITEMS);
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("INS_UPD_SQUARE_UP_CATALOG_AND_ITEMS - SQUAREUP - ", ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                DS_ORDERS_CATALOG_AND_ITEM_DATA.Clear();
                return 3;
                //throw;
            }
        }
        
    }
}
