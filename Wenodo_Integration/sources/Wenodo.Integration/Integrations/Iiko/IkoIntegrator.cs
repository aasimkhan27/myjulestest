using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using Wenodo.Integration.CustomException;
using Wenodo.Integration.Integrations.GenericIntegrations;
using Wenodo.Integration.Model;

namespace Wenodo.Integration.Integrations.Iiko
{
    public class IkoIntegrator: Integrator, IIkoIntegrator
    {
        private JArray _stores;
        public string BearerToken { get; private set; }
        
        private string _baseUrl;

        public IkoIntegrator(HttpClient httpClient, ILogger logger, bool enableInformationLogging= false): base(httpClient, logger, enableInformationLogging)
        {
            _stores = new JArray();
            BearerToken = string.Empty;
            _baseUrl = string.Empty;
        }

        /// <inheritdoc/>
        public async Task InitialConfigure(Uri authenticationUri, IikoAuthentication model, string storeId)
        {
            await Login(authenticationUri, model);
            await GetStores();
            await SelectStore(storeId);
        }

        public async Task Login(Uri requestUri, IikoAuthentication model )
        {
            var response = await Post<IikoAuthentication, JObject>(requestUri, model, string.Empty);
            _baseUrl = requestUri.Host; //Set the Host
            BearerToken = response[IikoResponseFields.token.ToString()]?.Value<string>();
        }

        public async Task<JArray> GetStores()
        {
            if (string.IsNullOrWhiteSpace(BearerToken))
                throw new ServiceAuthenticationException("The client is not authenticated.");

            const string path = "api/stores/list";
            var builder = new UriBuilder {Host = _baseUrl, Path = path};
            var response = await Get<JObject>(builder.Uri, BearerToken);
            _stores = response[IikoResponseFields.stores.ToString()] as JArray;
            return _stores;
        }

        public async Task<string> SelectStore(string storeId)
        {
            if (string.IsNullOrWhiteSpace(BearerToken))
                throw new ServiceAuthenticationException("The client is not authenticated.");
            if (!_stores.Any()) throw new KeyNotFoundException("The Store Id was not found on the system.");
            
            const string selectHref = "api/stores/select";
            foreach (var store in _stores)
            {
                var id = store[IikoResponseFields.id.ToString()]?.Value<string>();
                if (!string.Equals(id, storeId, StringComparison.CurrentCultureIgnoreCase)) continue;
                
                var setStoreUri = new UriBuilder { Host = _baseUrl, Path = $"{selectHref}/{id}"};
                var storePref = await SetStore(setStoreUri.Uri);
                return storePref;
            }

            throw new KeyNotFoundException("The Store Id was not found on the system.");
        }

        public async Task Logout()
        {
            const string path = "api/auth/logout";
            var builder = new UriBuilder {Host = _baseUrl, Path = path};
            _ =  await Get<JObject>(builder.Uri, BearerToken);
            BearerToken = string.Empty;
        }

        #region Helpers

        private async Task<string> SetStore(Uri requestUri)
        {
            if (string.IsNullOrWhiteSpace(BearerToken))
                throw new ServiceAuthenticationException("The client is not authenticated.");

            var response = await Get<JObject>(requestUri, BearerToken);
            return response[IikoResponseFields.store.ToString()]?.Value<string>();
        }

        #endregion
    }
}