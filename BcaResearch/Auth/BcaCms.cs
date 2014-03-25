using System;
using System.Collections.Specialized;
using System.Configuration;
using System.Web;

namespace BCAResearch.Auth
{
    public class BcaCms
    {
        public static string LoginUrl(Uri returnUrl = null)
        {
            string path = "dashboard_auth" + (returnUrl == null ? "" : "?returnURL=" + HttpUtility.UrlEncode(returnUrl.AbsoluteUri));
            return ConfigurationManager.AppSettings["BcaDomain"] + path;
        }

        public static string ForbiddenUrl(Uri returnUrl = null)
        {
            var queryString = HttpUtility.ParseQueryString("forbidden=true");
            if (returnUrl != null)
            {
                queryString.Add("returnURL", HttpUtility.UrlEncode(returnUrl.AbsoluteUri));
            }

            return ConfigurationManager.AppSettings["BcaDomain"] + "dashboard_auth?" + queryString;
        }
    }
}