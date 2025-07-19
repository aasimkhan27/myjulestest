using EPOS_Integration.Common;
using EPOS_Integration.LIGHTSPEED_LSERIES;
using System;
using System.Data;

namespace EPOS_Integration.Transformers
{
    public class LightspeedLSTransformer : IDataTransformer
    {
        public void Transform(DataTable integrationData, object data, decimal cashupMainId, Cashup cashup)
        {
            var obj = new EPOS_SALES_LIGHT_SPEED_L_SERIES<DataSet>();
            obj.CashupModelObj = cashup.CashupModelObj;
            cashup.CashupModelObj = obj.Transform_Light_Speed_L_Series(data as DataSet, (int)IntegrationSource.LIGHTSPEED_LS, cashup, integrationData);
            try
            {
                if (cashup.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                {
                    cashup.INS_UPD_EPOS_SALES();
                    cashup.CashupModelObj.INTEGRATION_STATUS = 2;
                }
                else
                {
                    cashup.CashupModelObj.INTEGRATION_STATUS = 4;
                }
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(Transform_Light_Speed_L_Series) Common.--------" + ex.Message.ToString();
                throw;
            }
        }
    }
}
