using App_Repository;
using EPOS_Integration.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;
//using EPOS_Integration.Omnivore.MicrosFirstEdition.MicrosFEModel;
namespace EPOS_Integration.Omnivore.MicrosFirstEdition
{
    public class MicrosFE
    {
        string LSURL = string.Empty;
        string AccessToken = string.Empty;
        DataTable DATATABLE_OMNIVORE_TICKETS()
        {
            DataTable DATATABLE_OMNIVORE_TICKETS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("AUTO_SEND", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CLOSED_AT", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SEQUENCE", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SOURCE", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIRE_DATE", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FIRE_TIME", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GUEST_COUNT", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPEN", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OPENED_AT", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("POS_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("READY_DATE", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("READY_TIME", typeof(DateTime)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_NUMBER", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNTS", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DUE", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EXCLUSIVE_TAX", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INCLUSIVE_TAX", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEMS", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("OTHER_CHARGES", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAID", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERVICE_CHARGES", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SUB_TOTAL", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIPS", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TOTAL", typeof(decimal)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VOID", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHECK_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMPLOYEE_EMAIL", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("EMPLOYEE_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE_AVAILABLE", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_TYPE_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_CENTER_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("REVENUE_DEFAULT", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_NUMBER", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TABLE_SEATS", typeof(int)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TERMINAL_ID", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TERMINAL_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKETS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKETS_TYPE;
        }
        DataTable DATATABL_OMNIVORE_TICKET_ITEMS()
        {
            DataTable DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("COMMENT", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INCLUDED_TAX", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SENT", typeof(int)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SENT_AT", typeof(DateTime)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SPLIT", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VOIDED", typeof(int)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("APPROVING_EMPLOYEE", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_MODE_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ORDER_MODE_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MENU_ITEM_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MENU_ITEM_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE;
        }
        DataTable DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER()
        {
            DataTable DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("COMMENT", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM_MODIFIER_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("QUANTITY", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER;
        }
        DataTable DATATABLE_OMNIVORE_TICKET_PAYMENTS()
        {
            DataTable DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("AMOUNT", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CHANGE", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("COMMENT", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("FULL_NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PAYMENT_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("LAST4", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TIP", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE;
        }
        DataTable DATATABLE_OMNIVORE_TICKET_DISCOUNTS()
        {
            DataTable DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("COMMENT", typeof(string)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISCOUNT_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VALUE", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE_ID", typeof(int)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("ITEM_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE;
        }
        DataTable DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES()
        {
            DataTable DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("COMMENT", typeof(string)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SERVICE_CHARGE_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INCLUDED_TAX", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TICKET_ID", typeof(string)); DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES.Columns.Add(COLUMN_HEADER);
            return DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES;
        }
        DataTable LSL_GROUP_MASTER()
        {
            DataTable LSL_GROUP_MASTER_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("GROUP_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SEQUENCE", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE", typeof(bool)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CATEGORY_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SHORTCUT_CATEGORY", typeof(bool)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TYPE_ID", typeof(int)); LSL_GROUP_MASTER_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_GROUP_MASTER_TYPE;
        }
        DataTable LSL_PRODUCT_LIST()
        {
            DataTable LSL_PRODUCT_LIST_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("VISIBLE", typeof(int)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("KITCHEN_IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("CFD_IMAGE_LOCATION", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_PRICE", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_TYPE", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("SKU", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DELIVERY_TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("TAKE_AWAY_TAX_CLASS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("STOCK_AMOUNT", typeof(decimal)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("GROUP_IDS", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INFO", typeof(string)); LSL_PRODUCT_LIST_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_LIST_TYPE;
        }
        DataTable LSL_PRODUCT_ADDITIONS()
        {
            DataTable LSL_PRODUCT_ADDITIONS_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("PRODUCT_ADDITION_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DISPLAY_NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MULTI_SELECT", typeof(bool)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MIN_SELECTED_AMOUNT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("MAX_SELECTED_AMOUNT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_ADDITIONS_TYPE;
        }
        DataTable LSL_PRODUCT_ADDITIONS_VALUES()
        {
            DataTable LSL_PRODUCT_ADDITIONS_VALUES_TYPE = new DataTable();
            DataColumn COLUMN_HEADER = new DataColumn("VALUES_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("NAME", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE", typeof(decimal)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRICE_WITHOUT_VAT", typeof(decimal)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("INFO", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PLU", typeof(string)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("DEFAULT", typeof(bool)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            COLUMN_HEADER = new DataColumn("PRODUCT_ADDITION_ID", typeof(int)); LSL_PRODUCT_ADDITIONS_VALUES_TYPE.Columns.Add(COLUMN_HEADER);
            return LSL_PRODUCT_ADDITIONS_VALUES_TYPE;
        }

        DataSet FetchReceiptDataByDate(string Start_date, string End_date, DataTable dtIntegrationData, DataTable dt)
        {
            try
            {
                DateTime epochtime = new DateTime(1970, 1, 1, 0, 0, 0, 0); //from start epoch time
                DataSet DS_RECEIPT = new DataSet();
                DataTable DATATABLE_OMNIVORE_TICKETS_TYPE = DATATABLE_OMNIVORE_TICKETS();
                DataTable DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE = DATATABL_OMNIVORE_TICKET_ITEMS();
                DataTable DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE = DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER();
                DataTable DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE = DATATABLE_OMNIVORE_TICKET_PAYMENTS();
                DataTable DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE = DATATABLE_OMNIVORE_TICKET_DISCOUNTS();
                DataTable DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES_TYPE = DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES();
                Dictionary<string, string> bodyParameter = new Dictionary<string, string>();
                AccessToken = Convert.ToString(dtIntegrationData.Rows[0]["API_KEY"]);
                string URL = Convert.ToString(dtIntegrationData.Rows[0]["URL_PATH"]);
                int AMOUNT = 100;
                int OFFSET = 0;
                IList<Ticket_Root> obj = new List<Ticket_Root>();
                //for (int i = 0; i < 100000; i++)
                //{
                Item items = new Item();
                items = new Item();
                OFFSET = 1 * AMOUNT;
                var JsonResult = JsonUrlReturn_fy(Start_date, End_date, AccessToken, URL, dtIntegrationData, dt, AMOUNT, OFFSET);
                Ticket_Root root_LSeriesobj = JsonConvert.DeserializeObject<Ticket_Root>(JsonResult.ToString());
                //}
                var aembedded = root_LSeriesobj._embedded;
                foreach (var FE_HEADER in aembedded.tickets)
                {
                    var Ticketlevel2 = FE_HEADER._embedded;
                    // foreach (var MFE_ITEM in Ticketlevel2.items)
                    // {
                    DataRow DR_HEADER = DATATABLE_OMNIVORE_TICKETS_TYPE.NewRow();
                    DR_HEADER["AUTO_SEND"] = FE_HEADER.auto_send ? 1 : 0;
                    if (FE_HEADER.closed_at == null)
                    {
                        DR_HEADER["CLOSED_AT"] = DBNull.Value;
                    }
                    else
                    {
                        DR_HEADER["CLOSED_AT"] = epochtime.AddSeconds(Convert.ToDouble(FE_HEADER.closed_at));
                        //FE_HEADER.closed_at
                    }
                    DR_HEADER["SEQUENCE"] = FE_HEADER.correlation != null ? FE_HEADER.correlation.sequence : "";
                    DR_HEADER["SOURCE"] = FE_HEADER.correlation != null ? FE_HEADER.correlation.source : "";
                    if (FE_HEADER.fire_date == null)
                    {
                        DR_HEADER["FIRE_DATE"] = DBNull.Value;
                    }
                    else
                    {
                        DR_HEADER["FIRE_DATE"] = FE_HEADER.fire_date;
                    }
                    if (FE_HEADER.fire_time == null)
                    {
                        DR_HEADER["FIRE_TIME"] = DBNull.Value;
                    }
                    else
                    {
                        DR_HEADER["FIRE_TIME"] = FE_HEADER.fire_time;
                    }
                    DR_HEADER["GUEST_COUNT"] = FE_HEADER.guest_count;
                    DR_HEADER["TICKET_ID"] = FE_HEADER.id;
                    DR_HEADER["NAME"] = FE_HEADER.name;
                    DR_HEADER["OPEN"] = FE_HEADER.open ? 1 : 0;
                    DR_HEADER["OPENED_AT"] = epochtime.AddSeconds(Convert.ToDouble(FE_HEADER.opened_at)); //add the seconds to the start DateTime;
                    DR_HEADER["POS_ID"] = FE_HEADER.pos_id;
                    if (FE_HEADER.ready_date == null)
                    {
                        DR_HEADER["READY_DATE"] = DBNull.Value;
                    }
                    else
                    {
                        DR_HEADER["READY_DATE"] = epochtime.AddSeconds(Convert.ToDouble(FE_HEADER.ready_date));
                        //FE_HEADER.ready_date;
                    }
                    if (FE_HEADER.ready_time == null)
                    {
                        DR_HEADER["READY_TIME"] = DBNull.Value;
                    }
                    else
                    {
                        DR_HEADER["READY_TIME"] = epochtime.AddSeconds(Convert.ToDouble(FE_HEADER.ready_time));

                            //FE_HEADER.ready_time;
                    }
                    DR_HEADER["TICKET_NUMBER"] = FE_HEADER.ticket_number;
                    DR_HEADER["DISCOUNTS"] = FE_HEADER.totals.discounts;
                    DR_HEADER["DUE"] = FE_HEADER.totals.due;
                    DR_HEADER["EXCLUSIVE_TAX"] = FE_HEADER.totals.exclusive_tax == null ? DBNull.Value : FE_HEADER.totals.exclusive_tax;
                    DR_HEADER["INCLUSIVE_TAX"] = FE_HEADER.totals.inclusive_tax == null ? DBNull.Value : FE_HEADER.totals.inclusive_tax;
                    DR_HEADER["ITEMS"] = FE_HEADER.totals.items;
                    DR_HEADER["OTHER_CHARGES"] = FE_HEADER.totals.other_charges;
                    DR_HEADER["PAID"] = FE_HEADER.totals.paid;
                    DR_HEADER["SERVICE_CHARGES"] = FE_HEADER.totals.service_charges;
                    DR_HEADER["SUB_TOTAL"] = FE_HEADER.totals.sub_total;
                    DR_HEADER["TAX"] = FE_HEADER.totals.tax;
                    DR_HEADER["TIPS"] = FE_HEADER.totals.tips;
                    DR_HEADER["TOTAL"] = FE_HEADER.totals.total;
                    DR_HEADER["VOID"] = FE_HEADER.@void ? 1 : 0;
                    DR_HEADER["CHECK_NAME"] = FE_HEADER._embedded.employee.check_name;
                    DR_HEADER["EMPLOYEE_EMAIL"] = FE_HEADER._embedded.employee.email;
                    DR_HEADER["EMPLOYEE_ID"] = FE_HEADER._embedded.employee.id;
                    DR_HEADER["ORDER_TYPE_AVAILABLE"] = FE_HEADER._embedded.order_type.available;
                    DR_HEADER["ORDER_TYPE_ID"] = FE_HEADER._embedded.order_type.id;
                    DR_HEADER["ORDER_TYPE_NAME"] = FE_HEADER._embedded.order_type.name;
                    DR_HEADER["REVENUE_CENTER_ID"] = FE_HEADER._embedded.revenue_center.id;
                    DR_HEADER["REVENUE_NAME"] = FE_HEADER._embedded.revenue_center.name;
                    DR_HEADER["REVENUE_DEFAULT"] = FE_HEADER._embedded.revenue_center.@default ? 1 : 0;
                    if (FE_HEADER._embedded.table != null)
                    {
                        DR_HEADER["TABLE_ID"] = FE_HEADER._embedded.table.id;
                        DR_HEADER["TABLE_NAME"] = FE_HEADER._embedded.table.name;
                        DR_HEADER["TABLE_NUMBER"] = FE_HEADER._embedded.table.number;
                        DR_HEADER["TABLE_SEATS"] = FE_HEADER._embedded.table.seats;
                    }
                    else
                    {
                        DR_HEADER["TABLE_ID"] = DBNull.Value;
                        DR_HEADER["TABLE_NAME"] = DBNull.Value;
                        DR_HEADER["TABLE_NUMBER"] = DBNull.Value;
                        DR_HEADER["TABLE_SEATS"] = DBNull.Value;
                    }
                    if (FE_HEADER._embedded.terminal != null)
                    {
                        DR_HEADER["TERMINAL_ID"] = FE_HEADER._embedded.terminal.id;
                        DR_HEADER["TERMINAL_NAME"] = FE_HEADER._embedded.terminal.name;
                    }
                    else
                    {
                        DR_HEADER["TERMINAL_ID"] = DBNull.Value;
                        DR_HEADER["TERMINAL_NAME"] = DBNull.Value;
                    }
                    DATATABLE_OMNIVORE_TICKETS_TYPE.Rows.Add(DR_HEADER);
                    foreach (var MFE__PAYMENT in FE_HEADER._embedded.discounts)
                    {
                        DataRow DR_DISCOUNTS = DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.NewRow();
                        DR_DISCOUNTS["COMMENT"] = MFE__PAYMENT.comment;
                        DR_DISCOUNTS["DISCOUNT_ID"] = MFE__PAYMENT.id;
                        DR_DISCOUNTS["NAME"] = MFE__PAYMENT.name;
                        DR_DISCOUNTS["VALUE"] = MFE__PAYMENT.value;
                        DR_DISCOUNTS["TYPE_ID"] = 1;
                        DR_DISCOUNTS["TICKET_ID"] = FE_HEADER.id;
                        DR_DISCOUNTS["ITEM_ID"] = DBNull.Value;
                        DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Rows.Add(DR_DISCOUNTS);
                    }

                    foreach (var MFE_ITEM in Ticketlevel2.items)
                    {
                        DataRow DR_ITEM = DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.NewRow();
                        DR_ITEM["COMMENT"] = MFE_ITEM.comment;
                        DR_ITEM["ITEM_ID"] = MFE_ITEM.id;
                        DR_ITEM["INCLUDED_TAX"] = MFE_ITEM.included_tax == null ? DBNull.Value : MFE_ITEM.included_tax;
                        DR_ITEM["NAME"] = MFE_ITEM.name;
                        DR_ITEM["PRICE"] = MFE_ITEM.price;
                        DR_ITEM["QUANTITY"] = MFE_ITEM.quantity;
                        DR_ITEM["SENT"] = MFE_ITEM.sent ? 1 : 0;
                        if (MFE_ITEM.sent_at == null)
                        {
                            DR_ITEM["SENT_AT"] = DBNull.Value;
                        }
                        else
                        {
                            DR_ITEM["SENT_AT"] = epochtime.AddSeconds(Convert.ToDouble(MFE_ITEM.sent_at));

                            //MFE_ITEM.sent_at;
                        }
                        DR_ITEM["SPLIT"] = MFE_ITEM.split;

                        DR_ITEM["VOIDED"] = 0;
                        DR_ITEM["APPROVING_EMPLOYEE"] = "";

                        if (MFE_ITEM._embedded.item_order_mode != null)
                        {
                            DR_ITEM["ORDER_MODE_ID"] = MFE_ITEM._links.order_type;
                            DR_ITEM["ORDER_MODE_NAME"] = MFE_ITEM._links.order_type;
                        }
                        else
                        {
                            DR_ITEM["ORDER_MODE_ID"] = "";
                            DR_ITEM["ORDER_MODE_NAME"] = "";
                        }
                        if (MFE_ITEM._embedded.menu_item != null)
                        {

                            DR_ITEM["MENU_ITEM_ID"] = MFE_ITEM._embedded.menu_item.id;
                            DR_ITEM["MENU_ITEM_NAME"] = MFE_ITEM._embedded.menu_item.name;
                        }
                        else
                        {
                            DR_ITEM["MENU_ITEM_ID"] = "";
                            DR_ITEM["MENU_ITEM_NAME"] = "";
                        }
                        DR_ITEM["TICKET_ID"] = FE_HEADER.id;
                        DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Rows.Add(DR_ITEM);
                        foreach (var modifiers in MFE_ITEM._embedded.modifiers)
                        {
                            DataRow DR_MODIFIERS = DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE.NewRow();
                            DR_MODIFIERS["COMMENT"] = modifiers.comment;
                            DR_MODIFIERS["ITEM_MODIFIER_ID"] = modifiers.id;
                            DR_MODIFIERS["NAME"] = modifiers.name;
                            DR_MODIFIERS["PRICE"] = modifiers.price;
                            DR_MODIFIERS["QUANTITY"] = modifiers.quantity;
                            DR_MODIFIERS["ITEM_ID"] = MFE_ITEM.id;
                            DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE.Rows.Add(DR_MODIFIERS);
                        }

                        foreach (var MFE__PAYMENT in MFE_ITEM._embedded.discounts)
                        {
                            DataRow DR_DISCOUNTS = DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.NewRow();
                            DR_DISCOUNTS["COMMENT"] = MFE__PAYMENT.comment;
                            DR_DISCOUNTS["DISCOUNT_ID"] = MFE__PAYMENT.id;
                            DR_DISCOUNTS["NAME"] = MFE__PAYMENT.name;
                            DR_DISCOUNTS["VALUE"] = MFE__PAYMENT.value;
                            DR_DISCOUNTS["TYPE_ID"] = 2;
                            DR_DISCOUNTS["TICKET_ID"] = DBNull.Value;
                            DR_DISCOUNTS["ITEM_ID"] = MFE_ITEM.id;
                            DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Rows.Add(DR_DISCOUNTS);
                        }
                    }
                    if (Ticketlevel2.voided_items != null)
                    {
                        foreach (var MFE_ITEM in Ticketlevel2.voided_items)
                        {
                            DataRow DR_ITEM = DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.NewRow();
                            DR_ITEM["COMMENT"] = MFE_ITEM.comment;
                            DR_ITEM["ITEM_ID"] = MFE_ITEM.id;
                            DR_ITEM["INCLUDED_TAX"] = MFE_ITEM.included_tax == null ? DBNull.Value : MFE_ITEM.included_tax;
                            DR_ITEM["NAME"] = MFE_ITEM.name;
                            DR_ITEM["PRICE"] = MFE_ITEM.price;
                            DR_ITEM["QUANTITY"] = MFE_ITEM.quantity;
                            DR_ITEM["SENT"] = MFE_ITEM.sent ? 1 : 0;
                            if (MFE_ITEM.sent_at == null)
                            {
                                DR_ITEM["SENT_AT"] = DBNull.Value;
                            }
                            else
                            {
                                DR_ITEM["SENT_AT"] = epochtime.AddSeconds(Convert.ToDouble(MFE_ITEM.sent_at));

                                //MFE_ITEM.sent_at;
                            }
                            DR_ITEM["SPLIT"] = MFE_ITEM.split;

                            DR_ITEM["VOIDED"] = 1;
                            DR_ITEM["APPROVING_EMPLOYEE"] = MFE_ITEM._embedded.employee.check_name;

                            if (MFE_ITEM._embedded.item_order_mode != null)
                            {
                                DR_ITEM["ORDER_MODE_ID"] = MFE_ITEM._links.order_type;
                                DR_ITEM["ORDER_MODE_NAME"] = MFE_ITEM._links.order_type;
                            }
                            else
                            {
                                DR_ITEM["ORDER_MODE_ID"] = "";
                                DR_ITEM["ORDER_MODE_NAME"] = "";
                            }
                            if (MFE_ITEM._embedded.menu_item != null)
                            {

                                DR_ITEM["MENU_ITEM_ID"] = MFE_ITEM._embedded.menu_item.id;
                                DR_ITEM["MENU_ITEM_NAME"] = MFE_ITEM._embedded.menu_item.name;
                            }
                            else
                            {
                                DR_ITEM["MENU_ITEM_ID"] = "";
                                DR_ITEM["MENU_ITEM_NAME"] = "";
                            }
                            DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE.Rows.Add(DR_ITEM);
                            foreach (var modifiers in MFE_ITEM._embedded.modifiers)
                            {
                                DataRow DR_MODIFIERS = DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE.NewRow();
                                DR_MODIFIERS["COMMENT"] = modifiers.comment;
                                DR_MODIFIERS["ITEM_MODIFIER_ID"] = modifiers.id;
                                DR_MODIFIERS["NAME"] = modifiers.name;
                                DR_MODIFIERS["PRICE"] = modifiers.price;
                                DR_MODIFIERS["QUANTITY"] = modifiers.quantity;
                                DR_MODIFIERS["ITEM_ID"] = MFE_ITEM.id;
                                DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE.Rows.Add(DR_MODIFIERS);
                            }

                            foreach (var MFE__PAYMENT in MFE_ITEM._embedded.discounts)
                            {
                                DataRow DR_DISCOUNTS = DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.NewRow();
                                DR_DISCOUNTS["COMMENT"] = MFE__PAYMENT.id;
                                DR_DISCOUNTS["DISCOUNT_ID"] = MFE__PAYMENT.type;
                                DR_DISCOUNTS["NAME"] = MFE__PAYMENT.type;
                                DR_DISCOUNTS["VALUE"] = MFE__PAYMENT.type;
                                DR_DISCOUNTS["TYPE_ID"] = 2;
                                DR_DISCOUNTS["TICKET_ID"] = DBNull.Value;
                                DR_DISCOUNTS["ITEM_ID"] = MFE_ITEM.id;
                                DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE.Rows.Add(DR_DISCOUNTS);
                            }
                        }
                    }

                    foreach (var MFE_PAYMENT in Ticketlevel2.payments)
                    {
                        DataRow DR_PAYMENT = DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.NewRow();
                        DR_PAYMENT["AMOUNT"] = MFE_PAYMENT.amount;
                        DR_PAYMENT["CHANGE"] = MFE_PAYMENT.change;
                        DR_PAYMENT["COMMENT"] = MFE_PAYMENT.comment;
                        DR_PAYMENT["FULL_NAME"] = MFE_PAYMENT.full_name;
                        DR_PAYMENT["PAYMENT_ID"] = MFE_PAYMENT.id;
                        DR_PAYMENT["LAST4"] = MFE_PAYMENT.last4;
                        DR_PAYMENT["TIP"] = MFE_PAYMENT.tip;
                        DR_PAYMENT["TYPE"] = MFE_PAYMENT.type;
                        DR_PAYMENT["TICKET_ID"] = FE_HEADER.id;
                        DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE.Rows.Add(DR_PAYMENT);
                    }


                    foreach (var MFE_SERVICE_CHARGES in Ticketlevel2.service_charges)
                    {
                        DataRow DR_SCT = DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES_TYPE.NewRow();
                        DR_SCT["COMMENT"] = MFE_SERVICE_CHARGES.comment;
                        DR_SCT["SERVICE_CHARGE_ID"] = MFE_SERVICE_CHARGES.id;
                        DR_SCT["INCLUDED_TAX"] = MFE_SERVICE_CHARGES.included_tax==null?DBNull.Value : MFE_SERVICE_CHARGES.included_tax;
                        DR_SCT["NAME"] = MFE_SERVICE_CHARGES.name;
                        DR_SCT["PRICE"] = MFE_SERVICE_CHARGES.price;
                        DR_SCT["TICKET_ID"] = FE_HEADER.id;
                        DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES_TYPE.Rows.Add(DR_SCT);
                    }
                }
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKETS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE);
                DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES_TYPE);
                return DS_RECEIPT;
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("FetchFinancialDataByTime - Omnivore Micros FE- ", ex);
                return null;
                throw;
            }
        }

        public void SaveLSeriesDataToDB(DataTable dt, DataTable dt_IntegrationDetails)
        {
            Cashup Obj = new Cashup();
            foreach (DataRow dr in dt.Rows)
            {
                Obj.CashupModelObj = new CashupModel();
                Obj.CashupModelObj.CASHUP_MAIN_ID = Convert.ToDecimal(dr["ID"]);
                Obj.CashupModelObj.BRANCH_ID = Convert.ToDecimal(dr["BRANCH_ID"]);
                Obj.CashupModelObj.USER_ID = 1;
                //DataTable dt_Session = Obj.GET_SESSION_BY_BRANCH();
                DataTable dt_Session = Common_Methods.GetSessions(Convert.ToDecimal(dr["ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));

                foreach (DataRow dr_session in dt_Session.Rows)
                {
                    if (Convert.ToInt32(dr_session["SESSION_MASTER_ID"]) == 4)
                    {
                        Obj.CashupModelObj.SESSION_ID = Convert.ToDecimal(dr_session["SESSION_MAPPING_ID"]);
                        string Cashup_date = Convert.ToDateTime(dr["CASHUP_DATE"]).ToString("yyyy-MM-dd");
                        string[] SessionStarttimelist = Convert.ToString(dr_session["SESSION_START"]).Split(':');
                        int start_hr = Convert.ToInt32(SessionStarttimelist[0]);
                        string[] SessionEndtimelist = Convert.ToString(dr_session["SESSION_END"]).Split(':');
                        int end_hr = Convert.ToInt32(SessionEndtimelist[0]);
                        int variance = start_hr - end_hr;
                        DateTime Cashup_date_new = DateTime.Now;
                        if (variance == 0 || variance > 0)
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date).AddDays(1);
                        }
                        else
                        {
                            Cashup_date_new = Convert.ToDateTime(Cashup_date);
                        }
                        string Cashup_end = Cashup_date_new.ToString("yyyy-MM-dd");
                        //string Cashup_end = "2022-02-16";
                        string Cashup_end_date = "";
                        string Cashup_start_date = "";
                        int INTEGRATION_STATUS = 0;
                        DataView dv = dt_IntegrationDetails.DefaultView;
                        dv.RowFilter = "BRANCH_ID=" + Convert.ToDecimal(dr["BRANCH_ID"]);
                        DataTable dtIntegrationData = dv.ToTable();
                        DataSet OMNI_FE_DATASET = null;
                        string[] newtime = Cashup_date.Split('-');
                        //DateTime Startdate = new DateTime(Convert.ToInt32(newtime[0]), Convert.ToInt32(newtime[1]), Convert.ToInt32(newtime[2]), Convert.ToInt32(SessionStarttimelist[0]), Convert.ToInt32(SessionStarttimelist[1]), Convert.ToInt32(SessionStarttimelist[2]));
                        //bool value = Startdate.IsDaylightSavingTime();
                        //if (value)
                        //{
                        //    string a = (Convert.ToInt32(SessionStarttimelist[0]) - 1).ToString();
                        //    string time = Convert.ToString(a + ':' + SessionStarttimelist[1] + ':' + SessionStarttimelist[2]);
                        //    Cashup_start_date = Cashup_date + "T" + time;
                        //}
                        //else
                        //{
                        //    Cashup_start_date = Cashup_date + "T" + Convert.ToString(dr_session["SESSION_START"]);
                        //}
                        //string[] CashupEndnewtime = Cashup_end.Split('-');
                        //DateTime EndDatedate = new DateTime(Convert.ToInt32(CashupEndnewtime[0]), Convert.ToInt32(CashupEndnewtime[1]), Convert.ToInt32(CashupEndnewtime[2]), Convert.ToInt32(SessionEndtimelist[0]), Convert.ToInt32(SessionEndtimelist[1]), Convert.ToInt32(SessionEndtimelist[2]));
                        //bool value1 = EndDatedate.IsDaylightSavingTime();
                        //if (value1)
                        //{
                        //    string a = (Convert.ToInt32(SessionEndtimelist[0]) - 1).ToString();
                        //    string time1 = Convert.ToString(a + ':' + SessionEndtimelist[1] + ':' + SessionEndtimelist[2]);
                        //    Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + time1;
                        //}
                        //else
                        //{
                        //    Cashup_end_date = Cashup_date_new.ToString("yyyy-MM-dd") + "T" + Convert.ToString(dr_session["SESSION_END"]);// + "+00:00";    
                        //}
                        #region FetchReceiptDataByDate
                        try
                        {
                            OMNI_FE_DATASET = FetchReceiptDataByDate(Cashup_start_date, Cashup_end_date, dtIntegrationData, dt_IntegrationDetails);
                        }
                        catch (Exception ex)
                        {
                            LogExceptions.LogError("SaveDataToDB -  Omnivor FE - " + Cashup_start_date + " , " + Cashup_end_date + "," + Convert.ToDecimal(dr["ID"]).ToString() + "," + Convert.ToDecimal(dr["BRANCH_ID"]).ToString(), ex);
                        }

                        if (OMNI_FE_DATASET != null)
                        {
                            if (OMNI_FE_DATASET.Tables.Count > 0)
                            {
                                DataSet ds = Obj.GET_CASHUP_BY_ID();
                                INTEGRATION_STATUS = SubmitdataFrom_OM_FE(OMNI_FE_DATASET, Convert.ToDecimal(ds.Tables[0].Rows[0]["CASHUP_MAIN_ID"]), Obj.CashupModelObj.SESSION_ID, Convert.ToDecimal(ds.Tables[0].Rows[0]["INTEGRATION_SYSTEM_ID"]), Convert.ToDecimal(dr["ENTITY_ID"]), Convert.ToDecimal(dr["BRANCH_ID"]));
                            }
                            else
                            {
                                INTEGRATION_STATUS = 3;
                            }

                            Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        else
                        {
                            Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
                        }
                        #endregion
                    }
                }
            }
        }

        int SubmitdataFrom_OM_FE(DataSet DATASETDATA, decimal CashupHeaderID, decimal SessionID, decimal INTEGRATION_SYSTEM_ID, decimal ENTITY_ID, decimal BRANCH_ID)
        {
            try
            {
                //Save Data in Database
                if (DATASETDATA.Tables.Count > 0 && DATASETDATA.Tables[0].Rows.Count > 0 && DATASETDATA.Tables[1].Rows.Count > 0 && DATASETDATA.Tables[2].Rows.Count > 0 && DATASETDATA.Tables[3].Rows.Count > 0)
                {
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKETS_TYPE);
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_ITEMS_TYPE);
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_ITEM_MODIFIER_TYPE);
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_PAYMENTS_TYPE);
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_DISCOUNTS_TYPE);
                //    DS_RECEIPT.Tables.Add(DATATABLE_OMNIVORE_TICKET_SERVICE_CHARGES_TYPE);

                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.CASHUP_MAIN_ID = CashupHeaderID;
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.OMNIVORE_TICKETS = DATASETDATA.Tables[0];
                    _ICashUp.CashupModelObj.OMNIVORE_TICKET_ITEMS_TYPE = DATASETDATA.Tables[1];
                    _ICashUp.CashupModelObj.OMNIVORE_TICKET_ITEM_MODIFIER_TYPE = DATASETDATA.Tables[2];
                    _ICashUp.CashupModelObj.OMNIVORE_TICKET_PAYMENTS_TYPE = DATASETDATA.Tables[3];
                    _ICashUp.CashupModelObj.OMNIVORE_TICKET_DISCOUNTS_TYPE = DATASETDATA.Tables[4];
                    _ICashUp.CashupModelObj.OMNIVORE_TICKET_SERVICE_CHARGES_TYPE = DATASETDATA.Tables[5];
                    _ICashUp.INS_UPD_OMNIVORE_TICKETS();
                    return 2;
                }
                else
                {
                    return 4;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError(" Omnivore Micros FE:- Fail To Saving Data in DB - ", ex);
                return 3;
            }
        }
        int SubmitAllProductWithGroup(DataSet LIGHTSPEED_L_ALL_PRODUCT, DataSet LIGHTSPEED_L_PRODUCT_GROUP, decimal ENTITY_ID, decimal BRANCH_ID)
        {
            try
            {
                //Save Data in Database
                if (LIGHTSPEED_L_ALL_PRODUCT.Tables.Count > 0 && LIGHTSPEED_L_PRODUCT_GROUP.Tables.Count > 0)
                {
                    Cashup _ICashUp = new Cashup();
                    _ICashUp.CashupModelObj = new CashupModel();
                    _ICashUp.CashupModelObj.ENTITY_ID = ENTITY_ID;
                    _ICashUp.CashupModelObj.BRANCH_ID = BRANCH_ID;
                    _ICashUp.CashupModelObj.LSL_GROUP_MASTER = LIGHTSPEED_L_PRODUCT_GROUP.Tables[0];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_LIST = LIGHTSPEED_L_ALL_PRODUCT.Tables[0];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_ADDITIONS = LIGHTSPEED_L_ALL_PRODUCT.Tables[1];
                    _ICashUp.CashupModelObj.LSL_PRODUCT_ADDITIONS_VALUES = LIGHTSPEED_L_ALL_PRODUCT.Tables[2];
                    _ICashUp.INS_UPD_LSL_PRODUCTS();
                    return 1;
                }
                else
                {
                    return 2;
                }
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Omnivore Micros FE Product All:- Fail To Saving Data in DB - ", ex);
                return 3;
            }
        }

        string JsonUrlReturn_fy(string Start_date, string end_date, string AccessToken, string URL, DataTable dtIntegrationData, DataTable dt, int amount, int offset)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Api-Key", AccessToken);
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("JsonUrlReturn_fy - Omnivore Micros FE - ", ex);

            }
            return JsonResult;
        }
        string JsonUrlReturn_getproductgroup(string AccessToken, DataTable dtIntegrationData, string URL, DataTable MainDt)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();

            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Authorization", AccessToken);
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("JsonUrlReturn_getproductgroup - Omnivore Micros FE - ", ex);
            }
            return JsonResult;
        }
        string JsonUrlReturn_getAllproduct(string AccessToken, DataTable dtIntegrationData, string URL, DataTable MainDt, int AMOUNT, int OFFSET)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            WebClient client = new WebClient();
            NameValueCollection obj = new NameValueCollection();
            client.UseDefaultCredentials = true;
            client.Credentials = CredentialCache.DefaultCredentials;
            client.Headers.Add("Authorization", AccessToken);
            obj.Add("amount", AMOUNT.ToString());
            obj.Add("offset", OFFSET.ToString());
            client.QueryString = obj;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var JsonResult = "";
            try
            {
                JsonResult = client.DownloadString(URL);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("JsonUrlReturn_getAllproduct - Omnivore Micros FE - ", ex);

            }
            return JsonResult;
        }


    }
}
