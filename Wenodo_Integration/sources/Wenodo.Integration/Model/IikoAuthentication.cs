using Newtonsoft.Json;

namespace Wenodo.Integration.Model
{
    public class IikoAuthentication
    {
        [JsonProperty("login")]
        public string Login { get; set; }

        [JsonProperty("password")]
        public string Password { get; set; }
    }
}
