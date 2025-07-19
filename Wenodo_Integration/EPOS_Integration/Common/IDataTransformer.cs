using App_Repository;

namespace EPOS_Integration.Common
{
    public interface IDataTransformer
    {
        void Transform(System.Data.DataTable integrationData, object data, decimal cashupMainId, Cashup cashup);
    }
}
