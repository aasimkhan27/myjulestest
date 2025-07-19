using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Notification.EmailBody
{
    public class WeFyle
    {
        public Wefyle_Details Wefyle_DetailsObj { get;set;}
        public string FileUploadedSuccess()
        {
            StringBuilder EmailBody=new StringBuilder();        
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\">A ");
            EmailBody.Append(Wefyle_DetailsObj.Type);
            EmailBody.Append(" \"");
            EmailBody.Append(Wefyle_DetailsObj.Title);
            EmailBody.Append("\"");
            EmailBody.Append(" is uploaded successfully and sent for approval. We shall keep you posted on the updates.");            
            return EmailBody.ToString();
        }
        public string WefileReminder()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",<br></td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"><br> This is a reminder for file " + Wefyle_DetailsObj.Title.ToString()+ " , it will expire on " + Wefyle_DetailsObj.Date.ToString()+".");
            //EmailBody.Append(Wefyle_DetailsObj.Type);
            //EmailBody.Append(" \"");
            //EmailBody.Append(Wefyle_DetailsObj.Title);
            //EmailBody.Append("\"");
            //EmailBody.Append(" is uploaded successfully and sent for approval. We shall keep you posted on the updates.");
            return EmailBody.ToString();
        }
        
        public string FileWaitingForApproval()
        {
            StringBuilder EmailBody = new StringBuilder();            
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> A ");
            EmailBody.Append(Wefyle_DetailsObj.Type);
            EmailBody.Append(" \"");
            EmailBody.Append(Wefyle_DetailsObj.Title);
            EmailBody.Append("\"");
            EmailBody.Append(" uploaded by ");
            EmailBody.Append(Wefyle_DetailsObj.UploadedBy);
            EmailBody.Append(" awaiting for your approval. <br><br> Kindly Login to proceed.");            
            return EmailBody.ToString();
        }
        public string FileApprovedSucessToUploader()
        {
            StringBuilder EmailBody = new StringBuilder();            
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> ");
            EmailBody.Append(Wefyle_DetailsObj.ApprovedBy);
            EmailBody.Append(" has approved your file");
            EmailBody.Append(" \"");
            EmailBody.Append(Wefyle_DetailsObj.Title);
            EmailBody.Append("\"");
            EmailBody.Append(". <br><br>Kindly Login to proceed.");            
            return EmailBody.ToString();
        }
        public string FileRejected()
        {
            StringBuilder EmailBody = new StringBuilder();            
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\">");
            EmailBody.Append(Wefyle_DetailsObj.ApprovedBy);
            EmailBody.Append(" has rejected your file");
            EmailBody.Append(" \"");
            EmailBody.Append(Wefyle_DetailsObj.Title);
            EmailBody.Append("\"");
            EmailBody.Append(".<br><br>Kindly Login to proceed.");            
            return EmailBody.ToString();
        }
        public string FileApprovedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> File ");
            //EmailBody.Append(Wefyle_DetailsObj.Type);
            //EmailBody.Append(" \"");
            //EmailBody.Append(Wefyle_DetailsObj.Title);
            //EmailBody.Append("\"");
            EmailBody.Append(" approved successfully. <br><br>");
            //EmailBody.Append(Wefyle_DetailsObj.UploadedBy);
            //EmailBody.Append(" awaiting for your approval. <br><br> Kindly Login to proceed.");
            return EmailBody.ToString();
        }
        public string FileRejectedToApprover()
        {
            StringBuilder EmailBody = new StringBuilder();
            EmailBody.Append(Wefyle_DetailsObj.NAME);
            EmailBody.Append(",</td></tr><tr><td style=\"color:#333333;font-size:16px;font-family:Lato,sans-serif;padding:20px;line-height:20px;\"> ");
            //EmailBody.Append(Wefyle_DetailsObj.ApprovedBy);
            EmailBody.Append(" File has been rejected successfully.");
            //EmailBody.Append(" \"");
            //EmailBody.Append(Wefyle_DetailsObj.Title);
            //EmailBody.Append("\"");
            EmailBody.Append("<br><br>");
            return EmailBody.ToString();
        }
    }
}
