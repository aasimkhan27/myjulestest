using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace Notification.EmailBody
{
    public class CashUp
    {
        public Cashup_Details Cashup_DetailsObj { get; set; }

        public string CashupEntrySuccess()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Your Cash-up entry for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" (");
            EmailBody.Append(Cashup_DetailsObj.SESSION_NAME);
            EmailBody.Append(")");
            EmailBody.Append("  is successfully submitted.");
            EmailBody.Append("<br>Kindly contact support@wenodo.com if you faced any difficulties.<br><br>Thanks");

            return EmailBody.ToString();
        }
        public string CashupEntryReminder()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> You are receiving this mail because your cash-up entry for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" (");
            EmailBody.Append(Cashup_DetailsObj.SESSION_NAME);
            EmailBody.Append(")");
            EmailBody.Append(" is pending submission.");
            EmailBody.Append("<br>Kindly Login and proceed with entry. <br><br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupPendingApproval()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash-up for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" is awaiting your approval.");
            EmailBody.Append("<br>Kindly Login and proceed with entry. <br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupApprovedToUploader()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash-up for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" is approved by ");
            EmailBody.Append(Cashup_DetailsObj.ACTIONBY);
            EmailBody.Append(".<br><br>Kindly contact support@wenodo.com in case of any queries.<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupRejectedToUploader()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash-up for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" is returned by ");
            EmailBody.Append(Cashup_DetailsObj.ACTIONBY);
            EmailBody.Append(".<br><br>Kindly contact support@wenodo.com in case of any queries.<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupApprovedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash-up for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" is approved successfully..");
            EmailBody.Append("<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupRejectedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash-up for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" is rejected successfully");
            //EmailBody.Append(Cashup_DetailsObj.ACTIONBY);
            EmailBody.Append(".<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupBankingApprovedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash banking for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" has been approved by ");
            EmailBody.Append(Cashup_DetailsObj.ACTIONBY);
            EmailBody.Append(".<br><br>Kindly contact support@wenodo.com in case of any queries.<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CashupBankingRejectedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Cash banking for ");
            EmailBody.Append(Cashup_DetailsObj.CASHUP_DATE);
            EmailBody.Append(" has been Rejected by ");
            EmailBody.Append(Cashup_DetailsObj.ACTIONBY);
            EmailBody.Append(".<br><br>Kindly contact support@wenodo.com in case of any queries.<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string P2P_Appoval(string P2PType, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">" + P2PType + "# " + parameters[0] + " raised by " + parameters[1] + " for " + parameters[2] + " is waiting for your approval.</label><br>");
            EmailBody.Append("<br><br><br><br>Kindly contact support@wenodo.com in case of any queries.<br>Thanks");
            return EmailBody.ToString();
        }
        public string P2P_Approver(string P2PType, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">" + P2PType + "# " + parameters[1] + " has been rejected by " + parameters[2] + " (" + parameters[3] + "). Please login to the application for more details.</ label ><br> ");
            EmailBody.Append("<br><br><br><br>Kindly contact support@wenodo.com in case of any queries.<br>Thanks");
            return EmailBody.ToString();
        }
        public string P2P_REJECTED(string P2PType, string[] parameters)
        {
            string Commentsstr = "with following comments";
            if (parameters[5] == "")
            {
                Commentsstr = "";
            }
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">" + P2PType + "# " + parameters[1] + " for  " + parameters[4] + " has been rejected by " + parameters[2] + " (" + parameters[3] + ") " + Commentsstr + ". </ label ><br> ");
            if (parameters[5] != "")
            {
                EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">“" + parameters[5] + "”.</ label ><br> ");
            }
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Please login to the application for more details.</ label ><br> ");
            EmailBody.Append("<br><br><br><br>Kindly contact support@wenodo.com in case of any queries.<br>Thanks");
            return EmailBody.ToString();
        }
        public string P2P_NewSupplier(CreateNotification_Details CreateObj, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">This is to inform that a request to add new contact with name <strong>" + CreateObj.COMMON_DS.Tables[0].Rows[0]["SUPPLIER_NAME"].ToString() + "</strong> has been raised for " + CreateObj.COMMON_DS.Tables[0].Rows[0]["ENTITY_NAME"].ToString() + " on " + Convert.ToDateTime(CreateObj.COMMON_DS.Tables[0].Rows[0]["CREATED_DATE"]).ToString("dd/MM/yyyy") + " by " + CreateObj.COMMON_DS.Tables[0].Rows[0]["CREATED_BY_NAME"].ToString() + " (" + CreateObj.COMMON_DS.Tables[0].Rows[0]["CREATED_BY_EMAIL"].ToString() + ").</ label ><br> ");
            EmailBody.Append("<br><br>Kindly contact " + CreateObj.COMMON_DS.Tables[0].Rows[0]["CREATED_BY_NAME"].ToString() + " (" + CreateObj.COMMON_DS.Tables[0].Rows[0]["CREATED_BY_EMAIL"].ToString() + ") in case you require more details regarding the same.<br><br>Regards");
            return EmailBody.ToString();
        }
        public string P2P_PO_REQCreation(string P2PType, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            if (P2PType == "PO")
            {
                EmailBody.Append(Cashup_DetailsObj.NAME);
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
                EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Purchase order[ " + parameters[0] + "] has been generated for Requisition# " + parameters[2] + " (Request# " + parameters[3] + ").Please login to the application for more details.</label><br> ");
                EmailBody.Append("<br><br><br><br>Kindly contact support@wenodo.com in case of any queries.<br>Thanks");
            }
            else if (P2PType == "REQ")
            {
                EmailBody.Append(Cashup_DetailsObj.NAME);
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
                EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Requisition# " + parameters[0] + " has been created for Request# " + parameters[1] + ".Please login to the application for more details.</label><br> ");
                EmailBody.Append("<br><br><br><br>Kindly contact support@wenodo.com in case of any queries.<br>Thanks");
            }
            return EmailBody.ToString();
        }
        public string P2P_POPDF(string P2PType, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> This email is to inform that you have received an Purchase Order [" + parameters[0] + "] from (" + parameters[1] + "). Please refer to attachment for more details.In case of queries kindly contact buyer.</label><br> ");
            EmailBody.Append("<br><br><br><br>Regards,");
            return EmailBody.ToString();
        }
        public string P2P_PO_RECEIVER(string P2PType, string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> The "+ parameters[0] + " has been approved.</label><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Kindly, complete the receiving for it.</label><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Thank you.</label><br> ");
            EmailBody.Append("<br><br><br><br>");
            return EmailBody.ToString();
        }
        public string P2P_Approve_Request(string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> Purchase request [" + parameters[0] + "] has been approved by [" + parameters[1] + "]. Please login to the application for more details.</label><br> ");
            EmailBody.Append("<br><br><br><br>Regards,");
            return EmailBody.ToString();
        }
        public string P2P_New_Purchase_Request(string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Cashup_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"> New Purchase request " + parameters[0] + " is available for processing. Please login to the application for more details.</label><br> ");
            EmailBody.Append("<br><br><br><br>Regards,");
            return EmailBody.ToString();
        }
    }
}
