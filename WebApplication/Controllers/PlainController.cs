using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class PlainController : Controller
    {
        // GET: Plain
        public ActionResult Index()
        {
            return View();
        }
    }
}