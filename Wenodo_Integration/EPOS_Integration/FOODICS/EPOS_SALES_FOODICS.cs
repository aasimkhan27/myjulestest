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

namespace EPOS_Integration.FOODICS
{
    class EPOS_SALES_FOODICS<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_Foodics(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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
                LogExceptions.LogError("Transform_Foodics - Foodics- " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Foodics- start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                foreach (DataRow HEADER in Root.Tables[0].Rows)
                { 
                    FillLines(Root, HEADER["ID"].ToString(), _ICashUp, Integration_Dt);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                    DR_SQ_HEADER["CHECK_ID"] = HEADER["REFERENCE"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["CHECK_NUMBER"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["OPENED_AT"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["OPENED_AT"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSED_AT"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CLOSED_AT"]); ;
                    DR_SQ_HEADER["COVERS"] = HEADER["GUESTS"];
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["TABLE_SECTION_ID"];
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["TABLE_SECTION_NAME"];
                    DR_SQ_HEADER["SERVE_MODE"] = Convert.ToInt32(HEADER["TYPE"]) == 1 ? "Eat In" : (Convert.ToInt32(HEADER["TYPE"]) == 2 ? "Take Away" : (Convert.ToInt32(HEADER["TYPE"]) == 3 ? "Delivery" : "Take Away"));
                    DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                    DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                    DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                    DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                    DR_SQ_HEADER["COMP"] = 0;
                    decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").Count() > 0 ? (SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty).ToString() == "" ? 0 : Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["REFERENCE"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty))) : 0;
                    DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                    DR_SQ_HEADER["TIPS"] = Root.Tables[3].Select("FOODICS_ORDERS_ID=" + HEADER["ID"] + "").Count() > 0 ? Convert.ToDecimal(Root.Tables[3].Select("FOODICS_ORDERS_ID=" + HEADER["ID"]).CopyToDataTable().AsEnumerable().Sum(p => Convert.ToDecimal(p.Field<decimal>("TIPS")))) : 0;
                    DR_SQ_HEADER["SERVICE_CHARGE"] = 0;
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = "AED";
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = HEADER["CREATOR_ID"];
                    DR_SQ_HEADER["STAFF_NAME"] = HEADER["CREATOR_NAME"];
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);

                    FillPayments(Root, HEADER["ID"].ToString(), _ICashUp);
                    FillDiscounts(Root, HEADER["ID"].ToString(), _ICashUp);

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
            try
            {
                if (Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        if (Convert.ToInt32(DR["STATUS"]) != 4 && Convert.ToInt32(DR["STATUS"]) != 5 && Convert.ToInt32(DR["STATUS"]) != 6 && Convert.ToInt32(DR["STATUS"]) != 7)
                        {
                            decimal _discountPercentageAmt = 0;

                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REFERENCE"];
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_ID"];
                            DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_NAME"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR["ORDERS_PRODUCTS_SKU"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR["ORDERS_PRODUCTS_NAME"];
                            DR_SQ_LINE["QUANITY"] = DR["QUANTITY"]; 
                            
                            string DIS_ODR_AMOUNT = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DIS_ODR_AMOUNT"]);
                            if (DIS_ODR_AMOUNT == "")
                            {
                                if (Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_TYPE"]) == "1")
                                {
                                    decimal _tempDiscountPercentage = (Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TAX_EXCLUSIVE_DISCOUNT"]) * 100) /
                                        Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["SUBTOTAL_PRICE"]);
                                    _discountPercentageAmt = (Convert.ToDecimal(_tempDiscountPercentage) * Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"])) / 100;

                                    //decimal _tempDiscountPercentage = (Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) * 100) /
                                    //    Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["SUBTOTAL_PRICE"]);
                                    //_discountPercentageAmt = (Convert.ToDecimal(_tempDiscountPercentage) * Convert.ToDecimal(DR["TOTAL_PRICE"])) / 100;
                                }
                                else
                                {
                                    if (Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) == "")
                                        _discountPercentageAmt = 0;

                                    else if (Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) != "")
                                    {
                                        decimal _tempTotalPrice = Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) + Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TOTAL_PRICE"]);
                                        decimal _tempDiscountPercentage = Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) == 0 ? 0 : _tempTotalPrice / Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]);
                                        _discountPercentageAmt = (Convert.ToDecimal(_tempDiscountPercentage) * Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"])) / 100;
                                    }
                                }
                            }
                            else if (Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) == 0)
                                _discountPercentageAmt = 0;
                            else
                                _discountPercentageAmt = (Convert.ToDecimal(DIS_ODR_AMOUNT) * Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"])) / 100;

                            DR_SQ_LINE["NET"] = Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"]) - Convert.ToDecimal(_discountPercentageAmt);
                            DR_SQ_LINE["TAX"] = Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").Count() == 0 ? 0 : Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").CopyToDataTable().Rows[0]["TAXES_PIVOT_AMOUNT"];
                            DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_SQ_LINE["NET"]) + Convert.ToDecimal(DR_SQ_LINE["TAX"]); ;
                            if (Convert.ToDecimal(DR["DISCOUNT_AMOUNT"]) > 0)
                            {
                                _discountPercentageAmt += Convert.ToDecimal(DR["DISCOUNT_AMOUNT"]);
                            }
                            DR_SQ_LINE["DISCOUNT"] = _discountPercentageAmt;
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = (object)DBNull.Value;
                            DR_SQ_LINE["STAFF_ID"] = DR["ORDERS_PRODUCTS_CREATOR_ID"];
                            DR_SQ_LINE["STAFF_NAME"] = DR["ORDERS_PRODUCTS_CREATOR_NAME"];
                            DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_ID"]) == "" ? (object)DBNull.Value : Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_ID"]);
                            DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_NAME"]) == "" ? (object)DBNull.Value : Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_NAME"]);
                            DR_SQ_LINE["DISCOUNT_RATE"] = DIS_ODR_AMOUNT == "" ? 0 : Convert.ToDecimal(DIS_ODR_AMOUNT);
                            DR_SQ_LINE["TAX_RATE"] = Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").Count() == 0 ? 0 : Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").CopyToDataTable().Rows[0]["TAXES_PIVOT_RATE"];
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        }
                        else if (Convert.ToInt32(DR["STATUS"]) == 5 || Convert.ToInt32(DR["STATUS"]) == 7)
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REFERENCE"];
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_ID"];
                            DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_NAME"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR["ORDERS_PRODUCTS_SKU"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR["ORDERS_PRODUCTS_NAME"];
                            DR_SQ_LINE["QUANITY"] = DR["QUANTITY"];
                            DR_SQ_LINE["NET"] = 0;
                            DR_SQ_LINE["TAX"] = 0;
                            DR_SQ_LINE["GROSS"] = 0;
                            DR_SQ_LINE["DISCOUNT"] = 0;
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = Convert.ToString(DR["ORDERS_PRODUCTS_VOID_RZN_ID"]) == "" ? 0 : Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"]) * -1;
                            DR_SQ_LINE["STAFF_ID"] = DR["ORDERS_PRODUCTS_VOIDER_ID"];
                            DR_SQ_LINE["STAFF_NAME"] = DR["ORDERS_PRODUCTS_VOIDER_NAME"];
                            DR_SQ_LINE["VOID_ID"] = Convert.ToString(DR["ORDERS_PRODUCTS_VOIDER_ID"]);
                            DR_SQ_LINE["VOID_REASON"] = Convert.ToString(DR["ORDERS_PRODUCTS_VOID_RZN_NAME"]);
                            DR_SQ_LINE["DISCOUNT_ID"] = 0;
                            DR_SQ_LINE["DISCOUNT_REASON"] = 0;
                            DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                            DR_SQ_LINE["TAX_RATE"] = 0;
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        }
                        else if (Convert.ToInt32(DR["STATUS"]) == 6)
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REFERENCE"];
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_ID"];
                            DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TABLE_SECTION_NAME"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR["ORDERS_PRODUCTS_CATEGORY_ID"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR["ORDERS_PRODUCTS_CATEGORY_REFERENCE"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR["ORDERS_PRODUCTS_CATEGORY_NAME"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR["ORDERS_PRODUCTS_SKU"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR["ORDERS_PRODUCTS_NAME"];
                            DR_SQ_LINE["QUANITY"] = DR["QUANTITY"];
                            DR_SQ_LINE["NET"] = Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"]) * -1;
                            DR_SQ_LINE["TAX"] = Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").Count() == 0 ? 0 : Convert.ToDecimal(Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").CopyToDataTable().Rows[0]["TAXES_PIVOT_AMOUNT"]) * -1;
                            DR_SQ_LINE["GROSS"] = (Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"]) + Convert.ToDecimal(DR_SQ_LINE["TAX"]) * -1) * -1;
                            DR_SQ_LINE["DISCOUNT"] = 0;
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = 0;
                            DR_SQ_LINE["STAFF_ID"] = DR["ORDERS_PRODUCTS_VOIDER_ID"];
                            DR_SQ_LINE["STAFF_NAME"] = DR["ORDERS_PRODUCTS_VOIDER_NAME"];
                            DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_ID"] = 0;
                            DR_SQ_LINE["DISCOUNT_REASON"] = 0;
                            DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                            DR_SQ_LINE["TAX_RATE"] = Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").Count() == 0 ? 0 : Root.Tables[2].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and FOODICS_ORDERS_PRODUCTS_ID='" + DR["ID"] + "'").CopyToDataTable().Rows[0]["TAXES_PIVOT_RATE"]; ;
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
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
        DataTable FillPayments(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[3].Select("FOODICS_ORDERS_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[3].Select("FOODICS_ORDERS_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REFERENCE"];
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_METHOD_ID"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PAYMENT_METHOD_NAME"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["PAYMENT_METHOD_NAME"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["AMOUNT"]) + Convert.ToDecimal(DR["TIPS"]);
                        DR_PAYMENT["TIPS"] = Convert.ToDecimal(DR["TIPS"]);
                        _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                    }
                }

                //}
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
                if (Root.Tables[0].Select("ID=" + Header_Id + " and STATUS=4").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[0].Select("ID=" + Header_Id + " and STATUS=4").CopyToDataTable().Rows)
                    {
                        decimal _discountSumformLine = 0;
                        if (Convert.ToDecimal(DR["DISCOUNT_AMOUNT"]) != 0)
                        {
                            if (Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and STATUS<>4 and STATUS<>5 and STATUS<>6 and STATUS<>7 and DISCOUNT_AMOUNT>0").Count() > 0)
                            {
                                _discountSumformLine = Convert.ToDecimal(Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and STATUS<>4 and STATUS<>5 and STATUS<>6 and STATUS<>7 and DISCOUNT_AMOUNT>0").CopyToDataTable().Compute("SUM(DISCOUNT_AMOUNT)", string.Empty));
                            }
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = DR["REFERENCE"].ToString();
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["DISCOUNT_NAME"]) == "" ? (object)DBNull.Value : Convert.ToString(DR["DISCOUNT_NAME"]);
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["TAX_EXCLUSIVE_DISCOUNT"])+ _discountSumformLine;
                            DR_DISCOUNT["STAFF_ID"] = Convert.ToString(DR["CREATOR_ID"]);
                            DR_DISCOUNT["STAFF_NAME"] = Convert.ToString(DR["CREATOR_NAME"]);
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                        }
                        else if (Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and STATUS<>4 and STATUS<>5 and STATUS<>6 and STATUS<>7 and DISCOUNT_AMOUNT>0").Count() > 0)
                        {
                            _discountSumformLine = Convert.ToDecimal(Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "' and STATUS<>4 and STATUS<>5 and STATUS<>6 and STATUS<>7 and DISCOUNT_AMOUNT>0").CopyToDataTable().Compute("SUM(DISCOUNT_AMOUNT)", string.Empty));
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = DR["REFERENCE"].ToString();
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["DISCOUNT_NAME"]) == "" ? (object)DBNull.Value : Convert.ToString(DR["DISCOUNT_NAME"]);
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["TAX_EXCLUSIVE_DISCOUNT"]) + _discountSumformLine;
                            DR_DISCOUNT["STAFF_ID"] = Convert.ToString(DR["CREATOR_ID"]);
                            DR_DISCOUNT["STAFF_NAME"] = Convert.ToString(DR["CREATOR_NAME"]);
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                        }
                    }
                }
                //foreach (DataRow DR in Root.Tables[1].Select("FOODICS_ORDERS_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                //{
                //    if (Convert.ToInt32(DR["STATUS"]) != 5 && Convert.ToInt32(DR["STATUS"]) != 4)
                //    {
                //        if (Convert.ToDecimal(Root.Tables[0].Select("ID=" + Header_Id).CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) != 0)
                //        {
                //            decimal _discountPercentageAmt = 0;
                //            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                //            DR_DISCOUNT["CHECK_ID"] = Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REFERENCE"];
                //            string _tempValue = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DIS_ODR_AMOUNT"]);
                //            if (_tempValue == "")
                //            {
                //                if (Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) == "")
                //                    _discountPercentageAmt = 0;
                //                else if (Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) != "")
                //                {
                //                    decimal _tempTotalPrice = Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) + Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TOTAL_PRICE"]);
                //                    decimal _tempDiscountPercentage = Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]) == 0 ? 0 : _tempTotalPrice / Convert.ToDecimal(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_AMOUNT"]);
                //                    _discountPercentageAmt = (Convert.ToDecimal(_tempDiscountPercentage) * Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"])) / 100;
                //                }
                //            }
                //            else
                //                _discountPercentageAmt = (Convert.ToDecimal(_tempValue) * Convert.ToDecimal(DR["TAX_EXCLUSIVE_TOTAL_PRICE"])) / 100;

                //            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_ID"]) == "" ? (object)DBNull.Value : Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_ID"]);
                //            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_NAME"]) == "" ? (object)DBNull.Value : Convert.ToString(Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["DISCOUNT_NAME"]);
                //            DR_DISCOUNT["DISCOUNT_AMOUNT"] = _discountPercentageAmt;
                //            DR_DISCOUNT["STAFF_ID"] = DR["ORDERS_PRODUCTS_CREATOR_ID"];
                //            DR_DISCOUNT["STAFF_NAME"] = DR["ORDERS_PRODUCTS_CREATOR_NAME"];
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

    }
}
