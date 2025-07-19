using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels;

namespace EPOS_Integration.EPOS_SALES
{
    class Epos_Sales_Datatables
    {
        public DataTable Create_DataTable_Header()
        {
            DataTable DATATABLE_EPOS_SALES_HEADER = new DataTable();
            DataColumn COLUMN = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CHECK_NO", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("OPEN_TIME", typeof(DateTime)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CLOSE_TIME", typeof(DateTime)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("COVERS", typeof(int)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("REVENUE_CENTRE_CODE", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("REVENUE_CENTRE_DESC", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SERVE_MODE", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TAX", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("GROSS", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("COMP", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VOID", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TIPS", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SERVICE_CHARGE", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DONATION", typeof(decimal)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CURRENCY", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("IS_TRAINING", typeof(bool)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("INTEGRATION_SYSTEM_ID", typeof(int)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_ID", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_EPOS_SALES_HEADER.Columns.Add(COLUMN);
            return DATATABLE_EPOS_SALES_HEADER;
        }
        public DataTable Create_DataTable_Line()
        {
            DataTable DATATABLE_EPOS_SALES_LINES = new DataTable();
            DataColumn COLUMN = new DataColumn("CHECK_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("REVENUE_CENTER_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("REVENUE_CENTER", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ACCOUNT_GROUP_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ACCOUNT_GROUP_CODE", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("ACCOUNT_GROUP_NAME", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_CODE", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("CATEGORY_NAME", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PRODUCT_SKU", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PRODUCT_NAME", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("QUANITY", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("NET", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TAX", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("GROSS", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("COMP", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VOID", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TIME_OF_SALE", typeof(DateTime)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_NAME", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VOID_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("VOID_REASON", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_ID", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_REASON", typeof(string)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_RATE", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TAX_RATE", typeof(decimal)); DATATABLE_EPOS_SALES_LINES.Columns.Add(COLUMN);
            return DATATABLE_EPOS_SALES_LINES;
        }
        public DataTable Create_DataTable_Payment()
        {
            DataTable EPOS_SALES_PAYMENTS = new DataTable();
            DataColumn COLUMN = new DataColumn("CHECK_ID", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_ID", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_CODE", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_DESC", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_AMOUNT_WITH_TIPS", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TIPS", typeof(decimal)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            return EPOS_SALES_PAYMENTS;
        }
        public DataTable Create_DataTable_Kobas_Payment()
        {
            DataTable EPOS_SALES_PAYMENTS = new DataTable();
            DataColumn COLUMN = new DataColumn("CHECK_ID", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_ID", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_CODE", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("PAYMENT_METHOD_DESC", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TOTAL_AMOUNT_WITH_TIPS", typeof(string)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("TIPS", typeof(decimal)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            COLUMN = new DataColumn("SERVICE_CHARGE", typeof(decimal)); EPOS_SALES_PAYMENTS.Columns.Add(COLUMN);
            return EPOS_SALES_PAYMENTS;
        }
        public DataTable Create_DataTable_Discount()
        {
            DataTable EPOS_SALES_DISCOUNT = new DataTable();
            DataColumn COLUMN = new DataColumn("CHECK_ID", typeof(string)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_ID", typeof(string)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_DESCRIPTION", typeof(string)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("DISCOUNT_AMOUNT", typeof(decimal)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_ID", typeof(string)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            COLUMN = new DataColumn("STAFF_NAME", typeof(string)); EPOS_SALES_DISCOUNT.Columns.Add(COLUMN);
            return EPOS_SALES_DISCOUNT;
        }

    }
}
