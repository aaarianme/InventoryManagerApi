using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.DTO
{
    public class ProductDTO
    {
        public int Id { get; set; }
        public string WebCode { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public BrandDTO Brand { get; set; }
        public string Color { get; set; }
        public double? RetailPrice { get; set; }
        public string Notes { get; set; }
        public string DateModified { get;  set; }
        public string DateAdded { get;  set; }
    }
}
