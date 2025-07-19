using EPOS_Integration;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace App_Repository
{
    public class Cashup
    {
        public CashupModel CashupModelObj { get; set; }


        public DataSet GET_CASHUP_BY_ID()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@SESSION_MAPPING_ID", CashupModelObj.SESSION_ID));
            parameters.Add(new SqlParameter("@USER_ID", CashupModelObj.USER_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_CASHUP_BY_ID");


        }
        public DataTable GET_SESSION_BY_BRANCH()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_BRANCH_ID ", CashupModelObj.BRANCH_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_SESSION_BY_BRANCH").Tables[0];


        }
        public void UPD_CASHUP_MAIN_FOR_INTEGRATION()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_STATUS", CashupModelObj.INTEGRATION_STATUS));
            parameters.Add(new SqlParameter("@PI_ERROR_MESSAGE", CashupModelObj.ERROR_MESSAGE));
            parameters.Add(new SqlParameter("@PI_USER_ID", 1));
            parameters.Add(new SqlParameter("@PI_SYNC_SOURCE", 1));  //--1 Auto Sync, 2 Web App, 3 Monitoring, 4 DB          
            Obj.ExecuteNonQuery(parameters, "PRC_UPD_CASHUP_MAIN_FOR_INTEGRATION");
        }
        public DataSet EPOS_FILE_UPLOAD_HOMESTEAD()
        {

            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_USER_ID", CashupModelObj.USER_ID));
            parameters.Add(new SqlParameter("@PI_CASHUP_HEADER_ID", CashupModelObj.CASHUP_HEADER_ID));
            parameters.Add(new SqlParameter("@PI_SESSION_MAPPING_ID", CashupModelObj.SESSION_ID));
            parameters.Add(new SqlParameter("@PI_EH_TOTAL_SALES", CashupModelObj.Cashup_Epos_Header[0]));
            parameters.Add(new SqlParameter("@PI_EH_TOTAL_TAX", CashupModelObj.Cashup_Epos_Header[4]));
            parameters.Add(new SqlParameter("@PI_EH_CUSTOMER_PAYMENTS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_DUE_ROUNDING", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_GIFT_CERT_TOTAL", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_OPT_SVC_CH", CashupModelObj.Cashup_Epos_Header[1]));
            parameters.Add(new SqlParameter("@PI_EH_HOUSE_TIPS", CashupModelObj.HOUSE_TIPS));
            parameters.Add(new SqlParameter("@PI_EH_ROA_TOTAL", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_GO_TO_SURCHARGES", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_ZONE_CHARGES", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_PAID_OUTS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_EMP_TIPOUTS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_BANK_GC_CASHOUTS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_TOTAL_ACCOUNTABLE", DBNull.Value));



            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_SALES_AMT", CashupModelObj.Cashup_Epos_Header[3]));
            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_HS_TIPS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_EMP_TIPS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_EMP_GRATS", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_TOTAL_SALES", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_MEDIA_TOTAL_COUNT", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_DISCOUNT_TOTAL_COUNT", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_DISCOUNT_TOTAL_AMOUNT", CashupModelObj.Cashup_Epos_Header[2]));


            parameters.Add(new SqlParameter("@PI_EH_VOID_TOTAL_COUNT", CashupModelObj.VOID_COUNT));
            parameters.Add(new SqlParameter("@PI_EH_VOID_TOTAL_AMOUNT", CashupModelObj.VOID_TOTAL));

            parameters.Add(new SqlParameter("@PI_EH_SERVING_PERIOD_TOTAL_CUST_COUNT", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_SERVING_PERIOD_TOTAL_TOTAL", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_SERVING_PERIOD_TOTAL_AVG_CHECK", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_EH_SERVING_PERIOD_TOTAL_AVG_CUST", DBNull.Value));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", CashupModelObj.INTEGRATION_SYSTEM_ID));

            SqlParameter tvpParam = new SqlParameter();
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.ParameterName = "PI_EM_EPOS_MEDIA_LIST";
            tvpParam.Value = CashupModelObj.COMP_DECLARATION;
            parameters.Add(tvpParam);
            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_ED_EPOS_DETAILS_LIST";
            tvpParam2.Value = CashupModelObj.DECLARATION_DETAILS;
            parameters.Add(tvpParam2);

            SqlParameter tvpParam3 = new SqlParameter();
            tvpParam3.SqlDbType = SqlDbType.Structured;
            tvpParam3.ParameterName = "PI_EPOS_DISCOUNTS_LIST";
            tvpParam3.Value = CashupModelObj.EPOS_DISCOUNTS_TYPE;
            parameters.Add(tvpParam3);

            SqlParameter tvpParam4 = new SqlParameter();
            tvpParam4.SqlDbType = SqlDbType.Structured;
            tvpParam4.ParameterName = "PI_EPOS_TAXES_LIST";
            tvpParam4.Value = CashupModelObj.EPOS_TAXES_TYPE;
            parameters.Add(tvpParam4);

            SqlParameter tvpParam5 = new SqlParameter();
            tvpParam5.SqlDbType = SqlDbType.Structured;
            tvpParam5.ParameterName = "PI_EPOS_SERVING_PERIOD_LIST";
            tvpParam5.Value = CashupModelObj.EPOS_SERVING_PERIOD_TYPE;
            parameters.Add(tvpParam5);

            SqlParameter tvpParam6 = new SqlParameter();
            tvpParam6.SqlDbType = SqlDbType.Structured;
            tvpParam6.ParameterName = "PI_INTEGRATION_DATA_LIST";
            tvpParam6.Value = CashupModelObj.INTEGRATION_DATA_TYPE;
            parameters.Add(tvpParam6);

            return Obj.ExecuteDataset_SP(parameters, "PRC_BULK_UPLOAD_EPOS_FILE");
        }
        public DataSet INS_UPD_LIGHTSPEED_HEADER()
        {
            try
            {


                DBHelper Obj = new DBHelper();
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@PI_CASHUP_HEADER_ID", CashupModelObj.CASHUP_HEADER_ID));
                parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));

                SqlParameter tvpParam = new SqlParameter();
                tvpParam.SqlDbType = SqlDbType.Structured;
                tvpParam.ParameterName = "PI_LIGHTSPEED_HEADERS";
                tvpParam.Value = CashupModelObj.DT_HEADER;
                parameters.Add(tvpParam);
                SqlParameter tvpParam2 = new SqlParameter();
                tvpParam2.SqlDbType = SqlDbType.Structured;
                tvpParam2.ParameterName = "PI_LIGHTSPEED_LINES";
                tvpParam2.Value = CashupModelObj.DT_LINES;
                parameters.Add(tvpParam2);

                SqlParameter tvpParam3 = new SqlParameter();
                tvpParam3.SqlDbType = SqlDbType.Structured;
                tvpParam3.ParameterName = "PI_LIGHTSPEED_PAYMENTS";
                tvpParam3.Value = CashupModelObj.DT_PAYMENT;
                parameters.Add(tvpParam3);


                return Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_LIGHTSPEED_HEADER");
            }
            catch (SqlException ex)
            {

                throw ex;
            }
        }
        public DataTable GET_CASHUP_MAIN_FOR_INTEGRATION()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", CashupModelObj.INTEGRATION_SYSTEM_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_CASHUP_MAIN_FOR_INTEGRATION").Tables[0];
        }
        public DataTable GET_CASHUP_MAIN_FOR_MRKTMN_OUTBUND_INTEGRATION()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            return Obj.ExecuteDataset(parameters, "PRC_GET_CASHUP_MAIN_FOR_MRKTMN_OUTBUND_INTEGRATION").Tables[0];
        }
        public DataTable GET_INTEGRATION_DETAILS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", CashupModelObj.INTEGRATION_SYSTEM_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_INTEGRATION_DETAILS").Tables[0];
        }
        public void INSERT_EPOS_DATA_SQUIRREL()
        {

            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));

            SqlParameter tvpParam = new SqlParameter();
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.ParameterName = "PI_SQUIRELL_GROUP_INFO";
            tvpParam.Value = CashupModelObj.DT_GROUP_INFO;
            parameters.Add(tvpParam);

            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_SQUIRELL_CHECK_HEADER";
            tvpParam2.Value = CashupModelObj.DT_HEADER;
            parameters.Add(tvpParam2);

            SqlParameter tvpParam3 = new SqlParameter();
            tvpParam3.SqlDbType = SqlDbType.Structured;
            tvpParam3.ParameterName = "PI_SQUIRELL_CHECK_LINES";
            tvpParam3.Value = CashupModelObj.DT_LINES;
            parameters.Add(tvpParam3);

            SqlParameter tvpParam4 = new SqlParameter();
            tvpParam4.SqlDbType = SqlDbType.Structured;
            tvpParam4.ParameterName = "PI_SQUIRELL_CHECK_PAYMENTS";
            tvpParam4.Value = CashupModelObj.DT_PAYMENT;
            parameters.Add(tvpParam4);

            SqlParameter tvpParam5 = new SqlParameter();
            tvpParam5.SqlDbType = SqlDbType.Structured;
            tvpParam5.ParameterName = "PI_SQUIRELL_CHECK_VOID";
            tvpParam5.Value = CashupModelObj.DT_VOID;
            parameters.Add(tvpParam5);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_SQUIRELL_CASHUP_DATA");
        }
        public int UPD_INTEGRATION_TOKENS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", CashupModelObj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_CUSTOMER_ID", CashupModelObj.CUSTOMER_ID));
            parameters.Add(new SqlParameter("@PI_URL_PARAMETERS", CashupModelObj.URL_PARAMETERS));
            parameters.Add(new SqlParameter("@PI_API_KEY", CashupModelObj.API_KEY));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", CashupModelObj.INTEGRATION_SYSTEM_ID));
            parameters.Add(new SqlParameter("@PI_USER_ID", CashupModelObj.USER_ID));
            parameters.Add(new SqlParameter("@PI_URL_PATH", CashupModelObj.URL_PATH));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_TYPE_ID", CashupModelObj.INTEGRATION_TYPE_ID));
            parameters.Add(new SqlParameter("@PI_MODULE_ID", 7));
            parameters.Add(new SqlParameter("@PI_USERID", CashupModelObj.INTEGRATION_SYSTEM_ID == 27?CashupModelObj.USERID: (object)DBNull.Value)); //Column value that is string and used in integration
            parameters.Add(new SqlParameter("@PI_PASSWORD", (object)DBNull.Value));
            parameters.Add(new SqlParameter("@PI_IS_OUTBOUND", Boolean.FalseString));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_PICKUP_FLAG", Boolean.FalseString));
            parameters.Add(new SqlParameter("@PI_GROUP_ID", CashupModelObj.GROUP_ID));
            Obj.ExecuteDataset(parameters, "PRC_UPD_INTEGRATION_TOKENS");
            return 1;
        }
        public DataTable GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", CashupModelObj.INTEGRATION_SYSTEM_ID));
            parameters.Add(new SqlParameter("@PI_CUSTOMER_ID", CashupModelObj.CUSTOMER_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH").Tables[0];
        }
        public void PRC_INS_UPD_ALOHA_CASHUP_DATA()
        {
            var _connectionString = new DBHelper();
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCONNECTION"].ConnectionString); sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand("PRC_INS_UPD_ALOHA_CASHUP_DATA", sqlConnection);

            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 60000;
            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID);
            sqlCommand.Parameters.AddWithValue("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID);

            SqlParameter DT_HEADER = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_HEADERS", CashupModelObj.DT_HEADER);
            DT_HEADER.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_LINES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_LINES", CashupModelObj.DT_LINES);
            DT_LINES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_LINE_CATEGORIES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_LINE_CATEGORIES", CashupModelObj.DT_LINE_CATEGORIES);
            DT_LINE_CATEGORIES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_SURCHARGES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_SURCHARGES", CashupModelObj.DT_SURCHARGES);
            DT_SURCHARGES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_PAYMENT = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_PAYMENTS", CashupModelObj.DT_PAYMENT);
            DT_PAYMENT.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_TABLE_TYPES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_TABLES", CashupModelObj.DT_TABLE_TYPES);
            DT_TABLE_TYPES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_EVENTS = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_EVENTS", CashupModelObj.DT_EVENTS);
            DT_EVENTS.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_CLEARS = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_CLEARS", CashupModelObj.DT_CLEARS);
            DT_CLEARS.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_LINKED_ITEM_TYPES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_LINKED_ITEMS", CashupModelObj.DT_LINKED_ITEM_TYPES);
            DT_LINKED_ITEM_TYPES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_EMPLOYEES = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_EMPLOYEES", CashupModelObj.DT_EMPLOYEES);
            DT_EMPLOYEES.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_VOID = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_VOIDS", CashupModelObj.DT_VOID);
            DT_VOID.SqlDbType = SqlDbType.Structured;
            SqlParameter DT_COMP = sqlCommand.Parameters.AddWithValue("@PI_ALOHA_COMPS", CashupModelObj.DT_COMP);
            DT_COMP.SqlDbType = SqlDbType.Structured;
            sqlCommand.Parameters.AddWithValue("@PI_DOB", CashupModelObj.DOB);
            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
            }

            //DBHelper Obj = new DBHelper();
            //List<SqlParameter> parameters = new List<SqlParameter>();
            //parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            //parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));

            //SqlParameter tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_HEADERS";
            //tvpParam.Value = CashupModelObj.DT_HEADER;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_LINES";
            //tvpParam.Value = CashupModelObj.DT_LINES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_LINE_CATEGORIES";
            //tvpParam.Value = CashupModelObj.DT_LINE_CATEGORIES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_SURCHARGES";
            //tvpParam.Value = CashupModelObj.DT_SURCHARGES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_PAYMENTS";
            //tvpParam.Value = CashupModelObj.DT_PAYMENT;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_TABLES";
            //tvpParam.Value = CashupModelObj.DT_TABLE_TYPES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_EVENTS";
            //tvpParam.Value = CashupModelObj.DT_EVENTS;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_CLEARS";
            //tvpParam.Value = CashupModelObj.DT_CLEARS;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_LINKED_ITEMS";
            //tvpParam.Value = CashupModelObj.DT_LINKED_ITEM_TYPES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_EMPLOYEES";
            //tvpParam.Value = CashupModelObj.DT_EMPLOYEES;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_VOIDS";
            //tvpParam.Value = CashupModelObj.DT_VOID;
            //parameters.Add(tvpParam);

            //tvpParam = new SqlParameter();
            //tvpParam.SqlDbType = SqlDbType.Structured;
            //tvpParam.ParameterName = "PI_ALOHA_COMPS";
            //tvpParam.Value = CashupModelObj.DT_COMP;
            //parameters.Add(tvpParam);

            //parameters.Add(new SqlParameter("@PI_DOB", CashupModelObj.DOB));

            //Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_ALOHA_CASHUP_DATA");
        }
        public void INS_UPD_VITA_MOJO_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID ", CashupModelObj.BRANCH_ID));

            SqlParameter VITA_MOJO_HEADER = new SqlParameter();
            VITA_MOJO_HEADER.SqlDbType = SqlDbType.Structured;
            VITA_MOJO_HEADER.ParameterName = "PI_VITA_MOJO_HEADER";
            VITA_MOJO_HEADER.Value = CashupModelObj.VITA_MOJO_HEADER;
            parameters.Add(VITA_MOJO_HEADER);

            SqlParameter VITA_MOJO_LINES = new SqlParameter();
            VITA_MOJO_LINES.SqlDbType = SqlDbType.Structured;
            VITA_MOJO_LINES.ParameterName = "PI_VITA_MOJO_LINES";
            VITA_MOJO_LINES.Value = CashupModelObj.VITA_MOJO_LINE;
            parameters.Add(VITA_MOJO_LINES);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_VITA_MOJO_DATA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_VITA_MOJO_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:INS_UPD_VITA_MOJO_DATA(), Fail to save data in DB", ex);
                throw;
            }
        }
        public void INS_UPD_OMEGA_CASHUP_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));

            SqlParameter OMEGA_HEADER = new SqlParameter();
            OMEGA_HEADER.SqlDbType = SqlDbType.Structured;
            OMEGA_HEADER.ParameterName = "PI_OMEGA_HEADER";
            OMEGA_HEADER.Value = CashupModelObj.OMEGA_HEADER;
            parameters.Add(OMEGA_HEADER);

            SqlParameter OMEGA_PAYMENTS = new SqlParameter();
            OMEGA_PAYMENTS.SqlDbType = SqlDbType.Structured;
            OMEGA_PAYMENTS.ParameterName = "PI_OMEGA_PAYMENTS";
            OMEGA_PAYMENTS.Value = CashupModelObj.OMEGA_PAYMENTS;
            parameters.Add(OMEGA_PAYMENTS);

            SqlParameter OMEGA_DETAILS = new SqlParameter();
            OMEGA_DETAILS.SqlDbType = SqlDbType.Structured;
            OMEGA_DETAILS.ParameterName = "PI_OMEGA_DETAILS";
            OMEGA_DETAILS.Value = CashupModelObj.OMEGA_DETAILS;
            parameters.Add(OMEGA_DETAILS);

            SqlParameter OMEGA_DISCOUNT = new SqlParameter();
            OMEGA_DISCOUNT.SqlDbType = SqlDbType.Structured;
            OMEGA_DISCOUNT.ParameterName = "PI_OMEGA_DISCOUNT";
            OMEGA_DISCOUNT.Value = CashupModelObj.OMEGA_DISCOUNT;
            parameters.Add(OMEGA_DISCOUNT);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_OMEGA_CASHUP_DATA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_OMEGA_CASHUP_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:INS_UPD_OMEGA_CASHUP_DATA(), Fail to save data in DB", ex);
                throw;
            }
        }

        public void INS_UPD_LIGHTSPEED_L_SERIES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            SqlParameter LS_RECEIPT_FIELDS = new SqlParameter();
            LS_RECEIPT_FIELDS.SqlDbType = SqlDbType.Structured;
            LS_RECEIPT_FIELDS.ParameterName = "PI_LSL_RECEIPT_FIELDS";
            LS_RECEIPT_FIELDS.Value = CashupModelObj.LSL_RECEIPT_FIELDS;
            parameters.Add(LS_RECEIPT_FIELDS);

            SqlParameter ITEMS_FIELDS = new SqlParameter();
            ITEMS_FIELDS.SqlDbType = SqlDbType.Structured;
            ITEMS_FIELDS.ParameterName = "PI_LSL_ITEMS_FIELDS";
            ITEMS_FIELDS.Value = CashupModelObj.LSL_ITEMS_FIELDS;
            parameters.Add(ITEMS_FIELDS);

            SqlParameter PAYMENTS_FIELDS = new SqlParameter();
            PAYMENTS_FIELDS.SqlDbType = SqlDbType.Structured;
            PAYMENTS_FIELDS.ParameterName = "PI_LSL_PAYMENTS_FIELDS";
            PAYMENTS_FIELDS.Value = CashupModelObj.LSL_PAYMENTS_FIELDS;
            parameters.Add(PAYMENTS_FIELDS);

            SqlParameter TAX_INFO = new SqlParameter();
            TAX_INFO.SqlDbType = SqlDbType.Structured;
            TAX_INFO.ParameterName = "PI_LSL_TAX_INFO";
            TAX_INFO.Value = CashupModelObj.LSL_TAX_INFO;
            parameters.Add(TAX_INFO);
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_LIGHTSPEED_L_SERIES");
                LogExceptions.LogInfo("Data insert successfully in DB. INS_UPD_LIGHTSPEED_L_SERIES");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:INS_UPD_LIGHTSPEED_L_SERIES, Fail to save data in DB", ex);
                throw;
            }
        }
        public void INS_UPD_OMNIVORE_TICKETS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            SqlParameter TICKETS = new SqlParameter();
            TICKETS.SqlDbType = SqlDbType.Structured;
            TICKETS.ParameterName = "PI_OMNIVORE_TICKETS";
            TICKETS.Value = CashupModelObj.OMNIVORE_TICKETS;
            parameters.Add(TICKETS);

            SqlParameter TICKET_ITEMS = new SqlParameter();
            TICKET_ITEMS.SqlDbType = SqlDbType.Structured;
            TICKET_ITEMS.ParameterName = "PI_OMNIVORE_TICKET_ITEMS";
            TICKET_ITEMS.Value = CashupModelObj.OMNIVORE_TICKET_ITEMS_TYPE;
            parameters.Add(TICKET_ITEMS);

            SqlParameter TICKET_DISCOUNTS = new SqlParameter();
            TICKET_DISCOUNTS.SqlDbType = SqlDbType.Structured;
            TICKET_DISCOUNTS.ParameterName = "PI_OMNIVORE_TICKET_DISCOUNTS";
            TICKET_DISCOUNTS.Value = CashupModelObj.OMNIVORE_TICKET_DISCOUNTS_TYPE;
            parameters.Add(TICKET_DISCOUNTS);

            SqlParameter TICKET_ITEM_MODIFIER = new SqlParameter();
            TICKET_ITEM_MODIFIER.SqlDbType = SqlDbType.Structured;
            TICKET_ITEM_MODIFIER.ParameterName = "PI_OMNIVORE_TICKET_ITEM_MODIFIER";
            TICKET_ITEM_MODIFIER.Value = CashupModelObj.OMNIVORE_TICKET_ITEM_MODIFIER_TYPE;
            parameters.Add(TICKET_ITEM_MODIFIER);

            SqlParameter OMNIVORE_TICKET_PAYMENTS = new SqlParameter();
            OMNIVORE_TICKET_PAYMENTS.SqlDbType = SqlDbType.Structured;
            OMNIVORE_TICKET_PAYMENTS.ParameterName = "PI_OMNIVORE_TICKET_PAYMENTS";
            OMNIVORE_TICKET_PAYMENTS.Value = CashupModelObj.OMNIVORE_TICKET_PAYMENTS_TYPE;
            parameters.Add(OMNIVORE_TICKET_PAYMENTS);

            SqlParameter SERVICE_CHARGES = new SqlParameter();
            SERVICE_CHARGES.SqlDbType = SqlDbType.Structured;
            SERVICE_CHARGES.ParameterName = "PI_OMNIVORE_TICKET_SERVICE_CHARGES";
            SERVICE_CHARGES.Value = CashupModelObj.OMNIVORE_TICKET_SERVICE_CHARGES_TYPE;
            parameters.Add(SERVICE_CHARGES);
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_OMNIVORE_TICKETS");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_OMNIVORE_TICKETS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_OMNIVORE_TICKETS, Fail to save data in DB", ex);
                throw;
            }
        }


        public void INS_UPD_LSL_PRODUCTS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter LSL_GROUP_MASTER = new SqlParameter();
            LSL_GROUP_MASTER.SqlDbType = SqlDbType.Structured;
            LSL_GROUP_MASTER.ParameterName = "PI_LSL_GROUP_MASTER";
            LSL_GROUP_MASTER.Value = CashupModelObj.LSL_GROUP_MASTER;
            parameters.Add(LSL_GROUP_MASTER);

            SqlParameter LSL_PRODUCT_LIST = new SqlParameter();
            LSL_PRODUCT_LIST.SqlDbType = SqlDbType.Structured;
            LSL_PRODUCT_LIST.ParameterName = "PI_LSL_PRODUCT_LIST";
            LSL_PRODUCT_LIST.Value = CashupModelObj.LSL_PRODUCT_LIST;
            parameters.Add(LSL_PRODUCT_LIST);


            SqlParameter LSL_PRODUCT_ADDITIONS = new SqlParameter();
            LSL_PRODUCT_ADDITIONS.SqlDbType = SqlDbType.Structured;
            LSL_PRODUCT_ADDITIONS.ParameterName = "PI_LSL_PRODUCT_ADDITIONS";
            LSL_PRODUCT_ADDITIONS.Value = CashupModelObj.LSL_PRODUCT_ADDITIONS;
            parameters.Add(LSL_PRODUCT_ADDITIONS);


            SqlParameter LSL_PRODUCT_ADDITIONS_VALUES = new SqlParameter();
            LSL_PRODUCT_ADDITIONS_VALUES.SqlDbType = SqlDbType.Structured;
            LSL_PRODUCT_ADDITIONS_VALUES.ParameterName = "PI_LSL_PRODUCT_ADDITIONS_VALUES";
            LSL_PRODUCT_ADDITIONS_VALUES.Value = CashupModelObj.LSL_PRODUCT_ADDITIONS_VALUES;
            parameters.Add(LSL_PRODUCT_ADDITIONS_VALUES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_LSL_PRODUCTS");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_LSL_PRODUCTS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_LSL_PRODUCTS, Fail to save data in DB", ex);
                throw;
            }
        }
        public void INS_UPD_SQUARE_UP_ORDERS(DataSet SQUARE_UP_DS)
        {
            CashupModelObj.DATATABLE_SQUARE_UP_DS = SQUARE_UP_DS;
            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCONNECTION"].ConnectionString); sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand("PRC_INS_UPD_SQUARE_UP_ORDERS", sqlConnection);

            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 60000;

            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID);          

            SqlParameter SQUARE_UP_ORDERS = sqlCommand.Parameters.AddWithValue("@PI_SQUARE_UP_ORDERS", CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[0]);
            SQUARE_UP_ORDERS.SqlDbType = SqlDbType.Structured;

            SqlParameter SQUARE_UP_ORDERS_LINE_ITEMS = sqlCommand.Parameters.AddWithValue("@PI_SQUARE_UP_ORDERS_LINE_ITEMS", CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[1]);
            SQUARE_UP_ORDERS_LINE_ITEMS.SqlDbType = SqlDbType.Structured;

            SqlParameter SQUARE_UP_ORDERS_PAYMENTS = sqlCommand.Parameters.AddWithValue("@PI_SQUARE_UP_ORDERS_PAYMENTS", CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[2]);
            SQUARE_UP_ORDERS_PAYMENTS.SqlDbType = SqlDbType.Structured;

            SqlParameter SQUARE_UP_ORDERS_DISCOUNTS = sqlCommand.Parameters.AddWithValue("@PI_SQUARE_UP_ORDERS_DISCOUNTS", CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[3]);
            SQUARE_UP_ORDERS_DISCOUNTS.SqlDbType = SqlDbType.Structured;

            sqlCommand.Parameters.AddWithValue("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID);
            sqlCommand.Parameters.AddWithValue("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID);



            //DBHelper Obj = new DBHelper();
            //List<SqlParameter> parameters = new List<SqlParameter>();
            //SqlParameter entsParam = new SqlParameter();
            //CashupModelObj.DATATABLE_SQUARE_UP_DS = SQUARE_UP_DS;

            //parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            //SqlParameter SQUARE_UP_ORDERS = new SqlParameter();
            //SQUARE_UP_ORDERS.SqlDbType = SqlDbType.Structured;
            //SQUARE_UP_ORDERS.ParameterName = "PI_SQUARE_UP_ORDERS";
            //SQUARE_UP_ORDERS.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[0];
            //parameters.Add(SQUARE_UP_ORDERS);

            //SqlParameter SQUARE_UP_ORDERS_LINE_ITEMS = new SqlParameter();
            //SQUARE_UP_ORDERS_LINE_ITEMS.SqlDbType = SqlDbType.Structured;
            //SQUARE_UP_ORDERS_LINE_ITEMS.ParameterName = "PI_SQUARE_UP_ORDERS_LINE_ITEMS";
            //SQUARE_UP_ORDERS_LINE_ITEMS.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[1];
            //parameters.Add(SQUARE_UP_ORDERS_LINE_ITEMS);

            //SqlParameter SQUARE_UP_ORDERS_PAYMENTS = new SqlParameter();
            //SQUARE_UP_ORDERS_PAYMENTS.SqlDbType = SqlDbType.Structured;
            //SQUARE_UP_ORDERS_PAYMENTS.ParameterName = "PI_SQUARE_UP_ORDERS_PAYMENTS";
            //SQUARE_UP_ORDERS_PAYMENTS.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[2];
            //parameters.Add(SQUARE_UP_ORDERS_PAYMENTS);

            //SqlParameter SQUARE_UP_ORDERS_DISCOUNTS = new SqlParameter();
            //SQUARE_UP_ORDERS_DISCOUNTS.SqlDbType = SqlDbType.Structured;
            //SQUARE_UP_ORDERS_DISCOUNTS.ParameterName = "PI_SQUARE_UP_ORDERS_DISCOUNTS";
            //SQUARE_UP_ORDERS_DISCOUNTS.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[3];
            //parameters.Add(SQUARE_UP_ORDERS_DISCOUNTS);

            //parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            //parameters.Add(new SqlParameter("@PI_BRANCH_ID ", CashupModelObj.BRANCH_ID));
            //try
            //{
            //    Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_SQUARE_UP_ORDERS");
            //    LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_SQUARE_UP_ORDERS");
            //}
            //catch (Exception ex)
            //{
            //    LogExceptions.LogError("Function:PRC_INS_UPD_SQUARE_UP_ORDERS(), Fail to save data in DB", ex);

            //}

            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_SQUARE_UP_ORDERS");
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                throw;
            }
           
        }
        public void INS_UPD_SQUARE_UP_ITEMS(DataSet SQUARE_UP_DS)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            CashupModelObj.DATATABLE_SQUARE_UP_DS = SQUARE_UP_DS;

            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID ", CashupModelObj.BRANCH_ID));

            //SqlParameter SQUARE_UP_CATALOGUE_ITEM_TYPE = new SqlParameter();
            //SQUARE_UP_CATALOGUE_ITEM_TYPE.SqlDbType = SqlDbType.Structured;
            //SQUARE_UP_CATALOGUE_ITEM_TYPE.ParameterName = "PI_SQUARE_UP_CATALOGUE_ITEM";
            //SQUARE_UP_CATALOGUE_ITEM_TYPE.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[0];
            //parameters.Add(SQUARE_UP_CATALOGUE_ITEM_TYPE);

            SqlParameter SQUARE_UP_CATEGORY_TYPE = new SqlParameter();
            SQUARE_UP_CATEGORY_TYPE.SqlDbType = SqlDbType.Structured;
            SQUARE_UP_CATEGORY_TYPE.ParameterName = "PI_SQUARE_UP_CATEGORY";
            SQUARE_UP_CATEGORY_TYPE.Value = CashupModelObj.DATATABLE_SQUARE_UP_DS.Tables[0];
            parameters.Add(SQUARE_UP_CATEGORY_TYPE);



            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_SQUARE_UP_ITEMS");
                LogExceptions.LogInfo("Data inset successfully in DB. INS_UPD_SQUARE_UP_ITEMS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:INS_UPD_SQUARE_UP_ITEMS(), Fail to save data in DB", ex);

            }
        }

        public DataSet GET_DAILY_SALES_DATA_FOR_MRKTMN_OUTBOUND_INT(int ENTITY_ID, int BRANCH_ID, DateTime DATE_START, DateTime DATE_END)
        {
            DataSet INVENTORY_COUNT_DATE = new DataSet();
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_START_DATE", DATE_START));
            parameters.Add(new SqlParameter("@PI_END_DATE", DATE_END));
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for PRC_GET_DAILY_SALES_DATA_FOR_MRKTMN_OUTBOUND_INT.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_DAILY_SALES_DATA_FOR_MRKTMN_OUTBOUND_INT");

            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Fail to save data in DB PRC_GET_DAILY_SALES_DATA_FOR_MRKTMN_OUTBOUND_INT", ex);
                return null;
            }
        }

        public void UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_STATUS", CashupModelObj.INTEGRATION_STATUS));
            parameters.Add(new SqlParameter("@PI_ERROR_MESSAGE", CashupModelObj.ERROR_MESSAGE));
            Obj.ExecuteNonQuery(parameters, "PRC_UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION");
        }

        public void INS_UPD_TISSL_CASHUP_DATA()
        {

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCONNECTION"].ConnectionString); sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand("PRC_INS_UPD_TISSL_CASHUP_DATA", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 60000;

            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID);
            sqlCommand.Parameters.AddWithValue("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID);

            SqlParameter TISSL_HEADER = sqlCommand.Parameters.AddWithValue("@PI_TISSL_HEADER", CashupModelObj.TISSL_HEADER);
            TISSL_HEADER.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_LINES = sqlCommand.Parameters.AddWithValue("@PI_TISSL_LINES", CashupModelObj.TISSL_LINES);
            TISSL_LINES.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_PAYMENTS = sqlCommand.Parameters.AddWithValue("@PI_TISSL_PAYMENTS", CashupModelObj.TISSL_PAYMENTS);
            TISSL_PAYMENTS.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_SERVICE_CHARGES = sqlCommand.Parameters.AddWithValue("@PI_TISSL_SERVICE_CHARGES", CashupModelObj.TISSL_SERVICE_CHARGES);
            TISSL_SERVICE_CHARGES.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_CHARITY = sqlCommand.Parameters.AddWithValue("@PI_TISSL_CHARITY", CashupModelObj.TISSL_CHARITY);
            TISSL_CHARITY.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_VOID_TRANS = sqlCommand.Parameters.AddWithValue("@PI_TISSL_VOID_TRANSACTIONS", CashupModelObj.TISSL_VOID_TRANS);
            TISSL_VOID_TRANS.SqlDbType = SqlDbType.Structured;
            SqlParameter TISSL_REFUND_TRANS = sqlCommand.Parameters.AddWithValue("@PI_TISSL_REFUND_TRANSACTIONS", CashupModelObj.TISSL_REFUND_TRANS);
            TISSL_REFUND_TRANS.SqlDbType = SqlDbType.Structured;
            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_TISSL_CASHUP_DATA");
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                LogExceptions.LogError("Function:PRC_INS_UPD_TISSL_CASHUP_DATA(), Fail to save data in DB", ex);
                throw;
            }

            //DBHelper Obj = new DBHelper();
            //List<SqlParameter> parameters = new List<SqlParameter>();
            //SqlParameter entsParam = new SqlParameter();
            //parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            //parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            ////parameters.Add(new SqlParameter("@PI_BRANCH_ID ", CashupModelObj.BRANCH_ID));

            //SqlParameter TISSL_HEADER = new SqlParameter();
            //TISSL_HEADER.SqlDbType = SqlDbType.Structured;
            //TISSL_HEADER.ParameterName = "PI_TISSL_HEADER";
            //TISSL_HEADER.Value = CashupModelObj.TISSL_HEADER;
            //parameters.Add(TISSL_HEADER);

            //SqlParameter TISSL_LINES = new SqlParameter();
            //TISSL_LINES.SqlDbType = SqlDbType.Structured;
            //TISSL_LINES.ParameterName = "PI_TISSL_LINES";
            //TISSL_LINES.Value = CashupModelObj.TISSL_LINES;
            //parameters.Add(TISSL_LINES);

            //SqlParameter TISSL_PAYMENTS = new SqlParameter();
            //TISSL_PAYMENTS.SqlDbType = SqlDbType.Structured;
            //TISSL_PAYMENTS.ParameterName = "PI_TISSL_PAYMENTS";
            //TISSL_PAYMENTS.Value = CashupModelObj.TISSL_PAYMENTS;
            //parameters.Add(TISSL_PAYMENTS);

            //SqlParameter TISSL_SERVICE_CHARGES = new SqlParameter();
            //TISSL_SERVICE_CHARGES.SqlDbType = SqlDbType.Structured;
            //TISSL_SERVICE_CHARGES.ParameterName = "PI_TISSL_SERVICE_CHARGES";
            //TISSL_SERVICE_CHARGES.Value = CashupModelObj.TISSL_SERVICE_CHARGES;
            //parameters.Add(TISSL_SERVICE_CHARGES);

            //SqlParameter TISSL_CHARITY = new SqlParameter();
            //TISSL_CHARITY.SqlDbType = SqlDbType.Structured;
            //TISSL_CHARITY.ParameterName = "PI_TISSL_CHARITY";
            //TISSL_CHARITY.Value = CashupModelObj.TISSL_CHARITY;
            //parameters.Add(TISSL_CHARITY);

            //SqlParameter TISSL_VOID_TRANS = new SqlParameter();
            //TISSL_VOID_TRANS.SqlDbType = SqlDbType.Structured;
            //TISSL_VOID_TRANS.ParameterName = "PI_TISSL_VOID_TRANSACTIONS";
            //TISSL_VOID_TRANS.Value = CashupModelObj.TISSL_VOID_TRANS;
            //parameters.Add(TISSL_VOID_TRANS);

            //SqlParameter TISSL_REFUND_TRANS = new SqlParameter();
            //TISSL_REFUND_TRANS.SqlDbType = SqlDbType.Structured;
            //TISSL_REFUND_TRANS.ParameterName = "PI_TISSL_REFUND_TRANSACTIONS";
            //TISSL_REFUND_TRANS.Value = CashupModelObj.TISSL_REFUND_TRANS;
            //parameters.Add(TISSL_REFUND_TRANS);



            ////SqlParameter TISSL_DISCOUNT = new SqlParameter();
            ////TISSL_DISCOUNT.SqlDbType = SqlDbType.Structured;
            ////TISSL_DISCOUNT.ParameterName = "PI_TISSL_DISCOUNTS";
            ////TISSL_DISCOUNT.Value = CashupModelObj.TISSL_DISCOUNTS;
            ////parameters.Add(TISSL_DISCOUNT);
            ////SqlParameter TISSL_MODIFIRES = new SqlParameter();
            ////TISSL_MODIFIRES.SqlDbType = SqlDbType.Structured;
            ////TISSL_MODIFIRES.ParameterName = "PI_TISSL_MODIFIER";
            ////TISSL_MODIFIRES.Value = CashupModelObj.TISSL_MODIFIERS;
            ////parameters.Add(TISSL_MODIFIRES);
            ////SqlParameter TISSL_TIPS = new SqlParameter();
            ////TISSL_TIPS.SqlDbType = SqlDbType.Structured;
            ////TISSL_TIPS.ParameterName = "PI_TISSL_TIPS";
            ////TISSL_TIPS.Value = CashupModelObj.TISSL_TIPS;
            ////parameters.Add(TISSL_TIPS);



            ////SqlParameter TISSL_TENDER_REFUND = new SqlParameter();
            ////TISSL_TENDER_REFUND.SqlDbType = SqlDbType.Structured;
            ////TISSL_TENDER_REFUND.ParameterName = "PI_TISSL_TENDER_REFUND";
            ////TISSL_TENDER_REFUND.Value = CashupModelObj.TISSL_TENDER_REFUND;
            ////parameters.Add(TISSL_TENDER_REFUND);

            ////SqlParameter TISSL_VOID_ITEMS = new SqlParameter();
            ////TISSL_VOID_ITEMS.SqlDbType = SqlDbType.Structured;
            ////TISSL_VOID_ITEMS.ParameterName = "PI_TISSL_VOID_ITEMS";
            ////TISSL_VOID_ITEMS.Value = CashupModelObj.TISSL_VOID_ITEMS;
            ////parameters.Add(TISSL_VOID_ITEMS);

            //try
            //{
            //    Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_TISSL_CASHUP_DATA");
            //    LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_TISSL_CASHUP_DATA");
            //}
            //catch (Exception ex)
            //{
            //    LogExceptions.LogError("Function:PRC_INS_UPD_TISSL_CASHUP_DATA(), Fail to save data in DB", ex);
            //    throw;
            //}
        }

        public void INS_UPD_ICG_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter ICG_SALES_HEADER = new SqlParameter();
            ICG_SALES_HEADER.SqlDbType = SqlDbType.Structured;
            ICG_SALES_HEADER.ParameterName = "PI_ICG_SALES_HEADER";
            ICG_SALES_HEADER.Value = CashupModelObj.ICG_SALES_HEADER;
            parameters.Add(ICG_SALES_HEADER);

            SqlParameter ICG_SALES_LINES = new SqlParameter();
            ICG_SALES_LINES.SqlDbType = SqlDbType.Structured;
            ICG_SALES_LINES.ParameterName = "PI_ICG_SALES_LINES";
            ICG_SALES_LINES.Value = CashupModelObj.ICG_SALES_LINES;
            parameters.Add(ICG_SALES_LINES);


            SqlParameter ICG_SALES_HEADER_TAXES = new SqlParameter();
            ICG_SALES_HEADER_TAXES.SqlDbType = SqlDbType.Structured;
            ICG_SALES_HEADER_TAXES.ParameterName = "PI_ICG_SALES_HEADER_TAXES";
            ICG_SALES_HEADER_TAXES.Value = CashupModelObj.ICG_SALES_HEADER_TAXES;
            parameters.Add(ICG_SALES_HEADER_TAXES);

            SqlParameter ICG_SALES_COLLECTION = new SqlParameter();
            ICG_SALES_COLLECTION.SqlDbType = SqlDbType.Structured;
            ICG_SALES_COLLECTION.ParameterName = "PI_ICG_SALES_COLLECTION";
            ICG_SALES_COLLECTION.Value = CashupModelObj.ICG_SALES_COLLECTION;
            parameters.Add(ICG_SALES_COLLECTION);


            SqlParameter ICG_SALES_MODIFIERS = new SqlParameter();
            ICG_SALES_MODIFIERS.SqlDbType = SqlDbType.Structured;
            ICG_SALES_MODIFIERS.ParameterName = "PI_ICG_SALES_MODIFIERS";
            ICG_SALES_MODIFIERS.Value = CashupModelObj.ICG_SALES_MODIFIERS;
            parameters.Add(ICG_SALES_MODIFIERS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_ICG_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_ICG_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_ICG_DATA, Fail to save data in DB", ex);
                throw;
            }
        }

        public void INS_UPD_ICG_ITEM_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            SqlParameter ICG_ITEMS = new SqlParameter();
            ICG_ITEMS.SqlDbType = SqlDbType.Structured;
            ICG_ITEMS.ParameterName = "PI_ICG_ITEMS";
            ICG_ITEMS.Value = CashupModelObj.ICG_ITEMS;
            parameters.Add(ICG_ITEMS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_ICG_ITEM_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_ICG_ITEM_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_ICG_ITEM_DATA, Fail to save data in DB", ex);
                throw;
            }
        }

        public void INS_UPD_IIKO_CASHUP_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter IIKO_HEADER_PRAM = new SqlParameter();
            IIKO_HEADER_PRAM.SqlDbType = SqlDbType.Structured;
            IIKO_HEADER_PRAM.ParameterName = "PI_IIKO_HEADER";
            IIKO_HEADER_PRAM.Value = CashupModelObj.IIKO_HEADER;
            parameters.Add(IIKO_HEADER_PRAM);

            SqlParameter IIKO_LINE_PRAM = new SqlParameter();
            IIKO_LINE_PRAM.SqlDbType = SqlDbType.Structured;
            IIKO_LINE_PRAM.ParameterName = "PI_IIKO_LINES";
            IIKO_LINE_PRAM.Value = CashupModelObj.IIKO_LINES;
            parameters.Add(IIKO_LINE_PRAM);

            SqlParameter IIKO_PAYMENT_PRAM = new SqlParameter();
            IIKO_PAYMENT_PRAM.SqlDbType = SqlDbType.Structured;
            IIKO_PAYMENT_PRAM.ParameterName = "PI_IIKO_PAYMENTS";
            IIKO_PAYMENT_PRAM.Value = CashupModelObj.IIKO_PAYMENTS;
            parameters.Add(IIKO_PAYMENT_PRAM);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_IIKO_CASHUP_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_IIKO_CASHUP_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_IIKO_CASHUP_DATA, Fail to save data in DB", ex);
                throw;
            }
        }
        public void INS_UPD_ITB_CASHUP_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter ICG_SALES_HEADER = new SqlParameter();
            ICG_SALES_HEADER.SqlDbType = SqlDbType.Structured;
            ICG_SALES_HEADER.ParameterName = "PI_ITB_SALES_DATA_HEADER";
            ICG_SALES_HEADER.Value = CashupModelObj.ITB_SALES_HEADER;
            parameters.Add(ICG_SALES_HEADER);

            SqlParameter ICG_SALES_LINES = new SqlParameter();
            ICG_SALES_LINES.SqlDbType = SqlDbType.Structured;
            ICG_SALES_LINES.ParameterName = "PI_ITB_PAYMENTS_DATA";
            ICG_SALES_LINES.Value = CashupModelObj.ITB_PAYMENTS_DATA;
            parameters.Add(ICG_SALES_LINES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_ITB_CASHUP_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_ITB_CASHUP_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_ITB_CASHUP_DATA, Fail to save data in DB", ex);
                throw;
            }
        }
        public void INS_UPD_KOBAS_CASHUP_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter KOBAS_HEADER_FIELDS = new SqlParameter();
            KOBAS_HEADER_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_HEADER_FIELDS.ParameterName = "PI_KOBAS_HEADER";
            KOBAS_HEADER_FIELDS.Value = CashupModelObj.KOBAS_HEADER;
            parameters.Add(KOBAS_HEADER_FIELDS);

            SqlParameter KOBAS_ITEMS_FIELDS = new SqlParameter();
            KOBAS_ITEMS_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_ITEMS_FIELDS.ParameterName = "PI_KOBAS_ITEMS";
            KOBAS_ITEMS_FIELDS.Value = CashupModelObj.KOBAS_ITEMS;
            parameters.Add(KOBAS_ITEMS_FIELDS);

            SqlParameter KOBAS_ITEMS_MODIFIERS_FIELDS = new SqlParameter();
            KOBAS_ITEMS_MODIFIERS_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_ITEMS_MODIFIERS_FIELDS.ParameterName = "PI_KOBAS_ITEMS_MODIFIERS";
            KOBAS_ITEMS_MODIFIERS_FIELDS.Value = CashupModelObj.KOBAS_ITEMS_MODIFIERS;
            parameters.Add(KOBAS_ITEMS_MODIFIERS_FIELDS);

            SqlParameter KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS = new SqlParameter();
            KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS.ParameterName = "PI_KOBAS_ITEMS_MODIFIERS_RECIPE";
            KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS.Value = CashupModelObj.KOBAS_ITEMS_MODIFIERS_RECIPE;
            parameters.Add(KOBAS_ITEMS_MODIFIERS_RECIPE_FIELDS);

            SqlParameter KOBAS_ITEMS_RECIPE_FIELDS = new SqlParameter();
            KOBAS_ITEMS_RECIPE_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_ITEMS_RECIPE_FIELDS.ParameterName = "PI_KOBAS_ITEMS_RECIPE";
            KOBAS_ITEMS_RECIPE_FIELDS.Value = CashupModelObj.KOBAS_ITEMS_RECIPE;
            parameters.Add(KOBAS_ITEMS_RECIPE_FIELDS);

            SqlParameter KOBAS_PAYMENTS_FIELDS = new SqlParameter();
            KOBAS_PAYMENTS_FIELDS.SqlDbType = SqlDbType.Structured;
            KOBAS_PAYMENTS_FIELDS.ParameterName = "PI_KOBAS_PAYMENTS";
            KOBAS_PAYMENTS_FIELDS.Value = CashupModelObj.KOBAS_PAYMENTS;
            parameters.Add(KOBAS_PAYMENTS_FIELDS);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_KOBAS_CASHUP_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_KOBAS_CASHUP_DATA  ");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_KOBAS_CASHUP_DATA  , Fail to save data in DB", ex);
                throw;
            }
        }

        public void INS_UPD_LIGHTSPEED_LO_SERIES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter LOS_ORDERS = new SqlParameter();
            LOS_ORDERS.SqlDbType = SqlDbType.Structured;
            LOS_ORDERS.ParameterName = "PI_KOUNTA_ORDERS";
            LOS_ORDERS.Value = CashupModelObj.LOL_ORDERS_TYPE;
            parameters.Add(LOS_ORDERS);

            DataTable LOL_ORDERS_LINE_TYPE = CashupModelObj.LOL_ORDERS_LINE_TYPE.Copy();
            LOL_ORDERS_LINE_TYPE.Columns.Remove("DELETED");



            SqlParameter LOS_ORDERS_LINE = new SqlParameter();
            LOS_ORDERS_LINE.SqlDbType = SqlDbType.Structured;
            LOS_ORDERS_LINE.ParameterName = "PI_KOUNTA_ORDERS_LINE";
            LOS_ORDERS_LINE.Value = LOL_ORDERS_LINE_TYPE;
            parameters.Add(LOS_ORDERS_LINE);

            SqlParameter LOS_ORDERS_PAYMENTS = new SqlParameter();
            LOS_ORDERS_PAYMENTS.SqlDbType = SqlDbType.Structured;
            LOS_ORDERS_PAYMENTS.ParameterName = "PI_KOUNTA_ORDERS_PAYMENTS";
            LOS_ORDERS_PAYMENTS.Value = CashupModelObj.LOL_ORDERS_PAYMENTS_TYPE;
            parameters.Add(LOS_ORDERS_PAYMENTS);

            SqlParameter LOS_MODIFIERS = new SqlParameter();
            LOS_MODIFIERS.SqlDbType = SqlDbType.Structured;
            LOS_MODIFIERS.ParameterName = "PI_KOUNTA_ORDERS_LINE_MODIFIERS";
            LOS_MODIFIERS.Value = CashupModelObj.LOL_ORDERS_LINE_MODIFIERS_TYPE;
            parameters.Add(LOS_MODIFIERS);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_KOUNTA_CASHUP_DATA");
                LogExceptions.LogInfo("Data insert successfully in DB. PRC_INS_UPD_KOUNTA_CASHUP_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_KOUNTA_CASHUP_DATA, Fail to save data in DB", ex);
                throw;
            }
        }

        public void INS_UPD_EPOS_SALES()
        { 
            DataSet dataSet = null;           
            string select = string.Empty;
            if (CashupModelObj.INTEGRATION_SYSTEM_ID == 10)
            {
                dataSet = GET_OMEGA_REVENUE_CENTER_BY_BRANCH();
            }

            if (dataSet != null && dataSet.Tables.Count > 0 && dataSet.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow DR in dataSet.Tables[0].Rows)
                {
                    select = select + "REVENUE_CENTRE_DESC ='" + DR["REVENUE_CENTER"] + "' or ";
                }
            }

            SqlConnection sqlConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DBCONNECTION"].ConnectionString); sqlConnection.Open();


            SqlCommand sqlCommand = new SqlCommand("PRC_INS_UPD_EPOS_SALES", sqlConnection);

            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 600;

            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID);
            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_HEADER_ID", DBNull.Value);
            sqlCommand.Parameters.AddWithValue("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID);
            sqlCommand.Parameters.AddWithValue("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID);
            sqlCommand.Parameters.AddWithValue("@PI_INTEGRATION_SYSTEM_ID ", CashupModelObj.INTEGRATION_SYSTEM_ID);

            SqlParameter EPOS_SALES_HEADER = sqlCommand.Parameters.AddWithValue("@PI_EPOS_SALES_HEADER", select == "" ? CashupModelObj.EPOS_SALES_HEADER : CashupModelObj.EPOS_SALES_HEADER.Select(select.Remove(select.LastIndexOf("or"), 2)).CopyToDataTable());
            EPOS_SALES_HEADER.SqlDbType = SqlDbType.Structured;

            SqlParameter EPOS_SALES_LINES = sqlCommand.Parameters.AddWithValue("@PI_EPOS_SALES_LINES", CashupModelObj.EPOS_SALES_LINES);
            EPOS_SALES_LINES.SqlDbType = SqlDbType.Structured;


            if (CashupModelObj.INTEGRATION_SYSTEM_ID == Convert.ToInt32(IntegrationSource.KOBAS))
            {
                CashupModelObj.EPOS_SALES_PAYMENTS.Columns.Remove("SERVICE_CHARGE");
            }

            SqlParameter EPOS_SALES_PAYMENTS = sqlCommand.Parameters.AddWithValue("@PI_EPOS_SALES_PAYMENTS", CashupModelObj.EPOS_SALES_PAYMENTS);
            EPOS_SALES_PAYMENTS.SqlDbType = SqlDbType.Structured;

            SqlParameter EPOS_SALES_DISCOUNT = sqlCommand.Parameters.AddWithValue("@PI_EPOS_SALES_DISCOUNTS", CashupModelObj.EPOS_SALES_DISCOUNTS);
            EPOS_SALES_DISCOUNT.SqlDbType = SqlDbType.Structured;

            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                throw;
            }
        }

        public DataSet GET_OMEGA_REVENUE_CENTER_BY_BRANCH()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for PRC_GET_OMEGA_REVENUE_CENTER_BY_BRANCH.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_OMEGA_REVENUE_CENTER_BY_BRANCH");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_GET_OMEGA_REVENUE_CENTER_BY_BRANCH, Fail to save data in DB", ex);
                throw;
            }
        }

        public DataSet GET_CASHUP_DATA_FY()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for PRC_GET_OMEGA_REVENUE_CENTER_BY_BRANCH.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_CASHUP_DATA_LIGHT_SPEED");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_GET_OMEGA_REVENUE_CENTER_BY_BRANCH, Fail to save data in DB", ex);
                return null;
            }
        }

        public DataTable GET_SQUIRREL_CASHUP_MAIN_IDS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for GET_SQUIRREL_CASHUP_MAIN_IDS.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_SQUIRREL_CASHUP_MAIN_IDS").Tables[0];
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:GET_SQUIRREL_CASHUP_MAIN_IDS, Fail to save data in DB", ex);
                return null;
            }
        }
        public DataSet GET_MICROS_DATA_BY_CASHUP_MAIN_ID()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for PRC_GET_MICROS_DATA_BY_CASHUP_MAIN_ID.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_MICROS_DATA_BY_CASHUP_MAIN_ID");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:GET_MICROS_DATA_BY_CASHUP_MAIN_ID, Fail to save data in DB", ex);
                return null;
            }
        }

        public DataSet GET_SQUIRREL_EPOS_DATA_BY_CASHUP_MAIN_ID()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for GET_SQUIRREL_CASHUP_MAIN_IDS.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_SQUIRREL_EPOS_DATA_BY_CASHUP_MAIN_ID");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:GET_SQUIRREL_CASHUP_MAIN_IDS, Fail to save data in DB", ex);
                return null;
            }
        }
        #region--SIMPHONY
        public void INS_UPD_MICROS_SIMPHONY_GUEST_CHECKS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));

            SqlParameter MICROS_SIMPHONY_GUEST_CHECKS = new SqlParameter();
            MICROS_SIMPHONY_GUEST_CHECKS.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_GUEST_CHECKS.ParameterName = "PI_MICROS_SIMPHONY_GUEST_CHECKS";
            MICROS_SIMPHONY_GUEST_CHECKS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_GUEST_CHECKS);

            SqlParameter MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE = new SqlParameter();
            MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE.ParameterName = "PI_MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE";
            MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE.Value = CashupModelObj.DATATABLE_2;
            parameters.Add(MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE);

            SqlParameter MICROS_SIMPHONY_GUEST_CHECKS_TAXES = new SqlParameter();
            MICROS_SIMPHONY_GUEST_CHECKS_TAXES.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_GUEST_CHECKS_TAXES.ParameterName = "PI_MICROS_SIMPHONY_GUEST_CHECKS_TAXES";
            MICROS_SIMPHONY_GUEST_CHECKS_TAXES.Value = CashupModelObj.DATATABLE_3;
            parameters.Add(MICROS_SIMPHONY_GUEST_CHECKS_TAXES);


            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_SALES_DATA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_SALES_DATA");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_ORDER()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_ORDER = new SqlParameter();
            MICROS_SIMPHONY_ORDER.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_ORDER.ParameterName = "PI_MICROS_SIMPHONY_ORDER";
            MICROS_SIMPHONY_ORDER.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_ORDER);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_ORDER");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_ORDER");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_REASON_CODE()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_REASON_CODE";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_REASON_CODE");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_REASON_CODE");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_REVENUE_CENTER()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_REVENUE_CENTER";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_REVENUE_CENTER");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_REVENUE_CENTER");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_SERVICE_CHARGE()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_SERVICE_CHARGE";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_SERVICE_CHARGE");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_SERVICE_CHARGE");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_TAXES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_TAXES";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_TAXES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_TAXES");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_TENDER_MEDIA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_TENDER_MEDIA";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_TENDER_MEDIA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_TENDER_MEDIA");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_MENU_ITEM()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_MENU_ITEM";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_MENU_ITEM");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_MENU_ITEM");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_EMPLOYEES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_EMPLOYEES";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_EMPLOYEES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_EMPLOYEES");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_DISCOUNTS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter MICROS_SIMPHONY_REASON_CODE = new SqlParameter();
            MICROS_SIMPHONY_REASON_CODE.SqlDbType = SqlDbType.Structured;
            MICROS_SIMPHONY_REASON_CODE.ParameterName = "PI_MICROS_SIMPHONY_DISCOUNTS";
            MICROS_SIMPHONY_REASON_CODE.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(MICROS_SIMPHONY_REASON_CODE);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_MICROS_SIMPHONY_DISCOUNTS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_DISCOUNTS");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON()
        {
            var _connectionString = new DBHelper();
            SqlConnection sqlConnection = new SqlConnection(_connectionString.constr.ToString()); sqlConnection.Open();
            SqlCommand sqlCommand = new SqlCommand("PRC_INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON", sqlConnection);
            sqlCommand.CommandType = CommandType.StoredProcedure;
            sqlCommand.CommandTimeout = 60000;

            sqlCommand.Parameters.AddWithValue("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID);
            sqlCommand.Parameters.AddWithValue("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID);
            sqlCommand.Parameters.AddWithValue("@PI_CASHUP_MAIN_ID ", CashupModelObj.CASHUP_MAIN_ID);
            try
            {
                sqlCommand.ExecuteNonQuery();
                sqlConnection.Close();
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON");
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                throw;
            }
        }
        #endregion
        #region --- FOODICS-----
        public void INS_UPD_FOODICS_BRANCHES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_BRANCHES = new SqlParameter();
            FOODICS_BRANCHES.SqlDbType = SqlDbType.Structured;
            FOODICS_BRANCHES.ParameterName = "PI_FOODICS_BRANCHES";
            FOODICS_BRANCHES.Value = CashupModelObj.DATATABLE_BRANCH;
            parameters.Add(FOODICS_BRANCHES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_BRANCHES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_BRANCHES");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_FOODICS_BRANCHES(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_CATEGORIES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_CATEGORIES = new SqlParameter();
            FOODICS_CATEGORIES.SqlDbType = SqlDbType.Structured;
            FOODICS_CATEGORIES.ParameterName = "PI_FOODICS_CATEGORIES";
            FOODICS_CATEGORIES.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_CATEGORIES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_CATEGORIES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_CATEGORIES");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_FOODICS_CATEGORIES(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_PAYMENT_METHODS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_PAYMENT_METHODS = new SqlParameter();
            FOODICS_PAYMENT_METHODS.SqlDbType = SqlDbType.Structured;
            FOODICS_PAYMENT_METHODS.ParameterName = "PI_FOODICS_PAYMENT_METHODS";
            FOODICS_PAYMENT_METHODS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_PAYMENT_METHODS);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_PAYMENT_METHODS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_PAYMENT_METHODS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_INS_UPD_FOODICS_PAYMENT_METHODS(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_TAXES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_TAXES = new SqlParameter();
            FOODICS_TAXES.SqlDbType = SqlDbType.Structured;
            FOODICS_TAXES.ParameterName = "PI_FOODICS_TAXES";
            FOODICS_TAXES.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_TAXES);

            SqlParameter FOODICS_TAXES_TAX_GROUPS = new SqlParameter();
            FOODICS_TAXES_TAX_GROUPS.SqlDbType = SqlDbType.Structured;
            FOODICS_TAXES_TAX_GROUPS.ParameterName = "PI_FOODICS_TAXES_TAX_GROUPS";
            FOODICS_TAXES_TAX_GROUPS.Value = CashupModelObj.DATATABLE_2;
            parameters.Add(FOODICS_TAXES_TAX_GROUPS);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_TAXES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_TAXES");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_TAXES(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_TAXES_()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_TAXES = new SqlParameter();
            FOODICS_TAXES.SqlDbType = SqlDbType.Structured;
            FOODICS_TAXES.ParameterName = "PI_FOODICS_TAXES";
            FOODICS_TAXES.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_TAXES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_TAXES");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_TAXES");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_TAXES(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_FOODICS_SALES_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));

            SqlParameter FOODICS_ORDERS = new SqlParameter();
            FOODICS_ORDERS.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS.ParameterName = "PI_FOODICS_ORDERS";
            FOODICS_ORDERS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_ORDERS);

            SqlParameter FOODICS_ORDERS_META_PRODUCTS_KITCHEN = new SqlParameter();
            FOODICS_ORDERS_META_PRODUCTS_KITCHEN.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS_META_PRODUCTS_KITCHEN.ParameterName = "PI_FOODICS_ORDERS_META_PRODUCTS_KITCHEN";
            FOODICS_ORDERS_META_PRODUCTS_KITCHEN.Value = CashupModelObj.DATATABLE_2;
            parameters.Add(FOODICS_ORDERS_META_PRODUCTS_KITCHEN);

            SqlParameter FOODICS_ORDERS_PAYMENT = new SqlParameter();
            FOODICS_ORDERS_PAYMENT.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS_PAYMENT.ParameterName = "PI_FOODICS_ORDERS_PAYMENT";
            FOODICS_ORDERS_PAYMENT.Value = CashupModelObj.DATATABLE_3;
            parameters.Add(FOODICS_ORDERS_PAYMENT);

            SqlParameter FOODICS_ORDERS_PRODUCTS = new SqlParameter();
            FOODICS_ORDERS_PRODUCTS.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS_PRODUCTS.ParameterName = "PI_FOODICS_ORDERS_PRODUCTS";
            FOODICS_ORDERS_PRODUCTS.Value = CashupModelObj.DATATABLE_4;
            parameters.Add(FOODICS_ORDERS_PRODUCTS);

            SqlParameter FOODICS_ORDERS_PRODUCTS_OPTIONS = new SqlParameter();
            FOODICS_ORDERS_PRODUCTS_OPTIONS.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS_PRODUCTS_OPTIONS.ParameterName = "PI_FOODICS_ORDERS_PRODUCTS_OPTIONS";
            FOODICS_ORDERS_PRODUCTS_OPTIONS.Value = CashupModelObj.DATATABLE_5;
            parameters.Add(FOODICS_ORDERS_PRODUCTS_OPTIONS);

            SqlParameter FOODICS_ORDERS_PRODUCTS_TAXES = new SqlParameter();
            FOODICS_ORDERS_PRODUCTS_TAXES.SqlDbType = SqlDbType.Structured;
            FOODICS_ORDERS_PRODUCTS_TAXES.ParameterName = "PI_FOODICS_ORDERS_PRODUCTS_TAXES";
            FOODICS_ORDERS_PRODUCTS_TAXES.Value = CashupModelObj.DATATABLE_6;
            parameters.Add(FOODICS_ORDERS_PRODUCTS_TAXES);

            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_FOODICS_SALES_DATA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_FOODICS_SALES_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_FOODICS_SALES_DATA(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_MODIFIERS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_MODIFIERS = new SqlParameter();
            FOODICS_MODIFIERS.SqlDbType = SqlDbType.Structured;
            FOODICS_MODIFIERS.ParameterName = "PI_FOODICS_MODIFIERS";
            FOODICS_MODIFIERS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_MODIFIERS);


            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_MODIFIERS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_MODIFIERS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_MODIFIERS(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_REASONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_REASONS = new SqlParameter();
            FOODICS_REASONS.SqlDbType = SqlDbType.Structured;
            FOODICS_REASONS.ParameterName = "PI_FOODICS_REASONS";
            FOODICS_REASONS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_REASONS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_REASONS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_REASONS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_REASONS(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_MODIFIER_OPTIONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_MODIFIERS_OPTIONS = new SqlParameter();
            FOODICS_MODIFIERS_OPTIONS.SqlDbType = SqlDbType.Structured;
            FOODICS_MODIFIERS_OPTIONS.ParameterName = "PI_FOODICS_MODIFIERS_OPTIONS";
            FOODICS_MODIFIERS_OPTIONS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_MODIFIERS_OPTIONS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_MODIFIERS_OPTIONS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_MODIFIER_OPTIONS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_MODIFIER_OPTIONS(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public void INS_UPD_FOODICS_DISCOUNTS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter FOODICS_DISCOUNTS = new SqlParameter();
            FOODICS_DISCOUNTS.SqlDbType = SqlDbType.Structured;
            FOODICS_DISCOUNTS.ParameterName = "PI_FOODICS_DISCOUNTS";
            FOODICS_DISCOUNTS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(FOODICS_DISCOUNTS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_FOODICS_DISCOUNTS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_FOODICS_DISCOUNTS");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function: INS_UPD_FOODICS_DISCOUNTS(), Fail to save data in DB", ex);
                throw ex;
            }
        }
        public DataSet GET_FOODICS_SALES_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();


            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));

            SqlParameter entsParam = new SqlParameter();
            try
            {
                return Obj.ExecuteDataset(parameters, "PRC_GET_FOODICS_SALES_DATA");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:GET_FOODICS_SALES_DATA, Fail to save data in DB", ex);
                return null;
            }
        }
        #endregion
        #region---Quardanet---
        public void INS_QUADRANET_EPOS_DATA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", CashupModelObj.BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CashupModelObj.CASHUP_MAIN_ID));

            SqlParameter HEADER = new SqlParameter();
            HEADER.SqlDbType = SqlDbType.Structured;
            HEADER.ParameterName = "PI_QUADRANET_HEADER";
            HEADER.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(HEADER);

            SqlParameter LINE = new SqlParameter();
            LINE.SqlDbType = SqlDbType.Structured;
            LINE.ParameterName = "PI_QUADRANET_ITEMS";
            LINE.Value = CashupModelObj.DATATABLE_2;
            parameters.Add(LINE);

            SqlParameter DISCOUNT = new SqlParameter();
            DISCOUNT.SqlDbType = SqlDbType.Structured;
            DISCOUNT.ParameterName = "PI_QUADRANET_DISCOUNT";
            DISCOUNT.Value = CashupModelObj.DATATABLE_3;
            parameters.Add(DISCOUNT);

            SqlParameter PAYMENT = new SqlParameter();
            PAYMENT.SqlDbType = SqlDbType.Structured;
            PAYMENT.ParameterName = "PI_QUADRANET_PAYMENTS";
            PAYMENT.Value = CashupModelObj.DATATABLE_4;
            parameters.Add(PAYMENT);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_QUADRANET_EPOS_DATA");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_QUADRANET_EPOS_DATA");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public DataSet GET_MICROS_DATA_BY_ENTITY_CASHUP_DATE()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", CashupModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_CASHUP_DATE", CashupModelObj.CASHUP_DATE));
            try
            {
                LogExceptions.LogInfo("Data insert successfully in DB for PRC_GET_MICROS_DATA_BY_ENTITY_CASHUP_DATE.");
                return Obj.ExecuteDataset(parameters, "PRC_GET_MICROS_DATA_BY_ENTITY_CASHUP_DATE");
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Function:PRC_GET_MICROS_DATA_BY_ENTITY_CASHUP_DATE, Fail to save data in DB", ex);
                return null;
            }
        }
        //public T testSP<T>(List<SqlParameter> sqlParameters)
        //{
        //    DBHelper Obj = new DBHelper("INT_DBCONNECTION");
        //    Obj.ExecuteNonQuery_SP(sqlParameters, "PRC_INS_QUADRANET_EPOS_DATA");

        //}

        #endregion
        #region----Currency Conversion------
        public void INS_UPD_CURRENCY_CONVERSIONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlParameter entsParam = new SqlParameter();
            parameters.Add(new SqlParameter("@PI_BASE_CURRENCY_CODE", "GBP"));
            parameters.Add(new SqlParameter("@PI_EFFECTIVE_DATE", CashupModelObj.CASHUP_DATE));

            SqlParameter CURRENCY_CONVERSIONS = new SqlParameter();
            CURRENCY_CONVERSIONS.SqlDbType = SqlDbType.Structured;
            CURRENCY_CONVERSIONS.ParameterName = "PI_CURRENCY_CONVERSIONS";
            CURRENCY_CONVERSIONS.Value = CashupModelObj.DATATABLE_1;
            parameters.Add(CURRENCY_CONVERSIONS);
            try
            {
                Obj.ExecuteNonQuery_SP(parameters, "PRC_INS_UPD_CURRENCY_CONVERSIONS");
                LogExceptions.LogInfo("Data inset successfully in DB. PRC_INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
