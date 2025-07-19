using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;
using EPOS_Integration.CustomException;
using Utility;

namespace EPOS_Integration.Integrations.GenericIntegrations
{
    /// <summary>
    /// The Generic Integrator is an HTTP Client Wrapper that allows sending HTTP requests to the integration platforms.
    /// </summary>
    public class Integrator : IDisposable, IIntegrator
    {
        private readonly HttpClient _httpClient;
        //private readonly ILogger _logger;
        private readonly bool _enableInformationLogging;

        /// <summary>
        /// The Generic Integrator is an HTTP Client Wrapper that allows sending HTTP requests to the integration platforms.
        /// </summary>
        /// <param name="httpClient">HttpClient instance to send request</param>
        /// <param name="logger">Application logger</param>
        /// <param name="enableInformationLogging">Enable Information Logging. Disabling it only writes Errors and Warning.</param>
        public Integrator(HttpClient httpClient, bool enableInformationLogging = false)
        {
            try
            {
                _httpClient = httpClient;
                _enableInformationLogging = enableInformationLogging;
            }
            catch
            {
                throw new ArgumentNullException(nameof(httpClient));
            }
            // _logger = logger;

        }

        /// <summary>
        /// HTTP GET
        /// </summary>
        /// <typeparam name="T">Return Type</typeparam>
        /// <param name="requestUri">Request Uri to get the item</param>
        /// <param name="bearerToken">The bearer token without the Bearer Prefix</param>
        /// <param name="headers">The list of custom headers.</param>
        /// <returns>Response from the provided Uri</returns>
        public virtual async Task<T> Get<T>(Uri requestUri, string bearerToken, IDictionary<string, string> headers = null)
        {
            SetHeaders(headers);
            SetBearerHeader(bearerToken);
            if (_enableInformationLogging)
                LogExceptions.LogInfo($"Performing HTTP GET using Uri {requestUri}");


            var responseMessage = await _httpClient.GetAsync(requestUri);
            if (!responseMessage.IsSuccessStatusCode) throw await HandleFailedRequest(responseMessage);

            var jsonResult = await responseMessage.Content.ReadAsStringAsync();
            responseMessage.Dispose(); //Ensure this is out of the memory
            return JsonConvert.DeserializeObject<T>(jsonResult);
        }

        public virtual async Task<TU> Post<T, TU>(Uri requestUri, T data, string bearerToken, IDictionary<string, string> headers = null, string contentType = "application/json")
        {
            SetHeaders(headers);
            if (!string.IsNullOrWhiteSpace(bearerToken)) SetBearerHeader(bearerToken);
            var content = new StringContent(JsonConvert.SerializeObject(data));
            content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12;
            var responseMessage = await _httpClient.PostAsync(requestUri, content);

            if (!responseMessage.IsSuccessStatusCode) throw await HandleFailedRequest(responseMessage);
            var jsonResult = await responseMessage.Content.ReadAsStringAsync();
            responseMessage.Dispose(); //Ensure this is out of the memory
            return JsonConvert.DeserializeObject<TU>(jsonResult);


        }

        #region Helpers
        /// <summary>
        /// Sets the custom headers.
        /// </summary>
        /// <param name="headers">List of headers to be added to the request</param>
        protected virtual void SetHeaders(IDictionary<string, string> headers)
        {
            if (headers == null || !headers.Any()) return; //Ignore if there are no headers

            foreach (var header in headers) //Add each header
                _httpClient.DefaultRequestHeaders.Add(header.Key, header.Value);
        }

        /// <summary>
        /// Add Bearer Header to the HttpClient.
        /// </summary>
        /// <param name="bearerToken">The bearer token without the Bearer prefix</param>
        protected virtual void SetBearerHeader(string bearerToken)
        {
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(HeaderValues.BearerTokenType, bearerToken.Trim());
        }

        /// <summary>
        /// Handle Failed Request
        /// </summary>
        /// <param name="responseMessage">Http Response Message after the request</param>
        /// <returns>ServiceAuthenticationException or HttpRequestExceptionEx </returns>
        protected virtual async Task<Exception> HandleFailedRequest(HttpResponseMessage responseMessage)
        {
            var jsonResult = await responseMessage.Content.ReadAsStringAsync();
            if (responseMessage.StatusCode == HttpStatusCode.Forbidden || responseMessage.StatusCode == HttpStatusCode.Unauthorized)
            {
                var exception = new ServiceAuthenticationException(jsonResult);
                LogExceptions.LogError("Service Authentication Error", exception);
                responseMessage.Dispose();
                return exception;
            }

            var httpRequestException = new HttpRequestExceptionEx(responseMessage.StatusCode, jsonResult);
            LogExceptions.LogError("HTTP Request Error", httpRequestException);
            responseMessage.Dispose();
            return httpRequestException;
        }
        #endregion

        /// <summary>
        /// Ensure HTTP Client is always dispose. This ensured that the open TCP connection is closed once the object is out of scope.
        /// </summary>
        public virtual void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}