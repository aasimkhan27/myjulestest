using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HR_Integration.S4Labour
{
    public class TABLE_TYPE
    {
        public DataTable DATATABLE_COMMON = null;
        public DataTable DATATABLE_1 = null;
        public DataTable DATATABLE_2 = null;
        public DataTable DATATABLE_3 = null;
        public DataTable DATATABLE_4 = null;
        public DataTable DATATABLE_5 = null;
        public DataTable DATATABLE_6 = null;
        public DataTable DATATABLE_7 = null;
        public class S4_MARITALSTATUS
        {
            public int MARITAL_STATUS_ID { get; set; }
            public string STATUS_NAME { get; set; }
        }
    }
}
