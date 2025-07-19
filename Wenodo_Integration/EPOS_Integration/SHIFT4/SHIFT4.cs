using App_Repository;
using EPOS_Integration.Common;
using EPOS_Integration.EPOS_SALES;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.SHIFT4
{
    public class SHIFT4
    {

        public void SaveDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(dr["ENTITY_ID"]);
                Obj.CashupModelObj.USER_ID = 1;
                //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                foreach (DataRow dr_session in dt_Session.Select("SESSION_MASTER_ID=4").CopyToDataTable().Rows)
                {
                    Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                    string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                    string[] timelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                    int start_hr = Convert.ToInt32(timelist[0]);
                    timelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                    int end_hr = Convert.ToInt32(timelist[0]);
                    int variance = start_hr - end_hr;
                    DateTime Cashup_date_new = DateTime.Now;
                    if (variance == 0 || variance > 0)
                    {
                        Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                    }
                    else
                    {
                        Cashup_date_new = Convert.ToDateTime(Cashup_date);
                    }
                    string Cashup_start_date = Cashup_date + "T00:00:00";
                    string Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);

                    DataView dv = dt_IntegrationDetails.DefaultView;
                    dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                    DataTable dtIntegrationData = dv.ToTable();
                    DataSet SHIFT4DS = null;
                    Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]);
                    Obj.CashupModelObj.CASHUP_START_DATE = Cashup_start_date;
                    Obj.CashupModelObj.CASHUP_END_DATE = Cashup_end_date;

                    try
                    {
                        SHIFT4DS = FetchFinancialDataByTime(Cashup_start_date, Cashup_end_date, dtIntegrationData, Obj);
                    }
                    catch (Exception ex)
                    {
                        LogExceptions.LogError("SaveDataToDB - SHIFT4DS - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                        Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        Obj.CashupModelObj.ERROR_MESSAGE = "Exception From Epos Main.--------\n" + "Exception - OMEGA - start_date:-" + Cashup_start_date + " , end_date:-" + Cashup_end_date + " , ID:-" + Convert.ToDecimal(dr["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(dr["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    }

                }
            }
        }
        DataSet FetchFinancialDataByTime(string Start_date, string End_date, DataTable dtIntegrationData, Cashup _ICashUp)
        {
            string CLIENT_ID = "408554114fd141f1bc2ee53918c38410";
            string CLIENT_SECRET = "1095d063-0cc2-4594-97ed-3166dd471a50";
            long unixTimestamp = DateTimeOffset.Now.ToUnixTimeSeconds();
            string requestMethod = "GET";
            string requestPath = "/pos/v2/10374/tickets";
            string requestData = "";
            string HMAC = "";

            string combinedString = CLIENT_ID + requestMethod + requestPath + requestData + unixTimestamp;

            byte[] keyBytes = Encoding.UTF8.GetBytes(CLIENT_SECRET);
            byte[] messageBytes = Encoding.UTF8.GetBytes(combinedString);


            using (HMACSHA256 hmac = new HMACSHA256(keyBytes))
            {
                byte[] hashBytes = hmac.ComputeHash(messageBytes);
                HMAC = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
        
            var client = new RestClient();
            var request = new RestRequest("https://conecto-api-sandbox.shift4payments.com/pos/v2/10374/tickets?filter[dateTimeFrom]=" + Start_date + "&filter[dateTimeTo]=" + End_date , Method.GET);
            request.AddHeader("x-access-key", "408554114fd141f1bc2ee53918c38410");
            request.AddHeader("x-timestamp", unixTimestamp.ToString());
            request.AddHeader("x-signature", HMAC);
            request.AddHeader("Content-Type", "application/json");
            IRestResponse response = client.Execute(request);
            return null;
        }
    }
}
