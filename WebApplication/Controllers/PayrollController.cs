using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class PayrollController : Controller
    {
        // GET: Payroll
        public ActionResult Index()
        {
            return View();
        }
    }
}