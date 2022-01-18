using System.Collections.Generic;

namespace InventoryManagerSystem.DTO
{
    public class ListingDTO
    {
        public int? ListingId { get; set; }
        public ProductDTO Product { get; set; }
        public int Quantity { get; set; }
        public string Size { get; set; }
        public double? Cost { get; set; }
        public string Status { get; set; }
        public string DatePurchased { get; set; }
        public string DateAdded { get; set; }
        public string Notes { get; set; }
        public string Deadline { get; set; }
        public int? DaysLeftToDeadline { get; set; }
        public IEnumerable<SublistingDTO> Sublistings { get; set; }

    }
}
