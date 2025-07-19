using App_Repository;
using EPOS_Integration.EPOS_SALES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;
using static EPOS_Integration.SquareUp.SquareupModel;

namespace EPOS_Integration.SquareUp
{
    public class EPOS_SALES_SQUAREUP<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_SquareupData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
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

                LogExceptions.LogError("Transform_SquareupData - SQUAREUP - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_SquareupData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;
        }
        DataTable FillHeader(DataSet SQ_Dataset, Cashup _ICashUp)
        {
            try
            {

                foreach (DataRow HEADER in SQ_Dataset.Tables[0].Select("STATE='COMPLETED' or STATE='OPEN'").CopyToDataTable().Rows)
                {
                    //var data = (from T0 in SQ_Dataset.Tables[0].AsEnumerable()
                    //            join T1 in SQ_Dataset.Tables[1].AsEnumerable()
                    //            on T0.Field<string>("ORDER_ID") equals T1.Field<string>("ORDER_ID")
                    //            join T2 in SQ_Dataset.Tables[1].AsEnumerable()
                    //            on new { SOURCE_LINE_ITEM_UID = T1.Field<string>("UID"), SOURCE_ORDER_ID = T1.Field<string>("ORDER_ID") }
                    //            equals new { SOURCE_LINE_ITEM_UID = T2.Field<string>("SOURCE_LINE_ITEM_UID"), SOURCE_ORDER_ID = T2.Field<string>("SOURCE_ORDER_ID") } into Result
                    //            from result in Result.DefaultIfEmpty()
                    //            where T0.Field<string>("STATE") == "COMPLETED" //&& T1.Field<string>("SOURCE_ORDER_ID") == null
                    //            && T1.Field<string>("ORDER_ID") == Convert.ToString(HEADER["ORDER_ID"])
                    //            select new
                    //            {
                    //                QUANTITY = T1.Field<decimal>("QUANTITY"),
                    //                GROSS_SALES_MONEY = T1.Field<decimal>("GROSS_SALES_MONEY"),
                    //                GROSS_RETURN_MONEY = result == null ? 0 : result.Field<decimal>("GROSS_RETURN_MONEY"),
                    //                TOTAL_TAX_MONEY_1 = T1.Field<decimal>("TOTAL_TAX_MONEY"),
                    //                TOTAL_TAX_MONEY_2 = result == null ? 0 : result.Field<decimal>("TOTAL_TAX_MONEY"),
                    //                TOTAL_DISCOUNT_MONEY = T1.Field<decimal>("TOTAL_DISCOUNT_MONEY")
                    //            }).ToList();
                    var tips = (from T0 in SQ_Dataset.Tables[0].AsEnumerable()
                                join T1 in SQ_Dataset.Tables[2].AsEnumerable()
                                on T0.Field<string>("ORDER_ID") equals T1.Field<string>("ORDER_ID")
                                where T0.Field<string>("STATE") == "COMPLETED" && T1.Field<string>("STATUS") == "COMPLETED" && T1.Field<string>("ORDER_ID") == Convert.ToString(HEADER["ORDER_ID"])
                                select new
                                {
                                    TIP_MONEY = T1.Field<decimal?>("TIP_MONEY") == null ? 0 : T1.Field<decimal>("TIP_MONEY")
                                }).ToList();

                    var serviceCharge = (from T0 in SQ_Dataset.Tables[0].AsEnumerable().Where(p => (p.Field<string>("STATE") == "COMPLETED" || p.Field<string>("STATE") == "OPEN") && p.Field<string>("ORDER_ID") == Convert.ToString(HEADER["ORDER_ID"]))
                                         select new { NET_SERVICE_CHARGE_MONEY = T0.Field<decimal>("NET_SERVICE_CHARGE_MONEY") }).ToList();

                    FillLines(SQ_Dataset, Convert.ToString(HEADER["ORDER_ID"]), Convert.ToString(HEADER["CREATED_AT"]), _ICashUp);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();


                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    DR_SQ_HEADER["CHECK_ID"] = HEADER["ORDER_ID"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["ORDER_ID"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["CREATED_AT"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSED_AT"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CLOSED_AT"]);
                    DR_SQ_HEADER["COVERS"] = 1;
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = (object)DBNull.Value; ;
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = (object)DBNull.Value; ;
                    DR_SQ_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                    DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0; //((Convert.ToDecimal(data.Sum(p => p.GROSS_SALES_MONEY)) - Convert.ToDecimal(data.Sum(p => p.GROSS_RETURN_MONEY))) - (Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_1)) - Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_2)))) > 0 ? ((Convert.ToDecimal(data.Sum(p => p.GROSS_SALES_MONEY)) - Convert.ToDecimal(data.Sum(p => p.GROSS_RETURN_MONEY))) - (Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_1)) - Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_2)))) / 100 : 0;
                    DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0; //(Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_1)) - Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_2))) > 0 ? (Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_1)) - Convert.ToDecimal(data.Sum(p => p.TOTAL_TAX_MONEY_2))) / 100 : 0;
                    DR_SQ_HEADER["GROSS"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0; //(Convert.ToDecimal(data.Sum(p => p.GROSS_SALES_MONEY)) - Convert.ToDecimal(data.Sum(p => p.GROSS_RETURN_MONEY))) > 0 ? (Convert.ToDecimal(data.Sum(p => p.GROSS_SALES_MONEY)) - Convert.ToDecimal(data.Sum(p => p.GROSS_RETURN_MONEY))) / 100 : 0;
                    DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0; // (Convert.ToDecimal(data.Sum(p => p.TOTAL_DISCOUNT_MONEY))) > 0 ? (Convert.ToDecimal(data.Sum(p => p.TOTAL_DISCOUNT_MONEY))) / 100 : 0;
                    DR_SQ_HEADER["COMP"] = 0;// SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).Count() > 0 ? Convert.ToDecimal(SQ_Dataset.Tables[1].Select("CHECKID=" + HEADER["CHECKID"]).CopyToDataTable().Compute("SUM(PROMOAMT)", string.Empty)) : 0;
                    DR_SQ_HEADER["VOID"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0; //;

                    DR_SQ_HEADER["TIPS"] = tips.Sum(p => p.TIP_MONEY) > 0 ? tips.Sum(p => p.TIP_MONEY) / 100 : 0;
                    DR_SQ_HEADER["SERVICE_CHARGE"] = serviceCharge.Sum(p => p.NET_SERVICE_CHARGE_MONEY) > 0 ? serviceCharge.Sum(p => p.NET_SERVICE_CHARGE_MONEY) / 100 : 0;
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = HEADER["CURRENCY"];
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = (object)DBNull.Value;
                    DR_SQ_HEADER["STAFF_NAME"] = (object)DBNull.Value;
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);


                    FillPayments(SQ_Dataset, Convert.ToString(HEADER["ORDER_ID"]), _ICashUp);
                    FillDiscounts(SQ_Dataset, Convert.ToString(HEADER["ORDER_ID"]), _ICashUp);
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(DataSet Root, string Header_Id, string CREATED_AT, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[1].Select("ORDER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {

                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["REVENUE_CENTER"] = (object)DBNull.Value;

                        var category = (from T1 in Root.Tables[1].AsEnumerable()
                                        join T4 in Root.Tables[4].AsEnumerable()
                                        on T1.Field<string>("CATEGORY_ID") equals T4.Field<string>("CATEGORY_ID")
                                        where T1.Field<string>("ORDER_ID") == Header_Id
                                        select new
                                        {
                                            CATEGORY_ID = T4.Field<string>("CATEGORY_DATA_NAME") == "Uncategorised" ? "000000000000000000000000" : T4.Field<string>("CATEGORY_ID"),
                                            NAME = T4.Field<string>("CATEGORY_DATA_NAME"),
                                            UID = T1.Field<string>("UID")
                                        }).ToList();

                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.CATEGORY_ID)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.NAME)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.NAME)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["CATEGORY_ID"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.CATEGORY_ID)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["CATEGORY_CODE"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.NAME)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["CATEGORY_NAME"] = category.Count() > 0 ? string.Join(",", category.Where(p => p.UID == DR_LINE["UID"].ToString()).Select(p => p.NAME)).TrimStart(',').TrimEnd(',') : "";
                        DR_SQ_LINE["PRODUCT_SKU"] = Convert.ToString(DR_LINE["CATALOG_OBJECT_ID"]);
                        DR_SQ_LINE["PRODUCT_NAME"] = Convert.ToString(DR_LINE["NAME"]);
                        DR_SQ_LINE["QUANITY"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? DR_LINE["QUANTITY"] : Convert.ToDecimal(DR_LINE["QUANTITY"]) * -1;

                        decimal GROSS_AMT = 0;
                        if (Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "")
                            GROSS_AMT = Convert.ToDecimal(DR_LINE["GROSS_SALES_MONEY"]) / 100;
                        else
                            GROSS_AMT = (Convert.ToDecimal(DR_LINE["GROSS_RETURN_MONEY"]) - Convert.ToDecimal(DR_LINE["TOTAL_DISCOUNT_MONEY"])) / 100;

                        decimal TAX = Convert.ToDecimal(DR_LINE["TOTAL_TAX_MONEY"]) == 0 ? 0 : Convert.ToDecimal(DR_LINE["TOTAL_TAX_MONEY"]) / 100;
                        decimal NET = GROSS_AMT - TAX;
                        decimal DISCOUNT_AMT = Convert.ToDecimal(DR_LINE["TOTAL_DISCOUNT_MONEY"]) == 0 ? 0 : Convert.ToDecimal(DR_LINE["TOTAL_DISCOUNT_MONEY"]) / 100;

                        DR_SQ_LINE["NET"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? NET : (NET * -1);
                        DR_SQ_LINE["TAX"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? TAX : (TAX * -1);
                        DR_SQ_LINE["GROSS"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? GROSS_AMT : (GROSS_AMT * -1);

                        DR_SQ_LINE["DISCOUNT"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? DISCOUNT_AMT : DISCOUNT_AMT * -1;// (Convert.ToDecimal(data.Where(p => p.UID == DR_LINE["UID"].ToString()).Sum(p => p.TOTAL_DISCOUNT_MONEY))) > 0 ? (Convert.ToDecimal(data.Where(p => p.UID == DR_LINE["UID"].ToString()).Sum(p => p.TOTAL_DISCOUNT_MONEY))) / 100 : 0;

                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) != "" ? ((Convert.ToDecimal(DR_LINE["GROSS_RETURN_MONEY"]) - Convert.ToDecimal(DR_LINE["TOTAL_TAX_MONEY"])) / 100) * -1 : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = CREATED_AT;
                        DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_ID"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? (object)DBNull.Value : "";
                        DR_SQ_LINE["VOID_REASON"] = Convert.ToString(DR_LINE["SOURCE_LINE_ITEM_UID"]) == "" ? (object)DBNull.Value : "";

                        var discount = Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").ToList();

                        DR_SQ_LINE["DISCOUNT_ID"] = discount.Count() > 0 ? string.Join(",", discount.Select(p => p.Field<string>("UID"))) : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = discount.Count() > 0 ? string.Join(",", discount.Select(p => p.Field<string>("NAME"))) : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = DISCOUNT_AMT == 0 ? 0 : (DISCOUNT_AMT / (GROSS_AMT + DISCOUNT_AMT)) * 100;//Convert.ToDecimal(DR_LINE["VARIATION_TOTAL_PRICE_MONEY"]) == 0 || Convert.ToDecimal(DR_LINE["TOTAL_DISCOUNT_MONEY"]) == 0 ? 0 : (Convert.ToDecimal(DR_LINE["TOTAL_DISCOUNT_MONEY"]) / Convert.ToDecimal(DR_LINE["VARIATION_TOTAL_PRICE_MONEY"])) * 100;
                        DR_SQ_LINE["TAX_RATE"] = DR_LINE["TAX_PERCENTAGE"] == null || Convert.ToString(DR_LINE["TAX_PERCENTAGE"]) == "" ? 0 : Convert.ToDecimal(DR_LINE["TAX_PERCENTAGE"]);
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
        DataTable FillPayments(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[2].Select("ORDER_ID='" + Header_Id + "'  and STATUS='COMPLETED'").Count() > 0)
                {

                    foreach (DataRow DR in Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and STATUS='COMPLETED'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_ID"] == (object)DBNull.Value ? (object)DBNull.Value : DR["PAYMENT_ID"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["CARD_BRAND"] == (object)DBNull.Value ? (object)DBNull.Value : DR["CARD_BRAND"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["SOURCE_TYPE"] == (object)DBNull.Value ? (object)DBNull.Value : DR["SOURCE_TYPE"];

                        decimal AMOUNT_MONEY = DR["AMOUNT_MONEY"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["AMOUNT_MONEY"]);
                        decimal REFUND_AMOUNT = DR["REFUND_AMOUNT"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["REFUND_AMOUNT"]);
                        decimal TIP_MONEY = DR["TIP_MONEY"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["TIP_MONEY"]);

                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = ((AMOUNT_MONEY - REFUND_AMOUNT) + TIP_MONEY) == 0 ? 0 : ((AMOUNT_MONEY - REFUND_AMOUNT) + TIP_MONEY) / 100;   //(TOTAL_MONEY + TIP_MONEY) > 0 ? (TOTAL_MONEY + TIP_MONEY) / 100 : 0;
                        DR_PAYMENT["TIPS"] = DR["TIP_MONEY"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["TIP_MONEY"]) / 100;
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
        DataTable FillDiscounts(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        if (Convert.ToDecimal(Convert.ToDecimal(DR["APPLIED_MONEY"]) / 100) != 0)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = DR["UID"] == null ? (object)DBNull.Value : DR["UID"];
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["NAME"]; ;
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["APPLIED_MONEY"]) / 100;
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
