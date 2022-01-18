using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Models
{
    public class Product:IProduct
    {
        public int Id { get; set; }
        public string WebCode { get; set; }
        public string SKU { get; set; }
        public string Name { get; set; }
        public string Image { get; set; }
        public IBrand Brand { get; set; }
        public string Color { get; set; }
        public double RetailPrice { get; set; }
        public string Notes { get; set; }
        public DateTime DateModified { get; set; }
        public DateTime DateAdded { get; set; }

    }
}
