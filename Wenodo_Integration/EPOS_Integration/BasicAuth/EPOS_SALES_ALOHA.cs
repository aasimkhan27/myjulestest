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

namespace EPOS_Integration.BasicAuth
{
    public class EPOS_SALES_ALOHA<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_AlohaData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SQ_DATA = data as DataSet;
            try
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(SQ_DATA as DataSet, _ICashUp);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_SQUIRELL - SQUIRELL - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_SQUIRELL - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp)
        {
            try
            {
                foreach (DataRow HEADER in Root.Tables[0].Select("TRAINING<>true").CopyToDataTable().Rows)
                {
                     
                    FillLines(Root, Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"]), _ICashUp);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                    if (SALES_LINE.Select("CHECK_ID='" + Convert.ToInt32(HEADER["HEADER_SOURCE_SYSTEM_ID"]) + "'").Count() > 0)
                    {
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = Convert.ToInt32(HEADER["HEADER_SOURCE_SYSTEM_ID"]);
                        DR_SQ_HEADER["CHECK_NO"] = Convert.ToInt32(HEADER["PRINTEDCHECKID"]);
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToDateTime(SALES_LINE.Select("CHECK_ID='" + Convert.ToInt32(HEADER["HEADER_SOURCE_SYSTEM_ID"]) + "'").ToList().OrderBy(p => p.Field<DateTime>("TIME_OF_SALE")).FirstOrDefault()["TIME_OF_SALE"]);
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToDateTime(SALES_LINE.Select("CHECK_ID='" + Convert.ToInt32(HEADER["HEADER_SOURCE_SYSTEM_ID"]) + "'").ToList().OrderBy(p => p.Field<DateTime>("TIME_OF_SALE")).LastOrDefault()["TIME_OF_SALE"]);
                        DR_SQ_HEADER["COVERS"] = HEADER["GUESTS_COUNT"];
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["REVENUECENTER_ID"];
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["REVENUECENTER_LABEL"];

                        string SERVE_MODE = string.Empty;
                        if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).Count() > 0)
                        {
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "C&C".ToLower())
                            {
                                SERVE_MODE = "Eat In";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "CLIC COLLEC".ToLower())
                            {
                                SERVE_MODE = "Delivery";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "EAT IN".ToLower())
                            {
                                SERVE_MODE = "Eat In";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "No Make".ToLower())
                            {
                                //SERVE_MODE = "Take Away";
                            }                           
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "Order".ToLower())
                            {
                                SERVE_MODE = "Delivery";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "RUSH ORDER".ToLower())
                            {
                                SERVE_MODE = "Delivery";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "Send".ToLower())
                            {
                                SERVE_MODE = "Delivery";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "Take Away".ToLower())
                            {
                                SERVE_MODE = "Take Away";
                            }
                            if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Rows[0]["ORDERMODE_LABEL"].ToString().ToLower() == "WEB ORDER".ToLower())
                            {
                                SERVE_MODE = "Delivery";
                            }
                            
                        }

                        DR_SQ_HEADER["SERVE_MODE"] = SERVE_MODE;//HEADER["DEPTNAME"] != null ? (Convert.ToString(HEADER["DEPTNAME"]).ToUpper() == "BASEMENT".ToUpper() || Convert.ToString(HEADER["DEPTNAME"]).ToUpper() == "RESTAURANT".ToUpper() ? "Eat In" : "Takeaway") : (object)DBNull.Value;
                        DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                        DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                        DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                        DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                        DR_SQ_HEADER["COMP"] = 0;
                        decimal VOID = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;
                        DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                        DR_SQ_HEADER["TIPS"] = Root.Tables[4].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).Count() > 0 ?
                            Convert.ToDecimal(Root.Tables[4].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"])).CopyToDataTable().Compute("SUM(TIP)", string.Empty)) : 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = Root.Tables[3].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"]) + " and TYPEID<>1 and TYPEID<>4").Count() > 0 ?
                            Root.Tables[3].Select("HEADER_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"]) + " and TYPEID<>1 and TYPEID<>4").CopyToDataTable().Compute("SUM(AMOUNT)", string.Empty) : 0;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = HEADER["TRAINING"];
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_HEADER["STAFF_NAME"] = (object)DBNull.Value;
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                        FillPayments(Root, Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"]), _ICashUp);
                        FillDiscounts(Root, Convert.ToDecimal(HEADER["HEADER_SOURCE_SYSTEM_ID"]), _ICashUp, SALES_LINE);
                    }
                    
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        DataTable FillLines(DataSet Root, decimal Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[1].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).Count() > 0)
                {
                    var list = (from AL in Root.Tables[1].AsEnumerable().Where(x => x.Field<decimal>("HEADER_SOURCE_SYSTEM_ID") == Header_Id)
                                join ALC in Root.Tables[2].AsEnumerable().Where(x => x.Field<string>("TYPE") == "sales") on AL.Field<decimal>("LINE_SOURCE_SYSTEM_ID") equals ALC.Field<decimal>("LINE_SOURCE_SYSTEM_ID")
                                select new { AL, CATEGORY_NAME = ALC.Field<string>("TYPE") == "sales" ? ALC.Field<string>("NAME") : "Uncategorised", ALC }
                              ).ToList();

                    foreach (var DR_LINE in list)
                    {
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Convert.ToInt32(DR_LINE.AL.Field<decimal>("HEADER_SOURCE_SYSTEM_ID"));
                        var TOTAL_DISC_CPN = Root.Tables[8].Select("ALOHA_LINE_SOURCE_SYSTEM_ID=" + Convert.ToDecimal(DR_LINE.AL["LINE_SOURCE_SYSTEM_ID"]) + " and TYPE=4").ToList().Sum(p => p.Field<decimal>("AMOUNT"));
                        var sourceId = Convert.ToDecimal(DR_LINE.AL["LINE_SOURCE_SYSTEM_ID"]);
                        var linkeditems = Root.Tables[8].Select("ALOHA_LINE_SOURCE_SYSTEM_ID = " + sourceId + "  AND TYPE <> 0 AND TYPE <> 7").ToList();
                        bool isLinked = linkeditems.Any(row => Convert.ToDecimal(row["ALOHA_LINE_SOURCE_SYSTEM_ID"]) == sourceId);
                        decimal ASU = 0;
                        if (isLinked)
                            ASU = Root.Tables[3].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + "and TYPEID<>0 AND TYPEID<>7").ToList().Sum(p => p.Field<decimal>("RATE"));
                        else
                            ASU = 0;  
                        var ALI_SU = Root.Tables[8].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + "and TYPE =1").ToList();      
                        var VOID = Root.Tables[8].Select("ALOHA_LINE_SOURCE_SYSTEM_ID=" + DR_LINE.AL.Field<decimal>("LINE_SOURCE_SYSTEM_ID") + " and TYPE=3");   
                        var REVENUE_CENTER = DR_LINE.CATEGORY_NAME;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).Count() > 0 ? Root.Tables[0].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).CopyToDataTable().Rows[0]["REVENUECENTER_ID"] : (object)DBNull.Value;
                        DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).Count() > 0 ? Root.Tables[0].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).CopyToDataTable().Rows[0]["REVENUECENTER_LABEL"] : (object)DBNull.Value;
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = Convert.ToInt32(DR_LINE.ALC.Field<decimal>("LINE_CAT_SOURCE_SYSTEM_ID"));
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE.CATEGORY_NAME;
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE.CATEGORY_NAME;
                        DR_SQ_LINE["CATEGORY_ID"] = Convert.ToInt32(DR_LINE.ALC.Field<decimal>("LINE_CAT_SOURCE_SYSTEM_ID"));
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE.CATEGORY_NAME;
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE.CATEGORY_NAME;
                        DR_SQ_LINE["PRODUCT_SKU"] = Convert.ToInt32(DR_LINE.AL.Field<decimal>("TYPEID"));
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE.AL.Field<string>("LABEL");
                        DR_SQ_LINE["QUANITY"] = Convert.ToString(DR_LINE.AL["ORDERMODE_ID"]) == "" ? 0 : Convert.ToDecimal(DR_LINE.AL["QUANTITY"]);
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE.AL["NETAMOUNT"]);
                        decimal SUM_ASU = ALI_SU.Count() == 0 ? 0 : ASU;
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE.AL["NETAMOUNT"]) * SUM_ASU;
                        DR_SQ_LINE["GROSS"] =Convert.ToDecimal(DR_SQ_LINE["NET"])+Convert.ToDecimal(DR_SQ_LINE["TAX"]); // Convert.ToDecimal(DR_LINE.AL["AMOUNT"]) - Convert.ToDecimal(TOTAL_DISC_CPN);
                        DR_SQ_LINE["DISCOUNT"] = TOTAL_DISC_CPN;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = VOID.Count() > 0 ? Convert.ToDecimal(VOID.CopyToDataTable().Rows[0]["AMOUNT"]) * -1 : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = DR_LINE.AL["CREATEDON"];
                        DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_ID"] = VOID.Count() > 0 ? VOID.CopyToDataTable().Rows[0]["VOID_SOURCE_SYSTEM_ID"] : (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = VOID.Count() > 0 ?
                            (
                             Root.Tables[11].Select("VOID_SOURCE_SYSTEM_ID='" + VOID.CopyToDataTable().Rows[0]["VOID_SOURCE_SYSTEM_ID"].ToString() + "'").Count() > 0 ?
                             Root.Tables[11].Select("VOID_SOURCE_SYSTEM_ID='" + VOID.CopyToDataTable().Rows[0]["VOID_SOURCE_SYSTEM_ID"].ToString() + "'").CopyToDataTable().Rows[0]["LABEL"]
                             : ""
                             )
                            : (object)DBNull.Value;

                        decimal DISCOUNT_RATE = 0;
                        DISCOUNT_RATE = (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) - Convert.ToDecimal(DR_SQ_LINE["TAX"])) == 0 ? 100 : (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) == 0 || Convert.ToDecimal(DR_SQ_LINE["TAX"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["TAX"]) / Convert.ToDecimal(DR_SQ_LINE["GROSS"])) * 100);

                        var DISCOUNT_LIST = (from AC in Root.Tables[10].AsEnumerable().Where(p => p.Field<decimal>("HEADER_SOURCE_SYSTEM_ID") == Header_Id) select new { AC }).ToList();
                        DR_SQ_LINE["DISCOUNT_ID"] = Root.Tables[10].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).Count() > 0 ? Root.Tables[10].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).CopyToDataTable().Rows[0]["TYPEID"] : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = Root.Tables[10].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).Count() > 0 ? Root.Tables[10].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id).CopyToDataTable().Rows[0]["LABEL"] : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = DISCOUNT_RATE;
                        DR_SQ_LINE["TAX_RATE"] = Root.Tables[3].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + " and TYPEID<>0").Count() > 0 ? Convert.ToDecimal(Root.Tables[3].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + " and TYPEID<>0").CopyToDataTable().Rows[0]["RATE"]) * 100 : 0;
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);

                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillPayments(DataSet Root, decimal Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[4].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + " and LABEL <>'TIMEOUT'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[4].Select("HEADER_SOURCE_SYSTEM_ID=" + Header_Id + " and LABEL <>'TIMEOUT'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["TYPEID"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["LABEL"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["LABEL"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["TIP"]) + Convert.ToDecimal(DR["AMOUNT"]);
                        DR_PAYMENT["TIPS"] = Convert.ToDecimal(DR["TIP"]);
                        _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillDiscounts(DataSet Root, decimal Header_Id, Cashup _ICashUp, DataTable SalesLine)
        {
            try
            {
                var list = SalesLine.AsEnumerable().Where(p => p.Field<string>("CHECK_ID") == Header_Id.ToString()).GroupBy(x => x.Field<string>("DISCOUNT_REASON")).Select(x => x.First()).ToList();

                if (list.Count() > 0)
                {
                    if (Convert.ToDecimal(SalesLine.Select("CHECK_ID='" + Header_Id.ToString()+"'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) != 0)
                    {
                        foreach (DataRow DR in list.CopyToDataTable().Rows)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = DR["DISCOUNT_ID"];
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["DISCOUNT_REASON"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = SalesLine.Select("CHECK_ID='" + Header_Id.ToString()+"'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty);  //DR["DISCOUNT"];
                            DR_DISCOUNT["STAFF_ID"] = (object)DBNull.Value;
                            DR_DISCOUNT["STAFF_NAME"] = (object)DBNull.Value;
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                        }
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
