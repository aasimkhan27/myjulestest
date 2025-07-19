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

namespace EPOS_Integration.VitaMojo
{
    class EPOS_SALES_VITAMOJO<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_VitamojoData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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

                LogExceptions.LogError("Transform_VitamojoData - VITAMOJO - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_VitamojoData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
            return _ICashUp.CashupModelObj;
        }
        DataTable FillHeader(DataSet VM_Dataset, Cashup _ICashUp)
        {
            try
            {
                if (VM_Dataset.Tables[0].Select("PAYMENT_STATUS = 'success' or PAYMENT_STATUS='partial-refund' or PAYMENT_STATUS='refund'").Count() > 0)
                {
                    foreach (DataRow HEADER in VM_Dataset.Tables[0].Select("PAYMENT_STATUS = 'success' or PAYMENT_STATUS='partial-refund'  or PAYMENT_STATUS='refund'").CopyToDataTable().Rows)
                    {
                        FillLines(VM_Dataset, Convert.ToString(HEADER["HEADER_UUID"]), _ICashUp, 0);
                        DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();

                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = HEADER["HEADER_UUID"];
                        DR_SQ_HEADER["CHECK_NO"] = HEADER["ORDER_NUMBER"];
                        var list = VM_Dataset.Tables[1].AsEnumerable().Where(p => p.Field<string>("HEADER_UUID") == HEADER["HEADER_UUID"].ToString()).ToList();
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(list.Select(p => p.Field<DateTime>("CREATED_AT")).FirstOrDefault());
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(list.Select(p => p.Field<DateTime>("CONFIRMED_AT")).FirstOrDefault());
                        DR_SQ_HEADER["COVERS"] = HEADER["COUNT"];

                        string COMMA_SEPARATED_STRING = string.Empty;
                        List<string> UNIQUES = null;
                        if (VM_Dataset.Tables[1].Select("HEADER_UUID='" + HEADER["HEADER_UUID"] + "'").Count() > 0)
                        {
                            foreach (DataRow dr in VM_Dataset.Tables[1].Select("HEADER_UUID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Rows)
                            {
                                COMMA_SEPARATED_STRING += dr["CATEGORY"] + ",";
                            }
                        }
                        if (COMMA_SEPARATED_STRING.Length > 0)
                        {
                            UNIQUES = COMMA_SEPARATED_STRING.Remove(COMMA_SEPARATED_STRING.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                        }
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["ORDER_TYPE"];// UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["ORDER_TYPE"]; // UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;
                        DR_SQ_HEADER["SERVE_MODE"] = Convert.ToBoolean(HEADER["TAKEAWAY"]) == false && Convert.ToBoolean(HEADER["IS_DELIVERY"]) == false ? "Eat In" : (Convert.ToBoolean(HEADER["TAKEAWAY"]) == true ? "Take Away" : "Delivery");
                        DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                        DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                        DR_SQ_HEADER["GROSS"] = SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0;
                        DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                        DR_SQ_HEADER["COMP"] = 0;
                        DR_SQ_HEADER["VOID"] = SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["HEADER_UUID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;
                        DR_SQ_HEADER["TIPS"] = 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = 0;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = HEADER["CURRENCY"];
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = HEADER["USER_IN_STORE_NAME"];
                        DR_SQ_HEADER["STAFF_NAME"] = HEADER["USER_IN_STORE_NAME"];
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);


                        FillPayments(VM_Dataset, Convert.ToString(HEADER["HEADER_UUID"]), _ICashUp);
                        FillDiscounts(VM_Dataset, Convert.ToString(HEADER["HEADER_UUID"]), _ICashUp);
                    }
                }
                
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(DataSet VM_Dataset, string Header_Id, Cashup _ICashUp,int status)//0- for success and partial refund. 1 for cancelled
        {
            try
            {
                if (VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["ORDER_TYPE"].ToString() : (object)DBNull.Value;
                        DR_SQ_LINE["REVENUE_CENTER"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["ORDER_TYPE"].ToString() : (object)DBNull.Value;
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["CATEGORY"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["ITEM_UUID"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["ITEM_NAME"];
                        DR_SQ_LINE["QUANITY"] = DR_LINE["MENU_ITEMS_SOLD"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["NET_SALES"]) ;
                        DR_SQ_LINE["TAX"] =DR_LINE["VAT"] ;
                        DR_SQ_LINE["GROSS"] =  DR_LINE["ITEM_TOTAL_AMOUNT"];
                        DR_SQ_LINE["DISCOUNT"] = DR_LINE["ITEM_DISCOUNT"] ;
                        DR_SQ_LINE["COMP"] = 0;
                        var VOID = (from VMH in VM_Dataset.Tables[0].AsEnumerable().Where(p=>p.Field<string>("PAYMENT_STATUS")== "cancelled") join
                                    VML in VM_Dataset.Tables[1].AsEnumerable().Where(p => p.Field<string>("HEADER_UUID") == Header_Id) on 
                                    VMH.Field<string>("HEADER_UUID") equals VML.Field<string>("HEADER_UUID")
                                    select new { VML }
                                    ).ToList();


                        DR_SQ_LINE["VOID"] = VOID.Count() > 0 ? Convert.ToDecimal(VOID.Sum(p => p.VML.Field<decimal>("ITEM_REFUND")))*-1 : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = DR_LINE["CREATED_AT"];
                        DR_SQ_LINE["STAFF_ID"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? (VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["USER_IN_STORE_NAME"].ToString()==""? (object)DBNull.Value : VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["USER_IN_STORE_NAME"].ToString()) : (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_NAME"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? (VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["USER_IN_STORE_NAME"].ToString() == "" ? (object)DBNull.Value : VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["USER_IN_STORE_NAME"].ToString()) : (object)DBNull.Value;
                        DR_SQ_LINE["VOID_ID"] = Convert.ToDecimal(DR_SQ_LINE["VOID"]) != 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = Convert.ToDecimal(DR_SQ_LINE["VOID"]) != 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"])!=0? Convert.ToString(DR_LINE["PROMOTION_NAME"]) : (object)DBNull.Value ;
                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE["ITEM_DISCOUNT"]) != 0  ? Convert.ToString(DR_LINE["PROMOTION_NAME"]) : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR_LINE["ITEM_DISCOUNT"]) == 0 ? 0 : (Convert.ToDecimal(DR_LINE["ITEM_DISCOUNT"]) / ((Convert.ToDecimal(DR_LINE["ITEM_DISCOUNT"]) + Convert.ToDecimal(DR_LINE["ITEM_TOTAL_AMOUNT"])))) * 100;
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_LINE["VAT_RATE"]);  //Convert.ToDecimal(DR_LINE["VAT"]) == 0 || Convert.ToDecimal(DR_LINE["NET_SALES"]) == 0 ? 0 : (Convert.ToDecimal(DR_LINE["VAT"]) / Convert.ToDecimal(DR_LINE["NET_SALES"])) * 100;
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
        DataTable FillPayments(DataSet VM_Dataset, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        //decimal TOTAL_AMOUNT_WITH_TIPS = Convert.ToDecimal(Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=0").CopyToDataTable().Compute("SUM(PAYAMT)", string.Empty)) + Convert.ToDecimal(Root.Tables[2].Select("CHECKID=" + Header_Id + " and PROMOYN=0").CopyToDataTable().Compute("SUM(TIPAMT)", string.Empty));
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["PAYMENT_MODE"].ToString() : (object)DBNull.Value;
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["PAYMENT_MODE"].ToString() : (object)DBNull.Value;
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0 ? VM_Dataset.Tables[0].Select("HEADER_UUID='" + Header_Id + "'").CopyToDataTable().Rows[0]["PAYMENT_MODE"].ToString() : (object)DBNull.Value;
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["ITEM_TOTAL_AMOUNT"]);
                        DR_PAYMENT["TIPS"] = 0;
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
        DataTable FillDiscounts(DataSet VM_Dataset, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").Count() > 0)
                        {
                            var list = VM_Dataset.Tables[1].Select("HEADER_UUID='" + Header_Id + "'").ToList().GroupBy(p => p.Field<string>("HEADER_UUID")).Select(p => p.First()).ToList();
                            foreach (DataRow DR in list.CopyToDataTable().Rows)
                            {
                                decimal DISC = Convert.ToDecimal(VM_Dataset.Tables[1].Select("HEADER_UUID='" + Convert.ToString(DR["HEADER_UUID"])+"'").CopyToDataTable().Compute("SUM(ITEM_DISCOUNT)", string.Empty));

                                if (DISC != 0)
                                {
                                    DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                                    DR_DISCOUNT["CHECK_ID"] = Header_Id;
                                    DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["PROMOTION_NAME"]) == "" ? (object)DBNull.Value : DR["PROMOTION_NAME"];
                                    DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["PROMOTION_NAME"]) == "" ? (object)DBNull.Value : DR["PROMOTION_NAME"];
                                    DR_DISCOUNT["DISCOUNT_AMOUNT"] = DISC;
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
