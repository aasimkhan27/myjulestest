using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EPOS_Integration.Integrations.GenericIntegrations
{
    public interface IIntegrator
    {
        /// <summary>
        /// HTTP GET
        /// </summary>
        /// <typeparam name="T">Return Type</typeparam>
        /// <param name="requestUri">Request Uri to get the item</param>
        /// <param name="bearerToken">The bearer token without the Bearer Prefix</param>
        /// <param name="headers">The list of custom headers.</param>
        /// <returns>Response from the provided Uri</returns>
        Task<T> Get<T>(Uri requestUri, string bearerToken, IDictionary<string, string> headers = null);

        Task<TU> Post<T, TU>(Uri requestUri, T data, string bearerToken, IDictionary<string, string> headers = null, string contentType= "application/json");
    }
}