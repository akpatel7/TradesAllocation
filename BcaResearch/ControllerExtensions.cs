using BCAResearch.Auth;
using System;
using System.Configuration;
using System.Web;
using System.Web.Mvc;

namespace BCAResearch
{
    public static class ControllerExtensions
    {
        public static ActionResult DoLogout(this Controller controller)
        {
            controller.HttpContext.Response.Cookies.Remove("DB");
            controller.HttpContext.Response.Cookies.Add(new HttpCookie("DB") { Expires = DateTime.Now.AddDays(-1D), Domain = ConfigurationManager.AppSettings["CookieDomainName"] });
            controller.HttpContext.Response.Cache.SetCacheability(HttpCacheability.NoCache);
            controller.HttpContext.Response.Cache.SetExpires(DateTime.Now.AddSeconds(-1));
            controller.HttpContext.Response.Cache.SetNoStore();
            controller.HttpContext.Response.AppendHeader("Pragma", "no-cache");

            return new RedirectResult(BcaCms.LoginUrl() + "/logout");
        }
    }
}