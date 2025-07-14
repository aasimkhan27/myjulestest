using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication.Controllers
{
    public class MainController : Controller
    {
        // GET: Main
        public ActionResult MainIndex()
        {
            return View();
        }
        public ActionResult Admin()
        {
            if (Request.QueryString.Count > 0)
            {
                if (!string.IsNullOrEmpty(Request.QueryString["code"].ToString()))
                {
                    HttpCookie xero_httpCookie = new HttpCookie("COOKIES_XERO_CODE");
                    xero_httpCookie.Value = Request.QueryString["code"].ToString();
                    xero_httpCookie.Expires = DateTime.Now.AddHours(1);
                    TempData["code"] = Request.QueryString["code"].ToString();
                }
                return Redirect(Convert.ToString(System.Configuration.ConfigurationManager.AppSettings["XERO_REDIRECT_URI"]));
            }
            else
                return View();
        }
        public ActionResult CashupAdmin()
        {
            return View();
        }
        public ActionResult HrAdmin()
        {
            return View();
        }
        public ActionResult AdminIndex()
        {
            return View();
        }
        public ActionResult WefyleAdmin()
        {
            return View();
        }
        
    }
}