using App_Repository;
using EPOS_Integration.EPOS_SALES;
using System;
 
using System.Data;
using System.Linq;
 
using Utility;
using ViewModels;

namespace EPOS_Integration.LIGHTSPEED_LSERIES
{
    class EPOS_SALES_LIGHT_SPEED_L_SERIES<T>
    {
        public CashupModel CashupModelObj { get; set; }
        int[] PRICE_TYPE_ID = { 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77, 54, 52 };
        int[] PRICE_TYPE_ID_DISCOUNT_REASON_51_52 = { 51, 52 };
        int[] PRICE_TYPE_ID_DISCOUNT_REASON_53_54_55_56 = { 53, 54, 55, 56 };
        int[] PRICE_TYPE_ID_SC = { 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77 };
        public CashupModel Transform_Light_Speed_L_Series(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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
                LogExceptions.LogError("Transform_Light_Speed_L_Series - Light_Speed_L_Series - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_Light_Speed_L_Series - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                if (Root.Tables[0].Select("STATUS='PAID'").Count() > 0)
                {
                    foreach (DataRow HEADER in Root.Tables[0].Select("STATUS='PAID'").CopyToDataTable().Rows)
                    {
                        var SERVICE_CHARGE = (from LRF in Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("STATUS") == "PAID")
                                              join LIF in Root.Tables[1].AsEnumerable().Where(p => p.Field<Int32>("RECEIPT_FIELDS_ID") == Convert.ToInt32(HEADER["RECEIPT_FIELDS_ID"])) on
                                              LRF.Field<Int32>("RECEIPT_FIELDS_ID") equals LIF.Field<int>("RECEIPT_FIELDS_ID")
                                              where PRICE_TYPE_ID_SC.Contains(LIF.Field<Int32>("PRICE_TYPE_ID"))
                                              select LIF
                          ).ToList();
                        FillLines(Root, Convert.ToInt32(HEADER["RECEIPT_FIELDS_ID"]), _ICashUp, Integration_Dt);
                        DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                        DR_SQ_HEADER["CHECK_ID"] = HEADER["RECEIPT_FIELDS_ID"];
                        DR_SQ_HEADER["CHECK_NO"] = HEADER["SEQUENCE_NUMBER"];
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["CREATION_DATE"]) == "" ? (object)DBNull.Value : (DayLight_Saving(HEADER["CREATION_DATE"].ToString(), "GBR") == true ? Convert.ToDateTime(HEADER["CREATION_DATE"]).AddHours(1) : HEADER["CREATION_DATE"]);
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["MODIFICATION_DATE"]) == "" ? (object)DBNull.Value : (DayLight_Saving(HEADER["MODIFICATION_DATE"].ToString(), "GBR") == true ? Convert.ToDateTime(HEADER["MODIFICATION_DATE"]).AddHours(1) : HEADER["MODIFICATION_DATE"]);
                        DR_SQ_HEADER["COVERS"] = HEADER["NUMBER_OF_CUSTOMERS"];
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["TYPE"];
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["TYPE"];
                        DR_SQ_HEADER["SERVE_MODE"] = (object)DBNull.Value;
                        DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                        DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                        DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                        DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                        DR_SQ_HEADER["COMP"] = 0;
                        decimal VOID = SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + DR_SQ_HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;
                        DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                        DR_SQ_HEADER["TIPS"] = Root.Tables[2].Select("RECEIPT_FIELDS_ID=" + DR_SQ_HEADER["CHECK_ID"]).Count() > 0 ?
                            Convert.ToDecimal(Root.Tables[2].Select("RECEIPT_FIELDS_ID=" + DR_SQ_HEADER["CHECK_ID"]).CopyToDataTable().Compute("SUM(TIPS)", string.Empty)) : 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = SERVICE_CHARGE.Count > 0 ? SERVICE_CHARGE.Sum(p => p.Field<decimal>("TOTAL_PRICE")) : 0;
                        DR_SQ_HEADER["DONATION"] = 0;
                        DR_SQ_HEADER["CURRENCY"] = (object)DBNull.Value;
                        DR_SQ_HEADER["IS_TRAINING"] = false;
                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                        DR_SQ_HEADER["STAFF_ID"] = (object)DBNull.Value;
                        DR_SQ_HEADER["STAFF_NAME"] = (object)DBNull.Value;
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);
                        FillPayments(Root, Convert.ToInt32(HEADER["RECEIPT_FIELDS_ID"]), _ICashUp);
                        FillDiscounts(Root, Convert.ToInt32(HEADER["RECEIPT_FIELDS_ID"]), _ICashUp);
                    }
                }
                return _ICashUp.CashupModelObj.EPOS_SALES_HEADER;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        DataTable FillLines(DataSet Root, Int32 Header_Id, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                int[] PRICE_TYPE_ID = { 60, 61, 62, 63, 64, 65, 66, 67, 68, 70, 71, 72, 73, 74, 75, 76, 77 };
                var LS_LINE = (from LRF in Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("STATUS") == "PAID")
                               join LIF in Root.Tables[1].AsEnumerable().Where(p => p.Field<Int32>("RECEIPT_FIELDS_ID") == Header_Id) on
                               LRF.Field<Int32>("RECEIPT_FIELDS_ID") equals LIF.Field<Int32>("RECEIPT_FIELDS_ID")
                               where !PRICE_TYPE_ID.Contains(LIF.Field<Int32>("PRICE_TYPE_ID"))
                               select new { LIF, REV_TYPE = LRF.Field<string>("TYPE"), LRF }
                       ).ToList();
                if (LS_LINE.Count() > 0)
                {
                    foreach (var DR_LINE in LS_LINE)
                    {
                        var PRODUCT_MASTER = (from LIF in LS_LINE.AsEnumerable()
                                              join LPL in Root.Tables[4].AsEnumerable() on
                                              LIF.LIF.Field<Int32>("PROD_ID") equals LPL.Field<Int32>("PRODUCT_ID")
                                              where LPL.Field<Int32>("PRODUCT_ID") == DR_LINE.LIF.Field<Int32>("PROD_ID")
                                              select LPL).ToList();

                        var GROUP_MASTER = (from LGM in Root.Tables[5].AsEnumerable().Where(p => p.Field<Int32>("TYPE_ID") == 0)
                                            join LPL in PRODUCT_MASTER.AsEnumerable() on
                                            LGM.Field<Int32>("GROUP_ID") equals Convert.ToInt32(LPL.Field<string>("GROUP_IDS"))
                                            select LGM).ToList();

                        if (GROUP_MASTER.Count > 0)
                        {
                            if (DR_LINE.LRF["TYPE"].ToString().ToLower() != "void".ToLower() && DR_LINE.LRF["TYPE"].ToString().ToLower() != "voided".ToLower())
                            {

                                var DISCOUNT_REASON_51_52 = (from LRF in Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("STATUS") == "PAID")
                                                             join LIF in Root.Tables[1].AsEnumerable().Where(p => p.Field<Int32>("RECEIPT_FIELDS_ID") == Header_Id) on
                                                             LRF.Field<Int32>("RECEIPT_FIELDS_ID") equals LIF.Field<Int32>("RECEIPT_FIELDS_ID")
                                                             where PRICE_TYPE_ID_DISCOUNT_REASON_51_52.Contains(LIF.Field<Int32>("PRICE_TYPE_ID"))
                                                             select new
                                                             {
                                                                 REASON = Convert.ToString(LIF.Field<string>("PRODUCT_NAME")),
                                                                 PRICE_TYPE_ID = LIF.Field<Int32>("PRICE_TYPE_ID"),
                                                                 INFO = Convert.ToString(LIF.Field<string>("INFO")),
                                                                 VAT_PERCENTAGE = "",
                                                                 PROD_ID= Convert.ToString(LIF.Field<Int32>("PROD_ID"))
                                                             }).ToList();

                                var DISCOUNT_REASON_53_54_55_56 = (from LRF in Root.Tables[0].AsEnumerable().Where(p => p.Field<string>("STATUS") == "PAID")
                                                                   join LIF in Root.Tables[1].AsEnumerable().Where(p => p.Field<Int32>("RECEIPT_FIELDS_ID") == Header_Id) on
                                                                   LRF.Field<Int32>("RECEIPT_FIELDS_ID") equals LIF.Field<Int32>("RECEIPT_FIELDS_ID")
                                                                   where PRICE_TYPE_ID_DISCOUNT_REASON_53_54_55_56.Contains(LIF.Field<Int32>("PRICE_TYPE_ID"))
                                                                   select new
                                                                   {
                                                                       REASON = Convert.ToString(LIF.Field<string>("PRODUCT_NAME")),
                                                                       PRICE_TYPE_ID = LIF.Field<Int32>("PRICE_TYPE_ID"),
                                                                       INFO = Convert.ToString(LIF.Field<string>("INFO")),
                                                                       VAT_PERCENTAGE = Convert.ToString(LIF.Field<decimal>("VAT_PERCENTAGE")),
                                                                       PROD_ID = Convert.ToString(LIF.Field<Int32>("PROD_ID"))
                                                                   }).ToList();

                                DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                                DR_SQ_LINE["CHECK_ID"] = Header_Id;
                                DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE.REV_TYPE;
                                DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE.REV_TYPE;
                                DR_SQ_LINE["ACCOUNT_GROUP_ID"] = GROUP_MASTER[0]["GROUP_ID"];
                                DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = GROUP_MASTER[0]["NAME"];
                                DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = GROUP_MASTER[0]["NAME"];
                                DR_SQ_LINE["CATEGORY_ID"] = GROUP_MASTER[0]["GROUP_ID"];
                                DR_SQ_LINE["CATEGORY_CODE"] = GROUP_MASTER[0]["NAME"];
                                DR_SQ_LINE["CATEGORY_NAME"] = GROUP_MASTER[0]["NAME"];
                                DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE.LIF["PRODUCT_PLU"];
                                DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE.LIF["PRODUCT_NAME"];
                                DR_SQ_LINE["QUANITY"] = DR_LINE.LIF["AMOUNT"];
                                DR_SQ_LINE["NET"] = (Convert.ToDecimal(DR_LINE.LIF["TOTAL_PRICE_WITHOUT_VAT"]) - Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE_WITHOUT_VAT"]));
                                DR_SQ_LINE["TAX"] = ((Convert.ToDecimal(DR_LINE.LIF["TOTAL_PRICE_WITHOUT_VAT"]) - Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE_WITHOUT_VAT"])) * Convert.ToDecimal(0.01) * Convert.ToDecimal(DR_LINE.LIF["VAT_PERCENTAGE"]));
                                DR_SQ_LINE["GROSS"] = (Convert.ToDecimal(DR_LINE.LIF["TOTAL_PRICE_WITHOUT_VAT"]) - Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE_WITHOUT_VAT"]) + (Convert.ToDecimal(DR_LINE.LIF["TOTAL_PRICE_WITHOUT_VAT"]) - Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE_WITHOUT_VAT"])) * Convert.ToDecimal(0.01) * Convert.ToDecimal(DR_LINE.LIF["VAT_PERCENTAGE"])); ;
                                DR_SQ_LINE["DISCOUNT"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]);
                                DR_SQ_LINE["COMP"] = 0;
                                DR_SQ_LINE["VOID"] = 0;
                                DR_SQ_LINE["TIME_OF_SALE"] = DateTime.SpecifyKind(Convert.ToDateTime(DR_LINE.LRF["MODIFICATION_DATE"]), DateTimeKind.Utc);
                                DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                                DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                                DR_SQ_LINE["VOID_ID"] = (object)DBNull.Value;
                                DR_SQ_LINE["VOID_REASON"] = (object)DBNull.Value;
                                int isCounted = 0;
                                
                                if (DISCOUNT_REASON_51_52.Count() > 0)
                                {
                                    if (Root.Tables[1].Select("RECEIPT_FIELDS_ID=" + Header_Id + " and DISCOUNT_PRICE=" + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) + " and PROD_ID='" + DISCOUNT_REASON_51_52[0].INFO + "'").Count() > 0)
                                    {
                                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? DISCOUNT_REASON_51_52[0].PROD_ID : (object)DBNull.Value;
                                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? DISCOUNT_REASON_51_52[0].REASON : (object)DBNull.Value;
                                        isCounted = 1;
                                    }
                                    else if (DISCOUNT_REASON_53_54_55_56.Count() > 0)
                                    {
                                        if (isCounted == 0)
                                        {
                                            foreach (var item in DISCOUNT_REASON_53_54_55_56)
                                            {
                                                string[] splitArr = item.INFO.Split('=');
                                                string splitValue = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(splitArr[0]);
                                                if (Convert.ToDecimal(item.VAT_PERCENTAGE) == Convert.ToDecimal(DR_LINE.LIF["VAT_PERCENTAGE"]))
                                                {
                                                    DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? item.PROD_ID : (object)DBNull.Value;
                                                    DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? item.REASON : (object)DBNull.Value;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else
                                    {
                                        DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? "" : (object)DBNull.Value;
                                        DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? "" : (object)DBNull.Value;
                                    }
                                }
                                else if (DISCOUNT_REASON_53_54_55_56.Count() > 0)
                                {
                                    if (isCounted == 0)
                                    {
                                        foreach (var item in DISCOUNT_REASON_53_54_55_56)
                                        {
                                            string[] splitArr = item.INFO.Split('=');
                                            string splitValue = Newtonsoft.Json.JsonConvert.DeserializeObject<string>(splitArr[0]);
                                            if (Convert.ToDecimal(item.VAT_PERCENTAGE) == Convert.ToDecimal(DR_LINE.LIF["VAT_PERCENTAGE"]))
                                            {
                                                DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? item.PROD_ID : (object)DBNull.Value;
                                                DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? item.REASON : (object)DBNull.Value;
                                                break;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ?"": (object)DBNull.Value;
                                    DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? "" : (object)DBNull.Value;
                                }

                                //DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? (DISCOUNT_DATA.Count > 0 ? DISCOUNT_REASON[0].REASON : "") : (object)DBNull.Value;
                                //DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToDecimal(DR_LINE.LIF["DISCOUNT_PRICE"]) != 0 ? (DISCOUNT_REASON.Count > 0 ? DISCOUNT_REASON[0].REASON : "") : (object)DBNull.Value;
                                DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]))) * 100;
                                DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_LINE.LIF["VAT_PERCENTAGE"]);
                                _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                            }
                            else
                            {
                                if (DR_LINE.LRF["TYPE"].ToString().ToLower() == "voided".ToLower())
                                {
                                    DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                                    DR_SQ_LINE["CHECK_ID"] = Header_Id;
                                    DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE.REV_TYPE;
                                    DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE.REV_TYPE;
                                    DR_SQ_LINE["ACCOUNT_GROUP_ID"] = GROUP_MASTER[0]["GROUP_ID"];
                                    DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = GROUP_MASTER[0]["NAME"];
                                    DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = GROUP_MASTER[0]["NAME"];
                                    DR_SQ_LINE["CATEGORY_ID"] = GROUP_MASTER[0]["GROUP_ID"];
                                    DR_SQ_LINE["CATEGORY_CODE"] = GROUP_MASTER[0]["NAME"];
                                    DR_SQ_LINE["CATEGORY_NAME"] = GROUP_MASTER[0]["NAME"];
                                    DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE.LIF["PRODUCT_PLU"];
                                    DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE.LIF["PRODUCT_NAME"];
                                    DR_SQ_LINE["QUANITY"] = DR_LINE.LIF["AMOUNT"];
                                    DR_SQ_LINE["NET"] = 0;
                                    DR_SQ_LINE["TAX"] = 0;
                                    DR_SQ_LINE["GROSS"] = 0;
                                    DR_SQ_LINE["DISCOUNT"] = 0;
                                    DR_SQ_LINE["COMP"] = 0;
                                    decimal voided = DR_LINE.LRF["TYPE"].ToString().ToLower() == "voided".ToLower() ? Convert.ToDecimal(DR_LINE.LIF["TOTAL_PRICE"]) * -1 : 0;
                                    DR_SQ_LINE["VOID"] = voided;
                                    DR_SQ_LINE["TIME_OF_SALE"] = DateTime.SpecifyKind(Convert.ToDateTime(DR_LINE.LRF["MODIFICATION_DATE"]), DateTimeKind.Utc);
                                    DR_SQ_LINE["STAFF_ID"] = (object)DBNull.Value;
                                    DR_SQ_LINE["STAFF_NAME"] = (object)DBNull.Value;
                                    DR_SQ_LINE["VOID_ID"] = voided != 0 ? "" : (object)DBNull.Value;
                                    DR_SQ_LINE["VOID_REASON"] = voided != 0 ? "" : (object)DBNull.Value;
                                    DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                                    DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                                    DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                                    DR_SQ_LINE["TAX_RATE"] = 0;
                                    _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                                }
                            }
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
        DataTable FillPayments(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[2].Select("RECEIPT_FIELDS_ID=" + Header_Id).Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[2].Select("RECEIPT_FIELDS_ID=" + Header_Id).CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENT_ID"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["TYPE"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["TYPE"];
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
        DataTable FillDiscounts(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
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
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DISCOUNT_ID"]);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Convert.ToString(DR["DISCOUNT_REASON"]);
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
