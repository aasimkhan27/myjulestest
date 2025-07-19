namespace Vouchers_Integration
{
    public enum VoucherIntegrationEventType
    {
        Information = 2210,
        Error = 2211,
        Warning = 2212,
        Unknown = 2219
    }
    public enum VoucherIntegrationSource
    {
        RUNTIME = -1,
        GIFTPRO = 28
    }
}