using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using EPOS_Integration.Integrations.Iiko;
using EPOS_Integration.Model;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.IIKO
{
    public class TransactionData
    {
        public string Cashier { get; set; }
        public DateTime CloseTime { get; set; }

        [JsonProperty("Department.Code")]
        public string DepartmentCode { get; set; }
        public double DishDiscountSumInt { get; set; }
        public int DishReturnSum { get; set; }

        [JsonProperty("OpenDate.Typed")]
        public string OpenDateTyped { get; set; }
        public int OrderNum { get; set; }
        public string OrderType { get; set; }
        public int SessionNum { get; set; }
        public bool Storned { get; set; }

        [JsonProperty("UniqOrderId.Id")]
        public string UniqOrderIdId { get; set; }
        public double DishSumInt { get; set; }
        public int TableNum { get; set; }
        public int ISLinesFetched { get; set; }
    }

    public class Payment
    {
        public string DepartmentCode { get; set; }
        public string Cashier { get; set; }
        public int OrderNum { get; set; }
        public string OpenDateTyped { get; set; }
        public string OrderType { get; set; }
        public string UniqOrderIdId { get; set; }
        public int SessionNum { get; set; }
        public DateTime CloseTime { get; set; }
        public DateTime OpenTime { get; set; }
        public object DeliveryActualTime { get; set; }
        public object DeliveryPhone { get; set; }
        public object DeliveryCustomerName { get; set; }
        public string DeliveryAddress { get; set; }
        public string DeliveryCourier { get; set; }
        public string PayTypes { get; set; }
        public bool Storned { get; set; }
        public string DeliveryIsDelivery { get; set; }
        public object DeliveryServiceType { get; set; }
        public decimal DishDiscountSumInt { get; set; }
        public decimal DishReturnSum { get; set; }
        public decimal DiscountSum { get; set; }
        public double DishSumInt { get; set; }
        public decimal VATSum { get; set; }
        public int TableNum { get; set; }
    }

    public class ProductItem
    {
        public string DepartmentCode { get; set; }
        public int OrderNum { get; set; }
        public int SessionNum { get; set; }
        public bool Storned { get; set; }
        public string DishGroup { get; set; }
        public string DishName { get; set; }
        public object DishSizeName { get; set; }
        public int OrderItems { get; set; }
        public string DishId { get; set; }
        public object SoldWithDishId { get; set; }
        public string OrderDiscountType { get; set; }
        public decimal DishSumInt { get; set; }
        public decimal DiscountSum { get; set; }
        public decimal DishReturnSum { get; set; }
        public decimal DishDiscountSumInt { get; set; }
        public decimal DishAmountInt { get; set; }
    }

    public class TransactionDetailsByID
    {
        public List<Payment> payments { get; set; }
        public List<ProductItem> productItems { get; set; }
    }

    public class Transaction
    {
        public TransactionData Transaction_Header { get; set; }
        public TransactionDetailsByID Transaction_Details { get; set; }
    }

    public class IIKO_INT
    {
        private HttpClient _httpClient;
        private IList<Transaction> _transactionlist;
        public IIKO_INT()
        {
            var httpClient = new HttpClient(new HttpClientHandler());
            _httpClient = httpClient;
        }
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            string ERROR_MESSAGE = string.Empty;
            //----Add Code for common DB------//
            Cashup CashupObj = new Cashup();
            CashupObj.CashupModelObj = new CashupModel();
            //----ENd Code for common DB------//

            foreach (DataRow dr in dt.Rows)
            {
                foreach (DataRow dr_IntegrationDetails in dt_IntegrationDetails.Select("BRANCH_ID = " + Convert.ToInt32(dr["BRANCH_ID"])).CopyToDataTable().Rows)
                {
                    try
                    {
                        string date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                        LogExceptions.LogInfo("Get Transactions for " + date);
                        ///Get All Transaction

                        //----Add Code for common DB------//
                        decimal CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                        decimal ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                        decimal BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                        CashupObj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                        CashupObj.CashupModelObj.ENTITY_ID = ENTITY_ID;
                        CashupObj.CashupModelObj.BRANCH_ID = BRANCH_ID;

                        DataView dv = dt_IntegrationDetails.DefaultView;
                        dv.RowFilter = "ENTITY_ID=" + ENTITY_ID;
                        DataTable dtIntegrationData = dv.ToTable();
                        //----End Code for common DB------//

                        var _task = GetTransaction(Convert.ToString(dr_IntegrationDetails["URL_PATH"]) + "auth/login", Convert.ToString(dr_IntegrationDetails["USERID"]), Convert.ToString(dr_IntegrationDetails["PASSWORD"]), Convert.ToString(dr_IntegrationDetails["URL_PARAMETERS"]), date);
                        _task.Wait();
                        var _dailytransactionlist = _task.Result;
                        List<TransactionData> DailyTransactionList = _dailytransactionlist;
                        LogExceptions.LogInfo("Total Transactions for " + date + " is " + DailyTransactionList.Count);
                        ///Loop All Transactions to get the Transaction Details
                        _transactionlist = new List<Transaction>();
                        int ISLinesFetched = 0;

                        foreach (TransactionData td in DailyTransactionList)
                        {
                            Transaction TransactionObj = new Transaction();
                            IikoGetTransactionModel Obj = new IikoGetTransactionModel
                            {
                                UniqOrderIdId = td.UniqOrderIdId,
                                Storned = false,
                                OpenDateTyped = td.OpenDateTyped
                            };
                        refetch:
                            try
                            {
                                //https://854-966-482.iikoweb.co.uk/api/
                                var _task2 = GetTransactionById(Convert.ToString(dr_IntegrationDetails["URL_PATH"]) + "auth/login", Convert.ToString(dr_IntegrationDetails["USERID"]), Convert.ToString(dr_IntegrationDetails["PASSWORD"]), Convert.ToString(dr_IntegrationDetails["URL_PARAMETERS"]), Convert.ToString(dr_IntegrationDetails["URL_PATH"]) + "report/guest/check/detail", Obj);
                                _task2.Wait();
                                var _transactioniddetails = _task2.Result;
                                TransactionObj.Transaction_Header = td;
                                TransactionObj.Transaction_Details = _transactioniddetails;
                                _transactionlist.Add(TransactionObj);
                                td.ISLinesFetched = 0;
                                ISLinesFetched = 0;
                            }
                            catch (Exception ex)
                            {
                                LogExceptions.LogError("Error Fetching Transaciton IDs", ex);
                                td.ISLinesFetched = td.ISLinesFetched + 1;
                                ISLinesFetched = td.ISLinesFetched;
                                ERROR_MESSAGE = ex.ToString();
                            }
                            if (td.ISLinesFetched > 0 && td.ISLinesFetched <= 2)
                            {
                                System.Threading.Thread.Sleep(20000);
                                goto refetch;
                            }
                            else if (td.ISLinesFetched > 2)
                            {
                                break;
                            }

                        }
                        if (_transactionlist.Count > 0 && ISLinesFetched <= 2)
                        {
                            DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                            DataSet IIKODS = new DataSet();
                            foreach (DataRow drSession in dt_Session.Rows)
                            {
                                if (Convert.ToInt32(drSession["GROUP_ID"]) != 1)
                                {
                                    DateTime Session_START = Convert.ToDateTime(date + " " + Convert.ToString(drSession["SESSION_START"]));
                                    DateTime Session_END = Convert.ToDateTime(date + " " + Convert.ToString(drSession["SESSION_END"]));
                                    IList<Transaction> _session_transactionlist = new List<Transaction>();
                                    _session_transactionlist = _transactionlist.Where(x => x.Transaction_Header.CloseTime >= Session_START && x.Transaction_Header.CloseTime <= Session_END).ToList();
                                    if (_session_transactionlist.Count > 0)
                                    {
                                        DataSet ds_CashUp_Header = Common_Methods.GetCashUpHeaderID(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(drSession["SESSION_MAPPING_ID"]));
                                        //   FillDataTableWithEPOSData(_session_transactionlist, Convert.ToDecimal(ds_CashUp_Header.Tables[0].Rows[0]["ID"]), Convert.ToDecimal(drSession["SESSION_MAPPING_ID"]));
                                        FillDataTableWithEPOSData_New(_session_transactionlist, Convert.ToDecimal(dr["ID"]), dr_IntegrationDetails, out IIKODS);
                                    }

                                }
                                else
                                {
                                    if (_transactionlist.Count > 0)
                                    {
                                        DataSet ds_CashUp_Header = Common_Methods.GetCashUpHeaderID(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(drSession["SESSION_MAPPING_ID"]));
                                        //    FillDataTableWithEPOSData(_transactionlist, Convert.ToDecimal(ds_CashUp_Header.Tables[0].Rows[0]["ID"]), Convert.ToDecimal(drSession["SESSION_MAPPING_ID"]));
                                        FillDataTableWithEPOSData_New(_transactionlist, Convert.ToDecimal(dr["ID"]), dr_IntegrationDetails, out IIKODS);

                                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                                        LogExceptions.LogInfo("start calling common epos function");
                                        transformData.DataTransform(IntegrationSource.IIKO, dtIntegrationData, IIKODS, CashupObj.CashupModelObj.CASHUP_MAIN_ID, CashupObj);

                                        Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(2, Convert.ToDecimal(dr["ID"]), ERROR_MESSAGE);
                                        ERROR_MESSAGE = string.Empty;

                                    }
                                    else
                                    {
                                        Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(4, Convert.ToDecimal(dr["ID"]), ERROR_MESSAGE);
                                        ERROR_MESSAGE = string.Empty;
                                    }
                                }
                            }


                        }
                        else
                        {
                            if (ISLinesFetched <= 2)
                            {
                                Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(4, Convert.ToDecimal(dr["ID"]), ERROR_MESSAGE);
                                ERROR_MESSAGE = string.Empty;
                            }
                            else
                            {
                                Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(3, Convert.ToDecimal(dr["ID"]), ERROR_MESSAGE);
                                ERROR_MESSAGE = string.Empty;
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(3, Convert.ToDecimal(dr["ID"]), ex.ToString());
                    }
                }
            }
        }
        public async Task<List<TransactionData>> GetTransaction(string authRequestUri, string username, string password, string storeId, string date)
        {
            var integrator = new IkoIntegrator(_httpClient);
            await integrator.InitialConfigure(new Uri(authRequestUri), new IikoAuthentication { Login = username, Password = password }, storeId);
            var href = new UriBuilder(authRequestUri)
            { Path = "api/report/guestcheck", Query = "dateFrom=" + date + "&dateTo=" + date };

            JObject response = await integrator.Get<JObject>(href.Uri, integrator.BearerToken);
            JArray transactions = response["data"] as JArray;
            List<TransactionData> DailyTransactionList = transactions.ToObject<List<TransactionData>>();

            return DailyTransactionList;
        }
        public async Task<TransactionDetailsByID> GetTransactionById(string authRequestUri, string username, string password, string storeId, string href, IikoGetTransactionModel IikoGetTransactionModelObj)
        {
            var integrator = new IkoIntegrator(_httpClient);
            await integrator.InitialConfigure(new Uri(authRequestUri), new IikoAuthentication { Login = username, Password = password }, storeId);
            var model = IikoGetTransactionModelObj;
            //new IikoGetTransactionModel
            //{
            //    UniqOrderIdId = "7f43e6dc-1084-434c-bcf8-a90bd823236c",
            //    CloseTime = null,
            //    Storned = null,
            //    OpenDateTyped = "2021-03-20"
            //};
            var response = await integrator.Post<IikoGetTransactionModel, JObject>(new Uri(href), model, integrator.BearerToken);

            TransactionDetailsByID TransactionIDDetails = JsonConvert.DeserializeObject<TransactionDetailsByID>(response.ToString());
            return TransactionIDDetails;
        }

        DataSet Create_DataTables()
        {
            DataSet ds = new DataSet();

            #region DECLARATION_DETAIL
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

            ds.Tables.Add(DECLARATION_DETAIL);
            #endregion
            #region MEDIA_DETAIL
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

            ds.Tables.Add(MEDIA_DETAIL);
            #endregion
            #region EPOS_DISCOUNTS_TYPE
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

            ds.Tables.Add(EPOS_DISCOUNTS_TYPE);
            #endregion
            #region EPOS_TAXES_TYPE
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

            ds.Tables.Add(EPOS_TAXES_TYPE);
            #endregion
            #region EPOS_SERVING_PERIOD_TYPE
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

            ds.Tables.Add(EPOS_SERVING_PERIOD_TYPE);
            #endregion
            #region INTEGRATION_DATA_TYPE
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
            ds.Tables.Add(INTEGRATION_DATA_TYPE);
            #endregion

            return ds;
        }

        DataTable Create_DatataTable_Iiko_Header_Type()
        {
            DataTable IIKO_HEADER = new DataTable();
            DataColumn COLUMN = new DataColumn("CASHIER", typeof(string)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CLOSE_TIME", typeof(DateTime)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("OPEN_DATE_TYPED", typeof(DateTime)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DEPARTMENT_CODE", typeof(string)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_DISCOUNT_SUM_INT", typeof(decimal)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_RETURN_SUM", typeof(decimal)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_SUM_INT", typeof(decimal)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ORDER_NUM", typeof(string)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UNIQ_ORDER_ID", typeof(string)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ORDER_TYPE", typeof(string)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SESSION_NUM", typeof(int)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STORNED", typeof(bool)); IIKO_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TABLE_NUM", typeof(int)); IIKO_HEADER.Columns.Add(COLUMN);
            return IIKO_HEADER;
        }
        DataTable Create_DatataTable_Iiko_Lines_Type()
        {
            DataTable IIKO_LINE = new DataTable();
            DataColumn COLUMN = new DataColumn("DISH_GROUP", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_NAME", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_SIZE_NAME", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ORDER_ITEMS", typeof(int)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_ID", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SOLD_WITH_DISH_ID", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ORDER_DISCOUNT_TYPE", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_SUM_INT", typeof(decimal)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_SUM", typeof(decimal)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_RETURN_SUM", typeof(decimal)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_DISCOUNT_SUM_INT", typeof(decimal)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_AMOUNT_INT", typeof(decimal)); IIKO_LINE.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UNIQ_ORDER_ID", typeof(string)); IIKO_LINE.Columns.Add(COLUMN);
            return IIKO_LINE;
        }
        DataTable Create_DatataTable_Iiko_Payment_Type()
        {
            DataTable IIKO_PAYMENT = new DataTable();
            DataColumn COLUMN = new DataColumn("CASHIER", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CLOSE_TIME", typeof(DateTime)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("OPEN_TIME", typeof(DateTime)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_ACTUAL_TIME", typeof(DateTime)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_PHONE", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_CUSTOMER_NAME", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_ADDRESS", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_COURIER", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYTYPES", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_IS_DELIVERY", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DELIVERY_SERVICE_TYPE", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_DISCOUNT_SUM_INT", typeof(decimal)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_RETURN_SUM", typeof(decimal)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_SUM", typeof(decimal)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISH_SUM_INT", typeof(decimal)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VAT_SUM", typeof(decimal)); IIKO_PAYMENT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("UNIQ_ORDER_ID", typeof(string)); IIKO_PAYMENT.Columns.Add(COLUMN);

            return IIKO_PAYMENT;
        }
        void FillDataTableWithEPOSData(IList<Transaction> _transactionsList, decimal CashupHeaderID, decimal SessionID)
        {
            DataSet ds_tables = Create_DataTables();
            DataTable DECLARATION_DETAIL = ds_tables.Tables[0];
            DataTable MEDIA_DETAIL = ds_tables.Tables[1];
            DataTable EPOS_DISCOUNTS_TYPE = ds_tables.Tables[2];
            DataTable EPOS_TAXES_TYPE = ds_tables.Tables[3];
            DataTable EPOS_SERVING_PERIOD_TYPE = ds_tables.Tables[4];
            DataTable INTEGRATION_DATA_TYPE = ds_tables.Tables[5];

            decimal Total_with_tax_Less_discounts = 0;
            decimal ServiceCharge = 0;
            decimal Discounts = 0;
            decimal Amount = 0;
            decimal Total_taxes = 0;

            IList<decimal> Cashup_Epos_Header = new List<decimal>();
            #region Loop
            foreach (Transaction tran in _transactionsList)
            {
                foreach (ProductItem item in tran.Transaction_Details.productItems)
                {
                    string AccountGroup = item.DishGroup == null || Convert.ToString(item.DishGroup) == "" ? "Others" : item.DishGroup;
                    Payment pmt = tran.Transaction_Details.payments.Count > 0 ? tran.Transaction_Details.payments[0] : new Payment();
                    DataRow DR = DECLARATION_DETAIL.NewRow();
                    DR[0] = AccountGroup;
                    DR[1] = item.OrderItems;
                    DR[2] = item.DishSumInt;//Convert.ToString(dr["Total_with_tax_Less_discounts"]) == "" ? 0 : Convert.ToDecimal(dr["Total_with_tax_Less_discounts"]);// - (Convert.ToString(dr["Service charge 12.5%"]) == "" ? 0 : Convert.ToDecimal(dr["Service charge 12.5%"]));
                    DR[3] = 0;// item.DishDiscountSumInt;
                    DR[4] = 0;// Convert.ToString(dr["Total_taxes"]) == "" ? 0 : Convert.ToDecimal(dr["Total_taxes"]);
                    DR[5] = item.DishSumInt;//Convert.ToString(dr["Total_without_tax"]) == "" ? 0 : Convert.ToDecimal(dr["Total_without_tax"])
                    DR[6] = item.DishAmountInt;//COUNT OF ITEMS SOLD
                    DR[7] = item.DishSumInt;//Convert.ToString(dr["Total"]) == "" ? 0 : Convert.ToDecimal(dr["Total"]);
                    DR[8] = AccountGroup; //AGCODE
                    DR[9] = AccountGroup; //AGID
                    DECLARATION_DETAIL.Rows.Add(DR);

                    DataRow DRI = INTEGRATION_DATA_TYPE.NewRow();
                    DRI[0] = 2;
                    DRI[1] = AccountGroup;//ed.accountingGroupId;
                    DRI[2] = AccountGroup;// ed.AccountingGroup;
                    DRI[3] = AccountGroup;// ed.AG_CODE;
                    DRI[16] = tran.Transaction_Header.Cashier;
                    DRI[17] = tran.Transaction_Header.CloseTime;
                    DRI[18] = tran.Transaction_Header.DepartmentCode;
                    DRI[19] = tran.Transaction_Header.DishDiscountSumInt;
                    DRI[20] = tran.Transaction_Header.DishReturnSum;
                    DRI[21] = tran.Transaction_Header.OpenDateTyped;
                    DRI[22] = tran.Transaction_Header.OrderNum;
                    DRI[23] = tran.Transaction_Header.OrderType;
                    DRI[24] = tran.Transaction_Header.SessionNum;
                    DRI[25] = tran.Transaction_Header.Storned;
                    DRI[26] = tran.Transaction_Header.UniqOrderIdId;
                    DRI[27] = tran.Transaction_Header.DishSumInt;
                    DRI[28] = tran.Transaction_Header.TableNum;

                    if (tran.Transaction_Details.payments.Count > 0)
                    {
                        DRI[29] = pmt.OpenTime;
                        DRI[30] = pmt.DeliveryActualTime;
                        DRI[31] = pmt.DeliveryPhone;
                        DRI[32] = pmt.DeliveryCustomerName;
                        DRI[33] = pmt.DeliveryAddress;
                        DRI[34] = pmt.DeliveryCourier;
                        DRI[35] = pmt.PayTypes;
                        DRI[36] = pmt.Storned;
                        DRI[37] = pmt.DeliveryIsDelivery;
                        DRI[38] = pmt.DeliveryServiceType;
                        DRI[39] = pmt.DishDiscountSumInt;
                        DRI[40] = pmt.DishReturnSum;
                        DRI[41] = pmt.DiscountSum;
                        DRI[42] = pmt.DishSumInt;
                        DRI[43] = pmt.VATSum;
                    }
                    DRI[44] = item.Storned;
                    DRI[45] = item.DishGroup;
                    DRI[46] = item.DishName;
                    DRI[47] = item.DishSizeName;
                    DRI[48] = item.OrderItems;
                    DRI[49] = item.DishId;
                    DRI[50] = item.SoldWithDishId;
                    DRI[51] = item.OrderDiscountType;
                    DRI[52] = item.DishSumInt;
                    DRI[53] = item.DiscountSum;
                    DRI[54] = item.DishReturnSum;
                    DRI[55] = item.DishDiscountSumInt;
                    DRI[56] = item.DishAmountInt;

                    INTEGRATION_DATA_TYPE.Rows.Add(DRI);
                }
                if (tran.Transaction_Details.payments.Count > 0)
                {
                    Payment pmtr = tran.Transaction_Details.payments[0];
                    DataRow DRP = MEDIA_DETAIL.NewRow();
                    DRP[0] = pmtr.PayTypes;//Convert.ToString(dr["Payment_method"]);
                    DRP[6] = pmtr.DishDiscountSumInt;//Convert.ToDecimal(dr["Amount"]);
                    MEDIA_DETAIL.Rows.Add(DRP);
                    Total_with_tax_Less_discounts = Total_with_tax_Less_discounts + pmtr.DishDiscountSumInt;
                    Total_taxes = Total_taxes + pmtr.VATSum;
                }
            }
            #endregion

            Cashup_Epos_Header.Add(Total_with_tax_Less_discounts);
            Cashup_Epos_Header.Add(ServiceCharge);
            Cashup_Epos_Header.Add(Discounts);
            Cashup_Epos_Header.Add(Amount);
            Cashup_Epos_Header.Add(Total_taxes);
            DataTable new_DECLARATION_DETAIL = ds_tables.Tables[0];
            if (DECLARATION_DETAIL.Rows.Count > 0)
            {
                new_DECLARATION_DETAIL = DECLARATION_DETAIL.AsEnumerable()
                  .GroupBy(r => r.Field<string>("PRODUCT_NAME"))
                  .Select(g =>
                  {
                      var row = DECLARATION_DETAIL.NewRow();

                      row["PRODUCT_NAME"] = g.Key;
                      row["PRODUCT_CODE"] = g.Key;
                      row["ACCOUNT_GROUP_ID"] = g.Key;
                      row["UNITS"] = g.Sum(r => r.Field<decimal>("UNITS"));
                      row["VAT_TAX"] = g.Sum(r => r.Field<decimal>("VAT_TAX"));
                      row["DISC_CPN"] = g.Sum(r => r.Field<decimal>("DISC_CPN"));
                      row["GROSS"] = g.Sum(r => r.Field<decimal>("GROSS"));
                      row["NET"] = g.Sum(r => r.Field<decimal>("NET"));
                      row["TOTAL_PER"] = g.Sum(r => r.Field<decimal>("TOTAL_PER"));
                      row["GROSS_LESS_DISCOUNT"] = g.Sum(r => r.Field<decimal>("GROSS_LESS_DISCOUNT"));
                      return row;
                  }).CopyToDataTable();
            }
            DataTable new_MEDIA_DETAIL = ds_tables.Tables[1];
            if (MEDIA_DETAIL.Rows.Count > 0)
            {
                new_MEDIA_DETAIL = MEDIA_DETAIL.AsEnumerable()
                  .GroupBy(r => r.Field<string>("MEDIA"))
                  .Select(g =>
                  {
                      var row = MEDIA_DETAIL.NewRow();

                      row["MEDIA"] = g.Key;
                      row["TOTAL_SALES"] = g.Sum(r => r.Field<decimal>("TOTAL_SALES"));
                      return row;
                  }).CopyToDataTable();
            }
            //Quantity = cl.Sum(c => c.Quantity),
            //                  Total_with_tax_Less_discounts = cl.Sum(c => c.Total_with_tax_Less_discounts),
            //                  Discounts = cl.Sum(c => c.Discounts),
            //                  Total_taxes = cl.Sum(c => c.Total_taxes),
            //                  Total_without_tax = cl.Sum(c => c.Total_without_tax),
            //                  ServiceCharge = cl.Sum(c => c.ServiceCharge)

            CashupModel CashupModelObj = new CashupModel();
            CashupModelObj.USER_ID = 1;
            CashupModelObj.Cashup_Epos_Header = Cashup_Epos_Header;
            CashupModelObj.CASHUP_HEADER_ID = CashupHeaderID.ToString();
            CashupModelObj.SESSION_ID = SessionID;
            CashupModelObj.COMP_DECLARATION = new_MEDIA_DETAIL;
            CashupModelObj.DECLARATION_DETAILS = new_DECLARATION_DETAIL;
            CashupModelObj.EPOS_DISCOUNTS_TYPE = EPOS_DISCOUNTS_TYPE;
            CashupModelObj.EPOS_TAXES_TYPE = EPOS_TAXES_TYPE;
            CashupModelObj.EPOS_SERVING_PERIOD_TYPE = EPOS_SERVING_PERIOD_TYPE;
            CashupModelObj.INTEGRATION_DATA_TYPE = INTEGRATION_DATA_TYPE;
            CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(2);
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = CashupModelObj;
            _ICashUp.EPOS_FILE_UPLOAD_HOMESTEAD();

        }
        void FillDataTableWithEPOSData_New(IList<Transaction> _transactionsList, decimal CashupMainID, DataRow IntegrationDetails, out DataSet IIKODS)
        {
            Cashup _Obj = new Cashup();
            CashupModel CashupModelObj = new CashupModel();
            _Obj.CashupModelObj = new CashupModel();
            IIKODS = new DataSet();

            DataTable DT_IIKO_HEADER = Create_DatataTable_Iiko_Header_Type();
            DataTable DT_IIKO_LINES = Create_DatataTable_Iiko_Lines_Type();
            DataTable DT_IIKO_PAYMENTS = Create_DatataTable_Iiko_Payment_Type();
            if (_transactionsList.Count > 0)
            {
                try
                {
                    foreach (var items in _transactionlist)
                    {
                        DataRow DR_HEADER = DT_IIKO_HEADER.NewRow();
                        DR_HEADER["CASHIER"] = items.Transaction_Header.Cashier == null ? (object)DBNull.Value : items.Transaction_Header.Cashier;
                        DR_HEADER["CLOSE_TIME"] = items.Transaction_Header.CloseTime;
                        DR_HEADER["OPEN_DATE_TYPED"] = items.Transaction_Header.OpenDateTyped;
                        DR_HEADER["DEPARTMENT_CODE"] = items.Transaction_Header.DepartmentCode == null ? (object)DBNull.Value : items.Transaction_Header.DepartmentCode;
                        DR_HEADER["DISH_DISCOUNT_SUM_INT"] = items.Transaction_Header.DishDiscountSumInt.Equals(null) ? 0 : items.Transaction_Header.DishDiscountSumInt;
                        DR_HEADER["DISH_RETURN_SUM"] = items.Transaction_Header.DishReturnSum.Equals(null) ? 0 : items.Transaction_Header.DishReturnSum;
                        DR_HEADER["DISH_SUM_INT"] = items.Transaction_Header.DishSumInt.Equals(null) ? 0 : items.Transaction_Header.DishSumInt;
                        DR_HEADER["ORDER_NUM"] = items.Transaction_Header.OrderNum.Equals(null) ? 0 : items.Transaction_Header.OrderNum;
                        DR_HEADER["UNIQ_ORDER_ID"] = items.Transaction_Header.UniqOrderIdId;
                        DR_HEADER["ORDER_TYPE"] = items.Transaction_Header.OrderType == null ? (object)DBNull.Value : items.Transaction_Header.OrderType;
                        DR_HEADER["SESSION_NUM"] = items.Transaction_Header.SessionNum.Equals(null) ? 0 : items.Transaction_Header.SessionNum;
                        DR_HEADER["STORNED"] = items.Transaction_Header.Storned;
                        DR_HEADER["TABLE_NUM"] = items.Transaction_Header.TableNum.Equals(null) ? 0 : items.Transaction_Header.TableNum;
                        DT_IIKO_HEADER.Rows.Add(DR_HEADER);
                        foreach (var line in items.Transaction_Details.productItems)
                        {
                            DataRow DR_LINE = DT_IIKO_LINES.NewRow();
                            DR_LINE["DISH_GROUP"] = line.DishGroup == null ? (object)DBNull.Value : line.DishGroup;
                            DR_LINE["DISH_NAME"] = line.DishName == null ? (object)DBNull.Value : line.DishName;
                            DR_LINE["DISH_SIZE_NAME"] = line.DishSizeName == null ? (object)DBNull.Value : line.DishSizeName;
                            DR_LINE["ORDER_ITEMS"] = line.OrderItems.Equals(null) ? 0 : line.OrderItems;
                            DR_LINE["DISH_ID"] = line.DishId == null ? (object)DBNull.Value : line.DishId;
                            DR_LINE["SOLD_WITH_DISH_ID"] = line.SoldWithDishId == null ? (object)DBNull.Value : line.SoldWithDishId;
                            DR_LINE["ORDER_DISCOUNT_TYPE"] = line.OrderDiscountType == null ? (object)DBNull.Value : line.OrderDiscountType;
                            DR_LINE["DISH_SUM_INT"] = line.DishSumInt.Equals(null) ? 0 : line.DishSumInt;
                            DR_LINE["DISCOUNT_SUM"] = line.DiscountSum.Equals(null) ? 0 : line.DiscountSum;
                            DR_LINE["DISH_RETURN_SUM"] = line.DishReturnSum.Equals(null) ? 0 : line.DishReturnSum;
                            DR_LINE["DISH_DISCOUNT_SUM_INT"] = line.DishDiscountSumInt.Equals(null) ? 0 : line.DishDiscountSumInt;
                            DR_LINE["DISH_AMOUNT_INT"] = line.DishAmountInt.Equals(null) ? 0 : line.DishAmountInt;
                            DR_LINE["UNIQ_ORDER_ID"] = items.Transaction_Header.UniqOrderIdId;
                            DT_IIKO_LINES.Rows.Add(DR_LINE);
                        }
                        foreach (var payment in items.Transaction_Details.payments)
                        {
                            DataRow DR_PAYMENT = DT_IIKO_PAYMENTS.NewRow();
                            DR_PAYMENT["CASHIER"] = payment.Cashier == null ? (object)DBNull.Value : payment.Cashier;
                            DR_PAYMENT["CLOSE_TIME"] = payment.CloseTime == null ? (object)DBNull.Value : payment.CloseTime;
                            DR_PAYMENT["OPEN_TIME"] = payment.OpenTime == null ? (object)DBNull.Value : payment.OpenTime;
                            DR_PAYMENT["DELIVERY_ACTUAL_TIME"] = payment.DeliveryActualTime == null ? (object)DBNull.Value : payment.DeliveryActualTime;
                            DR_PAYMENT["DELIVERY_PHONE"] = payment.DeliveryPhone == null ? (object)DBNull.Value : payment.DeliveryPhone;
                            DR_PAYMENT["DELIVERY_CUSTOMER_NAME"] = payment.DeliveryCustomerName == null ? (object)DBNull.Value : payment.DeliveryCustomerName;
                            DR_PAYMENT["DELIVERY_ADDRESS"] = payment.DeliveryAddress == null ? (object)DBNull.Value : payment.DeliveryAddress;
                            DR_PAYMENT["DELIVERY_COURIER"] = payment.DeliveryCourier == null ? (object)DBNull.Value : payment.DeliveryCourier;
                            DR_PAYMENT["PAYTYPES"] = payment.PayTypes == null ? (object)DBNull.Value : payment.PayTypes;
                            DR_PAYMENT["DELIVERY_IS_DELIVERY"] = payment.DeliveryIsDelivery == null ? (object)DBNull.Value : payment.DeliveryIsDelivery;
                            DR_PAYMENT["DELIVERY_SERVICE_TYPE"] = payment.DeliveryServiceType == null ? (object)DBNull.Value : payment.DeliveryServiceType;
                            DR_PAYMENT["DISH_DISCOUNT_SUM_INT"] = payment.DishDiscountSumInt.Equals(null) ? 0 : payment.DishDiscountSumInt;
                            DR_PAYMENT["DISH_RETURN_SUM"] = payment.DishReturnSum.Equals(null) ? 0 : payment.DishReturnSum;
                            DR_PAYMENT["DISCOUNT_SUM"] = payment.DiscountSum.Equals(null) ? 0 : payment.DiscountSum;
                            DR_PAYMENT["DISH_SUM_INT"] = payment.DishSumInt.Equals(null) ? 0 : payment.DishSumInt;
                            DR_PAYMENT["VAT_SUM"] = payment.VATSum.Equals(null) ? 0 : payment.VATSum;
                            DR_PAYMENT["UNIQ_ORDER_ID"] = items.Transaction_Header.UniqOrderIdId;
                            DT_IIKO_PAYMENTS.Rows.Add(DR_PAYMENT);
                        }
                    }
                }
                catch (Exception ex)
                {

                    throw;
                }

            }

            if (DT_IIKO_HEADER.Rows.Count > 0)
            {
                try
                {
                    IIKODS.Tables.Add(DT_IIKO_HEADER.Copy());
                    IIKODS.Tables.Add(DT_IIKO_LINES.Copy());
                    IIKODS.Tables.Add(DT_IIKO_PAYMENTS.Copy());

                    _Obj.CashupModelObj.CASHUP_MAIN_ID = CashupMainID;
                    _Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(IntegrationDetails["ENTITY_ID"]);
                    _Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(IntegrationDetails["BRANCH_ID"]);
                    _Obj.CashupModelObj.IIKO_HEADER = DT_IIKO_HEADER;
                    _Obj.CashupModelObj.IIKO_LINES = DT_IIKO_LINES;
                    _Obj.CashupModelObj.IIKO_PAYMENTS = DT_IIKO_PAYMENTS;
                    _Obj.INS_UPD_IIKO_CASHUP_DATA();
                }
                catch (Exception ex)
                {

                    throw;
                }


            }

        }


    }
}
