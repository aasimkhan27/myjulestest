using App_Repository;
using EPOS_Integration.IIKO;
//using EPOS_Integration.LIGHTSPEED_LSERIES;
using EPOS_Integration.LIGHTSPEED_O_SERIES;
using EPOS_Integration.OMEGA;
using EPOS_Integration.SquareUp;
using EPOS_Integration.Tissil_Horizon;
using EPOS_Integration.VitaMojo;
using EPOS_Integration.FOODICS;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels;
using EPOS_Integration.KOBAS;
using static EPOS_Integration.SquareUp.SquareupModel;
using EPOS_Integration.LIGHTSPEED_LSERIES;
using EPOS_Integration.LIOLONDON;
using EPOS_Integration.SYRVE;
using EPOS_Integration.QUADRANET;

namespace EPOS_Integration.EPOS_SALES
{
    /// <summary>
    /// This class is used to transform data from EPOS to Wenodo Structure
    /// </summary>
    class TransformData<T>
    {

        public void DataTransform(IntegrationSource Integration_System_ID, DataTable Integration_Dt, T data, decimal CASHUP_MAIN_ID, Cashup CashupObj)
        {
            //Cashup CashupObj = new Cashup();

            CashupObj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            CashupObj.CashupModelObj.ENTITY_ID = Convert.ToInt32(Integration_Dt.Rows[0]["ENTITY_ID"]);
            CashupObj.CashupModelObj.BRANCH_ID = Convert.ToInt32(Integration_Dt.Rows[0]["BRANCH_ID"]);
            CashupObj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(Integration_Dt.Rows[0]["INTEGRATION_SYSTEM_ID"]);


            switch (Integration_System_ID)
            {
                case IntegrationSource.LightSpeed:
                    {
                        EPOS_Integration.Homestead.EPOS_SALES_IKENTOO<DataSet> Obj = new Homestead.EPOS_SALES_IKENTOO<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_IkentooData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(LightSpeed) Common.--------" + ex.Message.ToString();
                            //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION(); 
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.OMEGA:
                    {
                        TransformOmegaData<Root_Omega> Obj = new TransformOmegaData<Root_Omega>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_OmegaData(data as Root_Omega, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(OMEGA) Common.--------" + ex.Message.ToString();
                            //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.SQUIRREL:
                    {
                        BasicAuth.EPOS_SALES_SQUIRELL<DataSet> Obj = new BasicAuth.EPOS_SALES_SQUIRELL<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_SquirrelData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 6;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 5;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(SQUIRREL) Common.--------" + ex.Message.ToString();
                            //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.SQUAREUP:
                    {
                        EPOS_SALES_SQUAREUP<DataSet> Obj = new EPOS_SALES_SQUAREUP<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_SquareupData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(SQUAREUP) Common.--------" + ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.VITAMOJO:
                    {
                        EPOS_SALES_VITAMOJO<DataSet> Obj = new EPOS_SALES_VITAMOJO<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_VitamojoData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        break;
                    }
                case IntegrationSource.ALOHA:
                    {

                        BasicAuth.EPOS_SALES_ALOHA<DataSet> Obj = new BasicAuth.EPOS_SALES_ALOHA<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_AlohaData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        break;
                    }
                case IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES:
                    {
                        EPOS_SALES_LO Obj = new EPOS_SALES_LO();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        Obj.TransformLOData(data as DataSet, Convert.ToInt32(Integration_System_ID), ref CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From O Series() Common.--------" + ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.TISSL_HORIZON:
                    {

                        EPOS_SALES_TISSIL_HORIZON<DataSet> Obj = new EPOS_SALES_TISSIL_HORIZON<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Tillil_Horizon(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(TISSL_HORIZON) Common.--------" + ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.IIKO:
                    {

                        EPOS_SALES_IIKO<DataSet> Obj = new EPOS_SALES_IIKO<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_IikoData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(IIKO) Common.--------" + ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.KOBAS:
                    {
                        EPOS_SALES_KOBAS Obj = new EPOS_SALES_KOBAS();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        Obj.TransformKobasData(data as DataSet, Convert.ToInt32(Integration_System_ID), ref CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                           //     CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                             //   CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Kobas Common.--------" + ex.Message.ToString();
                            //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.LIGHTSPEED_LS:
                    {
                        EPOS_SALES_LIGHT_SPEED_L_SERIES<DataSet> Obj = new EPOS_SALES_LIGHT_SPEED_L_SERIES<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Light_Speed_L_Series(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;

                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;

                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(Transform_Light_Speed_L_Series) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                case IntegrationSource.FOODICS:
                    {

                        EPOS_SALES_FOODICS<DataSet> Obj = new EPOS_SALES_FOODICS<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Foodics(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                                // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                                //CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(FOODICS) Common.--------" + ex.Message.ToString();
                            // CashupObj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                            throw;
                        }
                        break;
                    }
                case IntegrationSource.SYRVE:
                    {
                        EPOS_SALES_SYRVE<DataSet> Obj = new EPOS_SALES_SYRVE<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Syrve(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;

                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(SYRVE) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                case IntegrationSource.QUADRANET:
                    {
                        EPOS_SALES_QUADRANET<DataSet> Obj = new EPOS_SALES_QUADRANET<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Quadranet(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;

                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(QUADRANET) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                case IntegrationSource.TOAST:
                    {
                        EPOS_Integration.TOAST.EPOS_SALES_TOAST<DataSet> Obj = new TOAST.EPOS_SALES_TOAST<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_ToastData(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(TOAST) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                case IntegrationSource.MICROS:
                    {
                        EPOS_Integration.MICROS.EPOS_SALES_MICROS<DataSet> Obj = new MICROS.EPOS_SALES_MICROS<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Micros(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(EPOS_SALES_MICROS) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                case IntegrationSource.SYMPHONY:
                    {
                        EPOS_Integration.SIMPHONY.EPOS_SALES_SIMPHONY<DataSet> Obj = new SIMPHONY.EPOS_SALES_SIMPHONY<DataSet>();
                        Obj.CashupModelObj = CashupObj.CashupModelObj;
                        CashupObj.CashupModelObj = Obj.Transform_Symphony(data as DataSet, Convert.ToInt32(Integration_System_ID), CashupObj, Integration_Dt);
                        try
                        {
                            if (CashupObj.CashupModelObj.EPOS_SALES_HEADER.Rows.Count > 0)
                            {
                                CashupObj.INS_UPD_EPOS_SALES();
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 2;
                            }
                            else
                            {
                                CashupObj.CashupModelObj.INTEGRATION_STATUS = 4;
                            }
                        }
                        catch (Exception ex)
                        {
                            CashupObj.CashupModelObj.INTEGRATION_STATUS = 3;
                            CashupObj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos_Sales(EPOS_SALES_MICROS) Common.--------" + ex.Message.ToString();

                            throw;
                        }
                        break;
                    }
                default:
                    {
                        break;
                    }
            }
        }
    }
}
