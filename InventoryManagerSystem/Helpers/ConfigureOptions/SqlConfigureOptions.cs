using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers.ConfigureOptions
{
    public class SqlConfigureOptions
    {
        public string SqlConnectionString { get; set; }
    }
}
