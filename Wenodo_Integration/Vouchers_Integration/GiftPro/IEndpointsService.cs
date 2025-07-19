using Vouchers_Integration.GIFTPRO.Models;
using System.Collections.Generic;

namespace Vouchers_Integration.GIFTPRO
{
    public interface IEndpointsService
    {
        List<Order> GetOrders();

        OrderDetails GetOrderDetails(int? orderID);

        List<Voucher> GetVouchers();

        VoucherDetails GetVoucherDetails(int? voucherID);
    }
}