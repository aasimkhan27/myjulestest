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
namespace EPOS_Integration.SIMPHONY
{
    public class EPOS_SALES_SIMPHONY<T>
    {
        string[] _stringSeparators = new string[] { ":;:" };
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_Symphony(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SQ_DATA = data as DataSet;
            try
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(SQ_DATA as DataSet, _ICashUp, Integration_Dt);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
                LogExceptions.LogError("Transform_Symphony - SYMPHONY - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_Symphony - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            { 
                string[] _tempParameter = Convert.ToString(Integration_Dt.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                if (Root.Tables["Guest_Checks"].Select().Count() > 0)
                {
                    foreach (DataRow HEADER in Root.Tables["Guest_Checks"].Rows)
                    {
                        // Added by Arvind
                        DateTime CashDate = _ICashUp.CashupModelObj.CASHUP_DATE.Date;
                        DateTime Open_Date = Convert.ToDateTime(HEADER["OPN_UTC"]);
                        DateTime CloseDate = Convert.ToDateTime(HEADER["CLSD_UTC"]).Date;
                        if (CashDate == Open_Date.Date)
                        {
                            FillLines(Root, HEADER["GUEST_CHECK_ID"].ToString(), _ICashUp, Integration_Dt);
                            FillPayments(Root, HEADER["GUEST_CHECK_ID"].ToString(), _ICashUp, Integration_Dt);
                            DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                            DataTable PAYMENT_LINE = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Copy();
                            DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                            DR_SQ_HEADER["CHECK_ID"] = HEADER["GUEST_CHECK_ID"];
                            DR_SQ_HEADER["CHECK_NO"] = HEADER["CHK_NUM"];
                            DR_SQ_HEADER["OPEN_TIME"] = HEADER["OPN_UTC"];
                            DR_SQ_HEADER["CLOSE_TIME"] = HEADER["CLSD_UTC"];
                            DR_SQ_HEADER["COVERS"] = HEADER["GST_CNT"];
                            var revenueCenterRows = Root.Tables["Revenue_Center"].Select($"REVENUE_CENTER_NUMBER = '{HEADER["RVC_NUM"]}'");
                            DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["RVC_NUM"];
                            DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = revenueCenterRows.Length > 0 ? revenueCenterRows[0]["REVENUE_CENTER_NAME"] : DBNull.Value;
                            var serveModeRows = Root.Tables["Orders"].Select($"ORDER_TYPE_ORDER_NUMBER = '{HEADER["OT_NUM"]}'");
                            DR_SQ_HEADER["SERVE_MODE"] = serveModeRows.Length > 0 ? serveModeRows[0]["ORDER_NAME"] : DBNull.Value;
                            DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                            DR_SQ_HEADER["TAX"] = (SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0);
                            DR_SQ_HEADER["GROSS"] = Convert.ToDecimal(DR_SQ_HEADER["NET"]) + Convert.ToDecimal(DR_SQ_HEADER["TAX"]);
                            DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                            DR_SQ_HEADER["COMP"] = 0;
                            decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;
                            DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                            var guestCheckRows = Root.Tables["Guest_Checks"].Select("GUEST_CHECK_ID = '" + HEADER["GUEST_CHECK_ID"] + "'");
                            if (guestCheckRows.Length > 0)
                            {
                                decimal tipTotal = 0;
                                var guestCheckTable = guestCheckRows.CopyToDataTable();
                                tipTotal = guestCheckTable.Columns.Contains("TIP_TOTAL") ? Convert.ToDecimal(guestCheckTable.Compute("SUM(TIP_TOTAL)", String.Empty)) : 0;
                                var svcChgTotal = guestCheckTable.Columns.Contains("SVC_CHG_TTL") ? Convert.ToDecimal(guestCheckTable.Compute("SUM(SVC_CHG_TTL)", "").ToString() ?? "0") : 0m;
                                if (Convert.ToDecimal(_tempParameter[2]) == 0)
                                {
                                    DR_SQ_HEADER["TIPS"] = PAYMENT_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(PAYMENT_LINE.Select("CHECK_ID='" + HEADER["GUEST_CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TIPS)", string.Empty)) : 0;
                                    DR_SQ_HEADER["SERVICE_CHARGE"] = tipTotal;
                                }
                                else if (Convert.ToDecimal(_tempParameter[2]) == 1)
                                {
                                    DR_SQ_HEADER["TIPS"] = tipTotal;
                                    DR_SQ_HEADER["SERVICE_CHARGE"] = svcChgTotal - tipTotal;
                                }
                            }
                            else
                            {
                                DR_SQ_HEADER["TIPS"] = 0m;
                                DR_SQ_HEADER["SERVICE_CHARGE"] = 0m;
                            }
                            DR_SQ_HEADER["DONATION"] = 0;
                            DR_SQ_HEADER["CURRENCY"] = null;
                            DR_SQ_HEADER["IS_TRAINING"] = 0;
                            DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = 27;
                            var employeeRows = Root.Tables["Employee"].Select($"NUM = '{HEADER["EMP_NUM"]}'");
                            if (employeeRows.Length > 0)
                            {
                                var employee = employeeRows[0];
                                DR_SQ_HEADER["STAFF_ID"] = employee["EMPLOYEE_ID"];
                                var firstName = employee.Table.Columns.Contains("FIRST_NAME") && employee["FIRST_NAME"] != DBNull.Value ? employee["FIRST_NAME"].ToString() : string.Empty;
                                var lastName = employee.Table.Columns.Contains("LAST_NAME") && employee["LAST_NAME"] != DBNull.Value ? employee["LAST_NAME"].ToString() : string.Empty;
                                DR_SQ_HEADER["STAFF_NAME"] = $"{firstName} {lastName}".Trim();
                            }
                            else
                            {
                                DR_SQ_HEADER["STAFF_ID"] = DBNull.Value;
                                DR_SQ_HEADER["STAFF_NAME"] = DBNull.Value;
                            }
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                            FillDiscounts(Root, HEADER["GUEST_CHECK_ID"].ToString(), _ICashUp);
                        }
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        DataTable FillLines(DataSet Root, string Header_Id, Cashup _ICashUp, DataTable Integration_Dt)
        { 
            string[] _tempParameter = Convert.ToString(Integration_Dt.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
            try
            {
                
                if (Root.Tables["Checks_Detail_Line"].Select($"REF_GUEST_CHECK_ID = '{Header_Id}'").Count() > 0)
                    {

                        var discounts = (from msgcdl in Root.Tables["Checks_Detail_Line"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal>("REF_GUEST_CHECK_ID")) == Header_Id)
                                         where msgcdl.Field<decimal?>("DISCOUNT_DSC_NUM") != null
                                         join msgc in Root.Tables["Guest_Checks"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal>("GUEST_CHECK_ID")) == Header_Id) on msgcdl.Field<decimal>("REF_GUEST_CHECK_ID") equals msgc.Field<decimal>("GUEST_CHECK_ID")
                                         join msd in Root.Tables["Discount"].AsEnumerable() on Convert.ToDecimal(msgcdl.Field<decimal?>("DISCOUNT_DSC_NUM")) equals Convert.ToDecimal(msd.Field<int>("NUM"))
                                         group new { msgcdl, msd } by new
                                         { GUEST_CHECKS_ID = msgcdl.Field<decimal>("REF_GUEST_CHECK_ID"), PAR_DTL_ID = msgcdl.Field<decimal>("PAR_DTL_ID") } into g
                                         where g.Sum(x => x.msgcdl.Field<decimal?>("AGG_TTL") ?? 0) != 0
                                         select new { REF_GUEST_CHECK_ID = g.Key.GUEST_CHECKS_ID, PAR_DTL_ID = g.Key.PAR_DTL_ID, DISCOUNT_ID = string.Join(",", g.Select(x => x.msd.Field<int>("NUM").ToString()).Distinct()), DISCOUNT_REASON = string.Join(",", g.Select(x => x.msd.Field<string>("NAME")).Distinct()), AGG_TTL = g.Sum(x => x.msgcdl.Field<decimal?>("AGG_TTL") ?? 0), POS_PERCENT = Math.Min(100m, g.Sum(x => x.msd.Field<decimal?>("POS_PERCENT") ?? 0)) }).ToList();

                        var result = (from msgc in Root.Tables["Guest_Checks"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal>("GUEST_CHECK_ID")) == Header_Id)
                                      join msgcdl in Root.Tables["Checks_Detail_Line"].AsEnumerable() on Convert.ToDecimal(msgc.Field<object>("GUEST_CHECK_ID")) equals Convert.ToDecimal(msgcdl.Field<object>("REF_GUEST_CHECK_ID"))
                                      join msmi in Root.Tables["Menu_Items"].AsEnumerable() on Convert.ToDecimal(msgcdl.Field<int?>("MENU_ITEM_MI_NUM")) equals msmi.Field<decimal>("MENU_ITEM_NUMBER")
                                      join msrc in Root.Tables["Revenue_Center"].AsEnumerable() on Convert.ToDecimal(msgc.Field<object>("RVC_NUM")) equals Convert.ToDecimal(msrc.Field<object>("REVENUE_CENTER_NUMBER"))
                                      join mse in Root.Tables["Employee"].AsEnumerable() on Convert.ToDecimal(msgcdl.Field<object>("TRANS_EMP_ID")) equals Convert.ToDecimal(mse.Field<object>("EMPLOYEE_ID"))
                                      join discJoin in discounts on new { GUEST_CHECKS_ID = Convert.ToDecimal(msgc.Field<object>("GUEST_CHECK_ID")), PAR_DTL_ID = Convert.ToDecimal(msgcdl.Field<object>("DTL_ID")) }
                                      equals new { GUEST_CHECKS_ID = discJoin.REF_GUEST_CHECK_ID, PAR_DTL_ID = discJoin.PAR_DTL_ID } into discGroup
                                      from disc in discGroup.DefaultIfEmpty()
                                      let activeTaxes = msgcdl.Field<string>("MENU_ITEM_ACTIVE_TAXES")?.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries)
                                      let taxNumbers = activeTaxes != null ? activeTaxes.Select(taxStr => int.TryParse(taxStr.Trim(), out var num) ? (int?)num : null).Where(x => x.HasValue).Select(x => x.Value).ToList() : new List<int>()
                                      let totalTaxRate = taxNumbers.Any() ? Root.Tables["Taxes"].AsEnumerable().Where(row => taxNumbers.Contains(Convert.ToInt32(row.Field<object>("TAXES_NUMBER")))).Sum(row => row.IsNull("TAXES_TAX_RATE") ? 0 : Math.Round(row.Field<decimal>("TAXES_TAX_RATE"), 0)) : 0m
                                      join msrcvJoin in Root.Tables["Reasons"].AsEnumerable() on Convert.ToDecimal(msgcdl.Field<object>("RSN_CODE_NUM") ?? 0) equals Convert.ToDecimal(msrcvJoin.Field<object>("REASON_CODE_NUMBER")) into reasonGroup
                                      from msrcv in reasonGroup.DefaultIfEmpty()
                                      where msmi.Field<int>("MENU_ITEM_MAJ_GRP_NUM") != 99 && !(msgcdl.Field<bool?>("ERRCOR_FLAG") ?? false) && !((msgcdl.Field<bool?>("DO_NOT_SHOW_FLAG") ?? false) && msgcdl.Field<object>("MENU_ITEM_MI_NUM") != null)
                                      select new { CHECK_ID = Convert.ToDecimal(msgc.Field<object>("GUEST_CHECK_ID")), REVENUE_CENTER_ID = Convert.ToDecimal(msrc.Field<object>("REVENUE_CENTER_NUMBER")), REVENUE_CENTER = msrc.Field<string>("REVENUE_CENTER_NAME"), ACCOUNT_GROUP_ID = Convert.ToDecimal(msmi.Field<object>("MENU_ITEM_MAJ_GRP_NUM")), ACCOUNT_GROUP_CODE = Convert.ToDecimal(msmi.Field<object>("MENU_ITEM_MAJ_GRP_NUM")),
                                          ACCOUNT_GROUP_NAME = msmi.Field<string>("MENU_ITEM_MAJ_GRP_NAME"), CATEGORY_ID = Convert.ToDecimal(msmi.Field<object>("MENU_ITEM_MAJ_GRP_NUM")), CATEGORY_CODE = Convert.ToDecimal(msmi.Field<object>("MENU_ITEM_MAJ_GRP_NUM")),
                                          CATEGORY_NAME = msmi.Field<string>("MENU_ITEM_MAJ_GRP_NAME"), PRODUCT_SKU = Convert.ToDecimal(msmi.Field<object>("MENU_ITEM_NUMBER")), PRODUCT_NAME = msmi.Field<string>("MENU_ITEM_NAME"),
                                          QUANTITY = Convert.ToDecimal(msgcdl.Field<object>("DSP_QTY")), NET = (Convert.ToDecimal(_tempParameter[2]) == 0 ? (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) : (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) / (1 + (totalTaxRate * 0.01m))),
                                          TAX = (Convert.ToDecimal(_tempParameter[2]) == 0 ? (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) * (totalTaxRate * 0.01m) : ((Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) / (1 + (totalTaxRate * 0.01m))) * (totalTaxRate * 0.01m)),
                                          GROSS = (Convert.ToDecimal(_tempParameter[2]) == 0 ? (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) * (1 + (totalTaxRate * 0.01m)) : (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0))),
                                          DISCOUNT = (disc?.AGG_TTL ?? 0) * -1,
                                          COMP = 0,
                                          VOID = (msgcdl.Field<bool?>("VD_FLAG") ?? false) ? (Convert.ToDecimal(_tempParameter[2]) == 0 ? (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0)) * (1 + (totalTaxRate * 0.01m)) : (Convert.ToDecimal(msgcdl.Field<object>("DSP_TTL")) + (disc?.AGG_TTL ?? 0))) : 0,
                                          TIME_OF_SALE = msgcdl.Field<DateTime>("DETAIL_UTC"),
                                          STAFF_ID = Convert.ToString(msgcdl.Field<object>("TRANS_EMP_ID")),
                                          STAFF_NAME = (mse.Field<string>("FIRST_NAME") ?? "") + " " + (mse.Field<string>("LAST_NAME") ?? ""),
                                          VOID_ID = (msgcdl.Field<bool?>("VD_FLAG") ?? false) ? msgcdl.Field<decimal?>("RSN_CODE_NUM") : null,
                                          VOID_REASON = msrcv?.Field<string>("REASON_CODE_NAME"),
                                          DISCOUNT_ID = disc?.DISCOUNT_ID,
                                          DISCOUNT_REASON = disc?.DISCOUNT_REASON,
                                          DISCOUNT_RATE = disc != null ? (disc.POS_PERCENT == 0 ? (Convert.ToDecimal(disc.AGG_TTL) * -1 / (msgcdl.Field<decimal?>("DSP_TTL") ?? 1)) * 100 : disc.POS_PERCENT) : 0,
                                          TAX_RATE = totalTaxRate,
                                          LINE_NUM = Convert.ToDecimal(msgcdl.Field<object>("LINE_NUM"))
                                      }).ToList();
                        foreach (var DR_LINE in result)
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = DR_LINE.CHECK_ID;
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE.REVENUE_CENTER_ID;
                            DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE.REVENUE_CENTER;
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE.ACCOUNT_GROUP_ID;
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE.ACCOUNT_GROUP_CODE;
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE.ACCOUNT_GROUP_NAME;
                            DR_SQ_LINE["CATEGORY_ID"] = DR_LINE.CATEGORY_ID;
                            DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE.CATEGORY_CODE;
                            DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE.CATEGORY_NAME;
                            DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE.PRODUCT_SKU;
                            DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE.PRODUCT_NAME;
                            DR_SQ_LINE["QUANITY"] = DR_LINE.QUANTITY;
                        // This is for clap where subtotl amount included 5% vat. to calculate net and tax , first deduct 5% tax then calculate net by net*( 5%(vat)+7%(municipat tax)=12%=0.12)
                        if (_ICashUp.CashupModelObj.ENTITY_ID == 54)
                        {
                            decimal Net = Convert.ToDecimal(DR_LINE.GROSS) / 1.05M;
                            DR_SQ_LINE["NET"] = Net;
                            DR_SQ_LINE["TAX"] = Net * 0.12m;
                            DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_SQ_LINE["NET"]) + Convert.ToDecimal(DR_SQ_LINE["TAX"]);
                        }
                        else
                        {
                            DR_SQ_LINE["NET"] = DR_LINE.NET;
                            DR_SQ_LINE["TAX"] = DR_LINE.TAX;
                            DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_LINE.NET + DR_LINE.TAX);
                        }
                            DR_SQ_LINE["DISCOUNT"] = DR_LINE.DISCOUNT;
                            DR_SQ_LINE["COMP"] = DR_LINE.COMP;
                            DR_SQ_LINE["VOID"] = DR_LINE.VOID;
                            DR_SQ_LINE["TIME_OF_SALE"] = DR_LINE.TIME_OF_SALE;
                            DR_SQ_LINE["STAFF_ID"] = DR_LINE.STAFF_ID;
                            DR_SQ_LINE["STAFF_NAME"] = DR_LINE.STAFF_NAME;
                            DR_SQ_LINE["VOID_ID"] = DR_LINE.VOID_ID ?? (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = DR_LINE.VOID_REASON ?? (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_ID"] = DR_LINE.DISCOUNT_ID ?? (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_REASON"] = DR_LINE.DISCOUNT_REASON ?? (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_RATE"] = DR_LINE.DISCOUNT_RATE;
                            DR_SQ_LINE["TAX_RATE"] = DR_LINE.TAX_RATE;

                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        }
                    }
                 
                var taxRows = Root.Tables["Guest_Checks_Taxes"].AsEnumerable().Where(row => Convert.ToString(row["REF_GUEST_CHECK_ID"]) == Convert.ToString(Header_Id) && Convert.ToDecimal(row["TAX_NUM"]) == 7).ToList();
                decimal taxCollTtl = taxRows.Any() ? Convert.ToDecimal(taxRows.Sum(p => p.Field<decimal>("TAX_COLL_TTL"))) : 0;
                if (taxCollTtl != 0)
                {
                    DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                    DR_SQ_LINE["CHECK_ID"] = Header_Id;
                    DR_SQ_LINE["REVENUE_CENTER_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["REVENUE_CENTER"] = (object)DBNull.Value;
                    DR_SQ_LINE["ACCOUNT_GROUP_ID"] = "VAT ON SERVICE CHARGE";
                    DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = "VAT ON SERVICE CHARGE";
                    DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = "VAT ON SERVICE CHARGE";
                    DR_SQ_LINE["CATEGORY_ID"] = "VAT ON SERVICE CHARGE";
                    DR_SQ_LINE["CATEGORY_CODE"] = "VAT ON SERVICE CHARGE";
                    DR_SQ_LINE["CATEGORY_NAME"] = "VAT ON SERVICE CHARGE"; ;
                    DR_SQ_LINE["PRODUCT_SKU"] = "";
                    DR_SQ_LINE["PRODUCT_NAME"] = "";
                    DR_SQ_LINE["QUANITY"] = 0;
                    DR_SQ_LINE["NET"] = 0;
                    DR_SQ_LINE["TAX"] = taxCollTtl;
                    DR_SQ_LINE["GROSS"] = 0;
                    DR_SQ_LINE["DISCOUNT"] = 0;
                    DR_SQ_LINE["COMP"] = 0;
                    DR_SQ_LINE["VOID"] = 0;
                    DR_SQ_LINE["TIME_OF_SALE"] = (object)DBNull.Value;
                    DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                    DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                    DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                    DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                    DR_SQ_LINE["TAX_RATE"] = 0;

                    _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                }
               
                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillPayments(DataSet Root, string Header_Id, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            { 
                string[] _tempParameter = Convert.ToString(Integration_Dt.Rows[0]["URL_PARAMETERS"]).Split(_stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                if (Root.Tables["Guest_Checks"].Select($"GUEST_CHECK_ID = '{Header_Id}'").Count() > 0)
                {
                    if (Root.Tables["Checks_Detail_Line"].Select($"REF_GUEST_CHECK_ID = '{Header_Id}'").Count() > 0)
                    {

                        foreach (DataRow DR in Root.Tables["Guest_Checks"].Select($"GUEST_CHECK_ID = '{Header_Id}'").CopyToDataTable().Rows)
                        {
                            if (DR["SUB_TTL"] != DBNull.Value && Convert.ToDecimal(DR["SUB_TTL"]) > 0)
                            {
                                var payments = (from msgc in Root.Tables["Guest_Checks"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal>("GUEST_CHECK_ID")) == Header_Id)
                                                join msgcdl in Root.Tables["Checks_Detail_Line"].AsEnumerable() on msgc.Field<decimal>("GUEST_CHECK_ID") equals msgcdl.Field<decimal>("REF_GUEST_CHECK_ID")
                                                join mstm in Root.Tables["Tender_Media"].AsEnumerable() on (msgcdl.Field<decimal?>("TENDER_MEDIA_TMED_NUM") ?? 0) equals mstm.Field<decimal>("TENDER_MEDIA_NUMBER")
                                                where (msgcdl.Field<decimal?>("TENDER_MEDIA_TMED_NUM") != null) && mstm.Field<int>("TENDER_MEDIA_TYPE") == 1 && (msgc.Field<decimal?>("SUB_TTL") ?? 0) > 0
                                                select new { CHECK_ID = msgc.Field<decimal>("GUEST_CHECK_ID"), PAYMENT_METHOD_ID = msgcdl.Field<decimal?>("TENDER_MEDIA_TMED_NUM") ?? 0, PAYMENT_METHOD_CODE = mstm.Field<string>("TENDER_MEDIA_NAME"), PAYMENT_METHOD_DESC = mstm.Field<string>("TENDER_MEDIA_NAME"), TOTAL_AMOUNT_WITH_TIPS = msgcdl.Field<decimal?>("DSP_TTL") ?? 0, TIPS = 0m }).ToList();

                                foreach (var DR_PAY in payments)
                                {
                                    DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                                    DR_PAYMENT["CHECK_ID"] = DR_PAY.CHECK_ID;
                                    DR_PAYMENT["PAYMENT_METHOD_ID"] = DR_PAY.PAYMENT_METHOD_ID;
                                    DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR_PAY.PAYMENT_METHOD_CODE;
                                    DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR_PAY.PAYMENT_METHOD_DESC;
                                    DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = DR_PAY.TOTAL_AMOUNT_WITH_TIPS;
                                    DR_PAYMENT["TIPS"] = DR_PAY.TIPS;
                                    _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                                }
                            }
                            else if (DR["SUB_TTL"] != DBNull.Value && Convert.ToDecimal(DR["SUB_TTL"]) == 0 && Convert.ToDecimal(DR["CHK_TTL"]) > 0)
                            {
                                //var payments = (from msgc in Root.Tables["Guest_Checks"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal>("GUEST_CHECK_ID")) == Header_Id)
                                //                join msgcdl in Root.Tables["Checks_Detail_Line"].AsEnumerable() on msgc.Field<decimal>("GUEST_CHECK_ID") equals msgcdl.Field<decimal>("REF_GUEST_CHECK_ID")
                                //                join mstm in Root.Tables["Tender_Media"].AsEnumerable() on new { TMED_NUM = msgcdl.Field<decimal>("TENDER_MEDIA_TMED_NUM") } equals new { TMED_NUM = mstm.Field<decimal>("TENDER_MEDIA_NUMBER") }
                                //                join t in Root.Tables["Checks_Detail_Line"].AsEnumerable() on new { ID = msgc.Field<decimal>("ID"), SVC_CHG_NUM = (Convert.ToDecimal(_tempParameter[3])) } equals new { ID = t.Field<decimal>("REF_GUEST_CHECK_ID"), SVC_CHG_NUM = t.Field<decimal?>("SERVICE_CHARGE_SVC_CHG_NUM") ?? 0 } into t_join
                                //                from t in t_join.DefaultIfEmpty()
                                //                where msgcdl.Field<object>("TENDER_MEDIA_TMED_NUM") != null && mstm.Field<int>("TENDER_MEDIA_TYPE") == 1 && (msgc.Field<decimal?>("SUB_TTL") ?? 0m) == 0 && (msgc.Field<decimal?>("CHK_TTL") ?? 0m) > 0
                                //                select new { CHECK_ID = msgc.Field<decimal>("GUEST_CHECK_ID"), PAYMENT_METHOD_ID = msgcdl.Field<decimal>("TENDER_MEDIA_TMED_NUM"), PAYMENT_METHOD_CODE = mstm.Field<string>("TENDER_MEDIA_NAME"), PAYMENT_METHOD_DESC = mstm.Field<string>("TENDER_MEDIA_NAME"), TOTAL_AMOUNT_WITH_TIPS = msgcdl.Field<decimal?>("DSP_TTL") ?? 0m, TIPS = t != null ? (msgcdl.Field<decimal?>("DSP_TTL") ?? 0m) : 0m }).Distinct().ToList();
                                var payments = ( from msgc in Root.Tables["Guest_Checks"].AsEnumerable().Where(x => Convert.ToString(x.Field<decimal?>("GUEST_CHECK_ID") ?? 0m) == Header_Id) join msgcdl in Root.Tables["Checks_Detail_Line"].AsEnumerable() on msgc.Field<decimal?>("GUEST_CHECK_ID") ?? 0m equals msgcdl.Field<decimal?>("REF_GUEST_CHECK_ID") ?? 0m
                                                    join mstm in Root.Tables["Tender_Media"].AsEnumerable() on msgcdl.Field<decimal?>("TENDER_MEDIA_TMED_NUM") ?? 0m equals mstm.Field<decimal?>("TENDER_MEDIA_NUMBER") ?? 0m
                                                    join t in Root.Tables["Checks_Detail_Line"].AsEnumerable() on new { ID = msgc.Field<decimal?>("GUEST_CHECK_ID") ?? 0, SVC_CHG_NUM = Convert.ToDecimal(_tempParameter[3]) } equals new { ID = t.Field<decimal?>("REF_GUEST_CHECK_ID") ?? 0m, SVC_CHG_NUM = t.Field<decimal?>("SERVICE_CHARGE_SVC_CHG_NUM") ?? 0m } into t_join
                                                    from t in t_join.DefaultIfEmpty() where msgcdl.Field<object>("TENDER_MEDIA_TMED_NUM") != null && (mstm.Field<int?>("TENDER_MEDIA_TYPE") ?? -1) == 1 && (msgc.Field<decimal?>("SUB_TTL") ?? 0m) == 0m && (msgc.Field<decimal?>("CHK_TTL") ?? 0m) > 0m
                                                    select new { CHECK_ID = msgc.Field<decimal?>("GUEST_CHECK_ID") ?? 0m, PAYMENT_METHOD_ID = msgcdl.Field<decimal?>("TENDER_MEDIA_TMED_NUM") ?? 0m, PAYMENT_METHOD_CODE = mstm.Field<string>("TENDER_MEDIA_NAME"), PAYMENT_METHOD_DESC = mstm.Field<string>("TENDER_MEDIA_NAME"), TOTAL_AMOUNT_WITH_TIPS = msgcdl.Field<decimal?>("DSP_TTL") ?? 0m, TIPS = t != null ? (msgcdl.Field<decimal?>("DSP_TTL") ?? 0m) : 0m }).Distinct().ToList();
                                foreach (var DR_PAY in payments)
                                {
                                    DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                                    DR_PAYMENT["CHECK_ID"] = DR_PAY.CHECK_ID;
                                    DR_PAYMENT["PAYMENT_METHOD_ID"] = DR_PAY.PAYMENT_METHOD_ID;
                                    DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR_PAY.PAYMENT_METHOD_CODE;
                                    DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR_PAY.PAYMENT_METHOD_DESC;
                                    DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = DR_PAY.TOTAL_AMOUNT_WITH_TIPS;
                                    DR_PAYMENT["TIPS"] = DR_PAY.TIPS;
                                    _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                                }
                            }
                        }
                    }
                } 
                return _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillDiscounts(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("DISCOUNT >0 and CHECK_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("DISCOUNT >0 and CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                        DR_DISCOUNT["CHECK_ID"] = DR["CHECK_ID"];
                        DR_DISCOUNT["DISCOUNT_ID"] = DR["DISCOUNT_ID"];
                        DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["DISCOUNT_REASON"];
                        DR_DISCOUNT["DISCOUNT_AMOUNT"] = DR["DISCOUNT"];
                        DR_DISCOUNT["STAFF_ID"] = DR["STAFF_ID"];
                        DR_DISCOUNT["STAFF_NAME"] = DR["STAFF_NAME"];
                        _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                    }

                }
                return _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS;

            }
            catch (Exception ex)
            {
                throw;
            }

        }


    }
}
