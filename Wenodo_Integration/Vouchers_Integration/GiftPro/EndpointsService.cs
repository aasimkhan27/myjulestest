using Newtonsoft.Json;
using RestSharp;
using System;
using System.Linq;
using Vouchers_Integration.GIFTPRO.Models;
using System.Collections.Generic;

namespace Vouchers_Integration.GIFTPRO
{
    public class EndpointsService : IEndpointsService
    {
        GiftPro _giftPro = GiftPro.Instance;
        public List<Order> GetOrders()
        {
            IRestResponse _response = _giftPro.GetEndpointResponse("/orders/");
            return JsonConvert.DeserializeObject<List<Order>>(_response.Content);
        }

        public OrderDetails GetOrderDetails(int? orderID)
        {
            IRestResponse _response = _giftPro.GetEndpointResponse("/orders/"+Convert.ToString(orderID)+"/rows/");
            return JsonConvert.DeserializeObject<Dictionary<string, OrderDetails>>(_response.Content).FirstOrDefault().Value;
        }

        public List<Voucher> GetVouchers()
        {
            IRestResponse _response = _giftPro.GetEndpointResponse("/vouchers/");
            return JsonConvert.DeserializeObject<List<Voucher>>(_response.Content);
        }

        public VoucherDetails GetVoucherDetails(int? voucherID)
        {
            IRestResponse _response = _giftPro.GetEndpointResponse("/vouchers/"+Convert.ToString(voucherID) +"/");
            return JsonConvert.DeserializeObject<VoucherDetails>(_response.Content);
        }
    }
}