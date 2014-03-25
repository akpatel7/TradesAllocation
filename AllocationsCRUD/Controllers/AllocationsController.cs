using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.OData;
using AllocationsCRUD.Models;

namespace AllocationsCRUD.Controllers
{
    public class AllocationsController : ApiController
    {
        // GET odata/TodoItems
        public object GetAllocationsTestData()
        {
            StringBuilder sb = new StringBuilder();
            using (StreamReader sr = new StreamReader("\\TestData\\allocationsTest.txt"))
            {
                String line;
                // Read and display lines from the file until the end of 
                // the file is reached.
                while ((line = sr.ReadLine()) != null)
                {
                    sb.AppendLine(line);
                }
            }
            string allines = sb.ToString();

            return allines;
        }
    }
}