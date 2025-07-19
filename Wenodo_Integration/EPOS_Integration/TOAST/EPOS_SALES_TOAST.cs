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


namespace EPOS_Integration.TOAST
{
    class EPOS_SALES_TOAST<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_ToastData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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
                    DS_DATA.Tables[1].Columns["Void?"].ColumnName = "VOID"; DS_DATA.Tables[1].AcceptChanges();
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(DS_DATA, _ICashUp);
                }
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_SquareupData - TOAST - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_TOASTData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;
        }
        DataTable FillHeader(DataSet DS_Dataset, Cashup _ICashUp)
        {
            try
            {
                //tring[] filesList = { "OrderDetails.csv", "ItemSelectionDetails.csv", "PaymentDetails.csv", "ModifiersSelectionDetails.csv", "CheckDetails.csv" };
                foreach (DataRow HEADER in DS_Dataset.Tables[0].Rows)
                {
                    FillLines(DS_Dataset, Convert.ToString(HEADER["ORDER_ID"]), Convert.ToString(HEADER["REVENUE_CENTER"]), _ICashUp);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();

                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    DR_SQ_HEADER["CHECK_ID"] = HEADER["ORDER_ID"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["ORDER_NO"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["OPENED"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSED"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CLOSED"]);
                    DR_SQ_HEADER["COVERS"] = HEADER["NO_OF_GUESTS"];
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = "";
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["REVENUE_CENTER"];
                    DR_SQ_HEADER["SERVE_MODE"] = Convert.ToString(HEADER["DINING_OPTIONS"]) == "Take Out" ? "Take Away" : "Eat In";
                    DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                    DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                    DR_SQ_HEADER["GROSS"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0;
                    DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                    DR_SQ_HEADER["COMP"] = 0;
                    DR_SQ_HEADER["VOID"] = SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count() > 0 && SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty) != (object)DBNull.Value ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;

                    DR_SQ_HEADER["TIPS"] = HEADER["TIP"];
                    DR_SQ_HEADER["SERVICE_CHARGE"] = HEADER["GRATUITY"];
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = (object)DBNull.Value;
                    DR_SQ_HEADER["STAFF_NAME"] = HEADER["SERVER"];
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                    FillPayments(DS_Dataset, Convert.ToString(HEADER["ORDER_ID"]), _ICashUp);
                    FillDiscounts(DS_Dataset, Convert.ToString(HEADER["ORDER_ID"]), _ICashUp);
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(DataSet Root, string Header_Id, string Revenue_Center, Cashup _ICashUp)
        {
            try
            {
                //tring[] filesList = { "OrderDetails.csv", "ItemSelectionDetails.csv", "PaymentDetails.csv", "ModifiersSelectionDetails.csv", "CheckDetails.csv" };
                if (Root.Tables[1].Select("ORDER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("ORDER_ID = '" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        decimal _dNet = 0;
                        decimal _dTax = Convert.ToDecimal(Convert.ToDouble(DR_LINE["TAX"]));
                        decimal _dDis = 0;
                        decimal _dGross = 0;
                        decimal _dDiscountPercentage = 0;
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = Revenue_Center;
                        DR_SQ_LINE["REVENUE_CENTER"] = Revenue_Center;
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["CATEGORY_ID"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["CATEGORY_CODE"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["CATEGORY_NAME"] = Convert.ToString(DR_LINE["SALES_CATEGORY"]);
                        DR_SQ_LINE["PRODUCT_SKU"] = Convert.ToString(DR_LINE["MENU_ITEM"]);// Convert.ToString(DR_LINE["PLU"]);
                        DR_SQ_LINE["PRODUCT_NAME"] = Convert.ToString(DR_LINE["MENU_ITEM"]);
                        DR_SQ_LINE["QUANITY"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? Convert.ToInt32(Convert.ToDecimal(DR_LINE["QTY"])) * - 1 : Convert.ToInt32(Convert.ToDecimal(DR_LINE["QTY"]));

                        _dDiscountPercentage = Convert.ToDecimal(Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("ORDER_ID") == Header_Id).Sum(x => Convert.ToDecimal(x["DISCOUNT_AMOUNT"]))) == 0 ? 0 :
                            (Convert.ToDecimal(Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("ORDER_ID") == Header_Id && p.Field<string>("VOIDED").ToLower() == "false".ToLower()).Sum(x => Convert.ToDecimal(x["DISCOUNT_AMOUNT"])))
                            / Convert.ToDecimal(Root.Tables[1].AsEnumerable().Where(p => p.Field<string>("ORDER_ID") == Header_Id && p.Field<string>("VOID").ToLower() == "false".ToLower()).Sum(x => Convert.ToDecimal(x["GROSS_PRICE"])))) * 100;

                        _dNet = (Convert.ToDecimal(DR_LINE["GROSS_PRICE"]) - ((_dDiscountPercentage / 100)) * Convert.ToDecimal(DR_LINE["GROSS_PRICE"]));
                        _dDis = Convert.ToDecimal(DR_LINE["GROSS_PRICE"]) * (_dDiscountPercentage / 100);

                        _dGross = _dNet + _dTax;
                        DR_SQ_LINE["NET"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? 0 : _dNet;
                        DR_SQ_LINE["TAX"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? 0 : _dTax;
                        DR_SQ_LINE["GROSS"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? 0 : _dGross;
                        DR_SQ_LINE["DISCOUNT"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? 0 : _dDis;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? (Convert.ToDecimal(DR_LINE["GROSS_PRICE"]) * -1) : (object)DBNull.Value;
                        DR_SQ_LINE["TIME_OF_SALE"] = DR_LINE["ORDER_DATE"];
                        DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_NAME"] = DR_LINE["SERVER"];
                        DR_SQ_LINE["VOID_ID"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? (Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").Count() > 0 ? Convert.ToString(Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["VOID_REASON_ID"]) : "") : (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = Convert.ToString(DR_LINE["VOID"]).ToLower() == "true".ToLower() ? (Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").Count() > 0 ? Convert.ToString(Root.Tables[3].Select("ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["VOID_REASON"]) : "") : (object)DBNull.Value;
                        //DR_SQ_LINE["DISCOUNT_ID"] = Root.Tables[4].Select("CHECK_NO='" + DR_LINE["ORDER_NO"] + "' and CHECK_ID='" + DR_LINE["CHECK_ID"] + "'").Count() > 0 ? "" : (object)DBNull.Value;
                        if (Root.Tables[4].Select("CHECK_NO='" + DR_LINE["ORDER_NO"] + "' and CHECK_ID='" + DR_LINE["CHECK_ID"] + "'").Count() > 0)
                        {
                            List<string> UNIQUES = null;
                            string _sDiscountReason = Convert.ToString(Root.Tables[4].Select("CHECK_NO='" + DR_LINE["ORDER_NO"] + "' and CHECK_ID='" + DR_LINE["CHECK_ID"] + "'").CopyToDataTable().Rows[0]["REASON_OF_DISCOUNT"]);
                            if (_sDiscountReason.Length > 0)
                            {
                                UNIQUES = _sDiscountReason.Remove(_sDiscountReason.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                                DR_SQ_LINE["DISCOUNT_ID"] = string.Join(",", UNIQUES);
                                DR_SQ_LINE["DISCOUNT_REASON"] = string.Join(",", UNIQUES);
                            }
                            else
                            {
                                DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                                DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                            }
                        }
                        else
                        {
                            DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                        }

                        DR_SQ_LINE["DISCOUNT_RATE"] = _dDiscountPercentage;
                        DR_SQ_LINE["TAX_RATE"] = _dNet == 0 ? 0 : (_dTax / _dNet) * 100;
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                    }
                }
                if (Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").Count() > 0)
                {
                     DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                    DR_SQ_LINE["CHECK_ID"] = Header_Id;
                    DR_SQ_LINE["REVENUE_CENTER_ID"] = "";
                    DR_SQ_LINE["REVENUE_CENTER"] = "";
                    DR_SQ_LINE["ACCOUNT_GROUP_ID"] = "";
                    DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = "";
                    DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = "";
                    DR_SQ_LINE["CATEGORY_ID"] = "";
                    DR_SQ_LINE["CATEGORY_CODE"] = "";
                    DR_SQ_LINE["CATEGORY_NAME"] = "";
                    DR_SQ_LINE["PRODUCT_SKU"] = "";
                    DR_SQ_LINE["PRODUCT_NAME"] = "";
                    DR_SQ_LINE["QUANITY"] = 1;
                    DR_SQ_LINE["NET"] = Convert.ToString(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["REFUND_AMOUNT"]) != "" ? Convert.ToDecimal(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["AMOUNT"]) * -1 : 0;
                    DR_SQ_LINE["TAX"] = Convert.ToString(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["REFUND_AMOUNT"]) != "" ? Convert.ToDecimal(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["GRATUITY"]) * -1 : 0;
                    DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_SQ_LINE["NET"]) + Convert.ToDecimal(DR_SQ_LINE["TAX"]);// Convert.ToString(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["REFUND_AMOUNT"]) != "" ? Convert.ToDecimal(Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and REFUND_AMOUNT <> ''").CopyToDataTable().Rows[0]["REFUND_AMOUNT"]) * -1 : 0;
                    DR_SQ_LINE["DISCOUNT"] = 0;
                    DR_SQ_LINE["COMP"] = 0;
                    DR_SQ_LINE["VOID"] = 0;
                    DR_SQ_LINE["TIME_OF_SALE"] = Root.Tables[2].Select("ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["PAID_DATE"];
                    DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                    DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                    DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                    DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value; //Root.Tables[4].Select("Order_#='" + DR_LINE["Order_#"] + "' and Check_Id='" + DR_LINE["Check_Id"] + "'").Count() > 0 ? Convert.ToString(Root.Tables[3].Select("Order_#='" + DR_LINE["Order_#"] + "' and Check_Id='" + DR_LINE["Check_Id"] + "'").CopyToDataTable().Rows[0]["Reason of Discount"]) : (object)DBNull.Value;
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
        DataTable FillPayments(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                // //tring[] filesList = { "OrderDetails.csv", "ItemSelectionDetails.csv", "PaymentDetails.csv", "ModifiersSelectionDetails.csv", "CheckDetails.csv" };
                if (Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and STATUS='CAPTURED'").Count() > 0)
                {

                    foreach (DataRow DR in Root.Tables[2].Select("ORDER_ID='" + Header_Id + "' and STATUS='CAPTURED'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["TYPE"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["TYPE"] == (object)DBNull.Value ? "" : DR["TYPE"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["CARD_TYPE"] == (object)DBNull.Value || Convert.ToString(DR["CARD_TYPE"]) == "" ? DR["TYPE"] : DR["CARD_TYPE"];


                        decimal AMOUNT_MONEY = Convert.ToString(DR["TOTAL"]) == "" ? 0 : Convert.ToDecimal(DR["TOTAL"]);
                        decimal REFUND_AMOUNT = Convert.ToString(DR["REFUND_AMOUNT"]) == "" ? 0 : Convert.ToDecimal(DR["REFUND_AMOUNT"]);
                        
                        // Remove Tips by Arvind 15-07-2025
                        //decimal TIP_MONEY = Convert.ToString(DR["TIP"]) == "" ? 0 : Convert.ToDecimal(DR["TIP"]);   
                        // DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = ((AMOUNT_MONEY - REFUND_AMOUNT) + TIP_MONEY) == 0 ? 0 : ((AMOUNT_MONEY - REFUND_AMOUNT) + TIP_MONEY);   //(TOTAL_MONEY + TIP_MONEY) > 0 ? (TOTAL_MONEY + TIP_MONEY) / 100 : 0;

                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = ((AMOUNT_MONEY - REFUND_AMOUNT)) == 0 ? 0 : ((AMOUNT_MONEY - REFUND_AMOUNT));   //(TOTAL_MONEY + TIP_MONEY) > 0 ? (TOTAL_MONEY + TIP_MONEY) / 100 : 0;
                        DR_PAYMENT["TIPS"] = DR["TIP"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["TIP"]);
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
                //tring[] filesList = { "OrderDetails.csv", "ItemSelectionDetails.csv", "PaymentDetails.csv", "ModifiersSelectionDetails.csv", "CheckDetails.csv" };
                DataTable DT = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                if (DT.Select("CHECK_ID='" + Header_Id + "'").Count() > 0)
                {
                    var list = DT.Select("CHECK_ID='" + Header_Id + "'").ToList().GroupBy(p => p.Field<string>("CHECK_ID")).Select(p => p.First()).ToList();
                    foreach (DataRow DR in list.CopyToDataTable().Rows)
                    {
                        decimal DISC = Convert.ToDecimal(DT.Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty));
                        if (DISC != 0)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = DR["DISCOUNT_REASON"];
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["DISCOUNT_REASON"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = DISC;
                            DR_DISCOUNT["STAFF_ID"] = DR["STAFF_NAME"];
                            DR_DISCOUNT["STAFF_NAME"] = DR["STAFF_NAME"];
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

