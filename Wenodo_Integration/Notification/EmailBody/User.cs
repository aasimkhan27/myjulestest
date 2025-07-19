using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notification.EmailBody
{

    public class User
    {
        #region WelcomeEmail
        public USER_DETAILS USER_DETAILSObj { get; set; }
        public Xero_Model Xero_Model { get; set; }
        public string WelcomeEmail()
        {
            StringBuilder EmailBody = new StringBuilder();

            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br><br>Welcome to Wenodo!<br><br> Wenodo Apps provides an end-to-end solution for the hospitality industry. As a Wenodo member, you can access systems like Wefyle, Cash-up, HR, Rota, Inventory, Accounts, Reporting and P2P on the App Suite. You are a step away from accessing the system. To set up your account, click the Set Password link to complete the login process.<br><br>It would be great to know what you think of our products or services and if there's anything we can improve on.<br><br>If you have any questions, please get in touch with us at support@wenodo.com. We are more than willing to assist.<br><br>Click " + @"""Set Password""" + " to enter the platform. Thank you.");
            return EmailBody.ToString();
        }
        public string ResetPassword()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> You recently requested to reset your password for your account.<br><br>Click the button below to reset it.<br><br>Thanks<br>Chan");
            return EmailBody.ToString();
        }
        public string InviteEmployee()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> You are invited to fill your application.<br><br>Click the button below to proceed.<br><br>Thanks<br>Chan");
            return EmailBody.ToString();
        }
        public string HR_WelcomeEmail_Employee(int For_Registration_Or_New_entity, string[] parameters)//For_Registration_Or_New_entity varible is to check which type email content should create.
        {
            StringBuilder EmailBody = new StringBuilder();
            if (For_Registration_Or_New_entity == 1)
            {

                EmailBody.Append(USER_DETAILSObj.NAME);
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> [Company Name] has invited you to join Wenodo HR & Scheduling platform, simply accept this invite by clicking on set password option below.<br>");
                //EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\"></p>");
                EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif; padding-top:12px;line-height:20px;\"><br><br>&nbsp; &nbsp; &nbsp;Your Account Details:</ label ><br> ");
                EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif; padding-top:12px;line-height:20px;\">&nbsp; &nbsp; &nbsp;Username : " + parameters[0] + "</ label ><br> ");
                EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif; padding-top:12px;line-height:20px;\">&nbsp; &nbsp; &nbsp;Employee ID : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NO"].ToString() + "</ label ><br> ");
                EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif; padding-top:12px;line-height:20px;\">&nbsp; &nbsp; &nbsp;Contact Number : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["MOBILE_NO"].ToString() + "</ label ><br><br>  ");
                EmailBody.Append("<br></p><br>Should you have any questions or require assistance please contact your HR Manager or support@wenodo.com.<br><br>Best regards, </br>[Company Name] Team!");
            }
            else
            {
                EmailBody.Append(USER_DETAILSObj.NAME);
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">");
                EmailBody.Append("<p style=\"font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\"> This is to notify you that access has been added for [company name].</p><br>");
                EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\"> Kindly re-login to the application for accessing the added entity.<br>");
                EmailBody.Append("</p><br/><br>Thanks & Best Regards,<br>Team Wenodo");
            }
            return EmailBody.ToString();
        }
        public string HR_WelcomeEmail_Manager()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\"> A new employee has been successfully registered at [company name]. Kindly find below details for reference.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Employee ID : [Employee ID]</ label >< br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Joining Date : [Joining Date]</ label >< br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Contact Number : [Contact Number]</ label >< br> ");
            EmailBody.Append("<br/><br>Thanks");
            return EmailBody.ToString();
        }
        public string LEAVE_EMAIL_TO_EMP()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> Your leave/s has been successfully applied.<br>");
            EmailBody.Append("<p>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Name : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();
        }
        public string LEAVE_EMAIL_TO_MANAGER()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + ", have applied for leave/s and awaiting your approval.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();
        }
        public string LEAVE_APPROVED_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            //EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Your applied leave/s has been approved by the manager " + USER_DETAILSObj.MANAGER_NAME.ToString() + ".<br>");
            //EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            //EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            //EmailBody.Append("</p><br/><br>Thanks");
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Thanks for submitting your leave application on HR Portal. Your leave has been approved.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Much obliged");
            return EmailBody.ToString();

        }
        public string LEAVE_APPROVED_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Leave/s applied by " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + " has been approved successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_REJECT_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Thanks for submitting your leave application on HR Portal. " + USER_DETAILSObj.MANAGER_NAME.ToString() + " has turned down your request for a leave of absence.<br><br>To view the reason for rejection, kindly log in to the HR portal and resubmit the application.<br><br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label><br><br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">Please feel free to write us at support@wenodo.com with any questions about the leave request.<br><br>We'd be glad to assist you.<br><br>Much obliged</ label></p><br><br>");
            return EmailBody.ToString();

        }
        public string LEAVE_REJECT_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Leave/s applied by " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + " for below dates has been rejected successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_CANCELED_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Leave/s applied on below dates has been cancelled successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_CANCELED_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Leave/s applied by " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + " on below dates has been cancelled successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px; font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_CANCELED_BY_MANAGER_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">Your applied leave/s has been cancelled by the manager " + USER_DETAILSObj.MANAGER_NAME.ToString() + ".<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_CANCELED_BY_MANAGER_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> Leave/s applied by " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + " has been cancelled successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato, sans-serif;line-height:20px; \">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_APPLY_BY_MANAGER_FOR_EMP_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> Your manager has apply " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + " Leave/s on behalf of you and applied successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string LEAVE_APPLY_BY_MANAGER_FOR_EMP_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + " Leave/s apply on behalf of " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["EMPLOYEE_NAME"].ToString() + " has been applied successfully.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp;  Applied Leave/s : " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ABSENCE_TYPE_NAME"].ToString() + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave Start Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["START_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Leave End Date : " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["END_DATE"]).ToString("dd-MM-yyyy") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Days : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_DAYS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Hours : " + Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DURATION_HOURS"]).ToString("F2") + "</ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">&nbsp; &nbsp; &nbsp; Status : " + USER_DETAILSObj.LEAVE_STATUS.ToString() + "</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks");
            return EmailBody.ToString();

        }
        public string TERMINATION_OF_EMP_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> This is to inform you that, your employment with " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ENTITY_NAME"].ToString() + " will end as of " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["TERMINATION_DATE"]).ToString("dd-MM-yyyy") + ". Your termination is due to the following reason(s):" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["TERMINATION_REASONS_NAME"].ToString());
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }
        public string TERMINATION_OF_EMP_MANAGER_MAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString() + " has been successfully terminated from " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["ENTITY_NAME"].ToString() + " effective from " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["TERMINATION_DATE"]).ToString("dd-MM-yyyy"));
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif; padding-top:12px;line-height:20px; \">.Kindly check all the compliances for the " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + " are completed.</ label ><br> ");
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }
        public string APPLICATION_SUBMITTED(string ApplicantName)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> Application has been submitted successfully by " + ApplicantName + ".<br><br> If you have any questions, please contact support@wenodo.com.<br><br>Thanks<br>Chan");
            return EmailBody.ToString();
        }
        //public string MANAGER_SCHEDULE_SHIFT_FOR_EMP_EMP_EMAIL()
        //{
        //    StringBuilder EmailBody = new StringBuilder();
        //    EmailBody.Append(USER_DETAILSObj.NAME);
        //    EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;line-height:20px;\"><br><br>" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString() + " Your manager " + USER_DETAILSObj.MANAGER_NAME.ToString() + " has scheduled your shift for " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["TERMINATION_DATE"]).ToString("dd-MM-yyyy"));
        //    EmailBody.Append("<label style=\"font - size:12px; font - family:Montserrat, Helvetica, Arial, sans - serif; padding - top:12px; line - height:20px; \">.SHIFT timing: " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + "</ label ><br> ");
        //    EmailBody.Append("</p><br><br><br>Thanks");
        //    return EmailBody.ToString();

        //}
        #endregion
        public string CASHUP_INTEGRATION_FALLOUT_NOTIFICATION_EMAIL(string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append("Team");
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> There is an error in Cashup Integration for<br><br> Entity:" + parameters[1] + ", on " + parameters[2] + ",Branch name " + parameters[3] + ".<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string CASHUP_INTEGRATION_FALLOUT_NOTIFICATION_EMAIL_36(string[] parameters)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append("Team");
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> There is an error in Cashup Integration for<br><br> Entity:" + parameters[1] + ", on " + parameters[2] + ",Branch name " + parameters[3] + ".<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string ROTA_PUBLISH_SHIFT_EMAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> There are shifts assigned to you, please login and check shifts detail.<br><br><br>Thanks<br>");
            return EmailBody.ToString();
        }

        public string ROTA_APPROVED_SHIFT_EMAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> Your shift has been approved.<br><br><br>Thanks<br>");
            return EmailBody.ToString();
        }
        public string ROTA_REVERT_APPROVED_SHIFT_EMAIL()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> Your shift approval has been reverted.<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string PROFILE_UPDATE_MANAGER_MAIL(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            if (Convert.ToDecimal(Params[2]) == 0)
            {
                //if manager update user's profile then manager get email
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> The profile of " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString() + " has been updated successfully.");
            }
            else
            {
                //if user update his own profile then manager get email
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString() + " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString() + " has updated the profile.");
            }
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }
        public string PROFILE_UPDATE_EMPLOYEE_MAIL(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            if (Convert.ToDecimal(Params[2]) == 0)
            {
                //if manager update user's profile then user get email
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Your profile has been updated by " + Convert.ToString(Params[3]) + ".");
            }
            else
            {
                //if user update his own profile then user get email
                EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> Your profile is updated succesfully.");
            }
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }
        public string PROBATION_REMINDER_MAIL(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            //EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;line-height:20px;\"><br> This email is in reference with the probation period of 90 days for " + Convert.ToString(Params[3]) + " by " + Convert.ToString(Params[1]) + ", wherein specific mention was made that "+ Convert.ToString(Params[5]) + " days probation period would be applied to this position which will end on " + Convert.ToString(Params[4]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> This email is in reference with the probation period of 90 days for " + Convert.ToString(Params[1]) + " which will end on " + Convert.ToString(Params[4]));
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }

        #region Marketman Integratiom email service code
        public string MARKET_MAN_INTEGRATION_EMAIL(String[] Params, DataSet DS)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> This email is in reference to the MARKETMAN integration error. Details are as below");
            EmailBody.Append("<table border=\"1\" style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;line-height:20px;\"><tr><td style=\"white-space: nowrap;background-color: #05A6F0; color:#fff; font-weight:bold;\">MM Log ID</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Entity Name</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Branch Name</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Created Date</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Count</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Sent Date Start</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Sent Date End</td><td style=\"white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">MM Item</td></tr><tr><td>" + DS.Tables[0].Rows[0]["MM_LOGS_ID"] + "</td><td>" + DS.Tables[0].Rows[0]["ENTITY_NAME"]);
            EmailBody.Append("</td><td>" + DS.Tables[0].Rows[0]["BRANCH_NAME"] + "</td><td>" + DS.Tables[0].Rows[0]["CREATED_DATE"] + "</td><td>" + DS.Tables[0].Rows[0]["COUNT_RECEIVED_IN"] + "</td>");
            EmailBody.Append("<td >" + Convert.ToString(DS.Tables[0].Rows[0]["SENT_DATE_START"]) + "</td><td>" + Convert.ToString(DS.Tables[0].Rows[0]["SENT_DATE_END"]) + "</td><td>" + DS.Tables[0].Rows[0]["TYPE_NAME"] + "</td></tr></table>");
            EmailBody.Append("</p><br><br>Thanks");
            return EmailBody.ToString();

        }
        #endregion  
        public string Outh2Authentication()        {            StringBuilder EmailBody = new StringBuilder();            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;word-break: break-all;\"> OAuth2 Authentication for light speed L series link near below,<br>please click on given URL and fill in details to complete<br>integration process:-<br><br><a href=\"" + Convert.ToString(USER_DETAILSObj.MANAGER_NAME) + "\"" + ">" + Convert.ToString(USER_DETAILSObj.MANAGER_NAME) + "</a>");            EmailBody.Append("</p><br><br>Thanks");            return EmailBody.ToString();        }
        public string RequestingStatement()        {
            StringBuilder EmailBody = new StringBuilder();
            //EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> I hope this email finds you well.<br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">We are reconciling the account of " + Xero_Model.ENTITY_NAME + " with you and request you to send a " + Xero_Model.STATEMENT_DATE + " statement of accounts to keep our books up to date. It will help us keep the account up to date and ensure timely payment of invoices.The account details held with you are below.</ label ><br><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">Account Name : " + Xero_Model.SUPPLIER_NAME + " </ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">Account Number : " + Xero_Model.SUPPLIER_ACCOUNT + " </ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">Subject : " + Xero_Model.XERO_SUBJECT_ENTERED_BY_USER.Tables[0].Rows[0]["SUBJECT"] + " </ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"><br><br>Request you to email the up-to-date statement of accounts to support@wenodo.com</ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks & Best Regards,<br>Wenodo Support");
            return EmailBody.ToString();        }
        public string PaymentScheduleForApproval()        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\">");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">We have uploaded the payments list for " + Convert.ToString(Xero_Model.CreateNotification_Details.dr_Notification["CURRENCY_SYMBOL"]) + Math.Round(Convert.ToDecimal(Xero_Model.AMOUNT), 2) + " for your approval. Kindly review the payment list and approve.");
            EmailBody.Append("</p><br/><br>Thanks & Best Regards,<br>Wenodo Support");
            return EmailBody.ToString();        }
        public string PaymentScheduleApprovedByApprover()        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">The payment has been approved by everyone in the approval chain and now it can be pushed for payments.");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"></ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks & Best Regards,<br>Wenodo Support");
            return EmailBody.ToString();        }
        public string PaymentScheduleRejectedByApprover()        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">The payment has been rejected by approver please login to the application for more details.");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"></ label ><br> ");
            EmailBody.Append("</p><br/><br>Thanks & Best Regards,<br>Wenodo Support");
            return EmailBody.ToString();        }
        public string Cashup_Approved_Attachment_Email(String[] Params, DataSet DS)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"> Petty Cash details are as below on " + Params[2].ToString() + ".");
            EmailBody.Append("<table border=\"0\" style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;line-height:20px;\"><tr><td style=\" padding: 5px;white-space: nowrap;background-color: #05A6F0; color:#fff; font-weight:bold;\">Session</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Entity</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Category</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Goods</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Gross</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Approved</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">VAT</td><td style=\"padding: 5px;white-space: nowrap;background-color: #05A6F0;color:#fff;font-weight:bold;\">Net</td></tr>");
            foreach (DataRow DR in DS.Tables[0].Rows)
            {
                EmailBody.Append("<tr><td style=\"padding: 5px; font-size:12px;\">" + DR["SESSION_NAME"] + "</td><td style=\"padding: 5px; font-size:12px;\">" + DR["ENTITY_NAME"]);
                EmailBody.Append("</td><td style=\"padding: 5px; font-size:12px;\">" + DR["CATEGORY_NAME"] + "</td><td style=\"padding: 5px; font-size:12px;\">" + DR["ITEM"] + "</td><td style=\"padding: 5px; font-size:12px;\">" + DR["TOTAL_VALUE"] + "</td>");
                EmailBody.Append("<td style=\"padding: 5px; font-size:12px;\">" + DR["AUTHORIZED_BY_NAME"] + "</td><td style=\"padding: 5px; font-size:12px;\">" + DR["VAT_AMOUNT"] + "</td><td style=\"padding: 5px; font-size:12px;\">" + DR["NET_AMOUNT"] + "</td></tr>");
            }
            EmailBody.Append("</table></p><br><br>Thanks");
            return EmailBody.ToString();
        }

        public string OTP()        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;padding-left:24px;padding-top:20px;\"><br>");
            EmailBody.Append("Please use the verification code <b>" + Xero_Model.OTP + "</b> for Wenodo App.<br>");
            EmailBody.Append("If you didn't request this, you can ignore this email or let us know.<br> ");
            EmailBody.Append("<br/><br>Thanks<br>Wenodo Support");
            return EmailBody.ToString();        }
        //public string CASHUP_INTEGRATION_FALLOUT_NOTIFICATION_EMAIL(string[] parameters)
        //{
        //    StringBuilder EmailBody = new StringBuilder();
        //    EmailBody.Append("Team");
        //    EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;white-space:nowrap\"> There is an error in Cashup Integration for<br><br> Entity:" + parameters[1] + ", on " + parameters[2] + ".<br><br>Thanks");
        //    return EmailBody.ToString();
        //}
        public string Email_Reconciliation(String[] Params, DataSet DS, string CURRENCY_SYMBOL)
        {
            StringBuilder EmailBody = new StringBuilder();
            int counter_for_tr_color = 1;
            string style_for_tr_color = string.Empty;
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;text-align:left\">" + Params[2] + "</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;text-align:left\">");
            EmailBody.Append("<table border=\"0\" style=\"color:#333333;font-size:12px;font-family:Lato, sans-serif;line-height:20px;text-align:left;width: 100%;\"><thead style=\"background-color:#c2dbe8;\"><tr><th style=\"padding:10px; white-space:nowrap;\">Invoice Date</th><th style=\"padding:10px; white-space:nowrap;\">Number</th><th style=\"padding:10px\">Due Date</th><th style=\"padding:10px\">Debit</th><th style=\"padding:10px\">Credit</th><th style=\"padding:10px\">Balance</th><th style=\"padding:10px\">Status</th><th style=\"padding:10px; min-width:170px;\">Remarks</th></tr></thead><tbody>");
            foreach (DataRow DR in DS.Tables[1].Select("STATUS <> 45").CopyToDataTable().Rows)
            {
                if (counter_for_tr_color % 2 != 0)
                    style_for_tr_color = "style=background-color:#F3F8FB;";
                else
                    style_for_tr_color = "";


                string Due_Date = DR["FILE_DUE_DATE"] == (object)DBNull.Value ? "--" : Convert.ToDateTime(DR["FILE_DUE_DATE"]).ToString("dd-MM-yyyy");
                EmailBody.Append("<tr " + style_for_tr_color + "><td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + Convert.ToDateTime(DR["FILE_INVOICE_DATE"]).ToString("dd-MM-yyyy") + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + Convert.ToString(DR["FILE_INVOICE_NUMBER"]) + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + Due_Date + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DR["FILE_INVOICE_AMOUNT"])) + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DR["FILE_CREDIT_AMOUNT"])) + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DR["FILE_BALANCE_AMOUNT"])) + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + Convert.ToString(DR["STATUS_NAME"]) + "</td>" +
                    "<td style=\"padding: 10px; font-size:12px; white-space:normal\">" + Convert.ToString(DR["REMARK"]) + "</td>");
                counter_for_tr_color++;
            }
            EmailBody.Append("</tbody><tfoot><tr><td colspan=\"2\"></td><td style=\"padding: 10px; font-size:12px; white-space:nowrap\">Total</td><td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DS.Tables[1].Compute("SUM(FILE_INVOICE_AMOUNT)", string.Empty))).ToString() + " </td>" +
                "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DS.Tables[1].Compute("SUM(FILE_CREDIT_AMOUNT)", string.Empty))).ToString() + "</td>" +
                "<td style=\"padding: 10px; font-size:12px; white-space:nowrap\">" + CURRENCY_SYMBOL + " " + Convert.ToDecimal(string.Format("{0:F2}", DS.Tables[1].Compute("SUM(FILE_BALANCE_AMOUNT)", string.Empty))).ToString() + "</td>" +
                "<td></td><td></td></tr></tfoot></table></p><br><br>Thanks");
            return EmailBody.ToString();
        }
        public string Email_Fallout(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Params[0].ToString().ToLower() == "New Integration request".ToLower() ? "Support" : USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\">" + Params[1].ToString());
            EmailBody.Append("</p>");
            EmailBody.Append(Params[0].ToString().ToLower() == "New Integration request".ToLower() ? "<br><br>Thanks<br>WenodoApp" : "<br><br>Thanks");
            return EmailBody.ToString();
        }
        public string PasswordRest_Successfully_Email()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>");
            EmailBody.Append("<p style=\"font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">Thank you for confirming your email as your Wenodo username. </p>" +
                "Your account is now active. You can log in to <a href=\"https://app.wenodo.com/\">Wenodo</a> " +
                "from the browser on any computer using your email and password.<br>To get the most out of Wenodo, download our mobile app for <a href=\"https://play.google.com/store/apps/details?id=com.wenodo.wenodoapp\">Android</a> or <a href=\"https://apps.apple.com/kg/app/wenodo/id1602669943\">iPhone</a>.</br></br>");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;\"></br><strong>Getting Started</strong></ label ><br> ");
            EmailBody.Append("<label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"><br>Explore Features:</ label ><br> ");
            EmailBody.Append("<ul style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\"><li>Personal Information: Verify and update your personal details.</li><li>Holidays: Conveniently request holidays or time off directly through the app.</li><li>View Your Schedule: Stay organized by accessing your schedule whenever you need it.</li><li>Clock In/Out: Effortlessly record your work hours with the clock in/out feature.</li></ul><br> ");
            EmailBody.Append("<p style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">Should you have any questions or require assistance with the platform, please feel free to reach out to our support team at support@wenodo.com or speak to your HR manager.</p><br> ");

            EmailBody.Append("<br/><br>Regards<br>Wenodo Team!");
            return EmailBody.ToString();
        }
        public string Shift_Timing_Updates_Email(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\">The defined shift time has been modified for " + Params[0].ToString() + ", please login into the application for viewing shift details.");
            EmailBody.Append("</p><br>Thanks");
            return EmailBody.ToString();
        }
        public string AutoEntry_Email(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\">This is a system generated notification to send the invoice to auto-entry.");
            EmailBody.Append("</p><br>Thanks");
            return EmailBody.ToString();
        }
        public string BirthDayReminder()
        {
            string first_Name = USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["FIRST_NAME"].ToString();
            string middle_Name = USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["MIDDLE_NAME"].ToString() == "" ? "" : " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["MIDDLE_NAME"].ToString();
            string last_Name = USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString() == "" ? "" : " " + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["LAST_NAME"].ToString();
            string gender = USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["GENDER_ID"].ToString().ToUpper() == "MALE" ? "his" :
                (USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["GENDER_ID"].ToString().ToUpper() == "FEMALE" ? "her" : "");
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append("<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">" +
                "<head>" +
                "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"></head><body style=\"background-color:#fff;\"><style type=\"text/css\">#outlook a {padding: 0;}body {margin: 0;padding: 0;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}</style><link href=\"https://fonts.googleapis.com/css?family=Montserrat\" rel=\"stylesheet\" type=\"text/css\"><style type=\"text/css\">@import url(https://fonts.googleapis.com/css?family=Montserrat);</style>" +
                "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:600px;height:auto; margin-top:5px\" align=\"center\">" +
                "<tbody>" +
                "<tr>" +
                "<td style=\"background-color:#023361; border-radius:5px;padding:5px\">" +
                "<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:590px;\">" +
                "<tbody>" +
                "<tr>" +
                "<td valign=\"middle\" style=\"text-align: center; color: #fff; font-family: Montserrat, Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 900; background: url(https://app.wenodo.com/E_Content/images/Email/birthdayBG.jpg); background-repeat:no-repeat; background-size: cover; height: 300px;\"><!--[if (mso)|(IE)]><v:image xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" stroke=\"false\" style=\" border: 0;display: inline-block; width: 600pt; height: 300pt;\" src=\"https://app.wenodo.com/E_Content/images/Email/birthdayBG.jpg\" /><v:rect xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" stroke=\"false\" style=\" border: 0;display: inline-block;position: absolute; width: 480pt; height:300pt;v-text-anchor:middle;\"><v:fill  opacity=\"0%\" color=\"#000000”  /><v:textbox inset=\"0,0,0,0\"><![endif]-->" +
                "<div><div><table role=\"presentation\" width=\"590\" style=\"width:590px;\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\"><tr><td align=\"center\" style=\"font-family: Montserrat, Helvetica, Arial, sans-serif;font-size:24px;font-weight:900;color:#fff\">A friendly reminder of an important<br>date in our team.</td></tr>" +
                "</table></div>" +
                "<!--[if (mso)|(IE)]></v:textbox></v:fill></v:rect></v:image><![endif]--></div></td></tr><tr><td style=\"background-color:#fff;padding:40px;text-align:center;font-family:Montserrat, Helvetica, Arial, sans-serif;font-size:20px;font-weight:bold;border-radius:5px 5px 0px 0px;\">On " +
                Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DATE_OF_BIRTH"]).ToString("MMMM") + " " + Convert.ToDateTime(USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["DATE_OF_BIRTH"]).ToString("dd") +
                ", our colleague " +
                first_Name + middle_Name + last_Name +
                " celebrates " + gender + " birthday.</td></tr><tr>" +
                "<td align=\"center\" valign=\"middle\" style=\"background-color:#fff\"><!--[if (mso)|(IE)]><v:oval xmlns:v=\"urn:schemas-microsoft-com:vml\" fill=\"true\" style='width:250px;height:250px;border-radius: 50%;box-shadow: 0 0 40px rgb(8 21 66 / 21%);' stroke=\"false\"><v:fill type=\"frame\" src=\"https://app.wenodo.com" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["PATH_IMAGE"].ToString() + "\" width=\"250\" height=\"250\"/></v:oval><![endif]--><!--[if !mso]>-->" +
                "<div style=\"border-radius: 50%;moz-border-radius: 50%;khtml-border-radius: 50%;o-border-radius: 50%;webkit-border-radius: 50%;ms-border-radius: 50%;box-shadow: 0 0 40px rgb(8 21 66 / 21%);width:250px;height:250px;\"><img data-imagetype=\"External\"  src=\"https://app.wenodo.com" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["PATH_IMAGE"].ToString() + "\" style=\"border-radius: 50%;moz-border-radius: 50%;khtml-border-radius: 50%;o-border-radius: 50%;webkit-border-radius: 50%;ms-border-radius: 50%;box-shadow: 0 0 40px rgb(8 21 66 / 21%);\" width=\"250\" height=\"250\" /><!--<![endif]--></div></td>" +
                "</tr><tr><td style=\"background-color:#fff;padding-bottom:40px;padding-top:20px;text-align:center;font-family:Montserrat, Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold; border-radius:0px 0px 5px 5px;\">" + USER_DETAILSObj.NAME + "<span style=\"font-size:14px;color:#9999A6;\"><br/>" + USER_DETAILSObj.CreateNotification_Details.ds_Emp_Information.Tables[0].Rows[0]["POSITION_TITLE"].ToString() + "</span></td></tr></tbody></table></td></tr></tbody>" +
                "</table>" +
                "</body></html>");




            return EmailBody.ToString();
        }
        public string test()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style type=\"text/css\">" +
                "#outlook a {padding: 0;}body {margin: 0;padding: 0;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}</style><link href=\"https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap\" rel=\"stylesheet\" type=\"text/css\"><style type=\"text/css\">" +
                "@import url(https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap);</style></head><body style=\"background-color:#fff;\">" +
                "<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%;height:100%;\" align=\"center\"><tbody><tr><td style=\"vertical-align:top;background-color:#f4f4f4;padding-bottom:50px\">" +
                "<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"570\"><tbody><tr><td style=\"text-align:center;padding-top:40px;padding-bottom:20px;\">" +
                "<img src=\"https://app.wenodo.com//Uploads/Customer/Entity/20220222085402261_BDP-Logo-Back.png\" width=\"150\"></td></tr><tr><td style=\"background-color:#fff;padding-bottom:40px;\">" +

                "<!--[if !mso]><!--><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"520\"><tbody><tr><td style=\"color:#333333;font-size:25px; font-weight:500;font-family:Lato, sans-serif;padding:20px;padding-bottom:0;line-height:20px;\"> Dear Rouba AbiHana,</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br><p style=\"background: #f8fbfb;font-size:16px;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">" +
                "Please use the verification code <b>510956</b> for Wenodo App.<br /><label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">If you didn't request this, you can ignore this email or let us know.</label><br>Thanks<br>" +
                "Wenodo Support<br><br></td></tr><tr><td align=\"center\" style=\"padding-top:80px;padding-bottom:20px;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td width=\"150px\" style=\"padding:10px;\">" +
                "<a href=\"https://wenodo.com/contact-us/\" target=\"_blank\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Contact.png\" border=\"0\"></a></td></tr></tbody></table></td></tr></tbody></table>" +
                "<!--<![endif]-->" +

                "<!--[if mso]><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"520\"><tbody><tr><td style=\"color:#333333;font-size:25px; font-weight:500;font-family:Lato, sans-serif;padding:20px;padding-bottom:0;line-height:20px;\">" +
                " Dear Rouba AbiHana,</td></tr><tr><td style=\"color:#333333;font-size:16px;!important;font-family:Lato, sans-serif;padding:20px;line-height:20px;\"><br>" +
                "<p style=\"background: #f8fbfb;font-size:16px;!important;font-family:Lato, sans-serif;padding-top:12px;line-height:20px;\">Please use the verification code <b>510956</b> for Wenodo App.<br /><label style=\"font-size:16px;font-family:Lato,sans-serif;line-height:20px;\">" +
                "If you didn't request this, you can ignore this email or let us know.</label><br>Thanks<br>Wenodo Support<br><br></td></tr><tr><td align=\"center\" style=\"padding-top:80px;padding-bottom:20px;\">" +
                "<table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td width=\"150px\" style=\"padding:10px;\"><a href=\"https://wenodo.com/contact-us/\" target=\"_blank\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Contact.png\" border=\"0\">" +
                "</a></td></tr></tbody></table></td></tr></tbody></table><![endif]-->" +


                "</td></tr><tr><td style=\"background-color:white;padding-top:10px;padding-bottom:30px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">" +
                "<tbody><tr><td><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr>" +
                "</tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Lato, sans-serif !important;text-align:center;line-height:18px;\">" +
                "Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");

            return EmailBody.ToString();
        }
        public string Pending_Approval_List(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(USER_DETAILSObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;white-space:nowrap;\">The following requests are pending your approval.</td></tr>");
            string _emailString = string.Empty;
            foreach (DataRow _dr in USER_DETAILSObj.CreateNotification_Details._ds_Approved_Pending_List.Tables[0].Rows)
            {
                if (_dr["Reference Type"].ToString() == "Bill")
                {
                    _emailString = "<tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;line-height:20px;white-space:nowrap;border-bottom:1px solid #ccc;\">" +
                        "<div style=\"background-color:#0888c3;color:#fff; padding:3px 8px; border-radius:4px; display:inline; font-weight:600\">" + Math.Round(Convert.ToDecimal(_dr["Amount"]), 2) + " " + _dr["Currency"].ToString() + "</div>" +
                        "<div style=\"display:inline-block; margin-left:10px;margin-bottom:12px\">Bill# - " + _dr["Reference No"].ToString() + "</div>" +
                        "<br><a href=\"https://app.wenodo.com/\" style=\"color:#0888c3\">Bill from " + _dr["Contact Name"].ToString() + "</a>" +
                        "<br><div style=\"font-weight:600; margin-bottom:10px\"></div></td></tr>";
                    EmailBody.Append(_emailString);
                }
                else if (_dr["Reference Type"].ToString() == "Requisition")
                {
                    _emailString = "<tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;line-height:20px;white-space:nowrap;border-bottom:1px solid #ccc;\">" +
                        "<div style=\"background-color:#0888c3;color:#fff; padding:3px 8px; border-radius:4px; display:inline; font-weight:600\">" + Math.Round(Convert.ToDecimal(_dr["Amount"]), 2) + " " + _dr["Currency"].ToString() + "</div>" +
                        "<div style=\"display:inline-block; margin-left:10px;margin-bottom:12px\">Requisition# - " + _dr["Reference No"].ToString() + "</div>" +
                        "<br><a href=\"https://app.wenodo.com/\" style=\"color:#0888c3\">Purchase Order to " + _dr["Contact Name"].ToString() + "</a>" +
                        "<br><div style=\"font-weight:600; margin-bottom:10px\"></div></td></tr>";
                    EmailBody.Append(_emailString);
                }
                else if (_dr["Reference Type"].ToString() == "Purchase Request")
                {
                    _emailString = "<tr><td style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:12px;line-height:20px;white-space:nowrap;border-bottom:1px solid #ccc;\">" +
                        "<div style=\"background-color:#0888c3;color:#fff; padding:3px 8px; border-radius:4px; display:inline; font-weight:600\">" + Math.Round(Convert.ToDecimal(_dr["Amount"]), 2) + " " + _dr["Currency"].ToString() + "</div>" +
                        "<div style=\"display:inline-block; margin-left:10px;margin-bottom:12px\">Request# - " + _dr["Reference No"].ToString() + "</div>" +
                        "<br><a href=\"https://app.wenodo.com/\" style=\"color:#0888c3\">Requested by " + _dr["Requestor"].ToString() + "</a>" +
                        "<br><div style=\"font-weight:600; margin-bottom:10px\"></div></td></tr>";
                    EmailBody.Append(_emailString);
                }
            }
            EmailBody.Append("</tbody></table>");
            return EmailBody.ToString();

        }

        public string OnboardingValidation(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Convert.ToString(Params[2]) + " " + Convert.ToString(Params[3]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">You are just one step away from using the Wenodo HR App to start managing your " + Convert.ToString(Params[1]) + " employees. We understand how important it is to have a safe and secure ecosystem. Hence, here is your validation link to validate your account and start using our system.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL+"Hr/HRIndex#!/Basic_Details?ID=" + Params[0] + "&passkey=" + Params[4] + "\" style=\"padding-left:20px; padding-right:20px;padding: 20px 0px;\"><br><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Click_here.png\" border=\"0\"><br/></a><br> If the above button does not open the validation page, request you to please copy and paste the below link on your browser address bar.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL+"Hr/HRIndex#!/Basic_Details?ID=" + Params[0] + "&passkey=" + Params[4] + "\" style=\"padding-left:20px; padding-right:20px;padding: 20px 0px;\">" +USER_DETAILSObj.CreateNotification_Details.APPURL+ "Hr/HRIndex#!/Basic_Details?ID=" + Params[0] + " & passkey=" + Params[4] + "</a>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Team Wenodo</p >");
            return EmailBody.ToString();
           
        }

        //---------------------------------- -


        public string EmployeeInvitation(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[1]) + " " + Convert.ToString(Params[2]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">You have been invited as a user in the new Wenodo HR App for " + Convert.ToString(Params[0]) + " site. You are required to provide some basic details to complete your profile and start using the system. Request you to please use the below link to access the user onboarding page and save your profile.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"padding-left:20px; padding-right:20px;padding: 20px 0px;\"><br/><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Click_here.png\" border=\"0\"><br/></a><br> If the above button does not open the onboarding page, request you to please copy and paste the below link on your browser address bar.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"color:#05a6f0;display:block;padding-left:20px; padding-right:20px;padding: 20px 0px;\">" + USER_DETAILSObj.CreateNotification_Details.APPURL + "</a>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> " + Convert.ToString(Params[4]) +" "+ Convert.ToString(Params[5]) +"</p >");
            return EmailBody.ToString();
        }

        public string EmailNotificatonManager(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[2]) + " " + Convert.ToString(Params[3]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px; padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Employee " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]) + " has completed the basic details and has been marked as “Ready to Hire”. Request you to please review the profile and add employment & compensation details to complete the onboarding.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Wenodo HR</p >");
            return EmailBody.ToString();
        }

        public string ProfileUpdate(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;\">Your profile has been successfully updated. Please review it by going to <strong>Wenodo HR App > Landing Page > Quick Links > My Profile</strong>.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> HR Manager</p >");
            return EmailBody.ToString();
        }

        public string ComplianceExpire(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Your " + Convert.ToString(Params[2]) + " is set to expire on <strong>" + Convert.ToString(Params[3]) + " </strong>. Please review it by going to <strong> Wenodo HR App > Landing Page > Quick Links > My Profile </strong>.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> HR Manager</p >");
            return EmailBody.ToString();
        }



        public string Absence(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();

            EmailBody.Append(" " + Convert.ToString(Params[4]) + " " + Convert.ToString(Params[5]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Your "  + Convert.ToString(Params[0]) + " leave request from  <strong>" + Convert.ToString(Params[2]) + " </strong>  to  <strong> " + Convert.ToString(Params[3]) + " </strong> has been " + Convert.ToString(Params[1]) + ".</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p >");

            return EmailBody.ToString();
        }


       


        public string ClockIn(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            DateTime punchInDateTime = DateTime.Parse(Params[2]);
            DateTime punchOutDateTime = DateTime.Parse(Params[3]);
            DateTime scheduleInDateTime = DateTime.Parse(Params[4]);
            DateTime scheduleOutDateTime = DateTime.Parse(Params[6]);
            string punchInDate = "";            
            string punchOutDate = "";
            string scheduleInDate = "";
            string scheduleOutDate = "";
            int setting_Master_Id = Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.USER_SETTING.Tables[0].Rows[0]["SETTING_VALUE"]);

            if (setting_Master_Id == 1)
            {
                punchInDate = punchInDateTime.ToString("dd MMM yyyy hh:mm tt");
                punchOutDate = punchOutDateTime.ToString("dd MMM yyyy hh:mm tt");
                scheduleInDate = scheduleInDateTime.ToString("dd MMM yyyy hh:mm tt");
                scheduleOutDate= scheduleOutDateTime.ToString("dd MMM yyyy hh:mm tt");                
            }
             if (setting_Master_Id == 2)
            {
                punchInDate = punchInDateTime.ToString("dd MMM yyyy HH:mm");
                punchOutDate = punchOutDateTime.ToString("dd MMM yyyy HH:mm");
                scheduleInDate = scheduleInDateTime.ToString("dd MMM yyyy HH:mm");
                scheduleOutDate = scheduleOutDateTime.ToString("dd MMM yyyy HH:mm");                
            }      

            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">You have successfully punched in today. Following are the details:</p>");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-left:20; padding-right:20px;line-height:20px;\">Punch-in details - <br> <strong>" + punchInDate + "<br/>" + punchOutDate + " </strong></p>");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-left:20; padding-right:20px;line-height:20px;\"><br>Assigned Schedule - <br/><strong>" + scheduleInDate + "</strong><br/><strong>" + scheduleOutDate + "</strong><br/>" + Convert.ToString(Params[5]) + "</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p >");

            return EmailBody.ToString();
        }

        public string ShiftUpdate(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            int setting_Master_Id = Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.USER_SETTING.Tables[0].Rows[0]["SETTING_VALUE"]);
            DateTime scheduleTime = DateTime.Parse(Params[3]);
            string OldstartDate ="";
            string OldstartTime ="";
            //old
            DateTime OdscheduleTime = DateTime.Parse(Params[4]);
            string OldshiftTime = "";



            //start 
            DateTime startDateTime = DateTime.Parse(Params[5]);
            string startDate = "";
            string startTime = "";

            // End  
            DateTime endDateTime = DateTime.Parse(Params[6]);
            string EndDate = endDateTime.ToString("dd MMM yyyy");
            string EndTime = endDateTime.ToString("hh:mm tt");

            if (setting_Master_Id == 1)
            {
                OldstartDate = scheduleTime.ToString("dd MMM yyyy");
                OldstartTime = scheduleTime.ToString("hh:mm tt");
                OldshiftTime = OdscheduleTime.ToString("hh:mm tt");
                startDate = startDateTime.ToString("dd MMM yyyy");
                startTime = startDateTime.ToString("hh:mm tt");
                EndDate = endDateTime.ToString("dd MMM yyyy");
                EndTime = endDateTime.ToString("hh:mm tt");
            }
            if (setting_Master_Id == 2)
            {
                OldstartDate = scheduleTime.ToString("dd MMM yyyy");
                OldstartTime = scheduleTime.ToString("HH:mm");
                OldshiftTime = OdscheduleTime.ToString("HH:mm");
                startDate = startDateTime.ToString("dd MMM yyyy");
                startTime = startDateTime.ToString("HH:mm");
                EndDate = endDateTime.ToString("dd MMM yyyy");
                EndTime = endDateTime.ToString("HH:mm");
            }

            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial,sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Your shift on <strong> " + OldstartDate + "</strong> at <strong> " + OldstartTime +" - "+ OldshiftTime + "</strong> has been updated to <strong> " + startTime + " - "+ EndTime + "</strong>. Please view changes on Wenodo HR mobile app.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p >");

            return EmailBody.ToString();
        }


        public string Schedule(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            int setting_Master_Id = Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.USER_SETTING.Tables[0].Rows[0]["SETTING_VALUE"]);
            DateTime startDateTime = DateTime.Parse(Params[2]);
            string scheduleDate = "";
            string scheduleTime = "";

            if (setting_Master_Id == 1)
            {
                scheduleDate = startDateTime.ToString("dd MMM yyyy");
                scheduleTime = startDateTime.ToString("hh:mm tt");
            }
            if (setting_Master_Id == 2)
            {
                scheduleDate = startDateTime.ToString("dd MMM yyyy");
                scheduleTime = startDateTime.ToString("HH:mm");
            }


            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial,sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">You have been assigned a shift on  <strong>" + scheduleDate + " </strong> at <strong> " + scheduleTime +".</strong> To view the details please go to <strong>Wenodo HR App > Schedule</strong>.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p>");

            return EmailBody.ToString();
        }

     

        public string ShiftDelete(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            int setting_Master_Id = Convert.ToInt32(USER_DETAILSObj.CreateNotification_Details.USER_SETTING.Tables[0].Rows[0]["SETTING_VALUE"]);
            DateTime scheduleDate = DateTime.Parse(Params[2]);
            string shiftDate = "";
            string shiftTime = "";
            if (setting_Master_Id == 1)
            {
                shiftDate = scheduleDate.ToString("dd MMM yyyy");
                shiftTime = scheduleDate.ToString("hh:mm tt");
            }
            if (setting_Master_Id == 2)
            {
                shiftDate = scheduleDate.ToString("dd MMM yyyy");
                shiftTime = scheduleDate.ToString("HH:mm");
            }
            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial,sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Your shift on <strong> " + shiftDate + "</strong> at <strong>  " + shiftTime + "</strong> has been cancelled. Please view changes on Wenodo HR mobile app.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p >");

            return EmailBody.ToString();
        }



        public string Feed(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();

            EmailBody.Append(" " + Convert.ToString(Params[1]) + " " + Convert.ToString(Params[2]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">" + Convert.ToString(Params[0]) + " has posted a new feed - " + Convert.ToString(Params[5]) + " on " + Convert.ToString(Params[5]) + ". You may be required details please go to <strong>Wenodo HR App > Schedule</strong>.</p>");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-left:20px; padding-right:20px;line-height:20px;white-space:nowrap;\">" + Convert.ToString(Params[2]) + ",<br> " + Convert.ToString(Params[2]) + ",<br>" + Convert.ToString(Params[3]) + ".</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,< br> Site Manager" + "</p>");

            return EmailBody.ToString();
        }
        public string EventUpdate(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();

            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">" + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]) + " is celebrating <strong>" + Convert.ToString(Params[2]) + "</strong> today.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Site Manager</p >");
            return EmailBody.ToString();
        }

        public string NotificationSuccessful(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[1]) + " " + Convert.ToString(Params[2]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family: Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;\">You have been successfully hired as an employee in the Wenodo HR App for " + Convert.ToString(Params[0]) + " site. Your start date is <strong>" + Convert.ToString(Params[6]) + "</strong>.  Request you to please use the below link to access the HR App.<br><br/>You will be asked to set your password on first login.<br>");
            EmailBody.Append("<a href=\""+ USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"\"><br/><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Click_here.png\" border=\"0;padding-left:20px; padding-right:20px;\"></img><br/></a><br> If the above button does not open the app, request you to please copy and paste the below link on your browser address bar.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"\">" + USER_DETAILSObj.CreateNotification_Details.APPURL + "</a>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br>"+ Convert.ToString(Params[4]) +" "+ Convert.ToString(Params[5]) +"</p >");

            return EmailBody.ToString();
        }

        public string NewTeamMember(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family: Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">" + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]) + " has joined your team on <strong>" + Convert.ToString(Params[2]) + "</strong>. Please join us in welcoming him/her to " + Convert.ToString(Params[3]) + ".</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Warm regards,<br> HR Manager</p >");
            return EmailBody.ToString();
        }

        public string DocumentRequest(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();


            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">Employee " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]) + " has requested for an employer letter for " + Convert.ToString(Params[2]) + " Please see below comment linked to the request: </p>");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-left:20px; padding-right:20px;line-height:20px;padding:20px 0px;\">Document Request Comment -  " + Convert.ToString(Params[3]) + " <br/> Please note that all such requests will have to be fulfilled offline over email.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Wenodo HR " + "</p>");

            return EmailBody.ToString();
        }

       


        public string RequestForLeaveApproval(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[0]) + " " + Convert.ToString(Params[1]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px; padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-top:20px;padding-bottom:20px;line-height:20px;\">A leave request is pending action by you. Request you to please review and take action by logging into Wenodo HR App. Following are the details of the request:</p>");
            EmailBody.Append("<p style=\"font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;padding-left:20px; padding-right:20px;line-height:20px;padding: 20px 0px;\">Full Name: " + Convert.ToString(Params[2]) + " " + Convert.ToString(Params[3]) + "<br/><br/> Leave Type: " + Convert.ToString(Params[8]) + " <br><br> Start Date:<strong> " + Convert.ToString(Params[4]) + "</strong> <br><br>End Date: <strong>" + Convert.ToString(Params[5]) + "</strong> <br><br>Total Duration:<strong> " + Convert.ToString(Convert.ToDecimal(Params[6])) + " - " + Convert.ToString(Params[7]) + "</strong>.</p>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Wenodo HR </p >");

            return EmailBody.ToString();
        }

        public string ResetPassword(String[] Params)
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(" " + Convert.ToString(Params[0]));
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family: Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;\">");
            EmailBody.Append("<p style=\"color:#333333;font-size:12px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;padding-top:20px;padding-bottom:20px;\">We have received a password reset request for your Wenodo app access. <br/>We understand how important it is to have a safe and secure ecosystem. Hence, here is your validation link to validate your account and set a new password.");
            EmailBody.Append("<a href=\""+ USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"\"><br><br><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Click_here.png\" border=\"0;padding-left:20px; padding-right:20px;\"></img><br/></a><br> If the above button does not open the validation page, request you to please copy and paste the below link on your browser address bar.<br>");
            EmailBody.Append("<a href=\"" + USER_DETAILSObj.CreateNotification_Details.APPURL + "\" style=\"\">" + USER_DETAILSObj.CreateNotification_Details.APPURL + "</a>");
            EmailBody.Append("<p style=\"font-size:14px;font-family:Montserrat, Helvetica, Arial, sans-serif;line-height:20px;white-space:nowrap;font-weight:600;\">Regards,<br> Team Wenodo" + "</p>");

            return EmailBody.ToString();
        }
    }


}
