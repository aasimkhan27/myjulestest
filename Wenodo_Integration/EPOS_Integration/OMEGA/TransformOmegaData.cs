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

namespace EPOS_Integration.OMEGA
{
    public class TransformOmegaData<T>
    {
        public CashupModel CashupModelObj { get; set; }
        decimal SUM_OF_TAX = 0;
        public CashupModel Transform_OmegaData(T data, decimal Integration_System_ID, Cashup _ICashUp,DataTable Integration_Dt)
        {
            ///tranformation from epos to wenodo
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
             try
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(data as Root_Omega, _ICashUp);                
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_OmegaData - OMEGA - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_OmegaData - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;
        }
        DataTable FillHeader(Root_Omega root_Omega, Cashup _ICashUp)
        {
            try
            {
                foreach (var OMEGA_HEADER in root_Omega.data.headers)
                {

                    FillLines(root_Omega, OMEGA_HEADER.HEADER_ID, _ICashUp);

                    double DETAIL_TOTAL_NET_AMOUNT_WITHOUTTAX = Convert.ToDouble(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX));
                    var INNER_JOIN_DATA = from header in root_Omega.data.headers
                                          join detail in root_Omega.data.details on header.HEADER_ID equals detail.HEADER_ID
                                          where detail.HEADER_ID == OMEGA_HEADER.HEADER_ID && header.INVOICE_AMOUNT_WITHOUTTAX != 0 && (((header.INVOICE_AMOUNT_WITHOUTTAX + header.INVOICE_SUM_TAXES) - header.INVOICE_AMOUNT) * Convert.ToDecimal(1.0) / header.INVOICE_AMOUNT_WITHOUTTAX) != 0
                                          select new
                                          {
                                              OMG_HEADER_ID = OMEGA_HEADER.HEADER_ID,
                                              DIS_PER = (header.INVOICE_AMOUNT_WITHOUTTAX + header.INVOICE_SUM_TAXES - header.INVOICE_AMOUNT) * Convert.ToDecimal(1.0) / Convert.ToDecimal(DETAIL_TOTAL_NET_AMOUNT_WITHOUTTAX)
                                          };
                    var GROUP = from groupData in INNER_JOIN_DATA group groupData by new { OMG_HEADER_ID = groupData.OMG_HEADER_ID, DIS_PER = groupData.DIS_PER } into grp select grp;
                    //----------//
                    decimal TOTAL_UNITS = Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.QUANTITY));
                    decimal TEMP_DIS_PER = GROUP.FirstOrDefault() == null ? 0 : Convert.ToDecimal(GROUP.FirstOrDefault().ToList()[0].DIS_PER);
                    decimal NET_TOTAL = Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX)) -
                                        (Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX)) * TEMP_DIS_PER);
                    decimal TOTAL_DISC_CPN = Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX)) * TEMP_DIS_PER;
                   
                    decimal TEMP_INVOICE_AMOUNT = Convert.ToDecimal(root_Omega.data.headers.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.INVOICE_AMOUNT));
                    decimal TOTAL_GROSS = TEMP_INVOICE_AMOUNT == 0 ? 0 : NET_TOTAL + (NET_TOTAL * Convert.ToDecimal(0.01) * Convert.ToDecimal(
                                            Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAX1RATEPERCENTAGE)) +
                                            Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAX2RATEPERCENTAGE)) +
                                            Convert.ToDecimal(root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAX3RATEPERCENTAGE))));

                    DataRow DR_OMEGA_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    DR_OMEGA_HEADER["CHECK_ID"] = OMEGA_HEADER.HEADER_ID;
                    DR_OMEGA_HEADER["CHECK_NO"] = OMEGA_HEADER.HEADER_ID;
                    DR_OMEGA_HEADER["OPEN_TIME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).OrderBy(p => p.TIMEOFSALE).ToList().FirstOrDefault().TIMEOFSALE;
                    DR_OMEGA_HEADER["CLOSE_TIME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).OrderBy(p => p.TIMEOFSALE).ToList().LastOrDefault().TIMEOFSALE;
                    DR_OMEGA_HEADER["COVERS"] = root_Omega.data.headers.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { CUSTOMERS_NUMBER = p.CUSTOMERS_NUMBER }).ToList()[0].CUSTOMERS_NUMBER.Equals(null) ? (object)DBNull.Value : root_Omega.data.headers.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { CUSTOMERS_NUMBER = p.CUSTOMERS_NUMBER }).ToList()[0].CUSTOMERS_NUMBER;
                    DR_OMEGA_HEADER["REVENUE_CENTRE_CODE"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTERID = p.REVENUECENTERID }).ToList()[0].REVENUECENTERID.Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTERID = p.REVENUECENTERID }).ToList()[0].REVENUECENTERID;
                    DR_OMEGA_HEADER["REVENUE_CENTRE_DESC"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTER = p.REVENUECENTER }).ToList()[0].REVENUECENTER == null ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTER = p.REVENUECENTER }).ToList()[0].REVENUECENTER;
                    DR_OMEGA_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                    DR_OMEGA_HEADER["NET"] = NET_TOTAL;// root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX).Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX);
                    DR_OMEGA_HEADER["TAX"] = SUM_OF_TAX;// HEADER_TAX;//root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAXAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAXAMOUNT);
                    DR_OMEGA_HEADER["GROSS"] = NET_TOTAL+ SUM_OF_TAX; //root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.NETAMOUNTWITHTAX).Equals(null) ? (object)DBNull.Value : root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.NETAMOUNTWITHTAX);
                    DR_OMEGA_HEADER["DISCOUNT"] = TOTAL_DISC_CPN;//root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT);
                    DR_OMEGA_HEADER["COMP"] = 0;// TOTAL_DISC_CPN;// root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT);
                    DR_OMEGA_HEADER["VOID"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID && p.VOIDID != null).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX).Equals(null) ? 0 : (root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID && p.VOIDID != null).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX))*-1;
                    DR_OMEGA_HEADER["TIPS"] = root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TIP).Equals(null) ? (object)DBNull.Value : root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TIP);
                    DR_OMEGA_HEADER["SERVICE_CHARGE"] = 0;
                    DR_OMEGA_HEADER["DONATION"] = 0;
                    DR_OMEGA_HEADER["CURRENCY"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { CURRENCY = p.CURRENCY }).ToList()[0].CURRENCY;
                    DR_OMEGA_HEADER["IS_TRAINING"] = false;
                    DR_OMEGA_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_OMEGA_HEADER["STAFF_ID"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFID = p.STAFFID }).ToList()[0].STAFFID.Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFID = p.STAFFID }).ToList()[0].STAFFID;
                    DR_OMEGA_HEADER["STAFF_NAME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFNAME = p.STAFFNAME }).ToList()[0].STAFFNAME == null ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFNAME = p.STAFFNAME }).ToList()[0].STAFFNAME;
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_OMEGA_HEADER);
                    SUM_OF_TAX = 0;

                    FillPayments(root_Omega, OMEGA_HEADER.HEADER_ID, _ICashUp);

                    FillDiscounts(root_Omega, OMEGA_HEADER.HEADER_ID, _ICashUp);
                   

                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        DataTable FillLines(Root_Omega root_Omega, int Omega_Header_Id, Cashup _ICashUp)
        {
            try
            {
                //this function is inner query to calculate discount percentage 
                double DETAIL_TOTAL_NET_AMOUNT_WITHOUTTAX = Convert.ToDouble(root_Omega.data.details.Where(p => p.HEADER_ID == Omega_Header_Id).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX));
                var INNER_JOIN_DATA = from header in root_Omega.data.headers
                                      join detail in root_Omega.data.details on header.HEADER_ID equals detail.HEADER_ID
                                      where detail.HEADER_ID == Omega_Header_Id && header.INVOICE_AMOUNT_WITHOUTTAX != 0 && (((header.INVOICE_AMOUNT_WITHOUTTAX + header.INVOICE_SUM_TAXES) - header.INVOICE_AMOUNT) * Convert.ToDecimal(1.0) / header.INVOICE_AMOUNT_WITHOUTTAX) != 0
                                      select new
                                      {
                                          OMG_HEADER_ID = Omega_Header_Id,
                                          DIS_PER = (header.INVOICE_AMOUNT_WITHOUTTAX + header.INVOICE_SUM_TAXES - header.INVOICE_AMOUNT) * Convert.ToDecimal(1.0) / Convert.ToDecimal(DETAIL_TOTAL_NET_AMOUNT_WITHOUTTAX)
                                      };
                var GROUP = from groupData in INNER_JOIN_DATA group groupData by new { OMG_HEADER_ID = groupData.OMG_HEADER_ID, DIS_PER = groupData.DIS_PER } into grp select grp;
                decimal TEMP_DIS_PER = GROUP.FirstOrDefault() == null ? 0 : Convert.ToDecimal(GROUP.FirstOrDefault().ToList()[0].DIS_PER);
                //----------//

                foreach (var OMEGA_LINE in root_Omega.data.details.Where(p => p.HEADER_ID == Omega_Header_Id))
                {
                    decimal LINE_NET = OMEGA_LINE.TOTALNETAMOUNTWITHOUTTAX - (OMEGA_LINE.TOTALNETAMOUNTWITHOUTTAX * TEMP_DIS_PER);
                    decimal LINE_TAX = Convert.ToDecimal(root_Omega.data.headers.Where(p => p.HEADER_ID == Omega_Header_Id).Select(i => i.INVOICE_AMOUNT).FirstOrDefault()) == 0 ? 0 : LINE_NET * Convert.ToDecimal(0.01) * (OMEGA_LINE.TAX1RATEPERCENTAGE + OMEGA_LINE.TAX2RATEPERCENTAGE + OMEGA_LINE.TAX3RATEPERCENTAGE);
                    decimal LINE_DISCOUNT = OMEGA_LINE.TOTALNETAMOUNTWITHOUTTAX * TEMP_DIS_PER;
                    SUM_OF_TAX += LINE_TAX;


                    DataRow DR_OMEGA_DETAILS = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                    DR_OMEGA_DETAILS["CHECK_ID"] = Omega_Header_Id;
                    DR_OMEGA_DETAILS["REVENUE_CENTER_ID"] = OMEGA_LINE.REVENUECENTERID;
                    DR_OMEGA_DETAILS["REVENUE_CENTER"] = OMEGA_LINE.REVENUECENTER;
                    DR_OMEGA_DETAILS["ACCOUNT_GROUP_ID"] = OMEGA_LINE.ACCOUNTINGGROUP_ACCOUNTINGGROUPID;
                    DR_OMEGA_DETAILS["ACCOUNT_GROUP_CODE"] = OMEGA_LINE.ACCOUNTINGGROUP_CODE;
                    DR_OMEGA_DETAILS["ACCOUNT_GROUP_NAME"] = OMEGA_LINE.ACCOUNTINGGROUP_NAME;
                    DR_OMEGA_DETAILS["CATEGORY_ID"] = OMEGA_LINE.CATEGORIES_VALUE;
                    DR_OMEGA_DETAILS["CATEGORY_CODE"] = OMEGA_LINE.CATEGORIES_CATEGORY;
                    DR_OMEGA_DETAILS["CATEGORY_NAME"] = OMEGA_LINE.CATEGORIES_CATEGORY;
                    DR_OMEGA_DETAILS["PRODUCT_SKU"] = OMEGA_LINE.SKU;
                    DR_OMEGA_DETAILS["PRODUCT_NAME"] = OMEGA_LINE.NAME;
                    DR_OMEGA_DETAILS["QUANITY"] = OMEGA_LINE.QUANTITY;
                    DR_OMEGA_DETAILS["NET"] = LINE_NET;
                    DR_OMEGA_DETAILS["TAX"] = LINE_TAX;
                    DR_OMEGA_DETAILS["GROSS"] = LINE_NET + LINE_TAX;
                    DR_OMEGA_DETAILS["DISCOUNT"] = LINE_DISCOUNT;
                    DR_OMEGA_DETAILS["COMP"] = 0;// LINE_DISCOUNT;
                    DR_OMEGA_DETAILS["VOID"] = OMEGA_LINE.VOIDID == null ? 0 : (OMEGA_LINE.TOTALNETAMOUNTWITHOUTTAX)*-1;
                    DR_OMEGA_DETAILS["TIME_OF_SALE"] = OMEGA_LINE.TIMEOFSALE == null ? (object)DBNull.Value : OMEGA_LINE.TIMEOFSALE;
                    DR_OMEGA_DETAILS["STAFF_ID"] = OMEGA_LINE.STAFFID.Equals(null) ? (object)DBNull.Value : OMEGA_LINE.STAFFID;
                    DR_OMEGA_DETAILS["STAFF_NAME"] = OMEGA_LINE.STAFFNAME == null ? (object)DBNull.Value : OMEGA_LINE.STAFFNAME;
                    DR_OMEGA_DETAILS["VOID_ID"] = OMEGA_LINE.VOIDID == null ? (object)DBNull.Value : OMEGA_LINE.VOIDID;
                    DR_OMEGA_DETAILS["VOID_REASON"] = OMEGA_LINE.VOIDDESCRIPTION == null ? (object)DBNull.Value : OMEGA_LINE.VOIDDESCRIPTION;
                    DR_OMEGA_DETAILS["DISCOUNT_ID"] = string.Join(",", root_Omega.data.discounts.Where(p => p.HEADER_ID == Omega_Header_Id && (!p.ID.Equals(null) || !p.ID.Equals(""))).OrderBy(p => p.ID).Select(p => p.ID).Distinct());
                    DR_OMEGA_DETAILS["DISCOUNT_REASON"] = string.Join(",", root_Omega.data.discounts.Where(p => p.HEADER_ID == Omega_Header_Id).OrderBy(p => p.ID).Select(p => p.DISCOUNTDESCRIPTION).Distinct());
                    DR_OMEGA_DETAILS["DISCOUNT_RATE"] = TEMP_DIS_PER * 100;
                    DR_OMEGA_DETAILS["TAX_RATE"] = OMEGA_LINE.TAX1RATEPERCENTAGE + OMEGA_LINE.TAX2RATEPERCENTAGE + OMEGA_LINE.TAX3RATEPERCENTAGE;
                    _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_OMEGA_DETAILS);
                }

                return _ICashUp.CashupModelObj.EPOS_SALES_LINES;
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }
        DataTable FillPayments(Root_Omega root_Omega, int Omega_Header_Id, Cashup _ICashUp)
        {
            try
            {
                foreach (var OMEGA_PAYMENT in root_Omega.data.payments.Where(p => p.HEADER_ID == Omega_Header_Id))
                {
                    decimal TOTAL_AMOUNT_WITH_TIPS = Convert.ToDecimal(OMEGA_PAYMENT.NETAMOUNTWITHTAX) + Convert.ToDecimal(OMEGA_PAYMENT.TIP);

                    DataRow DR_OMEGA_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                    DR_OMEGA_PAYMENT["CHECK_ID"] = Omega_Header_Id;
                    DR_OMEGA_PAYMENT["PAYMENT_METHOD_ID"] = OMEGA_PAYMENT.PAYMENTMETHODID;
                    DR_OMEGA_PAYMENT["PAYMENT_METHOD_CODE"] = OMEGA_PAYMENT.CODE;
                    DR_OMEGA_PAYMENT["PAYMENT_METHOD_DESC"] = OMEGA_PAYMENT.DESCRIPTION;
                    DR_OMEGA_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = TOTAL_AMOUNT_WITH_TIPS;
                    DR_OMEGA_PAYMENT["TIPS"] = Convert.ToDecimal(OMEGA_PAYMENT.TIP);
                    _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_OMEGA_PAYMENT);
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS;
            }
            catch (Exception ex)
            {
                throw;
            }
            
        }
        DataTable FillDiscounts(Root_Omega root_Omega, int Omega_Header_Id, Cashup _ICashUp)
        {
            try
            {
                foreach (var OMEGA_DISCOUNT in root_Omega.data.discounts.Where(p => p.HEADER_ID == Omega_Header_Id))
                {
                    DataRow DR_OMEGA_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                    DR_OMEGA_DISCOUNT["CHECK_ID"] = Omega_Header_Id;
                    DR_OMEGA_DISCOUNT["DISCOUNT_ID"] = OMEGA_DISCOUNT.ID.Equals(null) ? (object)DBNull.Value: OMEGA_DISCOUNT.ID;
                    DR_OMEGA_DISCOUNT["DISCOUNT_DESCRIPTION"] = OMEGA_DISCOUNT.DISCOUNTDESCRIPTION==null? (object)DBNull.Value : OMEGA_DISCOUNT.DISCOUNTDESCRIPTION;
                    DR_OMEGA_DISCOUNT["DISCOUNT_AMOUNT"] = OMEGA_DISCOUNT.DISCOUNTAMOUNT.Equals(null)? (object)DBNull.Value : Convert.ToDecimal(OMEGA_DISCOUNT.DISCOUNTAMOUNT);
                    DR_OMEGA_DISCOUNT["STAFF_ID"] = OMEGA_DISCOUNT.STAFFID.Equals(null) ? (object)DBNull.Value : OMEGA_DISCOUNT.STAFFID;
                    DR_OMEGA_DISCOUNT["STAFF_NAME"] = OMEGA_DISCOUNT.STAFFNAME == null? (object)DBNull.Value : OMEGA_DISCOUNT.STAFFNAME;
                    _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_OMEGA_DISCOUNT);
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
        DataTable FillHeader_After_Line_Fill(Root_Omega root_Omega, int Omega_Header_Id,decimal HEADER_NET,decimal HEADER_TAX, decimal HEADER_DISCOUNT,decimal HEADER_GROSS)
        {
            foreach (var OMEGA_HEADER in root_Omega.data.headers.Where(p => p.HEADER_ID == Omega_Header_Id))
            {
                DataRow DR_OMEGA_HEADER = CashupModelObj.EPOS_SALES_HEADER.NewRow();
                DR_OMEGA_HEADER["CHECK_ID"] = OMEGA_HEADER.ID;
                DR_OMEGA_HEADER["CHECK_NO"] = OMEGA_HEADER.HEADER_ID;
                DR_OMEGA_HEADER["OPEN_TIME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).OrderBy(p => p.TIMEOFSALE).ToList().FirstOrDefault().TIMEOFSALE;
                DR_OMEGA_HEADER["CLOSE_TIME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).OrderBy(p => p.TIMEOFSALE).ToList().LastOrDefault().TIMEOFSALE;
                DR_OMEGA_HEADER["COVERS"] = 0;
                DR_OMEGA_HEADER["REVENUE_CENTRE_CODE"] = OMEGA_HEADER.REVENUECENTERID;// root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTERID = p.REVENUECENTERID }).ToList()[0].REVENUECENTERID.Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTERID = p.REVENUECENTERID }).ToList()[0].REVENUECENTERID;
                DR_OMEGA_HEADER["REVENUE_CENTRE_DESC"] = OMEGA_HEADER.REVENUECENTER;//root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTER = p.REVENUECENTER }).ToList()[0].REVENUECENTER == null ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { REVENUECENTER = p.REVENUECENTER }).ToList()[0].REVENUECENTER;
                DR_OMEGA_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                DR_OMEGA_HEADER["NET"] = HEADER_NET;// root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX).Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX);
                DR_OMEGA_HEADER["TAX"] = HEADER_TAX;// HEADER_TAX;//root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAXAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TAXAMOUNT);
                DR_OMEGA_HEADER["GROSS"] = HEADER_GROSS; //root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.NETAMOUNTWITHTAX).Equals(null) ? (object)DBNull.Value : root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.NETAMOUNTWITHTAX);
                DR_OMEGA_HEADER["DISCOUNT"] = HEADER_DISCOUNT;//root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT);
                DR_OMEGA_HEADER["COMP"] = 0;// root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT).Equals(null) ? (object)DBNull.Value : root_Omega.data.discounts.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.DISCOUNTAMOUNT);
                DR_OMEGA_HEADER["VOID"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID && p.VOIDID != null).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX) > 0 ? root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TOTALNETAMOUNTWITHOUTTAX) * -1 : 0;
                DR_OMEGA_HEADER["TIPS"] = root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TIP);//.Equals(null) ? (object)DBNull.Value : root_Omega.data.payments.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Sum(p => p.TIP);
                DR_OMEGA_HEADER["SERVICE_CHARGE"] = 0;
                DR_OMEGA_HEADER["DONATION"] = 0;
                DR_OMEGA_HEADER["CURRENCY"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { CURRENCY = p.CURRENCY }).ToList()[0].CURRENCY;
                DR_OMEGA_HEADER["IS_TRAINING"] = false;
                DR_OMEGA_HEADER["INTEGRATION_SYSTEM_ID"] = CashupModelObj.INTEGRATION_SYSTEM_ID;
                DR_OMEGA_HEADER["STAFF_ID"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFID = p.STAFFID }).ToList()[0].STAFFID.Equals(null) ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFID = p.STAFFID }).ToList()[0].STAFFID;
                DR_OMEGA_HEADER["STAFF_NAME"] = root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFNAME = p.STAFFNAME }).ToList()[0].STAFFNAME == null ? (object)DBNull.Value : root_Omega.data.details.Where(p => p.HEADER_ID == OMEGA_HEADER.HEADER_ID).Select(p => new { STAFFNAME = p.STAFFNAME }).ToList()[0].STAFFNAME;
                CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_OMEGA_HEADER);
            }
            return CashupModelObj.EPOS_SALES_HEADER;
        }
    }
   
}
