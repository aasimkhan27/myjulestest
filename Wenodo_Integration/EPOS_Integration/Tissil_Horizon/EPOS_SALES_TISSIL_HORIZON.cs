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

namespace EPOS_Integration.Tissil_Horizon
{
    class EPOS_SALES_TISSIL_HORIZON<T>
    {
        public CashupModel CashupModelObj { get; set; }
        public CashupModel Transform_Tillil_Horizon(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
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
                LogExceptions.LogError("Transform_SQUIRELL - Tillil_Horizon - " + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , " + _ICashUp.CashupModelObj.CASHUP_END_DATE + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + "," + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString(), ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = "Exception -Tillil_Horizon - start_date:-" + _ICashUp.CashupModelObj.CASHUP_START_DATE + " , end_date:-" + _ICashUp.CashupModelObj.CASHUP_END_DATE + " , ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["ID"]).ToString() + " , BRANCH_ID:-" + Convert.ToDecimal(Integration_Dt.Rows[0]["BRANCH_ID"]).ToString() + "--" + ex.ToString();
                //_ICashUp.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                throw;
            }
            return _ICashUp.CashupModelObj;

        }
        DataTable FillHeader(DataSet Root, Cashup _ICashUp, DataTable Integration_Dt)
        {
            try
            {
                if (Root.Tables[0].Select("IS_TRAINING<>true").Count() > 0)
                {
                    foreach (DataRow HEADER in Root.Tables[0].Select("IS_TRAINING<>true").CopyToDataTable().Rows)
                    {
                        FillLines(Root, HEADER["CHECK_ID"].ToString(), _ICashUp, Integration_Dt);
                        DataTable SALES_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.Copy();
                        DataRow DR_SQ_HEADER = _ICashUp.CashupModelObj.EPOS_SALES_HEADER.NewRow();

                        DR_SQ_HEADER["CHECK_ID"] = HEADER["CHECK_ID"];
                        DR_SQ_HEADER["CHECK_NO"] = HEADER["CHECK_CODE"];
                        DR_SQ_HEADER["OPEN_TIME"] = Convert.ToString(HEADER["OPEN_TIME"]) == "" ? (object)DBNull.Value :
                                (
                                    DayLight_Saving(Convert.ToString(HEADER["OPEN_TIME"]), Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                    Convert.ToString(Convert.ToDateTime(HEADER["OPEN_TIME"]).AddHours(1)) :
                                    Convert.ToString(HEADER["OPEN_TIME"])
                                );
                        DR_SQ_HEADER["CLOSE_TIME"] = Convert.ToString(HEADER["CLOSE_TIME"]) == "" ? (object)DBNull.Value :
                                (
                                    DayLight_Saving(Convert.ToString(HEADER["CLOSE_TIME"]), Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                    Convert.ToString(Convert.ToDateTime(HEADER["CLOSE_TIME"]).AddHours(1)) :
                                    Convert.ToString(HEADER["CLOSE_TIME"])
                                );
                        decimal TOTAL_CHARITY_DONATION = Convert.ToDecimal(Root.Tables[0].Select("TRANSACTION_ID='" + HEADER["CHECK_ID"] + "'").Count()) > 0 ?
                             (Root.Tables[0].Select("TRANSACTION_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TOTAL_CHARITY_DONATION)", string.Empty) == (object)DBNull.Value ? 0 :
                                Convert.ToDecimal(Root.Tables[0].Select("TRANSACTION_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TOTAL_CHARITY_DONATION)", string.Empty)))
                             : 0;

                        DR_SQ_HEADER["COVERS"] = HEADER["COVERS"];
                        DR_SQ_HEADER["REVENUE_CENTRE_CODE"] = HEADER["REVENUE_CENTRE_CODE"];
                        DR_SQ_HEADER["REVENUE_CENTRE_DESC"] = HEADER["REVENUE_CENTRE_DESC"];
                        DR_SQ_HEADER["SERVE_MODE"] = HEADER["ORDER_TYPE"] != null ? (Convert.ToString(HEADER["ORDER_TYPE"]).ToUpper() == "Take Away".ToUpper() ? "Take Away" : "Eat In") : "Eat In";
                        DR_SQ_HEADER["NET"] = SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(NET)", string.Empty)) : 0;
                        DR_SQ_HEADER["TAX"] = SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TAX)", string.Empty)) : 0;
                        DR_SQ_HEADER["GROSS"] = (SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(GROSS)", string.Empty)) : 0);
                        DR_SQ_HEADER["DISCOUNT"] = SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(DISCOUNT)", string.Empty)) : 0;
                        DR_SQ_HEADER["COMP"] = 0;
                        decimal VOID = SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(SALES_LINE.Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(VOID)", string.Empty)) : 0;
                        DR_SQ_HEADER["VOID"] = VOID > 0 ? VOID * -1 : VOID;
                        DR_SQ_HEADER["TIPS"] = Root.Tables[2].Select("CHECK_ID='" + HEADER["CHECK_ID"] + "' and TRANSACTION_TYPE_CODE='TIPS'").Count() > 0 ? Convert.ToDecimal(Root.Tables[2].Select("CHECK_ID='" + HEADER["CHECK_ID"] + "' and TRANSACTION_TYPE_CODE='TIPS'").CopyToDataTable().AsEnumerable().Sum(p => Convert.ToDecimal(p.Field<string>("TENDER_AMOUNT")))) : 0;
                        DR_SQ_HEADER["SERVICE_CHARGE"] = Root.Tables[3].Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").Count() > 0 ? Convert.ToDecimal(Root.Tables[3].Select("CHECK_ID='" + HEADER["CHECK_ID"] + "'").CopyToDataTable().Compute("SUM(TENDER_AMOUNT)", string.Empty)) : 0;
                        DR_SQ_HEADER["DONATION"] = TOTAL_CHARITY_DONATION;// HEADER["TOTAL_CHARITY_DONATION"];
                        DR_SQ_HEADER["CURRENCY"] = HEADER["CURRENCY"];
                        DR_SQ_HEADER["IS_TRAINING"] = HEADER["IS_TRAINING"];

                        DR_SQ_HEADER["INTEGRATION_SYSTEM_ID"] = _ICashUp.CashupModelObj.INTEGRATION_SYSTEM_ID;



                        DR_SQ_HEADER["STAFF_ID"] = HEADER["CLOSE_TAB_OWNER_DESC"];
                        DR_SQ_HEADER["STAFF_NAME"] = HEADER["CLOSE_TAB_OWNER_DESC"];
                        _ICashUp.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(DR_SQ_HEADER);


                        //FillLinesFromVoid(SQ_Dataset, Convert.ToInt32(HEADER["CHECK_ID"]), _ICashUp);
                        FillPayments(Root, HEADER["CHECK_ID"].ToString(), _ICashUp);
                        FillDiscounts(Root, HEADER["CHECK_ID"].ToString(), _ICashUp);
                    }
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
                if (Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").Count() > 0)
                {                  
                    if (Root.Tables[5].Select("CHECK_ID='" + Header_Id + "'").Count() > 0)
                    {
                        foreach (DataRow DR_VOID in Root.Tables[5].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                        {
                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Header_Id;
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REVENUE_CENTRE_CODE"];
                            DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REVENUE_CENTRE_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_ID"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_CODE"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_NAME"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["PRODUCT_SKU"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["SALES_ITEM_PLU"];
                            DR_SQ_LINE["PRODUCT_NAME"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["SALES_ITEM_DESC"];
                            decimal voidAmt = (
                                Convert.ToDecimal(DR_VOID["PRICE_PAID"]) > Convert.ToDecimal(DR_VOID["LIST_PRICE"]) ?
                                    Convert.ToDecimal(DR_VOID["PRICE_PAID"]) : (Convert.ToDecimal(DR_VOID["LIST_PRICE"]) - Convert.ToDecimal(DR_VOID["DEDUCTION"]))
                            ) * -1;

                            string voidReasion = Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) == "" ? (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? "" : DR_VOID["CUSTOM_FIELD_2"]).ToString() : (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]).ToString() : Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) + "_" + Convert.ToString(DR_VOID["CUSTOM_FIELD_2"])).ToString();
                            DR_SQ_LINE["QUANITY"] = voidReasion == "" ? Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["QTY"] : Convert.ToDecimal(Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["QTY"]) * -1;
                            //DR_SQ_LINE["QUANITY"] = voidAmt <= 0 ? Convert.ToDecimal(Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["QTY"]) * -1 : Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["QTY"];
                            DR_SQ_LINE["NET"] = 0;
                            DR_SQ_LINE["TAX"] = 0;
                            DR_SQ_LINE["GROSS"] = 0;
                            DR_SQ_LINE["DISCOUNT"] = 0;
                            DR_SQ_LINE["COMP"] = 0;
                            DR_SQ_LINE["VOID"] = voidAmt;
                                //(Convert.ToDecimal(DR_VOID["PRICE_PAID"]) > Convert.ToDecimal(DR_VOID["LIST_PRICE"]) ?Convert.ToDecimal(DR_VOID["PRICE_PAID"]) : (Convert.ToDecimal(DR_VOID["LIST_PRICE"]) - Convert.ToDecimal(DR_VOID["DEDUCTION"]))) * -1;
                            string TIME_OF_SALE = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"].ToString();
                            DR_SQ_LINE["TIME_OF_SALE"] = TIME_OF_SALE == "" ? (object)DBNull.Value : (DayLight_Saving(TIME_OF_SALE, Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                Convert.ToDateTime(Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]).AddHours(1) :
                                Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]);

                            DR_SQ_LINE["STAFF_ID"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TAB_OWNER_DESC"];
                            DR_SQ_LINE["STAFF_NAME"] = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["TAB_OWNER_DESC"];
                            DR_SQ_LINE["VOID_ID"] = Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) == "" ? (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? "" : DR_VOID["CUSTOM_FIELD_2"]) :
                                                 (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) : Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) + "_" + Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]));
                            DR_SQ_LINE["VOID_REASON"] = Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) == "" ? (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? "" : DR_VOID["CUSTOM_FIELD_2"]) :
                                                 (Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]) == "" ? Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) : Convert.ToString(DR_VOID["CUSTOM_FIELD_1"]) + "_" + Convert.ToString(DR_VOID["CUSTOM_FIELD_2"]));

                            DR_SQ_LINE["DISCOUNT_ID"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_REASON"] = (object)DBNull.Value;
                            DR_SQ_LINE["DISCOUNT_RATE"] = 0;
                            DR_SQ_LINE["TAX_RATE"] = 0;
                            _ICashUp.CashupModelObj.EPOS_SALES_LINES.Rows.Add(DR_SQ_LINE);
                        }
                    }
                    else
                    {
                        foreach (DataRow DR_LINE in Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and (TRANSACTION_TYPE_CODE='SALES_ITEM' or TRANSACTION_TYPE_CODE='VOID_ITEM')").CopyToDataTable().Rows)
                        {

                            DataRow DR_SQ_LINE = _ICashUp.CashupModelObj.EPOS_SALES_LINES.NewRow();
                            DR_SQ_LINE["CHECK_ID"] = Header_Id;
                            DR_SQ_LINE["REVENUE_CENTER_ID"] = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REVENUE_CENTRE_CODE"];
                            DR_SQ_LINE["REVENUE_CENTER"] = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["REVENUE_CENTRE_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_ID"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_CODE"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["ACCOUNT_GROUP_NAME"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_ID"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_CODE"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["CATEGORY_NAME"] = DR_LINE["MAJOR_GROUP_DESC"];
                            DR_SQ_LINE["PRODUCT_SKU"] = DR_LINE["SALES_ITEM_PLU"];
                            DR_SQ_LINE["PRODUCT_NAME"] = DR_LINE["SALES_ITEM_DESC"];
                            
                            if (Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM")
                            {
                                DR_SQ_LINE["QUANITY"] = Convert.ToDecimal(DR_LINE["QTY"]) * -1;
                                DR_SQ_LINE["NET"] = 0;
                                DR_SQ_LINE["TAX"] = 0;
                                DR_SQ_LINE["GROSS"] = 0;
                                DR_SQ_LINE["DISCOUNT"] = 0;
                                DR_SQ_LINE["COMP"] = 0;
                                DR_SQ_LINE["VOID"] =
                                    (
                                        Convert.ToDecimal(DR_LINE["PRICE_PAID"]) > Convert.ToDecimal(DR_LINE["LIST_PRICE"]) ?
                                            Convert.ToDecimal(DR_LINE["PRICE_PAID"]) : (Convert.ToDecimal(DR_LINE["LIST_PRICE"]) - Convert.ToDecimal(DR_LINE["DEDUCTION"]))
                                    ) * -1;
                            }
                            else
                            {
                                DR_SQ_LINE["QUANITY"] = DR_LINE["QTY"];
                                decimal PRICE_PAID = Convert.ToDecimal(DR_LINE["PRICE_PAID"]);
                                decimal LIST_PRICE = Convert.ToDecimal(DR_LINE["LIST_PRICE"]);
                                decimal LINE_TAX = Convert.ToDecimal(DR_LINE["LINE_TAX"]);
                                decimal DEDUCTION = Convert.ToDecimal(DR_LINE["DEDUCTION"]);
                                decimal GROSS = 0;
                                decimal NET = 0;
                                DataTable MODIFIERS_DT = new DataTable();
                                if(Convert.ToDecimal(Integration_Dt.Rows[0]["ENTITY_ID"])==29)
                                    MODIFIERS_DT = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and TRANSACTION_TYPE_CODE='MODIFIER_ITEM' and SALES_ITEM_GUID='" + DR_LINE["SALES_ITEM_GUID"] + "' and RECORD_ACTIVITY_CODE <>3 and RECORD_ACTIVITY_CODE <>5").Count() > 0 ? Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and TRANSACTION_TYPE_CODE='MODIFIER_ITEM' and SALES_ITEM_GUID='" + DR_LINE["SALES_ITEM_GUID"] + "' and RECORD_ACTIVITY_CODE <>3 and RECORD_ACTIVITY_CODE <>5").CopyToDataTable() : null;
                                else
                                    MODIFIERS_DT = Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and TRANSACTION_TYPE_CODE='MODIFIER_ITEM' and SALES_ITEM_GUID='" + DR_LINE["SALES_ITEM_GUID"] + "'").Count() > 0 ? Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and TRANSACTION_TYPE_CODE='MODIFIER_ITEM' and SALES_ITEM_GUID='" + DR_LINE["SALES_ITEM_GUID"]+"'").CopyToDataTable() : null;
                                if (MODIFIERS_DT != null && MODIFIERS_DT.Rows.Count > 0)
                                {
                                    foreach (DataRow DR_MODIFIRE in MODIFIERS_DT.Rows)
                                    {
                                        PRICE_PAID += Convert.ToDecimal(DR_MODIFIRE["PRICE_PAID"]); //Convert.ToDecimal(MODIFIERS_DT.Compute("SUM(PRICE_PAID)", string.Empty));
                                        LIST_PRICE += Convert.ToDecimal(DR_MODIFIRE["LIST_PRICE"]) * Convert.ToDecimal(DR_MODIFIRE["QTY"]); //Convert.ToDecimal(MODIFIERS_DT.Compute("SUM(LIST_PRICE)", string.Empty)) * Convert.ToDecimal(MODIFIERS_DT.Compute("SUM(QTY)", string.Empty)); ;
                                        LINE_TAX += Convert.ToDecimal(DR_MODIFIRE["LINE_TAX"]); // Convert.ToDecimal(MODIFIERS_DT.Compute("SUM(LINE_TAX)", string.Empty));
                                                                                                //DEDUCTION += Convert.ToDecimal(DR_MODIFIRE["DEDUCTION"]); //Convert.ToDecimal(MODIFIERS_DT.Compute("SUM(DEDUCTION)", string.Empty));

                                        NET = PRICE_PAID > LIST_PRICE ? PRICE_PAID : LIST_PRICE;//: LIST_PRICE - ((LINE_TAX - DEDUCTION) < 0 ? (LINE_TAX - DEDUCTION) * -1 : (LINE_TAX - DEDUCTION));
                                        NET = NET == 0 && LINE_TAX == 0 ? 0 : NET - LINE_TAX - DEDUCTION;
                                        GROSS = PRICE_PAID > LIST_PRICE ? PRICE_PAID : LIST_PRICE;
                                        GROSS = GROSS == 0 ? 0 : GROSS - DEDUCTION;
                                    }
                                }
                                else
                                {
                                    NET = PRICE_PAID > LIST_PRICE ? PRICE_PAID : LIST_PRICE;//: LIST_PRICE - ((LINE_TAX - DEDUCTION) < 0 ? (LINE_TAX - DEDUCTION) * -1 : (LINE_TAX - DEDUCTION));
                                    NET = NET == 0 && LINE_TAX == 0 ? 0 : NET - LINE_TAX - DEDUCTION;
                                    GROSS = PRICE_PAID > LIST_PRICE ? PRICE_PAID : LIST_PRICE;
                                    GROSS = GROSS == 0 ? 0 : GROSS - DEDUCTION;
                                }
                                DR_SQ_LINE["NET"] = NET;
                                DR_SQ_LINE["TAX"] = LINE_TAX;
                                DR_SQ_LINE["GROSS"] = GROSS;
                                DR_SQ_LINE["DISCOUNT"] = DEDUCTION;
                                DR_SQ_LINE["COMP"] = 0;
                                DR_SQ_LINE["VOID"] = 0;

                                //Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ?
                                //(
                                //    Convert.ToDecimal(DR_LINE["PRICE_PAID"]) > Convert.ToDecimal(DR_LINE["LIST_PRICE"]) ?
                                //        Convert.ToDecimal(DR_LINE["PRICE_PAID"]) : (Convert.ToDecimal(DR_LINE["LIST_PRICE"]) - Convert.ToDecimal(DR_LINE["DEDUCTION"]))
                                //) * -1 : 0;
                            }

                            string VOID_REASON = Convert.ToString(DR_LINE["CUSTOM_FIELD_1"]) == "" ? (Convert.ToString(DR_LINE["CUSTOM_FIELD_2"]) == "" ? "" : Convert.ToString(DR_LINE["CUSTOM_FIELD_2"])) :
                                                 (Convert.ToString(DR_LINE["CUSTOM_FIELD_2"]) == "" ? Convert.ToString(DR_LINE["CUSTOM_FIELD_1"]) : Convert.ToString(DR_LINE["CUSTOM_FIELD_1"]) + "_" + Convert.ToString(DR_LINE["CUSTOM_FIELD_2"]));

                            string TIME_OF_SALE = Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"].ToString();

                            DR_SQ_LINE["TIME_OF_SALE"] = TIME_OF_SALE == "" ? (object)DBNull.Value : (DayLight_Saving(TIME_OF_SALE, Integration_Dt.Rows[0]["COUNTRY_CODE"].ToString()) == true ?
                                Convert.ToDateTime(Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]).AddHours(1) : Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]);

                            //Convert.ToDateTime(Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]).IsDaylightSavingTime()==true?
                            //Convert.ToDateTime(Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"]).AddHours(1): Root.Tables[0].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows[0]["CLOSE_TIME"];

                            DR_SQ_LINE["STAFF_ID"] = DR_LINE["TAB_OWNER_DESC"];
                            DR_SQ_LINE["STAFF_NAME"] = DR_LINE["TAB_OWNER_DESC"];
                            DR_SQ_LINE["VOID_ID"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? VOID_REASON : (object)DBNull.Value;
                            DR_SQ_LINE["VOID_REASON"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? VOID_REASON : (object)DBNull.Value;
                            decimal DISCOUNT_RATE = 0;
                            if (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) == 0)
                                DISCOUNT_RATE = 0;
                            else
                                DISCOUNT_RATE = (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"])) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) + Convert.ToDecimal(DR_SQ_LINE["DISCOUNT"]))) * 100;


                            string DISCOUNT_ID = string.Empty;
                            string DISCOUNT_REASON = string.Empty;
                            List<string> UNIQUES = null;
                            if (Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and SALES_ITEM_GUID='" + Convert.ToString(DR_LINE["SALES_ITEM_GUID"]) + "' and DEDUCTION <>0").Count() > 0)
                            {
                                foreach (DataRow dr in Root.Tables[1].Select("CHECK_ID='" + Header_Id + "' and SALES_ITEM_GUID='" + Convert.ToString(DR_LINE["SALES_ITEM_GUID"]) + "'").CopyToDataTable().Rows)
                                {
                                    if (dr["DEDUCTION_CODE"].ToString() != "")
                                        DISCOUNT_ID += dr["DEDUCTION_CODE"] + ",";
                                    if (dr["DEDUCTION_DESC"].ToString() != "")
                                        DISCOUNT_REASON += dr["DEDUCTION_DESC"] + ",";
                                }
                            }
                            decimal TAX_RATE = Convert.ToDecimal(DR_SQ_LINE["TAX"]) == 0 ? 0 : (Convert.ToDecimal(DR_SQ_LINE["TAX"]) / (Convert.ToDecimal(DR_SQ_LINE["GROSS"]) - Convert.ToDecimal(DR_SQ_LINE["TAX"]))) * 100;
                            UNIQUES = DISCOUNT_ID.Length > 0 ? DISCOUNT_ID.Remove(DISCOUNT_ID.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList() : null;
                            DR_SQ_LINE["DISCOUNT_ID"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? (object)DBNull.Value : (DISCOUNT_ID.Length == 0 ? (object)DBNull.Value : string.Join(",", UNIQUES));

                            UNIQUES = null;
                            UNIQUES = DISCOUNT_REASON.Length > 0 ? DISCOUNT_REASON.Remove(DISCOUNT_REASON.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList() : null;
                            DR_SQ_LINE["DISCOUNT_REASON"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? (object)DBNull.Value : (DISCOUNT_REASON.Length == 0 ? (object)DBNull.Value : string.Join(",", UNIQUES));

                            DR_SQ_LINE["DISCOUNT_RATE"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? 0 : DISCOUNT_RATE;
                            DR_SQ_LINE["TAX_RATE"] = Convert.ToString(DR_LINE["TRANSACTION_TYPE_CODE"]) == "VOID_ITEM" ? 0 : TAX_RATE;
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
                //var RESULT = Root.Tables[2].Select("CHECK_ID='" + Header_Id + "'").Distinct().ToList();
                //var RESULT = Root.Tables[2].AsEnumerable().GroupBy(x => x.Field<string>("CHECK_ID")).Select(x => x.First()).Where(p => p.Field<string>("CHECK_ID") == Header_Id).ToList();
                //if (RESULT.Count() > 0)
                //{
                if (Root.Tables[2].Select("CHECK_ID='" + Header_Id + "'").Count() > 0)
                {
                    foreach (DataRow DR in Root.Tables[2].Select("CHECK_ID='" + Header_Id + "'").CopyToDataTable().Rows)
                    {
                        if (Convert.ToString(DR["TRANSACTION_TYPE_CODE"]).ToLower() != "TENDER_REFUND".ToLower() && Convert.ToString(DR["TENDER_TYPE_CODE"]) != "")
                        {
                            DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                            DR_PAYMENT["CHECK_ID"] = Header_Id;
                            DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["TRANSACTION_ID"];
                            DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["TENDER_TYPE_DESC"];
                            DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["TENDER_TYPE_DESC"];
                            DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToString(DR["TRANSACTION_TYPE_CODE"]).ToLower() == "TENDER".ToLower() ? Convert.ToDecimal(DR["TENDER_AMOUNT"]) : 0;
                            DR_PAYMENT["TIPS"] = Root.Tables[2].AsEnumerable().Where(p => p.Field<string>("TRANSACTION_TYPE_CODE") == "TIPS" && p.Field<string>("TRANSACTION_ID") == Convert.ToString(DR["TRANSACTION_ID"])).Count() > 0 ?
                                Convert.ToDecimal(Root.Tables[2].AsEnumerable().Where(p => p.Field<string>("TRANSACTION_TYPE_CODE") == "TIPS" && p.Field<string>("TRANSACTION_ID") == Convert.ToString(DR["TRANSACTION_ID"])).Select(p => p.Field<string>("TENDER_AMOUNT")).FirstOrDefault()) :
                                0;


                            //DR_PAYMENT["TIPS"] = Convert.ToString(DR["TRANSACTION_TYPE_CODE"]).ToLower() == "TIPS".ToLower() ? Convert.ToDecimal(DR["TENDER_AMOUNT"]) : 0;
                            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                        }
                        else if (Convert.ToString(DR["TRANSACTION_TYPE_CODE"]).ToLower() == "TENDER_REFUND".ToLower())
                        {
                            DataRow DR_PAYMENT = _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                            DR_PAYMENT["CHECK_ID"] = Header_Id;
                            DR_PAYMENT["PAYMENT_METHOD_ID"] = DR["TRANSACTION_ID"];
                            DR_PAYMENT["PAYMENT_METHOD_CODE"] = DR["TENDER_TYPE_DESC"];
                            DR_PAYMENT["PAYMENT_METHOD_DESC"] = DR["TENDER_TYPE_DESC"];
                            DR_PAYMENT["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(DR["TENDER_AMOUNT"]) * -1;
                            DR_PAYMENT["TIPS"] = 0;
                            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(DR_PAYMENT);
                        }
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
        DataTable FillDiscounts(DataSet Root, string Header_Id, Cashup _ICashUp)
        {
            try
            {
                var RESULT = Root.Tables[1].AsEnumerable().Where(p => p.Field<string>("TRANSACTION_TYPE_CODE") == "DISC_ITEM" && p.Field<string>("CHECK_ID") == Header_Id && p.Field<decimal>("DEDUCTION") != 0).GroupBy(x => x.Field<string>("CHECK_ID")).Select(x => x.First()).ToList();
                if (RESULT.Count() > 0)
                {
                    foreach (DataRow DR in RESULT.CopyToDataTable().Rows)
                    {
                        if (Convert.ToDecimal(Root.Tables[1].Select("CHECK_ID='" + DR["CHECK_ID"].ToString() + "' and TRANSACTION_TYPE_CODE='DISC_ITEM'").CopyToDataTable().Compute("SUM(DEDUCTION)", string.Empty)) != 0)
                        {
                            string DISCOUNT_REASON = string.Empty;
                            List<string> UNIQUES = null;
                            if (Root.Tables[1].Select("CHECK_ID='" + DR["CHECK_ID"].ToString() + "' and TRANSACTION_TYPE_CODE='DISC_ITEM' and DEDUCTION <>0").Count() > 0)
                            {
                                foreach (DataRow dr in Root.Tables[1].Select("CHECK_ID='" + DR["CHECK_ID"].ToString() + "' and TRANSACTION_TYPE_CODE='DISC_ITEM'  and DEDUCTION <>0").CopyToDataTable().Rows)
                                {
                                    DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                                    DR_DISCOUNT["CHECK_ID"] = DR["CHECK_ID"].ToString();
                                    DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DEDUCTION_CODE"]);
                                    DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = dr["DEDUCTION_DESC"].ToString();
                                    DR_DISCOUNT["DISCOUNT_AMOUNT"] = Convert.ToDecimal(dr["DEDUCTION"]);//.ToString().Tables[1].Select("CHECK_ID='" + DR["CHECK_ID"].ToString() + "' and TRANSACTION_TYPE_CODE='DISC_ITEM'").CopyToDataTable().Compute("SUM(DEDUCTION)", string.Empty); //Convert.ToDecimal(DR["DEDUCTION"]); 
                                    DR_DISCOUNT["STAFF_ID"] = Convert.ToString(DR["TAB_OWNER_DESC"]);
                                    DR_DISCOUNT["STAFF_NAME"] = Convert.ToString(DR["TAB_OWNER_DESC"]);
                                    _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);

                                    //if (dr["DEDUCTION_DESC"].ToString() != "")
                                    //    DISCOUNT_REASON += dr["DEDUCTION_DESC"] + ",";
                                }
                            }

                            //DataRow DR_DISCOUNT = _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                            //DR_DISCOUNT["CHECK_ID"] = DR["CHECK_ID"].ToString();
                            //DR_DISCOUNT["DISCOUNT_ID"] = Convert.ToString(DR["DEDUCTION_CODE"]);

                            //UNIQUES = null;
                            //UNIQUES = DISCOUNT_REASON.Length > 0 ? DISCOUNT_REASON.Remove(DISCOUNT_REASON.Length - 1).Split(',').Reverse().Distinct().Take(2).Reverse().ToList() : null;

                            //DR_DISCOUNT["DISCOUNT_DESCRIPTION"] = DISCOUNT_REASON.Length == 0 ? (object)DBNull.Value : string.Join(",", UNIQUES);
                            //DR_DISCOUNT["DISCOUNT_AMOUNT"] = Root.Tables[1].Select("CHECK_ID='" + DR["CHECK_ID"].ToString() + "' and TRANSACTION_TYPE_CODE='DISC_ITEM'").CopyToDataTable().Compute("SUM(DEDUCTION)", string.Empty); //Convert.ToDecimal(DR["DEDUCTION"]); 
                            //DR_DISCOUNT["STAFF_ID"] = Convert.ToString(DR["TAB_OWNER_DESC"]);
                            //DR_DISCOUNT["STAFF_NAME"] = Convert.ToString(DR["TAB_OWNER_DESC"]);
                            //_ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(DR_DISCOUNT);
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
