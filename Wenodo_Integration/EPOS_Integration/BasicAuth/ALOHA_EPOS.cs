using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.Aloha
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse); 
    public class Category
    {
        public decimal id { get; set; }
        public string name { get; set; }
        public string type { get; set; }
    }
    public class CheckId
    {
        public decimal id { get; set; }
        public string link { get; set; }
    }

    public class OrderMode
    {
        public decimal id { get; set; }
        public string label { get; set; }
    }

    public class Period
    {
        public decimal id { get; set; }
        public string label { get; set; }
    }

    public class Employee
    {
        public decimal id { get; set; }
        public string name { get; set; }
    }

    public class ResponsibleEmployees
    {
        public Employee employee { get; set; }
        public decimal shiftId { get; set; }
        public bool isTippableEmployee { get; set; }
        public decimal roleId { get; set; }
        public string roleName { get; set; }
        public decimal id { get; set; }
        public string name { get; set; }
        public DateTime time { get; set; }
        public Manager manager { get; set; }
    }

    public class Id
    {
        public decimal id { get; set; }
        public string label { get; set; }
    }

    public class ModifierInfo
    {
        public Id id { get; set; }
        public string type { get; set; }
    }

    public class Item
    {
        public decimal responsibleEmployeeId { get; set; }
        public List<Category> categories { get; set; }
        public decimal netAmount { get; set; }
        public OrderMode orderMode { get; set; }
        public Period period { get; set; }
        public decimal originalPrice { get; set; }
        public decimal quantity { get; set; }
        public decimal seat { get; set; }
        public bool revenue { get; set; }
        public bool processedInKitchen { get; set; }
        public bool giftCard { get; set; }
        public decimal id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
        public ModifierInfo modifierInfo { get; set; }
        public decimal parentItemId { get; set; }
    }

    public class Table
    {
        public string id { get; set; }
        public string label { get; set; }
    }

    public class GroupInfo
    {
        public decimal id { get; set; }
        public Table table { get; set; }
    }

    public class GuestCounting
    {
        public decimal guests { get; set; }
        public string mode { get; set; }
    }

    public class RevenueCenter
    {
        public decimal id { get; set; }
        public string label { get; set; }
    }

    public class Surcharge
    {
        public decimal rate { get; set; }
        public string type { get; set; }
        public string accounting { get; set; }
        public List<decimal> linkedItems { get; set; }
        public string id { get; set; }
        public string typeId { get; set; }
        public string label { get; set; }
        public double amount { get; set; }
        public DateTime createdOn { get; set; }
        public decimal? taxableSales { get; set; }
    }

    public class Payment
    {
        public decimal tip { get; set; }
        public string type { get; set; }
        public string card { get; set; }
        public decimal id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
    }

    public class Event
    {
        public DateTime time { get; set; }
        public string type { get; set; }
        public string customEventLabel { get; set; }
    }

    public class LinkedItem
    {
        public decimal id { get; set; }
        public decimal amount { get; set; }
    }

    public class Manager
    {
        public decimal id { get; set; }
        public string name { get; set; }
    }

    public class Void
    {
        public string type { get; set; }
        public List<LinkedItem> linkedItems { get; set; }
        public string id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
    }

    public class Clear
    {
        public string type { get; set; }
        public List<LinkedItem> linkedItems { get; set; }
        public string id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
    }

    public class Promo
    {
        public decimal discount { get; set; }
        public string type { get; set; }
        public List<LinkedItem> linkedItems { get; set; }
        public string id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
    }

    public class Comp
    {
        public string type { get; set; }
        public string note { get; set; }
        public List<LinkedItem> linkedItems { get; set; }
        public string id { get; set; }
        public decimal typeId { get; set; }
        public string label { get; set; }
        public decimal amount { get; set; }
        public DateTime createdOn { get; set; }
        public ResponsibleEmployees responsibleEmployees { get; set; }
    }

    public class Check
    {
        public string StoreId { get; set; }
        public string Dob { get; set; }
        public List<Item> items { get; set; }
        public List<ResponsibleEmployees> responsibleEmployees { get; set; }
        public decimal terminalId { get; set; }
        public decimal grossAmount { get; set; }
        public decimal grandAmount { get; set; }
        public decimal id { get; set; }
        public decimal printedCheckId { get; set; }
        public decimal netAmount { get; set; }
        public decimal total { get; set; }
        public bool isRefund { get; set; }
        public bool training { get; set; }
        public bool closed { get; set; }
        public GroupInfo groupInfo { get; set; }
        public GuestCounting guestCounting { get; set; }
        public RevenueCenter revenueCenter { get; set; }
        public Period period { get; set; }

        public bool isTaxExemptApplied { get; set; }
        public List<Comp> comps { get; set; }
        public List<Promo> promos { get; set; }
        public List<Void> voids { get; set; }
        public List<Clear> clears { get; set; }
        public List<Surcharge> surcharges { get; set; }
        public List<Payment> payments { get; set; }
        public List<Event> events { get; set; }
    }

    public class Root
    {
        public string storeId { get; set; }
        public string dob { get; set; }
        public long marker { get; set; }
        public bool moreDataImmediatelyAvailable { get; set; }
        public string link { get; set; }
        public List<Check> checks { get; set; }
    }


    public class CheckHeader
    {
        public string id { get; set; }
        public string printableId { get; set; }
        public object marker { get; set; }
        public double total { get; set; }
        public double netAmount { get; set; }
        public bool isClosed { get; set; }
        public bool isEmpty { get; set; }
        public bool isTraining { get; set; }
        public string link { get; set; }
    }

    public class Root_CheckHeader
    {
        public string storeId { get; set; }
        public string dob { get; set; }
        public List<CheckHeader> checks { get; set; }
    }




    public class ALOHA_EPOS
    {
        public FetchData FetchData_Obj { get; set; }
        public void GetDataFromEPOS(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            string EXCEPTION_LOG = string.Empty;
            foreach (DataRow dr in dt.Rows)
            {
                FetchData_Obj = new FetchData();
                decimal CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                decimal ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                decimal BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                DataView dv = dt_IntegrationDetails.DefaultView;
                if (BRANCH_ID.Equals(null))
                    dv.RowFilter = "ENTITY_ID=" + ENTITY_ID;
                else
                    dv.RowFilter = "ENTITY_ID=" + ENTITY_ID + " and BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);

                DataTable dtIntegrationData = dv.ToTable();

                FetchData_Obj.urlPath = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                FetchData_Obj.userName = Convert.ToString(dtIntegrationData.Rows[0]["USERID"]);
                FetchData_Obj.passWord = Convert.ToString(dtIntegrationData.Rows[0]["PASSWORD"]);

                int INTEGRATION_STATUS = 0;

                try
                {
                    IList<CheckId> _checkids = GetChecksList(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyyMMdd"));
                    Root _root = GetSalesStream(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyyMMdd"));
                    _checkids = GetDistinctCheckIds(_checkids, _root);
                    if (_checkids.Count > 0)
                    {
                        GetCheckDetailList(Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyyMMdd"), _checkids, ref _root);
                    }
                    if (_root.checks.Count > 0)
                    {

                        DataSet ds_Sales_data = CreateDataTablesFromSalesJson(_root.checks);
                        INSERT_EPOS_DATA_ALOHA(ds_Sales_data, CASHUP_MAIN_ID, ENTITY_ID, Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyyMMdd"));
                        INTEGRATION_STATUS = 2;//Data Recieved
                        if (INTEGRATION_STATUS == 2)
                        {
                            DataSet ALOHA_DS = new DataSet();
                            ALOHA_DS = ds_Sales_data;
                            Obj.CashupModelObj = new CashupModel();
                            TransformData<DataSet> transformData = new TransformData<DataSet>();
                            transformData.DataTransform(IntegrationSource.ALOHA, dtIntegrationData, ALOHA_DS, CASHUP_MAIN_ID, Obj);
                        }
                    }
                    else
                    {
                        INTEGRATION_STATUS = 4;//No Data Recieved
                    }
                }
                catch (Exception ex)
                {
                    INTEGRATION_STATUS = 3;
                    LogExceptions.LogError("GetDataFromEPOS_ALOHA", ex);
                    EXCEPTION_LOG = ex.ToString();
                }
                Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(INTEGRATION_STATUS, CASHUP_MAIN_ID, EXCEPTION_LOG);
                EXCEPTION_LOG = string.Empty;
            }
        }
        void INSERT_EPOS_DATA_ALOHA(DataSet ds_Sales_data, decimal CASHUP_MAIN_ID, decimal ENTITY_ID, string DOB)
        {
            try
            {
                Cashup _ICashUp = new Cashup();
                _ICashUp.CashupModelObj = new CashupModel();
                _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                _ICashUp.CashupModelObj.DT_HEADER = ds_Sales_data.Tables[0];
                _ICashUp.CashupModelObj.DT_LINES = ds_Sales_data.Tables[1];
                _ICashUp.CashupModelObj.DT_LINE_CATEGORIES = ds_Sales_data.Tables[2];
                _ICashUp.CashupModelObj.DT_SURCHARGES = ds_Sales_data.Tables[3];
                _ICashUp.CashupModelObj.DT_PAYMENT = ds_Sales_data.Tables[4];
                _ICashUp.CashupModelObj.DT_TABLE_TYPES = ds_Sales_data.Tables[5];
                _ICashUp.CashupModelObj.DT_EVENTS = ds_Sales_data.Tables[6];
                _ICashUp.CashupModelObj.DT_CLEARS = ds_Sales_data.Tables[7];
                _ICashUp.CashupModelObj.DT_LINKED_ITEM_TYPES = ds_Sales_data.Tables[8];
                _ICashUp.CashupModelObj.DT_EMPLOYEES = ds_Sales_data.Tables[9];
                _ICashUp.CashupModelObj.DT_COMP = ds_Sales_data.Tables[10];
                _ICashUp.CashupModelObj.DT_VOID = ds_Sales_data.Tables[11];
                _ICashUp.CashupModelObj.DOB = Convert.ToDecimal(DOB);
                _ICashUp.PRC_INS_UPD_ALOHA_CASHUP_DATA();
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }
        DataSet Create_DataTables()
        {
            DataSet ds = new DataSet();

            #region HEADER
            DataTable HEADER = new DataTable();
            // Adding Columns    
            DataColumn COLUMN = new DataColumn();
            COLUMN.ColumnName = "TERMINALID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GROSSAMOUNT";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GRANDAMOUNT";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PRINTEDCHECKID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NETAMOUNT";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTAL";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ISREFUND";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TRAINING";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CLOSED";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GUESTS_COUNT";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GUESTCOUNTING_MODE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "REVENUECENTER_ID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "REVENUECENTER_LABEL";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PERIOD_ID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PERIOD_LABEL";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "GROUPINFO_ID";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ISTAXEXEMPTAPPLIED";
            COLUMN.DataType = typeof(bool);
            HEADER.Columns.Add(COLUMN);

            ds.Tables.Add(HEADER);
            #endregion

            #region LINE
            DataTable LINE = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "RESPONSIBLEEMPLOYEEID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "NETAMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ORDERMODE_ID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ORDERMODE_LABEL";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PERIOD_ID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PERIOD_LABEL";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "ORIGINALPRICE";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "QUANTITY";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SEAT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "REVENUE";
            COLUMN_LINE.DataType = typeof(bool);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PROCESSEDINKITCHEN";
            COLUMN_LINE.DataType = typeof(bool);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "GIFTCARD";
            COLUMN_LINE.DataType = typeof(bool);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "LINE_SOURCE_SYSTEM_ID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TYPEID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "LABEL";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "AMOUNT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "CREATEDON";
            COLUMN_LINE.DataType = typeof(DateTime);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);
            ds.Tables.Add(LINE);
            #endregion

            #region LINE_CATEGORIES

            DataTable dt_LINE_CATEGORIES = new DataTable();

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LINE_CAT_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_LINE_CATEGORIES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NAME";
            COLUMN.DataType = typeof(string);
            dt_LINE_CATEGORIES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dt_LINE_CATEGORIES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LINE_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_LINE_CATEGORIES.Columns.Add(COLUMN);
            ds.Tables.Add(dt_LINE_CATEGORIES);
            #endregion

            #region SURCHARGES

            DataTable SURCHARGES = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "RATE";
            COLUMN.DataType = typeof(decimal);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ACCOUNTING";
            COLUMN.DataType = typeof(string);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TAXABLESALES";
            COLUMN.DataType = typeof(decimal);
            COLUMN.AllowDBNull = true;
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SURCHARGE_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPEID";
            COLUMN.DataType = typeof(decimal);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CREATEDON";
            COLUMN.DataType = typeof(DateTime);
            SURCHARGES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            SURCHARGES.Columns.Add(COLUMN);
            ds.Tables.Add(SURCHARGES);
            #endregion

            #region PAYMENTS

            DataTable dt_PAYMENT = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIP";
            COLUMN.DataType = typeof(decimal);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CARD";
            COLUMN.DataType = typeof(string);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PAYMENT_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPEID";
            COLUMN.DataType = typeof(decimal);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            dt_PAYMENT.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CREATEDON";
            COLUMN.DataType = typeof(DateTime);
            dt_PAYMENT.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_PAYMENT.Columns.Add(COLUMN);

            ds.Tables.Add(dt_PAYMENT);
            #endregion

            #region TABLES_TYPE
            DataTable dt_TABLES_TYPE = new DataTable();

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TABLEID";
            COLUMN.DataType = typeof(decimal);
            dt_TABLES_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            dt_TABLES_TYPE.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_TABLES_TYPE.Columns.Add(COLUMN);

            ds.Tables.Add(dt_TABLES_TYPE);
            #endregion

            #region EVENTS
            DataTable dt_EVENTS = new DataTable();

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIME";
            COLUMN.DataType = typeof(DateTime);
            dt_EVENTS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dt_EVENTS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_EVENTS.Columns.Add(COLUMN);

            ds.Tables.Add(dt_EVENTS);
            #endregion

            #region CLEARS
            DataTable dt_CLEARS = new DataTable();

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CLEAR_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPEID";
            COLUMN.DataType = typeof(decimal);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CREATEDON";
            COLUMN.DataType = typeof(DateTime);
            dt_CLEARS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_CLEARS.Columns.Add(COLUMN);

            ds.Tables.Add(dt_CLEARS);
            #endregion

            #region LINKED_ITEMS_TYPE
            DataTable dt_LinkedItems = new DataTable();

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ALOHA_LINE_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(decimal);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SURCHARGE_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CLEAR_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "VOID_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COMP_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dt_LinkedItems.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dt_LinkedItems.Columns.Add(COLUMN);

            ds.Tables.Add(dt_LinkedItems);
            #endregion

            #region EMPLOYEES

            DataTable dtEMPLOYEES = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "EMPLOYEE_ID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NAME";
            COLUMN.DataType = typeof(string);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SHIFTID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ISTIPPABLEEMPLOYEE";
            COLUMN.DataType = typeof(bool);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ROLEID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ROLENAME";
            COLUMN.DataType = typeof(string);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TIME";
            COLUMN.DataType = typeof(DateTime);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LINE_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CLEAR_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dtEMPLOYEES.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PAYMENT_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dtEMPLOYEES.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "VOID_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dtEMPLOYEES.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COMP_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dtEMPLOYEES.Columns.Add(COLUMN);

            ds.Tables.Add(dtEMPLOYEES);
            #endregion

            #region COMPS

            DataTable dtCOMPS = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "NOTE";
            COLUMN.DataType = typeof(string);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COMP_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPEID";
            COLUMN.DataType = typeof(decimal);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            dtCOMPS.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CREATEDON";
            COLUMN.DataType = typeof(DateTime);
            dtCOMPS.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dtCOMPS.Columns.Add(COLUMN);

            ds.Tables.Add(dtCOMPS);
            #endregion

            #region VOIDS

            DataTable dtVOID = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPE";
            COLUMN.DataType = typeof(string);
            dtVOID.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "VOID_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(string);
            dtVOID.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TYPEID";
            COLUMN.DataType = typeof(decimal);
            dtVOID.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LABEL";
            COLUMN.DataType = typeof(string);
            dtVOID.Columns.Add(COLUMN);


            COLUMN = new DataColumn();
            COLUMN.ColumnName = "AMOUNT";
            COLUMN.DataType = typeof(decimal);
            dtVOID.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CREATEDON";
            COLUMN.DataType = typeof(DateTime);
            dtVOID.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HEADER_SOURCE_SYSTEM_ID";
            COLUMN.DataType = typeof(decimal);
            dtVOID.Columns.Add(COLUMN);

            ds.Tables.Add(dtVOID);
            #endregion


            return ds;
        }
        DataSet CreateDataTablesFromSalesJson(IList<Check> _checks)
        {
            DataSet ds = Create_DataTables();
            DataTable dtHeader = ds.Tables[0];
            DataTable dtLineItems = ds.Tables[1];
            DataTable dtlinecategories = ds.Tables[2];
            DataTable dtsurcharges = ds.Tables[3];
            DataTable dtPayments = ds.Tables[4];
            DataTable dtTableTypes = ds.Tables[5];
            DataTable dtEvents = ds.Tables[6];
            DataTable dtClears = ds.Tables[7];
            DataTable dt_LinkedItems = ds.Tables[8];
            DataTable dtEmployees = ds.Tables[9];
            DataTable dtComp = ds.Tables[10];
            DataTable dtVoid = ds.Tables[11];
            foreach (Check ck in _checks)
            {

                DataRow dr = dtHeader.NewRow();
                dr["TERMINALID"] = ck.terminalId;
                dr["GROSSAMOUNT"] = ck.grossAmount;
                dr["GRANDAMOUNT"] = ck.grandAmount;
                dr["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                dr["PRINTEDCHECKID"] = ck.printedCheckId;
                dr["NETAMOUNT"] = ck.netAmount;
                dr["TOTAL"] = ck.total;
                dr["ISREFUND"] = ck.isRefund;
                dr["TRAINING"] = ck.training;
                dr["CLOSED"] = ck.closed;
                dr["GUESTS_COUNT"] = ck.guestCounting.guests;
                dr["GUESTCOUNTING_MODE"] = ck.guestCounting.mode;
                dr["REVENUECENTER_ID"] = ck.revenueCenter.id;
                dr["REVENUECENTER_LABEL"] = ck.revenueCenter.label;
                dr["PERIOD_ID"] = ck.period.id;
                dr["PERIOD_LABEL"] = ck.period.label;
                dr["GROUPINFO_ID"] = ck.groupInfo.id;
                dr["ISTAXEXEMPTAPPLIED"] = ck.isTaxExemptApplied;
                dtHeader.Rows.Add(dr);

                try
                {
                    if (ck.items != null)
                    {
                        foreach (Item item in ck.items)
                        {
                            try
                            {
                                DataRow dr_items = dtLineItems.NewRow();
                                dr_items["RESPONSIBLEEMPLOYEEID"] = item.responsibleEmployeeId;
                                dr_items["NETAMOUNT"] = item.netAmount;
                                if (item.orderMode != null)
                                {
                                    dr_items["ORDERMODE_ID"] = item.orderMode.id;
                                    dr_items["ORDERMODE_LABEL"] = item.orderMode.label;
                                }
                                if (item.period != null)
                                {
                                    dr_items["PERIOD_ID"] = item.period.id;
                                    dr_items["PERIOD_LABEL"] = item.period.label;
                                }
                                dr_items["ORIGINALPRICE"] = item.originalPrice;
                                dr_items["QUANTITY"] = item.quantity;
                                dr_items["SEAT"] = item.seat;
                                dr_items["REVENUE"] = item.revenue;
                                dr_items["PROCESSEDINKITCHEN"] = item.processedInKitchen;
                                dr_items["GIFTCARD"] = item.giftCard;
                                dr_items["LINE_SOURCE_SYSTEM_ID"] = item.id;
                                dr_items["TYPEID"] = item.typeId;
                                dr_items["LABEL"] = item.label;
                                dr_items["AMOUNT"] = item.amount;
                                dr_items["CREATEDON"] = item.createdOn;
                                dr_items["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                                dtLineItems.Rows.Add(dr_items);
                            }
                            catch (Exception ex)
                            {
                                LogExceptions.LogError("Aloha_ItemsLoop: " + ck.id.ToString(), ex);
                            }
                            try
                            {
                                if (item.categories != null)
                                {
                                    foreach (Category cat in item.categories)
                                    {
                                        DataRow dr_cats = dtlinecategories.NewRow();
                                        dr_cats["LINE_CAT_SOURCE_SYSTEM_ID"] = cat.id;
                                        dr_cats["NAME"] = cat.name;
                                        dr_cats["TYPE"] = cat.type;
                                        dr_cats["LINE_SOURCE_SYSTEM_ID"] = item.id;
                                        dtlinecategories.Rows.Add(dr_cats);
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                LogExceptions.LogError("Aloha_Item_CATEGORY_Loop: " + item.id.ToString(), ex);
                            }
                            try
                            {
                                DataRow drEmployee = dtEmployees.NewRow();
                                drEmployee["TYPE"] = 1;
                                drEmployee["EMPLOYEE_ID"] = item.responsibleEmployees.id;
                                drEmployee["NAME"] = item.responsibleEmployees.name;
                                drEmployee["SHIFTID"] = item.responsibleEmployees.shiftId;
                                drEmployee["ISTIPPABLEEMPLOYEE"] = item.responsibleEmployees.isTippableEmployee;
                                drEmployee["ROLEID"] = item.responsibleEmployees.roleId;
                                drEmployee["ROLENAME"] = item.responsibleEmployees.roleName;
                                //drEmployee["TIME"] = item.responsibleEmployees.time;
                                drEmployee["LINE_SOURCE_SYSTEM_ID"] = item.id;
                                //drEmployee["CLEAR_SOURCE_SYSTEM_ID"] = emp.type;
                                //drEmployee["PAYMENT_SOURCE_SYSTEM_ID"] = emp.type;                    
                                dtEmployees.Rows.Add(drEmployee);
                            }
                            catch (Exception ex)
                            {
                                LogExceptions.LogError("Aloha_Item_Employee_Loop: " + item.id.ToString(), ex);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    LogExceptions.LogError("Aloha_Items: " + ck.id.ToString(), ex);
                }
                if (ck.surcharges != null)
                {
                    foreach (Surcharge schrg in ck.surcharges)
                    {
                        try
                        {
                            DataRow drsurcharges = dtsurcharges.NewRow();
                            drsurcharges["RATE"] = schrg.rate;
                            drsurcharges["TYPE"] = schrg.type;
                            drsurcharges["ACCOUNTING"] = schrg.accounting;
                            drsurcharges["TAXABLESALES"] = schrg.taxableSales ?? 0;
                            drsurcharges["SURCHARGE_SOURCE_SYSTEM_ID"] = schrg.id;
                            drsurcharges["TYPEID"] = schrg.typeId;
                            drsurcharges["LABEL"] = schrg.label;
                            drsurcharges["AMOUNT"] = schrg.amount;
                            drsurcharges["CREATEDON"] = schrg.createdOn;
                            drsurcharges["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtsurcharges.Rows.Add(drsurcharges);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Surcharges: " + ck.id.ToString(), ex);
                        }
                        if (schrg.linkedItems != null)
                        {
                            foreach (decimal litem in schrg.linkedItems)
                            {
                                try
                                {
                                    DataRow drLinkedItem = dt_LinkedItems.NewRow();
                                    drLinkedItem["ALOHA_LINE_SOURCE_SYSTEM_ID"] = litem;
                                    drLinkedItem["TYPE"] = 1;
                                    drLinkedItem["SURCHARGE_SOURCE_SYSTEM_ID"] = schrg.id;
                                    drLinkedItem["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                                    dt_LinkedItems.Rows.Add(drLinkedItem);

                                }
                                catch (Exception ex)
                                {
                                    LogExceptions.LogError("Aloha_Surcharges_LinkedItems: " + schrg.id.ToString(), ex);
                                }
                            }
                        }
                    }
                }


                if (ck.payments != null)
                {
                    foreach (Payment pmt in ck.payments)
                    {
                        try
                        {
                            DataRow dr_payments = dtPayments.NewRow();
                            dr_payments["TIP"] = pmt.tip;
                            dr_payments["TYPE"] = pmt.type;
                            dr_payments["CARD"] = pmt.card;
                            dr_payments["PAYMENT_SOURCE_SYSTEM_ID"] = pmt.id;
                            dr_payments["TYPEID"] = pmt.typeId;
                            dr_payments["LABEL"] = pmt.label;
                            dr_payments["AMOUNT"] = pmt.amount;
                            dr_payments["CREATEDON"] = pmt.createdOn;
                            dr_payments["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtPayments.Rows.Add(dr_payments);
                            DataRow drEmployee = dtEmployees.NewRow();
                            drEmployee["TYPE"] = 4;
                            drEmployee["EMPLOYEE_ID"] = pmt.responsibleEmployees.id;
                            drEmployee["NAME"] = pmt.responsibleEmployees.name;
                            drEmployee["SHIFTID"] = pmt.responsibleEmployees.shiftId;
                            drEmployee["ISTIPPABLEEMPLOYEE"] = pmt.responsibleEmployees.isTippableEmployee;
                            drEmployee["ROLEID"] = pmt.responsibleEmployees.roleId;
                            drEmployee["ROLENAME"] = pmt.responsibleEmployees.roleName;
                            //drEmployee["TIME"] = pmt.responsibleEmployees.time;
                            drEmployee["PAYMENT_SOURCE_SYSTEM_ID"] = pmt.id;
                            dtEmployees.Rows.Add(drEmployee);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Payments: " + ck.id.ToString(), ex);
                        }
                    }
                }

                if (ck.events != null)
                {
                    foreach (Event evt in ck.events)
                    {
                        try
                        {
                            DataRow dr_events = dtEvents.NewRow();
                            dr_events["TIME"] = evt.time;
                            dr_events["TYPE"] = evt.type;
                            dr_events["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtEvents.Rows.Add(dr_events);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Events: " + ck.id.ToString(), ex);
                        }
                    }
                }


                if (ck.clears != null)
                {
                    foreach (Clear clr in ck.clears)
                    {
                        try
                        {
                            DataRow dr_clear = dtClears.NewRow();
                            dr_clear["TYPE"] = clr.type;
                            dr_clear["CLEAR_SOURCE_SYSTEM_ID"] = clr.id;
                            dr_clear["TYPEID"] = clr.typeId;
                            dr_clear["LABEL"] = clr.label;
                            dr_clear["AMOUNT"] = clr.amount;
                            dr_clear["CREATEDON"] = clr.createdOn;
                            dr_clear["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtClears.Rows.Add(dr_clear);
                            if (clr.linkedItems != null)
                            {
                                foreach (LinkedItem litem in clr.linkedItems)
                                {
                                    DataRow drLinkedItem = dt_LinkedItems.NewRow();
                                    drLinkedItem["ALOHA_LINE_SOURCE_SYSTEM_ID"] = litem.id;
                                    drLinkedItem["AMOUNT"] = litem.amount;
                                    drLinkedItem["TYPE"] = 2;
                                    drLinkedItem["CLEAR_SOURCE_SYSTEM_ID"] = clr.id;
                                    dt_LinkedItems.Rows.Add(drLinkedItem);
                                }
                            }
                            DataRow drEmployee = dtEmployees.NewRow();
                            drEmployee["TYPE"] = 3;
                            drEmployee["EMPLOYEE_ID"] = clr.responsibleEmployees.id;
                            drEmployee["NAME"] = clr.responsibleEmployees.name;
                            drEmployee["SHIFTID"] = clr.responsibleEmployees.shiftId;
                            drEmployee["ISTIPPABLEEMPLOYEE"] = clr.responsibleEmployees.isTippableEmployee;
                            drEmployee["ROLEID"] = clr.responsibleEmployees.roleId;
                            drEmployee["ROLENAME"] = clr.responsibleEmployees.roleName;
                            //  drEmployee["TIME"] = clr.responsibleEmployees.time;
                            drEmployee["CLEAR_SOURCE_SYSTEM_ID"] = clr.id;
                            dtEmployees.Rows.Add(drEmployee);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Clears: " + clr.id.ToString(), ex);
                        }
                    }
                }


                foreach (ResponsibleEmployees emp in ck.responsibleEmployees)
                {

                    try
                    {
                        DataRow drEmployee = dtEmployees.NewRow();
                        drEmployee["TYPE"] = 2;
                        drEmployee["EMPLOYEE_ID"] = emp.id;
                        drEmployee["NAME"] = emp.name;
                        drEmployee["SHIFTID"] = emp.shiftId;
                        drEmployee["ISTIPPABLEEMPLOYEE"] = emp.isTippableEmployee;
                        drEmployee["ROLEID"] = emp.roleId;
                        drEmployee["ROLENAME"] = emp.roleName;
                        //drEmployee["TIME"] = emp.time;
                        drEmployee["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                        dtEmployees.Rows.Add(drEmployee);
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("Aloha_Employees: " + ck.id.ToString(), ex);
                    }
                }


                if (ck.comps != null)
                {
                    foreach (Comp cmp in ck.comps)
                    {
                        try
                        {

                            DataRow drComp = dtComp.NewRow();
                            drComp["TYPE"] = cmp.type;
                            drComp["NOTE"] = cmp.note;
                            drComp["COMP_SOURCE_SYSTEM_ID"] = cmp.id;
                            drComp["TYPEID"] = cmp.typeId;
                            drComp["LABEL"] = cmp.label;
                            drComp["AMOUNT"] = cmp.amount;
                            drComp["CREATEDON"] = cmp.createdOn;
                            drComp["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtComp.Rows.Add(drComp);
                            if (cmp.linkedItems != null)
                            {
                                foreach (LinkedItem litem in cmp.linkedItems)
                                {
                                    DataRow drLinkedItem = dt_LinkedItems.NewRow();
                                    drLinkedItem["ALOHA_LINE_SOURCE_SYSTEM_ID"] = litem.id;
                                    drLinkedItem["AMOUNT"] = litem.amount;
                                    drLinkedItem["TYPE"] = 4;
                                    drLinkedItem["COMP_SOURCE_SYSTEM_ID"] = cmp.id;
                                    dt_LinkedItems.Rows.Add(drLinkedItem);
                                }
                            }
                            DataRow drEmployee = dtEmployees.NewRow();
                            drEmployee["TYPE"] = 6;
                            drEmployee["EMPLOYEE_ID"] = cmp.responsibleEmployees.employee.id;
                            drEmployee["NAME"] = cmp.responsibleEmployees.employee.name;
                            drEmployee["SHIFTID"] = cmp.responsibleEmployees.shiftId;
                            drEmployee["ISTIPPABLEEMPLOYEE"] = cmp.responsibleEmployees.isTippableEmployee;
                            drEmployee["ROLEID"] = cmp.responsibleEmployees.roleId;
                            drEmployee["ROLENAME"] = cmp.responsibleEmployees.roleName;
                            //  drEmployee["TIME"] = cmp.responsibleEmployees.time;
                            drEmployee["COMP_SOURCE_SYSTEM_ID"] = cmp.id;
                            dtEmployees.Rows.Add(drEmployee);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Complementary: " + ck.id.ToString(), ex);
                        }
                    }
                }


                if (ck.voids != null)
                {
                    foreach (Void vd in ck.voids)
                    {
                        try
                        {

                            DataRow drVoid = dtVoid.NewRow();
                            drVoid["TYPE"] = vd.type;
                            drVoid["VOID_SOURCE_SYSTEM_ID"] = vd.id;
                            drVoid["TYPEID"] = vd.typeId;
                            drVoid["LABEL"] = vd.label;
                            drVoid["AMOUNT"] = vd.amount;
                            drVoid["CREATEDON"] = vd.createdOn;
                            drVoid["HEADER_SOURCE_SYSTEM_ID"] = ck.id;
                            dtVoid.Rows.Add(drVoid);
                            if (vd.linkedItems != null)
                            {
                                foreach (LinkedItem litem in vd.linkedItems)
                                {
                                    DataRow drLinkedItem = dt_LinkedItems.NewRow();
                                    drLinkedItem["ALOHA_LINE_SOURCE_SYSTEM_ID"] = litem.id;
                                    drLinkedItem["AMOUNT"] = litem.amount;
                                    drLinkedItem["TYPE"] = 3;
                                    drLinkedItem["VOID_SOURCE_SYSTEM_ID"] = vd.id;
                                    dt_LinkedItems.Rows.Add(drLinkedItem);
                                }
                            }
                            DataRow drEmployee = dtEmployees.NewRow();
                            drEmployee["TYPE"] = 5;
                            drEmployee["EMPLOYEE_ID"] = vd.responsibleEmployees.id;
                            drEmployee["NAME"] = vd.responsibleEmployees.name;
                            drEmployee["SHIFTID"] = vd.responsibleEmployees.shiftId;
                            drEmployee["ISTIPPABLEEMPLOYEE"] = vd.responsibleEmployees.isTippableEmployee;
                            drEmployee["ROLEID"] = vd.responsibleEmployees.roleId;
                            drEmployee["ROLENAME"] = vd.responsibleEmployees.roleName;
                            // drEmployee["TIME"] = vd.responsibleEmployees.time;
                            drEmployee["VOID_SOURCE_SYSTEM_ID"] = vd.id;
                            dtEmployees.Rows.Add(drEmployee);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("Aloha_Void: " + ck.id.ToString(), ex);
                        }

                    }
                }



            }
            ds = new DataSet();
            ds.Tables.Add(dtHeader.Copy());
            ds.Tables.Add(dtLineItems.Copy());
            ds.Tables.Add(dtlinecategories.Copy());
            ds.Tables.Add(dtsurcharges.Copy());
            ds.Tables.Add(dtPayments.Copy());
            ds.Tables.Add(dtTableTypes.Copy());
            ds.Tables.Add(dtEvents.Copy());
            ds.Tables.Add(dtClears.Copy());
            ds.Tables.Add(dt_LinkedItems.Copy());
            ds.Tables.Add(dtEmployees.Copy());
            ds.Tables.Add(dtComp.Copy());
            ds.Tables.Add(dtVoid.Copy());
            return ds;
        }
        IList<CheckId> GetDistinctCheckIds(IList<CheckId> checkids, Root root)
        {
            IList<CheckId> _checkIds = (from j in checkids
                                        join jt in root.checks on j.id equals jt.id into jts
                                        from jtResult in jts.DefaultIfEmpty()
                                        where jtResult == null
                                        select j
                 ).ToList();

            return _checkIds;
        }
        IList<CheckId> GetChecksList(string BusinessDay)
        {
            // FetchData Obj = new FetchData();
            // Obj.urlPath = @"https://api.ncr.com/rt/v3/psi356179";
            // Obj.userName = "wenodo-service-user";
            // Obj.passWord = "Rn}kM5[81";
            FetchData_Obj.urlParameters = @"/" + BusinessDay + "/sales/check";
            Root_CheckHeader _root = JsonConvert.DeserializeObject<Root_CheckHeader>(FetchData_Obj.GetUrlData_BasicAuth());
            IList<CheckId> CheckIds = (from p in _root.checks
                                       select new CheckId
                                       {
                                           id = Convert.ToDecimal(p.id),
                                           link = p.link
                                       }).ToList();
            return CheckIds;
        }
        void GetCheckDetailList(string BusinessDay, IList<CheckId> CheckIds, ref Root _root)
        {
            // FetchData Obj = new FetchData();
            // Obj.urlPath = @"https://api.ncr.com/rt/v3/psi356179";
            // Obj.userName = "wenodo-service-user";
            // Obj.passWord = "Rn}kM5[81";            
            foreach (CheckId _chkid in CheckIds)
            {
                FetchData_Obj.urlParameters = @"/" + BusinessDay + "/sales/check/" + _chkid.id;
                Check _chk = JsonConvert.DeserializeObject<Check>(FetchData_Obj.GetUrlData_BasicAuth());
                _root.checks.Add(_chk);
            }

        }
        Root GetSalesStream(string BusinessDay)
        {
            // FetchData Obj = new FetchData();
            // Obj.urlPath = @"https://api.ncr.com/rt/v3/psi356179";
            // Obj.userName = "wenodo-service-user";
            // Obj.passWord = "Rn}kM5[81";
            FetchData_Obj.urlParameters = @"/" + BusinessDay + "/sales/stream";
            Root _root = JsonConvert.DeserializeObject<Root>(FetchData_Obj.GetUrlData_BasicAuth());
            return _root;
        }
        void Create_Master_DataTable(DataTable DT_HEADER, DataTable DT_LINES, DataTable DT_PAYMENT, DataTable DT_VOID)
        {
            var JoinResult = (from dt_header in DT_HEADER.AsEnumerable()
                              join dt_lines in DT_LINES.AsEnumerable() on dt_header.Field<int>("CheckID") equals dt_lines.Field<int>("CheckID")
                              join dt_payment in DT_PAYMENT.AsEnumerable() on dt_header.Field<int>("CheckID") equals dt_payment.Field<int>("CheckID")
                              join dt_void in DT_VOID.AsEnumerable() on dt_header.Field<int>("CheckID") equals dt_void.Field<int>("CheckID")
                              select new
                              {
                                  CHECKID = dt_header.Field<int>("CHECKID"),
                                  SITEID = dt_header.Field<int>("SITEID"),
                                  TRANSDATE = dt_header.Field<DateTimeOffset>("TRANSDATE"),
                                  COVERS = dt_header.Field<int>("COVERS"),
                                  CHECKNO = dt_header.Field<int>("CHECKNO"),
                                  DEPTNAME = dt_header.Field<string>("DEPTNAME"),
                                  OPENTIME = dt_header.Field<DateTimeOffset>("OPENTIME"),
                                  CLOSETIME = dt_header.Field<DateTimeOffset>("CLOSETIME"),
                                  TABLENAME = dt_header.Field<string>("TABLENAME"),
                                  TABLESIZE = dt_header.Field<string>("TABLESIZE"),
                                  HOUSECHG = dt_header.Field<decimal>("HOUSECHG"),
                                  LOGO = dt_header.Field<string>("LOGO"),
                                  ADDRESS = dt_header.Field<string>("ADDRESS"),
                                  VAT = dt_header.Field<string>("VAT"),
                                  CHECKLINK = dt_header.Field<string>("CHECKLINK"),
                                  CHECKLEN = dt_header.Field<int>("CHECKLEN"),
                                  CHECKSUM = dt_header.Field<string>("CHECKSUM"),
                                  CHECKCULTURE = dt_header.Field<string>("CHECKCULTURE"),
                                  PROMO = dt_header.Field<decimal>("PROMO"),
                                  SVC = dt_header.Field<decimal>("SVC"),
                                  TOTALDUE = dt_header.Field<decimal>("TOTALDUE"),
                                  MENUNAME = dt_lines.Field<string>("MENUNAME"),
                                  QTY = dt_lines.Field<int>("QTY"),
                                  SQNET = dt_lines.Field<decimal>("SQNET"),
                                  PROMOAMT = dt_lines.Field<decimal>("PROMOAMT"),
                                  TAXAMT = dt_lines.Field<decimal>("TAXAMT"),
                                  SVCHARGE = dt_lines.Field<decimal>("SVCHARGE"),
                                  SALESDEPARTMENT = dt_lines.Field<string>("SALESDEPARTMENT"),
                                  GLOBALCAT = dt_lines.Field<string>("GLOBALCAT"),
                                  MAJORCAT = dt_lines.Field<string>("MAJORCAT"),
                                  MAJORCATID = dt_lines.Field<string>("MAJORCATID"),
                                  PROMONAME = dt_lines.Field<string>("PROMONAME"),
                                  PROMOREASON = dt_lines.Field<string>("PROMOREASON"),
                                  EMPLOYEE = dt_lines.Field<string>("EMPLOYEE"),
                                  COMBONAME = dt_lines.Field<string>("COMBONAME"),
                                  SALETIME = dt_lines.Field<DateTimeOffset>("SALETIME"),
                                  PAYNAME = dt_payment.Field<string>("PAYNAME"),
                                  PAYAMT = dt_payment.Field<decimal>("PAYAMT"),
                                  TIPAMT = dt_payment.Field<decimal>("TIPAMT"),
                                  PROMOYN = dt_payment.Field<int>("PROMOYN"),
                                  VOIDDATE = dt_void.Field<DateTimeOffset>("VOIDDATE"),
                                  VOID_QTY = dt_void.Field<decimal>("QTY"),
                                  GROSSPRICE = dt_void.Field<decimal>("GROSSPRICE"),
                                  VOID_MENUNAME = dt_void.Field<string>("MENUNAME"),
                                  SERVERNAME = dt_void.Field<string>("SERVERNAME"),
                                  MGRNAME = dt_void.Field<string>("MGRNAME"),
                                  REASON = dt_void.Field<string>("REASON"),
                              }).ToList();





        }
        void InsertIntegrationDataForCashup(DataRow dr, Cashup Obj, DataTable DT_LINES, DataTable DT_PAYMENTS, DataTable DT_VOID)
        {
            Obj.CashupModelObj = new CashupModel();
            Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
            Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
            Obj.CashupModelObj.USER_ID = 1;
            //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
            DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
            foreach (DataRow dr_session in dt_Session.Rows)
            {
                Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                DataSet ds = Obj.GET_CASHUP_BY_ID();
                EPOS_FILE_UPLOAD_SQUIRREL(DT_PAYMENTS, DT_LINES, DT_VOID, Convert.ToDecimal(ds.Tables[0].Rows[0]["ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]));
            }
        }
        void EPOS_FILE_UPLOAD_SQUIRREL(DataTable DT_PAYMENTS, DataTable DT_LINES, DataTable DT_VOID, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID)
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
            //11
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
            foreach (DataRow dr in DT_LINES.Rows)
            {
                DataRow DR = INTEGRATION_DATA_TYPE.NewRow();
                DR[0] = INTEGRATION_SYSTEM_ID;
                DR[1] = Convert.ToString(dr["MAJORCATID"]);
                DR[2] = Convert.ToString(dr["MAJORCAT"]);
                DR[3] = Convert.ToString(dr["GLOBALCAT"]);
                DR[4] = Convert.ToString(dr["CHECKID"]);
                DR[5] = Convert.ToString(dr["SALESDEPARTMENT"]);
                DR[6] = Convert.ToString(dr["MENUNAME"]);
                DR[7] = Convert.ToString(dr["QTY"]);
                DR[8] = Convert.ToString(dr["SQNET"]);
                DR[9] = Convert.ToString(dr["PROMOAMT"]);
                DR[10] = Convert.ToString(dr["TAXAMT"]);
                DR[11] = Convert.ToString(dr["SVCHARGE"]);
                INTEGRATION_DATA_TYPE.Rows.Add(DR);
            }
            DECLARATION_DETAIL = INTEGRATION_DATA_TYPE.AsEnumerable()
        .GroupBy(r => new { Col1 = r["ACCOUNTING_GROUP_ID"], Col2 = r["ACCOUNTING_GROUP"], Col3 = r["AG_CODE"], })
        .Select(g =>
        {
            var row = DECLARATION_DETAIL.NewRow();
            row[0] = g.Key.Col2.ToString();
            row[1] = g.Sum(r => Convert.ToDecimal(r["QUANTITY"]));
            row[2] = g.Sum(r => r.Field<decimal>("TOTAL_WITH_TAX_LESS_DISCOUNTS"));// - (Convert.ToString(dr["Service charge 12.5%"]) == "" ? 0 : Convert.ToDecimal(dr["Service charge 12.5%"]));
            row[3] = g.Sum(r => r.Field<decimal>("DISCOUNTS"));
            row[4] = g.Sum(r => r.Field<decimal>("TOTAL_TAXES"));
            row[5] = g.Sum(r => r.Field<decimal>("TOTAL_WITH_TAX_LESS_DISCOUNTS") - r.Field<decimal>("TOTAL_TAXES")); //0;//TOTAL_WITHOUT_TAX
            row[6] = 0;
            row[7] = g.Sum(r => r.Field<decimal>("TOTAL_WITH_TAX_LESS_DISCOUNTS") + r.Field<decimal>("DISCOUNTS") + r.Field<decimal>("TOTAL_WITHOUT_TAX"));
            row[8] = g.Key.Col3.ToString();
            row[9] = g.Key.Col1.ToString();
            return row;
        })
        .CopyToDataTable();

            MEDIA_DETAIL = DT_PAYMENTS.AsEnumerable().Where(s => s.Field<int>("PROMOYN") == 0)
        .GroupBy(r => new { Col1 = r["PayName"] })
        .Select(g =>
        {
            var row = MEDIA_DETAIL.NewRow();

            row["MEDIA"] = g.Key.Col1.ToString();
            row["HS_TIPS"] = g.Sum(r => Convert.ToDecimal(r["TipAmt"]));
            row["TOTAL_SALES"] = g.Sum(r => Convert.ToDecimal(r["PayAmt"]));
            return row;
        }).CopyToDataTable();
            if (DT_VOID.Rows.Count > 0)
            {
                EPOS_DISCOUNTS_TYPE = DT_VOID.AsEnumerable()
        .GroupBy(r => new { Col1 = r["CheckID"], Col2 = r["MenuName"], Col3 = r["Qty"] })
        .Select(g =>
        {
            var row = EPOS_DISCOUNTS_TYPE.NewRow();

            row["DISCOUNT"] = g.Key.Col1.ToString() + g.Key.Col2.ToString() + "(" + g.Key.Col3.ToString() + ")";
            row["COUNT"] = g.Sum(r => Convert.ToDecimal(r["Qty"]));
            row["AMOUNT"] = g.Sum(r => Convert.ToDecimal(r["GROSSPRICE"]));
            return row;
        }).CopyToDataTable();
            }

            object sumObject;
            sumObject = DECLARATION_DETAIL.Compute("Sum(GROSS)", string.Empty);
            Cashup_Epos_Header.Add(Convert.ToDecimal(sumObject.ToString()));
            sumObject = INTEGRATION_DATA_TYPE.Compute("Sum(TOTAL_WITHOUT_TAX)", string.Empty);
            Cashup_Epos_Header.Add(Convert.ToDecimal(sumObject.ToString()));
            sumObject = DECLARATION_DETAIL.Compute("Sum(DISC_CPN)", string.Empty);
            Cashup_Epos_Header.Add(Convert.ToDecimal(sumObject.ToString()));
            sumObject = DECLARATION_DETAIL.Compute("Sum(GROSS)", string.Empty);
            Cashup_Epos_Header.Add(Convert.ToDecimal(sumObject.ToString()));
            sumObject = DECLARATION_DETAIL.Compute("Sum(VAT_TAX)", string.Empty);
            Cashup_Epos_Header.Add(Convert.ToDecimal(sumObject.ToString()));

            CashupModel CashupModelObj = new CashupModel();
            CashupModelObj.USER_ID = 1;
            CashupModelObj.Cashup_Epos_Header = Cashup_Epos_Header;
            CashupModelObj.CASHUP_HEADER_ID = CashupHeaderID.ToString();
            CashupModelObj.SESSION_ID = SessionID;

            CashupModelObj.VOID_COUNT = EPOS_DISCOUNTS_TYPE.Rows.Count;

            sumObject = EPOS_DISCOUNTS_TYPE.Compute("Sum(AMOUNT)", string.Empty);
            CashupModelObj.VOID_TOTAL = Convert.ToDecimal(sumObject.ToString());

            sumObject = MEDIA_DETAIL.Compute("Sum(HS_TIPS)", string.Empty);
            CashupModelObj.HOUSE_TIPS = Convert.ToDecimal(sumObject.ToString());

            CashupModelObj.COMP_DECLARATION = MEDIA_DETAIL;
            CashupModelObj.DECLARATION_DETAILS = DECLARATION_DETAIL;
            CashupModelObj.EPOS_DISCOUNTS_TYPE = EPOS_DISCOUNTS_TYPE;
            CashupModelObj.EPOS_TAXES_TYPE = EPOS_TAXES_TYPE;
            CashupModelObj.EPOS_SERVING_PERIOD_TYPE = EPOS_SERVING_PERIOD_TYPE;
            CashupModelObj.INTEGRATION_DATA_TYPE = INTEGRATION_DATA_TYPE;
            CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(INTEGRATION_SYSTEM_ID);
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = CashupModelObj;
            _ICashUp.EPOS_FILE_UPLOAD_HOMESTEAD();
        }
    }
}
