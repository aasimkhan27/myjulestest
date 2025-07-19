using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.Epos_Integrator
{
    interface IEPOS_INTEGRATOR
    {
        T Get<T>(string requestUrl, IDictionary<string, string> Headers, IDictionary<string, string> queryString, IDictionary<string, string> body, DocumentPaths? documentPaths, string scopeName);
        T Post<T>(string requestUrl, IDictionary<string, string> Headers, IDictionary<string, string> queryString, IDictionary<string, string> bodyParam, string body, DocumentPaths? documentPaths, string scopeName);
    }
}
