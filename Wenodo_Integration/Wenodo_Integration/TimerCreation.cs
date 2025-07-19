
using EPOS_Integration;
using HR_Integration;

using Notification;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.ServiceProcess;
using System.Timers;
using System.Web;
using Utility;

namespace Wenodo_Integration
{
    public partial class TimerCreation : ServiceBase
    {

        private Timer Main_timer;
       // private Timer tRuntime;
        string Main_Timer_Interval = ConfigurationManager.AppSettings["Timer_Interval"].ToString();
        public TimerCreation()
        {
            InitializeComponent();
            LogExceptions.LogInfo("Setting Timer: " + Main_Timer_Interval);
            Main_timer = new Timer(Convert.ToDouble(Main_Timer_Interval));  //30000 milliseconds = 30 seconds            
            Main_timer.Elapsed += new ElapsedEventHandler(Main_timer_Elasped_Tick);
        }
        protected override void OnStart(string[] args)
        {
            LogExceptions.LogInfo("Main_timer Started");
            Main_timer.AutoReset = true;
            Main_timer.Enabled = true;
            Main_timer.Start();
        }
        protected override void OnStop()
        {
            LogExceptions.LogInfo("Main_timer Stopped");
        }
        private void Main_timer_Elasped_Tick(object sender, ElapsedEventArgs e)
        {
            this.Main_timer.Stop();
            this.Main_timer.Dispose();
            LogExceptions.LogInfo("Service Running Smoothly: Main Timer Started.");
            
            //foreach (ConnectionStringSettings conString in ConfigurationManager.ConnectionStrings)
            {
                
                Timer t1;

                #region EMAIL_TIMER_SETUP
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["Notification_Enable"].ToString()))
                {                    
                    Timer tNotification = new Timer();
                    tNotification.Interval = Convert.ToDouble(ConfigurationManager.AppSettings["Notification_Interval"].ToString());
                    tNotification.Elapsed += (s, ea) => Send_WENODO_Notification(sender, e);
                    tNotification.Start();                    
                }
                #endregion                

                #region EPOS_TIMER_SETUP RUNTIME FETCH
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_RUNTIME"].ToString()))
                {
                    Timer tRuntime = new Timer();
                    tRuntime.Interval = Convert.ToDouble(ConfigurationManager.AppSettings["EPOS_Interval_RUNTIME"].ToString());
                    tRuntime.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.RUNTIME), 0, "", tRuntime);
                    tRuntime.AutoReset = false;
                    tRuntime.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP ONCE A DAY FETCH
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_ENABLE_DAY"].ToString()))
                {
                    Timer tDAY = new Timer();
                    tDAY.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_INTERVAL_DAY"].ToString());
                    tDAY.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.ONCE_A_DAY), 0, ConfigurationManager.AppSettings["EPOS_INTERVAL_DAY"].ToString(), tDAY);
                    tDAY.AutoReset = false;
                    tDAY.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP LIGHTSPEED K Series
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_IKENTOO"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_IKENTOO"].ToString());
                    //t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.LightSpeed), 0);
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.LightSpeed), 0, ConfigurationManager.AppSettings["EPOS_Interval_IKENTOO"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP IIKO
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_IIKO"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_IIKO"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.IIKO), 0, ConfigurationManager.AppSettings["EPOS_Interval_IIKO"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP SQUIRREL
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_SQUIRREL"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_SQUIRREL"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.SQUIRREL), 0, ConfigurationManager.AppSettings["EPOS_Interval_SQUIRREL"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP ALOHA                
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_ALOHA"].ToString()))
                {
                    Timer tAloha = new Timer();
                    double miliseconds = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_ALOHA"].ToString());
                    LogExceptions.LogInfo("EPOS_Interval_ALOHA" + miliseconds);
                    tAloha.Interval = miliseconds;//GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_ALOHA"].ToString());
                    tAloha.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.ALOHA), 0, ConfigurationManager.AppSettings["EPOS_Interval_ALOHA"].ToString(), tAloha);
                    tAloha.AutoReset=false;
                    tAloha.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP VITAMOJO
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_VITAMOJO"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_VITAMOJO"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.VITAMOJO), 0, ConfigurationManager.AppSettings["EPOS_Interval_VITAMOJO"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_TIMER_SETUP OMEGA
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_OMEGA"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_OMEGA"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.OMEGA), 0, ConfigurationManager.AppSettings["EPOS_Interval_OMEGA"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_Enable_LSL_SERIES  L Series
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_LSL_SERIES"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_LSL_SERIES"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 0, ConfigurationManager.AppSettings["EPOS_Interval_LSL_SERIES"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_LSERIES_PRODUCT"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_LSERIES_PRODUCT"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.LIGHTSPEED_LS), 8, ConfigurationManager.AppSettings["EPOS_Interval_LSERIES_PRODUCT"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion 

                #region EPOS_TIMER_SETUP SQUAREUP
                //if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_SQUAREUP_PRODUCT"].ToString()))
                //{
                //    t1 = new Timer();
                //    t1.Interval = Convert.ToDouble(ConfigurationManager.AppSettings["EPOS_Interval_SQUAREUP_PRODUCT"].ToString());
                //    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.SQUAREUP), 8);
                //    t1.Start();
                //}

                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_SQUAREUP"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_SQUAREUP"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.SQUAREUP), 0, ConfigurationManager.AppSettings["EPOS_Interval_SQUAREUP"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS TISSL_HORIZON
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_TISSL_HORIZON"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_TISSL_HORIZON"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.TISSL_HORIZON), 0, ConfigurationManager.AppSettings["EPOS_Interval_TISSL_HORIZON"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_MARKETMAN
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_MARKETMAN"].ToString()))

                {
 
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_MARKETMAN"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.TISSL_HORIZON), 0, ConfigurationManager.AppSettings["EPOS_Interval_MARKETMAN"].ToString(), t1);
                    t1.Start();

                }
 
                #endregion

                #region EPOS ICG
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_ICG"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_ICG"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.ICG), 0, ConfigurationManager.AppSettings["EPOS_Interval_ICG"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS_Enable_ICG_PRODUCT
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_ICG_PRODUCT"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_ICG_PRODUCT"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.ICG), 8, ConfigurationManager.AppSettings["EPOS_Interval_ICG_PRODUCT"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS ITB
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_ITB"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_ITB"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.ITB), 0, ConfigurationManager.AppSettings["EPOS_Interval_ITB"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                #region EPOS KOBAS
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_KOBAS"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_KOBAS"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.KOBAS), 0, ConfigurationManager.AppSettings["EPOS_Interval_KOBAS"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion 

                #region HR Harri
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["HR_Enable_HARRI"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = Convert.ToDouble(ConfigurationManager.AppSettings["HR_Interval_HARRI"].ToString());
                    t1.Elapsed += (s, ea) => HR_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.FARM_GIRL), 0);
                    t1.Start();
                    LogExceptions.LogInfo("HR_Interval_HARRI: timer.");
                }
                #endregion

                #region EPOS KOUNTA O Series Lightspeed

                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_KOUNTA"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_KOUNTA"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.KOUNTA_LIGHTSPEED_O_SERIES), 0, ConfigurationManager.AppSettings["EPOS_Interval_KOUNTA"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }

                #endregion

                #region EPOS Simphony

                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Symphony"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Symphony"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.SIMPHONY), 0, ConfigurationManager.AppSettings["EPOS_Interval_Symphony"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }

                #endregion

                #region FOODICS
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Foodics"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Foodics"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.FOODICS), 0, ConfigurationManager.AppSettings["EPOS_Interval_Foodics"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #endregion

                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Quadranet"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Quadranet"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.QUADRANET), 0, ConfigurationManager.AppSettings["EPOS_Interval_Quadranet"].ToString(), t1);
                    t1.AutoReset = false;
                    t1.Start();
                }
                #region SYRVE
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Syrve"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Syrve"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.SYRVE), 0, ConfigurationManager.AppSettings["EPOS_Interval_Syrve"].ToString(), t1);
                    t1.Start();
                }
                #endregion
                #region TOAST
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Toast"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Toast"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.TOAST), 0, ConfigurationManager.AppSettings["EPOS_Interval_Toast"].ToString(), t1);
                    t1.Start();
                }
                #endregion

                #region MICROSS
                if (Convert.ToBoolean(ConfigurationManager.AppSettings["EPOS_Enable_Micross"].ToString()))
                {
                    t1 = new Timer();
                    t1.Interval = GetMilliseconds(ConfigurationManager.AppSettings["EPOS_Interval_Micross"].ToString());
                    t1.Elapsed += (s, ea) => EPOS_Integration_Process(sender, e, Convert.ToInt32(IntegrationSource.MICROS), 0, ConfigurationManager.AppSettings["EPOS_Interval_Micross"].ToString(), t1);
                    t1.Start();
                }
                #endregion
            }
            LogExceptions.LogInfo("Service Running Smoothly: Main TImer End.");
            // this.Main_timer.Start();
        }
        private void Send_WENODO_Notification(object sender, ElapsedEventArgs e)
        {
            //LogExceptions.LogInfo("Function Send_WENODO_Notification");
            Timer tx = (Timer)sender;
            tx.Stop();
            Notification_Manager Obj = new Notification_Manager();
            tx.Start();
            //LogExceptions.LogInfo("Function Send_WENODO_Notification");
        }
        private void EPOS_Integration_Process(object sender, ElapsedEventArgs e, int INTEGRATION_SYSTEM_ID, int INTEGRATION_TYPE_ID, string runtime, Timer ExecutionTimer)
        {

            ExecutionTimer.Stop();
            LogExceptions.LogInfo("Pick Sales Data for INTEGRATION_SYSTEM_ID:" + INTEGRATION_SYSTEM_ID);
            EPOS_Integration_Decision Obj = new EPOS_Integration_Decision();
            Obj.GET_CASHUP_MAIN_FOR_INTEGRATION(INTEGRATION_SYSTEM_ID, INTEGRATION_TYPE_ID);

            if (INTEGRATION_SYSTEM_ID != -1)
            {
                double milisecs = GetMilliseconds(runtime);
                LogExceptions.LogInfo("Next Milliseconds:" + milisecs);
                ExecutionTimer.Interval = milisecs;
            }          
            ExecutionTimer.AutoReset = false;
            ExecutionTimer.Start();
        }
        private void HR_Integration_Process(object sender, ElapsedEventArgs e, int INTEGRATION_SYSTEM_ID, int INTEGRATION_TYPE_ID)
        {
            Timer tx = (Timer)sender;
            tx.Stop();
            LogExceptions.LogInfo("PickHR Data for INTEGRATION_SYSTEM_ID-" + INTEGRATION_SYSTEM_ID);
            HR_Manager Obj = new HR_Manager(INTEGRATION_SYSTEM_ID, INTEGRATION_TYPE_ID);
            tx.Start();
        }
        static double GetMilliseconds(string runtime)
        {
            int hour = 0;
            int minute = 0;
            // Add day or not : if the string contains AM then add one day else nothing
            if (runtime.IndexOf("AM") != -1)
            {
                runtime = runtime.Replace(" AM", "");
                var x = runtime.Split(':');
                hour = Convert.ToInt32(x[0]) > 11 ? Convert.ToInt32(x[0]) - 12 : Convert.ToInt32(x[0]);
                minute = Convert.ToInt32(x[1]);
            }
            else
            {
                runtime = runtime.Replace(" PM", "");
                var x = runtime.Split(':');
                hour = Convert.ToInt32(x[0]) <= 11 ? Convert.ToInt32(x[0]) + 12 : Convert.ToInt32(x[0]);
                minute = Convert.ToInt32(x[1]);
            }
            DateTime rundate = DateTime.Now;
            rundate = new DateTime(
                                               rundate.Year,
                                               rundate.Month,
                                               rundate.Day,
                                               hour,
                                               minute,
                                               00,
                                               00,
                                               rundate.Kind);

            if (rundate < DateTime.Now)
            {
                rundate = rundate.AddDays(1);
            }
            TimeSpan span = rundate - DateTime.Now;
            return span.TotalMilliseconds;
        }
    }

}
