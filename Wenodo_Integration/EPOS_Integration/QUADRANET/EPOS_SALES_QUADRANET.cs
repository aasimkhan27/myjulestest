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

namespace EPOS_Integration.QUADRANET
{
    class EPOS_SALES_QUADRANET<T>
    {
        public CashupModel CashupModelObj { get; set; }
        int _voidFlag = 0;
        public CashupModel Transform_Quadranet(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

            DataSet QUADRANET_DATA = data as DataSet;
            try
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(QUADRANET_DATA as DataSet, _ICashUp, Integration_Dt);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
                LogExceptions.LogError("Transform_QUADRANET - QUADRANET - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -QUADRANET - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();

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
                    FillLines(Root, HEADER["BILL_HEADER_ID"].ToString(), _ICashUp, Integration_Dt);
                    if (_voidFlag == 0) {
                        FillVoidLines(Root, HEADER["BILL_HEADER_ID"].ToString(), _ICashUp, Integration_Dt);
                    }
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                    DR_SQ_HEADER["CHECK_ID"] = HEADER["BILL_HEADER_ID"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["CHECK_ITEM_ID"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["CREATED_ON"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CREATED_ON"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CHECK_CLOSE"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CHECK_CLOSE"]); ;
                    DR_SQ_HEADER["COVERS"] = HEADER["COVERS"];
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["REPORT_GROUP_NAME"];
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["REPORT_GROUP_NAME"];
                    DR_SQ_HEADER["SERVE_MODE"] = "Eat In";
                    DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                    DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                    DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                    DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                    DR_SQ_HEADER["COMP"] = 0;
                    decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? (SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty).ToString() == "" ? 0 : Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty))) : 0;
                    DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                    DR_SQ_HEADER["TIPS"] = Root.Tables[3].Select("BILL_HEADER_ID='" + HEADER["BILL_HEADER_ID"] + "'").Count() > 0 ? Convert.ToDecimal(Root.Tables[3].Select("BILL_HEADER_ID='" + HEADER["BILL_HEADER_ID"] + "'").CopyToDataTable().AsEnumerable().Sum(p => Convert.ToDecimal(p.Field<decimal>("GRATUITY")))) : 0;
                    DR_SQ_HEADER["SERVICE_CHARGE"] = HEADER["SERVICE_CHARGE"];
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = HEADER["USER_NAME"];
                    DR_SQ_HEADER["STAFF_NAME"] = HEADER["USER_NAME"];
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);

                    FillPayments(Root, HEADER["BILL_HEADER_ID"].ToString(), _ICashUp);
                    FillDiscounts(Root, HEADER["BILL_HEADER_ID"].ToString(), HEADER["CHECK_ITEM_ID"].ToString(), _ICashUp);
                    _voidFlag = 1;
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
                if (Root.Tables[1].Select("BILL_HEADER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[1].Select("BILL_HEADER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        decimal _discoutPercentage = 0;
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR["REPORT_GROUP_NAME"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR["REPORT_GROUP_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["CLASS_NAME"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR["CLASS_NAME"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR["ITEM_ID"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR["DESCRIPTION"];
                        DR_SQ_LINE["QUANITY"] = DR["QUANTITY"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR["ITEMS_NET"]);
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR["TAX_AMOUNT"]);
                        DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR["ITEMS_NET"]) + Convert.ToDecimal(DR["TAX_AMOUNT"]);
                        decimal _discountAmount = 0;
                        if (Root.Tables[2].Select("CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"] + "'  and DELETED_BEFORE_PAYMENT=0 and CHECK_DETAIL_ID='" + DR["CHECK_DETAIL_ID"] + "'").Count() > 0)
                        {
                            _discountAmount = Convert.ToDecimal(Root.Tables[2].Select("CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"] + "'  and DELETED_BEFORE_PAYMENT=0 and CHECK_DETAIL_ID='" + DR["CHECK_DETAIL_ID"] + "'").CopyToDataTable().Rows[0]["DISCOUNT_VALUE"]);
                            
                        }
                        else
                            _discountAmount = 0;

                        DR_SQ_LINE["DISCOUNT"] = _discountAmount;// Root.Tables[2].Select("CHECK_DETAIL_ID='" + DR["CHECK_DETAIL_ID"] + "' and CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"] + "'").Count() > 0 ? Convert.ToDecimal(Root.Tables[2].Select("CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"] + "'").CopyToDataTable().Rows[0]["DISCOUNT_VALUE"]) : 0; ;

                        // Root.Tables[2].Select("CHECK_DETAIL_ID='" + DR["CHECK_DETAIL_ID"] + "' and CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"]+"'").Count() > 0 ? Convert.ToDecimal(Root.Tables[2].Select("CHECK_DETAIL_ID='" + DR["CHECK_DETAIL_ID"] + "' and CHECK_ITEM_ID='" + DR["CHECK_ITEM_ID"] + "'").CopyToDataTable().Rows[0]["DISCOUNT_VALUE"]) : 0;
                        _discoutPercentage = _discountAmount == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) + Convert.ToDecimal(DR["ITEMS_TOTAL"]))) * 100;//
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_ID"] = DR["SYSTEM_USER_ID"];
                        DR_SQ_LINE["STAFF_NAME"] = DR["USER_NAME"];
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_ID"] = DR["DISCOUNT_DESCRIPTION"];
                        DR_SQ_LINE["DISCOUNT_REASON"] = DR["DISCOUNT_DESCRIPTION"];
                        DR_SQ_LINE["DISCOUNT_RATE"] = _discoutPercentage;
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR["TAX_PERCENT"]);
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
                if (Root.Tables[3].Select("BILL_HEADER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[3].Select("BILL_HEADER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_METHOD"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PAYMENT_GROUP_NAME"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["INFO"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["PAYMENT_TOTAL"]);
                        DR_PAYMENT["TIPS"] = Convert.ToDecimal(DR["GRATUITY"]);
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
        DataTable FillDiscounts(DataSet Root, string Header_Id, string Check_Item_ID, Cashup _ICashUp)
        {
            try
            {
                if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "'").Count() > 0)
                {
                    decimal _dDiscountAmount = Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty));
                    if (_dDiscountAmount != 0)
                    {
                        foreach (DataRow DR in _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["DISCOUNT"]);
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
        DataTable FillVoidLines(DataSet Root, string Header_Id, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                if (Root.Tables[4].Rows.Count > 0)
                {
                    foreach (DataRow DR in Root.Tables[4].Rows)
                    {
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR["REPORT_GROUP_NAME"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR["REPORT_GROUP_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["CLASS_NAME"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR["CATEGORY_NAME"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR["CLASS_NAME"];
                        DR_SQ_LINE["PRODUCT_SKU"] = "";
                        DR_SQ_LINE["PRODUCT_NAME"] = DR["DESCRIPTION"];
                        DR_SQ_LINE["QUANITY"] = Convert.ToDecimal(DR["QUANTITY"]) * -1;
                        DR_SQ_LINE["NET"] = 0;
                        DR_SQ_LINE["TAX"] = 0;
                        DR_SQ_LINE["GROSS"] = 0;
                        DR_SQ_LINE["DISCOUNT"] = 0;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR["ITEMS_TOTAL"]) * -1;
                        DR_SQ_LINE["STAFF_ID"] = "";
                        DR_SQ_LINE["STAFF_NAME"] = DR["USER_NAME"];
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = DR["REASON_TEXT"];
                        DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                        DR_SQ_LINE["TAX_RATE"] = 0;
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
    }
}
