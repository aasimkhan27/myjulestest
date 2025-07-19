using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.FOODICS
{
    public class Foodic_Models
    {
        public class Datum
        {
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public string reference { get; set; }
            public int? type { get; set; }
            public object latitude { get; set; }
            public object longitude { get; set; }
            public object phone { get; set; }
            public string opening_from { get; set; }
            public string opening_to { get; set; }
            public string inventory_end_of_day_time { get; set; }
            public string receipt_header { get; set; }
            public string receipt_footer { get; set; }
            public Settings settings { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public bool receives_online_orders { get; set; }
            public bool accepts_reservations { get; set; }
            public int? reservation_duration { get; set; }
            public string reservation_times { get; set; }
            public object address { get; set; }
            public List<object> ingredients { get; set; }
            public string sku { get; set; }
            public object barcode { get; set; }
            public object description { get; set; }
            public object description_localized { get; set; }
            public object image { get; set; }
            public bool is_active { get; set; }
            public bool is_stock_product { get; set; }
            public bool is_non_revenue { get; set; }
            public bool is_ready { get; set; }
            public int? pricing_method { get; set; }
            public int? selling_method { get; set; }
            public int? costing_method { get; set; }
            public object preparation_time { get; set; }
            public int? price { get; set; }
            public decimal? cost { get; set; }
            public decimal? calories { get; set; }
            public Meta meta { get; set; }
            public string code { get; set; }
            public bool auto_open_drawer { get; set; }
            public int? index { get; set; }
            public List<TaxGroup> tax_groups { get; set; }
            public int rate { get; set; }
            public List<object> inactive_in_order_types { get; set; }
            public string app_id { get; set; }
            public string promotion_id { get; set; }
            public int? discount_type { get; set; }
            public string reference_x { get; set; }
            public int? number { get; set; }
            public int? source { get; set; }
            public int? status { get; set; }
            public int? delivery_status { get; set; }
            public int? guests { get; set; }
            public string kitchen_notes { get; set; }
            public string customer_notes { get; set; }
            public DateTime? business_date { get; set; }
            public decimal? subtotal_price { get; set; }
            public decimal? discount_amount { get; set; }
            public decimal? rounding_amount { get; set; }
            public decimal? total_price { get; set; }
            public decimal? tax_exclusive_discount_amount { get; set; }
            public string delay_in_seconds { get; set; }
            public DateTime? opened_at { get; set; }
            public DateTime? accepted_at { get; set; }
            public DateTime? due_at { get; set; }
            public DateTime? driver_assigned_at { get; set; }
            public DateTime? dispatched_at { get; set; }
            public DateTime? driver_collected_at { get; set; }
            public DateTime? delivered_at { get; set; }
            public DateTime? closed_at { get; set; }
            public int? check_number { get; set; }
            public List<object> branches { get; set; }
            public TaxGroup tax_group { get; set; }
            public List<object> price_tags { get; set; }
            public Modifier modifier { get; set; }
            public Branch branch { get; set; }
            public string promotion { get; set; }
            public object original_order { get; set; }
            public Table table { get; set; }
            public Creator creator { get; set; }
            public Closer closer { get; set; }
            public string driver { get; set; }
            public Customer customer { get; set; }
            public object customer_address { get; set; }
            public Discount discount { get; set; }
            public List<object> tags { get; set; }
            public object coupon { get; set; }
            public object gift_card { get; set; }
            public List<object> charges { get; set; }
            public List<Payment> payments { get; set; }
            public List<Product> products { get; set; }
            public List<object> combos { get; set; }
            public Device device { get; set; }
            public int qualification { get; set; }
            public decimal? amount { get; set; }
            public decimal? minimum_product_price { get; set; }
            public decimal? minimum_order_price { get; set; }
            public decimal? maximum_amount { get; set; }
            public bool is_percentage { get; set; }
            public bool is_taxable { get; set; }
            public List<int> order_types { get; set; }
            public bool associate_to_all_branches { get; set; }
            public bool include_modifiers { get; set; }
        }
        public class Device
        {
            public string id { get; set; }
            public string name { get; set; }
            public string code { get; set; }
            public string reference { get; set; }
            public int type { get; set; }
        }
        public class Discount
        {
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public int? qualification { get; set; }
            public int? amount { get; set; }
            public decimal? minimum_product_price { get; set; }
            public decimal? minimum_order_price { get; set; }
            public int maximum_amount { get; set; }
            public bool is_percentage { get; set; }
            public bool is_taxable { get; set; }
            public List<int> order_types { get; set; }
            public object reference { get; set; }
            public bool associate_to_all_branches { get; set; }
            public bool include_modifiers { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }

        }
        public class Links
        {
            public string first { get; set; }
            public string last { get; set; }
            public object prev { get; set; }
            public object next { get; set; }
        }
        public class Meta
        {
            public int current_page { get; set; }
            public int from { get; set; }
            public int last_page { get; set; }
            public IList<Link> links { get; set; }
            public string path { get; set; }
            public int per_page { get; set; }
            public int to { get; set; }
            public int total { get; set; }
            public Foodics foodics { get; set; }
        }
        public class Link
        {
            public Uri Url { get; set; }
            public string Label { get; set; }
            public bool Active { get; set; }
        }
        public class Settings
        {
            public string branch_tax_number { get; set; }
            public List<object> sa_zatca_branch_address { get; set; }
            public bool? display_background_image { get; set; }
            public string branch_commercial_registration_number { get; set; }
        }
        public class Pivot
        {
            public string tax_id { get; set; }
            public string tax_group_id { get; set; }
            public decimal? amount { get; set; }
            public decimal? rate { get; set; }
            public decimal? tax_exclusive_discount_amount { get; set; }
        }
        public class TaxGroup
        {
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public string reference { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public Pivot pivot { get; set; }
        }
        public class Foodics
        {
            public string device_id { get; set; }
            public bool auto_closed { get; set; }
            public List<ProductsKitchen> products_kitchen { get; set; }
            public DateTime? kitchen_received_at { get; set; }
            public DateTime? business_date_in_utc { get; set; }
            public PrintingStatus printing_status { get; set; }
            public string void_approver_id { get; set; }
            public string uuid { get; set; }
        }
        public class PrintingStatus
        {
            public string model { get; set; }
            public string status { get; set; }
        }
        public class ProductsKitchen
        {
            public string uuid { get; set; }
            public List<object> kitchen_times { get; set; }
            public DateTime? kitchen_sent_at { get; set; }
        }
        public class Modifier
        {
            public string id { get; set; }
            public string name { get; set; }
            public object name_localized { get; set; }
            public bool is_ready { get; set; }
            public string reference { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public string deleted_at { get; set; }
        }
        public class Branch
        {
            public string id { get; set; }
            public string name { get; set; }
            public object name_localized { get; set; }
            public string reference { get; set; }
            public int type { get; set; }
            public object latitude { get; set; }
            public object longitude { get; set; }
            public object phone { get; set; }
            public string opening_from { get; set; }
            public string opening_to { get; set; }
            public string inventory_end_of_day_time { get; set; }
            public object receipt_header { get; set; }
            public object receipt_footer { get; set; }
            public Settings settings { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public bool receives_online_orders { get; set; }
            public bool accepts_reservations { get; set; }
            public int reservation_duration { get; set; }
            public object reservation_times { get; set; }
            public object address { get; set; }
        }
        public class Category
        {
            public string id { get; set; }
            public string name { get; set; }
            public object name_localized { get; set; }
            public string reference { get; set; }
            public string image { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
        }
        public class Closer
        {
            public string pin { get; set; }
            public bool is_owner { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public object number { get; set; }
            public string email { get; set; }
            public object phone { get; set; }
            public string lang { get; set; }
            public bool display_localized_names { get; set; }
            public bool email_verified { get; set; }
            public bool must_use_fingerprint { get; set; }
            public string last_console_login_at { get; set; }
            public object last_cashier_login_at { get; set; }
            public bool associate_to_all_branches { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public bool two_factor_auth_enabled { get; set; }
        }
        public class Customer
        {
            public string id { get; set; }
            public string name { get; set; }
            public int dial_code { get; set; }
            public string phone { get; set; }
            public object email { get; set; }
            public object gender { get; set; }
            public object birth_date { get; set; }
            public bool is_blacklisted { get; set; }
            public bool is_house_account_enabled { get; set; }
            public object house_account_limit { get; set; }
            public bool is_loyalty_enabled { get; set; }
            public int order_count { get; set; }
            public string last_order_at { get; set; }
            public object notes { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
        }
        public class Creator
        {
            public string pin { get; set; }
            public bool is_owner { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public object number { get; set; }
            public string email { get; set; }
            public object phone { get; set; }
            public string lang { get; set; }
            public bool display_localized_names { get; set; }
            public bool email_verified { get; set; }
            public bool must_use_fingerprint { get; set; }
            public string last_console_login_at { get; set; }
            public object last_cashier_login_at { get; set; }
            public bool associate_to_all_branches { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public bool two_factor_auth_enabled { get; set; }
        }
        public class ModifierOption
        {
            public List<object> ingredients { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public string sku { get; set; }
            public bool is_active { get; set; }
            public int? costing_method { get; set; }
            public decimal? price { get; set; }
            public decimal? cost { get; set; }
            public decimal? calories { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public int? index { get; set; }
        }
        public class Option
        {
            public ModifierOption modifier_option { get; set; }
            public List<object> taxes { get; set; }
            public string id { get; set; }
            public decimal? quantity { get; set; }
            public decimal? partition { get; set; }
            public decimal? unit_price { get; set; }
            public decimal? total_price { get; set; }
            public decimal? total_cost { get; set; }
            public decimal? tax_exclusive_unit_price { get; set; }
            public decimal? tax_exclusive_total_price { get; set; }
            public decimal? tax_exclusive_discount_amount { get; set; }
            public DateTime? added_at { get; set; }
        }
        public class Payment
        {
            public User user { get; set; }
            public PaymentMethod payment_method { get; set; }
            public List<object> meta { get; set; }
            public string id { get; set; }
            public decimal? amount { get; set; }
            public decimal? tendered { get; set; }
            public decimal? tips { get; set; }
            public DateTime? business_date { get; set; }
            public DateTime? added_at { get; set; }
        }
        public class PaymentMethod
        {
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public int? type { get; set; }
            public string code { get; set; }
            public bool auto_open_drawer { get; set; }
            public bool is_active { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public int index { get; set; }
        }
        public class Product
        {
            public Product2 product { get; set; }
            public object promotion { get; set; }
            public object discount { get; set; }
            public List<Option> options { get; set; }
            public List<Taxis> taxes { get; set; }
            public List<object> timed_events { get; set; }
            public VoidReason void_reason { get; set; }
            public Creator creator { get; set; }
            public Voider voider { get; set; }
            public string id { get; set; }
            public object discount_type { get; set; }
            public decimal ? quantity { get; set; }
            public decimal ? returned_quantity { get; set; }
            public decimal ? unit_price { get; set; }
            public decimal ? discount_amount { get; set; }
            public decimal ? total_price { get; set; }
            public decimal ? total_cost { get; set; }
            public decimal ? tax_exclusive_discount_amount { get; set; }
            public decimal? tax_exclusive_unit_price { get; set; }
            public decimal? tax_exclusive_total_price { get; set; }
            public int? status { get; set; }
            public int? is_ingredients_wasted { get; set; }
            public object delay_in_seconds { get; set; }
            public string kitchen_notes { get; set; }
            public Meta meta { get; set; }
            public DateTime? added_at { get; set; }
            public DateTime? closed_at { get; set; }
        }
        public class Product2
        {
            public Category category { get; set; }
            public List<object> ingredients { get; set; }
            public string id { get; set; }
            public string sku { get; set; }
            public object barcode { get; set; }
            public string name { get; set; }
            public object name_localized { get; set; }
            public string description { get; set; }
            public string description_localized { get; set; }
            public string image { get; set; }
            public bool is_active { get; set; }
            public bool is_stock_product { get; set; }
            public bool is_non_revenue { get; set; }
            public bool is_ready { get; set; }
            public int? pricing_method { get; set; }
            public int? selling_method { get; set; }
            public int? costing_method { get; set; }
            public string preparation_time { get; set; }
            public decimal? price { get; set; }
            public decimal? cost { get; set; }
            public decimal? calories { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public DateTime? meta { get; set; }
        }
        public class Section
        {
            public string id { get; set; }
            public string name { get; set; }
            public object name_localized { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
        }
        public class Table
        {
            public Section section { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public int? status { get; set; }
            public int? seats { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public bool accepts_reservations { get; set; }
        }
        public class Taxis
        {
            public Pivot pivot { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public decimal? rate { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public List<object> inactive_in_order_types { get; set; }
        }
        public class User
        {
            public string pin { get; set; }
            public bool is_owner { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public object number { get; set; }
            public string email { get; set; }
            public object phone { get; set; }
            public string lang { get; set; }
            public bool display_localized_names { get; set; }
            public bool email_verified { get; set; }
            public bool must_use_fingerprint { get; set; }
            public string last_console_login_at { get; set; }
            public object last_cashier_login_at { get; set; }
            public bool associate_to_all_branches { get; set; }
            public string created_at { get; set; }
            public string updated_at { get; set; }
            public object deleted_at { get; set; }
            public bool two_factor_auth_enabled { get; set; }
        }
        public class Voider
        {
            public string pin { get; set; }
            public bool is_owner { get; set; }
            public string id { get; set; }
            public string name { get; set; }
            public string number { get; set; }
            public string email { get; set; }
            public string phone { get; set; }
            public string lang { get; set; }
            public bool display_localized_names { get; set; }
            public bool email_verified { get; set; }
            public bool must_use_fingerprint { get; set; }
            public DateTime? last_console_login_at { get; set; }
            public DateTime? last_cashier_login_at { get; set; }
            public bool associate_to_all_branches { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
            public bool two_factor_auth_enabled { get; set; }
        }
        public class VoidReason
        {
            public string id { get; set; }
            public int? type { get; set; }
            public string name { get; set; }
            public string name_localized { get; set; }
            public DateTime? created_at { get; set; }
            public DateTime? updated_at { get; set; }
            public DateTime? deleted_at { get; set; }
        }


        public class Root_Discounts
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }





        public class Root_Branches
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Products
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Categories
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_PaymentMethods
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Taxes
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Orders
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Modifires
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Reasons
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
        public class Root_Modifier_Options
        {
            public List<Datum> data { get; set; }
            public Links links { get; set; }
            public Meta meta { get; set; }
        }
    }
}
