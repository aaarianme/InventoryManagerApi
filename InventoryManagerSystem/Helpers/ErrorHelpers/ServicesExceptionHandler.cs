using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.ErrorHelper
{
    /// <summary>
    /// Handles All IServicesException classes
    /// </summary>
    public class ServicesExceptionHandler : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            if(context.Exception is IServicesException servicesException)
            {
                switch(servicesException.StatusCode)
                {
                    case (404):
                        context.HttpContext.Response.StatusCode = 404;
                        context.Result = new NotFoundObjectResult(new { message=context.Exception.Message });
                        break;
                    case (400):
                        context.Result = new BadRequestObjectResult(new { message = context.Exception.Message });
                        break;
                    case (403):
                        context.HttpContext.Response.StatusCode = 403;
                        context.Result = new ObjectResult(new { message=context.Exception.Message});
                        break;
                    case (401):
                        context.Result = new UnauthorizedObjectResult(new { message = context.Exception.Message });
                        break;
                    default:
                        context.HttpContext.Response.StatusCode = 500;
                        context.Result = new ObjectResult(new { message = context.Exception.Message });
                        break;


                }
                context.ExceptionHandled = true;
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}
