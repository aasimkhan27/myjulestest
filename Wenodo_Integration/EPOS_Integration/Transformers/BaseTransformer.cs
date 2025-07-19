using System;
using System.Data;

namespace EPOS_Integration.Transformers
{
    public abstract class BaseTransformer
    {
        protected virtual DataTable FillHeader(object data, Cashup cashup)
        {
            throw new NotImplementedException();
        }

        protected virtual DataTable FillLines(object data, decimal headerId, Cashup cashup)
        {
            throw new NotImplementedException();
        }

        protected virtual DataTable FillPayments(object data, decimal headerId, Cashup cashup)
        {
            throw new NotImplementedException();
        }

        protected virtual DataTable FillDiscounts(object data, decimal headerId, Cashup cashup)
        {
            throw new NotImplementedException();
        }
    }
}
