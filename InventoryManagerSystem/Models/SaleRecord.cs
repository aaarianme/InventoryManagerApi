using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Models
{
    public class SaleRecord:ISaleRecord
    {
        
        
        public SaleRecord(DateTime? date, double cost, double soldPrice, IListing listing, string notes, ISublisting sublisting, int? saleId = null)
        {
            SaleId = saleId ?? 0;
            Date = date;
            Cost = cost;
            SoldPrice = soldPrice;
            Listing = listing;
            if (SetSublisting(sublisting) == false) throw new NotSupportedException("Unable to contruct the object as it does not provide the correct listing and/or sublisting");
            Notes = notes;
        }
        public SaleRecord()
        {

        }
        public int SaleId { get; set; }
        public DateTime? Date { get; set; }
        public double Cost { get; set; }
        public double SoldPrice { get; set; }
        public IListing Listing { get; set; }
        public ISublisting Sublisting { get; private set; }
        public string Notes { get; set; }

        public bool SetSublisting(ISublisting sublisting)
        {
            if (this.Listing is null || this.Listing.Sublistings is null) return false;
            var _sublisting = this.Listing.Sublistings.Where(x => x.ListingId == sublisting.SublistingId || x.SublistingRef == sublisting.SublistingRef).FirstOrDefault();
            if (_sublisting is null) return false;

            PrivateSetSublisting(_sublisting);
            return true;
        }
        

        private void PrivateSetSublisting(ISublisting sublisting)
        {
            this.Sublisting = sublisting;
            
        }

    }
}
