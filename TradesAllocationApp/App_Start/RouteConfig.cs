using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace TradesAllocationApp
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.IgnoreRoute("isis/{*pathInfo}");

            routes.MapRoute("Logout", "logout", new { controller = "Home", action = "Logout" });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );

            routes.MapRoute(
              name: "Export",
              url: "Export",
              defaults: new { controller = "Export", action = "Index" }
          );
        }
    }
}
