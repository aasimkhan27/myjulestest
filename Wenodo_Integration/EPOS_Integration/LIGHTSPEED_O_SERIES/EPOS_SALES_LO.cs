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
namespace EPOS_Integration.LIGHTSPEED_O_SERIES
{
    public class EPOS_SALES_LO
    {
        public CashupModel CashupModelObj { get; set; }
        public void TransformLOData(DataSet data, decimal Integration_System_ID, ref Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            try
            {
                FillHeaderAndLines(data as DataSet, ref _ICashUp);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_LOData - LO - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_LOData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        int FillHeaderAndLines(DataSet Root, ref Cashup _ICashUp)
        {
            try
            {
                foreach (DataRow DR_LINE in Root.Tables[1].Select("DELETED=0").CopyToDataTable().Rows)
                {

                    DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                    DR_SQ_LINE["CHECK_ID"] = DR_LINE["ORDERS_ID"];
                    DR_SQ_LINE["REVENUE_CENTER_ID"] = (object)DBNull.Value; //DONE;
                    DR_SQ_LINE["REVENUE_CENTER"] = (object)DBNull.Value; //DONE;
                    DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["PRODUCT_ID"]; //DONE;
                    DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["PRODUCT_NAME"]; //DONE;
                    DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["PRODUCT_NAME"]; //DONE;
                    DR_SQ_LINE["CATEGORY_ID"] = (object)DBNull.Value; //DONE
                    DR_SQ_LINE["CATEGORY_CODE"] = (object)DBNull.Value; //DONE
                    DR_SQ_LINE["CATEGORY_NAME"] = (object)DBNull.Value; //DONE
                    DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["PRODUCT_ID"]; //DONE
                    DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["PRODUCT_NAME"]; //DONE
                    DR_SQ_LINE["QUANITY"] = DR_LINE["QUANTITY"]; //DONE
                    DR_SQ_LINE["NET"] = DR_LINE["LINE_TOTAL_EX_TAX"]; //DONE [];
                    DR_SQ_LINE["TAX"] = DR_LINE["LINE_TOTAL_TAX"]; //DONE [];
                    DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_LINE["LINE_TOTAL_EX_TAX"]) + Convert.ToDecimal(DR_LINE["LINE_TOTAL_TAX"]); //DONE [];;
                    DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["PRICE_VARIATION"]) < 1 ? Convert.ToDecimal(DR_LINE["UNIT_PRICE"]) * (1 - Convert.ToDecimal(DR_LINE["PRICE_VARIATION"]) * Convert.ToDecimal(DR_LINE["QUANTITY"])) : 0;
                    DR_SQ_LINE["COMP"] = 0; //Done
                    DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR_LINE["QUANTITY"]) < 0 ? Convert.ToDecimal(DR_LINE["LINE_TOTAL_EX_TAX"]) + (Convert.ToDecimal(DR_LINE["LINE_TOTAL_TAX"]) * -1) : 0; //Done
                    DR_SQ_LINE["TIME_OF_SALE"] = (object)DBNull.Value; //Done
                    DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value; //Done
                    DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value; //Done
                    DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value; //Done
                    DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value; //Done

                    if (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) != 0)
                    {
                        DR_SQ_LINE["DISCOUNT_ID"] = ""; //Done
                        DR_SQ_LINE["DISCOUNT_REASON"] = ""; //Done 
                    }
                    else
                    {
                        DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value; //Done
                        DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value; //Done 
                    }

                    DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR_SQ_LINE["GROSS"]) > 0 || Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) > 0 ? Convert.ToDecimal(Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]))) * 100 : 0;
                    DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_LINE["TAXES_RATE"]) > 0 ? (Convert.ToDecimal(DR_LINE["TAXES_RATE"]) * 100) : 0;
                    _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                }
                foreach (DataRow HEADER in Root.Tables[0].Rows)
                {
                    DataTable LineDatatable1 = Root.Tables[1].Select("DELETED=0 AND ORDERS_ID =" + HEADER["ORDER_ID"]).CopyToDataTable();
                    DataTable LineDatatable = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID=" + HEADER["ORDER_ID"]).CopyToDataTable();

                    DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    DR_SQ_HEADER["CHECK_ID"] = HEADER["ORDER_ID"]; //DONE
                    DR_SQ_HEADER["CHECK_NO"] = HEADER["SALE_NUMBER"];//DONE
                    DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["CREATED_AT"]);
                    DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["UPDATED_AT"]);
                    DR_SQ_HEADER["COVERS"] = 0;
                    DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = (object)DBNull.Value;
                    DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = (object)DBNull.Value;
                    DR_SQ_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                    DR_SQ_HEADER["NET"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("NET")).Sum(), 5);
                    DR_SQ_HEADER["TAX"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("TAX")).Sum(), 5);
                    DR_SQ_HEADER["GROSS"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("GROSS")).Sum(), 5);
                    DR_SQ_HEADER["DISCOUNT"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("DISCOUNT")).Sum(), 5);
                    DR_SQ_HEADER["COMP"] = 0;
                    DR_SQ_HEADER["VOID"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("VOID")).Sum(), 0);
                    DR_SQ_HEADER["TIPS"] = HEADER["TIPS"]; //DONE                     
                    DR_SQ_HEADER["SERVICE_CHARGE"] = Math.Round(LineDatatable1.AsEnumerable().Select(row => row.Field<decimal>("PRICE_VARIATION") > 1 ? row.Field<decimal>("UNIT_PRICE") * (row.Field<decimal>("PRICE_VARIATION") - 1) * row.Field<decimal>("QUANTITY") : 0).Sum(), 5);
                    DR_SQ_HEADER["DONATION"] = 0;
                    DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                    DR_SQ_HEADER["IS_TRAINING"] = false;
                    DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_SQ_HEADER["STAFF_ID"] = HEADER["STAFF_MEMBER_ID"]; //done
                    DR_SQ_HEADER["STAFF_NAME"] = (object)DBNull.Value;
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                }
                foreach (DataRow DR in Root.Tables[2].Rows)
                {
                    DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                    DR_PAYMENT["CHECK_ID"] = DR["ORDERS_ID"];
                    DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_ID"] == (object)DBNull.Value ? (object)DBNull.Value : DR["PAYMENT_ID"];
                    DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["METHOD_NAME"] == (object)DBNull.Value ? (object)DBNull.Value : DR["METHOD_NAME"];
                    DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["METHOD_NAME"] == (object)DBNull.Value ? (object)DBNull.Value : DR["METHOD_NAME"];

                    decimal TOTAL_MONEY = DR["AMOUNT"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["AMOUNT"]);
                    decimal TIP_MONEY = DR["TIP"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["TIP"]);

                    DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = (TOTAL_MONEY + TIP_MONEY) > 0 ? (TOTAL_MONEY + TIP_MONEY) : 0;
                    DR_PAYMENT["TIPS"] = DR["TIP"] == (object)DBNull.Value ? 0 : Convert.ToDecimal(DR["TIP"]);
                    _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                }
                foreach (DataRow DR in _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows)
                {
                    DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                    DR_DISCOUNT["CHECK_ID"] = DR["CHECK_ID"];

                    if (Convert.ToDecimal(DR["DISCOUNT"]) != 0)
                    {
                        DR_DISCOUNT["DISCOUNT_ID"] = "";
                        DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = "";
                        DR_DISCOUNT["DISCOUNT_AMOUNT"] = DR["DISCOUNT"];
                        DR_DISCOUNT["STAFF_ID"] = DR["STAFF_ID"];
                        DR_DISCOUNT["STAFF_NAME"] = (object)DBNull.Value;
                        _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                    }
                }
                return 1;
            }
            catch (Exception ex)
            {
                throw;
            }

        }


    }
}
