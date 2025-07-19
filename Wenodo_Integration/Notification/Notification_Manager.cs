
//using MailKit.Net.Smtp;
//using MailKit.Security;
//using MimeKit;
//using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
//using Google.Apis.Auth.OAuth2;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Net.Http;
using RestSharp;

namespace Notification
{
    public class Notification_Manager
    {
        #region--google cred--
        HttpClient _httpClient;
        string _projectId;
        //GoogleCredential _googleCredential;
        #endregion

        private DataSet _cashupAttachment;
        public Notification_Manager()
        {

           // SendFireBaseNotification_FCM_V1();

            // TestMail();
            DataSet ds = Get_Notifications_from_DB();

            foreach (DataRow dr in ds.Tables[0].Rows)
            {
                //Utility.LogExceptions.LogInfo("INFO: Foreach-> start Call Start");
                try
                {

                    CreateNotification Obj = new CreateNotification();
                    Obj.CreateObj = new CreateNotification_Details();
                    Obj.CreateObj.dr_Notification = dr;
                    Obj.CreateObj.LOGOURL = Convert.ToString(Convert.ToString(dr["URL"])) + Convert.ToString(dr["LOGO_PATH"]).Replace("//", "/");
                    _cashupAttachment = new DataSet();

                    Obj.CreateObj.Notification_ID = Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]);

                    string EmailBody = Obj.CreateEmailNotification();
                    _cashupAttachment = Obj.CreateObj.ds_PetyCash_Information;
                    //Utility.LogExceptions.LogInfo("EMAIL BODY CREATE");
                    if (EmailBody != "")
                    {
                        Send_Notification(dr, EmailBody, Obj.CreateObj.Email_Subject, Obj, Obj.CreateObj.Email_Body_For_Mobile_Notification);
                    }
                }
                catch (Exception ex)
                {
                    Utility.LogExceptions.LogInfo(ex.Message.ToString());
                    DataAccessLayer Obj = new DataAccessLayer();
                    Obj.DataAccess_ModelObj = new DataAccess_Model();
                    Obj.DataAccess_ModelObj.TABLE_ID = Convert.ToInt32(dr["SYSTEM_NOTIFICATIONS_ID"]);
                    Obj.DataAccess_ModelObj.STATUS_ID = 3;
                    Obj.DataAccess_ModelObj.EMAIL_ERROR = ex.Message.ToString();
                    Obj.UPD_NTFCTN_FOR_SRVC();
                }
            }
        }
        DataSet Get_Notifications_from_DB()
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_NTFCTN_FOR_SRVC();
        }

        //void TestMail()
        //{
        //    try
        //    {
        //        //// create email message
        //        //var email = new MimeMessage();
        //        //email.From.Add(MailboxAddress.Parse("rohan@wenodo.com"));
        //        //email.To.Add(MailboxAddress.Parse("aasimkhan27@gmail.com"));
        //        //email.Subject = "Test Email Subject";
        //        //email.Body = new TextPart(TextFormat.Html) { Text = "<h1>Example HTML Message Body</h1>" };

        //        //// send email
        //        //var smtp = new SmtpClient();
        //        //smtp.Connect("smtp.office365.com", 587, SecureSocketOptions.StartTls);
        //        //smtp.Authenticate("rohan@wenodo.com", "Sky1stheL1m1t@1");
        //        //smtp.Send(email);
        //        //smtp.Disconnect(true);


        //        String userName = "rohan@wenodo.com";
        //        String password = "Sky1stheL1m1t@1";
        //        MailMessage msg = new MailMessage();
        //        msg.To.Add(new MailAddress("aasimkhan27@gmail.com"));
        //        msg.From = new MailAddress("no-reply@wenodo.com");
        //        msg.Subject = "Test Office 365 Account";
        //        msg.Body = "Testing email using Office 365 account.";
        //        msg.IsBodyHtml = true;
        //        SmtpClient client = new SmtpClient();
        //        client.Host = "smtp.office365.com";//"wenodo-com.mail.protection.outlook.com";
        //        client.Credentials = new System.Net.NetworkCredential(userName, password);
        //        client.Port = 587;
        //        //  ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11;
        //        client.EnableSsl = true;

        //        //      client.DeliveryMethod = SmtpDeliveryMethod.Network;
        //        //  client.TargetName = "STARTTLS/smtp.office365.com";
        //        client.Send(msg);


        //    }
        //    catch (Exception ex)
        //    {

        //    }
        //}

        void Send_Notification(DataRow dr, string EmailBody, string Email_Subject, CreateNotification createNotification = null, string EmailBodyForMobileNotification = "")
        {
            DataAccessLayer Obj = new DataAccessLayer();
            Obj.DataAccess_ModelObj = new DataAccess_Model();
            try
            {
                SendNotification Send_Obj = new SendNotification();
                Send_Obj.NotificationObj = new Notification_Details();

                Send_Obj.NotificationObj.EmailFrom = Convert.ToString(dr["FROM_EMAIL"]);//"iwenodo@gmail.com";
                Send_Obj.NotificationObj.EmailPassword = Convert.ToString(dr["FROM_EMAIL_PASSWORD"]);//"w300d0#123";
                Send_Obj.NotificationObj.ds_PetyCash_Information = _cashupAttachment;
                Send_Obj.NotificationObj.dr_Notification = dr;
                if (Convert.ToBoolean(dr["IS_PROD"]))
                {
                    if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 34 || Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 83)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);

                        if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 34)
                            Send_Obj.NotificationObj.Email_TO = parameters[1].ToString();

                        if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 83)
                            Send_Obj.NotificationObj.Email_TO = parameters[6].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 36)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[0].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 44 || Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 41)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[2].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 46)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[0].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 55)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[1].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 56)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[2].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 52)
                    {
                        string[] parameters = { };
                        string[] stringSeparators = new string[] { ":;:" };
                        parameters = Convert.ToString(dr["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        Send_Obj.NotificationObj.Email_TO = parameters[0].ToString();
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 59)
                    {
                        Send_Obj.NotificationObj.Email_TO = createNotification.CreateObj.EMAIL_TO;
                        Send_Obj.NotificationObj.Attachment_Flag = createNotification.CreateObj.Attachment_Flag;
                        Send_Obj.NotificationObj.Attachments = createNotification.CreateObj.Attachments;
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 63
                        || Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 67 || Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 96)
                    {
                        Send_Obj.NotificationObj.Email_TO = createNotification.CreateObj.EMAIL_TO;
                        Send_Obj.NotificationObj.Attachment_Flag = createNotification.CreateObj.Attachment_Flag;
                        Send_Obj.NotificationObj.Attachments = createNotification.CreateObj.Attachments;
                    }
                    else if (Convert.ToInt32(dr["NOTIFICATION_MASTER_ID"]) == 67)
                    {
                        Send_Obj.NotificationObj.Email_TO = createNotification.CreateObj.EMAIL_TO;
                    }
                    else
                    {
                        Send_Obj.NotificationObj.Email_TO = Convert.ToString(dr["EMAIL"]);
                    }

                    Send_Obj.NotificationObj.BCC_TO = Convert.ToString(dr["BCC_USERS"]);
                }
                else
                {
                    Send_Obj.NotificationObj.Email_TO = Convert.ToString(dr["BCC_USERS"]);
                }


                Send_Obj.NotificationObj.Subject = Email_Subject;
                Send_Obj.NotificationObj.Email_Body = EmailBody;
                Send_Obj.NotificationObj.IsBodyHtml = true;

                Utility.LogExceptions.LogInfo("INFO: Function ->Send_Obj.SendEmailNotification() call start." + Send_Obj.NotificationObj.Email_TO);

                if (Convert.ToInt32(dr["EMAIL_NOTIFICATION"]) == 1)
                    Send_Obj.SendEmailNotification();

                if (Convert.ToBoolean(dr["MOBILE_APP_NOTIFICATION"]) == true)
                    if (createNotification.CreateObj.IS_SEND_TO_FIREBASE)
                    {
                        DataSet User_Device_Detail = GET_DEVICES_BY_USER_ID(dr);
                        foreach (DataRow Device_Detail in User_Device_Detail.Tables[0].Rows)
                        {
                            Send_Obj.SendFireBaseNotification(dr, Device_Detail, createNotification.CreateObj.P2P_USERTYPE, EmailBodyForMobileNotification);
                        }
                    }

                if (createNotification.CreateObj.IS_AUTO_ENTRY == true)
                {
                    Obj.DataAccess_ModelObj.TABLE_ID = createNotification.CreateObj.TABLE_ID;
                    Obj.DataAccess_ModelObj.ERROR = "SUCCESS";
                    Obj.DataAccess_ModelObj.STATUS_ID = 2;
                    Obj.UPD_SUPY_INTEGRATION_STATUS(Obj);
                }

                Utility.LogExceptions.LogInfo("INFO: Function ->Send_Obj.SendEmailNotification() Call End");
                #region --- Save Email Send Notification In DB 2-success 3-Error-----
                Obj.DataAccess_ModelObj.TABLE_ID = Convert.ToInt32(dr["SYSTEM_NOTIFICATIONS_ID"]);
                Obj.DataAccess_ModelObj.STATUS_ID = 2;
                Obj.DataAccess_ModelObj.EMAIL_ERROR = "SUCCESS";
                Obj.UPD_NTFCTN_FOR_SRVC();
                #endregion
            }
            catch (Exception ex)
            {
                if (createNotification.CreateObj.Attachment_Flag == true)
                {
                    Obj.DataAccess_ModelObj.TABLE_ID = createNotification.CreateObj.TABLE_ID;
                    Obj.DataAccess_ModelObj.ERROR = ex.ToString();
                    Obj.DataAccess_ModelObj.STATUS_ID = 3;
                    Obj.UPD_SUPY_INTEGRATION_STATUS(Obj);
                }
                Utility.LogExceptions.LogError("ERROR: Function ->Send_Obj.SendEmailNotification():", ex);
                Obj.DataAccess_ModelObj.TABLE_ID = Convert.ToInt32(dr["SYSTEM_NOTIFICATIONS_ID"]);
                Obj.DataAccess_ModelObj.STATUS_ID = 3;
                Obj.DataAccess_ModelObj.EMAIL_ERROR = ex.ToString();
                Obj.UPD_NTFCTN_FOR_SRVC();
            }
        }

        DataSet GET_DEVICES_BY_USER_ID(DataRow dataRow)
        {
            DataAccessLayer Obj = new DataAccessLayer();
            return Obj.GET_DEVICES_BY_USER_ID(Obj, dataRow);
        }

        //public void SendFireBaseNotification_FCM_V1()
        //{
        //    //if (Convert.ToInt32(_drNotificationDetail["MODULE_ID"]) == 24)
        //    //{
        //        _httpClient = new HttpClient();
        //        var credentialPath = @"\\DESKTOP-L3KQEHH\Uploads\Toast\\FB_MESSAGE.json"; // Path to your JSON key file       
        //        _googleCredential = GoogleCredential.FromFile(credentialPath).CreateScoped("https://www.googleapis.com/auth/firebase.messaging");

        //        dynamic json = JsonConvert.DeserializeObject(System.IO.File.ReadAllText(credentialPath));
        //        _projectId = json.project_id;
        //        var accessToken = GetAccessTokenAsync().Result;
        //        SendNotificationAsync(accessToken, "TEST NOTIFICATION", "THIS IS A TEST MESSAGE", _projectId);
        //    //}
        //}
        //private async Task<string> GetAccessTokenAsync()
        //{
        //    var token = _googleCredential.UnderlyingCredential.GetAccessTokenForRequestAsync();
        //    token.Wait();
        //    return await token;
        //}
        public void SendNotificationAsync(string accessToken, string title, string body, object data = null)
        {
            RestRequest restRequest;
            RestClient restClient;
            IRestResponse restResponse;

            restClient = new RestClient("https://fcm.googleapis.com/v1/projects/" + _projectId + "/messages:send");
            restRequest = new RestRequest(Method.POST);
            restRequest.AddHeader("Content-Type", "application/json");
            restRequest.AddHeader("Authorization", "Bearer " + accessToken);

            Root_FCM_V1 root_FCM_V1 = new Root_FCM_V1();
            root_FCM_V1.message = new Message
            {
                token = "fraoxXjAR7qgUh68YBXIqM:APA91bE0w33BJM48msQblYu9jbLOl8OJdITzl-QLjHtayEx7ejD2cer2Lq5Dgks1vbsSPy0v81I8VJiLSc8NRBhlfUlvNDv7U7vem4x-AOsgKi93H2hx5Es",
                notification = new Notification
                {
                    title = title,
                    body = body
                }
            };
            string strBody = Newtonsoft.Json.JsonConvert.SerializeObject(root_FCM_V1);
            restRequest.AddParameter("application/json", strBody, ParameterType.RequestBody);
            restResponse = restClient.Execute(restRequest);



            //Root root = new Root();
            //root.to = Convert.ToString("fraoxXjAR7qgUh68YBXIqM:APA91bE0w33BJM48msQblYu9jbLOl8OJdITzl-QLjHtayEx7ejD2cer2Lq5Dgks1vbsSPy0v81I8VJiLSc8NRBhlfUlvNDv7U7vem4x-AOsgKi93H2hx5Es"); // "c9OzWj5dQXmhRorbO50dXB:APA91bHCvhaY_-gJowr7nPltkmF1TuouaJAqRK4HdazQ76euhxqFsqyHHxvrGBdodYnEdR8WCWEbhOEp7DmkQyy1O0f0lpyUpOMP_FkKA3D68wqji2vSydZVej2VSi4RffgZeQskeIqa";
            //root.notification = new Notification() { body = body, title = title };
            //string strBody = Newtonsoft.Json.JsonConvert.SerializeObject(root);
            //restRequest.AddParameter("application/json", strBody, ParameterType.RequestBody);
            //restResponse = restClient.Execute(restRequest);
        }


        public class Message
        {
            public string token { get; set; }
            public Notification notification { get; set; }
        }

        public class Notification
        {
            public string title { get; set; }
            public string body { get; set; }
        }

        public class Root_FCM_V1
        {
            public Message message { get; set; }
        }
    }
}

