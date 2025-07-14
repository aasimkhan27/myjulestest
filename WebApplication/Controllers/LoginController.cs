using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
namespace WebApplication.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Under_Maintenance()
        {
            return View();
        }
        // GET: Login
        public ActionResult SetPassword()
        {
            return View();
        }
        public ActionResult EmpInvite()
        {
            return View();
        }
        public ActionResult GetToken()
        {
            return View();
        }
    }
}