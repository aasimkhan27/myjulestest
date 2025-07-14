using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class SchedulerController : Controller
    {
        // GET: Scheduler
        public ActionResult IndexScheduler()
        {
            return View();
        }
        public ActionResult Index()
        {
            return View();
        }
    }
}