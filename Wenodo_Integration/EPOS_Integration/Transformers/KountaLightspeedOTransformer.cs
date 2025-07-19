using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.LIGHTSPEED_O_SERIES;
using System;
using System.Data;

namespace EPOS_Integration.Transformers
{
    public class KountaLightspeedOTransformer : BaseTransformer, IDataTransformer
    {
        public void Transform(DataTable integrationData, object data, decimal cashupMainId, Cashup cashup)
        {
            var obj = new EPOS_SALES_LO();
            obj.CashupModelObj = cashup.CashupModelObj;
            obj.TransformLOData(data as DataSet, (int)IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES, ref cashup, integrationData);
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
                cashup.CashupModelObj.ERROR_MESSAGE = "Exception From O Series() Common.--------" + ex.Message.ToString();
                throw;
            }
        }
    }
}
