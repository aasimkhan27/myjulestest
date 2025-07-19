using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notification
{
   public class Notification_Details
    {
        public string EmailFrom { get; set; }
        public string EmailPassword { get; set; }
        public string Email_TO { get; set; }
        public string CC_TO { get; set; }
        public string BCC_TO { get; set; }
        public string Subject { get; set; }
        public string Email_Body { get; set; }
        public bool IsBodyHtml { get; set; }
        public string IS_PROD { get; set; }
        public DataSet ds_PetyCash_Information { get; set; }
        public DataRow dr_Notification { get; set; }
        public bool Attachment_Flag { get; set; }
        public bool IS_AUTO_ENTRY { get; set; }
        public List<AttachmentList> Attachments { get; set; }
    }
    public class CreateNotification_Details
    {
        public string LOGOURL { get; set; }
        public string APPURL { get; set; }
        public string EmailHeaderText { get; set; }
        public string Email_Subject { get; set; }
        public string ButtonText { get; set; }
        public int Notification_ID { get; set; }        
        public DataRow dr_Notification { get; set; }
        public DataSet ds_Emp_Information { get; set; }
        public DataSet ds_PetyCash_Information { get; set; }
        public DataSet PYMNT_RECONSILE_STATEMENT { get; set; }
        public bool Attachment_Flag { get; set; }
        public List<AttachmentList> Attachments { get; set; }       
        public DataSet INTEGRATION_DETAILS_BY_CUST_ENT_BRNH { get; set; }
        public decimal TABLE_ID { get; set; }
        public string EMAIL_TO { get; set; }
        public bool IS_SEND_TO_FIREBASE { get; set; }
        public string P2P_USERTYPE { get; set; }
        public DataSet COMMON_DS { get; set; }
        public string Email_Body_For_Mobile_Notification { get; set; }
        public bool IS_AUTO_ENTRY { get; set; }
        public DataSet _ds_Approved_Pending_List { get; set; }
        public DataSet USER_SETTING{ get; set; }
        public DataSet SETTING_MASTER_IDS { get; set; }
        public decimal MODULE_ID { get; set; }

    }
    public class AttachmentList
    {      
        public MemoryStream IMAGE_FROM_URL { get; set; }
        public string IMAGE_FROM_URL_NAME { get; set; }
    }
    public class DataAccess_Model
    {
        public string EMAIL_ERROR { get; set; }
        public decimal STATUS_ID { get; set; }
        public decimal TABLE_ID { get; set; }
        public decimal INTEGRATION_SYSTEM_ID { get; set; }
        public decimal CUSTOMER_ID { get; set; }
        public decimal ENTITY_ID { get; set; }
        public decimal? BRANCH_ID { get; set; }
        public string ERROR { get; set; }
    }
    public class Wefyle_Details
    {
        public string NAME { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string UploadedBy { get; set; }
        public string ApprovedBy { get; set; }
        public string Date { get; set; }
        public string SendTo { get; set; }
    }
    public class Cashup_Details
    {
        public string NAME { get; set; }
        public string SESSION_NAME { get; set; }
        public string CASHUP_DATE { get; set; }
        public string ACTIONBY { get; set; }      
        public string NUMBER { get; set; }      
    }
    public class USER_DETAILS
    {
        
        public CreateNotification_Details CreateNotification_Details { get; set; }
        public string NAME { get; set; }
        public string MANAGER_NAME { get; set; }
        public string LEAVE_STATUS { get; set; }
        public string UPDATE_TIME { get; set; }
        public DataSet USER_SETTING { get; set; }         
        public decimal MODULE_ID { get; set; }

    }
    public class Xero_Model
    {
        public CreateNotification_Details CreateNotification_Details { get; set; }
        public string ENTITY_NAME { get; set; }
        public string SUPPLIER_NAME { get; set; }
        public string SUPPLIER_ACCOUNT { get; set; }
        public string STATEMENT_DATE { get; set; }
        public string AMOUNT { get; set; }
        public string PAYMENT_SCHEDULE_ID { get; set; }
        public string PAYMENT_DATE { get; set; }
        public string OTP { get; set; }
        public DataSet XERO_SUBJECT_ENTERED_BY_USER { get; set; }
    }
}
