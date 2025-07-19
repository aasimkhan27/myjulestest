using EPOS_Integration;
//using EPOS_Integration.IIKO;
//using EPOS_Integration.Squirrel;
using Notification;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;

namespace Wenodo_Integration
{
    static class Program
    {
        /// <summary>
        /// The main entry point for the application.
        /// </summary>
        static void Main()
        {
         //   EPOS_Integration_Decision Obj = new EPOS_Integration_Decision();
          //  Obj.GET_CASHUP_MAIN_FOR_INTEGRATION(-1, 0);

            //   var x= ConfigurationManager.ConnectionStrings.Count;

            ServiceBase[] ServicesToRun;
            ServicesToRun = new ServiceBase[]
            {
                new TimerCreation()
            };
            ServiceBase.Run(ServicesToRun);



            // SimphonyIntegrator obj = new SimphonyIntegrator();
            //   obj.stest();


            //Notification_Manager Obj = new Notification_Manager();
            // Ikentoo Obj = new Ikentoo();
            // Obj.GET_CASHUP_MAIN_FOR_INTEGRATION();
            // Notification_Manager Obj = new Notification_Manager();

            // IIKO Obj = new IIKO();
            // Obj.SaveDataToDB();
            //     // DateTime SessionDateTime = Convert.ToDateTime("20-Mar-2021 16:59:59");
      
            //              Obj.GET_CASHUP_MAIN_FOR_INTEGRATION(-1,0);
            // Obj.GET_CASHUP_MAIN_FOR_INTEGRATION(2);
            // Task task = Obj.GetTransaction("https://854-966-482.iikoweb.co.uk/api/auth/login", "Wenodo", "W3n0d0", "2018");
            // task.Wait();

            // Notification_Manager Obj = new Notification_Manager();

            // EPOS_Data_Operations Obj = new EPOS_Data_Operations();
            // Obj.GetDataFromEPOS(new System.Data.DataTable());
        }
    }
}
