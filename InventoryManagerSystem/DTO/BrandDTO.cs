using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.DTO
{
    public class BrandDTO
    {
        public BrandDTO(int? brandId, string name)
        {
            BrandId = brandId;
            Name = name;
        }

        public int? BrandId { get; }
        public string Name { get; set; }
    }
}
