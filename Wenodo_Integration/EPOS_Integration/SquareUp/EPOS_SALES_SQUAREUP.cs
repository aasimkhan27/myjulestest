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

namespace EPOS_Integration.SquareUp
{
   public  class EPOS_SALES_SQUAREUP<T>
    {
        public CashupModel CashupModelObj { get; set; }

        public CashupModel Transform_SquareupData(T data, decimal Integration_System_ID, Cashup _ICashUp, DataTable Integration_Dt)
        {
            var epos_Sales_Datatable = new Epos_Sales_Datatables();
            _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
            _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
            _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
            _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

            try
            {
                var dsData = data as DataSet;
                if (dsData?.Tables.Count > 1 && dsData.Tables[0].Rows.Count > 0 && dsData.Tables[1].Rows.Count > 0)
                {
                    _ICashUp.CashupModelObj.EPOS_SALES_HEADER = FillHeader(dsData, _ICashUp);
                }
            }
            catch (Exception ex)
            {
                _ICashUp.CashupModelObj.EPOS_SALES_HEADER = epos_Sales_Datatable.Create_DataTable_Header();
                _ICashUp.CashupModelObj.EPOS_SALES_LINES = epos_Sales_Datatable.Create_DataTable_Line();
                _ICashUp.CashupModelObj.EPOS_SALES_PAYMENTS = epos_Sales_Datatable.Create_DataTable_Payment();
                _ICashUp.CashupModelObj.EPOS_SALES_DISCOUNTS = epos_Sales_Datatable.Create_DataTable_Discount();

                var errorMessage = $"Exception -Transform_SquareupData - start_date:-{_ICashUp.CashupModelObj.CASHUP_START_DATE} , end_date:-{_ICashUp.CashupModelObj.CASHUP_END_DATE} , ID:-{Integration_Dt.Rows[0]["ID"]} , BRANCH_ID:-{Integration_Dt.Rows[0]["BRANCH_ID"]}--{ex}";
                LogExceptions.LogError("Transform_SquareupData - SQUAREUP", errorMessage, ex);
                _ICashUp.CashupModelObj.INTEGRATION_STATUS = 3;
                _ICashUp.CashupModelObj.ERROR_MESSAGE = errorMessage;
                throw;
            }
            return _ICashUp.CashupModelObj;
        }

        private DataTable FillHeader(DataSet sqDataset, Cashup cashup)
        {
            var headers = sqDataset.Tables[0].Select("STATE='COMPLETED' or STATE='OPEN'");

            foreach (var header in headers)
            {
                var orderId = header["ORDER_ID"].ToString();
                FillLines(sqDataset, orderId, header["CREATED_AT"].ToString(), cashup);
                var salesLines = cashup.CashupModelObj.EPOS_SALES_LINES.Copy();

                var headerRow = cashup.CashupModelObj.EPOS_SALES_HEADER.NewRow();
                headerRow["CHECK_ID"] = orderId;
                headerRow["CHECK_NO"] = orderId;
                headerRow["OPEN_TIME"] = header["CREATED_AT"].ToString();
                headerRow["CLOSE_TIME"] = header["CLOSED_AT"] == DBNull.Value ? (object)DBNull.Value : header["CLOSED_AT"].ToString();
                headerRow["COVERS"] = 1;
                headerRow["REVENUE_CENTRE_CODE"] = DBNull.Value;
                headerRow["REVENUE_CENTRE_DESC"] = DBNull.Value;
                headerRow["SERVE_MODE"] = DBNull.Value;

                var tips = GetTips(sqDataset, orderId);
                var serviceCharge = GetServiceCharge(sqDataset, orderId);

                var net = GetTotal(salesLines, orderId, "NET");
                var tax = GetTotal(salesLines, orderId, "TAX");
                var gross = GetTotal(salesLines, orderId, "GROSS");
                var discount = GetTotal(salesLines, orderId, "DISCOUNT");
                var voidTotal = GetTotal(salesLines, orderId, "VOID");

                headerRow["NET"] = net;
                headerRow["TAX"] = tax;
                headerRow["GROSS"] = gross;
                headerRow["DISCOUNT"] = discount;
                headerRow["COMP"] = 0;
                headerRow["VOID"] = voidTotal;
                headerRow["TIPS"] = tips;
                headerRow["SERVICE_CHARGE"] = serviceCharge;
                headerRow["DONATION"] = 0;
                headerRow["CURRENCY"] = header["CURRENCY"];
                headerRow["IS_TRAINING"] = false;
                headerRow["INTEGRATION_SYSTEM_ID"] = cashup.CashupModelObj.INTEGRATION_SYSTEM_ID;
                headerRow["STAFF_ID"] = DBNull.Value;
                headerRow["STAFF_NAME"] = DBNull.Value;
                cashup.CashupModelObj.EPOS_SALES_HEADER.Rows.Add(headerRow);

                FillPayments(sqDataset, orderId, cashup);
                FillDiscounts(sqDataset, orderId, cashup);
            }
            return cashup.CashupModelObj.EPOS_SALES_HEADER;
        }

        private decimal GetTotal(DataTable salesLines, string orderId, string columnName)
        {
            if (salesLines.Select($"CHECK_ID='{orderId}'").Length > 0)
            {
                return Convert.ToDecimal(salesLines.Select($"CHECK_ID='{orderId}'").CopyToDataTable().Compute($"SUM({columnName})", string.Empty));
            }
            return 0;
        }

        private decimal GetTips(DataSet sqDataset, string orderId)
        {
            var tips = (from t0 in sqDataset.Tables[0].AsEnumerable()
                        join t1 in sqDataset.Tables[2].AsEnumerable() on t0.Field<string>("ORDER_ID") equals t1.Field<string>("ORDER_ID")
                        where t0.Field<string>("STATE") == "COMPLETED" && t1.Field<string>("STATUS") == "COMPLETED" && t1.Field<string>("ORDER_ID") == orderId
                        select t1.Field<decimal?>("TIP_MONEY") ?? 0).Sum();

            return tips / 100;
        }

        private decimal GetServiceCharge(DataSet sqDataset, string orderId)
        {
            var serviceCharge = (from t0 in sqDataset.Tables[0].AsEnumerable()
                                 where (t0.Field<string>("STATE") == "COMPLETED" || t0.Field<string>("STATE") == "OPEN") && t0.Field<string>("ORDER_ID") == orderId
                                 select t0.Field<decimal>("NET_SERVICE_CHARGE_MONEY")).Sum();

            return serviceCharge / 100;
        }

        private void FillLines(DataSet root, string headerId, string createdAt, Cashup cashup)
        {
            var lines = root.Tables[1].Select($"ORDER_ID='{headerId}'");
            if (lines.Length == 0) return;

            foreach (var line in lines)
            {
                var lineRow = cashup.CashupModelObj.EPOS_SALES_LINES.NewRow();
                lineRow["CHECK_ID"] = headerId;
                lineRow["REVENUE_CENTER_ID"] = DBNull.Value;
                lineRow["REVENUE_CENTER"] = DBNull.Value;

                var category = GetCategory(root, headerId, line["UID"].ToString());
                lineRow["ACCOUNT_GROUP_ID"] = category.Id;
                lineRow["ACCOUNT_GROUP_CODE"] = category.Name;
                lineRow["ACCOUNT_GROUP_NAME"] = category.Name;
                lineRow["CATEGORY_ID"] = category.Id;
                lineRow["CATEGORY_CODE"] = category.Name;
                lineRow["CATEGORY_NAME"] = category.Name;

                lineRow["PRODUCT_SKU"] = line["CATALOG_OBJECT_ID"].ToString();
                lineRow["PRODUCT_NAME"] = line["NAME"].ToString();

                var quantity = Convert.ToDecimal(line["QUANTITY"]);
                var isReturn = !string.IsNullOrEmpty(line["SOURCE_LINE_ITEM_UID"].ToString());
                lineRow["QUANITY"] = isReturn ? -quantity : quantity;

                var grossAmount = isReturn ? (Convert.ToDecimal(line["GROSS_RETURN_MONEY"]) - Convert.ToDecimal(line["TOTAL_DISCOUNT_MONEY"])) / 100 : Convert.ToDecimal(line["GROSS_SALES_MONEY"]) / 100;
                var tax = Convert.ToDecimal(line["TOTAL_TAX_MONEY"]) / 100;
                var net = grossAmount - tax;
                var discountAmount = Convert.ToDecimal(line["TOTAL_DISCOUNT_MONEY"]) / 100;

                lineRow["NET"] = isReturn ? -net : net;
                lineRow["TAX"] = isReturn ? -tax : tax;
                lineRow["GROSS"] = isReturn ? -grossAmount : grossAmount;
                lineRow["DISCOUNT"] = isReturn ? -discountAmount : discountAmount;
                lineRow["COMP"] = 0;
                lineRow["VOID"] = isReturn ? -(Convert.ToDecimal(line["GROSS_RETURN_MONEY"]) - tax) / 100 : 0;
                lineRow["TIME_OF_SALE"] = createdAt;
                lineRow["STAFF_ID"] = DBNull.Value;
                lineRow["STAFF_NAME"] = DBNull.Value;
                lineRow["VOID_ID"] = isReturn ? "" : (object)DBNull.Value;
                lineRow["VOID_REASON"] = isReturn ? "" : (object)DBNull.Value;

                var discount = GetDiscount(root, headerId);
                lineRow["DISCOUNT_ID"] = discount.Id;
                lineRow["DISCOUNT_REASON"] = discount.Reason;
                lineRow["DISCOUNT_RATE"] = discountAmount == 0 ? 0 : (discountAmount / (grossAmount + discountAmount)) * 100;
                lineRow["TAX_RATE"] = line["TAX_PERCENTAGE"] == DBNull.Value || string.IsNullOrEmpty(line["TAX_PERCENTAGE"].ToString()) ? 0 : Convert.ToDecimal(line["TAX_PERCENTAGE"]);

                cashup.CashupModelObj.EPOS_SALES_LINES.Rows.Add(lineRow);
            }
        }

        private (string Id, string Name) GetCategory(DataSet root, string headerId, string lineUid)
        {
            var category = (from t1 in root.Tables[1].AsEnumerable()
                            join t4 in root.Tables[4].AsEnumerable() on t1.Field<string>("CATEGORY_ID") equals t4.Field<string>("CATEGORY_ID")
                            where t1.Field<string>("ORDER_ID") == headerId && t1.Field<string>("UID") == lineUid
                            select new
                            {
                                Id = t4.Field<string>("CATEGORY_DATA_NAME") == "Uncategorised" ? "000000000000000000000000" : t4.Field<string>("CATEGORY_ID"),
                                Name = t4.Field<string>("CATEGORY_DATA_NAME")
                            }).FirstOrDefault();

            return category != null ? (category.Id, category.Name) : (string.Empty, string.Empty);
        }

        private (string Id, string Reason) GetDiscount(DataSet root, string headerId)
        {
            var discount = (from d in root.Tables[3].AsEnumerable()
                            where d.Field<string>("ORDER_ID") == headerId
                            select new
                            {
                                Id = d.Field<string>("UID"),
                                Reason = d.Field<string>("NAME")
                            }).FirstOrDefault();

            return discount != null ? (discount.Id, discount.Reason) : (DBNull.Value.ToString(), DBNull.Value.ToString());
        }

        private void FillPayments(DataSet root, string headerId, Cashup cashup)
        {
            var payments = root.Tables[2].Select($"ORDER_ID='{headerId}' AND STATUS='COMPLETED'");
            if (payments.Length == 0) return;

            foreach (var payment in payments)
            {
                var paymentRow = cashup.CashupModelObj.EPOS_SALES_PAYMENTS.NewRow();
                paymentRow["CHECK_ID"] = headerId;
                paymentRow["PAYMENT_METHOD_ID"] = payment["PAYMENT_ID"] == DBNull.Value ? (object)DBNull.Value : payment["PAYMENT_ID"];
                paymentRow["PAYMENT_METHOD_CODE"] = payment["CARD_BRAND"] == DBNull.Value ? (object)DBNull.Value : payment["CARD_BRAND"];
                paymentRow["PAYMENT_METHOD_DESC"] = payment["SOURCE_TYPE"] == DBNull.Value ? (object)DBNull.Value : payment["SOURCE_TYPE"];

                var amountMoney = payment["AMOUNT_MONEY"] == DBNull.Value ? 0 : Convert.ToDecimal(payment["AMOUNT_MONEY"]);
                var refundAmount = payment["REFUND_AMOUNT"] == DBNull.Value ? 0 : Convert.ToDecimal(payment["REFUND_AMOUNT"]);
                var tipMoney = payment["TIP_MONEY"] == DBNull.Value ? 0 : Convert.ToDecimal(payment["TIP_MONEY"]);

                paymentRow["TOTAL_AMOUNT_WITH_TIPS"] = (amountMoney - refundAmount + tipMoney) / 100;
                paymentRow["TIPS"] = tipMoney / 100;

                cashup.CashupModelObj.EPOS_SALES_PAYMENTS.Rows.Add(paymentRow);
            }
        }

        private void FillDiscounts(DataSet root, string headerId, Cashup cashup)
        {
            var discounts = root.Tables[3].Select($"ORDER_ID='{headerId}'");
            if (discounts.Length == 0) return;

            foreach (var discount in discounts)
            {
                var appliedMoney = Convert.ToDecimal(discount["APPLIED_MONEY"]) / 100;
                if (appliedMoney == 0) continue;

                var discountRow = cashup.CashupModelObj.EPOS_SALES_DISCOUNTS.NewRow();
                discountRow["CHECK_ID"] = headerId;
                discountRow["DISCOUNT_ID"] = discount["UID"] ?? (object)DBNull.Value;
                discountRow["DISCOUNT_DESCRIPTION"] = discount["NAME"];
                discountRow["DISCOUNT_AMOUNT"] = appliedMoney;
                discountRow["STAFF_ID"] = DBNull.Value;
                discountRow["STAFF_NAME"] = DBNull.Value;

                cashup.CashupModelObj.EPOS_SALES_DISCOUNTS.Rows.Add(discountRow);
            }
        }
    }
}
