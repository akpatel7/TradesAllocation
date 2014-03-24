using System.Configuration;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Threading;

namespace TradesAllocationApp
{
    public static class HtmlHelperExtensions
    {
        public static MvcHtmlString RequireJs(this HtmlHelper helper, string file)
        {
            var require = new StringBuilder();
            bool bundlingEnabled;
            bool.TryParse(ConfigurationManager.AppSettings["BundlingEnabled"], out bundlingEnabled);
            string folder = bundlingEnabled ? "Scripts-build/" : "Scripts/";

            require.AppendLine(string.Format("<script src=\"/{0}lib/requirejs/require.js\" data-main=\"/{0}{1}\"></script>", folder, file));
            return new MvcHtmlString(require.ToString());
        }

        public static IHtmlString MetaAcceptLanguage<t>(this HtmlHelper<t> html)
        {
            var acceptLanguage = HttpUtility.HtmlAttributeEncode(Thread.CurrentThread.CurrentUICulture.ToString());
            return new HtmlString(string.Format(@"<meta name=""accept-language"" content=""{0}"">", acceptLanguage));
        }
    }
}