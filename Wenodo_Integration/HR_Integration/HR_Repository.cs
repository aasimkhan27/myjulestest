using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Utility;
namespace HR_Integration
{
    public class HR_Repository
    {
        public HR_Model HR_Modelobj { get; set; }
        public DataSet FIRM_GIRL()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", HR_Modelobj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_STATUS_ID", HR_Modelobj.STATUS_ID));
            parameters.Add(new SqlParameter("@PI_EMAIL_ERROR", HR_Modelobj.EMAIL_ERROR));
            return Obj.ExecuteDataset(parameters, "PRC_UPD_NTFCTN_FOR_SRVC");
        }
        public DataTable GET_INTEGRATION_DETAILS(int INTEGRATION_SYSTEM_ID)
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", INTEGRATION_SYSTEM_ID));
            return Obj.ExecuteDataset(parameters, "PRC_GET_INTEGRATION_DETAILS").Tables[0];
        }
        public void UPD_NTFCTN_FOR_SRVC()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", HR_Modelobj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_STATUS_ID", HR_Modelobj.STATUS_ID));
            parameters.Add(new SqlParameter("@PI_EMAIL_ERROR", HR_Modelobj.EMAIL_ERROR));
            Obj.ExecuteNonQuery(parameters, "PRC_UPD_NTFCTN_FOR_SRVC");
        }      
        public int INS_HARRI_EMP_ROTA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_FILE_DATE", HR_Modelobj.FILE_DATE));
            parameters.Add(new SqlParameter("@PI_ORIGNAL_FILE_NAME", HR_Modelobj.ORIGNAL_FILE_NAME));
            parameters.Add(new SqlParameter("@PI_SERVER_FILE_NAME", HR_Modelobj.SERVER_FILE_NAME));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID == 0 ? (object)DBNull.Value : HR_Modelobj.BRANCH_ID));
            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_HARRI_ROTA_EMPLOYEE";
            tvpParam2.Value = HR_Modelobj.HARRI_ROTA_EMP_TYPE;
            parameters.Add(tvpParam2);
            SqlParameter parm2 = new SqlParameter("@PO_SUCCESS", SqlDbType.BigInt);//--1 FOR SUCCESS 0 FOR ERROR
            parm2.Direction = ParameterDirection.Output;
            parameters.Add(parm2);
            Obj.ExecuteDataset_SP(parameters, "PRC_INS_HARRI_EMP_ROTA");
            Int32 PO_SUCCESS = Convert.ToInt32(parameters[6].Value.ToString());
            return PO_SUCCESS;
        }
        public int INS_KOBAS_EMP_ROTA()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();

            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_KOBAS_STAFF_ROLES";
            tvpParam2.Value = HR_Modelobj.KOBAS_ROTA_ROLE;
            parameters.Add(tvpParam2);

            SqlParameter tvpParam3 = new SqlParameter();
            tvpParam3.SqlDbType = SqlDbType.Structured;
            tvpParam3.ParameterName = "PI_KOBAS_STAFF";
            tvpParam3.Value = HR_Modelobj.KOBAS_ROTA_STAFF;
            parameters.Add(tvpParam3);

            SqlParameter tvpParam4 = new SqlParameter();
            tvpParam4.SqlDbType = SqlDbType.Structured;
            tvpParam4.ParameterName = "PI_KOBAS_STAFF_SHIFT";
            tvpParam4.Value = HR_Modelobj.KOBAS_ROTA_SHIFT;
            parameters.Add(tvpParam4);

            SqlParameter tvpParam5 = new SqlParameter();
            tvpParam5.SqlDbType = SqlDbType.Structured;
            tvpParam5.ParameterName = "PI_KOBAS_VENUE";
            tvpParam5.Value = HR_Modelobj.KOBAS_ROTA_VENUE;
            parameters.Add(tvpParam5);

            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID == 0 ? (object)DBNull.Value : HR_Modelobj.BRANCH_ID));
            Obj.ExecuteDataset_SP(parameters, "PRC_INS_KOBAS_EMP_ROTA");
            return 1;
        }
        public int UPD_INTEGRATION_TOKENS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_TABLE_ID", HR_Modelobj.TABLE_ID));
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));
            parameters.Add(new SqlParameter("@PI_CUSTOMER_ID", HR_Modelobj.CUSTOMER_ID));
            parameters.Add(new SqlParameter("@PI_URL_PARAMETERS", HR_Modelobj.URL_PARAMETERS));
            parameters.Add(new SqlParameter("@PI_API_KEY", HR_Modelobj.API_KEY));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", HR_Modelobj.INTEGRATION_SYSTEM_ID));
            parameters.Add(new SqlParameter("@PI_USER_ID", HR_Modelobj.USER_ID));
            parameters.Add(new SqlParameter("@PI_URL_PATH", HR_Modelobj.URL_PATH));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_TYPE_ID", HR_Modelobj.INTEGRATION_TYPE_ID));
            parameters.Add(new SqlParameter("@PI_MODULE_ID", 7));
            parameters.Add(new SqlParameter("@PI_USERID", (object)DBNull.Value)); //Column value that is string and used in integration
            parameters.Add(new SqlParameter("@PI_PASSWORD", (object)DBNull.Value));
            parameters.Add(new SqlParameter("@PI_IS_OUTBOUND", Boolean.FalseString));
            parameters.Add(new SqlParameter("@PI_INTEGRATION_PICKUP_FLAG", Boolean.FalseString));
            parameters.Add(new SqlParameter("@PI_GROUP_ID", HR_Modelobj.GROUP_ID));
            Obj.ExecuteDataset(parameters, "PRC_UPD_INTEGRATION_TOKENS");
            return 2;
        }

        #region --- S4 Labour----
        public void INS_UPD_S4L_MARITAL_STATUS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID)); 
 
            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_MARITAL_STATUS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_MARITAL_STATUS");
        }
        public void INS_UPD_S4L_NATIONALITIES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));

            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_NATIONALITIES";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_NATIONALITIES");
        }
        public void INS_UPD_S4L_GENDER()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));

            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_GENDER";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_GENDER");
        }
        public void INS_UPD_S4L_SITES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));
            

            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_SITES";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_SITES");
        }
        public void INS_UPD_S4L_DOCUMENTSTYPE()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_DOCUMENTSTYPE";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_DOCUMENTSTYPE");
        }
        public void INS_UPD_S4L_PAYTYPE()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_PAYTYPE";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_PAYTYPE");
        }
        public void INS_UPD_S4L_SITE_LVL_POSITIONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_SITE_LVL_POSITIONS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_SITE_LVL_POSITIONS");
        }
        public void  INS_UPD_S4L_ORG_LVL_POSITIONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORG_LVL_POSITIONS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORG_LVL_POSITIONS    ");
        }
        public void INS_UPD_S4L_EMPLOYEES()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_EMPLOYEES";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_EMPLOYEES");
        }
        public void INS_UPD_S4L_STARTERS_AND_LEAVERS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_STARTERS_AND_LEAVERS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_STARTERS_AND_LEAVERS");
        }
        public void INS_UPD_S4L_ORG_ADDITIONAL_PAY()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORG_ADDITIONAL_PAY";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORG_ADDITIONAL_PAY");
        }
        public void INS_UPD_S4L_PAYROLL_EXPORT()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_PAYROLL_EXPORT";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_PAYROLL_EXPORT");
        }
        public void INS_UPD_S4L_ACTUAL_PAYROLL_SHIFTS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ACTUAL_PAYROLL_SHIFTS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ACTUAL_PAYROLL_SHIFTS");
        }
        public void INS_UPD_S4L_ORG_SHIFTS_FORECAST()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORG_SHIFTS_FORECAST";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORG_SHIFTS_FORECAST");
        }
        public void INS_UPD_S4L_ORG_SHIFTS_AMENDED()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORG_SHIFTS_AMENDED";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORG_SHIFTS_AMENDED");
        }
        public void INS_UPD_S4L_ORG_SHIFTS_ACTUAL()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORG_SHIFTS_ACTUAL";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORG_SHIFTS_ACTUAL");
        }
        public void INS_UPD_S4L_ORGANISATIONS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_ENTITY_ID", HR_Modelobj.ENTITY_ID));
            parameters.Add(new SqlParameter("@PI_BRANCH_ID", HR_Modelobj.BRANCH_ID));


            SqlParameter tvpParam2 = new SqlParameter();
            tvpParam2.SqlDbType = SqlDbType.Structured;
            tvpParam2.ParameterName = "PI_S4L_ORGANISATIONS";
            tvpParam2.Value = HR_Modelobj.DATATABLE_COMMON;
            parameters.Add(tvpParam2);

            Obj.ExecuteDataset_SP(parameters, "PRC_INS_UPD_S4L_ORGANISATIONS");
        }
        #endregion
    }
}
