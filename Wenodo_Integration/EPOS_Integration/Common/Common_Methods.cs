using App_Repository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ViewModels;

namespace EPOS_Integration.Common
{
   public class Common_Methods
    {
        public static DataTable GetSessions(decimal CASHUP_MAIN_ID, decimal BRANCH_ID)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            Obj.CashupModelObj.BRANCH_ID = BRANCH_ID;
            Obj.CashupModelObj.USER_ID = 1;
            return Obj.GET_SESSION_BY_BRANCH();
        }
        public static DataSet GetCashUpHeaderID(decimal CASHUP_MAIN_ID, decimal SESSION_ID)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            Obj.CashupModelObj.SESSION_ID = SESSION_ID;         
            Obj.CashupModelObj.USER_ID = 1;
            return Obj.GET_CASHUP_BY_ID();
        }
        public static void UPD_CASHUP_MAIN_FOR_INTEGRATION(decimal INTEGRATION_STATUS, decimal CASHUP_MAIN_ID, string EXCEPTION)
        {
            Cashup Obj = new Cashup();
            Obj.CashupModelObj = new CashupModel();
            Obj.CashupModelObj.CASHUP_MAIN_ID = CASHUP_MAIN_ID;
            Obj.CashupModelObj.INTEGRATION_STATUS = INTEGRATION_STATUS;
            Obj.CashupModelObj.ERROR_MESSAGE = EXCEPTION;
            Obj.UPD_CASHUP_MAIN_FOR_INTEGRATION();
        }
    }
}
