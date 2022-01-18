using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Models
{
    public interface IBrand
    {
        public int BrandId { get; }
        public string Name { get; set; }
    }
}
