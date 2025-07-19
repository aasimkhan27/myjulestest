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

namespace EPOS_Integration.SYRVE
{
    public class EPOS_SALES_SYRVE<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_Syrve(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SYRVE_DATA = data as DataSet;
            try
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(SYRVE_DATA as DataSet, _ICashUp, Integration_Dt);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
                LogExceptions.LogError("Transform_Syrve - Syrve - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Syrve - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;
        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                var list = Root.Tables[0].AsEnumerable().ToList().GroupBy(p => p.Field<string>("UniqOrderIdId")).Select(p => p.First()).ToList();
                foreach (DataRow HEADER in list.CopyToDataTable().Rows)
                {
                    FillLines(Root, HEADER["UniqOrderIdId"].ToString(), _ICashUp, Integration_Dt);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                    DR_SQ_HEADER["CHECK_ID"] = HEADER["UniqOrderIdId"];
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["OrderNum"];
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["OpenTime"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["OpenTime"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CloseTime"]) == "" ? (object)DBNull.Value : Convert.ToString(HEADER["CloseTime"]); ;
                    DR_SQ_HEADER["COVERS"] = HEADER["GuestNum"];
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["Department"];
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["Department"];
                    DR_SQ_HEADER["SERVE_MODE"] = HEADER["DishGroupTopParent"].ToString() == "Delivery" ? "Take Away" : "Eat In";
                    DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                    DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                    DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                    DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                    DR_SQ_HEADER["COMP"] = 0;
                    decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").Count() > 0 ? (SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty).ToString() == "" ? 0 : Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["UniqOrderIdId"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty))) : 0;
                    DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                    DR_SQ_HEADER["TIPS"] = 0;
                    DR_SQ_HEADER["SERVICE_CHARGE"] = 0;
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = HEADER["CurrenciesCurrency"];
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = HEADER["OrderWaiterName"];
                    DR_SQ_HEADER["STAFF_NAME"] = HEADER["OrderWaiterId"];
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);

                    FillPayments(Root, HEADER["UniqOrderIdId"].ToString(), _ICashUp);
                    FillDiscounts(Root, HEADER["UniqOrderIdId"].ToString(), _ICashUp);

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
                if (Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        if (Convert.ToBoolean(DR["Storned"])==false)
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Header_Id;
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = DR["Department"];
                            DR_SQ_LINE["REVENUE_CENTER"] = DR["Department"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["DishCategory"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["DishCategory"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["DishGroup"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR["DishCategory"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR["DishCategory"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR["DishGroup"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR["DishCode"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR["DishName"];
                            DR_SQ_LINE["QUANITY"] = DR["DishAmountInt"];
                            DR_SQ_LINE["NET"] = Convert.ToDecimal(DR["DishDiscountSumIntwithoutVAT"]);
                            DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR["VATSum"]); ;
                            DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR["DishDiscountSumInt"]);
                            DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR["DiscountSum"]);
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = (object)DBNull.Value;
                            DR_SQ_LINE["STAFF_ID"] = DR["OrderWaiterName"];
                            DR_SQ_LINE["STAFF_NAME"] = DR["OrderWaiterName"];
                            DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_ID"] = DR["OrderDiscountTypeIDs"];
                            DR_SQ_LINE["DISCOUNT_REASON"] = DR["OrderDiscountType"];
                            DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR["DiscountPercent"]);
                            DR_SQ_LINE["TAX_RATE"] = Convert.ToString(DR["VATPercent"]) == "" ? 0 : Convert.ToDecimal(DR["VATPercent"]);
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        }
                        else 
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Header_Id;// Root.Tables[0].Select("ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["UniqOrderIdId"];
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = DR["Department"];
                            DR_SQ_LINE["REVENUE_CENTER"] = DR["Department"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR["DishGroupNum"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR["DishGroupNum"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR["DishGroup"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR["DishGroupNum"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR["DishGroupNum"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR["DishGroup"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR["DishCode"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR["DishName"];
                            DR_SQ_LINE["QUANITY"] =Convert.ToDecimal(DR["DishAmountInt"])*-1;
                            DR_SQ_LINE["NET"] = 0;
                            DR_SQ_LINE["TAX"] = 0;
                            DR_SQ_LINE["GROSS"] = 0;
                            DR_SQ_LINE["DISCOUNT"] = 0;
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR["DishReturnSum"]) * -1; // Convert.ToDecimal(DR["DishDiscountSumIntwithoutVAT"]) * -1;
                            DR_SQ_LINE["STAFF_ID"] = DR["OrderWaiterName"];
                            DR_SQ_LINE["STAFF_NAME"] = DR["OrderWaiterName"];
                            DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value; ;
                            DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value; ;
                            DR_SQ_LINE["DISCOUNT_RATE"] = (object)DBNull.Value;
                            DR_SQ_LINE["TAX_RATE"] = (object)DBNull.Value;
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
                if (Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "' and Storned='FALSE'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "' and Storned='FALSE'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PaymentTransactionId"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PayTypesGroup"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["PayTypesGroup"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["DishDiscountSumInt"]);
                        DR_PAYMENT["TIPS"] = 0;// Convert.ToDecimal(DR["TIP"]);
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
                if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "' and DISCOUNT <>0").Count() > 0)
                {
                    if (Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "' and DISCOUNT <>0").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) != 0)
                    {
                        foreach (DataRow DR in _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "' and DISCOUNT <>0").CopyToDataTable().Rows)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["DISCOUNT_REASON"]);
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["DISCOUNT"]);
                            DR_DISCOUNT["STAFF_ID"] = DR["STAFF_ID"];
                            DR_DISCOUNT["STAFF_NAME"] = DR["STAFF_NAME"];
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                        }
                    }
                }


                //if (Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "' and OrderDiscountTypeIDs <> null").Count() > 0)
                //{
                //    if (Convert.ToDecimal(Root.Tables[0].Select("UniqOrderIdId='" + Header_Id + "' and OrderDiscountTypeIDs <> null").CopyToDataTable().Compute("SUM(DiscountSum)", string.Empty)) != 0)
                //    {
                //        foreach (DataRow DR in Root.Tables[0].Select("UniqOrderIdId=" + Header_Id).CopyToDataTable().Rows)
                //        {
                //            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                //            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                //            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["OrderDiscountTypeIDs"]);
                //            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["OrderDiscountType"]);
                //            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["DiscountSum"]);
                //            DR_DISCOUNT["STAFF_ID"] = DR["STAFFID"];
                //            DR_DISCOUNT["STAFF_NAME"] = DR["STAFFNAME"];
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
