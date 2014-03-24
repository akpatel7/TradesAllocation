using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BCAResearch;

namespace ODataBreezejsSample.Controllers
{
    public class HomeController : Controller
    {
        private float GetInternetExplorerVersion()
        {
            float rv = -1;
            var browser = HttpContext.Request.Browser;
            if (browser.Browser == "IE")
                rv = (float)(browser.MajorVersion + browser.MinorVersion);
            return rv;
        }

        public ActionResult Index()
        {
            double ver = GetInternetExplorerVersion();
            var browser = "";
            if (ver > 0.0)
            {
                if (ver <= 8.0)
                    browser = "ie8";
            }

            ViewBag.BrowserVersion = browser;
            return View();
        }


        public ActionResult Logout()
        {
            return this.DoLogout();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Some page in your MVC app.";

            return View();
        }
        public ActionResult Bowa()
        {
            ViewBag.Message = "The BOWA Sample.";

            return View();
        }
        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page";

            return View();
        }

        public ActionResult SimpleTreeGrid()
        {
            ViewBag.Message = "Some page in your MVC app.";

            return View();
        }
    }
}