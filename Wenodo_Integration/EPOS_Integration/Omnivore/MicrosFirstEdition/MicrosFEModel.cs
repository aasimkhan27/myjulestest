using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.Omnivore.MicrosFirstEdition
{
    public class MicrosFEModel
    {
    }
    public class AppliesTo
    {
        public bool item { get; set; }
        public bool ticket { get; set; }
    }

    public class ClockEntries
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Discount
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public object comment { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public int value { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Discount2
    {
        public Links _links { get; set; }
        public AppliesTo applies_to { get; set; }
        public bool available { get; set; }
        public string id { get; set; }
        public object max_amount { get; set; }
        public object max_percent { get; set; }
        public object min_amount { get; set; }
        public object min_percent { get; set; }
        public object min_ticket_total { get; set; }
        public string name { get; set; }
        public bool open { get; set; }
        public string pos_id { get; set; }
        public string type { get; set; }
        public int value { get; set; }
        public string href { get; set; }
    }

    public class Embedded
    {
        public List<Ticket> tickets { get; set; }
        public List<Discount> discounts { get; set; }
        public Employee employee { get; set; }
        public List<Item> items { get; set; }
        public OrderType order_type { get; set; }
        public List<Payment> payments { get; set; }
        public RevenueCenter revenue_center { get; set; }
        public List<ServiceCharge> service_charges { get; set; }
        public List<Item> voided_items { get; set; }
        public Table table { get; set; }
        public Discount discount { get; set; }
        public MenuItem menu_item { get; set; }
        public List<Modifier> modifiers { get; set; }
        //public List<MenuCategory> menu_categories { get; set; }
        public List<PriceLevel> price_levels { get; set; }
        public MenuModifier menu_modifier { get; set; }
        public TenderType tender_type { get; set; }
        public Terminal terminal { get; set; }
        public ItemOrderMode item_order_mode { get; set; }
    }
    public class ItemOrderMode
    {
        public Boolean available { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string pos_id { get; set; }
    }
    public class Ticket_Root
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public int count { get; set; }
        public int limit { get; set; }
    }

    public class Employee
    {
        public Links _links { get; set; }
        public string check_name { get; set; }
        public string email { get; set; }
        public string first_name { get; set; }
        public string id { get; set; }
        public string last_name { get; set; }
        public string login { get; set; }
        public object middle_name { get; set; }
        public object pos_id { get; set; }
        public object start_date { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Item
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public object comment { get; set; }
        public string id { get; set; }
        public object included_tax { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int quantity { get; set; }
        public object seat { get; set; }
        public bool sent { get; set; }
        public int? sent_at { get; set; }
        public int split { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Links
    {
        public Self self { get; set; }
        //   public Discounts discounts { get; set; }
        public MenuItem menu_item { get; set; }
        //    public Modifiers modifiers { get; set; }
        public TenderType tender_type { get; set; }
        public OpenTickets open_tickets { get; set; }
        public Tables tables { get; set; }
        public Employee employee { get; set; }
        //   public Items items { get; set; }
        public OrderType order_type { get; set; }
        //   public Payments payments { get; set; }
        public RevenueCenter revenue_center { get; set; }
        // public ServiceCharges service_charges { get; set; }
        public VoidedItems voided_items { get; set; }
        public Table table { get; set; }
        public Discount discount { get; set; }
        public ClockEntries clock_entries { get; set; }
        public PayRates pay_rates { get; set; }
        public MenuCategories menu_categories { get; set; }
        public OptionSets option_sets { get; set; }
        //   public PriceLevels price_levels { get; set; }
        public MenuModifier menu_modifier { get; set; }
    }

    public class MenuCategories
    {
        public string href { get; set; }
        public string type { get; set; }
        public Links _links { get; set; }
        public string id { get; set; }
        public int level { get; set; }
        public string name { get; set; }
        public string pos_id { get; set; }
    }

    public class MenuItem
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public object barcodes { get; set; }
        public string id { get; set; }
        public object in_stock { get; set; }
        public string name { get; set; }
        public bool open { get; set; }
        public object open_name { get; set; }
        public string pos_id { get; set; }
        public int price_per_unit { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class MenuModifier
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public bool open { get; set; }
        public string pos_id { get; set; }
        public int price_per_unit { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Modifier
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public object comment { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public int quantity { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class OpenTickets
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class OptionSets
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class OrderType
    {
        public Links _links { get; set; }
        public bool available { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string pos_id { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Payment
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public int amount { get; set; }
        public int change { get; set; }
        public object comment { get; set; }
        public object full_name { get; set; }
        public string id { get; set; }
        public object last4 { get; set; }
        public object status { get; set; }
        public int tip { get; set; }
        public string type { get; set; }
        public string href { get; set; }
    }

    public class PayRates
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class PriceLevel
    {
        public Links _links { get; set; }
        public object barcodes { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public int price_per_unit { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class RevenueCenter
    {
        public Links _links { get; set; }
        public bool @default { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string pos_id { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }



    public class Self
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class ServiceCharge
    {
        public Links _links { get; set; }
        public object comment { get; set; }
        public string id { get; set; }
        public object included_tax { get; set; }
        public string name { get; set; }
        public int price { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Table
    {
        public Links _links { get; set; }
        public bool available { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public int number { get; set; }
        public string pos_id { get; set; }
        public int seats { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Tables
    {
        public string href { get; set; }
        public string type { get; set; }
    }

    public class TenderType
    {
        public Links _links { get; set; }
        public bool allows_tips { get; set; }
        public string id { get; set; }
        public string name { get; set; }
        public string pos_id { get; set; }
        public string href { get; set; }
        public string type { get; set; }
    }

    public class Ticket
    {
        public Embedded _embedded { get; set; }
        public Links _links { get; set; }
        public bool auto_send { get; set; }
        public int? closed_at { get; set; }
        public Correlation correlation { get; set; }
        public object fire_date { get; set; }
        public object fire_time { get; set; }
        public int guest_count { get; set; }
        public string id { get; set; }
        public object name { get; set; }
        public bool open { get; set; }
        public int opened_at { get; set; }
        public object pos_id { get; set; }
        public object ready_date { get; set; }
        public object ready_time { get; set; }
        public int ticket_number { get; set; }
        public Totals totals { get; set; }

        public bool @void { get; set; }
    }
    public class Correlation
    {
        public string sequence { get; set; }
        public string source { get; set; }
    }


    public class Terminal
    {
        public int id { get; set; }
        public int name { get; set; }
        public int pos_id { get; set; }
    }
    public class Totals
    {
        public int discounts { get; set; }
        public int due { get; set; }
        public object exclusive_tax { get; set; }
        public object inclusive_tax { get; set; }
        public int items { get; set; }
        public int other_charges { get; set; }
        public int paid { get; set; }
        public int service_charges { get; set; }
        public int sub_total { get; set; }
        public int tax { get; set; }
        public int tips { get; set; }
        public int total { get; set; }
    }

    public class VoidedItems
    {
        public string href { get; set; }
        public string type { get; set; }
    }

}
