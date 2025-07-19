using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using Utility;

namespace Vouchers_Integration
{
    public class SystemInformation
    {
        public DataTable GET_INTEGRATION_DETAILS()
        {
            DBHelper Obj = new DBHelper();
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@PI_INTEGRATION_SYSTEM_ID", VoucherIntegrationSource.GIFTPRO));
            return Obj.ExecuteDataset(parameters, "PRC_GET_INTEGRATION_DETAILS").Tables[0];
        }
    }
}
