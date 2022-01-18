using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.ErrorHelper
{
    /// <summary>
    /// An IServicesException Class for NotFound 404 result
    /// </summary>
    public class NotFoundException : Exception , IServicesException
    {
        public int StatusCode { get; set; }
        /// <summary>
        /// Status:404
        /// </summary>
        public NotFoundException():base("Not Found")
        {
            StatusCode = 404;
        }
        /// <summary>
        /// Status:404
        /// </summary>
        /// <param name="message">Any Message For the User will be here</param>
        public NotFoundException(string message) : base(message)
        {
            StatusCode = 404;
        }

    }
}
