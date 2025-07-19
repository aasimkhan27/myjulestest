using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using RestSharp;
using System.Net;

namespace EPOS_Integration.Epos_Integrator
{
    class EPOS_INTEGRATOR:IEPOS_INTEGRATOR
    {
        RestRequest restRequest;
        RestClient restClient;
        IRestResponse restResponse;
        public T Get<T>(string requestUrl, IDictionary<string, string> headers, IDictionary<string, string> queryString, IDictionary<string, string> body, DocumentPaths? documentPaths, string scopeName)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            restClient = new RestClient(requestUrl);
            restRequest = documentPaths != null ? new RestRequest(((DescriptionAttribute)documentPaths.GetType().GetMember(scopeName)[0].GetCustomAttribute(typeof(DescriptionAttribute), false)).Description, Method.GET) : new RestRequest(Method.GET);

            foreach (var header in headers)
                restRequest.AddHeader(header.Key, header.Value);

            foreach (var parameter in queryString)
                restRequest.AddParameter(parameter.Key, parameter.Value, ParameterType.QueryString);

            foreach (var bodyParam in body)
                restRequest.AddParameter(bodyParam.Key, bodyParam.Value, ParameterType.RequestBody);

            System.Threading.Thread.Sleep(2000);
            restResponse = restClient.Execute(restRequest);

            if (documentPaths != null && restResponse.StatusCode.ToString().ToLower() == "ok")
            {
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
                return returnJson;
            }
            else if (documentPaths == null && restResponse.StatusCode.ToString().ToLower() == "ok")
            {
               var settings = new JsonSerializerSettings
                {
                    MissingMemberHandling = MissingMemberHandling.Ignore,
                    NullValueHandling = NullValueHandling.Include,
                    Error = (sender, args) =>
                    {
                        args.ErrorContext.Handled = true;
                    }
                };
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content, settings);
                return returnJson;
            }
            else
            {
                var NoRecordFound = JsonConvert.DeserializeObject<Root_NoRecordFound>(restResponse.Content);
                var returnJson = JsonConvert.DeserializeObject<T>("");
                return returnJson;
            }

        }
        public T Post<T>(string requestUrl, IDictionary<string, string> headers, IDictionary<string, string> queryString, IDictionary<string, string> bodyParam, string body, DocumentPaths? documentPaths, string scopeName)
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            restClient = new RestClient(requestUrl);
            restRequest = documentPaths != null ? new RestRequest(((DescriptionAttribute)documentPaths.GetType().GetMember(scopeName)[0].GetCustomAttribute(typeof(DescriptionAttribute), false)).Description, Method.POST) : new RestRequest(Method.POST);
            foreach (var header in headers)
                restRequest.AddHeader(header.Key, header.Value);

            foreach (var parameter in queryString)
                restRequest.AddParameter(parameter.Key, parameter.Value, ParameterType.QueryString);

            if (documentPaths == null)
            {
                restRequest.AddParameter("application/json", body, ParameterType.RequestBody);
            }
            else
                restRequest.AddParameter("application/json", body, ParameterType.RequestBody);

            System.Threading.Thread.Sleep(2000);
            restResponse = restClient.Execute(restRequest);


            var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
            return returnJson;

        }
        public class Root_NoRecordFound
        {
            public int statusCode { get; set; }
            public string message { get; set; }
            public string error { get; set; }
        }
    }
    public enum DocumentPaths
    {
        //[StringValue("categories")] categories,

        [Description("categories")] categories,
        [Description("suppliers/related")] suppliers,
        [Description("invoices")] invoices,
        [Description("items")] items,
        [Description("locations")] locations,
        [Description("sales-transactions")] salestransactions,
        [Description("stock-counts/cogs")] cogs,
        [Description("uoms")] uoms,
        [Description("taxes")] taxes,
        [Description("recipes")] recipes,
        [Description("branches")] branches,
        [Description("products")] products,
        [Description("payment_methods")] payment_methods,
        [Description("orders")] orders,
        [Description("modifiers")] modifiers,
        [Description("modifier_options")] modifier_options,
        [Description("reasons")] reasons,
        [Description("discounts")] discounts,

    }
}
