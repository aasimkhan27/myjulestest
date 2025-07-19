using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EPOS_Integration.SIMPHONY
{
    public class SIMPHONY_TABLES
    {
        public DataTable DATATABLE_SIMPHONY_COMMON = null;
        public DataTable DATATABLE_SIMPHONY_LOCATION = null;
        public DataTable DATATABLE_SIMPHONY_1 = null;
        public DataTable DATATABLE_SIMPHONY_2 = null;
        public DataTable DATATABLE_SIMPHONY_3 = null;
        public DataTable DATATABLE_SIMPHONY_4 = null;
        public DataTable DATATABLE_SIMPHONY_5 = null;
        public DataTable DATATABLE_SIMPHONY_6 = null;
        public DataTable DATATABLE_SIMPHONY_7 = null;
        public class MICROS_SIMPHONY_GUEST_CHECKS_TYPE
        {
            public decimal GUEST_CHECK_ID { get; set; }
            public decimal CHK_NUM { get; set; }
            public DateTime? OPN_BUSDT { get; set; }
            public DateTime? OPN_UTC { get; set; }
            public DateTime? OPN_LCL { get; set; }
            public DateTime? CLSD_BUS_DT { get; set; }
            public DateTime? CLSD_UTC { get; set; }
            public DateTime? CLSD_LCL { get; set; }
            public DateTime? LAST_TRANS_UTC { get; set; }
            public DateTime? LAST_TRANS_LCL { get; set; }
            public DateTime? LAST_UPDATED_UTC { get; set; }
            public DateTime? LAST_UPDATED_LCL { get; set; }
            public bool CLSD_FLAG { get; set; }
            public decimal GST_CNT { get; set; }
            public decimal SUB_TTL { get; set; }
            public decimal NON_TXBLSLS_TTL { get; set; }
            public decimal CHK_TTL { get; set; }
            public decimal DSC_TTL { get; set; }
            public decimal PAY_TTL { get; set; }
            public decimal BAL_DUE_TTL { get; set; }
            public decimal RVC_NUM { get; set; }
            public decimal OT_NUM { get; set; }
            public decimal TBL_NUM { get; set; }
            public string TBL_NAME { get; set; }
            public decimal EMP_NUM { get; set; }
            public string XFER_STATUS { get; set; }
            public decimal XFER_TO_CHK_NUM { get; set; }
            public decimal SVC_CHG_TTL { get; set; }
            public decimal TIP_TOTAL { get; set; }
            public string CHK_NAME { get; set; }
            public string CHK_REF { get; set; }
            public bool CANCEL_FLAG { get; set; }
            public decimal SPLT_FRM_CHK { get; set; }
        }
        public class MICROS_SIMPHONY_GUEST_CHECKS_DETAIL_LINE_TYPE
        {
            public decimal GUEST_CHECK_LINE_ITEM_ID { get; set; }
            public decimal DTLOT_NUM { get; set; }
            public decimal LINE_NUM { get; set; }
            public decimal DTL_ID { get; set; }
            public DateTime? DETAIL_UTC { get; set; }
            public DateTime? DETAIL_LCL { get; set; }
            public DateTime? LAST_UPDATE_UTC { get; set; }
            public DateTime? LAST_UPDATE_LCL { get; set; }
            public DateTime? BUS_DT { get; set; }
            public decimal WS_NUM { get; set; }
            public decimal DSP_TTL { get; set; }
            public decimal DSP_QTY { get; set; }
            public decimal AGG_TTL { get; set; }
            public decimal AGG_QTY { get; set; }
            public decimal CHK_EMP_ID { get; set; }
            public decimal CHK_EMP_NUM { get; set; }
            public decimal SVC_RND_NUM { get; set; }
            public decimal PAR_DTL_ID { get; set; }
            public decimal TRANS_EMP_ID { get; set; }
            public decimal TRANS_EMP_NUM { get; set; }
            public string REF_INF_O1 { get; set; }
            public bool DO_NOT_SHOW_FLAG { get; set; }
            public bool ERRCOR_FLAG { get; set; }
            public decimal MGR_EMP_ID { get; set; }
            public decimal MGR_EMP_NUM { get; set; }
            public bool VD_FLAG { get; set; }
            public decimal RSN_CODE_NUM { get; set; }
            public int? MENU_ITEM_MI_NUM { get; set; }
            public string MENU_ITEM_ACTIVE_TAXES { get; set; }
            public int? MENU_ITEM_PRC_LVL { get; set; }
            public decimal? TENDER_MEDIA_TMED_NUM { get; set; }
            public decimal? OTHER_DETAIL_TYPE { get; set; }
            public decimal? OTHER_DETAIL_NUM { get; set; }
            public decimal? SERVICE_CHARGE_SVC_CHG_NUM { get; set; }
            public decimal? DISCOUNT_DSC_NUM { get; set; }
            public decimal? DISCOUNT_DSC_MI_NUM { get; set; }
            public string DISCOUNT_ACTIVE_TAXES { get; set; }
            public decimal? ERROR_CORRECT_TYPE { get; set; }
            public decimal? ERROR_CORRECT_OBJECT_NUM { get; set; }
            public decimal? REF_GUEST_CHECK_ID { get; set; }

        }
        public class MICROS_SIMPHONY_GUEST_CHECKS_TAXES_TYPE
        {
            public decimal TAX_NUM { get; set; }
            public decimal TX_BLSLS_TTL { get; set; }
            public decimal TAX_COLL_TTL { get; set; }
            public decimal TAX_RATE { get; set; }
            public decimal TYPE { get; set; }
            public decimal REF_GUEST_CHECK_ID { get; set; }
        }
        public class MICROS_SIMPHONY_ORDER_TYPE
        {
            public int ORDER_TYPE_ORDER_NUMBER { get; set; }
            public string ORDER_NAME { get; set; }
        }
        public class MICROS_SIMPHONY_REASON_CODE_TYPE
        {
            public decimal REASON_CODE_NUMBER { get; set; }
            public string REASON_CODE_NAME { get; set; }
        }
        public class MICROS_SIMPHONY_REVENUE_CENTER_TYPE
        {
            public int REVENUE_CENTER_NUMBER { get; set; }
            public string REVENUE_CENTER_NAME { get; set; }
        }
        public class MICROS_SIMPHONY_SERVICE_CHARGE_TYPE
        {
            public int SERVICE_CHARGE_NUMBER { get; set; }
            public string SERVICE_CHARGE_NAME { get; set; }
            public decimal? SERVICE_CHARGE_POS_PERCENT { get; set; }
            public bool SERVICE_CHARGE_TIPS_FLAG { get; set; }
            public bool SERVICE_CHARGE_REV_FLAG { get; set; }
        }
        public class MICROS_SIMPHONY_TAXES_TYPE
        {
            public int TAXES_NUMBER { get; set; }
            public string TAXES_NAME { get; set; }
            public int TAXES_TYPE { get; set; }
            public decimal TAXES_TAX_RATE { get; set; }
        }
        public class MICROS_SIMPHONY_TENDER_MEDIA_TYPE
        {
            public decimal TENDER_MEDIA_NUMBER { get; set; }
            public string TENDER_MEDIA_NAME { get; set; }
            public int TENDER_MEDIA_TYPE { get; set; }
        }
        public class MICROS_SIMPHONY_MENU_ITEM_TYPE
        {
            public decimal MENU_ITEM_NUMBER { get; set; }
            public string MENU_ITEM_NAME { get; set; }
            public string MENU_ITEM_NAME_2 { get; set; }
            public int MENU_ITEM_MAJ_GRP_NUM { get; set; }
            public string MENU_ITEM_MAJ_GRP_NAME { get; set; }
            public int MENU_ITEM_FAM_GRP_NUM { get; set; }
            public string MENU_ITEM_FAM_GRP_NAME { get; set; }
        }
        public class MICROS_SIMPHONY_EMPLOYEES_TYPE
        {
            public int NUM { get; set; }
            public decimal EMPLOYEE_ID { get; set; }
            public string FIRST_NAME { get; set; }
            public string LAST_NAME { get; set; }
            public string PAYROLL_ID { get; set; }
            public string HOME_LOC_REF { get; set; }
            public int CLASS_NUM { get; set; }
            public string CLASS_NAME { get; set; }
        }
        public class MICROS_SIMPHONY_DISCOUNTS_TYPE
        {
            public int NUM { get; set; }
            public string NAME { get; set; }
            public decimal POS_PERCENT { get; set; }
        }
    }
}
