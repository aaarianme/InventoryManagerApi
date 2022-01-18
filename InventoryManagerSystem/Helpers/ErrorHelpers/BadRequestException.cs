using System;

namespace InventoryManagerSystem.Helpers.ErrorHelper
{
    public class BadRequestException : Exception, IServicesException
    {
        public int StatusCode { get; set; }
        /// <summary>
        /// Status=400
        /// </summary>
        public BadRequestException() : base("Bad Request")
        {
            StatusCode = 400;
        }
        /// <summary>
        /// Status:400
        /// </summary>
        /// <param name="message"></param>
        public BadRequestException(string message) : base(message)
        {
            StatusCode = 400;
        }
    }
}
