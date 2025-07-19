using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;




namespace HR_Integration.S4Labour
{
    public class S4Labour
    {

        Integrator integrator;
        TABLE_TYPE TABLE_TYPE;
        S4LabourModel.Root_Login root_Login_Common;
        HR_Model HR_Model_Obj;
        HR_Repository hR_Repository;

        public S4Labour()
        {
            TABLE_TYPE = new TABLE_TYPE();
            root_Login_Common = new S4LabourModel.Root_Login();
            HR_Model_Obj = new HR_Model();
            hR_Repository = new HR_Repository();
            integrator = new Integrator();
        }

        public void S4LabourFetchData(DataTable IntegrationDt)
        {
            foreach (DataRow _intDr in IntegrationDt.Rows)
            {
                HR_Model_Obj.PARAM_USER_ID = _intDr["USERID"].ToString();
                HR_Model_Obj.PARAM_PASSWORD = _intDr["PASSWORD"].ToString();
                HR_Model_Obj.URL_PATH = _intDr["URL_PATH"].ToString();
                HR_Model_Obj.ENTITY_ID = Convert.ToInt32(_intDr["ENTITY_ID"]);
                HR_Model_Obj.BRANCH_ID = Convert.ToInt32(_intDr["BRANCH_ID"]);
                
                try
                {
                    GetMaritalStatus();
                    GetNationalities();
                    GetGender();
                    GetOrganisations();
                    GetSites();
                    GetDocumentTypes();
                    GetPayTypes();
                    GetOrganisationLevelPositions();
                    GetSiteLevelPositions();
                    GetEmployeeDetails();
                    GetStartersAndLeavers();
                    GetGetOrganisationAdditionalPay();
                    GetActualPayrollShifts();
                    GetPayrollExport();
                    GetOrganisationShiftsForecast();
                    GetOrganisationShiftsAmended();
                    GetOrganisationShiftsActual();
                } 
                catch (Exception ex)
                {
                    throw;
                }

            }
        }



        public S4LabourModel.Root_Login GetSession()
        {
            try
            {
                S4LabourModel.Root_Login _Logins = new S4LabourModel.Root_Login();
                var client = new RestClient("https://api.s4labour.com/api/Account/LogIn");
                client.Authenticator = new HttpBasicAuthenticator(HR_Model_Obj.PARAM_USER_ID, HR_Model_Obj.PARAM_PASSWORD);
                var request = new RestRequest(Method.GET);
                var _getSession = client.Execute(request);
                _Logins = JsonConvert.DeserializeObject<S4LabourModel.Root_Login>(_getSession.Content);
                return _Logins;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        public void GetMaritalStatus()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_MaritalStatus> root = integrator.Get<List<S4LabourModel.Root_MaritalStatus>>("https://api.s4labour.com/api/MaritalStatus/Read/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_MARITAL_STATUS();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetMaritalStatus:-" + ex.Message.ToString() + ":;:";
            }
            
        }
        public void GetNationalities()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Nationalities> root = integrator.Get<List<S4LabourModel.Root_Nationalities>>("https://api.s4labour.com/api/Nationalities/Read/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_NATIONALITIES();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetNationalities:-" + ex.Message.ToString() + ":;:";
            }
            
        }
        public void GetGender()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Genders> root = integrator.Get<List<S4LabourModel.Root_Genders>>("https://api.s4labour.com/api/Genders/Read/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_GENDER();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetGender:-" + ex.Message.ToString() + ":;:";
            }
            
        }
        public void GetOrganisations()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_1 = new DataTable();
            try
            {
                List<S4LabourModel.Root_Organisations> root = integrator.Get<List<S4LabourModel.Root_Organisations>>("https://api.s4labour.com/api/Organisations/Read/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_1 = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_1;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORGANISATIONS();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetOrganisations:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetSites()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            TABLE_TYPE.DATATABLE_2 = new DataTable();
            try
            {
                List<S4LabourModel.Root_Sites> root = integrator.Get<List<S4LabourModel.Root_Sites>>("https://api.s4labour.com/api/Sites/Read/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    TABLE_TYPE.DATATABLE_2 = TABLE_TYPE.DATATABLE_COMMON;
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_SITES();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetSites:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetDocumentTypes()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>(); 

             root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_DocumentTypes> root = integrator.Get<List<S4LabourModel.Root_DocumentTypes>>("https://api.s4labour.com/api/DocumentTypes/Read/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_DOCUMENTSTYPE();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetDocumentTypes:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetPayTypes()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                foreach (DataRow _drSite in TABLE_TYPE.DATATABLE_2.Rows)
                {
                    List<S4LabourModel.Root_PayTypes> root = integrator.Get<List<S4LabourModel.Root_PayTypes>>("https://api.s4labour.com/api/PayTypes/Read/" + _drSite["ID"].ToString() + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                    if (root != null && root.Count > 0)
                    {
                        TABLE_TYPE.DATATABLE_COMMON.Clear();
                        TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                        HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                        hR_Repository.HR_Modelobj = HR_Model_Obj;
                        hR_Repository.INS_UPD_S4L_PAYTYPE();
                    }
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetPayTypes:-" + ex.Message.ToString() + ":;:"; ;
            }
            

        }
        public void GetOrganisationLevelPositions()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_OrganisationsLevelPosition> root = integrator.Get<List<S4LabourModel.Root_OrganisationsLevelPosition>>("https://api.s4labour.com/api/OrganisationPositions/Read/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"].ToString() + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON.Clear();
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORG_LVL_POSITIONS();
                }

            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetOrganisationLevelPositions:-" + ex.Message.ToString() + ":;:"; ;
            }
            

        }
        public void GetSiteLevelPositions()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                foreach (DataRow _drSite in TABLE_TYPE.DATATABLE_2.Rows)
                {
                    List<S4LabourModel.Root_SiteLevelPositions> root = integrator.Get<List<S4LabourModel.Root_SiteLevelPositions>>("https://api.s4labour.com/api/Positions/Read/" + _drSite["ID"].ToString() + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                    if (root != null && root.Count > 0)
                    {
                        TABLE_TYPE.DATATABLE_COMMON.Clear();
                        TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                        HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                        hR_Repository.HR_Modelobj = HR_Model_Obj;
                        hR_Repository.INS_UPD_S4L_SITE_LVL_POSITIONS();
                    }
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetSiteLevelPositions:-" + ex.Message.ToString() + ":;:"; ;
            }
            foreach (DataRow _drSite in TABLE_TYPE.DATATABLE_2.Rows)
            {
                List<S4LabourModel.Root_SiteLevelPositions> root = integrator.Get<List<S4LabourModel.Root_SiteLevelPositions>>("https://api.s4labour.com/api/Positions/Read/" + _drSite["ID"].ToString() + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON.Clear();
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_SITE_LVL_POSITIONS();
                }
            }
        }
        public void GetEmployeeDetails()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Employee> root = integrator.Get<List<S4LabourModel.Root_Employee>>("https://api.s4labour.com/api/Employees/Index?sessionID=" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_EMPLOYEES();
                }

            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetEmployeeDetails:-" + ex.Message.ToString() + ":;:"; ;
            }
           
        }
        public void GetStartersAndLeavers()
        { 
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_StartersAndLeavers> root = integrator.Get<List<S4LabourModel.Root_StartersAndLeavers>>("https://api.s4labour.com/api/PayrollExport/GetStartersAndLeavers/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + DateTime.Now.AddYears(-1).ToString("yyyy-MM-dd") + "/" + DateTime.Now.ToString("yyyy-MM-dd") + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_STARTERS_AND_LEAVERS();
                }

            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetStartersAndLeavers:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetGetOrganisationAdditionalPay()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_OrganisationAdditionalPay> root = integrator.Get<List<S4LabourModel.Root_OrganisationAdditionalPay>>("https://api.s4labour.com/api/AdditionalPay/GetOrganisationAdditionalPay/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/''/''/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORG_ADDITIONAL_PAY();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetGetOrganisationAdditionalPay:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }       
        public void GetActualPayrollShifts()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                foreach (DataRow _drSite in TABLE_TYPE.DATATABLE_2.Rows)
                {
                    List<S4LabourModel.Root_ActualPayrollShifts> root = integrator.Get<List<S4LabourModel.Root_ActualPayrollShifts>>("https://api.s4labour.com/api/Shift/GetActualPayrollShifts/" + _drSite["ID"].ToString() + "/" + DateTime.Now.AddDays(-200).ToString("yyyy-MM-dd") + "/" + DateTime.Now.ToString("yyyy-MM-dd") + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                    if (root != null && root.Count > 0)
                    {
                        TABLE_TYPE.DATATABLE_COMMON.Clear();
                        TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                        HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                        hR_Repository.HR_Modelobj = HR_Model_Obj;
                        hR_Repository.INS_UPD_S4L_ACTUAL_PAYROLL_SHIFTS();
                    }
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetActualPayrollShifts:-" + ex.Message.ToString() + ":;:"; ;
            }
            

        }
        public void GetPayrollExport()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_PayrollExport> root = integrator.Get<List<S4LabourModel.Root_PayrollExport>>("https://api.s4labour.com/api/PayrollExport/GetPayrollExport/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + DateTime.Now.AddDays(-200).ToString("yyyy-MM-dd") + "/" + DateTime.Now.ToString("yyyy-MM-dd") + "/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_PAYROLL_EXPORT();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetPayrollExport:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetOrganisationShiftsForecast()
        {

            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Amended_Forecast> root = integrator.Get<List<S4LabourModel.Root_Amended_Forecast>>("https://api.s4labour.com/api/Shift/GetOrganisationShifts/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + DateTime.Now.AddDays(-200).ToString("yyyy-MM-dd") +"/" + DateTime.Now.AddDays(30).ToString("yyyy-MM-dd") + "/Forecast/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORG_SHIFTS_FORECAST();
                }
            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetOrganisationShiftsForecast:-" + ex.Message.ToString() + ":;:"; ;
            }
            
        }
        public void GetOrganisationShiftsAmended()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Amended_Forecast> root = integrator.Get<List<S4LabourModel.Root_Amended_Forecast>>("https://api.s4labour.com/api/Shift/GetOrganisationShifts/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + DateTime.Now.AddDays(-200).ToString("yyyy-MM-dd") + "/" + DateTime.Now.AddDays(30).ToString("yyyy-MM-dd") + "/Amended/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORG_SHIFTS_AMENDED();
                }

            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetOrganisationShiftsAmended:-" + ex.Message.ToString() + ":;:"; ;
            }
           
        }
        public void GetOrganisationShiftsActual()
        {
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            Dictionary<string, string> _queryString = new Dictionary<string, string>();

            root_Login_Common = GetSession();
            TABLE_TYPE.DATATABLE_COMMON = new DataTable();
            try
            {
                List<S4LabourModel.Root_Amended_Forecast> root = integrator.Get<List<S4LabourModel.Root_Amended_Forecast>>("https://api.s4labour.com/api/Shift/GetOrganisationShifts/" + TABLE_TYPE.DATATABLE_1.Rows[0]["ID"] + "/" + DateTime.Now.AddDays(-200).ToString("yyyy-MM-dd") + "/" + DateTime.Now.AddDays(30).ToString("yyyy-MM-dd") + "/Actual/" + root_Login_Common.SessionID, _header, _queryString, _body, "");
                if (root != null && root.Count > 0)
                {
                    TABLE_TYPE.DATATABLE_COMMON = ToDataTables(root);
                    HR_Model_Obj.DATATABLE_COMMON = TABLE_TYPE.DATATABLE_COMMON;
                    hR_Repository.HR_Modelobj = HR_Model_Obj;
                    hR_Repository.INS_UPD_S4L_ORG_SHIFTS_ACTUAL();
                }

            }
            catch (Exception ex)
            {
                HR_Model_Obj.CONSOLIDATED_ERROR_STRING += "Function GetOrganisationShiftsAmended:-" + ex.Message.ToString() + ":;:"; ;
            }

        }


        public DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                if (prp.PropertyType.IsGenericType && prp.PropertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
                    table.Columns.Add(prp.Name, prp.PropertyType.GetGenericArguments()[0].Name.GetType());
                else
                    table.Columns.Add(prp.Name, prp.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
    }
}
