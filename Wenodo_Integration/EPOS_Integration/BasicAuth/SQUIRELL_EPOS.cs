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

namespace EPOS_Integration.Squirrel
{
    public class GroupInfoList
    {
        public IList<GroupInfo> value { get; set; }
    }
    public class GroupInfo
    {
        public int GroupInfoID { get; set; }
        public string SiteName { get; set; }
        public string ShortCode { get; set; }
        public decimal SQNET { get; set; }
        public decimal Cost { get; set; }
        public decimal PromoAmt { get; set; }
        public decimal TaxAmt { get; set; }
        public decimal SrvChgAmt { get; set; }
        public int Covers { get; set; }
        public int Checks { get; set; }
        public int TurnTime { get; set; }
        public string RevenueDepartment { get; set; }
        public int DeptID { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public DateTimeOffset BusinessDay { get; set; }
        public string Week { get; set; }
        public string Year { get; set; }
    }
    public class HeaderList
    {
        public IList<Header> value { get; set; }
    }
    public class Header
    {
        public int CheckID { get; set; }
        public int SiteID { get; set; }
        public DateTimeOffset TransDate { get; set; }
        public decimal? Covers { get; set; }
        public int Checkno { get; set; }
        public string DeptName { get; set; }
        public DateTimeOffset OpenTime { get; set; }
        public DateTimeOffset CloseTime { get; set; }
        public string TableName { get; set; }
        public string TableSize { get; set; }
        public decimal? HouseChg { get; set; }
        public string Logo { get; set; }
        public string Address { get; set; }
        public string VAT { get; set; }
        public string CheckLink { get; set; }
        public int CheckLen { get; set; }
        public string CheckSum { get; set; }
        public string CheckCulture { get; set; }
        public decimal? Promo { get; set; }
        public decimal? svc { get; set; }
        public decimal? TotalDue { get; set; }
    }
    public class LineList
    {
        public IList<Line> value { get; set; }
    }
    public class Line
    {
        public int CheckID { get; set; }
        public string MenuName { get; set; }
        public int Qty { get; set; }
        public decimal SQNet { get; set; }
        public decimal PromoAmt { get; set; }
        public decimal TaxAmt { get; set; }
        public decimal SvCharge { get; set; }
        public string SalesDepartment { get; set; }
        public string GlobalCat { get; set; }
        public string MajorCat { get; set; }
        public string MajorCatID { get; set; }
        public string PromoName { get; set; }
        public string PromoReason { get; set; }
        public string Employee { get; set; }
        public string ComboName { get; set; }
        public DateTimeOffset SaleTime { get; set; }
    }
    public class PaymentList
    {
        public IList<Payment> value { get; set; }
    }
    public class Payment
    {
        public int CheckID { get; set; }
        public string PayName { get; set; }
        public decimal PayAmt { get; set; }
        public decimal TipAmt { get; set; }
        public int PromoYN { get; set; }
    }
    public class VoidList
    {
        public IList<Void> value { get; set; }
    }
    public class Void
    {
        public int CheckID { get; set; }
        public DateTimeOffset VoidDate { get; set; }
        public decimal Qty { get; set; }
        public decimal GrossPrice { get; set; }
        public string MenuName { get; set; }
        public string ServerName { get; set; }
        public string MgrName { get; set; }
        public string Reason { get; set; }
    }
    public class SQUIRELL_EPOS
    {
        public FetchData FetchData_Obj { get; set; }
        public void GetDataFromEPOS(DataTable dt, DataTable dt_IntegrationDetails)
        {
            FetchData_Obj = new FetchData();
            string EXCEPTION = string.Empty;
            string Cashup_start_date = string.Empty;
            string Cashup_end_date = string.Empty;

            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            foreach (DataRow dr in dt.Rows)
            {

                //--Fetch sessionTime from DB
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                foreach (DataRow dr_session in dt_Session.Select("SESSION_MASTER_ID=4").CopyToDataTable().Rows)
                {
                    //Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                   
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
                    Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]) + "Z";
                    Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]) + "Z";// + "+00:00";
                     

                    //--------------------------

                    decimal CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                    decimal ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                    decimal BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                    Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                    Obj.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    Obj.CashupModelObj.BRANCH_ID = BRANCH_ID;

                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "ENTITY_ID=" + ENTITY_ID;
                    DataTable dtIntegrationData = dv.ToTable();

                    FetchData_Obj.urlPath = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);// @"https://portal.acornsolutions.com/tmsodata";
                    FetchData_Obj.userName = Convert.ToString(dtIntegrationData.Rows[0]["USERID"]);//"aasim@wenodo.com";
                    FetchData_Obj.passWord = Convert.ToString(dtIntegrationData.Rows[0]["PASSWORD"]);//"mrmKUSbqRqGj";


                    int INTEGRATION_STATUS = 0;
                    DataSet ds = Create_DataTables();
                    DataTable DT_GROUP_INFO;
                    DataTable DT_HEADER;
                    DataTable DT_LINES;
                    DataTable DT_PAYMENT;
                    DataTable DT_VOID;
                    try
                    {
                        DT_GROUP_INFO = GetGroupInfo(ds.Tables[0], Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
                        DT_HEADER = GetHeadersInfo(ds.Tables[1], Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
                        if (DT_HEADER.Rows.Count > 0)
                        {
                            List<int> levels = DT_HEADER.AsEnumerable().Select(al => al.Field<int>("CheckID")).Distinct().ToList();
                            int min = levels.Min();
                            int max = levels.Max();
                            DT_LINES = GetLineInfo(ds.Tables[2], Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ssZ"));
                            DT_PAYMENT = GetPaymentInfo(ds.Tables[3], min, max);
                            //DT_VOID = GetVoidInfo(ds.Tables[4], Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ssZ")); -- initial version code
                            DT_VOID = GetVoidInfo(ds.Tables[4], Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ssZ"), Cashup_start_date, Cashup_end_date); // update -add cashup start and end date as parameter

                            if (DT_HEADER.Rows.Count > 0 && DT_LINES.Rows.Count > 0 && DT_PAYMENT.Rows.Count > 0)
                            {
                                // Create_Master_DataTable(DT_HEADER, DT_LINES, DT_PAYMENT, DT_VOID);
                                //InsertIntegrationDataForCashup(dr, Obj, DT_LINES, DT_PAYMENT, DT_VOID);// -- commented this line -Reason is this is not required .Commented on 02/09/2023
                                INSERT_EPOS_DATA_SQUIRREL(DT_HEADER, DT_LINES, DT_PAYMENT, DT_GROUP_INFO, DT_VOID, CASHUP_MAIN_ID, ENTITY_ID);
                                INTEGRATION_STATUS = 6;//Data Recieved
                                if (INTEGRATION_STATUS == 6)
                                {
                                    LogExceptions.LogInfo("fill dataset");
                                    TransformData<DataSet> transformData = new TransformData<DataSet>();
                                    DataSet SQ_Dataset = new DataSet();
                                    SQ_Dataset.Tables.Add(DT_HEADER.Copy());
                                    SQ_Dataset.Tables.Add(DT_LINES.Copy());
                                    SQ_Dataset.Tables.Add(DT_PAYMENT.Copy());
                                    SQ_Dataset.Tables.Add(DT_VOID.Copy());
                                    Obj.CashupModelObj.SQURL_SESSION = dt;
                                    Obj.CashupModelObj.SQURL_INTEGRATION_DETAIL = dt_IntegrationDetails;


                                    LogExceptions.LogInfo("start calling common epos function");
                                    transformData.DataTransform(IntegrationSource.SQUIRREL, dtIntegrationData, SQ_Dataset, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);
                                    INTEGRATION_STATUS = Convert.ToInt32(Obj.CashupModelObj.INTEGRATION_STATUS);
                                    EXCEPTION = Obj.CashupModelObj.ERROR_MESSAGE;
                                }
                            }
                            else
                            {
                                INTEGRATION_STATUS = 5;//No Data Recieved
                            }
                        }
                        else
                        {
                            INTEGRATION_STATUS = 5;
                        }
                    }
                    catch (Exception ex)
                    {
                        INTEGRATION_STATUS = 3;
                        LogExceptions.LogError("GetDataFromEPOS", ex);
                        EXCEPTION = "Exception From Epos Main.--------" + Obj.CashupModelObj.ERROR_MESSAGE + ex.ToString();
                    }
                    Common_Methods.UPD_CASHUP_MAIN_FOR_INTEGRATION(INTEGRATION_STATUS, CASHUP_MAIN_ID, EXCEPTION);
                    EXCEPTION = string.Empty;
                }
            }
        }
        void INSERT_EPOS_DATA_SQUIRREL(DataTable DT_HEADER, DataTable DT_LINES, DataTable DT_PAYMENT, DataTable DT_GROUP_INFO, DataTable DT_VOID, decimal CASHUP_MAIN_ID, decimal ENTITY_ID)
        {
            Cashup _ICashUp = new Cashup();
            _ICashUp.CashupModelObj = new CashupModel();
            _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
            _ICashUp.CashupModelObj.DT_GROUP_INFO = DT_GROUP_INFO;
            _ICashUp.CashupModelObj.DT_HEADER = DT_HEADER;
            _ICashUp.CashupModelObj.DT_LINES = DT_LINES;
            _ICashUp.CashupModelObj.DT_PAYMENT = DT_PAYMENT;
            _ICashUp.CashupModelObj.DT_VOID = DT_VOID;
            _ICashUp.INSERT_EPOS_DATA_SQUIRREL();
        }
        DataSet Create_DataTables()
        {
            DataSet ds = new DataSet();

            #region GROUP_INFO

            DataTable GROUP_INFO = new DataTable();
            // Adding Columns    
            DataColumn COLUMN = new DataColumn();
            COLUMN.ColumnName = "GROUPINFOID";
            COLUMN.DataType = typeof(int);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SITENAME";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SHORTCODE";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SQNET";
            COLUMN.DataType = typeof(decimal);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COST";
            COLUMN.DataType = typeof(decimal);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PROMOAMT";
            COLUMN.DataType = typeof(decimal);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TAXAMT";
            COLUMN.DataType = typeof(decimal);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SRVCHGAMT";
            COLUMN.DataType = typeof(decimal);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COVERS";
            COLUMN.DataType = typeof(int);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKS";
            COLUMN.DataType = typeof(int);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TURNTIME";
            COLUMN.DataType = typeof(int);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "REVENUEDEPARTMENT";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DEPTID";
            COLUMN.DataType = typeof(int);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LATITUDE";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LONGITUDE";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "BUSINESSDAY";
            COLUMN.DataType = typeof(DateTimeOffset);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "WEEK";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "YEAR";
            COLUMN.DataType = typeof(string);
            GROUP_INFO.Columns.Add(COLUMN);

            ds.Tables.Add(GROUP_INFO);
            #endregion

            #region HEADER
            DataTable HEADER = new DataTable();
            // Adding Columns    
            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKID";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SITEID";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TRANSDATE";
            COLUMN.DataType = typeof(DateTimeOffset);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "COVERS";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKNO";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "DEPTNAME";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "OPENTIME";
            COLUMN.DataType = typeof(DateTimeOffset);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CLOSETIME";
            COLUMN.DataType = typeof(DateTimeOffset);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TABLENAME";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TABLESIZE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "HOUSECHG";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "LOGO";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "ADDRESS";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "VAT";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKLINK";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKLEN";
            COLUMN.DataType = typeof(int);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKSUM";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "CHECKCULTURE";
            COLUMN.DataType = typeof(string);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "PROMO";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "SVC";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);

            COLUMN = new DataColumn();
            COLUMN.ColumnName = "TOTALDUE";
            COLUMN.DataType = typeof(decimal);
            HEADER.Columns.Add(COLUMN);
            ds.Tables.Add(HEADER);
            #endregion

            #region LINE
            DataTable LINE = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "CHECKID";
            COLUMN_LINE.DataType = typeof(int);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "MENUNAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "QTY";
            COLUMN_LINE.DataType = typeof(int);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SQNET";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PROMOAMT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "TAXAMT";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SVCHARGE";
            COLUMN_LINE.DataType = typeof(decimal);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SALESDEPARTMENT";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "GLOBALCAT";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "MAJORCAT";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "MAJORCATID";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PROMONAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "PROMOREASON";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "EMPLOYEE";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "COMBONAME";
            COLUMN_LINE.DataType = typeof(string);
            LINE.Columns.Add(COLUMN_LINE);

            COLUMN_LINE = new DataColumn();
            COLUMN_LINE.ColumnName = "SALETIME";
            COLUMN_LINE.DataType = typeof(DateTimeOffset);
            LINE.Columns.Add(COLUMN_LINE);

            ds.Tables.Add(LINE);
            #endregion

            #region PAYMENT

            DataTable PAYMENT = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "CHECKID";
            COLUMN_PAYMENT.DataType = typeof(int);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "PAYNAME";
            COLUMN_PAYMENT.DataType = typeof(string);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "PAYAMT";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "TIPAMT";
            COLUMN_PAYMENT.DataType = typeof(decimal);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);

            COLUMN_PAYMENT = new DataColumn();
            COLUMN_PAYMENT.ColumnName = "PROMOYN";
            COLUMN_PAYMENT.DataType = typeof(int);
            PAYMENT.Columns.Add(COLUMN_PAYMENT);


            ds.Tables.Add(PAYMENT);
            #endregion

            #region VOID

            DataTable DT_VOID = new DataTable();
            // Adding Columns    
            DataColumn COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "CHECKID";
            COLUMN_VOID.DataType = typeof(int);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "VOIDDATE";
            COLUMN_VOID.DataType = typeof(DateTimeOffset);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "QTY";
            COLUMN_VOID.DataType = typeof(decimal);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "GROSSPRICE";
            COLUMN_VOID.DataType = typeof(decimal);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "MENUNAME";
            COLUMN_VOID.DataType = typeof(string);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "SERVERNAME";
            COLUMN_VOID.DataType = typeof(string);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "MGRNAME";
            COLUMN_VOID.DataType = typeof(string);
            DT_VOID.Columns.Add(COLUMN_VOID);

            COLUMN_VOID = new DataColumn();
            COLUMN_VOID.ColumnName = "REASON";
            COLUMN_VOID.DataType = typeof(string);
            DT_VOID.Columns.Add(COLUMN_VOID);

            ds.Tables.Add(DT_VOID);
            #endregion

            return ds;
        }
        DataTable GetGroupInfo(DataTable DT_GROUP_INFO, string BusinessDay)
        {
            //FetchData Obj = new FetchData();
            //Obj.urlPath = @"https://portal.acornsolutions.com/tmsodata";
            //Obj.userName = "aasim@wenodo.com";
            //Obj.passWord = "mrmKUSbqRqGj";
            FetchData_Obj.urlParameters = @"/GroupInfo?$filter=BusinessDay eq " + BusinessDay;//BusinessDay eq 2021-09-30T00:00:00Z  2021-10-04T00:00:00Z 2021-10-04T00:00:00.0000000Z   Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd'T'HH:mm:ss.fffffffK")        
                                                                                              // JObject objects = ;
            GroupInfoList Group_Info_List = JsonConvert.DeserializeObject<GroupInfoList>(FetchData_Obj.GetUrlData_BasicAuth());
            DataTable dt = DT_GROUP_INFO;
            foreach (GroupInfo gi in Group_Info_List.value)
            {
                DataRow dr = dt.NewRow();
                dr[0] = gi.GroupInfoID;
                dr[1] = gi.SiteName;
                dr[2] = gi.ShortCode;
                dr[3] = gi.SQNET;
                dr[4] = gi.Cost;
                dr[5] = gi.PromoAmt;
                dr[6] = gi.TaxAmt;
                dr[7] = gi.SrvChgAmt;
                dr[8] = gi.Covers;
                dr[9] = gi.Checks;
                dr[10] = gi.TurnTime;
                dr[11] = gi.RevenueDepartment;
                dr[12] = gi.DeptID;
                dr[13] = gi.Latitude;
                dr[14] = gi.Longitude;
                dr[15] = gi.BusinessDay;
                dr[16] = gi.Week;
                dr[17] = gi.Year;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        DataTable GetHeadersInfo(DataTable DT_HEADER, string TransDate)
        {
            FetchData_Obj.urlParameters = @"/CheckHeader?$filter=TransDate eq " + TransDate;
            HeaderList Daily_HeaderList = JsonConvert.DeserializeObject<HeaderList>(FetchData_Obj.GetUrlData_BasicAuth());
            //   JObject objects = FetchData_Obj.GetUrlData_BasicAuth();
            DataTable dt = DT_HEADER;
            foreach (Header head in Daily_HeaderList.value)
            {
                DataRow dr = dt.NewRow();
                dr[0] = head.CheckID;
                dr[1] = head.SiteID;
                dr[2] = head.TransDate;
                dr[3] = head.Covers.Equals(null) ? 0 : head.Covers;
                dr[4] = head.Checkno;
                dr[5] = head.DeptName;
                dr[6] = head.OpenTime;
                dr[7] = head.CloseTime;
                dr[8] = head.TableName;
                dr[9] = head.TableSize;
                dr[10] = head.HouseChg.Equals(null) ? 0 : head.HouseChg;
                dr[11] = head.Logo;
                dr[12] = head.Address;
                dr[13] = head.VAT;
                dr[14] = head.CheckLink;
                dr[15] = head.CheckLen;
                dr[16] = head.CheckSum;
                dr[17] = head.CheckCulture;
                dr[18] = head.Promo.Equals(null) ? 0 : head.Promo;
                dr[19] = head.svc.Equals(null) ? 0 : head.svc;
                dr[20] = head.TotalDue.Equals(null) ? 0 : head.TotalDue;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        DataTable GetLineInfo(DataTable DT_LINES, string TransDate)
        {
            FetchData_Obj.urlParameters = @"/CheckItem?$filter=SaleTime ge  " + TransDate + " and SaleTime lt " + Convert.ToDateTime(TransDate).AddDays(1).ToString("yyyy-MM-dd'T'HH:mm:ssZ"); ;
            LineList Daily_Lines_List = JsonConvert.DeserializeObject<LineList>(FetchData_Obj.GetUrlData_BasicAuth());
            //    JObject objects = FetchData_Obj.GetUrlData_BasicAuth();
            DataTable dt = DT_LINES;
            foreach (Line line in Daily_Lines_List.value)
            {
                DataRow dr = dt.NewRow();
                dr[0] = line.CheckID;
                dr[1] = line.MenuName;
                dr[2] = line.Qty;
                dr[3] = line.SQNet;
                dr[4] = line.PromoAmt;
                dr[5] = line.TaxAmt;
                dr[6] = line.SvCharge;
                dr[7] = line.SalesDepartment;
                dr[8] = line.GlobalCat;
                dr[9] = line.MajorCat;
                dr[10] = line.MajorCatID;
                dr[11] = line.PromoName;
                dr[12] = line.PromoReason;
                dr[13] = line.Employee;
                dr[14] = line.ComboName;
                dr[15] = line.SaleTime;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        DataTable GetPaymentInfo(DataTable DT_PAYMENT, int min_CheckID, int max_CheckID)
        {
            FetchData_Obj.urlParameters = @"/CheckPay?$filter=CheckID ge " + min_CheckID + " and CheckID le " + max_CheckID;//?$filter=BusinessDay eq 2021-09-30T00:00:00Z
            PaymentList Daily_Payment_List = JsonConvert.DeserializeObject<PaymentList>(FetchData_Obj.GetUrlData_BasicAuth());
            //    JObject objects = FetchData_Obj.GetUrlData_BasicAuth();
            DataTable dt = DT_PAYMENT;
            foreach (Payment paymnt in Daily_Payment_List.value)
            {
                DataRow dr = dt.NewRow();
                dr[0] = paymnt.CheckID;
                dr[1] = paymnt.PayName;
                dr[2] = paymnt.PayAmt;
                dr[3] = paymnt.TipAmt;
                dr[4] = paymnt.PromoYN;
                dt.Rows.Add(dr);
            }
            return dt;
        }
        DataTable GetVoidInfo(DataTable DT_VOID, string VoidDate,string Cashup_Start_Date, string Cashup_End_Date)
        {

            //FetchData_Obj.urlParameters = @"/Voids?$filter=VoidDate gt " + VoidDate + " and VoidDate lt " + Convert.ToDateTime(VoidDate).AddDays(1).ToString("yyyy-MM-dd'T'HH:mm:ssZ");
            FetchData_Obj.urlParameters = @"/Voids?$filter=VoidDate gt " + Cashup_Start_Date + " and VoidDate lt " + Cashup_End_Date;
            VoidList Daily_Void_List = JsonConvert.DeserializeObject<VoidList>(FetchData_Obj.GetUrlData_BasicAuth());
            //      JObject objects = FetchData_Obj.GetUrlData_BasicAuth();
            DataTable dt = DT_VOID;
            foreach (Void voidobj in Daily_Void_List.value)
            {
                DataRow dr = dt.NewRow();
                dr[0] = voidobj.CheckID;
                dr[1] = voidobj.VoidDate;
                dr[2] = voidobj.Qty;
                dr[3] = voidobj.GrossPrice;
                dr[4] = voidobj.MenuName;
                dr[5] = voidobj.ServerName;
                dr[6] = voidobj.MgrName;
                dr[7] = voidobj.Reason;
                dt.Rows.Add(dr);
            }
            return dt;

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
                //EPOS_FILE_UPLOAD_SQUIRREL(DT_PAYMENTS, DT_LINES, DT_VOID, Convert.ToDecimal(ds.Tables[0].Rows[0]["ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]));
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
            CashupModelObj.VOID_TOTAL = sumObject.ToString() == "" || sumObject.ToString() == null? 0 : Convert.ToDecimal(sumObject.ToString());

            sumObject = MEDIA_DETAIL.Compute("Sum(HS_TIPS)", string.Empty);
            CashupModelObj.HOUSE_TIPS = sumObject.ToString() == "" || sumObject.ToString() == null ? 0 : Convert.ToDecimal(sumObject.ToString());

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

        public DataSet RefetchDataFromEPOS(DataTable dt, DataTable dt_IntegrationDetails, string Cashup_Date)
        {
            FetchData_Obj = new FetchData();
            string EXCEPTION = string.Empty;
            string Cashup_start_date = string.Empty;
            string Cashup_end_date = string.Empty;
            DataSet SQ_Dataset = new DataSet();
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            foreach (DataRow dr in dt.Rows)
            {

                //--Fetch sessionTime from DB
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                foreach (DataRow dr_session in dt_Session.Select("SESSION_MASTER_ID=4").CopyToDataTable().Rows)
                {
                    DateTime Cashup_date_new = DateTime.Now;
                    Cashup_date_new = Convert.ToDateTime(Cashup_Date);
                    Cashup_start_date = Convert.ToDateTime(Cashup_Date).ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_START"]) + "Z";
                    Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]) + "Z";// + "+00:00";


                    //--------------------------

                    decimal CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                    decimal ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                    decimal BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);

                    Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                    Obj.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    Obj.CashupModelObj.BRANCH_ID = BRANCH_ID;

                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "ENTITY_ID=" + ENTITY_ID;
                    DataTable dtIntegrationData = dv.ToTable();

                    FetchData_Obj.urlPath = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);// @"https://portal.acornsolutions.com/tmsodata";
                    FetchData_Obj.userName = Convert.ToString(dtIntegrationData.Rows[0]["USERID"]);//"aasim@wenodo.com";
                    FetchData_Obj.passWord = Convert.ToString(dtIntegrationData.Rows[0]["PASSWORD"]);//"mrmKUSbqRqGj";


                    int INTEGRATION_STATUS = 0;
                    DataSet ds = Create_DataTables();
                    DataTable DT_GROUP_INFO;
                    DataTable DT_HEADER;
                    DataTable DT_LINES;
                    DataTable DT_PAYMENT;
                    DataTable DT_VOID;
                    
                    try
                    {
                        DT_GROUP_INFO = GetGroupInfo(ds.Tables[0], Convert.ToDateTime(Cashup_Date).ToString("yyyy-MM-dd"));
                        DT_HEADER = GetHeadersInfo(ds.Tables[1], Convert.ToDateTime(Cashup_Date).ToString("yyyy-MM-dd"));
                        if (DT_HEADER.Rows.Count > 0)
                        {
                            List<int> levels = DT_HEADER.AsEnumerable().Select(al => al.Field<int>("CheckID")).Distinct().ToList();
                            int min = levels.Min();
                            int max = levels.Max();
                            DT_LINES = GetLineInfo(ds.Tables[2], Convert.ToDateTime(Cashup_Date).ToString("yyyy-MM-dd"));
                            DT_PAYMENT = GetPaymentInfo(ds.Tables[3], min, max);
                            
                            DT_VOID = GetVoidInfo(ds.Tables[4], Convert.ToDateTime(Cashup_Date).ToString("yyyy-MM-dd"), Cashup_start_date, Cashup_end_date); // update -add cashup start and end date as parameter
                            if (DT_HEADER.Rows.Count > 0 && DT_LINES.Rows.Count > 0 && DT_PAYMENT.Rows.Count > 0)
                            {
                                SQ_Dataset.Tables.Add(DT_HEADER.Copy());
                                SQ_Dataset.Tables.Add(DT_LINES.Copy());
                                SQ_Dataset.Tables.Add(DT_PAYMENT.Copy());
                                SQ_Dataset.Tables.Add(DT_VOID.Copy());
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        SQ_Dataset = null;
                    }
                    
                }
            }
            return SQ_Dataset;
        }
    }
}
