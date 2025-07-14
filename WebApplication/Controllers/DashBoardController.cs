using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class DashBoardController : Controller
    {
        // GET: DashBoard
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult HrIndex()
        {
            return View();
        }
        public ActionResult MasterDashboard()
        {
            return View();
        }
        public ActionResult DashboardIndex()
        {
            return View();
        }
        public ActionResult PowerInsightIndex()
        {
            return View();
        }
        public ActionResult test()
        {
            return View();
        }
    }
}