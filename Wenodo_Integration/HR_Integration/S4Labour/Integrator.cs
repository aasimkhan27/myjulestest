using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace HR_Integration.S4Labour
{
    public class Integrator : IIntegrator
    {
        RestRequest restRequest;
        RestClient restClient;
        IRestResponse restResponse;
        public T Get<T>(string requestUrl, IDictionary<string, string> headers, IDictionary<string, string> queryString, IDictionary<string, string> body, string scopeName)
        {

            restClient = new RestClient(requestUrl);
            restRequest =  new RestRequest(Method.GET);

            foreach (var header in headers)
                restRequest.AddHeader(header.Key, header.Value);

            foreach (var parameter in queryString)
                restRequest.AddParameter(parameter.Key, parameter.Value, ParameterType.QueryString);

            foreach (var bodyParam in body)
                restRequest.AddParameter(bodyParam.Key, bodyParam.Value, ParameterType.RequestBody);

            System.Threading.Thread.Sleep(3000);            
            restResponse = restClient.Execute(restRequest);

            if (restResponse.StatusCode.ToString().ToLower() == "ok")
            {
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
                return returnJson;
            }
            else if (restResponse.StatusCode.ToString().ToLower() == "ok")
            {
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
                return returnJson;
            }
            else
            {
                var NoRecordFound = JsonConvert.DeserializeObject<Root_NoRecordFound>(restResponse.Content);
                var returnJson = JsonConvert.DeserializeObject<T>("");
                return returnJson;
            }

        }
        public T Post<T>(string requestUrl, IDictionary<string, string> headers, IDictionary<string, string> queryString, IDictionary<string, string> body, string scopeName)
        {

            restClient = new RestClient(requestUrl);
            restRequest = new RestRequest(Method.POST);

            foreach (var header in headers)
                restRequest.AddHeader(header.Key, header.Value);

            foreach (var parameter in queryString)
                restRequest.AddParameter(parameter.Key, parameter.Value, ParameterType.QueryString);

            foreach (var bodyParam in body)
                restRequest.AddParameter(bodyParam.Key, bodyParam.Value, ParameterType.RequestBody);

            System.Threading.Thread.Sleep(3000);
            restResponse = restClient.Execute(restRequest);

            if (restResponse.StatusCode.ToString().ToLower() == "ok")
            {
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
                return returnJson;
            }
            else if (restResponse.StatusCode.ToString().ToLower() == "ok")
            {
                var returnJson = JsonConvert.DeserializeObject<T>(restResponse.Content);
                return returnJson;
            }
            else
            {
                var NoRecordFound = JsonConvert.DeserializeObject<Root_NoRecordFound>(restResponse.Content);
                var returnJson = JsonConvert.DeserializeObject<T>("");
                return returnJson;
            }

        }
        public class Root_NoRecordFound
        {
            public int statusCode { get; set; }
            public string message { get; set; }
            public string error { get; set; }
        }
    }
}
