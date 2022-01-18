using InventoryManagerSystem.DTO;
using InventoryManagerSystem.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace InventoryManagerSystem.Helpers
{
    public static class ClassFactory
    {
        public static async Task<ISaleRecord> ConvertToSaleRecordObject(SalesRecordDTO saleRecDTO)
        {
            if (saleRecDTO.Sublisting == null) return null;
            return new SaleRecord(DateTime.Parse(saleRecDTO.Date), (double)saleRecDTO.Cost, (double)saleRecDTO.SoldPrice, await ConvertToListingObject(saleRecDTO.Listing), saleRecDTO.Notes, await ConvertToSublistingObject(saleRecDTO.Sublisting));
        }
        public static async Task<IListing> ConvertToListingObject(ListingDTO listingdto)
        {
            return new Listing()
            {
                Cost = (double)listingdto.Cost,
                DateAdded = DateTime.TryParse(listingdto.DateAdded, out DateTime _dateAdded) == true ? _dateAdded : null,
                DatePurchased = DateTime.TryParse(listingdto.DatePurchased, out DateTime _datePurchased) == true ? _datePurchased : DateTime.Now,
                Deadline = DateTime.TryParse(listingdto.Deadline, out DateTime _deadline) == true ? _deadline : null,
                Id = (int)listingdto.ListingId,
                Notes = listingdto.Notes,
                Quantity = listingdto.Quantity,
                Product = await ConvertToProductObject(listingdto.Product),
                Size = listingdto.Size,
                Sublistings = await ConvertToMultiSublistingObjects(listingdto.Sublistings)
            };
        }
        public static async Task<IProduct> ConvertToProductObject(ProductDTO productdto)
        {
            return new Product()
            {
                Id = (int)productdto.Id,
                Color = productdto.Color,
                Image = productdto.Image,
                SKU = productdto.SKU,
                DateAdded = DateTime.TryParse(productdto.DateAdded, out DateTime _dateAdded) == true ? _dateAdded : DateTime.Now,
                DateModified = DateTime.TryParse(productdto.DateModified, out DateTime _dateModified) == true ? _dateAdded : DateTime.Now,
                Name = productdto.Name,
                Notes = productdto.Notes,
                RetailPrice = (double)productdto.RetailPrice,
                WebCode = productdto.WebCode,
                Brand = await ConvertToBrandObject(productdto.Brand)
            };
        }
        public static async Task<IBrand> ConvertToBrandObject(BrandDTO branddto)
        {
            return new Brand((int)branddto.BrandId, branddto.Name);

        }
        public static async Task<ISublisting> ConvertToSublistingObject(SublistingDTO sublistingdto)
        {
            return new Sublisting()
            {
                ListingId = (int)sublistingdto.ListingId,
                SalesRecord = sublistingdto.SalesRecord,
                Status = EnumHelper.TryParseFromDisplayName(sublistingdto.Status, out SubListingStatus _status) == true ? _status : throw new NotSupportedException("Converting from dto to object failed because status was not recognized"),
                SublistingRef = sublistingdto.SublistingRef,
                SublistingId = (int)sublistingdto.SublistingId
            };
        }
        public static async Task<List<ISublisting>> ConvertToMultiSublistingObjects(IEnumerable<SublistingDTO> sublistingdtos)
        {
            List<ISublisting> res = new List<ISublisting>();
            foreach (SublistingDTO subldto in sublistingdtos)
            {
                res.Add(await ConvertToSublistingObject(subldto) as Sublisting);
            }
            return res;
        }

    }
}
