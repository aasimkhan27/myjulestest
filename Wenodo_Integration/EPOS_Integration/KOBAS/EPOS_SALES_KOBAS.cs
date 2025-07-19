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
namespace EPOS_Integration.KOBAS
{
    public class EPOS_SALES_KOBAS
    {
        public CashupModel CashupModelObj { get; set; }
        public void TransformKobasData(DataSet data, decimal Integration_System_ID, ref Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Kobas_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            try
            {
                FillHeaderAndLines(data as DataSet, ref _ICashUp);
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Kobas_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_LOData - LO - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_LOData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                _ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
            }
        }
        public void ReturnPayment(DataRow DR, ref Cashup _ICashUp, string NAME, DataSet Root, decimal AMOUNT, decimal TIPS)
        {
            DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
            if (Convert.ToInt32(DR["ORDER_ID"]) == 0)
            {
                var OrderID = "";
                if (Root.Tables[0].Select("TAB_ID=" + Convert.ToInt32(DR["TAB_ID"])).Count() > 0)
                {
                    DataTable dt = Root.Tables[0].AsEnumerable().Where(x => x.Field<int>("TAB_ID") == Convert.ToInt32(DR["TAB_ID"])).CopyToDataTable();
                    foreach (DataRow Linedr in dt.Rows)
                    {
                        OrderID = Root.Tables[1].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Linedr["ORDER_ID"].ToString() && (x.Field<string>("SALE_ACTION").ToString() == "Sale" || x.Field<string>("SALE_ACTION").ToString() == "Refund" || x.Field<string>("SALE_ACTION").ToString() == "Void")).Select(z => z.Field<string>("ORDER_ID")).FirstOrDefault();
                        if (OrderID != null && OrderID != "")
                        {
                            break;
                        }
                    }
                    DR_PAYMENT["CHECK_ID"] = OrderID;//done
                    DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_ID"] == (object)DBNull.Value ? (object)DBNull.Value : DR["PAYMENT_ID"];
                    DR_PAYMENT["PAYMENT_METHOD_CODE"] = NAME;
                    DR_PAYMENT["PAYMENT_METHOD_DESC"] = NAME;
                }
            }
            else
            {
                DR_PAYMENT["CHECK_ID"] = DR["ORDER_ID"];
                DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_ID"] == (object)DBNull.Value ? (object)DBNull.Value : DR["PAYMENT_ID"];
                DR_PAYMENT["PAYMENT_METHOD_CODE"] = NAME;
                DR_PAYMENT["PAYMENT_METHOD_DESC"] = NAME;
            }
            DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = AMOUNT;
            DR_PAYMENT["TIPS"] = TIPS;
            DR_PAYMENT["SERVICE_CHARGE"] = DR["SERVICE_CHARGE"];
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
        }
        int FillHeaderAndLines(DataSet Root, ref Cashup _ICashUp)
        {
            try
            {
                foreach (DataRow DR in Root.Tables[5].Rows)
                {
                    int count = -1;
                    if (Convert.ToDecimal(DR["PAYMENT_CASH"]) != 0)
                    {
                        count++;
                        ReturnPayment(DR, ref _ICashUp, "Cash", Root, Convert.ToDecimal(DR["PAYMENT_CASH"]), count == 0 ? Convert.ToDecimal(DR["TIPS"]) : 0);
                    }
                    if (Convert.ToDecimal(DR["PAYMENT_CARD"]) != 0)
                    {
                        count++;
                        ReturnPayment(DR, ref _ICashUp, "Card", Root, Convert.ToDecimal(DR["PAYMENT_CARD"]), count == 0 ? Convert.ToDecimal(DR["TIPS"]) : 0);
                    }
                    if (Convert.ToDecimal(DR["PAYMENT_OTHER"]) != 0)
                    {
                        count++;
                        ReturnPayment(DR, ref _ICashUp, "Other", Root, Convert.ToDecimal(DR["PAYMENT_OTHER"]), count == 0 ? Convert.ToDecimal(DR["TIPS"]) : 0);
                    }
                    if (Convert.ToDecimal(DR["PAYMENT_CASH"]) == 0 && Convert.ToDecimal(DR["PAYMENT_CARD"]) == 0 && Convert.ToDecimal(DR["PAYMENT_OTHER"]) == 0)
                    {
                        count++;
                        ReturnPayment(DR, ref _ICashUp, "Other", Root, Convert.ToDecimal(DR["PAYMENT_OTHER"]), count == 0 ? Convert.ToDecimal(DR["TIPS"]) : 0);
                    }
                }

                foreach (DataRow DR_LINE in Root.Tables[1].Rows)
                {
                    
                    if (DR_LINE["SALE_ACTION"].ToString() == "Sale" || DR_LINE["SALE_ACTION"].ToString() == "Refund" || DR_LINE["SALE_ACTION"].ToString() == "Void")
                    {
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = DR_LINE["ORDER_ID"];//done
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Convert.ToString(DR_LINE["ORDER_ID"])).Select(z => z.Field<int>("VENUE_ID")).FirstOrDefault();//done
                        DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Convert.ToString(DR_LINE["ORDER_ID"])).Select(z => z.Field<string>("VENUE_NAME")).FirstOrDefault();//done

                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["LEAD_TYPE"]; //done
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["LEAD_TYPE"];//done
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["LEAD_TYPE"];//done

                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["CATEGORY"]; //done
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["CATEGORY"]; //done
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["CATEGORY"]; ////done

                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["PLU_ID"]; //done
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["PLU_NAME"]; //done

                        if (DR_LINE["SALE_ACTION"].ToString() == "Refund")
                        {
                            //if (DR_LINE["DISCOUNT_NAME"].ToString() != "N/A" && DR_LINE["DISCOUNT_NAME"].ToString() != "")
                            //{
                                
                            //    DR_SQ_LINE["QUANITY"] = -1; 
                            //    DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["ACTUAL_NET_SALE_PRICE"]) * -1; ;
                            //    DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["TAX"]) * -1;  
                            //    DR_SQ_LINE["GROSS"] = (Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"])) * -1;  
                            //    DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["DISCOUNT"]);
                            //    DR_SQ_LINE["COMP"] = 0; //
                            //    DR_SQ_LINE["VOID"] = 0; //
                            //}
                            //else
                            //{
                                DR_SQ_LINE["QUANITY"] = -1; //
                                DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["ACTUAL_NET_SALE_PRICE"]) < 0 ? DR_LINE["ACTUAL_NET_SALE_PRICE"] : Convert.ToDecimal(DR_LINE["ACTUAL_NET_SALE_PRICE"]) * -1; // done;
                                DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["TAX"]) < 0 ? DR_LINE["TAX"] : Convert.ToDecimal(DR_LINE["TAX"]) * -1; // done;
                                DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"]) < 0 ? Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"]) : (Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"])) * -1; // done;// DONE
                                DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["DISCOUNT"]) < 0 ? DR_LINE["DISCOUNT"] : Convert.ToDecimal(DR_LINE["DISCOUNT"]) * -1;// DONE
                                DR_SQ_LINE["COMP"] = 0; //
                                DR_SQ_LINE["VOID"] = 0; //
                           //}
                        }
                        if (DR_LINE["SALE_ACTION"].ToString() == "Sale")
                        {
                            DR_SQ_LINE["QUANITY"] = 1; //
                            DR_SQ_LINE["NET"] = DR_LINE["ACTUAL_NET_SALE_PRICE"]; // done;
                            DR_SQ_LINE["TAX"] = DR_LINE["TAX"]; // DONE;
                            DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"]) < 0 ? Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"]) : Convert.ToDecimal(DR_LINE["ACTUAL_GROSS_SALE_PRICE"]); // done;// DONE
                            DR_SQ_LINE["DISCOUNT"] = DR_LINE["DISCOUNT"];// DONE
                            DR_SQ_LINE["COMP"] = 0; //
                            DR_SQ_LINE["VOID"] = 0; //
                        }
                        if (DR_LINE["SALE_ACTION"].ToString() == "Void")
                        {
                            DR_SQ_LINE["QUANITY"] = -1; //
                            DR_SQ_LINE["NET"] = 0; // done;
                            DR_SQ_LINE["TAX"] = 0; // DONE;
                            DR_SQ_LINE["GROSS"] = 0;// DONE
                            DR_SQ_LINE["DISCOUNT"] = 0;// DONE
                            DR_SQ_LINE["COMP"] = 0; //
                            DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR_LINE["ACTUAL_NET_SALE_PRICE"]) < 0 ? DR_LINE["ACTUAL_NET_SALE_PRICE"] : Convert.ToDecimal(DR_LINE["ACTUAL_NET_SALE_PRICE"]) * -1; // done;
                        }

                        DR_SQ_LINE["TIME_OF_SALE"] = Root.Tables[0].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Convert.ToString(DR_LINE["ORDER_ID"])).Select(z => z.Field<DateTime>("ORDER_TIMESTAMP")).FirstOrDefault();//done
                        DR_SQ_LINE["STAFF_ID"] = Root.Tables[0].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Convert.ToString(DR_LINE["ORDER_ID"])).Select(z => z.Field<string>("STAFF_ID")).FirstOrDefault();//done
                        DR_SQ_LINE["STAFF_NAME"] = Root.Tables[0].AsEnumerable().Where(x => x.Field<string>("ORDER_ID") == Convert.ToString(DR_LINE["ORDER_ID"])).Select(z => z.Field<string>("STAFF_NAME")).FirstOrDefault();//done

                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value; //
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value; //

                        DR_SQ_LINE["DISCOUNT_ID"] = DR_LINE["DISCOUNT_NAME"].ToString() == "N/A" ? DBNull.Value : DR_LINE["DISCOUNT_ID"]; //DONE
                        DR_SQ_LINE["DISCOUNT_REASON"] = DR_LINE["DISCOUNT_NAME"].ToString() == "N/A" ? DBNull.Value : DR_LINE["DISCOUNT_NAME"]; // 
                                                                                                                                                //DISCOUNT hai 
                                                                                                                                                //  gross zero
                        if (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) == 0)
                        {
                            DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                        }
                        else
                        {
                            DR_SQ_LINE["DISCOUNT_RATE"] = (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) != 0 || Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) != 0)  && (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"])) !=0 ? Convert.ToDecimal(Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]))) * 100 : 0;
                        }

                        //if (Convert.ToDecimal(DR_SQ_LINE["TAX"]) == 0)
                        //{
                        //    DR_SQ_LINE["TAX_RATE"] = 0;
                        //}
                        //else
                        //{
                        //    DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_SQ_LINE["NET"]) != 0 || Convert.ToDecimal(DR_SQ_LINE["TAX"]) != 0 ? Convert.ToDecimal(Convert.ToDecimal(DR_SQ_LINE["TAX"]) / Convert.ToDecimal(DR_SQ_LINE["NET"])) * 100 : 0;
                        //}

                        if (DR_LINE["TAX_RATE"] == DBNull.Value)
                        {
                            DR_SQ_LINE["TAX_RATE"] = 0;
                        }
                        else
                        {
                            DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_LINE["TAX_RATE"]);//done
                        }

                        //DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_SQ_LINE["TAX_RATE"]);//done
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                    }
                }



                foreach (DataRow HEADER in Root.Tables[0].Rows)
                {
                    //DataTable LineDatatable1 = Root.Tables[1].Select("ORDER_ID =" + HEADER["ORDER_ID"]).CopyToDataTable();
                    int LinecountDatatable = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").Count();
                    if (LinecountDatatable > 0)
                    {


                        DataTable LineDatatable = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["ORDER_ID"] + "'").CopyToDataTable();
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = HEADER["ORDER_ID"]; //
                        DR_SQ_HEADER["CHECK_NO"] = HEADER["ORDER_ID"];//
                        DR_SQ_HEADER["OPEN_TIME"] = HEADER["ORDER_TIMESTAMP"];
                        DR_SQ_HEADER["CLOSE_TIME"] = HEADER["ORDER_TIMESTAMP"];
                        DR_SQ_HEADER["COVERS"] = 0;
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["VENUE_ID"];
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["VENUE_NAME"];
                        //Eat In
                        //Takeaway
                        //Delivery
                        if (HEADER["CONSUMPTION_MODE"].ToString() == "Delivery")
                        {
                            DR_SQ_HEADER["SERVE_MODE"] = "Delivery";
                        }
                        else if (HEADER["CONSUMPTION_MODE"].ToString() == "Takeaway")
                        {
                            DR_SQ_HEADER["SERVE_MODE"] = "Take Away";
                        }
                        else if (HEADER["CONSUMPTION_MODE"].ToString() == "Eat In")
                        {
                            DR_SQ_HEADER["SERVE_MODE"] = "Eat In";
                        }
                        else if (HEADER["CONSUMPTION_MODE"].ToString() == "Retail")
                        {
                            DR_SQ_HEADER["SERVE_MODE"] = "Retail";
                        }
                        else
                        {
                            DR_SQ_HEADER["SERVE_MODE"] = "Uncategorised";
                        }


                        DR_SQ_HEADER["NET"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("NET")).Sum(), 5);
                        DR_SQ_HEADER["TAX"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("TAX")).Sum(), 5);
                        DR_SQ_HEADER["GROSS"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("GROSS")).Sum(), 5);
                        DR_SQ_HEADER["DISCOUNT"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("DISCOUNT")).Sum(), 5);
                        DR_SQ_HEADER["COMP"] = 0;
                        DR_SQ_HEADER["VOID"] = Math.Round(LineDatatable.AsEnumerable().Select(row => row.Field<decimal>("VOID")).Sum(), 0);
                        DR_SQ_HEADER["TIPS"] = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.AsEnumerable().Where(x => x.Field<string>("CHECK_ID") == Convert.ToString(HEADER["ORDER_ID"])).Select(row => row.Field<decimal>("TIPS")).Sum();
                        DR_SQ_HEADER["SERVICE_CHARGE"] = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.AsEnumerable().Where(x => x.Field<string>("CHECK_ID") == Convert.ToString(HEADER["ORDER_ID"])).Select(row => row.Field<decimal>("SERVICE_CHARGE")).Sum();
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = HEADER["STAFF_ID"]; // //
                        DR_SQ_HEADER["STAFF_NAME"] = HEADER["STAFF_NAME"];
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                    }
                }
                foreach (DataRow DR in _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows)
                {
                    var HeaderNameList = _ICashUp.CashupModelObj.EPOS_SALES_LINES.AsEnumerable().Where(x => x.Field<string>("CHECK_ID") == Convert.ToString(DR["CHECK_ID"]))
                        .GroupBy(l => new { CHECK_ID = l.Field<string>("CHECK_ID"), DISCOUNT_REASON = l.Field<string>("DISCOUNT_REASON") }).ToList();

                    for (int i = 0; i < HeaderNameList.Count; i++)
                    {
                        if (HeaderNameList.Count > 0 && HeaderNameList[i].Key.DISCOUNT_REASON != null)
                        {
                            decimal AMT = _ICashUp.CashupModelObj.EPOS_SALES_LINES.AsEnumerable().Where(x => x.Field<string>("CHECK_ID") == HeaderNameList[i].Key.CHECK_ID && x.Field<string>("DISCOUNT_REASON") == HeaderNameList[i].Key.DISCOUNT_REASON).Select(x => x.Field<decimal>("DISCOUNT")).Sum();
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = DR["CHECK_ID"];
                            DR_DISCOUNT["DISCOUNT_ID"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.AsEnumerable().Where(x => x.Field<string>("CHECK_ID") == HeaderNameList[i].Key.CHECK_ID && x.Field<string>("DISCOUNT_REASON") == HeaderNameList[i].Key.DISCOUNT_REASON).Select(x => x.Field<string>("DISCOUNT_ID")).FirstOrDefault();
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = HeaderNameList[i].Key.DISCOUNT_REASON;//HeaderNameList.AsEnumerable().Select(x => x.Value).FirstOrDefault();
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = AMT;// HeaderNameList.AsEnumerable().Select(x => x.Key).Sum();
                            DR_DISCOUNT["STAFF_ID"] = DR["STAFF_ID"];
                            DR_DISCOUNT["STAFF_NAME"] = DR["STAFF_NAME"];
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                        }
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
