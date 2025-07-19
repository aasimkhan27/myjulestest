using AspNet.Security.OpenIdConnect.Primitives;
using Microsoft.Extensions.DependencyInjection;
//using Newtonsoft.Json;
using RestSharp;
using RestSharp.Authenticators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration
{
    public class SimphonyIntegrator
    {
        public void stest()
        {
            //     var client = new RestClient();
            //     var request = new RestRequest("https://mte4-ohra-idm.oracleindustry.com/oidc-provider/v1/oauth2/authorize?response_type=code&client_id=Q05PLjIwNjg5OTBiLWNjNDUtNGE1OC1iM2E3LTgzN2M1ZGZmNDI1Zg==&scope=openid&redirect_uri=apiaccount://callback&code_challenge=H9KVBZo4Zwa_rRR_X-KyfycPWuP2417K15w42JqsAIk&code_challenge_method=S256", Method.GET);
            ////     request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            //     //request.AddHeader("Cookie", "client_id=Q05PLjIwNjg5OTBiLWNjNDUtNGE1OC1iM2E3LTgzN2M1ZGZmNDI1Zg==; code_challenge=H9KVBZo4Zwa_rRR_X-KyfycPWuP2417K15w42JqsAIk; code_challenge_method=S256; redirect_uri=apiaccount://callback; response_type=code; state=");

            //     var response = client.Execute(request).Content;


            // client = new RestClient();
            // request = new RestRequest("https://mte4-ohra-idm.oracleindustry.com/oidc-provider/v1/oauth2/signin", Method.POST);
            //request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            //request.AddHeader("Cookie", "client_id=Q05PLjIwNjg5OTBiLWNjNDUtNGE1OC1iM2E3LTgzN2M1ZGZmNDI1Zg==; code_challenge=H9KVBZo4Zwa_rRR_X-KyfycPWuP2417K15w42JqsAIk; code_challenge_method=S256; redirect_uri=apiaccount://callback; response_type=code; state=");
            //request.AddParameter("username", "BIAPIUSER1");
            //request.AddParameter("password", "Dubai@2024");
            //request.AddParameter("orgname", "CNO");
            // response =client.Execute(request).Content;


            var client = new RestClient();
            var request = new RestRequest("https://mte4-ohra-idm.oracleindustry.com/oidc-provider/v1/oauth2/signin", Method.POST);
            request.AddHeader("Cookie", "client_id=Q05PLjIwNjg5OTBiLWNjNDUtNGE1OC1iM2E3LTgzN2M1ZGZmNDI1Zg==; code_challenge=H9KVBZo4Zwa_rRR_X-KyfycPWuP2417K15w42JqsAIk; code_challenge_method=S256; redirect_uri=apiaccount://callback; response_type=code; state=");
            request.AddHeader("Content-Type", "application/x-www-form-urlencoded");
            request.AddParameter("username", "BIAPIUSER1");
            request.AddParameter("password", "Dubai@2024");
            request.AddParameter("orgname", "CNO");
            var response1 = client.Execute(request);
            // var response = JsonConvert.DeserializeObject<SimphonyRoot>(client.Execute(request).Content);

        }
        //   IServiceCollection services;

        //public void Integrator()
        //{

        //    services.AddOpenIdConnect(options =>
        //    {
        //        options.Authority = Configuration["auth:oidc:authority"];
        //        options.ClientId = Configuration["auth:oidc:clientid"];
        //        options.ClientSecret = Configuration["auth:oidc:clientsecret"];
        //        options.ResponseType = OpenIdConnectResponseType.Code;
        //        options.GetClaimsFromUserInfoEndpoint = true;
        //        options.SaveTokens = true;
        //    });
        //    services.AddAuthentication().AddOpenIdConnectServer(options =>
        //    {
        //        // Enable the token endpoint.
        //        options.TokenEndpointPath = "/oidc-provider/v1/oauth2/token";

        //        // Implement OnValidateTokenRequest to support flows using the token endpoint.
        //        options.Provider.OnValidateTokenRequest = context =>
        //        {
        //            // Reject token requests that don't use grant_type=password or grant_type=refresh_token.
        //            if (!context.Request.IsPasswordGrantType() && !context.Request.IsRefreshTokenGrantType())
        //            {
        //                context.Reject(
        //                    error: OpenIdConnectConstants.Errors.UnsupportedGrantType,
        //                    description: "Only grant_type=password and refresh_token " +
        //                                 "requests are accepted by this server.");

        //                return Task.CompletedTask;
        //            }

        //            // Note: you can skip the request validation when the client_id
        //            // parameter is missing to support unauthenticated token requests.
        //            // if (string.IsNullOrEmpty(context.ClientId))
        //            // {
        //            //     context.Skip();
        //            // 
        //            //     return Task.CompletedTask;
        //            // }
        //            context.ClientId = "";
        //            // Note: to mitigate brute force attacks, you SHOULD strongly consider applying
        //            // a key derivation function like PBKDF2 to slow down the secret validation process.
        //            // You SHOULD also consider using a time-constant comparer to prevent timing attacks.
        //            if (string.Equals(context.ClientId, "client_id", StringComparison.Ordinal))
        //            {
        //                context.Validate();
        //            }

        //            // Note: if Validate() is not explicitly called,
        //            // the request is automatically rejected.
        //            return Task.CompletedTask;
        //        };

        //        // Implement OnHandleTokenRequest to support token requests.
        //        options.Provider.OnHandleTokenRequest = context =>
        //        {
        //            // Only handle grant_type=password token requests and let
        //            // the OpenID Connect server handle the other grant types.
        //            if (context.Request.IsPasswordGrantType())
        //            {
        //                // Implement context.Request.Username/context.Request.Password validation here.
        //                // Note: you can call context Reject() to indicate that authentication failed.
        //                // Using password derivation and time-constant comparer is STRONGLY recommended.
        //                if (!string.Equals(context.Request.Username, "Bob", StringComparison.Ordinal) ||
        //                    !string.Equals(context.Request.Password, "P@ssw0rd", StringComparison.Ordinal))
        //                {
        //                    context.Reject(
        //                        error: OpenIdConnectConstants.Errors.InvalidGrant,
        //                        description: "Invalid user credentials.");

        //                    return Task.CompletedTask;
        //                }

        //                var identity = new ClaimsIdentity(context.Scheme.Name,
        //                    OpenIdConnectConstants.Claims.Name,
        //                    OpenIdConnectConstants.Claims.Role);

        //                // Add the mandatory subject/user identifier claim.
        //                identity.AddClaim(OpenIdConnectConstants.Claims.Subject, "[unique id]");

        //                // By default, claims are not serialized in the access/identity tokens.
        //                // Use the overload taking a "destinations" parameter to make sure
        //                // your claims are correctly inserted in the appropriate tokens.
        //                identity.AddClaim("urn:customclaim", "value",
        //                    OpenIdConnectConstants.Destinations.AccessToken,
        //                    OpenIdConnectConstants.Destinations.IdentityToken);

        //                var ticket = new AuthenticationTicket(
        //                    new ClaimsPrincipal(identity),
        //                    new AuthenticationProperties(),
        //                    context.Scheme.Name);

        //                // Call SetScopes with the list of scopes you want to grant
        //                // (specify offline_access to issue a refresh token).
        //                ticket.SetScopes(
        //                    OpenIdConnectConstants.Scopes.OpenId);

        //                context.Validate(ticket);
        //            }

        //            return Task.CompletedTask;
        //        };
        //    });
        //}


        //public void ConfigureServices(IServiceCollection services)
        //{
        //    // …

        //    services.AddAuthentication(options =>
        //    {
        //        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        //        options.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
        //    })
        //        .AddCookie()
        //        .AddOpenIdConnect(options =>
        //        {
        //    // …

        //    options.Events.OnTicketReceived = OnOpenIdConnectTicketReceived;
        //            options.ClientId = Configuration["auth:oidc:clientid"];                 
        //            options.ResponseType = OpenIdConnectResponseType.Code;
        //            options.
        //        });
        //}
    }

    public class SimphonyRoot
    {
        public string nextOp { get; set; }
        public bool success { get; set; }
        public string redirectUrl { get; set; }
    }

}
