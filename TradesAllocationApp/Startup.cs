using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TradesAllocationApp.Startup))]
namespace TradesAllocationApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
