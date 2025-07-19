using App_Repository;
using EPOS_Integration.EPOS_SALES;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using Utility;
using ViewModels;
using static EPOS_Integration.SIMPHONY.SYMPHONY_MODEL;

namespace EPOS_Integration.SIMPHONY
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class Simphony
    {
        bool IS_Error_Ocurr = false;
        Epos_Integrator.EPOS_INTEGRATOR integrator;
        Cashup Obj = new Cashup();
        SIMPHONY.SIMPHONY_TABLES _simphony_tables;
        Dictionary<string, string> _header;
        Dictionary<string, string> _body;
        Dictionary<string, string> _queryString;
        DataTable _refreshTokenTable;
        string[] _parameters = { }; string[] _parameters_URL_Locations = { };
        string[] _stringSeparators = new string[] { ":;:" };
        private string _symphonyId = string.Empty;
        string[] parameters = { };
        private string _refresh_token = string.Empty;
        int GUEST_CHECK_ROW_COUNT = 0;
        DataTable[] _Arr_Datatable;
        string[] _Arr_Datatable_Name;
        DataSet _COMMON_DS;


        public Simphony()
        {
            Obj.CashupModelObj = new CashupModel();
            integrator = new Epos_Integrator.EPOS_INTEGRATOR();
            _simphony_tables = new SIMPHONY_TABLES();
            _COMMON_DS = new DataSet();
        }
        public DataTable CREATE_REFRESHTOKEN_TABLE()
        {
            DataTable XERO_REFRESHTOKEN = new DataTable();
            DataColumn COLUMN = new DataColumn("id_token", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("access_token", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("expires_in", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("token_type", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("refresh_token", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("scope", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            COLUMN = new DataColumn("error", typeof(string)); XERO_REFRESHTOKEN.Columns.Add(COLUMN);
            return XERO_REFRESHTOKEN;
        }
        public void Fetch_Simphony_Data(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Dictionary<string, string> _queryString = new Dictionary<string, string>();
            Dictionary<string, string> _header = new Dictionary<string, string>();
            Dictionary<string, string> _body = new Dictionary<string, string>();
            _refreshTokenTable = CREATE_REFRESHTOKEN_TABLE();


            DataView _dv = new DataView(dt_IntegrationDetails);
            DataTable _filter_Dist_BranchID = _dv.ToTable(true, "BRANCH_ID");

            foreach (DataRow dr_Dist_BranchID in _filter_Dist_BranchID.Rows)
            {
                try
                {
                    IS_Error_Ocurr = false;
                    int _counter = 0;
                    GUEST_CHECK_ROW_COUNT = 0;
                    if (dt.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).Count() > 0)
                    {
                        foreach (DataRow dataRow in dt.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).CopyToDataTable().Rows)
                        {

                            DataTable _filter_InteDtail_By_BranchID = dt_IntegrationDetails.Select("BRANCH_ID=" + Convert.ToDecimal(dr_Dist_BranchID["BRANCH_ID"])).CopyToDataTable();
                            _COMMON_DS.Tables.Clear();
                            _parameters = Convert.ToString(_filter_InteDtail_By_BranchID.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                            _symphonyId = _parameters[0];

                            _refreshTokenTable.Rows.Clear();
                            DataRow TOKEN_DR = _refreshTokenTable.NewRow();
                            TOKEN_DR["id_token"] = _filter_InteDtail_By_BranchID.Rows[0]["API_KEY"];
                            TOKEN_DR["access_token"] = _filter_InteDtail_By_BranchID.Rows[0]["API_KEY"];
                            TOKEN_DR["expires_in"] = "1800";
                            TOKEN_DR["token_type"] = "Bearer";
                            TOKEN_DR["refresh_token"] = _parameters[1];
                            TOKEN_DR["scope"] = "";
                            TOKEN_DR["error"] = "";
                            _refreshTokenTable.Rows.Add(TOKEN_DR);
                            Obj.CashupModelObj.SYMPHONY_REFRESH_TOKEN_DT = _refreshTokenTable;


                            Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dataRow["ID"]);
                            Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dataRow["BRANCH_ID"]);
                            Obj.CashupModelObj.ENTITY_ID = Convert.ToDecimal(dataRow["ENTITY_ID"]);
                            Obj.CashupModelObj.CASHUP_DATE = Convert.ToDateTime(dataRow["CASHUP_DATE"]);


                            if (IS_Error_Ocurr == false)
                                Get_Employee_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Discount_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Reason_Code_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Order_Type_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Revenue_Center_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Service_Charge_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Tax_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Tender_Media_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Menu_Item_Dimensions(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            if (IS_Error_Ocurr == false)
                                Get_Guest_Checks(_filter_InteDtail_By_BranchID, dt_IntegrationDetails);
                            _counter += 1;
                            if (IS_Error_Ocurr == false)
                            {
                                try
                                {
                                    if (GUEST_CHECK_ROW_COUNT > 0)
                                    {
                                        //Obj.INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON();
                                        TransformData<DataSet> transformData = new TransformData<DataSet>();
                                        transformData.DataTransform(IntegrationSource.SYMPHONY, _filter_InteDtail_By_BranchID, _COMMON_DS, Obj.CashupModelObj.CASHUP_MAIN_ID, Obj);

                                        Obj.CashupModelObj.INTEGRATION_STATUS = 2;
                                        Obj.CashupModelObj.ERROR_MESSAGE = "";
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();


                                    }
                                    if (GUEST_CHECK_ROW_COUNT == 0)
                                    {
                                        Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                                        Obj.CashupModelObj.ERROR_MESSAGE = "";
                                        Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    }
                                    dt.Dispose();
                                }
                                catch (Exception ex)
                                {
                                    LogExceptions.LogError("INS_UPD_MICROS_SIMPHONY_SALES_DATA_COMMON", ex);
                                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString() + "---" + Obj.CashupModelObj.ERROR_MESSAGE;
                                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                    dt.Dispose();
                                }
                            }
                            else
                            {
                                Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                                Obj.CashupModelObj.ERROR_MESSAGE = "Error";
                                Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                                dt.Dispose();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    dt.Dispose();
                    LogExceptions.LogError("Fetch_Simphony_Data", ex);
                    Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                    Obj.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                    Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                }
            }

        }
        public void Get_Guest_Checks(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_GetGuestChecks root;
            GUEST_CHECK_ROW_COUNT = 0;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + Obj.CashupModelObj.SYMPHONY_REFRESH_TOKEN_DT.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                SYMPHONY_MODEL.Body_Parameterts _body_Guest_Checks = new SYMPHONY_MODEL.Body_Parameterts();
                _body_Guest_Checks.busDt = Obj.CashupModelObj.CASHUP_DATE.ToString("yyyy-MM-dd");
                _body_Guest_Checks.locRef = _parameters_URL_Locations[1];
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_body_Guest_Checks);
                root = integrator.Post<SYMPHONY_MODEL.Root_GetGuestChecks>(_parameters_URL_Locations[0] + "getGuestChecks", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], Int_DataTable);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_GetGuestChecks>(_parameters_URL_Locations[0] + "getGuestChecks", _header, _queryString, _body, _bodyJSON, null, "");
                }
                if (root != null && root.guestChecks.Count > 0)
                {
                    if (Convert.ToString(Int_DataTable.Rows[0]["URL_PARAMETERS"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries).Length > 4)
                    {
                        string[] _tempParameter = Convert.ToString(Int_DataTable.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        string rvcPart = _tempParameter[4];
                        List<int> rvcNums = rvcPart.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries).Select(r => Convert.ToInt32(r)).ToList();
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TYPE> _micros_Simphony_Guest_Checks_Type = root.guestChecks.Where(x => rvcNums.Contains(x.rvcNum)).Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TYPE
                        {
                            GUEST_CHECK_ID = p.guestCheckId,
                            CHK_NUM = p.chkNum,
                            OPN_BUSDT = p.opnBusDt == null ? (DateTime?)null : (Convert.ToDateTime(p.opnBusDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnBusDt)),
                            OPN_UTC = p.opnUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.opnUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnUTC)),
                            OPN_LCL = p.opnLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.opnLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnLcl)),
                            CLSD_BUS_DT = p.clsdBusDt == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdBusDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdBusDt)),
                            CLSD_UTC = p.clsdUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdUTC)),
                            CLSD_LCL = p.clsdLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdLcl)),
                            LAST_TRANS_UTC = p.lastTransUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.lastTransUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastTransUTC)),
                            LAST_TRANS_LCL = p.lastTransLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.lastTransLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastTransLcl)),
                            LAST_UPDATED_UTC = p.lastUpdatedUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.lastUpdatedUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastUpdatedUTC)),
                            LAST_UPDATED_LCL = p.lastUpdatedLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.lastUpdatedLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastUpdatedLcl)),
                            CLSD_FLAG = p.clsdFlag,
                            GST_CNT = Convert.ToDecimal(p.gstCnt),
                            SUB_TTL = p.subTtl,
                            NON_TXBLSLS_TTL = Convert.ToDecimal(p.nonTxblSlsTtl),
                            CHK_TTL = Convert.ToDecimal(p.chkTtl),
                            DSC_TTL = Convert.ToDecimal(p.dscTtl),
                            PAY_TTL = Convert.ToDecimal(p.payTtl),
                            BAL_DUE_TTL = Convert.ToDecimal(p.balDueTtl),
                            RVC_NUM = p.rvcNum,
                            OT_NUM = Convert.ToDecimal(p.otNum),
                            TBL_NUM = p.tblNum,
                            TBL_NAME = p.tblName,
                            EMP_NUM = p.empNum,
                            XFER_STATUS = p.xferStatus,
                            XFER_TO_CHK_NUM = Convert.ToDecimal(p.xferToChkNum),
                            SVC_CHG_TTL = Convert.ToDecimal(p.svcChgTtl),
                            TIP_TOTAL = Convert.ToDecimal(p.tipTotal),
                            CHK_NAME = p.chkName,
                            CHK_REF = p.chkRef,
                            CANCEL_FLAG = p.cancelFlag,
                            SPLT_FRM_CHK = p.spltFrmChk
                        }).ToList();
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE_TYPE> _micros_Simphony_Guest_Checks_Detail_Line_Types = root.guestChecks.Where(x => rvcNums.Contains(x.rvcNum)).SelectMany(p => p.detailLines.Select(x => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE_TYPE
                        {
                            GUEST_CHECK_LINE_ITEM_ID = x.guestCheckLineItemId,
                            DTLOT_NUM = Convert.ToDecimal(x.dtlOtNum),
                            LINE_NUM = Convert.ToDecimal(x.lineNum),
                            DTL_ID = Convert.ToDecimal(x.dtlId),
                            DETAIL_UTC = x.detailUTC == null ? (DateTime?)null : (Convert.ToDateTime(x.detailUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.detailUTC)),
                            DETAIL_LCL = x.detailLcl == null ? (DateTime?)null : (Convert.ToDateTime(x.detailLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.detailLcl)),
                            LAST_UPDATE_UTC = x.lastUpdateUTC == null ? (DateTime?)null : (Convert.ToDateTime(x.lastUpdateUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.lastUpdateUTC)),
                            LAST_UPDATE_LCL = x.lastUpdateLcl == null ? (DateTime?)null : (Convert.ToDateTime(x.lastUpdateLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.lastUpdateLcl)),
                            BUS_DT = x.busDt == null ? (DateTime?)null : (Convert.ToDateTime(x.busDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.busDt)),
                            WS_NUM = Convert.ToDecimal(x.wsNum),
                            DSP_TTL = Convert.ToDecimal(x.dspTtl),
                            DSP_QTY = Convert.ToDecimal(x.dspQty),
                            AGG_TTL = Convert.ToDecimal(x.aggTtl),
                            AGG_QTY = Convert.ToDecimal(x.aggQty),
                            CHK_EMP_ID = Convert.ToDecimal(x.chkEmpId),
                            CHK_EMP_NUM = Convert.ToDecimal(x.chkEmpNum),
                            SVC_RND_NUM = Convert.ToDecimal(x.svcRndNum),
                            PAR_DTL_ID = Convert.ToDecimal(x.parDtlId),
                            TRANS_EMP_ID = Convert.ToDecimal(x.transEmpId) == 0 ? Convert.ToDecimal(x.chkEmpId) : Convert.ToDecimal(x.transEmpId),
                            TRANS_EMP_NUM = Convert.ToDecimal(x.transEmpNum) == 0 ? Convert.ToDecimal(x.chkEmpId) : Convert.ToDecimal(x.transEmpNum),
                            REF_INF_O1 = x.refInfo1,
                            DO_NOT_SHOW_FLAG = x.doNotShowFlag == true ? true : false,
                            ERRCOR_FLAG = x.errCorFlag == true ? true : false,
                            MGR_EMP_ID = Convert.ToDecimal(x.mgrEmpId),
                            MGR_EMP_NUM = Convert.ToDecimal(x.mgrEmpNum),
                            VD_FLAG = x.vdFlag == true ? true : false,
                            RSN_CODE_NUM = Convert.ToDecimal(x.rsnCodeNum),
                            MENU_ITEM_MI_NUM = x.menuItem != null ? x.menuItem.miNum : (int?)null,
                            MENU_ITEM_ACTIVE_TAXES = x.menuItem != null ? x.menuItem.activeTaxes : "",
                            MENU_ITEM_PRC_LVL = x.menuItem != null ? x.menuItem.prcLvl : (int?)null,
                            TENDER_MEDIA_TMED_NUM = x.tenderMedia != null ? x.tenderMedia.tmedNum : (decimal?)null,
                            OTHER_DETAIL_TYPE = x.other != null ? x.other.detailType : (decimal?)null,
                            OTHER_DETAIL_NUM = x.other != null ? x.other.detailNum : (decimal?)null,
                            SERVICE_CHARGE_SVC_CHG_NUM = x.serviceCharge != null ? x.serviceCharge.svcChgNum : (decimal?)null,
                            DISCOUNT_DSC_NUM = x.discount != null ? x.discount.dscNum : (decimal?)null,
                            DISCOUNT_DSC_MI_NUM = x.discount != null ? x.discount.dscMiNum : (decimal?)null,
                            DISCOUNT_ACTIVE_TAXES = x.discount != null ? x.discount.activeTaxes : "",
                            ERROR_CORRECT_TYPE = x.errorCorrect != null ? x.errorCorrect.type : (decimal?)null,
                            ERROR_CORRECT_OBJECT_NUM = x.errorCorrect != null ? x.errorCorrect.objectNum : (decimal?)null,
                            REF_GUEST_CHECK_ID = p.guestCheckId

                        })).ToList();
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TAXES_TYPE> _micros_Simphony_Guest_checks_Taxes_Types = root.guestChecks.Where(x => rvcNums.Contains(x.rvcNum)).SelectMany(p => p.taxes.Select(x => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TAXES_TYPE
                        {
                            TAX_NUM = x.taxNum,
                            TX_BLSLS_TTL = x.txblSlsTtl,
                            TAX_COLL_TTL = x.taxCollTtl,
                            TAX_RATE = x.taxRate,
                            TYPE = x.type,
                            REF_GUEST_CHECK_ID = p.guestCheckId
                        })).ToList();
                        _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Guest_Checks_Type);
                        _simphony_tables.DATATABLE_SIMPHONY_2 = ToDataTables(_micros_Simphony_Guest_Checks_Detail_Line_Types);
                        _simphony_tables.DATATABLE_SIMPHONY_3 = ToDataTables(_micros_Simphony_Guest_checks_Taxes_Types);
                    }
                    else
                    {
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TYPE> _micros_Simphony_Guest_Checks_Type = root.guestChecks.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TYPE
                        {
                            GUEST_CHECK_ID = p.guestCheckId,
                            CHK_NUM = p.chkNum,
                            OPN_BUSDT = p.opnBusDt == null ? (DateTime?)null : (Convert.ToDateTime(p.opnBusDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnBusDt)),
                            OPN_UTC = p.opnUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.opnUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnUTC)),
                            OPN_LCL = p.opnLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.opnLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.opnLcl)),
                            CLSD_BUS_DT = p.clsdBusDt == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdBusDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdBusDt)),
                            CLSD_UTC = p.clsdUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdUTC)),
                            CLSD_LCL = p.clsdLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.clsdLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.clsdLcl)),
                            LAST_TRANS_UTC = p.lastTransUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.lastTransUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastTransUTC)),
                            LAST_TRANS_LCL = p.lastTransLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.lastTransLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastTransLcl)),
                            LAST_UPDATED_UTC = p.lastUpdatedUTC == null ? (DateTime?)null : (Convert.ToDateTime(p.lastUpdatedUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastUpdatedUTC)),
                            LAST_UPDATED_LCL = p.lastUpdatedLcl == null ? (DateTime?)null : (Convert.ToDateTime(p.lastUpdatedLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(p.lastUpdatedLcl)),
                            CLSD_FLAG = p.clsdFlag,
                            GST_CNT = Convert.ToDecimal(p.gstCnt),
                            SUB_TTL = p.subTtl,
                            NON_TXBLSLS_TTL = Convert.ToDecimal(p.nonTxblSlsTtl),
                            CHK_TTL = Convert.ToDecimal(p.chkTtl),
                            DSC_TTL = Convert.ToDecimal(p.dscTtl),
                            PAY_TTL = Convert.ToDecimal(p.payTtl),
                            BAL_DUE_TTL = Convert.ToDecimal(p.balDueTtl),
                            RVC_NUM = p.rvcNum,
                            OT_NUM = Convert.ToDecimal(p.otNum),
                            TBL_NUM = p.tblNum,
                            TBL_NAME = p.tblName,
                            EMP_NUM = p.empNum,
                            XFER_STATUS = p.xferStatus,
                            XFER_TO_CHK_NUM = Convert.ToDecimal(p.xferToChkNum),
                            SVC_CHG_TTL = Convert.ToDecimal(p.svcChgTtl),
                            TIP_TOTAL = Convert.ToDecimal(p.tipTotal),
                            CHK_NAME = p.chkName,
                            CHK_REF = p.chkRef,
                            CANCEL_FLAG = p.cancelFlag,
                            SPLT_FRM_CHK = p.spltFrmChk
                        }).ToList();
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE_TYPE> _micros_Simphony_Guest_Checks_Detail_Line_Types = root.guestChecks.SelectMany(p => p.detailLines.Select(x => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE_TYPE
                        {
                            GUEST_CHECK_LINE_ITEM_ID = x.guestCheckLineItemId,
                            DTLOT_NUM = Convert.ToDecimal(x.dtlOtNum),
                            LINE_NUM = Convert.ToDecimal(x.lineNum),
                            DTL_ID = Convert.ToDecimal(x.dtlId),
                            DETAIL_UTC = x.detailUTC == null ? (DateTime?)null : (Convert.ToDateTime(x.detailUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.detailUTC)),
                            DETAIL_LCL = x.detailLcl == null ? (DateTime?)null : (Convert.ToDateTime(x.detailLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.detailLcl)),
                            LAST_UPDATE_UTC = x.lastUpdateUTC == null ? (DateTime?)null : (Convert.ToDateTime(x.lastUpdateUTC) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.lastUpdateUTC)),
                            LAST_UPDATE_LCL = x.lastUpdateLcl == null ? (DateTime?)null : (Convert.ToDateTime(x.lastUpdateLcl) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.lastUpdateLcl)),
                            BUS_DT = x.busDt == null ? (DateTime?)null : (Convert.ToDateTime(x.busDt) == Convert.ToDateTime("1/1/0001 12:00:00 AM") ? (DateTime?)null : Convert.ToDateTime(x.busDt)),
                            WS_NUM = Convert.ToDecimal(x.wsNum),
                            DSP_TTL = Convert.ToDecimal(x.dspTtl),
                            DSP_QTY = Convert.ToDecimal(x.dspQty),
                            AGG_TTL = Convert.ToDecimal(x.aggTtl),
                            AGG_QTY = Convert.ToDecimal(x.aggQty),
                            CHK_EMP_ID = Convert.ToDecimal(x.chkEmpId),
                            CHK_EMP_NUM = Convert.ToDecimal(x.chkEmpNum),
                            SVC_RND_NUM = Convert.ToDecimal(x.svcRndNum),
                            PAR_DTL_ID = Convert.ToDecimal(x.parDtlId),
                            TRANS_EMP_ID = Convert.ToDecimal(x.transEmpId) == 0 ? Convert.ToDecimal(x.chkEmpId) : Convert.ToDecimal(x.transEmpId),
                            TRANS_EMP_NUM = Convert.ToDecimal(x.transEmpNum) == 0 ? Convert.ToDecimal(x.chkEmpId) : Convert.ToDecimal(x.transEmpNum),
                            REF_INF_O1 = x.refInfo1,
                            DO_NOT_SHOW_FLAG = x.doNotShowFlag == true ? true : false,
                            ERRCOR_FLAG = x.errCorFlag == true ? true : false,
                            MGR_EMP_ID = Convert.ToDecimal(x.mgrEmpId),
                            MGR_EMP_NUM = Convert.ToDecimal(x.mgrEmpNum),
                            VD_FLAG = x.vdFlag == true ? true : false,
                            RSN_CODE_NUM = Convert.ToDecimal(x.rsnCodeNum),
                            MENU_ITEM_MI_NUM = x.menuItem != null ? x.menuItem.miNum : (int?)null,
                            MENU_ITEM_ACTIVE_TAXES = x.menuItem != null ? x.menuItem.activeTaxes : "",
                            MENU_ITEM_PRC_LVL = x.menuItem != null ? x.menuItem.prcLvl : (int?)null,
                            TENDER_MEDIA_TMED_NUM = x.tenderMedia != null ? x.tenderMedia.tmedNum : (decimal?)null,
                            OTHER_DETAIL_TYPE = x.other != null ? x.other.detailType : (decimal?)null,
                            OTHER_DETAIL_NUM = x.other != null ? x.other.detailNum : (decimal?)null,
                            SERVICE_CHARGE_SVC_CHG_NUM = x.serviceCharge != null ? x.serviceCharge.svcChgNum : (decimal?)null,
                            DISCOUNT_DSC_NUM = x.discount != null ? x.discount.dscNum : (decimal?)null,
                            DISCOUNT_DSC_MI_NUM = x.discount != null ? x.discount.dscMiNum : (decimal?)null,
                            DISCOUNT_ACTIVE_TAXES = x.discount != null ? x.discount.activeTaxes : "",
                            ERROR_CORRECT_TYPE = x.errorCorrect != null ? x.errorCorrect.type : (decimal?)null,
                            ERROR_CORRECT_OBJECT_NUM = x.errorCorrect != null ? x.errorCorrect.objectNum : (decimal?)null,
                            REF_GUEST_CHECK_ID = p.guestCheckId

                        })).ToList();
                        IList<SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TAXES_TYPE> _micros_Simphony_Guest_checks_Taxes_Types = root.guestChecks.SelectMany(p => p.taxes.Select(x => new SIMPHONY_TABLES.MICROS_SIMPHONY_GUEST_CHECKS_TAXES_TYPE
                        {
                            TAX_NUM = x.taxNum,
                            TX_BLSLS_TTL = x.txblSlsTtl,
                            TAX_COLL_TTL = x.taxCollTtl,
                            TAX_RATE = x.taxRate,
                            TYPE = x.type,
                            REF_GUEST_CHECK_ID = p.guestCheckId
                        })).ToList();
                        _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Guest_Checks_Type);
                        _simphony_tables.DATATABLE_SIMPHONY_2 = ToDataTables(_micros_Simphony_Guest_Checks_Detail_Line_Types);
                        _simphony_tables.DATATABLE_SIMPHONY_3 = ToDataTables(_micros_Simphony_Guest_checks_Taxes_Types);
                    }

                    if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                    {
                        LogExceptions.LogInfo("micros_Simphony_Guest_Checks=" + _simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count);
                        GUEST_CHECK_ROW_COUNT = _simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count;
                        Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                        Obj.CashupModelObj.DATATABLE_2 = _simphony_tables.DATATABLE_SIMPHONY_2;
                        Obj.CashupModelObj.DATATABLE_3 = _simphony_tables.DATATABLE_SIMPHONY_3;
                        Obj.INS_UPD_MICROS_SIMPHONY_GUEST_CHECKS();
                        _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1, _simphony_tables.DATATABLE_SIMPHONY_2, _simphony_tables.DATATABLE_SIMPHONY_3 };
                        _Arr_Datatable_Name = new string[] { "Guest_Checks", "Checks_Detail_Line", "Guest_checks_Taxes" };
                        Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                        _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                        _simphony_tables.DATATABLE_SIMPHONY_2.Clear();
                        _simphony_tables.DATATABLE_SIMPHONY_3.Clear();
                    }
                    IS_Error_Ocurr = false;
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }
        }
        public void Get_Order_Type_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_OrderType root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();

                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_OrderType>(_parameters_URL_Locations[0] + "getOrderTypeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");

                    root = integrator.Post<SYMPHONY_MODEL.Root_OrderType>(_parameters_URL_Locations[0] + "getOrderTypeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_ORDER_TYPE> _micros_Simphony_Order_Types = root.orderTypes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_ORDER_TYPE
                    {
                        ORDER_TYPE_ORDER_NUMBER = p.num,
                        ORDER_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Order_Types);

                }
                else
                {
                    root = integrator.Post<SYMPHONY_MODEL.Root_OrderType>(_parameters_URL_Locations[0] + "getOrderTypeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_ORDER_TYPE> _micros_Simphony_Order_Types = root.orderTypes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_ORDER_TYPE
                    {
                        ORDER_TYPE_ORDER_NUMBER = p.num,
                        ORDER_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Order_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_ORDER();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Orders" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Reason_Code_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_ReasonCode root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_ReasonCode>(_parameters_URL_Locations[0] + "getReasonCodeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_ReasonCode>(_parameters_URL_Locations[0] + "getReasonCodeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_REASON_CODE_TYPE> _micros_Simphony_Reason_Types = root.reasonCodes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_REASON_CODE_TYPE
                    {
                        REASON_CODE_NUMBER = p.num,
                        REASON_CODE_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Reason_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_REASON_CODE_TYPE> _micros_Simphony_Reason_Types = root.reasonCodes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_REASON_CODE_TYPE
                    {
                        REASON_CODE_NUMBER = p.num,
                        REASON_CODE_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Simphony_Reason_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_REASON_CODE();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Reasons" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Revenue_Center_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_RevenueCenter root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_RevenueCenter>(_parameters_URL_Locations[0] + "getRevenueCenterDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_RevenueCenter>(_parameters_URL_Locations[0] + "getRevenueCenterDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_REVENUE_CENTER_TYPE> _micros_Revenue_Center_Types = root.revenueCenters.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_REVENUE_CENTER_TYPE
                    {
                        REVENUE_CENTER_NUMBER = p.num,
                        REVENUE_CENTER_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Revenue_Center_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_REVENUE_CENTER_TYPE> _micros_Revenue_Center_Types = root.revenueCenters.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_REVENUE_CENTER_TYPE
                    {
                        REVENUE_CENTER_NUMBER = p.num,
                        REVENUE_CENTER_NAME = p.name
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Revenue_Center_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_REVENUE_CENTER();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Revenue_Center" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Service_Charge_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_ServiceCharge root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_ServiceCharge>(_parameters_URL_Locations[0] + "getServiceChargeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_ServiceCharge>(_parameters_URL_Locations[0] + "getServiceChargeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_SERVICE_CHARGE_TYPE> _micros_Service_Charge_Types = root.serviceCharges.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_SERVICE_CHARGE_TYPE
                    {
                        SERVICE_CHARGE_NUMBER = p.num,
                        SERVICE_CHARGE_NAME = p.name,
                        SERVICE_CHARGE_POS_PERCENT = p.posPercent ?? (decimal?)null,
                        SERVICE_CHARGE_TIPS_FLAG = p.chrgTipsFlag == true ? true : false,
                        SERVICE_CHARGE_REV_FLAG = p.revFlag == true ? true : false
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Service_Charge_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_SERVICE_CHARGE_TYPE> _micros_Service_Charge_Types = root.serviceCharges.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_SERVICE_CHARGE_TYPE
                    {
                        SERVICE_CHARGE_NUMBER = p.num,
                        SERVICE_CHARGE_NAME = p.name,
                        SERVICE_CHARGE_POS_PERCENT = p.posPercent ?? (decimal?)null,
                        SERVICE_CHARGE_TIPS_FLAG = p.chrgTipsFlag == true ? true : false,
                        SERVICE_CHARGE_REV_FLAG = p.revFlag == true ? true : false
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Service_Charge_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_SERVICE_CHARGE();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Service_Charge" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Tax_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_Taxis root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_Taxis>(_parameters_URL_Locations[0] + "getTaxDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_Taxis>(_parameters_URL_Locations[0] + "getTaxDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_TAXES_TYPE> _micros_Taxis_Types = root.taxes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_TAXES_TYPE
                    {
                        TAXES_NUMBER = p.num,
                        TAXES_NAME = p.name,
                        TAXES_TYPE = p.type,
                        TAXES_TAX_RATE = p.taxRate

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Taxis_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_TAXES_TYPE> _micros_Taxis_Types = root.taxes.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_TAXES_TYPE
                    {
                        TAXES_NUMBER = p.num,
                        TAXES_NAME = p.name,
                        TAXES_TYPE = p.type,
                        TAXES_TAX_RATE = p.taxRate

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Taxis_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_TAXES();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Taxes" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Tender_Media_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_TenderMedia root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_TenderMedia>(_parameters_URL_Locations[0] + "getTenderMediaDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_TenderMedia>(_parameters_URL_Locations[0] + "getTenderMediaDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_TENDER_MEDIA_TYPE> _micros_Tender_Media_Types = root.tenderMedias.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_TENDER_MEDIA_TYPE
                    {
                        TENDER_MEDIA_NUMBER = p.num,
                        TENDER_MEDIA_NAME = p.name,
                        TENDER_MEDIA_TYPE = p.type

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Tender_Media_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_TENDER_MEDIA_TYPE> _micros_Tender_Media_Types = root.tenderMedias.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_TENDER_MEDIA_TYPE
                    {
                        TENDER_MEDIA_NUMBER = p.num,
                        TENDER_MEDIA_NAME = p.name,
                        TENDER_MEDIA_TYPE = p.type

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Tender_Media_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_TENDER_MEDIA();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Tender_Media" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Menu_Item_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_MenuItem root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_MenuItem>(_parameters_URL_Locations[0] + "getMenuItemDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_MenuItem>(_parameters_URL_Locations[0] + "getMenuItemDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_MENU_ITEM_TYPE> _micros_Menu_Tiems_Types = root.menuItems.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_MENU_ITEM_TYPE
                    {
                        MENU_ITEM_NUMBER = p.num,
                        MENU_ITEM_NAME = p.name,
                        MENU_ITEM_NAME_2 = p.name2,
                        MENU_ITEM_MAJ_GRP_NUM = p.majGrpNum,
                        MENU_ITEM_MAJ_GRP_NAME = p.majGrpName,
                        MENU_ITEM_FAM_GRP_NUM = p.famGrpNum,
                        MENU_ITEM_FAM_GRP_NAME = p.famGrpName

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Menu_Tiems_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_MENU_ITEM_TYPE> _micros_Menu_Tiems_Types = root.menuItems.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_MENU_ITEM_TYPE
                    {
                        MENU_ITEM_NUMBER = p.num,
                        MENU_ITEM_NAME = p.name,
                        MENU_ITEM_NAME_2 = p.name2,
                        MENU_ITEM_MAJ_GRP_NUM = p.majGrpNum,
                        MENU_ITEM_MAJ_GRP_NAME = p.majGrpName,
                        MENU_ITEM_FAM_GRP_NUM = p.famGrpNum,
                        MENU_ITEM_FAM_GRP_NAME = p.famGrpName

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Menu_Tiems_Types);

                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_MENU_ITEM();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Menu_Items" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Employee_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_Employee root;
            try
            {

                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_Employee>(_parameters_URL_Locations[0] + "getEmployeeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_Employee>(_parameters_URL_Locations[0] + "getEmployeeDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_EMPLOYEES_TYPE> _micros_Employee_Types = root.employees.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_EMPLOYEES_TYPE
                    {
                        NUM = p.num,
                        EMPLOYEE_ID = p.employeeId,
                        FIRST_NAME = p.fName,
                        LAST_NAME = p.lName,
                        PAYROLL_ID = Convert.ToString(p.payrollId) == "" ? "" : p.payrollId,
                        HOME_LOC_REF = p.homeLocRef,
                        CLASS_NUM = p.classNum,
                        CLASS_NAME = p.className

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Employee_Types);

                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_EMPLOYEES_TYPE> _micros_Epployee_Types = root.employees.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_EMPLOYEES_TYPE
                    {
                        NUM = p.num,
                        EMPLOYEE_ID = p.employeeId,
                        FIRST_NAME = p.fName,
                        LAST_NAME = p.lName,
                        PAYROLL_ID = Convert.ToString(p.payrollId) == "" ? "" : p.payrollId,
                        HOME_LOC_REF = p.homeLocRef,
                        CLASS_NUM = p.classNum,
                        CLASS_NAME = p.className

                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Epployee_Types);
                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_EMPLOYEES();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Employee" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }
        public void Get_Discount_Dimensions(DataTable Int_DataTable, DataTable dt_IntegrationDetails)
        {
            _header = new Dictionary<string, string>();
            _body = new Dictionary<string, string>();
            _queryString = new Dictionary<string, string>();
            SYMPHONY_MODEL.Root_Discount root;
            try
            {
                _parameters_URL_Locations = Convert.ToString(Int_DataTable.Rows[0]["USERID"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                _header.Add("Content-Type", "application/json");
                Dictionary<string, string> _bodyParameter = new Dictionary<string, string>();
                _bodyParameter.Add("locRef", _parameters_URL_Locations[1]);
                string _bodyJSON = Newtonsoft.Json.JsonConvert.SerializeObject(_bodyParameter);
                root = integrator.Post<SYMPHONY_MODEL.Root_Discount>(_parameters_URL_Locations[0] + "getDiscountDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                if (root.status == 401)
                {
                    GetRefreshToken_API(Int_DataTable.Rows[0], dt_IntegrationDetails);
                    _header = new Dictionary<string, string>();
                    _header.Add("Authorization", "Bearer " + _refreshTokenTable.Rows[0]["id_token"].ToString());
                    _header.Add("Content-Type", "application/json");
                    root = integrator.Post<SYMPHONY_MODEL.Root_Discount>(_parameters_URL_Locations[0] + "getDiscountDimensions", _header, _queryString, _body, _bodyJSON, null, "");
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_DISCOUNTS_TYPE> _micros_Discount_Types = root.discounts.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_DISCOUNTS_TYPE
                    {
                        NUM = p.num,
                        NAME = p.name,
                        POS_PERCENT = p.posPercent.Equals(null) ? 0 : p.posPercent
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Discount_Types);
                }
                else
                {
                    IList<SIMPHONY_TABLES.MICROS_SIMPHONY_DISCOUNTS_TYPE> _micros_Discount_Types = root.discounts.Select(p => new SIMPHONY_TABLES.MICROS_SIMPHONY_DISCOUNTS_TYPE
                    {
                        NUM = p.num,
                        NAME = p.name,
                        POS_PERCENT = p.posPercent.Equals(null) ? 0 : p.posPercent
                    }).ToList();
                    _simphony_tables.DATATABLE_SIMPHONY_1 = ToDataTables(_micros_Discount_Types);
                }
                if (_simphony_tables.DATATABLE_SIMPHONY_1.Rows.Count > 0)
                {
                    Obj.CashupModelObj.DATATABLE_1 = _simphony_tables.DATATABLE_SIMPHONY_1;
                    Obj.INS_UPD_MICROS_SIMPHONY_DISCOUNTS();
                    _Arr_Datatable = new DataTable[] { _simphony_tables.DATATABLE_SIMPHONY_1 };
                    _Arr_Datatable_Name = new string[] { "Discount" };
                    Add_Table_in_Ds_With_Name(_Arr_Datatable, _Arr_Datatable_Name);
                    _simphony_tables.DATATABLE_SIMPHONY_1.Clear();
                }
            }
            catch (Exception ex)
            {
                IS_Error_Ocurr = true;
                throw ex;
            }

        }



        public DataTable ToDataTables<T>(IList<T> data)
        {
            PropertyDescriptorCollection props = TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prp = props[i];
                table.Columns.Add(prp.Name, Nullable.GetUnderlyingType(prp.PropertyType) ?? prp.PropertyType);
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
        public void GetRefreshToken_API(DataRow dataRow, DataTable dt_IntegrationDetails, bool IS_OUTBOUND = false)
        {
            int Refreshtokencount = 0;
        RefreshToken:

            Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = 27;
            Obj.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dataRow["CUSTOMER_ID"]);
            Obj.CashupModelObj.ENTITY_ID = Convert.ToInt32(dataRow["ENTITY_ID"]);
            Obj.CashupModelObj.BRANCH_ID = Convert.ToInt32(dataRow["BRANCH_ID"]);
            Obj.CashupModelObj.USERID = Convert.ToString(dataRow["USERID"]);
            DataTable dt_RecordsToUpdate = Obj.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH();

            DataTable dt_RecordsToUpdate_1 = dt_RecordsToUpdate.Select("IS_OUTBOUND = '" + IS_OUTBOUND + "' and BRANCH_ID = " + Convert.ToInt32(dataRow["BRANCH_ID"])).CopyToDataTable();
            string URL = dataRow["URL_PATH"].ToString();// + "/oidc-provider/v1/oauth2/token";// "https://mte4-ohra-idm.oracleindustry.com/oidc-provider/v1/oauth2/token";

            parameters = Convert.ToString(dt_RecordsToUpdate_1.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);

            string _tenantID = parameters[0];
            _refresh_token = parameters[1];

            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            LogExceptions.LogInfo("Previous refresh token:-" + _refresh_token);


            var client = new RestClient(URL.Trim());
            var request = new RestRequest(Method.POST);
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("scope", "openid");
            request.AddParameter("grant_type", "refresh_token");
            request.AddParameter("client_id", _tenantID);
            request.AddParameter("refresh_token", _refresh_token);
            request.AddParameter("redirect_uri", "apiaccount://callback");
            IRestResponse response_Token = client.Execute(request);

            try
            {
                Root_Access_Token Access_tokenobj = JsonConvert.DeserializeObject<Root_Access_Token>(response_Token.Content.ToString());
                if (response_Token.StatusCode.ToString().ToLower() == "ok")
                {
                    {
                        if (Convert.ToString(dt_RecordsToUpdate_1.Rows[0]["URL_PARAMETERS"].ToString()).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries).Length > 4)
                        {
                            foreach (DataRow dr in dt_IntegrationDetails.Select("IS_OUTBOUND = '" + IS_OUTBOUND + "' and INTEGRATION_SYSTEM_ID=27").CopyToDataTable().Rows)
                            {
                                string[] _temp_parameters = Convert.ToString(dr["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                                string _temp_TenantId = _temp_parameters[0];
                                Obj.CashupModelObj.TABLE_ID = Convert.ToInt32(dr["TABLE_ID"]);
                                Obj.CashupModelObj.ENTITY_ID = Convert.ToInt32(dr["ENTITY_ID"]);
                                Obj.CashupModelObj.BRANCH_ID = Convert.ToInt32(dr["BRANCH_ID"]);
                                Obj.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dr["CUSTOMER_ID"]);
                                string _upid = _temp_parameters[2];
                                Obj.CashupModelObj.URL_PARAMETERS = _temp_TenantId + ":;:" + Convert.ToString(Access_tokenobj.refresh_token) + ":;:" + _upid + ":;:" + _temp_parameters[3] + ":;:" + _temp_parameters[4];
                                Obj.CashupModelObj.API_KEY = Convert.ToString(Access_tokenobj.access_token);
                                Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]);
                                Obj.CashupModelObj.USER_ID = 1;
                                Obj.CashupModelObj.URL_PATH = Convert.ToString(dataRow["URL_PATH"]);
                                Obj.CashupModelObj.INTEGRATION_TYPE_ID = Convert.ToInt32(dr["INTEGRATION_TYPE_ID"]);
                                Obj.CashupModelObj.GROUP_ID = dr["GROUP_ID"] is DBNull ? (int?)null : Convert.ToInt32(dr["GROUP_ID"]);
                                int i = Obj.UPD_INTEGRATION_TOKENS();
                            }
                        }
                        else
                        {
                            foreach (DataRow dr in dt_RecordsToUpdate.Rows)
                            {
                                string[] _temp_parameters = Convert.ToString(dr["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                                string _temp_TenantId = _temp_parameters[0];
                                if (_temp_TenantId == _tenantID)
                                {
                                    Obj.CashupModelObj.TABLE_ID = Convert.ToInt32(dr["TABLE_ID"]);
                                    Obj.CashupModelObj.ENTITY_ID = Convert.ToInt32(dr["ENTITY_ID"]);
                                    Obj.CashupModelObj.BRANCH_ID = Convert.ToInt32(dr["BRANCH_ID"]);
                                    Obj.CashupModelObj.CUSTOMER_ID = Convert.ToInt32(dr["CUSTOMER_ID"]);
                                    string _upid = _temp_parameters[2];
                                    if (_temp_parameters.Length > 4)
                                        Obj.CashupModelObj.URL_PARAMETERS = _temp_TenantId + ":;:" + Convert.ToString(Access_tokenobj.refresh_token) + ":;:" + _upid + ":;:" + _temp_parameters[3] + ":;:" + _temp_parameters[4];
                                    else
                                        Obj.CashupModelObj.URL_PARAMETERS = _temp_TenantId + ":;:" + Convert.ToString(Access_tokenobj.refresh_token) + ":;:" + _upid + ":;:" + _temp_parameters[3];
                                    Obj.CashupModelObj.API_KEY = Convert.ToString(Access_tokenobj.access_token);
                                    Obj.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(dr["INTEGRATION_SYSTEM_ID"]);
                                    Obj.CashupModelObj.USER_ID = 1;
                                    Obj.CashupModelObj.URL_PATH = Convert.ToString(dataRow["URL_PATH"]);
                                    Obj.CashupModelObj.INTEGRATION_TYPE_ID = Convert.ToInt32(dr["INTEGRATION_TYPE_ID"]);
                                    Obj.CashupModelObj.GROUP_ID = dr["GROUP_ID"] is DBNull ? (int?)null : Convert.ToInt32(dr["GROUP_ID"]);
                                    int i = Obj.UPD_INTEGRATION_TOKENS();
                                }

                            }
                        }
                    }
                }
                else
                {
                    if (Refreshtokencount < 2)
                    {
                        LogExceptions.LogInfo("Putting To Sleep");
                        System.Threading.Thread.Sleep(10000);
                        Refreshtokencount++;
                        goto RefreshToken;
                    }
                }

                _symphonyId = parameters[0];

                _refreshTokenTable = CREATE_REFRESHTOKEN_TABLE();
                DataRow TOKEN_DR = _refreshTokenTable.NewRow();
                TOKEN_DR["id_token"] = Convert.ToString(Access_tokenobj.id_token);
                TOKEN_DR["access_token"] = Convert.ToString(Access_tokenobj.access_token);
                TOKEN_DR["expires_in"] = "1800";
                TOKEN_DR["token_type"] = "Bearer";
                TOKEN_DR["refresh_token"] = Convert.ToString(Access_tokenobj.refresh_token);
                TOKEN_DR["scope"] = "";
                TOKEN_DR["error"] = "";
                _refreshTokenTable.Rows.Add(TOKEN_DR);
                Obj.CashupModelObj.SYMPHONY_REFRESH_TOKEN_DT = _refreshTokenTable;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public void Add_Table_in_Ds_With_Name(DataTable[] dtList, string[] dtName)
        {
            DataTable _Temp = new DataTable();
            int counter = 0;
            foreach (DataTable dtData in dtList)
            {
                dtData.TableName = dtName[counter];
                _COMMON_DS.Tables.Add(dtData.Copy());
                counter++;
            }
        }

    }
}
