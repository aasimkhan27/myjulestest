using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class HrController : Controller
    {
        // GET: Hr
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Team()
        {
            return View();
        }
        public ActionResult position()
        {
            return View();
        }
        public ActionResult HRIndex()
        {
            return View();
        }
        public ActionResult HRM_O_Index()
        {
            return View();
        }
    }
}