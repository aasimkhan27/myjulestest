using App_Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;
using EPOS_Integration.Epos_Integrator;
using static EPOS_Integration.QUADRANET.QUADRANET_MODEL;
using System.ComponentModel;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;

namespace EPOS_Integration.QUADRANET
{
    public class QUADRANET
    {
        bool IS_Error_Ocurr = false;
        Epos_Integrator.EPOS_INTEGRATOR integrator;

        public QUADRANET()
        {
            integrator = new Epos_Integrator.EPOS_INTEGRATOR();
        }
        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            QUADRANET_TABLES _quardnet_Tables;

            _quardnet_Tables = new QUADRANET_TABLES();

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
                    string Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]);// + "+00:00";
                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";
                    int INTEGRATION_STATUS = 0;
                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();

                    try
                    {
                        Fetch_Quadranet_Data(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj);
                        if (Obj.CashupModelObj.DATATABLE_1.Rows.Count > 0 && Obj.CashupModelObj.DATATABLE_2.Rows.Count > 0)
                        {
                            DataSet ds = Obj.GET_CASHUP_BY_ID();
                            INTEGRATION_STATUS = Submitdata(Obj, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Obj.CashupModelObj.BRANCH_ID); ;
                            LogExceptions.LogInfo("INTEGRATION_STATUS:-" + INTEGRATION_STATUS.ToString());

                            if (INTEGRATION_STATUS == 2)
                            {
                                LogExceptions.LogInfo("CAHUP_ID:-" + Convert.ToDecimal(dr["ID"]).ToString() + ". HEADER ROW COUNT:-" + Obj.CashupModelObj.DATATABLE_1.Rows.Count + ". LINE ROW COUNT:-" + Obj.CashupModelObj.DATATABLE_2.Rows.Count);

                                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                                DataSet Dataset = new DataSet();
                                DataTable QN_HEADER = new DataTable();
                                DataTable QN_LINE = new DataTable();
                                DataTable QN_DISCOUNT = new DataTable();
                                DataTable QN_PAYMENTS = new DataTable();
                                DataTable QN_VOIDS = new DataTable();
                                QN_HEADER = Obj.CashupModelObj.DATATABLE_1.Copy();
                                Dataset.Tables.Add(QN_HEADER);
                                QN_LINE = Obj.CashupModelObj.DATATABLE_2.Copy();
                                Dataset.Tables.Add(QN_LINE);
                                QN_DISCOUNT = Obj.CashupModelObj.DATATABLE_3.Copy();
                                Dataset.Tables.Add(QN_DISCOUNT);
                                QN_PAYMENTS = Obj.CashupModelObj.DATATABLE_4.Copy();
                                Dataset.Tables.Add(QN_PAYMENTS);
                                QN_VOIDS = Obj.CashupModelObj.DATATABLE_5.Copy();
                                Dataset.Tables.Add(QN_VOIDS);
                                TransformData<DataSet> transformData = new TransformData<DataSet>();
                                transformData.DataTransform(IntegrationSource.QUADRANET, dtIntegrationData, Dataset, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);

                                Obj.CashupModelObj.INTEGRATION_STATUS = 2; //Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        else
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 4;
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
        public void Fetch_Quadranet_Data(string Start_date, string End_date, DataTable dtIntegrationData, Cashup Obj)
        {
            Dictionary<string, string> _queryString = new Dictionary<string, string>();
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();

            _queryString.Add("Brandid", dtIntegrationData.Rows[0]["URL_PARAMETERS"].ToString());
            _queryString.Add("siteid", dtIntegrationData.Rows[0]["API_KEY"].ToString());
            _queryString.Add("User", dtIntegrationData.Rows[0]["USERID"].ToString());
            _queryString.Add("Password", dtIntegrationData.Rows[0]["PASSWORD"].ToString());
            _queryString.Add("Datefrom", Start_date);
            _queryString.Add("Dateto", End_date);

            if (IS_Error_Ocurr == false)
                Header(_header, _queryString, _body, Obj, dtIntegrationData);
            if (IS_Error_Ocurr == false)
                Line(_header, _queryString, _body, Obj, dtIntegrationData);
            if (IS_Error_Ocurr == false)
                Discount(_header, _queryString, _body, Obj, dtIntegrationData);
            if (IS_Error_Ocurr == false)
                Payment(_header, _queryString, _body, Obj, dtIntegrationData);
            if (IS_Error_Ocurr == false)
                Voids(_header, _queryString, _body, Obj, dtIntegrationData);
        }

        void Header(Dictionary<string, string> _header, Dictionary<string, string> _queryString, Dictionary<string, string> _body, Cashup Obj, DataTable DtIntegrationData)
        {
            try
            {
                List<Root_Header> root = integrator.Get<List<Root_Header>>(DtIntegrationData.Rows[0]["URL_PATH"].ToString() + "/masterdata_header", _header, _queryString, _body, null, "");
                IList<QUADRANET_TABLES.QUADRANET_HEADER_TYPE> _TYPES = root.Select(p => new QUADRANET_TABLES.QUADRANET_HEADER_TYPE
                {
                    BRAND = p.Brand,
                    SITE_ID = p.Siteid,
                    SITE_NAME = p.Sitename,
                    BILL_HEADER_ID = p.BillHeaderID,
                    CHECK_ITEM_ID = p.CheckItemID,
                    SPLIT_NUMBER = p.SplitNumber,
                    COVERS = p.Covers,
                    ITEM_TOTAL = p.ItemTotal,
                    BILL_TOTAL = p.BillTotal,
                    TAX_TOTAL = p.TaxTotal,
                    SERVICE_CHARGE = p.ServiceCharge,
                    SERVICE_PERCENTAGE = p.ServicePercentage,
                    DISCOUNT_TOTAL = p.DiscountTotal,
                    CUSTOMER_TABLE = p.CustomerTable,
                    HEADER_DATE = p.Date,
                    SESSION_NAME = p.SessionName,
                    SESSION_SORT_ORDER = p.SessionSortOrder,
                    REPORT_GROUP_NAME = p.ReportGroupName,
                    CREATED_ON = p.createdon,
                    USER_NAME = p.Username,
                    CLOSED_BY_NAME = p.ClosedByName,
                    TERMINAL_ID = p.TerminalID,
                    TERMINAL_NAME = p.TerminalName,
                    CHECK_CLOSE = p.CheckClose,
                    DWELL_TIME = p.DwellTime,
                    BOOKING_REFERENCE = p.BookingReference,
                    TOP_MESSAGE = p.TopMessage,
                    DAY = p.Day,
                    DAY_SORT = p.DaySort,
                    LOYALTY_SWIPE_ID = p.LoyaltySwipeID
                }).ToList();
                Obj.CashupModelObj.DATATABLE_1 = ConvertToDatatable.ToDataTables(_TYPES);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        void Line(Dictionary<string, string> _header, Dictionary<string, string> _queryString, Dictionary<string, string> _body, Cashup Obj, DataTable DtIntegrationData)
        {
            try
            {
                List<Root_Line> root = integrator.Get<List<Root_Line>>(DtIntegrationData.Rows[0]["URL_PATH"].ToString() + "/masterdata_items", _header, _queryString, _body, null, "");
                IList<QUADRANET_TABLES.QUADRANET_ITEMS_TYPE> _TYPES = root.Select(p => new QUADRANET_TABLES.QUADRANET_ITEMS_TYPE
                {
                    BRAND = p.Brand,
                    SITE_ID = p.Siteid,
                    SITE_NAME = p.Sitename,
                    BILL_HEADER_ID = p.BillHeaderID,
                    CHECK_ITEM_ID = p.CheckItemID,
                    CHECK_DETAIL_ID = p.CheckDetailid,
                    SPLIT_NUMBER = p.SplitNumber,
                    BOOKING_REFERENCE = p.BookingReference,
                    REPORT_GROUP_NAME = p.ReportGroupName,
                    STATION_NAME = p.StationName,
                    LOCATION_NAME = p.LocationName,
                    COVERS = p.Covers,
                    ITEM_TOTAL = p.ItemsTotal,
                    BILL_TOTAL = p.BillTotal,
                    TAX_TOTAL = p.TaxTotal,
                    SERVICE_CHARGE = p.ServiceCharge,
                    DISCOUNT_TOTAL = p.DiscountTotal,
                    DEPOSIT_TOTAL = p.DiscountTotal,
                    CUSTOMER_TABLE = p.CustomerTable,
                    SESSION_NAME = p.SessionName,
                    BILL_WAITER = p.BillWaiter,
                    DESCRIPTION = p.Description,
                    MESSAGE = p.Message,
                    CLASS_NAME = p.ClassName,
                    PF_DESCRIPTION = p.PFDescription,
                    CATEGORY_NAME = p.CategoryName,
                    CATEGORY_CODE = p.CategoryCode,
                    PLU_CODE = p.PLUCode,
                    BIN_NUMBER = p.Binnumber,
                    ITEM_ID = p.Itemid,
                    CREATED_ON = p.CreatedOn,
                    DATE = p.Date,
                    WEEK = p.Week,
                    DAY = p.Day,
                    DAY_SORT = p.DaySort,
                    TERMINAL_NAME = p.TerminalName,
                    SYSTEM_USER_ID = p.Systemuserid,
                    USER_NAME = p.UserName,
                    BRAND_CODE = p.BrandCode,
                    ITEM_PERCENTAGE = p.ItemPercentage,
                    STOCK_ITEM_ID = p.StockItemID,
                    QUANTITY = p.Quantity,
                    COST_PRICE = p.CostPrice,
                    MENU_PRICE = p.MenuPrice,
                    ITEMS_TOTAL = p.ItemsTotal,
                    ITEMS_NET = p.ItemsNet,
                    CONTRIBUTION = p.Contribution,
                    REVENUE_CENTRE_NAME = p.RevenueCentreName,
                    PRIX_FIXE_ADJUSTMENT = p.PrixFixeAdjustment,
                    COMP_ADJUSTMENT = p.CompAdjustment,
                    SPECIAL_PRICE_ADJUSTMENT = p.SpecialPriceAdjustment,
                    OPEN_ITEM = p.OpenItem,
                    DELETED_BEFORE_PAYMENT = p.DeletedBeforePayment,
                    TAX_AMOUNT = p.TaxAmount,
                    STATUS = p.Status,
                    TAX_PERCENT = p.Taxpercent,
                    PRIX_FIXE_ID = p.PrixFixeID,
                    PARENT_CHECK_DETAIL_ID = p.ParentCheckDetailId,
                    FIRST_CHECK_DETAIL_ID = p.FirstCheckDetailId,
                    MODE_ID = p.Modeid,
                    PRINT_PROFILE_ID = p.PrintProfileID,
                    MODIFIER_ONLY_ITEM = p.ModifierOnlyItem,
                    REPORTING_CATEGORY_1 = p.ReportingCategory1,
                    REPORTING_CATEGORY_2 = p.ReportingCategory2,
                    QBRG = p.QBRG,
                    FRIENDLY_ORDER_NO = p.FriendlyOrderNo,
                    MINIMUM_SPEND = p.MinimumSpend,
                    ORIGINAL_SERVICE_CHARGE = p.OriginalServiceCharge,
                    FISCAL_RECEIPT_NUMBER = p.FiscalReceiptNumber,
                    CI_MODE_ID = p.CIModeID,
                    PARENT_ITEM = p.ParentItem,
                    LOYALTY_SWIPE_ID = p.loyaltyswipeid,
                    DISCOUNT_DESCRIPTION = p.DiscountDescription,
                    QUADRANET_ITEMS_KEY = p.Key
                }).ToList();
                Obj.CashupModelObj.DATATABLE_2 = ConvertToDatatable.ToDataTables(_TYPES);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        void Discount(Dictionary<string, string> _header, Dictionary<string, string> _queryString, Dictionary<string, string> _body, Cashup Obj, DataTable DtIntegrationData)
        {
            List<Root_Discount> root = integrator.Get<List<Root_Discount>>(DtIntegrationData.Rows[0]["URL_PATH"].ToString() + "/masterdata_discounts", _header, _queryString, _body, null, "");
            IList<QUADRANET_TABLES.QUADRANET_DISCOUNT_TYPE> _TYPES = root.Select(p => new QUADRANET_TABLES.QUADRANET_DISCOUNT_TYPE
            {
                BRAND = p.Brand,
                SITE_ID = p.Siteid,
                SITE_NAME = p.Sitename,
                CHECK_ITEM_ID = p.CheckItemid,
                CHECK_DETAIL_ID = p.CheckdetailId,
                SPLIT_NUMBER = p.SplitNumber,
                REVENUE_CENTRE_NAME = p.RevenueCentreName,
                CLASS_NAME = p.ClassName,
                CATEGORY_NAME = p.CategoryName,
                DESCRIPTION = p.Description,
                ITEM_ID = p.Itemid,
                PLU_CODE = p.PLUCODE,
                QUANTITY = p.Quantity,
                MENU_PRICE = p.MenuPrice,
                TOTAL_PRICE = p.TotalPrice,
                DISCOUNT_VALUE = p.DiscountValue,
                COMP = p.Comp,
                PF = p.PF,
                SPL = p.SPL,
                DISCOUNT = p.Discount,
                OPEN_ITEM = p.OpenItem,
                DELETED_BEFORE_PAYMENT = p.DeletedBeforePayment,
                PRICED_NON_ITEM_MODIFIER = p.PricedNonItemModifier,
                PRICE_ADJ = p.PriceAdj,
                DISC_USER_NAME = p.DiscUserName,
                CREATED_ON = p.Createdon,
                SESSION = p.Session,
                TERMINAL_NAME = p.TerminalName,
                LOCATION = p.Location,
                CUSTOMER_TABLE_ID = p.CustomertableID,
                REPORT = p.Report,
                NOTES = p.Notes
            }).ToList();
            Obj.CashupModelObj.DATATABLE_3 = ConvertToDatatable.ToDataTables(_TYPES);
        }
        void Payment(Dictionary<string, string> _header, Dictionary<string, string> _queryString, Dictionary<string, string> _body, Cashup Obj, DataTable DtIntegrationData)
        {
            try
            {
                List<Root_Payment> root = integrator.Get<List<Root_Payment>>(DtIntegrationData.Rows[0]["URL_PATH"].ToString() + "/masterdata_payments", _header, _queryString, _body, null, "");
                IList<QUADRANET_TABLES.QUADRANET_PAYMENTS_TYPE> _TYPES = root.Select(p => new QUADRANET_TABLES.QUADRANET_PAYMENTS_TYPE
                {
                    BRAND = p.Brand,
                    SITE_ID = p.Siteid,
                    SITE_NAME = p.SiteName,
                    BILL_HEADER_ID = p.BillheaderID,
                    CHECK_ITEM_ID = p.CheckitemID,
                    PAYMENT_TYPE = p.PaymentType,
                    PAYMENT_NAME = p.PaymentName,
                    CUSTOMER_TABLE = p.CustomerTable,
                    LOCATION_NAME = p.LocationName,
                    TERMINAL_NAME = p.TerminalName,
                    PAYMENT_TIME = p.Paymenttime,
                    PAYMENT_TAKEN_BY_NAME = p.PaymentTakenByName,
                    PAYMENT_METHOD = p.PaymentMethod,
                    PAYMENT_GROUP = p.PaymentGroup,
                    PAYMENT_GROUP_NAME = p.PaymentGroupName,
                    INFO = p.Info,
                    DETAILS = p.Details,
                    SERVICE_CHARGE = p.ServiceCharge,
                    METHOD_TOTAL = p.MethodTotal,
                    GRATUITY = p.Gratuity,
                    PAYMENT_TOTAL = p.PaymentTotal,
                    COVERS = p.Covers,
                    COVER_TYPE = p.CoverType,
                    DEPOSIT_OWNER = p.DepositOwner,
                    DEPOSIT_ID = p.DepositID,
                    EVENT_DATE = p.EventDate,
                    SPLIT_NUMBER = p.SplitNumber,
                    RECEIPT_NUMBER = p.ReceiptNumber,
                    CHECK_PAYMENT_ID = p.checkpaymentid
                }).ToList();
                Obj.CashupModelObj.DATATABLE_4 = ConvertToDatatable.ToDataTables(_TYPES);
            }
            catch (Exception ex)
            {

                throw;
            }
        }
        void Voids(Dictionary<string, string> _header, Dictionary<string, string> _queryString, Dictionary<string, string> _body, Cashup Obj, DataTable DtIntegrationData)
        {
            try
            {
                List<Root_Voids> root = integrator.Get<List<Root_Voids>>(DtIntegrationData.Rows[0]["URL_PATH"].ToString() + "/masterdata_deleted", _header, _queryString, _body, null, "");
                IList<QUADRANET_TABLES.QUADRANET_VOIDS_TYPE> _TYPES = root.Select(p => new QUADRANET_TABLES.QUADRANET_VOIDS_TYPE
                {
                    SITE_ID = p.Siteid,
                    SITE_NAME = p.Sitename,
                    BILL_HEADER_ID = p.BillHeaderID,
                    CHECK_ITEM_ID = p.CheckItemID,
                    CHECK_DETAIL_ID = p.CheckDetailid,
                    SPLIT_NUMBER = p.SplitNumber,
                    REPORT_GROUP_NAME = p.ReportGroupName,
                    STATION_NAME = p.StationName,
                    LOCATION_NAME = p.LocationName,
                    ITEM_TOTAL = p.ItemsTotal,
                    BILL_TOTAL = p.ItemsTotal,
                    TAX_TOTAL = p.ItemsTotal,
                    SERVICE_CHARGE = p.ItemsTotal,
                    DISCOUNT_TOTAL = p.ItemsTotal,
                    DEPOSIT_TOTAL = p.ItemsTotal,
                    CUSTOMER_TABLE = p.CustomerTable,
                    SESSION_NAME = p.SessionName,
                    BILL_WAITER = p.BillWaiter,
                    DESCRIPTION = p.Description,
                    CLASS_NAME = p.ClassName,
                    CATEGORY_NAME = p.CategoryName,
                    PLU_CODE = p.PLUCode,
                    CREATED_ON = p.CreatedOn,
                    TERMINAL_NAME = p.TerminalName,
                    USER_NAME = p.UserName,
                    BRAND_CODE = p.BrandCode,
                    ITEM_PERCENTAGE = p.ItemPercentage,
                    STOCK_ITEM_ID = p.StockItemID,
                    QUANTITY = p.Quantity,
                    COST_PRICE = p.CostPrice,
                    MENU_PRICE = p.MenuPrice,
                    ITEMS_TOTAL = p.ItemsTotal,
                    REVENUE_CENTRE_NAME = p.RevenueCentreName,
                    PRIX_FIXE_ADJUSTMENT = p.PrixFixeAdjustment,
                    COMP_ADJUSTMENT = p.CompAdjustment,
                    SPECIAL_PRICE_ADJUSTMENT = p.SpecialPriceAdjustment,
                    OPEN_ITEM = p.OpenItem,
                    DELETED_BEFORE_PAYMENT = p.DeletedBeforePayment,
                    TAX_AMOUNT = p.TaxAmount,
                    STATUS = p.Status,
                    REASON_TEXT = p.ReasonText,
                    DELETED_BY_NAME = p.DeletedbyName,
                    PARENT_REASON_TEXT = p.ParentReasonText,
                    MESSAGE = p.Message,
                    CLOSED_BY_NAME = p.Closedbyname,
                }).ToList();
                Obj.CashupModelObj.DATATABLE_5 = ConvertToDatatable.ToDataTables(_TYPES);
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        int Submitdata(Cashup Obj, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BEANCH_ID)
        {
            try
            {
                //Save Data in Database
                if (Obj.CashupModelObj.DATATABLE_1.Rows.Count > 0 && Obj.CashupModelObj.DATATABLE_2.Rows.Count > 0)
                {
                    Obj.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    Obj.CashupModelObj.BRANCH_ID = BEANCH_ID;
                    Obj.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    Obj.INS_QUADRANET_EPOS_DATA();

                    //List<System.Data.SqlClient.SqlParameter> parameter = new List<System.Data.SqlClient.SqlParameter>();
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("@PI_CASHUP_MAIN_ID", CashupHeaderID));
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("@PI_ENTITY_ID", ENTITY_ID));
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("@PI_BRANCH_ID", BEANCH_ID));
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("PI_QUADRANET_HEADER", SqlDbType.Structured) { Value = Obj.CashupModelObj.DATATABLE_1 });
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("PI_QUADRANET_ITEMS", SqlDbType.Structured) { Value = Obj.CashupModelObj.DATATABLE_2 });
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("PI_QUADRANET_DISCOUNT", SqlDbType.Structured) { Value = Obj.CashupModelObj.DATATABLE_3 });
                    //parameter.Add(new System.Data.SqlClient.SqlParameter("PI_QUADRANET_PAYMENTS", SqlDbType.Structured) { Value = Obj.CashupModelObj.DATATABLE_4 });
                    //Obj.COMMON_SP_CALLING_FUNCTION(parameter,2, "PRC_INS_QUADRANET_EPOS_DATA");


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
                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                return 3;
            }
        }
    }
}
 