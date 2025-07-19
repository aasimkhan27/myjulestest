using App_Repository;
using EPOS_Integration.EPOS_SALES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.MICROS
{
    public class MICROS_EPOS
    {
        public void SaveMicrossDataToDB(DataTable CASHUP_MAIN, DataTable INTEGRATION_DETAILS)
        {
            Cashup Obj = new Cashup();
            int INTEGRATION_STATUS = 0;
            foreach (DataRow dr in CASHUP_MAIN.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                Obj.CashupModelObj.CASHUP_DATE = Convert.ToDateTime(dr["CASHUP_DATE"]);
                Obj.CashupModelObj.USER_ID = 1;

                DataView dv = INTEGRATION_DETAILS.DefaultView;
                dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                DataTable _dtIntegrationData = dv.ToTable();

                DataSet MICROS_DATASET = new DataSet();
                try
                {
                    MICROS_DATASET = Obj.GET_MICROS_DATA_BY_ENTITY_CASHUP_DATE();
                    if (MICROS_DATASET.Tables.Count > 0 && MICROS_DATASET.Tables[0].Rows.Count > 0)
                    {
                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                        transformData.DataTransform(IntegrationSource.MICROS, _dtIntegrationData, MICROS_DATASET, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);

                        INTEGRATION_STATUS = Convert.ToInt32(2);
                        Obj.CashupModelObj.ERROR_MESSAGE = "";
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                    else
                    {
                        INTEGRATION_STATUS = Convert.ToInt32(4);
                        Obj.CashupModelObj.ERROR_MESSAGE = "";
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }
                }
                catch (Exception ex)
                {
                    LogExceptions.LogError("SaveDataToDB - MICROS -" + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                }
                
            }
        }
    }
}
