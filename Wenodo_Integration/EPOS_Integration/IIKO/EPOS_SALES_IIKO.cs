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

namespace EPOS_Integration.IIKO
{
    class EPOS_SALES_IIKO<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_IikoData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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

                    if (_ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Select("PAYMENT_METHOD_DESC='(no payment)'").Count() > 0)
                    {
                        DataTable dt = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Select("PAYMENT_METHOD_DESC='(no payment)'").CopyToDataTable();

                        foreach (DataRow dr in dt.Rows)
                        {

                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.AsEnumerable().Where(r => r.Field<string>("CHECK_ID") == Convert.ToString(dr["CHECK_ID"])).ToList().ForEach(row => row.Delete());
                            _ICashUp.CashupModelObj.EPOS_SALES_HEADER.AcceptChanges();

                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.AsEnumerable().Where(r => r.Field<string>("CHECK_ID") == Convert.ToString(dr["CHECK_ID"])).ToList().ForEach(row => row.Delete());
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.AcceptChanges();

                            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.AsEnumerable().Where(r => r.Field<string>("CHECK_ID") == Convert.ToString(dr["CHECK_ID"])).ToList().ForEach(row => row.Delete());
                            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.AcceptChanges();

                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.AsEnumerable().Where(r => r.Field<string>("CHECK_ID") == Convert.ToString(dr["CHECK_ID"])).ToList().ForEach(row => row.Delete());
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.AcceptChanges();

                        }
                    }

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
                foreach (DataRow HEADER in SQ_Dataset.Tables[0].Rows)
                {
                    FillLines(SQ_Dataset, Convert.ToString(HEADER["UNIQ_ORDER_ID"]), _ICashUp);
                    if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").Count() > 0)
                    {
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = HEADER["UNIQ_ORDER_ID"];
                        DR_SQ_HEADER["CHECK_NO"] = HEADER["ORDER_NUM"];
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["CLOSE_TIME"]);
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSE_TIME"]);
                        DR_SQ_HEADER["COVERS"] = 0;
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = (object)DBNull.Value;
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = (object)DBNull.Value;
                        DR_SQ_HEADER["SERVE_MODE"] = Convert.ToString(HEADER["ORDER_TYPE"]).ToLower()== "Deliveroo.".ToLower() || Convert.ToString(HEADER["ORDER_TYPE"]).ToLower() == "Deliveroo".ToLower() 
                            ? "Delivery" : (Convert.ToString(HEADER["ORDER_TYPE"]).ToLower() == "Take out".ToLower()? "Take Away": "Eat In");
                        DR_SQ_HEADER["NET"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty);
                        DR_SQ_HEADER["TAX"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty);
                        DR_SQ_HEADER["GROSS"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty);
                        DR_SQ_HEADER["DISCOUNT"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty);
                        DR_SQ_HEADER["COMP"] = 0;
                        DR_SQ_HEADER["VOID"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + HEADER["UNIQ_ORDER_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty);
                        DR_SQ_HEADER["TIPS"] = 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = 0;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = Convert.ToString(HEADER["CASHIER"]);
                        DR_SQ_HEADER["STAFF_NAME"] = Convert.ToString(HEADER["CASHIER"]);
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                    }

                    FillPayments(SQ_Dataset,   Convert.ToString(HEADER["UNIQ_ORDER_ID"]), _ICashUp);
                    FillDiscounts(SQ_Dataset,   Convert.ToString(HEADER["UNIQ_ORDER_ID"]), _ICashUp);
                }

                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(DataSet Root,  string Header_Id, Cashup _ICashUp)
        {
            try
            {
                var line = (from L in Root.Tables[1].AsEnumerable().Where(p => p.Field<string>("UNIQ_ORDER_ID") == Header_Id)
                            join P in Root.Tables[2].AsEnumerable().Where(p => p.Field<string>("UNIQ_ORDER_ID") == Header_Id)
                            on L.Field<string>("UNIQ_ORDER_ID") equals P.Field<string>("UNIQ_ORDER_ID")
                            where Convert.ToString(P.Field<string>("PAYTYPES")) != "(no payment)"
                            select new { L }
                          ).ToList().Select(p => p.L);
                
                if (line.Count()>0)
                {
                    foreach (DataRow DR_LINE in line.CopyToDataTable().Rows)
                    {
                        decimal VAT_PER = 0;
                        if (Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "' and PAYTYPES<>'(no payment)'").Count() > 0)
                        {
                            if (Convert.ToDecimal(Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "' and PAYTYPES<>'(no payment)'").CopyToDataTable().Compute("SUM(VAT_SUM)", string.Empty)) == 0 
                                || Convert.ToDecimal(Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "' and PAYTYPES<>'(no payment)'").CopyToDataTable().Compute("SUM(DISH_DISCOUNT_SUM_INT)", string.Empty)) == 0)
                            {
                                VAT_PER = 0;
                            }
                            else
                            {
                                decimal VAT_SUM = Convert.ToDecimal(Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "' and PAYTYPES<>'(no payment)'").CopyToDataTable().Compute("SUM(VAT_SUM)", string.Empty));
                                decimal DISH_DISCOUNT_SUM_INT = Convert.ToDecimal(Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "' and PAYTYPES<>'(no payment)'").CopyToDataTable().Compute("SUM(DISH_DISCOUNT_SUM_INT)", string.Empty));
                                VAT_PER = (Convert.ToDecimal(VAT_SUM) / (Convert.ToDecimal(DISH_DISCOUNT_SUM_INT) - Convert.ToDecimal(VAT_SUM)));
                            }
                        }

                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["REVENUE_CENTER"] = (object)DBNull.Value;
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["DISH_GROUP"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["DISH_NAME"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["DISH_NAME"];
                        DR_SQ_LINE["QUANITY"] = DR_LINE["DISH_AMOUNT_INT"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["DISH_DISCOUNT_SUM_INT"]) / (1 + Convert.ToDecimal(VAT_PER));
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["DISH_DISCOUNT_SUM_INT"]) - Convert.ToDecimal(DR_LINE["DISH_DISCOUNT_SUM_INT"]) / (1 + Convert.ToDecimal(VAT_PER));
                        DR_SQ_LINE["GROSS"] = DR_LINE["DISH_DISCOUNT_SUM_INT"];
                        DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["DISCOUNT_SUM"]);
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = Convert.ToDecimal(DR_LINE["DISH_RETURN_SUM"]) > 0 ? Convert.ToDecimal(DR_LINE["DISH_RETURN_SUM"]) * -1 : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = Root.Tables[0].Select("UNIQ_ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"].ToString();
                        DR_SQ_LINE["STAFF_ID"] = Root.Tables[0].Select("UNIQ_ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CASHIER"].ToString();
                        DR_SQ_LINE["STAFF_NAME"] = Root.Tables[0].Select("UNIQ_ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CASHIER"].ToString();
                        DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE["DISCOUNT_SUM"]) > 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToString(DR_LINE["ORDER_DISCOUNT_TYPE"]) == null || Convert.ToString(DR_LINE["ORDER_DISCOUNT_TYPE"]) == "" ? "" : Convert.ToString(DR_LINE["ORDER_DISCOUNT_TYPE"]);
                        DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]))) * 100;
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_SQ_LINE["TAX"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["TAX"]) / Convert.ToDecimal(DR_SQ_LINE["NET"])) * 100;
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
        DataTable FillPayments(DataSet Root , string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYTYPES"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["PAYTYPES"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["PAYTYPES"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["DISH_DISCOUNT_SUM_INT"]);
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
        //DataTable FillDiscounts(DataSet Root , string Header_Id, Cashup _ICashUp)
        //{
        //    try
        //    {
        //        if (Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "'").Count() > 0)
        //        {
        //            foreach (DataRow DR in Root.Tables[2].Select("UNIQ_ORDER_ID='" + Header_Id + "'").CopyToDataTable().Rows)
        //            {
        //                if (Convert.ToDecimal(DR["DISCOUNT_SUM"]) != 0)
        //                {
        //                    DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
        //                    DR_DISCOUNT["CHECK_ID"] = Header_Id;
        //                    DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(Header_Id);
        //                    DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToDecimal(DR["DISCOUNT_SUM"]) > 0 ? "" : (object)DBNull.Value;
        //                    DR_DISCOUNT["DISCOUNT_AMOUNT"] = DR["DISCOUNT_SUM"];
        //                    DR_DISCOUNT["STAFF_ID"] = DR["CASHIER"];
        //                    DR_DISCOUNT["STAFF_NAME"] = DR["CASHIER"];
        //                    _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
        //                }
        //            }
        //        }
        //        return _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }

        //}
        DataTable FillDiscounts(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Header_Id + "'").Count() > 0)
                {
                    var dist = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID= '" + Header_Id + "'").ToList().GroupBy(x => x.Field<string>("CHECK_ID")).Select(x => x.First()).ToList();
                    foreach (DataRow DR in dist.CopyToDataTable().Rows)
                    {
                        decimal dis_Amount = Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty));
                        if (Convert.ToDecimal(dis_Amount) != 0)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = DR["DISCOUNT_ID"];
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["DISCOUNT_REASON"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = dis_Amount;//DR["DISCOUNT_SUM"];
                            DR_DISCOUNT["STAFF_ID"] = DR["STAFF_ID"];
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
