using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace HR_Integration
{
    public class HR_Model
    {
   
        public int USER_ID { get; set; }
        public int ENTITY_ID { get; set; }
        public int TABLE_ID { get; set; }
        public int STATUS_ID { get; set; }
        public int CUSTOMER_ID { get; set; }
        public int CASHUP_MAIN_ID { get; set; }
        public int INTEGRATION_SYSTEM_ID { get; set; }
        public int INTEGRATION_STATUS { get; set; }
        public int INTEGRATION_TYPE_ID { get; set; }
        public int GROUP_ID { get; set; }
        public int MODULE_ID { get; set; }
        public int? USERID { get; set; }
        public Nullable<int> BRANCH_ID { get; set; }

        public Boolean IS_OUTBOUND { get; set; }
        public Boolean INTEGRATION_PICKUP_FLAG { get; set; }

        

        
        public string PARAM_USER_ID { get; set; }
        public string PARAM_PASSWORD { get; set; }

        public string PASSWORD { get; set; }
        public string EMAIL_ERROR { get; set; }
        public string ERROR_MESSAGE { get; set; }
        public string ORIGNAL_FILE_NAME { get; set; }
        public string SERVER_FILE_NAME { get; set; }
        public string URL_PARAMETERS { get; set; }
        public string API_KEY { get; set; }
        public string URL_PATH { get; set; }
        public DateTime FILE_DATE { get; set; }
        public DataTable HARRI_ROTA_EMP_TYPE { get; set; }

        public DataTable KOBAS_ROTA_ROLE { get; set; }
        public DataTable KOBAS_ROTA_STAFF { get; set; }
        public DataTable KOBAS_ROTA_SHIFT { get; set; }
        public DataTable KOBAS_ROTA_VENUE{ get; set; }

        public DataTable DATATABLE_1{ get; set; }
        public DataTable DATATABLE_2{ get; set; }
        public DataTable DATATABLE_3{ get; set; }
        public DataTable DATATABLE_4{ get; set; }
        public DataTable DATATABLE_5{ get; set; }
        public DataTable DATATABLE_6{ get; set; }
        public DataTable DATATABLE_7 { get; set; }
        public DataTable DATATABLE_COMMON { get; set; }
        public string CONSOLIDATED_ERROR_STRING { get; set; }
    }
    public class KobasStaff
    {
        public int id { get; set; }
        public int franchisee_id { get; set; }
        public int venue_id { get; set; }
        public string title { get; set; }
        public string first_name { get; set; }
        public string surname { get; set; }
        public string name { get; set; }
        public string gender { get; set; }
        public string email { get; set; }
        public string telephone { get; set; }
        public string mobile { get; set; }
        public string dob { get; set; }
        public string start_date { get; set; }
        public string end_date { get; set; }
        public int? level_id { get; set; }
        public List<int> role_ids { get; set; }
        public int? default_role_id { get; set; }
        public bool is_current_employee { get; set; }
        public bool? marketing_consent { get; set; }
        public string m_date { get; set; }
        public string c_date { get; set; }
        public object can_export_salary_data { get; set; }
    }
    public class KobasStaffRoot
    {
        public List<KobasStaff> data { get; set; }
        public int offset { get; set; }
        public int limit { get; set; }
        public int count { get; set; }
    }
    public class VenueRoot
    {
        public int id { get; set; }
        public object parent_id { get; set; }
        public bool is_parent { get; set; }
        public int territory_region_id { get; set; }
        public string territory_region_name { get; set; }
        public int territory_id { get; set; }
        public string territory_name { get; set; }
        public int franchisee_id { get; set; }
        public bool is_head_office { get; set; }
        public int menuid { get; set; }
        public int menu_id { get; set; }
        public string name { get; set; }
        public string sname { get; set; }
        public string address { get; set; }
        public double latitude { get; set; }
        public double longitude { get; set; }
        public string postcode { get; set; }
        public string telephone { get; set; }
        public string email { get; set; }
        public int startweekid { get; set; }
        public string startweek_date { get; set; }
        public int endweekid { get; set; }
        public string endweek_date { get; set; }
        public string tiptype { get; set; }
        public string amexmode { get; set; }
        public string gmap_address { get; set; }
        public string receipt_signoff { get; set; }
        public bool receipt_hide_name { get; set; }
        public string receipt_header_url { get; set; }
        public string screen_message { get; set; }
        public string tax_number { get; set; }
        public int managerid { get; set; }
        public int weeklybonus { get; set; }
        public object sagepayelementhours { get; set; }
        public object sagepayelementtips { get; set; }
        public object sageaccountreference { get; set; }
        public object sagedepartmentcode { get; set; }
        public bool preoday_enabled { get; set; }
        public object preoday_venue_id { get; set; }
        public bool preoday_print_orders { get; set; }
        public bool xero_enabled { get; set; }
        public object xero_tracking_option { get; set; }
        public object xero_organisation_id { get; set; }
        public object epos_hostname { get; set; }
        public object epos_type { get; set; }
        public object support_notes { get; set; }
        public bool display_on_loyalty { get; set; }
        public int operational_day_start_hour { get; set; }
        public bool epos_loyalty_prompts { get; set; }
        public int pdq { get; set; }
        public int par50n { get; set; }
        public int par20n { get; set; }
        public int par10n { get; set; }
        public int par5n { get; set; }
        public int par2c { get; set; }
        public int par1c { get; set; }
        public int par50c { get; set; }
        public int par20c { get; set; }
        public int par10c { get; set; }
        public int par5c { get; set; }
        public int cfscreen_presentation { get; set; }
        public object mailchimp_list_id { get; set; }
        public object weeklybonus_previous_value { get; set; }
        public string weeklybonus_last_date { get; set; }
        public bool meta_simple_dockets { get; set; }
        public bool meta_service_charge_original { get; set; }
        public bool meta_tab_covers_prompt { get; set; }
        public bool meta_loke_integration { get; set; }
        public bool meta_print_userx_payment_summary { get; set; }
        public string meta_default_receipt_format { get; set; }
        public bool meta_receipt_show_card_tips { get; set; }
        public int? meta_deliverect_enabled { get; set; }
        public string meta_deliverect_location_id { get; set; }
        public string meta_deliverect_delivery_stock_item_id { get; set; }
        public int? meta_deliverect_auto_accept_orders { get; set; }
        public int? meta_deliverect_auto_finalise_orders { get; set; }
        public int? meta_deliverect_print_orders { get; set; }
        public int? meta_paymentsense_connect_enabled { get; set; }
        public string meta_paymentsense_host_address { get; set; }
        public string meta_paymentsense_api_key { get; set; }
        public int meta_epos_session_close_denied_with_outstanding_tab_credit { get; set; }
        public int meta_suppress_pay_remaining_on_card { get; set; }
        public string meta_fourth_site_reference { get; set; }
        public int accept_stand_alone_pdq_payments { get; set; }
    }

    public class KobasStaffRoleRoot
    {
        public int id { get; set; }
        public int franchisee_id { get; set; }
        public string name { get; set; }
        public string category { get; set; }
    }
    public class KobasShift
    {
        public int id { get; set; }
        public int? venue_id { get; set; }
        public int charge_venue_id { get; set; }
        public int? role_id { get; set; }
        public string date { get; set; }
        public string start_time { get; set; }
        public string end_time { get; set; }
        public int? minutes_rostered { get; set; }
        public double hours_rostered { get; set; }
        public int minutes_on_break { get; set; }
        public int minutes_worked { get; set; }
        public double hours_worked { get; set; }
        public bool approved { get; set; }
        public string time_in { get; set; }
        public string time_out { get; set; }
        public int tips { get; set; }
        public int? hours_training { get; set; }
        public bool has_clocked_in { get; set; }
        public bool has_break { get; set; }
        public bool is_holiday { get; set; }
        public bool is_day_off { get; set; }
        public bool is_cover_shift { get; set; }
        public string m_date { get; set; }
        public string c_date { get; set; }
        public int holiday_amount_of_day { get; set; }
    }
    public class ShiftRoot
    {
        public List<KobasShift> data { get; set; }
        public int offset { get; set; }
        public int limit { get; set; }
        public int count { get; set; }
    }
    public class Access_token_Root
    {
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string access_token { get; set; }
        public string code { get; set; }
    }

     
}
