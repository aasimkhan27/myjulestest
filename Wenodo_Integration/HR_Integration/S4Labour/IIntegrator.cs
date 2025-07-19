using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HR_Integration.S4Labour
{
    interface IIntegrator
    {
        T Get<T>(string requestUrl, IDictionary<string, string> Headers,  IDictionary<string, string> queryString, IDictionary<string, string> body,  string scopeName);
        T Post<T>(string requestUrl, IDictionary<string, string> Headers, IDictionary<string, string> queryString, IDictionary<string, string> bodyParam, string scopeName);
    }
}
