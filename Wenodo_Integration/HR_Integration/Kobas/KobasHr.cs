using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.IO;
using Utility;
using System.Globalization;
using System.Net;
//using Newtonsoft.Json;
using RestSharp;
using System.Collections.Specialized;
using Newtonsoft.Json;

namespace HR_Integration.Kobas
{
    public class KobasHr
    {
        string LOSURL = string.Empty;
        string AccessToken = string.Empty;
        DataTable GlobleDatatable = new DataTable();

        DataTable KOBAS_ROLE_FIELDS()
        {
            DataTable KOBAS_STAFF_ROLES_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("STAFF_ROLE_ID", typeof(int)); KOBAS_STAFF_ROLES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRANCHISEE_ID", typeof(int)); KOBAS_STAFF_ROLES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); KOBAS_STAFF_ROLES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CATEGORY", typeof(string)); KOBAS_STAFF_ROLES_TYPE.Columns.Add(COLUMN_HEADER);
            return KOBAS_STAFF_ROLES_TYPE;
        }
        DataTable KOBAS_VENUE_TYPE_FIELDS()
        {
            DataTable KOBAS_VENUE_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("VENUE_ID", typeof(int)); KOBAS_VENUE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PARENT_ID", typeof(int)); KOBAS_VENUE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_PARENT", typeof(int)); KOBAS_VENUE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); KOBAS_VENUE_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("S_NAME", typeof(string)); KOBAS_VENUE_TYPE.Columns.Add(COLUMN_HEADER);
            return KOBAS_VENUE_TYPE;
        }
        DataTable KOBAS_STAFF_SHIFT_TYPE_FIELDS()
        {
            DataTable KOBAS_STAFF_SHIFT_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("SHIFT_ID", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE_ID", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHARGE_VENUE_ID", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ROLE_ID", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DATE", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("START_TIME", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("END_TIME", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MINUTES_ROSTERED", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HOURS_ROSTERED", typeof(decimal)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MINUTES_ON_BREAK", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MINUTES_WORKED", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HOURS_WORKED", typeof(decimal)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("APPROVED", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_IN", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIME_OUT", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIPS", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HOURS_TRAINING", typeof(string)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_CLOCKED_IN", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HAS_BREAK", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_HOLIDAY", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_DAY_OFF", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_COVER_SHIFT", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("M_DATE", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("C_DATE", typeof(DateTime)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("HOLIDAY_AMOUNT_OF_DAY", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STAFF_ID", typeof(int)); KOBAS_STAFF_SHIFT_TYPE.Columns.Add(COLUMN_HEADER);
            return KOBAS_STAFF_SHIFT_TYPE;
        }
        DataTable KOBAS_STAFF_TYPE_FIELDS()
        {
            DataTable KOBAS_STAFF_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("STAFF_ID", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FRANCHISEE_ID", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VENUE_ID", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TITLE", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIRST_NAME", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SURNAME", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GENDER", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMAIL", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TELEPHONE", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MOBILE", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DOB", typeof(DateTime)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("START_DATE", typeof(DateTime)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("END_DATE", typeof(DateTime)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LEVEL_ID", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEFAULT_ROLE_ID", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IS_CURRENT_EMPLOYEE", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MARKETING_CONSENT", typeof(int)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("M_DATE", typeof(DateTime)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("C_DATE", typeof(DateTime)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CAN_EXPORT_SALARY_DATA", typeof(string)); KOBAS_STAFF_TYPE.Columns.Add(COLUMN_HEADER);
            return KOBAS_STAFF_TYPE;
        }

        public void fetchKobasDataToAPI(DataTable dt_IntegrationDetails)
        {
            GlobleDatatable = dt_IntegrationDetails.Select("INTEGRATION_TYPE_ID=4").CopyToDataTable();

            DataSet Kobads = new DataSet();
            string[] stringSeparators = new string[] { ":;:" };
            HR_Model HR_Model_Obj = new HR_Model();
            HR_Repository DB_Obj = new HR_Repository();
            string[] str = dt_IntegrationDetails.Rows[0]["URL_PATH"].ToString().Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            string JsonRole = ""; string Jsonstaff = ""; string JsonShift = "";

            try
            {
                foreach (DataRow drrowIntegration in GlobleDatatable.Rows)
                {
                    DataTable DT_VENUE = KOBAS_VENUE_TYPE_FIELDS();
                    DataTable DT_ROLE = KOBAS_ROLE_FIELDS();
                    DataTable DT_STAFF = KOBAS_STAFF_TYPE_FIELDS();
                    DataTable DT_STAFF_SHFIT = KOBAS_STAFF_SHIFT_TYPE_FIELDS();

                    List<VenueRoot> Venueobj = new List<VenueRoot>();
                    DataTable Venue = new DataTable();
                    JsonRole = retrieveKobasVenueDetails(GlobleDatatable, drrowIntegration);
                    Venueobj = JsonConvert.DeserializeObject<List<VenueRoot>>(JsonRole.ToString());
                    Venue = KOBAS_STAFF_VENUE_DT(Venueobj, DT_VENUE);


                    List<KobasStaffRoleRoot> StaffRoleobj = new List<KobasStaffRoleRoot>();
                    DataTable Role = new DataTable();
                    JsonRole = retrieveKobasRollDetails(GlobleDatatable, drrowIntegration);
                    StaffRoleobj = JsonConvert.DeserializeObject<List<KobasStaffRoleRoot>>(JsonRole.ToString());
                    Role = KOBAS_STAFF_ROLE_DT(StaffRoleobj, DT_ROLE);

                    DataTable Staff = new DataTable();
                    KobasStaffRoot Staffobj = new KobasStaffRoot();
                    List<KobasStaff> KobasStaff = new List<KobasStaff>();
                    int StaffLimit = 50;
                    int Staffoffset = 0;

                    for (int Recordi = 0; Recordi < 10000; Recordi++)
                    {
                        Jsonstaff = retrieveKobasstaffDetails(GlobleDatatable, drrowIntegration, Staffoffset, StaffLimit);

                        Staffobj = JsonConvert.DeserializeObject<KobasStaffRoot>(Jsonstaff.ToString());
                        KobasStaff = Staffobj.data.ToList();
                        Staff = KOBAS_STAFF_DT(KobasStaff, DT_STAFF);
                        if (Staffobj.data.Count < Staffobj.limit)
                        {
                            break;
                        }
                        Staffoffset = Staffoffset + 50;
                    }
                    ShiftRoot ShiftRootobj = new ShiftRoot();
                    List<KobasShift> Shiftobj = new List<KobasShift>();
                    DataTable Staffshift = new DataTable();
                    Staffoffset = 0;
                    for (int i = 0; i < Staff.Rows.Count; i++)
                    {
                        try
                        {
                            Staffoffset = 0;
                            for (int Recordi = 0; Recordi < 10000; Recordi++)
                            {
                                JsonShift = retrieveKobasShiftDetails(GlobleDatatable, Staffoffset.ToString(), StaffLimit.ToString(), Convert.ToInt32(Staff.Rows[i]["STAFF_ID"]), drrowIntegration);
                                ShiftRootobj = JsonConvert.DeserializeObject<ShiftRoot>(JsonShift.ToString());
                                Shiftobj = ShiftRootobj.data.ToList();
                                Staffshift = KOBAS_STAFF_SHIFT_DT(Shiftobj, Convert.ToInt32(Staff.Rows[i]["STAFF_ID"]), DT_STAFF_SHFIT);
                                Staffoffset = Staffoffset + 50;
                                if (ShiftRootobj.data.Count < ShiftRootobj.limit)
                                {
                                    break;
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            //The remote server returned an error: (404) Not Found.
                        }
                    }
                    Kobads.Tables.Add(Role);
                    Kobads.Tables.Add(Staff);
                    Kobads.Tables.Add(Staffshift);
                    Kobads.Tables.Add(Venue);
                    if (Kobads.Tables[0].Rows.Count > 0 && Kobads.Tables[1].Rows.Count > 0 && Kobads.Tables[2].Rows.Count > 0 && Kobads.Tables[3].Rows.Count > 0)
                    {
                        SubmitKobasDataToDBGroup(Kobads, drrowIntegration);
                    }
                }
            }
            catch (Exception ex)
            {

                throw;
            }
        }

        string retrieveKobasVenueDetails(DataTable dtIntegrationData, DataRow dr)
        {
            string URL = "https://api.kobas.co.uk/v3/venue";
            string JsonResult = "";
            AccessToken = Convert.ToString(dr["API_KEY"]);
            HR_Model ObjNew = new HR_Model();

            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dr);
                }
                else
                {
                    return ex.Message.ToString();
                }
            }
            return JsonResult;
        }
        string retrieveKobasRollDetails(DataTable dtIntegrationData, DataRow dr)
        {
            string URL = "https://api.kobas.co.uk/v3/staff/roles";
            string JsonResult = "";
            AccessToken = Convert.ToString(dr["API_KEY"]);
            HR_Model ObjNew = new HR_Model();

            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;

            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dr);
                }
                else
                {
                    return ex.Message.ToString();
                }
            }
            return JsonResult;
        }
        string retrieveKobasstaffDetails(DataTable dtIntegrationData, DataRow dr, int Staffoffset, int limit)
        {

            string QueryString = "?limit=" + limit + "&offset=" + Staffoffset.ToString();
            string URL = "https://api.kobas.co.uk/v3/staff" + QueryString;

            string JsonResult = "";
            AccessToken = Convert.ToString(dr["API_KEY"]);
            HR_Model ObjNew = new HR_Model();

            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas staff - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dr);
                }
                else
                {
                    return ex.Message.ToString();
                }
            }

            return JsonResult;
        }
        string retrieveKobasShiftDetails(DataTable dtIntegrationData, string offset, string limit, int StaffId, DataRow dr)
        {
            string URL = "https://api.kobas.co.uk/v3/staff/" + StaffId.ToString() + "/shifts?offset=" + offset + "&limit=" + limit;
            string JsonResult = "";
            AccessToken = Convert.ToString(dr["API_KEY"]);
            HR_Model ObjNew = new HR_Model();
            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            obj.Add("offset", offset);
            obj.Add("limit", limit);
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);

            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas staff - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("offset", offset);
                    //obj1.Add("limit", limit);
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dr);
                }
                else
                {
                    return ex.Message.ToString();
                }
            }

            return JsonResult;
        }
        string JsonUrlReturn_fy(string Start_date, string end_date, string URL, DataTable dtIntegrationData, DataTable dt, int amount, int offset, DataRow dr, int FLAG_PAY_OR)
        {
            AccessToken = Convert.ToString(dr["API_KEY"]);
            HR_Model ObjNew = new HR_Model();
            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            obj.Add("from_date", Start_date);
            obj.Add("to_date", end_date);
            obj.Add("include_recipe", "1");
            obj.Add("venue_id", voucher_id);
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("x-kobas-company-id", company_id);
            client.Headers.Add("Authorization", AccessToken);
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                if (ex.Message == "The remote server returned an error: (401) Unauthorized.")
                {
                    LogExceptions.LogError("JsonUrlReturn_fy - Kboas - ", ex);
                    NameValueCollection obj1 = new NameValueCollection();
                    //obj1.Add("date", Start_date);
                    obj1.Add("from_date", Start_date);
                    obj1.Add("to_date", end_date);
                    obj1.Add("include_recipe", "1");
                    obj1.Add("venue_id", voucher_id);
                    JsonResult = GetAccessToken(dtIntegrationData, obj1, URL, 1, dr);
                }
                else
                {
                    //ObjNew.CashupModelObj.INTEGRATION_STATUS = 3;
                    //ObjNew.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    //ObjNew.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                    return ex.Message.ToString();
                }
            }
            return JsonResult;
        }
        string GetAccessToken(DataTable dtIntegrationData, NameValueCollection obj1, string URL, int FLAG, DataRow dr)
        {
            string JsonResult = "";
            string[] aa = dr["URL_PARAMETERS"].ToString().Split(',');
            string client_id = aa[0].ToString();
            string client_secret = aa[1].ToString();
            string ACCESS_TOKEN_URL = aa[2].ToString();
            string company_id = aa[3].ToString();
            string voucher_id = aa[4].ToString();
            Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            ACCESS_TOKEN_URL = "https://oauth.kobas.co.uk/access_token";
            var client = new RestClient(ACCESS_TOKEN_URL.Trim());
            var request = new RestRequest();

            request.AddParameter("grant_type", "client_credentials");
            request.AddParameter("client_id", client_id);
            request.AddParameter("client_secret", client_secret);
            request.AddParameter("scope", "integration");
            request.AddParameter("x-kobas-company-id", company_id);

            IRestResponse response_Header = client.ExecuteAsPost(request,"POST");

            Access_token_Root Access_tokenobj = JsonConvert.DeserializeObject<Access_token_Root>(response_Header.Content.ToString());
            HR_Repository HrDb = new HR_Repository();
            HR_Model _IHrUp = new HR_Model();
            _IHrUp.TABLE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["TABLE_ID"]);
            _IHrUp.ENTITY_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
            _IHrUp.CUSTOMER_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]);

            if (dtIntegrationData.Rows[0]["BRANCH_ID"].ToString() == "") { } else { _IHrUp.BRANCH_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["BRANCH_ID"]); };


            _IHrUp.URL_PARAMETERS = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;

            _IHrUp.API_KEY = Access_tokenobj.access_token;
            _IHrUp.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["INTEGRATION_SYSTEM_ID"]);
            _IHrUp.USER_ID = 1;
            _IHrUp.URL_PATH = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
            _IHrUp.INTEGRATION_TYPE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["INTEGRATION_TYPE_ID"]);
            _IHrUp.MODULE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["MODULE_ID"]);
            _IHrUp.USERID = null;
            _IHrUp.PASSWORD = null;
            _IHrUp.IS_OUTBOUND = false;
            _IHrUp.INTEGRATION_PICKUP_FLAG = false;
            if (Access_tokenobj.access_token != "" && Access_tokenobj.access_token != null)
            {
                DataTable FILTER_TABLE = new DataTable();
                string URLPR = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;
                int Return_FLAG = 0;

                GlobleDatatable.DefaultView.RowFilter = "CUSTOMER_ID= " + Convert.ToInt32(dtIntegrationData.Rows[0]["CUSTOMER_ID"]) + "and ENTITY_ID=" + Convert.ToInt32(dtIntegrationData.Rows[0]["ENTITY_ID"]);
                FILTER_TABLE = (GlobleDatatable.DefaultView).ToTable();

                for (int intCount = 0; intCount < FILTER_TABLE.Rows.Count; intCount++)
                {
                    HR_Model _IHr_temp = new HR_Model();
                    _IHr_temp.TABLE_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["TABLE_ID"]);
                    _IHr_temp.ENTITY_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["ENTITY_ID"]);
                    _IHr_temp.CUSTOMER_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["CUSTOMER_ID"]);
                    if (FILTER_TABLE.Rows[intCount]["BRANCH_ID"].ToString() == "") { } else { _IHr_temp.BRANCH_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["BRANCH_ID"]); };

                    _IHr_temp.URL_PARAMETERS = client_id + ',' + client_secret + ',' + ACCESS_TOKEN_URL + ',' + company_id + ',' + voucher_id;
                    _IHr_temp.API_KEY = Access_tokenobj.access_token;
                    _IHr_temp.INTEGRATION_SYSTEM_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_SYSTEM_ID"]);
                    _IHr_temp.USER_ID = 1;
                    _IHr_temp.URL_PATH = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                    _IHr_temp.INTEGRATION_TYPE_ID = Convert.ToInt32(FILTER_TABLE.Rows[intCount]["INTEGRATION_TYPE_ID"]);
                    _IHr_temp.MODULE_ID = Convert.ToInt32(dtIntegrationData.Rows[0]["MODULE_ID"]);
                    _IHr_temp.USERID = null;
                    _IHr_temp.PASSWORD = null;
                    _IHr_temp.IS_OUTBOUND = false;
                    _IHr_temp.INTEGRATION_PICKUP_FLAG = false;
                    //  Return_FLAG = 1;
                    HrDb.HR_Modelobj = _IHr_temp;
                    // Return_FLAG = HrDb.UPD_INTEGRATION_TOKENS();
                    dr["API_KEY"] = _IHr_temp.API_KEY;
                    dr["URL_PARAMETERS"] = _IHr_temp.URL_PARAMETERS;
                }
                Return_FLAG = 1;
                if (Return_FLAG == 1)
                {
                    WebClient Newclient = new WebClient();
                    Newclient.UseDefaultCredentials = true;
                    Newclient.Credentials = CredentialCache.DefaultCredentials;
                    Newclient.Headers.Add("Authorization", _IHrUp.API_KEY);
                    Newclient.Headers.Add("x-kobas-company-id", company_id);
                    if (FLAG == 1)
                    {
                        Newclient.QueryString = obj1;
                    }
                    System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
                    try
                    {
                        JsonResult = Newclient.DownloadString(URL);
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                }
            }
            //if (Access_tokenobj.code == "bad_request")
            //{
            //    _ICashUp.INTEGRATION_STATUS = 0;
            //    _ICashUp.ERROR_MESSAGE = "bad_request";
            //    _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            //    JsonResult = response_Header.Content.ToString();
            //}
            return JsonResult;
        }
        public DataTable KOBAS_STAFF_VENUE_DT(List<VenueRoot> Venue, DataTable DT)
        {
            DataTable KOBAS_VENUE_TYPE = new DataTable();
            for (int i = 0; i < Venue.Count; i++)
            {
                DataRow DR_HEADER = DT.NewRow();
                DR_HEADER["VENUE_ID"] = Venue[i].id;
                if (Venue[i].parent_id == null)
                {
                    DR_HEADER["PARENT_ID"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["PARENT_ID"] = Venue[i].parent_id;
                }
                DR_HEADER["IS_PARENT"] = Venue[i].is_parent ? 1 : 0;
                DR_HEADER["NAME"] = Venue[i].name;
                DR_HEADER["S_NAME"] = Venue[i].sname;
                DT.Rows.Add(DR_HEADER);
            }
            return DT;
        }
        public DataTable KOBAS_STAFF_ROLE_DT(List<KobasStaffRoleRoot> StaffRole, DataTable DT)
        {

            for (int i = 0; i < StaffRole.Count; i++)
            {
                DataRow DR_HEADER = DT.NewRow();
                DR_HEADER["STAFF_ROLE_ID"] = StaffRole[i].id;
                DR_HEADER["FRANCHISEE_ID"] = StaffRole[i].franchisee_id;
                DR_HEADER["NAME"] = StaffRole[i].name;
                DR_HEADER["CATEGORY"] = StaffRole[i].category;
                DT.Rows.Add(DR_HEADER);
            }
            return DT;
        }
        public DataTable KOBAS_STAFF_DT(List<KobasStaff> Staff, DataTable DT)
        {

            for (int i = 0; i < Staff.Count; i++)
            {
                DataRow DR_HEADER = DT.NewRow();
                DR_HEADER["STAFF_ID"] = Staff[i].id;
                DR_HEADER["FRANCHISEE_ID"] = Staff[i].franchisee_id;
                DR_HEADER["VENUE_ID"] = Staff[i].venue_id;
                DR_HEADER["TITLE"] = Staff[i].title;
                DR_HEADER["FIRST_NAME"] = Staff[i].first_name;
                DR_HEADER["SURNAME"] = Staff[i].surname;
                DR_HEADER["NAME"] = Staff[i].name;
                DR_HEADER["GENDER"] = Staff[i].gender;
                DR_HEADER["EMAIL"] = Staff[i].email;
                DR_HEADER["TELEPHONE"] = Staff[i].telephone;
                DR_HEADER["MOBILE"] = Staff[i].mobile;
                if (Staff[i].dob == null || Staff[i].dob == "1900-01-01" || Staff[i].dob == "2000-01-01")
                {
                    DR_HEADER["DOB"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["DOB"] = Staff[i].dob;
                }


                if (Staff[i].start_date == "0000-00-00" || Staff[i].start_date == null)
                {
                    DR_HEADER["START_DATE"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["START_DATE"] = Staff[i].start_date;
                }


                if (Staff[i].end_date == "0000-00-00" || Staff[i].end_date == null)
                {
                    DR_HEADER["END_DATE"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["END_DATE"] = Staff[i].end_date;
                }


                if (Staff[i].level_id == null)
                {
                    DR_HEADER["LEVEL_ID"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["LEVEL_ID"] = Staff[i].level_id;
                }

                if (Staff[i].default_role_id == null)
                {
                    DR_HEADER["DEFAULT_ROLE_ID"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["DEFAULT_ROLE_ID"] = Staff[i].default_role_id;
                }
                DR_HEADER["IS_CURRENT_EMPLOYEE"] = Staff[i].is_current_employee;
                if (Staff[i].marketing_consent == null)
                {
                    DR_HEADER["MARKETING_CONSENT"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["MARKETING_CONSENT"] = Staff[i].marketing_consent;
                }




                DR_HEADER["M_DATE"] = Staff[i].m_date;
                DR_HEADER["C_DATE"] = Staff[i].c_date;
                if (Staff[i].can_export_salary_data == null)
                {
                    DR_HEADER["CAN_EXPORT_SALARY_DATA"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["CAN_EXPORT_SALARY_DATA"] = Staff[i].can_export_salary_data.ToString();
                }
                DT.Rows.Add(DR_HEADER);
            }
            return DT;
        }
        public DataTable KOBAS_STAFF_SHIFT_DT(List<KobasShift> StaffShift, int STAFF_ID, DataTable DT)
        {

            for (int i = 0; i < StaffShift.Count; i++)
            {
                DataRow DR_HEADER = DT.NewRow();
                DR_HEADER["SHIFT_ID"] = StaffShift[i].id;
                if (StaffShift[i].venue_id == null)
                {
                    DR_HEADER["VENUE_ID"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["VENUE_ID"] = StaffShift[i].venue_id;
                }


                DR_HEADER["CHARGE_VENUE_ID"] = StaffShift[i].charge_venue_id;

                if (StaffShift[i].role_id == null)
                {
                    DR_HEADER["ROLE_ID"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["ROLE_ID"] = StaffShift[i].role_id;
                }



                DR_HEADER["DATE"] = StaffShift[i].date;

                if (StaffShift[i].start_time == null)
                {
                    DR_HEADER["START_TIME"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["START_TIME"] = StaffShift[i].date + 'T' + StaffShift[i].start_time;
                }

                if (StaffShift[i].end_time == null)
                {
                    DR_HEADER["END_TIME"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["END_TIME"] = StaffShift[i].date + 'T' + StaffShift[i].end_time;
                    if (Convert.ToDateTime(DR_HEADER["END_TIME"]) < Convert.ToDateTime(DR_HEADER["START_TIME"]))
                    {
                        DR_HEADER["END_TIME"] = Convert.ToDateTime(DR_HEADER["END_TIME"]).AddDays(1);
                    }
                }

                if (StaffShift[i].minutes_rostered == null)
                {
                    DR_HEADER["MINUTES_ROSTERED"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["MINUTES_ROSTERED"] = StaffShift[i].minutes_rostered;
                }

                DR_HEADER["HOURS_ROSTERED"] = StaffShift[i].hours_rostered;
                DR_HEADER["MINUTES_ON_BREAK"] = StaffShift[i].minutes_on_break;
                DR_HEADER["MINUTES_WORKED"] = StaffShift[i].minutes_worked;
                DR_HEADER["HOURS_WORKED"] = StaffShift[i].hours_worked;
                DR_HEADER["APPROVED"] = StaffShift[i].approved;

                if (StaffShift[i].time_in == null)
                {
                    DR_HEADER["TIME_IN"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["TIME_IN"] = StaffShift[i].date + 'T' + StaffShift[i].time_in;
                }
                if (StaffShift[i].time_out == null)
                {
                    DR_HEADER["TIME_OUT"] = DBNull.Value;
                }
                else
                {
                    DR_HEADER["TIME_OUT"] = StaffShift[i].date + 'T' + StaffShift[i].time_out;

                    if (Convert.ToDateTime(DR_HEADER["TIME_OUT"]) < Convert.ToDateTime(DR_HEADER["TIME_IN"]))
                    {
                        DR_HEADER["TIME_OUT"] = Convert.ToDateTime(DR_HEADER["TIME_OUT"]).AddDays(1);
                    }

                }
                DR_HEADER["TIPS"] = StaffShift[i].tips;
                DR_HEADER["HOURS_TRAINING"] = StaffShift[i].hours_training;
                DR_HEADER["HAS_CLOCKED_IN"] = StaffShift[i].has_clocked_in;
                DR_HEADER["HAS_BREAK"] = StaffShift[i].has_break;
                DR_HEADER["IS_HOLIDAY"] = StaffShift[i].is_holiday;
                DR_HEADER["IS_DAY_OFF"] = StaffShift[i].is_day_off;
                DR_HEADER["IS_COVER_SHIFT"] = StaffShift[i].is_cover_shift;
                DR_HEADER["M_DATE"] = StaffShift[i].m_date;
                DR_HEADER["C_DATE"] = StaffShift[i].c_date;
                DR_HEADER["HOLIDAY_AMOUNT_OF_DAY"] = StaffShift[i].holiday_amount_of_day;
                DR_HEADER["STAFF_ID"] = STAFF_ID;
                DT.Rows.Add(DR_HEADER);
            }
            return DT;
        }

        int SubmitKobasDataToDBGroup(DataSet KOBAS_ROTA_DS, DataRow dr)
        {
            HR_Model Obj = new HR_Model();
            try
            {
                HR_Repository HrDb = new HR_Repository();
                HR_Model _Obj = new HR_Model();
                _Obj.ENTITY_ID = Convert.ToInt32(dr["ENTITY_ID"]);
                if (dr["BRANCH_ID"].ToString() == "")
                {
                }
                else
                {
                    _Obj.BRANCH_ID = Convert.ToInt32(dr["BRANCH_ID"]);
                }



                _Obj.KOBAS_ROTA_ROLE = KOBAS_ROTA_DS.Tables[0];
                _Obj.KOBAS_ROTA_STAFF = KOBAS_ROTA_DS.Tables[1];
                _Obj.KOBAS_ROTA_SHIFT = KOBAS_ROTA_DS.Tables[2];
                _Obj.KOBAS_ROTA_VENUE = KOBAS_ROTA_DS.Tables[3];
                HrDb.HR_Modelobj = _Obj;
                Int32 PO_FLAG = HrDb.INS_KOBAS_EMP_ROTA();
                Int32 RETURN_FLAG = 2;
                if (PO_FLAG == 0)
                {
                    RETURN_FLAG = PO_FLAG;
                }
                return RETURN_FLAG;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" Farm Kobas Rota All:- Fail To Saving Data in DB - ", ex);
                return 3;
            }
        }
    }
}
