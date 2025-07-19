using log4net;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Utility
{
    public class LogExceptions
    {
        private static readonly ILog log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        public static void LogInfo(string Message)
        {
            StackTrace stackTrace = new StackTrace();
            MethodBase methodBase = stackTrace.GetFrame(1).GetMethod();
            log.Info("Method Name:- " + methodBase.Name + ". Info: " + Message);
        }
        public static void LogError(string Message, Exception ex)
        {
            StackTrace stackTrace = new StackTrace();
            MethodBase methodBase = stackTrace.GetFrame(1).GetMethod();
            log.Error("Method Name:- " + methodBase.Name + ". Error: " + Message, ex);
        }
    }
}
