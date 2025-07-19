using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.Common
{
    public class FetchData
    {
        public string urlPath { get; set; }
        public string urlParameters { get; set; }
        public string urlFilters { get; set; }
        public string userName { get; set; }
        public string passWord { get; set; }

        public string GetUrlData_BasicAuth()
        {
            WebClient client = new WebClient();
            client.Credentials = new System.Net.NetworkCredential(userName, passWord);
            string credentials = Convert.ToBase64String(Encoding.ASCII.GetBytes(userName + ":" + passWord));
            client.Headers[HttpRequestHeader.Authorization] = "Basic " + credentials;
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var result = client.DownloadString(urlPath + urlParameters);// + "?$filter=" + urlFilters);
            //JObject objects = JObject.Parse(result);
            return result;
        }

    }
}
