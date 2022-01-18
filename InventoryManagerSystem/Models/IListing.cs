using InventoryManagerSystem.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Models
{
    public interface IListing
    {
        public int Id { get; set; }
        public IProduct Product { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
        public double Cost { get; set; }
        public DateTime DatePurchased { get; set; }
        public DateTime? DateAdded { get; set; }
        public string Notes { get; set; }
        public DateTime? Deadline { get; set; }
        public List<ISublisting> Sublistings { get; set; }







    }
}
