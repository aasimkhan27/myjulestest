using App_Repository;
using EPOS_Integration.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using ViewModels;

namespace EPOS_Integration.MM_SALESDATA
{
    public static class RequestConstants
    {
        public const string BaseUrl = "https://api.github.com";
        public const string Url = "https://api.github.com/repos/restsharp/restsharp/releases";
        public const string UserAgent = "User-Agent";
        public const string UserAgentValue = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36";
    }
    public class MM_Sales_Data
    {
        MM_Token MM_Token = new MM_Token();
        private string _webClientData = string.Empty;

        public void Push_MM_Sales_Data(int ENTITY_ID, int BRANCH_ID, decimal CASHUP_MAIN_ID, bool Is_Direct_From_Omega, DataRow DR, DateTime CashupDate)
        {
            Cashup Obj2 = new Cashup();
            Obj2.CashupModelObj = new CashupModel();
            DataTable DT_MM_SetSales = new DataTable();
            try
            {
                Utility.LogExceptions.LogInfo("Start calling 'Push_MM_Sales_Data' function");
                if (Is_Direct_From_Omega)
                {
                    Obj2.CashupModelObj.INTEGRATION_SYSTEM_ID = Convert.ToInt32(IntegrationSource.MARKETMAN);
                    DT_MM_SetSales = Obj2.GET_INTEGRATION_DETAILS();

                    DataRow[] FilteredRows = DT_MM_SetSales.Select("ENTITY_ID=" + ENTITY_ID + " AND BRANCH_ID=" + BRANCH_ID + " AND IS_OUTBOUND=" + Boolean.TrueString);
                    DR = FilteredRows.FirstOrDefault();
                    if (DT_MM_SetSales.Rows.Count > 0 && FilteredRows.Length > 0)
                    {
                        //DataTable dt_MM_IntegrationDetails = DT_MM_SetSales.Select("ENTITY_ID IN (" + ENTITY_ID + ")").CopyToDataTable();
                        //DR = dt_MM_IntegrationDetails.Rows[0];

                        string URL = DR["URL_PATH"].ToString();
                        Dictionary<string, string> bodyParameter = new Dictionary<string, string>(); ;
                        bodyParameter.Add("APIKey", DR["API_KEY"].ToString());
                        bodyParameter.Add("APIPassword", DR["PASSWORD"].ToString());
                        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
                        var client = new WebClient();
                        client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
                        client.Headers.Add("Content-Type", "application/json");
                        if (bodyParameter.Count > 0)
                        {
                            _webClientData = JsonConvert.SerializeObject(bodyParameter);
                        }
                        try
                        {
                            var response = client.UploadString(URL, "post", _webClientData.Length > 0 ? _webClientData : "");
                            MM_Token = JsonConvert.DeserializeObject<MM_Token>(response);
                            SetSalesItem(DR, CASHUP_MAIN_ID, ENTITY_ID, BRANCH_ID, CashupDate);
                        }
                        catch (Exception ex)
                        {
                            Utility.LogExceptions.LogError("Error in Calling URL:-" + URL + "POST JSON DATA:-" + _webClientData.ToString(), ex);
                            Obj2.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                            Obj2.CashupModelObj.INTEGRATION_STATUS = 3;
                            Obj2.CashupModelObj.ERROR_MESSAGE = ex.ToString();
                            Obj2.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
                        }
                    }
                    else
                    {
                        Obj2.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                        Obj2.CashupModelObj.INTEGRATION_STATUS = 4;
                        Obj2.CashupModelObj.ERROR_MESSAGE = "No recored found from SP GET_INTEGRATION_DETAILS();";
                        Obj2.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
                    }
                }
            }
            catch (Exception ex)
            {
                Obj2.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                Obj2.CashupModelObj.INTEGRATION_STATUS = 3;
                Obj2.CashupModelObj.ERROR_MESSAGE = "function Push_MM_Sales_Data()  " + ex.ToString();
                Obj2.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
            }
        }

        public void SetSalesItem(DataRow BuyerList, decimal CASHUP_MAIN_ID, int ENTITY_ID, int BRANCH_ID, DateTime CashupDate)
        {

            Cashup MM_Cashup_Obj = new Cashup();
            MM_Cashup_Obj.CashupModelObj = new CashupModel();
            SetSales_Root setSales_Root = new SetSales_Root();
            Set_Sales_Result set_Sales_Result = new Set_Sales_Result();
            setSales_Root.Items = new List<Items>();
            setSales_Root.Transactions = new List<Transactions>();
            decimal TotalPriceWithVAT = 0;
            decimal TotalPriceWithoutVAT = 0;
            try
            {
                DataSet DS_SET_SALES = MM_Cashup_Obj.GET_DAILY_SALES_DATA_FOR_MRKTMN_OUTBOUND_INT(ENTITY_ID, BRANCH_ID, CashupDate, CashupDate);
                if (DS_SET_SALES.Tables.Count > 0 && DS_SET_SALES.Tables[0].Rows.Count > 0)
                {
                    setSales_Root.UniqueID = Convert.ToString(CASHUP_MAIN_ID);
                    setSales_Root.FromDateUTC = CashupDate.ToString("yyyy/MM/dd hh:mm:ss").ToString();
                    setSales_Root.ToDateUTC = CashupDate.ToString("yyyy/MM/dd hh:mm:ss").ToString();
                    foreach (DataRow DR in DS_SET_SALES.Tables[0].Rows)
                    {
                        setSales_Root.Items.Add(new Items { Type = "MenuItem", Name = DR["NAME"].ToString(), ID = DR["ID"].ToString(), PriceWithVAT = Convert.ToDecimal(DR["PRICEWITHVAT"]), PriceWithoutVAT = Convert.ToDecimal(DR["PRICEWITHOUTVAT"]), SKU = DR["SKU"].ToString(), Category = DR["CATEGORY"].ToString() });
                    }
                    setSales_Root.Items.ToArray();
                    foreach (DataRow DR in DS_SET_SALES.Tables[1].Rows)
                    {
                        setSales_Root.Transactions.Add(new Transactions { ItemCode = DR["ITEM_CODE"].ToString(), ItemID = DR["ITEM_ID"].ToString(), ItemName = DR["ITEM_NAME"].ToString(), PriceTotalWithVAT = Convert.ToDecimal(DR["PRICEWITHVAT"]), PriceTotalWithoutVAT = Convert.ToDecimal(DR["PRICEWITHOUTVAT"]), DateUTC = Convert.ToDateTime(DR["DATEUTC"].ToString()).ToString("yyyy/MM/dd hh:mm:ss"), Quantity = Convert.ToDecimal(DR["QUANTITY"]) });
                        TotalPriceWithVAT += Convert.ToDecimal(DR["PRICEWITHVAT"]);
                        TotalPriceWithoutVAT += Convert.ToDecimal(DR["PRICEWITHOUTVAT"]);
                    }
                    setSales_Root.Transactions.ToArray();
                    setSales_Root.TotalPriceWithVAT = TotalPriceWithVAT;
                    setSales_Root.TotalPriceWithoutVAT = TotalPriceWithoutVAT;
                    setSales_Root.BuyerGuid = BuyerList["URL_PARAMETERS"].ToString();

                    string Json = JsonConvert.SerializeObject(setSales_Root);
                    set_Sales_Result = Post_SetSalesItem_API(Json, CASHUP_MAIN_ID);
                    if (set_Sales_Result.IsSuccess == true && set_Sales_Result.ErrorCode == null)
                    {
                        MM_Cashup_Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                        MM_Cashup_Obj.CashupModelObj.INTEGRATION_STATUS = 2;
                        MM_Cashup_Obj.CashupModelObj.ERROR_MESSAGE = "";
                        MM_Cashup_Obj.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
                    }
                    else
                    {
                        MM_Cashup_Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                        MM_Cashup_Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                        MM_Cashup_Obj.CashupModelObj.ERROR_MESSAGE = set_Sales_Result.ErrorMessage;
                        MM_Cashup_Obj.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
                    }
                }
                else
                {
                    MM_Cashup_Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                    MM_Cashup_Obj.CashupModelObj.INTEGRATION_STATUS = 4;
                    MM_Cashup_Obj.CashupModelObj.ERROR_MESSAGE = "";
                    MM_Cashup_Obj.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
                }
            }
            catch (Exception ex)
            {
                MM_Cashup_Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
                MM_Cashup_Obj.CashupModelObj.INTEGRATION_STATUS = 3;
                MM_Cashup_Obj.CashupModelObj.ERROR_MESSAGE = "function SetSalesItem()  " + ex.ToString();
                MM_Cashup_Obj.UPD_CASHUP_MAIN_FOR_OUTBOUND_INTEGRATION();
            }

        }

        public Set_Sales_Result Post_SetSalesItem_API(string JSON_DATA, decimal CASHUP_MAIN_ID)
        {
            Set_Sales_Result response = new Set_Sales_Result();
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            var client = new CustomWebClient();
            //client.Timeout = 120000;
            client.Headers.Add(RequestConstants.UserAgent, RequestConstants.UserAgentValue);
            client.Headers.Add("AUTH_TOKEN", MM_Token.Token);
            client.Headers.Add("Content-Type", "application/json");
            if (JSON_DATA.Length > 0)
            {
                try
                {
                    response = JsonConvert.DeserializeObject<Set_Sales_Result>(client.UploadString(ConfigurationManager.AppSettings["SetSales"].ToString(), "post", JSON_DATA));
                }
                catch (Exception ex)
                {
                    response.ErrorMessage = "function Post_SetSalesItem_API()  "+ex.ToString();
                }

            }
            return response;
        }

    }
    public class MM_Token
    {
        public string Token { get; set; }
        public string ExpireDateUTC { get; set; }
        public bool IsSuccess { get; set; }
        public object ErrorMessage { get; set; }
        public object ErrorCode { get; set; }
        public string RequestID { get; set; }
    }
    #region -- Class for Set Sales
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);
    public class Items
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string ID { get; set; }
        public decimal PriceWithVAT { get; set; }
        public decimal PriceWithoutVAT { get; set; }
        public string SKU { get; set; }
        public string Category { get; set; }
    }

    public class SetSales_Root
    {
        public string UniqueID { get; set; }
        public string FromDateUTC { get; set; }
        public string ToDateUTC { get; set; }
        public decimal TotalPriceWithVAT { get; set; }
        public decimal TotalPriceWithoutVAT { get; set; }
        public List<Items> Items { get; set; }
        public List<Transactions> Transactions { get; set; }
        public string BuyerGuid { get; set; }
    }

    public class Transactions
    {
        public string ItemCode { get; set; }
        public string ItemID { get; set; }
        public string ItemName { get; set; }
        public decimal PriceTotalWithVAT { get; set; }
        public decimal PriceTotalWithoutVAT { get; set; }
        public string DateUTC { get; set; }
        public decimal Quantity { get; set; }
    }
    public class Set_Sales_Result
    {
        public bool IsSuccess { get; set; }
        public string ErrorMessage { get; set; }
        public object ErrorCode { get; set; }
        public string RequestID { get; set; }
    }


    #endregion

    public class CustomWebClient : WebClient
    {
        public int Timeout { get; set; }
        protected override WebRequest GetWebRequest(Uri uri)
        {
            WebRequest WebRequest = base.GetWebRequest(uri);
            WebRequest.Timeout = 120000;
            return WebRequest;
        }
    }
}
