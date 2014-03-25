using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AllocationsCRUD.Startup))]
namespace AllocationsCRUD
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
