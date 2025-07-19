using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;
using static EPOS_Integration.SYRVE.SYRVE_MODEL;

namespace EPOS_Integration.SYRVE
{
    public class SYRVE
    {
        Dictionary<string, string> _header;
        Dictionary<string, string> _body;
        Dictionary<string, string> _queryString;
        string[] _parameters = { };
        string[] _parameters_API_KEY = { };
        string[] _stringSeparators = new string[] { ":;:" };

        Epos_Integrator.EPOS_INTEGRATOR _integrator;
        Cashup _Obj = new Cashup();
        Root_Token _rootToken;
        SYRVE_TABLES _syrve;

        public SYRVE()
        {
            _Obj.CashupModelObj = new CashupModel();
            _integrator = new Epos_Integrator.EPOS_INTEGRATOR();
            _syrve = new SYRVE_TABLES();
        }
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            try
            {
                foreach (DataRow dr in dt.Rows)
                {
                    Obj.CashupModelObj = new CashupModel();
                    Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                    Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                    Obj.CashupModelObj.USER_ID = 1;
                    SYRVE_MODEL _syrve_Model = new SYRVE_MODEL();
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
 

                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();
 
                    try
                    {
                        
                        //FetchTips(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj,_syrve_Model);
                        FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj, _syrve_Model);
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
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = Obj.CashupModelObj.ERROR_MESSAGE = "SaveDataToDB - TISSL -" + ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        void FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup cashup, SYRVE_MODEL _syrve_Model)
        {
            try
            {
                string _syrve_Status = string.Empty;

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                _body.Add("login", dtIntegrationData.Rows[0]["USERID"].ToString());
                _body.Add("password", dtIntegrationData.Rows[0]["PASSWORD"].ToString());
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_body);
                Root_Token _rootToken = _integrator.Post<Root_Token>(Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]), _header, _queryString, new Dictionary<string, string>(), _bodyJSON, null, "");

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();
                string[] Splitpath = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]).Split('/');
                string FullPath = Splitpath[0] +"//"+ Splitpath[2];


                //_header.Add("Authorization", "Bearer " + _rootToken.token);
                //Dictionary<string, string> _rootSite = _integrator.Get<Dictionary<string, string>>("https://iam-de-palm-cafe.syrve.app/api/stores/select/" + Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]), _header, _queryString, _body, null, "");

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                _header.Add("Authorization", "Bearer " + _rootToken.token);
                Syrve_Root _syrve_Body = new Syrve_Root();
                _syrve_Body.olapType = "SALES";
                _syrve_Body.storeIds = new List<string> { Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]) };
                _syrve_Body.groupFields = new List<string> {"OpenDate.Typed","UniqOrderId.Id","OrderNum","GuestNum","TableNum","SessionNum","Department","OpenTime","CloseTime","OrderWaiter.Name",
                    "OrderWaiter.Id","Cashier","OrderDiscount.Type","Storned","Currencies.Currency","Cashier.Code","DishCode","DishName","DishGroup","PayTypes.Group","PaymentTransaction.Id",
                    "SoldWithDish","OrderDiscount.Type","OrderDiscount.Type.IDs","PayTypes.Group","PayTypes","RestorauntGroup","DishCategory","DishGroup.TopParent","DishGroup.SecondParent",
                    "DishGroup.ThirdParent","DishGroup.Num","PayTypes","DiscountPercent","DishCategory.Id","DishGroup.Id","SoldWithDish.Id","SoldWithItem.Id","DishAmountInt"};
                _syrve_Body.stackByDataFields = false;
                _syrve_Body.dataFields = new List<string> { "DishDiscountSumInt", "DishDiscountSumInt.withoutVAT", "VAT.Sum",
                    "VAT.Percent", "DiscountSum", "DiscountPercent", "DishReturnSum", "DishReturnSum.withoutVAT" };
                _syrve_Body.calculatedFields = new List<CalculatedField>() { new CalculatedField {
                    name="Sales",title="Sales",description="Net sales",formula="[DishDiscountSumInt.withoutVAT]",type="MONEY",canSum=false
                } };
                _syrve_Body.filters = new List<Filter>()
                {
                    new Filter {field= "OpenDate.Typed",filterType= "date_range",dateFrom= Start_date,dateTo= End_date,valueMin= null,valueMax= null,valueList= new List<object>(),includeLeft= true,includeRight = false,inclusiveList= true}
                };
                _syrve_Body.includeVoidTransactions = true;
                _syrve_Body.includeNonBusinessPaymentTypes = true;

                string _syrveJsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(_syrve_Body);
                Syrve_Init_Root _syrveInitRoot = _integrator.Post<Syrve_Init_Root>(FullPath+"/api/olap/init", _header, _queryString, _body, _syrveJsonBody, null, "");

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();
                _header.Add("Authorization", "Bearer " + _rootToken.token);
                int _icounter = 0;
                do
                {
                    Syrve_Init_Root _syrveStatusRoot = _integrator.Get<Syrve_Init_Root>(FullPath+"/api/olap/fetch-status/" + _syrveInitRoot.data.ToString(), _header, _queryString, _body, null, "");
                    _syrve_Status = _syrveStatusRoot.data.ToString().ToLower();
                    _icounter++;
                }
                while (_syrve_Status != "SUCCESS".ToLower() && _icounter<=3);
                if (_syrve_Status == "SUCCESS".ToLower())
                {
                    _header = new Dictionary<string, string>();
                    _body = new Dictionary<string, string>();
                    _queryString = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _rootToken.token);
                    Syrve_OLAP_Root _syrveOLAPRoot = _integrator.Post<Syrve_OLAP_Root>(FullPath+"/api/olap/fetch/" + _syrveInitRoot.data.ToString() + "/json", _header, _queryString, _body, _syrveJsonBody, null, "");

                    IList<Syrve_Table_Type> _syrve_Table_Type = _syrveOLAPRoot.result.rawData.Select(p => new Syrve_Table_Type
                    {
                        Cashier = p.Cashier,
                        CashierCode = p.CashierCode,
                        CloseTime = p.CloseTime,
                        CurrenciesCurrency = p.CurrenciesCurrency,
                        Department = p.Department,
                        DiscountPercent = p.DiscountPercent,
                        DiscountSum = p.DiscountSum,
                        DishCategory = p.DishCategory,
                        DishCode = p.DishCode,
                        DishDiscountSumInt = p.DishDiscountSumInt,
                        DishDiscountSumIntwithoutVAT = p.DishDiscountSumIntwithoutVAT,
                        DishGroup = p.DishGroup,
                        DishGroupNum = p.DishGroupNum,
                        DishGroupSecondParent = p.DishGroupSecondParent,
                        DishGroupThirdParent = p.DishGroupThirdParent,
                        DishGroupTopParent = p.DishGroupTopParent,
                        DishName = p.DishName,
                        DishReturnSum = p.DishReturnSum,
                        DishReturnSumwithoutVAT = p.DishReturnSumwithoutVAT,
                        GuestNum = p.GuestNum,
                        OpenDateTyped = p.OpenDateTyped,
                        OpenTime = p.OpenTime,
                        OrderDiscountType = p.OrderDiscountType,
                        OrderDiscountTypeIDs = p.OrderDiscountTypeIDs,
                        OrderNum = p.OrderNum,
                        OrderWaiterName = p.OrderWaiterName,
                        PayTypes = p.PayTypes,
                        PayTypesGroup = p.PayTypesGroup,
                        PaymentTransactionId = p.PaymentTransactionId,
                        RestorauntGroup = p.RestorauntGroup,
                        SessionNum = p.SessionNum,
                        SoldWithDish = p.SoldWithDish,
                        Storned = p.Storned,
                        TableNum = p.TableNum,
                        UniqOrderIdId = p.UniqOrderIdId,
                        VATPercent = p.VATPercent,
                        VATSum = p.VATSum,
                        _BusinessDays = p._BusinessDays,
                        _SalesNet = p._SalesNet,
                        _Transactions = p._Transactions,
                        Sales = p.Sales,
                        OrderWaiterId = p.OrderWaiterId,
                        DishAmountInt = p.DishAmountInt,
                        DishCategoryId = p.DishCategoryId,
                        DishGroupId = p.DishGroupId,
                        SoldWithDishId = p.SoldWithDishId,
                        SoldWithItemId = p.SoldWithItemId

                    }).ToList();

                    _syrve_Model.DATATABLE_1 = ToDataTables(_syrve_Table_Type);
                    if (_syrveOLAPRoot != null && _syrve_Model.DATATABLE_1.Rows.Count > 0)
                    {
                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                        DataSet Dataset = new DataSet();
                        Dataset.Tables.Add(_syrve_Model.DATATABLE_1);
                        //Dataset.Tables.Add(_syrve_Model.DATATABLE_2);
                        transformData.DataTransform(IntegrationSource.SYRVE, dtIntegrationData, Dataset, cashup.CashupModelObj.CASHUP_MAIN_ID, cashup);
                        cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    else
                    {
                        cashup.CashupModelObj.INTEGRATION_STATUS = 4;
                        cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                }
                else
                {
                    cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                    cashup.CashupModelObj.ERROR_MESSAGE = "ERROR FROM API";
                    cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                }
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = ex.Message.ToString();
                cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        void FetchTips(string Start_date, string End_date, DataTable dtIntegrationData, Cashup cashup, SYRVE_MODEL _syrve_Model)
        {
            try
            {
                string _syrve_Status = string.Empty;

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                _body.Add("login", dtIntegrationData.Rows[0]["USERID"].ToString());
                _body.Add("password", dtIntegrationData.Rows[0]["PASSWORD"].ToString());
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_body);
                Root_Token _rootToken = _integrator.Post<Root_Token>(Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]), _header, _queryString, new Dictionary<string, string>(), _bodyJSON, null, "");

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                string[] Splitpath = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]).Split('/');
                string FullPath = Splitpath[0] + "//" + Splitpath[2];

                _header.Add("Authorization", "Bearer " + _rootToken.token);
                SyrveTips_Root _syrve_Body = new SyrveTips_Root();
                _syrve_Body.olapType = "TRANSACTIONS";
                _syrve_Body.storeIds = new List<string> { Convert.ToString(dtIntegrationData.Rows[0]["URL_PARAMETERS"]) };
                _syrve_Body.groupFields = new List<string> { "Department", "DateTime.DateTyped", "Account.Name", "OrderNum" };
                _syrve_Body.stackByDataFields = false;
                _syrve_Body.dataFields = new List<string> { "Sum.ResignedSum" };
                _syrve_Body.calculatedFields = new List<CalculatedField>();
                _syrve_Body.filters = new List<Filter>()
                {
                    new Filter {field= "DateTime.OperDayFilter",filterType= "date_range",dateFrom=Start_date,dateTo= End_date,valueMin= null,valueMax= null,valueList= new List<object>(),includeLeft= true,includeRight = false,inclusiveList= true},
                    new Filter{ field="TransactionType",filterType="value_list",valueList=new List<object>(){ "TIPS"} }
                };               

                string _syrveJsonBody = Newtonsoft.Json.JsonConvert.SerializeObject(_syrve_Body);
                Syrve_Init_Root _syrveInitRoot = _integrator.Post<Syrve_Init_Root>(FullPath+"/api/olap/init", _header, _queryString, _body, _syrveJsonBody, null, "");

                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();
                _header.Add("Authorization", "Bearer " + _rootToken.token);

                do
                {
                    Syrve_Init_Root _syrveStatusRoot = _integrator.Get<Syrve_Init_Root>(FullPath+"/api/olap/fetch-status/" + _syrveInitRoot.data.ToString(), _header, _queryString, _body, null, "");
                    _syrve_Status = _syrveStatusRoot.data.ToString().ToLower();
                }
                while (_syrve_Status != "SUCCESS".ToLower());
                if (_syrve_Status == "SUCCESS".ToLower())
                {
                    _header = new Dictionary<string, string>();
                    _body = new Dictionary<string, string>();
                    _queryString = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _rootToken.token);
                    Syrve_OLAP_Root _syrveOLAPRoot = _integrator.Post<Syrve_OLAP_Root>(FullPath+"/api/olap/fetch/" + _syrveInitRoot.data.ToString() + "/json", _header, _queryString, _body, _syrveJsonBody, null, "");

                    IList<Syrve_Tips_Table_Type> _syrve_Table_Type = _syrveOLAPRoot.result.rawData.Select(p => new Syrve_Tips_Table_Type
                    {
                         AccountName=p.AccountName,
                         DateTimeDateTyped=p.DateTimeDateTyped,
                         Department=p.Department,
                         OrderNum=p.OrderNum,
                         SumResignedSum=p.SumResignedSum ?? 0

                    }).ToList();
                   
                    _syrve_Model.DATATABLE_2 = ToDataTables(_syrve_Table_Type); 
                }
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = ex.Message.ToString();
                cashup.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        public DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                if (prp.PropertyType.IsGenericType && prp.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                    table.Columns.Add(prp.Name, prp.PropertyType.GetGenericArguments()[0].Name.GetType());
                else
                    table.Columns.Add(prp.Name, prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
    }
}
