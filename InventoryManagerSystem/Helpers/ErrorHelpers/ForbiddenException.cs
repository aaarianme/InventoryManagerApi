using InventoryManagerSystem.Helpers.ErrorHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ByeBugInventoryManagerSystem_API.Helpers.ErrorHelper
{
    public class ForbiddenException : Exception, IServicesException
    {
        public int StatusCode { get; private set; }
        /// <summary>
        /// status:403
        /// </summary>
        public ForbiddenException():base("Server refused to give you access.")
        {
            StatusCode = 403;
        }
        /// <summary>
        /// status:403
        /// </summary>
        public ForbiddenException(string message):base(message)
        {
            StatusCode = 403;
        }

    }
}
