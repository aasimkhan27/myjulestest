using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace Notification
{
   public class DataAccessLayer
    {
        public DataAccess_Model DataAccess_ModelObj { get; set; }
        public void UPD_NTFCTN_FOR_SRVC()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", DataAccess_ModelObj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_STATUS_ID", DataAccess_ModelObj.STATUS_ID));
            parameters.Add(new SqlParameter("@PI_EMAIL_ERROR", DataAccess_ModelObj.EMAIL_ERROR));
            Obj.ExecuteNonQuery(parameters, "PRC_UPD_NTFCTN_FOR_SRVC");
        }
        public DataSet GET_NTFCTN_FOR_SRVC()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();            
            return Obj.ExecuteDataset(parameters, "PRC_GET_NTFCTN_FOR_SRVC");
        }
        public DataSet GET_DATA_FOR_NTFCTN(Int32 NOTIFICATION_ID, Int32 EMP_PRS_ID)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_NOTIFICATION_ID", NOTIFICATION_ID));
            parameters.Add(new SqlParameter("@PI_EMP_PRS_ID ", EMP_PRS_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_DATA_FOR_NTFCTN");
        }
        public DataSet GET_DATA_FOR_MRKTMN_NTFCTN(decimal MM_LOGS_ID, int TYPE)
        {
            DBHelper Obj = new DBHelper();
            int ZEROVALUE = 0;
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", ZEROVALUE));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", ZEROVALUE));
            parameters.Add(new SqlParameter("@PI_START_DATE", null));
            parameters.Add(new SqlParameter("@PI_END_DATE", null));
            parameters.Add(new SqlParameter("@PI_TYPE", TYPE));
            parameters.Add(new SqlParameter("@PI_MM_LOGS_ID", MM_LOGS_ID));
            parameters.Add(new SqlParameter("@PI_PAGE_NO", ZEROVALUE));
            parameters.Add(new SqlParameter("@PI_PAGE_SIZE", ZEROVALUE));
            return Obj.ExecuteDataset(parameters, "PRC_GET_MRKTMN_LOGS");
        }
        public DataSet GET_LEAVE_REQUEST_BY_ID(int TABLE_ID)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", TABLE_ID));
            parameters.Add(new SqlParameter("@PI_ADMIN_FLAG", 0));
            parameters.Add(new SqlParameter("@PI_TIME_ZONE", null));
            return Obj.ExecuteDataset(parameters, "PRC_GET_LEAVE_REQUEST_BY_ID");
        }
        public DataSet GET_PETTY_CASH_DECLERATION_FOR_NTFCTN(decimal CASHUP_MAIN_ID)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_CASHUP_MAIN_ID", CASHUP_MAIN_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_PETTY_CASH_DECLERATION_FOR_NTFCTN");
        }
        public DataSet GET_PYMNT_REQUEST_DATA_FOR_NTFCTN(decimal PYMNT_REQUEST_ID)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", PYMNT_REQUEST_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_PYMNT_REQUEST_DATA_FOR_NTFCTN");
        }
        public DataSet PYMNT_RECONSILE_STATEMENT_BY_ID(decimal STATEMENT_ID , decimal USER_ID,bool RECONCILE_FLAG)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_STATEMENT_ID", STATEMENT_ID));
            parameters.Add(new SqlParameter("@PI_USER_ID", USER_ID));
            parameters.Add(new SqlParameter("@PI_RECONCILE_FLAG", RECONCILE_FLAG));
            return Obj.ExecuteDataset(parameters, "PRC_PYMNT_RECONSILE_STATEMENT_BY_ID");
        }
        public DataSet GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH(DataAccessLayer dataAccessLayer )
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", dataAccessLayer.DataAccess_ModelObj.INTEGRATION_SYSTEM_ID));
            parameters.Add(new SqlParameter("@PI_CUSTOMER_ID", dataAccessLayer.DataAccess_ModelObj.CUSTOMER_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", dataAccessLayer.DataAccess_ModelObj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", dataAccessLayer.DataAccess_ModelObj.BRANCH_ID == null ? 0 : dataAccessLayer.DataAccess_ModelObj.BRANCH_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH");
        }
        public DataSet UPD_SUPY_INTEGRATION_STATUS(DataAccessLayer dataAccessLayer)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", dataAccessLayer.DataAccess_ModelObj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_STATUS_ID", dataAccessLayer.DataAccess_ModelObj.STATUS_ID));
            parameters.Add(new SqlParameter("@PI_ERROR", dataAccessLayer.DataAccess_ModelObj.ERROR));
            return Obj.ExecuteDataset(parameters, "PRC_UPD_SUPY_INTEGRATION_STATUS");
        }
        public DataSet GET_DEVICES_BY_USER_ID(DataAccessLayer dataAccessLayer, DataRow dataRow)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_USER_ID", Convert.ToDecimal(dataRow["USER_ID"])));          
            return Obj.ExecuteDataset(parameters, "PRC_GET_DEVICES_BY_USER_ID");
        }
        public DataSet GET_P2P_NEW_SUPPLIER_BY_ID(DataAccessLayer dataAccessLayer)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_USER_ID", Convert.ToDecimal(dataAccessLayer.DataAccess_ModelObj.TABLE_ID)));
            return Obj.ExecuteDataset(parameters, "PRC_GET_P2P_NEW_SUPPLIER_BY_ID");
        }
        public DataSet GET_PENDING_APPROVAL_DATA_FOR_NTFCTN(string[] _params)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_APPROVER_ID", _params[0]));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", _params[1]));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", _params[2]));
            return Obj.ExecuteDataset(parameters, "PRC_GET_PENDING_APPROVAL_DATA_FOR_NTFCTN");
        }
        public DataSet GET_CUSTOMER_SETTINGS(decimal CUSTOMER_ID,DataTable USER_SETTING,decimal MODULE_ID)
        {
            DBHelper db = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_CUSTOMER_ID", CUSTOMER_ID));

            SqlParameter tvpParam = new SqlParameter();
            tvpParam.SqlDbType = SqlDbType.Structured;
            tvpParam.ParameterName = "PI_SETTING_MASTER_IDS";
            tvpParam.Value = USER_SETTING;
            parameters.Add(tvpParam);
            parameters.Add(new SqlParameter("@PI_MODULE_ID", MODULE_ID));
            return db.ExecuteDataset_SP(parameters, "PRC_GET_CUSTOMER_SETTINGS");
        }
    }
}
