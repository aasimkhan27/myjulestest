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
    public class EPOS_SALES_SQUIRELL<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_SquirrelData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SQ_DATA = data as DataSet;
            try
            {
                DataSet DS_DATA = new DataSet();
                DS_DATA = data as DataSet;
                if (DS_DATA.Tables[0].Rows.Count > 0 && DS_DATA.Tables[1].Rows.Count > 0)
                {
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(DS_DATA, _ICashUp);
                }

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
        DataTable FillHeader(DataSet SQ_Dataset, Cashup _ICashUp)
        {
            try
            {
                foreach (DataRow HEADER in SQ_Dataset.Tables[0].Rows)
                {
                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                    DR_SQ_HEADER["CHECK_ID"] = HEADER["CHECKID"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["CHECKNO"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["OPENTIME"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSETIME"]);
                    DR_SQ_HEADER["COVERS"] = HEADER["COVERS"];
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["DEPTNAME"];
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["DEPTNAME"];
                    DR_SQ_HEADER["SERVE_MODE"] = HEADER["DEPTNAME"] != null ? (Convert.ToString(HEADER["DEPTNAME"]).ToUpper() == "BASEMENT".ToUpper() || Convert.ToString(HEADER["DEPTNAME"]).ToUpper() == "RESTAURANT".ToUpper() ? "Eat In" : "Take Away") : (object)DBNull.Value;
                    DR_SQ_HEADER["NET"] = SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(SQNET)", string.Empty)) - Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(TAXAMT)", string.Empty)) : 0;
                    DR_SQ_HEADER["TAX"] = SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(TAXAMT)", string.Empty)) : 0;
                    DR_SQ_HEADER["GROSS"] = SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(SQNET)", string.Empty)) : 0;
                    DR_SQ_HEADER["DISCOUNT"] = SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(PROMOAMT)", string.Empty)) : 0;
                    DR_SQ_HEADER["COMP"] = 0;
                    decimal VOID = SQ_Dataset.Tables[3].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[3].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(GROSSPRICE)", string.Empty)) * -1 : 0;
                    DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                    DR_SQ_HEADER["TIPS"] = SQ_Dataset.Tables[2].Select("CHECKID=" + HEADER["CHECKID"] + " and PROMOYN=0").Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[2].Select("CHECKID=" + HEADER["CHECKID"] + " and PROMOYN=0").CopyToDataTable().Compute("SUM(TIPAMT)", string.Empty)) * -1 : 0;
                    DR_SQ_HEADER["SERVICE_CHARGE"] = SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(SVCHARGE)", string.Empty)) : 0;
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    //comm sep employee fill in both
                    string STAFF_NAME = string.Empty;
                    List<string> UNIQUES = null;
                    if (SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0)
                    {
                        foreach (DataRow dr in SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Rows)
                        {
                            STAFF_NAME += dr["EMPLOYEE"] + ",";
                        }
                        if (STAFF_NAME.Length > 0)
                        {
                            UNIQUES = STAFF_NAME.Remove(STAFF_NAME.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                        }
                    }


                    DR_SQ_HEADER["STAFF_ID"] = UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;
                    DR_SQ_HEADER["STAFF_NAME"] = UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);

                    FillLines(SQ_Dataset, Convert.ToInt32(HEADER["CHECKID"]), _ICashUp);
                    FillLinesFromVoid(SQ_Dataset, Convert.ToInt32(HEADER["CHECKID"]), _ICashUp);
                    FillPayments(SQ_Dataset, Convert.ToInt32(HEADER["CHECKID"]), _ICashUp);
                    FillDiscounts(SQ_Dataset, Convert.ToInt32(HEADER["CHECKID"]), _ICashUp);
                }

                var dateDiffList = SQ_Dataset.Tables[0].AsEnumerable().Where(p => p.Field<DateTimeOffset>("TRANSDATE") > p.Field<DateTimeOffset>("OPENTIME")).ToList();
                foreach (var data in dateDiffList.Distinct())
                {
                    EPOS_Integration.Squirrel.SQUIRELL_EPOS ObjSqurl = new EPOS_Integration.Squirrel.SQUIRELL_EPOS();
                    DataSet DS = ObjSqurl.RefetchDataFromEPOS(_ICashUp.CashupModelObj.SQURL_SESSION, _ICashUp.CashupModelObj.SQURL_INTEGRATION_DETAIL, Convert.ToString(data["OPENTIME"]));

                    if (_ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0)
                    {
                        foreach (DataRow dr in _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"])).CopyToDataTable().Rows)
                        {
                            decimal NET = DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? (Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(SQNET)", string.Empty))
                                - Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(TAXAMT)", string.Empty))) + Convert.ToDecimal(dr["NET"]) : 0;
                            decimal TAX = DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(TAXAMT)", string.Empty)) + Convert.ToDecimal(dr["TAX"]) : 0;
                            decimal GROSS = DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(SQNET)", string.Empty)) + Convert.ToDecimal(dr["GROSS"]) : 0;
                            decimal DISCOUNT = DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(PROMOAMT)", string.Empty)) + Convert.ToDecimal(dr["DISCOUNT"]) : 0;
                            decimal VOID = DS.Tables[3].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? Convert.ToDecimal(DS.Tables[3].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(GROSSPRICE)", string.Empty)) * -1 : 0;
                            VOID = VOID > 0 ? (VOID + Convert.ToDecimal(dr["VOID"])) * -1 : VOID;
                            decimal TIPS = DS.Tables[2].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"]) + " and PROMOYN=0").Count() > 0 ? (Convert.ToDecimal(DS.Tables[2].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"]) + " and PROMOYN=0").CopyToDataTable().Compute("SUM(TIPAMT)", string.Empty)) + Convert.ToDecimal(dr["TIPS"])) * -1 : 0;
                            decimal SERVICE_CHARGE = DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).Count() > 0 ? Convert.ToDecimal(DS.Tables[1].Select("CHECKID=" + Convert.ToInt32(data["CHECKID"])).CopyToDataTable().Compute("SUM(SVCHARGE)", string.Empty)) + Convert.ToDecimal(dr["SERVICE_CHARGE"]) : 0;


                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["NET"] = NET;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["TAX"] = TAX;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["GROSS"] = GROSS;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["DISCOUNT"] = DISCOUNT;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["VOID"] = VOID;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Select("CHECK_ID=" + Convert.ToDecimal(data["CHECKID"]))[0]["SERVICE_CHARGE"] = SERVICE_CHARGE;
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.AcceptChanges();

                            FillLines(DS, Convert.ToInt32(data["CHECKID"]), _ICashUp);
                            FillLinesFromVoid(DS, Convert.ToInt32(data["CHECKID"]), _ICashUp);
                            FillPayments(DS, Convert.ToInt32(data["CHECKID"]), _ICashUp);
                            FillDiscounts(DS, Convert.ToInt32(data["CHECKID"]), _ICashUp);
                        }
                    }

                }

                List<decimal> ONLY_IN_LINE_CHECKS = new List<decimal>();
                foreach (DataRow dr in SQ_Dataset.Tables[1].Rows)
                {
                    if (SQ_Dataset.Tables[0].Select("CHECKID=" + dr["CHECKID"]).Count() == 0)
                    {
                        ONLY_IN_LINE_CHECKS.Add(Convert.ToDecimal(dr["CHECKID"]));
                    }
                }
                if (ONLY_IN_LINE_CHECKS.Distinct().Count() > 0)
                {
                    foreach (var chkList in ONLY_IN_LINE_CHECKS.Distinct())
                    {
                        FillLines(SQ_Dataset, Convert.ToInt32(chkList), _ICashUp);
                        FillLinesFromVoid(SQ_Dataset, Convert.ToInt32(chkList), _ICashUp);
                        FillPayments(SQ_Dataset, Convert.ToInt32(chkList), _ICashUp);
                        FillDiscounts(SQ_Dataset, Convert.ToInt32(chkList), _ICashUp);
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        DataTable FillLines(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[1].Select("CHECKID=" + Header_Id).Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("CHECKID=" + Header_Id).CopyToDataTable().Rows)
                    {

                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE["SALESDEPARTMENT"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE["SALESDEPARTMENT"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["MAJORCATID"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["MAJORCATID"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["MAJORCAT"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["GLOBALCAT"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["GLOBALCAT"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["GLOBALCAT"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["MENUNAME"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["MENUNAME"];
                        DR_SQ_LINE["QUANITY"] = DR_LINE["QTY"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["SQNET"]) - Convert.ToDecimal(DR_LINE["TAXAMT"]);
                        DR_SQ_LINE["TAX"] = DR_LINE["TAXAMT"];
                        DR_SQ_LINE["GROSS"] = DR_LINE["SQNET"];
                        DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["PROMOAMT"]) > 0 ? Convert.ToDecimal(DR_LINE["PROMOAMT"]) : 0;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = Convert.ToString(DR_LINE["SALETIME"]);
                        DR_SQ_LINE["STAFF_ID"] = DR_LINE["EMPLOYEE"];
                        DR_SQ_LINE["STAFF_NAME"] = DR_LINE["EMPLOYEE"];
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;

                        decimal DISCOUNT_RATE = 0;
                        if (Convert.ToDecimal(DR_LINE["PROMOAMT"]) == 0)
                            DISCOUNT_RATE = 0;
                        else
                            DISCOUNT_RATE = (Convert.ToDecimal(DR_LINE["SQNET"]) + Convert.ToDecimal(DR_LINE["PROMOAMT"])) != 0 ? (Convert.ToDecimal(DR_LINE["PROMOAMT"]) / (Convert.ToDecimal(DR_LINE["SQNET"]) + Convert.ToDecimal(DR_LINE["PROMOAMT"]))) * 100 : 0;

                        decimal TAX_RATE = Convert.ToDecimal(DR_LINE["TAXAMT"]) == 0 ? 0 : (Convert.ToDecimal(DR_LINE["TAXAMT"]) / (Convert.ToDecimal(DR_LINE["SQNET"]) - Convert.ToDecimal(DR_LINE["TAXAMT"]))) * 100;
                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToString(DR_LINE["PROMONAME"]) == "" ? (object)DBNull.Value : DR_LINE["PROMONAME"];
                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToString(DR_LINE["PROMONAME"]) == "" ? (object)DBNull.Value : DR_LINE["PROMONAME"];
                        DR_SQ_LINE["DISCOUNT_RATE"] = DISCOUNT_RATE;
                        DR_SQ_LINE["TAX_RATE"] = TAX_RATE;
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
        DataTable FillLinesFromVoid(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[3].Select("CHECKID=" + Header_Id).Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[3].Select("CHECKID=" + Header_Id).CopyToDataTable().Rows)
                    {
                        DataRow DR_VOID_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_VOID_LINE["CHECK_ID"] = Header_Id;
                        DR_VOID_LINE["REVENUE_CENTER_ID"] = (object)DBNull.Value;
                        DR_VOID_LINE["REVENUE_CENTER"] = (object)DBNull.Value;
                        DR_VOID_LINE["ACCOUNT_GROUP_ID"] = "";
                        DR_VOID_LINE["ACCOUNT_GROUP_CODE"] = "";
                        DR_VOID_LINE["ACCOUNT_GROUP_NAME"] = "";
                        DR_VOID_LINE["CATEGORY_ID"] = "";
                        DR_VOID_LINE["CATEGORY_CODE"] = "";
                        DR_VOID_LINE["CATEGORY_NAME"] = "";
                        DR_VOID_LINE["PRODUCT_SKU"] = DR_LINE["MENUNAME"];
                        DR_VOID_LINE["PRODUCT_NAME"] = DR_LINE["MENUNAME"];
                        DR_VOID_LINE["QUANITY"] = Convert.ToDecimal(DR_LINE["QTY"]) > 0 ? Convert.ToDecimal(DR_LINE["QTY"]) * -1 : 0;
                        DR_VOID_LINE["NET"] = 0;
                        DR_VOID_LINE["TAX"] = 0;
                        DR_VOID_LINE["GROSS"] = 0;
                        DR_VOID_LINE["DISCOUNT"] = 0;
                        DR_VOID_LINE["COMP"] = 0;
                        DR_VOID_LINE["VOID"] = Convert.ToDecimal(DR_LINE["GROSSPRICE"]) * -1;
                        DR_VOID_LINE["TIME_OF_SALE"] = Convert.ToString(DR_LINE["VOIDDATE"]);
                        DR_VOID_LINE["STAFF_ID"] = DR_LINE["MGRNAME"];
                        DR_VOID_LINE["STAFF_NAME"] = DR_LINE["SERVERNAME"];
                        DR_VOID_LINE["VOID_ID"] = DR_LINE["REASON"];
                        DR_VOID_LINE["VOID_REASON"] = DR_LINE["REASON"];
                        DR_VOID_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                        DR_VOID_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                        DR_VOID_LINE["DISCOUNT_RATE"] = 0;
                        DR_VOID_LINE["TAX_RATE"] = 0;
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_VOID_LINE);
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillPayments(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=0").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=0").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYNAME"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PAYNAME"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["PAYNAME"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["PAYAMT"]) + Convert.ToDecimal(DR["TIPAMT"]);
                        DR_PAYMENT["TIPS"] = Convert.ToDecimal(DR["TIPAMT"]) >= 0 ? Convert.ToDecimal(DR["TIPAMT"]) : Convert.ToDecimal(DR["TIPAMT"]) * -1;
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
        DataTable FillDiscounts(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                var list = Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=1").ToList();//.GroupBy(p => p.Field<Int32>("CHECKID")).Select(p => p.First()).ToList();
                if (list.Count() > 0)
                {
                    if (Convert.ToDecimal(Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=1").CopyToDataTable().Compute("SUM(PAYAMT)", string.Empty)) != 0)
                    {
                        foreach (DataRow DR in list.CopyToDataTable().Rows)
                        {

                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(Header_Id);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["PAYNAME"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = DR["PAYAMT"];
                            DR_DISCOUNT["STAFF_ID"] = Root.Tables[1].Select("CHECKID=" + Header_Id).Count() > 0 ? Root.Tables[1].Select("CHECKID=" + Header_Id).CopyToDataTable().Rows[0]["EMPLOYEE"].ToString() : (object)DBNull.Value;
                            DR_DISCOUNT["STAFF_NAME"] = Root.Tables[1].Select("CHECKID=" + Header_Id).Count() > 0 ? Root.Tables[1].Select("CHECKID=" + Header_Id).CopyToDataTable().Rows[0]["EMPLOYEE"].ToString() : (object)DBNull.Value;
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);

                        }
                    }
                }

                //if (Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=1").Count() > 0)
                //{
                //    foreach (DataRow DR in Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=1").CopyToDataTable().Rows)
                //    {
                //        if (Convert.ToDecimal(DR["PAYAMT"]) > 0)
                //        {
                //            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                //            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                //            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(Header_Id);
                //            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["PAYNAME"];
                //            DR_DISCOUNT["DISCOUNT_AMOUNT"] = DR["PAYAMT"];
                //            DR_DISCOUNT["STAFF_ID"] = (object)DBNull.Value;
                //            DR_DISCOUNT["STAFF_NAME"] = (object)DBNull.Value;
                //            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                //        }
                //    }
                //}
                return _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
    }
}
