using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.LIGHTSPEED_O_SERIES
{
   public class LO_SeriesModel
    {
    }
    public class Line
    {
        public decimal number { get; set; }
        public string line_id { get; set; }
        public Product product { get; set; }
        public decimal quantity { get; set; }
        public decimal price_variation { get; set; }
        public decimal price_fixed_variation { get; set; }
        public List<decimal> modifiers { get; set; }
        public string notes { get; set; }
        public double unit_price { get; set; }
        public double unit_tax { get; set; }
        public double line_total_ex_tax { get; set; }
        public double line_total_tax { get; set; }
        public List<Taxis> taxes { get; set; }
        public bool part_of_option_set { get; set; }
    }
    public class Method
    {
        public decimal id { get; set; }
        public string name { get; set; }
    }
    public class Option
    {
        public decimal product_id { get; set; }
        public string name { get; set; }
        public double unit_price { get; set; }
        public double unit_tax { get; set; }
        public List<Taxis> taxes { get; set; }
        public decimal line_number { get; set; }
        public List<OptionSet> option_sets { get; set; }
    }
    public class OptionSet
    {
        public string name { get; set; }
        public decimal option_set_id { get; set; }
        public List<Option> options { get; set; }
    }
    public class Payment
    {
        public decimal id { get; set; }
        public decimal number { get; set; }
        public Method method { get; set; }  
        public double amount { get; set; }
        public decimal tip { get; set; }
        public DateTime created_at { get; set; }
        public string @ref { get; set; }
    }
    public class Product
    {
        public decimal id { get; set; }
        public string name { get; set; }
    }
    public class LOS_Root
    {
        public decimal id { get; set; }
        public string sale_number { get; set; }
        public string status { get; set; }
        public string notes { get; set; }
        public double total { get; set; }
        public double paid { get; set; }
        public decimal tips { get; set; }
        public decimal register_id { get; set; }
        public decimal site_id { get; set; }
        public List<Line> lines { get; set; }
        public List<Option> options { get; set; }
        public decimal staff_member_id { get; set; }
        public bool deleted { get; set; }
        public double price_variation { get; set; }
        public decimal price_fixed_variation { get; set; }
        public List<Payment> payments { get; set; }
        public string order_payment_type { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public decimal refunded_order_id { get; set; }
        public string code { get; set; }
    }

    public class LOS_HEADER_Root
    {
        public decimal id { get; set; }
        public string sale_number { get; set; }
        public string status { get; set; }
        public string notes { get; set; }
        public decimal site_id { get; set; }
        public decimal register_id { get; set; }
        public decimal staff_id { get; set; }
        public double total { get; set; }
        public double total_tax { get; set; }
        public double paid { get; set; }
        public bool deleted { get; set; }
        public DateTime created_at { get; set; }
        public DateTime updated_at { get; set; }
        public string order_type { get; set; }
        public bool? is_refund { get; set; }
        public decimal? refunded_order_id { get; set; }
        public string error { get; set; }
        public string error_description { get; set; }
    }


    public class Taxis
    {
        public decimal id { get; set; }
        public string name { get; set; }
        public double rate { get; set; }
    }
    public class Access_token_Root
    {
        public string access_token { get; set; }
        public decimal expires_in { get; set; }
        public string token_type { get; set; }
        public object scope { get; set; }
        public string code { get; set; }
    }

}
