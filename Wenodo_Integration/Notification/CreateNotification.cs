using Newtonsoft.Json;
using Notification.EmailBody;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;


namespace Notification
{
    public class CreateNotification
    {
        public CreateNotification_Details CreateObj { get; set; }
        string EMP_WESITE_URL = null;
        public string CreateEmailNotification()
        {
            CreateObj.APPURL = Convert.ToString(CreateObj.dr_Notification["URL"]);//"https://demo.wenodo.com/";
            EMP_WESITE_URL = CreateObj.APPURL.ToString();
            StringBuilder SBObj = new StringBuilder();
            if (CreateObj.Notification_ID == 72)
            {
                string EmailBody = CreateEmailBody();
                SBObj.Append(EmailBody);
            }
            else
            {
                string EmailBody = CreateEmailBody();
                if (EmailBody != "")
                {
                    SBObj.Append(CreateEmailHeader());
                    SBObj.Append(EmailBody);
                    SBObj.Append(CreateEmailFooter());
                }
            }
            return SBObj.ToString();
        }

        string CreateEmailHeader()
        {
            StringBuilder EmailHeader = new StringBuilder();
            EmailHeader.Append("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" /><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style type=\"text/css\">#outlook a {padding: 0;}body {margin: 0;padding: 0;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}</style><link href=\"https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap\" rel=\"stylesheet\" type=\"text/css\"><style type=\"text/css\">@import url(https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap);</style></head><body style=\"background-color:#fff;\"><table border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:100%;height:100%;\" align=\"center\"><tbody><tr><td style=\"vertical-align:top;background-color:#f4f4f4;padding-bottom:50px\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"" + GetHeaderParams(CreateObj.Notification_ID)[0] + "\"><tbody><tr><td style=\"text-align:center;padding-top:40px;padding-bottom:20px;\"><img src=\"");
            EmailHeader.Append(CreateObj.LOGOURL);

            if (Convert.ToString(CreateObj.dr_Notification["USER_NAME"]) == "")
            {
                EmailHeader.Append("\"width=\"150\"></td></tr><tr><td style=\"background-color:#fff;padding-bottom:20px;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"" + GetHeaderParams(CreateObj.Notification_ID)[1] + "\"><tbody><tr><td style=\"color:#333333;font-size:25px; font-weight:500;font-family:Montserrat, sans-serif;padding:20px;padding-bottom:0;line-height:20px;\"> " + GetHeaderParams(CreateObj.Notification_ID)[2]);
            }
            else
            {
                if (CreateObj.Notification_ID == 73)
                {
                    EmailHeader.Append("\"width=\"150\"><div style=\"display: block; font-size: 14px;font-family:Montserrat,Helvetica, Arial,sans-serif;font-weight:bold;\">" + CreateObj.dr_Notification["ENTITY_NAME"] + "</div></td></tr><tr><td style=\"background-color:#fff;padding-bottom:20px;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"" + GetHeaderParams(CreateObj.Notification_ID)[1] + "\"><tbody><tr><td style=\"color:#333333;font-size:20px; font-weight:500;font-family:Lato, sans-serif;padding-top: 20px;;padding-bottom:0;line-height:20px;\"> " + GetHeaderParams(CreateObj.Notification_ID)[2] + " ");
                }
                else
                {
                    EmailHeader.Append("\"width=\"150\"></td></tr><tr><td style=\"background-color:#fff;padding-bottom:20px;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"" + GetHeaderParams(CreateObj.Notification_ID)[1] + "\"><tbody><tr><td style=\"color:#333333;font-size:25px; font-weight:500;font-family:Lato, sans-serif;padding:20px;padding-bottom:0;line-height:20px;\"> " + GetHeaderParams(CreateObj.Notification_ID)[2] + " ");
                }
            }
            //EmailHeader.Append(CreateObj.EmailHeaderText);
            //EmailHeader.Append("&nbsp;</b></span></p></th></tr></thead>");
            return EmailHeader.ToString();
        }

        string[] GetHeaderParams(int NotificationID)
        {
            const int stringsize = 3;
            switch (NotificationID)
            {
                case 17:
                    return new string[stringsize] { "570", "520", "Dear" };
                case 46:
                    return new string[stringsize] { "570", "520", "Dear User" };
                case 55:
                    return new string[stringsize] { "600", "600", "Dear User" };//["Parent Table Header Width","Child Table Header Width", "Salutation"]
                case 56:
                    return new string[stringsize] { "600", "600", "Hi" };
                case 57:
                    return new string[stringsize] { "570", "520", "Hi" };
                case 74:
                case 75:
                case 76:
                case 77:
                case 78:
                case 79:
                case 80:
                case 81:
                case 82:
                case 83:
                case 84:
                case 85:
                case 87:
                case 88:
                case 89:
                case 90:
                    return new string[stringsize] { "600", "600", "Hi" };
                default:
                    return new string[stringsize] { "570", "520", "Dear" };

            }
        }
        string CreateEmailBody()
        {
            string EmailBody = "";
            string[] parameters = { };
            string[] stringSeparators = new string[] { ":;:" };
            string[] stringAttachmentSeparators = new string[] { "-:-" };
            string PO_PDF_GENERATION_URL = "https://prodp2papi.wenodo.com/api/PO/UPD_PO_PDF_GENERATION_STATUS";

            Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
            CreateObj.Attachment_Flag = false;
            CreateObj.IS_SEND_TO_FIREBASE = false;
            CreateObj.IS_AUTO_ENTRY = false;
            DataAccessLayer _objDataAccessLayer = new DataAccessLayer();
            User UserObj = new User();

            RestRequest restRequest;
            RestClient restClient;
            IRestResponse restResponse;
            DataTable dt = new DataTable(); dt.Columns.Add(new DataColumn("TABLE_ID", typeof(Int32)));
            DataRow row = dt.NewRow(); row["TABLE_ID"] = 46; dt.Rows.Add(row);

            switch (CreateObj.Notification_ID)
            {
                #region----"Set Password"-----
                case 1:

                    CreateObj.ButtonText = "Set Password";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.APPURL = CreateObj.APPURL + "/Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    //CreateObj.ds_Emp_Information
                    EmailBody = UserObj.WelcomeEmail();
                    //  Obj.dt=NotificationDataTable
                    break;
                #endregion
                case 2:
                    UserObj = new User();
                    CreateObj.ButtonText = "Reset Password";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.APPURL = CreateObj.APPURL + "/Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    EmailBody = UserObj.ResetPassword();
                    break;
                case 3:
                    UserObj = new User();
                    CreateObj.ButtonText = "Login";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.UPDATE_TIME = CreateObj.dr_Notification["PARAMETER_FOR_SRVC"].ToString().Substring(0, 11);
                    CreateObj.APPURL = CreateObj.APPURL + "/Login/";
                    //EmailBody = UserObj.UpdatePasswordSuccssfully();
                    break;
                #region----"Upload Successful"------ 
                case 4:

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj4 = new WeFyle();
                    Obj4.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj4.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj4.Wefyle_DetailsObj.Type = parameters[0];
                    Obj4.Wefyle_DetailsObj.Title = parameters[1];
                    EmailBody = Obj4.FileUploadedSuccess();
                    break;
                #endregion
                #region----"Awaiting Approval"------ 
                case 5:

                    CreateObj.ButtonText = "Approve";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj5 = new WeFyle();
                    Obj5.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj5.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj5.Wefyle_DetailsObj.Type = parameters[0];
                    Obj5.Wefyle_DetailsObj.UploadedBy = parameters[1];
                    Obj5.Wefyle_DetailsObj.Title = parameters[2];
                    EmailBody = Obj5.FileWaitingForApproval();
                    break;
                #endregion
                case 6:

                    CreateObj.ButtonText = "Approved";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj6 = new WeFyle();
                    Obj6.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj6.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //Obj6.Wefyle_DetailsObj.Type = parameters[0];
                    //Obj6.Wefyle_DetailsObj.UploadedBy = parameters[1];
                    //Obj6.Wefyle_DetailsObj.Title = parameters[2];
                    //EmailBody = Obj6.FileApprovedToApprover();
                    break;
                #region---"File Approved"----
                case 7:

                    CreateObj.ButtonText = "Login";
                    //CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj7 = new WeFyle();
                    Obj7.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj7.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj7.Wefyle_DetailsObj.ApprovedBy = parameters[0];
                    Obj7.Wefyle_DetailsObj.Title = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_ID$", Obj7.Wefyle_DetailsObj.ApprovedBy);
                    EmailBody = Obj7.FileApprovedSucessToUploader();
                    break;
                #endregion
                case 8:

                    CreateObj.ButtonText = "Login";
                    //CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj8 = new WeFyle();
                    Obj8.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj8.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //Obj8.Wefyle_DetailsObj.ApprovedBy = parameters[0];
                    //Obj8.Wefyle_DetailsObj.Title = parameters[1];
                    //CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_ID$", Obj8.Wefyle_DetailsObj.ApprovedBy);
                    //EmailBody = Obj8.FileRejectedToApprover();
                    break;
                #region---"File Rejected"----
                case 9:

                    CreateObj.ButtonText = "Login";
                    // CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle Obj9 = new WeFyle();
                    Obj9.Wefyle_DetailsObj = new Wefyle_Details();
                    Obj9.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj9.Wefyle_DetailsObj.ApprovedBy = parameters[0];
                    Obj9.Wefyle_DetailsObj.Title = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_ID$", Obj9.Wefyle_DetailsObj.ApprovedBy);
                    EmailBody = Obj9.FileRejected();
                    break;
                #endregion
                #region---"Cashup Reminder"----
                case 10:

                    CreateObj.ButtonText = "Login";
                    CashUp Obj10 = new CashUp();
                    Obj10.Cashup_DetailsObj = new Cashup_Details();
                    Obj10.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj10.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj10.Cashup_DetailsObj.SESSION_NAME = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj10.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj10.Cashup_DetailsObj.SESSION_NAME);
                    EmailBody = Obj10.CashupEntryReminder();
                    break;
                #endregion
                #region---"Cashup Entry Success"----
                case 11:

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CashUp Obj11 = new CashUp();
                    Obj11.Cashup_DetailsObj = new Cashup_Details();
                    Obj11.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj11.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj11.Cashup_DetailsObj.SESSION_NAME = parameters[1];
                    EmailBody = Obj11.CashupEntrySuccess();
                    break;
                #endregion
                #region---"Cashup Pending Approval"----
                case 12:

                    CreateObj.ButtonText = "Approve";
                    CashUp Obj12 = new CashUp();
                    Obj12.Cashup_DetailsObj = new Cashup_Details();
                    Obj12.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    Obj12.Cashup_DetailsObj.CASHUP_DATE = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj12.Cashup_DetailsObj.CASHUP_DATE);
                    EmailBody = Obj12.CashupPendingApproval();
                    break;
                #endregion
                case 13:

                    CreateObj.ButtonText = "Approved";
                    CashUp Obj13 = new CashUp();
                    Obj13.Cashup_DetailsObj = new Cashup_Details();
                    Obj13.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    Obj13.Cashup_DetailsObj.CASHUP_DATE = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]);
                    //CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj13.Cashup_DetailsObj.CASHUP_DATE);
                    //EmailBody = Obj13.CashupApprovedToApprover();
                    break;
                #region---"Cashup Approved"----
                case 14:

                    CreateObj.ButtonText = "Login";
                    CashUp Obj14 = new CashUp();
                    Obj14.Cashup_DetailsObj = new Cashup_Details();
                    Obj14.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj14.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj14.Cashup_DetailsObj.ACTIONBY = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj14.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj14.Cashup_DetailsObj.ACTIONBY);
                    EmailBody = Obj14.CashupApprovedToUploader();
                    break;
                #endregion
                case 15:

                    CreateObj.ButtonText = "Login";
                    CashUp Obj15 = new CashUp();
                    Obj15.Cashup_DetailsObj = new Cashup_Details();
                    Obj15.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj15.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj15.Cashup_DetailsObj.ACTIONBY = parameters[1];
                    //CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj15.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj15.Cashup_DetailsObj.ACTIONBY);
                    //EmailBody = Obj15.CashupRejectedToApprover();
                    break;
                #region---"Cashup Rejected"----
                case 16:

                    CreateObj.ButtonText = "Login";
                    CashUp Obj16 = new CashUp();
                    Obj16.Cashup_DetailsObj = new Cashup_Details();
                    Obj16.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj16.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj16.Cashup_DetailsObj.ACTIONBY = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj16.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj16.Cashup_DetailsObj.ACTIONBY);
                    EmailBody = Obj16.CashupRejectedToUploader();
                    break;
                #endregion
                #region---"Employee Registration + Assing new entity"----
                case 17:
                    UserObj = new User();

                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.Email_Subject = CreateObj.Email_Subject.Replace("$ENTITY_NAME$", CreateObj.dr_Notification["ENTITY_NAME"].ToString());
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.None);//Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    if (parameters[0].ToString() != "" && parameters[1].ToString() != "")//for employee registration
                    {
                        CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    }
                    else // for assign new entity
                        CreateObj.APPURL = string.Empty;

                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(Convert.ToInt32(CreateObj.dr_Notification["NOTIFICATION_MASTER_ID"]), Convert.ToInt32(parameters[3]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    if (Convert.ToInt32(parameters[5]) == 1)
                    {
                        CreateObj.ButtonText = "Set Password";
                        EmailBody = UserObj.HR_WelcomeEmail_Employee(1, parameters);
                        EmailBody = EmailBody.Replace("[Company Name]", CreateObj.dr_Notification["ENTITY_NAME"].ToString());
                    }
                    else
                    {
                        if (parameters[0].ToString() == "" && parameters[1].ToString() == "")
                        {
                            CreateObj.ButtonText = "Login";
                        }
                        else
                            CreateObj.ButtonText = "";

                        EmailBody = UserObj.HR_WelcomeEmail_Employee(0, parameters);
                    }

                    //EmailBody = UserObj.HR_WelcomeEmail_Employee();
                    StringBuilder Emp_Information = new StringBuilder(EmailBody);
                    Emp_Information.Replace("[company name]", parameters[4].ToString());
                    EmailBody = Emp_Information.ToString();
                    break;
                #endregion
                #region---"Self Leave Submitted  (To Employee)"---
                case 18:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.LEAVE_EMAIL_TO_EMP();
                    break;
                #endregion
                #region---"Leave Pending For Approval (To Manager)"---
                case 19:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.LEAVE_EMAIL_TO_MANAGER();

                    StringBuilder Leave_Information = new StringBuilder(EmailBody);
                    break;
                #endregion
                #region---"Leave Approved By Manager  (To Employee)"---
                case 20:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.MANAGER_NAME = parameters[1].ToString();
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.LEAVE_APPROVED_EMP_MAIL();
                    break;
                #endregion
                #region---"Leave Approved Successfully (To Manager)"----
                case 21:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.LEAVE_APPROVED_MANAGER_MAIL();

                    break;
                #endregion
                #region---"Leave Rejected By Manager  (To Employee)"---
                case 22:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.MANAGER_NAME = parameters[1].ToString();
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "REJECTED";
                    EmailBody = UserObj.LEAVE_REJECT_EMP_MAIL();
                    break;
                #endregion
                #region---"Leave Rejected Successfully (To Manager)"---
                case 23:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "REJECTED";

                    EmailBody = UserObj.LEAVE_REJECT_MANAGER_MAIL();

                    break;
                #endregion
                #region---"Leave Cancelled Successfully By Employee  (To Employee)"---
                case 24:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "CANCELLED";

                    EmailBody = UserObj.LEAVE_CANCELED_EMP_MAIL();
                    break;
                #endregion
                #region---"Leave Request Cancelled By Employee (To Manager)"---
                case 25:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "CANCELLED";

                    EmailBody = UserObj.LEAVE_CANCELED_MANAGER_MAIL();
                    break;
                #endregion
                #region---"Leave Request Cancelled By Manager  (To Employee)"---
                case 26:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.MANAGER_NAME = parameters[1];
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "CANCELLED";

                    EmailBody = UserObj.LEAVE_CANCELED_BY_MANAGER_EMP_MAIL();

                    break;
                #endregion
                #region---"Leave Cancelled Successfully By Manager (To Manager)"---
                case 27:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "CANCELLED";

                    EmailBody = UserObj.LEAVE_CANCELED_BY_MANAGER_MANAGER_MAIL();
                    break;
                #endregion
                #region---"Leave recorded Successfully (To Employee)"---
                case 28:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";

                    EmailBody = UserObj.LEAVE_APPLY_BY_MANAGER_FOR_EMP_EMP_MAIL();

                    break;
                #endregion
                #region---"Leave recorded Successfully (To Manager)"---
                case 29:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";

                    EmailBody = UserObj.LEAVE_APPLY_BY_MANAGER_FOR_EMP_MANAGER_MAIL();
                    break;
                #endregion
                #region---"Thanks For Your Service"---
                case 30:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";

                    EmailBody = UserObj.TERMINATION_OF_EMP_MAIL();

                    break;
                #endregion
                #region---"Terminate "---
                case 31:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.TERMINATION_OF_EMP_MANAGER_MAIL();

                    break;
                #endregion
                #region---"Profile Update Mail to Manager"---
                case 32:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PROFILE_UPDATE_MANAGER_MAIL(parameters);
                    break;
                #endregion
                #region---"Profile Update Mail to Employee"---
                case 33:
                    UserObj = new User();
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ds_Emp_Information = GET_LEAVE_REQUEST_BY_ID(Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PROFILE_UPDATE_EMPLOYEE_MAIL(parameters);
                    break;
                #endregion

                #region --Invite Employee--
                case 34://Invite Employee
                    UserObj = new User();
                    CreateObj.ButtonText = "Submit Application";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    if (parameters.Length > 3)
                    {
                        UserObj.USER_DETAILSObj.NAME = parameters[2] + ' ' + parameters[3];
                    }
                    else
                    {
                        UserObj.USER_DETAILSObj.NAME = parameters[2];
                    }
                    CreateObj.APPURL = CreateObj.APPURL + "/Plain/index#!/EmpSignUp?T_ID=" + parameters[0];
                    EmailBody = UserObj.InviteEmployee();

                    break;
                #endregion
                #region --Application Submitted By Applicant 
                case 35:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //CreateObj.APPURL = CreateObj.APPURL + "/Plain/index#!/EmpSignUp?T_ID=" + parameters[1];

                    if (parameters.Length > 2)
                        EmailBody = UserObj.APPLICATION_SUBMITTED(parameters[1] + ' ' + Convert.ToString(parameters[2]));
                    else
                        EmailBody = UserObj.APPLICATION_SUBMITTED(parameters[1]);


                    break;
                #endregion
                #region -- [Cashup fallout] --
                case 36:
                    UserObj = new User();
                    CreateObj.ButtonText = "";
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_2$", parameters[1].ToString()).Replace("$PARAMETER_3$", parameters[2]);
                    EmailBody = UserObj.CASHUP_INTEGRATION_FALLOUT_NOTIFICATION_EMAIL(parameters);

                    break;
                #endregion
                #region -- [Publish Shift Email] --
                case 37:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]) + Convert.ToString(" From " + parameters[0].ToString() + " To " + parameters[1].ToString());
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    //UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.ROTA_PUBLISH_SHIFT_EMAIL();
                    break;
                #endregion
                #region -- [Approve Shift Email] --
                case 38:
                    UserObj = new User();
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    //UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.ROTA_APPROVED_SHIFT_EMAIL();
                    break;
                #endregion
                #region -- [Revert Approved Shift Email] --
                case 39:
                    UserObj = new User();
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    //UserObj.USER_DETAILSObj.LEAVE_STATUS = "APPROVED";
                    EmailBody = UserObj.ROTA_REVERT_APPROVED_SHIFT_EMAIL();
                    break;
                #endregion
                #region-- Probation Period Email
                case 40:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PROBATION_REMINDER_MAIL(parameters);
                    break;
                #endregion
                #region -- Marketman Integration errors
                case 41:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = "Team";
                    CreateObj.ds_Emp_Information = GET_DATA_FOR_MRKTMN_NTFCTN(Convert.ToDecimal(parameters[0]), Convert.ToInt32(parameters[1]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.MARKET_MAN_INTEGRATION_EMAIL(parameters, CreateObj.ds_Emp_Information);
                    break;
                #endregion
                #region --Wefile reminder--
                case 44:

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    WeFyle ObjReminder = new WeFyle();
                    ObjReminder.Wefyle_DetailsObj = new Wefyle_Details();
                    ObjReminder.Wefyle_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    ObjReminder.Wefyle_DetailsObj.Title = parameters[0];
                    ObjReminder.Wefyle_DetailsObj.Date = parameters[1];
                    ObjReminder.Wefyle_DetailsObj.SendTo = parameters[2];
                    EmailBody = ObjReminder.WefileReminder();
                    break;
                #endregion
                #region -- [Invitation to setup light speed L series Integration] --
                case 45:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.MANAGER_NAME = CreateObj.dr_Notification["PARAMETER_FOR_SRVC"].ToString();
                    EmailBody = UserObj.Outh2Authentication();

                    break;
                #endregion
                #region -- [Email for Requesting Statement] --
                case 46:
                    UserObj = new User();

                    CreateObj.ButtonText = "";

                    UserObj.Xero_Model = new Xero_Model();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.Xero_Model.SUPPLIER_NAME = Convert.ToString(parameters[1]);
                    UserObj.Xero_Model.SUPPLIER_ACCOUNT = Convert.ToString(parameters[2]);
                    UserObj.Xero_Model.STATEMENT_DATE = Convert.ToDateTime(parameters[3]).ToShortDateString();
                    UserObj.Xero_Model.ENTITY_NAME = Convert.ToString(parameters[4]);
                    UserObj.Xero_Model.XERO_SUBJECT_ENTERED_BY_USER = GET_PYMNT_REQUEST_DATA_FOR_NTFCTN(Convert.ToDecimal(parameters[5]));



                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]) + " : " + UserObj.Xero_Model.XERO_SUBJECT_ENTERED_BY_USER.Tables[0].Rows[0]["SUBJECT"];
                    UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.RequestingStatement();
                    break;
                #endregion
                case 47:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.Xero_Model = new Xero_Model();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.Xero_Model.AMOUNT = Convert.ToString(parameters[0]);
                    UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PaymentScheduleForApproval();
                    break;
                case 48:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.Xero_Model = new Xero_Model();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.Xero_Model.AMOUNT = Convert.ToString(parameters[0]);
                    UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PaymentScheduleApprovedByApprover();
                    break;
                case 49:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.Xero_Model = new Xero_Model();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.Xero_Model.AMOUNT = Convert.ToString(parameters[0]);
                    UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PaymentScheduleRejectedByApprover();
                    break;
                case 50:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.ds_PetyCash_Information = GET_PETTY_CASH_DECLERATION_FOR_NTFCTN(Convert.ToDecimal(parameters[0]));

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Cashup_Approved_Attachment_Email(parameters, CreateObj.ds_PetyCash_Information);
                    break;
                case 51:
                    UserObj = new User();

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.Xero_Model = new Xero_Model();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    UserObj.Xero_Model.OTP = Convert.ToString(parameters[0]);
                    UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.OTP();
                    break;
                case 52:
                    UserObj = new User();
                    CreateObj.ButtonText = "";
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_2$", parameters[1].ToString()).Replace("$PARAMETER_3$", parameters[2]);
                    EmailBody = UserObj.CASHUP_INTEGRATION_FALLOUT_NOTIFICATION_EMAIL(parameters);
                    break;
                case 53:

                    CreateObj.ButtonText = "";
                    CashUp Obj53 = new CashUp();
                    Obj53.Cashup_DetailsObj = new Cashup_Details();
                    Obj53.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj53.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj53.Cashup_DetailsObj.ACTIONBY = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj53.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj53.Cashup_DetailsObj.ACTIONBY);
                    EmailBody = Obj53.CashupBankingApprovedToApprover();
                    break;
                case 54:

                    CreateObj.ButtonText = "";
                    CashUp Obj54 = new CashUp();
                    Obj54.Cashup_DetailsObj = new Cashup_Details();
                    Obj54.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj54.Cashup_DetailsObj.CASHUP_DATE = parameters[0];
                    Obj54.Cashup_DetailsObj.ACTIONBY = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj54.Cashup_DetailsObj.CASHUP_DATE).Replace("$PARAMETER_2$", Obj54.Cashup_DetailsObj.ACTIONBY);
                    EmailBody = Obj54.CashupBankingRejectedToApprover();
                    break;
                case 55:
                    UserObj = new User();
                    //UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.PYMNT_RECONSILE_STATEMENT = PYMNT_RECONSILE_STATEMENT_BY_ID(Convert.ToDecimal(parameters[0]), 0, false);

                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(parameters[2]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    //UserObj.Xero_Model.CreateNotification_Details = CreateObj;
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Email_Reconciliation(parameters, CreateObj.PYMNT_RECONSILE_STATEMENT, CreateObj.dr_Notification["CURRENCY_SYMBOL"].ToString());
                    break;
                case 56:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = parameters[0];
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(parameters[0]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Email_Fallout(parameters);
                    break;
                case 57:
                    UserObj = new User();
                    //parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.Email_Subject = parameters[0];
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = "Your email is now your Wenodo username";
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.PasswordRest_Successfully_Email();
                    break;
                case 58:
                    UserObj = new User();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.Email_Subject = parameters[0];
                    CreateObj.ButtonText = "Login";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Shift_Timing_Updates_Email(parameters);
                    break;
                #region --- Common Auto Entry---
                case 59:
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    if (parameters[2] != "")
                    {
                        string[] _supy_attachment_List = Convert.ToString(parameters[2]).Split(stringAttachmentSeparators, StringSplitOptions.RemoveEmptyEntries);

                        CreateObj.ButtonText = "";
                        UserObj = new User();
                        UserObj.USER_DETAILSObj = new USER_DETAILS();
                        DataAccessLayer _dataAccessLayer = new DataAccessLayer();
                        _dataAccessLayer.DataAccess_ModelObj = new DataAccess_Model();

                        _dataAccessLayer.DataAccess_ModelObj.CUSTOMER_ID = Convert.ToDecimal(CreateObj.dr_Notification["CUSTOMER_ID"]);
                        _dataAccessLayer.DataAccess_ModelObj.ENTITY_ID = Convert.ToDecimal(CreateObj.dr_Notification["ENTITY_ID"]);
                        _dataAccessLayer.DataAccess_ModelObj.BRANCH_ID = Convert.ToDecimal(CreateObj.dr_Notification["BRANCH_ID"]);
                        _dataAccessLayer.DataAccess_ModelObj.INTEGRATION_SYSTEM_ID = Convert.ToDecimal(30);
                        CreateObj.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH = _dataAccessLayer.GET_INTEGRATION_DETAILS_BY_CUST_ENT_BRNH(_dataAccessLayer);
                        CreateObj.Attachments = new List<AttachmentList>();
                        using (WebClient client = new WebClient())
                        {
                            foreach (string supyAttachment in _supy_attachment_List)
                            {
                                byte[] imageData = client.DownloadData(supyAttachment);
                                CreateObj.Attachments.Add(new AttachmentList { IMAGE_FROM_URL = new MemoryStream(imageData), IMAGE_FROM_URL_NAME = System.IO.Path.GetFileName(Uri.UnescapeDataString(supyAttachment.Split('?')[0])) });
                            }
                        }
                        CreateObj.EMAIL_TO = CreateObj.INTEGRATION_DETAILS_BY_CUST_ENT_BRNH.Tables[0].Rows[0]["URL_PARAMETERS"].ToString();
                        CreateObj.Attachment_Flag = true;
                        CreateObj.IS_AUTO_ENTRY = true;
                        CreateObj.TABLE_ID = Convert.ToDecimal(parameters[0]);
                        string _subjectString = string.Empty;
                        _subjectString = parameters[1] == "29" ? "Supy#" : "";
                        CreateObj.Email_Subject = _subjectString + CreateObj.dr_Notification["BRANCH_NAME"] + "#" + parameters[3];
                        UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                        UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                        EmailBody = UserObj.AutoEntry_Email(parameters);

                    }
                    else
                    {
                        CreateObj.Attachment_Flag = false;
                        EmailBody = "";
                    }
                    break;
                #endregion
                #region ---  Purchase Request For Approval ---
                case 60:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj60 = new CashUp();
                    Obj60.Cashup_DetailsObj = new Cashup_Details();
                    Obj60.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.IS_SEND_TO_FIREBASE = true;
                    CreateObj.P2P_USERTYPE = "Request";
                    EmailBody = Obj60.P2P_Appoval("Request", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[0] + " raised by " + parameters[1] + " for " + parameters[2] + " is waiting for your approval.";
                    break;
                #endregion
                #region ---  Requisition For Approval ---
                case 61:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj61 = new CashUp();
                    Obj61.Cashup_DetailsObj = new Cashup_Details();
                    Obj61.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.IS_SEND_TO_FIREBASE = true;
                    CreateObj.P2P_USERTYPE = "Requisition";
                    EmailBody = Obj61.P2P_Appoval("Requisition", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[0] + " raised by " + parameters[1] + " for " + parameters[2] + " is waiting for your approval.";
                    break;
                #endregion
                #region ---  Bill For Approval ---
                case 62:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj62 = new CashUp();
                    Obj62.Cashup_DetailsObj = new Cashup_Details();
                    Obj62.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.IS_SEND_TO_FIREBASE = true;
                    CreateObj.P2P_USERTYPE = "Bill";
                    EmailBody = Obj62.P2P_Appoval("Bill", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[0] + " raised by " + parameters[1] + " for " + parameters[2] + " is waiting for your approval.";
                    break;
                #endregion
                #region ---  New Supplier Creation Request ---
                case 63:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj63 = new CashUp();
                    Obj63.Cashup_DetailsObj = new Cashup_Details();
                    _objDataAccessLayer.DataAccess_ModelObj = new DataAccess_Model();
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();

                    Obj63.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.EMAIL_TO = parameters[1].ToString();
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.IS_SEND_TO_FIREBASE = false;
                    _objDataAccessLayer.DataAccess_ModelObj.TABLE_ID = Convert.ToDecimal(parameters[0]);

                    CreateObj.COMMON_DS = _objDataAccessLayer.GET_P2P_NEW_SUPPLIER_BY_ID(_objDataAccessLayer);
                    EmailBody = Obj63.P2P_NewSupplier(CreateObj, parameters);
                    CreateObj.Attachments = new List<AttachmentList>();
                    if (CreateObj.COMMON_DS.Tables[1].Rows.Count > 0)
                    {
                        Attached_DataLists(CreateObj.COMMON_DS.Tables[1], "");
                        CreateObj.Attachment_Flag = true;
                    }
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    break;
                #endregion
                #region ---  Purchase Request Rejeted ---
                case 64:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj64 = new CashUp();
                    Obj64.Cashup_DetailsObj = new Cashup_Details();
                    Obj64.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);

                    //CreateObj.IS_SEND_TO_FIREBASE = true;
                    CreateObj.P2P_USERTYPE = "Request";
                    EmailBody = Obj64.P2P_Approver("Request", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[1] + " has been rejected by " + parameters[2] + " (" + parameters[3] + ").";
                    break;
                #endregion
                #region ---  Requisition Rejected ---
                case 65:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj65 = new CashUp();
                    Obj65.Cashup_DetailsObj = new Cashup_Details();
                    Obj65.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    //CreateObj.IS_SEND_TO_FIREBASE = true;
                    Obj65.Cashup_DetailsObj.NUMBER = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj65.Cashup_DetailsObj.NUMBER);
                    CreateObj.P2P_USERTYPE = "Requisition";
                    EmailBody = Obj65.P2P_REJECTED("Requisition", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[1] + " has been rejected by " + parameters[2] + " (" + parameters[3] + ").";
                    break;
                #endregion
                #region ---  Bill Rejected ---
                case 66:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj66 = new CashUp();
                    Obj66.Cashup_DetailsObj = new Cashup_Details();
                    Obj66.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    Obj66.Cashup_DetailsObj.NUMBER = parameters[1];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", Obj66.Cashup_DetailsObj.NUMBER);
                    CreateObj.P2P_USERTYPE = "Bill";
                    EmailBody = Obj66.P2P_REJECTED("Bill", parameters);
                    CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[1] + " has been rejected by " + parameters[2] + " (" + parameters[3] + ").";
                    break;
                #endregion
                #region ---  PO PDF to supplier ---
                case 67:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj67 = new CashUp();
                    UserObj = new User();
                    Obj67.Cashup_DetailsObj = new Cashup_Details();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();

                    Obj67.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0]).Replace("$PARAMETER_2$", parameters[1]);
                    //CreateObj.IS_SEND_TO_FIREBASE = true;
                    CreateObj.EMAIL_TO = parameters[3];
                    CreateObj.P2P_USERTYPE = "Requisition";
                    EmailBody = Obj67.P2P_POPDF("Requisition", parameters);

                    //CreateObj.Email_Body_For_Mobile_Notification = CreateObj.P2P_USERTYPE + "# " + parameters[1] + " has been rejected by " + parameters[2] + " (" + parameters[3] + ").";

                    restClient = new RestClient(PO_PDF_GENERATION_URL);
                    restRequest = new RestRequest(Method.POST);
                    restRequest.AddParameter("application/json", Newtonsoft.Json.JsonConvert.SerializeObject(new Root_POPDF { PO_HDR_ID = Convert.ToInt32(parameters[2]) }), ParameterType.RequestBody);
                    restResponse = restClient.Execute(restRequest);
                    var returnJson = JsonConvert.DeserializeObject<string>(restResponse.Content);
                    CreateObj.Attachments = new List<AttachmentList>();
                    if (restResponse.Content.Length > 0)
                    {
                        Attached_DataLists(new DataTable(), returnJson.ToString());
                        CreateObj.Attachment_Flag = true;
                    }
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    break;
                #endregion
                #region --- PO Creation email to buyer and requestor ---
                case 68:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj68 = new CashUp();
                    Obj68.Cashup_DetailsObj = new Cashup_Details();
                    Obj68.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0]);
                    CreateObj.P2P_USERTYPE = "PO";
                    EmailBody = Obj68.P2P_PO_REQCreation("PO", parameters);
                    break;
                #endregion
                #region --- Requisition created to requestor ---
                case 69:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj69 = new CashUp();
                    Obj69.Cashup_DetailsObj = new Cashup_Details();
                    Obj69.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    CreateObj.P2P_USERTYPE = "REQ";
                    EmailBody = Obj69.P2P_PO_REQCreation("REQ", parameters);
                    break;
                #endregion
                #region --- Request approved to requestor ---
                case 70:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj70 = new CashUp();
                    Obj70.Cashup_DetailsObj = new Cashup_Details();
                    Obj70.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    EmailBody = Obj70.P2P_Approve_Request(parameters);
                    break;
                #endregion
                #region --- PR for processing to buyer ---
                case 71:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj71 = new CashUp();
                    Obj71.Cashup_DetailsObj = new Cashup_Details();
                    Obj71.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    EmailBody = Obj71.P2P_New_Purchase_Request(parameters);
                    break;
                #endregion
                #region---"Birthday Reminder"---
                case 72:
                    UserObj = new User();
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    //CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.BirthDayReminder();

                    break;
                #endregion
                #region---"Approval/Pending List"---
                case 73:
                    UserObj = new User();
                    CreateObj.ButtonText = "";
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    UserObj.USER_DETAILSObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.ds_Emp_Information = GET_DATA_FOR_NTFCTN(CreateObj.Notification_ID, Convert.ToInt32(parameters[0]));
                    DataAccessLayer _objDAL = new DataAccessLayer();
                    CreateObj._ds_Approved_Pending_List = _objDAL.GET_PENDING_APPROVAL_DATA_FOR_NTFCTN(parameters);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Pending_Approval_List(parameters);

                    break;
                #endregion



                #region--- NewTeamMember ---
                case 74:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);//.Replace("$PARAMETER_1$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.NewTeamMember(parameters);
                    break;

                #endregion

                #region--- 75 Profile Update ---
                case 75:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ProfileUpdate(parameters);
                    break;

                #endregion


                #region--- Compliance Expire ---
                case 76:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ComplianceExpire(parameters);
                    break;

                #endregion

                #region--- Schedule --- 
                case 77:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_3$", DateTime.Parse(parameters[2]).ToString("dd MMM yyyy"));
                    CreateObj.USER_SETTING = GET_CUSTOMER_SETTINGS(Convert.ToDecimal(CreateObj.dr_Notification["CUSTOMER_ID"]), dt, 24);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;       
                    EmailBody = UserObj.Schedule(parameters);
                    break;

                #endregion

                //#region--- Feed ---- 
                //case 78:
                //    CreateObj.ButtonText = "";
                //    UserObj = new User();
                //    UserObj.USER_DETAILSObj = new USER_DETAILS();
                //    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                //    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[1]);
                //    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                //    EmailBody = UserObj.Feed(parameters);
                //    break;

                //#endregion

                #region--- EventUpdate ---
                case 79:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0]).Replace("$PARAMETER_2$", parameters[1]).Replace("$PARAMETER_3$", parameters[2]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.EventUpdate(parameters);
                    break;
                #endregion
                #region--- Absence --- 
                case 80:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0]).Replace("$PARAMETER_2$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.Absence(parameters);
                    break;

                #endregion
                #region--- Clock-In --- 
                case 81:

                    //{ "TIME_ID": "1", "TIME_NAME": "12 Hour " },{ "TIME_ID": "2", "TIME_NAME": "24 Hour" },
                   

                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[1]);
                    CreateObj.USER_SETTING = GET_CUSTOMER_SETTINGS(Convert.ToDecimal(CreateObj.dr_Notification["CUSTOMER_ID"]), dt, 24);  
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ClockIn(parameters);
                    break;

                #endregion
                #region--- Onboarding Validation ---
                case 82:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_2$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.OnboardingValidation(parameters);
                    break;

                #endregion
                #region--- Employee Invitation ---
                case 83:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.APPURL = CreateObj.APPURL + "Hr/HRIndex#!/Invite_Personal_Details?passkey=" + parameters[3];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.EmployeeInvitation(parameters);
                    break;

                #endregion
                #region--- 84 Email Notification to manager ---
                case 84:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0].ToString()).Replace("$PARAMETER_2$", parameters[1].ToString());
                    // CreateObj.Email_Subject = Convert.ToString(CreateObj.Email_Subject).Replace("$PARAMETER_2$", parameters[1].ToString());
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.EmailNotificatonManager(parameters);
                    break;
                #endregion
                #region--- NotificationSuccessful ---
                case 85:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[3] + ":;:" + parameters[7];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.NotificationSuccessful(parameters);
                    break;

                #endregion
                #region--- Shift-Update --- 
                case 87:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_3$", parameters[2]);
                    CreateObj.USER_SETTING = GET_CUSTOMER_SETTINGS(Convert.ToDecimal(CreateObj.dr_Notification["CUSTOMER_ID"]), dt, 24);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ShiftUpdate(parameters);
                    break;

                #endregion

                #region--- Shift-Delete --- 
                case 88:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_3$", DateTime.Parse(parameters[2]).ToString("dd MMM yyyy"));
                    CreateObj.USER_SETTING = GET_CUSTOMER_SETTINGS(Convert.ToDecimal(CreateObj.dr_Notification["CUSTOMER_ID"]), dt, 24);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ShiftDelete(parameters);
                    break;
                #endregion

                

                #region--- DocumentRequest --- 
                case 89:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_1$", parameters[0]).Replace("$PARAMETER_2$", parameters[1]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.DocumentRequest(parameters);
                    break;

                #endregion

                #region--- RequestForLeaveApproval ---   
                case 90:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_3$", parameters[2]).Replace("$PARAMETER_4$", parameters[3]).Replace("$PARAMETER_7$", Convert.ToDecimal(parameters[6]).ToString()).Replace("$PARAMETER_8$", parameters[7]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.RequestForLeaveApproval(parameters);
                    break;
                #endregion
                #region--- ResetPassword ---
                case 91:
                    CreateObj.ButtonText = "";
                    UserObj = new User();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.APPURL = CreateObj.APPURL + "Login/SetPassword?x=" + parameters[1] + ":;:" + parameters[2];
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]);
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    EmailBody = UserObj.ResetPassword(parameters);
                    break;

                #endregion
                #region --- PO Creation email to buyer and requestor ---
                case 96:
                    CreateObj.ButtonText = "Login";
                    CashUp Obj96 = new CashUp();
                    UserObj = new User();
                    Obj96.Cashup_DetailsObj = new Cashup_Details();
                    UserObj.USER_DETAILSObj = new USER_DETAILS();
                    Obj96.Cashup_DetailsObj.NAME = Convert.ToString(CreateObj.dr_Notification["USER_NAME"]);
                    parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                    CreateObj.Email_Subject = Convert.ToString(CreateObj.dr_Notification["EMAIL_SUBJECT"]).Replace("$PARAMETER_0$", parameters[0]);
                    CreateObj.EMAIL_TO = parameters[3];
                    CreateObj.P2P_USERTYPE = "PO";
                    EmailBody = Obj96.P2P_PO_RECEIVER("PO", parameters);
                    restClient = new RestClient(PO_PDF_GENERATION_URL);
                    restRequest = new RestRequest(Method.POST);
                    restRequest.AddParameter("application/json", Newtonsoft.Json.JsonConvert.SerializeObject(new Root_POPDF { PO_HDR_ID = Convert.ToInt32(parameters[1]) }), ParameterType.RequestBody);
                    restResponse = restClient.Execute(restRequest);
                    var return1Json = JsonConvert.DeserializeObject<string>(restResponse.Content);
                    CreateObj.Attachments = new List<AttachmentList>();
                    if (restResponse.Content.Length > 0)
                    {
                        Attached_DataLists(new DataTable(), return1Json.ToString());
                        CreateObj.Attachment_Flag = true;
                    }
                    UserObj.USER_DETAILSObj.CreateNotification_Details = CreateObj;
                    break;
                    #endregion
              

                default:
                    break;
            }
            return EmailBody;
        }
        string CreateEmailFooter()
        {

            string[] parameters = { };
            string[] stringSeparators = new string[] { ":;:" };
            parameters = Convert.ToString(CreateObj.dr_Notification["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.None);

            StringBuilder EmailFooter = new StringBuilder();
            EmailFooter.Append("<br></td></tr><tr><td align=\"center\" style=\"padding-top:2px;padding-bottom:0px;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td  width=\"150px\" style=\"padding:8px;\"><a href=\"https://wenodo.com/contact-us/\" target =\"_blank\" ><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Contact.png\" border =\"0\"> </a>");
            if (CreateObj.ButtonText != "")
            {
                EmailFooter.Append("</td><td width=\"150px\" style=\"padding:10px;\"><a href=\"");
                EmailFooter.Append(CreateObj.APPURL);
                EmailFooter.Append("\" target=\"_blank\">");
                //EmailFooter.Append(CreateObj.ButtonText);

                if (CreateObj.Notification_ID == 1)
                {
                    EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Set.png\" border =\"0\" /></a>");
                }
                if (CreateObj.Notification_ID == 2)
                {
                    EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Reset.png\" border =\"0\" /></a>");
                }
                if (CreateObj.Notification_ID == 5 || CreateObj.Notification_ID == 12)
                {
                    EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Approve.png\" border =\"0\" /></a>");
                }
                if (CreateObj.Notification_ID == 3 || CreateObj.Notification_ID == 7 || CreateObj.Notification_ID == 9 || CreateObj.Notification_ID == 10 || CreateObj.Notification_ID == 14 || CreateObj.Notification_ID == 16 || CreateObj.Notification_ID == 58
                    || CreateObj.Notification_ID == 60 || CreateObj.Notification_ID == 61 || CreateObj.Notification_ID == 62 || CreateObj.Notification_ID == 63 || CreateObj.Notification_ID == 64 || CreateObj.Notification_ID == 65 || CreateObj.Notification_ID == 66 || CreateObj.Notification_ID == 67 || CreateObj.Notification_ID == 68 || CreateObj.Notification_ID == 69 || CreateObj.Notification_ID == 70 || CreateObj.Notification_ID == 71)
                {
                    EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Login.png\" border =\"0\" /></a>");
                }
                if (CreateObj.Notification_ID == 34)
                {
                    EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Submit.png\" border =\"0\" /></a>");
                }

                if (CreateObj.Notification_ID == 1 || CreateObj.Notification_ID == 2)
                {
                    EmailFooter.Append("</td></tr><tr><td colspan=\"2\" style=\"width:300px;word-break: break-all;font-family:Lato,sans-serif;padding: 0 10px;\" ><p style=\"margin: 5px 0px;\">Click below URL or copy and paste in browser</p><a href=\"" + CreateObj.APPURL + "\" style=\"color:#000\" target=\"_blank\">" + CreateObj.APPURL + "</a></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:white;padding-top:10px;padding-bottom:30px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr></tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Lato, sans-serif !important;text-align:center;line-height:18px;\">Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");
                }
                if (CreateObj.Notification_ID == 17)
                {
                    if (parameters[5].ToString() == "1")
                    {
                        EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Set.png\" border =\"0\" /></a>");
                        EmailFooter.Append("</td></tr><tr><td colspan=\"2\" style=\"width:300px;word-break: break-all;font-family:Lato,sans-serif;padding: 0 10px;\" ><p style=\"margin: 5px 0px;\">Click below URL or copy and paste in browser</p><a href=\"" + CreateObj.APPURL + "\" style=\"color:#000\" target=\"_blank\">" + CreateObj.APPURL + "</a></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:white;padding-top:10px;padding-bottom:30px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr></tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Lato, sans-serif !important;text-align:center;line-height:18px;\">Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");
                    }
                    else
                    {
                        EmailFooter.Append("<img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/Email/Login.png\" border =\"0\" /></a>");
                        EmailFooter.Append("</td></tr><tr><td colspan=\"2\" style=\"width:300px;word-break: break-all;font-family:Lato,sans-serif;padding: 0 10px;\" ><p style=\"margin: 5px 0px;\"></td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:white;padding-top:10px;padding-bottom:30px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr></tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Lato, sans-serif !important;text-align:center;line-height:18px;\">Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");

                    }

                }
                else
                {
                    EmailFooter.Append("</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:white;padding-top:10px;padding-bottom:30px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td><br/><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr></tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Lato, sans-serif !important;text-align:center;line-height:18px;\">Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");
                }

            }
            else
            {
                EmailFooter.Append("</td></tr></tbody></table></td></tr></tbody></table></td></tr><tr><td style=\"background-color:white;padding-top:0px;padding-bottom:10px;border-top:1px solid #F0F2F4;\"><table align=\"center\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td><br/><a href=\"https://wenodo.com/\" target=\"_blank\" style=\"text-decoration:none;\"><img data-imagetype=\"External\" src=\"https://app.wenodo.com/E_Content/images/logo.png\" border=\"0\" width=\"150\"></a></td></tr></tbody></table><table align=\"center\" width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\"><tbody><tr><td style=\"color:#999999;font-size:12px;font-family:Montserrat, sans-serif !important;text-align:center;line-height:18px;\">Call: 02080377700 | Email: support@wenodo.com</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>");
            }
            return EmailFooter.ToString();
        }

        System.Data.DataSet GET_DATA_FOR_NTFCTN(Int32 NOTIFICATION_ID, Int32 EMP_PRS_ID)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_DATA_FOR_NTFCTN(NOTIFICATION_ID, EMP_PRS_ID);
        }
        System.Data.DataSet GET_LEAVE_REQUEST_BY_ID(Int32 TABLE_ID)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_LEAVE_REQUEST_BY_ID(TABLE_ID);
        }
        System.Data.DataSet GET_DATA_FOR_MRKTMN_NTFCTN(Decimal MM_LOGS_ID, int TYPE)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_DATA_FOR_MRKTMN_NTFCTN(MM_LOGS_ID, TYPE);
        }
        System.Data.DataSet GET_PETTY_CASH_DECLERATION_FOR_NTFCTN(Decimal CASHUP_MAIN_ID)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_PETTY_CASH_DECLERATION_FOR_NTFCTN(CASHUP_MAIN_ID);
        }
        System.Data.DataSet GET_PYMNT_REQUEST_DATA_FOR_NTFCTN(Decimal PYMNT_REQUEST_ID)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_PYMNT_REQUEST_DATA_FOR_NTFCTN(PYMNT_REQUEST_ID);
        }
        System.Data.DataSet PYMNT_RECONSILE_STATEMENT_BY_ID(decimal STATEMENT_ID, decimal USER_ID, bool RECONCILE_FLAG)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.PYMNT_RECONSILE_STATEMENT_BY_ID(STATEMENT_ID, USER_ID, RECONCILE_FLAG);
        }
        System.Data.DataSet GET_CUSTOMER_SETTINGS(decimal UCSTOMER_ID, DataTable USER_SETTING,decimal MODULE_ID)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_CUSTOMER_SETTINGS(UCSTOMER_ID, USER_SETTING, MODULE_ID);
        }

        public void Attached_DataLists(DataTable DT_AttachmentData, string StringURL)
        {
            if (DT_AttachmentData.Rows.Count > 0)
            {
                using (WebClient client = new WebClient())
                {
                    foreach (DataRow Attachment in DT_AttachmentData.Rows)
                    {
                        byte[] fileData = client.DownloadData(CreateObj.APPURL + "p2pfiles" + Attachment["FILE_PATH"].ToString() + Attachment["SERVER_FILE_NAME"].ToString());
                        CreateObj.Attachments.Add(new AttachmentList { IMAGE_FROM_URL = new MemoryStream(fileData), IMAGE_FROM_URL_NAME = Convert.ToString(Attachment["ORIGINAL_FILE_NAME"]) });
                    }
                }
            }
            if (StringURL != "")
            {
                using (WebClient client = new WebClient())
                {
                    byte[] fileData = client.DownloadData("https://app.wenodo.com/" + StringURL);
                    CreateObj.Attachments.Add(new AttachmentList { IMAGE_FROM_URL = new MemoryStream(fileData), IMAGE_FROM_URL_NAME = System.IO.Path.GetFileName(Uri.UnescapeDataString("https://app.wenodo.com/" + StringURL)) });
                }
            }
        }
    }
}
public class Root_POPDF
{
    public Int32 PO_HDR_ID { get; set; }
}