using App_Repository;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Web;
using Utility;
using ViewModels;

namespace EPOS_Integration.FOODICS
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class Foodics
    {
        bool IS_Error_Ocurr = false;
        Epos_Integrator.EPOS_INTEGRATOR _integrator;
        Cashup _Obj = new Cashup();
        Foodics_Tables _foodics_tables;

        Dictionary<string, string> _header;
        Dictionary<string, string> _body;
        Dictionary<string, string> _queryString;

        string[] _parameters = { };
        string[] _parameters_API_KEY = { };
        string[] _stringSeparators = new string[] { ":;:" };
        int FOODICS_ORDER_ROW_COUNT = 0;


        public Foodics()
        {
            _Obj.CashupModelObj = new CashupModel();
            _integrator = new Epos_Integrator.EPOS_INTEGRATOR();
            _foodics_tables = new Foodics_Tables();
        }
        public void Fetch_Foodics_Data(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Dictionary<string, string> _queryString = new Dictionary<string, string>();
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();


            DataView _dv = new DataView(dt_IntegrationDetails);
            DataTable _filter_Dist_BranchID = _dv.ToTable(true, "BRANCH_ID");
            try
            {
                foreach (DataRow dr_Dist_BranchID in _filter_Dist_BranchID.Rows)
                {
                    FOODICS_ORDER_ROW_COUNT = 0;
                    int _counter = 0;

                    if (dt.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).Count() > 0)
                    {
                        foreach (DataRow dataRow in dt.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).CopyToDataTable().Rows)
                        {
                            DataTable _filter_InteDtail_By_BranchID = dt_IntegrationDetails.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).CopyToDataTable();
                            _parameters = Convert.ToString(_filter_InteDtail_By_BranchID.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                            _Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dataRow["ID"]);
                            _Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dataRow["BRANCH_ID"]);
                            _Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(dataRow["ENTITY_ID"]);
                            _Obj.CashupModelObj.CASHUP_DATE = Convert.ToDateTime(dataRow["CASHUP_DATE"]);

                            //if (IS_Error_Ocurr == false)
                            //    Get_Categories(dt_IntegrationDetails);
                            //if (IS_Error_Ocurr == false)
                            //    Get_Taxes(dt_IntegrationDetails);
                            //if (IS_Error_Ocurr == false)
                            //    Get_Resions(dt_IntegrationDetails);
                            //if (IS_Error_Ocurr == false)
                            //    Get_PaymentMehods(dt_IntegrationDetails);
                            ////if (IS_Error_Ocurr == false)
                            ////    Get_Modifiers(dt_IntegrationDetails);
                            ////if (IS_Error_Ocurr == false)
                            ////    Get_Modifier_Options(dt_IntegrationDetails);
                            //if (IS_Error_Ocurr == false)
                            //    Get_Discounts(dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Branches(_filter_InteDtail_By_BranchID);
                            if (IS_Error_Ocurr == false)
                                Get_Orders(_filter_InteDtail_By_BranchID);
                            if (IS_Error_Ocurr == false)
                            {
                                try
                                {
                                    if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                                    {
                                        DataSet _ds_Foodics_Orders = _Obj.GET_FOODICS_SALES_DATA();

                                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                                        transformData.DataTransform(IntegrationSource.FOODICS, _filter_InteDtail_By_BranchID, _ds_Foodics_Orders, _Obj.CashupModelObj.CASHUP_MAIN_ID, _Obj);
                                        _Obj.CashupModelObj.INTEGRATION_STATUS = 2;
                                        _Obj.CashupModelObj.ERROR_MESSAGE = "";
                                        _Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();

                                        _Obj.CashupModelObj.DATATABLE_1.Clear();
                                        _Obj.CashupModelObj.DATATABLE_2.Clear();
                                        _Obj.CashupModelObj.DATATABLE_3.Clear();
                                        _Obj.CashupModelObj.DATATABLE_4.Clear();
                                        _Obj.CashupModelObj.DATATABLE_5.Clear();
                                        _Obj.CashupModelObj.DATATABLE_6.Clear();

                                        _foodics_tables.DATATABLE_FOODICS_2.Clear();
                                        _foodics_tables.DATATABLE_FOODICS_3.Clear();
                                        _foodics_tables.DATATABLE_FOODICS_4.Clear();
                                        _foodics_tables.DATATABLE_FOODICS_5.Clear();
                                        _foodics_tables.DATATABLE_FOODICS_6.Clear();
                                    }
                                    else
                                    {
                                        _Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                        _Obj.CashupModelObj.ERROR_MESSAGE = "";
                                        _Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    }
                                }
                                catch (Exception ex)
                                {
                                    LogExceptions.LogError("INS_FOODICS_SALES_DATA", ex);
                                    _Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                                    _Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                                    _Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();                                 
                                }
                            }
                            else
                            {
                                _Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                                _Obj.CashupModelObj.ERROR_MESSAGE = "Error";
                                _Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();

                                _Obj.CashupModelObj.DATATABLE_1.Clear();
                                _Obj.CashupModelObj.DATATABLE_2.Clear();
                                _Obj.CashupModelObj.DATATABLE_3.Clear();
                                _Obj.CashupModelObj.DATATABLE_4.Clear();
                                _Obj.CashupModelObj.DATATABLE_5.Clear();
                                _Obj.CashupModelObj.DATATABLE_6.Clear();

                                _foodics_tables.DATATABLE_FOODICS_2.Clear();
                                _foodics_tables.DATATABLE_FOODICS_3.Clear();
                                _foodics_tables.DATATABLE_FOODICS_4.Clear();
                                _foodics_tables.DATATABLE_FOODICS_5.Clear();
                                _foodics_tables.DATATABLE_FOODICS_6.Clear();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Fetch_Simphony_Data", ex);
                _Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                _Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                _Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }

        void Get_Categories(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_Categories _root;
            int _page = 1;

            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());

                _root = _integrator.Get<Foodic_Models.Root_Categories>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.categories, "categories");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_CATEGORIES_TYPE> _foodics_Categories_Types = _root.data.Select(p => new Foodics_Tables.FOODICS_CATEGORIES_TYPE
                        {
                            CATEGORIES_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = Convert.ToString(p.name_localized),
                            REFERENCE = Convert.ToString(p.reference),
                            IMAGE = Convert.ToString(p.reference),
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at
                        }).ToList();
                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Categories_Types);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_CATEGORIES();
                            _foodics_tables.DATATABLE_FOODICS_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Taxes(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_Taxes _root;
            int _page = 1;

            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());
                _queryString.Add("include", "tax_groups");

                _root = _integrator.Get<Foodic_Models.Root_Taxes>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.taxes, "taxes");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_TAXS_TYPE> _foodics_Taxes_Type = _root.data.Select(p => new Foodics_Tables.FOODICS_TAXS_TYPE
                        {
                            TAXES_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = Convert.ToString(p.name_localized),
                            RATE = p.rate,
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at
                        }).ToList();

                        IList<Foodics_Tables.FOODICS_TAXES_TAX_GROUPS_TYPE> _foodics_Taxes_Group_Type = _root.data.SelectMany(p => p.tax_groups.Select(x => new Foodics_Tables.FOODICS_TAXES_TAX_GROUPS_TYPE
                        {
                            TAXES_TAX_GROUP_ID = x.id,
                            TAXES_TAX_GROUP_NAME = Convert.ToString(x.name),
                            TAXES_TAX_GROUP_NAME_LOCALIZED = Convert.ToString(x.name_localized),
                            TAXES_TAX_GROUP_REFERENCE = Convert.ToString(x.reference),
                            CREATED_AT = x.created_at.Equals(null) ? null : x.created_at,
                            UPDATED_AT = x.updated_at.Equals(null) ? null : x.updated_at,
                            DELETED_AT = x.deleted_at.Equals(null) ? null : x.deleted_at,
                            PIVOT_TAX_ID = x.pivot.tax_id,
                            PIVOT_TAX_GROUP_ID = x.pivot.tax_group_id,
                            REF_TAXES_ID = p.id
                        })).ToList();

                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Taxes_Type);
                        _foodics_tables.DATATABLE_FOODICS_2 = Utility.ConvertToDatatable.ToDataTables(_foodics_Taxes_Group_Type);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.CashupModelObj.DATATABLE_2 = _foodics_tables.DATATABLE_FOODICS_2;
                            _Obj.INS_UPD_FOODICS_TAXES();
                            _foodics_tables.DATATABLE_FOODICS_1.Clear();
                            _foodics_tables.DATATABLE_FOODICS_2.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Resions(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_Reasons _root;
            int _page = 1;

            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());


                _root = _integrator.Get<Foodic_Models.Root_Reasons>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.reasons, "reasons");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_REASONS_TYPE> _foodics_Resions_Type = _root.data.Select(p => new Foodics_Tables.FOODICS_REASONS_TYPE
                        {
                            REASONS_ID = p.id,
                            TYPE = p.type,
                            NAME = p.name,
                            NAME_LOCALIZED = p.name_localized,
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at
                        }).ToList();

                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Resions_Type);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_REASONS();
                            _Obj.CashupModelObj.DATATABLE_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_PaymentMehods(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_PaymentMethods _root;
            int _page = 1;
            FOODICS_ORDER_ROW_COUNT = 0;
            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());

                _root = _integrator.Get<Foodic_Models.Root_PaymentMethods>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.payment_methods, "payment_methods");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_PAYMENT_METHODS_TYPE> _foodics_PaymentMethods_Types = _root.data.Select(p => new Foodics_Tables.FOODICS_PAYMENT_METHODS_TYPE
                        {
                            PAYMENTS_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = Convert.ToString(p.name_localized),
                            TYPE = p.type,
                            CODE = Convert.ToString(p.code),
                            AUTO_OPEN_DRAWER = p.auto_open_drawer,
                            IS_ACTIVE = p.is_active,
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at
                        }).ToList();
                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_PaymentMethods_Types);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            FOODICS_ORDER_ROW_COUNT = _foodics_tables.DATATABLE_FOODICS_1.Rows.Count;
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_PAYMENT_METHODS();
                            _foodics_tables.DATATABLE_FOODICS_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Modifiers(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_Modifires _root;
            int _page = 1;

            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());
                //_queryString.Add("include", "tax_groups");

                _root = _integrator.Get<Foodic_Models.Root_Modifires>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.modifiers, "modifiers");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_MODIFIERS_TYPE> _foodics_Taxes_Type = _root.data.Select(p => new Foodics_Tables.FOODICS_MODIFIERS_TYPE
                        {
                            MODIFIERS_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = p.name_localized,
                            IS_READY = p.is_ready,
                            REFERENCE = Convert.ToString(p.reference),
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at
                        }).ToList();

                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Taxes_Type);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_MODIFIERS();
                            _Obj.CashupModelObj.DATATABLE_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Modifier_Options(DataTable Int_DataTable)
        {

            Foodic_Models.Root_Modifier_Options _root;
            int _page = 1;

            do
            {
                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());
                _queryString.Add("include", "tax_group,branches,ingredients,modifier,price_tags");

                _root = _integrator.Get<Foodic_Models.Root_Modifier_Options>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.modifier_options, "modifier_options");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_MODIFIERS_OPTIONS_TYPE> _foodics_Modifier_Options = _root.data.Select(p => new Foodics_Tables.FOODICS_MODIFIERS_OPTIONS_TYPE
                        {
                            MODIFIERS_OPTIONS_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = p.name_localized,
                            SKU = p.sku,
                            IS_ACTIVE = p.is_active,
                            COSTING_METHOD = p.costing_method,
                            PRICE = p.price,
                            COST = p.cost,
                            CALORIES = p.calories,
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at,
                            MODIFIERS_OPTIONS_INDEX = p.index,
                            MOD_OPT_MODIFIER_ID = p.modifier.id,
                        }).ToList();

                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Modifier_Options);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_MODIFIER_OPTIONS();
                            _Obj.CashupModelObj.DATATABLE_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Discounts(DataTable Int_DataTable)
        {

            Foodic_Models.Root_Discounts _root;
            int _page = 1;

            do
            {
                _header = new Dictionary<string, string>();
                _body = new Dictionary<string, string>();
                _queryString = new Dictionary<string, string>();

                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());

                _root = _integrator.Get<Foodic_Models.Root_Discounts>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.discounts, "discounts");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_DISCOUNTS_TYPE> _foodics_Discounts = _root.data.Select(p => new Foodics_Tables.FOODICS_DISCOUNTS_TYPE
                        {
                            DISCOUNT_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = p.name_localized,
                            QUALIFICATION = p.qualification,
                            AMOUNT = p.amount == null ? null : p.amount,
                            MINIMUM_PRODUCT_PRICE = p.minimum_product_price == null ? null : p.minimum_product_price,
                            MINIMUM_ORDER_PRICE = p.minimum_order_price == null ? null : p.minimum_order_price,
                            MAXIMUM_AMOUNT = p.maximum_amount == null ? null : p.maximum_amount,
                            IS_PERCENTAGE = p.is_percentage,
                            IS_TAXABLE = p.is_taxable,
                            REFERENCE = p.reference,
                            ASSOCIATE_TO_ALL_BRANCHES = p.associate_to_all_branches,
                            INCLUDE_MODIFIERS = p.include_modifiers,
                            CREATED_AT = p.created_at != null ? p.created_at : null,
                            UPDATED_AT = p.updated_at != null ? p.updated_at : null,
                            DELETED_AT = p.deleted_at != null ? p.deleted_at : null

                        }).ToList();

                        _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Discounts);
                        if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                            _Obj.INS_UPD_FOODICS_DISCOUNTS();
                            _Obj.CashupModelObj.DATATABLE_1.Clear();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                }
            } while (_root.data.Count >= 50);

        }
        void Get_Branches(DataTable Int_DataTable)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            Foodic_Models.Root_Branches _root;
            int _page = 1;
            String BRANCH_Id= Convert.ToString(Int_DataTable.Rows[0]["URL_PARAMETERS"].ToString());
            do
            {
                _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                _header.Add("Accept", "application/json");
                _header.Add("Content-Type", "application/json");
                _queryString.Add("page", _page.ToString());

                _root = _integrator.Get<Foodic_Models.Root_Branches>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]), _header, _queryString, _body, Epos_Integrator.DocumentPaths.branches, "branches");
                if (_root.data.Count > 0)
                {
                    try
                    {
                        IList<Foodics_Tables.FOODICS_BRANCHE_TYPE> _foodics_Branch_Types = _root.data.Where(p => p.id == BRANCH_Id).Select(p => new Foodics_Tables.FOODICS_BRANCHE_TYPE
                        {
                            BRANCHES_ID = p.id,
                            NAME = p.name,
                            NAME_LOCALIZED = Convert.ToString(p.name_localized),
                            REFERENCE = Convert.ToString(p.reference),
                            TYPE = p.type,
                            LATITUDE = Convert.ToString(p.latitude),
                            LONGITUDE = Convert.ToString(p.longitude),
                            PHONE = Convert.ToString(p.phone),
                            OPENING_FROM = p.opening_from,
                            OPENING_TO = p.opening_to,
                            INVENTORY_END_OF_DAY_TIME = p.inventory_end_of_day_time,
                            RECEIPT_HEADER = Convert.ToString(p.receipt_header),
                            RECEIPT_FOOTER = Convert.ToString(p.receipt_footer),
                            CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                            UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                            DELETED_AT = p.deleted_at.Equals(null) ? null : p.deleted_at,
                            RECEIVES_ONLINE_ORDERS = p.receives_online_orders,
                            ACCEPTS_RESERVATIONS = p.accepts_reservations,
                            RESERVATION_DURATION = p.reservation_duration,
                            RESERVATION_TIMES = p.reservation_times,
                            ADDRESS = Convert.ToString(p.address),
                            SETTINGS_BRANCH_TAX_NUMBER = p.settings.branch_tax_number,
                            SETTINGS_DISPLAY_BACKGROUND_IMAGE = p.settings.display_background_image.HasValue ? p.settings.display_background_image : false,
                            SETTINGS_BRANCH_COMMERCIAL_REGISTRATION_NUMBER = p.settings.branch_commercial_registration_number
                        }).ToList();
                        _foodics_tables.DATATABLE_FOODICS_BRANCH = Utility.ConvertToDatatable.ToDataTables(_foodics_Branch_Types);
                        if (_foodics_tables.DATATABLE_FOODICS_BRANCH.Rows.Count > 0)
                        {
                            _Obj.CashupModelObj.DATATABLE_BRANCH = _foodics_tables.DATATABLE_FOODICS_BRANCH;
                            _Obj.INS_UPD_FOODICS_BRANCHES();
                            _page++;
                        }
                    }
                    catch (Exception ex)
                    {
                        IS_Error_Ocurr = true;
                        throw ex;
                    }
                }
                else
                {
                    _page = 1;
                    IS_Error_Ocurr = false;
                    _Obj.CashupModelObj.DATATABLE_1.Clear();
                }
            } while (_root.data.Count >= 50);
        }
        void Get_Orders(DataTable Int_DataTable)
        {
            Foodic_Models.Root_Orders _root;
            _Obj.CashupModelObj.DATATABLE_1 = new DataTable();
            _Obj.CashupModelObj.DATATABLE_2 = new DataTable();
            _Obj.CashupModelObj.DATATABLE_3 = new DataTable();
            _Obj.CashupModelObj.DATATABLE_4 = new DataTable();
            _Obj.CashupModelObj.DATATABLE_5 = new DataTable();
            _Obj.CashupModelObj.DATATABLE_6 = new DataTable();
            int _lastPageCount = 0;
            foreach (DataRow _branchDr in _foodics_tables.DATATABLE_FOODICS_BRANCH.Rows)
            {
                int _page = 1;
                do
                {
                    _header = new Dictionary<string, string>();
                    _body = new Dictionary<string, string>();
                    _queryString = new Dictionary<string, string>();
                    Uri Uri; 

                     _parameters_API_KEY = Convert.ToString(Int_DataTable.Rows[0]["API_KEY"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    _header.Add("Authorization", "Bearer " + _parameters_API_KEY[0].ToString());
                    _header.Add("Accept", "application/json");
                    _header.Add("Content-Type", "application/json");
                   
                    _root = _integrator.Get<Foodic_Models.Root_Orders>(Convert.ToString(Int_DataTable.Rows[0]["URL_PATH"]) + "orders?filter[branch_id]=" + Convert.ToString(_branchDr["BRANCHES_ID"]) + "&include=branch,table,table.section,creator,closer,device,driver,customer,customer_address,customer_address.delivery_zone,discount,coupon,tags,promotion,charges,charges.charge,charges.taxes,payments,payments.payment_method,payments.user,gift_card,gift_card.gift_card_product,combos,combos.combo_size,combos.combo_size.combo,combos.products,combos.discount,combos.products.combo_option,combos.products.combo_size, products, products.product, products.product.category, products.discount,products.options, products.options.modifier_option, products.options.taxes, products.taxes,products.timed_events, products.promotion, products.void_reason, products.creator, products.voider, combos.products.product, combos.products.product.category, combos.products.discount, combos.products.options, combos.products.options.modifier_option, combos.products.options.taxes, combos.products.taxes, combos.products.timed_events, combos.products.creator, combos.products.voider, combos.products.promotion, combos.products.void_reason, original_order, discount & sort=check_number&filter[updated_on]=" + _Obj.CashupModelObj.CASHUP_DATE.ToString("yyyy-MM-dd") + "&page=" + _page.ToString(), _header, _queryString, _body, null, "");
                    if (_root.data.Count > 0)
                    {
                        Uri = new Uri(_root.links.last);
                        _lastPageCount =Convert.ToInt32(HttpUtility.ParseQueryString(Uri.Query).Get("page"));
                        try
                        {
                            IList<Foodics_Tables.FOODICS_ORDERS_TYPE> _foodics_Orders_Type = _root.data.Select(p => new Foodics_Tables.FOODICS_ORDERS_TYPE
                            {
                                ORDERS_ID = p.id,
                                APP_ID = p.app_id,
                                PROMOTION_ID = Convert.ToString(p.promotion_id),
                                DISCOUNT_TYPE = p.discount_type.Equals(null) ? null : p.discount_type,
                                REFERENCE_X = Convert.ToString(p.reference_x),
                                NUMBER = p.number,
                                TYPE = p.type,
                                SOURCE = p.source,
                                STATUS = p.status,
                                DELIVERY_STATUS = p.delivery_status,
                                GUESTS = p.guests,
                                KITCHEN_NOTES = Convert.ToString(p.kitchen_notes),
                                CUSTOMER_NOTES = Convert.ToString(p.customer_notes),
                                BUSINESS_DATE = p.business_date.Equals(null) ? null : p.business_date,
                                SUBTOTAL_PRICE = p.subtotal_price.Equals(null) ? null : p.subtotal_price,
                                DISCOUNT_AMOUNT = p.discount_amount,
                                ROUNDING_AMOUNT = p.rounding_amount.Equals(null) ? null : p.rounding_amount,
                                TOTAL_PRICE = p.total_price.Equals(null) ? null : p.total_price,
                                TAX_EXCLUSIVE_DISCOUNT = p.tax_exclusive_discount_amount.Equals(null) ? null : p.tax_exclusive_discount_amount,
                                DELAY_IN_SECONDS = Convert.ToString(p.delay_in_seconds),
                                OPENED_AT = p.opened_at.Equals(null) ? null : p.opened_at,
                                ACCEPTED_AT = p.accepted_at.Equals(null) ? null : p.accepted_at,
                                DUE_AT = p.due_at.Equals(null) ? null : p.due_at,
                                DRIVER_ASSIGNED_AT = p.driver_assigned_at.Equals(null) ? null : p.driver_assigned_at,
                                DISPATCHED_AT = p.dispatched_at.Equals(null) ? null : p.dispatched_at,
                                DRIVER_COLLECTED_AT = p.driver_collected_at.Equals(null) ? null : p.driver_collected_at,
                                DELIVERED_AT = p.delivered_at.Equals(null) ? null : p.delivered_at,
                                CLOSED_AT = p.closed_at.Equals(null) ? null : p.closed_at,
                                CREATED_AT = p.created_at.Equals(null) ? null : p.created_at,
                                UPDATED_AT = p.updated_at.Equals(null) ? null : p.updated_at,
                                REFERENCE = Convert.ToString(p.reference) == "" ? null : Convert.ToString(p.reference),
                                CHECK_NUMBER = p.check_number,
                                META_FOODICS_DEVICE_ID = p.meta != null && p.meta.foodics != null ? Convert.ToString(p.meta.foodics.device_id) : "",
                                META_FOODICS_AUTO_CLOSED = p.meta != null && p.meta.foodics != null ? p.meta.foodics.auto_closed : false,
                                META_FOODICS_KITCHEN_RECEIVED_AT = p.meta != null && p.meta.foodics != null ? p.meta.foodics.kitchen_received_at : null,
                                META_FOODICS_BUSINESS_DATE_IN_UTC = p.meta != null && p.meta.foodics != null ? p.meta.foodics.business_date_in_utc : null,
                                META_FOODICS_VOID_APPROVER_ID = p.meta != null && p.meta.foodics != null ? Convert.ToString(p.meta.foodics.void_approver_id) : "",
                                META_FOODICS_PRINTING_MODEL = "",
                                META_FOODICS_PRINTING_STATUS = Convert.ToString(p.meta.foodics.printing_status),
                                PROMOTION = Convert.ToString(p.promotion),
                                ORIGINAL_ORDER = null,
                                TABLE_ID = p.table != null ? Convert.ToString(p.table.id) : null,
                                TABLE_NAME = p.table != null ? Convert.ToString(p.table.name) : null,
                                TABLE_STATUS = p.table != null ? p.table.status : null,
                                TABLE_SEATS = p.table != null ? p.table.seats : null,
                                TABLE_SECTION_ID = p.table != null ? Convert.ToString(p.table.section.id) : null,
                                TABLE_SECTION_NAME = p.table != null ? Convert.ToString(p.table.section.name) : null,
                                CREATOR_ID = p.creator != null ? Convert.ToString(p.creator.id) : null,
                                CREATOR_NAME = p.creator != null ? Convert.ToString(p.creator.name) : null,
                                CREATOR_PIN = p.creator != null ? Convert.ToString(p.creator.pin) : null,
                                CLOSER_ID = p.closer != null ? Convert.ToString(p.closer.id) : null,
                                CLOSER_NAME = p.closer != null ? Convert.ToString(p.closer.name) : null,
                                CLOSER_PIN = p.closer != null ? Convert.ToString(p.closer.pin) : null,
                                DRIVER = Convert.ToString(p.driver),
                                CUSTOMER = p.customer != null ? p.customer.name : string.Empty,
                                CUSTOMER_ADDRESS = Convert.ToString(p.address),
                                DISCOUNT = null,
                                COUPON = Convert.ToString(p.coupon),
                                GIFT_CARD = Convert.ToString(p.gift_card),
                                DISCOUNT_ID = p.discount != null ? p.discount.id : null,
                                DISCOUNT_NAME = p.discount != null ? p.discount.name : null,
                                DISCOUNT_NAME_LOCALIZED = p.discount != null ? p.discount.name_localized : null,
                                DISCOUNT_QUALIFICATION = p.discount != null ? p.discount.qualification : null,
                                DIS_ODR_AMOUNT = p.discount != null ? p.discount.amount : null,

                            }).ToList();
                            IList<Foodics_Tables.FOODICS_ORDERS_META_PRODUCTS_KITCHEN_TYPE> _foodics_Order_Product_Kitchen_Type = _root.data.SelectMany(p => p.meta.foodics.products_kitchen.Select(x => new Foodics_Tables.FOODICS_ORDERS_META_PRODUCTS_KITCHEN_TYPE
                            {
                                PRODUCTS_KITCHEN_UUID = x.uuid,
                                PRODUCTS_KITCHEN_SENT_AT = x.kitchen_sent_at.Equals(null) ? null : x.kitchen_sent_at,
                                REF_ORDERS_ID = p.id
                            })).ToList();
                            IList<Foodics_Tables.FOODICS_ORDERS_PAYMENT_TYPE> _foodics_Order_Payment_Type = _root.data.SelectMany(p => p.payments.Select(x => new Foodics_Tables.FOODICS_ORDERS_PAYMENT_TYPE
                            {
                                ORDERS_PAYMENT_ID = x.id,
                                AMOUNT = x.amount.Equals(null) ? null : x.amount,
                                TENDERED = x.tendered.Equals(null) ? null : x.tendered,
                                TIPS = x.tips.Equals(null) ? null : x.tips,
                                BUSINESS_DATE = x.business_date,
                                ADDED_AT = x.added_at,
                                USER_ID = x.user.id,
                                USER_NAME = x.user.name,
                                USER_PIN = x.user.pin,
                                payment_method_ID = x.payment_method.id,
                                payment_method_NAME = x.payment_method.name,
                                payment_method_TYPE = x.payment_method.type,
                                payment_method_CODE = x.payment_method.code,
                                PAYMENT_METHOD_IS_ACTIVE = x.payment_method.is_active,
                                REF_ORDERS_ID = p.id
                            })).ToList();
                            IList<Foodics_Tables.FOODICS_ORDERS_PRODUCTS_TYPE> _foodics_Order_Product_Type = _root.data.SelectMany(p => p.products.Select(x => new Foodics_Tables.FOODICS_ORDERS_PRODUCTS_TYPE
                            {
                                FOODICS_ORDERS_PRODUCTS_ID = x.id,
                                DISCOUNT_TYPE = Convert.ToString(x.discount_type),
                                QUANTITY = x.quantity.Equals(null) ? null : x.quantity,
                                RETURNED_QUANTITY = x.returned_quantity,
                                UNIT_PRICE = x.unit_price,
                                DISCOUNT_AMOUNT = x.discount_amount,
                                TOTAL_PRICE = x.total_price,
                                TOTAL_COST = x.total_cost,
                                TAX_EXCLUSIVE_DISCOUNT_AMOUNT = x.tax_exclusive_discount_amount,
                                TAX_EXCLUSIVE_UNIT_PRICE = x.tax_exclusive_unit_price,
                                TAX_EXCLUSIVE_TOTAL_PRICE = x.tax_exclusive_total_price,
                                STATUS = x.status,
                                IS_INGREDIENTS_WASTED = x.is_ingredients_wasted,
                                DELAY_IN_SECONDS = Convert.ToString(x.delay_in_seconds),
                                KITCHEN_NOTES = x.kitchen_notes,
                                META_UUID = x.meta == null ? null : x.meta.foodics.uuid,
                                ADDED_AT = x.added_at.Equals(null) ? null : x.added_at,
                                CLOSED_AT = x.closed_at.Equals(null) ? null : x.closed_at,
                                PROMOTION = Convert.ToString(x.promotion),
                                DISCOUNT = null,
                                ORDERS_PRODUCTS_ID = x.product != null ? x.product.id : "",
                                ORDERS_PRODUCTS_SKU = x.product != null ? x.product.sku : "",
                                ORDERS_PRODUCTS_BARCODE = x.product != null ? Convert.ToString(x.product.barcode) : "",
                                ORDERS_PRODUCTS_NAME = x.product != null ? x.product.name : null,
                                ORDERS_PRODUCTS_NAME_LOCALIZED = x.product != null ? Convert.ToString(x.product.name_localized) : null,
                                ORDERS_PRODUCTS_DESCRIPTION = x.product != null ? Convert.ToString(x.product.description) : null,
                                ORDERS_PRODUCTS_DESCRIPTION_LOCALIZED = x.product != null ? x.product.description_localized : null,
                                ORDERS_PRODUCTS_IMAGE = x.product != null ? x.product.image : null,
                                ORDERS_PRODUCTS_IS_ACTIVE = x.product != null ? x.product.is_active : false,
                                ORDERS_PRODUCTS_IS_STOCK_PRODUCT = x.product != null ? x.product.is_stock_product : false,
                                ORDERS_PRODUCTS_IS_NON_REVENUE = x.product != null ? x.product.is_non_revenue : false,
                                ORDERS_PRODUCTS_IS_READY = x.product != null ? x.product.is_ready : false,
                                ORDERS_PRODUCTS_PRICING_METHOD = x.product != null ? x.product.pricing_method : null,
                                ORDERS_PRODUCTS_SELLING_METHOD = x.product != null ? x.product.selling_method : null,
                                ORDERS_PRODUCTS_COSTING_METHOD = x.product != null ? x.product.costing_method : null,
                                ORDERS_PRODUCTS_PREPARATION_TIME = x.product != null ? x.product.preparation_time : null,
                                ORDERS_PRODUCTS_PRICE = x.product != null ? x.product.price : null,
                                ORDERS_PRODUCTS_COST = x.product != null ? x.product.cost : null,
                                ORDERS_PRODUCTS_CALORIES = x.product != null ? x.product.calories : null,
                                ORDERS_PRODUCTS_CATEGORY_ID = x.product != null && x.product.category != null ? x.product.category.id : null,
                                ORDERS_PRODUCTS_CATEGORY_NAME = x.product != null && x.product.category != null ? x.product.category.name : null,
                                ORDERS_PRODUCTS_CATEGORY_REFERENCE = x.product != null && x.product.category != null ? x.product.category.reference : null,
                                ORDERS_PRODUCTS_CREATOR_ID = x.creator != null ? x.creator.id : null,
                                ORDERS_PRODUCTS_CREATOR_NAME = x.creator != null ? x.creator.name : null,
                                ORDERS_PRODUCTS_CREATOR_PIN = x.creator != null ? x.creator.pin : null,
                                ORDERS_PRODUCTS_VOID_RZN_ID = x.void_reason != null ? x.void_reason.id : null,
                                ORDERS_PRODUCTS_VOID_RZN_TYPE = x.void_reason != null ? x.void_reason.type : null,
                                ORDERS_PRODUCTS_VOID_RZN_NAME = x.void_reason != null ? x.void_reason.name : null,
                                ORDERS_PRODUCTS_VOID_RZN_NAME_LOCALIZED = x.void_reason != null ? x.void_reason.name_localized : null,
                                ORDERS_PRODUCTS_VOID_RZN_CREATED_AT = x.void_reason != null ? x.void_reason.created_at : null,
                                ORDERS_PRODUCTS_VOID_RZN_UPDATED_AT = x.void_reason != null ? x.void_reason.updated_at : null,
                                ORDERS_PRODUCTS_VOID_RZN_DELETED_AT = x.void_reason != null ? x.void_reason.deleted_at : null,
                                ORDERS_PRODUCTS_VOIDER_ID = x.voider != null ? x.voider.id : null,
                                ORDERS_PRODUCTS_VOIDER_NAME = x.voider != null ? x.voider.name : null,
                                ORDERS_PRODUCTS_VOIDER_NUMBER = x.voider != null ? x.voider.number : null,
                                ORDERS_PRODUCTS_VOIDER_EMAIL = x.voider != null ? x.voider.email : null,
                                ORDERS_PRODUCTS_VOIDER_PHONE = x.voider != null ? x.voider.phone : null,
                                ORDERS_PRODUCTS_VOIDER_LANG = x.voider != null ? x.voider.lang : null,
                                ORDERS_PRODUCTS_VOIDER_DISPLAY_LOCALIZED_NAMES = x.voider != null ? x.voider.display_localized_names : false,
                                ORDERS_PRODUCTS_VOIDER_EMAIL_VERIFIED = x.voider != null ? x.voider.email_verified : false,
                                ORDERS_PRODUCTS_VOIDER_MUST_USE_FINGERPRINT = x.voider != null ? x.voider.must_use_fingerprint : false,
                                ORDERS_PRODUCTS_VOIDER_LAST_CONSOLE_LOGIN_AT = x.voider != null ? x.voider.last_console_login_at : null,
                                ORDERS_PRODUCTS_VOIDER_LAST_CASHIER_LOGIN_AT = x.voider != null ? x.voider.last_cashier_login_at : null,
                                ORDERS_PRODUCTS_VOIDER_ASSOCIATE_TO_ALL_BRANCHES = x.voider != null ? x.voider.associate_to_all_branches : false,
                                ORDERS_PRODUCTS_VOIDER_CREATED_AT = x.voider != null ? x.voider.created_at : null,
                                ORDERS_PRODUCTS_VOIDER_UPDATED_AT = x.voider != null ? x.voider.updated_at : null,
                                ORDERS_PRODUCTS_VOIDER_DELETED_AT = x.voider != null ? x.voider.deleted_at : null,
                                ORDERS_PRODUCTS_VOIDER_TWO_FACTOR_AUTH_ENABLED = x.voider != null ? x.voider.two_factor_auth_enabled : false,
                                REF_ORDERS_ID = p.id,

                            })).ToList();
                            IList<Foodics_Tables.FOODICS_ORDERS_PRODUCTS_OPTIONS_TYPE> _foodics_Order_Product_Option_Type = _root.data.SelectMany(p => p.products.SelectMany(x => x.options.Select(y => new Foodics_Tables.FOODICS_ORDERS_PRODUCTS_OPTIONS_TYPE
                            {
                                ORDERS_PRODUCTS_OPTIONS_ID = y.id,
                                QUANTITY = y.quantity,
                                PARTITION = y.partition,
                                UNIT_PRICE = y.unit_price,
                                TOTAL_PRICE = y.total_price,
                                TOTAL_COST = y.total_cost,
                                TAX_EXCLUSIVE_UNIT_PRICE = y.tax_exclusive_unit_price,
                                TAX_EXCLUSIVE_TOTAL_PRICE = y.tax_exclusive_total_price,
                                TAX_EXCLUSIVE_DISCOUNT_AMOUNT = y.tax_exclusive_discount_amount,
                                ADDED_AT = y.added_at.Equals(null) ? null : y.added_at,
                                MODIFIER_OPTION_ID = y.modifier_option != null ? Convert.ToString(y.modifier_option.id) : null,
                                MODIFIER_OPTION_NAME = y.modifier_option != null ? Convert.ToString(y.modifier_option.name) : null,
                                MODIFIER_OPTION_NAME_LOCALIZED = y.modifier_option != null ? Convert.ToString(y.modifier_option.name_localized) : null,
                                MODIFIER_OPTION_SKU = y.modifier_option != null ? Convert.ToString(y.modifier_option.sku) : null,
                                MODIFIER_OPTION_IS_ACTIVE = y.modifier_option != null ? y.modifier_option.is_active : false,
                                MODIFIER_OPTION_COSTING_METHOD = y.modifier_option.Equals(null) ? null : y.modifier_option.costing_method,
                                MODIFIER_OPTION_PRICE = y.modifier_option.Equals(null) ? null : y.modifier_option.price,
                                MODIFIER_OPTION_COST = y.modifier_option.Equals(null) ? null : y.modifier_option.cost,
                                MODIFIER_OPTION_CALORIES = y.modifier_option.Equals(null) ? null : y.modifier_option.calories,
                                MODIFIER_OPTION_CREATED_AT = y.modifier_option.Equals(null) ? null : y.modifier_option.created_at,
                                MODIFIER_OPTION_UPDATED_AT = y.modifier_option.Equals(null) ? null : y.modifier_option.updated_at,
                                MODIFIER_OPTION_DELETED_AT = y.modifier_option.Equals(null) ? null : y.modifier_option.deleted_at,
                                MODIFIER_OPTION_INDEX = y.modifier_option.Equals(null) ? null : y.modifier_option.index,
                                REF_ORDERS_ID = p.id,
                                REF_FOODICS_ORDERS_PRODUCTS_ID = x.id
                            }))).ToList();
                            IList<Foodics_Tables.FOODICS_ORDERS_PRODUCTS_TAXES_TYPE> _foodics_Order_Product_Taxes_Type = _root.data.SelectMany(p => p.products.SelectMany(x => x.taxes.Select(y => new Foodics_Tables.FOODICS_ORDERS_PRODUCTS_TAXES_TYPE
                            {
                                ORDERS_PRODUCTS_TAXES_id = y.id,
                                ORDERS_PRODUCTS_TAXES_name = Convert.ToString(y.name),
                                ORDERS_PRODUCTS_TAXES_name_localized = Convert.ToString(y.name_localized),
                                ORDERS_PRODUCTS_TAXES_rate = y.rate.Equals(null) ? null : y.rate,
                                ORDERS_PRODUCTS_TAXES_created_at = y.created_at.Equals(null) ? null : y.created_at,
                                ORDERS_PRODUCTS_TAXES_updated_at = y.updated_at.Equals(null) ? null : y.updated_at,
                                ORDERS_PRODUCTS_TAXES_deleted_at = y.deleted_at.Equals(null) ? null : y.deleted_at,
                                TAXES_PIVOT_AMOUNT = y.pivot != null ? y.pivot.amount : null,
                                TAXES_PIVOT_RATE = y.pivot != null ? y.pivot.rate : null,
                                TAXES_PIVOT_TAX_EXCLUSIVE_DISCOUNT_AMOUNT = y.pivot != null ? y.pivot.tax_exclusive_discount_amount : null,
                                REF_ORDERS_ID = p.id,
                                REF_FOODICS_ORDERS_PRODUCTS_ID = x.id
                            }))).ToList();

                            _foodics_tables.DATATABLE_FOODICS_1 = Utility.ConvertToDatatable.ToDataTables(_foodics_Orders_Type);
                            _foodics_tables.DATATABLE_FOODICS_2 = Utility.ConvertToDatatable.ToDataTables(_foodics_Order_Product_Kitchen_Type);
                            _foodics_tables.DATATABLE_FOODICS_3 = Utility.ConvertToDatatable.ToDataTables(_foodics_Order_Payment_Type);
                            _foodics_tables.DATATABLE_FOODICS_4 = Utility.ConvertToDatatable.ToDataTables(_foodics_Order_Product_Type);
                            _foodics_tables.DATATABLE_FOODICS_5 = Utility.ConvertToDatatable.ToDataTables(_foodics_Order_Product_Option_Type);
                            _foodics_tables.DATATABLE_FOODICS_6 = Utility.ConvertToDatatable.ToDataTables(_foodics_Order_Product_Taxes_Type);
                            if (_foodics_tables.DATATABLE_FOODICS_1.Rows.Count > 0)
                            {
                                if (_Obj.CashupModelObj.DATATABLE_1.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_1.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_1.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_1 = _foodics_tables.DATATABLE_FOODICS_1;
                                }
                                if (_Obj.CashupModelObj.DATATABLE_2.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_2.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_2.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_2 = _foodics_tables.DATATABLE_FOODICS_2;
                                }
                                if (_Obj.CashupModelObj.DATATABLE_3.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_3.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_3.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_3 = _foodics_tables.DATATABLE_FOODICS_3;
                                }
                                if (_Obj.CashupModelObj.DATATABLE_4.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_4.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_4.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_4 = _foodics_tables.DATATABLE_FOODICS_4;
                                }
                                if (_Obj.CashupModelObj.DATATABLE_5.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_5.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_5.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_5 = _foodics_tables.DATATABLE_FOODICS_5;
                                }
                                if (_Obj.CashupModelObj.DATATABLE_6.Rows.Count > 0)
                                {
                                    foreach (DataRow dr in _foodics_tables.DATATABLE_FOODICS_6.Rows)
                                    {
                                        _Obj.CashupModelObj.DATATABLE_6.Rows.Add(dr.ItemArray);
                                    }
                                }
                                else
                                {
                                    _Obj.CashupModelObj.DATATABLE_6 = _foodics_tables.DATATABLE_FOODICS_6;
                                }
                                //_Obj.CashupModelObj.DATATABLE_2 = _foodics_tables.DATATABLE_FOODICS_2;
                                //_Obj.CashupModelObj.DATATABLE_3 = _foodics_tables.DATATABLE_FOODICS_3;
                                //_Obj.CashupModelObj.DATATABLE_4 = _foodics_tables.DATATABLE_FOODICS_4;
                                //_Obj.CashupModelObj.DATATABLE_5 = _foodics_tables.DATATABLE_FOODICS_5;
                                //_Obj.CashupModelObj.DATATABLE_6 = _foodics_tables.DATATABLE_FOODICS_6;


                                _page++;
                            }
                        }
                        catch (Exception ex)
                        {
                            IS_Error_Ocurr = true;
                            throw ex;
                        }
                    }
                    else
                    {
                        _page = 1;
                        IS_Error_Ocurr = false;
                    }
                } while (_page<= _lastPageCount);
            }

            if (_Obj.CashupModelObj.DATATABLE_1.Rows.Count > 0)
            {
                _Obj.INS_FOODICS_SALES_DATA();
            }
        }
    }
}
