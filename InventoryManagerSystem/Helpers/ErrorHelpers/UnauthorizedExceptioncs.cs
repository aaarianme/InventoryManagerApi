using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.ErrorHelper
{
    public class UnauthorizedExceptioncs : Exception, IServicesException
    {
        public int StatusCode { get; set; }
        public UnauthorizedExceptioncs():base("Unauthorized")
        {
            StatusCode = 401;
        }
        public UnauthorizedExceptioncs(string message):base(message)
        {
            StatusCode = 401;

        }
    }
}
