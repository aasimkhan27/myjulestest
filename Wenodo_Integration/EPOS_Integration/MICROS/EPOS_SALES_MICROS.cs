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

namespace EPOS_Integration.MICROS
{
    class EPOS_SALES_MICROS<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_Micros(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SQ_DATA = data as DataSet;
            try
            {
                if (SQ_DATA.Tables[0].Rows.Count > 0)
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(SQ_DATA as DataSet, _ICashUp, Integration_Dt);
                
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
                LogExceptions.LogError("Transform_EPOS_SALES_MICROS - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_EPOS_SALES_MICROS - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            LogExceptions.LogInfo("inside Transform_Micros function -FillHeader");
            try
            {
                int counter = 0;
                DateTime OPEN_BUSINESS_DATE = Convert.ToDateTime(Root.Tables[0].Rows[0]["OPEN_BUSINESS_DATE"]);
                string HEADER_ID = OPEN_BUSINESS_DATE.Day.ToString() + OPEN_BUSINESS_DATE.Month.ToString() + OPEN_BUSINESS_DATE.Year.ToString() + OPEN_BUSINESS_DATE.Hour.ToString() + OPEN_BUSINESS_DATE.Minute.ToString() + OPEN_BUSINESS_DATE.Second.ToString() + OPEN_BUSINESS_DATE.Millisecond.ToString();
                string[] _strREVENUE_CENTER_ARR = Integration_Dt.Rows[0]["URL_PARAMETERS"].ToString().Split(',');
                //var _distinctRevenueCenterList = Root.Tables[0].AsEnumerable().Select(p => new { REVENUE_CENTER_NAME = p.Field<string>("REVENUE_CENTER_NAME") }).Distinct();               
                foreach (var REVENUE_CENTER_NAME in _strREVENUE_CENTER_ARR)
                {
                    FillLines(Root, Convert.ToDecimal(HEADER_ID + counter), REVENUE_CENTER_NAME, _ICashUp, counter);
                    if (_ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Count > 0)
                    {
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                        DR_SQ_HEADER["CHECK_ID"] = HEADER_ID + counter;
                        DR_SQ_HEADER["CHECK_NO"] = HEADER_ID + counter;
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToDateTime(Root.Tables[0].AsEnumerable().ToList().OrderBy(p => p.Field<DateTime>("OPENED")).FirstOrDefault()["OPENED"]);
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToDateTime(Root.Tables[0].AsEnumerable().ToList().OrderBy(p => p.Field<DateTime>("CLOSED")).LastOrDefault()["CLOSED"]);
                        DR_SQ_HEADER["COVERS"] = Root.Tables[0].Compute("SUM(NO_GUESTS_SUM)", string.Empty);
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = REVENUE_CENTER_NAME;
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = REVENUE_CENTER_NAME;
                        DR_SQ_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                        DR_SQ_HEADER["NET"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").Count() > 0 ? _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty) : 0;
                        DR_SQ_HEADER["TAX"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").Count() > 0 ? _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty) : 0;
                        DR_SQ_HEADER["GROSS"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").Count() > 0 ? _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty) : 0;
                        DR_SQ_HEADER["DISCOUNT"] = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").Count() > 0 ?
                            (Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) > 0 ?
                            Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) :
                            Convert.ToDecimal(_ICashUp.CashupModelObj.EPOS_SALES_LINES.Select("REVENUE_CENTER='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) * -1
                            )
                            : 0;
                        DR_SQ_HEADER["COMP"] = 0;
                        DR_SQ_HEADER["VOID"] = 0;// counter == 0 ? (Root.Tables[0].Rows.Count > 0 ? Root.Tables[0].Compute("SUM(VOID_TOTAL_SUM)", string.Empty) : 0) : 0;
                        DR_SQ_HEADER["TIPS"] = counter == 0 ? (Root.Tables[0].Rows.Count > 0 ? Root.Tables[0].Compute("SUM(TIP_TOTAL_SUM)", string.Empty) : 0) : 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = 0;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_HEADER["STAFF_NAME"] = (object)DBNull.Value;
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);

                        FillPayments(Root, Convert.ToDecimal(HEADER_ID + counter), REVENUE_CENTER_NAME, _ICashUp, counter);
                        FillDiscounts(Root, Convert.ToDecimal(HEADER_ID + counter), REVENUE_CENTER_NAME, _ICashUp, counter);
                    }
                    counter += 1;
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        DataTable FillLines(DataSet Root, decimal HDR_ID, string REVENUE_CENTER_NAME, Cashup _ICashUp, int counter)
        {
            try
            {

                if (Root.Tables[1].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = HDR_ID;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE["REVENUE_CENTER_NAME"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE["REVENUE_CENTER_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["MAJOR_GROUP_NAME"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["MENU_ITEM_NAME"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["MENU_ITEM_NUMBER"];
                        DR_SQ_LINE["QUANITY"] = DR_LINE["SALES_COUNT_SUM"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["SALES_NET_VAT_AFTER_DISC_SUM"]);
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["VAT_TOTAL_SUM"]);
                        DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_LINE["GROSS_SALES_AFTER_DISC_SUM"]);
                        DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE["DISCOUNT_TOTAL_SUM"]) > 0 ? Convert.ToDecimal(DR_LINE["DISCOUNT_TOTAL_SUM"]) : Convert.ToDecimal(DR_LINE["DISCOUNT_TOTAL_SUM"]) * -1;
                        DR_SQ_LINE["COMP"] = 0;
                        DR_SQ_LINE["VOID"] = 0;// counter == 0 ? Root.Tables[0].Compute("SUM(VOID_TOTAL_SUM)", string.Empty) : 0;
                        DR_SQ_LINE["TIME_OF_SALE"] = Convert.ToDateTime(Root.Tables[0].AsEnumerable().ToList().OrderBy(p => p.Field<DateTime>("CLOSED")).LastOrDefault()["CLOSED"]);
                        DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                        DR_SQ_LINE["VOID_ID"] = 0;// counter == 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value; //counter == 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE["DISCOUNT_TOTAL_SUM"]) != 0 ? "" : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE["DISCOUNT_TOTAL_SUM"]) != 0 ? "" : (object)DBNull.Value;

                        decimal Discount = Convert.ToDecimal(DR_SQ_LINE["GROSS"]) > 0 ? Convert.ToDecimal(DR_SQ_LINE["GROSS"]) : Convert.ToDecimal(DR_SQ_LINE["GROSS"]) * -1;
                        DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) == 0 ? 0 : (
                            (
                              Convert.ToDecimal(DR_SQ_LINE["GROSS"]) == 0 ? 100 : (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Discount) == 0 ? 0 : (Discount / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Discount)) * 100)
                            );
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_SQ_LINE["TAX"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["TAX"]) / Convert.ToDecimal(DR_SQ_LINE["NET"])) * 100;
                        _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        counter += 1;
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillPayments(DataSet Root, decimal HDR_ID, string REVENUE_CENTER_NAME, Cashup _ICashUp, int counter)
        {
            try
            {
                if (Root.Tables[5].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[5].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = HDR_ID;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["TENDER_NUMBER"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["TENDER_NAME"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["TENDER_NAME"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["TENDER_TOTAL_SUM"]);
                        DR_PAYMENT["TIPS"] = counter == 0 ? Root.Tables[0].Compute("SUM(TIP_TOTAL_SUM)", string.Empty) : 0;
                        _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                        counter += 1;
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillDiscounts(DataSet Root, decimal HDR_ID, string REVENUE_CENTER_NAME, Cashup _ICashUp, int counter)
        {
            try
            {
                if (Root.Tables[2].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[2].Select("REVENUE_CENTER_NAME='" + REVENUE_CENTER_NAME + "'").CopyToDataTable().Rows)
                    {
                        if (Convert.ToDecimal(DR["DISCOUNT_TOTAL_SUM"]) != 0)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = HDR_ID;
                            DR_DISCOUNT["DISCOUNT_ID"] = DR["DISCOUNT_NAME"];
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DR["DISCOUNT_NAME"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(DR["DISCOUNT_TOTAL_SUM"]) > 0 ? Convert.ToDecimal(DR["DISCOUNT_TOTAL_SUM"]) : Convert.ToDecimal(DR["DISCOUNT_TOTAL_SUM"]) * -1;
                            DR_DISCOUNT["STAFF_ID"] = (object)DBNull.Value;
                            DR_DISCOUNT["STAFF_NAME"] = (object)DBNull.Value;
                            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
                            counter += 1;
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
