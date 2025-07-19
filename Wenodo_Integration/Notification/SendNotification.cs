using RestSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Utility;


namespace Notification
{
    
    public class SendNotification
    {
        public Notification_Details NotificationObj { get; set; }
        string SMTPClient = System.Configuration.ConfigurationManager.AppSettings["SMTPClient"].ToString();
        string[] parameters = { };
        string[] stringSeparators = new string[] { ":;:" };
        public void SendEmailNotification()
        {
            try
            {
                MailMessage message = new MailMessage();
                MemoryStream memoryStream=new MemoryStream();
                message.From = new MailAddress("no-reply@wenodo.com"); //new MailAddress(NotificationObj.EmailFrom);
                message.To.Add(NotificationObj.Email_TO); //recipient      
                if (NotificationObj.CC_TO != null && NotificationObj.CC_TO != "")
                    message.CC.Add(NotificationObj.CC_TO); //recipient                
                if (NotificationObj.BCC_TO != null && NotificationObj.BCC_TO != "")
                    message.Bcc.Add(NotificationObj.BCC_TO);
                message.Subject = NotificationObj.Subject;
                message.Body = NotificationObj.Email_Body;
                message.IsBodyHtml = NotificationObj.IsBodyHtml;
                if (NotificationObj.ds_PetyCash_Information != null)
                {
                    foreach (DataRow DR in NotificationObj.ds_PetyCash_Information.Tables[0].Rows)
                    {
                        parameters = Convert.ToString(DR["FILE_NAME"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                        string cashup_file_url = Convert.ToString(NotificationObj.dr_Notification["URL"]) + "/uploads" + parameters[0] + parameters[1];

                        var stream = new WebClient();
                        byte[] imageData = stream.DownloadData(cashup_file_url);
                        memoryStream = new MemoryStream(imageData);
                        message.Attachments.Add(new Attachment(memoryStream, parameters[2].ToString()));
                    }
                }
                if (NotificationObj.Attachment_Flag == true)
                {
                    foreach (var imgObj in NotificationObj.Attachments)
                    {
                        message.Attachments.Add(new Attachment(imgObj.IMAGE_FROM_URL, imgObj.IMAGE_FROM_URL_NAME));
                    }                    
                }

                SmtpClient smtp = new SmtpClient();
                smtp.Host = SMTPClient;
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential(NotificationObj.EmailFrom, NotificationObj.EmailPassword); //missing line from ur code                
                smtp.EnableSsl = true;                
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                //ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Ssl3 | SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                smtp.Timeout = 2000000;
                smtp.Send(message);
                message = null;
                memoryStream.Dispose();
                //SendFireBaseNotification();
            }
            catch 
            {
                throw;// LogExceptions.LogError("Error in Sending Email Notification", ex);
            }

        }

        public void SendSMSNotification()
        {
            try
            {
                //string URL = "https://www.fast2sms.com/dev/bulk";
                //string Authtoken = "authorization=Q1d2hTbHN6pfmGVOP4kveACi7Lct9R3IaKjoyYWBDSEl5XFqnwM5mzGYT9qXH0rV8RptBasFnoWigf6N";
                //string SenderID = "sender_id=FSTSMS";
                //// string CompleteURL = URL + Authtoken + "&" + SenderID + "&" + MD.SMS_MESSAGE + "&language=english&route=p&numbers=" + MD.SMS_TO;
                //string urlParameters = "?" + Authtoken + "&" + SenderID + "&message=" + MD.SMS_MESSAGE + "&language=english&route=p&numbers=" + MD.SMS_TO;

                //HttpClient client = new HttpClient();
                //client.BaseAddress = new Uri(URL);

                //// Add an Accept header for JSON format.
                //client.DefaultRequestHeaders.Accept.Add(
                //new MediaTypeWithQualityHeaderValue("application/json"));

                //// List data response.
                //HttpResponseMessage response = client.GetAsync(urlParameters).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
                //if (response.IsSuccessStatusCode)
                //{
                //    // Parse the response body.                    
                //    // DataAccessLayer obj = new DataAccessLayer();
                //    // obj.UPD_SYS_NOTFCTN_BY_SRVC(MD);
                //}
                //else
                //{
                //    Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
                //}

                ////Make any other calls using HttpClient here.

                ////Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                //client.Dispose();

            }

            catch (Exception ex)
            {
                
                LogExceptions.LogError("Error in Sending SMS Notification", ex);
            }
        }

        public void SendWhatsAppNotification()
        {
            try
            {

            }
            catch (Exception ex)
            {
                
                LogExceptions.LogError("Error in Sending Whatsapp Notification", ex);

            }



        }
        public void SendFireBaseNotification(DataRow _drNotificationDetail, DataRow _drUserDeviceDetail,string UserType,string EmailBodyForMobileNotification)
        {
            try
            {              
                parameters = Convert.ToString(_drNotificationDetail["PARAMETER_FOR_SRVC"]).Split(stringSeparators, StringSplitOptions.RemoveEmptyEntries);
                RestRequest restRequest;
                RestClient restClient;
                IRestResponse restResponse;

                restClient = new RestClient("https://fcm.googleapis.com/fcm/send");
                restRequest = new RestRequest(Method.POST);
                restRequest.AddHeader("Content-Type", "application/json");
                restRequest.AddHeader("Authorization", "key=AAAAnQqw3ZA:APA91bH5B6hPj6CimFOvCYBIretPzBHG-HZvPxBce9GjVaHOxZvmdiQWESsl8mJ7ncPNZ67X7pnstok70yA9_v_1YhkkWsnB9xdAOnXVVnmmBdSQ76-aX0gGYXXRLUmMtFedMQx5yPJr");

                Root root = new Root();
                root.to = Convert.ToString(_drUserDeviceDetail["FIREBASE_TOKEN"]); // "c9OzWj5dQXmhRorbO50dXB:APA91bHCvhaY_-gJowr7nPltkmF1TuouaJAqRK4HdazQ76euhxqFsqyHHxvrGBdodYnEdR8WCWEbhOEp7DmkQyy1O0f0lpyUpOMP_FkKA3D68wqji2vSydZVej2VSi4RffgZeQskeIqa";
                root.notification = new Notification() { body = EmailBodyForMobileNotification, title = Convert.ToString(_drNotificationDetail["EMAIL_SUBJECT"]) };
                string strBody = Newtonsoft.Json.JsonConvert.SerializeObject(root);
                restRequest.AddParameter("application/json", strBody, ParameterType.RequestBody);
                restResponse = restClient.Execute(restRequest);
            }
            catch (Exception ex)
            {
                LogExceptions.LogError("Error in Sending SendFireBaseNotification Notification", ex);
                throw ex;

            }
        }
    }
    public class Notification
    {
        public string body { get; set; }
        public string title { get; set; }
    }

    public class Root
    {
        public string to { get; set; }
        public Notification notification { get; set; }
    }
}