using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ApplicationBlocks.Data;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;

namespace Utility
{
    public class DBHelper
    {
        public string constr = "";
        public DBHelper()
        {

            constr = ConfigurationManager.ConnectionStrings["DBCONNECTION"].ConnectionString;
        }
        public int ExecuteNonQuery(List<SqlParameter> parameters, string Command)
        {
            return SqlHelper.ExecuteNonQuery(constr, Command, parameters.ToArray());
        }
        public int ExecuteNonQuery_SP(List<SqlParameter> parameters, string Command)
        {
            return SqlHelper.ExecuteNonQuery(constr, CommandType.StoredProcedure, Command, parameters.ToArray());
        }

        public int ExecuteScalar(List<SqlParameter> parameters, string Command)
        {
            return Convert.ToInt32(SqlHelper.ExecuteScalar(constr, Command, parameters.ToArray()));
        }

        public DataSet ExecuteDataset(List<SqlParameter> parameters, string Command)
        {
            return SqlHelper.ExecuteDataset(constr, Command, parameters.ToArray());
        }
        public DataSet ExecuteDataset_SP(List<SqlParameter> parameters, string Command)
        {
            return SqlHelper.ExecuteDataset(constr, CommandType.StoredProcedure, Command, parameters.ToArray());
        }
    }
}
