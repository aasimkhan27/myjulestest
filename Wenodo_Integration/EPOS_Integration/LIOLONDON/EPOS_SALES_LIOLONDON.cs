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

namespace EPOS_Integration.LIOLONDON
{
    class EPOS_SALES_LIOLONDON<T>
    {
        public CashupModel CashupModelObj { get; set; }
        decimal sc = 0;
        decimal dis_H = 0;
        public CashupModel Transform_LioLondonData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

            DataSet SQ_DATA = data as DataSet;
            try
            {
                //_ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(SQ_DATA as DataSet, _ICashUp, Integration_Dt);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
                LogExceptions.LogError("Transform_Light_Speed_L_Series - Light_Speed_L_Series - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_Light_Speed_L_Series - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            LogExceptions.LogInfo("inside Transform_IkentooData function -FillHeader");
            try
            {
                foreach (DataRow HEADER in Root.Tables[0].Rows)
                {
                    FillLines(Root, Convert.ToString(HEADER["POS"]), Convert.ToInt32(HEADER["NUMBER"]), Convert.ToString(HEADER["TIME_START"]), _ICashUp);
                    if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").Count() > 0)
                    {
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]);
                        DR_SQ_HEADER["CHECK_NO"] = Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]);
                        DR_SQ_HEADER["OPEN_TIME"] = DateTime_Creation(Convert.ToString(HEADER["DATE"]), HEADER["TIME_START"].ToString(), Convert.ToString(HEADER["TIME_END"]));
                        DR_SQ_HEADER["CLOSE_TIME"] = DateTime_Creation(Convert.ToString(HEADER["DATE"]), HEADER["TIME_START"].ToString(), Convert.ToString(HEADER["TIME_END"])); ;
                        DR_SQ_HEADER["COVERS"] = HEADER["PAX"];
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["ROOM"];
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["ROOM"];
                        DR_SQ_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                        DR_SQ_HEADER["NET"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty);
                        DR_SQ_HEADER["TAX"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty);
                        DR_SQ_HEADER["GROSS"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty);
                        DR_SQ_HEADER["DISCOUNT"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty);
                        DR_SQ_HEADER["COMP"] = 0;
                        DR_SQ_HEADER["VOID"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Convert.ToString(HEADER["POS"]) + "-" + Convert.ToInt32(HEADER["NUMBER"]) + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty);
                        DR_SQ_HEADER["TIPS"] = 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = sc;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = Convert.ToString(HEADER["ID_SELLER"]);
                        DR_SQ_HEADER["STAFF_NAME"] = Convert.ToString(HEADER["SELLER"]);
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                        sc = 0;
                        dis_H = 0;
                    }

                    FillPayments(Root, Convert.ToString(HEADER["POS"]), Convert.ToInt32(HEADER["NUMBER"]), _ICashUp);
                    FillDiscounts(Root, Convert.ToString(HEADER["POS"]), Convert.ToInt32(HEADER["NUMBER"]), _ICashUp);
                }

                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(DataSet Root, string POS, Int32 NUMBER, string TIME_START, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM <>'SERVICE CHARGE'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM <>'SERVICE CHARGE'").CopyToDataTable().Rows)
                    {
                        //if (Convert.ToDecimal(DR_LINE["QTY"]) * (Convert.ToDecimal(DR_LINE["PRICE"]) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"])) == 0)
                        //{
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Convert.ToString(DR_LINE["POS"]) + "-" + Convert.ToInt32(DR_LINE["NUMBER"]);
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE["ID_ROOM"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE["ROOM"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["ID_DEPT"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["DEPARTAMENT"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["DEPARTAMENT"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["ID_SECT"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["SECTION"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["SECTION"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ID_ITEM"] : DR_LINE["ID_ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ITEM"] : DR_LINE["ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        DR_SQ_LINE["QUANITY"] = DR_LINE["QTY"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["TOTAL_LINE_TAX"]) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        DR_SQ_LINE["GROSS"] = DR_LINE["TOTAL_LINE_TAX"];
                        decimal disc = (Convert.ToDecimal(DR_LINE["QTY"]) * Convert.ToDecimal(DR_LINE["PRICE"])) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        DR_SQ_LINE["DISCOUNT"] = disc;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR_LINE["IS_RETURN"]) == 1 ? Convert.ToDecimal(DR_LINE["TOTAL_LINE_TAX"])*-1 : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = DateTime_Creation(Convert.ToString(DR_LINE["DATE"]), TIME_START, Convert.ToString(DR_LINE["TIME_LINE"]));
                        DR_SQ_LINE["STAFF_ID"] = Convert.ToString(DR_LINE["ID_SELLER"]);
                        DR_SQ_LINE["STAFF_NAME"] = Convert.ToString(DR_LINE["SELLER"]);
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                        string DISC_REASON = string.Empty;
                        decimal DISC_RATE = 0;
                        if (Convert.ToDecimal(DR_LINE["DISC_TOTAL"]) == 0)
                        {
                            if (Convert.ToDecimal(DR_LINE["DISC_LINE"]) == 0)
                            {
                                DISC_REASON = "";
                                DISC_RATE = 0;
                            }
                            else
                            {
                                if (Convert.ToString(DR_LINE["DISC_TOTAL_REASON"]) == "")
                                {
                                    DISC_REASON = Convert.ToString(DR_LINE["DISC_LINE_REASON"]);
                                    DISC_RATE = Convert.ToDecimal(DR_LINE["DISC_LINE"]);
                                }
                            }
                        }
                        else
                        {
                            DISC_REASON = Convert.ToString(DR_LINE["DISC_TOTAL_REASON"]);
                            DISC_RATE = Convert.ToDecimal(DR_LINE["DISC_TOTAL"]);
                        }
                        DR_SQ_LINE["DISCOUNT_ID"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = DISC_RATE == 0 ? 0 : DISC_RATE;
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_SQ_LINE["TAX"]);
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);

                        //}
                        //else
                        //{

                        //    DataRow DR_SQ_LINE_SC = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        //    DR_SQ_LINE_SC["CHECK_ID"] = Convert.ToString(DR_LINE["POS"]) + "-" + Convert.ToInt32(DR_LINE["NUMBER"]);
                        //    DR_SQ_LINE_SC["REVENUE_CENTER_ID"] = DR_LINE["ID_ROOM"];
                        //    DR_SQ_LINE_SC["REVENUE_CENTER"] = DR_LINE["ROOM"];
                        //    DR_SQ_LINE_SC["ACCOUNT_GROUP_ID"] = DR_LINE["ID_DEPT"];
                        //    DR_SQ_LINE_SC["ACCOUNT_GROUP_CODE"] = DR_LINE["DEPARTAMENT"];
                        //    DR_SQ_LINE_SC["ACCOUNT_GROUP_NAME"] = DR_LINE["DEPARTAMENT"];
                        //    DR_SQ_LINE_SC["CATEGORY_ID"] = DR_LINE["ID_SECT"];
                        //    DR_SQ_LINE_SC["CATEGORY_CODE"] = DR_LINE["SECTION"];
                        //    DR_SQ_LINE_SC["CATEGORY_NAME"] = DR_LINE["SECTION"];
                        //    DR_SQ_LINE_SC["PRODUCT_SKU"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ID_ITEM"] : DR_LINE["ID_ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        //    DR_SQ_LINE_SC["PRODUCT_NAME"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ITEM"] : DR_LINE["ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        //    DR_SQ_LINE_SC["QUANITY"] = 0;
                        //    DR_SQ_LINE_SC["NET"] = 0;
                        //    DR_SQ_LINE_SC["TAX"] = 0;
                        //    DR_SQ_LINE_SC["GROSS"] = 0;
                        //    decimal disc = Convert.ToDecimal(DR_LINE["QTY"]) * Convert.ToDecimal(DR_LINE["PRICE"]) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        //    DR_SQ_LINE_SC["DISCOUNT"] = disc < 0 ? disc * -1 : disc;
                        //    DR_SQ_LINE_SC["COMP"] = 0;
                        //    DR_SQ_LINE_SC["VOID"] = Convert.ToDecimal(DR_LINE["IS_RETURN"]) == 1 ? Convert.ToDecimal(DR_LINE["TOTAL_LINE_TAX"]) : 0;
                        //    DR_SQ_LINE_SC["TIME_OF_SALE"] = DateTime_Creation(Convert.ToString(DR_LINE["DATE"]), TIME_START, Convert.ToString(DR_LINE["TIME_LINE"]));
                        //    DR_SQ_LINE_SC["STAFF_ID"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["STAFF_NAME"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["VOID_ID"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["VOID_REASON"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["DISCOUNT_ID"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["DISCOUNT_REASON"] = (object)DBNull.Value;
                        //    DR_SQ_LINE_SC["DISCOUNT_RATE"] = 0;
                        //    DR_SQ_LINE_SC["TAX_RATE"] = 0;
                        //    _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE_SC);

                        //}
                    }
                }
                if (Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM ='SERVICE CHARGE'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM ='SERVICE CHARGE'").CopyToDataTable().Rows)
                    {
                        //if (Convert.ToDecimal(DR_LINE["QTY"]) * (Convert.ToDecimal(DR_LINE["PRICE"]) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"])) == 0)
                        //{
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Convert.ToString(DR_LINE["POS"]) + "-" + Convert.ToInt32(DR_LINE["NUMBER"]);
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE["ID_ROOM"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE["ROOM"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["ID_DEPT"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["DEPARTAMENT"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["DEPARTAMENT"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["ID_SECT"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["SECTION"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["SECTION"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ID_ITEM"] : DR_LINE["ID_ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["ID_FORMAT"].ToString() == "0" ? DR_LINE["ITEM"] : DR_LINE["ITEM"].ToString() + "-" + DR_LINE["ID_FORMAT"].ToString();
                        DR_SQ_LINE["QUANITY"] = 0;
                        DR_SQ_LINE["NET"] = 0;
                        DR_SQ_LINE["TAX"] = 0;
                        DR_SQ_LINE["GROSS"] = 0;
                        decimal disc = (Convert.ToDecimal(DR_LINE["QTY"]) * Convert.ToDecimal(DR_LINE["PRICE"])) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        DR_SQ_LINE["DISCOUNT"] = disc;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR_LINE["IS_RETURN"]) == 1 ? Convert.ToDecimal(DR_LINE["TOTAL_LINE_TAX"])*-1 : 0; ;
                        DR_SQ_LINE["TIME_OF_SALE"] = DateTime_Creation(Convert.ToString(DR_LINE["DATE"]), TIME_START, Convert.ToString(DR_LINE["TIME_LINE"]));
                        DR_SQ_LINE["STAFF_ID"] = Convert.ToString(DR_LINE["ID_SELLER"]);
                        DR_SQ_LINE["STAFF_NAME"] = Convert.ToString(DR_LINE["SELLER"]);
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                        string DISC_REASON = string.Empty;
                        decimal DISC_RATE = 0;
                        if (Convert.ToDecimal(DR_LINE["DISC_TOTAL"]) == 0)
                        {
                            if (Convert.ToDecimal(DR_LINE["DISC_LINE"]) == 0)
                            {
                                DISC_REASON = "";
                                DISC_RATE = 0;
                            }
                            else
                            {
                                if (Convert.ToString(DR_LINE["DISC_TOTAL_REASON"]) == "")
                                {
                                    DISC_REASON = Convert.ToString(DR_LINE["DISC_LINE_REASON"]);
                                    DISC_RATE = Convert.ToDecimal(DR_LINE["DISC_LINE"]);
                                }
                            }
                        }
                        else
                        {
                            DISC_REASON = Convert.ToString(DR_LINE["DISC_TOTAL_REASON"]);
                            DISC_RATE = Convert.ToDecimal(DR_LINE["DISC_TOTAL"]);
                        }
                        DR_SQ_LINE["DISCOUNT_ID"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                        DR_SQ_LINE["TAX_RATE"] = 0;
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                    }
                }
                if (Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM='SERVICE CHARGE'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER + " and ITEM='SERVICE CHARGE'").CopyToDataTable().Rows)
                    {
                        sc += Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        decimal disc = Convert.ToDecimal(DR_LINE["QTY"]) * Convert.ToDecimal(DR_LINE["PRICE"]) - Convert.ToDecimal(DR_LINE["TOTAL_LINE"]);
                        dis_H += disc;
                        if (dis_H > 0)
                        {
                            string S = string.Empty;
                        }
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillPayments(DataSet Root, string POS, Int32 NUMBER, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[4].Select("POS= '" + POS + "' and NUMBER=" + NUMBER).Count() > 0)
                {
                    var withTips = (from data in Root.Tables[4].AsEnumerable().Where(p => p.Field<string>("POS") == POS && p.Field<Int32>("NUMBER") == NUMBER && p.Field<string>("PAYMENT_TYPE").ToLower().Contains("tip"))
                                    select new
                                    {
                                        TIP_AMOUNT = Convert.ToDecimal(data.Field<decimal>("AMOUNT")) * -1,
                                        PAYMENT_TYPE = Convert.ToString(data.Field<string>("PAYMENT_TYPE")).Replace("Tip", ""),
                                        POS = Convert.ToString(data.Field<string>("POS")),
                                        NUMBER = Convert.ToInt32(data.Field<Int32>("NUMBER"))
                                    }).ToList();
                    var withOutTips = (from data in Root.Tables[4].AsEnumerable().Where(p => p.Field<string>("POS") == POS && p.Field<Int32>("NUMBER") == NUMBER && !p.Field<string>("PAYMENT_TYPE").ToLower().Contains("tip"))
                                       select data).ToList();
                    bool b = false;
                    foreach (DataRow DR in withOutTips.CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Convert.ToString(DR["POS"]) + "-" + Convert.ToInt32(DR["NUMBER"]);
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["ID_PAYMENT_TYPE"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PAYMENT_TYPE"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["PAYMENT_TYPE"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["AMOUNT"]);

                        if (withTips.Count() > 0 && b == false)
                        {
                            if (withTips[0].PAYMENT_TYPE.ToLower().Trim() == Convert.ToString(DR["PAYMENT_TYPE"]).ToLower().Trim())
                            {
                                b = true;
                                DR_PAYMENT["TIPS"] = withTips[0].TIP_AMOUNT;
                            }
                        }
                        else { DR_PAYMENT["TIPS"] = 0; }


                        //DR_PAYMENT["TIPS"] = withTips.Select(p => p.PAYMENT_TYPE.ToString().ToLower() == Convert.ToString(DR["PAYMENT_TYPE"]).ToLower() && p.POS == Convert.ToString(DR["POS"]) && Convert.ToInt32(p.NUMBER) == Convert.ToInt32(DR["NUMBER"])).Count() > 0 ? withTips[0].TIP_AMOUNT : 0;
                        _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                        //withTips = null;
                        //b = false;
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillDiscounts(DataSet Root, string POS, Int32 NUMBER, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER).Count() > 0)
                {
                    var dist = Root.Tables[1].Select("POS= '" + POS + "' and NUMBER=" + NUMBER).ToList().GroupBy(x => x.Field<Int32>("NUMBER")).Select(x => x.First()).ToList();
                    foreach (DataRow DR in dist.CopyToDataTable().Rows)
                    {

                        var DISC = Root.Tables[1].Select("POS= '" + DR["POS"].ToString() + "' and NUMBER=" + Convert.ToInt32(DR["NUMBER"])).ToList();
                        decimal dis_Amount = DISC.Sum(p => p.Field<decimal>("QTY") * p.Field<decimal>("PRICE") - p.Field<decimal>("TOTAL_LINE"));

                        if (dis_Amount != 0)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Convert.ToString(DR["POS"]) + "-" + Convert.ToInt32(DR["NUMBER"]);
                            string DISC_REASON = string.Empty;
                            decimal DISC_RATE = 0;
                            if (Convert.ToDecimal(DR["DISC_TOTAL"]) == 0)
                            {
                                if (Convert.ToDecimal(DR["DISC_LINE"]) == 0)
                                {
                                    DISC_REASON = "";
                                    DISC_RATE = 0;
                                }
                                else
                                {
                                    if (Convert.ToString(DR["DISC_TOTAL_REASON"]) == "")
                                    {
                                        DISC_REASON = Convert.ToString(DR["DISC_LINE_REASON"]);
                                        DISC_RATE = Convert.ToDecimal(DR["DISC_LINE"]);
                                    }
                                }
                            }
                            else
                            {
                                DISC_REASON = Convert.ToString(DR["DISC_TOTAL_REASON"]);
                                DISC_RATE = Convert.ToDecimal(DR["DISC_TOTAL"]);
                            }
                            DR_DISCOUNT["DISCOUNT_ID"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DISC_REASON != "" ? DISC_REASON : (object)DBNull.Value;
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = dis_Amount;
                            DR_DISCOUNT["STAFF_ID"] = Convert.ToString(DR["ID_SELLER"]);
                            DR_DISCOUNT["STAFF_NAME"] = Convert.ToString(DR["SELLER"]);
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
        bool DayLight_Saving(string date, string country)
        {
            bool is_DLS = false;
            DateTime DAY_LIGHT_SAVING_CURRENT_DATE_START = new DateTime(Convert.ToInt32(DateTime.Now.Year), 3, DateTime.DaysInMonth(Convert.ToInt32(DateTime.Now.Year), 3), System.Globalization.CultureInfo.CurrentCulture.Calendar);
            int daysOffset = DAY_LIGHT_SAVING_CURRENT_DATE_START.DayOfWeek - DayOfWeek.Sunday;
            if (daysOffset < 0) daysOffset += 7;
            DateTime DAY_LIGHT_SAVING_START_DATE = DAY_LIGHT_SAVING_CURRENT_DATE_START.AddDays(-daysOffset);

            daysOffset = 0;
            DateTime DAY_LIGHT_SAVING_CURRENT_DATE_END = new DateTime(Convert.ToInt32(DateTime.Now.Year), 10, DateTime.DaysInMonth(Convert.ToInt32(DateTime.Now.Year), 10), System.Globalization.CultureInfo.CurrentCulture.Calendar);
            daysOffset = DAY_LIGHT_SAVING_CURRENT_DATE_END.DayOfWeek - DayOfWeek.Sunday;
            if (daysOffset < 0) daysOffset += 7;
            DateTime DAY_LIGHT_SAVING_END_DATE = DAY_LIGHT_SAVING_CURRENT_DATE_END.AddDays(-daysOffset);


            if (country == "GBR")
            {
                if (Convert.ToDateTime(Convert.ToDateTime(date).ToString("yyyy-MM-dd hh:mm:ss tt")) >= Convert.ToDateTime(DAY_LIGHT_SAVING_START_DATE.ToString("yyyy-MM-dd 12:59:59 tt")) &&
                    Convert.ToDateTime(Convert.ToDateTime(date).ToString("yyyy-MM-dd hh:mm:ss tt")) <= Convert.ToDateTime(DAY_LIGHT_SAVING_END_DATE.ToString("yyyy-MM-dd 12:59:59 tt"))
                    )
                { is_DLS = true; }
                else { is_DLS = false; }
            }
            return is_DLS;
        }
        string DateTime_Creation(string Start_Date, string Start_Time, string End_Time)
        {
            string Cashup_date = Convert.ToDateTime(Start_Date).ToString("yyyy-MM-dd");
            string[] timelist = Convert.ToString(Start_Time).Split(':');
            int start_hr = Convert.ToInt32(timelist[0]);
            timelist = Convert.ToString(End_Time).Split(':');
            int end_hr = Convert.ToInt32(timelist[0]);
            int variance = start_hr - end_hr;
            DateTime Cashup_date_new = DateTime.Now;
            if(start_hr> end_hr)
                Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
            else
                Cashup_date_new = Convert.ToDateTime(Cashup_date);
            //if (variance == 0 || variance > 0)
            //{
            //    Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
            //}
            //else
            //{
            //    Cashup_date_new = Convert.ToDateTime(Cashup_date);
            //}
            return Cashup_date_new.ToString();
        }
    }
}
