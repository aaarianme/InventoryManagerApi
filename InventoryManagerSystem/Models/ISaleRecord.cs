using System;

namespace InventoryManagerSystem.Models
{
    public interface ISaleRecord
    {
        public int SaleId { get; set; }
        public DateTime? Date { get; set; }
        public double Cost { get; set; }
        public double SoldPrice { get; set; }
        public IListing Listing { get; set; }
        public ISublisting Sublisting { get; }
        public string Notes { get; set; }

        


    }
}
