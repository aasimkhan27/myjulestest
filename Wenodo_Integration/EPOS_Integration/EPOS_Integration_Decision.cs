using App_Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPOS_Integration.IIKO;
using EPOS_Integration.LightSpeed;
using ViewModels;
using Utility;
using EPOS_Integration.Squirrel;
using EPOS_Integration.Aloha;
using EPOS_Integration.VitaMojo;
using EPOS_Integration.OMEGA;
using EPOS_Integration.LIGHTSPEED_LSERIES;
using EPOS_Integration.ITB;
using EPOS_Integration.LIGHTSPEED_O_SERIES;
using EPOS_Integration.Omnivore.MicrosFirstEdition;
using EPOS_Integration;

namespace EPOS_Integration
{
    public class EPOS_Integration_Decision
    {
        public void GET_CASHUP_MAIN_FOR_INTEGRATION(int INTEGRATION_SYSTEM_ID, int INTEGRATION_TYPE_ID)
        {
            try
            {
                Cashup Cashup_Obj = new Cashup();
                Cashup_Obj.CashupModelObj = new CashupModel();
                Cashup_Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = INTEGRATION_SYSTEM_ID;
                DataTable dt = new DataTable();
                if (INTEGRATION_TYPE_ID != 8)
                {
                    if (Cashup_Obj.CashupModelObj.INTEGRATION_SYSTEM_ID == Convert.ToInt32(IntegrationSource.MARKETMAN))
                    {
                        LogExceptions.LogInfo("MarketMan Outbound Data Fetch");
                        dt = Cashup_Obj.GET_CASHUP_MAIN_FOR_MRKTMN_OUTBUND_INTEGRATION();
                    }
                    else
                    {
                        dt = Cashup_Obj.GET_CASHUP_MAIN_FOR_INTEGRATION();
                        LogExceptions.LogInfo("Total Records from DB: "+ dt.Rows.Count);
                    }
                }
                DataTable dt_IntegrationSystemID = new DataTable();
                if (INTEGRATION_SYSTEM_ID == Convert.ToInt32(IntegrationSource.RUNTIME) || INTEGRATION_SYSTEM_ID == Convert.ToInt32(IntegrationSource.ONCE_A_DAY))
                {
                    if (dt.Rows.Count > 0)
                    {
                        dt_IntegrationSystemID = dt.DefaultView.ToTable(true, "INTEGRATION_SYSTEM_ID");
                        LogExceptions.LogInfo("Total IntegrationSystemIDs: " + dt_IntegrationSystemID.Rows.Count);
                        foreach (DataRow dr in dt_IntegrationSystemID.Rows)
                        {
                            DataTable tblFiltered = dt.AsEnumerable()
                            .Where(row => row.Field<int>("INTEGRATION_SYSTEM_ID") == Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"])).CopyToDataTable();
                            Cashup_Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]);
                            RunIntegration(tblFiltered, Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]), Cashup_Obj, INTEGRATION_TYPE_ID);
                        }
                    }
                }
                else
                {
                    RunIntegration(dt, INTEGRATION_SYSTEM_ID, Cashup_Obj, INTEGRATION_TYPE_ID);
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("GET_CASHUP_MAIN_FOR_INTEGRATION", ex);
            }
        }
        public void RunIntegration(DataTable dt, int INTEGRATION_SYSTEM_ID, Cashup Cashup_Obj, int INTEGRATION_TYPE_ID)
        {
            DataTable dt_IntegrationDetails = Cashup_Obj.GET_INTEGRATION_DETAILS();
            if (Convert.ToInt32(IntegrationSource.LightSpeed) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records Ikentoo-" + dt.Rows.Count);
                    Ikentoo Obj = new Ikentoo();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.IIKO) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records IIKO-" + dt.Rows.Count);
                    IIKO_INT Obj = new IIKO_INT();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.SQUIRREL) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records SQUIRREL-" + dt.Rows.Count);
                    SQUIRELL_EPOS Obj = new SQUIRELL_EPOS();
                    Obj.GetDataFromEPOS(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.ALOHA) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records ALOHA-" + dt.Rows.Count);
                    ALOHA_EPOS Obj = new ALOHA_EPOS();
                    Obj.GetDataFromEPOS(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.VITAMOJO) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records VITAMOJO-" + dt.Rows.Count);
                    VitaMojo_EPOS Obj = new VitaMojo_EPOS();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.OMEGA) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records OMEGA-" + dt.Rows.Count);
                    OMEGA_EPOS Obj = new OMEGA_EPOS();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS) == INTEGRATION_SYSTEM_ID)
            {
                if (INTEGRATION_TYPE_ID == 8)
                {
                    //save product
                    LogExceptions.LogInfo("SaveLSeriesDataToDBProduct Light Speed LSeries-" + INTEGRATION_TYPE_ID);
                    LSeries Obj = new LSeries();
                    Obj.SaveLSeriesDataToDBProduct(dt_IntegrationDetails);
                }
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records Light Speed LSeries-" + dt.Rows.Count);
                    LSeries Obj = new LSeries();
                    Obj.SaveLSeriesDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.OMNIVORE_MICROS_FA) == INTEGRATION_SYSTEM_ID)
            {

                //double timestamp = 1657706646;
                //DateTime start = new DateTime(1970, 1, 1, 0, 0, 0, 0); //from start epoch time
                //start = start.AddSeconds(timestamp); //add the seconds to the start DateTime

                if (dt.Rows.Count > 0)
                {
                    LogExceptions.LogInfo("Total Records Omnivor micros FE-" + dt.Rows.Count);
                    MicrosFE Obj = new MicrosFE();
                    Obj.SaveLSeriesDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.SQUAREUP) == INTEGRATION_SYSTEM_ID)
            {
                //if (INTEGRATION_TYPE_ID == 8)
                //{
                //    LogExceptions.LogInfo("Total Records SquareUp Product-" + dt.Rows.Count);
                //    EPOS_Integration.SquareUp.Squareup Obj = new EPOS_Integration.SquareUp.Squareup();
                //    Obj.SaveSquareupDataToDBCategory(dt_IntegrationDetails);
                //}
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records SquareUp Orders --" + dt.Rows.Count);
                    EPOS_Integration.SquareUp.Squareup Obj = new EPOS_Integration.SquareUp.Squareup();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.MARKETMAN) == INTEGRATION_SYSTEM_ID)
            {
                LogExceptions.LogInfo("Total Records Push_MM_Sales_Data-" + dt.Rows.Count);
                foreach (DataRow dr in dt.Rows)
                {
                    EPOS_Integration.MM_SALESDATA.MM_Sales_Data Obj_MM_SalesData = new EPOS_Integration.MM_SALESDATA.MM_Sales_Data();
                    Obj_MM_SalesData.Push_MM_Sales_Data(Convert.ToInt32(dr["ENTITY_ID"]), Convert.ToInt32(dr["BRANCH_ID"]), Convert.ToDecimal(dr["ID"]), true, dr, Convert.ToDateTime(dr["CASHUP_DATE"]));
                }
            }
            else if (Convert.ToInt32(IntegrationSource.TISSL_HORIZON) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0)
                {
                    //LogExceptions.LogInfo("Total Records TISSL_HORIZON-" + dt.Rows.Count);
                    TISSL_HORIZON.TISSL_HORIZON Obj = new TISSL_HORIZON.TISSL_HORIZON();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.ICG) == INTEGRATION_SYSTEM_ID)
            {
                if (INTEGRATION_TYPE_ID == 8)
                {
                    LogExceptions.LogInfo("Total Records ICG Product-" + dt_IntegrationDetails.Rows.Count);
                    LIOLONDON.LioLondon Obj = new LIOLONDON.LioLondon();
                    Obj.SaveItemsDataToDB(dt_IntegrationDetails);
                }
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records ICG -" + dt.Rows.Count);
                    LIOLONDON.LioLondon Obj = new LIOLONDON.LioLondon();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.ITB) == INTEGRATION_SYSTEM_ID)
            {
                //    if (INTEGRATION_TYPE_ID == 8)
                //    {
                //        LogExceptions.LogInfo("Total Records ITB Product-" + dt_IntegrationDetails.Rows.Count);
                //        LIOLONDON.LioLondon Obj = new LIOLONDON.LioLondon();
                //        Obj.SaveItemsDataToDB(dt_IntegrationDetails);
                //    }
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records ITB -" + dt.Rows.Count);
                    ITB.ITB Obj = new ITB.ITB();
                    Obj.SaveITBDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.KOBAS) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records KOBAS -" + dt.Rows.Count);
                    KOBAS.KOBAS Obj = new KOBAS.KOBAS();
                    Obj.SaveKboasDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records KOUNTA -" + dt.Rows.Count);
                    LIGHTSPEED_O_SERIES.LO_Series Obj = new LIGHTSPEED_O_SERIES.LO_Series();
                    Obj.SaveLOSSeriesDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.SIMPHONY) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records SIMPHONY -" + dt.Rows.Count);
                    SIMPHONY.Simphony Obj = new SIMPHONY.Simphony();
                    Obj.Fetch_Simphony_Data(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.FOODICS) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records Fetch_Foodics_Data -" + dt.Rows.Count);
                    EPOS_Integration.FOODICS.Foodics Obj = new EPOS_Integration.FOODICS.Foodics();
                    Obj.Fetch_Foodics_Data(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.SYRVE) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records SYRVE -" + dt.Rows.Count);
                    SYRVE.SYRVE Obj = new SYRVE.SYRVE();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.QUADRANET) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records SYRVE -" + dt.Rows.Count);
                    QUADRANET.QUADRANET Obj = new QUADRANET.QUADRANET();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.MICROS) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records MICROSS -" + dt.Rows.Count);
                    MICROS.MICROS_EPOS Obj = new MICROS.MICROS_EPOS();
                    Obj.SaveMicrossDataToDB(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.TOAST) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records TOAST -" + dt.Rows.Count);
                    TOAST.TOAST Obj = new TOAST.TOAST();
                    Obj.GetToastSalesData(dt, dt_IntegrationDetails);
                }
            }
            else if (Convert.ToInt32(IntegrationSource.SHIFT4) == INTEGRATION_SYSTEM_ID)
            {
                if (dt.Rows.Count > 0 && INTEGRATION_TYPE_ID == 0)
                {
                    LogExceptions.LogInfo("Total Records SHIFT4 -" + dt.Rows.Count);
                    SHIFT4.SHIFT4 Obj = new SHIFT4.SHIFT4();
                    Obj.SaveDataToDB(dt, dt_IntegrationDetails);
                }
            }
        }

    }
}
