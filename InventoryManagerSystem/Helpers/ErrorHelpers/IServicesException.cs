using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.ErrorHelper
{
    interface IServicesException
    {
        public int StatusCode { get; }
    }
}
