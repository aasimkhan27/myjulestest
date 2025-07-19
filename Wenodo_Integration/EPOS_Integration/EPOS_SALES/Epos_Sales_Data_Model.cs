using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.EPOS_SALES
{
    class Epos_Sales_Data_Model
    {
        public class EPOS_SALES_HEADER_TYPE
        {
            public string CHECK_ID { get; set; }
            public string CHECK_NO { get; set; }
            public DateTime OPEN_TIME { get; set; }
            public DateTime CLOSE_TIME { get; set; }
            public decimal COVERS { get; set; }
            public string REVENUE_CENTRE_CODE { get; set; }
            public string REVENUE_CENTRE_DESC { get; set; }
            public string SERVE_MODE { get; set; }
            public decimal NET { get; set; }
            public decimal TAX { get; set; }
            public decimal GROSS { get; set; }
            public decimal DISCOUNT { get; set; }
            public decimal COMP { get; set; }
            public decimal VOID { get; set; }
            public decimal TIPS { get; set; }    
            public decimal SERVICE_CHARGE { get; set; }    
            public decimal DONATION { get; set; }    
            public string CURRENCY { get; set; }    
            public bool IS_TRAINING { get; set; }    
            public int INTEGRATION_SYSTEM_ID { get; set; }    
            public string STAFF_ID { get; set; }    
            public string STAFF_NAME { get; set; }           
        }
        public class EPOS_SALES_LINES_TYPE
        {
            public string CHECK_ID { get; set; }
            public string REVENUE_CENTER_ID { get; set; }
            public string REVENUE_CENTER { get; set; }
            public string ACCOUNT_GROUP_ID { get; set; }
            public string ACCOUNT_GROUP_CODE { get; set; }
            public string ACCOUNT_GROUP_NAME { get; set; }
            
            public string CATEGORY_ID { get; set; }
            public string CATEGORY_CODE { get; set; }
            public string CATEGORY_NAME { get; set; }
            public string PRODUCT_SKU { get; set; }
            public string PRODUCT_NAME { get; set; }
            public decimal QUANITY { get; set; }
            public decimal NET { get; set; }
            public decimal TAX { get; set; }
            public decimal GROSS { get; set; }
            public decimal DISCOUNT { get; set; }
            public decimal COMP { get; set; }
            public decimal VOID { get; set; }
            public DateTime TIME_OF_SALE { get; set; }
            public string STAFF_ID { get; set; }
            public string STAFF_NAME { get; set; }
            public string VOID_ID { get; set; }
            public string VOID_REASON { get; set; }
            public string DISCOUNT_ID { get; set; }
            public string DISCOUNT_REASON { get; set; }
            public decimal DISCOUNT_RATE { get; set; }
            public decimal TAX_RATE { get; set; }
        }
        public class EPOS_SALES_PAYMENTS_TYPE
        {
            public string CHECK_ID { get; set; }
            public string PAYMENT_METHOD_ID { get; set; }
            public string PAYMENT_METHOD_CODE { get; set; }
            public string PAYMENT_METHOD_DESC { get; set; }
            public decimal TOTAL_AMOUNT_WITH_TIPS { get; set; }
            public decimal TIPS { get; set; }

        }
    }
}
