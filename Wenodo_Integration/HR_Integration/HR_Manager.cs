using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using EPOS_Integration;
using Utility;
using HR_Integration.FarmGirl;
using HR_Integration.Kobas;
namespace HR_Integration
{
    public class HR_Manager
    {

        public HR_Manager(int INTEGRATION_SYSTEM_ID, int INTEGRATION_TYPE_ID)
        {
            HR_Repository HRDBobj = new HR_Repository();
            //HR_Model Hrobj = new HR_Model();
            //Hrobj.INTEGRATION_SYSTEM_ID = INTEGRATION_SYSTEM_ID;
            // Hrobj.INTEGRATION_TYPE_ID = INTEGRATION_TYPE_ID;

            DataTable dt = HRDBobj.GET_INTEGRATION_DETAILS(INTEGRATION_SYSTEM_ID);
            dt = dt.Select("INTEGRATION_TYPE_ID=4").CopyToDataTable();
            foreach (DataRow dr in dt.Rows)
            {
                //Utility.LogExceptions.LogInfo("INFO: Foreach-> start Call Start");
                try
                {
                    RunIntegration(dt, INTEGRATION_SYSTEM_ID, HRDBobj, INTEGRATION_TYPE_ID);
                }
                catch (Exception ex)
                {
                    Utility.LogExceptions.LogInfo(ex.Message.ToString());
                    HR_Repository Obj = new HR_Repository();

                    Obj.HR_Modelobj = new HR_Model();
                    // Obj.HR_Modelobj.TABLE_ID = Convert.ToInt32(dr["SYSTEM_NOTIFICATIONS_ID"]);
                    //                    Obj.HR_Modelobj.STATUS_ID = 3;
                    Obj.HR_Modelobj.EMAIL_ERROR = ex.Message.ToString();
                    Obj.UPD_NTFCTN_FOR_SRVC();

                }
            }
        }
        public void RunIntegration(DataTable dt, int INTEGRATION_SYSTEM_ID, HR_Repository HRDBobj, int INTEGRATION_TYPE_ID)
        {
            if (Convert.ToInt32(IntegrationSource.FARM_GIRL) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total farm girl-" + dt.Rows.Count);
                    Farm_Girl Obj = new Farm_Girl();
                    Obj.SaveFirmGirlDataToDB(dt);
                }
            }
            if (Convert.ToInt32(IntegrationSource.KOBAS) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Kobas Hr-" + dt.Rows.Count);
                    KobasHr Obj = new KobasHr();
                    Obj.fetchKobasDataToAPI(dt);
                }
            }
            if (Convert.ToInt32(IntegrationSource.S4LABOUR) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total S4LABOUR Hr-" + dt.Rows.Count);
                    S4Labour.S4Labour s4Labour = new S4Labour.S4Labour();
                    s4Labour.S4LabourFetchData(dt);
                }
            }
        }
    }
}