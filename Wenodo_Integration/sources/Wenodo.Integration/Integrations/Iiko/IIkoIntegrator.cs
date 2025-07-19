using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Wenodo.Integration.CustomException;
using Wenodo.Integration.Model;

namespace Wenodo.Integration.Integrations.Iiko
{
    public interface IIkoIntegrator
    {
        string BearerToken { get; }

        /// <summary>
        /// The initial configurator logs in and set the store.
        /// </summary>
        /// <param name="authenticationUri">The Url used to authenticate to Iiko</param>
        /// <param name="model">The Authentication model</param>
        /// <param name="storeId">Store Id</param>
        /// <returns>Task</returns>
        /// <exception cref="ServiceAuthenticationException">Thrown when a request is made with invalid token. Usually when thee response from the server is Forbidden or unauthorised.</exception>
        /// <exception cref="KeyNotFoundException">When the Store Id is not found</exception>
        /// <exception cref="HttpRequestExceptionEx">Thrown when the request is not successful</exception>
        /// <example>InitialConfigure(new Uri("https://demo-pro.iikoweb.co.uk/api/auth/login"), new IikoAuthentication {Login = "demo", Password = "demo"}, "550")</example>
        Task InitialConfigure(Uri authenticationUri, IikoAuthentication model, string storeId);

        Task Login(Uri requestUri, IikoAuthentication model );
        Task<JArray> GetStores();
        Task<string> SelectStore(string storeId);
        Task Logout();
    }
}