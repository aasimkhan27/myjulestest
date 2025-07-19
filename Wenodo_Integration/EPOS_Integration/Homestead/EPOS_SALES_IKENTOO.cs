using App_Repository;
using EPOS_Integration.EPOS_SALES;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels;
using Utility;

namespace EPOS_Integration.Homestead
{
    public class EPOS_SALES_IKENTOO<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_IkentooData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            LogExceptions.LogInfo("inside Transform_IkentooData function");
            Epos_Sales_Datatables epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();
            DataSet SQ_DATA = data as DataSet;
            try
            {
                DataSet DS_DATA = new DataSet();
                DS_DATA = data as DataSet;
                if (DS_DATA.Tables[0].Rows.Count > 0 && DS_DATA.Tables[1].Rows.Count > 0)
                {
                    LogExceptions.LogInfo("inside Transform_IkentooData function -try");
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(DS_DATA, _ICashUp, Integration_Dt);
                }
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                LogExceptions.LogError("Transform_IKENTOO - IKENTOO - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Transform_IKENTOO - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            LogExceptions.LogInfo("inside Transform_IkentooData function -FillHeader");
            try
            {
                foreach (DataRow HEADER in Root.Tables[0].Rows)
                {
                    FillLines(Root, Convert.ToInt32(HEADER["INDEX"]), _ICashUp, Integration_Dt);
                    DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();

                    DataRow DR_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    DR_HEADER["CHECK_ID"] = HEADER["INDEX"];
                    DR_HEADER["CHECK_NO"] = HEADER["RECEIPTID"];
                    //DR_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["TIMEOFOPENING"]);
                    //DR_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["TIMEOFCLOSEANDPAID"]);

                    DR_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["TIMEOFOPENING"]) == "" ? (object)DBNull.Value :
                            (
                                DayLight_Saving(Convert.ToString(HEADER["TIMEOFOPENING"]), Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                Convert.ToString(Convert.ToDateTime(HEADER["TIMEOFOPENING"]).AddHours(1)) :
                                Convert.ToString(HEADER["TIMEOFOPENING"])
                            );
                    DR_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["TIMEOFCLOSEANDPAID"]) == "" ? (object)DBNull.Value :
                            (
                                DayLight_Saving(Convert.ToString(HEADER["TIMEOFCLOSEANDPAID"]), Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                Convert.ToString(Convert.ToDateTime(HEADER["TIMEOFCLOSEANDPAID"]).AddHours(1)) :
                                Convert.ToString(HEADER["TIMEOFCLOSEANDPAID"])
                            );




                    DR_HEADER["COVERS"] = HEADER["NBCOVERS"];
                    //comm sep employee fill in both
                    string REVENUE_CENTRE_CODE = string.Empty;
                    string REVENUE_CENTRE_DESC = string.Empty;
                    List<string> UNIQUES = null;
                    if (Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0)
                    {
                        foreach (DataRow dr in Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Rows)
                        {
                            REVENUE_CENTRE_CODE += dr["REVENUECENTERID"] + ",";
                            REVENUE_CENTRE_DESC += dr["REVENUECENTER"] + ",";
                        }
                    }
                    if (REVENUE_CENTRE_CODE.Length > 0)
                    {
                        UNIQUES = REVENUE_CENTRE_CODE.Remove(REVENUE_CENTRE_CODE.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                    }
                    DR_HEADER["REVENUE_CENTRE_CODE"] = UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;

                    UNIQUES = null;
                    if (REVENUE_CENTRE_DESC.Length > 0)
                    {
                        UNIQUES = REVENUE_CENTRE_DESC.Remove(REVENUE_CENTRE_DESC.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                    }
                    DR_HEADER["REVENUE_CENTRE_DESC"] = UNIQUES != null ? string.Join(",", UNIQUES) : (object)DBNull.Value;

                    DR_HEADER["SERVE_MODE"] = HEADER["DINEIN"].Equals(true) ? "Eat In" : "Take Away";
                    DR_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0; //Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(TOTALNETAMOUNTWITHOUTTAX)", string.Empty)) : 0;
                    DR_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;//Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(TAXAMOUNT)", string.Empty)) : 0;
                    DR_HEADER["GROSS"] = SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0;//Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? (Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(TOTALNETAMOUNTWITHTAX)", string.Empty))- Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(SERVICECHARGE)", string.Empty))) : 0;
                    DR_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;//Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='DISCOUNT'").Count() > 0 ? Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='DISCOUNT'").CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty)) : 0;

                    decimal SUM_COMP_LOSS_AND_NULL = 0;
                    if (Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='COMP'").Count() > 0)
                    {
                        SUM_COMP_LOSS_AND_NULL = Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='COMP'").CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty));                       
                    }
                    if (Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='LOSS'").Count() > 0)
                    {
                        SUM_COMP_LOSS_AND_NULL += Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE='LOSS'").CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty));
                    }
                    if (Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE=''").Count() > 0)
                    {
                        SUM_COMP_LOSS_AND_NULL += Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"] + "and ACCOUNTDISCOUNTTYPE=''").CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty));
                    }
                    DR_HEADER["COMP"] = SUM_COMP_LOSS_AND_NULL;

                    decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"]+"'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["INDEX"]+"'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;

                    DR_HEADER["VOID"] = VOID; //Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? (Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(TOTALNETAMOUNTWITHTAX)", string.Empty)) - Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(SERVICECHARGE)", string.Empty))) * -1 : 0;
                    DR_HEADER["TIPS"] = Root.Tables[2].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? Convert.ToDecimal(Root.Tables[2].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(TIP)", string.Empty)) : 0;
                    DR_HEADER["SERVICE_CHARGE"] = Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Compute("SUM(SERVICECHARGE)", string.Empty)) : 0;
                    DR_HEADER["DONATION"] = 0;//*
                    DR_HEADER["CURRENCY"] = Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).Count() > 0 ? Root.Tables[1].Select("INDEX=" + HEADER["INDEX"]).CopyToDataTable().Rows[0]["CURRENCY"] : 0;
                    DR_HEADER["IS_TRAINING"] = false;
                    DR_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    DR_HEADER["STAFF_ID"] = HEADER["OWNERID"];
                    DR_HEADER["STAFF_NAME"] = HEADER["OWNERNAME"];
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_HEADER);

                                  
                    FillPayments(Root, Convert.ToInt32(HEADER["INDEX"]), _ICashUp);
                    FillDiscounts(Root, Convert.ToInt32(HEADER["INDEX"]), _ICashUp);
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
                if (Root.Tables[1].Select("INDEX=" + Header_Id).Count() > 0)
                {
                    foreach (DataRow DR_LINE in Root.Tables[1].Select("INDEX=" + Header_Id).CopyToDataTable().Rows)
                    {
                        decimal TOTALNETAMOUNTWITHTAX = 0;
                        decimal SERVICECHARGE = 0;

                        DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                        DR_SQ_LINE["CHECK_ID"] = Header_Id;
                        DR_SQ_LINE["REVENUE_CENTER_ID"] = DR_LINE["REVENUECENTERID"];
                        DR_SQ_LINE["REVENUE_CENTER"] = DR_LINE["REVENUECENTER"];
                        DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["ACCOUNTINGGROUP_ACCOUNTINGGROUPID"];
                        DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["ACCOUNTINGGROUP_ACCOUNTINGGROUPID"];
                        DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["ACCOUNTINGGROUP_NAME"];
                        DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["ACCOUNTINGGROUP_ACCOUNTINGGROUPID"];
                        DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["ACCOUNTINGGROUP_ACCOUNTINGGROUPID"];
                        DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["ACCOUNTINGGROUP_NAME"];
                        DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["SKU"];
                        DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["NAME"];
                        DR_SQ_LINE["QUANITY"] = DR_LINE["QUANTITY"];
                        DR_SQ_LINE["NET"] = Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHOUTTAX"]) ;
                        DR_SQ_LINE["TAX"] = Convert.ToDecimal(DR_LINE["TAXAMOUNT"]);
                        decimal GROSS = Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHTAX"]) - Convert.ToDecimal(DR_LINE["SERVICECHARGE"]);
                        DR_SQ_LINE["GROSS"] = Convert.ToDecimal(DR_SQ_LINE["NET"]) + Convert.ToDecimal(DR_SQ_LINE["TAX"]);// GROSS;// Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHTAX"])- Convert.ToDecimal(DR_LINE["SERVICECHARGE"]);
                        decimal DISCOUNT = Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "DISCOUNT" ? Convert.ToDecimal(DR_LINE["TOTALDISCOUNTAMOUNT"]) : 0;
                        DR_SQ_LINE["DISCOUNT"] = DISCOUNT;//Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "DISCOUNT" ? DR_LINE["TOTALDISCOUNTAMOUNT"] : 0;

                        decimal SUM_COMP_LOSS_AND_NULL = 0;
                        if (Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "COMP")
                            SUM_COMP_LOSS_AND_NULL += Convert.ToDecimal(DR_LINE["TOTALDISCOUNTAMOUNT"]);
                        if (Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "LOSS")
                            SUM_COMP_LOSS_AND_NULL += Convert.ToDecimal(DR_LINE["TOTALDISCOUNTAMOUNT"]);
                        if (Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "" )
                            SUM_COMP_LOSS_AND_NULL += Convert.ToDecimal(DR_LINE["TOTALDISCOUNTAMOUNT"]);

                        DR_SQ_LINE["COMP"] = SUM_COMP_LOSS_AND_NULL;// Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "COMP" || Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) ==null || Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "LOSS" ? DR_LINE["TOTALDISCOUNTAMOUNT"] : 0;

                        TOTALNETAMOUNTWITHTAX = Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHTAX"]);
                        SERVICECHARGE= Convert.ToDecimal(DR_LINE["SERVICECHARGE"]);

                        DR_SQ_LINE["VOID"] = TOTALNETAMOUNTWITHTAX < 0 && Convert.ToString(DR_LINE["VOID_REASON"]) != "" ? (TOTALNETAMOUNTWITHTAX - SERVICECHARGE) : 0;
                        //DR_SQ_LINE["TIME_OF_SALE"] = Convert.ToString(DR_LINE["TIMEOFSALE"]);

                        string TIME_OF_SALE = Convert.ToString(DR_LINE["TIMEOFSALE"]);
                        DR_SQ_LINE["TIME_OF_SALE"] = TIME_OF_SALE == "" ? (object)DBNull.Value : 
                            (DayLight_Saving(TIME_OF_SALE, Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ? Convert.ToDateTime(DR_LINE["TIMEOFSALE"]).AddHours(1) : DR_LINE["TIMEOFSALE"]);



                        DR_SQ_LINE["STAFF_ID"] = DR_LINE["STAFFID"];
                        DR_SQ_LINE["STAFF_NAME"] = DR_LINE["STAFFNAME"];
                        DR_SQ_LINE["VOID_ID"] = Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHTAX"]) < 0 && Convert.ToString(DR_LINE["VOID_REASON"]) !="" ? DR_LINE["VOID_REASON"] :(object)DBNull.Value ;
                        DR_SQ_LINE["VOID_REASON"] = Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHTAX"]) < 0 && Convert.ToString(DR_LINE["VOID_REASON"]) !="" ? DR_LINE["VOID_REASON"] : (object)DBNull.Value;

                        string DISCOUNT_ID  = string.Empty;
                        string DISCOUNT_REASON = string.Empty;
                        List<string> UNIQUES = null;
                        if (Root.Tables[1].Select("INDEX=" + Header_Id).Count() > 0)
                        {
                            foreach (DataRow DR_LN in Root.Tables[1].Select("INDEX=" + Header_Id).CopyToDataTable().Rows)
                            {
                                DISCOUNT_ID += DR_LN["ACCOUNTDISCOUNTCODE"].ToString() + ",";
                                DISCOUNT_REASON += DR_LN["ACCOUNTDISCOUNTNAME"].ToString() + ",";
                            }
                           
                        }

                        decimal DISCOUNT_RATE = 0;
                        if (Convert.ToString(DR_LINE["ACCOUNTDISCOUNTTYPE"]) == "DISCOUNT")
                        {
                            if (Convert.ToDecimal(DR_LINE["TOTALDISCOUNTAMOUNT"]) > 0)
                            {
                                DISCOUNT_RATE = ((DISCOUNT / (GROSS + DISCOUNT)) * 100);
                            }
                            else
                            {
                                DISCOUNT_RATE = 0;
                            }
                        }
                        else
                            DISCOUNT_RATE = 0;
                        
                        if (DISCOUNT_ID.Length > 0)
                        {
                            UNIQUES = DISCOUNT_ID.Remove(DISCOUNT_ID.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                        }
                        DR_SQ_LINE["DISCOUNT_ID"] = DR_LINE["ACCOUNTDISCOUNTNAME"];//UNIQUES != null ? string.Join(",", UNIQUES).TrimStart(',').TrimEnd(',') : (object)DBNull.Value;
                        UNIQUES = null;
                        if (DISCOUNT_REASON.Length > 0)
                        {
                            UNIQUES = DISCOUNT_REASON.Remove(DISCOUNT_REASON.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList();
                        }
                        DR_SQ_LINE["DISCOUNT_REASON"] = DR_LINE["ACCOUNTDISCOUNTNAME"]; // UNIQUES != null ? string.Join(",", UNIQUES).TrimStart(',').TrimEnd(',') : (object)DBNull.Value;
                        DR_SQ_LINE["DISCOUNT_RATE"] = DISCOUNT_RATE;
                        DR_SQ_LINE["TAX_RATE"] = Convert.ToDecimal(DR_LINE["TAXRATEPERCENTAGE"]);
                            //Convert.ToDecimal(DR_LINE["TAXAMOUNT"]) == 0 || Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHOUTTAX"]) == 0 ? 0 : (Convert.ToDecimal(DR_LINE["TAXAMOUNT"]) / Convert.ToDecimal(DR_LINE["TOTALNETAMOUNTWITHOUTTAX"])) * 100;  //DR_LINE["TAXRATEPERCENTAGE"]; 
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
        DataTable FillPayments(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {
                if (Root.Tables[2].Select("INDEX=" + Header_Id ).Count() > 0)
                {
                   foreach (DataRow DR in Root.Tables[2].Select("INDEX=" + Header_Id ).CopyToDataTable().Rows)
                    {
                        DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                        DR_PAYMENT["CHECK_ID"] = Header_Id;
                        DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["PAYMENTMETHODID"];
                        DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["CODE"];
                        DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["DESCRIPTION"];
                        DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["NETAMOUNTWITHTAX"]) + Convert.ToDecimal(DR["TIP"]);
                        DR_PAYMENT["TIPS"] = Convert.ToDecimal(DR["TIP"]);
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
        DataTable FillDiscounts(DataSet Root, Int32 Header_Id, Cashup _ICashUp)
        {
            try
            {

                var list = Root.Tables[1].Select("INDEX=" + Header_Id + " and (ACCOUNTDISCOUNTTYPE='DISCOUNT' or ACCOUNTDISCOUNTTYPE='COMP' or ACCOUNTDISCOUNTTYPE='LOSS' or ACCOUNTDISCOUNTTYPE='')").ToList().GroupBy(p => p.Field<Int32>("INDEX")).Select(p => p.First()).ToList();
                if (list.Count() > 0)
                {
                    if (Convert.ToDecimal(Root.Tables[1].Select("INDEX=" + Header_Id).CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty)) != 0) {
                        foreach (DataRow DR in list.CopyToDataTable().Rows)
                        {
                            DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            DR_DISCOUNT["CHECK_ID"] = Header_Id;
                            DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(Header_Id);
                            DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = Root.Tables[1].Select("INDEX=" + Header_Id + "and  ACCOUNTDISCOUNTNAME <> ''").Count() > 0 ? Root.Tables[1].Select("INDEX=" + Header_Id + "and  ACCOUNTDISCOUNTNAME <> ''").CopyToDataTable().Rows[0]["ACCOUNTDISCOUNTNAME"] : DR["ACCOUNTDISCOUNTNAME"];
                            DR_DISCOUNT["DISCOUNT_AMOUNT"] = Root.Tables[1].Select("INDEX=" + Header_Id).CopyToDataTable().Compute("SUM(TOTALDISCOUNTAMOUNT)", string.Empty); //DR["TOTALDISCOUNTAMOUNT"];
                            DR_DISCOUNT["STAFF_ID"] = DR["STAFFID"];
                            DR_DISCOUNT["STAFF_NAME"] = DR["STAFFNAME"];
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
