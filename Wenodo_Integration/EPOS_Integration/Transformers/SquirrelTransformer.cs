using EPOS_Integration.BasicAuth;
using EPOS_Integration.Common;
using System;
using System.Data;

namespace EPOS_Integration.Transformers
{
    public class SquirrelTransformer : IDataTransformer
    {
        public void Transform(DataTable integrationData, object data, decimal cashupMainId, Cashup cashup)
        {
            var obj = new EPOS_SALES_SQUIRELL<DataSet>();
            obj.CashupModelObj = cashup.CashupModelObj;
            cashup.CashupModelObj = obj.Transform_SquirrelData(data as DataSet, (int)IntegrationSource.SQUIRREL, cashup, integrationData);
            try
            {
                if (cashup.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                {
                    cashup.INS_UPD_EPOS_SALES();
                    cashup.CashupModelObj.INTEGRATION_STATUS = 6;
                }
                else
                {
                    cashup.CashupModelObj.INTEGRATION_STATUS = 5;
                }
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(SQUIRREL) Common.--------" + ex.Message.ToString();
                throw;
            }
        }
    }
}
