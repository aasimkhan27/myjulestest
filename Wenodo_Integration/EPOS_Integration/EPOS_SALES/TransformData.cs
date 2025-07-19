using App_Repository;
using EPOS_Integration.Common;
using System;
using System.Data;

namespace EPOS_Integration.EPOS_SALES
{
    public class TransformData<T>
    {
        private readonly DataTransformerFactory _factory;

        public TransformData()
        {
            _factory = new DataTransformerFactory();
        }

        public void DataTransform(IntegrationSource integrationSystemId, DataTable integrationDt, T data, decimal cashupMainId, Cashup cashupObj)
        {
            cashupObj.CashupModelObj.CASHUP_MAIN_ID = cashupMainId;
            cashupObj.CashupModelObj.ENTITY_ID = Convert.ToInt32(integrationDt.Rows[0]["ENTITY_ID"]);
            cashupObj.CashupModelObj.BRANCH_ID = Convert.ToInt32(integrationDt.Rows[0]["BRANCH_ID"]);
            cashupObj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(integrationDt.Rows[0]["INTEGRATION_SYSTEM_ID"]);

            var transformer = _factory.GetTransformer(integrationSystemId);
            transformer.Transform(integrationDt, data, cashupMainId, cashupObj);
        }
    }
}
