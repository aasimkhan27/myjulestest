using App_Repository;
using EPOS_Integration.EPOS_SALES;
using System;
using System.Data;
using System.Linq;
using Utility;
using ViewModels;

namespace EPOS_Integration.BasicAuth
{
    public class EPOS_SALES_ALOHA<T>
    {
        public CashupModel CashupModelObj { get; set; }

        public CashupModel Transform_AlohaData(T data, decimal integrationSystemId, Cashup cashup, DataTable integrationDt)
        {
            var eposSalesDatatable = new Epos_Sales_Datatables();
            cashup.CashupModelObj.EPOS_SALES_HEADER = eposSalesDatatable.Create_DataTable_Header();
            cashup.CashupModelObj.EPOS_SALES_LINES = eposSalesDatatable.Create_DataTable_Line();
            cashup.CashupModelObj.EPOS_SALES_PAYMENTS = eposSalesDatatable.Create_DataTable_Payment();
            cashup.CashupModelObj.EPOS_SALES_DISCOUNTS = eposSalesDatatable.Create_DataTable_Discount();

            try
            {
                var sqData = data as DataSet;
                FillHeader(sqData, cashup);
            }
            catch (Exception ex)
            {
                cashup.CashupModelObj.EPOS_SALES_HEADER = eposSalesDatatable.Create_DataTable_Header();
                cashup.CashupModelObj.EPOS_SALES_LINES = eposSalesDatatable.Create_DataTable_Line();
                cashup.CashupModelObj.EPOS_SALES_PAYMENTS = eposSalesDatatable.Create_DataTable_Payment();
                cashup.CashupModelObj.EPOS_SALES_DISCOUNTS = eposSalesDatatable.Create_DataTable_Discount();

                var errorMessage = $"Exception -Transform_SQUIRELL - start_date:-{cashup.CashupModelObj.CASHUP_START_DATE} , end_date:-{cashup.CashupModelObj.CASHUP_END_DATE} , ID:-{integrationDt.Rows[0]["ID"]} , BRANCH_ID:-{integrationDt.Rows[0]["BRANCH_ID"]}--{ex}";
                LogExceptions.LogError("Transform_SQUIRELL - SQUIRELL", errorMessage, ex);
                cashup.CashupModelObj.INTEGRATION_STATUS = 3;
                cashup.CashupModelObj.ERROR_MESSAGE = errorMessage;
                throw;
            }
            return cashup.CashupModelObj;
        }

        private void FillHeader(DataSet root, Cashup cashup)
        {
            var headers = root.Tables[0].Select("TRAINING<>true");

            foreach (var header in headers)
            {
                var headerSourceSystemId = Convert.ToDecimal(header["HEADER_SOURCE_SYSTEM_ID"]);
                FillLines(root, headerSourceSystemId, cashup);
                var salesLine = cashup.CashupModelObj.EPOS_SALES_LINES.Copy();

                if (salesLine.Select($"CHECK_ID='{headerSourceSystemId}'").Any())
                {
                    var headerRow = cashup.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                    headerRow["CHECK_ID"] = headerSourceSystemId;
                    headerRow["CHECK_NO"] = Convert.ToInt32(header["PRINTEDCHECKID"]);
                    headerRow["OPEN_TIME"] = GetFirstSaleTime(salesLine, headerSourceSystemId);
                    headerRow["CLOSE_TIME"] = GetLastSaleTime(salesLine, headerSourceSystemId);
                    headerRow["COVERS"] = header["GUESTS_COUNT"];
                    headerRow["REVENUE_CENTRE_CODE"] = header["REVENUECENTER_ID"];
                    headerRow["REVENUE_CENTRE_DESC"] = header["REVENUECENTER_LABEL"];
                    headerRow["SERVE_MODE"] = GetServeMode(root, headerSourceSystemId);

                    var net = GetTotal(salesLine, headerSourceSystemId, "NET");
                    var tax = GetTotal(salesLine, headerSourceSystemId, "TAX");
                    var gross = GetTotal(salesLine, headerSourceSystemId, "GROSS");
                    var discount = GetTotal(salesLine, headerSourceSystemId, "DISCOUNT");
                    var voidTotal = GetTotal(salesLine, headerSourceSystemId, "VOID");

                    headerRow["NET"] = net;
                    headerRow["TAX"] = tax;
                    headerRow["GROSS"] = gross;
                    headerRow["DISCOUNT"] = discount;
                    headerRow["COMP"] = 0;
                    headerRow["VOID"] = voidTotal > 0 ? -voidTotal : voidTotal;
                    headerRow["TIPS"] = GetTips(root, headerSourceSystemId);
                    headerRow["SERVICE_CHARGE"] = GetServiceCharge(root, headerSourceSystemId);
                    headerRow["DONATION"] = 0;
                    headerRow["CURRENCY"] = DBNull.Value;
                    headerRow["IS_TRAINING"] = header["TRAINING"];
                    headerRow["INTEGRATION_SYSTEM_ID"] = cashup.CashupModelObj.INTEGRATION_SYSTEM_ID;
                    headerRow["STAFF_ID"] = DBNull.Value;
                    headerRow["STAFF_NAME"] = DBNull.Value;
                    cashup.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(headerRow);

                    FillPayments(root, headerSourceSystemId, cashup);
                    FillDiscounts(root, headerSourceSystemId, cashup, salesLine);
                }
            }
        }

        private decimal GetTotal(DataTable salesLines, decimal headerId, string columnName)
        {
            if (salesLines.Select($"CHECK_ID='{headerId}'").Length > 0)
            {
                return Convert.ToDecimal(salesLines.Select($"CHECK_ID='{headerId}'").CopyToDataTable().Compute($"SUM({columnName})", string.Empty));
            }
            return 0;
        }

        private DateTime GetFirstSaleTime(DataTable salesLine, decimal headerId)
        {
            return salesLine.Select($"CHECK_ID='{headerId}'").OrderBy(p => p.Field<DateTime>("TIME_OF_SALE")).FirstOrDefault().Field<DateTime>("TIME_OF_SALE");
        }

        private DateTime GetLastSaleTime(DataTable salesLine, decimal headerId)
        {
            return salesLine.Select($"CHECK_ID='{headerId}'").OrderBy(p => p.Field<DateTime>("TIME_OF_SALE")).LastOrDefault().Field<DateTime>("TIME_OF_SALE");
        }

        private string GetServeMode(DataSet root, decimal headerId)
        {
            var orderMode = root.Tables[1].Select($"HEADER_SOURCE_SYSTEM_ID={headerId}").FirstOrDefault()?["ORDERMODE_LABEL"].ToString().ToLower();

            switch (orderMode)
            {
                case "c&c":
                case "eat in":
                    return "Eat In";
                case "clic collec":
                case "order":
                case "rush order":
                case "send":
                case "web order":
                    return "Delivery";
                case "take away":
                    return "Take Away";
                default:
                    return string.Empty;
            }
        }

        private decimal GetTips(DataSet root, decimal headerId)
        {
            return root.Tables[4].Select($"HEADER_SOURCE_SYSTEM_ID={headerId}").Sum(p => p.Field<decimal>("TIP"));
        }

        private decimal GetServiceCharge(DataSet root, decimal headerId)
        {
            return root.Tables[3].Select($"HEADER_SOURCE_SYSTEM_ID={headerId} AND TYPEID<>1 AND TYPEID<>4").Sum(p => p.Field<decimal>("AMOUNT"));
        }

        private void FillLines(DataSet root, decimal headerId, Cashup cashup)
        {
            var lines = (from al in root.Tables[1].AsEnumerable().Where(x => x.Field<decimal>("HEADER_SOURCE_SYSTEM_ID") == headerId)
                         join alc in root.Tables[2].AsEnumerable().Where(x => x.Field<string>("TYPE") == "sales") on al.Field<decimal>("LINE_SOURCE_SYSTEM_ID") equals alc.Field<decimal>("LINE_SOURCE_SYSTEM_ID")
                         select new { AL = al, CategoryName = alc.Field<string>("TYPE") == "sales" ? alc.Field<string>("NAME") : "Uncategorised", ALC = alc }).ToList();

            foreach (var line in lines)
            {
                var lineRow = cashup.CashupModelObj.EPOS_SALES_LINES.NewRow();
                lineRow["CHECK_ID"] = Convert.ToInt32(line.AL.Field<decimal>("HEADER_SOURCE_SYSTEM_ID"));

                var totalDiscountCoupon = root.Tables[8].Select($"ALOHA_LINE_SOURCE_SYSTEM_ID={line.AL["LINE_SOURCE_SYSTEM_ID"]} AND TYPE=4").Sum(p => p.Field<decimal>("AMOUNT"));
                var sourceId = Convert.ToDecimal(line.AL["LINE_SOURCE_SYSTEM_ID"]);
                var isLinked = root.Tables[8].Select($"ALOHA_LINE_SOURCE_SYSTEM_ID = {sourceId} AND TYPE <> 0 AND TYPE <> 7").Any();
                var asu = isLinked ? root.Tables[3].Select($"HEADER_SOURCE_SYSTEM_ID={headerId} AND TYPEID<>0 AND TYPEID<>7").Sum(p => p.Field<decimal>("RATE")) : 0;
                var voidEntry = root.Tables[8].Select($"ALOHA_LINE_SOURCE_SYSTEM_ID={line.AL.Field<decimal>("LINE_SOURCE_SYSTEM_ID")} AND TYPE=3").FirstOrDefault();

                lineRow["REVENUE_CENTER_ID"] = root.Tables[0].Select($"HEADER_SOURCE_SYSTEM_ID={headerId}").FirstOrDefault()?["REVENUECENTER_ID"] ?? DBNull.Value;
                lineRow["REVENUE_CENTER"] = root.Tables[0].Select($"HEADER_SOURCE_SYSTEM_ID={headerId}").FirstOrDefault()?["REVENUECENTER_LABEL"] ?? DBNull.Value;
                lineRow["ACCOUNT_GROUP_ID"] = Convert.ToInt32(line.ALC.Field<decimal>("LINE_CAT_SOURCE_SYSTEM_ID"));
                lineRow["ACCOUNT_GROUP_CODE"] = line.CategoryName;
                lineRow["ACCOUNT_GROUP_NAME"] = line.CategoryName;
                lineRow["CATEGORY_ID"] = Convert.ToInt32(line.ALC.Field<decimal>("LINE_CAT_SOURCE_SYSTEM_ID"));
                lineRow["CATEGORY_CODE"] = line.CategoryName;
                lineRow["CATEGORY_NAME"] = line.CategoryName;
                lineRow["PRODUCT_SKU"] = Convert.ToInt32(line.AL.Field<decimal>("TYPEID"));
                lineRow["PRODUCT_NAME"] = line.AL.Field<string>("LABEL");
                lineRow["QUANITY"] = string.IsNullOrEmpty(line.AL["ORDERMODE_ID"].ToString()) ? 0 : Convert.ToDecimal(line.AL["QUANTITY"]);
                lineRow["NET"] = Convert.ToDecimal(line.AL["NETAMOUNT"]);
                lineRow["TAX"] = Convert.ToDecimal(line.AL["NETAMOUNT"]) * asu;
                lineRow["GROSS"] = Convert.ToDecimal(lineRow["NET"]) + Convert.ToDecimal(lineRow["TAX"]);
                lineRow["DISCOUNT"] = totalDiscountCoupon;
                lineRow["COMP"] = 0;
                lineRow["VOID"] = voidEntry != null ? Convert.ToDecimal(voidEntry["AMOUNT"]) * -1 : 0;
                lineRow["TIME_OF_SALE"] = line.AL["CREATEDON"];
                lineRow["STAFF_ID"] = DBNull.Value;
                lineRow["STAFF_NAME"] = DBNull.Value;
                lineRow["VOID_ID"] = voidEntry?["VOID_SOURCE_SYSTEM_ID"] ?? DBNull.Value;
                lineRow["VOID_REASON"] = GetVoidReason(root, voidEntry?["VOID_SOURCE_SYSTEM_ID"].ToString());

                var discountRate = (Convert.ToDecimal(lineRow["GROSS"]) - Convert.ToDecimal(lineRow["TAX"])) == 0 ? 100 : (Convert.ToDecimal(lineRow["TAX"]) / Convert.ToDecimal(lineRow["GROSS"])) * 100;
                var discount = root.Tables[10].Select($"HEADER_SOURCE_SYSTEM_ID={headerId}").FirstOrDefault();
                lineRow["DISCOUNT_ID"] = discount?["TYPEID"] ?? DBNull.Value;
                lineRow["DISCOUNT_REASON"] = discount?["LABEL"] ?? DBNull.Value;
                lineRow["DISCOUNT_RATE"] = discountRate;
                lineRow["TAX_RATE"] = root.Tables[3].Select($"HEADER_SOURCE_SYSTEM_ID={headerId} and TYPEID<>0").FirstOrDefault()?["RATE"] as decimal? * 100 ?? 0;

                cashup.CashupModelObj.EPOS_SALES_LINES.Rows.Add(lineRow);
            }
        }

        private string GetVoidReason(DataSet root, string voidSourceSystemId)
        {
            if (string.IsNullOrEmpty(voidSourceSystemId)) return DBNull.Value.ToString();
            return root.Tables[11].Select($"VOID_SOURCE_SYSTEM_ID='{voidSourceSystemId}'").FirstOrDefault()?["LABEL"].ToString() ?? string.Empty;
        }

        private void FillPayments(DataSet root, decimal headerId, Cashup cashup)
        {
            var payments = root.Tables[4].Select($"HEADER_SOURCE_SYSTEM_ID={headerId} AND LABEL <>'TIMEOUT'");

            foreach (var payment in payments)
            {
                var paymentRow = cashup.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                paymentRow["CHECK_ID"] = headerId;
                paymentRow["PAYMENT_METHOD_ID"] = payment["TYPEID"];
                paymentRow["PAYMENT_METHOD_CODE"] = payment["LABEL"];
                paymentRow["PAYMENT_METHOD_DESC"] = payment["LABEL"];
                paymentRow["TOTAL_AMOUNT_WITH_TIPS"] = Convert.ToDecimal(payment["TIP"]) + Convert.ToDecimal(payment["AMOUNT"]);
                paymentRow["TIPS"] = Convert.ToDecimal(payment["TIP"]);
                cashup.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(paymentRow);
            }
        }

        private void FillDiscounts(DataSet root, decimal headerId, Cashup cashup, DataTable salesLine)
        {
            var discounts = salesLine.AsEnumerable().Where(p => p.Field<string>("CHECK_ID") == headerId.ToString()).GroupBy(x => x.Field<string>("DISCOUNT_REASON")).Select(x => x.First()).ToList();

            if (discounts.Any() && GetTotal(salesLine, headerId, "DISCOUNT") != 0)
            {
                foreach (var discount in discounts)
                {
                    var discountRow = cashup.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                    discountRow["CHECK_ID"] = headerId;
                    discountRow["DISCOUNT_ID"] = discount["DISCOUNT_ID"];
                    discountRow["DISCOUNT_DESCRIPTION"] = discount["DISCOUNT_REASON"];
                    discountRow["DISCOUNT_AMOUNT"] = GetTotal(salesLine, headerId, "DISCOUNT");
                    discountRow["STAFF_ID"] = DBNull.Value;
                    discountRow["STAFF_NAME"] = DBNull.Value;
                    cashup.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(discountRow);
                }
            }
        }
    }
}
