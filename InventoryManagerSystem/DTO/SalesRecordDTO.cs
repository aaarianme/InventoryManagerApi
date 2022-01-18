using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.DTO
{
    public class SalesRecordDTO
    {
        public int SalesId { get; set; }
        public string Record { get; set; }
        public string Date { get; set; }
        public double? Cost { get; set; }
        public double? SoldPrice { get; set; }
        public SublistingDTO Sublisting { get; set; }
        public ListingDTO Listing { get; set; }
        public string Notes { get; set; }
    }
}
