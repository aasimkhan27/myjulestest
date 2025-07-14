using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class CashupController : Controller
    {
        // GET: Cashup
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult CashupIndex()
        {
            return View();
        }
        public ActionResult CashupAppIndex()
        {
            return View();
        }
    }
}