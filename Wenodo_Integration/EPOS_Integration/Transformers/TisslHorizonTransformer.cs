using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.Tissil_Horizon;
using System;
using System.Data;

namespace EPOS_Integration.Transformers
{
    public class TisslHorizonTransformer : BaseTransformer, IDataTransformer
    {
        public void Transform(DataTable integrationData, object data, decimal cashupMainId, Cashup cashup)
        {
            var obj = new EPOS_SALES_TISSIL_HORIZON<DataSet>();
            obj.CashupModelObj = cashup.CashupModelObj;
            cashup.CashupModelObj = obj.Transform_Tillil_Horizon(data as DataSet, (int)IntegrationSource.TISSL_HORIZON, cashup, integrationData);
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
                cashup.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(TISSL_HORIZON) Common.--------" + ex.Message.ToString();
                throw;
            }
        }
    }
}
