using App_Repository;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using ViewModels;

namespace EPOS_Integration.CURRENCY_CONVERSION
{
    public class CurrencyConversion
    {
        public void GET_CURRENCY_CONVERSION()
        {
            Cashup Cashup_Obj = new Cashup();
            Cashup_Obj.CashupModelObj = new CashupModel();
            foreach (DateTime day in EachDay(Convert.ToDateTime(Convert.ToDateTime(DateTime.Now.AddDays(-7).ToString("yyyy/MM/dd"))), Convert.ToDateTime(Convert.ToDateTime(DateTime.Now.ToString("yyyy/MM/dd")))))
            {
                try
                {
                    var client = new RestSharp.RestClient();
                    var request = new RestSharp.RestRequest("https://v6.exchangerate-api.com/v6/4557ddeb5b1073a7e423388e/history/GBP/" + day.Year + "/" + day.Month + "/" + day.Day, RestSharp.Method.GET);
                    RestSharp.IRestResponse restResponse;
                    restResponse = client.Execute(request);

                    CashupModel.Root_Currency_Conversion root = Newtonsoft.Json.JsonConvert.DeserializeObject<CashupModel.Root_Currency_Conversion>(restResponse.Content);
                    IList<CashupModel.CURRENCY_CONVERSION_TYPE> _currencyConversionList = root.ConversionRates.Select(p => new CashupModel.CURRENCY_CONVERSION_TYPE
                    {
                        CODE = p.Key,
                        RATE = p.Value

                    }).ToList();
                    DataTable DT = Utility.ConvertToDatatable.ToDataTables(_currencyConversionList);
                    Cashup_Obj.CashupModelObj.CASHUP_DATE = Convert.ToDateTime(day);
                    Cashup_Obj.CashupModelObj.DATATABLE_1 = DT;
                    Cashup_Obj.INS_UPD_CURRENCY_CONVERSIONS();
                    LogExceptions.LogInfo("currency conversion executed successfully");
                }
                catch (Exception ex)
                {
                    LogExceptions.LogError("Error in currency conversion", ex);
                }
            }
        }
        public IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}
